import { ChatbotContentType, ChatbotQueryCategory, ChatbotQueryStatus } from '../enums/chatbot.enum'

// Chatbot Stage Interfaces
export interface IChatbotStage {
  id: number
  stage_key: string
  stage_name: string
  created_at: Date
  updated_at: Date
}

export interface ICreateStagePayload {
  stage_key: string
  stage_name: string
}

export interface IUpdateStagePayload extends ICreateStagePayload {
  id: number
}

export interface IStageOperationResponse {
  data: IChatbotStage
}

export type TSelectChatbotStage = keyof IChatbotStage

// Chatbot Stage Content Interfaces
export interface IChatbotStageContent {
  id: number
  stage_id: number
  content_type: ChatbotContentType
  question_text: string | null
  answer_text: string
  is_active: boolean
  created_at: Date
  updated_at: Date
}

export type TSelectChatbotStageContent = keyof IChatbotStageContent

// Chatbot Customer Query Interfaces
export interface IChatbotCustomerQuery {
  id: number
  customer_id: number | null
  query_category: ChatbotQueryCategory
  query_text: string
  attachment_url: string | null
  status: ChatbotQueryStatus
  created_at: Date
  updated_at: Date
}

export type TSelectChatbotCustomerQuery = keyof IChatbotCustomerQuery

// API Payload Interfaces for CRM

// Stage Management
export interface IGetStagesResponse {
  data: IChatbotStage[]
  pagination: {
    current_page: number
    total_pages: number
    total_items: number
    per_page: number
  }
}

// Content Management
export interface IGetContentQuery {
  stage_id: number
  content_type?: ChatbotContentType
  is_active?: boolean
  page?: number
  limit?: number
}

export interface ICreateContentPayload {
  stage_id: number
  content_type: ChatbotContentType
  question_text?: string | null
  answer_text: string
  is_active?: boolean
}

export interface IUpdateContentPayload extends ICreateContentPayload {
  id: number
}

export interface IGetContentResponse {
  data: IChatbotStageContent[]
  meta: {
    stage_name: string
    total_content: number
    active_content: number
  }
}

// Query Management Interfaces
export interface ICreateQueryPayload {
  query_category: ChatbotQueryCategory
  query_text: string
  attachment: Express.Multer.File | undefined // Optional file attachment
}

export interface ICreateQueryResponse {
  data: IChatbotCustomerQuery
}

// Query Management
export interface IGetQueriesQuery {
  status?: ChatbotQueryStatus
  category?: ChatbotQueryCategory
  startDate?: string
  endDate?: string
  page?: number
  limit?: number
  search?: string
  sort?: 'created_at' | 'updated_at' | 'status' | 'id'
  order?: 'asc' | 'desc'
}

export interface IUpdateQueryStatusPayload {
  status: ChatbotQueryStatus
  resolution_notes?: string
}

export interface IGetQueriesResponse {
  data: IQueryDetailsResponse[]
  pagination: {
    current_page: number
    total_pages: number
    total_items: number
    per_page: number
  }
  filters_applied: {
    status?: string
    category?: string
  }
}

export interface IQueryDetailsResponse {
  data: IChatbotCustomerQuery & {
    customer_name?: string
    customer_email?: string
    customer_mobile?: string
    related_queries?: IChatbotCustomerQuery[]
  }
}

// Content Creation/Update specific interfaces
export interface IContentCreationResponse {
  data: IChatbotStageContent
}

export interface IContentDeletionResponse {
  deleted_id: number
  message: string
}
