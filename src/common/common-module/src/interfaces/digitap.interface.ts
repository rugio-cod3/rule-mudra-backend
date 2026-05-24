interface IResult {
  is_same_face: boolean
  is_person_image_blurry: boolean
  is_card_image_blurry: boolean
  same_face_confidence: number
  person_image_correctly_identified: boolean
  card_image_correctly_identified: boolean
}

export interface IApiMsg {
  status: string
  statusCode: string
  result: IResult
  clientRefId: string
  reqId: string
}

export interface IDigitapResponse {
  is_success: boolean
  apimsg: IApiMsg
}

export interface IResponseDigitap {
  digitapResponse: IDigitapResponse
}
