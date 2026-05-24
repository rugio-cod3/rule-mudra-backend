export interface IRazorPayPayoutContactsModel {
  payoutID?: number
  customerID: string
  leadID: string
  cont_id: string
  cont_entity: string
  cont_name: string
  cont_contact: string
  cont_email: string
  cont_type: string
  cont_reference_id: string
  cont_batch_id: string
  cont_active: string
  cont_notes_key_1: string
  cont_notes_key_2: string
  createdDate: Date
  uid: string
  iu_date?: string
}

export type TRazorPayPayoutContacts = keyof IRazorPayPayoutContactsModel
