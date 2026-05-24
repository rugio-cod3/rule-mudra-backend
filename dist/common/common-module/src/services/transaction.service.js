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
import { HttpStatusCode } from 'axios';
import momentTz from 'moment-timezone';
import { approvalModel } from '../database/mysql/approval';
import { leadModel } from '../database/mysql/leads';
import { loanModel } from '../database/mysql/loan';
import { transactionModel } from '../database/mysql/transactions';
import { CollectedMode } from '../enums/collection.enum';
import { TransactionGateway, TransactionGatewayKey } from '../enums/transaction.enum';
import { logger } from '../utils/logger';
import ResponseService from './response.service';
export var TransactionService = /*#__PURE__*/ function(ResponseService) {
    "use strict";
    _inherits(TransactionService, ResponseService);
    function TransactionService() {
        _class_call_check(this, TransactionService);
        var _this;
        var _this1;
        _this = _call_super(this, TransactionService), _this1 = _this, _define_property(_this, "loanModel", loanModel), _define_property(_this, "approvalModel", approvalModel), _define_property(_this, "transactionModel", transactionModel), _define_property(_this, "leadModel", leadModel), _define_property(_this, "manageTransactions", function(payload) {
            return _async_to_generator(function() {
                var leadID, _payload_type, type, _payload_status, status, _payload_gateway, gateway, _payload_collectionID, collectionID, _payload_emiID, emiID, _payload_transactionDate, transactionDate, _payload_remarks, remarks, _payload_orderId, orderId, _payload_mode, mode, _payload_createdBy, createdBy, _payload_updatedBy, updatedBy, _payload_amount, amount, lead, customerID, _ref, loan, approval, loanNo, disbursalRefrenceNo, disbursedBy, disbursalAmount, deduction, referenceNo, transactionGateway, transactionStatus, saveData, amount1, _ref1, _ref_, disbursalTransactionId, _ref_1, pfTransactionId, _ref_2, gstTransactionId, _ref2, transactionID;
                return _ts_generator(this, function(_state) {
                    switch(_state.label){
                        case 0:
                            leadID = payload.leadID, _payload_type = payload.type, type = _payload_type === void 0 ? null : _payload_type, _payload_status = payload.status, status = _payload_status === void 0 ? null : _payload_status, _payload_gateway = payload.gateway, gateway = _payload_gateway === void 0 ? null : _payload_gateway, _payload_collectionID = payload.collectionID, collectionID = _payload_collectionID === void 0 ? null : _payload_collectionID, _payload_emiID = payload.emiID, emiID = _payload_emiID === void 0 ? null : _payload_emiID, _payload_transactionDate = payload.transactionDate, transactionDate = _payload_transactionDate === void 0 ? null : _payload_transactionDate, _payload_remarks = payload.remarks, remarks = _payload_remarks === void 0 ? null : _payload_remarks, _payload_orderId = payload.orderId, orderId = _payload_orderId === void 0 ? null : _payload_orderId, _payload_mode = payload.mode, mode = _payload_mode === void 0 ? null : _payload_mode, _payload_createdBy = payload.createdBy, createdBy = _payload_createdBy === void 0 ? null : _payload_createdBy, _payload_updatedBy = payload.updatedBy, updatedBy = _payload_updatedBy === void 0 ? null : _payload_updatedBy, _payload_amount = payload.amount, amount = _payload_amount === void 0 ? null : _payload_amount;
                            return [
                                4,
                                _this1.leadModel.findOne({
                                    where: {
                                        leadID: leadID
                                    },
                                    select: [
                                        'customerID'
                                    ]
                                })
                            ];
                        case 1:
                            lead = _state.sent();
                            if (!lead) return [
                                2,
                                _this1.serviceResponse(HttpStatusCode.NotFound, {}, 'Lead not found')
                            ];
                            customerID = lead.customerID;
                            return [
                                4,
                                Promise.all([
                                    _this1.loanModel.findOneLoan({
                                        leadID: leadID,
                                        customerID: customerID
                                    }, [
                                        'loanNo',
                                        'disbursalRefrenceNo',
                                        'disbursedBy',
                                        'disbursalAmount',
                                        'deduction'
                                    ]),
                                    _this1.approvalModel.findOneApproval({
                                        leadID: leadID,
                                        customerID: customerID
                                    }, [
                                        'adminFee',
                                        'GstOfAdminFee'
                                    ])
                                ])
                            ];
                        case 2:
                            _ref = _sliced_to_array.apply(void 0, [
                                _state.sent(),
                                2
                            ]), loan = _ref[0], approval = _ref[1];
                            if (!loan || !approval) return [
                                2,
                                _this1.serviceResponse(HttpStatusCode.NotFound, {}, 'Loan/Approval not found')
                            ];
                            loanNo = loan.loanNo, disbursalRefrenceNo = loan.disbursalRefrenceNo, disbursedBy = loan.disbursedBy, disbursalAmount = loan.disbursalAmount, deduction = loan.deduction;
                            referenceNo = disbursalRefrenceNo !== null && disbursalRefrenceNo !== void 0 ? disbursalRefrenceNo : '';
                            transactionGateway = gateway !== null && gateway !== void 0 ? gateway : TransactionGateway.RAZORPAY;
                            transactionStatus = transactionGateway === TransactionGateway.MANUAL ? TransactionGatewayKey.MANUAL : '1';
                            if (!(type === 'disbursal')) return [
                                3,
                                4
                            ];
                            saveData = {
                                customerID: customerID,
                                leadID: leadID,
                                loanNo: loanNo,
                                status: transactionStatus,
                                mode: CollectedMode.PAYOUT,
                                referenceNo: referenceNo,
                                orderId: referenceNo,
                                deleted: 0,
                                gateway: transactionGateway,
                                createdBy: disbursedBy,
                                updatedBy: disbursedBy,
                                collectionID: collectionID,
                                emiID: emiID,
                                transactionDate: transactionDate ? momentTz(transactionDate).format('YYYY-MM-DD HH:mm:ss') : momentTz().format('YYYY-MM-DD HH:mm:ss'),
                                remarks: remarks,
                                amount: 0,
                                type: type
                            };
                            amount1 = disbursalAmount - deduction;
                            delete saveData.amount;
                            delete saveData.type;
                            return [
                                4,
                                Promise.all([
                                    // Insert disbursal transaction
                                    _this1.transactionModel.create(_object_spread_props(_object_spread({}, saveData), {
                                        type: type,
                                        amount: amount1
                                    })),
                                    // Insert pf transaction
                                    _this1.transactionModel.create(_object_spread_props(_object_spread({}, saveData), {
                                        type: 'pf',
                                        amount: approval.adminFee
                                    })),
                                    // Insert gst transaction
                                    _this1.transactionModel.create(_object_spread_props(_object_spread({}, saveData), {
                                        type: 'gst',
                                        amount: approval.GstOfAdminFee
                                    }))
                                ])
                            ];
                        case 3:
                            _ref1 = _sliced_to_array.apply(void 0, [
                                _state.sent(),
                                3
                            ]), _ref_ = _sliced_to_array(_ref1[0], 1), disbursalTransactionId = _ref_[0], _ref_1 = _sliced_to_array(_ref1[1], 1), pfTransactionId = _ref_1[0], _ref_2 = _sliced_to_array(_ref1[2], 1), gstTransactionId = _ref_2[0];
                            return [
                                2,
                                _this1.serviceResponse(HttpStatusCode.Ok, {
                                    disbursalTransactionId: disbursalTransactionId,
                                    pfTransactionId: pfTransactionId,
                                    gstTransactionId: gstTransactionId,
                                    type: type
                                }, 'Success')
                            ];
                        case 4:
                            return [
                                4,
                                _this1.transactionModel.create({
                                    customerID: customerID,
                                    leadID: leadID,
                                    loanNo: loanNo,
                                    status: status,
                                    type: type,
                                    mode: mode,
                                    referenceNo: referenceNo,
                                    orderId: orderId,
                                    deleted: 0,
                                    gateway: gateway,
                                    createdBy: createdBy,
                                    updatedBy: updatedBy,
                                    amount: amount,
                                    collectionID: collectionID,
                                    emiID: emiID,
                                    transactionDate: transactionDate,
                                    remarks: remarks
                                })
                            ];
                        case 5:
                            _ref2 = _sliced_to_array.apply(void 0, [
                                _state.sent(),
                                1
                            ]), transactionID = _ref2[0];
                            return [
                                2,
                                _this1.serviceResponse(HttpStatusCode.Ok, {
                                    transactionID: transactionID,
                                    type: type
                                }, 'Success')
                            ];
                    }
                });
            })();
        });
        return _this;
    }
    _create_class(TransactionService, [
        {
            key: "findOne",
            value: function findOne(where, order, select) {
                return _async_to_generator(function() {
                    var transactions, error;
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
                                    this.transactionModel.getTransactions(where, order, select)
                                ];
                            case 1:
                                transactions = _state.sent();
                                if (transactions == null || transactions.length == 0) {
                                    return [
                                        2,
                                        null
                                    ];
                                } else {
                                    return [
                                        2,
                                        transactions[0] // Return the first lead if found
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
            key: "find",
            value: function find(where, order, select) {
                return _async_to_generator(function() {
                    var transactions, error;
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
                                    this.transactionModel.getTransactions(where, order, select)
                                ];
                            case 1:
                                transactions = _state.sent();
                                if (transactions == null || transactions.length == 0) {
                                    return [
                                        2,
                                        null
                                    ];
                                } else {
                                    return [
                                        2,
                                        transactions // Return the first lead if found
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
            key: "countRows",
            value: function countRows(where) {
                return _async_to_generator(function() {
                    var transactions, error;
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
                                    this.transactionModel.countTransactions(where)
                                ];
                            case 1:
                                transactions = _state.sent();
                                if (transactions == null) {
                                    return [
                                        2,
                                        0
                                    ];
                                } else {
                                    return [
                                        2,
                                        transactions // Return the first lead if found
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
            value: function create(customerID, leadID, loanNo, status, type, mode, referenceNo, orderId, deleted, gateway, createdAt, updatedAt, createdBy, updatedBy, amount) {
                return _async_to_generator(function() {
                    var insertId;
                    return _ts_generator(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                return [
                                    4,
                                    this.transactionModel.insert(customerID, leadID, loanNo, status, type, mode, referenceNo, orderId, deleted, gateway, createdAt, updatedAt, createdBy, updatedBy, amount)
                                ];
                            case 1:
                                insertId = _state.sent();
                                return [
                                    2,
                                    insertId
                                ];
                        }
                    });
                }).call(this);
            }
        },
        {
            key: "createV2",
            value: function createV2(customerID, leadID, loanNo, status, type, mode, referenceNo, orderId, deleted, gateway, createdBy, updatedBy, amount) {
                var emiID = arguments.length > 13 && arguments[13] !== void 0 ? arguments[13] : null, transactionDate = arguments.length > 14 ? arguments[14] : void 0, remarks = arguments.length > 15 ? arguments[15] : void 0, payment_transaction_status = arguments.length > 16 ? arguments[16] : void 0, waiver = arguments.length > 17 ? arguments[17] : void 0, discount_type = arguments.length > 18 ? arguments[18] : void 0;
                return _async_to_generator(function() {
                    var insertId;
                    return _ts_generator(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                return [
                                    4,
                                    this.transactionModel.insertV2(customerID, leadID, loanNo, status, type, mode, referenceNo, orderId, deleted, gateway, createdBy, updatedBy, amount, emiID, transactionDate, remarks, payment_transaction_status, waiver, discount_type)
                                ];
                            case 1:
                                insertId = _state.sent();
                                return [
                                    2,
                                    insertId
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
                    var error;
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
                                    this.transactionModel.findOneAndUpdate(where, update)
                                ];
                            case 1:
                                _state.sent();
                                return [
                                    2,
                                    true
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
            key: "updateMany",
            value: function updateMany(where, update) {
                return _async_to_generator(function() {
                    var result, error;
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
                                    this.transactionModel.findAndUpdate(where, update)
                                ];
                            case 1:
                                result = _state.sent();
                                return [
                                    2,
                                    result
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
            key: "findTransaction",
            value: function findTransaction(where, order, select, types) {
                return _async_to_generator(function() {
                    var whereClause, transactions, error;
                    return _ts_generator(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                _state.trys.push([
                                    0,
                                    2,
                                    ,
                                    3
                                ]);
                                whereClause = _object_spread({
                                    customerID: where.customerID,
                                    status: where.status
                                }, types && types.length > 0 && {
                                    type: {
                                        $in: types
                                    }
                                });
                                return [
                                    4,
                                    this.transactionModel.getUserTransactions(whereClause, order, select)
                                ];
                            case 1:
                                transactions = _state.sent();
                                if (transactions == null || transactions.length == 0) {
                                    return [
                                        2,
                                        null
                                    ];
                                } else {
                                    return [
                                        2,
                                        transactions // Return the transactions if found
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
            key: "findTransection",
            value: function findTransection(where, order, select, types) {
                return _async_to_generator(function() {
                    var whereClause, transactions, error;
                    return _ts_generator(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                _state.trys.push([
                                    0,
                                    2,
                                    ,
                                    3
                                ]);
                                whereClause = _object_spread({
                                    customerID: where.customerID
                                }, types && types.length > 0 && {
                                    type: {
                                        $in: types
                                    }
                                });
                                return [
                                    4,
                                    this.transactionModel.getUserTransactions2(whereClause, order, select)
                                ];
                            case 1:
                                transactions = _state.sent();
                                if (transactions == null || transactions.length == 0) {
                                    return [
                                        2,
                                        null
                                    ];
                                } else {
                                    return [
                                        2,
                                        transactions // Return the transactions if found
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
        }
    ]);
    return TransactionService;
}(ResponseService);
export default TransactionService;
export var transactionService = new TransactionService();

//# sourceMappingURL=transaction.service.js.map