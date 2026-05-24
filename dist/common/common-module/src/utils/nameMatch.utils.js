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
import moment from 'moment-timezone';
import { leadsApiLogModel } from '../database/mysql/leadApiLogs';
import { NameMatchType } from '../enums/finbox.enum';
import { ApiSupplierType, LeadLogApiType } from '../enums/leadApiLogs.enum';
import { CommonNameMatchType, NameSimilarityStatus } from '../enums/nameMatch.enum';
import FinboxService from '../services/thirdParty/finbox.service';
import { logger } from './logger';
var findBoxService = new FinboxService();
export var nameMatch = function nameMatch(payload) {
    return _async_to_generator(function() {
        var type, data, isNameMatched, panDetails, _tmp, nameMatch, aadharData, _ref, _ref1, _aadharData_data, _aadharData_data_proofOfIdentity, _aadharData_data1, nameMatch1, digilockerAadhar, _ref2, _digilocker_proofOfIdentity, digilocker, nameMatch2, digilockerAadhar1, _ref3, _digilocker_proofOfIdentity1, digilocker1, nameMatch3, panDetailsForBank, _tmp1, nameMatch4, aadharData1, _ref4, _ref5, _aadharData_data2, _aadharData_data_proofOfIdentity1, _aadharData_data3, nameMatch5, digilockerAadhar2, _digilocker_proofOfIdentity_name, digilocker2, nameMatch6, digilockerAadhar3, _digilocker_proofOfIdentity_name1, digilocker3, nameMatch7, finboxNameMatchObj;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    type = payload.type, data = payload.data;
                    switch(type){
                        case CommonNameMatchType.PENNY_DROP:
                            return [
                                3,
                                1
                            ];
                        case CommonNameMatchType.BANK_NAME:
                            return [
                                3,
                                17
                            ];
                        case CommonNameMatchType.FINBOX:
                            return [
                                3,
                                33
                            ];
                        case CommonNameMatchType.KYC:
                            return [
                                3,
                                35
                            ];
                    }
                    return [
                        3,
                        37
                    ];
                case 1:
                    isNameMatched = false;
                    if (!data.pancard) return [
                        3,
                        3
                    ];
                    return [
                        4,
                        leadsApiLogModel.findPanComprehensiveResponse(data.pancard, String(data.mobile))
                    ];
                case 2:
                    _tmp = _state.sent();
                    return [
                        3,
                        4
                    ];
                case 3:
                    _tmp = null;
                    _state.label = 4;
                case 4:
                    panDetails = _tmp;
                    if (!(panDetails && (panDetails === null || panDetails === void 0 ? void 0 : panDetails.full_name))) return [
                        3,
                        6
                    ];
                    return [
                        4,
                        findBoxService.checkNamePercentageByRajatApi({
                            customerID: data.customerID,
                            leadId: data.leadID,
                            customerMobileNo: data.mobile,
                            secondName: panDetails.full_name,
                            firstName: data.name,
                            type: NameMatchType.PENNY_DROP_PAN
                        })
                    ];
                case 5:
                    nameMatch = _state.sent();
                    if (nameMatch.status === NameSimilarityStatus.ACCEPT) {
                        return [
                            2,
                            nameMatch
                        ];
                    }
                    _state.label = 6;
                case 6:
                    if (!!isNameMatched) return [
                        3,
                        16
                    ];
                    if (!data.aadharNo) return [
                        3,
                        13
                    ];
                    return [
                        4,
                        leadsApiLogModel.getUserAadharDetails(data.aadharNo, String(data.mobile), true)
                    ];
                case 7:
                    aadharData = _state.sent();
                    if (!aadharData) return [
                        3,
                        9
                    ];
                    return [
                        4,
                        findBoxService.checkNamePercentageByRajatApi({
                            customerID: data.customerID,
                            leadId: data.leadID,
                            customerMobileNo: data.mobile,
                            secondName: aadharData.type === ApiSupplierType.SUREPASS ? (_ref = aadharData === null || aadharData === void 0 ? void 0 : (_aadharData_data = aadharData.data) === null || _aadharData_data === void 0 ? void 0 : _aadharData_data.full_name) !== null && _ref !== void 0 ? _ref : '' : (_ref1 = aadharData === null || aadharData === void 0 ? void 0 : (_aadharData_data1 = aadharData.data) === null || _aadharData_data1 === void 0 ? void 0 : (_aadharData_data_proofOfIdentity = _aadharData_data1.proofOfIdentity) === null || _aadharData_data_proofOfIdentity === void 0 ? void 0 : _aadharData_data_proofOfIdentity.name) !== null && _ref1 !== void 0 ? _ref1 : '',
                            firstName: data.name,
                            type: NameMatchType.PENNY_DROP_AADHAR
                        })
                    ];
                case 8:
                    nameMatch1 = _state.sent();
                    if (nameMatch1.status === NameSimilarityStatus.ACCEPT) {
                        isNameMatched = true;
                    }
                    return [
                        2,
                        nameMatch1
                    ];
                case 9:
                    return [
                        4,
                        leadsApiLogModel.findOneLeadsApiLog({
                            status: 1,
                            api_type: LeadLogApiType.DIGILOCKER_EAADHAR,
                            api_supplier: ApiSupplierType.DECENTRO,
                            mobile_no: String(data.mobile)
                        }, [
                            'api_response'
                        ], [
                            {
                                column: 'id',
                                order: 'desc'
                            }
                        ])
                    ];
                case 10:
                    digilockerAadhar = _state.sent();
                    if (!(digilockerAadhar && (digilockerAadhar === null || digilockerAadhar === void 0 ? void 0 : digilockerAadhar.api_response))) return [
                        3,
                        12
                    ];
                    digilocker = JSON.parse(digilockerAadhar.api_response).data;
                    return [
                        4,
                        findBoxService.checkNamePercentageByRajatApi({
                            customerID: data.customerID,
                            leadId: data.leadID,
                            customerMobileNo: data.mobile,
                            secondName: (_ref2 = digilocker === null || digilocker === void 0 ? void 0 : (_digilocker_proofOfIdentity = digilocker.proofOfIdentity) === null || _digilocker_proofOfIdentity === void 0 ? void 0 : _digilocker_proofOfIdentity.name) !== null && _ref2 !== void 0 ? _ref2 : '',
                            firstName: data.name,
                            type: NameMatchType.PENNY_DROP_AADHAR
                        })
                    ];
                case 11:
                    nameMatch2 = _state.sent();
                    if (nameMatch2.status === NameSimilarityStatus.ACCEPT) {
                        isNameMatched = true;
                    }
                    return [
                        2,
                        nameMatch2
                    ];
                case 12:
                    return [
                        3,
                        16
                    ];
                case 13:
                    return [
                        4,
                        leadsApiLogModel.findOneLeadsApiLog({
                            status: 1,
                            api_type: LeadLogApiType.DIGILOCKER_EAADHAR,
                            api_supplier: ApiSupplierType.DECENTRO,
                            mobile_no: String(data.mobile)
                        }, [
                            'api_response'
                        ], [
                            {
                                column: 'id',
                                order: 'desc'
                            }
                        ])
                    ];
                case 14:
                    digilockerAadhar1 = _state.sent();
                    if (!(digilockerAadhar1 && (digilockerAadhar1 === null || digilockerAadhar1 === void 0 ? void 0 : digilockerAadhar1.api_response))) return [
                        3,
                        16
                    ];
                    digilocker1 = JSON.parse(digilockerAadhar1.api_response).data;
                    return [
                        4,
                        findBoxService.checkNamePercentageByRajatApi({
                            customerID: data.customerID,
                            leadId: data.leadID,
                            customerMobileNo: data.mobile,
                            secondName: (_ref3 = digilocker1 === null || digilocker1 === void 0 ? void 0 : (_digilocker_proofOfIdentity1 = digilocker1.proofOfIdentity) === null || _digilocker_proofOfIdentity1 === void 0 ? void 0 : _digilocker_proofOfIdentity1.name) !== null && _ref3 !== void 0 ? _ref3 : '',
                            firstName: data.name,
                            type: NameMatchType.PENNY_DROP_AADHAR
                        })
                    ];
                case 15:
                    nameMatch3 = _state.sent();
                    if (nameMatch3.status === NameSimilarityStatus.ACCEPT) {
                        isNameMatched = true;
                    }
                    return [
                        2,
                        nameMatch3
                    ];
                case 16:
                    return [
                        3,
                        37
                    ];
                case 17:
                    if (!data.pancard) return [
                        3,
                        19
                    ];
                    return [
                        4,
                        leadsApiLogModel.findPanComprehensiveResponse(data.pancard, data.mobile)
                    ];
                case 18:
                    _tmp1 = _state.sent();
                    return [
                        3,
                        20
                    ];
                case 19:
                    _tmp1 = null;
                    _state.label = 20;
                case 20:
                    panDetailsForBank = _tmp1;
                    if (!(panDetailsForBank && (panDetailsForBank === null || panDetailsForBank === void 0 ? void 0 : panDetailsForBank.full_name))) return [
                        3,
                        22
                    ];
                    return [
                        4,
                        findBoxService.checkNamePercentageByRajatApi({
                            customerID: data.customerID,
                            leadId: data.leadID,
                            customerMobileNo: data.mobile,
                            secondName: panDetailsForBank.full_name,
                            firstName: data.name,
                            type: NameMatchType.BANK_NAME_PAN
                        })
                    ];
                case 21:
                    nameMatch4 = _state.sent();
                    if (nameMatch4.status === NameSimilarityStatus.ACCEPT) {
                        isNameMatched = true;
                    }
                    _state.label = 22;
                case 22:
                    if (!!isNameMatched) return [
                        3,
                        32
                    ];
                    if (!data.aadharNo) return [
                        3,
                        29
                    ];
                    return [
                        4,
                        leadsApiLogModel.getUserAadharDetails(data.aadharNo, String(data.mobile), true)
                    ];
                case 23:
                    aadharData1 = _state.sent();
                    if (!aadharData1) return [
                        3,
                        25
                    ];
                    return [
                        4,
                        findBoxService.checkNamePercentageByRajatApi({
                            customerID: data.customerID,
                            leadId: data.leadID,
                            customerMobileNo: data.mobile,
                            secondName: aadharData1.type === ApiSupplierType.SUREPASS ? (_ref4 = aadharData1 === null || aadharData1 === void 0 ? void 0 : (_aadharData_data2 = aadharData1.data) === null || _aadharData_data2 === void 0 ? void 0 : _aadharData_data2.full_name) !== null && _ref4 !== void 0 ? _ref4 : '' : (_ref5 = aadharData1 === null || aadharData1 === void 0 ? void 0 : (_aadharData_data3 = aadharData1.data) === null || _aadharData_data3 === void 0 ? void 0 : (_aadharData_data_proofOfIdentity1 = _aadharData_data3.proofOfIdentity) === null || _aadharData_data_proofOfIdentity1 === void 0 ? void 0 : _aadharData_data_proofOfIdentity1.name) !== null && _ref5 !== void 0 ? _ref5 : '',
                            firstName: data.name,
                            type: NameMatchType.BANK_NAME_AADHAR
                        })
                    ];
                case 24:
                    nameMatch5 = _state.sent();
                    if (nameMatch5.status === NameSimilarityStatus.ACCEPT) {
                        isNameMatched = true;
                    }
                    return [
                        2,
                        nameMatch5
                    ];
                case 25:
                    return [
                        4,
                        leadsApiLogModel.findOneLeadsApiLog({
                            status: 1,
                            api_type: LeadLogApiType.DIGILOCKER_EAADHAR,
                            api_supplier: ApiSupplierType.DECENTRO,
                            mobile_no: String(data.mobile)
                        }, [
                            'api_response'
                        ], [
                            {
                                column: 'id',
                                order: 'desc'
                            }
                        ])
                    ];
                case 26:
                    digilockerAadhar2 = _state.sent();
                    if (!(digilockerAadhar2 && (digilockerAadhar2 === null || digilockerAadhar2 === void 0 ? void 0 : digilockerAadhar2.api_response))) return [
                        3,
                        28
                    ];
                    digilocker2 = JSON.parse(digilockerAadhar2.api_response).data;
                    return [
                        4,
                        findBoxService.checkNamePercentageByRajatApi({
                            customerID: data.customerID,
                            leadId: data.leadID,
                            customerMobileNo: data.mobile,
                            secondName: (_digilocker_proofOfIdentity_name = digilocker2.proofOfIdentity.name) !== null && _digilocker_proofOfIdentity_name !== void 0 ? _digilocker_proofOfIdentity_name : '',
                            firstName: data.name,
                            type: NameMatchType.BANK_NAME_AADHAR
                        })
                    ];
                case 27:
                    nameMatch6 = _state.sent();
                    if (nameMatch6.status === NameSimilarityStatus.ACCEPT) {
                        isNameMatched = true;
                    }
                    return [
                        2,
                        nameMatch6
                    ];
                case 28:
                    return [
                        3,
                        32
                    ];
                case 29:
                    return [
                        4,
                        leadsApiLogModel.findOneLeadsApiLog({
                            status: 1,
                            api_type: LeadLogApiType.DIGILOCKER_EAADHAR,
                            api_supplier: ApiSupplierType.DECENTRO,
                            mobile_no: String(data.mobile)
                        }, [
                            'api_response'
                        ], [
                            {
                                column: 'id',
                                order: 'desc'
                            }
                        ])
                    ];
                case 30:
                    digilockerAadhar3 = _state.sent();
                    if (!(digilockerAadhar3 && (digilockerAadhar3 === null || digilockerAadhar3 === void 0 ? void 0 : digilockerAadhar3.api_response))) return [
                        3,
                        32
                    ];
                    digilocker3 = JSON.parse(digilockerAadhar3.api_response).data;
                    return [
                        4,
                        findBoxService.checkNamePercentageByRajatApi({
                            customerID: data.customerID,
                            leadId: data.leadID,
                            customerMobileNo: data.mobile,
                            secondName: (_digilocker_proofOfIdentity_name1 = digilocker3.proofOfIdentity.name) !== null && _digilocker_proofOfIdentity_name1 !== void 0 ? _digilocker_proofOfIdentity_name1 : '',
                            firstName: data.name,
                            type: NameMatchType.BANK_NAME_AADHAR
                        })
                    ];
                case 31:
                    nameMatch7 = _state.sent();
                    if (nameMatch7.status === NameSimilarityStatus.ACCEPT) {
                        isNameMatched = true;
                    }
                    return [
                        2,
                        nameMatch7
                    ];
                case 32:
                    return [
                        3,
                        37
                    ];
                case 33:
                    finboxNameMatchObj = {
                        leadId: data.leadID || 0,
                        customerID: data.customerID || 0,
                        customerMobileNo: data.mobile || '0',
                        type: data.nameMatchType,
                        firstName: data.bankConnectName,
                        secondName: data.name
                    };
                    return [
                        4,
                        findBoxService.checkNamePercentageByRajatApi(finboxNameMatchObj)
                    ];
                case 34:
                    return [
                        2,
                        _state.sent()
                    ];
                case 35:
                    return [
                        4,
                        onboardAadharPanMatch(data.mobile, data.customerID)
                    ];
                case 36:
                    return [
                        2,
                        _state.sent()
                    ];
                case 37:
                    return [
                        2
                    ];
            }
        });
    })();
};
export function onboardAadharPanMatch(mobileNo, customerID) {
    return _async_to_generator(function() {
        var isSurePassAadhar, matches, _ref, panDetails, aadhaarDetails, aadhaarDetailsDigilocker, panResponse, panFullName, panDob, panMaskedAadharNo, aadarResponse, aadharFullName, aadharDob, aadharNo, panAadhar, lastFourDigitsAadhar, _ref1, nameMatch, dobMatch, lastDigitsMatch, _, _tmp, aadarResponse1, _aadarResponse_proofOfIdentity, aadharDob1, aadharFullName1, aadharNo1, panAadhar1, lastFourDigitsAadhar1, aadharDobFormatted, _ref2, nameMatch1, dobMatch1, lastDigitsMatch1, _1, _tmp1;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    // Find aadhar and pan details from lead log
                    isSurePassAadhar = true;
                    matches = {
                        dobMatch: 0,
                        nameMatch: 0,
                        lastDigitsMatch: 0,
                        aadharNo: 'XXXXXXXXXXXX',
                        isSurePassAadhar: true,
                        surePassAadharData: null,
                        digilockerAadharData: null,
                        aadharExistsInPan: true
                    };
                    return [
                        4,
                        Promise.all([
                            leadsApiLogModel.findOneLeadsApiLog({
                                status: 1,
                                api_type: LeadLogApiType.PAN_COMPREHENSIVE,
                                api_supplier: ApiSupplierType.SUREPASS,
                                mobile_no: mobileNo
                            }, [
                                'api_response'
                            ], [
                                {
                                    column: 'id',
                                    order: 'desc'
                                }
                            ]),
                            leadsApiLogModel.findOneLeadsApiLog({
                                status: 1,
                                api_type: LeadLogApiType.AADHAR_V2_SUBMIT_OTP,
                                api_supplier: ApiSupplierType.SUREPASS,
                                mobile_no: String(mobileNo)
                            }, [
                                'api_response'
                            ], [
                                {
                                    column: 'id',
                                    order: 'desc'
                                }
                            ]),
                            leadsApiLogModel.findOneLeadsApiLog({
                                status: 1,
                                api_type: LeadLogApiType.DIGILOCKER_EAADHAR,
                                api_supplier: ApiSupplierType.DECENTRO,
                                mobile_no: String(mobileNo)
                            }, [
                                'api_response'
                            ], [
                                {
                                    column: 'id',
                                    order: 'desc'
                                }
                            ])
                        ])
                    ];
                case 1:
                    _ref = _sliced_to_array.apply(void 0, [
                        _state.sent(),
                        3
                    ]), panDetails = _ref[0], aadhaarDetails = _ref[1], aadhaarDetailsDigilocker = _ref[2];
                    if (!panDetails) {
                        logger.warn("Error in pan-aadhar match: Pan/Aadhar details don't exist in lead_log table for mobileNo: " + mobileNo);
                        return [
                            2,
                            matches
                        ];
                    }
                    if (!aadhaarDetails && !aadhaarDetailsDigilocker) {
                        logger.warn("Error in pan-aadhar match: Pan/Aadhar details don't exist in lead_log table for mobileNo: " + mobileNo);
                        return [
                            2,
                            matches
                        ];
                    }
                    if (!(panDetails === null || panDetails === void 0 ? void 0 : panDetails.api_response)) {
                        logger.warn("Error in pan-aadhar match: Pan/Aadhar api_response details don't exist in lead_log table for mobileNo: " + mobileNo);
                        return [
                            2,
                            matches
                        ];
                    }
                    if (!(aadhaarDetails === null || aadhaarDetails === void 0 ? void 0 : aadhaarDetails.api_response) && !(aadhaarDetailsDigilocker === null || aadhaarDetailsDigilocker === void 0 ? void 0 : aadhaarDetailsDigilocker.api_response)) {
                        logger.warn("Error in pan-aadhar match: Pan/Aadhar api_response details don't exist in lead_log table for mobileNo: " + mobileNo);
                        return [
                            2,
                            matches
                        ];
                    }
                    // Check which aadhar details exist
                    if (!aadhaarDetails) {
                        // This means aadharDigiLocker data exist
                        isSurePassAadhar = false;
                    }
                    // If both aadhar details - surepass and digilocker exist, choose the latest entry
                    if (aadhaarDetails && aadhaarDetailsDigilocker) {
                        if (aadhaarDetails.id < aadhaarDetailsDigilocker.id) {
                            isSurePassAadhar = false;
                        }
                    // else true, surepass wins
                    }
                    panResponse = JSON.parse(panDetails.api_response).data;
                    panFullName = panResponse.full_name, panDob = panResponse.dob, panMaskedAadharNo = panResponse.masked_aadhaar;
                    // ! If aadhar not linked with pan / masked aadhar does not exist
                    if (!panMaskedAadharNo) {
                        matches.aadharExistsInPan = false;
                    }
                    if (!isSurePassAadhar) return [
                        3,
                        6
                    ];
                    aadarResponse = JSON.parse(aadhaarDetails.api_response).data;
                    aadharFullName = aadarResponse.full_name, aadharDob = aadarResponse.dob, aadharNo = aadarResponse.aadhaar_number;
                    panAadhar = panMaskedAadharNo.slice(-4);
                    lastFourDigitsAadhar = aadharNo.slice(-4);
                    _ = Promise.all;
                    return [
                        4,
                        findBoxService.checkNamePercentageByRajatApi({
                            firstName: panFullName,
                            secondName: aadharFullName,
                            type: 'pan - aadhar',
                            leadId: 0,
                            customerID: customerID,
                            customerMobileNo: mobileNo
                        })
                    ];
                case 2:
                    _tmp = [
                        _state.sent()
                    ];
                    return [
                        4,
                        findBoxService.checkNamePercentage({
                            firstName: panDob,
                            secondName: aadharDob,
                            type: 'panDOB - aadharDOB',
                            leadId: 0,
                            customerID: customerID,
                            customerMobileNo: mobileNo
                        })
                    ];
                case 3:
                    _tmp = _tmp.concat([
                        _state.sent()
                    ]);
                    return [
                        4,
                        findBoxService.checkNamePercentage({
                            firstName: panAadhar,
                            secondName: lastFourDigitsAadhar,
                            type: 'panLastDigit - aadharLastDigit',
                            leadId: 0,
                            customerID: customerID,
                            customerMobileNo: mobileNo
                        })
                    ];
                case 4:
                    return [
                        4,
                        _.apply(Promise, [
                            _tmp.concat([
                                _state.sent()
                            ])
                        ])
                    ];
                case 5:
                    _ref1 = _sliced_to_array.apply(void 0, [
                        _state.sent(),
                        3
                    ]), nameMatch = _ref1[0], dobMatch = _ref1[1], lastDigitsMatch = _ref1[2];
                    matches.nameMatch = nameMatch.percentageResult;
                    matches.dobMatch = dobMatch.percentageResult;
                    matches.lastDigitsMatch = lastDigitsMatch.percentageResult;
                    matches.surePassAadharData = aadarResponse;
                    return [
                        2,
                        matches
                    ];
                case 6:
                    aadarResponse1 = JSON.parse(aadhaarDetailsDigilocker.api_response).data;
                    _aadarResponse_proofOfIdentity = aadarResponse1.proofOfIdentity, aadharDob1 = _aadarResponse_proofOfIdentity.dob, aadharFullName1 = _aadarResponse_proofOfIdentity.name, aadharNo1 = aadarResponse1.aadhaarUid;
                    panAadhar1 = panMaskedAadharNo.slice(-4);
                    lastFourDigitsAadhar1 = aadharNo1.slice(-4);
                    aadharDobFormatted = moment(aadharDob1, 'DD-MM-YYYY').format('YYYY-MM-DD');
                    _1 = Promise.all;
                    return [
                        4,
                        findBoxService.checkNamePercentageByRajatApi({
                            firstName: panFullName,
                            secondName: aadharFullName1,
                            type: 'pan - aadhar',
                            leadId: 0,
                            customerID: customerID,
                            customerMobileNo: mobileNo
                        })
                    ];
                case 7:
                    _tmp1 = [
                        _state.sent()
                    ];
                    return [
                        4,
                        findBoxService.checkNamePercentage({
                            firstName: panDob,
                            secondName: aadharDobFormatted,
                            type: 'panDOB - aadharDOB',
                            leadId: 0,
                            customerID: customerID,
                            customerMobileNo: mobileNo
                        })
                    ];
                case 8:
                    _tmp1 = _tmp1.concat([
                        _state.sent()
                    ]);
                    return [
                        4,
                        findBoxService.checkNamePercentage({
                            firstName: panAadhar1,
                            secondName: lastFourDigitsAadhar1,
                            type: 'panLastDigit - aadharLastDigit',
                            leadId: 0,
                            customerID: customerID,
                            customerMobileNo: mobileNo
                        })
                    ];
                case 9:
                    return [
                        4,
                        _1.apply(Promise, [
                            _tmp1.concat([
                                _state.sent()
                            ])
                        ])
                    ];
                case 10:
                    _ref2 = _sliced_to_array.apply(void 0, [
                        _state.sent(),
                        3
                    ]), nameMatch1 = _ref2[0], dobMatch1 = _ref2[1], lastDigitsMatch1 = _ref2[2];
                    matches.nameMatch = nameMatch1.percentageResult;
                    matches.dobMatch = dobMatch1.percentageResult;
                    matches.lastDigitsMatch = lastDigitsMatch1.percentageResult;
                    matches.aadharNo = aadharNo1;
                    matches.isSurePassAadhar = false;
                    matches.digilockerAadharData = aadarResponse1;
                    return [
                        2,
                        matches
                    ];
                case 11:
                    return [
                        2
                    ];
            }
        });
    })();
}

//# sourceMappingURL=nameMatch.utils.js.map