export interface IExperianHardPullGetRequest {
    EXPERIAN_HARDPULL_URL: string
    EXPERIAN_HARDPULL_METHOD: string
    EXPERIAN_HARDPULL_USERNAME: string
    EXPERIAN_HARDPULL_PASSWORD: string
    EXPERIAN_HARDPULL_CONTENT_TYPE: string
}

export interface IExperianRequestConfig {
    method: string
    url: string
    headers: {
        'Content-Type': string
    }
    data: string
}

export interface IExperianSoapRequest {
    'soapenv:Envelope': {
        $: {
            'xmlns:soapenv': string
            'xmlns:urn': string
        }
        'soapenv:Header': {}
        'soapenv:Body': {
            'urn:process': {
                'urn:in': {
                    INProfileRequest: {
                        Identification: {
                            XMLUser: string
                            XMLPassword: string
                        }
                        Application: {
                            FTReferenceNumber: string
                            CustomerReferenceID: string
                            EnquiryReason: string
                            FinancePurpose: string
                            AmountFinanced: string
                            DurationOfAgreement: string
                            ScoreFlag: string
                            PSVFlag: string
                        }
                        Applicant: {
                            Surname: string
                            FirstName: string
                            MiddleName1: string
                            MiddleName2: string
                            MiddleName3: string
                            GenderCode: number
                            IncomeTaxPAN: string
                            PANIssueDate: string
                            PANExpirationDate: string
                            PassportNumber: string
                            PassportIssueDate: string
                            PassportExpirationDate: string
                            VoterIdentityCard: string
                            VoterIDIssueDate: string
                            VoterIDExpirationDate: string
                            DriverLicenseNumber: string
                            DriverLicenseIssueDate: string
                            DriverLicenseExpirationDate: string
                            RationCardNumber: string
                            RationCardIssueDate: string
                            RationCardExpirationDate: string
                            UniversalIDNumber: string
                            UniversalIDIssueDate: string
                            UniversalIDExpirationDate: string
                            DateOfBirth: string
                            STDPhoneNumber: string
                            PhoneNumber: string
                            TelephoneExtension: string
                            TelephoneType: string
                            MobilePhone: string
                            EMailId: string
                        }
                        Details: {
                            Income: string
                            MaritalStatus: string
                            EmployStatus: string
                            TimeWithEmploy: string
                            NumberOfMajorCreditCardHeld: string
                        }
                        Address: {
                            FlatNoPlotNoHouseNo: string
                            BldgNoSocietyName: string
                            RoadNoNameAreaLocality: string
                            City: string
                            Landmark: string
                            State: string
                            PinCode: string
                        }
                        AdditionalAddressFlag: {
                            Flag: string
                        }
                        AdditionalAddress: {
                            FlatNoPlotNoHouseNo: string
                            BldgNoSocietyName: string
                            RoadNoNameAreaLocality: string
                            City: string
                            Landmark: string
                            State: string
                            PinCode: string
                        }
                    }
                }
            }
        }
    }
}

export interface ICreditProfileHeader {
    ReportNumber?: string
}

export interface ICAISAccountDetails {
    CAIS_Holder_Details: any
    CAIS_Holder_Address_Details: any
    CAIS_Holder_Phone_Details: any
    CAIS_Holder_ID_Details: any
    [key: string]: any
}

export interface IExperianResponse {
    INProfileResponse?: {
        UserMessage?: {
            UserMessageText: string
        }
        CreditProfileHeader?: ICreditProfileHeader
        SCORE?: {
            BureauScore: string
        }
        CAIS_Account?: {
            CAIS_Account_DETAILS: ICAISAccountDetails[] | ICAISAccountDetails | string | null
        }
    }
}

export interface ICustomerLeadDetails {
    customerID: number
    firstName: string
    lastName: string
    middlename?: string
    gender: string
    pancard: string
    mobile: string
    email: string
    address: string
    city: string
    state: string
    pincode: string
    dob: Date
}

export interface IState {
    cibil_state_code: string
}

export enum ApiBypassTypes {
    EXPERIAN = 'EXPERIAN'
}