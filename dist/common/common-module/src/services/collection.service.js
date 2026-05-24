function _array_like_to_array(arr, len) {
    if (len == null || len > arr.length) len = arr.length;
    for(var i = 0, arr2 = new Array(len); i < len; i++)arr2[i] = arr[i];
    return arr2;
}
function _array_with_holes(arr) {
    if (Array.isArray(arr)) return arr;
}
function _array_without_holes(arr) {
    if (Array.isArray(arr)) return _array_like_to_array(arr);
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
function _iterable_to_array(iter) {
    if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter);
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
function _non_iterable_spread() {
    throw new TypeError("Invalid attempt to spread non-iterable instance.\\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
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
function _to_consumable_array(arr) {
    return _array_without_holes(arr) || _iterable_to_array(arr) || _unsupported_iterable_to_array(arr) || _non_iterable_spread();
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
import CallhistorylogsModel from '../database/mysql/callhistorylogs';
import CollectionModel from '../database/mysql/collection';
import CustomerModel from '../database/mysql/customer';
import LeadModel from '../database/mysql/leads';
import LoanModel from '../database/mysql/loan';
import UserModel from '../database/mysql/users';
import ApprovalModel from '../database/mysql/approval';
import { CollectedMode } from '../enums/collection.enum';
import { onlinePaymentModel } from '../database/mysql/onlinepayment';
import { transactionModel } from '../database/mysql/transactions';
import { CollectionStatus, CollectionType } from '../enums/collection.enum';
import { LeadStatus } from '../enums/lead.enum';
import { BadRequestError, NotFoundError } from '../errors';
import { commonHelper } from '../helpers/common';
import { checkRepaymentAmountV2 } from '../helpers/repaymentCalculator';
import { HttpStatusCode } from 'axios';
import { default as moment, default as momentTz } from 'moment-timezone';
import { WaiverModel } from '../database/mysql/waiver';
import { Products } from '../enums/product.enum';
import { WaiverStatus, WaiverType } from '../enums/waiver.enum';
import { excelDownloadService } from '../services/excelDownload.service';
import { leadService } from '../services/lead.service';
import { calculatePaydayAmountIPC, calculateTotalRepayPaydayAmountNonIPC } from '../utils/ipcCalculation';
import { logger } from '../utils/logger';
import { getKnexInstance } from '../utils/mysql';
import { calculateTotalPages, generateWaiverId } from '../utils/util';
import AxiosService from './api.service';
import { loanService } from './loan.service';
import ResponseService from './response.service';
var CollectionService = /*#__PURE__*/ function(ResponseService) {
    "use strict";
    _inherits(CollectionService, ResponseService);
    function CollectionService() {
        _class_call_check(this, CollectionService);
        var _this;
        _this = _call_super(this, CollectionService, arguments), _define_property(_this, "loanService", loanService), _define_property(_this, "transactionModel", transactionModel), _define_property(_this, "onlinePaymentModel", onlinePaymentModel), _define_property(_this, "commonHelper", commonHelper), _define_property(_this, "collectionModel", new CollectionModel()), _define_property(_this, "customerModel", new CustomerModel()), _define_property(_this, "leadModel", new LeadModel()), _define_property(_this, "loanModel", new LoanModel()), _define_property(_this, "userModel", new UserModel()), _define_property(_this, "approvalModel", new ApprovalModel()), _define_property(_this, "callhistorylogsModel", new CallhistorylogsModel()), _define_property(_this, "excelDownloadService", excelDownloadService), _define_property(_this, "leadService", leadService), _define_property(_this, "waiverModel", new WaiverModel());
        return _this;
    }
    _create_class(CollectionService, [
        {
            key: "findOne",
            value: function findOne(_0) {
                return _async_to_generator(function(where) {
                    var select;
                    var _arguments = arguments;
                    return _ts_generator(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                select = _arguments.length > 1 && _arguments[1] !== void 0 ? _arguments[1] : [
                                    '*'
                                ];
                                return [
                                    4,
                                    this.collectionModel.findOneCollection(where, select)
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
            key: "findPayDayPendingCollection",
            value: function findPayDayPendingCollection(payload, page, perPage, isExcelDownload) {
                return _async_to_generator(function() {
                    var search_by, customer_search, start_date, end_date, dpd, db, today, query, data, excelBuffer, totalCountQuery, paginatedQuery, _ref, totalCountResult, paginatedData, CollectionPendingData;
                    return _ts_generator(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                search_by = payload.search_by, customer_search = payload.customer_search, start_date = payload.start_date, end_date = payload.end_date, dpd = payload.dpd;
                                db = getKnexInstance();
                                if (!db) {
                                    console.error('Failed to initialize the Knex instance.');
                                    return [
                                        2,
                                        this.serviceResponse(500, null, 'Internal Server Error')
                                    ];
                                }
                                today = moment().format('YYYY-MM-DD');
                                return [
                                    4,
                                    getKnexInstance().raw("SET sql_mode = (SELECT REPLACE(@@sql_mode, 'ONLY_FULL_GROUP_BY', ''))")
                                ];
                            case 1:
                                _state.sent();
                                query = db('customer').select([
                                    'leads.leadID',
                                    db.raw('ANY_VALUE(loan.loanNo) AS loanNo'),
                                    db.raw('ANY_VALUE(leads.purpose) AS purpose'),
                                    db.raw('ANY_VALUE(leads.state) AS state'),
                                    db.raw('ANY_VALUE(leads.city) AS city'),
                                    db.raw('ANY_VALUE(customer.name) AS customerName'),
                                    db.raw('ANY_VALUE(customer.gender) AS gender'),
                                    db.raw('ANY_VALUE(customer.email) AS email'),
                                    db.raw('ANY_VALUE(customer.mobile) AS mobile'),
                                    db.raw('ANY_VALUE(customer.dob) AS dob'),
                                    db.raw('ANY_VALUE(TIMESTAMPDIFF(YEAR, customer.dob, CURDATE()) + 1) AS age'),
                                    db.raw('ANY_VALUE(customer.pancard) AS pancard'),
                                    db.raw('ANY_VALUE(loan.disbursalAmount) AS disbursalAmount'),
                                    db.raw("\n      (ANY_VALUE(loan.disbursalAmount) + ((ANY_VALUE(loan.disbursalAmount) * (ANY_VALUE(approval.roi) / 100)) *\n      DATEDIFF(ANY_VALUE(approval.repayDate), ANY_VALUE(loan.disbursalDate)))) AS duePayment\n    "),
                                    db.raw("\n      CASE\n        WHEN ANY_VALUE(leads.ipc) = 1 THEN (\n          SELECT\n            loan.disbursalAmount +\n            (loan.disbursalAmount * (DATEDIFF(CURDATE(), approval.repayDate) + DATEDIFF(approval.repayDate, loan.disbursalDate)) * approval.roi / 100) +\n            ((DATEDIFF(CURDATE(), approval.repayDate) * ".concat(config.ipcDpdInterest, " / 100) * loan.disbursalAmount) +\n            (").concat(config.dpdPenalty, " * (1 + ").concat(config.dpdPenaltyGstPercentage, " / 100))\n          FROM loan\n          JOIN approval ON loan.leadID = approval.leadID\n          WHERE loan.leadID = leads.leadID\n          LIMIT 1\n        )\n        ELSE (\n          ANY_VALUE(loan.disbursalAmount) + ((ANY_VALUE(loan.disbursalAmount) * (ANY_VALUE(approval.roi) / 100)) * DATEDIFF(CURDATE(), ANY_VALUE(loan.disbursalDate)))\n        )\n      END AS repayAmount\n    ")),
                                    db.raw('DATEDIFF(CURDATE(), ANY_VALUE(approval.repayDate)) AS dayPassDue'),
                                    db.raw('ANY_VALUE(customer.employeeType) AS employmentType'),
                                    db.raw('ANY_VALUE(leads.fbLeads) AS loanType'),
                                    db.raw("\n      (SELECT COUNT(*)\n         FROM leads l2\n         WHERE l2.customerID = customer.customerID\n           AND l2.status IN (?, ?, ?)\n      ) AS loanFrequency\n      ", [
                                        CollectionStatus.CLOSED,
                                        CollectionStatus.SETTLEMENT,
                                        CollectionStatus.DISBURSED
                                    ]),
                                    db.raw("DATE_FORMAT(ANY_VALUE(loan.disbursalDate), '%d %M %Y') AS disbursedDate"),
                                    db.raw("DATE_FORMAT(ANY_VALUE(loan.disbursalDate), '%M %Y') AS disbursedMonth"),
                                    db.raw("DATE_FORMAT(ANY_VALUE(approval.repayDate), '%d %M %Y') AS repayDate"),
                                    db.raw("DATE_FORMAT(ANY_VALUE(approval.repayDate), '%M %Y') AS repayMonth"),
                                    db.raw("\n      ((ANY_VALUE(loan.disbursalAmount) + ((ANY_VALUE(loan.disbursalAmount) * (ANY_VALUE(approval.roi) / 100)) *\n      (UNIX_TIMESTAMP(CURDATE()) - UNIX_TIMESTAMP(ANY_VALUE(loan.disbursalDate))) / (60 * 60 * 24))) -\n      COALESCE(SUM(collection.collectedAmount), 0)\n      ) AS remainingCollection\n    "),
                                    db.raw('COALESCE(SUM(collection.collectedAmount), 0) AS totalCollection'),
                                    db.raw('DATEDIFF(CURDATE(), ANY_VALUE(loan.disbursalDate)) AS tenure'),
                                    db.raw('DATEDIFF(ANY_VALUE(approval.repayDate), ANY_VALUE(loan.disbursalDate)) AS loanTenure'),
                                    db.raw('ANY_VALUE(approval.roi) AS roi'),
                                    db.raw('ANY_VALUE(users.name) AS creditedBy'),
                                    db.raw("\n      (SELECT name FROM users WHERE userID = leads.alloUID LIMIT 1) AS userName\n    "),
                                    db.raw('ANY_VALUE(leads.createdDate) AS createdDate'),
                                    db.raw("\n      (SELECT JSON_OBJECT('address', a.address)\n       FROM address a\n       WHERE a.customerID = customer.customerID\n         AND a.type NOT IN ('Current Address', 'Rent')\n       LIMIT 1\n      ) AS address\n    "),
                                    db.raw("\n      (SELECT JSON_OBJECT('address', a.address)\n       FROM address a\n       WHERE a.customerID = customer.customerID\n         AND a.type = 'Current Address'\n       LIMIT 1\n      ) AS currentAddress\n    "),
                                    db.raw("\n      (SELECT JSON_OBJECT('address', a.address)\n       FROM address a\n       WHERE a.customerID = customer.customerID\n         AND a.type = 'Rent'\n       LIMIT 1\n      ) AS rentAddress\n    "),
                                    db.raw("\n      (SELECT JSON_OBJECT(\n         'employerName', e.employerName,\n         'address', e.address,\n         'city', e.city,\n         'state', e.state,\n         'pincode', e.pincode\n      ) FROM employer e WHERE e.customerID = customer.customerID\n       LIMIT 1\n      ) AS employer\n    "),
                                    db.raw("\n      (SELECT JSON_OBJECT(\n         'relation', r.relation,\n         'name', r.name,\n         'contactNo', r.contactNo,\n         'address', r.address,\n         'city', r.city,\n         'state', r.state,\n         'pincode', r.pincode\n      ) FROM reference r\n      WHERE r.customerID = customer.customerID\n        AND r.reference_verify = '0'\n      LIMIT 1\n      ) AS reference1\n    "),
                                    db.raw("\n      (SELECT JSON_OBJECT(\n         'relation', r2.relation,\n         'name', r2.name,\n         'contactNo', r2.contactNo,\n         'address', r2.address,\n         'city', r2.city,\n         'state', r2.state,\n         'pincode', r2.pincode\n      ) FROM reference r2\n      WHERE r2.customerID = customer.customerID\n        AND r2.reference_verify = '0'\n      LIMIT 1, 1\n      ) AS reference2\n    ")
                                ]).join('leads', 'customer.customerID', 'leads.customerID').join('approval', 'leads.leadID', 'approval.leadID').join('loan', 'leads.leadID', 'loan.leadID').leftJoin('collection', function() {
                                    this.on('loan.leadID', '=', 'collection.leadID').andOn('collection.collectionStatus', '=', db.raw('?', CollectionStatus.APPROVED));
                                }).leftJoin('users', 'approval.creditedBy', 'users.userID').whereIn('leads.status', [
                                    CollectionStatus.DISBURSED,
                                    CollectionStatus.PART_PAYMENT
                                ]).where('leads.productID', '!=', 1).where('approval.loanType', '=', 0).whereNotIn('customer.customerID', function() {
                                    this.select('customerID').from('customer_dnd').where('expiry_date', '>=', db.fn.now()).andWhere('is_deleted', '=', 0).andWhere('id', '=', function() {
                                        this.select(db.raw('MAX(cd.id)')).from('customer_dnd as cd').whereRaw('cd.customerID = customer_dnd.customerID');
                                    });
                                }).groupBy('leads.leadID').orderBy('leads.leadID', 'desc');
                                return [
                                    4,
                                    this.checkFilterForPendingCollection(search_by, customer_search, start_date, end_date, query, dpd, today, 'payday')
                                ];
                            case 2:
                                _state.sent();
                                if (!isExcelDownload) return [
                                    3,
                                    5
                                ];
                                return [
                                    4,
                                    query
                                ];
                            case 3:
                                data = _state.sent();
                                if (data.length == 0) {
                                    data = [
                                        {
                                            leadID: '-',
                                            loanNo: '-',
                                            purpose: '-',
                                            state: '-',
                                            city: '-',
                                            customerName: '-',
                                            gender: '-',
                                            email: '-',
                                            mobile: '-',
                                            dob: '-',
                                            age: '-',
                                            pancard: '-',
                                            disbursalAmount: '-',
                                            duePayment: '-',
                                            repayAmount: '-',
                                            dayPassDue: '-',
                                            employmentType: '-',
                                            loanType: '-',
                                            loanFrequency: '-',
                                            disbursedDate: '-',
                                            disbursedMonth: '-',
                                            repayDate: '-',
                                            repayMonth: '-',
                                            remainingCollection: '-',
                                            totalCollection: '-',
                                            tenure: '-',
                                            loanTenure: '-',
                                            roi: '-',
                                            creditedBy: '-',
                                            userName: '-',
                                            createdDate: '-',
                                            address: '-',
                                            currentAddress: '-',
                                            rentAddress: '-',
                                            employer: '-',
                                            reference1: '-',
                                            reference2: '-'
                                        }
                                    ];
                                }
                                return [
                                    4,
                                    this.excelDownloadService.exportDataToExcelBuffer(data)
                                ];
                            case 4:
                                excelBuffer = _state.sent();
                                return [
                                    2,
                                    this.serviceResponse(200, {
                                        workbook: excelBuffer
                                    }, 'Excel file generated successfully')
                                ];
                            case 5:
                                totalCountQuery = query.clone().clearSelect().clearGroup().clearOrder().countDistinct('leads.leadID as totalCount').first();
                                paginatedQuery = query.clone().limit(perPage).offset(page);
                                return [
                                    4,
                                    Promise.all([
                                        totalCountQuery,
                                        paginatedQuery
                                    ])
                                ];
                            case 6:
                                _ref = _sliced_to_array.apply(void 0, [
                                    _state.sent(),
                                    2
                                ]), totalCountResult = _ref[0], paginatedData = _ref[1];
                                CollectionPendingData = {
                                    pendingCollection: paginatedData,
                                    totalCount: Number((totalCountResult === null || totalCountResult === void 0 ? void 0 : totalCountResult.totalCount) || 0),
                                    totalPages: calculateTotalPages(Number((totalCountResult === null || totalCountResult === void 0 ? void 0 : totalCountResult.totalCount) || 0), perPage)
                                };
                                return [
                                    2,
                                    this.serviceResponse(200, CollectionPendingData, 'Pending Collection List')
                                ];
                        }
                    });
                }).call(this);
            }
        },
        {
            key: "findEmiPendingCollection",
            value: function findEmiPendingCollection(payload, page, perPage, isExcelDownload) {
                return _async_to_generator(function() {
                    var search_by, customer_search, start_date, end_date, dpd, db, today, startDate, endDate, query, data, excelBuffer, totalCountQuery, paginatedQuery, _ref, totalCountResult, paginatedData, pendingEMIData;
                    return _ts_generator(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                search_by = payload.search_by, customer_search = payload.customer_search, start_date = payload.start_date, end_date = payload.end_date, dpd = payload.dpd;
                                db = getKnexInstance();
                                if (!db) {
                                    console.error('Failed to initialize the Knex instance.');
                                    return [
                                        2,
                                        this.serviceResponse(500, null, 'Internal Server Error')
                                    ];
                                }
                                return [
                                    4,
                                    getKnexInstance().raw("SET sql_mode = (SELECT REPLACE(@@sql_mode, 'ONLY_FULL_GROUP_BY', ''))")
                                ];
                            case 1:
                                _state.sent();
                                today = momentTz().format('YYYY-MM-DD');
                                startDate = start_date ? momentTz(start_date).format('YYYY-MM-DD') : momentTz().format('YYYY-MM-DD');
                                endDate = end_date ? momentTz(end_date).format('YYYY-MM-DD') : momentTz().format('YYYY-MM-DD');
                                query = db('customer').join('leads', 'customer.customerID', 'leads.customerID').join('loan', 'leads.leadID', 'loan.leadID').join('credits', 'credits.leadID', 'leads.leadID').join('approval', function() {
                                    this.on('leads.leadID', 'approval.leadID').andOn('customer.customerID', 'approval.customerID');
                                }).leftJoin('users as creditors', 'leads.alloUID', 'creditors.userID').leftJoin(db.raw("(\n                SELECT * FROM equated_monthly_installments e\n                WHERE e.status = 'due' OR e.status = 'partially-paid'\n            ) as emi"), 'leads.leadID', 'emi.leadID').leftJoin(db.raw("(\n          SELECT\n            emi.leadID,\n            COUNT(CASE WHEN emi.status = 'paid' THEN 1 END) AS paid_emi,\n            COUNT(\n                CASE\n                    WHEN emi.status = 'due' AND emi.dueDate < CURDATE() THEN 1\n                    WHEN emi.status = 'partially-paid' AND emi.actualPaymentDate IS NOT NULL\n                         AND emi.actualPaymentDate > emi.dueDate\n                         AND emi.actualPaymentDate < CURDATE() THEN 1\n                END\n            ) AS overDue_emi,\n            COUNT(\n                CASE\n                    WHEN emi.status = 'due' AND emi.dueDate >= CURDATE() THEN 1\n                    WHEN emi.status = 'partially-paid' AND (emi.actualPaymentDate IS NULL OR emi.actualPaymentDate <= emi.dueDate) THEN 1\n                END\n            ) AS due_emi,\n\n          SUM(emi.paymentReceived) AS total_collection,\n\n         CEIL(SUM(\n            CASE\n              WHEN emi.status NOT IN ('paid') AND emi.dueDate < CURDATE() THEN\n                CASE\n                  WHEN emi.status = 'due'\n                  THEN emi.principal + emi.interest + (emi.principal * ((approval.roi / 365 + 0.1) / 100)) * DATEDIFF(CURDATE(), emi.dueDate) + 590\n\n                  WHEN emi.status = 'partially-paid' AND emi.actualPaymentDate <= emi.dueDate\n                  THEN emi.principal + emi.interest + (emi.amountRemains * ((approval.roi / 365 + 0.1) / 100)) * DATEDIFF(CURDATE(), emi.dueDate) + 590 - emi.paymentReceived\n\n                  WHEN emi.status = 'partially-paid' AND emi.actualPaymentDate >= emi.dueDate\n                  THEN emi.principal + emi.interest + emi.panelty + emi.brokenPeriodIntrest + (emi.amountRemains * ((approval.roi / 365 + 0.1) / 100)) * DATEDIFF(CURDATE(), emi.actualPaymentDate) + 590 - emi.paymentReceived\n\n                  ELSE 0\n                END\n              ELSE 0\n            END\n          )) AS remaining_collection,\n\n       SUM(\n        CASE\n          WHEN emi.status != 'paid'\n          THEN CEIL(\n            (CASE\n              WHEN emi.status = 'due' AND emi.dueDate < CURDATE()\n                THEN (emi.principal * ((approval.roi / 365 + 0.1) / 100) * DATEDIFF(CURDATE(), emi.dueDate))\n                     + emi.principal + emi.interest + 590\n              WHEN emi.status = 'partially-paid' AND emi.dueDate < CURDATE() AND emi.actualPaymentDate <= emi.dueDate\n                THEN (emi.amountRemains * ((approval.roi / 365 + 0.1) / 100) * DATEDIFF(CURDATE(), emi.dueDate))\n                     + emi.principal + emi.interest + 590\n              ELSE (emi.amountRemains * ((approval.roi / 365 + 0.1) / 100) * DATEDIFF(CURDATE(), emi.actualPaymentDate))\n                     + emi.principal + emi.interest + emi.panelty + emi.brokenPeriodIntrest\n            END) - emi.paymentReceived\n          )\n          ELSE 0\n        END\n      ) AS due_date_repay_amount,\n\n\n\n      SUM(\n    CASE\n      WHEN emi.status NOT IN ('paid') AND emi.dueDate < CURDATE()\n      THEN DATEDIFF(CURDATE(), emi.dueDate)\n      ELSE 0\n    END\n  ) AS days_past_due ,\n\n   CASE\n    WHEN SUM(\n      CASE\n        WHEN emi.status NOT IN ('paid') AND emi.dueDate < CURDATE()\n        THEN GREATEST(DATEDIFF(CURDATE(), emi.dueDate), 0)\n        ELSE 0\n      END\n    ) BETWEEN 1 AND 30 THEN '1-30 Bucket 1'\n\n    WHEN SUM(\n      CASE\n        WHEN emi.status NOT IN ('paid') AND emi.dueDate < CURDATE()\n        THEN GREATEST(DATEDIFF(CURDATE(), emi.dueDate), 0)\n        ELSE 0\n      END\n    ) BETWEEN 31 AND 60 THEN '31-60 Bucket 2'\n\n    WHEN SUM(\n      CASE\n        WHEN emi.status NOT IN ('paid') AND emi.dueDate < CURDATE()\n        THEN GREATEST(DATEDIFF(CURDATE(), emi.dueDate), 0)\n        ELSE 0\n      END\n    ) BETWEEN 61 AND 90 THEN '61-90 Bucket 3'\n\n    WHEN SUM(\n      CASE\n        WHEN emi.status NOT IN ('paid') AND emi.dueDate < CURDATE()\n        THEN GREATEST(DATEDIFF(CURDATE(), emi.dueDate), 0)\n        ELSE 0\n      END\n    ) > 90 THEN '91+ Bucket 4'\n\n    ELSE 'No Bucket'\n  END AS dpd_bucket\n\n          FROM equated_monthly_installments emi\n          JOIN approval ON emi.leadID = approval.leadID\n          WHERE emi.is_deleted = 0\n          GROUP BY emi.leadID\n        ) as emi_full"), 'leads.leadID', 'emi_full.leadID').select('creditors.name as allocated_agent', 'leads.leadID as lead_id', 'loan.loanNo as loan_no', 'leads.purpose as loan_purpose', 'leads.state as state', 'leads.city as city', 'customer.name as name', 'customer.gender as gender', 'customer.email as email', 'customer.mobile as mobile', 'customer.dob as dob', db.raw('YEAR(CURDATE()) - YEAR(customer.dob) AS age'), 'customer.pancard as pan_no', 'emi_full.paid_emi', 'emi_full.due_emi', 'emi_full.overdue_emi', 'emi_full.total_collection', 'emi_full.due_date_repay_amount', 'emi_full.days_past_due', 'emi_full.dpd_bucket', 'emi_full.remaining_collection', db.raw("\n          CEIL(SUM(emi.amountPayable)) AS emi_amount\n        "), 'loan.disbursalAmount as loan_amount', 'customer.employeeType as employee_type', 'leads.fbLeads as loan_type', db.raw("DATE_FORMAT(loan.disbursalDate, '%d-%M-%Y') AS disbursed_date"), db.raw("DATE_FORMAT(loan.disbursalDate, '%M-%Y') AS disbursed_month"), db.raw("DATE_FORMAT(emi.dueDate, '%d-%M-%Y') AS repay_date"), db.raw("DATE_FORMAT(emi.dueDate, '%M-%Y') AS repay_month"), db.raw("CONCAT(credits.tenure, ' Months') AS tenure"), db.raw("CONCAT(credits.tenure, ' Months') AS loan_tenure"), 'approval.roi as roi', db.raw("IFNULL(creditors.name, 'Unknown') AS credit_by"), 'customer.createdDate as date', db.raw("\n          (SELECT JSON_OBJECT('address', a.address)\n           FROM address a\n           WHERE a.customerID = customer.customerID\n             AND a.type NOT IN ('Current Address', 'Rent')\n           LIMIT 1\n          ) AS address\n        "), db.raw("\n          (SELECT JSON_OBJECT('address', a.address)\n           FROM address a\n           WHERE a.customerID = customer.customerID\n             AND a.type = 'Current Address'\n           LIMIT 1\n          ) AS currentAddress\n        "), db.raw("\n          (SELECT JSON_OBJECT('address', a.address)\n           FROM address a\n           WHERE a.customerID = customer.customerID\n             AND a.type = 'Rent'\n           LIMIT 1\n          ) AS rentAddress\n        "), db.raw("\n          (SELECT JSON_OBJECT(\n             'employerName', e.employerName,\n             'address', e.address,\n             'city', e.city,\n             'state', e.state,\n             'pincode', e.pincode\n          ) FROM employer e WHERE e.customerID = customer.customerID\n           LIMIT 1\n          ) AS employer\n        "), db.raw("\n          (SELECT JSON_OBJECT(\n             'relation', r.relation,\n             'name', r.name,\n             'contactNo', r.contactNo,\n             'address', r.address,\n             'city', r.city,\n             'state', r.state,\n             'pincode', r.pincode\n          ) FROM reference r\n          WHERE r.customerID = customer.customerID\n            AND r.reference_verify = '0'\n          LIMIT 1\n          ) AS reference1\n        "), db.raw("\n          (SELECT JSON_OBJECT(\n             'relation', r2.relation,\n             'name', r2.name,\n             'contactNo', r2.contactNo,\n             'address', r2.address,\n             'city', r2.city,\n             'state', r2.state,\n             'pincode', r2.pincode\n          ) FROM reference r2\n          WHERE r2.customerID = customer.customerID\n            AND r2.reference_verify = '0'\n          LIMIT 1, 1\n          ) AS reference2\n        ")).whereIn('leads.status', [
                                    LeadStatus.DISBURSED,
                                    LeadStatus.PART_PAYMENT
                                ]).where('leads.productID', 1).whereNotIn('customer.customerID', function(builder) {
                                    builder.select('customer_dnd.customerID').from('customer_dnd').where('expiry_date', '>=', db.raw('CURDATE()')).where('is_deleted', 0).whereRaw("customer_dnd.id = (\n        SELECT MAX(cd.id) FROM customer_dnd AS cd WHERE cd.customerID = customer_dnd.customerID\n      )");
                                }).groupBy([
                                    'leads.leadID',
                                    'creditors.name',
                                    'loan.loanNo',
                                    'leads.purpose',
                                    'leads.state',
                                    'leads.city',
                                    'customer.name',
                                    'customer.gender',
                                    'customer.email',
                                    'customer.mobile',
                                    'customer.dob',
                                    'customer.pancard',
                                    'emi_full.paid_emi',
                                    'emi_full.due_emi',
                                    'emi_full.overdue_emi',
                                    'emi_full.total_collection',
                                    'emi_full.due_date_repay_amount',
                                    'emi_full.days_past_due',
                                    'emi_full.dpd_bucket',
                                    'emi_full.remaining_collection',
                                    'loan.disbursalAmount',
                                    'customer.employeeType',
                                    'leads.fbLeads',
                                    'loan.disbursalDate',
                                    'emi.dueDate',
                                    'credits.tenure',
                                    'approval.roi',
                                    'customer.createdDate'
                                ]).orderBy('leads.leadID', 'desc');
                                return [
                                    4,
                                    this.checkFilterForPendingCollection(search_by, customer_search, startDate, endDate, query, dpd, today, 'emi')
                                ];
                            case 2:
                                _state.sent();
                                if (!isExcelDownload) return [
                                    3,
                                    5
                                ];
                                return [
                                    4,
                                    query
                                ];
                            case 3:
                                data = _state.sent();
                                if (data.length == 0) {
                                    data = [
                                        {
                                            Allocated_Agent: '-',
                                            Lead_Id: '-',
                                            Loan_No: '-',
                                            Loan_Purpose: '-',
                                            State: '-',
                                            City: '-',
                                            Name: '-',
                                            Gender: '-',
                                            Email: '-',
                                            Mobile: '-',
                                            DOB: '-',
                                            Age: '-',
                                            PAN_No: '-',
                                            Paid_EMI: '-',
                                            Due_EMI: '-',
                                            OverDue_EMI: '-',
                                            Total_Collection: '-',
                                            Due_Date_Repay_Amount: '-',
                                            EMI_Amount: '-',
                                            Days_Past_Due: '-',
                                            DPD_Bucket: '-',
                                            Remaining_Collection: '-',
                                            Loan_Amount: '-',
                                            Employee_Type: '-',
                                            Loan_Type: '-',
                                            Disbursed_Date: '-',
                                            Disbursed_Month: '-',
                                            Repay_Date: '-',
                                            Repay_Month: '-',
                                            Tenure: '-',
                                            Loan_Tenure: '-',
                                            ROI: '-',
                                            Credit_By: '-',
                                            Date: '-',
                                            address: '-',
                                            currentAddress: '-',
                                            rentAddress: '-',
                                            employer: '-',
                                            reference1: '-',
                                            reference2: '-'
                                        }
                                    ];
                                }
                                return [
                                    4,
                                    this.excelDownloadService.exportDataToExcelBuffer(data)
                                ];
                            case 4:
                                excelBuffer = _state.sent();
                                return [
                                    2,
                                    this.serviceResponse(200, {
                                        workbook: excelBuffer
                                    }, 'Excel file generated successfully')
                                ];
                            case 5:
                                totalCountQuery = query.clone().clearGroup().count('* as totalCount').first();
                                paginatedQuery = query.clone().limit(perPage).offset(page);
                                return [
                                    4,
                                    Promise.all([
                                        totalCountQuery,
                                        paginatedQuery
                                    ])
                                ];
                            case 6:
                                _ref = _sliced_to_array.apply(void 0, [
                                    _state.sent(),
                                    2
                                ]), totalCountResult = _ref[0], paginatedData = _ref[1];
                                pendingEMIData = {
                                    pendingEMIData: paginatedData,
                                    totalCount: totalCountResult.totalCount,
                                    totalPages: Math.ceil(totalCountResult.totalCount / perPage)
                                };
                                return [
                                    2,
                                    this.serviceResponse(200, pendingEMIData, 'Pending EMI Collection List')
                                ];
                        }
                    });
                }).call(this);
            }
        },
        {
            key: "findCollectionReport",
            value: function findCollectionReport(payload, page, perPage, isExcelDownload) {
                return _async_to_generator(function() {
                    var search_by, start_date, end_date, customer_search, lead_id, lead_case, employment_type, salary_mode, monthly_income, city, state, page_name, db, query, statusMap, normalizedStatus, data, excelBuffer, totalCountQuery, paginatedQuery, _ref, totalCountResult, paginatedData, collectionData;
                    return _ts_generator(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                search_by = payload.search_by, start_date = payload.start_date, end_date = payload.end_date, customer_search = payload.customer_search, lead_id = payload.lead_id, lead_case = payload.lead_case, employment_type = payload.employment_type, salary_mode = payload.salary_mode, monthly_income = payload.monthly_income, city = payload.city, state = payload.state, page_name = payload.page_name;
                                db = getKnexInstance();
                                if (!db) {
                                    console.error('Failed to initialize the Knex instance.');
                                    return [
                                        2,
                                        this.serviceResponse(500, null, 'Internal Server Error')
                                    ];
                                }
                                return [
                                    4,
                                    getKnexInstance().raw("SET sql_mode = (SELECT REPLACE(@@sql_mode, 'ONLY_FULL_GROUP_BY', ''))")
                                ];
                            case 1:
                                _state.sent();
                                query = db('customer').join('leads', 'customer.customerID', '=', 'leads.customerID').leftJoin('users', 'users.userID', '=', 'leads.sanctionAppID').select('leads.leadID AS leadId', 'customer.customerID AS customerId', 'customer.name', 'customer.email', 'customer.mobile', 'leads.purpose AS loanPurpose', 'leads.loanRequeried AS loanRequired', 'leads.monthlyIncome', 'leads.city', 'leads.state', 'leads.pincode', 'leads.utmSource AS source', 'leads.status', 'leads.sanctionalloUID AS sanctionBy', 'leads.fbLeads AS type', 'leads.createdDate AS createdAt', 'users.name AS sanctionByName').whereNot('leads.productID', 1).whereNot('leads.sanctionalloUID', 'no').orderBy('leads.leadID', 'desc');
                                if (page_name) {
                                    statusMap = {
                                        closed: 'Closed',
                                        part_payment: 'Part Payment',
                                        settlement: 'Settlement'
                                    };
                                    normalizedStatus = page_name.toLowerCase().replace(/\s+/g, '_'); // Convert spaces to underscores
                                    if (statusMap[normalizedStatus]) {
                                        query = query.where('leads.status', statusMap[normalizedStatus]);
                                    } else {
                                        console.log('Status not found in map:', normalizedStatus);
                                    }
                                }
                                return [
                                    4,
                                    this.checkFilterForCollectionReport(search_by, start_date, end_date, customer_search, lead_id, lead_case, employment_type, salary_mode, monthly_income, city, state, query)
                                ];
                            case 2:
                                _state.sent();
                                if (!isExcelDownload) return [
                                    3,
                                    5
                                ];
                                return [
                                    4,
                                    query
                                ];
                            case 3:
                                data = _state.sent();
                                if (data.length == 0) {
                                    data = [
                                        {
                                            leadId: '-',
                                            customerId: '-',
                                            name: '-',
                                            email: '-',
                                            mobile: '-',
                                            loanPurpose: '-',
                                            loanRequired: '-',
                                            monthlyIncome: '-',
                                            city: '-',
                                            state: '-',
                                            pincode: '-',
                                            source: '-',
                                            status: '-',
                                            sanctionBy: '-',
                                            type: '-',
                                            createdAt: '-',
                                            sanctionByName: '-'
                                        }
                                    ];
                                }
                                return [
                                    4,
                                    this.excelDownloadService.exportDataToExcelBuffer(data)
                                ];
                            case 4:
                                excelBuffer = _state.sent();
                                return [
                                    2,
                                    this.serviceResponse(200, {
                                        workbook: excelBuffer
                                    }, 'Excel file generated successfully')
                                ];
                            case 5:
                                totalCountQuery = query.clone().count('* as totalCount').first();
                                paginatedQuery = query.clone().limit(perPage).offset(page);
                                return [
                                    4,
                                    Promise.all([
                                        totalCountQuery,
                                        paginatedQuery
                                    ])
                                ];
                            case 6:
                                _ref = _sliced_to_array.apply(void 0, [
                                    _state.sent(),
                                    2
                                ]), totalCountResult = _ref[0], paginatedData = _ref[1];
                                collectionData = {
                                    collectionReport: paginatedData,
                                    totalCount: totalCountResult.totalCount,
                                    totalPages: Math.ceil(totalCountResult.totalCount / perPage)
                                };
                                return [
                                    2,
                                    this.serviceResponse(200, collectionData, "".concat(page_name, " collection data"))
                                ];
                        }
                    });
                }).call(this);
            }
        },
        {
            key: "findWaiveOffLoanDetail",
            value: function findWaiveOffLoanDetail(findType, id) {
                return _async_to_generator(function() {
                    var db, searchColumn, collections, approvedCollection, _approvedCollection_, customerID, leadID, loanID, disbursalAmount, disbursalDate, disbursalRefrenceNo, repayDate, roi, branch, collectedAmount, ipc, currentDate, repayDateMoment, disbursalDateMoment, totalDays, realDays, penaltyDays, dailyInterest, totalInterest, penaltyInterest, _tmp, bouncingCharges, paidAmount, totalPayable, maxPay, payAmount, collectionDetails;
                    return _ts_generator(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                db = getKnexInstance();
                                if (!db) {
                                    console.error('Failed to initialize the Knex instance.');
                                    return [
                                        2,
                                        this.serviceResponse(500, null, 'Internal Server Error')
                                    ];
                                }
                                return [
                                    4,
                                    getKnexInstance().raw("SET sql_mode = (SELECT REPLACE(@@sql_mode, 'ONLY_FULL_GROUP_BY', ''))")
                                ];
                            case 1:
                                _state.sent();
                                if (![
                                    'mobile',
                                    'leadID',
                                    'loanNo'
                                ].includes(findType) || !id) {
                                    return [
                                        2,
                                        this.serviceResponse(400, [], 'Invalid search type or missing parameters')
                                    ];
                                }
                                searchColumn = ({
                                    mobile: 'c.mobile',
                                    leadID: 'l.leadID',
                                    loanNo: 'lo.loanNo'
                                })[findType];
                                return [
                                    4,
                                    db('customer as c').leftJoin('leads as l', 'c.customerID', 'l.customerID').leftJoin('loan as lo', 'l.leadID', 'lo.leadID').leftJoin('approval as a', function() {
                                        this.on('c.customerID', '=', 'a.customerID').andOn('l.leadID', '=', 'a.leadID');
                                    }).leftJoin('collection as col', function() {
                                        this.on('c.customerID', '=', 'col.customerID').andOn('l.leadID', '=', 'col.leadID').andOnIn('col.collectionStatus', [
                                            CollectionStatus.APPROVED,
                                            CollectionStatus.APPROVAL_WAITING,
                                            CollectionStatus.APPROVAL_WAITING_REFUNDED
                                        ]);
                                    }).leftJoin('users as u', 'col.collectedBy', 'u.userID').leftJoin('loan as disbursal', function() {
                                        this.on('c.customerID', '=', 'disbursal.customerID').andOn('l.leadID', '=', 'disbursal.leadID');
                                    }).select('c.customerID', 'c.mobile', 'l.leadID', 'l.productID', 'l.ipc', 'lo.loanID', 'lo.loanNo', 'disbursal.disbursalAmount', 'disbursal.disbursalDate', 'disbursal.disbursalRefrenceNo', 'a.repayDate', 'a.roi', 'a.branch', db.raw('SUM(col.collectedAmount) as collectedAmount'), 'u.name as executive', 'col.collectedAmount', 'col.createdDate', 'col.status', 'col.collectionStatus as collectionStatus', 'col.remark').where(searchColumn, id).whereIn('l.status', [
                                        CollectionStatus.DISBURSED,
                                        CollectionStatus.PART_PAYMENT,
                                        CollectionStatus.SETTLEMENT
                                    ]).groupBy('c.customerID', 'l.leadID', 'lo.loanID', 'disbursal.loanID', 'a.approvalID', 'col.collectionID', 'u.userID').orderBy('l.leadID', 'desc')
                                ];
                            case 2:
                                collections = _state.sent();
                                if (!collections) return [
                                    2,
                                    this.serviceResponse(404, [], 'No matching record found')
                                ];
                                approvedCollection = collections.filter(function(collection) {
                                    return collection.collectionStatus === CollectionStatus.APPROVED;
                                });
                                if (approvedCollection.length === 0) {
                                    return [
                                        2,
                                        this.serviceResponse(404, [], 'No approved collection found')
                                    ];
                                }
                                _approvedCollection_ = approvedCollection[0], customerID = _approvedCollection_.customerID, leadID = _approvedCollection_.leadID, loanID = _approvedCollection_.loanID, disbursalAmount = _approvedCollection_.disbursalAmount, disbursalDate = _approvedCollection_.disbursalDate, disbursalRefrenceNo = _approvedCollection_.disbursalRefrenceNo, repayDate = _approvedCollection_.repayDate, roi = _approvedCollection_.roi, branch = _approvedCollection_.branch, collectedAmount = _approvedCollection_.collectedAmount, ipc = _approvedCollection_.ipc;
                                if (!disbursalRefrenceNo) return [
                                    2,
                                    this.serviceResponse(400, [], 'No disbursal reference number found')
                                ];
                                // Use moment-timezone for consistent date handling
                                currentDate = momentTz().toDate();
                                repayDateMoment = momentTz(repayDate);
                                disbursalDateMoment = momentTz(disbursalDate);
                                // Calculate days with moment for more accurate results
                                totalDays = repayDateMoment.diff(disbursalDateMoment, 'days');
                                realDays = Math.min(totalDays, momentTz(currentDate).diff(disbursalDateMoment, 'days'));
                                penaltyDays = Math.max(0, momentTz(currentDate).diff(repayDateMoment, 'days'));
                                // Calculate interest with proper precision
                                dailyInterest = +(disbursalAmount * (roi / 100)).toFixed(2);
                                totalInterest = +(dailyInterest * realDays).toFixed(2);
                                // Handle penalty calculation
                                penaltyInterest = 0;
                                if (!(penaltyDays > 0)) return [
                                    3,
                                    6
                                ];
                                if (!(ipc === CollectionStatus.IPC)) return [
                                    3,
                                    4
                                ];
                                return [
                                    4,
                                    calculatePaydayAmountIPC(leadID, approvedCollection[0].status)
                                ];
                            case 3:
                                _tmp = _state.sent().charges || 0;
                                return [
                                    3,
                                    5
                                ];
                            case 4:
                                _tmp = parseFloat((disbursalAmount * (1.25 / 100)).toFixed(2)) * penaltyDays;
                                _state.label = 5;
                            case 5:
                                penaltyInterest = _tmp;
                                _state.label = 6;
                            case 6:
                                bouncingCharges = ipc === CollectionStatus.IPC ? penaltyInterest : 0;
                                paidAmount = collectedAmount || 0;
                                if (!(ipc === CollectionStatus.IPC)) return [
                                    3,
                                    8
                                ];
                                return [
                                    4,
                                    calculatePaydayAmountIPC(leadID, approvedCollection[0].status)
                                ];
                            case 7:
                                payAmount = _state.sent();
                                totalPayable = payAmount.totalRepayAmount;
                                maxPay = payAmount.totalRepayAmount;
                                return [
                                    3,
                                    9
                                ];
                            case 8:
                                totalPayable = +(disbursalAmount + totalInterest + penaltyInterest).toFixed(2);
                                maxPay = +(totalPayable - paidAmount).toFixed(2);
                                _state.label = 9;
                            case 9:
                                collectionDetails = [];
                                collections.forEach(function(item) {
                                    collectionDetails.push({
                                        date: item.createdDate,
                                        amount: item.collectedAmount,
                                        executive: item.executive || '',
                                        status: item.status,
                                        collectionStatus: item.collectionStatus,
                                        remark: item.remark
                                    });
                                });
                                return [
                                    2,
                                    this.serviceResponse(200, {
                                        loanDetails: {
                                            customerId: customerID,
                                            leadId: leadID,
                                            loanId: loanID,
                                            branch: branch,
                                            disbursedLoan: disbursalAmount,
                                            roi: roi,
                                            totalDays: totalDays,
                                            realDays: realDays,
                                            penaltyDays: penaltyDays,
                                            totalInterest: totalInterest,
                                            penaltyInterest: penaltyInterest,
                                            bouncingCharges: bouncingCharges,
                                            paidAmount: paidAmount,
                                            repaymentAmount: maxPay
                                        },
                                        collectionDetails: collectionDetails
                                    }, 'Waive Off Data Retrieved')
                                ];
                        }
                    });
                }).call(this);
            }
        },
        {
            key: "addMultipleLeads",
            value: function addMultipleLeads(leadIds, userId, userName) {
                return _async_to_generator(function() {
                    var db, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, leadId, leadDetail, userDetail, agentName, err, error;
                    return _ts_generator(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                db = getKnexInstance();
                                if (!db) {
                                    console.error('Failed to initialize the Knex instance.');
                                    return [
                                        2,
                                        this.serviceResponse(500, [], 'Internal Server Error')
                                    ];
                                }
                                if (!leadIds || leadIds.length === 0) {
                                    return [
                                        2,
                                        this.serviceResponse(400, [], 'Select at least one lead.')
                                    ];
                                }
                                _state.label = 1;
                            case 1:
                                _state.trys.push([
                                    1,
                                    13,
                                    ,
                                    14
                                ]);
                                _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
                                _state.label = 2;
                            case 2:
                                _state.trys.push([
                                    2,
                                    10,
                                    11,
                                    12
                                ]);
                                _iterator = leadIds[Symbol.iterator]();
                                _state.label = 3;
                            case 3:
                                if (!!(_iteratorNormalCompletion = (_step = _iterator.next()).done)) return [
                                    3,
                                    9
                                ];
                                leadId = _step.value;
                                if (!leadId) return [
                                    3,
                                    8
                                ];
                                return [
                                    4,
                                    this.leadModel.findOneAndUpdate({
                                        leadID: leadId
                                    }, {
                                        sanctionalloUID: userId,
                                        alloUID: userId.toString()
                                    })
                                ];
                            case 4:
                                _state.sent();
                                return [
                                    4,
                                    this.leadModel.findOneLead({
                                        leadID: leadId
                                    }, [
                                        '*'
                                    ])
                                ];
                            case 5:
                                leadDetail = _state.sent();
                                if (!leadDetail) return [
                                    3,
                                    8
                                ];
                                return [
                                    4,
                                    this.userModel.findOne({
                                        where: {
                                            userID: userId
                                        }
                                    })
                                ];
                            case 6:
                                userDetail = _state.sent();
                                agentName = userDetail ? userDetail.name : '';
                                return [
                                    4,
                                    this.callhistorylogsModel.insert({
                                        customerID: leadDetail.customerID,
                                        leadID: leadId,
                                        callType: 'IVR',
                                        status: CollectionStatus.LEAD_ALLOCATED.toString(),
                                        appAmount: ' ',
                                        noteli: ' ',
                                        remark: "Lead Allocated to ".concat(agentName, " By: ").concat(userName),
                                        callbackTime: new Date(new Date().toISOString().split('T')[0]),
                                        calledBy: userId,
                                        createdDate: new Date()
                                    })
                                ];
                            case 7:
                                _state.sent();
                                _state.label = 8;
                            case 8:
                                _iteratorNormalCompletion = true;
                                return [
                                    3,
                                    3
                                ];
                            case 9:
                                return [
                                    3,
                                    12
                                ];
                            case 10:
                                err = _state.sent();
                                _didIteratorError = true;
                                _iteratorError = err;
                                return [
                                    3,
                                    12
                                ];
                            case 11:
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
                            case 12:
                                return [
                                    2,
                                    this.serviceResponse(201, [], 'Lead Allocate Request Added Successfully')
                                ];
                            case 13:
                                error = _state.sent();
                                console.error('Error allocating leads:', error);
                                return [
                                    2,
                                    this.serviceResponse(500, null, 'Internal Server Error')
                                ];
                            case 14:
                                return [
                                    2
                                ];
                        }
                    });
                }).call(this);
            }
        },
        {
            key: "addWaiveOff",
            value: function addWaiveOff(customerId, leadId, loanId, amount, remark, userID, type) {
                return _async_to_generator(function() {
                    var _this, db, existingRequest, _ref, leadDetail, loanInfo, totalCollectedAmount, payAmount, updatedCollectedAmount, status, referenceNo, collectionId, collectionDetails, _ref1, collectionID;
                    return _ts_generator(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                db = getKnexInstance();
                                if (!db) {
                                    console.error('Failed to initialize the Knex instance.');
                                    return [
                                        2,
                                        this.serviceResponse(500, null, 'Internal Server Error')
                                    ];
                                }
                                if (!customerId || !leadId || !loanId || !amount || !remark) {
                                    return [
                                        2,
                                        this.serviceResponse(400, [], 'All input fields are required')
                                    ];
                                }
                                return [
                                    4,
                                    this.collectionModel.countCollection({
                                        customerID: customerId,
                                        leadID: leadId,
                                        collectedMode: CollectionStatus.WAIVE_OFF,
                                        collectionStatus: CollectionStatus.APPROVAL_WAITING
                                    })
                                ];
                            case 1:
                                existingRequest = _state.sent();
                                if (existingRequest > 0) {
                                    throw new BadRequestError('Only one waive-off request can be added at a time.');
                                }
                                return [
                                    4,
                                    Promise.all([
                                        db('leads').where({
                                            customerID: customerId,
                                            leadID: leadId
                                        }).first(),
                                        db('loan').where({
                                            customerID: customerId,
                                            leadID: leadId
                                        }).first()
                                    ])
                                ];
                            case 2:
                                _ref = _sliced_to_array.apply(void 0, [
                                    _state.sent(),
                                    2
                                ]), leadDetail = _ref[0], loanInfo = _ref[1];
                                if (!leadDetail || !loanInfo) {
                                    throw new BadRequestError('Lead or Loan information not found');
                                }
                                return [
                                    4,
                                    db('collection').where({
                                        customerID: customerId,
                                        leadID: leadId
                                    }).whereIn('collectionStatus', [
                                        CollectionStatus.APPROVED,
                                        CollectionStatus.APPROVAL_WAITING,
                                        CollectionStatus.APPROVAL_WAITING_REFUNDED
                                    ]).sum('collectedAmount as total').first()
                                ];
                            case 3:
                                totalCollectedAmount = ((_this = _state.sent()) === null || _this === void 0 ? void 0 : _this.total) || 0;
                                if (!(leadDetail.ipc === CollectionStatus.IPC)) return [
                                    3,
                                    5
                                ];
                                return [
                                    4,
                                    calculatePaydayAmountIPC(leadId, leadDetail.status)
                                ];
                            case 4:
                                payAmount = _state.sent();
                                return [
                                    3,
                                    7
                                ];
                            case 5:
                                return [
                                    4,
                                    calculateTotalRepayPaydayAmountNonIPC(leadId)
                                ];
                            case 6:
                                payAmount = _state.sent();
                                _state.label = 7;
                            case 7:
                                updatedCollectedAmount = totalCollectedAmount + amount;
                                // Validate against repayment amount
                                if (amount > (payAmount === null || payAmount === void 0 ? void 0 : payAmount.totalRepayAmount) || amount > payAmount) {
                                    throw new BadRequestError('Amount exceeds repayment limit');
                                }
                                status = updatedCollectedAmount === (payAmount === null || payAmount === void 0 ? void 0 : payAmount.totalRepayAmount) || updatedCollectedAmount === payAmount ? CollectionStatus.CLOSED : CollectionStatus.PART_PAYMENT;
                                referenceNo = "".concat(userID, "-").concat(Date.now(), "-").concat(Math.floor(1000 + Math.random() * 9000));
                                if (!(leadDetail.ipc === CollectionStatus.IPC)) return [
                                    3,
                                    10
                                ];
                                return [
                                    4,
                                    this.leadService.updateCollectedAmount(leadId, customerId, amount, status, moment().format('YYYY-MM-DD'), CollectionStatus.WAIVE_OFF, remark, "waiver_".concat(generateWaiverId()), 0, 0, CollectionStatus.APPROVAL_WAITING, userID, 'waiver', null, 1, '')
                                ];
                            case 8:
                                _state.sent();
                                return [
                                    4,
                                    this.collectionModel.findOne({
                                        where: {
                                            status: status,
                                            leadID: leadId,
                                            customerID: customerId,
                                            collectedMode: CollectedMode.WAIVE_OFF,
                                            collectedAmount: amount,
                                            collectedBy: userID,
                                            collectionStatus: CollectionStatus.APPROVAL_WAITING
                                        }
                                    })
                                ];
                            case 9:
                                collectionDetails = _state.sent();
                                collectionId = collectionDetails.collectionID;
                                return [
                                    3,
                                    13
                                ];
                            case 10:
                                return [
                                    4,
                                    db('collection').insert({
                                        customerID: customerId,
                                        leadID: leadId,
                                        loanNo: loanId,
                                        collectedAmount: amount,
                                        collectedMode: CollectionStatus.WAIVE_OFF,
                                        collectedDate: moment().format('YYYY-MM-DD'),
                                        referenceNo: referenceNo,
                                        // settlemenAmount: amount, // Commented
                                        // discount_waiver_amount: amount,
                                        discount_waiver: 'waiver',
                                        status: status,
                                        remark: remark,
                                        collectedBy: userID,
                                        createdDate: new Date().toISOString().replace('T', ' ').replace('Z', '').split('.')[0],
                                        collectionStatus: CollectionStatus.APPROVAL_WAITING,
                                        orderID: "waiver_".concat(generateWaiverId())
                                    })
                                ];
                            case 11:
                                _ref1 = _sliced_to_array.apply(void 0, [
                                    _state.sent(),
                                    1
                                ]), collectionID = _ref1[0];
                                return [
                                    4,
                                    db('waive_off_logs').insert({
                                        collectionID: collectionID,
                                        customerID: customerId,
                                        leadID: leadId,
                                        loanNo: loanId,
                                        userID: userID,
                                        collectedAmount: amount,
                                        status: status,
                                        collectedMode: CollectionStatus.WAIVE_OFF,
                                        collectionStatus: CollectionStatus.APPROVAL_WAITING,
                                        created_at: moment().format('YYYY-MM-DD')
                                    })
                                ];
                            case 12:
                                _state.sent();
                                collectionId = collectionID;
                                _state.label = 13;
                            case 13:
                                //create entry in waiver table
                                return [
                                    4,
                                    this.createWaiver(amount, leadDetail, userID, remark, type, collectionId)
                                ];
                            case 14:
                                _state.sent();
                                return [
                                    2,
                                    this.serviceResponse(201, null, 'Waive Off Request Added Successfully')
                                ];
                        }
                    });
                }).call(this);
            }
        },
        {
            key: "createWaiver",
            value: function createWaiver(amount, leadDetail, userID, remark, type, collectionID) {
                return _async_to_generator(function() {
                    var waiverDetails;
                    return _ts_generator(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                waiverDetails = {
                                    amount: amount,
                                    customer_id: leadDetail.customerID,
                                    created_by: userID,
                                    product: leadDetail.productID === 2 ? Products.PAYDAY : Products.EMI,
                                    lead_id: leadDetail.leadID,
                                    remarks: remark,
                                    type: type,
                                    expiration_time: type === WaiverType.TEMPORARY ? moment().endOf('day').format('YYYY-MM-DD HH:mm:ss') : null,
                                    collection_id: collectionID
                                };
                                return [
                                    4,
                                    this.waiverModel.create(waiverDetails)
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
            key: "find",
            value: function find(whereConditions, order, select, skip, take, collectionStartDate, collectionEndDate) {
                return _async_to_generator(function() {
                    var collections, error;
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
                                    this.collectionModel.getCollectionData(whereConditions, order, select, skip, take, collectionStartDate, collectionEndDate)
                                ];
                            case 1:
                                collections = _state.sent();
                                if (collections == null || collections.length == 0) {
                                    return [
                                        2,
                                        null
                                    ];
                                } else {
                                    return [
                                        2,
                                        collections
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
                    var collection_count, error;
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
                                    this.collectionModel.countCollection(where)
                                ];
                            case 1:
                                collection_count = _state.sent();
                                if (collection_count == null) {
                                    return [
                                        2,
                                        0
                                    ];
                                } else {
                                    return [
                                        2,
                                        collection_count // Return the first lead if found
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
            value: function create(customerID, leadID, loanNo, collectedAmount, collectedMode, collectedDate, referenceNo, discountAmount, settlemenAmount, status, remark, collectedBy, createdDate, collectionStatus, collectionStatusby, orderID) {
                return _async_to_generator(function() {
                    var insertId;
                    return _ts_generator(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                return [
                                    4,
                                    this.collectionModel.insert(customerID, leadID, loanNo, collectedAmount, collectedMode, collectedDate, referenceNo, discountAmount, settlemenAmount, status, remark, collectedBy, createdDate, collectionStatus, collectionStatusby, orderID)
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
                                    this.collectionModel.findOneAndUpdate(where, update)
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
            key: "collectionManagerV2",
            value: // async collectionManager(
            //   payload: ICollectionManagerPayload,
            //   pagination: IPagination,
            //   userID: number,
            // ) {
            //   const { searchString, type, collectionType } = payload
            //   const { skip, take } = pagination
            //   let result
            //   let responseArr = []
            //   switch (type) {
            //     case 'payday':
            //       const coll = this.customerModel.CustomerKnex.join(
            //         'collection as coll',
            //         'customer.customerID',
            //         '=',
            //         'coll.customerID',
            //       )
            //         .leftJoin('leads as l', 'l.leadID', '=', 'coll.leadID')
            //         .select(
            //           'coll.*',
            //           'customer.customerID',
            //           'customer.name',
            //           'customer.mobile',
            //           'customer.email',
            //         )
            //         .where('l.productID', '!=', 1)
            //       // .orderBy('coll.collectionID', 'desc')
            //       if (searchString) {
            //         coll.where(function () {
            //           this.where('customer.name', 'like', `%${searchString}%`)
            //             .orWhere('customer.mobile', 'like', `%${searchString}%`)
            //             .orWhere('customer.email', 'like', `%${searchString}%`)
            //         })
            //       }
            //       if (collectionType === CollectionType.APPROVED) {
            //         coll.where('coll.collectionStatus', CollectionStatus.APPROVED)
            //       } else if (collectionType === CollectionType.REJECTED) {
            //         coll.where('coll.collectionStatus', CollectionStatus.PAYMENT_REJECTED)
            //       } else {
            //         coll.where('coll.collectionStatus', CollectionStatus.APPROVAL_WAITING)
            //       }
            //       coll.orderBy('coll.collectionID', 'desc').offset(skip).limit(take)
            //       const collections = await coll
            //       for (const collection of collections) {
            //         result = await this.leadModel.LeadsKnex.join('loan', function () {
            //           this.on('leads.customerID', '=', 'loan.customerID').on(
            //             'leads.leadID',
            //             '=',
            //             'loan.leadID',
            //           )
            //         })
            //           .join('approval', function () {
            //             this.on('leads.customerID', '=', 'approval.customerID').on(
            //               'leads.leadID',
            //               '=',
            //               'approval.leadID',
            //             )
            //           })
            //           .leftJoin('collection', function () {
            //             this.on('leads.customerID', '=', 'collection.customerID')
            //               .on('leads.leadID', '=', 'collection.leadID')
            //               .andOn(
            //                 'collection.collectionStatus',
            //                 '=',
            //                 getKnexInstance().raw('?', [CollectionStatus.APPROVED]),
            //               )
            //               .andOn(
            //                 'collection.status',
            //                 '=',
            //                 getKnexInstance().raw('?', [CollectionStatus.CLOSED]),
            //               )
            //           })
            //           .where('leads.customerID', collection.customerID)
            //           .where('leads.leadID', collection.leadID)
            //           .select(
            //             'loan.disbursalDate',
            //             'loan.disbursalAmount',
            //             'approval.roi',
            //             'approval.repayDate',
            //             'leads.ipc',
            //             'collection.collectedDate',
            //           )
            //           .first()
            //         const collectionAmnt =
            //           (await this.collectionModel.CollectionKnex.where(
            //             'customerID',
            //             collection.customerID,
            //           )
            //             .where('leadID', collection.leadID)
            //             .where('collectionStatus', CollectionStatus.APPROVED)
            //             .sum('collectedAmount as totalCollectedAmount')) as {
            //             totalCollectedAmount: number | null
            //           }
            //         const [collectedBy, collectionStatusBy] = await Promise.all([
            //           this.userModel.findOne({
            //             where: { userID: collection.collectedBy },
            //             select: ['name'],
            //           }),
            //           this.userModel.findOne({
            //             where: { userID: collection.collectionStatusby },
            //             select: ['name'],
            //           }),
            //         ])
            //         result.collectedAmount =
            //           collectionAmnt[0].totalCollectedAmount ?? null // paid amount
            //         result.name = collection.name ?? null
            //         result.email = collection.email ?? null
            //         result.mobile = collection.mobile ?? null
            //         result.status = collection.status ?? null
            //         result.collectedMode = collection.collectedMode ?? null
            //         result.collectedBy = collectedBy?.name ?? null
            //         result.collectionStatusBy = collectionStatusBy?.name ?? null
            //         result.referenceNo = collection.referenceNo ?? null
            //         result.discountAmount = collection.disbursalAmount ?? null
            //         result.showApprovedRejectButton = false
            //         // result.disbursalAmount = loanamnt
            //         const collectedDate = momentTz(collection.collectedDate)
            //         const currentDate = momentTz().startOf('day')
            //         const collectedDateDiff = collectedDate.isAfter(currentDate)
            //         if (collectionType === CollectionType.APPROVAL_PENDING) {
            //           if (collectedDateDiff || userID == 29 || userID == 43) {
            //             result.showApprovedRejectButton = true
            //           }
            //         }
            //         responseArr.push(result)
            //       }
            //   }
            //   return this.serviceResponse(HttpStatusCode.Ok, responseArr, 'Data fetched')
            // }
            function collectionManagerV2(payload, pagination, userID) {
                return _async_to_generator(function() {
                    var customer_search, type, collectionType, start_date, end_date, collected_mode, skip, take, db, coll, _ref, totalCollectionsCount, collections, totalCollectionCount, totalCollectionPages, leadIds, collectionAmnt, colMap, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, collectAmt, i, _colMap_get, collection, totalCollectedAmount, collectedDate, currentDate, collectedDateDiff, lead, customer, approval, loan, totalAmount, totalAmount1, data, transactionStatus, customer1, _ref1, totalTransactionCount, transactions, totalTransactionsCount, totalTransactionPages;
                    return _ts_generator(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                customer_search = payload.customer_search, type = payload.type, collectionType = payload.collectionType, start_date = payload.start_date, end_date = payload.end_date, collected_mode = payload.collected_mode;
                                skip = pagination.skip, take = pagination.take;
                                db = getKnexInstance();
                                switch(type){
                                    case 'payday':
                                        return [
                                            3,
                                            1
                                        ];
                                    case 'emi':
                                        return [
                                            3,
                                            11
                                        ];
                                }
                                return [
                                    3,
                                    13
                                ];
                            case 1:
                                coll = this.customerModel.CustomerKnex.join('collection', 'customer.customerID', '=', 'collection.customerID').leftJoin('leads', 'leads.leadID', '=', 'collection.leadID').leftJoin('approval', 'approval.leadID', '=', 'collection.leadID').where('leads.productID', '!=', 1);
                                if (start_date && end_date) {
                                    coll.whereBetween('collection.collectedDate', [
                                        start_date,
                                        end_date
                                    ]);
                                } else if (start_date) {
                                    coll.where('collection.collectedDate', '>=', start_date);
                                } else if (end_date) {
                                    coll.where('collection.collectedDate', '<=', end_date);
                                }
                                if (collected_mode == CollectedMode.WAIVE_OFF) {
                                    coll.where('collection.collectedMode', CollectedMode.WAIVE_OFF);
                                }
                                if (customer_search) {
                                    coll.where(function() {
                                        this.where('customer.name', 'like', "%".concat(customer_search, "%")).orWhere('customer.mobile', 'like', "%".concat(customer_search, "%")).orWhere('customer.email', 'like', "%".concat(customer_search, "%"));
                                    });
                                }
                                if (collectionType === CollectionType.APPROVED) {
                                    coll.where('collection.collectionStatus', CollectionStatus.APPROVED);
                                } else if (collectionType === CollectionType.REJECTED) {
                                    coll.where('collection.collectionStatus', CollectionStatus.PAYMENT_REJECTED);
                                } else {
                                    coll.where('collection.collectionStatus', CollectionStatus.APPROVAL_WAITING);
                                }
                                return [
                                    4,
                                    Promise.all([
                                        coll.clone().count().first(),
                                        coll.clone().select('collection.leadID', 'collection.collectionID', 'collection.status', 'collection.collectedMode', 'collection.referenceNo', 'collection.remark', 'collection.loanNo', 'collection.createdDate as date', 'collection.approvedDate', 'collection.collectedDate as paymentDate', // 'collection.collectedAmount as paidAmount', // Paid Amount
                                        'collection.settlemenAmount as settlementAmount', 'collection.discountAmount', 'collection.collectedBy', 'collection.collectionStatusby as approvedBy', 'approval.loanAmtApproved as loanAmount', 'approval.roi', 'approval.repayDate', 'leads.status as leadStatus', 'leads.ipc', 'customer.customerID', 'customer.name', 'customer.mobile', 'customer.email').orderBy('collection.collectedDate', 'desc').offset(skip).limit(take)
                                    ])
                                ];
                            case 2:
                                _ref = _sliced_to_array.apply(void 0, [
                                    _state.sent(),
                                    2
                                ]), totalCollectionsCount = _ref[0], collections = _ref[1];
                                totalCollectionCount = +totalCollectionsCount['count(*)'];
                                totalCollectionPages = calculateTotalPages(totalCollectionCount, pagination.take);
                                // Calculate totalCollectedAmount
                                leadIds = _to_consumable_array(new Set(collections.map(function(coll) {
                                    return coll.leadID;
                                })));
                                return [
                                    4,
                                    this.collectionModel.CollectionKnex.whereIn('collection.leadID', leadIds).where('collectionStatus', CollectionStatus.APPROVED).select('collection.leadID').sum('collectedAmount as totalCollectedAmount').groupBy('collection.leadID')
                                ];
                            case 3:
                                collectionAmnt = _state.sent();
                                colMap = new Map();
                                _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
                                try {
                                    for(_iterator = collectionAmnt[Symbol.iterator](); !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true){
                                        collectAmt = _step.value;
                                        colMap.set(collectAmt.leadID, collectAmt.totalCollectedAmount);
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
                                i = 0;
                                _state.label = 4;
                            case 4:
                                if (!(i < collections.length)) return [
                                    3,
                                    9
                                ];
                                collection = collections[i];
                                totalCollectedAmount = (_colMap_get = colMap.get(collection.leadID)) !== null && _colMap_get !== void 0 ? _colMap_get : null;
                                collections[i].totalCollection = totalCollectedAmount;
                                collections[i].paidAmount = totalCollectedAmount;
                                collectedDate = momentTz(collection.collectedDate);
                                currentDate = momentTz().startOf('day');
                                collectedDateDiff = collectedDate.isAfter(currentDate);
                                if (collectionType === CollectionType.APPROVAL_PENDING) {
                                    if (collectedDateDiff || userID == 29 || userID == 43) {
                                        collections[i].showApprovedRejectButton = true;
                                    }
                                }
                                lead = {
                                    ipc: collection.ipc,
                                    status: collection.leadStatus,
                                    leadID: collection.leadID
                                };
                                customer = {
                                    customerID: collection.customerID
                                };
                                approval = {
                                    repayDate: collection.repayDate,
                                    roi: collection.roi
                                };
                                loan = {
                                    disbursalAmount: collection.loanAmount,
                                    disbursalDate: collection.disbursalDate,
                                    loanNo: collection.loanNo
                                };
                                if (!(collections[i].ipc === 1)) return [
                                    3,
                                    6
                                ];
                                return [
                                    4,
                                    this.loanService.calculateRepayAmountIpc(lead, customer, approval, loan, new Date())
                                ];
                            case 5:
                                totalAmount = _state.sent();
                                collections[i].repaymentAmount = totalAmount.totalPayableAmount;
                                return [
                                    3,
                                    8
                                ];
                            case 6:
                                return [
                                    4,
                                    checkRepaymentAmountV2(collection.leadID)
                                ];
                            case 7:
                                totalAmount1 = _state.sent();
                                collections[i].repaymentAmount = totalAmount1.Remanning_Amount;
                                _state.label = 8;
                            case 8:
                                i++;
                                return [
                                    3,
                                    4
                                ];
                            case 9:
                                return [
                                    4,
                                    this.commonHelper.getUserNamesByIds(collections, [
                                        'collectedBy',
                                        'approvedBy'
                                    ])
                                ];
                            case 10:
                                data = _state.sent();
                                return [
                                    2,
                                    this.serviceResponse(HttpStatusCode.Ok, {
                                        totalRecords: totalCollectionCount,
                                        totalPages: totalCollectionPages,
                                        results: data,
                                        type: type
                                    }, 'Fetched')
                                ];
                            case 11:
                                transactionStatus = 0;
                                if (collectionType === CollectionType.APPROVED) {
                                    transactionStatus = 3;
                                } else if (collectionType === CollectionType.REJECTED) {
                                    transactionStatus = 4;
                                } else {
                                    transactionStatus = 2;
                                }
                                customer1 = this.customerModel.CustomerKnex.leftJoin('transactions as tr', 'tr.customerID', '=', 'customer.customerID').leftJoin('users as usr', 'usr.userID', '=', 'tr.createdBy').where('tr.status', transactionStatus).where('tr.emiID', 0);
                                if (start_date && end_date) {
                                    customer1.whereBetween('tr.createdAt', [
                                        start_date,
                                        end_date
                                    ]);
                                }
                                if (collected_mode == CollectedMode.WAIVE_OFF) {
                                    customer1.where('tr.mode', CollectedMode.WAIVE_OFF);
                                }
                                if (customer_search) {
                                    customer1.where(function() {
                                        this.where('customer.name', 'like', "%".concat(customer_search, "%")).orWhere('customer.mobile', 'like', "%".concat(customer_search, "%")).orWhere('customer.email', 'like', "%".concat(customer_search, "%"));
                                    });
                                }
                                return [
                                    4,
                                    Promise.all([
                                        customer1.clone().count().first(),
                                        customer1.clone().select('tr.leadID', 'tr.loanNo', 'tr.mode as paymentMode', 'tr.transactionDate', 'tr.createdAt', 'tr.referenceNo', 'tr.remarks', 'customer.name', 'customer.email', 'customer.mobile', 'tr.payment_transaction_status as paymentStatus', 'tr.waiver', 'tr.id as transactionID', 'tr.leadID as leadID', db.raw("CONVERT(tr.amount, SIGNED) as amount"), db.raw("CASE\n                WHEN tr.status = 2 THEN true\n                ELSE false\n                END AS showApprovedRejectButton"), db.raw("CASE\n                  WHEN tr.status = 1 THEN 'Captured'\n                  WHEN tr.status = 2 THEN 'Pending'\n                  WHEN tr.status = 3 THEN 'Approved'\n                  WHEN tr.status = 4 THEN 'Rejected'\n                  ELSE 'Failed'\n                  END AS status"), 'usr.name as createdBy').orderBy('tr.createdAt', 'asec').offset(skip).limit(take)
                                    ])
                                ];
                            case 12:
                                _ref1 = _sliced_to_array.apply(void 0, [
                                    _state.sent(),
                                    2
                                ]), totalTransactionCount = _ref1[0], transactions = _ref1[1];
                                totalTransactionsCount = +totalTransactionCount['count(*)'];
                                totalTransactionPages = calculateTotalPages(totalTransactionsCount, pagination.take);
                                return [
                                    2,
                                    this.serviceResponse(HttpStatusCode.Ok, {
                                        totalRecords: totalTransactionsCount,
                                        totalPages: totalTransactionPages,
                                        results: transactions,
                                        type: type
                                    }, 'Fetched')
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
            key: "downloadCollectionManager",
            value: function downloadCollectionManager(payload, pagination, userID) {
                return _async_to_generator(function() {
                    var data, type, collectionData, emiData, mappedData;
                    return _ts_generator(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                return [
                                    4,
                                    this.collectionManagerV2(payload, pagination, userID)
                                ];
                            case 1:
                                data = _state.sent().data;
                                type = payload.type;
                                switch(type){
                                    case 'payday':
                                        collectionData = data.results;
                                        mappedData = collectionData.map(function(collection) {
                                            var data = {
                                                'Approved By': collection.approvedByName,
                                                'Approved Date': collection.approvedDate ? momentTz(collection.approvedDate).startOf('day').format('YYYY-MM-DD') : '',
                                                'Collected By': collection.collectedByName,
                                                'Collected Mode': collection.collectedMode,
                                                'Discount Amount': collection.discountAmount,
                                                'Loan Amount': collection.loanAmount,
                                                'Loan Number': collection.loanNo,
                                                'Paid Amount': collection.paidAmount,
                                                'Payment Date': collection.paymentDate ? momentTz(collection.paymentDate).startOf('day').format('YYYY-MM-DD') : '',
                                                'Reference Number': collection.referenceNo,
                                                'Repay Date': collection.repayDate ? momentTz(collection.repayDate).startOf('day').format('YYYY-MM-DD') : '',
                                                'Repayment Amount': collection.repaymentAmount,
                                                'Settlement Amount': collection.settlementAmount,
                                                'Total Collection': collection.totalCollection,
                                                Date: collection.date ? momentTz(collection.date).startOf('day').format('YYYY-MM-DD') : '',
                                                Email: collection.email,
                                                Mobile: collection.mobile,
                                                Name: collection.name,
                                                Remark: collection.remark,
                                                Status: collection.status
                                            };
                                            return data;
                                        });
                                        break;
                                    case 'emi':
                                        emiData = data.results;
                                        mappedData = emiData.map(function(emi) {
                                            var data = {
                                                'Created At': emi.createdAt,
                                                'Created By': emi.createdBy,
                                                'Loan Number': emi.loanNo,
                                                'Payment Mode': emi.paymentMode,
                                                'Reference Number': emi.referenceNo,
                                                'Transaction Date': emi.transactionDate ? momentTz(emi.transactionDate).startOf('day').format('YYYY-MM-DD') : '',
                                                'Transaction Status': emi.paymentStatus,
                                                Amount: emi.amount,
                                                Email: emi.email,
                                                Mobile: emi.mobile,
                                                Name: emi.name,
                                                Remarks: emi.remarks,
                                                Status: emi.status,
                                                Waiver: emi.waiver
                                            };
                                            return data;
                                        });
                                }
                                return [
                                    2,
                                    this.serviceResponse(HttpStatusCode.Ok, mappedData, 'CSV Created')
                                ];
                        }
                    });
                }).call(this);
            }
        },
        {
            key: "collectionManagerAction",
            value: function collectionManagerAction(payload, userID) {
                return _async_to_generator(function() {
                    var collectionID, transactionID, action, type, db, apiService, resp, data, collection, _collection_lead, leadID, ipc, customerID, collectedAmount, status, collectedDate, discountAmount, settlemenAmount, manualApprovedPayment, isBackDate, repaymentData, _ref, updatedCollection, waiverDetails, appWaitingCollection, currentDate, transactionStatus;
                    return _ts_generator(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                collectionID = payload.collectionID, transactionID = payload.transactionID, action = payload.action, type = payload.type;
                                db = getKnexInstance();
                                if (!(type === 'emi')) return [
                                    3,
                                    5
                                ];
                                if (!(action === 'Rejected')) return [
                                    3,
                                    2
                                ];
                                return [
                                    4,
                                    this.transactionModel.findOneAndUpdate({
                                        id: transactionID
                                    }, {
                                        status: 4
                                    })
                                ];
                            case 1:
                                _state.sent();
                                return [
                                    3,
                                    4
                                ];
                            case 2:
                                apiService = new AxiosService(this.commonHelper.getBaseUrl() + '/new-api');
                                return [
                                    4,
                                    apiService.call('post', '/customers/updateEMIManualPayment', {
                                        transactionID: transactionID
                                    }, undefined, {
                                        api_key: config.nodeApiKey,
                                        api_secret: config.nodeApiSecret
                                    })
                                ];
                            case 3:
                                resp = _state.sent();
                                data = resp.data;
                                if (!resp.success) {
                                    throw new BadRequestError(data.message);
                                }
                                _state.label = 4;
                            case 4:
                                return [
                                    2,
                                    this.serviceResponse(HttpStatusCode.Ok, {}, 'Success')
                                ];
                            case 5:
                                return [
                                    4,
                                    this.collectionModel.CollectionKnex.where({
                                        collectionID: collectionID
                                    }).leftJoin('leads as l', 'l.leadID', '=', 'collection.leadID').select('collection.collectedDate', 'collection.customerID', 'collection.collectedAmount', 'collection.status', 'collection.discountAmount', 'collection.settlemenAmount', db.raw("JSON_OBJECT('leadID', l.leadID,'ipc',l.ipc) as 'lead'")).first()
                                ];
                            case 6:
                                collection = _state.sent();
                                if (!collection) {
                                    throw new NotFoundError('Collection not found');
                                }
                                if (!(collection === null || collection === void 0 ? void 0 : collection.lead)) {
                                    throw new NotFoundError('Lead not found');
                                }
                                _collection_lead = collection.lead, leadID = _collection_lead.leadID, ipc = _collection_lead.ipc, customerID = collection.customerID, collectedAmount = collection.collectedAmount, status = collection.status, collectedDate = collection.collectedDate, discountAmount = collection.discountAmount, settlemenAmount = collection.settlemenAmount;
                                return [
                                    4,
                                    this.collectionModel.findOne({
                                        where: {
                                            leadID: leadID,
                                            collectionStatus: CollectionStatus.APPROVED
                                        },
                                        select: [
                                            'collectedDate'
                                        ],
                                        order: [
                                            {
                                                column: 'collectionID',
                                                order: 'desc'
                                            }
                                        ]
                                    })
                                ];
                            case 7:
                                manualApprovedPayment = _state.sent();
                                isBackDate = false;
                                if (manualApprovedPayment && manualApprovedPayment.collectedDate && manualApprovedPayment.collectedDate.getTime() > collectedDate.getTime()) {
                                    isBackDate = true;
                                }
                                if (!(manualApprovedPayment && ipc === 1 && action === 'Accepted')) return [
                                    3,
                                    9
                                ];
                                return [
                                    4,
                                    this.approvedCollectionUpdate(leadID, collectionID, collectedAmount, status, collectedDate, discountAmount, settlemenAmount)
                                ];
                            case 8:
                                repaymentData = _state.sent();
                                if (!repaymentData.success) {
                                    throw new BadRequestError('This seems to be a back date payment, after re-calculation the repay amount is ' + repaymentData.repaymentData.totalPayableAmount + ' greater than collected amount ' + collectedAmount);
                                }
                                _state.label = 9;
                            case 9:
                                return [
                                    4,
                                    Promise.all([
                                        this.collectionModel.findOne({
                                            where: {
                                                collectionID: collectionID
                                            },
                                            select: [
                                                'collectionID',
                                                'status',
                                                'referenceNo',
                                                'leadID'
                                            ]
                                        }),
                                        this.waiverModel.findOne({
                                            where: {
                                                lead_id: leadID,
                                                customer_id: customerID,
                                                status: WaiverStatus.PENDING
                                            }
                                        })
                                    ])
                                ];
                            case 10:
                                _ref = _sliced_to_array.apply(void 0, [
                                    _state.sent(),
                                    2
                                ]), updatedCollection = _ref[0], waiverDetails = _ref[1];
                                if (!(action === 'Accepted')) return [
                                    3,
                                    12
                                ];
                                return [
                                    4,
                                    this.collectionModel.findOne({
                                        where: {
                                            collectionStatus: CollectionStatus.APPROVAL_WAITING,
                                            leadID: leadID
                                        },
                                        select: [
                                            'collectionID'
                                        ],
                                        order: [
                                            {
                                                column: 'createdDate',
                                                order: 'asc'
                                            }
                                        ]
                                    })
                                ];
                            case 11:
                                appWaitingCollection = _state.sent();
                                if (appWaitingCollection && appWaitingCollection.collectionID !== updatedCollection.collectionID) {
                                    if ((updatedCollection === null || updatedCollection === void 0 ? void 0 : updatedCollection.status) && updatedCollection.status === CollectionStatus.CLOSED) {
                                        throw new BadRequestError('Please approve Part Payment, order by date for this client');
                                    }
                                }
                                _state.label = 12;
                            case 12:
                                currentDate = momentTz();
                                return [
                                    4,
                                    this.collectionModel.findOneAndUpdate({
                                        collectionID: collectionID
                                    }, {
                                        collectionStatus: action === 'Accepted' ? String(CollectionStatus.APPROVED) : String(CollectionStatus.REJECTED),
                                        collectionStatusby: userID.toString(),
                                        approvedDate: currentDate.format('YYYY-MM-DD HH:mm:ss')
                                    })
                                ];
                            case 13:
                                _state.sent();
                                transactionStatus = action === 'Accepted' ? 2 : 3;
                                return [
                                    4,
                                    this.transactionModel.findOneAndUpdate({
                                        collectionID: collectionID
                                    }, {
                                        status: transactionStatus
                                    })
                                ];
                            case 14:
                                _state.sent();
                                if (!(action === 'Accepted')) return [
                                    3,
                                    20
                                ];
                                return [
                                    4,
                                    this.leadModel.findOneAndUpdate({
                                        leadID: leadID
                                    }, {
                                        status: updatedCollection.status === CollectionStatus.CLOSED ? LeadStatus.CLOSED : updatedCollection.status === CollectionStatus.PART_PAYMENT ? LeadStatus.PART_PAYMENT : updatedCollection.status === CollectionStatus.SETTLEMENT ? LeadStatus.SETTLEMENT : LeadStatus.APPROVED
                                    })
                                ];
                            case 15:
                                _state.sent();
                                if (!(updatedCollection.referenceNo !== 'no')) return [
                                    3,
                                    17
                                ];
                                return [
                                    4,
                                    this.onlinePaymentModel.findOneAndUpdate({
                                        razorpayOrderId: updatedCollection.referenceNo
                                    }, {
                                        status: updatedCollection.status.toString()
                                    })
                                ];
                            case 16:
                                _state.sent();
                                _state.label = 17;
                            case 17:
                                if (!(updatedCollection.status === CollectionStatus.CLOSED)) return [
                                    3,
                                    20
                                ];
                                if (!waiverDetails) return [
                                    3,
                                    19
                                ];
                                return [
                                    4,
                                    this.waiverModel.findOneAndUpdate({
                                        id: waiverDetails.id
                                    }, {
                                        is_paid: action === 'Accepted' ? true : false,
                                        status: action === 'Accepted' ? WaiverStatus.APPROVED : WaiverStatus.REJECTED,
                                        updated_at: moment().format('YYYY-MM-DD HH:mm:ss'),
                                        updated_by: userID,
                                        approved_date: action === 'Accepted' ? moment().format('YYYY-MM-DD') : null
                                    })
                                ];
                            case 18:
                                _state.sent();
                                _state.label = 19;
                            case 19:
                                return [
                                    2,
                                    this.serviceResponse(HttpStatusCode.Ok, {}, 'Success')
                                ];
                            case 20:
                                if (!waiverDetails) return [
                                    3,
                                    22
                                ];
                                return [
                                    4,
                                    this.waiverModel.findOneAndUpdate({
                                        id: waiverDetails.id
                                    }, {
                                        is_paid: action === 'Accepted' ? true : false,
                                        status: action === 'Accepted' ? WaiverStatus.APPROVED : WaiverStatus.REJECTED,
                                        updated_at: moment().format('YYYY-MM-DD HH:mm:ss'),
                                        updated_by: userID,
                                        approved_date: action === 'Accepted' ? moment().format('YYYY-MM-DD') : null
                                    })
                                ];
                            case 21:
                                _state.sent();
                                _state.label = 22;
                            case 22:
                                return [
                                    2,
                                    this.serviceResponse(HttpStatusCode.Ok, {}, 'Success')
                                ];
                        }
                    });
                }).call(this);
            }
        },
        {
            key: "collectionManagerActionForMultiple",
            value: function collectionManagerActionForMultiple(payload, userID) {
                return _async_to_generator(function() {
                    var ids, action, type, db, failedIds, successCount, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, transactionID, apiService, resp, data, error, err, collections, _iteratorNormalCompletion1, _didIteratorError1, _iteratorError1, _iterator1, _step1, collection, _collection_lead, leadID, ipc, customerID, collectedAmount, status, collectedDate, discountAmount, settlemenAmount, referenceNo, manualApprovedPayment, isBackDate, repaymentData, appWaitingCollection, updatedCollection, transactionStatus, error1, err, responseMessage;
                    return _ts_generator(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                ids = payload.ids, action = payload.action, type = payload.type;
                                db = getKnexInstance();
                                failedIds = [];
                                successCount = 0;
                                if (!Array.isArray(ids) || ids.length === 0) {
                                    throw new BadRequestError('Invalid ID list');
                                }
                                if (!(type === 'emi')) return [
                                    3,
                                    14
                                ];
                                _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
                                _state.label = 1;
                            case 1:
                                _state.trys.push([
                                    1,
                                    11,
                                    12,
                                    13
                                ]);
                                _iterator = ids[Symbol.iterator]();
                                _state.label = 2;
                            case 2:
                                if (!!(_iteratorNormalCompletion = (_step = _iterator.next()).done)) return [
                                    3,
                                    10
                                ];
                                transactionID = _step.value;
                                _state.label = 3;
                            case 3:
                                _state.trys.push([
                                    3,
                                    8,
                                    ,
                                    9
                                ]);
                                if (!(action === 'Rejected')) return [
                                    3,
                                    5
                                ];
                                return [
                                    4,
                                    this.transactionModel.findOneAndUpdate({
                                        id: transactionID
                                    }, {
                                        status: 4
                                    })
                                ];
                            case 4:
                                _state.sent();
                                successCount++;
                                return [
                                    3,
                                    7
                                ];
                            case 5:
                                apiService = new AxiosService(this.commonHelper.getBaseUrl() + '/new-api');
                                return [
                                    4,
                                    apiService.call('post', '/customers/updateEMIManualPayment', {
                                        transactionID: transactionID
                                    }, undefined, {
                                        api_key: config.nodeApiKey,
                                        api_secret: config.nodeApiSecret
                                    })
                                ];
                            case 6:
                                resp = _state.sent();
                                data = resp.data;
                                if (!resp.success) {
                                    throw new BadRequestError(data.message);
                                }
                                successCount++;
                                _state.label = 7;
                            case 7:
                                return [
                                    3,
                                    9
                                ];
                            case 8:
                                error = _state.sent();
                                failedIds.push({
                                    id: transactionID,
                                    error: error.message
                                });
                                return [
                                    3,
                                    9
                                ];
                            case 9:
                                _iteratorNormalCompletion = true;
                                return [
                                    3,
                                    2
                                ];
                            case 10:
                                return [
                                    3,
                                    13
                                ];
                            case 11:
                                err = _state.sent();
                                _didIteratorError = true;
                                _iteratorError = err;
                                return [
                                    3,
                                    13
                                ];
                            case 12:
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
                            case 13:
                                return [
                                    3,
                                    37
                                ];
                            case 14:
                                return [
                                    4,
                                    this.collectionModel.CollectionKnex.whereIn('collectionID', ids).leftJoin('leads as l', 'l.leadID', '=', 'collection.leadID').select('collection.collectionID', 'collection.collectedDate', 'collection.customerID', 'collection.collectedAmount', 'collection.status', 'collection.discountAmount', 'collection.settlemenAmount', 'collection.referenceNo', db.raw("JSON_OBJECT('leadID', l.leadID, 'ipc', l.ipc) as 'lead'"))
                                ];
                            case 15:
                                collections = _state.sent();
                                if (!collections.length) {
                                    throw new NotFoundError('Collections not found');
                                }
                                _iteratorNormalCompletion1 = true, _didIteratorError1 = false, _iteratorError1 = undefined;
                                _state.label = 16;
                            case 16:
                                _state.trys.push([
                                    16,
                                    35,
                                    36,
                                    37
                                ]);
                                _iterator1 = collections[Symbol.iterator]();
                                _state.label = 17;
                            case 17:
                                if (!!(_iteratorNormalCompletion1 = (_step1 = _iterator1.next()).done)) return [
                                    3,
                                    34
                                ];
                                collection = _step1.value;
                                _state.label = 18;
                            case 18:
                                _state.trys.push([
                                    18,
                                    32,
                                    ,
                                    33
                                ]);
                                _collection_lead = collection.lead, leadID = _collection_lead.leadID, ipc = _collection_lead.ipc, customerID = collection.customerID, collectedAmount = collection.collectedAmount, status = collection.status, collectedDate = collection.collectedDate, discountAmount = collection.discountAmount, settlemenAmount = collection.settlemenAmount, referenceNo = collection.referenceNo;
                                return [
                                    4,
                                    this.collectionModel.findOne({
                                        where: {
                                            leadID: leadID,
                                            collectionStatus: CollectionStatus.APPROVED
                                        },
                                        select: [
                                            'collectedDate'
                                        ],
                                        order: [
                                            {
                                                column: 'collectionID',
                                                order: 'desc'
                                            }
                                        ]
                                    })
                                ];
                            case 19:
                                manualApprovedPayment = _state.sent();
                                isBackDate = false;
                                if (manualApprovedPayment && manualApprovedPayment.collectedDate && manualApprovedPayment.collectedDate.getTime() > collectedDate.getTime()) {
                                    isBackDate = true;
                                }
                                if (!(manualApprovedPayment && ipc === 1 && action === 'Accepted')) return [
                                    3,
                                    21
                                ];
                                return [
                                    4,
                                    this.approvedCollectionUpdate(leadID, collection.collectionID, collectedAmount, status, collectedDate, discountAmount, settlemenAmount)
                                ];
                            case 20:
                                repaymentData = _state.sent();
                                if (!repaymentData.success) {
                                    throw new BadRequestError('This seems to be a back date payment, after re-calculation the repay amount is ' + repaymentData.repaymentData.totalPayableAmount + ' greater than collected amount ' + collectedAmount);
                                }
                                _state.label = 21;
                            case 21:
                                return [
                                    4,
                                    this.collectionModel.findOne({
                                        where: {
                                            collectionStatus: CollectionStatus.APPROVAL_WAITING,
                                            leadID: leadID
                                        },
                                        select: [
                                            'collectionID'
                                        ],
                                        order: [
                                            {
                                                column: 'createdDate',
                                                order: 'asc'
                                            }
                                        ]
                                    })
                                ];
                            case 22:
                                appWaitingCollection = _state.sent();
                                if (appWaitingCollection && appWaitingCollection.collectionID !== collection.collectionID) {
                                    if (status === CollectionStatus.CLOSED) {
                                        throw new BadRequestError("".concat(collection, " Please approve Part Payment, order by date for this client"));
                                    }
                                }
                                return [
                                    4,
                                    this.collectionModel.findOneAndUpdate({
                                        collectionID: collection.collectionID
                                    }, {
                                        collectionStatus: action === 'Accepted' ? String(CollectionStatus.APPROVED) : String(CollectionStatus.REJECTED),
                                        collectionStatusby: userID.toString(),
                                        approvedDate: momentTz().format('YYYY-MM-DD HH:mm:ss')
                                    })
                                ];
                            case 23:
                                _state.sent();
                                return [
                                    4,
                                    this.collectionModel.findOne({
                                        where: {
                                            collectionID: collection.collectionID
                                        },
                                        select: [
                                            'collectionID',
                                            'status',
                                            'referenceNo',
                                            'leadID'
                                        ]
                                    })
                                ];
                            case 24:
                                updatedCollection = _state.sent();
                                transactionStatus = action === 'Accepted' ? 2 : 3;
                                return [
                                    4,
                                    this.transactionModel.findOneAndUpdate({
                                        collectionID: collection.collectionID
                                    }, {
                                        status: transactionStatus
                                    })
                                ];
                            case 25:
                                _state.sent();
                                if (!(action === 'Accepted')) return [
                                    3,
                                    29
                                ];
                                return [
                                    4,
                                    this.leadModel.findOneAndUpdate({
                                        leadID: leadID
                                    }, {
                                        status: updatedCollection.status === CollectionStatus.CLOSED ? LeadStatus.CLOSED : updatedCollection.status === CollectionStatus.PART_PAYMENT ? LeadStatus.PART_PAYMENT : updatedCollection.status === CollectionStatus.SETTLEMENT ? LeadStatus.SETTLEMENT : LeadStatus.APPROVED
                                    })
                                ];
                            case 26:
                                _state.sent();
                                if (!(referenceNo !== 'no')) return [
                                    3,
                                    28
                                ];
                                return [
                                    4,
                                    this.onlinePaymentModel.findOneAndUpdate({
                                        razorpayOrderId: referenceNo
                                    }, {
                                        status: status.toString()
                                    })
                                ];
                            case 27:
                                _state.sent();
                                _state.label = 28;
                            case 28:
                                return [
                                    3,
                                    31
                                ];
                            case 29:
                                if (!(action === 'Rejected')) return [
                                    3,
                                    31
                                ];
                                return [
                                    4,
                                    this.leadModel.findOneAndUpdate({
                                        leadID: leadID
                                    }, {
                                        status: updatedCollection.status === CollectionStatus.CLOSED ? LeadStatus.CLOSED : updatedCollection.status === CollectionStatus.PART_PAYMENT ? LeadStatus.PART_PAYMENT : updatedCollection.status === CollectionStatus.SETTLEMENT ? LeadStatus.SETTLEMENT : LeadStatus.APPROVED
                                    })
                                ];
                            case 30:
                                _state.sent();
                                _state.label = 31;
                            case 31:
                                successCount++;
                                return [
                                    3,
                                    33
                                ];
                            case 32:
                                error1 = _state.sent();
                                failedIds.push({
                                    id: collection.collectionID,
                                    error: error1.message
                                });
                                return [
                                    3,
                                    33
                                ];
                            case 33:
                                _iteratorNormalCompletion1 = true;
                                return [
                                    3,
                                    17
                                ];
                            case 34:
                                return [
                                    3,
                                    37
                                ];
                            case 35:
                                err = _state.sent();
                                _didIteratorError1 = true;
                                _iteratorError1 = err;
                                return [
                                    3,
                                    37
                                ];
                            case 36:
                                try {
                                    if (!_iteratorNormalCompletion1 && _iterator1.return != null) {
                                        _iterator1.return();
                                    }
                                } finally{
                                    if (_didIteratorError1) {
                                        throw _iteratorError1;
                                    }
                                }
                                return [
                                    7
                                ];
                            case 37:
                                responseMessage = 'Multiple payments are pending approval.';
                                if (successCount === ids.length) {
                                    responseMessage = action === 'Accepted' ? 'All payments have been approved' : 'All payments have been rejected';
                                }
                                return [
                                    2,
                                    this.serviceResponse(HttpStatusCode.Ok, {
                                        failedIds: failedIds
                                    }, responseMessage)
                                ];
                        }
                    });
                }).call(this);
            }
        },
        {
            key: "approvedCollectionUpdate",
            value: // async collectionManagerActionForMultiple(
            //   payload: ICollectionManagerActionPayloadForMultiple,
            //   userID: number,
            // ) {
            //   const { collectionIDs, transactionIDs, action, type } = payload
            //   const db = getKnexInstance()
            //   const appWaitingCollection = await db('collection')
            //     .where('collectionStatus', CollectionStatus.APPROVAL_WAITING as unknown as string)
            //     .whereIn('collectionID', collectionIDs)
            //     .select('collectionID')
            //     .orderBy('createdDate', 'asec')
            //   console.log(appWaitingCollection, 'ram fin')
            //   const collectionPromises =
            //     appWaitingCollection?.map(async collectionID => {
            //       const payload: ICollectionManagerActionPayload = {
            //         collectionID: collectionID.collectionID,
            //         transactionID: null,
            //         action,
            //         type,
            //       }
            //       return this.collectionManagerAction(payload, userID)
            //     }) || []
            //   const transactionPromises =
            //     transactionIDs?.map(async id => {
            //       const payload: ICollectionManagerActionPayload = {
            //         collectionID: null,
            //         transactionID: id,
            //         action,
            //         type,
            //       }
            //       return this.collectionManagerAction(payload, userID)
            //     }) || []
            //   const results = await Promise.all([...collectionPromises, ...transactionPromises])
            //   return this.serviceResponse(HttpStatusCode.Ok, results, 'Success')
            // }
            function approvedCollectionUpdate(leadID, collectionID, collectedAmount, status, collectedDate, discountAmount, settlementAmount) {
                return _async_to_generator(function() {
                    var repaymentData, totalPayableAmount, dpdCharges, totalInt, principle, collectedInterest, collectedPrinciple, collectedPenalty, repayAmount, penaltyCharges, totalInterest, principalAmount, actualTotalInterest, actualPenaltyCharge, excessAmount, openingBalance, closingBalance, checkPrincipal, principleAmountOver, data, collectDate, currentDate;
                    return _ts_generator(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                return [
                                    4,
                                    this.loanService.calculateRepayAmountIpcV2(leadID, collectedDate)
                                ];
                            case 1:
                                repaymentData = _state.sent();
                                totalPayableAmount = repaymentData.totalPayableAmount, dpdCharges = repaymentData.dpdCharges, totalInt = repaymentData.totalInterest, principle = repaymentData.principalAmount;
                                collectedInterest = 0;
                                collectedPrinciple = 0;
                                collectedPenalty = 0;
                                repayAmount = totalPayableAmount;
                                penaltyCharges = dpdCharges;
                                totalInterest = totalInt;
                                principalAmount = principle;
                                actualTotalInterest = totalInt;
                                actualPenaltyCharge = penaltyCharges;
                                excessAmount = 0;
                                openingBalance = null;
                                closingBalance = null;
                                checkPrincipal = false;
                                principleAmountOver = 0;
                                if (repayAmount > collectedAmount && status === CollectionStatus.CLOSED) {
                                    return [
                                        2,
                                        {
                                            success: false,
                                            repaymentData: repaymentData
                                        }
                                    ];
                                }
                                switch(status){
                                    case CollectionStatus.CLOSED:
                                        excessAmount = collectedAmount - repayAmount;
                                        openingBalance = repayAmount;
                                        closingBalance = 0;
                                        collectedInterest = totalInterest;
                                        collectedPrinciple = principalAmount;
                                        collectedPenalty = penaltyCharges;
                                        principalAmount = 0;
                                        if (collectedAmount - repayAmount >= 0) {
                                            penaltyCharges = 0;
                                            totalInterest = 0;
                                        }
                                        break;
                                    case CollectionStatus.PART_PAYMENT:
                                        openingBalance = repayAmount;
                                        closingBalance = 0;
                                        if (repayAmount === collectedAmount) {
                                            status = CollectionStatus.CLOSED;
                                            collectedInterest = totalInterest;
                                            collectedPrinciple = principalAmount;
                                            collectedPenalty = penaltyCharges;
                                            principalAmount = 0;
                                            totalInterest = 0;
                                            penaltyCharges = 0;
                                        } else if (repayAmount < collectedAmount) {
                                            excessAmount = collectedAmount - repayAmount > 0 ? collectedAmount - repayAmount : 0;
                                            status = CollectionStatus.CLOSED;
                                            collectedInterest = totalInterest;
                                            collectedPrinciple = principalAmount;
                                            collectedPenalty = penaltyCharges;
                                            principalAmount = 0;
                                            totalInterest = 0;
                                            penaltyCharges = 0;
                                        } else {
                                            closingBalance = repayAmount - collectedAmount;
                                            if (collectedAmount > totalInterest) {
                                                if (totalInterest === 0 && collectedAmount >= principalAmount) {
                                                    collectedPrinciple = principalAmount;
                                                } else if (totalInterest === 0 && collectedAmount < principalAmount) {
                                                    collectedPrinciple = collectedAmount;
                                                } else {
                                                    collectedPrinciple = collectedAmount - totalInterest;
                                                    if (collectedAmount > principalAmount + totalInterest) {
                                                        checkPrincipal = true;
                                                        principleAmountOver = principalAmount;
                                                    }
                                                }
                                                totalInterest = 0;
                                                principalAmount -= collectedPrinciple;
                                                collectedInterest = actualTotalInterest - totalInterest;
                                                if (principalAmount < 0) {
                                                    penaltyCharges += principalAmount;
                                                    principalAmount = 0;
                                                    if (penaltyCharges < 0) {
                                                        penaltyCharges = 0;
                                                    }
                                                } else {
                                                    penaltyCharges = actualPenaltyCharge - (collectedAmount - collectedPrinciple - collectedInterest) > 0 ? actualPenaltyCharge - (collectedAmount - collectedPrinciple - collectedInterest) : 0.0;
                                                }
                                                if (checkPrincipal === true) {
                                                    collectedPrinciple = principleAmountOver;
                                                    principalAmount = 0;
                                                }
                                                collectedInterest = actualTotalInterest - totalInterest;
                                                collectedPenalty = actualPenaltyCharge - penaltyCharges > 0 ? actualPenaltyCharge - penaltyCharges : 0.0;
                                                if (collectedInterest === 0 && collectedPrinciple === 0) {
                                                    collectedPenalty = collectedAmount;
                                                    penaltyCharges = actualPenaltyCharge - collectedPenalty;
                                                }
                                            } else {
                                                totalInterest -= collectedAmount;
                                                collectedInterest = actualTotalInterest - totalInterest;
                                            }
                                        }
                                        break;
                                    case CollectionStatus.SETTLEMENT:
                                        closingBalance = repayAmount - collectedAmount;
                                        if (collectedAmount > totalInterest) {
                                            if (totalInterest === 0 && collectedAmount >= principalAmount) {
                                                collectedPrinciple = principalAmount;
                                            } else if (totalInterest === 0 && collectedAmount < principalAmount) {
                                                collectedPrinciple = collectedAmount;
                                            } else {
                                                collectedPrinciple = collectedAmount - totalInterest;
                                                if (collectedAmount > principalAmount + totalInterest) {
                                                    checkPrincipal = true;
                                                    principleAmountOver = principalAmount;
                                                }
                                            }
                                            totalInterest = 0;
                                            principalAmount -= collectedPrinciple;
                                            if (principalAmount < 0) {
                                                penaltyCharges += principalAmount;
                                                principalAmount = 0;
                                                if (penaltyCharges < 0) {
                                                    penaltyCharges = 0;
                                                }
                                            } else {
                                                penaltyCharges = actualPenaltyCharge;
                                            }
                                            if (checkPrincipal === true) {
                                                principalAmount = principleAmountOver;
                                                principalAmount = 0;
                                            }
                                            collectedInterest = actualTotalInterest - totalInterest;
                                            collectedPenalty = actualPenaltyCharge - penaltyCharges;
                                            if (collectedInterest === 0 && collectedPrinciple === 0) {
                                                collectedPenalty = collectedAmount;
                                                penaltyCharges = actualPenaltyCharge - collectedPenalty;
                                            }
                                        } else {
                                            totalInterest -= collectedAmount;
                                            collectedInterest = actualTotalInterest - totalInterest;
                                        }
                                        break;
                                }
                                data = {
                                    discountAmount: discountAmount,
                                    settlemenAmount: settlementAmount,
                                    status: status,
                                    excess_amount: excessAmount.toFixed(2),
                                    opening_balance: openingBalance,
                                    closing_balance: closingBalance,
                                    total_interest: totalInterest !== null && totalInterest !== void 0 ? totalInterest : null,
                                    principal_amount: principalAmount !== null && principalAmount !== void 0 ? principalAmount : null,
                                    penality_charge: penaltyCharges !== null && penaltyCharges !== void 0 ? penaltyCharges : null,
                                    collected_interest: collectedInterest !== null && collectedInterest !== void 0 ? collectedInterest : null,
                                    collected_principal: collectedPrinciple !== null && collectedPrinciple !== void 0 ? collectedPrinciple : null,
                                    collected_penality: collectedPenalty !== null && collectedPenalty !== void 0 ? collectedPenalty : null,
                                    updated_date: null
                                };
                                collectDate = momentTz(collectedDate).startOf('day');
                                currentDate = momentTz(new Date()).startOf('day');
                                if (collectDate.format('YYYY-MM-DD') !== currentDate.format('YYYY-MM-DD')) {
                                    data.updated_date = currentDate.format('YYYY-MM-DD HH:mm:ss');
                                }
                                return [
                                    4,
                                    Promise.all([
                                        this.collectionModel.findOneAndUpdate({
                                            collectionID: collectionID
                                        }, data),
                                        this.transactionModel.findOneAndUpdate({
                                            collectionID: collectionID
                                        }, {
                                            status: 2
                                        })
                                    ])
                                ];
                            case 2:
                                _state.sent();
                                return [
                                    2,
                                    {
                                        success: true,
                                        repaymentData: repaymentData
                                    }
                                ];
                        }
                    });
                }).call(this);
            }
        },
        {
            key: "checkFilterForPendingCollection",
            value: function checkFilterForPendingCollection(search_by, customer_search, start_date, end_date, query, dpd, today, collection) {
                return _async_to_generator(function() {
                    var getdpd, dateRanges, _ref, startDate, endDate, start, end;
                    return _ts_generator(this, function(_state) {
                        if (search_by && customer_search) {
                            query = query.where(function(builder) {
                                builder.where("customer.".concat(search_by), 'like', "%".concat(customer_search, "%"));
                            });
                        }
                        if (dpd) {
                            getdpd = Number(dpd);
                            if (dpd === '' || dpd === undefined || dpd === null) {} else {
                                dateRanges = {
                                    1: [
                                        new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                                        ''
                                    ],
                                    2: [
                                        new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                                        new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
                                    ],
                                    3: [
                                        new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                                        new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
                                    ],
                                    4: [
                                        new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                                        new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
                                    ],
                                    5: [
                                        new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                                        new Date(Date.now() - 31 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
                                    ],
                                    6: [
                                        new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                                        new Date(Date.now() - 61 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
                                    ],
                                    7: [
                                        new Date(Date.now() - 180 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                                        new Date(Date.now() - 91 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
                                    ],
                                    8: [
                                        new Date(Date.now() - 181 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                                        new Date(Date.now() - 400 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
                                    ]
                                };
                                _ref = _sliced_to_array(dateRanges[getdpd] || [], 2), startDate = _ref[0], endDate = _ref[1];
                                if (startDate && endDate) {
                                    if (collection === 'payday') {
                                        query = query.whereBetween('approval.repayDate', [
                                            startDate,
                                            endDate
                                        ]);
                                    } else if (collection === 'emi') {
                                        query = query.whereBetween('dueDate', [
                                            startDate,
                                            endDate
                                        ]);
                                    }
                                }
                            }
                        } else if (start_date || end_date) {
                            start = start_date ? new Date(start_date).toISOString() : today;
                            end = end_date ? new Date(end_date).toISOString() : today;
                            if (collection === 'payday') {
                                query = query.whereBetween('approval.repayDate', [
                                    start,
                                    end
                                ]);
                            } else if (collection === 'emi') {
                                query = query.whereBetween('emi.dueDate', [
                                    start,
                                    end
                                ]);
                            }
                        }
                        return [
                            2,
                            query
                        ];
                    });
                })();
            }
        },
        {
            key: "checkFilterForCollectionReport",
            value: function checkFilterForCollectionReport(search_by, start_date, end_date, customer_search, lead_id, lead_case, employment_type, salary_mode, monthly_income, city, state, query) {
                return _async_to_generator(function() {
                    var startDate, endDate, incomeCategory;
                    return _ts_generator(this, function(_state) {
                        if (start_date || end_date) {
                            startDate = moment(start_date || new Date()).format('YYYY-MM-DD 00:00:00');
                            endDate = moment(end_date || new Date()).format('YYYY-MM-DD 23:59:59');
                            query = query.whereBetween('leads.createdDate', [
                                startDate,
                                endDate
                            ]);
                        }
                        if (employment_type) {
                            query = query.where('customer.employeeType', employment_type);
                        }
                        if (lead_id) {
                            query = query.where('leads.leadID', lead_id);
                        }
                        if (salary_mode) {
                            query = query.where('leads.salaryMode', salary_mode);
                        }
                        if (city) {
                            query = query.where('leads.city', city);
                        }
                        if (state) {
                            query = query.where('leads.state', state);
                        }
                        if (lead_case) {
                            query = query.where('leads.fbLeads', lead_case);
                        }
                        if (monthly_income !== undefined && monthly_income !== null && monthly_income !== '') {
                            incomeCategory = Number(monthly_income);
                            switch(incomeCategory){
                                case 1:
                                    query = query.where('leads.monthlyIncome', '<', 28000);
                                    break;
                                case 2:
                                    query = query.whereBetween('leads.monthlyIncome', [
                                        28000,
                                        60000
                                    ]);
                                    break;
                                case 3:
                                    query = query.where('leads.monthlyIncome', '>', 60000);
                                    break;
                            }
                        }
                        if (search_by && customer_search) {
                            query = query.where(function(builder) {
                                builder.where("customer.".concat(search_by), 'like', "%".concat(customer_search, "%"));
                            });
                        }
                        return [
                            2,
                            query
                        ];
                    });
                })();
            }
        },
        {
            key: "changePaymentMode",
            value: function changePaymentMode(payload) {
                return _async_to_generator(function() {
                    var leadID, customerID, referenceNo, pId, loanNo, collectedMode, loanType, remark, status, userID, db, collection, transaction, collectionUpdate, transactionUpdate, transaction1, transactionUpdate1, statusLabel;
                    return _ts_generator(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                leadID = payload.leadID, customerID = payload.customerID, referenceNo = payload.referenceNo, pId = payload.pId, loanNo = payload.loanNo, collectedMode = payload.collectedMode, loanType = payload.loanType, remark = payload.remark, status = payload.status, userID = payload.userID;
                                db = getKnexInstance();
                                if (!(loanType === 'payDay')) return [
                                    3,
                                    7
                                ];
                                //discuss witth pappu sir
                                if (remark && remark.trim()) {
                                    throw new BadRequestError('Only manual case is applicable.');
                                }
                                return [
                                    4,
                                    this.collectionModel.findOneCollection({
                                        collectionID: pId
                                    }, [
                                        '*'
                                    ])
                                ];
                            case 1:
                                collection = _state.sent();
                                if (!collection) {
                                    throw new NotFoundError('The collection does not exist.');
                                }
                                return [
                                    4,
                                    this.transactionModel.find({
                                        where: {
                                            leadID: leadID,
                                            customerID: customerID,
                                            collectionID: pId
                                        }
                                    })
                                ];
                            case 2:
                                transaction = _state.sent();
                                if (transaction.length > 1) {
                                    throw new BadRequestError('Getting duplicate transactions records based on leadID, customerID and collectionID.');
                                }
                                return [
                                    4,
                                    db('collection').where('collectionID', pId).update({
                                        collectedMode: collectedMode === 'CASH' ? 'Cash' : collectedMode,
                                        referenceNo: referenceNo
                                    })
                                ];
                            case 3:
                                collectionUpdate = _state.sent();
                                return [
                                    4,
                                    db('transactions').where({
                                        leadID: leadID,
                                        customerID: customerID,
                                        collectionID: pId
                                    }).update({
                                        mode: collectedMode,
                                        referenceNo: referenceNo
                                    })
                                ];
                            case 4:
                                transactionUpdate = _state.sent();
                                if (!(collectionUpdate && transactionUpdate)) return [
                                    3,
                                    6
                                ];
                                return [
                                    4,
                                    db('callhistoryLogs').insert({
                                        customerID: customerID,
                                        leadID: leadID,
                                        callType: loanType,
                                        status: status,
                                        appAmount: 0,
                                        noteli: 'Payment Mode Update',
                                        remark: 'Payment Mode Update',
                                        callbackTime: new Date().toISOString().split('T')[0],
                                        calledBy: userID,
                                        createdDate: new Date()
                                    })
                                ];
                            case 5:
                                _state.sent();
                                return [
                                    2,
                                    this.serviceResponse(HttpStatusCode.Ok, {}, 'Payment mode and reference number have been updated successfully.')
                                ];
                            case 6:
                                return [
                                    3,
                                    11
                                ];
                            case 7:
                                if (![
                                    2,
                                    3
                                ].includes(status)) {
                                    throw new BadRequestError('Only transactions with a status of Pending or Approved are allowed');
                                }
                                return [
                                    4,
                                    db('transactions').where('id', pId).first()
                                ];
                            case 8:
                                transaction1 = _state.sent();
                                if (!transaction1) {
                                    throw new NotFoundError('The transaction does not exist.');
                                }
                                return [
                                    4,
                                    db('transactions').where('id', pId).update({
                                        mode: collectedMode,
                                        referenceNo: referenceNo
                                    })
                                ];
                            case 9:
                                transactionUpdate1 = _state.sent();
                                if (!transactionUpdate1) return [
                                    3,
                                    11
                                ];
                                statusLabel = '';
                                switch(status){
                                    case 1:
                                        statusLabel = 'Captured';
                                        break;
                                    case 2:
                                        statusLabel = 'Pending';
                                        break;
                                    case 3:
                                        statusLabel = 'Approved';
                                        break;
                                    case 4:
                                        statusLabel = 'Rejected';
                                        break;
                                    default:
                                        statusLabel = 'Failed';
                                        break;
                                }
                                return [
                                    4,
                                    db('callhistoryLogs').insert({
                                        customerID: customerID,
                                        leadID: leadID,
                                        callType: loanType,
                                        status: statusLabel,
                                        appAmount: '',
                                        noteli: 'Payment Mode Update',
                                        remark: 'Payment Mode Update',
                                        callbackTime: new Date().toISOString().split('T')[0],
                                        calledBy: userID,
                                        createdDate: new Date()
                                    })
                                ];
                            case 10:
                                _state.sent();
                                return [
                                    2,
                                    this.serviceResponse(HttpStatusCode.Ok, {}, 'Payment mode and reference number have been updated successfully.')
                                ];
                            case 11:
                                return [
                                    2
                                ];
                        }
                    });
                }).call(this);
            }
        }
    ]);
    return CollectionService;
}(ResponseService);
export default CollectionService;

//# sourceMappingURL=collection.service.js.map