function _array_like_to_array(arr, len) {
    if (len == null || len > arr.length) len = arr.length;
    for(var i = 0, arr2 = new Array(len); i < len; i++)arr2[i] = arr[i];
    return arr2;
}
function _array_without_holes(arr) {
    if (Array.isArray(arr)) return _array_like_to_array(arr);
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
function _iterable_to_array(iter) {
    if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter);
}
function _non_iterable_spread() {
    throw new TypeError("Invalid attempt to spread non-iterable instance.\\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function _to_consumable_array(arr) {
    return _array_without_holes(arr) || _iterable_to_array(arr) || _unsupported_iterable_to_array(arr) || _non_iterable_spread();
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
import { AadhaarKYC, BillPaymentReceipt, Cibil, Ckyc, Digilocker, DigiTap, Experian, FaceMatch, Finbox, GetUserScore, InternalApi, PanComprehensive } from '../database/mongo/LeadApiLogModel';
import { ApiSupplierType, LeadLogApiType } from '../enums/leadApiLogs.enum';
import { logger } from '../utils/logger';
var LeadApiLogMongoDBService = /*#__PURE__*/ function() {
    "use strict";
    function LeadApiLogMongoDBService() {
        _class_call_check(this, LeadApiLogMongoDBService);
        _define_property(this, "collections", {
            billPaymentReceipts: BillPaymentReceipt,
            finbox: Finbox,
            panComprehensive: PanComprehensive,
            faceMatch: FaceMatch,
            experian: Experian,
            aadhaarKYC: AadhaarKYC,
            cibil: Cibil,
            ckyc: Ckyc,
            digilocker: Digilocker,
            internalApi: InternalApi,
            getUserScore: GetUserScore,
            digitap: DigiTap
        });
    }
    _create_class(LeadApiLogMongoDBService, [
        {
            key: "convertToCamelCase",
            value: function convertToCamelCase(data) {
                var camelCaseObject = {};
                for(var key in data){
                    var camelKey = void 0;
                    if (key === 'mobile_no') {
                        camelKey = 'mobile';
                    } else {
                        camelKey = key.replace(/_([a-z])/g, function(_, letter) {
                            return letter.toUpperCase();
                        });
                    }
                    camelCaseObject[camelKey] = data[key];
                }
                return camelCaseObject;
            }
        },
        {
            key: "create",
            value: function create(collectionName, data) {
                return _async_to_generator(function() {
                    var Model, convertedData, newDocument, error;
                    return _ts_generator(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                _state.trys.push([
                                    0,
                                    2,
                                    ,
                                    3
                                ]);
                                Model = this.collections[collectionName];
                                if (!Model) throw new Error("Collection ".concat(collectionName, " not found"));
                                convertedData = this.convertToCamelCase(data);
                                newDocument = new Model(convertedData);
                                return [
                                    4,
                                    newDocument.save()
                                ];
                            case 1:
                                _state.sent();
                                return [
                                    2,
                                    true
                                ];
                            case 2:
                                error = _state.sent();
                                logger.error("Error inserting into ".concat(collectionName, ":"), error);
                                return [
                                    2,
                                    false
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
            key: "find",
            value: function find(collectionName, where, select, orderBy) {
                return _async_to_generator(function() {
                    var Model, queryExec, _queryExec, result, error;
                    return _ts_generator(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                _state.trys.push([
                                    0,
                                    2,
                                    ,
                                    3
                                ]);
                                Model = this.collections[collectionName];
                                if (!Model) throw new Error("Collection ".concat(collectionName, " not found"));
                                queryExec = Model.find(where);
                                if (select.length && select[0] !== '*') {
                                    ;
                                    queryExec = (_queryExec = queryExec).select.apply(_queryExec, _to_consumable_array(select));
                                }
                                if (orderBy) {
                                    queryExec = queryExec.sort(_define_property({}, orderBy.column, orderBy.order === 'asc' ? 1 : -1));
                                }
                                return [
                                    4,
                                    queryExec
                                ];
                            case 1:
                                result = _state.sent();
                                return [
                                    2,
                                    result !== null && result !== void 0 ? result : null
                                ];
                            case 2:
                                error = _state.sent();
                                logger.error("Error finding document in ".concat(collectionName, ":"), error);
                                return [
                                    2,
                                    null
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
            key: "findOne",
            value: function findOne(collectionName, where, select, orderBy) {
                return _async_to_generator(function() {
                    var Model, queryExec, _queryExec, result, error;
                    return _ts_generator(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                _state.trys.push([
                                    0,
                                    2,
                                    ,
                                    3
                                ]);
                                Model = this.collections[collectionName];
                                if (!Model) throw new Error("Collection ".concat(collectionName, " not found"));
                                queryExec = Model.findOne(where);
                                if (select.length && select[0] !== '*') {
                                    ;
                                    queryExec = (_queryExec = queryExec).select.apply(_queryExec, _to_consumable_array(select));
                                }
                                if (orderBy) {
                                    queryExec = queryExec.sort(_define_property({}, orderBy.column, orderBy.order === 'asc' ? 1 : -1));
                                }
                                return [
                                    4,
                                    queryExec
                                ];
                            case 1:
                                result = _state.sent();
                                return [
                                    2,
                                    result !== null && result !== void 0 ? result : null
                                ];
                            case 2:
                                error = _state.sent();
                                logger.error("Error finding document in ".concat(collectionName, ":"), error);
                                return [
                                    2,
                                    null
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
            value: function findOneLog(_0, _1, _2) {
                return _async_to_generator(function(collectionName, where) {
                    var select, orderBy, Model, queryExec, result, error;
                    var _arguments = arguments;
                    return _ts_generator(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                select = _arguments.length > 2 && _arguments[2] !== void 0 ? _arguments[2] : [
                                    '*'
                                ], orderBy = _arguments.length > 3 ? _arguments[3] : void 0;
                                _state.label = 1;
                            case 1:
                                _state.trys.push([
                                    1,
                                    3,
                                    ,
                                    4
                                ]);
                                Model = this.collections[collectionName];
                                if (!Model) throw new Error("Collection ".concat(collectionName, " not found"));
                                // Build query
                                queryExec = Model.findOne(where);
                                if (select.length && select[0] !== '*') {
                                    queryExec = queryExec.select(select.join(' '));
                                }
                                if (orderBy) {
                                    queryExec = queryExec.sort(_define_property({}, orderBy.column, orderBy.order === 'asc' ? 1 : -1));
                                }
                                return [
                                    4,
                                    queryExec
                                ];
                            case 2:
                                result = _state.sent();
                                return [
                                    2,
                                    result
                                ];
                            case 3:
                                error = _state.sent();
                                logger.error("Error finding document in ".concat(collectionName, ":"), error);
                                return [
                                    2,
                                    null
                                ];
                            case 4:
                                return [
                                    2
                                ];
                        }
                    });
                }).apply(this, arguments);
            }
        },
        {
            key: "findPanComprehensiveResponse",
            value: function findPanComprehensiveResponse(panNumber, mobile) {
                return _async_to_generator(function() {
                    var data;
                    return _ts_generator(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                return [
                                    4,
                                    this.findOneLog('panComprehensive', {
                                        status: 1,
                                        apiType: LeadLogApiType.PAN_COMPREHENSIVE,
                                        apiSupplier: ApiSupplierType.SUREPASS,
                                        pancard: panNumber,
                                        mobile: String(mobile)
                                    }, [
                                        'apiResponse'
                                    ], {
                                        column: '_id',
                                        order: 'desc'
                                    })
                                ];
                            case 1:
                                data = _state.sent();
                                if (data && data.apiResponse) return [
                                    2,
                                    JSON.parse(data.apiResponse)
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
            value: function findAadharV2SendOtpResponse(aadharNo, mobile) {
                return _async_to_generator(function() {
                    var data;
                    return _ts_generator(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                return [
                                    4,
                                    this.findOneLog('aadhaarKYC', {
                                        status: 1,
                                        apiType: LeadLogApiType.AADHAR_V2_GENERATE_OTP,
                                        apiSupplier: ApiSupplierType.SUREPASS,
                                        aadharNo: aadharNo,
                                        mobile: mobile
                                    }, [
                                        'apiResponse'
                                    ], {
                                        column: '_id',
                                        order: 'desc'
                                    })
                                ];
                            case 1:
                                data = _state.sent();
                                if (data && data.apiResponse) return [
                                    2,
                                    JSON.parse(data.apiResponse)
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
            key: "findCkycDownloadResponse",
            value: function findCkycDownloadResponse(pancard) {
                return _async_to_generator(function() {
                    var data;
                    return _ts_generator(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                return [
                                    4,
                                    this.findOneLog('aadhaarKYC', {
                                        status: 1,
                                        apiType: LeadLogApiType.CKYC_DOWNLOAD,
                                        apiSupplier: ApiSupplierType.SUREPASS,
                                        pancard: pancard
                                    }, [
                                        'apiResponse'
                                    ])
                                ];
                            case 1:
                                data = _state.sent();
                                if (data && data.apiResponse) return [
                                    2,
                                    JSON.parse(data.apiResponse)
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
        },
        {
            key: "updateOne",
            value: function updateOne(collectionName, where, update) {
                return _async_to_generator(function() {
                    var Model, convertedUpdate, res, error;
                    return _ts_generator(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                _state.trys.push([
                                    0,
                                    2,
                                    ,
                                    3
                                ]);
                                Model = this.collections[collectionName];
                                if (!Model) throw new Error("Collection ".concat(collectionName, " not found"));
                                convertedUpdate = this.convertToCamelCase(update);
                                return [
                                    4,
                                    Model.updateOne(where, convertedUpdate)
                                ];
                            case 1:
                                res = _state.sent();
                                return [
                                    2,
                                    res.modifiedCount // Return the number of modified documents
                                ];
                            case 2:
                                error = _state.sent();
                                logger.error("Error updating document in ".concat(collectionName, ":"), error);
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
                }).call(this);
            }
        },
        {
            key: "delete",
            value: function _delete(collectionName, query) {
                return _async_to_generator(function() {
                    var Model, res, error;
                    return _ts_generator(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                _state.trys.push([
                                    0,
                                    2,
                                    ,
                                    3
                                ]);
                                Model = this.collections[collectionName];
                                if (!Model) throw new Error("Collection ".concat(collectionName, " not found"));
                                return [
                                    4,
                                    Model.deleteMany(query)
                                ];
                            case 1:
                                res = _state.sent();
                                return [
                                    2,
                                    res.deletedCount
                                ];
                            case 2:
                                error = _state.sent();
                                logger.error("Error deleting documents from ".concat(collectionName, ":"), error);
                                return [
                                    2,
                                    false
                                ];
                            case 3:
                                return [
                                    2
                                ];
                        }
                    });
                }).call(this);
            }
        }
    ]);
    return LeadApiLogMongoDBService;
}();
export default LeadApiLogMongoDBService;

//# sourceMappingURL=leadApiLogMongo.service.js.map