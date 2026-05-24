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
import { bureauDatamodel } from '../database/mysql/bureauData';
import config from '@/config/default';
import { logger } from '@/utils/logger';
import axios from 'axios';
import LeadModel from '../database/mysql/leads';
import { LeadLogApiType } from '../enums/leadApiLogs.enum';
import { roundAmountBanking } from '../utils/util';
import AxiosService from './api.service';
import { bankingDataservice } from './bankingData.service';
import LeadApiLogService from './leadApiLog.service';
import { thirdPartyLogsservice } from './thirdpartylogs.service';
var BureauDataService = /*#__PURE__*/ function() {
    "use strict";
    function BureauDataService() {
        _class_call_check(this, BureauDataService);
        _define_property(this, "bureauDataModel", bureauDatamodel);
        _define_property(this, "leadsModel", new LeadModel());
        _define_property(this, "leadsApiLogService", new LeadApiLogService());
        _define_property(this, "bankingDataService", bankingDataservice);
        _define_property(this, "thirdPartyLogsService", thirdPartyLogsservice);
    }
    _create_class(BureauDataService, [
        {
            key: "findOne",
            value: function findOne(_0, _1) {
                return _async_to_generator(function(where) {
                    var select, order;
                    var _arguments = arguments;
                    return _ts_generator(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                select = _arguments.length > 1 && _arguments[1] !== void 0 ? _arguments[1] : [
                                    '*'
                                ], order = _arguments.length > 2 ? _arguments[2] : void 0;
                                return [
                                    4,
                                    this.bureauDataModel.findOneBureauData(where, select, order)
                                ];
                            case 1:
                                return [
                                    2,
                                    _state.sent()
                                ];
                        }
                    });
                }).apply(this, arguments);
            }
        },
        {
            key: "create",
            value: function create(data) {
                return _async_to_generator(function() {
                    return _ts_generator(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                return [
                                    4,
                                    this.bureauDataModel.insert(data)
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
            key: "banking_v1",
            value: function banking_v1(leadID) {
                return _async_to_generator(function() {
                    var output, lead, predictors, predictorsOutPut, referenceId, apiCall, body, apiData, saveData, data, _data_output_data_rules_output_bank, _data_output_data_rules_output, _data_output_data, saveData2;
                    return _ts_generator(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                output = {
                                    Decision: '',
                                    LoanAmount: 0
                                };
                                return [
                                    4,
                                    this.leadsModel.LeadsKnex.join('customer as c', 'c.customerID', '=', 'leads.customerID').where('leads.leadID', leadID).orderBy('leads.leadID', 'desc').first()
                                ];
                            case 1:
                                lead = _state.sent();
                                if (!lead) {
                                    return [
                                        2,
                                        output
                                    ];
                                }
                                return [
                                    4,
                                    this.leadsApiLogService.findOne({
                                        status: 1,
                                        api_type: LeadLogApiType.PREDICTORS,
                                        mobile_no: lead.mobile,
                                        sync_result: 'ACCEPT'
                                    }, [
                                        '*'
                                    ], [
                                        {
                                            column: 'id',
                                            order: 'desc'
                                        }
                                    ])
                                ];
                            case 2:
                                predictors = _state.sent();
                                if (!predictors) return [
                                    3,
                                    7
                                ];
                                if (!predictors.api_response) return [
                                    3,
                                    7
                                ];
                                predictorsOutPut = JSON.parse(predictors.api_response);
                                if (!((predictorsOutPut === null || predictorsOutPut === void 0 ? void 0 : predictorsOutPut.apimsg) && (predictorsOutPut === null || predictorsOutPut === void 0 ? void 0 : predictorsOutPut.is_success))) return [
                                    3,
                                    7
                                ];
                                referenceId = "".concat(lead.customerID).concat(Date.now()).concat(Math.floor(Math.random() * 9000) + 1000);
                                apiCall = new AxiosService(config.bureauBaseUrlv1);
                                body = {
                                    auth_token: '',
                                    client_id: '',
                                    rules_output: {
                                        bureau: {
                                            Decision: 'Proceed to Bank',
                                            LoanAmount: null,
                                            version: 'v1'
                                        }
                                    },
                                    input_data: {
                                        user_id: lead.email,
                                        reference_id: referenceId,
                                        fetched_timestamp: new Date(),
                                        external: {
                                            bankconnect: predictorsOutPut.apimsg
                                        }
                                    }
                                };
                                return [
                                    4,
                                    apiCall.call('post', "/".concat(config.bankingApiUrlv1), body, undefined, {
                                        'Content-Type': 'application/json'
                                    })
                                ];
                            case 3:
                                apiData = _state.sent();
                                delete body.input_data.external.bankconnect;
                                body.bankconnectId = predictors.id;
                                saveData = {
                                    customerID: lead.customerID,
                                    leadID: leadID,
                                    api_supplier: 11,
                                    api_type: 'Banking V1',
                                    api_endpoint_url: "".concat(config.bureauBaseUrlv1, "/").concat(config.bankingApiUrlv1),
                                    api_method: 'POST',
                                    api_request: JSON.stringify(body),
                                    api_response: JSON.stringify(apiCall),
                                    status: !apiData.success ? 1 : 0
                                };
                                data = apiData.data;
                                if (!apiData.success) return [
                                    3,
                                    5
                                ];
                                if (!(data === null || data === void 0 ? void 0 : (_data_output_data = data.output_data) === null || _data_output_data === void 0 ? void 0 : (_data_output_data_rules_output = _data_output_data.rules_output) === null || _data_output_data_rules_output === void 0 ? void 0 : (_data_output_data_rules_output_bank = _data_output_data_rules_output.bank) === null || _data_output_data_rules_output_bank === void 0 ? void 0 : _data_output_data_rules_output_bank.Decision)) return [
                                    3,
                                    5
                                ];
                                saveData2 = {
                                    customerID: lead.customerID,
                                    leadID: leadID,
                                    reference_id: data.output_data.input_data.reference_id,
                                    entity_id: data.output_data.input_data.external.bankconnect.entity_id,
                                    Decision: data.output_data.rules_output.bank.Decision,
                                    LoanAmount: data.output_data.rules_output.bank.LoanAmount,
                                    version: 'v1'
                                };
                                return [
                                    4,
                                    this.bankingDataService.create(saveData2)
                                ];
                            case 4:
                                _state.sent();
                                output.Decision = data.output_data.rules_output.bank.Decision;
                                output.LoanAmount = roundAmountBanking(Number(data.output_data.rules_output.bank.LoanAmount));
                                _state.label = 5;
                            case 5:
                                return [
                                    4,
                                    this.thirdPartyLogsService.create(saveData)
                                ];
                            case 6:
                                _state.sent();
                                _state.label = 7;
                            case 7:
                                return [
                                    2,
                                    output
                                ];
                        }
                    });
                }).call(this);
            }
        },
        {
            key: "count",
            value: function count(where, whereNot) {
                return _async_to_generator(function() {
                    return _ts_generator(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                return [
                                    4,
                                    this.bureauDataModel.countBureauData(where, whereNot)
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
            key: "findSwitchPercentageUser",
            value: function findSwitchPercentageUser() {
                return _async_to_generator(function() {
                    var v1_and_v0_gap, checkV2Api, lastV1Id, where;
                    return _ts_generator(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                return [
                                    4,
                                    this.findOne({
                                        version: 'v1'
                                    }, [
                                        '*'
                                    ], [
                                        {
                                            column: 'id',
                                            order: 'desc'
                                        }
                                    ])
                                ];
                            case 1:
                                checkV2Api = _state.sent();
                                if (!checkV2Api) return [
                                    3,
                                    3
                                ];
                                lastV1Id = checkV2Api.id;
                                where = function where(query) {
                                    return query.where('id', '>', lastV1Id);
                                };
                                return [
                                    4,
                                    this.count(where)
                                ];
                            case 2:
                                v1_and_v0_gap = _state.sent();
                                return [
                                    3,
                                    5
                                ];
                            case 3:
                                return [
                                    4,
                                    this.count()
                                ];
                            case 4:
                                v1_and_v0_gap = _state.sent();
                                _state.label = 5;
                            case 5:
                                return [
                                    2,
                                    v1_and_v0_gap
                                ];
                        }
                    });
                }).call(this);
            }
        },
        {
            key: "removeDataFromCibil",
            value: function removeDataFromCibil(data) {
                var dataArr = _object_spread({}, data);
                if (dataArr.consumerCreditData && dataArr.consumerCreditData[0]) {
                    if (dataArr.consumerCreditData[0].names) {
                        dataArr.consumerCreditData[0].names = [];
                    }
                    if (dataArr.consumerCreditData[0].ids) {
                        dataArr.consumerCreditData[0].ids = [];
                    }
                    if (dataArr.consumerCreditData[0].telephones) {
                        dataArr.consumerCreditData[0].telephones = [];
                    }
                    if (dataArr.consumerCreditData[0].emails) {
                        dataArr.consumerCreditData[0].emails = [];
                    }
                    if (dataArr.consumerCreditData[0].addresses) {
                        // dataArr.consumerCreditData[0].addresses = {}; // Uncomment this line if you want to replace addresses with an empty object instead of removing it
                        delete dataArr.consumerCreditData[0].addresses; // Comment this line if you want to replace addresses with an empty object instead of removing it
                    }
                }
                return dataArr;
            }
        },
        {
            key: "convertDataToBase64",
            value: function convertDataToBase64(data) {
                return Buffer.from(data).toString('base64');
            }
        },
        {
            key: "roundAmount",
            value: function roundAmount(amount) {
                return Math.round(amount);
            }
        },
        {
            key: "saveBureauData",
            value: function saveBureauData(data) {
                return _async_to_generator(function() {
                    return _ts_generator(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                return [
                                    4,
                                    this.thirdPartyLogsService.create(data)
                                ];
                            case 1:
                                _state.sent();
                                return [
                                    2
                                ];
                        }
                    });
                }).call(this);
            }
        },
        {
            key: "bureauV1",
            value: function bureauV1(leadID) {
                return _async_to_generator(function() {
                    var _this, output, cibilData, cibil, data, filebase64, reference_id, url, method, body, headers, apiReturn, apiResponse, saveData, _apiResponse_output_data_rules_output_bureau, _apiResponse_output_data_rules_output, _apiResponse_output_data, _apiResponse_output_data_rules_output_bureau1, _apiResponse_output_data_rules_output1, _apiResponse_output_data1, _apiResponse_output_data_input_data, _apiResponse_output_data2, _apiResponse_output_data_features_cred_bureau_cibil_json, _apiResponse_output_data_features, _apiResponse_output_data3, _apiResponse_output_data_features_cred_bureau_cibil_json1, _apiResponse_output_data_features1, _apiResponse_output_data4, _apiResponse_output_data_features_cred_bureau_cibil_json2, _apiResponse_output_data_features2, _apiResponse_output_data5, decision, loanAmount, saveData1, error;
                    return _ts_generator(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                _this = this;
                                _state.label = 1;
                            case 1:
                                _state.trys.push([
                                    1,
                                    8,
                                    ,
                                    9
                                ]);
                                console.log('********** bureauV1 **********');
                                output = {
                                    Decision: '',
                                    offerAmount: 0
                                };
                                return [
                                    4,
                                    this.leadsModel.LeadsKnex.join('customer as c', 'c.customerID', '=', 'leads.customerID').join('leads_api_log as lal', function(join) {
                                        join.on('c.mobile', '=', 'lal.mobile_no').andOn('lal.api_type', '=', _this.leadsModel.Knex.raw('?', [
                                            'consumer-cir-cv'
                                        ])).andOn('lal.status', '=', _this.leadsModel.Knex.raw('?', [
                                            1
                                        ]));
                                    }).where('leads.leadID', leadID).orderBy('lal.id', 'desc').select('lal.api_response', 'c.email', 'c.customerID', 'lal.id').first()
                                ];
                            case 2:
                                cibilData = _state.sent();
                                console.log('cibildata at bureauV1', cibilData);
                                if (!cibilData) return [
                                    3,
                                    7
                                ];
                                cibil = JSON.parse(cibilData.api_response);
                                if (!(cibil && cibil.apimsg)) return [
                                    3,
                                    7
                                ];
                                data = this.removeDataFromCibil(cibil.apimsg);
                                console.log('data', data);
                                filebase64 = this.convertDataToBase64(JSON.stringify(data));
                                reference_id = "".concat(cibilData.customerID, "|").concat(leadID, "|").concat(Date.now()).concat(Math.floor(Math.random() * 9000) + 1000);
                                url = "".concat(config.bureauBaseUrlv1).concat(config.bureauApiUrlv1);
                                console.log('url', url);
                                method = 'POST';
                                body = {
                                    auth_token: config.bureau_auth_token,
                                    client_id: config.bureau_client_id,
                                    input_data: {
                                        user_id: String(cibilData.customerID),
                                        reference_id: reference_id,
                                        fetched_timestamp: new Date().toISOString(),
                                        external: {
                                            cibil_json: filebase64
                                        }
                                    }
                                };
                                headers = {
                                    'Content-Type': 'application/json'
                                };
                                return [
                                    4,
                                    axios.post(url, body, {
                                        headers: headers
                                    })
                                ];
                            case 3:
                                apiReturn = _state.sent();
                                apiResponse = apiReturn.data;
                                delete body.input_data.external.cibil_json;
                                body.input_data['cibil_json_id'] = cibilData.id;
                                saveData = {
                                    customerID: cibilData.customerID,
                                    leadID: leadID,
                                    api_supplier: 11,
                                    api_type: 'Bureau V1',
                                    api_endpoint_url: url,
                                    api_method: method,
                                    api_request: JSON.stringify(body),
                                    api_response: JSON.stringify(apiResponse),
                                    status: apiResponse.error ? 0 : 1,
                                    created_at: new Date(Date.now())
                                };
                                if (!!apiResponse.error) return [
                                    3,
                                    5
                                ];
                                decision = ((_apiResponse_output_data = apiResponse.output_data) === null || _apiResponse_output_data === void 0 ? void 0 : (_apiResponse_output_data_rules_output = _apiResponse_output_data.rules_output) === null || _apiResponse_output_data_rules_output === void 0 ? void 0 : (_apiResponse_output_data_rules_output_bureau = _apiResponse_output_data_rules_output.bureau) === null || _apiResponse_output_data_rules_output_bureau === void 0 ? void 0 : _apiResponse_output_data_rules_output_bureau.Decision) || '';
                                loanAmount = ((_apiResponse_output_data1 = apiResponse.output_data) === null || _apiResponse_output_data1 === void 0 ? void 0 : (_apiResponse_output_data_rules_output1 = _apiResponse_output_data1.rules_output) === null || _apiResponse_output_data_rules_output1 === void 0 ? void 0 : (_apiResponse_output_data_rules_output_bureau1 = _apiResponse_output_data_rules_output1.bureau) === null || _apiResponse_output_data_rules_output_bureau1 === void 0 ? void 0 : _apiResponse_output_data_rules_output_bureau1.LoanAmount) || 0;
                                saveData1 = {
                                    customerID: Number(cibilData.customerID),
                                    leadID: leadID,
                                    reference_id: ((_apiResponse_output_data2 = apiResponse.output_data) === null || _apiResponse_output_data2 === void 0 ? void 0 : (_apiResponse_output_data_input_data = _apiResponse_output_data2.input_data) === null || _apiResponse_output_data_input_data === void 0 ? void 0 : _apiResponse_output_data_input_data.reference_id) || '',
                                    affordability_generic: ((_apiResponse_output_data3 = apiResponse.output_data) === null || _apiResponse_output_data3 === void 0 ? void 0 : (_apiResponse_output_data_features = _apiResponse_output_data3.features) === null || _apiResponse_output_data_features === void 0 ? void 0 : (_apiResponse_output_data_features_cred_bureau_cibil_json = _apiResponse_output_data_features.cred_bureau_cibil_json) === null || _apiResponse_output_data_features_cred_bureau_cibil_json === void 0 ? void 0 : _apiResponse_output_data_features_cred_bureau_cibil_json.affordability_generic) || 0,
                                    predicted_income: ((_apiResponse_output_data4 = apiResponse.output_data) === null || _apiResponse_output_data4 === void 0 ? void 0 : (_apiResponse_output_data_features1 = _apiResponse_output_data4.features) === null || _apiResponse_output_data_features1 === void 0 ? void 0 : (_apiResponse_output_data_features_cred_bureau_cibil_json1 = _apiResponse_output_data_features1.cred_bureau_cibil_json) === null || _apiResponse_output_data_features_cred_bureau_cibil_json1 === void 0 ? void 0 : _apiResponse_output_data_features_cred_bureau_cibil_json1.predicted_income) || 0,
                                    predicted_affordability: ((_apiResponse_output_data5 = apiResponse.output_data) === null || _apiResponse_output_data5 === void 0 ? void 0 : (_apiResponse_output_data_features2 = _apiResponse_output_data5.features) === null || _apiResponse_output_data_features2 === void 0 ? void 0 : (_apiResponse_output_data_features_cred_bureau_cibil_json2 = _apiResponse_output_data_features2.cred_bureau_cibil_json) === null || _apiResponse_output_data_features_cred_bureau_cibil_json2 === void 0 ? void 0 : _apiResponse_output_data_features_cred_bureau_cibil_json2.predicted_affordability) || 0,
                                    Decision: decision || '',
                                    LoanAmount: loanAmount || 0,
                                    version: 'v1',
                                    createdDate: new Date()
                                };
                                return [
                                    4,
                                    this.create(saveData1)
                                ];
                            case 4:
                                _state.sent();
                                output.Decision = decision;
                                output.offerAmount = this.roundAmount(loanAmount);
                                _state.label = 5;
                            case 5:
                                return [
                                    4,
                                    this.saveBureauData(saveData)
                                ];
                            case 6:
                                _state.sent();
                                _state.label = 7;
                            case 7:
                                return [
                                    2,
                                    output
                                ];
                            case 8:
                                error = _state.sent();
                                logger.error('Error in bureauV1:', error);
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
        },
        {
            key: "bureau",
            value: function bureau(leadID) {
                return _async_to_generator(function() {
                    var _this, offerAmount, cibilData, cibil, data, fileBase64, referenceId, url, method, body, headers, response, apiResponse, saveData, saveData1, error;
                    return _ts_generator(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                _this = this;
                                offerAmount = 0;
                                return [
                                    4,
                                    this.leadsModel.LeadsKnex.join('customer as c', 'c.customerID', '=', 'leads.customerID').join('leads_api_log as lal', function(join) {
                                        join.on('c.mobile', '=', 'lal.mobile_no').andOn('lal.api_type', '=', _this.leadsModel.Knex.raw('?', [
                                            'consumer-cir-cv'
                                        ])).andOn('lal.status', '=', _this.leadsModel.Knex.raw('?', [
                                            1
                                        ]));
                                    }).where('leads.leadID', leadID).orderBy('lal.id', 'desc').select('lal.api_response', 'c.email', 'c.customerID', 'lal.id').first()
                                ];
                            case 1:
                                cibilData = _state.sent();
                                if (!cibilData) return [
                                    3,
                                    9
                                ];
                                cibil = JSON.parse(cibilData.api_response);
                                if (!(Array.isArray(cibil) && cibil['apimsg'])) return [
                                    3,
                                    9
                                ];
                                data = this.removeDataFromCibil(cibil['apimsg']);
                                fileBase64 = this.convertDataToBase64(JSON.stringify(data));
                                referenceId = "".concat(cibilData.customerID, "|").concat(leadID, "|").concat(Date.now()).concat(Math.floor(Math.random() * 9000) + 1000);
                                url = "".concat(config.bureau_base_url).concat(config.bureau_api_url);
                                method = 'POST';
                                body = {
                                    auth_token: config.bureau_auth_token,
                                    client_id: config.bureau_client_id,
                                    user_id: String(cibilData.customerID),
                                    reference_id: referenceId,
                                    fetched_timestamp: new Date().toISOString(),
                                    raw_data: fileBase64,
                                    format_type: 'cibil_json'
                                };
                                headers = {
                                    'Content-Type': 'application/json'
                                };
                                _state.label = 2;
                            case 2:
                                _state.trys.push([
                                    2,
                                    7,
                                    ,
                                    8
                                ]);
                                return [
                                    4,
                                    axios.post(url, body, {
                                        headers: headers
                                    })
                                ];
                            case 3:
                                response = _state.sent();
                                apiResponse = response.data;
                                delete body.raw_data;
                                body['row_data_id'] = cibilData.id;
                                saveData = {
                                    customerID: cibilData.customerID,
                                    leadID: leadID,
                                    api_supplier: 11,
                                    api_type: 'Bureau',
                                    api_endpoint_url: url,
                                    api_method: method,
                                    api_request: JSON.stringify(body),
                                    api_response: JSON.stringify(apiResponse),
                                    status: apiResponse.error ? 0 : 1
                                };
                                if (!(!apiResponse.error && apiResponse.reference_id && apiResponse.affordability_generic && apiResponse.predicted_income && apiResponse.predicted_affordability)) return [
                                    3,
                                    5
                                ];
                                saveData1 = {
                                    customerID: Number(cibilData.customerID),
                                    leadID: leadID,
                                    reference_id: apiResponse.reference_id || '',
                                    affordability_generic: apiResponse.affordability_generic || 0,
                                    predicted_income: apiResponse.predicted_income || 0,
                                    predicted_affordability: apiResponse.predicted_affordability || 0,
                                    Decision: '',
                                    LoanAmount: 0,
                                    version: ''
                                };
                                return [
                                    4,
                                    this.create(saveData1)
                                ];
                            case 4:
                                _state.sent();
                                offerAmount = this.roundAmount(apiResponse.affordability_generic);
                                _state.label = 5;
                            case 5:
                                return [
                                    4,
                                    this.saveBureauData(saveData)
                                ];
                            case 6:
                                _state.sent();
                                return [
                                    3,
                                    8
                                ];
                            case 7:
                                error = _state.sent();
                                console.error('Error making API request:', error);
                                return [
                                    3,
                                    8
                                ];
                            case 8:
                                return [
                                    2,
                                    offerAmount
                                ];
                            case 9:
                                return [
                                    2,
                                    offerAmount
                                ];
                        }
                    });
                }).call(this);
            }
        },
        {
            key: "countLongTermEligibleLoans",
            value: function countLongTermEligibleLoans() {
                return _async_to_generator(function() {
                    return _ts_generator(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                return [
                                    4,
                                    this.bureauDataModel.countLongTermEligibleLoans()
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
        }
    ]);
    return BureauDataService;
}();
export var bureauDataservice = new BureauDataService();

//# sourceMappingURL=bureauData.service.js.map