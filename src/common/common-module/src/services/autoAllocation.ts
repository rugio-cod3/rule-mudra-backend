import { getKnexInstance } from '../utils/mysql'

class AutoAllocationService {
  public async assignLeadToUser(
    startDate: string,
    authUserID: number,
    authUserName: string,
  ): Promise<number> {
    const db = getKnexInstance()
    console.log(startDate, authUserID, authUserName)

    let freshLead: any | undefined
    const trx = await db.transaction()

    try {
      // Fetch the lead based on the initial criteria
      freshLead = await db('leads')
        .join('callhistoryLogs', 'callhistoryLogs.leadID', 'leads.leadID')
        .whereIn('leads.status', ['Document Received'])
        .whereIn('leads.fbLeads', ['Existing Case', 'New Case'])
        .where('callhistoryLogs.createdDate', '>', startDate)
        .whereIn('leads.sanctionalloUID', [authUserID])
        .whereIn('leads.alloUID', [authUserID])
        .transacting(trx)
        .first()

      console.log(freshLead)

      if (!freshLead) {
        const leadQuery = db('leads')
          .join('callhistoryLogs', 'callhistoryLogs.leadID', 'leads.leadID')
          .join('customer', 'customer.customerID', 'leads.customerID')
          .whereIn('leads.status', ['Document Received'])
          .whereIn('leads.fbLeads', ['Existing Case', 'New Case'])
          .where('callhistoryLogs.createdDate', '>', '2024-01-01')
          .andWhere(function () {
            this.where('leads.sanctionalloUID', 0).orWhereNull('leads.sanctionalloUID')
          })
          .andWhere(function () {
            this.where('leads.alloUID', 0).orWhereNull('leads.alloUID')
          })
          .orderBy('leads.monthlyIncome', 'DESC')
        const salariedLeadsHighIncome = leadQuery
          .clone()
          .where('customer.employeeType', 'Salaried')
          .where('leads.monthlyIncome', '>=', 50000)
        const selfEmployedLeadsHighIncome = leadQuery
          .clone()
          .where('customer.employeeType', 'Self Employed')
          .where('leads.monthlyIncome', '>=', 50000)
        const salariedLeadsLowIncome = leadQuery
          .clone()
          .where('customer.employeeType', 'Salaried')
          .where('leads.monthlyIncome', '<', 50000)
        const selfEmployedLeadsLowIncome = leadQuery
          .clone()
          .where('customer.employeeType', 'Self Employed')
          .where('leads.monthlyIncome', '<', 50000)

        let check = await salariedLeadsHighIncome
        console.log(check)
        freshLead = await salariedLeadsHighIncome
          .unionAll([
            selfEmployedLeadsHighIncome,
            salariedLeadsLowIncome,
            selfEmployedLeadsLowIncome,
          ])
          .forUpdate()
          .transacting(trx)
          .first()

        let check2 = await selfEmployedLeadsHighIncome
        console.log(check2)
        if (freshLead) {
          await db('leads')
            .where('leadID', freshLead.leadID)
            .update({
              sanctionalloUID: authUserID,
              alloUID: authUserID,
            })
            .transacting(trx)

          const data = {
            customerID: freshLead.customerID,
            leadID: freshLead.leadID,
            callType: 'IVR',
            status: 'Lead Allocated',
            remark: `Lead Allocated to ${authUserName}`,
            noteli: ' ',
            callbackTime: new Date().toISOString().split('T')[0],
            calledBy: authUserID,
            createdDate: new Date().toISOString(),
          }

          await db('callhistoryLogs').insert(data).transacting(trx)
        }
      }

      await trx.commit()
    } catch (error) {
      await trx.rollback()
      console.error('Error assigning lead:', error)
      throw error // Re-throw the error after rollback
    }

    return freshLead ? freshLead.leadID : 0
  }
}

export { AutoAllocationService }
