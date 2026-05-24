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
// import { IWhereData } from '@/interfaces/customerDnd.interface'
import { logger } from '@/utils/logger';
import { HttpStatusCode } from 'axios';
import crypto from 'crypto';
import moment from 'moment-timezone';
import path from 'path';
import { apiReqResLogsModel } from '../database/mysql/apiReqResLog';
import { customerModel } from '../database/mysql/customer';
import { customerDndModel } from '../database/mysql/customerDnd';
import { leadModel } from '../database/mysql/leads';
import { loanModel } from '../database/mysql/loan';
import OldCrmUsersCheckModel from '../database/mysql/OldCrmUsersCheck';
import { sourcePartnerModel } from '../database/mysql/sourcePartners';
import { BadRequestError, NotFoundError, PreconditionError, UnprocessableEntity } from '../errors';
import CommonHelper from '../helpers/common';
import ResponseService from '../services/response.service';
import { getKnexInstance } from '../utils/mysql';
import { calculateTotalPages } from '../utils/util';
import AxiosService from './api.service';
import EmiCollectionService from './emiCollection.service';
import S3Service from './thirdParty/s3.service';
var CustomerService = /*#__PURE__*/ function(ResponseService) {
    "use strict";
    _inherits(CustomerService, ResponseService);
    function CustomerService() {
        _class_call_check(this, CustomerService);
        var _this;
        var _this1;
        _this = _call_super(this, CustomerService), _this1 = _this, _define_property(_this, "customerModel", customerModel), _define_property(_this, "apiReqResLogsModel", apiReqResLogsModel), _define_property(_this, "customerDndModel", customerDndModel), _define_property(_this, "leadModel", leadModel), _define_property(_this, "loanModel", loanModel), _define_property(_this, "sourcePartnerModel", sourcePartnerModel), _define_property(_this, "s3Service", new S3Service()), _define_property(_this, "emiCollectionService", new EmiCollectionService()), _define_property(_this, "commonHelper", new CommonHelper()), _define_property(_this, "oldCrmUsersCheckModel", new OldCrmUsersCheckModel()), _define_property(_this, "getApiLogs", function(customerID, paginate) {
            return _async_to_generator(function() {
                var customer, _ref, apiLogs, apiLogCount, totalPages;
                return _ts_generator(this, function(_state) {
                    switch(_state.label){
                        case 0:
                            return [
                                4,
                                _this1.customerModel.findOneCustomer({
                                    customerID: customerID
                                }, [
                                    'customerID',
                                    'mobile'
                                ])
                            ];
                        case 1:
                            customer = _state.sent();
                            if (!customer) throw new NotFoundError('Customer not found');
                            return [
                                4,
                                Promise.all([
                                    _this1.apiReqResLogsModel.find({
                                        where: {
                                            mobile: String(customer.mobile)
                                        },
                                        select: [
                                            'api_name',
                                            'created_at',
                                            'status',
                                            'id'
                                        ],
                                        paginate: {
                                            page: paginate.skip,
                                            perPage: paginate.take
                                        },
                                        order: [
                                            {
                                                column: 'id',
                                                order: 'desc'
                                            }
                                        ]
                                    }),
                                    _this1.apiReqResLogsModel.count({
                                        mobile: String(customer.mobile)
                                    })
                                ])
                            ];
                        case 2:
                            _ref = _sliced_to_array.apply(void 0, [
                                _state.sent(),
                                2
                            ]), apiLogs = _ref[0], apiLogCount = _ref[1];
                            totalPages = calculateTotalPages(apiLogCount, paginate.take);
                            return [
                                2,
                                _this1.serviceResponse(HttpStatusCode.Ok, {
                                    apiLogs: apiLogs,
                                    totalRecords: apiLogCount,
                                    totalPages: totalPages
                                }, 'Fetched')
                            ];
                    }
                });
            })();
        }), _define_property(_this, "getApiLog", function(customerID, id, selectFields) {
            return _async_to_generator(function() {
                var customer, select, apiLog;
                return _ts_generator(this, function(_state) {
                    switch(_state.label){
                        case 0:
                            return [
                                4,
                                _this1.customerModel.findOneCustomer({
                                    customerID: customerID
                                }, [
                                    'customerID'
                                ])
                            ];
                        case 1:
                            customer = _state.sent();
                            if (!customer) throw new NotFoundError('Customer not found');
                            select = [];
                            if (selectFields && selectFields.request) {
                                select.push('api_request');
                            }
                            if (selectFields && selectFields.response) {
                                select.push('api_response');
                            }
                            if (Object.keys(selectFields).length === 0) {
                                select = [
                                    '*'
                                ];
                            }
                            return [
                                4,
                                _this1.apiReqResLogsModel.findOne({
                                    where: {
                                        customerID: String(customerID),
                                        id: id
                                    },
                                    select: select
                                })
                            ];
                        case 2:
                            apiLog = _state.sent();
                            if (!apiLog) throw new NotFoundError('Log not found');
                            if (apiLog.api_request) {
                                apiLog.api_request = JSON.parse(apiLog.api_request);
                            }
                            if (apiLog.api_response) {
                                apiLog.api_response = JSON.parse(apiLog.api_response);
                            }
                            return [
                                2,
                                _this1.serviceResponse(HttpStatusCode.Ok, {
                                    apiLog: apiLog
                                }, 'Fetched')
                            ];
                    }
                });
            })();
        }), // public updateEMIManualPayment = async (
        //   transaction: ITransaction,
        //   credit: any,
        //   loan: ILoan,
        //   lead: ILead,
        //   settle: boolean,
        //   emis: IEmiReCalculationResponse[],
        //   resultEmis: { [key in string]: IEmiReCalculationResponse },
        //   // repaymentData: any,
        // ): Promise<{ [key in string]: IEmiReCalculationResponse }> => {
        //   try {
        //     const baseUrl = this.commonHelper.getCrossPlatformBaseUrl()
        //     const apiCall = new AxiosService(baseUrl)
        //     const body = {
        //       pancard: pancard,
        //     }
        //     const url = config.checkCustomers
        //     const apiData = await apiCall.call<INewApiCheckCustomer, INewApiCheckCustomerBody, undefined>(
        //       'post',
        //       `/${url}`,
        //       body,
        //       undefined,
        //       {
        //         'Content-Type': 'application/json',
        //         Authorization: `Basic ${config.phpCrossPlatformKey}`,
        //       },
        //     )
        //     if (!apiData.data) {
        //       return apiData
        //     }
        //     const response = apiData.data
        //     if (!('checkLeadType' in response) || !('checkCurrentStatus' in response)) {
        //       return {
        //         leadstatus: '',
        //         action: 1,
        //       }
        //     }
        //     let action = 1
        //     response['newloanAmount'] = response['loanAmount']
        //     const returnData = {
        //       casetype: response['checkLeadType'],
        //       leadstatus: response['checkCurrentStatus'],
        //       action: action,
        //     }
        //     if (response['isRamfinCustomer'] == 'Yes') {
        //       const nonActionableStatuses = [
        //         'Approved',
        //         'Hold',
        //         'Disbursal Sheet Send',
        //         'Disbursed',
        //         'Part Payment',
        //         'Settlement',
        //         'Rejected',
        //         'Bank Update Rejected',
        //         'Approved Process',
        //         'Hold Process',
        //         'Blacklisted',
        //         'Disbursal Approved',
        //         'Bank Update Hold',
        //         'Document Received',
        //       ]
        //       if (nonActionableStatuses.includes(response['checkCurrentStatus'])) {
        //         action = 0
        //       }
        //     }
        //     await this.oldCrmUsersCheckModel.insert({
        //       endPoint_url: url,
        //       pancard: pancard,
        //       response: JSON.stringify(response),
        //       checks_response: JSON.stringify(returnData),
        //       createdDate: new Date(),
        //     })
        //     returnData['action'] = action
        //     return action
        //   } catch (error) {
        //     logger.error('Error in checkCustomerStatusPhpApi:', error)
        //     console.error('Error in checkCustomerStatusPhpApi:', error)
        //   }
        // }
        _define_property(_this, "updateEMIManualPayment", function(transaction, credit, // loan: ILoan,
        // lead: ILead,
        settle, emis, resultEmis) {
            return _async_to_generator(function() {
                var transactionDetails, excessAmount, _transaction_transactionDate, _transaction_transactionDate1, error;
                return _ts_generator(this, function(_state) {
                    switch(_state.label){
                        case 0:
                            _state.trys.push([
                                0,
                                5,
                                ,
                                6
                            ]);
                            if (!transaction) throw new BadRequestError('Transaction details are required');
                            // Payment details initialization
                            transactionDetails = {
                                amount: null,
                                transactionDate: null,
                                id: null,
                                order_id: null,
                                waiver: null,
                                discount_type: null
                            };
                            // Excess Amount
                            excessAmount = 0;
                            if (!(transaction.payment_transaction_status === 'collect_overdue_emi')) return [
                                3,
                                2
                            ];
                            //update transaction details for overdue EMI
                            transactionDetails = {
                                amount: Number(transaction.amount) || 0,
                                transactionDate: (_transaction_transactionDate = transaction.transactionDate) !== null && _transaction_transactionDate !== void 0 ? _transaction_transactionDate : moment().startOf('day'),
                                id: transaction.id,
                                order_id: transaction.orderId,
                                waiver: transaction.waiver || 0,
                                discount_type: transaction.discount_type || null
                            };
                            // Process manual payment for overdue EMI
                            return [
                                4,
                                _this1.emiCollectionService.processManualPayment(transactionDetails, excessAmount, credit, emis, resultEmis)
                            ];
                        case 1:
                            _state.sent();
                            return [
                                3,
                                4
                            ];
                        case 2:
                            if (!(transaction.payment_transaction_status === 'collect_final_settlement')) return [
                                3,
                                4
                            ];
                            transactionDetails = {
                                amount: Number(transaction.amount) || 0,
                                transactionDate: (_transaction_transactionDate1 = transaction.transactionDate) !== null && _transaction_transactionDate1 !== void 0 ? _transaction_transactionDate1 : moment().startOf('day'),
                                id: transaction.id,
                                order_id: transaction.orderId,
                                waiver: transaction.waiver || 0,
                                discount_type: transaction.discount_type || null
                            };
                            return [
                                4,
                                _this1.emiCollectionService.manageManualPayment(transactionDetails, resultEmis, credit, excessAmount, settle)
                            ];
                        case 3:
                            resultEmis = _state.sent();
                            _state.label = 4;
                        case 4:
                            // Return success response
                            return [
                                2,
                                resultEmis
                            ];
                        case 5:
                            error = _state.sent();
                            console.error('Error updating EMI manual payment:', error);
                            return [
                                3,
                                6
                            ];
                        case 6:
                            return [
                                2
                            ];
                    }
                });
            })();
        });
        return _this;
    }
    _create_class(CustomerService, [
        {
            key: "createDND",
            value: function createDND(payload) {
                return _async_to_generator(function() {
                    var name, mobile, pancard, reason, start_date, expiry_date, updated_by, customer, customerDnd;
                    return _ts_generator(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                name = payload.name, mobile = payload.mobile, pancard = payload.pancard, reason = payload.reason, start_date = payload.start_date, expiry_date = payload.expiry_date, updated_by = payload.updated_by;
                                return [
                                    4,
                                    this.customerModel.findOneCustomer({
                                        name: name.trim(),
                                        mobile: mobile,
                                        pancard: pancard
                                    }, [
                                        '*'
                                    ])
                                ];
                            case 1:
                                customer = _state.sent();
                                if (!customer) {
                                    throw new PreconditionError('Customer not found from this name ,mobile and pancard');
                                }
                                return [
                                    4,
                                    this.customerDndModel.insert({
                                        customerID: customer.customerID,
                                        name: name.trim(),
                                        mobile: mobile,
                                        pancard: pancard,
                                        reason: reason.trim(),
                                        start_date: start_date,
                                        expiry_date: expiry_date,
                                        updated_by: updated_by
                                    })
                                ];
                            case 2:
                                customerDnd = _state.sent();
                                if (!customerDnd) {
                                    throw new UnprocessableEntity('Customer DND created failed');
                                }
                                return [
                                    2,
                                    this.serviceResponse(200, {
                                        customerDnd: customerDnd
                                    }, 'Customer DND created successfully.')
                                ];
                        }
                    });
                }).call(this);
            }
        },
        {
            key: "getDND",
            value: function getDND(payload, skip, take) {
                return _async_to_generator(function() {
                    var name, mobile, reason, start_date, expiry_date, is_deleted, isExcelDownload, customer, whereData, dateRange, todayDate, db, query, customerDnds, totalCountQuery, dndData, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, _step_value, index, item, customerName, dndRes, err, dndRecords;
                    return _ts_generator(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                name = payload.name, mobile = payload.mobile, reason = payload.reason, start_date = payload.start_date, expiry_date = payload.expiry_date, is_deleted = payload.is_deleted, isExcelDownload = payload.isExcelDownload;
                                return [
                                    4,
                                    getKnexInstance().raw("SET sql_mode = (SELECT REPLACE(@@sql_mode, 'ONLY_FULL_GROUP_BY', ''))")
                                ];
                            case 1:
                                _state.sent();
                                if (!mobile) return [
                                    3,
                                    3
                                ];
                                return [
                                    4,
                                    this.customerModel.findOneCustomer({
                                        mobile: mobile
                                    }, [
                                        'customerID'
                                    ])
                                ];
                            case 2:
                                customer = _state.sent();
                                if (!customer) {
                                    throw new NotFoundError('Customer not found from this mobile.');
                                }
                                _state.label = 3;
                            case 3:
                                whereData = {};
                                if (name != null && name.trim() !== '') whereData.name = name.trim();
                                if (mobile != null && mobile !== undefined) whereData.mobile = mobile;
                                if (reason != null && reason !== undefined) whereData.reason = reason.trim();
                                if (is_deleted != null && is_deleted !== undefined) whereData.is_deleted = is_deleted;
                                dateRange = {};
                                if (start_date != null) dateRange.start_date = start_date;
                                if (expiry_date != null) dateRange.expiry_date = expiry_date;
                                todayDate = new Date().toISOString().split('T')[0];
                                db = getKnexInstance();
                                query = db('customer_dnd').select('customer_dnd.*', db.raw('updatedByCustomer.name AS updatedName'), db.raw('removedByCustomer.name AS removedName')).leftJoin('users AS updatedByCustomer', 'customer_dnd.updated_by', 'updatedByCustomer.userID').leftJoin('users AS removedByCustomer', 'customer_dnd.removed_by', 'removedByCustomer.userID').orderBy('id', 'desc');
                                if (dateRange.start_date) {
                                    query.where('customer_dnd.start_date', '>=', dateRange.start_date);
                                }
                                if (dateRange.expiry_date) {
                                    query.where('customer_dnd.expiry_date', '<=', dateRange.expiry_date);
                                }
                                if (name) {
                                    query.where('customer_dnd.name', name);
                                }
                                if (mobile) {
                                    query.where('customer_dnd.mobile', mobile);
                                }
                                if (reason) {
                                    query.where('customer_dnd.reason', reason);
                                }
                                if (is_deleted) {
                                    query.where('customer_dnd.expiry_date', '>=', todayDate);
                                    query.where('customer_dnd.is_deleted', is_deleted);
                                }
                                return [
                                    4,
                                    query.clone().count('* as totalCount').first()
                                ];
                            case 4:
                                totalCountQuery = _state.sent();
                                if (!(isExcelDownload === 'true')) return [
                                    3,
                                    6
                                ];
                                return [
                                    4,
                                    query.clone()
                                ];
                            case 5:
                                customerDnds = _state.sent();
                                return [
                                    3,
                                    8
                                ];
                            case 6:
                                return [
                                    4,
                                    query.clone().limit(take).offset(skip)
                                ];
                            case 7:
                                customerDnds = _state.sent();
                                _state.label = 8;
                            case 8:
                                dndData = [];
                                if (!(customerDnds && (customerDnds === null || customerDnds === void 0 ? void 0 : customerDnds.length) > 0)) return [
                                    3,
                                    16
                                ];
                                _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
                                _state.label = 9;
                            case 9:
                                _state.trys.push([
                                    9,
                                    14,
                                    15,
                                    16
                                ]);
                                _iterator = customerDnds.entries()[Symbol.iterator]();
                                _state.label = 10;
                            case 10:
                                if (!!(_iteratorNormalCompletion = (_step = _iterator.next()).done)) return [
                                    3,
                                    13
                                ];
                                _step_value = _sliced_to_array(_step.value, 2), index = _step_value[0], item = _step_value[1];
                                return [
                                    4,
                                    this.customerModel.findOneCustomer({
                                        customerID: item.customerID
                                    }, [
                                        'name'
                                    ])
                                ];
                            case 11:
                                customerName = _state.sent();
                                dndRes = {
                                    id: item.id,
                                    customerID: item.customerID,
                                    name: customerName && customerName.name ? customerName.name : '',
                                    mobile: item.mobile,
                                    pancard: item.pancard,
                                    reason: item.reason,
                                    startDate: moment(item.start_date).format('Do MMM, YYYY'),
                                    expiryDate: moment(item.expiry_date).format('Do MMM, YYYY'),
                                    startDateDefaut: moment(item.start_date).format('YYYY-MM-DD'),
                                    expiryDateDefaut: moment(item.expiry_date).format('YYYY-MM-DD'),
                                    updatedBy: item.updated_by,
                                    updatedName: item.updatedName,
                                    isDeleted: item.is_deleted,
                                    removedBy: item.removed_by,
                                    removedName: item.removedName
                                };
                                dndData.push(dndRes);
                                _state.label = 12;
                            case 12:
                                _iteratorNormalCompletion = true;
                                return [
                                    3,
                                    10
                                ];
                            case 13:
                                return [
                                    3,
                                    16
                                ];
                            case 14:
                                err = _state.sent();
                                _didIteratorError = true;
                                _iteratorError = err;
                                return [
                                    3,
                                    16
                                ];
                            case 15:
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
                            case 16:
                                dndRecords = {
                                    dndData: dndData,
                                    totalCount: totalCountQuery.totalCount,
                                    totalPages: Math.ceil(totalCountQuery.totalCount / take)
                                };
                                return [
                                    2,
                                    this.serviceResponse(200, dndRecords, 'Customer DND data retreived successfully.')
                                ];
                        }
                    });
                }).call(this);
            }
        },
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
                                    this.customerModel.findOneCustomer(where, select, order)
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
            key: "deleteDND",
            value: function deleteDND(payload) {
                return _async_to_generator(function() {
                    var customerID, removed_by, customerDnd, customerDndDelete;
                    return _ts_generator(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                customerID = payload.customerID, removed_by = payload.removed_by;
                                return [
                                    4,
                                    this.customerDndModel.findOne({
                                        customerID: customerID
                                    }, [
                                        'id',
                                        'name'
                                    ])
                                ];
                            case 1:
                                customerDnd = _state.sent();
                                if (!customerDnd) {
                                    throw new PreconditionError('This DND Customer not found.');
                                }
                                return [
                                    4,
                                    this.customerDndModel.findOneAndUpdate({
                                        customerID: customerID
                                    }, {
                                        is_deleted: '1',
                                        removed_by: removed_by
                                    })
                                ];
                            case 2:
                                customerDndDelete = _state.sent();
                                if (!customerDndDelete) {
                                    throw new UnprocessableEntity('Customer DND deleted failed');
                                }
                                return [
                                    2,
                                    this.serviceResponse(200, {
                                        customerDnd: customerDnd
                                    }, 'Customer DND deleted successfully.')
                                ];
                        }
                    });
                }).call(this);
            }
        },
        {
            key: "search",
            value: function search(payload) {
                return _async_to_generator(function() {
                    var aadharNo, customerID, email, leadID, loanNo, mobile, name, pan, data, whereQuery, customerQuery;
                    return _ts_generator(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                aadharNo = payload.aadharNo, customerID = payload.customerID, email = payload.email, leadID = payload.leadID, loanNo = payload.loanNo, mobile = payload.mobile, name = payload.name, pan = payload.pan;
                                data = {};
                                whereQuery = {};
                                return [
                                    4,
                                    getKnexInstance().raw("SET sql_mode = (SELECT REPLACE(@@sql_mode, 'ONLY_FULL_GROUP_BY', ''))")
                                ];
                            case 1:
                                _state.sent();
                                customerQuery = this.customerModel.CustomerKnex.select('customer.mobile', 'customer.name', 'l.leadID').join('leads as l', 'customer.customerID', 'l.customerID').max('l.leadID as leadID').groupBy('customer.mobile', 'customer.name').orderBy('l.leadID', 'desc').limit(10);
                                if (!customerID) return [
                                    3,
                                    2
                                ];
                                customerQuery.where('customer.customerID', customerID);
                                return [
                                    3,
                                    11
                                ];
                            case 2:
                                if (!email) return [
                                    3,
                                    3
                                ];
                                whereQuery.email = email;
                                return [
                                    3,
                                    11
                                ];
                            case 3:
                                if (!aadharNo) return [
                                    3,
                                    4
                                ];
                                whereQuery.aadharNo = aadharNo;
                                return [
                                    3,
                                    11
                                ];
                            case 4:
                                if (!mobile) return [
                                    3,
                                    5
                                ];
                                whereQuery.mobile = mobile;
                                return [
                                    3,
                                    11
                                ];
                            case 5:
                                if (!name) return [
                                    3,
                                    6
                                ];
                                whereQuery.name = name;
                                return [
                                    3,
                                    11
                                ];
                            case 6:
                                if (!pan) return [
                                    3,
                                    7
                                ];
                                whereQuery.pancard = pan;
                                return [
                                    3,
                                    11
                                ];
                            case 7:
                                if (!leadID) return [
                                    3,
                                    9
                                ];
                                return [
                                    4,
                                    this.leadModel.LeadsKnex.select('c.mobile', 'c.name', 'leads.leadID').join('customer as c', 'c.customerID', 'leads.customerID').where({
                                        leadID: leadID
                                    }).orderBy('leads.leadID', 'desc').limit(10)
                                ];
                            case 8:
                                data = _state.sent();
                                return [
                                    3,
                                    11
                                ];
                            case 9:
                                if (!loanNo) return [
                                    3,
                                    11
                                ];
                                return [
                                    4,
                                    this.loanModel.LoanKnex.select('c.mobile', 'c.name', 'l.leadID').join('leads as l', 'loan.leadID', 'l.leadID').join('customer as c', 'l.customerID', 'c.customerID').where({
                                        loanNo: loanNo
                                    }).orderBy('l.leadID', 'desc').limit(10)
                                ];
                            case 10:
                                data = _state.sent();
                                _state.label = 11;
                            case 11:
                                if (!(!loanNo && !leadID)) return [
                                    3,
                                    15
                                ];
                                if (!(Object.keys(whereQuery).length > 0)) return [
                                    3,
                                    13
                                ];
                                return [
                                    4,
                                    customerQuery.where(whereQuery)
                                ];
                            case 12:
                                data = _state.sent();
                                return [
                                    3,
                                    15
                                ];
                            case 13:
                                return [
                                    4,
                                    customerQuery
                                ];
                            case 14:
                                data = _state.sent();
                                _state.label = 15;
                            case 15:
                                return [
                                    4,
                                    getKnexInstance().raw("SET sql_mode = CONCAT(@@sql_mode, ',ONLY_FULL_GROUP_BY')")
                                ];
                            case 16:
                                _state.sent();
                                return [
                                    2,
                                    this.serviceResponse(HttpStatusCode.Ok, data, 'Success')
                                ];
                        }
                    });
                }).call(this);
            }
        },
        {
            key: "getCustomerList",
            value: function getCustomerList(payload, page, perPage) {
                return _async_to_generator(function() {
                    var search_by, customer_search, whereQuery, _ref, customerData, totalCount, data;
                    return _ts_generator(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                search_by = payload.search_by, customer_search = payload.customer_search;
                                whereQuery = {};
                                if (search_by && customer_search) {
                                    switch(search_by){
                                        case 'name':
                                            whereQuery = function whereQuery(qb) {
                                                qb.whereRaw('name LIKE ?', [
                                                    "%".concat(customer_search, "%")
                                                ]);
                                            };
                                            break;
                                        case 'email':
                                            whereQuery = function whereQuery(qb) {
                                                qb.whereRaw('email LIKE ?', [
                                                    "%".concat(customer_search, "%")
                                                ]);
                                            };
                                            break;
                                        case 'mobile':
                                            whereQuery = {
                                                mobile: parseInt(customer_search)
                                            };
                                            break;
                                        case 'pancard':
                                            whereQuery = function whereQuery(qb) {
                                                qb.whereRaw('pancard LIKE ?', [
                                                    "%".concat(customer_search, "%")
                                                ]);
                                            };
                                            break;
                                        case 'aadharNo':
                                            whereQuery = {
                                                aadharNo: parseInt(customer_search)
                                            };
                                            break;
                                    }
                                }
                                return [
                                    4,
                                    Promise.all([
                                        this.customerModel.find({
                                            where: whereQuery,
                                            select: [
                                                'customerID',
                                                'name',
                                                'email',
                                                'mobile',
                                                'pancard',
                                                'aadharNo',
                                                'createdDate',
                                                'gender',
                                                'dob'
                                            ],
                                            paginate: {
                                                perPage: perPage,
                                                page: page
                                            }
                                        }),
                                        this.customerModel.count({
                                            where: whereQuery
                                        })
                                    ])
                                ];
                            case 1:
                                _ref = _sliced_to_array.apply(void 0, [
                                    _state.sent(),
                                    2
                                ]), customerData = _ref[0], totalCount = _ref[1];
                                data = {
                                    totalRows: totalCount,
                                    totalPages: calculateTotalPages(totalCount, perPage),
                                    table: customerData
                                };
                                return [
                                    2,
                                    this.serviceResponse(200, data, 'Fetch Customer Data Successfully...')
                                ];
                        }
                    });
                }).call(this);
            }
        },
        {
            key: "updateCustomerDetails",
            value: function updateCustomerDetails(payload) {
                return _async_to_generator(function() {
                    var customerID, firstName, mobile, email, gender, dob, aadharno, pancard, customer, customerUpdate;
                    return _ts_generator(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                customerID = payload.customerID, firstName = payload.firstName, mobile = payload.mobile, email = payload.email, gender = payload.gender, dob = payload.dob, aadharno = payload.aadharno, pancard = payload.pancard;
                                return [
                                    4,
                                    this.customerModel.findOneCustomer({
                                        customerID: customerID
                                    })
                                ];
                            case 1:
                                customer = _state.sent();
                                if (!customer) {
                                    throw new PreconditionError('Customer not found.');
                                }
                                return [
                                    4,
                                    this.customerModel.findOneAndUpdate({
                                        customerID: customerID
                                    }, {
                                        firstName: firstName,
                                        mobile: mobile,
                                        email: email,
                                        gender: gender,
                                        dob: dob,
                                        aadharNo: aadharno,
                                        pancard: pancard
                                    })
                                ];
                            case 2:
                                customerUpdate = _state.sent();
                                if (!customerUpdate) {
                                    throw new UnprocessableEntity('Customer Updation failed');
                                }
                                return [
                                    2,
                                    this.serviceResponse(HttpStatusCode.Ok, {}, 'Customer Updated Successfully...')
                                ];
                        }
                    });
                }).call(this);
            }
        },
        {
            key: "editDND",
            value: function editDND(payload) {
                return _async_to_generator(function() {
                    var id, expiry_date, updated_by, customerDnd;
                    return _ts_generator(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                id = payload.id, expiry_date = payload.expiry_date, updated_by = payload.updated_by;
                                return [
                                    4,
                                    this.customerDndModel.findOneAndUpdate({
                                        id: id
                                    }, {
                                        expiry_date: expiry_date,
                                        updated_by: updated_by
                                    })
                                ];
                            case 1:
                                customerDnd = _state.sent();
                                if (!customerDnd) {
                                    throw new UnprocessableEntity('Customer DND updated failed');
                                }
                                return [
                                    2,
                                    this.serviceResponse(200, {
                                        customerDnd: customerDnd
                                    }, 'Customer DND updated successfully.')
                                ];
                        }
                    });
                }).call(this);
            }
        },
        {
            key: "setSourcePartner",
            value: function setSourcePartner(payload) {
                return _async_to_generator(function() {
                    var image, name, link, userID, s3FolderName, extension, imageName, uploadRes, response;
                    return _ts_generator(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                image = payload.image, name = payload.name, link = payload.link, userID = payload.userID;
                                s3FolderName = "documents/sourcePartnerImages/".concat(userID);
                                extension = path.extname(image === null || image === void 0 ? void 0 : image.originalname).toLowerCase();
                                imageName = "image_".concat(Date.now()).concat(extension);
                                return [
                                    4,
                                    this.s3Service.uploadDocument(image.buffer, s3FolderName, imageName)
                                ];
                            case 1:
                                uploadRes = _state.sent();
                                if (!uploadRes) {
                                    return [
                                        2,
                                        this.serviceResponse(500, {}, 'An error occurred while storing the file in S3.')
                                    ];
                                }
                                response = {};
                                if (!(uploadRes && (uploadRes === null || uploadRes === void 0 ? void 0 : uploadRes.Key) !== null && uploadRes.Key !== '')) return [
                                    3,
                                    3
                                ];
                                return [
                                    4,
                                    this.sourcePartnerModel.insert({
                                        image: uploadRes.Key,
                                        name: name,
                                        link: link
                                    })
                                ];
                            case 2:
                                response = _state.sent();
                                return [
                                    3,
                                    4
                                ];
                            case 3:
                                return [
                                    2,
                                    this.serviceResponse(500, {}, 'An error occurred while storing the file in S3.')
                                ];
                            case 4:
                                return [
                                    2,
                                    this.serviceResponse(200, response, 'SourcePartner data inserted successfully.')
                                ];
                        }
                    });
                }).call(this);
            }
        },
        {
            key: "editSourcePartner",
            value: function editSourcePartner(payload) {
                return _async_to_generator(function() {
                    var id, image, name, link, status, userID, updateData, s3FolderName, extension, imageName, uploadRes, response;
                    return _ts_generator(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                id = payload.id, image = payload.image, name = payload.name, link = payload.link, status = payload.status, userID = payload.userID;
                                updateData = {};
                                if (!image) return [
                                    3,
                                    2
                                ];
                                s3FolderName = "documents/sourcePartnerImages/".concat(userID);
                                extension = path.extname(image.originalname).toLowerCase();
                                imageName = "image_".concat(Date.now()).concat(extension);
                                return [
                                    4,
                                    this.s3Service.uploadDocument(image.buffer, s3FolderName, imageName)
                                ];
                            case 1:
                                uploadRes = _state.sent();
                                if (!uploadRes) {
                                    return [
                                        2,
                                        this.serviceResponse(500, {}, 'An error occurred while storing the file in S3.')
                                    ];
                                }
                                if (uploadRes && uploadRes.Key) {
                                    updateData.image = uploadRes.Key;
                                }
                                _state.label = 2;
                            case 2:
                                if (name) updateData.name = name;
                                if (link) updateData.link = link;
                                if (status) updateData.status = status;
                                if (Object.keys(updateData).length === 0) {
                                    return [
                                        2,
                                        this.serviceResponse(400, {}, 'No valid fields provided for update.')
                                    ];
                                }
                                return [
                                    4,
                                    this.sourcePartnerModel.findOneAndUpdate({
                                        id: id
                                    }, updateData)
                                ];
                            case 3:
                                response = _state.sent();
                                if (!response) {
                                    return [
                                        2,
                                        this.serviceResponse(500, {}, 'SourcePartner not found.')
                                    ];
                                }
                                return [
                                    2,
                                    this.serviceResponse(200, {
                                        response: response
                                    }, 'SourcePartner data updated successfully.')
                                ];
                        }
                    });
                }).call(this);
            }
        },
        {
            key: "getSourcePartner",
            value: function getSourcePartner(payload, page, perPage) {
                return _async_to_generator(function() {
                    var name, link, status, whereQuery, _ref, SourcePartnerData, totalCount, data;
                    return _ts_generator(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                name = payload.name, link = payload.link, status = payload.status;
                                whereQuery = {};
                                if (name) {
                                    whereQuery.name = name;
                                } else if (link) {
                                    whereQuery.link = link;
                                } else if (status) {
                                    whereQuery.status = status;
                                }
                                return [
                                    4,
                                    Promise.all([
                                        this.sourcePartnerModel.find({
                                            where: whereQuery,
                                            select: [
                                                '*'
                                            ],
                                            paginate: {
                                                perPage: perPage,
                                                page: page
                                            }
                                        }),
                                        this.sourcePartnerModel.count({
                                            where: whereQuery
                                        })
                                    ])
                                ];
                            case 1:
                                _ref = _sliced_to_array.apply(void 0, [
                                    _state.sent(),
                                    2
                                ]), SourcePartnerData = _ref[0], totalCount = _ref[1];
                                data = {
                                    totalRows: totalCount,
                                    totalPages: calculateTotalPages(totalCount, perPage),
                                    records: SourcePartnerData
                                };
                                return [
                                    2,
                                    this.serviceResponse(200, data, 'Fetch SourcePartner Data Successfully...')
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
                    return _ts_generator(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                return [
                                    4,
                                    this.customerModel.findOneAndUpdate(where, update)
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
            key: "findCustomerInputData",
            value: function findCustomerInputData(leadID) {
                return _async_to_generator(function() {
                    var knex, result;
                    return _ts_generator(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                knex = getKnexInstance();
                                // Remove ONLY_FULL_GROUP_BY (if needed)
                                return [
                                    4,
                                    knex.raw("SET sql_mode=(SELECT REPLACE(@@sql_mode,'ONLY_FULL_GROUP_BY',''))")
                                ];
                            case 1:
                                _state.sent();
                                return [
                                    4,
                                    knex('leads as l').join('customer as c', 'l.customerID', 'c.customerID').join('address as ad', function() {
                                        this.on('l.customerID', '=', 'ad.customerID').andOn('ad.addressID', '=', knex.raw('(SELECT MAX(addressID) FROM address WHERE customerID = l.customerID)'));
                                    }).whereIn('l.status', [
                                        'Fresh Lead',
                                        'Document Received'
                                    ]).andWhere('l.leadID', leadID).orderBy('l.leadID', 'desc').select([
                                        'c.customerID',
                                        'c.firstName',
                                        'c.middlename',
                                        'c.lastName',
                                        'c.gender',
                                        'c.pancard',
                                        'c.dob',
                                        'c.mobile',
                                        'c.email',
                                        'l.leadID',
                                        'l.monthlyIncome',
                                        'l.salaryMode',
                                        'ad.address',
                                        'ad.city',
                                        'ad.state',
                                        'ad.pincode',
                                        knex.raw("(\n          SELECT GROUP_CONCAT(employerName ORDER BY employerID DESC)\n          FROM employer\n          WHERE customerID = c.customerID\n        ) AS employer_list")
                                    ]).groupBy([
                                        'c.customerID',
                                        'c.firstName',
                                        'c.middlename',
                                        'c.lastName',
                                        'c.gender',
                                        'c.pancard',
                                        'c.dob',
                                        'c.mobile',
                                        'c.email',
                                        'l.leadID',
                                        'l.monthlyIncome',
                                        'l.salaryMode',
                                        'ad.address',
                                        'ad.city',
                                        'ad.state',
                                        'ad.pincode'
                                    ]).first()
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
        },
        {
            key: "insertAndUpdateCustomerToken",
            value: function insertAndUpdateCustomerToken(customerID) {
                return _async_to_generator(function() {
                    var knex, customerTokenRow, now, randomStr, randomInt, hash, error;
                    return _ts_generator(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                _state.trys.push([
                                    0,
                                    7,
                                    ,
                                    8
                                ]);
                                knex = getKnexInstance();
                                return [
                                    4,
                                    knex('bureauCustomerToken').where('customerID', customerID).first()
                                ];
                            case 1:
                                customerTokenRow = _state.sent();
                                now = new Date();
                                return [
                                    4,
                                    this.generateRandomString(24)
                                ];
                            case 2:
                                randomStr = _state.sent();
                                randomInt = Math.floor(100000 + Math.random() * 900000);
                                hash = crypto.createHash('sha256').update(now.toISOString() + customerID + randomStr + randomInt).digest('hex');
                                if (!!customerTokenRow) return [
                                    3,
                                    4
                                ];
                                return [
                                    4,
                                    knex('bureauCustomerToken').insert({
                                        customerID: customerID,
                                        customerToken: hash,
                                        last_updated: now,
                                        created_at: now
                                    })
                                ];
                            case 3:
                                _state.sent();
                                return [
                                    3,
                                    6
                                ];
                            case 4:
                                return [
                                    4,
                                    knex('bureauCustomerToken').where('customerID', customerID).update({
                                        customerToken: hash,
                                        last_updated: now
                                    })
                                ];
                            case 5:
                                _state.sent();
                                _state.label = 6;
                            case 6:
                                return [
                                    2,
                                    hash
                                ];
                            case 7:
                                error = _state.sent();
                                logger.error('Error in insertAndUpdateCustomerToken:', error);
                                throw new Error('Error in insertAndUpdateCustomerToken');
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
            key: "generateRandomString",
            value: function generateRandomString() {
                var length = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : 10;
                return _async_to_generator(function() {
                    var characters, charactersLength, result, i, randomIndex;
                    return _ts_generator(this, function(_state) {
                        characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
                        charactersLength = characters.length;
                        result = '';
                        for(i = 0; i < length; i++){
                            randomIndex = Math.floor(crypto.randomInt(0, charactersLength));
                            result += characters[randomIndex];
                        }
                        return [
                            2,
                            result
                        ];
                    });
                })();
            }
        },
        {
            key: "checkCustomerStatusPhpApi",
            value: function checkCustomerStatusPhpApi(pancard) {
                return _async_to_generator(function() {
                    var baseUrl, apiCall, body, apiData, action, response, returnData, nonActionableStatuses;
                    return _ts_generator(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                baseUrl = this.commonHelper.getCrossPlatformBaseUrl();
                                apiCall = new AxiosService(baseUrl);
                                body = {
                                    pancard: pancard
                                };
                                return [
                                    4,
                                    apiCall.call('post', "/".concat(config.checkCustomers), body, undefined, {
                                        'Content-Type': 'application/json',
                                        Authorization: "Basic ".concat(config.phpCrossPlatformKey)
                                    })
                                ];
                            case 1:
                                apiData = _state.sent();
                                if (!apiData.data) {
                                    return [
                                        2,
                                        apiData
                                    ];
                                }
                                action = 1;
                                response = apiData.data;
                                response['newloanAmount'] = response['loanAmount'];
                                returnData = {
                                    casetype: response['checkLeadType'],
                                    leadstatus: response['checkCurrentStatus'],
                                    action: action
                                };
                                if (response['isRamfinCustomer'] == 'Yes') {
                                    nonActionableStatuses = [
                                        'Approved',
                                        'Hold',
                                        'Disbursal Sheet Send',
                                        'Disbursed',
                                        'Part Payment',
                                        'Settlement',
                                        'Rejected',
                                        'Bank Update Rejected',
                                        'Approved Process',
                                        'Hold Process',
                                        'Blacklisted',
                                        'Disbursal Approved',
                                        'Bank Update Hold',
                                        'Document Received'
                                    ];
                                    if (nonActionableStatuses.includes(response['checkCurrentStatus'])) {
                                        action = 0;
                                    }
                                }
                                returnData['action'] = action;
                                return [
                                    2,
                                    action
                                ];
                        }
                    });
                }).call(this);
            }
        }
    ]);
    return CustomerService;
}(ResponseService);
export default CustomerService;
export var customerService = new CustomerService();

//# sourceMappingURL=customer.service.js.map