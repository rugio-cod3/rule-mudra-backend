import {
  ICreateLoginOTP,
  TSelectICreateLoginOTP,
} from "@/interfaces/loginOtp.interface";
import { InsertData, KnexFindParams, WhereQuery } from "@/types/model.types";
import { getKnexInstance } from "@/utils/mysql";
import { UpdateQuery } from "mongoose";

export default class LoginOtpModel {
  private table = "otp";

  async insert(data: InsertData<ICreateLoginOTP>): Promise<number[]> {
    let db = getKnexInstance();
    return await db(this.table).insert(data);
  }

  async find(
    params: KnexFindParams<ICreateLoginOTP, TSelectICreateLoginOTP>
  ): Promise<ICreateLoginOTP[]> {
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
        query.where(where).first();
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

  async update(
    where: WhereQuery<ICreateLoginOTP>,
    update: UpdateQuery<ICreateLoginOTP>
  ): Promise<number> {
    let db = getKnexInstance();
    return await db(this.table).where(where).update(update);
  }
}

export const otpModel = new LoginOtpModel();
