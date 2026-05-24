import {
  IMailTemplate,
  TSelectMainTemplate,
} from '@/interfaces/mail_template.interface'
import { getKnexInstance } from '@/utils/mysql'

export default class MailTemplateModel {
  private table = 'mail_template'

  async findOneMailTemplate(
    where: Partial<IMailTemplate>,
    select: TSelectMainTemplate[] | ['*'] = ['*'],
  ): Promise<IMailTemplate> {
    const db = getKnexInstance();
    return await db.table(this.table)
      .where(where)
      .select(...select)
      .first()
  }
  // ! Remove this
  // public async getMailTemplate(
  //   where: {},
  //   order: { orderKey: string; orderValue: string },
  //   select: string[],
  // ): Promise<IMailTemplate[] | null> {
  //   try {
  //     let db = getKnexInstance()
  //     let mail_template = await db(this.table)
  //       .where(where)
  //       .select(...select)
  //       .orderBy(order.orderKey, order.orderValue)
  //     if (mail_template == null || mail_template.length == 0) {
  //       return null
  //     } else {
  //       return mail_template // Return the first lead if found
  //     }
  //   } catch (error) {
  //     logger.error(
  //       'Error Inside mail_template.ts getMailTemplate function',
  //       error,
  //     )
  //   }
  // }
}
