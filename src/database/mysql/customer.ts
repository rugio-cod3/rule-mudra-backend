import { ICustomer, TSelectCustomer } from "@/interfaces/customer.interface";
import {
  SelectFields,
  SortCriteria,
  UpdateQuery,
  WhereQuery,
} from "@/types/model.types";
import { logger } from "@/utils/logger";
import { getKnexInstance, runQuery } from "@/utils/mysql";
import { format } from "date-fns";

export default class CustomerModel {
  private table = "customer";

  get CustomerKnex() {
    let db = getKnexInstance();
    return db(this.table);
  }

  public async getCustomer(mobile: number): Promise<[]> {
    const sql = `SELECT * FROM ${this.table} WHERE mobile = ${mobile} LIMIT 1`;
    try {
      const result = await runQuery(sql);
      if (result.length === 0) {
        return [];
      } else {
        return result[0];
      }
    } catch (error) {
      logger.error(error);
      return [];
    }
  }
  // New Code
  async findOneCustomer(
    where: WhereQuery<ICustomer>,
    select: SelectFields<TSelectCustomer> = ["*"],
    order?: SortCriteria<TSelectCustomer>,
  ): Promise<ICustomer> {
    let db = getKnexInstance();
    let query = db
      .table(this.table)
      .where(where)
      .select(...select);

    if (order) {
      query.orderBy(order);
    }

    return await query.first();
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

  public async saveCustomer(mobile: number, plateform: string = "rulemudra") {
    const insertedData = {
      gender: "NA",
      dob: "1970-01-01",
      mobile: mobile,
      email: "NA",
      password: "NA",
      employeeType: "Not Employed",
      // plateform: plateform,
      // status: 'Incomplete',
      createdDate: format(new Date(), "yyyy-MM-dd HH:mm:ss"),
    };
    if (insertedData) {
      const columns = Object.keys(insertedData);
      const values = Object.values(insertedData);
      const sql = `
        INSERT INTO ${this.table} (${columns.map((col) => col).join(",")})
        VALUES (${values.map(() => "?").join(",")})
      `;

      try {
        const [resultSetHeader] = await runQuery(sql, values);
        // console.log("save", resultSetHeader.insertId)
        return resultSetHeader;
      } catch (error) {
        logger.error(error);
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
        return false;
      }

      const sql = `UPDATE ${this.table} SET ${col} = ? WHERE customerID = ?`;

      const updateObjResp = await runQuery(sql, [val, counsmer_id]);

      return updateObjResp;
    } catch (error) {
      logger.error(error);
      return false;
    }
  }

  public async getCustomerById(customerId: number) {
    const sql = `SELECT * FROM ${this.table} WHERE customerID=${customerId}`;
    try {
      const getObjResp = await runQuery(sql);
      return getObjResp[0];
    } catch (error) {
      logger.error(error);
      return [];
    }
  }

  public async findOneAndUpdate(
    where: WhereQuery<ICustomer>,
    update: UpdateQuery<ICustomer>,
  ): Promise<number> {
    let db = getKnexInstance();
    return await db.table(this.table).where(where).update(update);
  }
}

export const customerModel = new CustomerModel();
