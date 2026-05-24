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
function _object_spread(target) {
    for(var i = 1; i < arguments.length; i++){
        var source = arguments[i] != null ? arguments[i] : {};
        var ownKeys = Object.keys(source);
        if (typeof Object.getOwnPropertySymbols === "function") {
            ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function(sym) {
                return Object.getOwnPropertyDescriptor(source, sym).enumerable;
            }));
        }
        ownKeys.forEach(function(key) {
            _define_property(target, key, source[key]);
        });
    }
    return target;
}
function ownKeys(object, enumerableOnly) {
    var keys = Object.keys(object);
    if (Object.getOwnPropertySymbols) {
        var symbols = Object.getOwnPropertySymbols(object);
        if (enumerableOnly) {
            symbols = symbols.filter(function(sym) {
                return Object.getOwnPropertyDescriptor(object, sym).enumerable;
            });
        }
        keys.push.apply(keys, symbols);
    }
    return keys;
}
function _object_spread_props(target, source) {
    source = source != null ? source : {};
    if (Object.getOwnPropertyDescriptors) {
        Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
        ownKeys(Object(source)).forEach(function(key) {
            Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
        });
    }
    return target;
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
import CustomerModel from '../../database/mysql/customer';
import { leadModel } from '../../database/mysql/leads';
import { lenderModel } from '../../database/mysql/lender';
import MailTemplateModel from '../../database/mysql/mail_template';
import NotificationModel from '../../database/mysql/notification';
import { EmailTemplate } from '../../enums/common.enum';
import CommonHelper from '../../helpers/common';
import CustomerService from '../../services/customer.service';
import { logger } from '../../utils/logger';
import LeadApiLogService from '../leadApiLog.service';
import LeadApiLogMongoDBService from '../leadApiLogMongo.service';
import S3Service from './s3.service';
var DigitapService = /*#__PURE__*/ function() {
    "use strict";
    function DigitapService() {
        _class_call_check(this, DigitapService);
        //Dev
        _define_property(this, "commonHelper", new CommonHelper());
        _define_property(this, "customerModel", new CustomerModel());
        _define_property(this, "customerService", new CustomerService());
        _define_property(this, "mailTemplateModel", new MailTemplateModel());
        _define_property(this, "notificationModel", new NotificationModel());
        _define_property(this, "leadModel", leadModel);
        _define_property(this, "lenderModel", lenderModel);
        _define_property(this, "DEV_ENV", 0);
        _define_property(this, "DEV_ENV_URL", config.digitap_dev_env_url);
        _define_property(this, "DEV_CLIENT_ID", config.digitap_dev_client_id);
        _define_property(this, "DEV_CLIENT_SECRET", config.digitap_dev_client_secret);
        _define_property(this, "DEV_ENV_DEVICEAnalytics_URL", config.digitap_dev_env_deviceAnalytics_url);
        //Mjk1NDU3MDE6RmR5OURGelVQYzFRRmpQb3FZdlozUEgzWjlDb0hoN2E=
        //Live
        _define_property(this, "LIVE_ENV", 1);
        _define_property(this, "LIVE_ENV_URL", config.digitap_live_env_url);
        _define_property(this, "LIVE_CLIENT_ID", config.digitap_live_client_id);
        _define_property(this, "LIVE_CLIENT_SECRET", config.digitap_live_client_secret);
        _define_property(this, "LIVE_ENV_DEVICEAnalytics_URL", config.digitap_live_env_deviceAnalytics_url);
        //MTQ4MjcwODA6MElLdmpTMklXelFzZnJtbDE2NW5majFHRFBjdTNGUm4=
        _define_property(this, "ACTIVE_ENV", this.LIVE_ENV);
        //Env
        _define_property(this, "APIURL", this.ACTIVE_ENV == this.DEV_ENV ? this.DEV_ENV_URL : this.LIVE_ENV_URL);
        _define_property(this, "CLIENT_ID", this.ACTIVE_ENV == this.DEV_ENV ? this.DEV_CLIENT_ID : this.LIVE_CLIENT_ID);
        _define_property(this, "CLIENT_SECRET", this.ACTIVE_ENV == this.DEV_ENV ? this.DEV_CLIENT_SECRET : this.LIVE_CLIENT_SECRET);
        _define_property(this, "APIURL_DEVICEAnalytics", this.ACTIVE_ENV == this.DEV_ENV ? this.DEV_ENV_DEVICEAnalytics_URL : this.LIVE_ENV_DEVICEAnalytics_URL);
        _define_property(this, "leadApiLogService", new LeadApiLogService());
        _define_property(this, "s3Service", new S3Service());
        _define_property(this, "leadApiLogMongoDBService", new LeadApiLogMongoDBService());
    }
    _create_class(DigitapService, [
        {
            key: "headers",
            value: function headers() {
                return {
                    'content-type': 'application/json',
                    Authorization: "Basic ".concat(Buffer.from("".concat(this.CLIENT_ID, ":").concat(this.CLIENT_SECRET)).toString('base64'))
                };
            }
        },
        {
            key: "apiCall",
            value: //UT Done
            function apiCall(url, method, headers, body, leadID, mobile, s3_folder) {
                return _async_to_generator(function() {
                    var logBody, response, logEntry, error, error1, _error_response, _error_response1, logEntry1, error2;
                    return _ts_generator(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                logBody = _object_spread_props(_object_spread({}, body), {
                                    upload_platform: 'S3',
                                    person: s3_folder
                                });
                                _state.label = 1;
                            case 1:
                                _state.trys.push([
                                    1,
                                    8,
                                    ,
                                    14
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
                            case 2:
                                response = _state.sent();
                                logEntry = {
                                    api_type: 'face-match',
                                    api_endpoint_url: url,
                                    api_supplier: 5,
                                    api_method: 'POST',
                                    api_request: JSON.stringify(logBody),
                                    api_response: JSON.stringify(response.data),
                                    leadID: String(leadID),
                                    mobile_no: String(mobile),
                                    status: 1
                                };
                                return [
                                    4,
                                    this.leadApiLogService.create(logEntry)
                                ];
                            case 3:
                                _state.sent();
                                _state.label = 4;
                            case 4:
                                _state.trys.push([
                                    4,
                                    6,
                                    ,
                                    7
                                ]);
                                return [
                                    4,
                                    this.leadApiLogMongoDBService.create('digitap', logEntry)
                                ];
                            case 5:
                                _state.sent();
                                return [
                                    3,
                                    7
                                ];
                            case 6:
                                error = _state.sent();
                                logger.error('Error while saving to MongoDB collection : digitap', error);
                                return [
                                    3,
                                    7
                                ];
                            case 7:
                                return [
                                    2,
                                    {
                                        is_success: true,
                                        apimsg: response.data
                                    }
                                ];
                            case 8:
                                error1 = _state.sent();
                                logEntry1 = {
                                    api_type: 'face-match',
                                    api_endpoint_url: url,
                                    api_supplier: 5,
                                    api_method: 'POST',
                                    api_request: JSON.stringify(logBody),
                                    api_response: JSON.stringify(error1 === null || error1 === void 0 ? void 0 : (_error_response = error1.response) === null || _error_response === void 0 ? void 0 : _error_response.data),
                                    leadID: String(leadID),
                                    mobile_no: String(mobile),
                                    status: 0
                                };
                                return [
                                    4,
                                    this.leadApiLogService.create(logEntry1)
                                ];
                            case 9:
                                _state.sent();
                                _state.label = 10;
                            case 10:
                                _state.trys.push([
                                    10,
                                    12,
                                    ,
                                    13
                                ]);
                                return [
                                    4,
                                    this.leadApiLogMongoDBService.create('digitap', logEntry1)
                                ];
                            case 11:
                                _state.sent();
                                return [
                                    3,
                                    13
                                ];
                            case 12:
                                error2 = _state.sent();
                                logger.error('Error while saving to MongoDB collection : digitap', error2);
                                return [
                                    3,
                                    13
                                ];
                            case 13:
                                return [
                                    2,
                                    {
                                        is_success: false,
                                        apimsg: error1 === null || error1 === void 0 ? void 0 : (_error_response1 = error1.response) === null || _error_response1 === void 0 ? void 0 : _error_response1.data
                                    }
                                ];
                            case 14:
                                return [
                                    2
                                ];
                        }
                    });
                }).call(this);
            }
        },
        {
            key: "getFaceLiveness",
            value: //UT Done
            function getFaceLiveness(mobile, leadID, image, adhar_no, s3_folder) {
                return _async_to_generator(function() {
                    var _this, clientRefId, api_type, url, key, person, profileS3Folder, getAadharProfilePicture, card, aadhar, _aadharResponse_data, aadharResponse, _aadharResponse_data1, aadharResponse1, requestBody, response, error;
                    return _ts_generator(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                _this = this;
                                _state.label = 1;
                            case 1:
                                _state.trys.push([
                                    1,
                                    11,
                                    ,
                                    12
                                ]);
                                clientRefId = "".concat(mobile, "_").concat(leadID);
                                api_type = 'face-match';
                                url = "".concat(this.APIURL_DEVICEAnalytics, "fmfl/v2/").concat(api_type);
                                key = "".concat(s3_folder, "/").concat(image);
                                return [
                                    4,
                                    this.s3Service.getPresignedUrl(key)
                                ];
                            case 2:
                                person = _state.sent();
                                profileS3Folder = config.profileS3Folder;
                                //let person = s3_folder
                                getAadharProfilePicture = function getAadharProfilePicture(key) {
                                    return _async_to_generator(function() {
                                        return _ts_generator(this, function(_state) {
                                            switch(_state.label){
                                                case 0:
                                                    return [
                                                        4,
                                                        this.s3Service.getPresignedUrl(key)
                                                    ];
                                                case 1:
                                                    return [
                                                        2,
                                                        _state.sent()
                                                    ];
                                            }
                                        });
                                    }).call(_this);
                                };
                                if (!(adhar_no !== null && adhar_no !== undefined)) return [
                                    3,
                                    4
                                ];
                                return [
                                    4,
                                    this.leadApiLogService.findOne({
                                        api_supplier: 4,
                                        api_type: 'aadhaar-v2-submit-otp',
                                        aadharNo: String(adhar_no),
                                        status: 1
                                    }, [
                                        '*'
                                    ], [
                                        {
                                            column: 'id',
                                            order: 'desc'
                                        }
                                    ])
                                ];
                            case 3:
                                aadhar = _state.sent();
                                _state.label = 4;
                            case 4:
                                if (!!aadhar) return [
                                    3,
                                    7
                                ];
                                return [
                                    4,
                                    this.leadApiLogService.findOne({
                                        api_supplier: 1,
                                        api_type: 'digilocker_eaadhaar',
                                        mobile_no: String(mobile),
                                        status: 1
                                    }, [
                                        '*'
                                    ], [
                                        {
                                            column: 'id',
                                            order: 'desc'
                                        }
                                    ])
                                ];
                            case 5:
                                aadhar = _state.sent();
                                aadharResponse = JSON.parse(aadhar.api_response);
                                return [
                                    4,
                                    getAadharProfilePicture("".concat(aadharResponse === null || aadharResponse === void 0 ? void 0 : (_aadharResponse_data = aadharResponse.data) === null || _aadharResponse_data === void 0 ? void 0 : _aadharResponse_data.image))
                                ];
                            case 6:
                                card = _state.sent();
                                return [
                                    3,
                                    9
                                ];
                            case 7:
                                aadharResponse1 = JSON.parse(aadhar.api_response);
                                return [
                                    4,
                                    getAadharProfilePicture("".concat(aadharResponse1 === null || aadharResponse1 === void 0 ? void 0 : (_aadharResponse_data1 = aadharResponse1.data) === null || _aadharResponse_data1 === void 0 ? void 0 : _aadharResponse_data1.profile_image))
                                ];
                            case 8:
                                card = _state.sent();
                                _state.label = 9;
                            case 9:
                                requestBody = {
                                    person: person,
                                    card: card,
                                    clientRefId: clientRefId
                                };
                                return [
                                    4,
                                    this.apiCall(url, 'POST', this.headers(), requestBody, leadID, mobile, key)
                                ];
                            case 10:
                                response = _state.sent();
                                return [
                                    2,
                                    response
                                ];
                            case 11:
                                error = _state.sent();
                                console.log('error', error);
                                return [
                                    3,
                                    12
                                ];
                            case 12:
                                return [
                                    2
                                ];
                        }
                    });
                }).call(this);
            }
        },
        {
            key: "sendConsentImageEmail",
            value: function sendConsentImageEmail(customerID, leadId, imagebase64) {
                return _async_to_generator(function() {
                    var _lenderInfo_lender_info, _lenderInfo_lender_info1, mailData, customer, leadInfo, lenderInfo, _lenderInfo_lender_info2, mailBody, data, error;
                    return _ts_generator(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                return [
                                    4,
                                    this.mailTemplateModel.findOneMailTemplate({
                                        name: EmailTemplate.LOAN_SELFIE_CONSENT_DOC
                                    })
                                ];
                            case 1:
                                mailData = _state.sent();
                                return [
                                    4,
                                    this.customerService.findOne({
                                        customerID: customerID
                                    }, [
                                        'email',
                                        'name'
                                    ])
                                ];
                            case 2:
                                customer = _state.sent();
                                return [
                                    4,
                                    this.leadModel.findOne({
                                        where: {
                                            leadID: leadId
                                        },
                                        select: [
                                            '*'
                                        ]
                                    })
                                ];
                            case 3:
                                leadInfo = _state.sent();
                                return [
                                    4,
                                    this.lenderModel.findOne({
                                        lenderID: leadInfo.lenderID
                                    }, [
                                        'name',
                                        'lender_info'
                                    ])
                                ];
                            case 4:
                                lenderInfo = _state.sent();
                                mailData.message = mailData.message.replace(/{name}/g, customer === null || customer === void 0 ? void 0 : customer.name).replace(/{lenderName}/g, lenderInfo === null || lenderInfo === void 0 ? void 0 : (_lenderInfo_lender_info = lenderInfo.lender_info) === null || _lenderInfo_lender_info === void 0 ? void 0 : _lenderInfo_lender_info.lenderName).replace(/{lenderEmailId}/g, lenderInfo === null || lenderInfo === void 0 ? void 0 : (_lenderInfo_lender_info1 = lenderInfo.lender_info) === null || _lenderInfo_lender_info1 === void 0 ? void 0 : _lenderInfo_lender_info1.lenderEmailId);
                                if (!customer) return [
                                    3,
                                    9
                                ];
                                mailBody = {
                                    from: lenderInfo === null || lenderInfo === void 0 ? void 0 : (_lenderInfo_lender_info2 = lenderInfo.lender_info) === null || _lenderInfo_lender_info2 === void 0 ? void 0 : _lenderInfo_lender_info2.lenderEmailId,
                                    to: customer.email,
                                    subject: mailData === null || mailData === void 0 ? void 0 : mailData.subject,
                                    body: mailData === null || mailData === void 0 ? void 0 : mailData.message
                                };
                                if (imagebase64) {
                                    mailBody['content'] = imagebase64;
                                    mailBody['attachmentName'] = 'Consent.png';
                                }
                                _state.label = 5;
                            case 5:
                                _state.trys.push([
                                    5,
                                    8,
                                    ,
                                    9
                                ]);
                                return [
                                    4,
                                    this.commonHelper.sendMailSwitcher(mailBody)
                                ];
                            case 6:
                                _state.sent();
                                data = {
                                    customerID: customerID,
                                    leadID: leadId,
                                    notification: mailData.message,
                                    type: 'Email',
                                    subject: mailData === null || mailData === void 0 ? void 0 : mailData.subject,
                                    mtype: 'app',
                                    uid: 221
                                };
                                return [
                                    4,
                                    this.notificationModel.insert(data)
                                ];
                            case 7:
                                _state.sent();
                                return [
                                    3,
                                    9
                                ];
                            case 8:
                                error = _state.sent();
                                logger.error(error);
                                return [
                                    3,
                                    9
                                ];
                            case 9:
                                return [
                                    2
                                ];
                        }
                    });
                }).call(this);
            }
        }
    ]);
    return DigitapService;
}();
export default DigitapService;

//# sourceMappingURL=digitap.service.js.map