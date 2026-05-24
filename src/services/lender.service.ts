import ResponseService from '@/services/response.service'
import { IServiceResponse } from '@/interfaces/service.interface'

import { getEncryptedObject } from '@/utils/AESEncryption'
import { lenderCredsModel } from '@/database/mysql/lender_creds'
import { leadModel } from '@/database/mysql/leads'


import {LenderCredentials} from "@/enums/lender.enum"

import { ILenderCreds, IUpdateLenderCreds ,IGetLenderCreds } from '@/interfaces/lender_creds.interface'
import { lenderModel } from '@/common/common-module/src/database/mysql/lender'


export class LenderService extends ResponseService  {

    public lenderCredsModel=lenderCredsModel
    public leadModel=leadModel
    public lenderModel= lenderModel
 
    public async AddCredentials(
    payload: ILenderCreds,
    ): Promise<IServiceResponse> {

    const encryptedCreds=getEncryptedObject(payload.credentials);

    await lenderCredsModel.insert({
        ...payload
    })
    return this.serviceResponse(200, {}, 'Add Lender Credentials')
    }


    public async updateCredentials(
        payload: IUpdateLenderCreds,
        ): Promise<IServiceResponse> {
    
        const encryptedCreds=getEncryptedObject(payload.credentials);

        const lenderCreds=await this.lenderCredsModel.findOne({
            where: {
                lenderID:payload.lenderID,
                cred_name:payload.cred_name
            },
            select:['credentials']
        })

        if(!lenderCreds)
        {
            return this.serviceResponse(200, {}, 'No Lender Found')
        }
       await this.lenderCredsModel.findOneAndUpdate(
        {
          lenderID: payload.lenderID,
          cred_name: payload.cred_name
        },
        {
          credentials: JSON.stringify({
            ...lenderCreds.credentials,
            ...encryptedCreds
          })
        }
      );
      
        return this.serviceResponse(200, {}, 'Update Lender Credentials')
        }

        public async getCredentials(
          payload: IGetLenderCreds,
          ): Promise<IServiceResponse> {
  
         const lead = await this.leadModel.findOne({
            where: {
                leadID: payload.leadID
            },
            select: ['leadID' , 'lenderID']
         })

          if(!lead)
          {
              return this.serviceResponse(200, {}, 'No Lead Found')
          }

          const lenderCreds = await this.lenderCredsModel.find({
            where: { lenderID: lead.lenderID },
            whereIn: [
              {
                column: 'cred_name',
                value: [LenderCredentials.RAZORPAY_EMANDATE, LenderCredentials.RAZORPAY_PENNY, LenderCredentials.RAZORPAY_DISBURSAL]
               
              }
            ],
            select: ['credentials' , 'cred_name']
          })

          const lender = await this.lenderModel.findOne(
            {
                lenderID: lead.lenderID
            },
            ['lenderID' , 'name' , 'lender_info']
          )

          const lenderDetails = {
            lenderID: lender?.lenderID,
            name: lender?.name,
            displayName: lender?.lender_info?.lenderName
          }
          
          if (!lenderCreds) {
            return this.serviceResponse(200, {}, 'No Lender Found')
          }
          
          const lenderCredsMapped = Object.fromEntries(
            lenderCreds.map((item) => [item.cred_name, item.credentials])
          )
          
          return this.serviceResponse(200, { lenderCreds: lenderCredsMapped , lenderDetails }, 'Get Lender Credentials')
          
          }

}

export const lenderService=new LenderService()