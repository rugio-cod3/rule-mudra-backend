export interface IMailTemplate {
  id: number
  name: string
  subject: string
  message: string
}
export interface IEmailSendData {
  to: string
  from: string
  subject: string
  body: string
  content?: string
  attachmentName?: string
}

export type TSelectMainTemplate = keyof IMailTemplate
