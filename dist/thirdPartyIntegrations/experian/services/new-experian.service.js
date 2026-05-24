function _array_like_to_array(arr, len) {
    if (len == null || len > arr.length) len = arr.length;
    for(var i = 0, arr2 = new Array(len); i < len; i++)arr2[i] = arr[i];
    return arr2;
}
function _array_with_holes(arr) {
    if (Array.isArray(arr)) return arr;
}
function _assert_this_initialized(self) {
    if (self === void 0) {
        throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }
    return self;
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
function _call_super(_this, derived, args) {
    derived = _get_prototype_of(derived);
    return _possible_constructor_return(_this, _is_native_reflect_construct() ? Reflect.construct(derived, args || [], _get_prototype_of(_this).constructor) : derived.apply(_this, args));
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
function _get_prototype_of(o) {
    _get_prototype_of = Object.setPrototypeOf ? Object.getPrototypeOf : function getPrototypeOf(o) {
        return o.__proto__ || Object.getPrototypeOf(o);
    };
    return _get_prototype_of(o);
}
function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
        throw new TypeError("Super expression must either be null or a function");
    }
    subClass.prototype = Object.create(superClass && superClass.prototype, {
        constructor: {
            value: subClass,
            writable: true,
            configurable: true
        }
    });
    if (superClass) _set_prototype_of(subClass, superClass);
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
function _possible_constructor_return(self, call) {
    if (call && (_type_of(call) === "object" || typeof call === "function")) {
        return call;
    }
    return _assert_this_initialized(self);
}
function _set_prototype_of(o, p) {
    _set_prototype_of = Object.setPrototypeOf || function setPrototypeOf(o, p) {
        o.__proto__ = p;
        return o;
    };
    return _set_prototype_of(o, p);
}
function _sliced_to_array(arr, i) {
    return _array_with_holes(arr) || _iterable_to_array_limit(arr, i) || _unsupported_iterable_to_array(arr, i) || _non_iterable_rest();
}
function _type_of(obj) {
    "@swc/helpers - typeof";
    return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol ? "symbol" : typeof obj;
}
function _unsupported_iterable_to_array(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return _array_like_to_array(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(n);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _array_like_to_array(o, minLen);
}
function _is_native_reflect_construct() {
    try {
        var result = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {}));
    } catch (_) {}
    return (_is_native_reflect_construct = function() {
        return !!result;
    })();
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
import axios, { HttpStatusCode } from 'axios';
import moment from 'moment-timezone';
import * as xml2js from 'xml2js';
import ResponseService from '@/services/response.service';
import { leadsApiLogModel } from '@/database/mysql/lead_api_log';
import CreditReportModel from '@/database/mysql/credit_report';
import { ApiSupplierType } from '@/enums/common.enum';
import { LenderCredentials } from '@/enums/lender.enum';
import { LeadLogApiType } from '@/enums/leadLog.enum';
import { NotFoundError } from '@/errors';
import { getKnexInstance } from '@/utils/mysql';
// Local imports
import StateModel from '../models/state.model';
import ApiBypassModel from '../models/apiBypass.model';
import RazorpayClient from '../utils/razorpayClient.utils';
import { getCustomerDetails } from '../utils/query.utils';
var NewExperianService = /*#__PURE__*/ function(ResponseService) {
    "use strict";
    _inherits(NewExperianService, ResponseService);
    function NewExperianService() {
        _class_call_check(this, NewExperianService);
        var _this;
        _this = _call_super(this, NewExperianService, arguments), _define_property(_this, "stateModel", new StateModel()), _define_property(_this, "leadsApiLogModel", leadsApiLogModel), _define_property(_this, "creditReportModel", new CreditReportModel()), _define_property(_this, "apiBypassModel", new ApiBypassModel()), _define_property(_this, "razorpayClient", new RazorpayClient());
        return _this;
    }
    _create_class(NewExperianService, [
        {
            key: "hardPullExperianCustomerDetails",
            value: function hardPullExperianCustomerDetails(customerID, leadID, userID) {
                return _async_to_generator(function() {
                    var db, customer, lender_creds, data, response;
                    return _ts_generator(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                db = getKnexInstance();
                                return [
                                    4,
                                    db('customer as c').join('leads as l', 'l.customerID', 'c.customerID').where('l.leadID', '=', leadID).where('c.customerID', '=', customerID).where('l.customerID', '=', customerID).whereIn('l.status', [
                                        'Fresh Lead',
                                        'Document Received'
                                    ])
                                ];
                            case 1:
                                customer = _state.sent();
                                if (customer.length == 0) {
                                    throw new NotFoundError('Customer Not Found');
                                }
                                return [
                                    4,
                                    this.razorpayClient.getLenderCredentialsByLeadId(leadID, LenderCredentials.EXPERIAN_HARD_PULL)
                                ];
                            case 2:
                                lender_creds = _state.sent();
                                return [
                                    4,
                                    this.getExperianDetails(leadID, userID, customer[0].customerID, lender_creds)
                                ];
                            case 3:
                                data = _state.sent();
                                response = this.convertToExperianResponse(data);
                                return [
                                    2,
                                    response
                                ];
                        }
                    });
                }).call(this);
            }
        },
        {
            key: "getHardPullExperianCrmDetails",
            value: function getHardPullExperianCrmDetails(leadID, userID) {
                return _async_to_generator(function() {
                    var db, customer, lender_creds, data, response;
                    return _ts_generator(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                db = getKnexInstance();
                                return [
                                    4,
                                    db('customer as c').join('leads as l', 'l.customerID', 'c.customerID').where('l.leadID', '=', leadID)
                                ];
                            case 1:
                                customer = _state.sent();
                                if (customer.length == 0) {
                                    throw new NotFoundError('Customer Not Found');
                                }
                                return [
                                    4,
                                    this.razorpayClient.getLenderCredentialsByLeadId(leadID, LenderCredentials.EXPERIAN_HARD_PULL)
                                ];
                            case 2:
                                lender_creds = _state.sent();
                                return [
                                    4,
                                    this.getExperianDetails(leadID, userID, customer[0].customerID, lender_creds)
                                ];
                            case 3:
                                data = _state.sent();
                                response = this.convertToExperianResponse(data);
                                return [
                                    2,
                                    response
                                ];
                        }
                    });
                }).call(this);
            }
        },
        {
            key: "getHardPullExperianBureauDetails",
            value: function getHardPullExperianBureauDetails(customerID, leadID, userID) {
                return _async_to_generator(function() {
                    var db, customer, lender_creds, data, response, bureauResponse;
                    return _ts_generator(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                db = getKnexInstance();
                                return [
                                    4,
                                    db('customer as c').join('leads as l', 'l.customerID', 'c.customerID').where('l.leadID', '=', leadID).where('c.customerID', '=', customerID).where('l.customerID', '=', customerID).whereIn('l.status', [
                                        'Fresh Lead',
                                        'Document Received'
                                    ])
                                ];
                            case 1:
                                customer = _state.sent();
                                if (customer.length == 0) {
                                    throw new NotFoundError('Customer Not Found');
                                }
                                return [
                                    4,
                                    this.razorpayClient.getLenderCredentialsByLeadId(leadID, LenderCredentials.EXPERIAN_HARD_PULL)
                                ];
                            case 2:
                                lender_creds = _state.sent();
                                return [
                                    4,
                                    this.getExperianDetails(leadID, userID, customerID, lender_creds)
                                ];
                            case 3:
                                data = _state.sent();
                                response = this.convertToExperianResponse(data);
                                bureauResponse = this.convertToBureauExperianResponse(response.data);
                                response.data = bureauResponse;
                                return [
                                    2,
                                    response
                                ];
                        }
                    });
                }).call(this);
            }
        },
        {
            key: "getExperianDetails",
            value: function getExperianDetails(leadID, userID, customerID, lender_creds) {
                return _async_to_generator(function() {
                    var db, parser, customerDetails, lead, GenderCode, stateID, formattedDob, _this_convertToHardPullExperianRequest, api_request, requestData, output, response, xmlData, _ref, savedLogId, parsedOutput;
                    return _ts_generator(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                db = getKnexInstance();
                                parser = new xml2js.Parser({
                                    explicitArray: false
                                });
                                return [
                                    4,
                                    getCustomerDetails(leadID)
                                ];
                            case 1:
                                customerDetails = _state.sent();
                                return [
                                    4,
                                    db('leads').select('lenderID').where('leadID', leadID).first()
                                ];
                            case 2:
                                lead = _state.sent();
                                GenderCode = this.getGenderCode(customerDetails.gender);
                                return [
                                    4,
                                    this.stateModel.findOneState({
                                        stateName: customerDetails.state
                                    }, [
                                        'cibil_state_code'
                                    ])
                                ];
                            case 3:
                                stateID = _state.sent();
                                if (!stateID) throw new NotFoundError('State Not Found');
                                formattedDob = moment(customerDetails.dob).format('YYYYmmDD');
                                _this_convertToHardPullExperianRequest = this.convertToHardPullExperianRequest(customerDetails, GenderCode, formattedDob, stateID, lender_creds), api_request = _this_convertToHardPullExperianRequest.api_request, requestData = _this_convertToHardPullExperianRequest.requestData;
                                return [
                                    4,
                                    axios.request(api_request)
                                ];
                            case 4:
                                response = _state.sent();
                                xmlData = response.data;
                                parser.parseString(xmlData, function(err, result) {
                                    if (err) {
                                        throw new NotFoundError('Error parsing SOAP XML:', {
                                            data: err
                                        });
                                    }
                                    // Extract the inner XML inside <ns2:out>
                                    var innerXml = result['SOAP-ENV:Envelope']['SOAP-ENV:Body']['ns2:processResponse']['ns2:out'];
                                    // Parse the inner XML separately
                                    parser.parseString(innerXml, function(innerErr, innerResult) {
                                        if (innerErr) {
                                            throw new NotFoundError('Error parsing inner XML:' + innerErr.message);
                                        }
                                        output = JSON.stringify(innerResult, null, 2);
                                    });
                                });
                                return [
                                    4,
                                    this.saveLeadApiLogDetails(leadID, customerDetails, output, requestData, lender_creds)
                                ];
                            case 5:
                                _ref = _sliced_to_array.apply(void 0, [
                                    _state.sent(),
                                    1
                                ]), savedLogId = _ref[0];
                                parsedOutput = JSON.parse(output);
                                return [
                                    4,
                                    this.saveCreditReportDetails(customerID, parsedOutput, userID, savedLogId)
                                ];
                            case 6:
                                _state.sent();
                                return [
                                    2,
                                    parsedOutput
                                ];
                        }
                    });
                }).call(this);
            }
        },
        {
            key: "saveCreditReportDetails",
            value: function saveCreditReportDetails(customerID, parsedOutput, userID, savedLogId) {
                return _async_to_generator(function() {
                    var _parsedOutput_INProfileResponse_CreditProfileHeader, _parsedOutput_INProfileResponse, _parsedOutput_INProfileResponse_UserMessage, _parsedOutput_INProfileResponse1, _parsedOutput_INProfileResponse_SCORE, _parsedOutput_INProfileResponse2, _parsedOutput_INProfileResponse_UserMessage1, _parsedOutput_INProfileResponse3, creditReportDetails, _ref, savedCreditId;
                    return _ts_generator(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                creditReportDetails = {
                                    cr_provider: 3,
                                    bucket_id: null,
                                    customerID: customerID,
                                    stage_one_id: ((_parsedOutput_INProfileResponse = parsedOutput.INProfileResponse) === null || _parsedOutput_INProfileResponse === void 0 ? void 0 : (_parsedOutput_INProfileResponse_CreditProfileHeader = _parsedOutput_INProfileResponse.CreditProfileHeader) === null || _parsedOutput_INProfileResponse_CreditProfileHeader === void 0 ? void 0 : _parsedOutput_INProfileResponse_CreditProfileHeader.ReportNumber) || '',
                                    stage_two_id: null,
                                    errors: null,
                                    status: +(((_parsedOutput_INProfileResponse1 = parsedOutput.INProfileResponse) === null || _parsedOutput_INProfileResponse1 === void 0 ? void 0 : (_parsedOutput_INProfileResponse_UserMessage = _parsedOutput_INProfileResponse1.UserMessage) === null || _parsedOutput_INProfileResponse_UserMessage === void 0 ? void 0 : _parsedOutput_INProfileResponse_UserMessage.UserMessageText) === 'Normal Response'),
                                    score: +((_parsedOutput_INProfileResponse2 = parsedOutput.INProfileResponse) === null || _parsedOutput_INProfileResponse2 === void 0 ? void 0 : (_parsedOutput_INProfileResponse_SCORE = _parsedOutput_INProfileResponse2.SCORE) === null || _parsedOutput_INProfileResponse_SCORE === void 0 ? void 0 : _parsedOutput_INProfileResponse_SCORE.BureauScore) || 0,
                                    initiated_by: userID !== null && userID !== void 0 ? userID : +config.defaultUserId,
                                    created_by: userID !== null && userID !== void 0 ? userID : +config.defaultUserId,
                                    log_id: savedLogId,
                                    created_at: new Date()
                                };
                                if (!creditReportDetails.status) creditReportDetails.errors = ((_parsedOutput_INProfileResponse3 = parsedOutput.INProfileResponse) === null || _parsedOutput_INProfileResponse3 === void 0 ? void 0 : (_parsedOutput_INProfileResponse_UserMessage1 = _parsedOutput_INProfileResponse3.UserMessage) === null || _parsedOutput_INProfileResponse_UserMessage1 === void 0 ? void 0 : _parsedOutput_INProfileResponse_UserMessage1.UserMessageText) || 'Error Response';
                                return [
                                    4,
                                    this.creditReportModel.create(creditReportDetails)
                                ];
                            case 1:
                                _ref = _sliced_to_array.apply(void 0, [
                                    _state.sent(),
                                    1
                                ]), savedCreditId = _ref[0];
                                return [
                                    2,
                                    savedCreditId
                                ];
                        }
                    });
                }).call(this);
            }
        },
        {
            key: "saveLeadApiLogDetails",
            value: function saveLeadApiLogDetails(leadID, customerDetails, output, requestData, lender_creds) {
                return _async_to_generator(function() {
                    var logDetails;
                    return _ts_generator(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                logDetails = {
                                    leadID: leadID.toString(),
                                    customerID: customerDetails.customerID,
                                    api_type: LeadLogApiType.EXPERIAN_HARD_PULL,
                                    api_supplier: ApiSupplierType.CIBIL,
                                    api_response: output,
                                    status: 1,
                                    api_endpoint_url: lender_creds === null || lender_creds === void 0 ? void 0 : lender_creds.EXPERIAN_HARDPULL_URL,
                                    api_method: lender_creds === null || lender_creds === void 0 ? void 0 : lender_creds.EXPERIAN_HARDPULL_METHOD,
                                    api_request: JSON.stringify(requestData),
                                    mobile_no: customerDetails.mobile,
                                    pancard: customerDetails.pancard
                                };
                                return [
                                    4,
                                    this.leadsApiLogModel.insert(logDetails)
                                ];
                            case 1:
                                return [
                                    2,
                                    _state.sent()
                                ];
                        }
                    });
                }).call(this);
            }
        },
        {
            key: "convertToHardPullExperianRequest",
            value: function convertToHardPullExperianRequest(customerDetails, GenderCode, formattedDob, stateID, lender_creds) {
                var _customerDetails_firstName;
                var requestData = {
                    'soapenv:Envelope': {
                        $: {
                            'xmlns:soapenv': 'http://schemas.xmlsoap.org/soap/envelope/',
                            'xmlns:urn': 'urn:cbv2'
                        },
                        'soapenv:Header': {},
                        'soapenv:Body': {
                            'urn:process': {
                                'urn:in': {
                                    INProfileRequest: {
                                        Identification: {
                                            XMLUser: lender_creds === null || lender_creds === void 0 ? void 0 : lender_creds.EXPERIAN_HARDPULL_USERNAME,
                                            XMLPassword: lender_creds === null || lender_creds === void 0 ? void 0 : lender_creds.EXPERIAN_HARDPULL_PASSWORD
                                        },
                                        Application: {
                                            FTReferenceNumber: '',
                                            CustomerReferenceID: '',
                                            EnquiryReason: '13',
                                            FinancePurpose: '99',
                                            AmountFinanced: '5000',
                                            DurationOfAgreement: '6',
                                            ScoreFlag: '3',
                                            PSVFlag: '0'
                                        },
                                        Applicant: {
                                            Surname: customerDetails.lastName,
                                            FirstName: (_customerDetails_firstName = customerDetails.firstName) !== null && _customerDetails_firstName !== void 0 ? _customerDetails_firstName : customerDetails.lastName,
                                            MiddleName1: customerDetails.middlename || '',
                                            MiddleName2: '',
                                            MiddleName3: '',
                                            GenderCode: GenderCode,
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
                                            EMailId: customerDetails.email
                                        },
                                        Details: {
                                            Income: '',
                                            MaritalStatus: '',
                                            EmployStatus: '',
                                            TimeWithEmploy: '',
                                            NumberOfMajorCreditCardHeld: ''
                                        },
                                        Address: {
                                            FlatNoPlotNoHouseNo: customerDetails.address,
                                            BldgNoSocietyName: customerDetails.city,
                                            RoadNoNameAreaLocality: '',
                                            City: customerDetails.city,
                                            Landmark: '',
                                            State: stateID.cibil_state_code,
                                            PinCode: customerDetails.pincode
                                        },
                                        AdditionalAddressFlag: {
                                            Flag: 'N'
                                        },
                                        AdditionalAddress: {
                                            FlatNoPlotNoHouseNo: '',
                                            BldgNoSocietyName: '',
                                            RoadNoNameAreaLocality: '',
                                            City: '',
                                            Landmark: '',
                                            State: '',
                                            PinCode: ''
                                        }
                                    }
                                }
                            }
                        }
                    }
                };
                // Convert the JavaScript object to XML
                var builder = new xml2js.Builder({
                    headless: true
                });
                var xmlRequest = builder.buildObject(requestData);
                var api_request = {
                    method: lender_creds === null || lender_creds === void 0 ? void 0 : lender_creds.EXPERIAN_HARDPULL_METHOD,
                    url: lender_creds === null || lender_creds === void 0 ? void 0 : lender_creds.EXPERIAN_HARDPULL_URL,
                    headers: {
                        'Content-Type': lender_creds === null || lender_creds === void 0 ? void 0 : lender_creds.EXPERIAN_HARDPULL_CONTENT_TYPE
                    },
                    data: xmlRequest
                };
                return {
                    api_request: api_request,
                    requestData: requestData
                };
            }
        },
        {
            key: "getGenderCode",
            value: function getGenderCode(gender) {
                var GenderCode = 1 //1 for male default case
                ;
                if (gender === 'Female') {
                    GenderCode = 2;
                } else if (gender === 'Transgender') {
                    GenderCode = 3;
                }
                return GenderCode;
            }
        },
        {
            key: "convertToExperianResponse",
            value: function convertToExperianResponse(data) {
                var _data_INProfileResponse_UserMessage, _data_INProfileResponse;
                var userMessage = (_data_INProfileResponse = data.INProfileResponse) === null || _data_INProfileResponse === void 0 ? void 0 : (_data_INProfileResponse_UserMessage = _data_INProfileResponse.UserMessage) === null || _data_INProfileResponse_UserMessage === void 0 ? void 0 : _data_INProfileResponse_UserMessage.UserMessageText;
                // Handle valid responses: Normal Response or No record found
                if (userMessage === 'Normal Response' || (userMessage === null || userMessage === void 0 ? void 0 : userMessage.includes('No record found'))) {
                    return {
                        statusCode: HttpStatusCode.Ok,
                        data: data,
                        message: (userMessage === null || userMessage === void 0 ? void 0 : userMessage.includes('No record found')) ? 'No credit history found' : 'Success'
                    };
                }
                // Handle other error cases
                return {
                    statusCode: HttpStatusCode.InternalServerError,
                    data: {},
                    message: "Unable to fetch experian data: ".concat(userMessage || 'Unknown error')
                };
            }
        },
        {
            key: "convertToBureauExperianResponse",
            value: function convertToBureauExperianResponse(details) {
                var _details_INProfileResponse_CAIS_Account, _details_INProfileResponse, _details_INProfileResponse1;
                var accountDetails = (details === null || details === void 0 ? void 0 : (_details_INProfileResponse = details.INProfileResponse) === null || _details_INProfileResponse === void 0 ? void 0 : (_details_INProfileResponse_CAIS_Account = _details_INProfileResponse.CAIS_Account) === null || _details_INProfileResponse_CAIS_Account === void 0 ? void 0 : _details_INProfileResponse_CAIS_Account.CAIS_Account_DETAILS) || null;
                var transformAccountDetails = function transformAccountDetails(account) {
                    return _object_spread_props(_object_spread({}, account), {
                        CAIS_Holder_Details: {},
                        CAIS_Holder_Address_Details: {},
                        CAIS_Holder_Phone_Details: {},
                        CAIS_Holder_ID_Details: {}
                    });
                };
                var accountDetailsResponse = accountDetails;
                if (accountDetails) {
                    if (Array.isArray(accountDetails)) {
                        accountDetailsResponse = accountDetails.map(transformAccountDetails);
                    } else if ((typeof accountDetails === "undefined" ? "undefined" : _type_of(accountDetails)) === 'object') {
                        accountDetailsResponse = transformAccountDetails(accountDetails);
                    }
                }
                if (!details || Object.keys(details).length === 0) {
                    return null;
                }
                return _object_spread_props(_object_spread({}, details), {
                    INProfileResponse: _object_spread_props(_object_spread({}, details.INProfileResponse), {
                        CreditProfileHeader: {},
                        CAIS_Account: _object_spread_props(_object_spread({}, (_details_INProfileResponse1 = details.INProfileResponse) === null || _details_INProfileResponse1 === void 0 ? void 0 : _details_INProfileResponse1.CAIS_Account), {
                            CAIS_Account_DETAILS: accountDetailsResponse
                        })
                    })
                });
            }
        }
    ]);
    return NewExperianService;
}(ResponseService);
export default NewExperianService;

//# sourceMappingURL=new-experian.service.js.map