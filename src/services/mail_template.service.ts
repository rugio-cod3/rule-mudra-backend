import MailTemplateModel from '@/database/mysql/mail_template'
import {
  IMailTemplate,
  TSelectMainTemplate,
} from '@/interfaces/mail_template.interface'

class MailTemplateService {
  private mailTemplateModel = new MailTemplateModel()

  public async findOne(
    where: Partial<IMailTemplate>,
    select: TSelectMainTemplate[] | ['*'] = ['*'],
  ): Promise<IMailTemplate> {
    return await this.mailTemplateModel.findOneMailTemplate(where, select)
  }
}

export default MailTemplateService
