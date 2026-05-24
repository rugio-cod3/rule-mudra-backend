function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
    try {
        var info = gen[key](arg);
        var value = info.value;
    } catch (error) {
        reject(error);
        return;
    }
    if (info.done) {
        resolve(value);
    } else {
        Promise.resolve(value).then(_next, _throw);
    }
}
function _async_to_generator(fn) {
    return function() {
        var self = this, args = arguments;
        return new Promise(function(resolve, reject) {
            var gen = fn.apply(self, args);
            function _next(value) {
                asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
            }
            function _throw(err) {
                asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
            }
            _next(undefined);
        });
    };
}
function _class_call_check(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}
function _defineProperties(target, props) {
    for(var i = 0; i < props.length; i++){
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
    }
}
function _create_class(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
}
function _define_property(obj, key, value) {
    if (key in obj) {
        Object.defineProperty(obj, key, {
            value: value,
            enumerable: true,
            configurable: true,
            writable: true
        });
    } else {
        obj[key] = value;
    }
    return obj;
}
function _ts_generator(thisArg, body) {
    var f, y, t, _ = {
        label: 0,
        sent: function() {
            if (t[0] & 1) throw t[1];
            return t[1];
        },
        trys: [],
        ops: []
    }, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype), d = Object.defineProperty;
    return d(g, "next", {
        value: verb(0)
    }), d(g, "throw", {
        value: verb(1)
    }), d(g, "return", {
        value: verb(2)
    }), typeof Symbol === "function" && d(g, Symbol.iterator, {
        value: function() {
            return this;
        }
    }), g;
    function verb(n) {
        return function(v) {
            return step([
                n,
                v
            ]);
        };
    }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while(g && (g = 0, op[0] && (_ = 0)), _)try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [
                op[0] & 2,
                t.value
            ];
            switch(op[0]){
                case 0:
                case 1:
                    t = op;
                    break;
                case 4:
                    _.label++;
                    return {
                        value: op[1],
                        done: false
                    };
                case 5:
                    _.label++;
                    y = op[1];
                    op = [
                        0
                    ];
                    continue;
                case 7:
                    op = _.ops.pop();
                    _.trys.pop();
                    continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
                        _ = 0;
                        continue;
                    }
                    if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
                        _.label = op[1];
                        break;
                    }
                    if (op[0] === 6 && _.label < t[1]) {
                        _.label = t[1];
                        t = op;
                        break;
                    }
                    if (t && _.label < t[2]) {
                        _.label = t[2];
                        _.ops.push(op);
                        break;
                    }
                    if (t[2]) _.ops.pop();
                    _.trys.pop();
                    continue;
            }
            op = body.call(thisArg, _);
        } catch (e) {
            op = [
                6,
                e
            ];
            y = 0;
        } finally{
            f = t = 0;
        }
        if (op[0] & 5) throw op[1];
        return {
            value: op[0] ? op[1] : void 0,
            done: true
        };
    }
}
import config from '@/config/default';
import axios from 'axios';
import { leadsApiLogModel } from '../../database/mysql/leadApiLogs';
import UserMetaDataService from '../../database/mysql/userMetadata';
import { ApiSupplierType, SurePassApiUrl } from '../../enums/common.enum';
import { LeadLogApiType } from '../../enums/leadApiLogs.enum';
import { logger } from '../../utils/logger';
import AxiosService from '..//api.service';
import LeadApiLogService from '../leadApiLog.service';
import LeadApiLogMongoDBService from '../leadApiLogMongo.service';
import S3Service from './s3.service';
var SurepassService = /*#__PURE__*/ function() {
    "use strict";
    function SurepassService() {
        _class_call_check(this, SurepassService);
        _define_property(this, "leadApiLogService", new LeadApiLogService());
        _define_property(this, "userMetaDataService", new UserMetaDataService());
        _define_property(this, "leadApiLogMongoDBService", new LeadApiLogMongoDBService());
        _define_property(this, "s3Service", new S3Service());
        _define_property(this, "baseUrl", "".concat(config.surePassApi, "/api/v1"));
        _define_property(this, "apiService", new AxiosService(config.surePassApi));
    }
    _create_class(SurepassService, [
        {
            key: "headers",
            value: function headers() {
                return {
                    'Content-Type': 'application/json',
                    Authorization: "Bearer ".concat(config.surePassToken)
                };
            }
        },
        {
            key: "apiCall",
            value: //UT Done
            function apiCall(url, method, headers, body) {
                return _async_to_generator(function() {
                    var response, error;
                    return _ts_generator(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                _state.trys.push([
                                    0,
                                    2,
                                    ,
                                    3
                                ]);
                                return [
                                    4,
                                    axios({
                                        method: method,
                                        url: url,
                                        headers: headers,
                                        data: body
                                    })
                                ];
                            case 1:
                                response = _state.sent();
                                return [
                                    2,
                                    response
                                ];
                            case 2:
                                error = _state.sent();
                                return [
                                    2,
                                    error.response
                                ];
                            case 3:
                                return [
                                    2
                                ];
                        }
                    });
                })();
            }
        },
        {
            key: "generateAadharOtpSurepass",
            value: function generateAadharOtpSurepass(payload) {
                return _async_to_generator(function() {
                    var aadharNo, customerID, mobileNo, result, saveObject, error;
                    return _ts_generator(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                aadharNo = payload.aadharNo, customerID = payload.customerID, mobileNo = payload.mobileNo;
                                return [
                                    4,
                                    this.apiService.call('post', SurePassApiUrl.AADHAR_SEND_OTP, {
                                        id_number: aadharNo
                                    }, undefined, this.headers())
                                ];
                            case 1:
                                result = _state.sent();
                                saveObject = {
                                    customerID: customerID,
                                    api_type: LeadLogApiType.AADHAR_V2_GENERATE_OTP,
                                    api_supplier: ApiSupplierType.SUREPASS,
                                    api_response: JSON.stringify(result.data),
                                    status: result.success ? 1 : 0,
                                    api_endpoint_url: config.surePassApi + SurePassApiUrl.AADHAR_SEND_OTP,
                                    api_method: 'POST',
                                    api_headers: JSON.stringify(this.headers()),
                                    api_request: JSON.stringify({
                                        id_number: aadharNo
                                    }),
                                    mobile_no: String(mobileNo),
                                    aadharNo: aadharNo
                                };
                                return [
                                    4,
                                    this.leadApiLogService.create(saveObject)
                                ];
                            case 2:
                                _state.sent();
                                _state.label = 3;
                            case 3:
                                _state.trys.push([
                                    3,
                                    5,
                                    ,
                                    6
                                ]);
                                return [
                                    4,
                                    this.leadApiLogMongoDBService.create('aadhaarKYC', saveObject)
                                ];
                            case 4:
                                _state.sent();
                                return [
                                    3,
                                    6
                                ];
                            case 5:
                                error = _state.sent();
                                logger.error('Error while saving to MongoDB collection : aadhaarKYC', error);
                                return [
                                    3,
                                    6
                                ];
                            case 6:
                                return [
                                    2,
                                    result
                                ];
                        }
                    });
                }).call(this);
            }
        },
        {
            key: "verifyAadharOtpSurepass",
            value: function verifyAadharOtpSurepass(payload) {
                return _async_to_generator(function() {
                    var client_id, otp, customerID, mobileNo, aadharNo, result;
                    return _ts_generator(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                client_id = payload.client_id, otp = payload.otp, customerID = payload.customerID, mobileNo = payload.mobileNo, aadharNo = payload.aadharNo;
                                return [
                                    4,
                                    this.apiService.call('post', SurePassApiUrl.AADHAR_SUBMIT, {
                                        otp: otp,
                                        client_id: client_id,
                                        aadhaar_pdf_generate: true
                                    }, undefined, this.headers())
                                ];
                            case 1:
                                result = _state.sent();
                                // We will not save aadhar data here
                                return [
                                    2,
                                    result
                                ];
                        }
                    });
                }).call(this);
            }
        },
        {
            key: "verifyAadharOtpBySurepass",
            value: function verifyAadharOtpBySurepass(otp, customerID, mobile) {
                return _async_to_generator(function() {
                    var folder, logData, apiResponse, response, _response_data_data, _response_data, imageData, filename, uploadRes, uploadErr, saveObject, error, _response_data_data1, _response_data1, uploadedImageKey, user_metadata, _response_data_data2, _response_data2, _response_data_data3, _response_data3, _response_data_data4, _response_data4, _response_data_data_aadhaar_number, _response_data_data5, _response_data5, _response_data_data6, _response_data6, _response_data_data7, _response_data7, _response_data_data8, _response_data8, _response_data_data9, _response_data9, metaJSON, address, _response_data_data10, _response_data10, _response_data_data11, _response_data11, _response_data_data12, _response_data12, _response_data_data_aadhaar_number1, _response_data_data13, _response_data13, _response_data_data14, _response_data14, _response_data_data15, _response_data15, _response_data_data16, _response_data16, _response_data_data17, _response_data17, address1, metaJSON1, _response_data18, _response_data19, error1;
                    return _ts_generator(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                _state.trys.push([
                                    0,
                                    19,
                                    ,
                                    20
                                ]);
                                folder = "documents/aadhar_image/".concat(customerID);
                                return [
                                    4,
                                    leadsApiLogModel.findOneLeadsApiLog({
                                        customerID: customerID,
                                        status: 1,
                                        api_type: 'aadhaar-v2-generate-otp'
                                    }, [
                                        'api_response'
                                    ], [
                                        {
                                            column: 'id',
                                            order: 'desc'
                                        }
                                    ])
                                ];
                            case 1:
                                logData = _state.sent();
                                apiResponse = JSON.parse(logData.api_response);
                                return [
                                    4,
                                    this.apiCall("".concat(this.baseUrl, "/aadhaar-v2/submit-otp"), 'POST', this.headers(), {
                                        otp: otp,
                                        client_id: apiResponse === null || apiResponse === void 0 ? void 0 : apiResponse.data.client_id,
                                        aadhaar_pdf_generate: true
                                    })
                                ];
                            case 2:
                                response = _state.sent();
                                if (!response.data.data.profile_image) return [
                                    3,
                                    6
                                ];
                                imageData = response === null || response === void 0 ? void 0 : (_response_data = response.data) === null || _response_data === void 0 ? void 0 : (_response_data_data = _response_data.data) === null || _response_data_data === void 0 ? void 0 : _response_data_data.profile_image;
                                filename = "".concat(customerID.toString(), ".jpg");
                                _state.label = 3;
                            case 3:
                                _state.trys.push([
                                    3,
                                    5,
                                    ,
                                    6
                                ]);
                                return [
                                    4,
                                    this.s3Service.uploadDocument(null, folder, filename, true, imageData)
                                ];
                            case 4:
                                uploadRes = _state.sent();
                                response.data.data.profile_image = uploadRes.Key;
                                return [
                                    3,
                                    6
                                ];
                            case 5:
                                uploadErr = _state.sent();
                                logger.error('Profile image upload failed:', uploadErr);
                                return [
                                    3,
                                    6
                                ];
                            case 6:
                                saveObject = {
                                    customerID: customerID,
                                    api_type: 'aadhaar-v2-submit-otp',
                                    api_supplier: 4,
                                    api_response: JSON.stringify(response.data),
                                    status: 1,
                                    api_endpoint_url: "".concat(this.baseUrl, "/aadhaar-v2/submit-otp"),
                                    api_method: 'POST',
                                    api_headers: JSON.stringify(this.headers()),
                                    api_request: JSON.stringify({
                                        otp: otp,
                                        client_id: apiResponse === null || apiResponse === void 0 ? void 0 : apiResponse.data.client_id
                                    })
                                };
                                return [
                                    4,
                                    this.leadApiLogService.create(saveObject)
                                ];
                            case 7:
                                _state.sent();
                                _state.label = 8;
                            case 8:
                                _state.trys.push([
                                    8,
                                    10,
                                    ,
                                    11
                                ]);
                                return [
                                    4,
                                    this.leadApiLogMongoDBService.create('aadhaarKYC', saveObject)
                                ];
                            case 9:
                                _state.sent();
                                return [
                                    3,
                                    11
                                ];
                            case 10:
                                error = _state.sent();
                                logger.error('Error while saving to MongoDB collection : aadhaarKYC', error);
                                return [
                                    3,
                                    11
                                ];
                            case 11:
                                if (!(response.status == 200)) return [
                                    3,
                                    17
                                ];
                                uploadedImageKey = response === null || response === void 0 ? void 0 : (_response_data1 = response.data) === null || _response_data1 === void 0 ? void 0 : (_response_data_data1 = _response_data1.data) === null || _response_data_data1 === void 0 ? void 0 : _response_data_data1.profile_image;
                                return [
                                    4,
                                    this.userMetaDataService.getUserMetaData({
                                        mobile: mobile.toString()
                                    }, {
                                        orderKey: 'id',
                                        orderValue: 'desc'
                                    }, [
                                        '*'
                                    ])
                                ];
                            case 12:
                                user_metadata = _state.sent();
                                if (!(user_metadata && user_metadata.mobile)) return [
                                    3,
                                    14
                                ];
                                metaJSON = JSON.parse(user_metadata.metaJSON) || {};
                                address = response === null || response === void 0 ? void 0 : (_response_data2 = response.data) === null || _response_data2 === void 0 ? void 0 : (_response_data_data2 = _response_data2.data) === null || _response_data_data2 === void 0 ? void 0 : _response_data_data2.address;
                                metaJSON['aadhaar-v2-submit-otp'] = {
                                    aadhar_no: response === null || response === void 0 ? void 0 : (_response_data3 = response.data) === null || _response_data3 === void 0 ? void 0 : (_response_data_data3 = _response_data3.data) === null || _response_data_data3 === void 0 ? void 0 : _response_data_data3.aadhaar_number,
                                    fullName: response === null || response === void 0 ? void 0 : (_response_data4 = response.data) === null || _response_data4 === void 0 ? void 0 : (_response_data_data4 = _response_data4.data) === null || _response_data_data4 === void 0 ? void 0 : _response_data_data4.full_name,
                                    email: '',
                                    phone: '',
                                    maskAadhar: "XXXXXXXX".concat(response === null || response === void 0 ? void 0 : (_response_data5 = response.data) === null || _response_data5 === void 0 ? void 0 : (_response_data_data5 = _response_data5.data) === null || _response_data_data5 === void 0 ? void 0 : (_response_data_data_aadhaar_number = _response_data_data5.aadhaar_number) === null || _response_data_data_aadhaar_number === void 0 ? void 0 : _response_data_data_aadhaar_number.slice(-4)),
                                    gender: response === null || response === void 0 ? void 0 : (_response_data6 = response.data) === null || _response_data6 === void 0 ? void 0 : (_response_data_data6 = _response_data6.data) === null || _response_data_data6 === void 0 ? void 0 : _response_data_data6.gender,
                                    dob: response === null || response === void 0 ? void 0 : (_response_data7 = response.data) === null || _response_data7 === void 0 ? void 0 : (_response_data_data7 = _response_data7.data) === null || _response_data_data7 === void 0 ? void 0 : _response_data_data7.dob,
                                    address: "".concat(address.country, "/").concat(address.dist, "/").concat(address.state, "/").concat(address.po, "/").concat(address.loc, "/").concat(address.vtc, "/").concat(address.subdist, "/").concat(address.street, "/").concat(address.house, "/").concat(address.landmark),
                                    address_json: address,
                                    aadhar_image: uploadedImageKey,
                                    aadhar_pdf: response === null || response === void 0 ? void 0 : (_response_data8 = response.data) === null || _response_data8 === void 0 ? void 0 : (_response_data_data8 = _response_data8.data) === null || _response_data_data8 === void 0 ? void 0 : _response_data_data8.aadhaar_pdf
                                };
                                return [
                                    4,
                                    this.userMetaDataService.findOneAndUpdate({
                                        mobile: String(mobile)
                                    }, {
                                        aadharVerify: response === null || response === void 0 ? void 0 : (_response_data9 = response.data) === null || _response_data9 === void 0 ? void 0 : (_response_data_data9 = _response_data9.data) === null || _response_data_data9 === void 0 ? void 0 : _response_data_data9.aadhaar_number,
                                        metaJSON: JSON.stringify(metaJSON),
                                        profile_image: uploadedImageKey
                                    })
                                ];
                            case 13:
                                _state.sent();
                                return [
                                    3,
                                    16
                                ];
                            case 14:
                                // CREATE ENTRY
                                address1 = response === null || response === void 0 ? void 0 : (_response_data10 = response.data) === null || _response_data10 === void 0 ? void 0 : (_response_data_data10 = _response_data10.data) === null || _response_data_data10 === void 0 ? void 0 : _response_data_data10.address;
                                metaJSON1 = {
                                    'aadhaar-v2-submit-otp': {
                                        aadhar_no: response === null || response === void 0 ? void 0 : (_response_data11 = response.data) === null || _response_data11 === void 0 ? void 0 : (_response_data_data11 = _response_data11.data) === null || _response_data_data11 === void 0 ? void 0 : _response_data_data11.aadhaar_number,
                                        fullName: response === null || response === void 0 ? void 0 : (_response_data12 = response.data) === null || _response_data12 === void 0 ? void 0 : (_response_data_data12 = _response_data12.data) === null || _response_data_data12 === void 0 ? void 0 : _response_data_data12.full_name,
                                        email: '',
                                        phone: '',
                                        maskAadhar: "XXXXXXXX".concat(response === null || response === void 0 ? void 0 : (_response_data13 = response.data) === null || _response_data13 === void 0 ? void 0 : (_response_data_data13 = _response_data13.data) === null || _response_data_data13 === void 0 ? void 0 : (_response_data_data_aadhaar_number1 = _response_data_data13.aadhaar_number) === null || _response_data_data_aadhaar_number1 === void 0 ? void 0 : _response_data_data_aadhaar_number1.slice(-4)),
                                        gender: response === null || response === void 0 ? void 0 : (_response_data14 = response.data) === null || _response_data14 === void 0 ? void 0 : (_response_data_data14 = _response_data14.data) === null || _response_data_data14 === void 0 ? void 0 : _response_data_data14.gender,
                                        dob: response === null || response === void 0 ? void 0 : (_response_data15 = response.data) === null || _response_data15 === void 0 ? void 0 : (_response_data_data15 = _response_data15.data) === null || _response_data_data15 === void 0 ? void 0 : _response_data_data15.dob,
                                        address: "".concat(address1.country, "/").concat(address1.dist, "/").concat(address1.state, "/").concat(address1.po, "/").concat(address1.loc, "/").concat(address1.vtc, "/").concat(address1.subdist, "/").concat(address1.street, "/").concat(address1.house, "/").concat(address1.landmark),
                                        address_json: address1,
                                        aadhar_image: uploadedImageKey,
                                        aadhar_pdf: response === null || response === void 0 ? void 0 : (_response_data16 = response.data) === null || _response_data16 === void 0 ? void 0 : (_response_data_data16 = _response_data16.data) === null || _response_data_data16 === void 0 ? void 0 : _response_data_data16.aadhaar_pdf
                                    }
                                };
                                return [
                                    4,
                                    this.userMetaDataService.insert({
                                        customerID: customerID,
                                        mobile: String(mobile),
                                        panVerify: '',
                                        aadharVerify: response === null || response === void 0 ? void 0 : (_response_data17 = response.data) === null || _response_data17 === void 0 ? void 0 : (_response_data_data17 = _response_data17.data) === null || _response_data_data17 === void 0 ? void 0 : _response_data_data17.aadhaar_number,
                                        metaJSON: JSON.stringify(metaJSON1),
                                        profile_image: uploadedImageKey,
                                        aadhar_mask: ''
                                    })
                                ];
                            case 15:
                                _state.sent();
                                _state.label = 16;
                            case 16:
                                return [
                                    2,
                                    Promise.resolve({
                                        succuss: true,
                                        message: 'Fetched Successfully',
                                        code: 200
                                    })
                                ];
                            case 17:
                                return [
                                    2,
                                    Promise.resolve({
                                        succuss: false,
                                        message: (response === null || response === void 0 ? void 0 : (_response_data18 = response.data) === null || _response_data18 === void 0 ? void 0 : _response_data18.message) || 'Issue In Surepass',
                                        code: (response === null || response === void 0 ? void 0 : (_response_data19 = response.data) === null || _response_data19 === void 0 ? void 0 : _response_data19.status_code) || 400
                                    })
                                ];
                            case 18:
                                return [
                                    3,
                                    20
                                ];
                            case 19:
                                error1 = _state.sent();
                                console.log('Error In Verifying Otp', error1);
                                return [
                                    3,
                                    20
                                ];
                            case 20:
                                return [
                                    2
                                ];
                        }
                    });
                }).call(this);
            }
        }
    ]);
    return SurepassService;
}();
export default SurepassService;

//# sourceMappingURL=surepass.service.js.map