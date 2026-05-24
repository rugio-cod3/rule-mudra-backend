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
import { config } from '@/config.server';
import { differenceInCalendarDays, format } from 'date-fns';
import { callHistoryLogsModel } from '../database/mysql/callhistorylogs';
import { creditModel } from '../database/mysql/credit';
import { emiModel } from '../database/mysql/emi';
import { emiTransactionModel } from '../database/mysql/emiTransactions';
import { leadModel } from '../database/mysql/leads';
import { otherChargesModel } from '../database/mysql/otherCharges';
import { waiverModel } from '../database/mysql/waiver';
import { EmiStatus } from '../enums/emi.enum';
import { Products } from '../enums/product.enum';
import { WaiverStatus, WaiverType } from '../enums/waiver.enum';
import CommonHelper from '../helpers/common';
import { logger } from '../utils/logger';
import { calculateBounceCharge, calculatePenalty, round } from '../utils/util';
import { creditService } from './credit.service';
import { loanService } from './loan.service';
import { transactionService } from './transaction.service';
export var EmiService = /*#__PURE__*/ function() {
    "use strict";
    function EmiService() {
        var _this = this;
        _class_call_check(this, EmiService);
        _define_property(this, "emiModel", emiModel);
        _define_property(this, "otherChargesModel", otherChargesModel);
        _define_property(this, "emiTransactionModel", emiTransactionModel);
        _define_property(this, "leadModel", leadModel);
        _define_property(this, "creditModel", creditModel);
        _define_property(this, "callHistoryLogsModel", callHistoryLogsModel);
        _define_property(this, "creditService", creditService);
        _define_property(this, "loanService", loanService);
        _define_property(this, "transactionService", transactionService);
        _define_property(this, "waiverModel", waiverModel);
        _define_property(this, "bounceCharge", function() {
            var fixedBounce = +config.dpdPenalty;
            var gst = Math.round(fixedBounce * (+config.gst / 100));
            var totalBounce = fixedBounce + gst;
            return totalBounce;
        });
        // Helper function to calculate last payment date
        _define_property(this, "calculateLastPaymentDate", function(transactions) {
            var lastPaymentDate = '';
            if (!transactions) {
                return lastPaymentDate;
            }
            for(var i = 0; i < transactions.length; i++){
                if (transactions[i].status === 1) {
                    lastPaymentDate = transactions[i].createdAt;
                    break; // Exit the loop once the condition is met
                }
            }
            return lastPaymentDate;
        });
        _define_property(this, "calculatePenalty", function(emiAmount, overdueDays, roi) {
            var perDay = roi / 365 + 0.1;
            var result = emiAmount * perDay / 100 * overdueDays;
            var fixResult = _this.roundToTwo(result);
            return fixResult;
        });
        _define_property(this, "roundToTwo", function(num) {
            return Math.ceil(num);
        });
        _define_property(this, "calculatePendingAmount", function(emi, delayDays) {
            var pendingBounce = emi.status == 'paid' ? 0 : emi.status === 'partially-paid' ? emi.amountRemainsBrokenPeriodIntrest : delayDays > 0 ? _this.bounceCharge() : 0;
            var pendingPenality = emi.status == 'paid' ? 0 : emi.status === 'partially-paid' ? emi.amountRemainsPenalty : emi.panelty;
            var payAmount = emi.status == 'paid' ? 0 : emi.status === 'partially-paid' ? emi.amountRemains : emi.principal;
            var pendingInterest = emi.status == 'paid' ? 0 : emi.status === 'partially-paid' ? emi.amountRemainsInterest : emi.interest;
            return pendingPenality + payAmount + pendingBounce + pendingInterest;
        });
        _define_property(this, "processTransaction", function(transection) {
            var amount = transection.amount, status = transection.status, mode = transection.mode, referenceNo = transection.referenceNo, createdAt = transection.createdAt;
            var formattedStatus = status === 1 ? 'Success' : 'Failed';
            var formattedDate = new Date(createdAt).toLocaleString('en-GB', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
                hour: 'numeric',
                minute: 'numeric',
                hour12: true
            }).replace(',', '');
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
                    color: status === 1 ? '#14D44A' : '#D93C3C',
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
        _define_property(this, "processEmiV2", function(emi, credit) {
            return _async_to_generator(function() {
                var dueDate, diffDate, penalityDays, dpd, currentDate, delayDays, pendingAmount, totalPaid, setBounceFee, waiver, amountPayable, blanceColor;
                return _ts_generator(this, function(_state) {
                    switch(_state.label){
                        case 0:
                            dueDate = new Date(format(new Date(emi.dueDate), 'yyyy-MM-dd'));
                            diffDate = dueDate;
                            penalityDays = 0;
                            dpd = '';
                            currentDate = new Date();
                            delayDays = Math.max(0, differenceInCalendarDays(currentDate, dueDate));
                            emi.actualEmiAmount = emi.amountPayable;
                            if (new Date(emi.actualPaymentDate) > new Date(emi.dueDate)) {
                                diffDate = emi.actualPaymentDate;
                                penalityDays = Math.max(0, differenceInCalendarDays(currentDate, diffDate));
                            } else {
                                penalityDays = delayDays;
                            }
                            if (delayDays > 0 && emi.status !== 'partially-paid' && emi.status !== 'paid') {
                                emi.brokenPeriodIntrest = this.bounceCharge();
                                emi.amountRemainsInterest = 0;
                                emi.amountRemainsPenalty = 0;
                                emi.panelty = this.roundToTwo(this.calculatePenalty(emi.principal, penalityDays, credit.roi));
                                //emi.panelty = this.emiService.roundToTwo(emi.panelty);
                                emi.amountRemainsBrokenPeriodIntrest = 0;
                                emi.amountPayable = this.roundToTwo(emi.principal + emi.interest + emi.panelty + emi.brokenPeriodIntrest);
                            } else if (emi.status == 'partially-paid') {
                                emi.brokenPeriodIntrest = emi.brokenPeriodIntrest == 0 && penalityDays > 0 ? this.bounceCharge() : emi.brokenPeriodIntrest;
                                emi.panelty = +emi.panelty + this.calculatePenalty(emi.amountRemains, penalityDays, credit.roi);
                                emi.panelty = this.roundToTwo(emi.panelty);
                                emi.amountPayable = this.roundToTwo(emi.principal + emi.interest + emi.panelty + emi.brokenPeriodIntrest - emi.paymentReceived);
                            } else if (emi.status == 'paid') {
                                emi.amountPayable = this.roundToTwo(emi.principal + emi.interest + emi.panelty + emi.brokenPeriodIntrest);
                                if (new Date(emi.actualPaymentDate) > new Date(emi.dueDate)) dpd = String(Math.max(0, differenceInCalendarDays(emi.actualPaymentDate, emi.dueDate)));
                            }
                            pendingAmount = this.roundToTwo(this.calculatePendingAmount(emi, delayDays));
                            totalPaid = this.roundToTwo(emi.paymentReceived); //await this.transectionService.sumOfTransaction(emi.emiID);
                            setBounceFee = delayDays > 0 ? this.bounceCharge() : 0;
                            return [
                                4,
                                this.waiverModel.findOne({
                                    where: {
                                        credit_id: credit.creditID,
                                        emi_id: emi.emiID,
                                        type: WaiverType.TEMPORARY,
                                        product: Products.EMI,
                                        status: WaiverStatus.APPROVED,
                                        is_paid: false
                                    },
                                    select: [
                                        'emi_id',
                                        'amount',
                                        'id'
                                    ]
                                })
                            ];
                        case 1:
                            waiver = _state.sent();
                            amountPayable = waiver ? this.roundToTwo(emi.amountPayable) - this.roundToTwo(emi.waive_off_amount) - this.roundToTwo(waiver.amount) : this.roundToTwo(emi.amountPayable) - this.roundToTwo(emi.waive_off_amount);
                            emi.amountPayable = amountPayable;
                            emi.waive_off_amount = this.roundToTwo(emi.waive_off_amount);
                            emi.tempAmountPayable = waiver ? emi.amountPayable - this.roundToTwo(waiver.amount) : 0;
                            emi.isTempWaiverActive = waiver ? true : false;
                            setBounceFee = this.roundToTwo(setBounceFee);
                            // emi.status = this.updateEmiStatus(emi, delayDays);
                            emi.dueDate = dueDate;
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
                                    value: "₹".concat(totalPaid),
                                    color: '#F33C3C',
                                    bgcolor: ''
                                },
                                {
                                    text: 'Balance Amount',
                                    value: "₹".concat(pendingAmount),
                                    color: '#182BDA',
                                    bgcolor: ''
                                }
                            ];
                            if (delayDays > 0 && emi.status != 'paid') {
                                emi.status = 'Overdue';
                                emi.color = '#F33C3C';
                                emi.bgcolor = '#FCE0E0';
                                blanceColor = '#F33C3C';
                            } else {
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
                                    color: blanceColor,
                                    bgcolor: ''
                                }
                            ];
                            return [
                                2,
                                emi
                            ];
                    }
                });
            }).call(_this);
        });
        _define_property(this, "processEmi", function(emi, credit) {
            return _async_to_generator(function() {
                var dueDate, diffDate, penalityDays, currentDate, delayDays, pendingAmount, totalPaid, setBounceFee, currentStatus, data;
                return _ts_generator(this, function(_state) {
                    dueDate = new Date(format(new Date(emi.dueDate), 'yyyy-MM-dd'));
                    diffDate = dueDate;
                    penalityDays = 0;
                    currentDate = new Date();
                    delayDays = Math.max(0, differenceInCalendarDays(currentDate, dueDate));
                    if (new Date(emi.actualPaymentDate) > new Date(emi.dueDate)) {
                        diffDate = emi.actualPaymentDate;
                        penalityDays = Math.max(0, differenceInCalendarDays(currentDate, diffDate));
                    } else {
                        penalityDays = delayDays;
                    }
                    if (delayDays > 0 && emi.status !== 'partially-paid' && emi.status !== 'paid') {
                        emi.brokenPeriodIntrest = this.bounceCharge();
                        emi.amountRemainsInterest = 0;
                        emi.amountRemainsPenalty = 0;
                        emi.panelty = this.roundToTwo(this.calculatePenalty(emi.principal, penalityDays, credit.roi));
                        //emi.panelty = this.emiService.roundToTwo(emi.panelty);
                        emi.amountRemainsBrokenPeriodIntrest = 0;
                        emi.amountPayable = this.roundToTwo(emi.principal + emi.interest + emi.panelty + emi.brokenPeriodIntrest);
                    } else if (emi.status == 'partially-paid') {
                        emi.panelty = +emi.panelty + this.calculatePenalty(emi.amountRemains, penalityDays, credit.roi);
                        emi.panelty = this.roundToTwo(emi.panelty);
                        emi.amountPayable = this.roundToTwo(emi.principal + emi.interest + emi.panelty + emi.brokenPeriodIntrest - emi.paymentReceived);
                    } else if (emi.status == 'paid') {
                        emi.amountPayable = this.roundToTwo(emi.principal + emi.interest + emi.panelty + emi.brokenPeriodIntrest);
                    }
                    pendingAmount = this.roundToTwo(this.calculatePendingAmount(emi, delayDays));
                    totalPaid = this.roundToTwo(emi.paymentReceived); //await this.transectionService.sumOfTransaction(emi.emiID);
                    setBounceFee = delayDays > 0 ? this.bounceCharge() : 0;
                    emi.amountPayable = this.roundToTwo(emi.amountPayable);
                    setBounceFee = this.roundToTwo(setBounceFee);
                    // emi.status = this.updateEmiStatus(emi, delayDays);
                    emi.dueDate = dueDate;
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
                            value: "₹".concat(totalPaid),
                            color: '#F33C3C',
                            bgcolor: ''
                        },
                        {
                            text: 'Balance Amount',
                            value: "₹".concat(pendingAmount),
                            color: '#182BDA',
                            bgcolor: ''
                        }
                    ];
                    if (delayDays > 0 && emi.status != 'paid') {
                        emi.status = 'Overdue';
                        emi.color = '#F33C3C';
                        emi.bgcolor = '#FCE0E0';
                    } else {
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
                    // Add current Status value
                    currentStatus = emi.status;
                    if (emi.status === EmiStatus.OVERDUE && !emi.actualPaymentDate) {
                        currentStatus = EmiStatus.DUE;
                    } else if (emi.status === EmiStatus.OVERDUE && emi.actualPaymentDate) {
                        currentStatus = EmiStatus.PART_PAYMENT;
                    }
                    data = _object_spread_props(_object_spread({}, emi), {
                        currentStatus: currentStatus
                    });
                    return [
                        2,
                        data
                    ];
                });
            }).call(_this);
        });
    }
    _create_class(EmiService, [
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
                                    this.emiModel.findOneEmi(where, select)
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
            key: "updateOne",
            value: function updateOne(where, update) {
                return _async_to_generator(function() {
                    return _ts_generator(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                return [
                                    4,
                                    this.emiModel.findOneAndUpdate(where, update)
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
            key: "countRows",
            value: function countRows(where) {
                return _async_to_generator(function() {
                    var razorpay_emOrder_count, error;
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
                                    this.emiModel.countEMI(where)
                                ];
                            case 1:
                                razorpay_emOrder_count = _state.sent();
                                if (razorpay_emOrder_count == null) {
                                    return [
                                        2,
                                        0
                                    ];
                                } else {
                                    return [
                                        2,
                                        razorpay_emOrder_count // Return the first lead if found
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
            key: "processManualPayment",
            value: function processManualPayment(paymentDetails, credit) {
                return _async_to_generator(function() {
                    var emis, amountRemains, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, emi, _paymentDetails_paymentDate, currentDate, details, dueDate, interest, principal, penalty, bounceCharge, emiDueDate, delayDays, penaltyAgain, interestPaid, principalPaid, penaltyPaid, bounceChargePaid, totalSum, status, transSave, error, err, creditID, lastEmiCollection, accessAmount, emiID, emiRemains, lead, error1;
                    return _ts_generator(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                return [
                                    4,
                                    this.findDueOrPartialEmis(credit.creditID)
                                ];
                            case 1:
                                emis = _state.sent();
                                amountRemains = paymentDetails.amount;
                                _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
                                _state.label = 2;
                            case 2:
                                _state.trys.push([
                                    2,
                                    14,
                                    15,
                                    16
                                ]);
                                _iterator = emis[Symbol.iterator]();
                                _state.label = 3;
                            case 3:
                                if (!!(_iteratorNormalCompletion = (_step = _iterator.next()).done)) return [
                                    3,
                                    13
                                ];
                                emi = _step.value;
                                _state.label = 4;
                            case 4:
                                _state.trys.push([
                                    4,
                                    11,
                                    ,
                                    12
                                ]);
                                if (amountRemains <= 0) return [
                                    3,
                                    13
                                ];
                                paymentDetails.paymentDate = (_paymentDetails_paymentDate = paymentDetails.paymentDate) !== null && _paymentDetails_paymentDate !== void 0 ? _paymentDetails_paymentDate : new Date();
                                //const currentDate = new Date()
                                // const currentDate = paymentDetails.paymentDate
                                currentDate = new Date(paymentDetails.paymentDate);
                                details = {
                                    interest: 0,
                                    principal: 0,
                                    penalty: 0,
                                    bounceCharge: 0,
                                    updatePenalty: 0,
                                    updateBrokenPeriodIntrest: 0,
                                    paymentReceived: 0
                                };
                                // Safely compare actualPaymentDate and dueDate
                                dueDate = new Date(format(new Date(emi.dueDate), 'yyyy-MM-dd'));
                                if (emi.actualPaymentDate !== null && new Date(emi.actualPaymentDate) > new Date(emi.dueDate)) {
                                    dueDate = emi.actualPaymentDate;
                                }
                                // Set interest, principal, penalty, and bounceCharge based on emi status
                                interest = emi.status === 'partially-paid' ? emi.amountRemainsInterest : emi.interest;
                                principal = emi.status === 'partially-paid' ? emi.amountRemains : emi.principal;
                                penalty = emi.status === 'partially-paid' ? emi.amountRemainsPenalty : emi.panelty;
                                details.updatePenalty = emi.panelty;
                                // Calculate bounceCharge based on the emi status
                                bounceCharge = emi.status === 'partially-paid' ? emi.amountRemainsBrokenPeriodIntrest : 0;
                                // Ensure dueDate is a valid Date object
                                emiDueDate = new Date(dueDate);
                                // Calculate the delay in days between the current date and emi due date
                                delayDays = differenceInCalendarDays(currentDate, emiDueDate);
                                if (delayDays < 0) {
                                    delayDays = 0;
                                }
                                if (bounceCharge == 0 && emi.status === 'partially-paid' && delayDays > 0) {
                                    bounceCharge = +calculateBounceCharge();
                                }
                                if (!(delayDays > 0)) return [
                                    3,
                                    8
                                ];
                                penaltyAgain = round(+calculatePenalty(principal, delayDays, credit.roi));
                                penalty += penaltyAgain;
                                return [
                                    4,
                                    this.savePenalty(credit, emi.emiID, penaltyAgain, 'penalty')
                                ];
                            case 5:
                                _state.sent();
                                if (!(emi.status != 'partially-paid')) return [
                                    3,
                                    7
                                ];
                                bounceCharge = +calculateBounceCharge();
                                return [
                                    4,
                                    this.savePenalty(credit, emi.emiID, bounceCharge, 'Bounce Charge')
                                ];
                            case 6:
                                _state.sent();
                                _state.label = 7;
                            case 7:
                                details.updatePenalty = details.updatePenalty + penaltyAgain;
                                _state.label = 8;
                            case 8:
                                if (delayDays > 0) {
                                    details.updateBrokenPeriodIntrest = calculateBounceCharge();
                                } else {
                                    details.updateBrokenPeriodIntrest = emi.brokenPeriodIntrest;
                                }
                                //details.updateBrokenPeriodIntrest = this.emiService.bounceCharge();
                                if (emi.status == 'due' && delayDays > 0) {
                                    details.updateBrokenPeriodIntrest = calculateBounceCharge();
                                } else {
                                    details.updateBrokenPeriodIntrest = details.updateBrokenPeriodIntrest;
                                }
                                details.paymentReceived = +emi.paymentReceived;
                                // Subtract payment from interest first, then principal, then penalty
                                interestPaid = 0;
                                if (amountRemains > 0 && interest > 0) {
                                    interestPaid = Math.min(amountRemains, interest);
                                    interest -= interestPaid;
                                    amountRemains -= interestPaid;
                                    details.paymentReceived += interestPaid;
                                }
                                details.interest = interest;
                                principalPaid = 0;
                                if (amountRemains > 0 && principal > 0) {
                                    principalPaid = Math.min(amountRemains, principal);
                                    principal -= principalPaid;
                                    amountRemains -= principalPaid;
                                    details.paymentReceived += principalPaid;
                                }
                                details.principal = principal;
                                penaltyPaid = 0;
                                if (amountRemains > 0 && penalty > 0) {
                                    penaltyPaid = Math.min(amountRemains, penalty);
                                    penalty -= penaltyPaid;
                                    amountRemains -= penaltyPaid;
                                    details.paymentReceived += penaltyPaid;
                                }
                                details.penalty = penalty;
                                bounceChargePaid = 0;
                                if (amountRemains > 0 && bounceCharge > 0) {
                                    bounceChargePaid = Math.min(amountRemains, bounceCharge);
                                    bounceCharge -= bounceChargePaid;
                                    amountRemains -= bounceChargePaid;
                                    details.paymentReceived += bounceChargePaid;
                                }
                                details.bounceCharge = bounceCharge;
                                totalSum = details.interest + details.principal + details.penalty + details.bounceCharge;
                                // ! add waiver_amount field
                                status = totalSum > 0 ? 'partially-paid' : 'paid';
                                // ! For waiver amount
                                // ! If emi amount 10k, waiver given for 2k, means amount to be paid is 8k, now total_sum should have a value of 2k, if this amount is equal the one in waiver table, we mark the customr paid
                                // ! in updatePartial function we also add waiver_amount field when saving
                                return [
                                    4,
                                    this.updateEmiStatusToPartial(emi, amountRemains, delayDays, paymentDetails, details, status)
                                ];
                            case 9:
                                _state.sent();
                                transSave = {
                                    // transaction_id: paymentDetails.trans.id,
                                    // order_id: paymentDetails.trans.order_id,
                                    transaction_id: 1,
                                    order_id: '2',
                                    emi_id: emi.emiID,
                                    interest: interestPaid,
                                    principal: principalPaid,
                                    penalty: penaltyPaid,
                                    dpd_amount: bounceChargePaid,
                                    transaction_date: currentDate,
                                    lead_id: credit.creditID,
                                    emi_status: status
                                };
                                return [
                                    4,
                                    this.emiTransactionModel.insert(transSave.transaction_id, transSave.order_id, transSave.emi_id, transSave.interest, transSave.principal, transSave.penalty, transSave.dpd_amount, transSave.transaction_date, transSave.lead_id, transSave.emi_status)
                                ];
                            case 10:
                                _state.sent();
                                return [
                                    3,
                                    12
                                ];
                            case 11:
                                error = _state.sent();
                                console.error('Error calculating dueDate: ', error.message);
                                return [
                                    3,
                                    12
                                ];
                            case 12:
                                _iteratorNormalCompletion = true;
                                return [
                                    3,
                                    3
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
                                _state.trys.push([
                                    16,
                                    25,
                                    ,
                                    26
                                ]);
                                creditID = credit.creditID;
                                return [
                                    4,
                                    this.emiModel.findLastEmi({
                                        creditID: creditID
                                    }, [
                                        'emiID',
                                        'accessAmount',
                                        'dueDate'
                                    ])
                                ];
                            case 17:
                                lastEmiCollection = _state.sent();
                                accessAmount = +lastEmiCollection.accessAmount + amountRemains;
                                emiID = lastEmiCollection.emiID;
                                if (!(amountRemains > 0)) return [
                                    3,
                                    19
                                ];
                                return [
                                    4,
                                    this.emiModel.findOneAndUpdate({
                                        emiID: emiID
                                    }, {
                                        accessAmount: accessAmount
                                    })
                                ];
                            case 18:
                                _state.sent();
                                _state.label = 19;
                            case 19:
                                return [
                                    4,
                                    this.countRemainingEmis(credit.creditID)
                                ];
                            case 20:
                                emiRemains = _state.sent();
                                return [
                                    4,
                                    this.creditModel.updateCreditStatus(emiRemains, credit, paymentDetails.amount)
                                ];
                            case 21:
                                _state.sent();
                                return [
                                    4,
                                    this.leadModel.findOne({
                                        where: {
                                            leadID: credit.leadID
                                        }
                                    })
                                ];
                            case 22:
                                lead = _state.sent();
                                return [
                                    4,
                                    this.callHistoryLogsModel.createCallHistoryLog(credit, lead, paymentDetails.amount.toString())
                                ];
                            case 23:
                                _state.sent();
                                return [
                                    4,
                                    CommonHelper.lastEMIUpdater(emiRemains, credit.creditID, lastEmiCollection.dueDate, credit.actualTenure, credit.leadID)
                                ];
                            case 24:
                                _state.sent();
                                return [
                                    3,
                                    26
                                ];
                            case 25:
                                error1 = _state.sent();
                                console.error('Error calculating dueDate: ', error1.message);
                                return [
                                    3,
                                    26
                                ];
                            case 26:
                                return [
                                    2
                                ];
                        }
                    });
                }).call(this);
            }
        },
        {
            key: "processEmiWaiverPermanent",
            value: function processEmiWaiverPermanent(payload) {
                return _async_to_generator(function() {
                    var _payload_paymentDate, emi, credit, amountRemains, currentDate, details, dueDate, interest, principal, penalty, bounceCharge, emiDueDate, delayDays, penaltyAgain, interestPaid, principalPaid, penaltyPaid, bounceChargePaid, totalSum, status, creditID, lastEmiCollection, emiRemains;
                    return _ts_generator(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                return [
                                    4,
                                    this.emiModel.findOne({
                                        where: {
                                            emiID: payload.emiID,
                                            leadID: payload.leadID
                                        }
                                    })
                                ];
                            case 1:
                                emi = _state.sent();
                                return [
                                    4,
                                    this.creditModel.findOneCredit({
                                        creditID: emi.creditID
                                    })
                                ];
                            case 2:
                                credit = _state.sent();
                                amountRemains = +payload.amount.toFixed(2);
                                if (amountRemains <= 0) return [
                                    2
                                ];
                                payload.paymentDate = (_payload_paymentDate = payload.paymentDate) !== null && _payload_paymentDate !== void 0 ? _payload_paymentDate : new Date();
                                //const currentDate = new Date()
                                // const currentDate = paymentDetails.paymentDate
                                currentDate = new Date(payload.paymentDate);
                                details = {
                                    interest: 0,
                                    principal: 0,
                                    penalty: 0,
                                    bounceCharge: 0,
                                    updatePenalty: 0,
                                    updateBrokenPeriodIntrest: 0,
                                    paymentReceived: 0
                                };
                                // Safely compare actualPaymentDate and dueDate
                                dueDate = new Date(format(new Date(emi.dueDate), 'yyyy-MM-dd'));
                                if (emi.actualPaymentDate !== null && new Date(emi.actualPaymentDate) > new Date(emi.dueDate)) {
                                    dueDate = emi.actualPaymentDate;
                                }
                                // Set interest, principal, penalty, and bounceCharge based on emi status
                                interest = emi.status === 'partially-paid' ? emi.amountRemainsInterest : emi.interest;
                                principal = emi.status === 'partially-paid' ? emi.amountRemains : emi.principal;
                                penalty = emi.status === 'partially-paid' ? emi.amountRemainsPenalty : emi.panelty;
                                details.updatePenalty = emi.panelty;
                                // Calculate bounceCharge based on the emi status
                                bounceCharge = emi.status === 'partially-paid' ? emi.amountRemainsBrokenPeriodIntrest : 0;
                                // Ensure dueDate is a valid Date object
                                emiDueDate = new Date(dueDate);
                                // Calculate the delay in days between the current date and emi due date
                                delayDays = differenceInCalendarDays(currentDate, emiDueDate);
                                if (delayDays < 0) {
                                    delayDays = 0;
                                }
                                if (bounceCharge == 0 && emi.status === 'partially-paid' && delayDays > 0) {
                                    bounceCharge = +calculateBounceCharge();
                                }
                                if (!(delayDays > 0)) return [
                                    3,
                                    6
                                ];
                                penaltyAgain = round(+calculatePenalty(principal, delayDays, credit.roi));
                                penalty += penaltyAgain;
                                return [
                                    4,
                                    this.savePenalty(credit, emi.emiID, penaltyAgain, 'penalty')
                                ];
                            case 3:
                                _state.sent();
                                if (!(emi.status != 'partially-paid')) return [
                                    3,
                                    5
                                ];
                                bounceCharge = +calculateBounceCharge();
                                return [
                                    4,
                                    this.savePenalty(credit, emi.emiID, bounceCharge, 'Bounce Charge')
                                ];
                            case 4:
                                _state.sent();
                                _state.label = 5;
                            case 5:
                                details.updatePenalty = details.updatePenalty + penaltyAgain;
                                _state.label = 6;
                            case 6:
                                if (delayDays > 0) {
                                    details.updateBrokenPeriodIntrest = calculateBounceCharge();
                                } else {
                                    details.updateBrokenPeriodIntrest = emi.brokenPeriodIntrest;
                                }
                                //details.updateBrokenPeriodIntrest = this.emiService.bounceCharge();
                                if (emi.status == 'due' && delayDays > 0) {
                                    details.updateBrokenPeriodIntrest = calculateBounceCharge();
                                } else {
                                    details.updateBrokenPeriodIntrest = details.updateBrokenPeriodIntrest;
                                }
                                details.paymentReceived = +emi.paymentReceived;
                                // Subtract payment from interest first, then principal, then penalty
                                interestPaid = 0;
                                if (amountRemains > 0 && interest > 0) {
                                    interestPaid = Math.min(amountRemains, interest);
                                    interest -= interestPaid;
                                    amountRemains -= interestPaid;
                                    details.paymentReceived += interestPaid;
                                }
                                details.interest = interest;
                                principalPaid = 0;
                                if (amountRemains > 0 && principal > 0) {
                                    principalPaid = Math.min(amountRemains, principal);
                                    principal -= principalPaid;
                                    amountRemains -= principalPaid;
                                    details.paymentReceived += principalPaid;
                                }
                                details.principal = principal;
                                penaltyPaid = 0;
                                if (amountRemains > 0 && penalty > 0) {
                                    penaltyPaid = Math.min(amountRemains, penalty);
                                    penalty -= penaltyPaid;
                                    amountRemains -= penaltyPaid;
                                    details.paymentReceived += penaltyPaid;
                                }
                                details.penalty = penalty;
                                bounceChargePaid = 0;
                                if (amountRemains > 0 && bounceCharge > 0) {
                                    bounceChargePaid = Math.min(amountRemains, bounceCharge);
                                    bounceCharge -= bounceChargePaid;
                                    amountRemains -= bounceChargePaid;
                                    details.paymentReceived += bounceChargePaid;
                                }
                                details.bounceCharge = bounceCharge;
                                totalSum = details.interest + details.principal + details.penalty + details.bounceCharge;
                                status = totalSum > 0 ? 'partially-paid' : 'paid';
                                return [
                                    4,
                                    this.updateEmiStatusToPartial(emi, amountRemains, delayDays, payload, details, status, +payload.amount.toFixed(2), parseFloat(emi.waive_off_amount))
                                ];
                            case 7:
                                _state.sent();
                                creditID = credit.creditID;
                                return [
                                    4,
                                    this.emiModel.findLastEmi({
                                        creditID: creditID
                                    }, [
                                        'emiID',
                                        'accessAmount',
                                        'dueDate'
                                    ])
                                ];
                            case 8:
                                lastEmiCollection = _state.sent();
                                return [
                                    4,
                                    this.countRemainingEmis(credit.creditID)
                                ];
                            case 9:
                                emiRemains = _state.sent();
                                return [
                                    4,
                                    this.creditModel.updateCreditStatus(emiRemains, credit, +payload.amount.toFixed(2), true)
                                ];
                            case 10:
                                _state.sent();
                                // const lead = await this.leadModel.findOne({ where: { leadID: credit.leadID } })
                                // await this.callHistoryLogsModel.createCallHistoryLog(credit, lead, payload.amount.toString())
                                return [
                                    4,
                                    CommonHelper.lastEMIUpdater(emiRemains, credit.creditID, lastEmiCollection.dueDate, credit.actualTenure, credit.leadID)
                                ];
                            case 11:
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
            key: "findDueOrPartialEmis",
            value: function findDueOrPartialEmis(creditID) {
                return _async_to_generator(function() {
                    return _ts_generator(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                return [
                                    4,
                                    this.emiModel.find({
                                        where: function where(knex) {
                                            knex.where(function(query) {
                                                return query.where('status', 'partially-paid').orWhere('status', 'due');
                                            }).andWhere('creditID', creditID).andWhere('is_deleted', 0);
                                        },
                                        order: [
                                            {
                                                column: 'emiID',
                                                order: 'asc'
                                            }
                                        ]
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
            key: "find",
            value: function find(where, order, select) {
                return _async_to_generator(function() {
                    return _ts_generator(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                return [
                                    4,
                                    this.emiModel.findAll(where, order, select)
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
            key: "savePenalty",
            value: function savePenalty(credit, emiID, bounceCharge, discription) {
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
            key: "createOtherCharges",
            value: function createOtherCharges(other, emi, amount) {
                return _async_to_generator(function() {
                    return _ts_generator(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                return [
                                    4,
                                    this.otherChargesModel.insert(emi, other.creditID, amount, other.customerID, other.transectionID, other.discription)
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
            value: function updateEmiStatusToPartial(emi, amountRemains, delayDays, paymentDetails, details, status, waive_off_amount, prevWaiver) {
                return _async_to_generator(function() {
                    return _ts_generator(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                return [
                                    4,
                                    this.emiModel.findOneAndUpdate({
                                        emiID: emi.emiID
                                    }, _object_spread({
                                        status: status,
                                        // ! hasn't actually paid
                                        // actualPaymentDate: paymentDetails.paymentDate
                                        //   ? moment(paymentDetails.paymentDate).tz('Asia/Kolkata').toDate()
                                        //   : moment().tz('Asia/Kolkata').toDate(),
                                        delayDays: delayDays,
                                        amountRemains: details.principal,
                                        amountRemainsInterest: details.interest,
                                        amountRemainsPenalty: details.penalty,
                                        amountRemainsBrokenPeriodIntrest: details.bounceCharge,
                                        panelty: details.updatePenalty,
                                        brokenPeriodIntrest: details.updateBrokenPeriodIntrest
                                    }, waive_off_amount == undefined && {
                                        paymentReceived: details.paymentReceived
                                    }, waive_off_amount == undefined && {
                                        paymentID: paymentDetails.id
                                    }, waive_off_amount !== undefined && {
                                        waive_off_amount: prevWaiver + waive_off_amount
                                    }))
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
            key: "countRemainingEmis",
            value: function countRemainingEmis(creditID) {
                return _async_to_generator(function() {
                    var countRow;
                    return _ts_generator(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                return [
                                    4,
                                    this.emiModel.countEMI(function(query) {
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
            key: "getRepaymentDataV2",
            value: function getRepaymentDataV2(leadId, customerID) {
                return _async_to_generator(function() {
                    var _this, _getEmis_, _getEmis_1, _ref, credit, loanData, _ref1, getEmis, transactions, processedEmis, tempAmountPayable, isTempWaiverActive, i, totalRepay, i1, lastPaymentDate, Emi, loanSummary, getTransections, emiDocs;
                    return _ts_generator(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                _this = this;
                                return [
                                    4,
                                    Promise.all([
                                        this.creditService.findOne({
                                            leadID: leadId
                                        }, [
                                            'creditID',
                                            'leadID',
                                            'tenure',
                                            'amountToBeRepayed',
                                            'principal',
                                            'firstDueDate',
                                            'roi',
                                            'created_at'
                                        ]),
                                        this.loanService.findOne({
                                            leadID: leadId
                                        }, [
                                            'loanNo',
                                            'disbursalDate'
                                        ])
                                    ])
                                ];
                            case 1:
                                _ref = _sliced_to_array.apply(void 0, [
                                    _state.sent(),
                                    2
                                ]), credit = _ref[0], loanData = _ref[1];
                                if (!credit) {
                                    throw new Error('No Active Emi Loan Found');
                                }
                                if (!loanData) {
                                    throw new Error('No loan Data found for this customer');
                                }
                                return [
                                    4,
                                    Promise.all([
                                        this.find({
                                            creditID: credit.creditID,
                                            is_deleted: 0
                                        }, [
                                            {
                                                column: 'emiID',
                                                order: 'asc'
                                            }
                                        ], [
                                            'principal',
                                            'interest',
                                            'panelty',
                                            'amountPayable',
                                            'dueDate',
                                            'status',
                                            'brokenPeriodIntrest',
                                            'amountRemains',
                                            'amountRemainsInterest',
                                            'amountRemainsPenalty',
                                            'amountRemainsBrokenPeriodIntrest',
                                            'paymentReceived',
                                            'actualPaymentDate',
                                            'emiID',
                                            'creditID',
                                            'customerID',
                                            'leadID',
                                            'productID',
                                            'is_deleted',
                                            'accessAmount',
                                            'waive_off_amount',
                                            'updatedAt'
                                        ]),
                                        this.transactionService.findTransaction({
                                            customerID: customerID
                                        }, {
                                            orderKey: 'id',
                                            orderValue: 'desc'
                                        }, [
                                            'amount',
                                            'status',
                                            'mode',
                                            'referenceNo',
                                            'createdAt'
                                        ], [
                                            'collection'
                                        ])
                                    ])
                                ];
                            case 2:
                                _ref1 = _sliced_to_array.apply(void 0, [
                                    _state.sent(),
                                    2
                                ]), getEmis = _ref1[0], transactions = _ref1[1];
                                if (!getEmis) {
                                    throw new Error('No Emis breakdown found');
                                }
                                return [
                                    4,
                                    Promise.all(getEmis.map(function(emi) {
                                        return _async_to_generator(function() {
                                            return _ts_generator(this, function(_state) {
                                                return [
                                                    2,
                                                    this.processEmiV2(emi, credit)
                                                ];
                                            });
                                        }).call(_this);
                                    }))
                                ];
                            case 3:
                                processedEmis = _state.sent();
                                for(i = 0; i < processedEmis.length; i++){
                                    if (processedEmis[i].status === 'Part Paid' || processedEmis[i].status === 'Due' || processedEmis[i].status === 'Overdue') {
                                        credit.firstDueDate = processedEmis[i].dueDate;
                                        credit.amountToBeRepayed = processedEmis[i].amountPayable;
                                        tempAmountPayable = processedEmis[i].tempAmountPayable;
                                        isTempWaiverActive = processedEmis[i].isTempWaiverActive;
                                        break; // Exit the loop once the condition is met
                                    }
                                }
                                totalRepay = 0;
                                for(i1 = 0; i1 < processedEmis.length; i1++){
                                    if (processedEmis[i1].status === 'Part Paid' || processedEmis[i1].status === 'Due' || processedEmis[i1].status === 'Overdue') {
                                        totalRepay += processedEmis[i1].amountPayable;
                                    }
                                }
                                lastPaymentDate = this.calculateLastPaymentDate(transactions);
                                Emi = ((_getEmis_ = getEmis[0]) === null || _getEmis_ === void 0 ? void 0 : _getEmis_.principal) + ((_getEmis_1 = getEmis[0]) === null || _getEmis_1 === void 0 ? void 0 : _getEmis_1.interest) || 0;
                                loanSummary = _object_spread_props(_object_spread({}, credit), {
                                    Emi: Emi,
                                    loanNumber: loanData.loanNo,
                                    disbursalDate: loanData.disbursalDate,
                                    lastPaymentDate: lastPaymentDate,
                                    totalRepay: totalRepay
                                });
                                // Prepare transaction details
                                getTransections = transactions ? transactions.map(function(transection) {
                                    return _this.processTransaction(transection);
                                }) : [];
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
                                return [
                                    2,
                                    {
                                        loanSummary: loanSummary,
                                        processedEmis: processedEmis,
                                        getTransections: getTransections,
                                        emiDocs: emiDocs
                                    }
                                ];
                        }
                    });
                }).call(this);
            }
        },
        {
            key: "createEMI",
            value: function createEMI(creditID, customerID, leadID, productID, principal, interest, openingBalance, closingBalance, emiNUmber, roi, firstDueDate) {
                return _async_to_generator(function() {
                    var dueDate, lastEmi, error;
                    return _ts_generator(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                _state.trys.push([
                                    0,
                                    5,
                                    ,
                                    6
                                ]);
                                if (!(emiNUmber == 1)) return [
                                    3,
                                    1
                                ];
                                dueDate = new Date(firstDueDate);
                                return [
                                    3,
                                    3
                                ];
                            case 1:
                                return [
                                    4,
                                    this.emiModel.findAll({
                                        productID: productID
                                    }, [
                                        {
                                            column: 'emiID',
                                            order: 'desc'
                                        }
                                    ], [
                                        'dueDate'
                                    ])
                                ];
                            case 2:
                                lastEmi = _state.sent();
                                dueDate = new Date(lastEmi[0].dueDate);
                                dueDate.setMonth(dueDate.getMonth() + 1);
                                _state.label = 3;
                            case 3:
                                // console.log(documentToBeInserted)
                                // if (emiNUmber == 1 && daysInBPI > 0) {
                                //   brokenPeriodIntrest = openingBalance * (roi / 100) * (daysInBPI / 365)
                                //   interest += brokenPeriodIntrest
                                // }
                                return [
                                    4,
                                    this.emiModel.insertEMI(creditID, customerID, leadID, productID, principal, interest, openingBalance, closingBalance, dueDate)
                                ];
                            case 4:
                                _state.sent();
                                return [
                                    2,
                                    {
                                        success: true,
                                        message: 'EMI Created !',
                                        statusCode: 200
                                    }
                                ];
                            case 5:
                                error = _state.sent();
                                logger.error(error);
                                return [
                                    2,
                                    {
                                        success: false,
                                        message: 'Something Went Wrong: Create EMI Function',
                                        statusCode: 500
                                    }
                                ];
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
            key: "findLastEmi",
            value: function findLastEmi(_0) {
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
                                    this.emiModel.findLastEmi(where, select)
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
        }
    ]);
    return EmiService;
}();
export var emiService = new EmiService();

//# sourceMappingURL=emi.service.js.map