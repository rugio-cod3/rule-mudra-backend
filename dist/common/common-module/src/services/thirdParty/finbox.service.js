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
import moment from 'moment';
import { apiByPassModel } from '../../database/mysql/apiBypass';
import { approvalModel } from '../../database/mysql/approval';
import { callHistorymodel } from '../../database/mysql/callHistory';
import { callHistoryLogsModel } from '../../database/mysql/callhistorylogs';
import { customerModel } from '../../database/mysql/customer';
import { customerNameMatchmodel } from '../../database/mysql/customerNameMatch';
import { documentFinboxmodel } from '../../database/mysql/documentFinbox';
import { leadsApiLogModel } from '../../database/mysql/leadApiLogs';
import { leadModel } from '../../database/mysql/leads';
import { mobileTokenModel } from '../../database/mysql/mobileToken';
import { repayDateHolidaymodel } from '../../database/mysql/repayDateHoliday';
import { thirdPartylogs } from '../../database/mysql/thirdPartyLogs';
import { ApprovalStatus } from '../../enums/approvalStatus.enums';
import { BranchName, CallType, LeadLogApiType } from '../../enums/common.enum';
import { DateDifference, nameCheckPercentage, NameSimilarityStatus } from '../../enums/finbox.enum';
import { LeadStatus } from '../../enums/leadStatus.enum';
import { BadRequestError, NotFoundError } from '../../errors';
import { commonHelper } from '../../helpers/common';
import AxiosService from '../../services/api.service';
import { addMonthNoOverflow, addMonthsToDate, subtractDayFromDate } from '../../utils/dateTimeFunction';
import { logger } from '../../utils/logger';
import { replaceNameClippingsRe, similarityPercent } from '../../utils/util';
import { approvalService } from '../approval.service';
import { LeadService } from '../lead.service';
import LeadApiLogMongoDBService from '../leadApiLogMongo.service';
var FinboxService = /*#__PURE__*/ function() {
    "use strict";
    function FinboxService() {
        _class_call_check(this, FinboxService);
        _define_property(this, "apiUrl", 'https://apis.bankconnect.finbox.in/');
        // Dev
        _define_property(this, "devEnv", 0);
        _define_property(this, "devApiKey", '54bXP1Uqz63XTzfhK64PElmp0ilzNnPqXkEK1dGc');
        _define_property(this, "devServerHash", 'b81c9a328e4b409f9b41dce4777244d2');
        // Live
        _define_property(this, "liveEnv", 1);
        _define_property(this, "liveApiKey", '5NPxJjy6s5fUtsZD12JbusM4c7fo5AzW0LXy83CU');
        _define_property(this, "liveServerHash", '4c18063c3b9d4482b48e40192766e07f');
        // Env
        _define_property(this, "activeEnv", config.nodeEnv === 'development' ? this.devEnv : this.liveEnv);
        _define_property(this, "XAPIKEY", this.activeEnv === this.devEnv ? this.devApiKey : this.liveApiKey);
        _define_property(this, "SERVERHASH", this.activeEnv === this.devEnv ? this.devServerHash : this.liveServerHash);
        _define_property(this, "STATUS_ACCEPT", 'ACCEPT');
        _define_property(this, "STATUS_REJECT", 'REJECT');
        _define_property(this, "customerNameMatchmodel", customerNameMatchmodel);
        _define_property(this, "leadsApiLogModel", leadsApiLogModel);
        _define_property(this, "mobileTokenModel", mobileTokenModel);
        _define_property(this, "commonHelper", commonHelper);
        _define_property(this, "callHistorymodel", callHistorymodel);
        _define_property(this, "callHistoryLogsModel", callHistoryLogsModel);
        _define_property(this, "repayDateHolidaymodel", repayDateHolidaymodel);
        _define_property(this, "approvalService", approvalService);
        _define_property(this, "documentFinboxModel", documentFinboxmodel);
        _define_property(this, "leadApiLogMongoDBService", new LeadApiLogMongoDBService());
    }
    _create_class(FinboxService, [
        {
            key: "headers",
            value: function headers() {
                return {
                    'content-type': 'application/json',
                    'x-api-key': this.XAPIKEY,
                    'server-hash': this.SERVERHASH
                };
            }
        },
        {
            key: "checkNamePercentageByRajatApi",
            value: function checkNamePercentageByRajatApi(payload) {
                var shouldSave = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : true;
                return _async_to_generator(function() {
                    var customerID, customerMobileNo, firstName, leadId, secondName, type, firstNameLower, secondNameLower, typeLower, url, method, headers, body, res, error, apiNameMatchScore, status, percentageData, saveData;
                    return _ts_generator(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                customerID = payload.customerID, customerMobileNo = payload.customerMobileNo, firstName = payload.firstName, leadId = payload.leadId, secondName = payload.secondName, type = payload.type;
                                firstNameLower = firstName ? firstName.trim().toLowerCase() : '';
                                secondNameLower = secondName ? secondName.trim().toLowerCase() : '';
                                typeLower = type ? type.toLowerCase() : '';
                                firstNameLower = replaceNameClippingsRe(firstNameLower);
                                secondNameLower = replaceNameClippingsRe(secondNameLower);
                                if (!firstNameLower) {
                                    return [
                                        2,
                                        {
                                            errorCode: 1,
                                            errorMsg: 'First Name empty'
                                        }
                                    ];
                                }
                                if (!secondNameLower) {
                                    return [
                                        2,
                                        {
                                            errorCode: 1,
                                            errorMsg: 'Second Name empty'
                                        }
                                    ];
                                }
                                if (!typeLower) {
                                    return [
                                        2,
                                        {
                                            errorCode: 1,
                                            errorMsg: 'Type empty'
                                        }
                                    ];
                                }
                                leadId = leadId ? leadId : 0;
                                customerID = customerID ? customerID : 0;
                                customerMobileNo = customerMobileNo ? customerMobileNo : '';
                                url = "".concat(config.gatorUrl, "api/name_match");
                                method = 'POST';
                                headers = {
                                    'x-auth-token': "".concat(config.gatorToken),
                                    'x-client-id': "".concat(config.clientId),
                                    'Content-Type': 'application/json'
                                };
                                body = {
                                    user_id: customerID.toString(),
                                    source_name: firstName,
                                    target_name: secondName,
                                    reversible: true,
                                    first_name_order_not_important: true
                                };
                                _state.label = 1;
                            case 1:
                                _state.trys.push([
                                    1,
                                    3,
                                    ,
                                    4
                                ]);
                                return [
                                    4,
                                    this.apiCall(url, method, headers, body)
                                ];
                            case 2:
                                res = _state.sent();
                                if (!(res === null || res === void 0 ? void 0 : res.is_success)) {
                                    throw new BadRequestError('Finbox API returned error', (res === null || res === void 0 ? void 0 : res.apimsg) || {});
                                }
                                return [
                                    3,
                                    4
                                ];
                            case 3:
                                error = _state.sent();
                                throw new BadRequestError('Failed to fetch name match score from Finbox API', error);
                            case 4:
                                apiNameMatchScore = res.apimsg.name_match_score || 0;
                                status = apiNameMatchScore >= nameCheckPercentage ? NameSimilarityStatus.ACCEPT : NameSimilarityStatus.REJECT;
                                percentageData = {
                                    errorCode: 0,
                                    errorMsg: 'Successfully',
                                    firstName: firstNameLower,
                                    secondName: secondNameLower,
                                    percentageConditionCheck: nameCheckPercentage,
                                    percentageResult: apiNameMatchScore,
                                    status: status
                                };
                                saveData = {
                                    lead_id: leadId,
                                    customer_id: customerID,
                                    mobile_no: customerMobileNo,
                                    type: type,
                                    first_name: firstNameLower,
                                    second_name: secondNameLower,
                                    percentage: String(apiNameMatchScore),
                                    percentage_data: JSON.stringify(percentageData),
                                    status: status === NameSimilarityStatus.ACCEPT ? 1 : 0
                                };
                                if (!shouldSave) return [
                                    3,
                                    7
                                ];
                                return [
                                    4,
                                    this.customerNameMatchmodel.insert(saveData)
                                ];
                            case 5:
                                _state.sent();
                                return [
                                    4,
                                    thirdPartylogs.insert({
                                        customerID: customerID,
                                        leadID: leadId,
                                        api_supplier: 12,
                                        api_type: 'name_match',
                                        api_endpoint_url: url,
                                        api_method: method,
                                        api_request: JSON.stringify(body),
                                        api_response: JSON.stringify(res),
                                        status: apiNameMatchScore >= nameCheckPercentage ? 1 : 0
                                    })
                                ];
                            case 6:
                                _state.sent();
                                _state.label = 7;
                            case 7:
                                return [
                                    2,
                                    percentageData
                                ];
                        }
                    });
                }).call(this);
            }
        },
        {
            key: "checkNamePercentage",
            value: function checkNamePercentage(payload) {
                var shouldSave = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : true;
                return _async_to_generator(function() {
                    var customerID, customerMobileNo, firstName, leadId, secondName, type, firstNameLower, secondNameLower, typeLower, percentage, percentResult, status, percentageData, saveData;
                    return _ts_generator(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                customerID = payload.customerID, customerMobileNo = payload.customerMobileNo, firstName = payload.firstName, leadId = payload.leadId, secondName = payload.secondName, type = payload.type;
                                firstNameLower = firstName ? firstName.trim().toLowerCase() : '';
                                secondNameLower = secondName ? secondName.trim().toLowerCase() : '';
                                typeLower = type ? type.toLowerCase() : '';
                                firstNameLower = replaceNameClippingsRe(firstNameLower);
                                secondNameLower = replaceNameClippingsRe(secondNameLower);
                                if (!firstNameLower) {
                                    return [
                                        2,
                                        {
                                            errorCode: 1,
                                            errorMsg: 'First Name empty'
                                        }
                                    ];
                                }
                                if (!secondNameLower) {
                                    return [
                                        2,
                                        {
                                            errorCode: 1,
                                            errorMsg: 'Second Name empty'
                                        }
                                    ];
                                }
                                if (!typeLower) {
                                    return [
                                        2,
                                        {
                                            errorCode: 1,
                                            errorMsg: 'Type empty'
                                        }
                                    ];
                                }
                                leadId = leadId ? leadId : 0;
                                customerID = customerID ? customerID : 0;
                                customerMobileNo = customerMobileNo ? customerMobileNo : '';
                                // Text similarity percentage
                                percentage = similarityPercent(firstNameLower, secondNameLower);
                                // Round off to 2 decimal places
                                percentResult = Number(percentage.toFixed(2));
                                status = percentResult >= nameCheckPercentage ? NameSimilarityStatus.ACCEPT : NameSimilarityStatus.REJECT;
                                percentageData = {
                                    errorCode: 0,
                                    errorMsg: 'Successfully',
                                    firstName: firstNameLower,
                                    secondName: secondNameLower,
                                    percentageConditionCheck: nameCheckPercentage,
                                    percentageResult: percentResult,
                                    status: status
                                };
                                saveData = {
                                    lead_id: leadId,
                                    customer_id: customerID,
                                    mobile_no: customerMobileNo,
                                    type: type,
                                    first_name: firstNameLower,
                                    second_name: secondNameLower,
                                    percentage: String(percentResult),
                                    percentage_data: JSON.stringify(percentageData),
                                    status: status === NameSimilarityStatus.ACCEPT ? 1 : 0
                                };
                                if (!shouldSave) return [
                                    3,
                                    2
                                ];
                                return [
                                    4,
                                    this.customerNameMatchmodel.insert(saveData)
                                ];
                            case 1:
                                _state.sent();
                                _state.label = 2;
                            case 2:
                                return [
                                    2,
                                    percentageData
                                ];
                        }
                    });
                }).call(this);
            }
        },
        {
            key: "bankConnect",
            value: function bankConnect(payload) {
                return _async_to_generator(function() {
                    var link_id, logo_url, redirect_url, url, startDate, formattedStartDate, endDate, formattedEndDate, body;
                    return _ts_generator(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                link_id = payload.link_id, logo_url = payload.logo_url, redirect_url = payload.redirect_url;
                                url = "".concat(this.apiUrl, "bank-connect/v1/session/");
                                startDate = new Date();
                                startDate.setMonth(startDate.getMonth() - 3);
                                formattedStartDate = "".concat(String(startDate.getDate()).padStart(2, '0'), "/").concat(String(startDate.getMonth() + 1).padStart(2, '0'), "/").concat(startDate.getFullYear());
                                endDate = new Date();
                                formattedEndDate = "".concat(String(endDate.getDate()).padStart(2, '0'), "/").concat(String(endDate.getMonth() + 1).padStart(2, '0'), "/").concat(endDate.getFullYear());
                                body = {
                                    link_id: link_id,
                                    api_key: this.XAPIKEY,
                                    redirect_url: redirect_url,
                                    logo_url: logo_url,
                                    from_date: formattedStartDate,
                                    to_date: formattedEndDate
                                };
                                return [
                                    4,
                                    this.apiCall(url, 'POST', this.headers(), body)
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
            key: "apiCall",
            value: function apiCall(url, method, headers, body) {
                return _async_to_generator(function() {
                    var response, error, _error_response;
                    return _ts_generator(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                _state.trys.push([
                                    0,
                                    2,
                                    ,
                                    3
                                ]);
                                console.log(method, url, headers, body);
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
                                    {
                                        is_success: true,
                                        apimsg: response.data
                                    }
                                ];
                            case 2:
                                error = _state.sent();
                                console.log('Error in Finbox api call: ', error.response);
                                return [
                                    2,
                                    {
                                        is_success: false,
                                        apimsg: error === null || error === void 0 ? void 0 : (_error_response = error.response) === null || _error_response === void 0 ? void 0 : _error_response.data
                                    }
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
            key: "predictors",
            value: function predictors(mobile, entity_id, leadID, customerID) {
                return _async_to_generator(function() {
                    var _predictorsHitResult_apimsg, _predictorsHitResult_apimsg_predictors_, check, finalArray, acceptReject, predictorsHitResult, predictorsData, predictArray, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, thisKey, res, transactions, finalObj, saveArray, error, error1;
                    return _ts_generator(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                _state.trys.push([
                                    0,
                                    10,
                                    ,
                                    11
                                ]);
                                return [
                                    4,
                                    this.leadsApiLogModel.findOneLeadsApiLog({
                                        status: 1,
                                        api_supplier: 2,
                                        mobile_no: String(mobile),
                                        entity_id: entity_id
                                    }, [
                                        'sync_result'
                                    ])
                                ];
                            case 1:
                                check = _state.sent();
                                if (check) {
                                    return [
                                        2,
                                        {
                                            sync_result: check.sync_result
                                        }
                                    ];
                                }
                                finalArray = {};
                                acceptReject = this.STATUS_ACCEPT;
                                return [
                                    4,
                                    this.predictorshit(entity_id)
                                ];
                            case 2:
                                predictorsHitResult = _state.sent();
                                if (!(predictorsHitResult.is_success && ((_predictorsHitResult_apimsg = predictorsHitResult.apimsg) === null || _predictorsHitResult_apimsg === void 0 ? void 0 : _predictorsHitResult_apimsg.predictors) && Array.isArray(predictorsHitResult.apimsg.predictors) && ((_predictorsHitResult_apimsg_predictors_ = predictorsHitResult.apimsg.predictors[0]) === null || _predictorsHitResult_apimsg_predictors_ === void 0 ? void 0 : _predictorsHitResult_apimsg_predictors_.predictors))) return [
                                    3,
                                    9
                                ];
                                predictorsData = predictorsHitResult.apimsg.predictors[0].predictors;
                                predictArray = [
                                    'total_inward_chq_bounces_insuff_fund_0',
                                    'total_inward_chq_bounces_insuff_fund_1',
                                    'total_inward_chq_bounces_insuff_fund_2',
                                    'total_inward_chq_bounces_insuff_fund_3',
                                    'total_inward_chq_bounces_insuff_fund_4',
                                    'total_inward_chq_bounces_insuff_fund_5',
                                    'total_inward_chq_bounces_insuff_fund_6',
                                    'total_inward_payment_bounce_0',
                                    'total_inward_payment_bounce_1',
                                    'total_inward_payment_bounce_2',
                                    'total_inward_payment_bounce_3',
                                    'total_inward_payment_bounce_4',
                                    'total_inward_payment_bounce_5',
                                    'total_inward_payment_bounce_6',
                                    'total_emi_bounce_0',
                                    'total_emi_bounce_1',
                                    'total_emi_bounce_2',
                                    'total_emi_bounce_3',
                                    'total_emi_bounce_4',
                                    'total_emi_bounce_5',
                                    'total_emi_bounce_6',
                                    'inward_chq_bounces_insuff_fund_0',
                                    'inward_chq_bounces_insuff_fund_1',
                                    'inward_chq_bounces_insuff_fund_2',
                                    'inward_chq_bounces_insuff_fund_3',
                                    'inward_chq_bounces_insuff_fund_4',
                                    'inward_chq_bounces_insuff_fund_5',
                                    'inward_chq_bounces_insuff_fund_6',
                                    'emi_bounce_0',
                                    'emi_bounce_1',
                                    'emi_bounce_2',
                                    'emi_bounce_3',
                                    'emi_bounce_4',
                                    'emi_bounce_5',
                                    'emi_bounce_6',
                                    'cnt_ach_bounce_charge_in_3_months',
                                    'cnt_ach_bounce_charge_in_6_months',
                                    'emi_check_returns_last_3_months',
                                    'emi_check_returns_last_6_months'
                                ];
                                _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
                                try {
                                    for(_iterator = predictArray[Symbol.iterator](); !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true){
                                        thisKey = _step.value;
                                        if (predictorsData[thisKey] !== undefined || predictorsData[thisKey] === null) {
                                            res = predictorsData[thisKey];
                                            finalArray[thisKey] = res;
                                            if (acceptReject !== this.STATUS_REJECT) {
                                                if (res > 0) acceptReject = this.STATUS_REJECT;
                                            }
                                        }
                                    }
                                } catch (err) {
                                    _didIteratorError = true;
                                    _iteratorError = err;
                                } finally{
                                    try {
                                        if (!_iteratorNormalCompletion && _iterator.return != null) {
                                            _iterator.return();
                                        }
                                    } finally{
                                        if (_didIteratorError) {
                                            throw _iteratorError;
                                        }
                                    }
                                }
                                return [
                                    4,
                                    this.transactionsdata(entity_id)
                                ];
                            case 3:
                                transactions = _state.sent();
                                // success or failure response
                                // transactions {
                                //   lender_transactions: [],
                                //   ach_bounce_charge: [],
                                //   nach_setup_charge: [],
                                //   min_bal_charge: []
                                // }
                                finalObj = Object.assign(finalArray, transactions);
                                // Continue from here
                                if (acceptReject === this.STATUS_ACCEPT) {
                                    if (transactions.lender_transactions.length > 0) {
                                        acceptReject = this.STATUS_REJECT;
                                    }
                                }
                                if (acceptReject === this.STATUS_ACCEPT) {
                                    if (transactions.ach_bounce_charge.length > 0) {
                                        acceptReject = this.STATUS_REJECT;
                                    }
                                }
                                if (acceptReject === this.STATUS_ACCEPT) {
                                    if (transactions.nach_setup_charge.length > 0) {
                                        acceptReject = this.STATUS_REJECT;
                                    }
                                }
                                if (acceptReject === this.STATUS_ACCEPT) {
                                    if (transactions.min_bal_charge.length > 0) {
                                        acceptReject = this.STATUS_REJECT;
                                    }
                                }
                                saveArray = {
                                    api_type: 'predictors',
                                    api_supplier: 2,
                                    leadID: leadID,
                                    mobile_no: mobile,
                                    api_response: JSON.stringify(predictorsHitResult),
                                    entity_id: entity_id,
                                    sync_data: JSON.stringify(finalObj),
                                    sync_result: acceptReject,
                                    status: 1,
                                    customerID: customerID
                                };
                                return [
                                    4,
                                    this.leadsApiLogModel.insert(saveArray)
                                ];
                            case 4:
                                _state.sent();
                                _state.label = 5;
                            case 5:
                                _state.trys.push([
                                    5,
                                    7,
                                    ,
                                    8
                                ]);
                                return [
                                    4,
                                    this.leadApiLogMongoDBService.create('finbox', saveArray)
                                ];
                            case 6:
                                _state.sent();
                                return [
                                    3,
                                    8
                                ];
                            case 7:
                                error = _state.sent();
                                logger.error('Error while saving to MongoDB collection : finbox', error);
                                return [
                                    3,
                                    8
                                ];
                            case 8:
                                return [
                                    2,
                                    {
                                        sync_result: acceptReject
                                    }
                                ];
                            case 9:
                                return [
                                    2,
                                    {
                                        sync_result: acceptReject
                                    }
                                ];
                            case 10:
                                error1 = _state.sent();
                                throw error1;
                            case 11:
                                return [
                                    2
                                ];
                        }
                    });
                }).call(this);
            }
        },
        {
            key: "bankConnectIdentity",
            value: function bankConnectIdentity(payload) {
                return _async_to_generator(function() {
                    var entityId, url, response, status, saveObject, error;
                    return _ts_generator(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                entityId = payload.entityId;
                                url = "".concat(this.apiUrl, "bank-connect/v1/entity/").concat(entityId, "/identity/");
                                return [
                                    4,
                                    this.apiCall(url, 'GET', this.headers(), {})
                                ];
                            case 1:
                                response = _state.sent();
                                status = response.is_success ? 1 : 0;
                                saveObject = {
                                    api_type: 'identity',
                                    api_supplier: 2,
                                    leadID: 0,
                                    api_response: JSON.stringify(response.apimsg),
                                    entity_id: entityId,
                                    status: status
                                };
                                return [
                                    4,
                                    this.leadsApiLogModel.insert(saveObject)
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
                                    this.leadApiLogMongoDBService.create('finbox', saveObject)
                                ];
                            case 4:
                                _state.sent();
                                return [
                                    3,
                                    6
                                ];
                            case 5:
                                error = _state.sent();
                                logger.error('Error while saving to MongoDB collection : finbox', error);
                                return [
                                    3,
                                    6
                                ];
                            case 6:
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
            key: "predictorshit",
            value: function predictorshit(entity_id) {
                return _async_to_generator(function() {
                    var url, response;
                    return _ts_generator(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                url = "".concat(this.apiUrl, "bank-connect/v1/entity/").concat(entity_id, "/predictors/");
                                return [
                                    4,
                                    this.apiCall(url, 'GET', this.headers(), {})
                                ];
                            case 1:
                                response = _state.sent();
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
            key: "transactionsdata",
            value: function transactionsdata(entity_id) {
                return _async_to_generator(function() {
                    var _transactions_apimsg, lenderTransactions, achBounceCharge, nachSetupCharge, minBalCharge, transactions, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, txn;
                    return _ts_generator(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                lenderTransactions = [];
                                achBounceCharge = [];
                                nachSetupCharge = [];
                                minBalCharge = [];
                                return [
                                    4,
                                    this.bankConnectTransactionsReport(entity_id)
                                ];
                            case 1:
                                transactions = _state.sent();
                                if (transactions.is_success && ((_transactions_apimsg = transactions.apimsg) === null || _transactions_apimsg === void 0 ? void 0 : _transactions_apimsg.transactions)) {
                                    _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
                                    try {
                                        for(_iterator = transactions.apimsg.transactions[Symbol.iterator](); !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true){
                                            txn = _step.value;
                                            if (txn.transaction_channel === 'auto_debit_payment' && txn.description === 'lender_transactions') {
                                                lenderTransactions.push(txn);
                                            } else if (txn.transaction_channel === 'bank_charge' && txn.description === 'ach_bounce_charge') {
                                                achBounceCharge.push(txn);
                                            } else if (txn.transaction_channel === 'bank_charge' && txn.description === 'nach_setup_charge') {
                                                nachSetupCharge.push(txn);
                                            } else if (txn.transaction_channel === 'bank_charge' && txn.description === 'min_bal_charge') {
                                                minBalCharge.push(txn);
                                            }
                                        }
                                    } catch (err) {
                                        _didIteratorError = true;
                                        _iteratorError = err;
                                    } finally{
                                        try {
                                            if (!_iteratorNormalCompletion && _iterator.return != null) {
                                                _iterator.return();
                                            }
                                        } finally{
                                            if (_didIteratorError) {
                                                throw _iteratorError;
                                            }
                                        }
                                    }
                                }
                                return [
                                    2,
                                    {
                                        lender_transactions: lenderTransactions,
                                        ach_bounce_charge: achBounceCharge,
                                        nach_setup_charge: nachSetupCharge,
                                        min_bal_charge: minBalCharge
                                    }
                                ];
                        }
                    });
                }).call(this);
            }
        },
        {
            key: "bankConnectTransactionsReport",
            value: function bankConnectTransactionsReport(entity_id) {
                return _async_to_generator(function() {
                    var url, response, status, saveObject, error;
                    return _ts_generator(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                url = "".concat(this.apiUrl, "bank-connect/v1/entity/").concat(entity_id, "/transactions/");
                                return [
                                    4,
                                    this.apiCall(url, 'GET', this.headers(), {})
                                ];
                            case 1:
                                response = _state.sent();
                                status = response.is_success ? 1 : 0;
                                saveObject = {
                                    api_type: 'transactions',
                                    api_supplier: 2,
                                    leadID: 0,
                                    api_response: JSON.stringify(response.apimsg),
                                    entity_id: entity_id,
                                    status: status
                                };
                                return [
                                    4,
                                    this.leadsApiLogModel.insert(saveObject)
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
                                    this.leadApiLogMongoDBService.create('finbox', saveObject)
                                ];
                            case 4:
                                _state.sent();
                                return [
                                    3,
                                    6
                                ];
                            case 5:
                                error = _state.sent();
                                logger.error('Error while saving to MongoDB collection : finbox', error);
                                return [
                                    3,
                                    6
                                ];
                            case 6:
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
            key: "findLastUpdatedAccount",
            value: function findLastUpdatedAccount(payload) {
                // TODO : Define types
                var foundIdentity = {};
                if (payload.accounts && payload.identity) {
                    var accounts = payload.accounts;
                    var identity = payload.identity;
                    accounts.sort(function(a, b) {
                        return new Date(b.last_updated).getTime() - new Date(a.last_updated).getTime();
                    });
                    var accountId = accounts[0].account_id;
                    foundIdentity = identity.find(function(id) {
                        return id.account_id === accountId;
                    }) || {};
                }
                return foundIdentity;
            }
        },
        {
            key: "bankConnectXlsxReport",
            value: function bankConnectXlsxReport(entityId, customerID) {
                return _async_to_generator(function() {
                    var url, response, status, saveData, error;
                    return _ts_generator(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                url = "".concat(this.apiUrl, "bank-connect/v1/entity/").concat(entityId, "/xlsx_report/");
                                return [
                                    4,
                                    this.apiCall(url, 'GET', this.headers(), {})
                                ];
                            case 1:
                                response = _state.sent();
                                status = response.is_success ? 1 : 0;
                                saveData = {
                                    api_type: LeadLogApiType.XLSX_REPORT,
                                    api_supplier: 2,
                                    leadID: 0,
                                    api_response: JSON.stringify(response.apimsg),
                                    entity_id: entityId,
                                    status: status,
                                    customerID: customerID
                                };
                                return [
                                    4,
                                    this.leadsApiLogModel.insert(saveData)
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
                                    this.leadApiLogMongoDBService.create('finbox', saveData)
                                ];
                            case 4:
                                _state.sent();
                                return [
                                    3,
                                    6
                                ];
                            case 5:
                                error = _state.sent();
                                logger.error('Error while saving to MongoDB collection : finbox', error);
                                return [
                                    3,
                                    6
                                ];
                            case 6:
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
            key: "leadStatusChangedDocumentReceivedNew",
            value: function leadStatusChangedDocumentReceivedNew(leadID) {
                return _async_to_generator(function() {
                    var leaddetails, customerID, remarkStatus, noteliStatus, leadDataForApprovedProcess, customerId;
                    return _ts_generator(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                return [
                                    4,
                                    leadModel.findOneLead({
                                        leadID: leadID
                                    })
                                ];
                            case 1:
                                leaddetails = _state.sent();
                                if (!(leaddetails && leaddetails.status === LeadStatus.FRESH_LEAD || leaddetails.status === LeadStatus.DOCUMENT_RECEIVED || leaddetails.status === LeadStatus.CALLBACK || leaddetails.status === LeadStatus.INTERESTED || leaddetails.status === LeadStatus.NO_ANSWER || leaddetails.status === LeadStatus.INCOMPLETE_DOCUMENTS || leaddetails.status === LeadStatus.DNC)) return [
                                    3,
                                    8
                                ];
                                customerID = leaddetails.customerID;
                                return [
                                    4,
                                    leadModel.findOneAndUpdate({
                                        leadID: leadID
                                    }, {
                                        status: LeadStatus.DOCUMENT_RECEIVED
                                    })
                                ];
                            case 2:
                                _state.sent();
                                remarkStatus = LeadStatus.DOCUMENT_RECEIVED;
                                noteliStatus = LeadStatus.DOCUMENT_RECEIVED;
                                return [
                                    4,
                                    Promise.all([
                                        this.callHistorymodel.insert({
                                            customerID: customerID,
                                            leadID: leadID,
                                            callType: CallType.IVR,
                                            status: remarkStatus,
                                            noteli: noteliStatus,
                                            callbackTime: new Date(),
                                            calledBy: 221,
                                            remark: remarkStatus
                                        }),
                                        this.callHistoryLogsModel.insert({
                                            customerID: customerID,
                                            leadID: leadID,
                                            callType: CallType.IVR,
                                            status: remarkStatus,
                                            noteli: noteliStatus,
                                            callbackTime: new Date(),
                                            calledBy: 221,
                                            remark: remarkStatus
                                        })
                                    ])
                                ];
                            case 3:
                                _state.sent();
                                return [
                                    4,
                                    leadModel.findOneLead({
                                        leadID: leadID
                                    }, [
                                        '*'
                                    ], [
                                        {
                                            column: 'leadID',
                                            order: 'desc'
                                        }
                                    ])
                                ];
                            case 4:
                                leadDataForApprovedProcess = _state.sent();
                                customerId = leadDataForApprovedProcess.customerID;
                                if (!(leadDataForApprovedProcess && (leadDataForApprovedProcess === null || leadDataForApprovedProcess === void 0 ? void 0 : leadDataForApprovedProcess.status) === LeadStatus.DOCUMENT_RECEIVED)) return [
                                    3,
                                    8
                                ];
                                if (!(leadDataForApprovedProcess.fbLeads && [
                                    'Existing Case',
                                    'New Case'
                                ].includes(leadDataForApprovedProcess.fbLeads))) return [
                                    3,
                                    6
                                ];
                                return [
                                    4,
                                    this.bankingChecksForFinbox(leadID, customerID)
                                ];
                            case 5:
                                _state.sent();
                                return [
                                    3,
                                    8
                                ];
                            case 6:
                                if (!(leadDataForApprovedProcess.fbLeads && leadDataForApprovedProcess.fbLeads === 'Repeat Case')) return [
                                    3,
                                    8
                                ];
                                return [
                                    4,
                                    this.approvalService.autoApproveRepeatCustomer(leadID, leaddetails.customerID)
                                ];
                            case 7:
                                _state.sent();
                                _state.label = 8;
                            case 8:
                                return [
                                    2
                                ];
                        }
                    });
                }).call(this);
            }
        },
        {
            key: "bankingChecksForFinbox",
            value: function bankingChecksForFinbox(leadID, customerID) {
                return _async_to_generator(function() {
                    var baseUrl, apiCall, mobileToken, body, apiData;
                    return _ts_generator(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                baseUrl = this.commonHelper.getBaseUrl();
                                apiCall = new AxiosService(baseUrl);
                                return [
                                    4,
                                    this.mobileTokenModel.findOneMobileToken({
                                        customerID: String(customerID)
                                    }, [
                                        'access_token'
                                    ], [
                                        {
                                            column: 'id',
                                            order: 'desc'
                                        }
                                    ])
                                ];
                            case 1:
                                mobileToken = _state.sent();
                                body = {
                                    leadID: leadID,
                                    access_token: mobileToken.access_token
                                };
                                return [
                                    4,
                                    apiCall.call('post', "/".concat(config.bankingChecksForFinbox), body, undefined, {
                                        'Content-Type': 'application/json'
                                    })
                                ];
                            case 2:
                                apiData = _state.sent();
                                return [
                                    2,
                                    apiData
                                ];
                        }
                    });
                }).call(this);
            }
        },
        {
            key: "repayDateFind",
            value: function repayDateFind(salaryDate) {
                return _async_to_generator(function() {
                    var currentDate, convertedSalaryDate, currentDay, daysInMonth, targetDate, formattedDate, now, difference, dayOfWeek, holidayCount, repayDay, dayOfWeek1;
                    return _ts_generator(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                // Convert to moment
                                currentDate = moment();
                                convertedSalaryDate = Number(salaryDate);
                                currentDay = currentDate.date(); // Get current day
                                daysInMonth = currentDate.daysInMonth(); // Get max days in current month
                                targetDate = currentDate.clone(); // Clone the current date to avoid mutation
                                if (convertedSalaryDate >= currentDay) {
                                    targetDate.date(convertedSalaryDate);
                                } else {
                                    targetDate = addMonthNoOverflow(targetDate, convertedSalaryDate);
                                }
                                formattedDate = targetDate.format('YYYY-MM-DD');
                                // Get the current date
                                now = moment();
                                // Calculate the difference in days between the target date and the current date
                                difference = targetDate.diff(now, 'days');
                                if (difference < DateDifference.LESSER) {
                                    targetDate = addMonthsToDate(targetDate, 1);
                                    formattedDate = targetDate.format('YYYY-MM-DD');
                                    difference = targetDate.diff(moment().format('YYYY-MM-DD'), 'days');
                                }
                                if (difference > DateDifference.GREATER) {
                                    currentDate = moment();
                                    targetDate = addMonthsToDate(currentDate, 1).day(convertedSalaryDate - daysInMonth);
                                    formattedDate = targetDate.format('YYYY-MM-DD');
                                    difference = targetDate.diff(currentDate, 'days');
                                    difference++;
                                }
                                // Handle the case when $salaryDate is 31
                                if (convertedSalaryDate === 31 && daysInMonth === 30) {
                                    targetDate = subtractDayFromDate(targetDate, 1);
                                    formattedDate = targetDate.format('YYYY-MM-DD');
                                    difference--;
                                }
                                // Subtract 2 from days
                                if (convertedSalaryDate === 31 && daysInMonth === 29) {
                                    targetDate = subtractDayFromDate(targetDate, 2);
                                    formattedDate = targetDate.format('YYYY-MM-DD');
                                    difference -= 2;
                                }
                                // Subtract 3 from days
                                if (convertedSalaryDate === 31 && daysInMonth === 28) {
                                    targetDate = subtractDayFromDate(targetDate, 3);
                                    formattedDate = targetDate.format('YYYY-MM-DD');
                                    difference -= 3;
                                }
                                if (convertedSalaryDate === 30 && daysInMonth === 29) {
                                    targetDate = subtractDayFromDate(targetDate, 1);
                                    formattedDate = targetDate.format('YYYY-MM-DD');
                                    difference--;
                                }
                                if (convertedSalaryDate === 30 && daysInMonth === 28) {
                                    targetDate = subtractDayFromDate(targetDate, 2);
                                    formattedDate = targetDate.format('YYYY-MM-DD');
                                    difference -= 2;
                                }
                                // Find the day of the week for formattedDate
                                dayOfWeek = targetDate.format('dddd');
                                // Adjust formattedDate based on the day of the week
                                if (dayOfWeek === 'Sunday') {
                                    targetDate = subtractDayFromDate(targetDate, 2);
                                    formattedDate = targetDate.format('YYYY-MM-DD');
                                    difference -= 2;
                                }
                                if (dayOfWeek === 'Saturday') {
                                    targetDate = subtractDayFromDate(targetDate, 1);
                                    formattedDate = targetDate.format('YYYY-MM-DD');
                                    difference--;
                                }
                                return [
                                    4,
                                    this.repayDateHolidaymodel.findAndCountRepayDateHoliday({
                                        repaydate: targetDate.format('YYYY-MM-DD')
                                    })
                                ];
                            case 1:
                                holidayCount = _state.sent();
                                currentDate = moment(formattedDate);
                                repayDay = currentDate.format('dddd');
                                _state.label = 2;
                            case 2:
                                if (!(holidayCount > 0)) return [
                                    3,
                                    8
                                ];
                                targetDate = subtractDayFromDate(targetDate, 1);
                                formattedDate = targetDate.format('YYYY-MM-DD');
                                difference--;
                                currentDate = moment(formattedDate);
                                repayDay = currentDate.format('dddd');
                                return [
                                    4,
                                    this.repayDateHolidaymodel.findAndCountRepayDateHoliday({
                                        repaydate: targetDate.format('YYYY-MM-DD')
                                    })
                                ];
                            case 3:
                                holidayCount = _state.sent();
                                if (!(repayDay === 'Sunday')) return [
                                    3,
                                    5
                                ];
                                targetDate = subtractDayFromDate(targetDate, 2);
                                formattedDate = targetDate.format('YYYY-MM-DD');
                                difference -= 2;
                                currentDate = moment(formattedDate);
                                repayDay = currentDate.format('dddd');
                                return [
                                    4,
                                    this.repayDateHolidaymodel.findAndCountRepayDateHoliday({
                                        repaydate: targetDate.format('YYYY-MM-DD')
                                    })
                                ];
                            case 4:
                                holidayCount = _state.sent();
                                _state.label = 5;
                            case 5:
                                if (!(repayDay === 'Saturday')) return [
                                    3,
                                    7
                                ];
                                targetDate = subtractDayFromDate(targetDate, 1);
                                formattedDate = targetDate.format('YYYY-MM-DD');
                                difference--;
                                currentDate = moment(formattedDate);
                                repayDay = currentDate.format('dddd');
                                return [
                                    4,
                                    this.repayDateHolidaymodel.findAndCountRepayDateHoliday({
                                        repaydate: targetDate.format('YYYY-MM-DD')
                                    })
                                ];
                            case 6:
                                holidayCount = _state.sent();
                                _state.label = 7;
                            case 7:
                                return [
                                    3,
                                    2
                                ];
                            case 8:
                                if (!(difference < DateDifference.LESSER)) return [
                                    3,
                                    16
                                ];
                                if (convertedSalaryDate >= currentDay) {
                                    targetDate.date(convertedSalaryDate);
                                } else {
                                    targetDate = addMonthNoOverflow(targetDate, convertedSalaryDate);
                                }
                                formattedDate = targetDate.format('YYYY-MM-DD');
                                // Get the current date
                                now = moment();
                                // Calculate the difference in days between the target date and the current date
                                difference = targetDate.diff(now, 'days');
                                // Handle the case when $salaryDate is 31
                                if (convertedSalaryDate === 31 && daysInMonth === 30) {
                                    targetDate = subtractDayFromDate(targetDate, 1);
                                    formattedDate = targetDate.format('YYYY-MM-DD');
                                    difference--;
                                }
                                // Subtract 2 from days
                                if (convertedSalaryDate === 31 && daysInMonth === 29) {
                                    targetDate = subtractDayFromDate(targetDate, 2);
                                    formattedDate = targetDate.format('YYYY-MM-DD');
                                    difference -= 2;
                                }
                                // Subtract 3 from days
                                if (convertedSalaryDate === 31 && daysInMonth === 28) {
                                    targetDate = subtractDayFromDate(targetDate, 3);
                                    formattedDate = targetDate.format('YYYY-MM-DD');
                                    difference -= 3;
                                }
                                if (convertedSalaryDate === 30 && daysInMonth === 29) {
                                    targetDate = subtractDayFromDate(targetDate, 1);
                                    formattedDate = targetDate.format('YYYY-MM-DD');
                                    difference--;
                                }
                                if (convertedSalaryDate === 30 && daysInMonth === 28) {
                                    targetDate = subtractDayFromDate(targetDate, 2);
                                    formattedDate = targetDate.format('YYYY-MM-DD');
                                    difference -= 2;
                                }
                                dayOfWeek1 = targetDate.format('dddd');
                                // Adjust formattedDate based on the day of the week
                                if (dayOfWeek1 === 'Sunday') {
                                    targetDate = subtractDayFromDate(targetDate, 2);
                                    formattedDate = targetDate.format('YYYY-MM-DD');
                                    difference -= 2;
                                }
                                if (dayOfWeek1 === 'Saturday') {
                                    targetDate = subtractDayFromDate(targetDate, 1);
                                    formattedDate = targetDate.format('YYYY-MM-DD');
                                    difference--;
                                }
                                return [
                                    4,
                                    this.repayDateHolidaymodel.findAndCountRepayDateHoliday({
                                        repaydate: targetDate.format('YYYY-MM-DD')
                                    })
                                ];
                            case 9:
                                holidayCount = _state.sent();
                                currentDate = moment(formattedDate);
                                repayDay = currentDate.format('dddd');
                                _state.label = 10;
                            case 10:
                                if (!(holidayCount > 0)) return [
                                    3,
                                    16
                                ];
                                targetDate = subtractDayFromDate(targetDate, 1);
                                formattedDate = targetDate.format('YYYY-MM-DD');
                                difference--;
                                currentDate = moment(formattedDate);
                                repayDay = currentDate.format('dddd');
                                return [
                                    4,
                                    this.repayDateHolidaymodel.findAndCountRepayDateHoliday({
                                        repaydate: targetDate.format('YYYY-MM-DD')
                                    })
                                ];
                            case 11:
                                holidayCount = _state.sent();
                                if (!(repayDay === 'Sunday')) return [
                                    3,
                                    13
                                ];
                                targetDate = subtractDayFromDate(targetDate, 2);
                                formattedDate = targetDate.format('YYYY-MM-DD');
                                difference -= 2;
                                currentDate = moment(formattedDate);
                                repayDay = currentDate.format('dddd');
                                return [
                                    4,
                                    this.repayDateHolidaymodel.findAndCountRepayDateHoliday({
                                        repaydate: targetDate.format('YYYY-MM-DD')
                                    })
                                ];
                            case 12:
                                holidayCount = _state.sent();
                                _state.label = 13;
                            case 13:
                                if (!(repayDay === 'Saturday')) return [
                                    3,
                                    15
                                ];
                                targetDate = subtractDayFromDate(targetDate, 1);
                                formattedDate = targetDate.format('YYYY-MM-DD');
                                difference--;
                                currentDate = moment(formattedDate);
                                repayDay = currentDate.format('dddd');
                                return [
                                    4,
                                    this.repayDateHolidaymodel.findAndCountRepayDateHoliday({
                                        repaydate: targetDate.format('YYYY-MM-DD')
                                    })
                                ];
                            case 14:
                                holidayCount = _state.sent();
                                _state.label = 15;
                            case 15:
                                return [
                                    3,
                                    10
                                ];
                            case 16:
                                return [
                                    2,
                                    {
                                        formattedDate: formattedDate,
                                        difference: difference
                                    }
                                ];
                        }
                    });
                }).call(this);
            }
        },
        {
            key: "bankEntityProgress",
            value: function bankEntityProgress(entity_id) {
                return _async_to_generator(function() {
                    var url, response, status, saveObject;
                    return _ts_generator(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                url = "".concat(this.apiUrl, "bank-connect/v1/entity/").concat(entity_id, "/progress/");
                                return [
                                    4,
                                    this.apiCall(url, 'GET', this.headers(), {})
                                ];
                            case 1:
                                response = _state.sent();
                                status = response.is_success ? 1 : 0;
                                saveObject = {
                                    api_type: 'progress',
                                    api_supplier: 2,
                                    leadID: 0,
                                    api_response: JSON.stringify(response.apimsg),
                                    entity_id: entity_id,
                                    status: status
                                };
                                // await this.leadApiLogService.create(saveObject)   to be un comment
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
            key: "isProgressDone",
            value: function isProgressDone(entity_id) {
                return _async_to_generator(function() {
                    var result, progressData, lastProgress, identity_status, transaction_status, processing_status, fraud_status;
                    return _ts_generator(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                return [
                                    4,
                                    this.bankEntityProgress(entity_id)
                                ];
                            case 1:
                                result = _state.sent();
                                if (result.is_success && result.apimsg.progress) {
                                    progressData = result.apimsg.progress;
                                    if (progressData.length > 0) {
                                        lastProgress = progressData[progressData.length - 1];
                                        identity_status = lastProgress.identity_status, transaction_status = lastProgress.transaction_status, processing_status = lastProgress.processing_status, fraud_status = lastProgress.fraud_status;
                                        if ([
                                            identity_status,
                                            transaction_status,
                                            processing_status,
                                            fraud_status
                                        ].includes('failed')) {
                                            return [
                                                2,
                                                true
                                            ];
                                        } else {
                                            return [
                                                2,
                                                false
                                            ];
                                        }
                                    } else {
                                        return [
                                            2,
                                            true
                                        ];
                                    }
                                }
                                return [
                                    2,
                                    false
                                ];
                        }
                    });
                }).call(this);
            }
        },
        {
            key: "apiByPassForTesting",
            value: function apiByPassForTesting(apiName, type) {
                return _async_to_generator(function() {
                    var response, responseArray, randomApiResponse, output;
                    return _ts_generator(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                if (apiName === 'check_fraud_transaction') {
                                    return [
                                        2,
                                        {}
                                    ];
                                }
                                return [
                                    4,
                                    apiByPassModel.find({
                                        where: {
                                            api_name: apiName,
                                            type: type,
                                            status: 1
                                        },
                                        select: [
                                            'api_response'
                                        ]
                                    })
                                ];
                            case 1:
                                response = _state.sent();
                                if (response.length === 0) {
                                    throw new NotFoundError('No response found for the given API name and type.');
                                }
                                responseArray = response.map(function(row) {
                                    return row.api_response;
                                });
                                randomApiResponse = responseArray[Math.floor(Math.random() * responseArray.length)];
                                output = JSON.parse(randomApiResponse);
                                return [
                                    2,
                                    output
                                ];
                        }
                    });
                })();
            }
        },
        {
            key: "newCustomerAutoApproveFinbox",
            value: function newCustomerAutoApproveFinbox(leadID, ammountOffered, remarkApprove) {
                return _async_to_generator(function() {
                    var _customer_salary_date, response, leadsService, customerLead, customer, salaryDate, checkEmptyDate, data, formattedDate, difference, adminfee, gstOfAdminFee, approvedLoan, data1, error;
                    return _ts_generator(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                _state.trys.push([
                                    0,
                                    12,
                                    ,
                                    13
                                ]);
                                response = {
                                    status: 0,
                                    data: {
                                        DataCode: leadID
                                    }
                                };
                                leadsService = new LeadService();
                                return [
                                    4,
                                    leadsService.findOne({
                                        leadID: leadID
                                    })
                                ];
                            case 1:
                                customerLead = _state.sent();
                                if (!customerLead) return [
                                    2,
                                    response
                                ];
                                return [
                                    4,
                                    customerModel.findOneCustomer({
                                        customerID: customerLead.customerID
                                    })
                                ];
                            case 2:
                                customer = _state.sent();
                                if (!customer) return [
                                    2,
                                    response
                                ];
                                salaryDate = (_customer_salary_date = customer.salary_date) !== null && _customer_salary_date !== void 0 ? _customer_salary_date : '5';
                                checkEmptyDate = 0;
                                return [
                                    4,
                                    this.repayDateFind(salaryDate)
                                ];
                            case 3:
                                data = _state.sent();
                                formattedDate = data.formattedDate;
                                difference = data.difference;
                                adminfee = ammountOffered * 10 / 100;
                                gstOfAdminFee = adminfee * 18 / 100;
                                return [
                                    4,
                                    approvalModel.findOneApproval({
                                        customerID: customer.customerID,
                                        leadID: leadID
                                    })
                                ];
                            case 4:
                                approvedLoan = _state.sent();
                                if (!!approvedLoan) return [
                                    3,
                                    7
                                ];
                                data1 = {
                                    customerID: customer.customerID,
                                    leadID: leadID,
                                    branch: BranchName.DELHI,
                                    loanAmtApproved: ammountOffered,
                                    tenure: checkEmptyDate === 0 ? difference : 0,
                                    roi: 1,
                                    repayDate: checkEmptyDate === 0 ? formattedDate : '0000-00-00',
                                    adminFee: adminfee,
                                    GstOfAdminFee: gstOfAdminFee,
                                    alternateMobile: String(customer.mobile),
                                    officialEmail: customer.email,
                                    cibil: 0,
                                    activeLoans: 0,
                                    status: ApprovalStatus.ApprovedProcess,
                                    remark: remarkApprove,
                                    creditedBy: 221,
                                    employmentType: customer.employeeType,
                                    createdDate: new Date()
                                };
                                return [
                                    4,
                                    approvalModel.insert(data1)
                                ];
                            case 5:
                                _state.sent();
                                return [
                                    4,
                                    leadsService.updateOne({
                                        customerID: customer.customerID,
                                        leadID: leadID
                                    }, {
                                        status: LeadStatus.APPROVED_PROCESS
                                    })
                                ];
                            case 6:
                                _state.sent();
                                return [
                                    3,
                                    10
                                ];
                            case 7:
                                if (!(approvedLoan.loanAmtApproved < ammountOffered)) return [
                                    3,
                                    10
                                ];
                                return [
                                    4,
                                    approvalModel.findOneAndUpdateApproval({
                                        approvalID: approvedLoan.approvalID,
                                        customerID: customer.customerID,
                                        leadID: leadID
                                    }, {
                                        loanAmtApproved: ammountOffered,
                                        tenure: checkEmptyDate === 0 ? difference : 0,
                                        repayDate: checkEmptyDate === 0 ? formattedDate : '0000-00-00',
                                        adminFee: adminfee,
                                        GstOfAdminFee: gstOfAdminFee
                                    })
                                ];
                            case 8:
                                _state.sent();
                                return [
                                    4,
                                    leadsService.updateOne({
                                        customerID: customer.customerID,
                                        leadID: leadID
                                    }, {
                                        status: LeadStatus.APPROVED_PROCESS
                                    })
                                ];
                            case 9:
                                _state.sent();
                                _state.label = 10;
                            case 10:
                                // Start from Call history Logs
                                return [
                                    4,
                                    this.callHistoryLogsModel.insert({
                                        customerID: customer.customerID,
                                        leadID: leadID,
                                        callType: 'IVR',
                                        status: LeadStatus.APPROVED_PROCESS,
                                        appAmount: String(ammountOffered),
                                        noteli: LeadStatus.APPROVED_PROCESS,
                                        remark: remarkApprove,
                                        callbackTime: new Date(),
                                        calledBy: 221
                                    })
                                ];
                            case 11:
                                _state.sent();
                                response.status = 1;
                                response.data.DataCode = leadID;
                                return [
                                    2,
                                    response
                                ];
                            case 12:
                                error = _state.sent();
                                logger.error('Error in breNewFlowRajatApi:', error);
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
                }).call(this);
            }
        },
        {
            key: "checkAccountAggregator",
            value: function checkAccountAggregator(customerID) {
                return _async_to_generator(function() {
                    return _ts_generator(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                return [
                                    4,
                                    this.documentFinboxModel.DocumentFinboxKnex.select('entityID').where('customerID', customerID).whereRaw('TIMESTAMPDIFF(MONTH, verifiedDate, NOW()) <= 11').where('entityID', '!=', '').where('type', 'aa').orderBy('documentID', 'DESC').first()
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
            key: "bankConnectRecurring",
            value: function bankConnectRecurring(link_id, redirect_url, logo_url, bankName, mobile) {
                return _async_to_generator(function() {
                    var url, startDate, endDate, body, response;
                    return _ts_generator(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                url = "".concat(this.apiUrl, "bank-connect/v1/session/");
                                startDate = "01/".concat(new Date().toLocaleString('default', {
                                    month: '2-digit',
                                    year: 'numeric'
                                }).replace('/', '/'));
                                endDate = "".concat(new Date().toLocaleDateString('default', {
                                    day: '2-digit',
                                    month: '2-digit',
                                    year: 'numeric'
                                }));
                                body = {
                                    link_id: link_id,
                                    api_key: this.XAPIKEY,
                                    redirect_url: redirect_url,
                                    logo_url: logo_url,
                                    from_date: startDate,
                                    to_date: endDate,
                                    bank_name: bankName,
                                    mode: 'aa',
                                    mobile_number: mobile,
                                    aa_journey_mode: 'once_with_recurring',
                                    aa_recurring_tenure_month_count: 12,
                                    aa_recurring_frequency_unit: 'month',
                                    aa_recurring_frequency_value: 3
                                };
                                return [
                                    4,
                                    this.apiCall(url, 'POST', this.headers(), body)
                                ];
                            case 1:
                                response = _state.sent();
                                console.log('********************bankConnectRecurring response:****************************', response);
                                return [
                                    2,
                                    response
                                ];
                        }
                    });
                }).call(this);
            }
        }
    ]);
    return FinboxService;
}();
export default FinboxService;
export var finboxService = new FinboxService();

//# sourceMappingURL=finbox.service.js.map