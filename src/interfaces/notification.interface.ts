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