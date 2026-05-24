export interface IMobileToken {
  id: number // Auto-increment primary key
  customerID: string // VARCHAR(256)
  mobile: string // VARCHAR(256)
  appID: string // VARCHAR(512)
  credatedDate: Date // DATETIME
  imei: string // VARCHAR(256)
  access_token: string // VARCHAR(255)
  last_login: Date // DATETIME
  android_id: string // VARCHAR(255)
  firebase_token: string // VARCHAR(255)
  jwt_access_token: string
}

export type TSelectMobileToken = keyof IMobileToken
