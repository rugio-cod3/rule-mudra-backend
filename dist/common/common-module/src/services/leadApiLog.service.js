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
import LeadApiLogModel from '../database/mysql/leadApiLogs';
import { ApiSupplierType, LeadLogApiType } from '../enums/leadApiLogs.enum';
import { logger } from '../utils/logger';
var LeadApiLogService = /*#__PURE__*/ function() {
    "use strict";
    function LeadApiLogService() {
        _class_call_check(this, LeadApiLogService);
        _define_property(this, "leadApiLogModel", new LeadApiLogModel());
    }
    _create_class(LeadApiLogService, [
        {
            key: "findOne",
            value: // public async findOne(
            //   where: {},
            //   order: { orderKey: string; orderValue: string },
            //   select: string[],
            // ): Promise<ILeadsApiLog | ICustomResponse> {
            //   try {
            //     let lead_api_log = await this.leadApiLogModel.getLeadApiLog(
            //       where,
            //       order,
            //       select,
            //     )
            //     if (lead_api_log == null) {
            //       return null
            //     } else {
            //       return lead_api_log // Return the first lead if found
            //     }
            //   } catch (error) {
            //     logger.error(error)
            //     return {
            //       success: false,
            //       message: 'Internal Server Error',
            //       statusCode: 500,
            //     } as ICustomResponse
            //   }
            // }
            function findOne(_0, _1) {
                return _async_to_generator(function(where) {
                    var select, orderBy;
                    var _arguments = arguments;
                    return _ts_generator(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                select = _arguments.length > 1 && _arguments[1] !== void 0 ? _arguments[1] : [
                                    '*'
                                ], orderBy = _arguments.length > 2 ? _arguments[2] : void 0;
                                return [
                                    4,
                                    this.leadApiLogModel.findOneLeadsApiLog(where, select, orderBy)
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
            key: "find",
            value: function find(where, order, select) {
                return _async_to_generator(function() {
                    var lead_api_log, error;
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
                                    this.leadApiLogModel.getLeadApiLogs(where, order, select)
                                ];
                            case 1:
                                lead_api_log = _state.sent();
                                if (lead_api_log == null || lead_api_log.length == 0) {
                                    return [
                                        2,
                                        null
                                    ];
                                } else {
                                    return [
                                        2,
                                        lead_api_log // Return the first lead if found
                                    ];
                                }
                                return [
                                    3,
                                    3
                                ];
                            case 2:
                                error = _state.sent();
                                logger.error(error);
                                return [
                                    2,
                                    {
                                        success: false,
                                        message: 'Internal Server Error',
                                        statusCode: 500
                                    }
                                ];
                            case 3:
                                return [
                                    2
                                ];
                        }
                    });
                }).call(this);
            }
        },
        {
            key: "create",
            value: function create(data) {
                return _async_to_generator(function() {
                    var res, error;
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
                                    this.leadApiLogModel.insert(data)
                                ];
                            case 1:
                                res = _state.sent();
                                return [
                                    2,
                                    res
                                ];
                            case 2:
                                error = _state.sent();
                                logger.error(error);
                                return [
                                    2,
                                    {
                                        success: false,
                                        message: 'Internal Server Error',
                                        statusCode: 500
                                    }
                                ];
                            case 3:
                                return [
                                    2
                                ];
                        }
                    });
                }).call(this);
            }
        },
        {
            key: "updateOne",
            value: function updateOne(where, update) {
                return _async_to_generator(function() {
                    var res, error;
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
                                    this.leadApiLogModel.findOneAndUpdate(where, update)
                                ];
                            case 1:
                                res = _state.sent();
                                return [
                                    2,
                                    res
                                ];
                            case 2:
                                error = _state.sent();
                                logger.error(error);
                                return [
                                    2,
                                    {
                                        success: false,
                                        message: 'Internal Server Error',
                                        statusCode: 500
                                    }
                                ];
                            case 3:
                                return [
                                    2
                                ];
                        }
                    });
                }).call(this);
            }
        },
        {
            key: "findOneLog",
            value: function findOneLog(_0, _1) {
                return _async_to_generator(function(where) {
                    var select, orderBy;
                    var _arguments = arguments;
                    return _ts_generator(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                select = _arguments.length > 1 && _arguments[1] !== void 0 ? _arguments[1] : [
                                    '*'
                                ], orderBy = _arguments.length > 2 ? _arguments[2] : void 0;
                                return [
                                    4,
                                    this.leadApiLogModel.findOneLeadsApiLog(where, select, orderBy)
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
            key: "findPanComprehensiveResponse",
            value: function findPanComprehensiveResponse(panNumber, mobileNo) {
                return _async_to_generator(function() {
                    var data;
                    return _ts_generator(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                return [
                                    4,
                                    this.findOneLog({
                                        status: 1,
                                        api_type: LeadLogApiType.PAN_COMPREHENSIVE,
                                        api_supplier: ApiSupplierType.SUREPASS,
                                        pancard: panNumber,
                                        mobile_no: String(mobileNo)
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
                                data = _state.sent();
                                if (data && data.api_response) return [
                                    2,
                                    JSON.parse(data.api_response).data
                                ];
                                return [
                                    2,
                                    null
                                ];
                        }
                    });
                }).call(this);
            }
        },
        {
            key: "findAadharV2SendOtpResponse",
            value: function findAadharV2SendOtpResponse(aadharNo, mobileNo) {
                return _async_to_generator(function() {
                    var data;
                    return _ts_generator(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                return [
                                    4,
                                    this.findOneLog({
                                        status: 1,
                                        api_type: LeadLogApiType.AADHAR_V2_GENERATE_OTP,
                                        api_supplier: ApiSupplierType.SUREPASS,
                                        aadharNo: aadharNo,
                                        mobile_no: String(mobileNo)
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
                                data = _state.sent();
                                if (data && data.api_response) return [
                                    2,
                                    JSON.parse(data.api_response).data
                                ];
                                return [
                                    2,
                                    null
                                ];
                        }
                    });
                }).call(this);
            }
        },
        {
            key: "delete",
            value: function _delete(deleteWhere) {
                return _async_to_generator(function() {
                    return _ts_generator(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                return [
                                    4,
                                    this.leadApiLogModel.delete(deleteWhere)
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
            key: "findCkycDownloadResponse",
            value: function findCkycDownloadResponse(pancard) {
                return _async_to_generator(function() {
                    var data;
                    return _ts_generator(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                return [
                                    4,
                                    this.findOneLog({
                                        api_supplier: ApiSupplierType.SUREPASS,
                                        status: 1,
                                        api_type: LeadLogApiType.CKYC_DOWNLOAD,
                                        pancard: pancard
                                    }, [
                                        'api_response'
                                    ])
                                ];
                            case 1:
                                data = _state.sent();
                                if (data && data.api_response) return [
                                    2,
                                    JSON.parse(data.api_response).data
                                ];
                                return [
                                    2,
                                    null
                                ];
                        }
                    });
                }).call(this);
            }
        },
        {
            key: "findCkycDataForMatch",
            value: function findCkycDataForMatch(pancard) {
                return _async_to_generator(function() {
                    var ckycDetails, ckycResponse, _ref, _ref1, _ckycData_personal_details, _ckycData_personal_details1, _ckycData_personal_details2, _ckycData_identity_details, _ckycData_image_details, ckycData, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, identity, _iteratorNormalCompletion1, _didIteratorError1, _iteratorError1, _iterator1, _step1, image;
                    return _ts_generator(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                ckycDetails = {
                                    ckycDob: 'CKYC N/A',
                                    ckycLastDigit: 'CKYC N/A',
                                    ckycName: 'CKYC N/A',
                                    ckycImage: 'CKYC N/A',
                                    cykcMobile: 'CKYC N/A'
                                };
                                return [
                                    4,
                                    this.findCkycDownloadResponse(pancard)
                                ];
                            case 1:
                                ckycResponse = _state.sent();
                                if (ckycResponse) {
                                    ;
                                    ;
                                    ckycData = ckycResponse.ckyc_download_data.personal_identifiable_data;
                                    ckycDetails.ckycDob = (_ref = ckycData === null || ckycData === void 0 ? void 0 : (_ckycData_personal_details = ckycData.personal_details) === null || _ckycData_personal_details === void 0 ? void 0 : _ckycData_personal_details.dob) !== null && _ref !== void 0 ? _ref : ckycDetails.ckycDob;
                                    ckycDetails.ckycName = (_ref1 = ckycData === null || ckycData === void 0 ? void 0 : (_ckycData_personal_details1 = ckycData.personal_details) === null || _ckycData_personal_details1 === void 0 ? void 0 : _ckycData_personal_details1.full_name) !== null && _ref1 !== void 0 ? _ref1 : ckycDetails.ckycName;
                                    ckycDetails.cykcMobile = ckycData === null || ckycData === void 0 ? void 0 : (_ckycData_personal_details2 = ckycData.personal_details) === null || _ckycData_personal_details2 === void 0 ? void 0 : _ckycData_personal_details2.mob_num;
                                    if (ckycData === null || ckycData === void 0 ? void 0 : (_ckycData_identity_details = ckycData.identity_details) === null || _ckycData_identity_details === void 0 ? void 0 : _ckycData_identity_details.identity) {
                                        _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
                                        try {
                                            for(_iterator = ckycData.identity_details.identity[Symbol.iterator](); !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true){
                                                identity = _step.value;
                                                if (identity.identity_type === 'Proof of Possession of Aadhaar') {
                                                    ckycDetails.ckycLastDigit = identity.identity_number.slice(-4);
                                                    break;
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
                                    if (ckycData === null || ckycData === void 0 ? void 0 : (_ckycData_image_details = ckycData.image_details) === null || _ckycData_image_details === void 0 ? void 0 : _ckycData_image_details.image) {
                                        _iteratorNormalCompletion1 = true, _didIteratorError1 = false, _iteratorError1 = undefined;
                                        try {
                                            for(_iterator1 = ckycData.image_details.image[Symbol.iterator](); !(_iteratorNormalCompletion1 = (_step1 = _iterator1.next()).done); _iteratorNormalCompletion1 = true){
                                                image = _step1.value;
                                                if (image.image_code === 'Photograph' && image.image_data) {
                                                    ckycDetails.ckycImage = image.image_data;
                                                    break;
                                                }
                                            }
                                        } catch (err) {
                                            _didIteratorError1 = true;
                                            _iteratorError1 = err;
                                        } finally{
                                            try {
                                                if (!_iteratorNormalCompletion1 && _iterator1.return != null) {
                                                    _iterator1.return();
                                                }
                                            } finally{
                                                if (_didIteratorError1) {
                                                    throw _iteratorError1;
                                                }
                                            }
                                        }
                                    }
                                }
                                return [
                                    2,
                                    ckycDetails
                                ];
                        }
                    });
                }).call(this);
            }
        }
    ]);
    return LeadApiLogService;
}();
export default LeadApiLogService;

//# sourceMappingURL=leadApiLog.service.js.map