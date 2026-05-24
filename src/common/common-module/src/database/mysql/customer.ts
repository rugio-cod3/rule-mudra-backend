import { format } from 'date-fns'
import { PennyDropNameMismatch } from '../../enums/pennyDrop.enum'
import {
  ICustomer,
  IRepaymentDate,
  TSelectCustomer,
  TSelectRepaymentDate,
} from '../../interfaces/customer.interface'
import {
  INameMismatch,
  TSelectNameMismatch,
} from '../../interfaces/lead.interface'
import {
  KnexFindParams,
  SelectFields,
  SortCriteria,
  UpdateQuery,
  WhereQuery,
} from '../../types/model.types'
import { logger } from '../../utils/logger'
import { getKnexInstance, runQuery } from '../../utils/mysql'

export default class CustomerModel {
  private table = 'customer'

  get CustomerKnex() {
    let db = getKnexInstance()
    return db(this.table)
  }

  public async getCustomer(mobile: number): Promise<[]> {
    const sql = `SELECT * FROM ${this.table} WHERE mobile = ${mobile} LIMIT 1`
    try {
      const result = await runQuery(sql)
      if (result.length === 0) {
        return []
      } else {
        return result[0]
      }
    } catch (error) {
      logger.error(error)
      return []
    }
  }
  // New Code
  async findOneCustomer(
    where: WhereQuery<ICustomer>,
    select: SelectFields<TSelectCustomer> = ['*'],
    order?: SortCriteria<TSelectCustomer>,
  ): Promise<ICustomer> {
    let db = getKnexInstance()
    let query = db
      .table(this.table)
      .where(where)
      .select(...select)

    if (order) {
      query.orderBy(order)
    }

    return await query.first()
  }

  // ! TO BE REMOVED

  // public async getCustome(
  //   where: Partial<ICustomer>,
  //   order: IOrder,
  //   select: string[],
  // ): Promise<ICustomer[] | null> {
  //   try {
  //     let db = getKnexInstance()
  //     let customer = await db(this.table)
  //       .where(where)
  //       .select(...select)
  //       .orderBy(order.orderKey, order.orderValue)
  //     if (customer == null || customer?.length == 0) {
  //       return null
  //     } else {
  //       return customer // Return the first product if found
  //     }
  //   } catch (error) {
  //     logger.error('Error Inside customer.ts getCustom function', error)
  //     return null
  //   }
  // }

  public async saveCustomer(mobile: number) {
    const insertedData = {
      gender: 'NA',
      dob: '1970-01-01',
      mobile: mobile,
      email: 'NA',
      password: 'NA',
      employeeType: 'Not Employed',
      // status: 'Incomplete',
      createdDate: format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
    }
    if (insertedData) {
      const columns = Object.keys(insertedData)
      const values = Object.values(insertedData)
      const sql = `
        INSERT INTO ${this.table} (${columns.map((col) => col).join(',')})
        VALUES (${values.map(() => '?').join(',')})
      `

      try {
        const [resultSetHeader] = await runQuery(sql, values)
        // console.log("save", resultSetHeader.insertId)
        return resultSetHeader
      } catch (error) {
        logger.error(error)
      }
    }
  }

  public async updateCustomerCol(
    counsmer_id: number,
    col: string,
    val: string,
  ) {
    try {
      if (!counsmer_id || !col || !val) {
        return false
      }

      const sql = `UPDATE ${this.table} SET ${col} = ? WHERE customerID = ?`

      const updateObjResp = await runQuery(sql, [val, counsmer_id])

      return updateObjResp
    } catch (error) {
      logger.error(error)
      return false
    }
  }

  public async getCustomerById(customerId: number) {
    const sql = `SELECT * FROM ${this.table} WHERE customerID=${customerId}`
    try {
      const getObjResp = await runQuery(sql)
      return getObjResp[0]
    } catch (error) {
      logger.error(error)
      return []
    }
  }

  public async findOneAndUpdate(
    where: WhereQuery<ICustomer>,
    update: UpdateQuery<ICustomer>,
  ): Promise<number> {
    let db = getKnexInstance()
    return await db.table(this.table).where(where).update(update)
  }

  async find(
    params: KnexFindParams<ICustomer, TSelectCustomer>,
  ): Promise<ICustomer[]> {
    const { select = ['*'], paginate, where } = params
    let db = getKnexInstance()

    let query = db(this.table)
    if (where) {
      query.where(where)
    }
    if (paginate) {
      query.limit(paginate.perPage).offset(paginate.page)
    }
    query.select(...select)

    return await query
  }

  async count(
    params: KnexFindParams<ICustomer, TSelectCustomer>,
  ): Promise<number> {
    const { where, whereNot, whereIn } = params
    let db = getKnexInstance()

    const count = db(this.table)

    if (where) count.where(where)
    if (whereNot) count.whereNot(whereNot)
    if (whereIn) {
      whereIn.forEach((condition) => {
        const { column, value } = condition
        count.whereIn(column, value)
      })
    }

    const data = await count.count()

    return data[0]['count(*)'] as number
  }

  async findRepaymentDate(
    params: KnexFindParams<IRepaymentDate, TSelectRepaymentDate>,
  ): Promise<{ repaymentData: IRepaymentDate[]; totalCount: number }> {
    let selectColumns = [
      'l.leadID as leadID',
      'c.name as Name',
      'c.mobile as Mobile',
      'c.customerID as customerID',
      'l.status as Status',
      'a.repayDate as repayDate',
      'a.loanAmtApproved as approvedAmount',
      'a.approvalID as approvalID',
    ]

    const { where, paginate } = params
    let db = getKnexInstance()

    // **Get the total count**
    const countQuery = db('customer as c')
      .join('leads as l', 'l.customerID', 'c.customerID')
      .join('approval as a', function () {
        this.on('a.customerID', '=', 'c.customerID').andOn(
          'a.leadID',
          '=',
          'l.leadID',
        )
      })
      .where(where)
      .whereIn('l.status', ['Part Payment', 'Disbursed'])
      .count('* as total')
      .first()

    // **Get the paginated data**
    const dataQuery = db('customer as c')
      .join('leads as l', 'l.customerID', 'c.customerID')
      .join('approval as a', function () {
        this.on('a.customerID', '=', 'c.customerID').andOn(
          'a.leadID',
          '=',
          'l.leadID',
        )
      })
      .select(selectColumns)
      .where(where)
      .whereIn('l.status', ['Part Payment', 'Disbursed'])

    if (paginate) {
      dataQuery.limit(paginate.perPage).offset(paginate.page)
    }

    // Execute both queries concurrently
    const [countResult, repaymentData] = await Promise.all([
      countQuery,
      dataQuery,
    ])

    return {
      repaymentData,
      totalCount: Number(countResult?.total) || 0,
    }
  }

  async getCustomerFinbox(
    params: KnexFindParams<INameMismatch, TSelectNameMismatch>,
  ): Promise<{ data: INameMismatch[]; totalCount: number }> {
    const { where, paginate } = params

    let selectColumns = [
      'fm.accountNo as account',
      'c.customerID',
      'c.name',
      'c.mobile',
      'c.pancard',
      'c.createdDate',
      'fm.id',
    ]

    let db = getKnexInstance()

    // Query to get total count
    const totalCountQuery = db('customer as c')
      .join('finbox_name_match as fm', 'c.customerID', '=', 'fm.customerID')
      .where('fm.status', 0)
      .modify((query) => {
        if (where) query.where(where)
      })
      .count('* as total')
      .first()

    // Query to get paginated data
    const dataQuery = db('customer as c')
      .join('finbox_name_match as fm', 'c.customerID', '=', 'fm.customerID')
      .select(selectColumns)
      .where('fm.status', 0)
      .modify((query) => {
        if (where) query.where(where)
        if (paginate) query.limit(paginate.perPage).offset(paginate.page)
      })
      .orderBy('fm.id', 'desc')

    const [totalCountResult, data] = await Promise.all([
      totalCountQuery,
      dataQuery,
    ])

    return {
      data,
      totalCount: totalCountResult ? totalCountResult.total : 0,
    }
  }

  async getCustomerPenny(
    params: KnexFindParams<INameMismatch, TSelectNameMismatch>,
  ): Promise<{ data: INameMismatch[]; totalCount: number }> {
    const { where, paginate } = params

    let selectColumns = [
      'p.account_number as account',
      'c.customerID',
      'c.name',
      'c.mobile',
      'c.pancard',
      'c.createdDate',
      'p.registered_name',
      'p.credated_date',
      'p.id',
    ]

    let db = getKnexInstance()

    const totalCountQuery = db('customer as c')
      .join('penny_drop as p', 'c.customerID', '=', 'p.customerID')
      .where('p.penny_drop_name_match', PennyDropNameMismatch.THIRD)
      .modify((query) => {
        if (where) query.where(where)
      })
      .count('* as total')
      .first()

    // Query to get paginated data
    const dataQuery = db('customer as c')
      .join('penny_drop as p', 'c.customerID', '=', 'p.customerID')
      .select(selectColumns)
      .where('p.penny_drop_name_match', PennyDropNameMismatch.THIRD)
      .modify((query) => {
        if (where) query.where(where)
        if (paginate) query.limit(paginate.perPage).offset(paginate.page)
      })
      .orderBy('p.id', 'desc')

    const [totalCountResult, data] = await Promise.all([
      totalCountQuery,
      dataQuery,
    ])

    return {
      data,
      totalCount: totalCountResult ? totalCountResult.total : 0,
    }
  }
}

export const customerModel = new CustomerModel()
