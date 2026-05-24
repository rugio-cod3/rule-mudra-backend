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
import axios from 'axios';
import { format } from 'date-fns';
import CallHistoryLogModel from '../../database/mysql/callhistorylogs';
import CrProfileAccountModel from '../../database/mysql/crProfileAccounts';
import CrProfileRepaymentDataModel from '../../database/mysql/crProfileRepaymentData';
import { LeadStatus } from '../../enums/lead.enum';
import { approvalService } from '../../services/approval.service';
import { bureauDataservice } from '../../services/bureauData.service';
import LeadApiLogService from '../../services/leadApiLog.service';
import { logger } from '../../utils/logger';
import { getKnexInstance } from '../../utils/mysql';
import CallHistoryLogService from '../callhistorylog.service';
import CustomerService from '../customer.service';
import { leadService } from '../lead.service';
import LeadApiLogMongoDBService from '../leadApiLogMongo.service';
import { finboxService } from '../thirdParty/finbox.service';
var BUREAU_V2_SUPPLIER_ID = 11;
var LONG_TERM_DEFAULT_ROI = config.bureauLongTermDefaultRoi;
var LONG_TERM_OFFER_ROI = config.bureauLongTermOfferRoi;
var LONG_TERM_SWITCH = Number(config.bureauLongTermSwitch);
var leadApiLogService = new LeadApiLogService();
// const finboxService = new FinboxService()
var crProfileAccountModel = new CrProfileAccountModel();
var crProfileRepaymentModel = new CrProfileRepaymentDataModel();
var leadApiLogMongoDBService = new LeadApiLogMongoDBService();
var customerService = new CustomerService();
var callHistoryLogModel = new CallHistoryLogModel();
var callHistoryLogService = new CallHistoryLogService();
export function breCibilExperianFlow(leadID, customerID) {
    return _async_to_generator(function() {
        var output, apiName, type, remarkApprove, rejectremark, rejectremark1, error;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    _state.trys.push([
                        0,
                        11,
                        ,
                        12
                    ]);
                    return [
                        4,
                        cibilExperianBureau(leadID)
                    ];
                case 1:
                    output = _state.sent();
                    if (!(config.nodeEnv !== 'PROD')) return [
                        3,
                        3
                    ];
                    apiName = 'Rajat_v1';
                    type = 'bureau';
                    return [
                        4,
                        finboxService.apiByPassForTesting(apiName, type)
                    ];
                case 2:
                    output = _state.sent();
                    _state.label = 3;
                case 3:
                    if (!(output.Decision === 'Approve' && output.offerAmount > 999)) return [
                        3,
                        5
                    ];
                    remarkApprove = 'Approved from BRE New Flow.';
                    return [
                        4,
                        finboxService.newCustomerAutoApproveFinbox(leadID, output.offerAmount, remarkApprove)
                    ];
                case 4:
                    _state.sent();
                    return [
                        2,
                        {
                            status: '1',
                            message: 'Approved'
                        }
                    ];
                case 5:
                    if (output.Decision === 'Proceed to Bank') {
                        return [
                            2,
                            {
                                status: '1',
                                message: 'Proceed to Bank'
                            }
                        ];
                    }
                    if (!(output.Decision === 'Reject')) return [
                        3,
                        7
                    ];
                    rejectremark = 'Reject Process from BRE New Flow.';
                    return [
                        4,
                        approvalService.rejectProcessCustomer(leadID, rejectremark)
                    ];
                case 6:
                    _state.sent();
                    return [
                        2,
                        {
                            status: '1',
                            message: 'Reject'
                        }
                    ];
                case 7:
                    if (!(output.Decision === 'Not Eligible')) return [
                        3,
                        10
                    ];
                    rejectremark1 = 'Not Eligible from BRE New Flow.';
                    return [
                        4,
                        leadService.updateOne({
                            leadID: leadID
                        }, {
                            status: LeadStatus.NOT_ELIGIBLE
                        })
                    ];
                case 8:
                    _state.sent();
                    return [
                        4,
                        callHistoryLogModel.insert({
                            customerID: customerID,
                            leadID: leadID,
                            callType: 'IVR',
                            status: 'Not Eligible',
                            noteli: rejectremark1,
                            remark: rejectremark1,
                            callbackTime: new Date(),
                            calledBy: 221,
                            createdDate: new Date()
                        })
                    ];
                case 9:
                    _state.sent();
                    return [
                        2,
                        {
                            status: '1',
                            message: 'Reject'
                        }
                    ];
                case 10:
                    return [
                        2,
                        {
                            status: '1',
                            message: 'Proceed to Bank'
                        }
                    ];
                case 11:
                    error = _state.sent();
                    logger.error('Error in breCibilExperianFlow:', error);
                    return [
                        2,
                        {
                            status: '0',
                            message: 'Error in processing'
                        }
                    ];
                case 12:
                    return [
                        2
                    ];
            }
        });
    })();
}
export function autoApproveNewCustomerUsingCibilAndBRE(leadID, mobile, idNumber, pincode, state, name, address) {
    var customerID = arguments.length > 7 && arguments[7] !== void 0 ? arguments[7] : 0;
    return _async_to_generator(function() {
        var output, customerStatus, rejectremark, response, access_token, api_url, response1, responseData, score, checkCibilRecord, _ref, _cibilData_apimsg_consumerCreditData__scores_, _cibilData_apimsg_consumerCreditData_, jsonData, cibilData, error;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    _state.trys.push([
                        0,
                        12,
                        ,
                        13
                    ]);
                    output = {
                        status: '0',
                        message: '',
                        score: 0
                    };
                    return [
                        4,
                        customerService.checkCustomerStatusPhpApi(idNumber)
                    ];
                case 1:
                    customerStatus = _state.sent();
                    if (!(customerStatus == 0)) return [
                        3,
                        3
                    ];
                    rejectremark = 'Active loan on Partner Portal.';
                    return [
                        4,
                        approvalService.rejectProcessCustomer(leadID, rejectremark)
                    ];
                case 2:
                    _state.sent();
                    return [
                        2,
                        {
                            status: '1',
                            message: 'Reject'
                        }
                    ];
                case 3:
                    if (!(customerStatus == 1)) return [
                        3,
                        5
                    ];
                    return [
                        4,
                        breCibilExperianFlow(leadID, customerID)
                    ];
                case 4:
                    response = _state.sent();
                    return [
                        2,
                        response
                    ];
                case 5:
                    return [
                        4,
                        trimAddressCibil(address)
                    ];
                case 6:
                    address = _state.sent();
                    access_token = 'null';
                    api_url = "".concat(config.assetUrl) + 'ramfincorp_api/get_cibil';
                    return [
                        4,
                        axios.post(api_url, {
                            access_token1: access_token,
                            mobile_no: mobile,
                            id_number: idNumber,
                            pincode: pincode,
                            state: state,
                            name: name,
                            address: address
                        }, {
                            headers: {
                                'Content-Type': 'application/json'
                            }
                        })
                    ];
                case 7:
                    response1 = _state.sent();
                    responseData = response1 === null || response1 === void 0 ? void 0 : response1.data;
                    if (!(responseData.errorcode === '1' && responseData.errorMsg === 'Successfully' || responseData.status === '1' && responseData.message === 'Successfully Cibil Fetch')) return [
                        3,
                        10
                    ];
                    score = 0;
                    return [
                        4,
                        leadApiLogService.findOne({
                            api_supplier: 3,
                            api_type: 'consumer-cir-cv',
                            pancard: idNumber,
                            status: 1
                        }, [
                            'api_response'
                        ], [
                            {
                                column: 'id',
                                order: 'desc'
                            }
                        ])
                    ];
                case 8:
                    checkCibilRecord = _state.sent();
                    if (checkCibilRecord) {
                        ;
                        ;
                        jsonData = checkCibilRecord.api_response;
                        cibilData = JSON.parse(jsonData);
                        score = (_ref = (_cibilData_apimsg_consumerCreditData_ = cibilData.apimsg.consumerCreditData[0]) === null || _cibilData_apimsg_consumerCreditData_ === void 0 ? void 0 : (_cibilData_apimsg_consumerCreditData__scores_ = _cibilData_apimsg_consumerCreditData_.scores[0]) === null || _cibilData_apimsg_consumerCreditData__scores_ === void 0 ? void 0 : _cibilData_apimsg_consumerCreditData__scores_.score) !== null && _ref !== void 0 ? _ref : 0;
                        if (score >= 300 && score <= 600) {
                            return [
                                2,
                                {
                                    status: '0',
                                    message: 'Cibil Rejected',
                                    score: score
                                }
                            ];
                        }
                    }
                    return [
                        4,
                        breNewFlowRajatApi(leadID, mobile, idNumber, pincode, state, name, address, score)
                    ];
                case 9:
                    return [
                        2,
                        _state.sent()
                    ];
                case 10:
                    if (responseData.errorcode && responseData.errorMsg) {
                        return [
                            2,
                            {
                                status: responseData.errorcode,
                                message: responseData.errorMsg
                            }
                        ];
                    }
                    if (responseData.status && responseData.message) {
                        return [
                            2,
                            {
                                status: responseData.status,
                                message: responseData.message
                            }
                        ];
                    }
                    _state.label = 11;
                case 11:
                    return [
                        3,
                        13
                    ];
                case 12:
                    error = _state.sent();
                    logger.error('Error in autoApproveNewCustomerUsingCibilAndBRE:', error);
                    return [
                        2,
                        {
                            status: '0',
                            message: 'Error in processing'
                        }
                    ];
                case 13:
                    return [
                        2
                    ];
            }
        });
    })();
}
export function trimAddressCibil(fullAddress) {
    return _async_to_generator(function() {
        var maxCharacters, address, trimmedAddress, lastSpacePos;
        return _ts_generator(this, function(_state) {
            maxCharacters = 40;
            if (fullAddress.length > maxCharacters) {
                trimmedAddress = fullAddress.substring(0, maxCharacters);
                lastSpacePos = trimmedAddress.lastIndexOf(' ');
                if (lastSpacePos !== -1) {
                    trimmedAddress = trimmedAddress.substring(0, lastSpacePos);
                }
                address = trimmedAddress;
            } else {
                address = fullAddress;
            }
            return [
                2,
                address
            ];
        });
    })();
}
export function rajatOldApiWithBre(leadID, mobile, id_number) {
    var pincode = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : '', state = arguments.length > 4 && arguments[4] !== void 0 ? arguments[4] : '', name = arguments.length > 5 && arguments[5] !== void 0 ? arguments[5] : '', address = arguments.length > 6 && arguments[6] !== void 0 ? arguments[6] : '';
    return _async_to_generator(function() {
        var score, checkCibilRecord, _ref, _cibilData_apimsg_consumerCreditData__scores_, _cibilData_apimsg_consumerCreditData_, jsonData, cibilData, api_url, response, responseArr, apiName, type, remarkApprove, amountOffered, dtree, error, error1;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    _state.trys.push([
                        0,
                        12,
                        ,
                        13
                    ]);
                    score = 0;
                    return [
                        4,
                        leadApiLogService.findOne({
                            api_supplier: 3,
                            api_type: 'consumer-cir-cv',
                            pancard: id_number,
                            status: 1
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
                    checkCibilRecord = _state.sent();
                    if (checkCibilRecord) {
                        if (checkCibilRecord) {
                            ;
                            ;
                            jsonData = checkCibilRecord.api_response;
                            cibilData = JSON.parse(jsonData);
                            score = +((_ref = (_cibilData_apimsg_consumerCreditData_ = cibilData.apimsg.consumerCreditData[0]) === null || _cibilData_apimsg_consumerCreditData_ === void 0 ? void 0 : (_cibilData_apimsg_consumerCreditData__scores_ = _cibilData_apimsg_consumerCreditData_.scores[0]) === null || _cibilData_apimsg_consumerCreditData__scores_ === void 0 ? void 0 : _cibilData_apimsg_consumerCreditData__scores_.score) !== null && _ref !== void 0 ? _ref : 0);
                            if (score >= 300 && score <= 600) {
                                return [
                                    2,
                                    {
                                        status: '0',
                                        message: 'Cibil Rejected',
                                        score: score
                                    }
                                ];
                            }
                        }
                    }
                    if (!(score >= 601)) return [
                        3,
                        11
                    ];
                    _state.label = 2;
                case 2:
                    _state.trys.push([
                        2,
                        10,
                        ,
                        11
                    ]);
                    api_url = config.assetUrl + 'ramfincorp_api/get_bureau';
                    return [
                        4,
                        axios.post(api_url, {
                            access_token1: 'sdfsfd',
                            mobile_no: mobile,
                            leadID: leadID
                        }, {
                            headers: {
                                'Content-Type': 'application/json'
                            }
                        })
                    ];
                case 3:
                    response = _state.sent();
                    responseArr = response === null || response === void 0 ? void 0 : response.data;
                    if (!(config.nodeEnv !== 'production')) return [
                        3,
                        5
                    ];
                    apiName = 'rajat_amount';
                    type = 'bureau';
                    return [
                        4,
                        finboxService.apiByPassForTesting(apiName, type)
                    ];
                case 4:
                    responseArr = _state.sent();
                    _state.label = 5;
                case 5:
                    if (!(responseArr.status == '1' && responseArr.amount_offered > 999)) return [
                        3,
                        7
                    ];
                    remarkApprove = 'Approved from BRE.';
                    amountOffered = responseArr.amount_offered;
                    return [
                        4,
                        finboxService.newCustomerAutoApproveFinbox(leadID, amountOffered, remarkApprove)
                    ];
                case 6:
                    _state.sent();
                    return [
                        2,
                        {
                            status: '1',
                            message: 'BRE Accepted'
                        }
                    ];
                case 7:
                    return [
                        4,
                        getDtreeBre(mobile, leadID, responseArr)
                    ];
                case 8:
                    dtree = _state.sent();
                    if (dtree.status === '1') {
                        return [
                            2,
                            {
                                status: '1',
                                message: 'Dtree Bre Accepted'
                            }
                        ];
                    } else if (dtree.status === '0') {
                        return [
                            2,
                            {
                                status: '0',
                                message: 'Dtree Bre Rejected (stop now)',
                                reason: dtree.rejectReason
                            }
                        ];
                    } else {
                        return [
                            2,
                            {
                                status: '0',
                                message: 'Dtree Bre Accepted'
                            }
                        ];
                    }
                    _state.label = 9;
                case 9:
                    return [
                        3,
                        11
                    ];
                case 10:
                    error = _state.sent();
                    logger.error('Error in API request:', error);
                    return [
                        2,
                        {
                            status: '0',
                            message: 'BRE Rejected'
                        }
                    ];
                case 11:
                    return [
                        3,
                        13
                    ];
                case 12:
                    error1 = _state.sent();
                    logger.error('Error in rajatOldApiWithBre:', error1);
                    return [
                        3,
                        13
                    ];
                case 13:
                    return [
                        2
                    ];
            }
        });
    })();
}
export function breNewFlowRajatApi(leadID, mobile, idNumber, pincode, state, name, address, score) {
    return _async_to_generator(function() {
        var output, apiName, type, remarkApprove, amountOffered, rejectRemark, fallbackOutput, finalRejectRemark, error;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    _state.trys.push([
                        0,
                        16,
                        ,
                        17
                    ]);
                    if (!(score >= parseInt(config.cibilScoreBreCheck))) return [
                        3,
                        14
                    ];
                    return [
                        4,
                        bureauDataservice.bureauV1(leadID)
                    ];
                case 1:
                    output = _state.sent();
                    if (!(config.nodeEnv !== 'PROD')) return [
                        3,
                        3
                    ];
                    apiName = 'Rajat_v1';
                    type = 'bureau';
                    return [
                        4,
                        finboxService.apiByPassForTesting(apiName, type)
                    ];
                case 2:
                    output = _state.sent();
                    _state.label = 3;
                case 3:
                    if (!((output === null || output === void 0 ? void 0 : output.Decision) === 'Approve' && (output === null || output === void 0 ? void 0 : output.offerAmount) && output.offerAmount > 999)) return [
                        3,
                        5
                    ];
                    remarkApprove = 'Approved from New BRE V1.';
                    amountOffered = output.offerAmount;
                    return [
                        4,
                        finboxService.newCustomerAutoApproveFinbox(leadID, amountOffered, remarkApprove)
                    ];
                case 4:
                    _state.sent();
                    return [
                        2,
                        {
                            status: '1',
                            message: 'Approved'
                        }
                    ];
                case 5:
                    if (!((output === null || output === void 0 ? void 0 : output.Decision) === 'Proceed to Bank')) return [
                        3,
                        6
                    ];
                    return [
                        2,
                        {
                            status: '1',
                            message: 'Proceed to Bank'
                        }
                    ];
                case 6:
                    if (!((output === null || output === void 0 ? void 0 : output.Decision) === 'Reject')) return [
                        3,
                        12
                    ];
                    rejectRemark = 'Reject from BRE V1';
                    return [
                        4,
                        callHistoryLogService.insertCallHistoryLog(leadID, rejectRemark)
                    ];
                case 7:
                    _state.sent();
                    return [
                        4,
                        rajatOldApiWithBre(leadID, mobile, idNumber, pincode, state, name, address)
                    ];
                case 8:
                    fallbackOutput = _state.sent();
                    if (!(fallbackOutput.status === '1')) return [
                        3,
                        9
                    ];
                    return [
                        2,
                        fallbackOutput
                    ];
                case 9:
                    finalRejectRemark = 'BRE and DtreeBre Reject Case Move to Reject Process.';
                    return [
                        4,
                        approvalService.rejectProcessCustomer(leadID, finalRejectRemark)
                    ];
                case 10:
                    _state.sent();
                    return [
                        2,
                        {
                            status: '1',
                            message: 'Reject'
                        }
                    ];
                case 11:
                    return [
                        3,
                        13
                    ];
                case 12:
                    return [
                        2,
                        {
                            status: '1',
                            message: 'Proceed to Bank'
                        }
                    ];
                case 13:
                    return [
                        3,
                        15
                    ];
                case 14:
                    return [
                        2,
                        {
                            status: '1',
                            message: 'Proceed to Bank'
                        }
                    ];
                case 15:
                    return [
                        3,
                        17
                    ];
                case 16:
                    error = _state.sent();
                    logger.error('Error in breNewFlowRajatApi:', error);
                    return [
                        2,
                        {
                            status: '0',
                            message: 'Error in processing'
                        }
                    ];
                case 17:
                    return [
                        2
                    ];
            }
        });
    })();
}
function getDtreeBre(mobile, leadID, breresponseArr) {
    return _async_to_generator(function() {
        var api_url, response, status, apiStatus, message, rejectReason, responseArr, _result_inputs, _result_inputs1, _result_inputs2, _result_inputs3, _result_inputs4, result, amount_offered, remarkApprove, saveObject, error, error1;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    api_url = 'http://13.127.7.146:5000/dtree_bre';
                    _state.label = 1;
                case 1:
                    _state.trys.push([
                        1,
                        21,
                        ,
                        22
                    ]);
                    return [
                        4,
                        axios.post(api_url, {
                            mobile_no: mobile
                        }, {
                            headers: {
                                'Content-Type': 'application/json'
                            }
                        })
                    ];
                case 2:
                    response = _state.sent();
                    status = '0';
                    apiStatus = '0';
                    message = '';
                    rejectReason = '';
                    responseArr = [];
                    if (!(response.status === 200)) return [
                        3,
                        14
                    ];
                    apiStatus = '1';
                    responseArr = response.data;
                    if (!(responseArr.results && Array.isArray(responseArr.results) && responseArr.results.length > 0)) return [
                        3,
                        12
                    ];
                    result = responseArr.results[0];
                    if (!(((_result_inputs = result.inputs) === null || _result_inputs === void 0 ? void 0 : _result_inputs.active_loans_lt_15000_max_dpd_gt_30) === 0 && ((_result_inputs1 = result.inputs) === null || _result_inputs1 === void 0 ? void 0 : _result_inputs1.score) > 700 && ((_result_inputs2 = result.inputs) === null || _result_inputs2 === void 0 ? void 0 : _result_inputs2.max_loan_amount_serviced_last_3_months) > 17000 && ((_result_inputs3 = result.inputs) === null || _result_inputs3 === void 0 ? void 0 : _result_inputs3.max_loan_amount_serviced_last_6_months) > 40000 && ((_result_inputs4 = result.inputs) === null || _result_inputs4 === void 0 ? void 0 : _result_inputs4.overdue_to_balance_ratio) < 0.0001)) return [
                        3,
                        8
                    ];
                    return [
                        4,
                        bureauDataservice.bureau(leadID)
                    ];
                case 3:
                    amount_offered = _state.sent();
                    if (!(amount_offered > 999)) return [
                        3,
                        5
                    ];
                    remarkApprove = 'Accepted from BRE.';
                    return [
                        4,
                        finboxService.newCustomerAutoApproveFinbox(leadID, amount_offered, remarkApprove)
                    ];
                case 4:
                    _state.sent();
                    status = '1';
                    message = 'Success';
                    return [
                        3,
                        7
                    ];
                case 5:
                    status = '0';
                    return [
                        4,
                        DtreeRejectedReason(result.inputs)
                    ];
                case 6:
                    rejectReason = _state.sent();
                    message = "Success to retrieve DtreeBre information for mobile: ".concat(mobile);
                    _state.label = 7;
                case 7:
                    return [
                        3,
                        11
                    ];
                case 8:
                    if (!(result.status === 'Reject')) return [
                        3,
                        10
                    ];
                    status = '0';
                    return [
                        4,
                        DtreeRejectedReason(result.inputs)
                    ];
                case 9:
                    rejectReason = _state.sent();
                    message = "Success to retrieve DtreeBre information for mobile: ".concat(mobile);
                    return [
                        3,
                        11
                    ];
                case 10:
                    message = "Success to retrieve DtreeBre information for mobile: ".concat(mobile);
                    _state.label = 11;
                case 11:
                    return [
                        3,
                        13
                    ];
                case 12:
                    message = "Results not found in DtreeBre response for mobile: ".concat(mobile);
                    _state.label = 13;
                case 13:
                    return [
                        3,
                        15
                    ];
                case 14:
                    responseArr = response.data;
                    message = "Failed to retrieve DtreeBre information for mobile: ".concat(mobile);
                    _state.label = 15;
                case 15:
                    saveObject = {
                        api_supplier: 9,
                        api_type: 'dtree_bre',
                        api_response: JSON.stringify(responseArr),
                        status: Number(apiStatus),
                        mobile_no: mobile,
                        api_endpoint_url: api_url,
                        pancard: ''
                    };
                    return [
                        4,
                        leadApiLogService.create(saveObject)
                    ];
                case 16:
                    _state.sent();
                    _state.label = 17;
                case 17:
                    _state.trys.push([
                        17,
                        19,
                        ,
                        20
                    ]);
                    return [
                        4,
                        leadApiLogMongoDBService.create('cibil', saveObject)
                    ];
                case 18:
                    _state.sent();
                    return [
                        3,
                        20
                    ];
                case 19:
                    error = _state.sent();
                    logger.error('Error while saving to MongoDB collection : cibil', error);
                    return [
                        3,
                        20
                    ];
                case 20:
                    return [
                        2,
                        {
                            status: status,
                            message: message,
                            rejectReason: rejectReason
                        }
                    ];
                case 21:
                    error1 = _state.sent();
                    console.error('Error in API request:', error1.message);
                    if (error1.response) {
                        console.error('Response data:', error1.response.data);
                    }
                    return [
                        2,
                        {
                            status: '0',
                            message: "Failed to retrieve DtreeBre information for mobile: ".concat(mobile)
                        }
                    ];
                case 22:
                    return [
                        2
                    ];
            }
        });
    })();
}
function DtreeRejectedReason(data) {
    return _async_to_generator(function() {
        return _ts_generator(this, function(_state) {
            if (data['active_loans_lt_15000_max_dpd_gt_30'] !== undefined && data['active_loans_lt_15000_max_dpd_gt_30'] > 3) {
                return [
                    2,
                    'active_loans_lt_15000_max_dpd_gt_30'
                ];
            }
            if (data['max_loan_amount_serviced_last_6_months'] !== undefined && data['max_loan_amount_serviced_last_6_months'] < 10000) {
                return [
                    2,
                    'max_loan_amount_serviced_last_6_months'
                ];
            }
            if (data['overdue_to_balance_ratio'] !== undefined && data['overdue_to_balance_ratio'] > 0.3) {
                return [
                    2,
                    'overdue_to_balance_ratio'
                ];
            }
            if (data['score'] !== undefined && data['score'] < 650) {
                return [
                    2,
                    'score'
                ];
            }
            if (data['max_loan_amount_serviced_last_3_months'] !== undefined && data['max_loan_amount_serviced_last_3_months'] < 250) {
                return [
                    2,
                    'max_loan_amount_serviced_last_3_months'
                ];
            }
            return [
                2,
                undefined
            ];
        });
    })();
}
function getCreditReportData(reportId) {
    return _async_to_generator(function() {
        var db, result;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    db = getKnexInstance();
                    return [
                        4,
                        db.raw("SET sql_mode=(SELECT REPLACE(@@sql_mode,'ONLY_FULL_GROUP_BY',''))")
                    ];
                case 1:
                    _state.sent();
                    return [
                        4,
                        db.select(db.raw("\n        round(ifnull(\n          (sum(CASE WHEN closing_date is null and account_type=10 then loan_amount else 0 end) /\n          sum(CASE WHEN closing_date is null and account_type=10 then credit_limit else 0 end)) * 100, 0), 2)\n        as utilization_percent,\n        sum(CASE WHEN closing_date is null and account_type=10 then credit_limit else 0 end) as tot_credit_limit,\n        DATEDIFF(now(), MIN(opening_date)) as credit_age,\n        sum(CASE WHEN closing_date is null then 1 else 0 end) as active_accounts,\n        sum(CASE WHEN closing_date is not null then 1 else 0 end) as closed_accounts,\n        (select count(*) from cr_profile_enquiry where report_id=cr_profile_accounts.report_id) as tot_enquiry,\n        (select count(*) from cr_profile_enquiry where report_id=cr_profile_accounts.report_id and account_type=10) as credit_card_enquiry,\n        (select count(*) from cr_profile_enquiry where report_id=cr_profile_accounts.report_id and account_type<>10) as loan_enquiry,\n        (select round(ifnull(sum(CASE WHEN repayment_status='000' or repayment_status='XXX' THEN 1 ELSE 0 END) / count(*), 1) * 100, 2)\n          from cr_profile_repayment_data\n          where report_id=cr_profile_accounts.report_id) as payment_percentage,\n        (select count(*) from cr_profile_repayment_data where report_id=cr_profile_accounts.report_id and\n          (repayment_status <> '000' and repayment_status <> 'XXX')) as delay_payment_count,\n        (select score from credit_reports where id=cr_profile_accounts.report_id  and cr_provider = 1) as score,\n        (select group_concat(distinct concat(DATE_FORMAT(created_at,'%b'),'-',score))\n          from credit_reports where customerID=cr_profile_accounts.customerID and score is not null  and cr_provider = 1) as monthwise_score,\n        (select DATE_FORMAT(max(created_at), '%d %b %Y')\n          from credit_reports where customerID=cr_profile_accounts.customerID and score is not null  and cr_provider = 1) as last_pull_date\n      ")).from('cr_profile_accounts').where('report_id', reportId)
                    ];
                case 2:
                    result = _state.sent();
                    return [
                        2,
                        result
                    ];
            }
        });
    })();
}
var determineStatusAndColor = function determineStatusAndColor(score) {
    var status = '';
    var color = '';
    if (score >= 780) {
        status = 'Excellent';
        color = '#0EBB53'; // Green
    } else if (score >= 706 && score <= 779) {
        status = 'Good';
        color = '#FFCF54'; // Yellow
    } else if (score >= 631 && score <= 705) {
        status = 'Average';
        color = '#5BE893'; // Light Green
    } else if (score >= 300 && score <= 630) {
        status = 'Poor';
        color = '#F33C3C'; // Red
    } else {
        status = 'Unknown';
        color = '#000000';
    }
    return {
        status: status,
        color: color
    };
};
var getStatusFromPercentage = function getStatusFromPercentage(percentage) {
    var statusRanges = [
        {
            min: 99,
            max: 100,
            status: 'Excellent'
        },
        {
            min: 95,
            max: 98,
            status: 'Good'
        },
        {
            min: 85,
            max: 94,
            status: 'Poor'
        },
        {
            min: 75,
            max: 84,
            status: 'Bad'
        },
        {
            min: 0,
            max: 74,
            status: 'Very Bad'
        }
    ];
    var status = statusRanges.find(function(range) {
        return percentage >= range.min && percentage <= range.max;
    });
    return status ? status.status : 'Unknown';
};
var getCreditUsageStatus = function getCreditUsageStatus(utilizationPercent) {
    var usageRanges = [
        {
            min: 0,
            max: 10,
            status: 'Excellent'
        },
        {
            min: 11,
            max: 30,
            status: 'Good'
        },
        {
            min: 31,
            max: 50,
            status: 'Poor'
        },
        {
            min: 51,
            max: 70,
            status: 'Bad'
        },
        {
            min: 71,
            max: 100,
            status: 'Very Bad'
        }
    ];
    var status = usageRanges.find(function(range) {
        return utilizationPercent >= range.min && utilizationPercent <= range.max;
    });
    return status ? status.status : 'Unknown';
};
var getCreditAgeStatus = function getCreditAgeStatus(age) {
    var ageRanges = [
        {
            min: 11,
            max: Infinity,
            status: 'Excellent'
        },
        {
            min: 7,
            max: 10,
            status: 'Good'
        },
        {
            min: 4,
            max: 6,
            status: 'Poor'
        },
        {
            min: 2,
            max: 3,
            status: 'Bad'
        },
        {
            min: 0,
            max: 1,
            status: 'Very Bad'
        }
    ];
    var status = ageRanges.find(function(range) {
        return age >= range.min && age <= range.max;
    });
    return status ? status.status : 'Unknown' // Return the found status or 'Unknown' if not found
    ;
};
var getAccountStatus = function getAccountStatus(activeAccounts) {
    var accountRanges = [
        {
            min: 11,
            max: Infinity,
            status: 'Excellent'
        },
        {
            min: 6,
            max: 10,
            status: 'Good'
        },
        {
            min: 3,
            max: 5,
            status: 'Poor'
        },
        {
            min: 1,
            max: 2,
            status: 'Bad'
        },
        {
            min: 0,
            max: 0,
            status: 'Very Bad'
        }
    ];
    var status = accountRanges.find(function(range) {
        return activeAccounts >= range.min && activeAccounts <= range.max;
    });
    return status ? status.status : 'Unknown' // Return the found status or 'Unknown' if not found
    ;
};
var getInquiryStatus = function getInquiryStatus(totalInquiries) {
    var inquiryRanges = [
        {
            min: 0,
            max: 2,
            status: 'Excellent'
        },
        {
            min: 3,
            max: 5,
            status: 'Good'
        },
        {
            min: 6,
            max: 8,
            status: 'Poor'
        },
        {
            min: 9,
            max: 11,
            status: 'Bad'
        },
        {
            min: 12,
            max: Infinity,
            status: 'Very Bad'
        }
    ];
    var status = inquiryRanges.find(function(range) {
        return totalInquiries >= range.min && totalInquiries <= range.max;
    });
    return status ? status.status : 'Unknown' // Return the found status or 'Unknown' if not found
    ;
};
export function makeCreditReport(reportId, name) {
    return _async_to_generator(function() {
        var _reportData_, reportData, age, remainingDays, ageInMonths, ageFormatted, monthwiseScore, monthlyScores, usedLimit, score, activeAccounts, _determineStatusAndColor, status, color, paymentStatus, creditStatus, ageStatus, accountStatus, enquiryStatus, experianReportData;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    return [
                        4,
                        getCreditReportData(reportId)
                    ];
                case 1:
                    reportData = _state.sent();
                    age = Math.floor(reportData[0].credit_age / 365);
                    remainingDays = reportData[0].credit_age % 365;
                    ageInMonths = Math.floor(remainingDays / 30);
                    ageFormatted = "".concat(age, "y ").concat(ageInMonths, "m");
                    monthwiseScore = reportData[0].monthwise_score;
                    monthlyScores = monthwiseScore === null || monthwiseScore === void 0 ? void 0 : monthwiseScore.split(',').map(function(item) {
                        var _item_split = _sliced_to_array(item.split('-'), 2), month = _item_split[0], score = _item_split[1];
                        return {
                            month: month,
                            score: parseInt(score, 10)
                        };
                    });
                    usedLimit = Math.round(parseInt(reportData[0].tot_credit_limit) * parseInt(reportData[0].utilization_percent) / 100);
                    score = reportData[0].score;
                    activeAccounts = parseInt(reportData[0].active_accounts, 10);
                    _determineStatusAndColor = determineStatusAndColor(score), status = _determineStatusAndColor.status, color = _determineStatusAndColor.color;
                    paymentStatus = getStatusFromPercentage(Math.round(Number((_reportData_ = reportData[0]) === null || _reportData_ === void 0 ? void 0 : _reportData_.payment_percentage)));
                    creditStatus = getCreditUsageStatus(Math.round(Number(reportData[0].utilization_percent)));
                    ageStatus = getCreditAgeStatus(age);
                    accountStatus = getAccountStatus(activeAccounts);
                    enquiryStatus = getInquiryStatus(parseInt(reportData[0].tot_credit_limit));
                    experianReportData = {
                        experian: {
                            whatChanged: [
                                {
                                    id: '1',
                                    icon: 'P',
                                    name: 'Payment',
                                    value: "".concat(parseFloat(reportData[0].payment_percentage).toFixed(0), "%"),
                                    impact: 'High Impact',
                                    ontime: true,
                                    remark: 'Timely Payment',
                                    impacts: {
                                        status: paymentStatus,
                                        paymentText: 'Payments on time',
                                        percentText: 'Late Payments(%)',
                                        percentOnTime: Number(reportData[0].delay_payment_count),
                                        latePaymentsCount: reportData[0].payment_percentage
                                    },
                                    message: 'All payments are on time'
                                },
                                {
                                    id: '2',
                                    icon: 'L',
                                    name: 'Limit',
                                    value: "".concat(parseFloat(reportData[0].utilization_percent).toFixed(0), "%"),
                                    impact: 'High Impact',
                                    ontime: false,
                                    remark: 'credit limit used',
                                    impacts: {
                                        status: creditStatus,
                                        paymentText: 'Limit Utilisation',
                                        percentText: 'Total Credit Limit',
                                        percentOnTime: parseInt(reportData[0].tot_credit_limit),
                                        latePaymentsCount: reportData[0].utilization_percent,
                                        usedLimit: usedLimit
                                    },
                                    message: 'All payments are not on time'
                                },
                                {
                                    id: '3',
                                    icon: 'A',
                                    name: 'Age',
                                    value: ageFormatted,
                                    impact: 'Medium Impact',
                                    ontime: false,
                                    remark: 'Age of Accounts',
                                    impacts: {
                                        status: ageStatus,
                                        paymentText: 'Age of Accounts',
                                        percentText: 'Active Accounts',
                                        percentOnTime: parseInt(reportData[0].active_accounts),
                                        latePaymentsCount: ageFormatted
                                    },
                                    message: 'All payments are not on time'
                                },
                                {
                                    id: '4',
                                    icon: 'A',
                                    name: 'Accounts',
                                    value: "".concat(reportData[0].active_accounts, " Active"),
                                    impact: 'Low Impact',
                                    ontime: true,
                                    remark: 'Active Accounts',
                                    impacts: {
                                        status: accountStatus,
                                        paymentText: 'Closed Accounts',
                                        percentText: 'Active Accounts',
                                        percentOnTime: parseInt(reportData[0].active_accounts),
                                        latePaymentsCount: reportData[0].closed_accounts
                                    },
                                    message: 'All payments are on time'
                                },
                                {
                                    id: '5',
                                    icon: 'E',
                                    name: 'Enquiries',
                                    value: reportData[0].tot_enquiry,
                                    impact: 'Low Impact',
                                    ontime: true,
                                    remark: 'Total Enquiries',
                                    impacts: {
                                        status: enquiryStatus,
                                        paymentText: 'For Credit Cards',
                                        percentText: 'Enquiries for Loans',
                                        percentOnTime: reportData[0].loan_enquiry,
                                        latePaymentsCount: String(reportData[0].credit_card_enquiry)
                                    },
                                    message: 'All payments are on time'
                                }
                            ],
                            //
                            currentScore: {
                                //color: "#4AD170",//discuss how to decide
                                customerName: name,
                                color: color,
                                score: reportData[0].score,
                                status: status,
                                lastPullDate: reportData[0].last_pull_date
                            },
                            monthlyScores: monthlyScores
                        }
                    };
                    // store data everytime or update means in each pull of 8th of every months
                    return [
                        2,
                        experianReportData
                    ];
            }
        });
    })();
}
export function getAccountData(reportId) {
    return _async_to_generator(function() {
        var accountDetails;
        return _ts_generator(this, function(_state) {
            accountDetails = crProfileAccountModel.findAll({
                report_id: reportId
            }, [
                'id',
                'customerID',
                'account_no',
                'closing_date',
                'opening_date',
                'last_payment',
                'bank_name',
                'loan_amount',
                'credit_limit',
                'current_balance',
                'account_type',
                'account_status',
                'on_time_payments',
                'due_date_payments'
            ], [
                {
                    column: 'id',
                    order: 'desc'
                }
            ]);
            return [
                2,
                accountDetails
            ];
        });
    })();
}
var getBankLogo = function getBankLogo(bankName) {
    return _async_to_generator(function() {
        var _result__, db, result, _result__1;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    db = getKnexInstance();
                    return [
                        4,
                        db.raw('SELECT pngIcon FROM bankList WHERE LOWER(bankName) = LOWER(?)', [
                            bankName === null || bankName === void 0 ? void 0 : bankName.trim()
                        ])
                    ];
                case 1:
                    result = _state.sent();
                    if (result && ((_result__ = result[0][0]) === null || _result__ === void 0 ? void 0 : _result__.pngIcon)) {
                        ;
                        return [
                            2,
                            (_result__1 = result[0][0]) === null || _result__1 === void 0 ? void 0 : _result__1.pngIcon
                        ];
                    } else {
                        return [
                            2,
                            null
                        ];
                    }
                    return [
                        2
                    ];
            }
        });
    })();
};
export function makeAccountDetails(reportId) {
    return _async_to_generator(function() {
        var accountData, transformedData, usedPercentages, transformedDataForCreditUsage, finalData;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    return [
                        4,
                        getAccountData(reportId)
                    ];
                case 1:
                    accountData = _state.sent();
                    return [
                        4,
                        Promise.all(accountData.map(function(account, index) {
                            return _async_to_generator(function() {
                                var _ref, _tmp;
                                return _ts_generator(this, function(_state) {
                                    switch(_state.label){
                                        case 0:
                                            _tmp = {
                                                id: (index + 1).toString()
                                            };
                                            return [
                                                4,
                                                getBankLogo(account.bank_name)
                                            ];
                                        case 1:
                                            return [
                                                2,
                                                (_tmp.icon = (_ref = _state.sent()) !== null && _ref !== void 0 ? _ref : config.defaultBankLogoExperian, _tmp.name = account.bank_name, _tmp.remark = 'Timely Payment', _tmp.issueOn = account.opening_date.toISOString().split('T')[0], _tmp.payment = "".concat(account.on_time_payments, "/").concat(account.on_time_payments + account.due_date_payments), _tmp.bankUtil = account.account_type === 10 ? 'Credit Card' : 'Loan', _tmp.isActive = account.account_status === 2 ? false : true, _tmp.statusText = 'Status', _tmp.statusValue = account.account_status === 2 ? 'In-Active' : 'Active', _tmp.isExpandable = true, _tmp.bankUtilValue = account.account_no, _tmp)
                                            ];
                                    }
                                });
                            })();
                        }))
                    ];
                case 2:
                    transformedData = _state.sent();
                    usedPercentages = accountData.map(function(account) {
                        if (account.credit_limit > 0) {
                            return ((account.credit_limit - account.current_balance) / account.credit_limit * 100).toFixed(0);
                        } else {
                            return '0';
                        }
                    });
                    return [
                        4,
                        Promise.all(accountData.map(function(account, index) {
                            return _async_to_generator(function() {
                                var _ref, _tmp;
                                return _ts_generator(this, function(_state) {
                                    switch(_state.label){
                                        case 0:
                                            _tmp = {
                                                id: (index + 1).toString()
                                            };
                                            return [
                                                4,
                                                getBankLogo(account.bank_name)
                                            ];
                                        case 1:
                                            return [
                                                2,
                                                (_tmp.icon = (_ref = _state.sent()) !== null && _ref !== void 0 ? _ref : config.defaultBankLogoExperian, _tmp.name = account.bank_name, _tmp.remark = 'Credit Usage', _tmp.issueOn = account.opening_date.toISOString().split('T')[0], _tmp.payment = "".concat(usedPercentages[index], "%"), _tmp.bankUtil = account.account_type === 10 ? 'Credit Card' : 'Loan', _tmp.isActive = account.account_status === 2 ? false : true, _tmp.statusText = 'Status', _tmp.statusValue = account.account_status === 2 ? 'In-Active' : 'Active', _tmp.isExpandable = true, _tmp.bankUtilValue = account.account_no, _tmp)
                                            ];
                                    }
                                });
                            })();
                        }))
                    ];
                case 3:
                    transformedDataForCreditUsage = _state.sent();
                    // console.log('usedPercentage', usedPercentages)
                    finalData = {
                        '1': {
                            accounts: transformedData
                        },
                        '2': {
                            accounts: transformedDataForCreditUsage
                        },
                        '3': {
                            accounts: transformedData
                        },
                        '4': {
                            accounts: transformedData
                        },
                        '5': {
                            accounts: transformedData
                        }
                    };
                    return [
                        2,
                        finalData
                    ];
            }
        });
    })();
}
export function getRepaymentData(reportId) {
    return _async_to_generator(function() {
        var paymentHistory;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    return [
                        4,
                        crProfileRepaymentModel.findAll({
                            report_id: reportId
                        }, [
                            'profile_account_id',
                            'repayment_status',
                            'repayment_date',
                            'account_type',
                            'customerID'
                        ], [
                            {
                                column: 'id',
                                order: 'desc'
                            }
                        ])
                    ];
                case 1:
                    paymentHistory = _state.sent();
                    paymentHistory = paymentHistory.map(function(payment) {
                        payment.repayment_date = new Date(format(new Date(payment.repayment_date), 'yyyy-MM-dd'));
                        return payment;
                    });
                    return [
                        2,
                        paymentHistory
                    ];
            }
        });
    })();
}
export function getDataForRepayment(reportId) {
    return _async_to_generator(function() {
        var accountDetails;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    return [
                        4,
                        crProfileAccountModel.findAll({
                            report_id: reportId
                        }, [
                            'id',
                            'loan_amount',
                            'credit_limit',
                            'current_balance',
                            'account_type',
                            'account_status'
                        ], [
                            {
                                column: 'id',
                                order: 'desc'
                            }
                        ])
                    ];
                case 1:
                    accountDetails = _state.sent();
                    return [
                        2,
                        accountDetails
                    ];
            }
        });
    })();
}
export function generateDataForViewImpact(dateFormateData, paymentHistory) {
    return _async_to_generator(function() {
        var result;
        return _ts_generator(this, function(_state) {
            result = {};
            dateFormateData.forEach(function(data, index) {
                var _data_credit_limit;
                var paymentHistoryForAccount = paymentHistory.filter(function(payment) {
                    return payment.profile_account_id === data.id;
                });
                var paymentHistoryByYear = {};
                paymentHistoryForAccount.forEach(function(payment) {
                    var year = payment.repayment_date.getFullYear().toString();
                    var month = payment.repayment_date.getMonth();
                    if (!paymentHistoryByYear[year]) {
                        paymentHistoryByYear[year] = new Array(12).fill(null);
                    }
                    paymentHistoryByYear[year][month] = payment.repayment_status === '000' || payment.repayment_status === 'XXX' ? true : false;
                });
                var usedLimit = data.credit_limit ? data.credit_limit - data.current_balance : 0;
                var usedPercentage = data.credit_limit ? (usedLimit / data.credit_limit * 100).toFixed(0) : '0';
                result[(index + 1).toString()] = {
                    details: {
                        data: [
                            {
                                key: 'Used Percentage',
                                value: "".concat(usedPercentage, "%")
                            },
                            {
                                key: 'Limit Used',
                                value: "₹".concat(usedLimit === null || usedLimit === void 0 ? void 0 : usedLimit.toLocaleString())
                            },
                            {
                                key: 'Credit Limit',
                                value: data.credit_limit ? "₹".concat(data === null || data === void 0 ? void 0 : (_data_credit_limit = data.credit_limit) === null || _data_credit_limit === void 0 ? void 0 : _data_credit_limit.toLocaleString()) : '0'
                            }
                        ],
                        heading: 'Credit Utilisation'
                    },
                    isCredit: data.account_type === 10,
                    paymentHistory: paymentHistoryByYear
                };
            });
            return [
                2,
                result
            ];
        });
    })();
}
/**
 * Get CIBIL and Experian bureau data for a lead
 * @param leadID Lead ID
 * @returns Decision and offer amount
 */ export function cibilExperianBureau(leadID) {
    return _async_to_generator(function() {
        var output, _apiResponse_output_data_rules_output_final_decision, _apiResponse_output_data_rules_output, _apiResponse_output_data, customerData, customerToken, reference_id, requestBody, url, headers, response, apiResponse, saveData, _ref, _ref1, _ref2, _ref3, _ref4, _ref5, _ref6, _ref7, _ref8, _ref9, _apiResponse_request_id, _apiResponse_user_id, _apiResponse_reference_id, _apiResponse_workflow_version_path, _ref10, _ref11, _ref12, _ref13, _ref14, _apiResponse_output_data_features, _apiResponse_output_data1, _apiResponse_output_data2, finalDecision, countLongTermLoan, new_roi, bureauSaveData, analyticsData, error;
        function saveAnalyticsData(saveData) {
            return _async_to_generator(function() {
                var knex, result, error;
                return _ts_generator(this, function(_state) {
                    switch(_state.label){
                        case 0:
                            _state.trys.push([
                                0,
                                2,
                                ,
                                3
                            ]);
                            knex = getKnexInstance();
                            return [
                                4,
                                knex('bureau_banking_analytics_data').insert(saveData)
                            ];
                        case 1:
                            result = _state.sent();
                            // `insert` returns an array of inserted ids, so we check its length
                            if (result.length > 0) {
                                return [
                                    2,
                                    1
                                ];
                            } else {
                                return [
                                    2,
                                    0
                                ];
                            }
                            return [
                                3,
                                3
                            ];
                        case 2:
                            error = _state.sent();
                            console.error('Error saving analytics data:', error);
                            return [
                                2,
                                0
                            ];
                        case 3:
                            return [
                                2
                            ];
                    }
                });
            })();
        }
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    output = {
                        Decision: '',
                        offerAmount: 0
                    };
                    _state.label = 1;
                case 1:
                    _state.trys.push([
                        1,
                        11,
                        ,
                        12
                    ]);
                    return [
                        4,
                        customerService.findCustomerInputData(leadID)
                    ];
                case 2:
                    customerData = _state.sent();
                    if (!customerData) {
                        return [
                            2,
                            output
                        ];
                    }
                    return [
                        4,
                        customerService.insertAndUpdateCustomerToken(customerData.customerID)
                    ];
                case 3:
                    customerToken = _state.sent();
                    reference_id = "".concat(customerData.customerID, "|").concat(leadID);
                    requestBody = {
                        reference_id: reference_id,
                        user_id: customerData.customerID.toString(),
                        client_id: config.bureau_client_id,
                        auth_token: config.bureau_auth_token,
                        input_data: {
                            customer_id: customerData.customerID.toString(),
                            first_name: customerData.firstName,
                            middle_name: customerData.middlename,
                            last_name: customerData.lastName,
                            gender: customerData.gender,
                            pan: customerData.pancard,
                            dob: new Date(customerData.dob).toISOString().split('T')[0],
                            profession: customerData.employer_list,
                            mobile_number: customerData.mobile,
                            salary: customerData.monthlyIncome,
                            salary_source: customerData.salaryMode,
                            address: customerData.address,
                            city: customerData.city,
                            state_name: customerData.state,
                            pincode: customerData.pincode.toString(),
                            email: customerData.email,
                            customerToken: customerToken,
                            leadId: leadID
                        }
                    };
                    url = "".concat(config.bureauBaseUrlv1).concat(config.bureauApiUrlv1);
                    headers = {
                        'Content-Type': 'application/json'
                    };
                    return [
                        4,
                        axios.post(url, requestBody, {
                            headers: headers
                        })
                    ];
                case 4:
                    response = _state.sent();
                    apiResponse = response.data;
                    // Save API log
                    saveData = {
                        customerID: customerData.customerID,
                        leadID: leadID,
                        api_supplier: BUREAU_V2_SUPPLIER_ID,
                        api_type: 'Bureau V2',
                        api_endpoint_url: url,
                        api_method: 'POST',
                        api_request: JSON.stringify(requestBody),
                        api_response: JSON.stringify(apiResponse),
                        status: apiResponse.error ? 0 : 1,
                        created_at: new Date()
                    };
                    if (!(!apiResponse.error && ((_apiResponse_output_data = apiResponse.output_data) === null || _apiResponse_output_data === void 0 ? void 0 : (_apiResponse_output_data_rules_output = _apiResponse_output_data.rules_output) === null || _apiResponse_output_data_rules_output === void 0 ? void 0 : (_apiResponse_output_data_rules_output_final_decision = _apiResponse_output_data_rules_output.final_decision) === null || _apiResponse_output_data_rules_output_final_decision === void 0 ? void 0 : _apiResponse_output_data_rules_output_final_decision.Decision))) return [
                        3,
                        8
                    ];
                    finalDecision = apiResponse.output_data.rules_output.final_decision;
                    return [
                        4,
                        bureauDataservice.countLongTermEligibleLoans()
                    ];
                case 5:
                    countLongTermLoan = _state.sent();
                    new_roi = countLongTermLoan % LONG_TERM_SWITCH === 0 ? LONG_TERM_OFFER_ROI : LONG_TERM_DEFAULT_ROI;
                    // Save bureau data
                    bureauSaveData = {
                        customerID: customerData.customerID,
                        leadID: leadID,
                        reference_id: reference_id,
                        Decision: (_ref = finalDecision === null || finalDecision === void 0 ? void 0 : finalDecision.Decision) !== null && _ref !== void 0 ? _ref : null,
                        LoanAmount: (_ref1 = finalDecision === null || finalDecision === void 0 ? void 0 : finalDecision.LoanAmount) !== null && _ref1 !== void 0 ? _ref1 : null,
                        version: 'v1',
                        emi_eligible: (_ref2 = finalDecision === null || finalDecision === void 0 ? void 0 : finalDecision.emi_eligible) !== null && _ref2 !== void 0 ? _ref2 : null,
                        emi_max_tenure: (_ref3 = finalDecision === null || finalDecision === void 0 ? void 0 : finalDecision.emi_max_tenure) !== null && _ref3 !== void 0 ? _ref3 : null,
                        emi_max_monthly_amt: (_ref4 = finalDecision === null || finalDecision === void 0 ? void 0 : finalDecision.emi_max_monthly_amt) !== null && _ref4 !== void 0 ? _ref4 : null,
                        api_version: (_ref5 = finalDecision === null || finalDecision === void 0 ? void 0 : finalDecision.version) !== null && _ref5 !== void 0 ? _ref5 : null,
                        long_term_emi_eligible: (_ref6 = finalDecision === null || finalDecision === void 0 ? void 0 : finalDecision.long_term_emi_eligible) !== null && _ref6 !== void 0 ? _ref6 : null,
                        long_term_tenure: (_ref7 = finalDecision === null || finalDecision === void 0 ? void 0 : finalDecision.long_term_tenure) !== null && _ref7 !== void 0 ? _ref7 : null,
                        long_term_loan_amount: (_ref8 = finalDecision === null || finalDecision === void 0 ? void 0 : finalDecision.long_term_loan_amount) !== null && _ref8 !== void 0 ? _ref8 : null,
                        long_term_loan_roi: (_ref9 = finalDecision === null || finalDecision === void 0 ? void 0 : finalDecision.long_term_loan_roi) !== null && _ref9 !== void 0 ? _ref9 : null,
                        approval_roi: (finalDecision === null || finalDecision === void 0 ? void 0 : finalDecision.long_term_loan_roi) ? new_roi : null
                    };
                    // Save analytics data
                    analyticsData = {
                        api_type: 'Bureau',
                        request_id: (_apiResponse_request_id = apiResponse.request_id) !== null && _apiResponse_request_id !== void 0 ? _apiResponse_request_id : null,
                        user_id: (_apiResponse_user_id = apiResponse.user_id) !== null && _apiResponse_user_id !== void 0 ? _apiResponse_user_id : null,
                        reference_id: (_apiResponse_reference_id = apiResponse.reference_id) !== null && _apiResponse_reference_id !== void 0 ? _apiResponse_reference_id : null,
                        workflow_version_path: (_apiResponse_workflow_version_path = apiResponse.workflow_version_path) !== null && _apiResponse_workflow_version_path !== void 0 ? _apiResponse_workflow_version_path : null,
                        engine_history: apiResponse.engine_history ? JSON.stringify(apiResponse.engine_history) : null,
                        output_features: ((_apiResponse_output_data1 = apiResponse.output_data) === null || _apiResponse_output_data1 === void 0 ? void 0 : (_apiResponse_output_data_features = _apiResponse_output_data1.features) === null || _apiResponse_output_data_features === void 0 ? void 0 : _apiResponse_output_data_features.output_features) ? JSON.stringify(apiResponse.output_data.features.output_features) : null,
                        rules_output: ((_apiResponse_output_data2 = apiResponse.output_data) === null || _apiResponse_output_data2 === void 0 ? void 0 : _apiResponse_output_data2.rules_output) ? JSON.stringify(apiResponse.output_data.rules_output) : null,
                        Decision: (_ref10 = finalDecision === null || finalDecision === void 0 ? void 0 : finalDecision.Decision) !== null && _ref10 !== void 0 ? _ref10 : null,
                        LoanAmount: (_ref11 = finalDecision === null || finalDecision === void 0 ? void 0 : finalDecision.LoanAmount) !== null && _ref11 !== void 0 ? _ref11 : null,
                        rule_engine_name: (_ref12 = finalDecision === null || finalDecision === void 0 ? void 0 : finalDecision.rule_engine_name) !== null && _ref12 !== void 0 ? _ref12 : null,
                        rule_engine_version: (_ref13 = finalDecision === null || finalDecision === void 0 ? void 0 : finalDecision.version) !== null && _ref13 !== void 0 ? _ref13 : null,
                        DecisionReason: (_ref14 = finalDecision === null || finalDecision === void 0 ? void 0 : finalDecision.DecisionReason) !== null && _ref14 !== void 0 ? _ref14 : null
                    };
                    return [
                        4,
                        bureauDataservice.create(bureauSaveData)
                    ];
                case 6:
                    _state.sent();
                    return [
                        4,
                        saveAnalyticsData(analyticsData)
                    ];
                case 7:
                    _state.sent();
                    output.Decision = finalDecision.Decision;
                    output.offerAmount = Math.round(finalDecision.LoanAmount || 0);
                    _state.label = 8;
                case 8:
                    // Save API log
                    return [
                        4,
                        leadApiLogService.create(saveData)
                    ];
                case 9:
                    _state.sent();
                    return [
                        4,
                        leadApiLogMongoDBService.create('internalApi', saveData)
                    ];
                case 10:
                    _state.sent();
                    return [
                        2,
                        output
                    ];
                case 11:
                    error = _state.sent();
                    logger.error('Error in cibilExperianBureau:', error);
                    return [
                        2,
                        output
                    ];
                case 12:
                    return [
                        2
                    ];
            }
        });
    })();
}

//# sourceMappingURL=cibilAndBre.service.js.map