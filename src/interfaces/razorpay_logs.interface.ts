export interface IRazorpayLog {
    id?: number; // Primary key, unique identifier
    customerID: number; // Customer identifier
    leadID: number; // Lead identifier
    req_url: string; // URL of the request (up to 500 characters)
    api_request: string; // API request as a long text
    api_response: string; // API response as a long text
    type: string; // Type of the log (up to 200 characters)
    created_at?: Date; // Date and time the log entry was created
}
