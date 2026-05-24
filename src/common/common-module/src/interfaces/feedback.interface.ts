
export interface IFeedbackPayload {
    customerID: number
    feedback?: string
    rating: number
    leadID: number
    appVersion?: string
}

export interface IFeedback {
    feedbackID?: number
    customerID: number
    feedback?: string
    rating: number
    leadID: number
    created_at?: Date
    app_version?: string
}

export type TSelectFeedback = keyof IFeedback

export interface IFeedbackList {
    page: number
    limit: number
}

export interface IFeedbackListResponse {
    feedbacks: IFeedback[]
    totalCount: number
    page: number
    limit: number
}