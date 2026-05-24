import { ILead, TSelectLead } from "@/interfaces/lead.interface";
import {
  InsertData,
  KnexFindParams,
  SelectFields,
  SortCriteria,
  UpdateQuery,
  WhereQuery,
} from "@/types/model.types";
import { logger } from "@/utils/logger";
import { getKnexInstance } from "@/utils/mysql";

export type responseType = {};
export default class LeadModel {
  private table = "leads";

  get LeadsKnex() {
    let db = getKnexInstance();
    return db(this.table);
  }
  get Knex() {
    let db = getKnexInstance();
    return db;
  }

  async find(params: KnexFindParams<ILead, TSelectLead>): Promise<ILead[]> {
    const {
      order,
      select = ["*"],
      where,
      whereIn,
      whereNot,
      whereNotNull,
      whereRaw,
    } = params;
    let db = getKnexInstance();

    let query = db(this.table);

    if (where) {
      if (Array.isArray(where)) {
        where.forEach((element) => {
          const { column, operator, value } = element;

          if (operator) query.where(column, operator, value);
          else query.where(column, value);
        });
      } else {
        query.where(where);
      }
    }

    query.select(...select);

    if (whereIn) {
      whereIn.forEach((condition) => {
        const { column, value } = condition;
        query.whereIn(column, value);
      });
    }

    if (whereRaw) {
      whereRaw.forEach((condition) => {
        const { rawQuery, values } = condition;
        query.whereRaw(rawQuery, values);
      });
    }

    if (whereNot) {
      query.whereNot(whereNot);
    }

    if (whereNotNull) {
      whereNotNull.forEach((column) => query.whereNotNull(column));
    }

    if (order) query.orderBy(order);

    return await query;
  }

  public async getLeadData(
    where: {},
    order: { orderKey: string; orderValue: string },
    select: string[]
  ): Promise<ILead[] | null> {
    try {
      let db = getKnexInstance();
      let leads = await db(this.table)
        .where(where)
        .select(...select)
        .orderBy(order.orderKey, order.orderValue);
      if (leads == null || leads?.length == 0) {
        return null;
      } else {
        return leads; // Return the first lead if found
      }
    } catch (error) {
      logger.error("Error Inside lead.ts getLeadData function", error);
    }
  }
  async findOneLead(
    where: WhereQuery<ILead>,
    select: SelectFields<TSelectLead> = ["*"],
    order?: SortCriteria<TSelectLead>,
    whereNot?: WhereQuery<ILead>
  ): Promise<ILead> {
    let db = getKnexInstance();
    let query = db
      .table(this.table)
      .where(where)
      .select(...select);

    if (whereNot) {
      query.whereNot(whereNot);
    }
    if (order) {
      query.orderBy(order);
    }

    return await query.first();
  }

  // Updated findOne
  async findOne(params: KnexFindParams<ILead, TSelectLead>): Promise<ILead> {
    const {
      order,
      select = ["*"],
      where,
      whereIn,
      whereNot,
      whereNotNull,
      paginate,
    } = params;
    let db = getKnexInstance();

    let query = db(this.table);

    if (where) {
      if (Array.isArray(where)) {
        where.forEach((element) => {
          const { column, operator, value } = element;

          if (operator) query.where(column, operator, value);
          else query.where(column, value);
        });
      } else {
        query.where(where);
      }
    }

    query.select(...select);

    if (whereIn) {
      whereIn.forEach((condition) => {
        const { column, value } = condition;
        query.whereIn(column, value);
      });
    }

    if (whereNot) {
      query.whereNot(whereNot);
    }

    if (whereNotNull) {
      whereNotNull.forEach((column) => query.whereNotNull(column));
    }

    if (order) query.orderBy(order);

    if (paginate) {
      query.limit(paginate.perPage).offset(paginate.page);
    }

    return await query.first();
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

  public async updateLeadRow(leadID: number, dataToUpdate: {}): Promise<void> {
    try {
      let db = getKnexInstance();
      await db(this.table).where("leadID", leadID).update(dataToUpdate);
    } catch (error) {
      logger.error("Error Inside lead.ts updateLeadRow function", error);
    }
  }

  public async findOneAndUpdate(
    where: WhereQuery<ILead>,
    update: UpdateQuery<ILead>
  ): Promise<number> {
    let db = getKnexInstance();
    return await db.table(this.table).where(where).update(update);
  }

  async countLeads(where?: WhereQuery<ILead>, whereNot?: WhereQuery<ILead>) {
    let db = getKnexInstance();

    const count = db(this.table);

    if (where) count.where(where);
    if (whereNot) count.whereNot(whereNot);

    const data = await count.count();

    return data[0]["count(*)"] as number;
  }

  async leadCountArray(
    where?: WhereQuery<ILead>,
    whereNot?: WhereQuery<ILead>,
    whereIn?: { [K in keyof ILead]?: ILead[K][] }
  ) {
    let db = getKnexInstance();

    const count = db(this.table);

    if (where) count.where(where);
    if (whereNot) count.whereNot(whereNot);
    if (whereIn) {
      for (const key in whereIn) {
        count.whereIn(key, whereIn[key]);
      }
    }

    const data = await count.count();

    return data[0]["count(*)"] as number;
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
      let db = getKnexInstance();
      let result = await db(this.table).insert(data);
      let insertedID = result[0];
      return insertedID;
    } catch (error) {
      logger.error("Error Inside leads.ts insert function", error);
      return null;
    }
  }

  async create(data: InsertData<ILead>): Promise<number[]> {
    let db = getKnexInstance();
    return await db(this.table).insert(data);
  }
}

export const leadModel = new LeadModel();
