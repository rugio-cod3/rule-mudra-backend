import { ApiType, Status } from "../enums/switchThirdPartyApi.enum"
import { ThirdPartAPI } from "../enums/thirdPartyApi.enum"

export interface ISwitchThirdPartyApiModel {
    id?: number
    api_type?:ApiType
    vendor?:ThirdPartAPI
    status?: Status
    failed_count?:number
  }
  

export type TSwitchThirdPartyApi = keyof ISwitchThirdPartyApiModel