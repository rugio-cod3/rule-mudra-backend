function _array_like_to_array(arr, len) {
    if (len == null || len > arr.length) len = arr.length;
    for(var i = 0, arr2 = new Array(len); i < len; i++)arr2[i] = arr[i];
    return arr2;
}
function _array_with_holes(arr) {
    if (Array.isArray(arr)) return arr;
}
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
function _iterable_to_array_limit(arr, i) {
    var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"];
    if (_i == null) return;
    var _arr = [];
    var _n = true;
    var _d = false;
    var _s, _e;
    try {
        for(_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true){
            _arr.push(_s.value);
            if (i && _arr.length === i) break;
        }
    } catch (err) {
        _d = true;
        _e = err;
    } finally{
        try {
            if (!_n && _i["return"] != null) _i["return"]();
        } finally{
            if (_d) throw _e;
        }
    }
    return _arr;
}
function _non_iterable_rest() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance.\\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
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
function _sliced_to_array(arr, i) {
    return _array_with_holes(arr) || _iterable_to_array_limit(arr, i) || _unsupported_iterable_to_array(arr, i) || _non_iterable_rest();
}
function _unsupported_iterable_to_array(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return _array_like_to_array(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(n);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _array_like_to_array(o, minLen);
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
import { customerModel } from '../database/mysql/customer';
import { leadModel } from '../database/mysql/leads';
import MailTemplateModel from '../database/mysql/mailTemplate';
import NotificationModel from '../database/mysql/notification';
import { EmailTemplate } from '../enums/common.enum';
import { commonHelper } from '../helpers/common';
import AxiosService from '../services/api.service';
//import { loanService } from '../services/loan.service'
import { load } from 'cheerio';
import moment from 'moment-timezone';
import { loanService } from '../services/loan.service';
import { capitalizeWords } from './util';
import dotenv from 'dotenv';
import { switchThirdPartyApiModel } from '../database/mysql/switchThirdPartyApi';
import { ApiType, Status } from '../enums/switchThirdPartyApi.enum';
import { ThirdPartAPI } from '../enums/thirdPartyApi.enum';
import { getOrSetCache, deleteCache } from '../redis/cacheService';
import { lenderModel } from '../database/mysql/lender';
dotenv.config();
var VENDOR_CACHE_KEY = 'active_sms_vendor';
export var NotificationUtils = /*#__PURE__*/ function() {
    "use strict";
    function NotificationUtils() {
        var _this = this;
        _class_call_check(this, NotificationUtils);
        _define_property(this, "apiService", new AxiosService(config.notificationBaseUrl));
        _define_property(this, "mailTemplateModel", new MailTemplateModel());
        _define_property(this, "shortLink", 'bit.ly/3T0zyIh');
        _define_property(this, "leadModel", leadModel);
        _define_property(this, "notificationModel", new NotificationModel());
        _define_property(this, "loanService", loanService);
        _define_property(this, "customerModel", customerModel);
        _define_property(this, "commonHelper", commonHelper);
        _define_property(this, "switchThirdPartyApiModel", switchThirdPartyApiModel);
        _define_property(this, "selectSMSService", function(mobile, otp, message) {
            return _async_to_generator(function() {
                var _this, _vendor_, vendor, apiResponse, _, responseCheck, _vendor_1, _tmp, failedCount, _vendor_2, _vendor_3, _vendor_4, _vendor_5, error;
                return _ts_generator(this, function(_state) {
                    switch(_state.label){
                        case 0:
                            _this = this;
                            _state.label = 1;
                        case 1:
                            _state.trys.push([
                                1,
                                22,
                                ,
                                23
                            ]);
                            return [
                                4,
                                getOrSetCache(VENDOR_CACHE_KEY, function() {
                                    return _async_to_generator(function() {
                                        return _ts_generator(this, function(_state) {
                                            switch(_state.label){
                                                case 0:
                                                    return [
                                                        4,
                                                        this.switchThirdPartyApiModel.find({
                                                            where: {
                                                                api_type: ApiType.SMS,
                                                                status: Status.ACTIVE
                                                            },
                                                            select: [
                                                                'vendor',
                                                                'id',
                                                                'failed_count'
                                                            ]
                                                        })
                                                    ];
                                                case 1:
                                                    return [
                                                        2,
                                                        _state.sent()
                                                    ];
                                            }
                                        });
                                    }).call(_this);
                                }, {
                                    ttlSeconds: 60 * 60 * 24 * 7
                                })
                            ];
                        case 2:
                            vendor = _state.sent();
                            if (!vendor || vendor.length === 0) {
                                return [
                                    2,
                                    {
                                        error: 'No active SMS vendor found'
                                    }
                                ];
                            }
                            _ = (_vendor_ = vendor[0]) === null || _vendor_ === void 0 ? void 0 : _vendor_.vendor;
                            switch(_){
                                case ThirdPartAPI.TEXTNATION:
                                    return [
                                        3,
                                        3
                                    ];
                                case ThirdPartAPI.ACQUIRIT:
                                    return [
                                        3,
                                        5
                                    ];
                            }
                            return [
                                3,
                                7
                            ];
                        case 3:
                            return [
                                4,
                                this.sendingSMS(mobile, otp, ThirdPartAPI.TEXTNATION, message)
                            ];
                        case 4:
                            apiResponse = _state.sent();
                            return [
                                3,
                                8
                            ];
                        case 5:
                            return [
                                4,
                                this.sendingSMS(mobile, otp, ThirdPartAPI.ACQUIRIT, message)
                            ];
                        case 6:
                            apiResponse = _state.sent();
                            return [
                                3,
                                8
                            ];
                        case 7:
                            return [
                                2,
                                {
                                    error: 'Invalid vendor'
                                }
                            ];
                        case 8:
                            // apiResponse = await this.sendingWhatsAppMessage(mobile,otp)
                            // console.log("apiResponse",apiResponse)
                            responseCheck = (apiResponse === null || apiResponse === void 0 ? void 0 : apiResponse.statusCode) === 200;
                            if (!!responseCheck) return [
                                3,
                                18
                            ];
                            if (!// Retry with alternate vendor
                            (vendor[0].vendor === ThirdPartAPI.TEXTNATION)) return [
                                3,
                                10
                            ];
                            return [
                                4,
                                this.sendingSMS(mobile, otp, ThirdPartAPI.ACQUIRIT, message)
                            ];
                        case 9:
                            _tmp = _state.sent();
                            return [
                                3,
                                12
                            ];
                        case 10:
                            return [
                                4,
                                this.sendingSMS(mobile, otp, ThirdPartAPI.TEXTNATION, message)
                            ];
                        case 11:
                            _tmp = _state.sent();
                            _state.label = 12;
                        case 12:
                            _tmp;
                            failedCount = (((_vendor_1 = vendor[0]) === null || _vendor_1 === void 0 ? void 0 : _vendor_1.failed_count) || 0) + 1;
                            return [
                                4,
                                this.switchThirdPartyApiModel.update({
                                    id: vendor[0].id
                                }, {
                                    failed_count: failedCount
                                })
                            ];
                        case 13:
                            _state.sent();
                            if (!(failedCount >= config.apiSwitchCount)) return [
                                3,
                                17
                            ];
                            return [
                                4,
                                this.switchThirdPartyApiModel.updateOneExcluding({
                                    api_type: ApiType.SMS
                                }, {
                                    id: (_vendor_2 = vendor[0]) === null || _vendor_2 === void 0 ? void 0 : _vendor_2.id
                                }, {
                                    status: Status.ACTIVE,
                                    failed_count: 0
                                })
                            ];
                        case 14:
                            _state.sent();
                            return [
                                4,
                                this.switchThirdPartyApiModel.update({
                                    api_type: ApiType.SMS,
                                    id: (_vendor_3 = vendor[0]) === null || _vendor_3 === void 0 ? void 0 : _vendor_3.id
                                }, {
                                    status: Status.DEACTIVE
                                })
                            ];
                        case 15:
                            _state.sent();
                            //Invalidate cache due to vendor switch
                            return [
                                4,
                                deleteCache(VENDOR_CACHE_KEY)
                            ];
                        case 16:
                            _state.sent();
                            _state.label = 17;
                        case 17:
                            return [
                                3,
                                21
                            ];
                        case 18:
                            if (!(((_vendor_4 = vendor[0]) === null || _vendor_4 === void 0 ? void 0 : _vendor_4.failed_count) > 0)) return [
                                3,
                                21
                            ];
                            return [
                                4,
                                this.switchThirdPartyApiModel.update({
                                    api_type: ApiType.SMS,
                                    id: (_vendor_5 = vendor[0]) === null || _vendor_5 === void 0 ? void 0 : _vendor_5.id
                                }, {
                                    failed_count: 0
                                })
                            ];
                        case 19:
                            _state.sent();
                            // Optional: Invalidate to reflect updated count
                            return [
                                4,
                                deleteCache(VENDOR_CACHE_KEY)
                            ];
                        case 20:
                            _state.sent();
                            _state.label = 21;
                        case 21:
                            return [
                                2,
                                apiResponse
                            ];
                        case 22:
                            error = _state.sent();
                            console.error('Error sending SMS:', error);
                            throw error;
                        case 23:
                            return [
                                2
                            ];
                    }
                });
            }).call(_this);
        });
        _define_property(this, "selectSMSServiceWhatsapp", function(mobile, otp) {
            return _async_to_generator(function() {
                var apiResponse, error;
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
                                this.sendingWhatsAppMessage(mobile, otp)
                            ];
                        case 1:
                            apiResponse = _state.sent();
                            console.log("apiResponse", apiResponse);
                            return [
                                2,
                                apiResponse
                            ];
                        case 2:
                            error = _state.sent();
                            console.error('Error sending SMS:', error);
                            throw error;
                        case 3:
                            return [
                                2
                            ];
                    }
                });
            }).call(_this);
        });
        _define_property(this, "sendingSMS", function(mobile, otp, vendor, message) {
            return _async_to_generator(function() {
                var body, result, error;
                return _ts_generator(this, function(_state) {
                    switch(_state.label){
                        case 0:
                            _state.trys.push([
                                0,
                                2,
                                ,
                                3
                            ]);
                            body = _object_spread_props(_object_spread({
                                mobile: Number(mobile),
                                otp: otp,
                                body_message: ThirdPartAPI.TEXTNATION === vendor ? "Dear customer, use this One Time Password ".concat(otp, " to log in to your Ram Fincorp account. This OTP will be valid for the next 2 minutes.") : config.acquiritSender === 'AVFINL' ? "DearCustomer Please use ".concat(otp, " as your OTP for Login. by AVA Finance") : "Dear customer, use this One Time Password ".concat(otp, " to log in to your Ram Fincorp account. This OTP will be valid for the next 2 mins.By Kundanmal Finance"),
                                template_id: ThirdPartAPI.TEXTNATION === vendor ? config.templateIdSmsOtp.toString() : config.acquiritDlttempid.replace('TID-', '')
                            }, ThirdPartAPI.TEXTNATION === vendor && {
                                entityID: config.entityIdSmsOtp.toString()
                            }), {
                                vendor: vendor
                            });
                            if (message) body.body_message = message;
                            return [
                                4,
                                this.apiService.call('post', "/notificationService/sending_sms", body, undefined, {
                                    'Content-Type': 'application/json'
                                })
                            ];
                        case 1:
                            result = _state.sent();
                            console.log('SMS sending result found:', result);
                            return [
                                2,
                                result
                            ];
                        case 2:
                            error = _state.sent();
                            console.error('Error sending SMS:', error);
                            throw error;
                        case 3:
                            return [
                                2
                            ];
                    }
                });
            }).call(_this);
        });
        _define_property(this, "sendingEmailOTP", function(email, name, otp) {
            return _async_to_generator(function() {
                var mailData, body, error;
                return _ts_generator(this, function(_state) {
                    switch(_state.label){
                        case 0:
                            _state.trys.push([
                                0,
                                3,
                                ,
                                4
                            ]);
                            return [
                                4,
                                this.mailTemplateModel.findOneMailTemplate({
                                    name: EmailTemplate.OTP
                                })
                            ];
                        case 1:
                            mailData = _state.sent();
                            mailData.message = mailData.message.replace('{{$otp}}', otp.toString());
                            mailData.message = mailData.message.replace('{{$name}}', capitalizeWords(name));
                            body = {
                                form_email: config.otpSenderEmail,
                                to_email: email,
                                subject: mailData === null || mailData === void 0 ? void 0 : mailData.subject,
                                body_message: mailData === null || mailData === void 0 ? void 0 : mailData.message
                            };
                            return [
                                4,
                                this.apiService.call('post', "/notificationService/sending_email", body, undefined, {
                                    'Content-Type': 'application/json'
                                })
                            ];
                        case 2:
                            _state.sent();
                            return [
                                3,
                                4
                            ];
                        case 3:
                            error = _state.sent();
                            throw error;
                        case 4:
                            return [
                                2
                            ];
                    }
                });
            }).call(_this);
        });
        _define_property(this, "sendApprovedProcessMail", function(customerID, leadID, userID) {
            return _async_to_generator(function() {
                var _lender_lender_info, _lender_lender_info1, _lender_lender_info2, mailData, customerDetails, lead, lender, body, response, data, error;
                return _ts_generator(this, function(_state) {
                    switch(_state.label){
                        case 0:
                            _state.trys.push([
                                0,
                                8,
                                ,
                                9
                            ]);
                            return [
                                4,
                                this.mailTemplateModel.findOneMailTemplate({
                                    name: EmailTemplate.APPROVED_PROCESS
                                })
                            ];
                        case 1:
                            mailData = _state.sent();
                            return [
                                4,
                                customerModel.findOneCustomer({
                                    customerID: customerID
                                }, [
                                    'name',
                                    'email'
                                ])
                            ];
                        case 2:
                            customerDetails = _state.sent();
                            return [
                                4,
                                leadModel.findOne({
                                    where: {
                                        leadID: leadID
                                    },
                                    select: [
                                        'lenderID'
                                    ]
                                })
                            ];
                        case 3:
                            lead = _state.sent();
                            return [
                                4,
                                lenderModel.findOne({
                                    lenderID: lead.lenderID
                                }, [
                                    '*'
                                ])
                            ];
                        case 4:
                            lender = _state.sent();
                            mailData.message = mailData.message.replace(/{customer}/g, customerDetails === null || customerDetails === void 0 ? void 0 : customerDetails.name).replace(/{lenderName}/g, lender === null || lender === void 0 ? void 0 : (_lender_lender_info = lender.lender_info) === null || _lender_lender_info === void 0 ? void 0 : _lender_lender_info.lenderName).replace(/{base_url}/g, lender === null || lender === void 0 ? void 0 : (_lender_lender_info1 = lender.lender_info) === null || _lender_lender_info1 === void 0 ? void 0 : _lender_lender_info1.base_url).replace(/{link}/g, this.shortLink).replace(/{date}/g, moment().format('DD-MM-YYYY'));
                            body = {
                                form_email: lender === null || lender === void 0 ? void 0 : (_lender_lender_info2 = lender.lender_info) === null || _lender_lender_info2 === void 0 ? void 0 : _lender_lender_info2.lenderEmailId,
                                to_email: customerDetails.email,
                                subject: mailData === null || mailData === void 0 ? void 0 : mailData.subject,
                                body_message: mailData === null || mailData === void 0 ? void 0 : mailData.message
                            };
                            return [
                                4,
                                this.apiService.call('post', "/notificationService/sending_email", body, undefined, {
                                    'Content-Type': 'application/json'
                                })
                            ];
                        case 5:
                            response = _state.sent();
                            if (!(response && typeof response.success === 'boolean')) return [
                                3,
                                7
                            ];
                            data = {
                                customerID: customerID,
                                leadID: leadID,
                                notification: mailData.message,
                                type: 'Email',
                                subject: mailData === null || mailData === void 0 ? void 0 : mailData.subject,
                                mtype: 'crm',
                                uid: userID
                            };
                            return [
                                4,
                                this.notificationModel.insert(data)
                            ];
                        case 6:
                            _state.sent();
                            _state.label = 7;
                        case 7:
                            return [
                                3,
                                9
                            ];
                        case 8:
                            error = _state.sent();
                            throw error;
                        case 9:
                            return [
                                2
                            ];
                    }
                });
            }).call(_this);
        });
        _define_property(this, "sendRejectProcessMail", function(customerID, leadID) {
            return _async_to_generator(function() {
                var _lender_lender_info, _lender_lender_info1, _lender_lender_info2, mailData, customerDetails, lead, lender, body, error;
                return _ts_generator(this, function(_state) {
                    switch(_state.label){
                        case 0:
                            _state.trys.push([
                                0,
                                6,
                                ,
                                7
                            ]);
                            return [
                                4,
                                this.mailTemplateModel.findOneMailTemplate({
                                    name: EmailTemplate.REJECTED_PROCESS
                                })
                            ];
                        case 1:
                            mailData = _state.sent();
                            return [
                                4,
                                customerModel.findOneCustomer({
                                    customerID: customerID
                                }, [
                                    'name',
                                    'email'
                                ])
                            ];
                        case 2:
                            customerDetails = _state.sent();
                            return [
                                4,
                                leadModel.findOne({
                                    where: {
                                        leadID: leadID
                                    },
                                    select: [
                                        'lenderID'
                                    ]
                                })
                            ];
                        case 3:
                            lead = _state.sent();
                            return [
                                4,
                                lenderModel.findOne({
                                    lenderID: lead.lenderID
                                }, [
                                    '*'
                                ])
                            ];
                        case 4:
                            lender = _state.sent();
                            mailData.message = mailData.message.replace(/{customer}/g, customerDetails === null || customerDetails === void 0 ? void 0 : customerDetails.name).replace(/{lenderName}/g, lender === null || lender === void 0 ? void 0 : (_lender_lender_info = lender.lender_info) === null || _lender_lender_info === void 0 ? void 0 : _lender_lender_info.lenderName).replace(/{base_url}/g, lender === null || lender === void 0 ? void 0 : (_lender_lender_info1 = lender.lender_info) === null || _lender_lender_info1 === void 0 ? void 0 : _lender_lender_info1.base_url);
                            body = {
                                form_email: lender === null || lender === void 0 ? void 0 : (_lender_lender_info2 = lender.lender_info) === null || _lender_lender_info2 === void 0 ? void 0 : _lender_lender_info2.lenderEmailId,
                                to_email: customerDetails === null || customerDetails === void 0 ? void 0 : customerDetails.email,
                                subject: mailData === null || mailData === void 0 ? void 0 : mailData.subject,
                                body_message: mailData === null || mailData === void 0 ? void 0 : mailData.message
                            };
                            return [
                                4,
                                this.apiService.call('post', "/notificationService/sending_email", body, undefined, {
                                    'Content-Type': 'application/json'
                                })
                            ];
                        case 5:
                            _state.sent();
                            return [
                                3,
                                7
                            ];
                        case 6:
                            error = _state.sent();
                            throw error;
                        case 7:
                            return [
                                2
                            ];
                    }
                });
            }).call(_this);
        });
        _define_property(this, "sendNotRequiredProcessMail", function(customerID, leadID) {
            return _async_to_generator(function() {
                var mailData, customerDetails, leadLenderID, lenderInfo, body, error;
                return _ts_generator(this, function(_state) {
                    switch(_state.label){
                        case 0:
                            _state.trys.push([
                                0,
                                6,
                                ,
                                7
                            ]);
                            return [
                                4,
                                this.mailTemplateModel.findOneMailTemplate({
                                    name: EmailTemplate.NOT_REQUIRED
                                })
                            ];
                        case 1:
                            mailData = _state.sent();
                            return [
                                4,
                                customerModel.findOneCustomer({
                                    customerID: customerID
                                }, [
                                    'name',
                                    'email'
                                ])
                            ];
                        case 2:
                            customerDetails = _state.sent();
                            return [
                                4,
                                leadModel.findOne({
                                    where: {
                                        leadID: leadID
                                    },
                                    select: [
                                        'lenderID'
                                    ]
                                })
                            ];
                        case 3:
                            leadLenderID = _state.sent();
                            return [
                                4,
                                lenderModel.findOne({
                                    lenderID: leadLenderID.lenderID
                                }, [
                                    '*'
                                ])
                            ];
                        case 4:
                            lenderInfo = _state.sent();
                            mailData.message = mailData.message.replace('{customer}', customerDetails === null || customerDetails === void 0 ? void 0 : customerDetails.name).replace('{link}', this.shortLink).replace('{date}', moment().format('DD-MM-YYYY')).replace(/{lenderName}/g, lenderInfo.lender_info.lenderName).replace(/{base_url}/g, lenderInfo.lender_info.base_url);
                            body = {
                                form_email: lenderInfo.lender_info.lenderEmailId,
                                to_email: customerDetails.email,
                                subject: mailData === null || mailData === void 0 ? void 0 : mailData.subject,
                                body_message: mailData === null || mailData === void 0 ? void 0 : mailData.message
                            };
                            return [
                                4,
                                this.apiService.call('post', "/notificationService/sending_email", body, undefined, {
                                    'Content-Type': 'application/json'
                                })
                            ];
                        case 5:
                            _state.sent();
                            return [
                                3,
                                7
                            ];
                        case 6:
                            error = _state.sent();
                            throw error;
                        case 7:
                            return [
                                2
                            ];
                    }
                });
            }).call(_this);
        });
        _define_property(this, "sendSanctionMail", function(customerID, leadID, userID) {
            return _async_to_generator(function() {
                var lead, customer, lender, baseUrl, mailData, paydayData, accountDetails, approvalDetails, tenure, intem, gst, fdb, rep1, apr, body, mailData1, emiData, accountDetails1, approvalDetails1, tenure1, tenureInDays, intem1, gst1, fdb1, bpi, rep11, apr1, credits, installments, htmlContent, tableBody, principal, body1, error;
                return _ts_generator(this, function(_state) {
                    switch(_state.label){
                        case 0:
                            _state.trys.push([
                                0,
                                12,
                                ,
                                13
                            ]);
                            return [
                                4,
                                this.leadModel.findOne({
                                    where: {
                                        leadID: leadID
                                    },
                                    select: [
                                        'productID',
                                        'lenderID'
                                    ]
                                })
                            ];
                        case 1:
                            lead = _state.sent();
                            return [
                                4,
                                this.customerModel.findOneCustomer({
                                    customerID: customerID
                                }, [
                                    'name',
                                    'email'
                                ])
                            ];
                        case 2:
                            customer = _state.sent();
                            return [
                                4,
                                lenderModel.findOne({
                                    lenderID: lead.lenderID
                                }, [
                                    '*'
                                ])
                            ];
                        case 3:
                            lender = _state.sent();
                            baseUrl = this.commonHelper.getBaseUrl();
                            if (!(lead.productID === 2)) return [
                                3,
                                7
                            ];
                            return [
                                4,
                                this.mailTemplateModel.findOneMailTemplate({
                                    name: EmailTemplate.SANCTION_PAYDAY
                                })
                            ];
                        case 4:
                            mailData = _state.sent();
                            return [
                                4,
                                this.loanService.calculatePaydayLoanSanctionData(leadID, customerID, userID)
                            ];
                        case 5:
                            paydayData = _state.sent();
                            accountDetails = paydayData.accountDetails, approvalDetails = paydayData.approvalDetails, tenure = paydayData.tenure, intem = paydayData.intem, gst = paydayData.gst, fdb = paydayData.fdb, rep1 = paydayData.rep1, apr = paydayData.apr;
                            mailData.message = mailData.message.replace('{currentDate}', moment().format('DD-MM-YYYY')).replace('{customerName}', customer === null || customer === void 0 ? void 0 : customer.name).replace(/\{baseUrl\}/g, baseUrl).replace('{bankName}', accountDetails === null || accountDetails === void 0 ? void 0 : accountDetails.bank).replace('{accountNo}', accountDetails === null || accountDetails === void 0 ? void 0 : accountDetails.accountNo).replace('{bankIfsc}', accountDetails === null || accountDetails === void 0 ? void 0 : accountDetails.bankIfsc).replace(/\{loanAmtApproved\}/g, approvalDetails === null || approvalDetails === void 0 ? void 0 : approvalDetails.loanAmtApproved.toFixed(2)).replace(/\{tenure\}/g, tenure).replace('{roi}', String(approvalDetails === null || approvalDetails === void 0 ? void 0 : approvalDetails.roi)).replace('{repayDate}', moment(approvalDetails === null || approvalDetails === void 0 ? void 0 : approvalDetails.repayDate).startOf('day').format('DD-MM-YYYY')).replace(/\{ipcDpdInterest\}/g, config.ipcDpdInterest).replace('{dpdPenaltyAmountTotal}', (+config.dpdPenalty + +config.dpdPenalty * (+config.dpdPenaltyGstPercentage / 100)).toFixed(2)).replace('{approvalCreatedDate}', moment(approvalDetails === null || approvalDetails === void 0 ? void 0 : approvalDetails.createdDate).format('DD-MM-YYYY')).replace('{intem}', String(intem)).replace('{gstAdminFee}', (gst + (approvalDetails === null || approvalDetails === void 0 ? void 0 : approvalDetails.adminFee)).toFixed(2)).replace('{adminFee}', approvalDetails === null || approvalDetails === void 0 ? void 0 : approvalDetails.adminFee.toFixed(2)).replace('{gst}', gst.toFixed(2)).replace('{fdb}', fdb.toFixed(2)).replace(/\{rep1\}/g, rep1.toFixed(2)).replace('{aprMonthly}', apr.toFixed(2)).replace(/\{aprAnnualy\}/g, (apr / 12).toFixed(2));
                            body = {
                                form_email: config.otpSenderEmail,
                                to_email: customer === null || customer === void 0 ? void 0 : customer.email,
                                subject: mailData === null || mailData === void 0 ? void 0 : mailData.subject,
                                body_message: mailData === null || mailData === void 0 ? void 0 : mailData.message
                            };
                            return [
                                4,
                                this.apiService.call('post', "/notificationService/sending_email", body, undefined, {
                                    'Content-Type': 'application/json'
                                })
                            ];
                        case 6:
                            _state.sent();
                            return [
                                3,
                                11
                            ];
                        case 7:
                            if (!(lead.productID === 1)) return [
                                3,
                                11
                            ];
                            return [
                                4,
                                this.mailTemplateModel.findOneMailTemplate({
                                    name: EmailTemplate.SANCTION_EMI
                                })
                            ];
                        case 8:
                            mailData1 = _state.sent();
                            return [
                                4,
                                this.loanService.calculateEmiLoanSanctionData(leadID, customerID, userID)
                            ];
                        case 9:
                            emiData = _state.sent();
                            accountDetails1 = emiData.accountDetails, approvalDetails1 = emiData.approvalDetails, tenure1 = emiData.tenure, tenureInDays = emiData.tenureInDays, intem1 = emiData.intem, gst1 = emiData.gst, fdb1 = emiData.fdb, bpi = emiData.bpi, rep11 = emiData.rep1, apr1 = emiData.apr, credits = emiData.credits, installments = emiData.installments;
                            mailData1.message = mailData1.message.replace(/\{currentDate\}/g, moment().format('DD-MM-YYYY')).replace(/\{customerName\}/g, customer === null || customer === void 0 ? void 0 : customer.name).replace(/\{bankName\}/g, accountDetails1 === null || accountDetails1 === void 0 ? void 0 : accountDetails1.bank).replace(/\{accountNo\}/g, accountDetails1 === null || accountDetails1 === void 0 ? void 0 : accountDetails1.accountNo).replace(/\{bankIfsc\}/g, accountDetails1 === null || accountDetails1 === void 0 ? void 0 : accountDetails1.bankIfsc).replace(/\{loanAmtApproved\}/g, approvalDetails1 === null || approvalDetails1 === void 0 ? void 0 : approvalDetails1.loanAmtApproved.toFixed(2)).replace(/\{tenure\}/g, String(tenure1)).replace(/\{tenureInDays\}/g, String(tenureInDays)).replace(/\{roi\}/g, String(approvalDetails1 === null || approvalDetails1 === void 0 ? void 0 : approvalDetails1.roi)).replace(/\{repayDate\}/g, moment(approvalDetails1 === null || approvalDetails1 === void 0 ? void 0 : approvalDetails1.repayDate).startOf('day').format('DD-MM-YYYY')).replace(/\{dpdPenaltyAmountTotal\}/g, ((approvalDetails1 === null || approvalDetails1 === void 0 ? void 0 : approvalDetails1.roi) + +(0.1 * 365).toFixed(2)).toFixed(2)).replace(/\{approvalCreatedDate\}/g, moment(approvalDetails1 === null || approvalDetails1 === void 0 ? void 0 : approvalDetails1.createdDate).format('DD-MM-YYYY')).replace(/\{intem\}/g, String(intem1)).replace(/\{gstAdminFee\}/g, (gst1 + (approvalDetails1 === null || approvalDetails1 === void 0 ? void 0 : approvalDetails1.adminFee)).toFixed(2)).replace(/\{adminFee\}/g, approvalDetails1 === null || approvalDetails1 === void 0 ? void 0 : approvalDetails1.adminFee.toFixed(2)).replace(/\{gst\}/g, gst1.toFixed(2)).replace(/\{fdb\}/g, fdb1.toFixed(2)).replace(/\{bpi\}/g, bpi.toFixed(2)).replace(/\{rep1\}/g, rep11.toFixed(2)).replace(/\{apr\}/g, apr1.toFixed(2)).replace(/\{eachInstallmentAmount\}/g, (rep11 / tenure1).toFixed(2));
                            // Put the EMIs data in table
                            htmlContent = load(mailData1.message);
                            tableBody = htmlContent('#installments-table-body');
                            principal = credits.principal;
                            installments.forEach(function(installment, index) {
                                var closingPrincipal = principal - (installment === null || installment === void 0 ? void 0 : installment.principal);
                                var row = '\n              <tr style="text-align: center;">\n                  <td>'.concat(index + 1, ".</td>\n                  <td>").concat(moment(installment === null || installment === void 0 ? void 0 : installment.dueDate).format('YYYY-MM-DD'), "</td>\n                  <td>").concat(principal.toFixed(2), "</td>\n                  <td>").concat(installment === null || installment === void 0 ? void 0 : installment.amountPayable.toFixed(2), "</td>\n                  <td>").concat(installment === null || installment === void 0 ? void 0 : installment.principal.toFixed(2), "</td>\n                  <td>").concat(installment === null || installment === void 0 ? void 0 : installment.interest.toFixed(2), "</td>\n                  <td>").concat(closingPrincipal.toFixed(2), "</td>\n                  <td>").concat(approvalDetails1 === null || approvalDetails1 === void 0 ? void 0 : approvalDetails1.roi, "</td>\n              </tr>\n          ");
                                tableBody.append(row);
                                principal = closingPrincipal; // Update principal after each installment
                            });
                            body1 = {
                                form_email: config.otpSenderEmail,
                                to_email: customer === null || customer === void 0 ? void 0 : customer.email,
                                subject: mailData1 === null || mailData1 === void 0 ? void 0 : mailData1.subject,
                                body_message: htmlContent.html()
                            };
                            return [
                                4,
                                this.apiService.call('post', "/notificationService/sending_email", body1, undefined, {
                                    'Content-Type': 'application/json'
                                })
                            ];
                        case 10:
                            _state.sent();
                            _state.label = 11;
                        case 11:
                            return [
                                2
                            ];
                        case 12:
                            error = _state.sent();
                            throw error;
                        case 13:
                            return [
                                2
                            ];
                    }
                });
            }).call(_this);
        });
        _define_property(this, "sendingPDFEmail", function(from_email, email, subject, lenderName, pdfBase64, ext, file_name, mail_content) {
            return _async_to_generator(function() {
                var body, res, error;
                return _ts_generator(this, function(_state) {
                    switch(_state.label){
                        case 0:
                            _state.trys.push([
                                0,
                                2,
                                ,
                                3
                            ]);
                            body = {
                                form_email: from_email,
                                to_email: email,
                                subject: "".concat(lenderName, " : ").concat(subject),
                                body_message: "".concat(mail_content ? mail_content : "".concat(lenderName, " : ").concat(subject)),
                                attachment: pdfBase64,
                                ext: ext,
                                file_name: file_name
                            };
                            return [
                                4,
                                this.apiService.call('post', "/notificationService/sending_email", body, undefined, {
                                    'Content-Type': 'application/json'
                                })
                            ];
                        case 1:
                            res = _state.sent();
                            return [
                                2,
                                res
                            ];
                        case 2:
                            error = _state.sent();
                            throw error;
                        case 3:
                            return [
                                2
                            ];
                    }
                });
            }).call(_this);
        });
        _define_property(this, "sendingWhatsAppMessage", function(phoneNumber, otp) {
            return _async_to_generator(function() {
                var cleanedPhoneNumber, body, interaktService, response, error;
                return _ts_generator(this, function(_state) {
                    switch(_state.label){
                        case 0:
                            _state.trys.push([
                                0,
                                2,
                                ,
                                3
                            ]);
                            // Remove any leading '+91' or '91' if present
                            cleanedPhoneNumber = phoneNumber.toString().replace(/^(\+91|91)/, '');
                            body = {
                                countryCode: '+91',
                                phoneNumber: cleanedPhoneNumber,
                                type: 'Template',
                                callbackData: 'whatsapp_otp_verification',
                                template: {
                                    name: 'newlogin',
                                    languageCode: 'en',
                                    bodyValues: [
                                        otp
                                    ],
                                    buttonValues: {
                                        '0': [
                                            otp
                                        ]
                                    }
                                }
                            };
                            // Create an axios instance for the Interakt API
                            interaktService = new AxiosService('https://api.interakt.ai/v1/public');
                            return [
                                4,
                                interaktService.call('post', '/message/', body, undefined, {
                                    'Content-Type': 'application/json',
                                    Authorization: 'Basic YnVXTF9BWmdGQjd0bXdSbndhV3hzbUVKR2hCaURoVzZXaXRtQjBxS0VjQTo='
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
                            console.error('Error sending WhatsApp message:', error);
                            throw error;
                        case 3:
                            return [
                                2
                            ];
                    }
                });
            })();
        });
        _define_property(this, "sendingWhatsAppMessageForCronJobFail", function() {
            return _async_to_generator(function() {
                var phoneNumber, phoneNumbers, interaktService, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, mobileNumber, body, res, err, error;
                return _ts_generator(this, function(_state) {
                    switch(_state.label){
                        case 0:
                            _state.trys.push([
                                0,
                                9,
                                ,
                                10
                            ]);
                            phoneNumber = config.disbursalWhatsappAlert;
                            phoneNumbers = phoneNumber.split(',');
                            interaktService = new AxiosService(config.interaktUrl);
                            _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
                            _state.label = 1;
                        case 1:
                            _state.trys.push([
                                1,
                                6,
                                7,
                                8
                            ]);
                            _iterator = phoneNumbers[Symbol.iterator]();
                            _state.label = 2;
                        case 2:
                            if (!!(_iteratorNormalCompletion = (_step = _iterator.next()).done)) return [
                                3,
                                5
                            ];
                            mobileNumber = _step.value;
                            body = {
                                countryCode: '+91',
                                phoneNumber: mobileNumber,
                                type: 'Template',
                                callbackData: 'Disbursal_Cron_Job_Failed',
                                template: {
                                    name: 'disbursal_stoped',
                                    languageCode: 'en',
                                    bodyValues: [
                                        'Disbursal Stopped for Ramfin!'
                                    ]
                                }
                            };
                            return [
                                4,
                                interaktService.call('post', '/message/', body, undefined, {
                                    'Content-Type': 'application/json',
                                    Authorization: config.interaktWhatsappAlertKey
                                })
                            ];
                        case 3:
                            res = _state.sent();
                            console.log(res);
                            _state.label = 4;
                        case 4:
                            _iteratorNormalCompletion = true;
                            return [
                                3,
                                2
                            ];
                        case 5:
                            return [
                                3,
                                8
                            ];
                        case 6:
                            err = _state.sent();
                            _didIteratorError = true;
                            _iteratorError = err;
                            return [
                                3,
                                8
                            ];
                        case 7:
                            try {
                                if (!_iteratorNormalCompletion && _iterator.return != null) {
                                    _iterator.return();
                                }
                            } finally{
                                if (_didIteratorError) {
                                    throw _iteratorError;
                                }
                            }
                            return [
                                7
                            ];
                        case 8:
                            return [
                                2,
                                {
                                    message: 'Send whatsapp alert successfully'
                                }
                            ];
                        case 9:
                            error = _state.sent();
                            console.error('Error sending WhatsApp message:', error);
                            throw error;
                        case 10:
                            return [
                                2
                            ];
                    }
                });
            })();
        });
        _define_property(this, "sendEmailChangeOtp", function(email, name, otp) {
            return _async_to_generator(function() {
                var mailData, body, error;
                return _ts_generator(this, function(_state) {
                    switch(_state.label){
                        case 0:
                            _state.trys.push([
                                0,
                                3,
                                ,
                                4
                            ]);
                            return [
                                4,
                                this.mailTemplateModel.findOneMailTemplate({
                                    name: EmailTemplate.EMAIL_CHANGE
                                })
                            ];
                        case 1:
                            mailData = _state.sent();
                            console.log(mailData.message);
                            mailData.message = mailData.message.replace('{{$otp}}', otp.toString());
                            mailData.message = mailData.message.replace('{{$name}}', capitalizeWords(name));
                            body = {
                                form_email: config.otpSenderEmail,
                                to_email: email,
                                subject: mailData === null || mailData === void 0 ? void 0 : mailData.subject,
                                body_message: mailData === null || mailData === void 0 ? void 0 : mailData.message
                            };
                            return [
                                4,
                                this.apiService.call('post', "/notificationService/sending_email", body, undefined, {
                                    'Content-Type': 'application/json'
                                })
                            ];
                        case 2:
                            _state.sent();
                            return [
                                3,
                                4
                            ];
                        case 3:
                            error = _state.sent();
                            throw error;
                        case 4:
                            return [
                                2
                            ];
                    }
                });
            }).call(_this);
        });
        _define_property(this, "sendReferralSignupEmail", function(email, name, mobile) {
            return _async_to_generator(function() {
                var mailData, body, error;
                return _ts_generator(this, function(_state) {
                    switch(_state.label){
                        case 0:
                            _state.trys.push([
                                0,
                                3,
                                ,
                                4
                            ]);
                            return [
                                4,
                                this.mailTemplateModel.findOneMailTemplate({
                                    name: EmailTemplate.REFERRAL_SIGNUP
                                })
                            ];
                        case 1:
                            mailData = _state.sent();
                            mailData.message = mailData.message.replace('{{mobile}}', mobile.toString());
                            // mailData.message = mailData.message.replace('{{$name}}', capitalizeWords(name))
                            body = {
                                form_email: config.otpSenderEmail,
                                to_email: email,
                                subject: mailData === null || mailData === void 0 ? void 0 : mailData.subject,
                                body_message: mailData === null || mailData === void 0 ? void 0 : mailData.message
                            };
                            return [
                                4,
                                this.apiService.call('post', "/notificationService/sending_email", body, undefined, {
                                    'Content-Type': 'application/json'
                                })
                            ];
                        case 2:
                            _state.sent();
                            return [
                                3,
                                4
                            ];
                        case 3:
                            error = _state.sent();
                            throw error;
                        case 4:
                            return [
                                2
                            ];
                    }
                });
            }).call(_this);
        });
        _define_property(this, "sendWithdrawalProcessedEmail", function(customerId) {
            return _async_to_generator(function() {
                var _ref, mailData, customerDetails, body, error;
                return _ts_generator(this, function(_state) {
                    switch(_state.label){
                        case 0:
                            _state.trys.push([
                                0,
                                3,
                                ,
                                4
                            ]);
                            return [
                                4,
                                Promise.all([
                                    this.mailTemplateModel.findOneMailTemplate({
                                        name: EmailTemplate.WITHDRAWAL_PROCESSED
                                    }),
                                    this.customerModel.findOneCustomer({
                                        customerID: customerId
                                    })
                                ])
                            ];
                        case 1:
                            _ref = _sliced_to_array.apply(void 0, [
                                _state.sent(),
                                2
                            ]), mailData = _ref[0], customerDetails = _ref[1];
                            mailData.message = mailData.message.replace('{{$name}}', capitalizeWords(customerDetails.name));
                            body = {
                                form_email: config.otpSenderEmail,
                                to_email: customerDetails.email,
                                subject: mailData === null || mailData === void 0 ? void 0 : mailData.subject,
                                body_message: mailData === null || mailData === void 0 ? void 0 : mailData.message
                            };
                            return [
                                4,
                                this.apiService.call('post', "/notificationService/sending_email", body, undefined, {
                                    'Content-Type': 'application/json'
                                })
                            ];
                        case 2:
                            _state.sent();
                            return [
                                3,
                                4
                            ];
                        case 3:
                            error = _state.sent();
                            throw error;
                        case 4:
                            return [
                                2
                            ];
                    }
                });
            }).call(_this);
        });
    }
    _create_class(NotificationUtils, [
        {
            key: "changeResponse",
            value: function changeResponse(jsonResponse) {
                var _response_data, _response_data_data, _response_data1, _response_data_data__, _response_data_data_, _response_data_data1, _response_data2;
                var response;
                try {
                    response = JSON.parse(jsonResponse);
                } catch (error) {
                    return JSON.stringify({
                        message: 'Invalid JSON format',
                        type: 'error'
                    });
                }
                var convertedResponse = {
                    message: 'Unexpected error',
                    type: 'error'
                };
                if ((response === null || response === void 0 ? void 0 : (_response_data = response.data) === null || _response_data === void 0 ? void 0 : _response_data.status) === 'OK' && Array.isArray(response === null || response === void 0 ? void 0 : (_response_data1 = response.data) === null || _response_data1 === void 0 ? void 0 : (_response_data_data = _response_data1.data) === null || _response_data_data === void 0 ? void 0 : _response_data_data[0]) && (response === null || response === void 0 ? void 0 : (_response_data2 = response.data) === null || _response_data2 === void 0 ? void 0 : (_response_data_data1 = _response_data2.data) === null || _response_data_data1 === void 0 ? void 0 : (_response_data_data_ = _response_data_data1[0]) === null || _response_data_data_ === void 0 ? void 0 : (_response_data_data__ = _response_data_data_[0]) === null || _response_data_data__ === void 0 ? void 0 : _response_data_data__.id)) {
                    var id = response.data.data[0][0].id;
                    var group_id = id.split('-')[0];
                    convertedResponse = {
                        message: group_id,
                        type: 'success'
                    };
                } else {
                    convertedResponse = {
                        message: 'Missing or invalid data structure.',
                        type: 'error'
                    };
                }
                return JSON.stringify(convertedResponse);
            }
        }
    ]);
    return NotificationUtils;
}();
export var notificationUtils = new NotificationUtils();

//# sourceMappingURL=notification.js.map