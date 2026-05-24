export interface ILeadsAutoStatusModel{
    id?:number
    type?:number
    agent_id?:number
    lead_ids?:string;
    created_at?:Date
}

export type TSelectLeadsAutoStatus = keyof ILeadsAutoStatusModel;