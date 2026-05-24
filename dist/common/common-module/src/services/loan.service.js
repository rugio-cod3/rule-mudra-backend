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
import { config } from '@/config.server';
import moment from 'moment-timezone';
import { approvalModel } from '../database/mysql/approval';
import { autoDisbursalLogModel } from '../database/mysql/autoDisbursalLogs';
import { callHistoryLogsModel } from '../database/mysql/callhistorylogs';
import { collectionModel } from '../database/mysql/collection';
import { creditModel } from '../database/mysql/credit';
import { customerModel } from '../database/mysql/customer';
import { customerAccountModel } from '../database/mysql/customerAccount';
import { disbursalJobsModel } from '../database/mysql/disbursalJobs';
import { emiModel } from '../database/mysql/emi';
import { leadModel } from '../database/mysql/leads';
import LoanModel from '../database/mysql/loan';
import { razorpayMandateModel } from '../database/mysql/razorpayMandate';
import { CollectionStatus } from '../enums/collection.enum';
import { LeadStatus } from '../enums/lead.enum';
import { LoanStatus } from '../enums/loan.enum';
import { logger } from '../utils/logger';
import { getKnexInstance } from '../utils/mysql';
import { getEmiAPR } from '../utils/util';
import S3Service from './thirdParty/s3.service';
import { documentModel } from '../database/mysql/document';
import NotificationService from './notification.service';
import ResponseService from './response.service';
import { leadService } from './lead.service';
import { creditService } from './credit.service';
import { addressModel } from '../database/mysql/address';
import { leadsApiLogModel } from '../database/mysql/leadApiLogs';
export var LoanService = /*#__PURE__*/ function(ResponseService) {
    "use strict";
    _inherits(LoanService, ResponseService);
    function LoanService() {
        _class_call_check(this, LoanService);
        var _this;
        _this = _call_super(this, LoanService, arguments), _define_property(_this, "loaneModel", new LoanModel()), _define_property(_this, "collectionModel", collectionModel), _define_property(_this, "leadModel", leadModel), _define_property(_this, "callHistoryLogsModel", callHistoryLogsModel), _define_property(_this, "customerModel", customerModel), _define_property(_this, "disbursalJobsModel", disbursalJobsModel), _define_property(_this, "autoDisbursalLogModel", autoDisbursalLogModel), _define_property(_this, "approvalModel", approvalModel), _define_property(_this, "razorpayMandateModel", razorpayMandateModel), _define_property(_this, "emiModel", emiModel), _define_property(_this, "creditModel", creditModel), _define_property(_this, "customerAccountModel", customerAccountModel), _define_property(_this, "addressModel", addressModel), _define_property(_this, "leadsApiLogModel", leadsApiLogModel), _define_property(_this, "documentModel", documentModel), _define_property(_this, "s3Service", new S3Service()), _define_property(_this, "notificationService", new NotificationService()), _define_property(_this, "leadService", leadService), _define_property(_this, "creditService", creditService), _define_property(_this, "calculateGst", function(adminFee) {
            var getAmt;
            getAmt = adminFee * 18 / 100;
            return getAmt;
        });
        return _this;
    }
    _create_class(LoanService, [
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
                                    this.loaneModel.findOneLoan(where, select, order)
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
                    var loan, error;
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
                                    this.loaneModel.getLoanData(where, order, select)
                                ];
                            case 1:
                                loan = _state.sent();
                                if (loan.length == 0) {
                                    return [
                                        2,
                                        null
                                    ];
                                } else {
                                    return [
                                        2,
                                        loan // Return the first lead if found
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
            key: "getActualLoanTenure",
            value: function getActualLoanTenure(collectedDate, disbursalDate) {
                var firstDate = moment(collectedDate).startOf('day');
                var secondDate = moment(disbursalDate).startOf('day');
                // Determine which date is later to always get a positive difference
                var _ref = _sliced_to_array(firstDate.isSameOrAfter(secondDate) ? [
                    firstDate,
                    secondDate
                ] : [
                    secondDate,
                    firstDate
                ], 2), laterDate = _ref[0], earlierDate = _ref[1];
                // Calculate difference in days
                return laterDate.diff(earlierDate, 'days');
            }
        },
        {
            key: "getActualLoanTenureInMonthDay",
            value: function getActualLoanTenureInMonthDay(collectedDate, disbursalDate) {
                var firstDate = moment(collectedDate).startOf('day');
                var secondDate = moment(disbursalDate).startOf('day');
                // Determine which date is later to always get a positive difference
                var _ref = _sliced_to_array(firstDate.isSameOrAfter(secondDate) ? [
                    firstDate,
                    secondDate
                ] : [
                    secondDate,
                    firstDate
                ], 2), laterDate = _ref[0], earlierDate = _ref[1];
                // Calculate months difference
                var monthsDifference = laterDate.diff(earlierDate, 'months');
                // Calculate remaining days after accounting for full months
                var earlierDatePlusMonths = moment(earlierDate).add(monthsDifference, 'months');
                var remainingDays = laterDate.diff(earlierDatePlusMonths, 'days');
                // Use singular or plural forms based on values
                var monthText = monthsDifference <= 1 ? 'Month' : 'Months';
                var dayText = remainingDays <= 1 ? 'Day' : 'Days';
                return "".concat(monthsDifference, " ").concat(monthText, " / ").concat(remainingDays, " ").concat(dayText);
            }
        },
        {
            // getDpdDays(repayDate: Date, comparisonDate?: Date): number {
            //   const currentDate = moment().tz('Asia/Kolkata').startOf('day')
            //   console.log('GET DPD days method:Current Date:::: ', currentDate)
            //   console.log('GET DPD days method:Repay Date:::: ', repayDate)
            //   const repayDateFormatted = moment(repayDate).startOf('day')
            //   console.log('GET DPD days method:Repay Date Formatted:::: ', repayDateFormatted)
            //   console.log("DPD DIFF is :::::::", currentDate.diff(repayDateFormatted, 'days'))
            //   if (!comparisonDate) return currentDate.diff(repayDateFormatted, 'day')
            //   const comparisonDateFormatted = moment(comparisonDate).startOf('day')
            //   return comparisonDateFormatted.diff(repayDateFormatted, 'days')
            // }
            key: "getDpdDays",
            value: function getDpdDays(repayDate, comparisonDate) {
                var currentDate = moment().utcOffset(330).startOf('day') // 330 mins = UTC+5:30 (IST)
                ;
                var repayDateFormatted = moment(repayDate).utcOffset(330).startOf('day');
                if (!comparisonDate) return currentDate.diff(repayDateFormatted, 'days');
                var comparisonDateFormatted = moment(comparisonDate).utcOffset(330).startOf('day');
                return comparisonDateFormatted.diff(repayDateFormatted, 'days');
            }
        },
        {
            key: "getPaidAmountPayday",
            value: function getPaidAmountPayday(collections) {
                var totalPaidAmount = 0;
                var _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
                try {
                    for(var _iterator = collections[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true){
                        var collection = _step.value;
                        if (collection.collectedMode != 'Waive Off') {
                            totalPaidAmount += collection.collectedAmount;
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
                return totalPaidAmount;
            }
        },
        {
            key: "getRemainingInterestPayDay",
            value: function getRemainingInterestPayDay(collections, roi) {
                var totalInterest = +collections[0].total_interest;
                var principal_amount = +collections[0].principal_amount;
                var lastCollectedDate = moment(collections[0].collectedDate).utcOffset(330).startOf('day');
                var currentDate = moment().utcOffset(330).startOf('day');
                var difference = currentDate.diff(lastCollectedDate, 'days');
                var interestPerDay = roi;
                if (difference < 0) difference = 0;
                return +(interestPerDay * difference * principal_amount / 100 + totalInterest).toFixed(2);
            }
        },
        {
            key: "getRemainingPenaltyPayDay",
            value: function getRemainingPenaltyPayDay(collection, roi, bounceCharges) {
                var totalPenality = +collection.penality_charge;
                var principal_amount = +collection.principal_amount;
                var lastCollectedDate = moment(collection.collectedDate).utcOffset(330).startOf('day');
                var currentDate = moment().utcOffset(330).startOf('day');
                var difference = currentDate.diff(lastCollectedDate, 'days');
                if (difference < 0) difference = 0;
                return +(roi * difference * principal_amount / 100 + (totalPenality - bounceCharges)).toFixed(2);
            }
        },
        {
            key: "getPenalInterestPayday",
            value: function getPenalInterestPayday(lead, loan, approval, dpdDays, bounceCharge) {
                return _async_to_generator(function() {
                    var ipc, customerID, dpdInterest, ipcDpdInterest, collection, collection1, difference, originalAmount, totalInterestCollected, originalAmountInterest;
                    return _ts_generator(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                ipc = lead.ipc, customerID = lead.customerID;
                                dpdInterest = +config.dpdInterest;
                                ipcDpdInterest = +config.ipcDpdInterest;
                                if (!(lead.status === LeadStatus.PART_PAYMENT)) return [
                                    3,
                                    2
                                ];
                                return [
                                    4,
                                    this.collectionModel.findOneCollection({
                                        customerID: customerID,
                                        leadID: lead.leadID,
                                        loanNo: loan.loanNo,
                                        status: CollectionStatus.PART_PAYMENT,
                                        collectionStatus: CollectionStatus.APPROVED.toString()
                                    }, [
                                        'principal_amount',
                                        'penality_charge',
                                        'collectedDate'
                                    ], [
                                        {
                                            column: 'collectionID',
                                            order: 'desc'
                                        }
                                    ])
                                ];
                            case 1:
                                collection = _state.sent();
                                return [
                                    2,
                                    this.getRemainingPenaltyPayDay(collection, ipc ? ipcDpdInterest : dpdInterest, bounceCharge)
                                ];
                            case 2:
                                if (!(lead.status === LeadStatus.DISBURSED)) return [
                                    3,
                                    3
                                ];
                                return [
                                    2,
                                    this.calculateInterest(loan.disbursalAmount, ipc ? ipcDpdInterest : dpdInterest, dpdDays)
                                ];
                            case 3:
                                if (!(lead.status === LeadStatus.SETTLEMENT || lead.status === LeadStatus.CLOSED)) return [
                                    3,
                                    5
                                ];
                                return [
                                    4,
                                    this.collectionModel.find({
                                        where: {
                                            customerID: customerID,
                                            leadID: lead.leadID,
                                            loanNo: loan.loanNo,
                                            collectionStatus: CollectionStatus.APPROVED.toString()
                                        },
                                        select: [
                                            'collectedDate',
                                            'collected_interest'
                                        ],
                                        order: [
                                            {
                                                column: 'collectionID',
                                                order: 'desc'
                                            }
                                        ]
                                    })
                                ];
                            case 4:
                                collection1 = _state.sent();
                                difference = this.getDpdDays(approval.repayDate, collection1[0].collectedDate);
                                // First we need to find orignal interest
                                originalAmount = loan.disbursalAmount;
                                totalInterestCollected = 0;
                                collection1.forEach(function(colle) {
                                    totalInterestCollected += colle.collected_interest;
                                });
                                originalAmountInterest = originalAmount * (approval.roi / 100) * approval.tenure;
                                if (difference > 0) {
                                    // ! TODO : Verify
                                    return [
                                        2,
                                        totalInterestCollected - originalAmountInterest
                                    ];
                                }
                                _state.label = 5;
                            case 5:
                                return [
                                    2
                                ];
                        }
                    });
                }).call(this);
            }
        },
        {
            key: "calculateInterest",
            value: function calculateInterest(disbursalAmount, roi, tenure) {
                return disbursalAmount * (roi / 100) * tenure;
            }
        },
        {
            key: "calculateRepayAmountIpc",
            value: function calculateRepayAmountIpc(lead, customer, approval, loan, calculateOnDate) {
                return _async_to_generator(function() {
                    var response, repayDate, disbursalDate, principleAmount, prevPenaltyBalance, prevInterestBalance, sanctionRoi, oneTimePenaltyCharge, totalAmount, sanctionTenure, dpdTenure, interest, dpdCharges, closingBalance, dpdPenalty, dpdPenaltyGst, penaltyAmount, calculateDate, sanctionTenureForTotal, isOverDue, oneTimePenaltyChargeForTotal, dpdTenureForTotal, totalCalculatedAmountForTotal, principalForTotal, interestForTotal, dpdChargeForTotal, collection, collectedDate, penaltyBalance, isSameOrBeforeCollectedDate, isSameOrAfterRepayDate;
                    return _ts_generator(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                response = {
                                    totalPayableAmount: 0,
                                    repayDate: null,
                                    totalInterest: 0,
                                    dpdCharges: 0,
                                    principalAmount: 0,
                                    totalAmount: 0,
                                    totalAmountInterest: 0,
                                    totalAmountDpdCharge: 0,
                                    totalAmountPrincipal: 0
                                };
                                repayDate = moment(approval.repayDate);
                                disbursalDate = moment(loan.disbursalDate);
                                principleAmount = loan.disbursalAmount;
                                prevPenaltyBalance = 0;
                                prevInterestBalance = 0;
                                sanctionRoi = approval.roi;
                                oneTimePenaltyCharge = 0;
                                totalAmount = 0;
                                sanctionTenure = 0;
                                dpdTenure = 0;
                                interest = 0;
                                dpdCharges = 0;
                                dpdPenalty = Number(config.dpdPenalty);
                                dpdPenaltyGst = Number(config.dpdPenaltyGstPercentage);
                                penaltyAmount = dpdPenalty + dpdPenalty * (dpdPenaltyGst / 100);
                                if (lead.ipc === 0) {
                                    return [
                                        2,
                                        response // return dummy details;
                                    ];
                                }
                                // if lead.ipc = 1
                                calculateDate = calculateOnDate ? moment(calculateOnDate) : moment();
                                sanctionTenureForTotal = calculateDate.isSameOrBefore(repayDate, 'day') ? calculateDate.diff(disbursalDate, 'days') : repayDate.diff(disbursalDate, 'days');
                                isOverDue = calculateDate.isAfter(repayDate);
                                oneTimePenaltyChargeForTotal = isOverDue ? penaltyAmount : 0;
                                dpdTenureForTotal = isOverDue ? calculateDate.diff(repayDate, 'days') : 0;
                                totalCalculatedAmountForTotal = 0;
                                principalForTotal = principleAmount;
                                interestForTotal = principleAmount * (approval.roi / 100) * (sanctionTenureForTotal + dpdTenureForTotal);
                                dpdChargeForTotal = principleAmount * (+config.ipcDpdInterest / 100) * dpdTenureForTotal + oneTimePenaltyChargeForTotal;
                                totalCalculatedAmountForTotal = principleAmount + interestForTotal + dpdChargeForTotal;
                                if (!(lead.status === LeadStatus.PART_PAYMENT)) return [
                                    3,
                                    2
                                ];
                                return [
                                    4,
                                    this.collectionModel.findOneCollection({
                                        customerID: customer.customerID,
                                        leadID: lead.leadID,
                                        loanNo: loan.loanNo,
                                        status: CollectionStatus.PART_PAYMENT,
                                        collectionStatus: CollectionStatus.APPROVED.toString()
                                    }, [
                                        '*'
                                    ], [
                                        {
                                            column: 'collectionID',
                                            order: 'desc'
                                        }
                                    ])
                                ];
                            case 1:
                                collection = _state.sent();
                                if (collection) {
                                    closingBalance = collection.closing_balance;
                                    principleAmount = collection.principal_amount;
                                    collectedDate = collection.collectedDate;
                                    penaltyBalance = collection.penality_charge;
                                    prevPenaltyBalance = collection.penality_charge; // ! Review
                                    prevInterestBalance = collection.total_interest;
                                    oneTimePenaltyCharge = penaltyBalance ? 0 : oneTimePenaltyCharge;
                                    isSameOrBeforeCollectedDate = calculateDate.isSameOrBefore(repayDate, 'day');
                                    isSameOrAfterRepayDate = repayDate.isSameOrAfter(collectedDate);
                                    //calculate tenure
                                    if (isSameOrBeforeCollectedDate && isSameOrAfterRepayDate) {
                                        sanctionTenure = calculateDate.diff(collectedDate, 'days');
                                    } else if (!isSameOrAfterRepayDate && isSameOrAfterRepayDate) {
                                        sanctionTenure = repayDate.diff(collectedDate, 'days');
                                        dpdTenure = calculateDate.diff(repayDate, 'days');
                                        oneTimePenaltyCharge = !penaltyBalance ? penaltyAmount : 0;
                                    } else if (!isSameOrAfterRepayDate && !isSameOrAfterRepayDate) {
                                        dpdTenure = calculateDate.diff(collectedDate, 'days');
                                        oneTimePenaltyCharge = !penaltyBalance ? penaltyAmount : 0;
                                    }
                                    if (moment().isBefore(repayDate)) {
                                        sanctionTenure = moment().diff(disbursalDate, 'days');
                                    }
                                    interest = principleAmount * (sanctionRoi / 100) * (sanctionTenure + dpdTenure);
                                    dpdCharges = principleAmount * (+config.ipcDpdInterest / 100) * (dpdTenure + oneTimePenaltyCharge);
                                }
                                return [
                                    3,
                                    3
                                ];
                            case 2:
                                if (lead.status === LeadStatus.DISBURSED) {
                                    sanctionTenure = calculateDate.isSameOrBefore(repayDate, 'day') ? calculateDate.diff(disbursalDate, 'days') : repayDate.diff(disbursalDate, 'days');
                                    if (moment().isBefore(repayDate)) {
                                        sanctionTenure = moment().diff(disbursalDate, 'days');
                                    }
                                    dpdTenure = isOverDue ? calculateDate.diff(repayDate, 'days') : dpdTenure;
                                    oneTimePenaltyCharge = isOverDue ? penaltyAmount : oneTimePenaltyCharge;
                                    interest = principleAmount * (approval.roi / 100) * (sanctionTenure + dpdTenure);
                                    dpdCharges = principleAmount * (+config.ipcDpdInterest / 100) * dpdTenure + oneTimePenaltyCharge;
                                // ! Handle
                                }
                                _state.label = 3;
                            case 3:
                                if (closingBalance) {
                                    closingBalance = +Number(closingBalance).toFixed(2);
                                    totalAmount = closingBalance + interest + dpdCharges;
                                } else {
                                    totalAmount = +Number(principleAmount) + interest + dpdCharges;
                                }
                                response.totalPayableAmount = +Number(totalAmount).toFixed(2);
                                response.repayDate = new Date(approval.repayDate);
                                response.totalInterest = Number((Number(interest) + Number(prevInterestBalance)).toFixed(2));
                                response.dpdCharges = Number((Number(dpdCharges) + Number(prevPenaltyBalance)).toFixed(2));
                                response.principalAmount = +Number(principleAmount).toFixed(2);
                                response.totalAmount = +Number(totalCalculatedAmountForTotal).toFixed(2);
                                response.totalAmountInterest = +Number(interestForTotal).toFixed(2);
                                response.totalAmountDpdCharge = +Number(dpdChargeForTotal).toFixed(2);
                                response.totalAmountPrincipal = +Number(principalForTotal).toFixed(2);
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
            key: "calculateRepayAmountIpcV2",
            value: function calculateRepayAmountIpcV2(leadID, calculateOnDate) {
                return _async_to_generator(function() {
                    var response, db, lead, approval, customer, loan, repayDate, disbursalDate, principleAmount, prevPenaltyBalance, prevInterestBalance, sanctionRoi, oneTimePenaltyCharge, totalAmount, sanctionTenure, dpdTenure, interest, dpdCharges, closingBalance, dpdPenalty, dpdPenaltyGst, penaltyAmount, calculateDate, sanctionTenureForTotal, isOverDue, oneTimePenaltyChargeForTotal, dpdTenureForTotal, totalCalculatedAmountForTotal, principalForTotal, interestForTotal, dpdChargeForTotal, collection, collectedDate, penaltyBalance, isSameOrBeforeCollectedDate, isSameOrAfterRepayDate;
                    return _ts_generator(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                response = {
                                    totalPayableAmount: 0,
                                    repayDate: null,
                                    totalInterest: 0,
                                    dpdCharges: 0,
                                    principalAmount: 0,
                                    totalAmount: 0,
                                    totalAmountInterest: 0,
                                    totalAmountDpdCharge: 0,
                                    totalAmountPrincipal: 0
                                };
                                db = getKnexInstance();
                                return [
                                    4,
                                    this.leadModel.LeadsKnex.select(db.raw("JSON_OBJECT('repayDate', ap.repayDate ,'roi', ap.roi) as 'approval'"), db.raw("JSON_OBJECT('customerID', c.customerID) as 'customer'"), db.raw("JSON_OBJECT('disbursalAmount',loan.disbursalAmount,'disbursalDate',loan.disbursalDate,'loanNo',loan.loanNo) as 'loan'"), 'leads.ipc', 'leads.status', 'leads.leadID', 'leads.status').join('customer as c', 'leads.customerID', '=', 'c.customerID').join('approval as ap', 'leads.leadID', '=', 'ap.leadID').join('loan', 'leads.leadID', '=', 'loan.leadID').where('leads.leadID', leadID).whereIn('leads.status', [
                                        LeadStatus.DISBURSED,
                                        LeadStatus.PART_PAYMENT
                                    ]).first()
                                ];
                            case 1:
                                lead = _state.sent();
                                approval = lead.approval, customer = lead.customer, loan = lead.loan;
                                repayDate = moment(approval.repayDate);
                                disbursalDate = moment(loan.disbursalDate);
                                principleAmount = loan.disbursalAmount;
                                prevPenaltyBalance = 0;
                                prevInterestBalance = 0;
                                sanctionRoi = approval.roi;
                                oneTimePenaltyCharge = 0;
                                totalAmount = 0;
                                sanctionTenure = 0;
                                dpdTenure = 0;
                                interest = 0;
                                dpdCharges = 0;
                                dpdPenalty = Number(config.dpdPenalty);
                                dpdPenaltyGst = Number(config.dpdPenaltyGstPercentage);
                                penaltyAmount = dpdPenalty + dpdPenalty * (dpdPenaltyGst / 100);
                                if (lead.ipc === 0) {
                                    return [
                                        2,
                                        response // return dummy details;
                                    ];
                                }
                                // if lead.ipc = 1
                                calculateDate = calculateOnDate ? moment(calculateOnDate) : moment();
                                sanctionTenureForTotal = calculateDate.isSameOrBefore(repayDate, 'day') ? calculateDate.diff(disbursalDate, 'days') : repayDate.diff(disbursalDate, 'days');
                                isOverDue = calculateDate.isAfter(repayDate);
                                oneTimePenaltyChargeForTotal = isOverDue ? penaltyAmount : 0;
                                dpdTenureForTotal = isOverDue ? calculateDate.diff(repayDate, 'days') : 0;
                                totalCalculatedAmountForTotal = 0;
                                principalForTotal = principleAmount;
                                interestForTotal = principleAmount * (approval.roi / 100) * (sanctionTenureForTotal + dpdTenureForTotal);
                                dpdChargeForTotal = principleAmount * (+config.ipcDpdInterest / 100) * dpdTenureForTotal + oneTimePenaltyChargeForTotal;
                                totalCalculatedAmountForTotal = principleAmount + interestForTotal + dpdChargeForTotal;
                                if (!(lead.status === LeadStatus.PART_PAYMENT)) return [
                                    3,
                                    3
                                ];
                                return [
                                    4,
                                    this.collectionModel.findOneCollection({
                                        customerID: customer.customerID,
                                        leadID: lead.leadID,
                                        loanNo: loan.loanNo,
                                        status: CollectionStatus.PART_PAYMENT,
                                        collectionStatus: CollectionStatus.APPROVED.toString()
                                    }, [
                                        '*'
                                    ], [
                                        {
                                            column: 'collectionID',
                                            order: 'desc'
                                        }
                                    ])
                                ];
                            case 2:
                                collection = _state.sent();
                                if (collection) {
                                    closingBalance = collection.closing_balance;
                                    principleAmount = collection.principal_amount;
                                    collectedDate = collection.collectedDate;
                                    penaltyBalance = collection.penality_charge;
                                    prevPenaltyBalance = collection.penality_charge; // ! Review
                                    prevInterestBalance = collection.total_interest;
                                    oneTimePenaltyCharge = penaltyBalance ? 0 : oneTimePenaltyCharge;
                                    isSameOrBeforeCollectedDate = calculateDate.isSameOrBefore(repayDate, 'day');
                                    isSameOrAfterRepayDate = repayDate.isSameOrAfter(collectedDate);
                                    //calculate tenure
                                    if (isSameOrBeforeCollectedDate && isSameOrAfterRepayDate) {
                                        sanctionTenure = calculateDate.diff(collectedDate, 'days');
                                    } else if (!isSameOrAfterRepayDate && isSameOrAfterRepayDate) {
                                        sanctionTenure = repayDate.diff(collectedDate, 'days');
                                        dpdTenure = calculateDate.diff(repayDate, 'days');
                                        oneTimePenaltyCharge = !penaltyBalance ? penaltyAmount : 0;
                                    } else if (!isSameOrAfterRepayDate && !isSameOrAfterRepayDate) {
                                        dpdTenure = calculateDate.diff(collectedDate, 'days');
                                        oneTimePenaltyCharge = !penaltyBalance ? penaltyAmount : 0;
                                    }
                                    interest = principleAmount * (sanctionRoi / 100) * (sanctionTenure + dpdTenure);
                                    dpdCharges = principleAmount * (+config.ipcDpdInterest / 100) * (dpdTenure + oneTimePenaltyCharge);
                                }
                                return [
                                    3,
                                    4
                                ];
                            case 3:
                                if (lead.status === LeadStatus.DISBURSED) {
                                    sanctionTenure = calculateDate.isSameOrBefore(repayDate, 'day') ? calculateDate.diff(disbursalDate, 'days') : repayDate.diff(disbursalDate, 'days');
                                    dpdTenure = isOverDue ? calculateDate.diff(repayDate, 'days') : dpdTenure;
                                    oneTimePenaltyCharge = isOverDue ? penaltyAmount : oneTimePenaltyCharge;
                                    interest = principleAmount * (approval.roi / 100) * (sanctionTenure + dpdTenure);
                                    dpdCharges = principleAmount * (+config.ipcDpdInterest / 100) * dpdTenure + oneTimePenaltyCharge;
                                // ! Handle
                                }
                                _state.label = 4;
                            case 4:
                                totalAmount = closingBalance !== null && closingBalance !== void 0 ? closingBalance : principleAmount + interest + dpdCharges;
                                response.totalPayableAmount = +Number(totalAmount).toFixed(2);
                                response.repayDate = new Date(approval.repayDate);
                                response.totalInterest = Number((Number(interest) + Number(prevInterestBalance)).toFixed(2));
                                response.dpdCharges = Number((Number(dpdCharges) + Number(prevPenaltyBalance)).toFixed(2));
                                response.principalAmount = +Number(principleAmount).toFixed(2);
                                response.totalAmount = +Number(totalCalculatedAmountForTotal).toFixed(2);
                                response.totalAmountInterest = +Number(interestForTotal).toFixed(2);
                                response.totalAmountDpdCharge = +Number(dpdChargeForTotal).toFixed(2);
                                response.totalAmountPrincipal = +Number(principalForTotal).toFixed(2);
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
            key: "getApprovedLoanAmount",
            value: function getApprovedLoanAmount(customerID) {
                return _async_to_generator(function() {
                    var lead;
                    return _ts_generator(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                return [
                                    4,
                                    this.leadModel.LeadsKnex.join('approval as ap', 'leads.leadID', 'ap.leadID').where('leads.customerID', customerID).andWhere('leads.status', LeadStatus.CLOSED).select('ap.loanAmtApproved').orderBy('leads.leadID', 'desc').first()
                                ];
                            case 1:
                                lead = _state.sent();
                                return [
                                    2,
                                    lead ? lead.loanAmtApproved * +config.reloanMax : null
                                ];
                        }
                    });
                }).call(this);
            }
        },
        {
            key: "isReloanAmountValid",
            value: function isReloanAmountValid(amount, customerID) {
                return _async_to_generator(function() {
                    var approvedAmount;
                    return _ts_generator(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                return [
                                    4,
                                    this.getApprovedLoanAmount(customerID)
                                ];
                            case 1:
                                approvedAmount = _state.sent();
                                if (approvedAmount && amount > approvedAmount) {
                                    return [
                                        2,
                                        {
                                            status: false,
                                            amount: approvedAmount
                                        }
                                    ];
                                }
                                return [
                                    2,
                                    {
                                        status: true,
                                        amount: amount
                                    }
                                ];
                        }
                    });
                }).call(this);
            }
        },
        {
            key: "createAutoDisbursal",
            value: function createAutoDisbursal(leadID) {
                return _async_to_generator(function() {
                    var lead, customerID, _ref, checkDisbursed, disbCountCallHistoryCount, loan, loanCount, disbursalCountCh, accountNo, bankIfsc, loanNo, loanID, disbursalAmount, deduction, companyAccountNo, customer, countDisbursalJobs, error;
                    return _ts_generator(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                return [
                                    4,
                                    this.leadModel.findOne({
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
                                customerID = lead.customerID;
                                _state.label = 2;
                            case 2:
                                _state.trys.push([
                                    2,
                                    8,
                                    ,
                                    10
                                ]);
                                return [
                                    4,
                                    Promise.all([
                                        this.leadModel.count({
                                            where: {
                                                leadID: leadID
                                            },
                                            whereIn: [
                                                {
                                                    column: 'status',
                                                    value: [
                                                        LeadStatus.DISBURSED,
                                                        LeadStatus.PART_PAYMENT,
                                                        LeadStatus.SETTLEMENT
                                                    ]
                                                }
                                            ]
                                        }),
                                        this.callHistoryLogsModel.CallHistoryLogsKnex.where('leadID', leadID).andWhere(function() {
                                            this.where('status', 'Disbursed By Razorpay').orWhere('status', 'Disbursed');
                                        }).count(),
                                        this.loaneModel.findOneLoan({
                                            leadID: leadID,
                                            disbursalRefrenceNo: '',
                                            status: LoanStatus.DISBURSAL_SHEET_SENT
                                        }, [
                                            '*'
                                        ], [
                                            {
                                                order: 'desc',
                                                column: 'loanID'
                                            }
                                        ]),
                                        this.loaneModel.countLoan({
                                            leadID: leadID,
                                            disbursalRefrenceNo: '',
                                            status: LoanStatus.DISBURSAL_SHEET_SENT
                                        })
                                    ])
                                ];
                            case 3:
                                _ref = _sliced_to_array.apply(void 0, [
                                    _state.sent(),
                                    4
                                ]), checkDisbursed = _ref[0], disbCountCallHistoryCount = _ref[1], loan = _ref[2], loanCount = _ref[3];
                                disbursalCountCh = disbCountCallHistoryCount[0]['count(*)'];
                                accountNo = loan.accountNo, bankIfsc = loan.bankIfsc, loanNo = loan.loanNo, loanID = loan.loanID, disbursalAmount = loan.disbursalAmount, deduction = loan.deduction, companyAccountNo = loan.companyAccountNo;
                                return [
                                    4,
                                    this.customerModel.findOneCustomer({
                                        customerID: customerID
                                    })
                                ];
                            case 4:
                                customer = _state.sent();
                                return [
                                    4,
                                    this.disbursalJobsModel.count({
                                        where: {
                                            customerID: customerID,
                                            leadID: leadID,
                                            loanID: loanID
                                        }
                                    })
                                ];
                            case 5:
                                countDisbursalJobs = _state.sent();
                                if (!(checkDisbursed === 0 && countDisbursalJobs === 0 && disbursalCountCh === 0 && loanCount === 1)) return [
                                    3,
                                    7
                                ];
                                return [
                                    4,
                                    Promise.all([
                                        this.disbursalJobsModel.create({
                                            customerID: customerID,
                                            leadID: leadID,
                                            loanID: loanID,
                                            loanNo: loanNo,
                                            accountNo: +accountNo,
                                            ifsc: bankIfsc,
                                            actualDisbAmount: (disbursalAmount - deduction).str,
                                            custName: customer.name,
                                            custMobile: customer.mobile.str,
                                            custEmail: customer.email,
                                            companyAcc: companyAccountNo,
                                            userID: +config.defaultUserId
                                        }),
                                        // ! Auto disbursal Log
                                        this.autoDisbursalLogModel.create({
                                            customerID: customerID,
                                            leadID: leadID,
                                            userID: +config.defaultUserId,
                                            status: 'disbursal initiation'
                                        })
                                    ])
                                ];
                            case 6:
                                _state.sent();
                                _state.label = 7;
                            case 7:
                                return [
                                    3,
                                    10
                                ];
                            case 8:
                                error = _state.sent();
                                return [
                                    4,
                                    this.autoDisbursalLogModel.create({
                                        customerID: customerID,
                                        leadID: leadID,
                                        userID: +config.defaultUserId,
                                        status: 'disbursal initiation'
                                    })
                                ];
                            case 9:
                                _state.sent();
                                return [
                                    3,
                                    10
                                ];
                            case 10:
                                return [
                                    2
                                ];
                        }
                    });
                }).call(this);
            }
        },
        {
            key: "calculatePaydayLoanSanctionData",
            value: function calculatePaydayLoanSanctionData(leadID, customerID, userID) {
                return _async_to_generator(function() {
                    var _ref, lead, customer, loan, approval, accountDetails, tenure, disbursalMoment, repayMoment, rep, rep1, inte, intem, inte1, adm, gst, tam, perRoi, firstBalance, secondBalance, cashFlows, apr, fdb, to, subject, from, blade, mailData;
                    return _ts_generator(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                return [
                                    4,
                                    Promise.all([
                                        this.leadModel.findOne({
                                            where: {
                                                leadID: leadID
                                            }
                                        }),
                                        this.customerModel.findOneCustomer({
                                            customerID: customerID
                                        }),
                                        this.findOne({
                                            customerID: customerID,
                                            leadID: leadID
                                        }),
                                        this.approvalModel.findOne({
                                            where: {
                                                customerID: customerID,
                                                leadID: leadID
                                            }
                                        })
                                    ])
                                ];
                            case 1:
                                _ref = _sliced_to_array.apply(void 0, [
                                    _state.sent(),
                                    4
                                ]), lead = _ref[0], customer = _ref[1], loan = _ref[2], approval = _ref[3];
                                return [
                                    4,
                                    this.razorpayMandateModel.findOne({
                                        where: {
                                            id: lead.em_id
                                        }
                                    })
                                ];
                            case 2:
                                accountDetails = _state.sent();
                                if (!!accountDetails) return [
                                    3,
                                    4
                                ];
                                return [
                                    4,
                                    this.customerAccountModel.findOne({
                                        where: {
                                            customerID: lead === null || lead === void 0 ? void 0 : lead.customerID
                                        },
                                        order: [
                                            {
                                                column: 'accountID',
                                                order: 'desc'
                                            }
                                        ]
                                    })
                                ];
                            case 3:
                                accountDetails = _state.sent();
                                return [
                                    3,
                                    5
                                ];
                            case 4:
                                accountDetails.bankIfsc = accountDetails === null || accountDetails === void 0 ? void 0 : accountDetails.ifsc;
                                _state.label = 5;
                            case 5:
                                tenure = approval === null || approval === void 0 ? void 0 : approval.tenure;
                                if (approval && loan) {
                                    disbursalMoment = moment(loan === null || loan === void 0 ? void 0 : loan.disbursalDate).startOf('day');
                                    repayMoment = moment(approval === null || approval === void 0 ? void 0 : approval.repayDate).startOf('day');
                                    tenure = Math.abs(repayMoment.diff(disbursalMoment, 'days'));
                                }
                                rep = Math.round((approval === null || approval === void 0 ? void 0 : approval.loanAmtApproved) * ((approval === null || approval === void 0 ? void 0 : approval.roi) / 100));
                                rep1 = (approval === null || approval === void 0 ? void 0 : approval.loanAmtApproved) + rep * tenure;
                                inte = rep * 30;
                                intem = rep * tenure;
                                inte1 = inte * 12;
                                adm = (approval === null || approval === void 0 ? void 0 : approval.adminFee) || 0;
                                gst = +(adm * (18 / 100)).toFixed(2);
                                tam = adm + gst;
                                perRoi = (approval === null || approval === void 0 ? void 0 : approval.roi) / 100; // Convert ROI to decimal
                                // Initial loan balance including fees
                                // public function getIPR($loanAmount, $platFormFee, $otherFee, $tenure, $roi)
                                firstBalance = -((approval === null || approval === void 0 ? void 0 : approval.loanAmtApproved) - approval.adminFee - gst);
                                // Final balance including interest
                                secondBalance = approval.loanAmtApproved + approval.loanAmtApproved * perRoi * tenure;
                                // Cash flow array for IRR calculation
                                cashFlows = [
                                    firstBalance,
                                    secondBalance
                                ];
                                apr = +(this.calculateIRR(cashFlows, perRoi) * 100 * 12).toFixed(2);
                                fdb = (approval === null || approval === void 0 ? void 0 : approval.loanAmtApproved) - tam;
                                to = customer === null || customer === void 0 ? void 0 : customer.email;
                                subject = 'Loan Sanction Letter Ram Fincorp';
                                from = 'credit@ramfincorp.com';
                                blade = 'email.sanction';
                                mailData = {
                                    leadDetails: lead,
                                    customerDetails: customer,
                                    loanDetails: loan,
                                    approvalDetails: approval,
                                    accountDetails: accountDetails,
                                    intem: intem,
                                    gst: gst,
                                    apr: apr,
                                    fdb: fdb,
                                    rep1: rep1,
                                    tenure: tenure
                                };
                                return [
                                    2,
                                    mailData
                                ];
                        }
                    });
                // private function calculateIRR($cashFlows, $guess = 0.1)
                }).call(this);
            }
        },
        {
            key: "calculateIRR",
            value: function calculateIRR(cashFlows) {
                var _loop = function() {
                    iteration++;
                    var npv = 0 // Net Present Value (NPV).
                    ;
                    var derivative = 0;
                    // Calculate NPV and its derivative using cash flows.
                    cashFlows.forEach(function(cashFlow, t) {
                        npv += cashFlow / Math.pow(1 + rate, t);
                        derivative += -(t * cashFlow) / Math.pow(1 + rate, t + 1);
                    });
                    var newRate = rate - npv / derivative // Update rate using Newton-Raphson.
                    ;
                    if (Math.abs(newRate - rate) < precision) {
                        // Check if difference is within the desired precision.
                        return "break";
                    }
                    rate = newRate;
                };
                var guess = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 0.1;
                var precision = 1e-6 // Desired precision
                ;
                var iteration = 0;
                var maxIteration = 1000 // Maximum iterations to avoid infinite loops.
                ;
                var rate = guess;
                do {
                    var _ret = _loop();
                    if (_ret === "break") break;
                }while (iteration < maxIteration);
                return rate;
            }
        },
        {
            key: "calculateEmiLoanSanctionData",
            value: function calculateEmiLoanSanctionData(leadID, customerID, userID) {
                return _async_to_generator(function() {
                    var _emiDetails_amountToBeRepayed, _emiDetails_interest, _ref, lead, customer, loan, approval, installments, em_id, accountDetails, lastInstallment, dueDate, disbursalDate, tenureInDays, emiDetails, tenure, disbursalAmount, rep, rep1, intem, adminFee, gst, tam, apr, fdb, daysDiff, bpi;
                    return _ts_generator(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                return [
                                    4,
                                    Promise.all([
                                        this.leadModel.findOne({
                                            where: {
                                                leadID: leadID
                                            }
                                        }),
                                        this.customerModel.findOneCustomer({
                                            customerID: customerID
                                        }),
                                        this.findOne({
                                            customerID: customerID,
                                            leadID: leadID
                                        }),
                                        this.approvalModel.findOne({
                                            where: {
                                                customerID: customerID,
                                                leadID: leadID
                                            }
                                        }),
                                        this.emiModel.find({
                                            where: {
                                                customerID: customerID,
                                                leadID: leadID
                                            },
                                            order: [
                                                {
                                                    column: 'emiID',
                                                    order: 'desc'
                                                }
                                            ]
                                        })
                                    ])
                                ];
                            case 1:
                                _ref = _sliced_to_array.apply(void 0, [
                                    _state.sent(),
                                    5
                                ]), lead = _ref[0], customer = _ref[1], loan = _ref[2], approval = _ref[3], installments = _ref[4];
                                em_id = lead.em_id;
                                return [
                                    4,
                                    this.razorpayMandateModel.findOne({
                                        where: {
                                            id: em_id
                                        }
                                    })
                                ];
                            case 2:
                                accountDetails = _state.sent();
                                if (!!accountDetails) return [
                                    3,
                                    4
                                ];
                                return [
                                    4,
                                    this.customerAccountModel.findOne({
                                        where: {
                                            customerID: customerID
                                        },
                                        order: [
                                            {
                                                column: 'accountID',
                                                order: 'desc'
                                            }
                                        ]
                                    })
                                ];
                            case 3:
                                accountDetails = _state.sent();
                                return [
                                    3,
                                    5
                                ];
                            case 4:
                                accountDetails.bankIfsc = accountDetails.ifsc;
                                _state.label = 5;
                            case 5:
                                lastInstallment = installments[0];
                                dueDate = moment(lastInstallment.dueDate).format('YYYY-MM-DD');
                                disbursalDate = moment(loan.disbursalDate).format('YYYY-MM-DD');
                                tenureInDays = moment(dueDate).diff(disbursalDate, 'days');
                                return [
                                    4,
                                    this.creditModel.findOneCredit({
                                        customerID: customerID,
                                        leadID: leadID
                                    })
                                ];
                            case 6:
                                emiDetails = _state.sent();
                                tenure = emiDetails.tenure;
                                disbursalAmount = approval.loanAmtApproved;
                                rep = +(disbursalAmount + approval.roi).toFixed(2);
                                rep1 = (_emiDetails_amountToBeRepayed = emiDetails.amountToBeRepayed) !== null && _emiDetails_amountToBeRepayed !== void 0 ? _emiDetails_amountToBeRepayed : disbursalAmount;
                                intem = (_emiDetails_interest = emiDetails.interest) !== null && _emiDetails_interest !== void 0 ? _emiDetails_interest : 0;
                                adminFee = approval.adminFee;
                                gst = +(adminFee * 0.18).toFixed(2);
                                tam = +(adminFee + gst).toFixed(2);
                                apr = getEmiAPR(disbursalAmount.str, adminFee.str, gst.str, tenure.str, approval.roi.str);
                                fdb = disbursalAmount - tam;
                                daysDiff = moment(approval.repayDate).startOf('day').diff(moment(loan.disbursalDate).startOf('day'));
                                bpi = +(approval.loanAmtApproved * (approval.roi / 100) * (daysDiff * 365)).toFixed(2);
                                if (bpi < 0) bpi = 0;
                                return [
                                    2,
                                    {
                                        lead: lead,
                                        customer: customer,
                                        loan: loan,
                                        approvalDetails: approval,
                                        accountDetails: accountDetails,
                                        intem: intem,
                                        gst: gst,
                                        apr: apr,
                                        fdb: fdb,
                                        rep1: rep1,
                                        tenure: tenure,
                                        installments: installments,
                                        credits: emiDetails,
                                        tenureInDays: tenureInDays,
                                        bpi: bpi
                                    }
                                ];
                        }
                    });
                }).call(this);
            }
        },
        {
            key: "getLoanLeadDetail",
            value: function getLoanLeadDetail(leadID) {
                return _async_to_generator(function() {
                    var leadDetail, loanDisbursed, roi, nod, rd, penDay, toi, penAmount, coAmount, gstAmount, repayAmount, approvalAmount, loanTenure, approval, adminFee, repaymentAmount, loan, loanDisbursed1, sta, cur, mi1, mi, totPay, cola, adgst, svs, dbu, paA, tda;
                    return _ts_generator(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                return [
                                    4,
                                    this.leadModel.findOneLead({
                                        leadID: leadID
                                    })
                                ];
                            case 1:
                                leadDetail = _state.sent();
                                loanDisbursed = 0;
                                roi = 0;
                                nod = 0;
                                rd = 0;
                                penDay = 0;
                                toi = 0;
                                penAmount = 0;
                                coAmount = 0;
                                gstAmount = 0;
                                repayAmount = 0;
                                approvalAmount = 0;
                                loanTenure = 0;
                                adminFee = 0;
                                repaymentAmount = 0;
                                if (!leadDetail) return [
                                    3,
                                    5
                                ];
                                return [
                                    4,
                                    this.loaneModel.findOneLoan({
                                        customerID: leadDetail.customerID,
                                        leadID: leadDetail.leadID
                                    })
                                ];
                            case 2:
                                loan = _state.sent();
                                loanDisbursed1 = loan.disbursalAmount;
                                if (!loan.disbursalRefrenceNo) return [
                                    3,
                                    5
                                ];
                                return [
                                    4,
                                    this.approvalModel.findOneApproval({
                                        customerID: leadDetail.customerID,
                                        leadID: leadDetail.leadID
                                    })
                                ];
                            case 3:
                                approval = _state.sent();
                                approvalAmount = approval.loanAmtApproved;
                                loanTenure = approval.tenure;
                                roi = approval.roi;
                                sta = new Date(approval.repayDate);
                                cur = new Date();
                                mi1 = roi / 100;
                                mi = Math.round(loan.disbursalAmount * mi1 * 100) / 100;
                                nod = (new Date(approval.repayDate).getTime() - new Date(loan.disbursalDate).getTime()) / (1000 * 60 * 60 * 24);
                                if (new Date(approval.repayDate) >= cur) {
                                    rd = (cur.getTime() - new Date(loan.disbursalDate).getTime()) / (1000 * 60 * 60 * 24);
                                } else {
                                    rd = nod;
                                }
                                penDay = 0;
                                if (cur > sta) {
                                    penDay = (cur.getTime() - sta.getTime()) / (1000 * 60 * 60 * 24);
                                }
                                toi = mi * rd;
                                if (penDay > 0) {
                                    penAmount = Math.round(loan.disbursalAmount * (1.25 / 100) * 100) / 100 * penDay;
                                } else {
                                    penAmount = 0;
                                }
                                totPay = loan.disbursalAmount + toi + penAmount;
                                return [
                                    4,
                                    this.collectionModel.CollectionKnex.where({
                                        collectionStatus: LeadStatus.APPROVED,
                                        customerID: leadDetail.customerID,
                                        leadID: leadDetail.leadID
                                    }).sum('collectedAmount')
                                ];
                            case 4:
                                cola = _state.sent();
                                repaymentAmount = totPay - coAmount;
                                adgst = Math.round(approval.adminFee * (18 / 100) * 100) / 100;
                                svs = adgst + approval.adminFee;
                                dbu = loan.disbursalAmount - svs;
                                gstAmount = adgst;
                                adminFee = approval.adminFee;
                                paA = Math.round(loan.disbursalAmount * (approval.roi / 100));
                                tda = paA * approval.tenure;
                                repayAmount = loan.disbursalAmount + tda;
                                _state.label = 5;
                            case 5:
                                return [
                                    2,
                                    {
                                        loan_disbursed: loanDisbursed,
                                        roi: roi,
                                        no_days: nod,
                                        real_days: rd,
                                        penalty_days: penDay,
                                        real_interest: toi,
                                        penalty_intrest: penAmount,
                                        paid_amount: coAmount,
                                        repayment_amount: repaymentAmount,
                                        gst_amount: gstAmount,
                                        admin_fee: adminFee,
                                        repay_amount: repayAmount,
                                        approval_amount: approvalAmount,
                                        loan_tenure: loanTenure,
                                        creda: approval,
                                        disba: loan
                                    }
                                ];
                        }
                    });
                }).call(this);
            }
        },
        {
            key: "calculateAdminFee",
            value: function calculateAdminFee(loanAmount, adminFeePercentage) {
                return loanAmount * (adminFeePercentage / 100);
            }
        }
    ]);
    return LoanService;
}(ResponseService);
export default LoanService;
export var loanService = new LoanService();

//# sourceMappingURL=loan.service.js.map