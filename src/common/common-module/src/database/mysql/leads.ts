import { Knex } from 'knex'
import { ILead, TSelectLead } from '../../interfaces/lead.interface'
import {
  KnexFindParams,
  SelectFields,
  SortCriteria,
  WhereQuery,
} from '../../types/model.types'
import { logger } from '../../utils/logger'
import { getKnexInstance } from '../../utils/mysql'

export type responseType = {}
export default class LeadModel {
  private table = 'leads'

  get LeadsKnex() {
    let db = getKnexInstance()
    return db(this.table)
  }

  get Knex() {
    let db = getKnexInstance()
    return db
  }

  public async getLeadData(
    whereConditions: { column: string; values: string[] | number[] }[],
    order: { orderKey: string; orderValue: string },
    select: string[],
    skip?: number,
    take?: number,
    leadStartDate?: string,
    leadEndDate?: string,
  ): Promise<ILead[] | null> {
    let db = getKnexInstance()

    // Prepare the select array
    // let selectColumns = [
    //   ...select.map(column => `l.${column}`),
    //   'c.customerID as customerID',
    //   'c.name as customerName',
    //   'c.firstName as customerFirstName',
    //   'c.middleName as customerMiddleName',
    //   'c.lastName as customerLastName',
    //   'c.gender as customerGender',
    //   'c.dob as customerDOB',
    //   'c.mobile as customerMobile',
    //   'c.email as customerEmail',
    //   'c.pancard as customerPancard',
    //   'c.employeeType as customerEmployeeType',
    //   // Add more fields from the customers table as needed
    // ];

    let selectColumns = [
      'l.leadID as leadID',
      'c.name as Name',
      'c.email as EMail',
      'c.mobile as Mobile',
      'l.status as Status',
      'l.fbleads as CaseType',
      'l.callAssign as CallAssign',
    ]

    let query = db('leads as l')
      .join('customer as c', 'l.customerID', 'c.customerID')
      .select(selectColumns)
      .orderBy(order.orderKey, order.orderValue)

    // Apply whereIn conditions
    whereConditions.forEach((condition) => {
      const columnPrefix = condition.column === 'employeeType' ? 'c.' : 'l.'
      query = query.whereIn(
        `${columnPrefix}${condition.column}`,
        condition.values,
      )
    })

    if (leadStartDate) {
      query = query.where('l.createdDate', '>=', leadStartDate)
    }
    if (leadEndDate) {
      query = query.where('l.createdDate', '<=', leadEndDate)
    }

    if (take !== undefined && take !== null) {
      query = query.limit(take)
    }
    if (skip !== undefined && skip !== null) {
      query = query.offset(skip)
    }

    let leads = await query
    return leads
  }

  public async getAgainNoLoanLeadData(
    whereConditions: { column: string; values: string[] | number[] }[],
    order: { orderKey: string; orderValue: string },
    select: string[],
    skip?: number,
    take?: number,
    leadStartDate?: string,
    leadEndDate?: string,
    device?: string,
    loanType?: string,
    customerSearch?: string,
    alloUID?: string,
    leadStatus?: string,
    utmSource?: string,
  ): Promise<ILead[] | null> {
    const db: Knex = getKnexInstance()

    // let selectColumns = [
    //   ...select.map(column => `l.${column}`),
    //   'c.customerID as customerID',
    //   'c.name as customerName',
    //   'c.mobile as customerMobile',
    //   'c.email as customerEmail',
    //   'l.status as status',
    //   // Add more fields as needed
    // ];

    let selectColumns = [
      'l.leadID as leadID',
      'c.name as customerID',
      'c.name as Name',
      'c.email as EMail',
      'c.mobile as Mobile',
    ]

    let query = db('leads as l1')
      .join('customer as c', 'l1.customerID', 'c.customerID')
      .select('l1.*', 'c.*')
      .where('l1.status', 'Closed')
      .whereNotExists(function () {
        this.select(db.raw('1'))
          .from('leads as l2')
          .whereRaw('l2.customerID = l1.customerID')
          .andWhereRaw('l2.leadID > l1.leadID')
      })
      .orderBy(order.orderKey, order.orderValue)

    // Apply whereIn conditions
    whereConditions.forEach((condition) => {
      const columnPrefix = condition.column === 'employeeType' ? 'c.' : 'l.'
      query = query.whereIn(
        `${columnPrefix}${condition.column}`,
        condition.values,
      )
    })

    // Apply date filters
    if (leadStartDate) {
      query = query.where('l.createdDate', '>=', leadStartDate)
    }
    if (leadEndDate) {
      query = query.where('l.createdDate', '<=', leadEndDate)
    }

    // Apply device filter
    if (device) {
      if (device === 'android') {
        query = query.whereExists(function () {
          this.select(db.raw('1'))
            .from('login_device_detail')
            .whereRaw('login_device_detail.mobile = c.mobile')
            .whereNotNull('login_device_detail.modelName')
            .whereNotNull('login_device_detail.android_version')
        })
      } else {
        query = query.whereNotExists(function () {
          this.select(db.raw('1'))
            .from('login_device_detail')
            .whereRaw('login_device_detail.mobile = c.mobile')
        })
      }
    }

    // Apply loan type filter
    if (loanType) {
      query = query.where('l.productID', loanType)
    }

    // Apply customer search filter
    if (customerSearch) {
      query = query.where(function () {
        this.where('c.name', 'LIKE', `%${customerSearch}%`)
          .orWhere('c.mobile', 'LIKE', `%${customerSearch}%`)
          .orWhere('c.email', 'LIKE', `%${customerSearch}%`)
      })
    }

    // Apply alloUID filter
    if (alloUID) {
      if (alloUID === '0') {
        query = query.where('l.sanctionalloUID', 'no')
      } else {
        query = query.where(function () {
          this.where('l.callAssign', alloUID)
            .orWhere('l.creditAssign', alloUID)
            .orWhere('l.alloUID', alloUID)
            .orWhere('l.sanctionalloUID', alloUID)
        })
      }
    }

    // Apply utmSource filter
    if (utmSource && utmSource !== 'All') {
      query = query.where('l.utmSource', utmSource)
    }

    // Apply pagination
    if (skip !== undefined && skip !== null) {
      query = query.offset(skip)
    }
    if (take !== undefined && take !== null) {
      query = query.limit(take)
    }

    // Fetch data
    const leads = await query
    // return leads
    // return leads

    const downloadExcel: any[] = []
    for (const thisData of leads) {
      const closedDate = await db('collection')
        .select('collectedDate')
        .where('customerID', thisData.customerID)
        .where('leadID', thisData.leadID)
        .where('status', 'Closed')
        .orderBy('collectedDate', 'desc')
        .first()

      downloadExcel.push({
        customerID: thisData.customerID,
        Name: thisData.name,
        Mobile: thisData.mobile,
        EMail: thisData.email,
        'Last Loan Closed Date': closedDate ? closedDate.collectedDate : '',
      })
    }

    return downloadExcel
  }

  // public async getAgainNoLoanLeadData(
  //   whereConditions: { column: string; values: string[] | number[] }[],
  //   order: { orderKey: string; orderValue: string },
  //   select: string[],
  //   skip?: number,
  //   take?: number,
  //   leadStartDate?: string,
  //   leadEndDate?: string,
  //   device?: string,
  //   loanType?: string,
  //   customerSearch?: string,
  //   alloUID?: string,
  // ): Promise<ILead[] | null> {
  //   const db: Knex = getKnexInstance();

  //   let selectColumns = [
  //     ...select.map(column => `l.${column}`),
  //     'c.customerID as customerID',
  //     'c.name as customerName',
  //     'c.mobile as customerMobile',
  //     'c.email as customerEmail',
  //     'l.status as status',
  //     // Add more fields as needed
  //   ];

  //   let query = db('leads as l')
  //     .join('customer as c', 'l.customerID', 'c.customerID')
  //     .select(selectColumns)
  //     .orderBy(order.orderKey, order.orderValue);

  //   // Apply whereIn conditions
  //   whereConditions.forEach(condition => {
  //     const columnPrefix = condition.column === 'employeeType' ? 'c.' : 'l.';
  //     query = query.whereIn(`${columnPrefix}${condition.column}`, condition.values);
  //   });

  //   if (leadStartDate) {
  //     query = query.where('l.createdDate', '>=', leadStartDate);
  //   }
  //   if (leadEndDate) {
  //     query = query.where('l.createdDate', '<=', leadEndDate);
  //   }

  //   if (device) {
  //     if (device === 'android') {
  //       query = query.whereExists(function (subQuery) {
  //         subQuery.select(db.raw(1))
  //           .from('login_device_detail')
  //           .whereRaw('login_device_detail.mobile = c.mobile')
  //           .whereNotNull('login_device_detail.modelName')
  //           .whereNotNull('login_device_detail.android_version');
  //       });
  //     } else {
  //       query = query.whereNotExists(function (subQuery) {
  //         subQuery.select(db.raw(1))
  //           .from('login_device_detail')
  //           .whereRaw('login_device_detail.mobile = c.mobile');
  //       });
  //     }
  //   }

  //   if (loanType) {
  //     query = query.where('l.productID', loanType);
  //   }

  //   if (customerSearch) {
  //     query = query.where(function () {
  //       this.where('c.name', 'LIKE', `%${customerSearch}%`)
  //         .orWhere('c.mobile', 'LIKE', `%${customerSearch}%`)
  //         .orWhere('c.email', 'LIKE', `%${customerSearch}%`);
  //     });
  //   }

  //   if (alloUID) {
  //     if (alloUID === '0') {
  //       query = query.where('l.sanctionalloUID', 'no');
  //     } else {
  //       query = query.where(function () {
  //         this.where('l.callAssign', alloUID)
  //           .orWhere('l.creditAssign', alloUID)
  //           .orWhere('l.alloUID', alloUID)
  //           .orWhere('l.sanctionalloUID', alloUID);
  //       });
  //     }
  //   }

  //   if (device) {
  //     if (device === 'android') {
  //     query = query.whereExists(function (subQuery) {
  //         subQuery.select(db.raw(1))
  //         .from('login_device_detail')
  //         .whereRaw('login_device_detail.mobile = c.mobile')
  //         .whereNotNull('login_device_detail.modelName')
  //         .whereNotNull('login_device_detail.android_version');
  //     });
  //     } else {
  //     query = query.whereNotExists(function (subQuery) {
  //         subQuery.select(db.raw(1))
  //         .from('login_device_detail')
  //         .whereRaw('login_device_detail.mobile = c.mobile');
  //     });
  //     }
  // }

  //   if (skip !== undefined && skip !== null) {
  //     query = query.offset(skip);
  //   }
  //   if (take !== undefined && take !== null) {
  //     query = query.limit(take);
  //   }

  //   const leads =await query;
  //   return leads;
  // }

  // public async getAgainNoLoanLeadData(
  //   whereConditions: { column: string, values: string[]|number[] }[],
  //   order: { orderKey: string; orderValue: string },
  //   select: string[],
  //   skip?: number,
  //   take?: number,
  //   leadStartDate?: string,
  //   leadEndDate?: string
  // ): Promise<ILead[] | null> {
  //     let db = getKnexInstance();

  //     // Prepare the select array
  //     let selectColumns = [
  //       ...select.map(column => `l.${column}`),
  //       'c.customerID as customerID',
  //       'c.name as customerName',
  //       'c.firstName as customerFirstName',
  //       'c.middleName as customerMiddleName',
  //       'c.lastName as customerLastName',
  //       'c.gender as customerGender',
  //       'c.dob as customerDOB',
  //       'c.mobile as customerMobile',
  //       'c.email as customerEmail',
  //       'c.pancard as customerPancard',
  //       'c.employeeType as customerEmployeeType',
  //       // Add more fields from the customers table as needed
  //     ];

  //     let query = db('leads as l')
  //       .join('customer as c', 'l.customerID', 'c.customerID')
  //       .select(selectColumns)
  //       .orderBy(order.orderKey, order.orderValue);

  //     // Apply whereIn conditions
  //     whereConditions.forEach(condition => {
  //       const columnPrefix = condition.column === 'employeeType' ? 'c.' : 'l.';
  //       query = query.whereIn(`${columnPrefix}${condition.column}`, condition.values);
  //     });

  //     if (leadStartDate) {
  //       query = query.where('l.createdDate', '>=', leadStartDate);
  //     }
  //     if (leadEndDate) {
  //       query = query.where('l.createdDate', '<=', leadEndDate);
  //     }

  //     if (take !== undefined && take !== null) {
  //       query = query.limit(take);
  //     }
  //     if (skip !== undefined && skip !== null) {
  //       query = query.offset(skip);
  //     }

  //     let leads = await query;
  //     return leads;
  // }

  // In your leadModel class
  // public async getLeadData(
  //   whereConditions: { column: string, values: string[] }[],
  //   order: { orderKey: string; orderValue: string },
  //   select: string[],
  //   skip: number,
  //   take: number
  // ): Promise<ILead[]> {
  //   try {
  //       const query = this.knex('leads')
  //           .join('customers', 'leads.customerID', 'customers.customerID')
  //           .select([
  //               ...select,
  //               'customers.name as customerName',
  //               'customers.firstName as customerFirstName',
  //               'customers.lastName as customerLastName',
  //               // Add other customer fields you need
  //           ]);

  //       whereConditions.forEach(condition => {
  //           query.whereIn(condition.column, condition.values);
  //       });

  //       query.orderBy(order.orderKey, order.orderValue)
  //           .limit(take)
  //           .offset(skip);

  //       const leads = await query;
  //       return leads;
  //   } catch (error) {
  //       throw error;
  //   }
  // }

  // public async getLeadData(
  //   whereConditions: { column: string, values: string[] }[],
  //   order: { orderKey: string; orderValue: string },
  //   select: string[],
  //   skip: number,
  //   take: number
  // ): Promise<ILead[] | null> {
  //   try {
  //     let db = getKnexInstance();
  //     // let query = db(this.table)
  //     //   .select(...select)
  //     //   .orderBy(order.orderKey, order.orderValue)
  //     //   .limit(take)
  //     //   .offset(skip);
  //     let query = db(this.table) .select([...select, 'customer.name', 'customer.firstName', 'customer.middleName', 'customer.lastName', 'customer.gender']) .leftJoin('customer', 'leads.customerId', 'customer.id') .orderBy(order.orderKey, order.orderValue) .limit(take) .offset(skip);
  //     // Apply whereIn conditions
  //     whereConditions.forEach(condition => {
  //       query = query.whereIn(condition.column, condition.values);
  //     });
  //     let leads = await query;
  //     if (leads == null || leads.length == 0) {
  //       return null;
  //     } else {
  //       return leads;
  //     }
  //   } catch (error) {
  //     logger.error('Error Inside lead.ts getLeadData function', error);
  //     return null;
  //   }
  // }

  // public async getLeadData(
  //   whereConditions: { column: string, values: string[] }[],
  //   order: { orderKey: string; orderValue: string },
  //   select: string[],
  //   skip: number,
  //   take: number
  // ): Promise<ILead[] | null> {
  //   try {
  //     let db = getKnexInstance();
  //     let query = db(this.table)
  //       .select(...select)
  //       .orderBy(order.orderKey, order.orderValue)
  //       .limit(take)
  //       .offset(skip);
  //     // Apply whereIn conditions
  //     whereConditions.forEach(condition => {
  //       query = query.whereIn(condition.column, condition.values);
  //     });
  //     let leads = await query;
  //     if (leads == null || leads.length == 0) {
  //       return null;
  //     } else {
  //       return leads;
  //     }
  //   } catch (error) {
  //     logger.error('Error Inside lead.ts getLeadData function', error);
  //     return null;
  //   }
  // }
  // public async getLeadData(
  //   where: {},
  //   order: { orderKey: string; orderValue: string },
  //   select: string[],
  // ): Promise<ILead[] | null> {
  //   try {
  //     let db = getKnexInstance()
  //     let leads = await db(this.table)
  //       .where(where)
  //       .select(...select)
  //       .orderBy(order.orderKey, order.orderValue)
  //     if (leads == null || leads?.length == 0) {
  //       return null
  //     } else {
  //       return leads // Return the first lead if found
  //     }
  //   } catch (error) {
  //     logger.error('Error Inside lead.ts getLeadData function', error)
  //   }
  // }
  // async findOneLead(
  //   where: Partial<ILead>,
  //   select: TSelectLead[] | ['*'] = ['*'],
  //   order?: TSelectLead[],
  // ): Promise<ILead> {
  //   let db = getKnexInstance()
  //   let query = db
  //     .table(this.table)
  //     .where(where)
  //     .select(...select)
  //   if (order) {
  //     query.orderBy(order)
  //   }

  //   return await query.first()
  // }

  async findOneLead(
    where: Partial<ILead>,
    select: TSelectLead[] | ['*'] = ['*'],
    order?: { column: TSelectLead; order: 'asc' | 'desc' }[], // Fix here
  ): Promise<ILead> {
    let db = getKnexInstance()
    let query = db
      .table(this.table)
      .where(where)
      .select(...select)

    if (order) {
      query.orderBy(order) // Now it expects an array of objects
    }

    return await query.first()
  }

  // ! Remove this
  // public async getSingleLeadData(
  //   where: {},
  //   order: { orderKey: string; orderValue: string },
  //   select: string[],
  // ): Promise<ILead | null> {
  //   try {
  //     let db = getKnexInstance()
  //     let leads = await db(this.table)
  //       .where(where)
  //       .select(...select)
  //       .orderBy(order.orderKey, order.orderValue)
  //       .first()
  //     if (leads == null || leads?.length == 0) {
  //       return null
  //     } else {
  //       return leads // Return the first lead if found
  //     }
  //   } catch (error) {
  //     logger.error('Error Inside lead.ts getLeadData function', error)
  //   }
  // }

  async findAll(
    where: WhereQuery<ILead>,
    order: SortCriteria<TSelectLead>,
    select: SelectFields<TSelectLead>,
  ): Promise<ILead[]> {
    const db = getKnexInstance()

    return await db
      .table(this.table)
      .where(where)
      .select(...select)
      .orderBy(order)
  }

  async find(params: KnexFindParams<ILead, TSelectLead>): Promise<ILead[]> {
    const {
      order,
      select = ['*'],
      where,
      whereIn,
      whereNot,
      whereNotNull,
      whereRaw,
      paginate,
    } = params
    let db = getKnexInstance()

    let query = db(this.table)

    if (where) {
      if (Array.isArray(where)) {
        where.forEach((element) => {
          const { column, operator, value } = element

          if (operator) query.where(column, operator, value)
          else query.where(column, value)
        })
      } else {
        query.where(where)
      }
    }

    query.select(...select)

    if (whereIn) {
      whereIn.forEach((condition) => {
        const { column, value } = condition
        query.whereIn(column, value)
      })
    }

    if (whereRaw) {
      whereRaw.forEach((condition) => {
        const { rawQuery, values } = condition
        query.whereRaw(rawQuery, values)
      })
    }

    if (whereNot) {
      query.whereNot(whereNot)
    }

    if (whereNotNull) {
      whereNotNull.forEach((column) => query.whereNotNull(column))
    }

    if (order) query.orderBy(order)

    if (paginate) {
      query.limit(paginate.perPage).offset(paginate.page)
    }

    return await query
  }

  public async updateLeadRow(leadID: number, dataToUpdate: {}): Promise<void> {
    try {
      let db = getKnexInstance()
      await db(this.table).where('leadID', leadID).update(dataToUpdate)
    } catch (error) {
      logger.error('Error Inside lead.ts updateLeadRow function', error)
    }
  }

  public async findOneAndUpdate(
    where: Partial<ILead>,
    update: Partial<ILead>,
  ): Promise<number> {
    let db = getKnexInstance()
    return await db.table(this.table).where(where).update(update)
  }

  // public async insert(data: {}): Promise<number | null> {
  //   try {
  //     let db = getKnexInstance()
  //     let [insertedID] = await db(this.table).insert(data).returning('id')
  //     return insertedID
  //   } catch (error) {
  //     logger.error('Error Inside leads.ts insert function', error)
  //   }
  // }

  public async insert(data: {}): Promise<number | null> {
    try {
      let db = getKnexInstance()
      let result = await db(this.table).insert(data)
      let insertedID = result[0]
      return insertedID
    } catch (error) {
      logger.error('Error Inside leads.ts insert function', error)
      return null
    }
  }

  // Updated findOne
  async findOne(params: KnexFindParams<ILead, TSelectLead>): Promise<ILead> {
    const {
      order,
      select = ['*'],
      where,
      whereIn,
      whereNot,
      whereNotNull,
      paginate,
    } = params
    let db = getKnexInstance()

    let query = db(this.table)

    if (where) {
      if (Array.isArray(where)) {
        where.forEach((element) => {
          const { column, operator, value } = element

          if (operator) query.where(column, operator, value)
          else query.where(column, value)
        })
      } else {
        query.where(where)
      }
    }

    query.select(...select)

    if (whereIn) {
      whereIn.forEach((condition) => {
        const { column, value } = condition
        query.whereIn(column, value)
      })
    }

    if (whereNot) {
      query.whereNot(whereNot)
    }

    if (whereNotNull) {
      whereNotNull.forEach((column) => query.whereNotNull(column))
    }

    if (order) query.orderBy(order)

    if (paginate) {
      query.limit(paginate.perPage).offset(paginate.page)
    }

    return await query.first()
  }

  async countLeads(where?: WhereQuery<ILead>, whereNot?: WhereQuery<ILead>) {
    let db = getKnexInstance()

    const count = db(this.table)

    if (where) count.where(where)
    if (whereNot) count.whereNot(whereNot)

    const data = await count.count()

    return data[0]['count(*)'] as number
  }

  async count(params: KnexFindParams<ILead, TSelectLead>): Promise<number> {
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
}

export const leadModel = new LeadModel()
