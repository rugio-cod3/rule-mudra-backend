import { Document, Types } from 'mongoose'

export interface ITrakierInstallInfo extends Document {
    partner:string,
    evid:string,
    eval:string,
    ets:string,
    crtd:string,
    cuid:string,
    cname:string,
    cphone:string,
    cmail:string,
    inside:string
}