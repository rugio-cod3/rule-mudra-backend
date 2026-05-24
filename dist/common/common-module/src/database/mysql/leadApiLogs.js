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
import { ApiSupplierType, LeadLogApiType } from '../../enums/leadApiLogs.enum';
import { logger } from '../../utils/logger';
import { getKnexInstance } from '../../utils/mysql';
var LeadApiLogModel = /*#__PURE__*/ function() {
    "use strict";
    function LeadApiLogModel() {
        _class_call_check(this, LeadApiLogModel);
        _define_property(this, "table", 'leads_api_log');
    }
    _create_class(LeadApiLogModel, [
        {
            key: "LeadsApiLogKnex",
            get: function get() {
                var db = getKnexInstance();
                return db(this.table);
            }
        },
        {
            key: "findOneLeadsApiLog",
            value: function findOneLeadsApiLog(_0, _1) {
                return _async_to_generator(function(where) {
                    var select, orderBy, _db_where, db, query;
                    var _arguments = arguments;
                    return _ts_generator(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                select = _arguments.length > 1 && _arguments[1] !== void 0 ? _arguments[1] : [
                                    '*'
                                ], orderBy = _arguments.length > 2 ? _arguments[2] : void 0;
                                db = getKnexInstance();
                                query = (_db_where = db(this.table).where(where)).select.apply(_db_where, _to_consumable_array(select));
                                if (orderBy) query.orderBy(orderBy);
                                return [
                                    4,
                                    query.first()
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
            key: "getLeadApiLogs",
            value: function getLeadApiLogs(where, order, select) {
                return _async_to_generator(function() {
                    var _db_where, db, lead_api_log, error;
                    return _ts_generator(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                _state.trys.push([
                                    0,
                                    2,
                                    ,
                                    3
                                ]);
                                db = getKnexInstance();
                                return [
                                    4,
                                    (_db_where = db(this.table).where(where)).select.apply(_db_where, _to_consumable_array(select)).orderBy(order.orderKey, order.orderValue)
                                ];
                            case 1:
                                lead_api_log = _state.sent();
                                if (lead_api_log == null || lead_api_log.length == 0) {
                                    return [
                                        2,
                                        []
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
                                logger.error('Error Inside lead_api_log.ts getLeadApiLogs function', error);
                                return [
                                    3,
                                    3
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
            key: "getLeadApiLog",
            value: function getLeadApiLog(where, order, select) {
                return _async_to_generator(function() {
                    var _db_where, db, lead_api_log, error;
                    return _ts_generator(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                _state.trys.push([
                                    0,
                                    2,
                                    ,
                                    3
                                ]);
                                db = getKnexInstance();
                                return [
                                    4,
                                    (_db_where = db(this.table).where(where)).select.apply(_db_where, _to_consumable_array(select)).orderBy(order.orderKey, order.orderValue).limit(1)
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
                                        lead_api_log[0] // Return the first lead if found
                                    ];
                                }
                                return [
                                    3,
                                    3
                                ];
                            case 2:
                                error = _state.sent();
                                logger.error('Error Inside lead_api_log.ts getLeadApiLog function', error);
                                return [
                                    3,
                                    3
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
            key: "findOneLeadApiLog",
            value: function findOneLeadApiLog(_0, _1) {
                return _async_to_generator(function(where) {
                    var select, order, _db_table_where, db, query;
                    var _arguments = arguments;
                    return _ts_generator(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                select = _arguments.length > 1 && _arguments[1] !== void 0 ? _arguments[1] : [
                                    '*'
                                ], order = _arguments.length > 2 ? _arguments[2] : void 0;
                                db = getKnexInstance();
                                query = (_db_table_where = db.table(this.table).where(where)).select.apply(_db_table_where, _to_consumable_array(select));
                                if (order) {
                                    query.orderBy(order);
                                }
                                return [
                                    4,
                                    query.first()
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
            key: "insert",
            value: function insert(data) {
                return _async_to_generator(function() {
                    var db;
                    return _ts_generator(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                db = getKnexInstance();
                                return [
                                    4,
                                    db(this.table).insert(data)
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
            key: "findOneAndUpdate",
            value: function findOneAndUpdate(where, update) {
                return _async_to_generator(function() {
                    var db;
                    return _ts_generator(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                db = getKnexInstance();
                                return [
                                    4,
                                    db(this.table).where(where).update(update)
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
            key: "findBreCheck",
            value: function findBreCheck(pancard) {
                return _async_to_generator(function() {
                    var db;
                    return _ts_generator(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                db = getKnexInstance();
                                return [
                                    4,
                                    db.table(this.table).where('pancard', pancard).andWhere(function() {
                                        this.where({
                                            api_supplier: 6,
                                            status: 1,
                                            api_type: 'bureau_sagorate'
                                        }).orWhere({
                                            api_supplier: 3,
                                            status: 1,
                                            api_type: 'consumer-cir-cv'
                                        }).orWhere({
                                            api_supplier: 4,
                                            status: 1,
                                            api_type: 'pan-comprehensive'
                                        });
                                    }).orderBy('id', 'desc').select('created_at').first()
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
            key: "delete",
            value: function _delete(deleteWhere) {
                return _async_to_generator(function() {
                    var db, query;
                    return _ts_generator(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                db = getKnexInstance();
                                query = db(this.table);
                                deleteWhere.forEach(function(element) {
                                    var column = element.column, operator = element.operator, value = element.value;
                                    if (operator) query.where(column, operator, value);
                                    else query.where(column, value);
                                });
                                return [
                                    4,
                                    query.delete()
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
            key: "count",
            value: function count(params) {
                return _async_to_generator(function() {
                    var where, whereNot, db, count, data;
                    return _ts_generator(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                where = params.where, whereNot = params.whereNot;
                                db = getKnexInstance();
                                count = db(this.table);
                                if (where) count.where(where);
                                if (whereNot) count.whereNot(whereNot);
                                return [
                                    4,
                                    count.count()
                                ];
                            case 1:
                                data = _state.sent();
                                return [
                                    2,
                                    data[0]['count(*)']
                                ];
                        }
                    });
                }).call(this);
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
                                    this.findOneLeadsApiLog({
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
            key: "getUserAadharDetails",
            value: function getUserAadharDetails(aadharNo, mobileNo, isSurePass) {
                return _async_to_generator(function() {
                    var _tmp, _tmp1, _tmp2;
                    return _ts_generator(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                if (!isSurePass) return [
                                    3,
                                    2
                                ];
                                _tmp1 = {
                                    type: ApiSupplierType.SUREPASS
                                };
                                return [
                                    4,
                                    this.findAadharV2VerifyResponse(aadharNo, mobileNo)
                                ];
                            case 1:
                                _tmp = (_tmp1.data = _state.sent(), _tmp1);
                                return [
                                    3,
                                    4
                                ];
                            case 2:
                                _tmp2 = {
                                    type: ApiSupplierType.DECENTRO
                                };
                                return [
                                    4,
                                    this.findDigilockerEaadharResponse(aadharNo, mobileNo)
                                ];
                            case 3:
                                _tmp = (_tmp2.data = _state.sent(), _tmp2);
                                _state.label = 4;
                            case 4:
                                return [
                                    2,
                                    _tmp
                                ];
                        }
                    });
                }).call(this);
            }
        },
        {
            key: "findAadharV2VerifyResponse",
            value: function findAadharV2VerifyResponse(aadharNo, mobileNo) {
                return _async_to_generator(function() {
                    var data;
                    return _ts_generator(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                return [
                                    4,
                                    this.findOneLeadsApiLog({
                                        status: 1,
                                        api_type: LeadLogApiType.AADHAR_V2_SUBMIT_OTP,
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
            key: "findDigilockerEaadharResponse",
            value: function findDigilockerEaadharResponse(aadharNo, mobileNo) {
                return _async_to_generator(function() {
                    var data;
                    return _ts_generator(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                return [
                                    4,
                                    this.findOneLeadsApiLog({
                                        status: 1,
                                        api_type: LeadLogApiType.DIGILOCKER_EAADHAR,
                                        api_supplier: ApiSupplierType.DECENTRO,
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
            key: "findCkycDownloadResponse",
            value: function findCkycDownloadResponse(pancard) {
                return _async_to_generator(function() {
                    var data;
                    return _ts_generator(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                return [
                                    4,
                                    this.findOneLeadsApiLog({
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
    return LeadApiLogModel;
}();
export { LeadApiLogModel as default };
export var leadsApiLogModel = new LeadApiLogModel();

//# sourceMappingURL=leadApiLogs.js.map