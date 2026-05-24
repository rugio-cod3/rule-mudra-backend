import axios, { HttpStatusCode } from 'axios'
import xml2js from 'xml2js'
import { Request, Response } from 'express'

class ExperianTestService {

    private EXPERIAN_CONFIG = {
        EXPERIAN_HARDPULL_URL: 'https://connectuat.experian.in/nextgen-ind-pds-webservices-cbv2/endpoint',
        EXPERIAN_HARDPULL_USERNAME: 'cpu2yashik_uat01',
        EXPERIAN_HARDPULL_PASSWORD: 'Yashik@nexiloan@15',
        EXPERIAN_HARDPULL_METHOD: 'POST',
        EXPERIAN_HARDPULL_CONTENT_TYPE: 'application/xml'
    }

    private TEST_CUSTOMER = {
        firstName: 'Tilak',
        lastName: 'Sen',
        middlename: '',
        gender: 'Male',
        pancard: 'TFPPS4289C',
        mobile: '9295390875',
        email: 'tilaksen1996@gmail.com',
        address: 'Chinar5 CHS, SV Raod 5',
        city: "MUMBAI",
        pincode: '400005',
        dob: '1976-08-17',
        cibil_state_code: '27'
    }

    public hardPullExperian = async (req: Request, res: Response): Promise<void> => {
        try {
            console.log('🚀 Starting Experian API test...')

            const { xmlRequest, requestData } = this.createExperianPayload(this.TEST_CUSTOMER, this.EXPERIAN_CONFIG)

            console.log('📝 Generated XML Request:')
            console.log(xmlRequest)
            console.log('\n' + '='.repeat(50) + '\n')

            const response = await axios({
                method: this.EXPERIAN_CONFIG.EXPERIAN_HARDPULL_METHOD,
                url: this.EXPERIAN_CONFIG.EXPERIAN_HARDPULL_URL,
                headers: {
                    'Content-Type': this.EXPERIAN_CONFIG.EXPERIAN_HARDPULL_CONTENT_TYPE,
                },
                data: xmlRequest,
            })

            console.log('✅ API Response Status:', response.status)
            console.log('📄 Raw Response:')
            console.log(response.data)

            const parser = new xml2js.Parser({ explicitArray: false })

            parser.parseString(response.data, (err, result) => {
                if (err) {
                    console.error('❌ Error parsing SOAP XML:', err)
                    return res.status(HttpStatusCode.InternalServerError).json({
                        statusCode: HttpStatusCode.InternalServerError,
                        message: 'Error parsing SOAP XML',
                        error: err.message
                    })
                }

                console.log('\n' + '='.repeat(50) + '\n')
                console.log('🔍 Parsed SOAP Response:')
                console.log(JSON.stringify(result, null, 2))

                try {
                    const innerXml = result['SOAP-ENV:Envelope']['SOAP-ENV:Body']['ns2:processResponse']['ns2:out']

                    if (innerXml) {
                        console.log('\n' + '='.repeat(50) + '\n')
                        console.log('📋 Inner XML Content:')
                        console.log(innerXml)

                        parser.parseString(innerXml, (innerErr, innerResult) => {
                            if (innerErr) {
                                console.error('❌ Error parsing inner XML:', innerErr)
                                return res.status(HttpStatusCode.InternalServerError).json({
                                    statusCode: HttpStatusCode.InternalServerError,
                                    message: 'Error parsing inner XML',
                                    error: innerErr.message
                                })
                            }

                            console.log('\n' + '='.repeat(50) + '\n')
                            console.log('🎯 Final Parsed Response:')
                            console.log(JSON.stringify(innerResult, null, 2))

                            let keyInfo = {
                                creditScore: '',
                                statusMessage: '',
                                reportNumber: ''
                            }
                            if (innerResult.INProfileResponse) {
                                const score = innerResult.INProfileResponse.SCORE?.BureauScore
                                const message = innerResult.INProfileResponse.UserMessage?.UserMessageText
                                const reportNumber = innerResult.INProfileResponse.CreditProfileHeader?.ReportNumber

                                keyInfo = {
                                    creditScore: score || 'Not available',
                                    statusMessage: message || 'Not available',
                                    reportNumber: reportNumber || 'Not available'
                                }

                                console.log('\n' + '='.repeat(50) + '\n')
                                console.log('📊 Key Information:')
                                console.log(`Credit Score: ${keyInfo.creditScore}`)
                                console.log(`Status Message: ${keyInfo.statusMessage}`)
                                console.log(`Report Number: ${keyInfo.reportNumber}`)
                            }

                            res.status(HttpStatusCode.Ok).json({
                                statusCode: HttpStatusCode.Ok,
                                message: 'Experian API test successful',
                                data: {
                                    rawResponse: response.data,
                                    parsedResponse: innerResult,
                                    keyInformation: keyInfo,
                                    requestPayload: requestData
                                }
                            })
                        })
                    } else {
                        res.status(HttpStatusCode.Ok).json({
                            statusCode: HttpStatusCode.Ok,
                            message: 'Experian API response received but no inner XML found',
                            data: {
                                rawResponse: response.data,
                                parsedResponse: result
                            }
                        })
                    }
                } catch (extractError) {
                    console.error('❌ Error extracting inner XML:', extractError)
                    res.status(HttpStatusCode.InternalServerError).json({
                        statusCode: HttpStatusCode.InternalServerError,
                        message: 'Error extracting inner XML',
                        error: extractError.message
                    })
                }
            })

        } catch (error) {
            console.error('❌ API Call Failed:')
            console.error('Status:', error.response?.status)
            console.error('Status Text:', error.response?.statusText)
            console.error('Response Data:', error.response?.data)
            console.error('Error Message:', error.message)

            res.status(error.response?.status || HttpStatusCode.InternalServerError).json({
                statusCode: error.response?.status || HttpStatusCode.InternalServerError,
                message: 'Experian API test failed',
                error: {
                    status: error.response?.status,
                    statusText: error.response?.statusText,
                    responseData: error.response?.data,
                    message: error.message
                }
            })
        }
    }

    private createExperianPayload(customerDetails: any, lenderCreds: any) {
        const genderCode = this.getGenderCode(customerDetails.gender)
        const formattedDob = this.formatDate(customerDetails.dob)

        const requestData = {
            'soapenv:Envelope': {
                $: {
                    'xmlns:soapenv': 'http://schemas.xmlsoap.org/soap/envelope/',
                    'xmlns:urn': 'urn:cbv2',
                },
                'soapenv:Header': {},
                'soapenv:Body': {
                    'urn:process': {
                        'urn:in': {
                            INProfileRequest: {
                                Identification: {
                                    XMLUser: lenderCreds.EXPERIAN_HARDPULL_USERNAME,
                                    XMLPassword: lenderCreds.EXPERIAN_HARDPULL_PASSWORD,
                                },
                                Application: {
                                    FTReferenceNumber: '',
                                    CustomerReferenceID: '',
                                    EnquiryReason: '13',
                                    FinancePurpose: '99',
                                    AmountFinanced: '5000',
                                    DurationOfAgreement: '6',
                                    ScoreFlag: '3',
                                    PSVFlag: '0',
                                },
                                Applicant: {
                                    Surname: customerDetails.lastName,
                                    FirstName: customerDetails.firstName || customerDetails.lastName,
                                    MiddleName1: customerDetails.middlename,
                                    MiddleName2: '',
                                    MiddleName3: '',
                                    GenderCode: genderCode,
                                    IncomeTaxPAN: customerDetails.pancard,
                                    PANIssueDate: '',
                                    PANExpirationDate: '',
                                    PassportNumber: '',
                                    PassportIssueDate: '',
                                    PassportExpirationDate: '',
                                    VoterIdentityCard: '',
                                    VoterIDIssueDate: '',
                                    VoterIDExpirationDate: '',
                                    DriverLicenseNumber: '',
                                    DriverLicenseIssueDate: '',
                                    DriverLicenseExpirationDate: '',
                                    RationCardNumber: '',
                                    RationCardIssueDate: '',
                                    RationCardExpirationDate: '',
                                    UniversalIDNumber: '',
                                    UniversalIDIssueDate: '',
                                    UniversalIDExpirationDate: '',
                                    DateOfBirth: formattedDob,
                                    STDPhoneNumber: '',
                                    PhoneNumber: customerDetails.mobile,
                                    TelephoneExtension: '',
                                    TelephoneType: '',
                                    MobilePhone: '',
                                    EMailId: customerDetails.email,
                                },
                                Details: {
                                    Income: '',
                                    MaritalStatus: '',
                                    EmployStatus: '',
                                    TimeWithEmploy: '',
                                    NumberOfMajorCreditCardHeld: '',
                                },
                                Address: {
                                    FlatNoPlotNoHouseNo: customerDetails.address,
                                    BldgNoSocietyName: customerDetails.city,
                                    RoadNoNameAreaLocality: '',
                                    City: customerDetails.city,
                                    Landmark: '',
                                    State: customerDetails.cibil_state_code,
                                    PinCode: customerDetails.pincode,
                                },
                                AdditionalAddressFlag: {
                                    Flag: 'N',
                                },
                                AdditionalAddress: {
                                    FlatNoPlotNoHouseNo: '',
                                    BldgNoSocietyName: '',
                                    RoadNoNameAreaLocality: '',
                                    City: '',
                                    Landmark: '',
                                    State: '',
                                    PinCode: '',
                                },
                            },
                        },
                    },
                },
            },
        }

        const builder = new xml2js.Builder({ headless: true })
        const xmlRequest = builder.buildObject(requestData)

        return { xmlRequest, requestData }
    }

    private formatDate(dateString: string): string {
        const date = new Date(dateString)
        const year = date.getFullYear()
        const month = String(date.getMonth() + 1).padStart(2, '0')
        const day = String(date.getDate()).padStart(2, '0')
        return `${year}${month}${day}`
    }

    private getGenderCode(gender: string): number {
        let GenderCode: number = 1
        if (gender === 'Female') {
            GenderCode = 2
        } else if (gender === 'Transgender') {
            GenderCode = 3
        }
        return GenderCode
    }
}

export default ExperianTestService



