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
function _sliced_to_array(arr, i) {
    return _array_with_holes(arr) || _iterable_to_array_limit(arr, i) || _unsupported_iterable_to_array(arr, i) || _non_iterable_rest();
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
import { LeadStatus } from '@/enums/lead.enum';
import CommonHelper from '@/helpers/common';
import CreditService from '@/services/credit.service';
import LoanService from '@/services/loan.service';
import OnlinePaymentService from '@/services/onlinepayment.service';
import OnlinePaymentLogService from '@/services/onlinepaymentlog.services';
import moment from 'moment-timezone';
import { emiModel } from '../database/mysql/emi';
import { EmiService } from './emi.service';
var EmiCollectionService = /*#__PURE__*/ function() {
    "use strict";
    function EmiCollectionService() {
        var _this = this;
        _class_call_check(this, EmiCollectionService);
        _define_property(this, "creditService", new CreditService());
        _define_property(this, "loanService", new LoanService());
        _define_property(this, "emiService", new EmiService());
        _define_property(this, "onlinePaymentLogService", new OnlinePaymentLogService());
        _define_property(this, "onlinePaymentServices", new OnlinePaymentService());
        _define_property(this, "emiModel", emiModel);
        /**
   * Processes an EMI for display
   */ _define_property(this, "processEmi", function(emi, credit) {
            return _async_to_generator(function() {
                var dueMoment, currentMoment, delayDays, penaltyDays, dpd, actualPaymentMoment, pendingAmount, totalPaid, waiver, amountPayable;
                return _ts_generator(this, function(_state) {
                    // Calculate dates and delays using moment with Asia/Kolkata timezone
                    dueMoment = moment(emi.dueDate).tz('Asia/Kolkata').startOf('day');
                    currentMoment = moment().tz('Asia/Kolkata').startOf('day');
                    delayDays = Math.max(0, currentMoment.diff(dueMoment, 'days'));
                    // Calculate penalty days based on payment date
                    penaltyDays = delayDays;
                    dpd = '';
                    if (emi.actualPaymentDate) {
                        actualPaymentMoment = moment(emi.actualPaymentDate).tz('Asia/Kolkata').startOf('day');
                        if (actualPaymentMoment.isAfter(dueMoment)) {
                            penaltyDays = Math.max(0, currentMoment.diff(actualPaymentMoment, 'days'));
                            if (emi.status === 'paid') {
                                dpd = String(Math.max(0, actualPaymentMoment.diff(dueMoment, 'days')));
                            }
                        }
                    }
                    // If EMI is settled in this simulation run, set actualPaymentDate to today
                    if ((emi.status === 'paid' || emi.status === 'partially-paid') && !emi.actualPaymentDate) {
                        emi.actualPaymentDate = new Date();
                    }
                    // Update EMI values based on status and delay
                    this.updateEmiValuesBasedOnStatus(emi, penaltyDays, delayDays, credit.roi);
                    // Calculate amounts
                    pendingAmount = this.emiService.roundToTwo(this.calculatePendingAmount(emi, delayDays));
                    totalPaid = this.emiService.roundToTwo(emi.paymentReceived);
                    // Handle waivers
                    waiver = emi.waiver;
                    amountPayable = this.calculateAmountPayable(emi, waiver);
                    emi.amountPayable = amountPayable;
                    emi.waive_off_amount = this.emiService.roundToTwo(emi.waive_off_amount || 0);
                    emi.tempAmountPayable = waiver ? emi.amountPayable - this.emiService.roundToTwo(waiver.amount) : 0;
                    emi.isTempWaiverActive = waiver ? true : false;
                    // Update display properties
                    emi.dueDate = dueMoment.toDate();
                    emi.dpd = dpd;
                    // Set status and colors
                    this.setEmiDisplayProperties(emi, delayDays, pendingAmount, totalPaid);
                    return [
                        2,
                        emi
                    ];
                });
            }).call(_this);
        });
        /**
   * Calculate pending amount for an EMI with optimized conditional logic
   */ _define_property(this, "calculatePendingEMIAmounts", function(emi) {
            // Use the status as a key for simpler conditional logic
            var isPaid = emi.status === 'paid';
            var isPartiallyPaid = emi.status === 'partially-paid';
            // Calculate components more efficiently with simplified conditions
            var pendingBounce = isPaid ? 0 : isPartiallyPaid ? emi.amountRemainsBrokenPeriodIntrest : emi.brokenPeriodIntrest;
            var pendingPenalty = isPaid ? 0 : isPartiallyPaid ? emi.amountRemainsPenalty : emi.panelty;
            var pendingPrincipal = isPaid ? 0 : isPartiallyPaid ? emi.amountRemains : emi.principal;
            var pendingInterest = isPaid ? 0 : isPartiallyPaid ? emi.amountRemainsInterest : emi.interest;
            // Return total pending amount
            return {
                pendingBounce: pendingBounce,
                pendingPenalty: pendingPenalty,
                pendingPrincipal: pendingPrincipal,
                pendingInterest: pendingInterest,
                isPaid: isPaid,
                isPartiallyPaid: isPartiallyPaid
            };
        });
        /**
   * Process transaction data for display using moment.js
   */ _define_property(this, "processTransaction", function(transaction) {
            var amount = transaction.amount, status = transaction.status, mode = transaction.mode, referenceNo = transaction.referenceNo, createdAt = transaction.createdAt;
            // Format status text and color
            var formattedStatus = status === 1 || status === 3 ? 'Success' : 'Failed';
            var statusColor = status === 1 || status === 3 ? '#14D44A' : '#D93C3C';
            // Format date for display using moment with Asia/Kolkata timezone
            var formattedDate = moment(createdAt).tz('Asia/Kolkata').format('D MMM YYYY h:mm A');
            // Return formatted transaction data
            return {
                amount: {
                    text: 'Amount',
                    value: amount,
                    color: '#1F1F1F',
                    bgColor: ''
                },
                status: {
                    text: 'Status',
                    value: formattedStatus,
                    color: statusColor,
                    bgColor: ''
                },
                createdAt: {
                    text: 'Date & Time',
                    value: formattedDate,
                    color: '#585858',
                    bgColor: ''
                },
                referenceNo: {
                    text: 'Transaction ID',
                    value: referenceNo,
                    color: '#585858',
                    bgColor: ''
                },
                mode: {
                    text: 'Payment mode',
                    value: mode,
                    color: '#585858',
                    bgColor: ''
                }
            };
        });
        /**
   * Find the last successful payment date using moment.js
   */ _define_property(this, "calculateLastPaymentDate", function(transactions) {
            if (!transactions || !transactions.length) {
                return '';
            }
            // Find all successful transactions (status 1)
            var successTransactions = transactions.filter(function(transaction) {
                return transaction.status === 1;
            });
            if (!successTransactions.length) {
                return '';
            }
            // Sort by date (newest first) and get the most recent
            return successTransactions.sort(function(a, b) {
                return moment(b.createdAt).valueOf() - moment(a.createdAt).valueOf();
            })[0].createdAt;
        });
    }
    _create_class(EmiCollectionService, [
        {
            key: "findOnlinePayment",
            value: // Payment related methods
            /**
   * Finds an online payment by its order ID
   */ function findOnlinePayment(orderId) {
                return _async_to_generator(function() {
                    return _ts_generator(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                return [
                                    4,
                                    this.onlinePaymentServices.findOne({
                                        razorpayOrderId: orderId
                                    }, {
                                        orderKey: 'pID',
                                        orderValue: 'desc'
                                    }, [
                                        '*'
                                    ])
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
            key: "logPaymentUpdate",
            value: /**
   * Logs payment update details
   */ function logPaymentUpdate(pID, paymentDetails, payload) {
                return _async_to_generator(function() {
                    return _ts_generator(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                return [
                                    4,
                                    this.onlinePaymentLogService.create(pID, paymentDetails.order_id, paymentDetails.id, paymentDetails.status, payload)
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
            key: "findCredit",
            value: // Data retrieval methods
            /**
   * Finds credit information by lead ID
   */ function findCredit(leadID) {
                return _async_to_generator(function() {
                    return _ts_generator(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                return [
                                    4,
                                    this.creditService.findOne({
                                        leadID: leadID
                                    }, [
                                        '*'
                                    ])
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
            key: "findLastEmi",
            value: /**
   * Finds the last EMI for a credit
   */ function findLastEmi(creditID) {
                return _async_to_generator(function() {
                    return _ts_generator(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                return [
                                    4,
                                    this.emiService.findOne({
                                        creditID: creditID
                                    }, [
                                        '*'
                                    ])
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
            key: "findLoan",
            value: /**
   * Finds loan information by lead ID
   */ function findLoan(leadID) {
                return _async_to_generator(function() {
                    return _ts_generator(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                return [
                                    4,
                                    this.loanService.findOne({
                                        leadID: leadID
                                    }, [
                                        'loanNo'
                                    ])
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
            key: "findEmiById",
            value: /**
   * Finds EMI by ID
   */ function findEmiById(emiID) {
                return _async_to_generator(function() {
                    return _ts_generator(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                return [
                                    4,
                                    this.emiService.findOne({
                                        emiID: emiID
                                    }, [
                                        '*'
                                    ])
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
            key: "processCapturedPayment",
            value: /**
   * Processes a captured payment
   */ function processCapturedPayment(emi, paymentDetails, credit, lastEmi, loan) {
                return _async_to_generator(function() {
                    var status, delayDays, emiRemains, lead;
                    return _ts_generator(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                status = parseInt(paymentDetails.amount) < emi.amountRemains ? 'partially-paid' : 'paid';
                                delayDays = this.calculateDelayDays(emi.dueDate);
                                return [
                                    4,
                                    this.emiService.updateOne({
                                        emiID: emi.emiID
                                    }, {
                                        status: status,
                                        actualPaymentDate: new Date(),
                                        delayDays: delayDays,
                                        paymentID: paymentDetails.id
                                    })
                                ];
                            case 1:
                                _state.sent();
                                return [
                                    4,
                                    this.countRemainingEmis(credit.creditID)
                                ];
                            case 2:
                                emiRemains = _state.sent();
                                return [
                                    4,
                                    this.updateCreditStatus(emiRemains, credit, paymentDetails.amount)
                                ];
                            case 3:
                                _state.sent();
                                return [
                                    4,
                                    this.findLead(credit.leadID)
                                ];
                            case 4:
                                lead = _state.sent();
                                return [
                                    4,
                                    this.createCallHistoryLog(credit, lead, paymentDetails.amount)
                                ];
                            case 5:
                                _state.sent();
                                return [
                                    4,
                                    this.handleTransaction(paymentDetails, credit, loan, 1)
                                ];
                            case 6:
                                _state.sent();
                                return [
                                    4,
                                    CommonHelper.lastEMIUpdater(emiRemains, credit.creditID, lastEmi.dueDate, credit.actualTenure, credit.leadID)
                                ];
                            case 7:
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
            key: "processManualPayment",
            value: /**
   * Processes a manual payment against EMIs in chronological order of due dates
   * Uses global variables to track excess amount and required amount across iterations
   *
   * @param transactionDetails - Payment transaction details
   * @param credit - Credit information
   * @param emis - Array of EMIs to process
   * @param resultEmis - Object to store the processed EMI results
   * @returns Object with updated EMI details
   */ function processManualPayment(transactionDetails, excessAmount, credit, emis, resultEmis) {
                return _async_to_generator(function() {
                    var remainingTransactionAmount, i, emi, emiDetails, error;
                    return _ts_generator(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                _state.trys.push([
                                    0,
                                    5,
                                    ,
                                    6
                                ]);
                                // Set global excess amount and current transaction amount
                                remainingTransactionAmount = Number(transactionDetails.amount) || 0;
                                i = 0;
                                _state.label = 1;
                            case 1:
                                if (!(i < emis.length)) return [
                                    3,
                                    4
                                ];
                                emi = emis[i];
                                // Skip fully paid EMIs
                                if (remainingTransactionAmount <= 0) {
                                    return [
                                        3,
                                        4
                                    ];
                                }
                                return [
                                    4,
                                    this.processEmiPayment(emi, credit, transactionDetails, excessAmount, remainingTransactionAmount)
                                ];
                            case 2:
                                emiDetails = _state.sent();
                                if (emiDetails.status === 'paid') {
                                    // Update remaining transaction amount
                                    remainingTransactionAmount = emiDetails.accessAmount;
                                    emiDetails.accessAmount = 0;
                                } else {
                                    // EMI is partially paid, no excess to carry forward
                                    excessAmount = 0;
                                    remainingTransactionAmount = 0;
                                    // Update EMI details with the remaining amount
                                    emiDetails.accessAmount = excessAmount;
                                }
                                // Update total amount payable for the EMI
                                emiDetails.totalAmountPayable = this.emiService.roundToTwo(emiDetails.principal + emiDetails.interest + emiDetails.panelty + emiDetails.brokenPeriodIntrest);
                                if (emiDetails.status === 'partially-paid') {
                                    // Update total amount payable for the EMI
                                    emiDetails.totalAmountPayable = this.emiService.roundToTwo(emiDetails.amountRemains + emiDetails.amountRemainsInterest + emiDetails.amountRemainsPenalty + emiDetails.amountRemainsBrokenPeriodIntrest + emiDetails.paymentReceived);
                                }
                                // Update resultEmis with the processed EMI details
                                resultEmis[emi.emiID] = emiDetails;
                                _state.label = 3;
                            case 3:
                                i++;
                                return [
                                    3,
                                    1
                                ];
                            case 4:
                                return [
                                    2,
                                    resultEmis
                                ];
                            case 5:
                                error = _state.sent();
                                throw error;
                            case 6:
                                return [
                                    2
                                ];
                        }
                    });
                }).call(this);
            }
        },
        {
            key: "processEmiPayment",
            value: /**
   * Process payment for a single EMI using global variables for amount tracking
   * @private
   */ function processEmiPayment(emi, credit, transactionDetails, excessAmount, remainingTransactionAmount) {
                return _async_to_generator(function() {
                    var _moment_startOf, transactionAmount, transactionDate, dueDateMoment, actualPaymentDateMoment, delayDays, _this_getCurrentEmiComponents, pendingInterest, pendingPrincipal, pendingPenalty, pendingBounce, allocation, totalRemaining, amountPaidToEmi, calculatedExcess, isFullyPaid, emiRemainingAfterPayment, status, updatedEmi;
                    return _ts_generator(this, function(_state) {
                        // Initialise variables
                        transactionAmount = remainingTransactionAmount > 0 ? remainingTransactionAmount : this.emiService.roundToTwo(transactionDetails.amount + excessAmount);
                        transactionDate = (_moment_startOf = moment(transactionDetails.transactionDate).startOf('day')) !== null && _moment_startOf !== void 0 ? _moment_startOf : moment().startOf('day');
                        // Safely compare actualPaymentDate and dueDate
                        dueDateMoment = moment(emi.dueDate).startOf('day');
                        if (emi.actualPaymentDate !== null) {
                            actualPaymentDateMoment = moment(emi.actualPaymentDate).startOf('day');
                            if (actualPaymentDateMoment.isAfter(dueDateMoment)) {
                                dueDateMoment = actualPaymentDateMoment;
                            }
                        }
                        delayDays = this.calculateDelayDaysFromDates(transactionDate, dueDateMoment);
                        _this_getCurrentEmiComponents = this.getCurrentEmiComponents(emi, delayDays, credit.roi), pendingInterest = _this_getCurrentEmiComponents.pendingInterest, pendingPrincipal = _this_getCurrentEmiComponents.pendingPrincipal, pendingPenalty = _this_getCurrentEmiComponents.pendingPenalty, pendingBounce = _this_getCurrentEmiComponents.pendingBounce;
                        // Allocate payment to EMI components
                        allocation = this.allocatePayment(transactionAmount, pendingInterest, pendingPrincipal, pendingPenalty, pendingBounce);
                        totalRemaining = this.emiService.roundToTwo(allocation.remainingPrincipal + allocation.remainingInterest + allocation.remainingPenalty + allocation.remainingBounceCharge);
                        // Calculate how much we've actually paid towards this EMI
                        amountPaidToEmi = allocation.totalPaid;
                        // Calculate potential excess amount after payment
                        calculatedExcess = allocation.excessAmount;
                        // Determine if EMI should be marked as fully paid
                        isFullyPaid = totalRemaining <= 0 || calculatedExcess > 0;
                        // Prepare the remaining payment details with adjustment for small remaining amounts
                        emiRemainingAfterPayment = {
                            principal: isFullyPaid ? 0 : allocation.remainingPrincipal,
                            interest: isFullyPaid ? 0 : allocation.remainingInterest,
                            penalty: isFullyPaid ? 0 : allocation.remainingPenalty,
                            bounceCharge: isFullyPaid ? 0 : allocation.remainingBounceCharge
                        };
                        // Update final status based on payment result
                        status = isFullyPaid ? 'paid' : 'partially-paid';
                        // Update excess amount for next iteration
                        excessAmount = calculatedExcess;
                        updatedEmi = {
                            emiID: emi.emiID,
                            status: status,
                            actualPaymentDate: moment(transactionDate).startOf('day').toDate(),
                            delayDays: delayDays,
                            paymentID: emi.paymentID,
                            principal: emi.principal,
                            interest: emi.interest,
                            amountRemains: emiRemainingAfterPayment.principal,
                            amountRemainsInterest: emiRemainingAfterPayment.interest,
                            amountRemainsPenalty: emiRemainingAfterPayment.penalty,
                            amountRemainsBrokenPeriodIntrest: emiRemainingAfterPayment.bounceCharge,
                            panelty: Math.max(emi.panelty || 0, pendingPenalty),
                            brokenPeriodIntrest: Math.max(emi.brokenPeriodIntrest, pendingBounce),
                            paymentReceived: (emi.paymentReceived || 0) + amountPaidToEmi,
                            totalAmountPayable: emi.totalAmountPayable || 0,
                            dueDate: moment(emi.dueDate).startOf('day').toDate(),
                            accessAmount: excessAmount,
                            is_deleted: emi.is_deleted,
                            waive_off_amount: emi.waive_off_amount || 0
                        };
                        return [
                            2,
                            updatedEmi
                        ];
                    });
                }).call(this);
            }
        },
        {
            key: "allocatePayment",
            value: /**
   * Allocate payment to different EMI components with improved reliability
   * @private
   */ function allocatePayment(transactionAmount, interest, principal, penalty, bounceCharge) {
                // Validate and normalize inputs
                var validTransactionAmount = Math.max(0, Number(transactionAmount) || 0);
                var validInterest = Math.max(0, Number(interest) || 0);
                var validPrincipal = Math.max(0, Number(principal) || 0);
                var validPenalty = Math.max(0, Number(penalty) || 0);
                var validBounceCharge = Math.max(0, Number(bounceCharge) || 0);
                var remainingPayment = validTransactionAmount;
                var totalPaid = 0;
                // Allocate payment to interest first
                var interestPaid = 0;
                var remainingInterest = validInterest;
                if (remainingPayment > 0 && validInterest > 0) {
                    if (remainingPayment >= validInterest) {
                        interestPaid = validInterest;
                        remainingPayment -= validInterest;
                        remainingInterest = 0;
                    } else {
                        interestPaid = remainingPayment;
                        remainingInterest = validInterest - remainingPayment;
                        remainingPayment = 0;
                    }
                    totalPaid += interestPaid;
                }
                // Allocate remaining payment to principal
                var principalPaid = 0;
                var remainingPrincipal = validPrincipal;
                if (remainingPayment > 0 && validPrincipal > 0) {
                    if (remainingPayment >= validPrincipal) {
                        principalPaid = validPrincipal;
                        remainingPayment -= validPrincipal;
                        remainingPrincipal = 0;
                    } else {
                        principalPaid = remainingPayment;
                        remainingPrincipal = validPrincipal - remainingPayment;
                        remainingPayment = 0;
                    }
                    totalPaid += principalPaid;
                }
                // Allocate remaining payment to penalty
                var penaltyPaid = 0;
                var remainingPenalty = validPenalty;
                if (remainingPayment > 0 && validPenalty > 0) {
                    if (remainingPayment >= validPenalty) {
                        penaltyPaid = validPenalty;
                        remainingPayment -= validPenalty;
                        remainingPenalty = 0;
                    } else {
                        penaltyPaid = remainingPayment;
                        remainingPenalty = validPenalty - remainingPayment;
                        remainingPayment = 0;
                    }
                    totalPaid += penaltyPaid;
                }
                // Allocate remaining payment to bounce charge
                var bounceChargePaid = 0;
                var remainingBounceCharge = validBounceCharge;
                if (remainingPayment > 0 && validBounceCharge > 0) {
                    if (remainingPayment >= validBounceCharge) {
                        bounceChargePaid = validBounceCharge;
                        remainingPayment -= validBounceCharge;
                        remainingBounceCharge = 0;
                    } else {
                        bounceChargePaid = remainingPayment;
                        remainingBounceCharge = validBounceCharge - remainingPayment;
                        remainingPayment = 0;
                    }
                    totalPaid += bounceChargePaid;
                }
                var result = {
                    remainingInterest: this.emiService.roundToTwo(remainingInterest),
                    remainingPrincipal: this.emiService.roundToTwo(remainingPrincipal),
                    remainingPenalty: this.emiService.roundToTwo(remainingPenalty),
                    remainingBounceCharge: this.emiService.roundToTwo(remainingBounceCharge),
                    totalPaid: this.emiService.roundToTwo(totalPaid),
                    excessAmount: this.emiService.roundToTwo(remainingPayment)
                };
                // Round all values to 2 decimal places for consistency
                return result;
            }
        },
        {
            key: "getCurrentEmiComponents",
            value: /**
   * Get current EMI components based on status
   * @private
   */ function getCurrentEmiComponents(emi, delayDays, roi) {
                var _this_calculatePendingEMIAmounts = this.calculatePendingEMIAmounts(emi), pendingInterest = _this_calculatePendingEMIAmounts.pendingInterest, pendingPrincipal = _this_calculatePendingEMIAmounts.pendingPrincipal, pendingPenalty = _this_calculatePendingEMIAmounts.pendingPenalty, pendingBounce = _this_calculatePendingEMIAmounts.pendingBounce, isPaid = _this_calculatePendingEMIAmounts.isPaid, isPartiallyPaid = _this_calculatePendingEMIAmounts.isPartiallyPaid;
                pendingPenalty = this.calculatePenaltyCharge(isPaid, isPartiallyPaid, pendingPenalty, pendingPrincipal, delayDays, roi);
                pendingBounce = this.calculateBounceCharge(isPaid, isPartiallyPaid, pendingBounce, delayDays);
                return {
                    pendingInterest: pendingInterest,
                    pendingPrincipal: pendingPrincipal,
                    pendingPenalty: pendingPenalty,
                    pendingBounce: pendingBounce
                };
            }
        },
        {
            key: "calculatePenaltyCharge",
            value: /**
   * Calculate penalty charge for an EMI
   * @private
   */ function calculatePenaltyCharge(isPaid, isPartiallyPaid, pendingPenalty, pendingPrincipal, delayDays, roi) {
                // If EMI is fully paid, no additional penalty
                if (isPaid) {
                    return 0;
                }
                // Start with existing penalty amount
                var totalPenalty = pendingPenalty;
                // If EMI is partially paid, check if there are delay days and and pending principal > 0
                if (isPartiallyPaid) {
                    if (delayDays > 0 && pendingPrincipal > 0) {
                        var additionalPenalty = this.emiService.calculatePenalty(pendingPrincipal, delayDays, roi);
                        totalPenalty += additionalPenalty;
                    }
                    return this.emiService.roundToTwo(totalPenalty);
                }
                // Ensure penalty is not negative and handle due case
                if (delayDays > 0) {
                    var additionalPenalty1 = this.emiService.calculatePenalty(pendingPrincipal, delayDays, roi);
                    totalPenalty += additionalPenalty1;
                }
                return this.emiService.roundToTwo(totalPenalty);
            }
        },
        {
            key: "calculateBounceCharge",
            value: /**
   * Calculate bounce charge based on EMI status and delay
   * @private
   */ function calculateBounceCharge(isPaid, isPartiallyPaid, pendingBounce, delayDays) {
                if (isPaid) {
                    return 0;
                }
                // If EMI is partially paid, check if there are delay days
                if (isPartiallyPaid) {
                    if (delayDays > 0 && pendingBounce === 0) {
                        // If there are delay days and no pending bounce, apply bounce charge
                        return this.emiService.bounceCharge();
                    }
                    // If there are no delay days or pending bounce, return existing bounce
                    return this.emiService.roundToTwo(pendingBounce);
                }
                var bounceCharge = delayDays > 0 ? this.emiService.bounceCharge() : 0;
                return bounceCharge;
            }
        },
        {
            key: "calculateDelayDaysFromDates",
            value: /**
   * Calculates delay days between payment date and due date using moment with Asia/Kolkata timezone
   * @private
   */ function calculateDelayDaysFromDates(transactionMoment, dueMoment) {
                // const transactionMoment = transactionDate.tz('Asia/Kolkata').startOf('day')
                // const dueMoment = dueDate.tz('Asia/Kolkata').startOf('day')
                if (transactionMoment.isSameOrBefore(dueMoment)) {
                    return 0;
                }
                var delayDays = transactionMoment.diff(dueMoment, 'days');
                return Math.max(0, delayDays);
            }
        },
        {
            key: "savePenalty",
            value: /**
   * Saves penalty information
   */ function savePenalty(credit, emiID, bounceCharge, discription) {
                return _async_to_generator(function() {
                    return _ts_generator(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                return [
                                    4,
                                    this.createOtherCharges({
                                        creditID: credit.creditID,
                                        customerID: credit.customerID,
                                        transectionID: 0,
                                        discription: discription,
                                        loanID: 0,
                                        leadID: credit.leadID
                                    }, emiID, bounceCharge)
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
            key: "findEmis",
            value: /**
   * Finds all EMIs for a credit
   */ function findEmis(creditID) {
                return _async_to_generator(function() {
                    return _ts_generator(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                return [
                                    4,
                                    this.emiService.find(function(knex) {
                                        return knex.where('creditID', creditID).andWhere('is_deleted', 0);
                                    }, [
                                        {
                                            column: 'emiID',
                                            order: 'asc'
                                        }
                                    ], [
                                        '*'
                                    ])
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
            key: "calculateDelayDays",
            value: /**
   * Calculates delay days from due date to current date using moment with Asia/Kolkata timezone
   */ function calculateDelayDays(dueDate) {
                var currentMoment = moment().tz('Asia/Kolkata').startOf('day');
                var dueMoment = moment(dueDate).tz('Asia/Kolkata').startOf('day');
                if (currentMoment.isSameOrBefore(dueMoment)) {
                    return 0;
                }
                return Math.max(0, currentMoment.diff(dueMoment, 'days'));
            }
        },
        {
            key: "countRemainingEmis",
            value: /**
   * Counts remaining EMIs for a credit
   */ function countRemainingEmis(creditID) {
                return _async_to_generator(function() {
                    var countRow;
                    return _ts_generator(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                return [
                                    4,
                                    this.emiService.countRows(function(query) {
                                        return query.where(function(q) {
                                            return q.where('status', 'partially-paid').orWhere('status', 'due');
                                        }).andWhere('creditID', creditID);
                                    })
                                ];
                            case 1:
                                countRow = _state.sent();
                                return [
                                    2,
                                    +countRow
                                ];
                        }
                    });
                }).call(this);
            }
        },
        {
            key: "countRemainingEmisFromSimulation",
            value: /**
   * Count remaining EMIs from simulated data (used during settlement simulation)
   * This counts EMIs that are not fully paid in the resultEmis object
   * @param resultEmis - Object containing simulated EMI data indexed by emiID
   * @returns Count of remaining (unpaid or partially paid) EMIs
   */ function countRemainingEmisFromSimulation(resultEmis) {
                return Object.values(resultEmis).filter(function(emi) {
                    return emi.status === 'partially-paid' || emi.status === 'due';
                }).length;
            }
        },
        {
            key: "updateCreditStatus",
            value: /**
   * Updates credit status based on remaining EMIs
   */ function updateCreditStatus(emiRemains, credit, paidAmount) {
                return _async_to_generator(function() {
                    return _ts_generator(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                return [
                                    4,
                                    this.creditService.updateOne({
                                        creditID: credit.creditID
                                    }, {
                                        emiLeft: emiRemains,
                                        paidAmount: +credit.paidAmount + +paidAmount,
                                        amountToBeRepayed: credit.amountToBeRepayed - paidAmount
                                    })
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
            key: "updateEmiStatusToPaid",
            value: /**
   * Updates an EMI's status to paid
   */ function updateEmiStatusToPaid(emi, delayDays, paymentDetails, penality) {
                return _async_to_generator(function() {
                    return _ts_generator(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                return [
                                    4,
                                    this.emiService.updateOne({
                                        emiID: emi.emiID
                                    }, {
                                        status: 'paid',
                                        actualPaymentDate: new Date(),
                                        delayDays: delayDays,
                                        paymentID: paymentDetails.id,
                                        amountRemains: 0,
                                        amountRemainsInterest: 0,
                                        panelty: penality
                                    })
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
            key: "updateEmiStatusToPartial",
            value: /**
   * Updates an EMI's status to partial or paid
   */ function updateEmiStatusToPartial(emi, amountRemains, delayDays, paymentDetails, details, status) {
                return _async_to_generator(function() {
                    return _ts_generator(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                return [
                                    4,
                                    this.emiService.updateOne({
                                        emiID: emi.emiID
                                    }, {
                                        status: status,
                                        actualPaymentDate: paymentDetails.paymentDate ? moment(paymentDetails.paymentDate).tz('Asia/Kolkata').toDate() : moment().tz('Asia/Kolkata').toDate(),
                                        delayDays: delayDays,
                                        paymentID: paymentDetails.id,
                                        amountRemains: details.principal,
                                        amountRemainsInterest: details.interest,
                                        amountRemainsPenalty: details.penalty,
                                        amountRemainsBrokenPeriodIntrest: details.bounceCharge,
                                        panelty: details.updatePenalty,
                                        brokenPeriodIntrest: details.updateBrokenPeriodIntrest,
                                        paymentReceived: details.paymentReceived
                                    })
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
            key: "updateEmiManualStatus",
            value: /**
   * Updates an EMI with custom fields
   */ function updateEmiManualStatus(emiID, update) {
                return _async_to_generator(function() {
                    return _ts_generator(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                return [
                                    4,
                                    this.emiService.updateOne({
                                        emiID: emiID
                                    }, _object_spread({}, update))
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
            key: "manageManualPayment",
            value: /**
   * Manages a manual payment with potential waiver
   */ function manageManualPayment(transactionDetails, resultEmis, credit, excessAmount, settle) {
                return _async_to_generator(function() {
                    var _moment_startOf_toDate, transactionAmount, waiverAmount, discount_type, trans_id, order_id, transactionDate, lastEmi, totalComponents, unpaidEmis, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, emi, _moment_startOf, dueDateMoment, actualPaymentDateMoment, delayDays, _this_getCurrentEmiComponents, pendingInterest, pendingPrincipal, pendingPenalty, pendingBounce, err, totalTransactionAmount, totalRequiredForAllEmis, paymentAllocation, status, leadStatus, remainingAmount, extraExcessAmount, waive_off_amount, currentDate, updatedEmis, settlementEmi;
                    return _ts_generator(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                transactionAmount = transactionDetails.amount, waiverAmount = transactionDetails.waiver, discount_type = transactionDetails.discount_type, trans_id = transactionDetails.trans_id, order_id = transactionDetails.order_id, transactionDate = transactionDetails.transactionDate;
                                lastEmi = null;
                                // Calculate totals for all components
                                totalComponents = {
                                    totalPrincipal: 0,
                                    totalInterest: 0,
                                    totalPanelty: 0,
                                    totalBrokenPeriodIntrest: 0
                                };
                                unpaidEmis = Object.values(resultEmis).filter(function(emi) {
                                    return emi.status !== 'paid';
                                });
                                _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
                                _state.label = 1;
                            case 1:
                                _state.trys.push([
                                    1,
                                    7,
                                    8,
                                    9
                                ]);
                                _iterator = unpaidEmis[Symbol.iterator]();
                                _state.label = 2;
                            case 2:
                                if (!!(_iteratorNormalCompletion = (_step = _iterator.next()).done)) return [
                                    3,
                                    6
                                ];
                                emi = _step.value;
                                // Skip if EMI is already paid or deleted
                                if (emi.status == 'Paid' || emi.is_deleted == 1) {
                                    return [
                                        3,
                                        5
                                    ];
                                }
                                // Init processing variables
                                transactionDate = (_moment_startOf = moment(transactionDate).startOf('day')) !== null && _moment_startOf !== void 0 ? _moment_startOf : moment().startOf('day');
                                // Safely compare actualPaymentDate and dueDate
                                dueDateMoment = moment(emi.dueDate).startOf('day');
                                if (emi.actualPaymentDate !== null) {
                                    actualPaymentDateMoment = moment(emi.actualPaymentDate).startOf('day');
                                    if (actualPaymentDateMoment.isAfter(dueDateMoment)) {
                                        dueDateMoment = actualPaymentDateMoment;
                                    }
                                }
                                delayDays = this.calculateDelayDaysFromDates(transactionDate, dueDateMoment);
                                _this_getCurrentEmiComponents = this.getCurrentEmiComponents(emi, delayDays, credit.roi), pendingInterest = _this_getCurrentEmiComponents.pendingInterest, pendingPrincipal = _this_getCurrentEmiComponents.pendingPrincipal, pendingPenalty = _this_getCurrentEmiComponents.pendingPenalty, pendingBounce = _this_getCurrentEmiComponents.pendingBounce;
                                lastEmi = emi;
                                // Update total components (accumulate values across all EMIs)
                                totalComponents.totalPrincipal += pendingPrincipal;
                                totalComponents.totalInterest += pendingInterest;
                                totalComponents.totalPanelty += pendingPenalty;
                                totalComponents.totalBrokenPeriodIntrest += pendingBounce;
                                if (!settle) return [
                                    3,
                                    4
                                ];
                                return [
                                    4,
                                    this.emiModel.findOneAndUpdate({
                                        emiID: emi.emiID
                                    }, {
                                        is_deleted: 1
                                    })
                                ];
                            case 3:
                                _state.sent();
                                _state.label = 4;
                            case 4:
                                // If transaction amount is already zero, break the loop
                                if (transactionAmount <= 0) {
                                    return [
                                        3,
                                        6
                                    ];
                                }
                                // Update is_deleted status for the EMI
                                emi.is_deleted = 1;
                                if (emi.status === 'due') {
                                    emi.amountRemains = 0;
                                    emi.amountRemainsInterest = 0;
                                }
                                _state.label = 5;
                            case 5:
                                _iteratorNormalCompletion = true;
                                return [
                                    3,
                                    2
                                ];
                            case 6:
                                return [
                                    3,
                                    9
                                ];
                            case 7:
                                err = _state.sent();
                                _didIteratorError = true;
                                _iteratorError = err;
                                return [
                                    3,
                                    9
                                ];
                            case 8:
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
                            case 9:
                                // Total Available for allocation
                                totalTransactionAmount = transactionAmount + excessAmount;
                                // Validate the calculation logic
                                totalRequiredForAllEmis = this.emiService.roundToTwo(totalComponents.totalPrincipal + totalComponents.totalInterest + totalComponents.totalPanelty + totalComponents.totalBrokenPeriodIntrest);
                                // Allocate payment to different components
                                paymentAllocation = this.allocatePayment(totalTransactionAmount, totalComponents.totalInterest, totalComponents.totalPrincipal, totalComponents.totalPanelty, totalComponents.totalBrokenPeriodIntrest);
                                // Determine status based on discount type
                                status = discount_type === 'Settlement' ? 'Settlement' : discount_type;
                                leadStatus = discount_type === 'Settlement' ? LeadStatus.SETTLEMENT : LeadStatus.CLOSED;
                                // Calculate pending and waived amounts
                                remainingAmount = this.calculateTotalRemaining(paymentAllocation);
                                extraExcessAmount = totalTransactionAmount - totalRequiredForAllEmis || 0; // Calculate excess amount
                                waive_off_amount = 0;
                                if (remainingAmount > 0) {
                                    // If there's remaining amount after payment, it needs to be waived off
                                    waive_off_amount = remainingAmount;
                                    excessAmount = 0;
                                } else if (extraExcessAmount > 0) {
                                    // If remainingAmount is negative, it means there's excess payment
                                    excessAmount = extraExcessAmount;
                                    waive_off_amount = 0;
                                } else {
                                    // If remainingAmount is exactly 0, payment matches requirement
                                    excessAmount = 0;
                                    waive_off_amount = 0;
                                }
                                // Use current date only once
                                currentDate = (_moment_startOf_toDate = moment(transactionDate).startOf('day').toDate()) !== null && _moment_startOf_toDate !== void 0 ? _moment_startOf_toDate : moment().startOf('day').toDate();
                                if (!settle) return [
                                    3,
                                    12
                                ];
                                // Insert EMI data into the database
                                // let emiID = await this.emiModel.insertEmiInDb(
                                //   lastEmi.creditID,
                                //   lastEmi.customerID,
                                //   lastEmi.leadID,
                                //   lastEmi.productID,
                                //   totalComponents.totalPrincipal,
                                //   totalComponents.totalInterest,
                                //   totalComponents.totalPanelty,
                                //   totalComponents.totalBrokenPeriodIntrest,
                                //   'paid',
                                //   paymentAllocation.remaningAfterPrincipal,
                                //   paymentAllocation.remaningAfterInterest,
                                //   paymentAllocation.remaningAfterPenalty,
                                //   paymentAllocation.brokenPeriodToPay,
                                //   0,
                                //   0,
                                //   currentDate,
                                //   currentDate,
                                //   0,
                                //   0,
                                //   '0',
                                //   paymentAllocation.finalRemaningAmount,
                                //   remainingAmount,
                                //   waive_off_amount,
                                // )
                                // const transSave = {
                                //   transaction_id: trans_id,
                                //   order_id: order_id,
                                //   emi_id: emiID,
                                //   interest: paymentAllocation.interestToPay,
                                //   principal: paymentAllocation.principalToPay,
                                //   penalty: paymentAllocation.penaltyToPay,
                                //   dpd_amount: paymentAllocation.brokenPeriodToPay,
                                //   transaction_date: currentDate,
                                //   lead_id: lastEmi.leadID,
                                //   emi_status: 'paid',
                                // }
                                // Create EMI entry
                                // await this.EMITransaction.create(transSave)
                                // Update credit and lead status
                                return [
                                    4,
                                    this.creditService.updateOne({
                                        creditID: lastEmi.creditID
                                    }, {
                                        status: status
                                    })
                                ];
                            case 10:
                                _state.sent();
                                return [
                                    4,
                                    this.leadService.updateOne({
                                        leadID: lastEmi.leadID
                                    }, {
                                        status: leadStatus
                                    })
                                ];
                            case 11:
                                _state.sent();
                                _state.label = 12;
                            case 12:
                                updatedEmis = {};
                                // Create the settlement EMI object with detailed logging
                                settlementEmi = {
                                    emiID: null,
                                    status: 'paid',
                                    actualPaymentDate: currentDate,
                                    delayDays: 0,
                                    paymentID: '0',
                                    is_deleted: 0,
                                    principal: totalComponents.totalPrincipal,
                                    interest: totalComponents.totalInterest,
                                    amountRemains: paymentAllocation.remainingPrincipal,
                                    amountRemainsInterest: paymentAllocation.remainingInterest,
                                    amountRemainsPenalty: paymentAllocation.remainingPenalty,
                                    amountRemainsBrokenPeriodIntrest: paymentAllocation.remainingBounceCharge,
                                    panelty: totalComponents.totalPanelty,
                                    brokenPeriodIntrest: totalComponents.totalBrokenPeriodIntrest,
                                    paymentReceived: paymentAllocation.totalPaid,
                                    totalAmountPayable: totalRequiredForAllEmis,
                                    accessAmount: excessAmount,
                                    dueDate: currentDate,
                                    waive_off_amount: waive_off_amount
                                };
                                updatedEmis[0] = settlementEmi;
                                return [
                                    2,
                                    updatedEmis
                                ];
                        }
                    });
                }).call(this);
            }
        },
        {
            key: "allocateManualPayment",
            value: /**
   * Allocate manual payment to different components with EMI total requirement validation
   * Allocates a payment amount across all EMI components in a specific order:
   * Interest -> Principal -> Penalty -> Broken Period Interest
   *
   * @param amount - The total payment amount to allocate
   * @param totalComponents - The total amount of each component calculated from all EMIs
   * @returns Payment allocation breakdown and remaining amounts with EMI total validation
   * @private
   */ function allocateManualPayment(amount, totalComponents) {
                // Ensure amount is valid
                var validAmount = Math.max(0, +amount);
                // First interestToPay
                var _this_calculateRemaining = _sliced_to_array(this.calculateRemaining(validAmount, totalComponents.totalInterest), 2), interestToPay = _this_calculateRemaining[0], remaningAfterInterest = _this_calculateRemaining[1];
                // Then Principal
                var _this_calculateRemaining1 = _sliced_to_array(this.calculateRemaining(remaningAfterInterest, totalComponents.totalPrincipal), 2), principalToPay = _this_calculateRemaining1[0], remaningAfterPrincipal = _this_calculateRemaining1[1];
                // Then Penalty
                var _this_calculateRemaining2 = _sliced_to_array(this.calculateRemaining(remaningAfterPrincipal, totalComponents.totalPanelty), 2), penaltyToPay = _this_calculateRemaining2[0], remaningAfterPenalty = _this_calculateRemaining2[1];
                // In the last brokenPeriedToPay
                var _this_calculateRemaining3 = _sliced_to_array(this.calculateRemaining(remaningAfterPenalty, totalComponents.totalBrokenPeriodIntrest), 2), brokenPeriodToPay = _this_calculateRemaining3[0], finalRemaningAmount = _this_calculateRemaining3[1];
                return {
                    principalToPay: principalToPay,
                    interestToPay: interestToPay,
                    penaltyToPay: penaltyToPay,
                    brokenPeriodToPay: brokenPeriodToPay,
                    remaningAfterPrincipal: remaningAfterPrincipal,
                    remaningAfterInterest: remaningAfterInterest,
                    remaningAfterPenalty: remaningAfterPenalty,
                    finalRemaningAmount: finalRemaningAmount
                };
            }
        },
        {
            key: "calculateTotalRemaining",
            value: /**
   * Calculate total remaining amount from payment allocation
   * @private
   */ function calculateTotalRemaining(paymentAllocation) {
                return this.emiService.roundToTwo(paymentAllocation.remainingPrincipal + paymentAllocation.remainingInterest + paymentAllocation.remainingPenalty + paymentAllocation.remainingBounceCharge);
            }
        },
        {
            key: "calculateRemaining",
            value: // Helper function to calculate remaining amounts
            function calculateRemaining(total, amount) {
                var toPay = Math.min(total, amount);
                return [
                    toPay,
                    Math.max(0, total - toPay)
                ];
            }
        },
        {
            key: "getRepaymentData",
            value: /**
   * Gets repayment data for a loan with optimized processing
   */ function getRepaymentData(credit, loanData, leadData, emis, transactions) {
                return _async_to_generator(function() {
                    var _this, _emis_, _emis_1, CHUNK_SIZE, processedEmis, i, _processedEmis, chunk, processedChunk, _processedEmis1, results, activeStatuses, activeEmi, tempAmountPayable, isTempWaiverActive, totalRepay, lastPaymentDate, emiAmount, loanSummary, formattedTransactions, _tmp, _tmp1, emiDocs;
                    return _ts_generator(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                _this = this;
                                // Process EMIs in parallel with optimized chunk processing for large EMI arrays
                                CHUNK_SIZE = 10; // Process 10 EMIs at a time for better performance
                                processedEmis = [];
                                if (!(emis.length > CHUNK_SIZE)) return [
                                    3,
                                    5
                                ];
                                i = 0;
                                _state.label = 1;
                            case 1:
                                if (!(i < emis.length)) return [
                                    3,
                                    4
                                ];
                                chunk = emis.slice(i, i + CHUNK_SIZE);
                                return [
                                    4,
                                    Promise.all(chunk.map(function(emi) {
                                        return _async_to_generator(function() {
                                            return _ts_generator(this, function(_state) {
                                                return [
                                                    2,
                                                    this.processEmi(emi, credit)
                                                ];
                                            });
                                        }).call(_this);
                                    }))
                                ];
                            case 2:
                                processedChunk = _state.sent();
                                (_processedEmis = processedEmis).push.apply(_processedEmis, _to_consumable_array(processedChunk));
                                _state.label = 3;
                            case 3:
                                i += CHUNK_SIZE;
                                return [
                                    3,
                                    1
                                ];
                            case 4:
                                return [
                                    3,
                                    7
                                ];
                            case 5:
                                return [
                                    4,
                                    Promise.all(emis.map(function(emi) {
                                        return _async_to_generator(function() {
                                            return _ts_generator(this, function(_state) {
                                                return [
                                                    2,
                                                    this.processEmi(emi, credit)
                                                ];
                                            });
                                        }).call(_this);
                                    }))
                                ];
                            case 6:
                                results = _state.sent();
                                (_processedEmis1 = processedEmis).push.apply(_processedEmis1, _to_consumable_array(results));
                                _state.label = 7;
                            case 7:
                                // Use active status set for faster lookups
                                activeStatuses = new Set([
                                    'Part Paid',
                                    'Due',
                                    'Overdue'
                                ]);
                                // Find the first EMI that needs payment
                                activeEmi = processedEmis.find(function(emi) {
                                    return activeStatuses.has(emi.status);
                                });
                                // Update credit with active EMI data if found
                                tempAmountPayable = 0;
                                isTempWaiverActive = 0;
                                if (activeEmi) {
                                    credit.firstDueDate = activeEmi.dueDate;
                                    credit.amountToBeRepayed = activeEmi.amountPayable;
                                    tempAmountPayable = activeEmi.tempAmountPayable;
                                    isTempWaiverActive = activeEmi.isTempWaiverActive;
                                }
                                // Calculate total repayment amount in one pass
                                totalRepay = processedEmis.reduce(function(sum, emi) {
                                    return activeStatuses.has(emi.status) ? sum + emi.amountPayable : sum;
                                }, 0);
                                // Get last payment date
                                lastPaymentDate = this.calculateLastPaymentDate(transactions);
                                // Calculate EMI amount
                                emiAmount = (((_emis_ = emis[0]) === null || _emis_ === void 0 ? void 0 : _emis_.principal) || 0) + (((_emis_1 = emis[0]) === null || _emis_1 === void 0 ? void 0 : _emis_1.interest) || 0);
                                // Build loan summary
                                loanSummary = _object_spread_props(_object_spread({}, credit), {
                                    Emi: emiAmount,
                                    loanNumber: loanData.loanNo,
                                    disbursalDate: loanData.disbursalDate,
                                    lastPaymentDate: lastPaymentDate,
                                    totalRepay: totalRepay,
                                    status: leadData.status,
                                    tempAmountPayable: tempAmountPayable,
                                    isTempWaiverActive: isTempWaiverActive
                                });
                                if (!((transactions === null || transactions === void 0 ? void 0 : transactions.length) > 0)) return [
                                    3,
                                    11
                                ];
                                if (!(transactions.length > 20)) return [
                                    3,
                                    9
                                ];
                                return [
                                    4,
                                    Promise.all(transactions.map(function(transaction) {
                                        return _this.processTransaction(transaction);
                                    }))
                                ];
                            case 8:
                                _tmp1 = _state.sent();
                                return [
                                    3,
                                    10
                                ];
                            case 9:
                                _tmp1 = transactions.map(function(transaction) {
                                    return _this.processTransaction(transaction);
                                });
                                _state.label = 10;
                            case 10:
                                _tmp = _tmp1;
                                return [
                                    3,
                                    12
                                ];
                            case 11:
                                _tmp = [];
                                _state.label = 12;
                            case 12:
                                formattedTransactions = _tmp;
                                // Define EMI documents
                                emiDocs = [
                                    {
                                        text: 'Loan Agreement',
                                        link: 'https://example.com/loan-agreement.pdf'
                                    },
                                    {
                                        text: 'Sanction Letter',
                                        link: 'https://example.com/sanction-letter.pdf'
                                    },
                                    {
                                        text: 'Account Statement',
                                        link: 'https://example.com/loan-statement.pdf'
                                    }
                                ];
                                // Return complete repayment data
                                return [
                                    2,
                                    {
                                        loanSummary: loanSummary,
                                        processedEmis: processedEmis,
                                        getTransections: formattedTransactions,
                                        emiDocs: emiDocs
                                    }
                                ];
                        }
                    });
                }).call(this);
            }
        },
        {
            key: "findLead",
            value: /**
   * Finds lead information by ID
   */ function findLead(leadID) {
                return _async_to_generator(function() {
                    return _ts_generator(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                return [
                                    4,
                                    this.leadService.findOne({
                                        leadID: leadID
                                    })
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
            key: "updateEmiValuesBasedOnStatus",
            value: /**
   * Updates EMI values based on status and delay
   * @private
   */ function updateEmiValuesBasedOnStatus(emi, penaltyDays, delayDays, roi) {
                // Handles all EMI statuses and delayDays cases
                if (delayDays <= 0) {
                    // On-time or early payment: no penalty or bounce charges
                    emi.panelty = 0;
                    emi.brokenPeriodIntrest = 0;
                    emi.amountRemainsInterest = emi.status === 'partially-paid' ? emi.amountRemainsInterest : emi.interest;
                    emi.amountRemainsPenalty = 0;
                    emi.amountRemainsBrokenPeriodIntrest = 0;
                    emi.amountPayable = this.emiService.roundToTwo(emi.principal + emi.interest - emi.paymentReceived);
                } else if (emi.status !== 'partially-paid' && emi.status !== 'paid') {
                    // Overdue and not paid/partially-paid: apply penalty and bounce charges
                    emi.brokenPeriodIntrest = this.emiService.bounceCharge();
                    emi.amountRemainsInterest = 0;
                    emi.amountRemainsPenalty = 0;
                    emi.panelty = this.emiService.roundToTwo(this.emiService.calculatePenalty(emi.principal, penaltyDays, roi));
                    emi.amountRemainsBrokenPeriodIntrest = 0;
                    emi.amountPayable = this.emiService.roundToTwo(emi.principal + emi.interest + emi.panelty + emi.brokenPeriodIntrest);
                } else if (emi.status === 'partially-paid') {
                    // Partially paid: may have penalty/bounce for remaining overdue
                    emi.brokenPeriodIntrest = emi.brokenPeriodIntrest === 0 && penaltyDays > 0 ? this.emiService.bounceCharge() : emi.brokenPeriodIntrest;
                    emi.panelty = +emi.panelty + this.emiService.calculatePenalty(emi.amountRemains, penaltyDays, roi);
                    emi.panelty = this.emiService.roundToTwo(emi.panelty);
                    emi.amountPayable = this.emiService.roundToTwo(emi.principal + emi.interest + emi.panelty + emi.brokenPeriodIntrest - emi.paymentReceived);
                } else if (emi.status === 'paid') {
                    // Paid: just sum up for display
                    emi.amountPayable = this.emiService.roundToTwo(emi.principal + emi.interest + emi.panelty + emi.brokenPeriodIntrest);
                }
            }
        },
        {
            key: "calculateAmountPayable",
            value: /**
   * Calculates final amount payable considering waivers
   * @private
   */ function calculateAmountPayable(emi, waiver) {
                if (waiver) {
                    return this.emiService.roundToTwo(emi.amountPayable) - this.emiService.roundToTwo(emi.waive_off_amount || 0) - this.emiService.roundToTwo(waiver);
                } else {
                    return this.emiService.roundToTwo(emi.amountPayable) - this.emiService.roundToTwo(emi.waive_off_amount || 0);
                }
            }
        },
        {
            key: "setEmiDisplayProperties",
            value: /**
   * Set EMI display properties (status, colors)
   * @private
   */ function setEmiDisplayProperties(emi, delayDays, pendingAmount, totalPaid) {
                var balanceColor = '#F33C3C';
                if (delayDays > 0 && emi.status !== 'paid') {
                    // Overdue EMI
                    emi.status = 'Overdue';
                    emi.color = '#F33C3C';
                    emi.bgcolor = '#FCE0E0';
                } else {
                    // EMI status based on payment status
                    switch(emi.status){
                        case 'paid':
                            emi.status = 'Paid';
                            emi.color = '#0EBB53';
                            emi.bgcolor = '#E5F6EC';
                            break;
                        case 'partially-paid':
                            emi.status = 'Part Paid';
                            emi.color = '#D4AF37';
                            emi.bgcolor = '#F9F5E9';
                            break;
                        default:
                            emi.status = 'Due';
                            emi.color = '#182BDA';
                            emi.bgcolor = '#E6E8FA';
                            break;
                    }
                }
                // Build the display list for EMI components
                emi.lists = [
                    {
                        text: 'Principal',
                        value: "₹".concat(emi.principal),
                        color: '#5A5A5A',
                        bgcolor: ''
                    },
                    {
                        text: 'Interest',
                        value: "₹".concat(emi.interest),
                        color: '#5A5A5A',
                        bgcolor: ''
                    },
                    {
                        text: 'Penalty',
                        value: "₹".concat(emi.panelty),
                        color: '#5A5A5A',
                        bgcolor: ''
                    },
                    {
                        text: 'Bounce Charges (incl. GST)',
                        value: "₹".concat(emi.brokenPeriodIntrest),
                        color: '#5A5A5A',
                        bgcolor: ''
                    },
                    {
                        text: 'Amount Paid',
                        value: "-₹".concat(totalPaid),
                        color: '#14D44A',
                        bgcolor: ''
                    },
                    {
                        text: 'Balance Amount',
                        value: "₹".concat(pendingAmount),
                        color: balanceColor,
                        bgcolor: ''
                    }
                ];
            }
        }
    ]);
    return EmiCollectionService;
}();
export default EmiCollectionService;

//# sourceMappingURL=emiCollection.service.js.map