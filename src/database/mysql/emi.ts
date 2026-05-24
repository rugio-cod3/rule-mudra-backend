import { IEmi, TSelectEmi } from '@/interfaces/emi.interface'
import { InsertData, SelectFields, SortCriteria, WhereQuery } from '@/types/model.types'
import { logger } from '@/utils/logger'
import { getKnexInstance } from '@/utils/mysql'

export default class EmiModel {
  private table = 'equated_monthly_installments'

  //where :{customerID}
  //order:{orderKey:"emiID",orderValue:"desc/asc"}
  //select: ["emiID","dueDate"]

  // New code
  async findOneEmi(
    where: WhereQuery<IEmi>,
    select: TSelectEmi[] | ['*'] = ['*'],
  ) {
    const db = getKnexInstance()

    return await db
      .table(this.table)
      .where(where)
      .select(...select)
      .first()
  }

  async findLastEmi(
    where: WhereQuery<IEmi>,
    select: TSelectEmi[] | ['*'] = ['*'],
  ) {
    const db = getKnexInstance();
  
    return await db
      .table(this.table)
      .where(where)
      .select(...select)
      .orderBy('emiID', 'desc')
      .first();  
  }

  async findAll(
    where: WhereQuery<IEmi>,
    order: SortCriteria<TSelectEmi>,
    select: SelectFields<TSelectEmi>,
  ): Promise<IEmi[]> {
    const db = getKnexInstance()

    return await db
      .table(this.table)
      .where(where)
      .select(...select)
      .orderBy(order)
  }

  public async insertEMI(
    creditID: number,
    customerID: number,
    leadID:number,
    productID: number,
    principal: number,
    interest: number,
    openingBalance: number,
    closingBalance: number,
    dueDate: Date,
  ): Promise<void> {
    try {
      let db = getKnexInstance()
      await db(this.table).insert({
        creditID,
        customerID,
        leadID,
        productID,
        principal,
        interest,
        amountPayable: principal + interest,
        openingBalance,
        closingBalance,
        dueDate,
        amountRemains: principal + interest,
        status: 'due',
        //createdAt: new Date(Date.now()),
        //updatedAt: new Date(Date.now()),
      })
    } catch (error) {
      logger.error('Error Inside lead.ts updateLeadRow function', error)
    }
  }

  async findOneAndUpdate(
    where: WhereQuery<IEmi> | Function,
    update: Partial<IEmi>,
  ): Promise<number> {
    const db = getKnexInstance()

    return await db
      .table(this.table)
      .where(where)
      .update({ ...update, updatedAt: new Date(Date.now()) })
  }

  public async findAndUpdate(
    where: [{ key: string; valueArray: any[] }],
    update: {},
  ): Promise<boolean | null> {
    try {
      let db = getKnexInstance()
      let emis = []
      for (let obj of where) {
        let emi = await db(this.table)
          .whereIn(obj.key, obj.valueArray)
          .select('emiID')
        if (emi) {
          for (let e of emi) {
            emis.push(e.emiID)
          }
        }
      }
      let emiSet = new Set(emis)
      let emiArray = Array.from(emiSet)
      let emi = await db(this.table).whereIn('emiID', emiArray).update(update)
      return true
    } catch (error) {
      logger.error('Error Inside emi.ts findAndUpdate function', error)
      return false
    }
  }

  public async countEMI(where: {}): Promise<number | null> {
    try {
      let db = getKnexInstance()
      let razorpayEMOrder = await db(this.table).where(where).count()
      let count = razorpayEMOrder[0]['count(*)']
      if (count == null) {
        return 0
      } else {
        return +count // Return the first lead if found
      }
    } catch (error) {
      logger.error(
        'Error Inside razorpay_emOrder.ts getRazorpayEMOrder function',
        error,
      )
    }
  }
  public async getEmisQueryForFetchPaymentCronJob(): Promise<IEmi[] | null> {
    try {
      let db = getKnexInstance()
      const today = new Date()
      const todayDay = today.getDate()
      const todayMonth = today.getMonth() + 1
      const todayYear = today.getFullYear()
      let emi = await db(this.table)
        .select('*')
        .whereRaw('DAY(dueDate) = ?', [todayDay])
        .andWhere(function () {
          this.whereRaw('MONTH(dueDate) <= ? AND YEAR(dueDate) <= ?', [
            todayMonth,
            todayYear,
          ]).andWhere(function () {
            this.where('status', 'partially-paid').orWhere('status', 'due')
          })
        })
      if (emi?.length == 0) {
        return null
      } else {
        return emi // Return the first lead if found
      }
    } catch (error) {
      logger.error(
        'Error Inside emi.ts getEmisQueryForFetchPaymentCronJob function',
        error,
      )
    }
  }
  public async getEmisQueryForManualPayment(
    creditID: number,
  ): Promise<IEmi[] | null> {
    try {
      let db = getKnexInstance()      
      let emi = await db(this.table)
      .select('*')
      .where({ creditID })
      .andWhere(function () {
        this.where('status', 'partially-paid').orWhere('status', 'due');
      })
      .orderBy('emiID', 'asc')
      .first(); 

      if (emi?.length == 0) {
        return null
      } else {
        return emi  
      }
    } catch (error) {
      logger.error(
        'Error Inside emi.ts getEmisQueryForFetchPaymentCronJob function',
        error,
      )
    }
  }


  public async getLastDuePayment(
    creditID: number,
  ): Promise<IEmi[] | null> {
    try {
      let db = getKnexInstance()
      const today = new Date()
      const todayDay = today.getDate()
      const todayMonth = today.getMonth() + 1
      const todayYear = today.getFullYear()
      let emis = await db(this.table)
        .select('*')
        .where({ creditID })
        //.andWhereRaw('DAY(dueDate) <= ?', [todayDay])
        .andWhere(function () {
          this.where('status', 'partially-paid').orWhere('status', 'due')
        }) 
        /*
        .andWhere(function () {
          this.whereRaw('MONTH(dueDate) <= ? AND YEAR(dueDate) <= ?', [
            todayMonth,
            todayYear,
          ])
        })
        */

      if (emis?.length == 0) {
        return null
      } else {
        return emis // Return the first lead if found
      }
    } catch (error) {
      logger.error(
        'Error Inside emi.ts getEmisQueryForFetchPaymentCronJob function',
        error,
      )
    }
  }

  public async getEmisQueryForPreClosure(
    creditID: number,
  ): Promise<IEmi[] | null> {
    try {
      let db = getKnexInstance()
      const today = new Date()
      const todayDay = today.getDate()
      const todayMonth = today.getMonth() + 1
      const todayYear = today.getFullYear()
      let emis = await db(this.table)
        .select('*')
        .where({ creditID })
        .andWhereRaw('DAY(dueDate) <= ?', [todayDay])
        .andWhere(function () {
          this.where('status', 'partially-paid').orWhere('status', 'due')
        })
        .andWhere(function () {
          this.whereRaw('MONTH(dueDate) <= ? AND YEAR(dueDate) <= ?', [
            todayMonth,
            todayYear,
          ])
        })

      if (emis?.length == 0) {
        return null
      } else {
        return emis // Return the first lead if found
      }
    } catch (error) {
      logger.error(
        'Error Inside emi.ts getEmisQueryForFetchPaymentCronJob function',
        error,
      )
    }
  }

  async insert(data: InsertData<IEmi>): Promise<number[]> {
    let db = getKnexInstance()
    return await db(this.table).insert(data)
  }

  public async insertEmiInDb(
    creditID: number,
    customerID: number,
    leadID: number,
    productID: number,
    principal: number,
    interest: number,
    penalty: number,                    
    brokenPeriodInterest: number,
    status:string,
    amountRemains: number,
    amountRemainsInterest:number,
    amountRemainsPenalty:number, 
    amountRemainsBrokenPeriodIntrest:number,    
    openingBalance: number,
    closingBalance: number,
    dueDate: Date,
    actualPaymentDate: Date | null,         
    delayDays: number,
    penaltyID: number | null,             
    paymentID: string | null,               
    accessAmount: number = 0,          
    paymentReceived: number = 0,
    waive_off_amount: number           
): Promise<number> {
    try {
      const db = getKnexInstance();  
 
      let emiID =  await db(this.table).insert({
            creditID,
            customerID,
            leadID,
            productID,
            principal,
            interest,
            panelty: penalty,
            amountPayable: principal + interest,
            openingBalance,
            closingBalance,
            dueDate,
            actualPaymentDate,
            delayDays,
            paneltyID: penaltyID,
            paymentID,
            brokenPeriodIntrest: brokenPeriodInterest,
            status: status,
            amountRemains: amountRemains,
            amountRemainsInterest: amountRemainsInterest,
            amountRemainsPenalty: amountRemainsPenalty, 
            amountRemainsBrokenPeriodIntrest: amountRemainsBrokenPeriodIntrest,
            createdAt: new Date(),
            updatedAt: new Date(), 
            accessAmount,
            paymentReceived,
            waive_off_amount
        }).returning('emiID');;
       
        logger.info(`EMI inserted successfully for Credit ID: ${creditID}`);
        return emiID[0];
    } catch (error) {
        logger.error('Error in insertEMI function:', error);       
    }
}


}

export const emiModel = new EmiModel()