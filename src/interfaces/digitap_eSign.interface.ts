// Digitap E-Sign interfaces that maintain compatibility with existing SurePass interfaces

export interface IDigitapEsignInitiateRequestPayload {
    callback_url: string;
    customerID: number;
}

export interface IDigitapEsignInitiateResponse {
    status_code?: number;
    message_code?: string;
    message: string;
    success: boolean;
    data?: {
        client_id: string;
        group_id?: string;
        token: string;
        url: string;
    };
}

export interface IDigitapEsignStatusResponse {
    status_code?: number;
    message_code?: string;
    message: string;
    success: boolean;
    data?: {
        client_id: string;
        status?: string;
        completed: boolean;
        esign_error: boolean;
        error_message_from_nsdl: string;
    };
}

export interface IDigitapEsignReportResponse {
    status_code?: number;
    message_code?: string;
    message: string;
    success: boolean;
    data?: {
        client_id: string;
        status?: string;
        name_match?: {
            name?: string;
            name_matched?: boolean;
            name_match_score?: string;
            aaadhar_last_four_digits?: string;
            year_of_birth?: string;
            gender?: string;
        };
    };
}

export interface IDigitapEsignDocResponse {
    status_code?: number;
    message_code?: string;
    message: string;
    success: boolean;
    data?: {
        url: string;
    };
}

// Digitap specific interfaces for internal API calls

export interface IDigitapGenerateEsignRequest {
    uniqueId: string;
    signers: Array<{
        email: string;
        location: string;
        mobile: string;
        name: string;
    }>;
    reason: string;
    templateId: string;
    fileName: string;
    multiSignerDocId: string;
}

export interface IDigitapGenerateEsignResponse {
    code: string;
    model: {
        docId: string;
        url: string;
    };
}

export interface IDigitapGetEsignDocRequest {
    docId: string;
}

export interface IDigitapGetEsignDocResponse {
    code: string;
    model: {
        docId: string;
        url: string;
        signers: Array<{
            name: string;
            gender: string;
            dob: string;
            email: string;
            mobile: string;
            aadhaarSuffix: string;
            location: string;
            signerName: string;
            signerState: string;
            postalCode: string;
            signerType: string;
            signedOn: string;
            state: "signed" | "pending" | "failed" | "rejected";
        }>;
    };
}

// Webhook interface for Digitap
export interface IDigitapWebhookPayload {
    code: string;
    model: {
        docId: string;
        url: string;
        signers: Array<{
            name: string;
            gender: string;
            dob: string;
            email: string;
            mobile: string;
            aadhaarSuffix: string;
            location: string;
            signerName: string;
            signerState: string;
            postalCode: string;
            signerType: string;
            signedOn: string;
            state: "signed" | "pending" | "failed" | "rejected";
        }>;
    };
}