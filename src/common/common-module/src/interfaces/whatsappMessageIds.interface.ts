export interface IWhatsappMessageIds {
  id?: number
  wc_id: string
  template_name: string
  leadID: number
  lead_status: string
  send_from: string
  user_id: number
  created_at?: Date
  updated_at?: Date
  iu_date?: Date
}

export type TSelectWhatsappMessageIds = keyof IWhatsappMessageIds
