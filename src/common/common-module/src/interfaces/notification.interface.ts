export interface ISendingSMSBody {
  mobile: number
  otp: number
  body_message: string
  template_id: string
  entityID: string
}

export interface ISendingEmailBody {
  form_email: string
  to_email: string
  subject: string
  body_message: string
  attachment?: string
  ext?: string
}

export interface INotification {
  notificationID: number
  customerID: number
  leadID: number
  notification: string
  type: string
  subject: string
  createdDate: Date
  mtype: string
  uid: number
}

export type TSelectNotification = keyof INotification
