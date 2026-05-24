import { config } from '@/config.server'
import { getKnexInstance } from '@/utils/mysql'
import axios from 'axios'
import { differenceInYears } from 'date-fns'
import cron from 'node-cron'

class WebEngageService {
  private leadData: any[] = []
  private currentIndex = 0
  private chunkSize = 25
  private recordsPerBatch = 25
  private totalProcessed = 0
  private cronTask: any
  get Knex() {
    let db = getKnexInstance()
    return db
  }
  constructor() {
    this.sendBulkUsers()
  }

  private sendBulkUsers = async () => {
    try {
      await this.fetchNextChunk()
      //this.cronTask = cron.schedule('*/5 * * * * *', this.processBatch)
      if (config.webengage === true) {
        this.cronTask = cron.schedule('*/5 * * * * *', this.processBatch);
        console.log('Cron job scheduled');
      } else {
        console.log('Cron job not scheduled: config.webengage is not set to true');
      }
    } catch (error) {
      console.error('Error in sendBulkUsers:', error.message)
    }
  }
  private processBatch = async () => {
    try {
      console.log("leadData length",this.leadData.length,this.currentIndex)
      if (this.currentIndex >= this.leadData.length) {
        await this.fetchNextChunk()

        if (this.leadData.length === 0) {
          console.log('No more users to process. Stopping cron job.')
          this.cronTask.stop()
          return
        }
      }
      const WEBENGAGE_URL = `${config.webengageHost}/v1/accounts/${config.webengageLicenseCode}/bulk-users`

      const response = await axios.post(
        WEBENGAGE_URL,
        { users: this.leadData },
        {
          headers: {
            Authorization: `Bearer ${config.webengageApiKey}`,
            'Content-Type': 'application/json',
          },
        },
      )
      const leadIDs = await this.fetchNextChunk(true);

      if (
        response.data.response &&
        response.data.response.status === 'queued'
      ) {
        console.log("webengage status before inserting",response?.data?.response?.status)
        await this.insertIntoWebEngageTable(leadIDs)
      }
      // Update indices for the next batch
       this.currentIndex += this.recordsPerBatch
       this.totalProcessed += this.recordsPerBatch
    } catch (error) {
      console.error('Error sending batch to WebEngage:', error)
    }
  }
  private insertIntoWebEngageTable = async (usersBatch: any[]) => {
    let db = getKnexInstance()
    try {
      for (const customerID of usersBatch) {
        await db('web_engage').insert({
          customerID: customerID,
        })
      }
      console.log('Lead IDs inserted into webengage table one by one')
    } catch (error) {
      console.error(
        'Error inserting lead IDs into webengage table:',
        error.message,
      )
    }
  }
  private fetchNextChunk = async (returnLeadIDs = false): Promise<any[]> => {
    try {
      let db = getKnexInstance()

      const twoMonthsAgo = new Date()
      twoMonthsAgo.setMonth(twoMonthsAgo.getMonth() - 2)
      console.log('Fetching records with totalProcessed:', this.totalProcessed)

      const leads = await db('leads')
        .where('leads.createdDate', '>=', twoMonthsAgo)
        .andWhere(function () {
          this.where('leads.status', 'Fresh Lead')
            .orWhere('leads.status', 'Approved Process')
        })
        .join('customer', 'leads.customerID', 'customer.customerID')
        .join('employer', 'customer.customerID', 'employer.customerID')
        .join(
          db('employer')
            .select('customerID', 'employerName')
            .whereRaw(
              'employerID = (SELECT MAX(e2.employerID) FROM employer e2 WHERE e2.customerID = employer.customerID)', // Get latest employer by employerID
            )
            .as('latestEmployer'),
          'customer.customerID',
          'latestEmployer.customerID',
        )
        .groupBy('customer.customerID', 'leads.leadID')
        .whereNotExists(function () {
          this.select('*')
            .from('web_engage')
            .whereRaw('web_engage.customerID = customer.customerID')
        })
        .select(
          'customer.customerID',
          'customer.mobile as userId',
          'customer.firstName',
          'customer.lastName',
          'customer.dob',
          'customer.gender',
          'customer.email',
          'customer.mobile as phone',
          db.raw('MAX(employer.employerName) as company'),
          'leads.createdDate as latestLeadDate',
          'leads.leadID as leadID',
        )
        .orderBy('leads.leadID', 'desc')
        .limit(this.chunkSize)
        .offset(this.totalProcessed)

      console.log(
        `Fetched ${leads.length} records starting from offset: ${this.totalProcessed}`,
      )
      if (!leads.length) {
        console.log('No more users to fetch.')
        this.leadData = []
        return
      }

      if (returnLeadIDs) {
        return leads.map((lead: any) => lead.customerID);
      }

      const formatGender = (gender: string): string => {
        if (gender === 'Male') return 'male'
        if (gender === 'Female') return 'female'
        return 'other'
      }

      this.leadData = leads.map((lead: any) => ({
        userId: lead.userId,
        firstName: lead.firstName,
        lastName: lead.lastName,
        birthDate: new Date(lead.dob).toISOString(),
        gender: formatGender(lead.gender),
        email: lead.email,
        phone: lead.phone,
        company: lead.company,
        attributes: {
          Age: this.calculateAge(lead.dob),
        },
      }))
      return this.leadData
    } catch (error) {
      console.error('Error fetching next chunk of leads:', error)
    }
  }
  private calculateAge = (dob: Date): number => {
    return differenceInYears(new Date(), new Date(dob))
  }
}

export default WebEngageService
