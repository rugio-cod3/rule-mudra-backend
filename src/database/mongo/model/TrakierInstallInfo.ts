import { ITrakierInstallInfo } from '@/interfaces/trakierInstallInfo' 
import { model, Schema, Document } from 'mongoose'

export const DOCUMENT_NAME = 'TrakierInstallInfo'
export const COLLECTION_NAME = 'trakierInstallInfo'

const schema = new Schema(
  {
    partner: {
      type: String,
    },
    evid: {
      type: String,
    },
    eval: {
        type: String,
    },
    ets:{
        type: String,
    },
    crtd:{
        type: String,
    },
    cuid:{
        type: String,
    },
    cname:{
        type: String,
    },
    cphone:{
        type: String,
    },
    cmail:{
        type: String,
    },
    inside:{
        type: String,
    },

  },
  { timestamps: true },
)

export const TrakierInstallInfoModel = model<ITrakierInstallInfo>(
  DOCUMENT_NAME,
  schema,
  COLLECTION_NAME,
)