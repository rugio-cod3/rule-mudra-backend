export interface ISourcePartner {
  id: number // int, auto-increment, primary key
  image: string
  name: string
  link: string
  status: string // enum 0,1 default 1
  created_at: Date
  updated_at: Date
}

export type TSelectSourcePartner = keyof ISourcePartner
