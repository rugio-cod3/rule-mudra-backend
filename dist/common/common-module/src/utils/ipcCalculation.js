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
import { differenceInCalendarDays, parseISO } from 'date-fns';
import { toZonedTime } from 'date-fns-tz';
import { approvalModel } from '../database/mysql/approval';
import { loanModel } from '../database/mysql/loan';
import { NotFoundError } from '../errors';
import { getKnexInstance } from './mysql';
export function calculateTotalRepayPaydayAmountNonIPC(leadID) {
    return _async_to_generator(function() {
        var db, nowUTC, timeZone, today, result, disbursalDate, repayDate, sanctionDiff, dpdDiff, sanctionInterest, dpdInterest, totalRepayAmount, totalCollected;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    db = getKnexInstance();
                    nowUTC = new Date();
                    timeZone = 'Asia/Kolkata';
                    today = toZonedTime(nowUTC, timeZone);
                    return [
                        4,
                        db('loan').join('approval', 'loan.leadID', 'approval.leadID').where('loan.leadID', leadID).select('loan.disbursalAmount', 'loan.disbursalDate', 'approval.repayDate', 'approval.roi').orderBy('loan.loanID', 'desc').orderBy('approval.approvalID', 'desc').first()
                    ];
                case 1:
                    result = _state.sent();
                    if (!result) {
                        throw new NotFoundError('No loan or approval data found for the given leadID');
                    }
                    disbursalDate = typeof result.disbursalDate === 'string' ? parseISO(result.disbursalDate) : result.disbursalDate;
                    repayDate = typeof result.repayDate === 'string' ? parseISO(result.repayDate) : result.repayDate;
                    sanctionDiff = 0;
                    dpdDiff = 0;
                    if (today <= repayDate) {
                        sanctionDiff = differenceInCalendarDays(today, disbursalDate);
                    } else {
                        sanctionDiff = differenceInCalendarDays(repayDate, disbursalDate);
                        dpdDiff = differenceInCalendarDays(today, repayDate);
                    }
                    sanctionInterest = result.disbursalAmount * result.roi * sanctionDiff / 100;
                    dpdInterest = result.disbursalAmount * Number(config.dpdInterest) * dpdDiff / 100;
                    totalRepayAmount = sanctionInterest + dpdInterest + result.disbursalAmount;
                    return [
                        4,
                        db('collection').where({
                            leadID: leadID,
                            collectionStatus: 'Approved'
                        }).sum('collectedAmount as tc').first()
                    ];
                case 2:
                    totalCollected = _state.sent();
                    return [
                        2,
                        totalRepayAmount - ((totalCollected === null || totalCollected === void 0 ? void 0 : totalCollected.tc) || 0)
                    ];
            }
        });
    })();
}
export function calculateTotalRepayPaydayAmountIPC(leadID, status) {
    return _async_to_generator(function() {
        var db, nowUTC, timeZone, today, result, disbursalDate, repayDate, sanctionDiff, dpdDiff, principalAmount, dpdPenalty, dpdPenaltyGst, penaltyAmount, totalInterest, charges, totalRepayAmount, collection, principal_amount, closing_balance, collectedDate, penality_charge, penaltyBalance, penaltyAmountAdjustment, data;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    db = getKnexInstance();
                    nowUTC = new Date();
                    timeZone = 'Asia/Kolkata';
                    today = toZonedTime(nowUTC, timeZone);
                    return [
                        4,
                        db('loan').join('approval', 'loan.leadID', 'approval.leadID').where('loan.leadID', leadID).select('loan.disbursalAmount', 'loan.disbursalDate', 'loan.customerID', 'loan.loanNo', 'approval.repayDate', 'approval.roi').orderBy('loan.loanID', 'desc').orderBy('approval.approvalID', 'desc').first()
                    ];
                case 1:
                    result = _state.sent();
                    if (!result) {
                        throw new NotFoundError('No loan or approval data found for the given leadID');
                    }
                    disbursalDate = typeof result.disbursalDate === 'string' ? parseISO(result.disbursalDate) : result.disbursalDate;
                    repayDate = typeof result.repayDate === 'string' ? parseISO(result.repayDate) : result.repayDate;
                    sanctionDiff = 0;
                    dpdDiff = 0;
                    principalAmount = result.disbursalAmount;
                    if (today <= repayDate) {
                        sanctionDiff = differenceInCalendarDays(today, disbursalDate);
                    } else {
                        sanctionDiff = differenceInCalendarDays(repayDate, disbursalDate);
                        dpdDiff = differenceInCalendarDays(today, repayDate);
                    }
                    dpdPenalty = Number(config.dpdPenalty);
                    dpdPenaltyGst = Number(config.dpdPenaltyGstPercentage);
                    penaltyAmount = dpdDiff > 0 ? dpdPenalty * (1 + dpdPenaltyGst / 100) : 0;
                    totalInterest = result.disbursalAmount * (dpdDiff + sanctionDiff) * result.roi / 100;
                    charges = dpdDiff * Number(config.ipcDpdInterest) / 100 * result.disbursalAmount + penaltyAmount;
                    totalRepayAmount = result.disbursalAmount + totalInterest + charges;
                    if (!(status === 'Part Payment')) return [
                        3,
                        3
                    ];
                    return [
                        4,
                        db('collection').where({
                            customerID: result.customerID,
                            leadID: leadID,
                            loanNo: result.loanNo,
                            status: 'Part Payment',
                            collectionStatus: 'Approved'
                        }).orderBy('collectionID', 'desc').first()
                    ];
                case 2:
                    collection = _state.sent();
                    if (collection) {
                        principal_amount = collection.principal_amount, closing_balance = collection.closing_balance, collectedDate = collection.collectedDate, penality_charge = collection.penality_charge;
                        penaltyBalance = penality_charge;
                        penaltyAmountAdjustment = penaltyBalance ? 0 : penaltyAmount;
                        totalInterest = principal_amount * (dpdDiff + sanctionDiff) * result.roi / 100;
                        if (today <= repayDate) {
                            sanctionDiff = differenceInCalendarDays(today, collectedDate);
                        } else {
                            if (today >= repayDate && repayDate >= collectedDate) {
                                sanctionDiff = differenceInCalendarDays(repayDate, collectedDate);
                                dpdDiff = differenceInCalendarDays(today, repayDate);
                            } else {
                                dpdDiff = differenceInCalendarDays(today, collectedDate);
                            }
                        }
                        charges = dpdDiff * Number(config.ipcDpdInterest) / 100 * principal_amount + penaltyAmountAdjustment;
                        totalRepayAmount = Number(closing_balance !== null && closing_balance !== void 0 ? closing_balance : principal_amount) + totalInterest + charges;
                    }
                    _state.label = 3;
                case 3:
                    data = {
                        totalRepayAmount: totalRepayAmount,
                        totalInterest: totalInterest,
                        charges: charges,
                        principalAmount: principalAmount
                    };
                    return [
                        2,
                        data
                    ];
            }
        });
    })();
}
export function calculateTotalRepayAmountEmi(leadID) {
    return _async_to_generator(function() {
        var _ref, _query__, _query_, db, query, totalRepayAmount;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    db = getKnexInstance();
                    return [
                        4,
                        db.raw("\n    SELECT \n        ROUND(\n            CASE\n                WHEN emi.status = 'due' AND emi.dueDate < CURRENT_DATE THEN\n                    emi.principal + emi.interest + \n                    emi.principal * (((COALESCE(cr.roi, 0) / 12) / 100) + 0.1) * \n                    DATEDIFF(CURRENT_DATE, emi.dueDate) + \n                    590\n                WHEN emi.status = 'part-payment' AND emi.actualPaymentDate > emi.dueDate THEN\n                    emi.principal + emi.interest + emi.panelty + \n                    emi.amountRemains * (((COALESCE(cr.roi, 0) / 12) / 100) + 0.1) * \n                    DATEDIFF(CURRENT_DATE, emi.actualPaymentDate) + \n                    590 - emi.amountPayable\n                WHEN emi.status = 'part-payment' AND emi.actualPaymentDate < emi.dueDate AND emi.dueDate < CURRENT_DATE THEN\n                    emi.principal + emi.interest + \n                    emi.amountRemains * (((COALESCE(cr.roi, 0) / 12) / 100) + 0.1) * \n                    DATEDIFF(CURRENT_DATE, emi.dueDate) + \n                    590 - emi.amountPayable\n                ELSE emi.amountPayable\n            END, 2\n        ) AS Repay_Amount\n    FROM equated_monthly_installments emi\n    LEFT JOIN credits cr ON emi.creditID = cr.creditID\n    WHERE emi.leadID = ? \n    AND emi.dueDate <= CURRENT_DATE\n    AND emi.status != 'paid'\n", [
                            leadID
                        ])
                    ];
                case 1:
                    query = _state.sent();
                    totalRepayAmount = (_ref = (_query_ = query[0]) === null || _query_ === void 0 ? void 0 : (_query__ = _query_[0]) === null || _query__ === void 0 ? void 0 : _query__.Repay_Amount) !== null && _ref !== void 0 ? _ref : 0;
                    return [
                        2,
                        totalRepayAmount
                    ];
            }
        });
    })();
}
export function calculatePaydayAmountIPC(leadID, status) {
    return _async_to_generator(function() {
        var db, today, loan, approval, principalAmount, disbursalDate, dpdDiff, sanctionDiff, repayDate, dpdPenalty, dpdPenaltyGst, penaltyAmount, totalInterest, charges, totalRepayAmount, collection, principal_amount, closing_balance, collectedDate, penality_charge, total_interest, penaltyBalance, penaltyAmountAdjustment, data;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    db = getKnexInstance();
                    today = new Date();
                    return [
                        4,
                        loanModel.findOneLoan({
                            leadID: leadID
                        }, [
                            'loanNo',
                            'disbursalDate',
                            'disbursalAmount',
                            'customerID'
                        ], [
                            {
                                column: 'loanID',
                                order: 'desc'
                            }
                        ])
                    ];
                case 1:
                    loan = _state.sent();
                    return [
                        4,
                        approvalModel.findOneApproval({
                            leadID: leadID
                        }, [
                            'repayDate',
                            'roi'
                        ], [
                            {
                                column: 'approvalID',
                                order: 'desc'
                            }
                        ])
                    ];
                case 2:
                    approval = _state.sent();
                    principalAmount = loan.disbursalAmount;
                    disbursalDate = typeof loan.disbursalDate === 'string' ? parseISO(loan.disbursalDate) : loan.disbursalDate;
                    dpdDiff = 0;
                    sanctionDiff = 0;
                    repayDate = typeof approval.repayDate === 'string' ? parseISO(approval.repayDate) : approval.repayDate;
                    dpdPenalty = Number(config.dpdPenalty);
                    dpdPenaltyGst = Number(config.dpdPenaltyGstPercentage);
                    penaltyAmount = 0;
                    if (repayDate < today) {
                        dpdDiff = differenceInCalendarDays(today, repayDate);
                        penaltyAmount = dpdPenalty * (1 + dpdPenaltyGst / 100);
                    }
                    if (today <= repayDate) {
                        sanctionDiff = differenceInCalendarDays(today, disbursalDate);
                    } else {
                        sanctionDiff = differenceInCalendarDays(repayDate, disbursalDate);
                    }
                    totalInterest = principalAmount * (dpdDiff + sanctionDiff) * approval.roi / 100;
                    charges = dpdDiff * Number(config.ipcDpdInterest) / 100 * principalAmount + penaltyAmount;
                    totalRepayAmount = principalAmount + totalInterest + charges;
                    if (!(status === 'Disbursed')) return [
                        3,
                        3
                    ];
                    if (today <= repayDate) {
                        sanctionDiff = differenceInCalendarDays(today, disbursalDate);
                    } else {
                        sanctionDiff = differenceInCalendarDays(repayDate, disbursalDate);
                        totalInterest = principalAmount * (dpdDiff + sanctionDiff) * approval.roi / 100;
                        charges = dpdDiff * Number(config.ipcDpdInterest) / 100 * principalAmount + penaltyAmount;
                    }
                    return [
                        3,
                        5
                    ];
                case 3:
                    if (!(status === 'Part Payment')) return [
                        3,
                        5
                    ];
                    return [
                        4,
                        db('collection').where({
                            customerID: loan.customerID,
                            leadID: leadID,
                            loanNo: loan.loanNo,
                            status: 'Part Payment',
                            collectionStatus: 'Approved'
                        }).orderBy('collectionID', 'desc').first()
                    ];
                case 4:
                    collection = _state.sent();
                    if (collection) {
                        principal_amount = collection.principal_amount, closing_balance = collection.closing_balance, collectedDate = collection.collectedDate, penality_charge = collection.penality_charge, total_interest = collection.total_interest;
                        penaltyBalance = penality_charge;
                        penaltyAmountAdjustment = penaltyBalance ? 0 : penaltyAmount;
                        totalInterest = principal_amount * (dpdDiff + sanctionDiff) * approval.roi / 100;
                        if (today <= repayDate) {
                            sanctionDiff = differenceInCalendarDays(today, collectedDate);
                        } else {
                            if (today >= repayDate && repayDate >= collectedDate) {
                                sanctionDiff = differenceInCalendarDays(repayDate, collectedDate);
                                dpdDiff = differenceInCalendarDays(today, repayDate);
                            } else {
                                dpdDiff = differenceInCalendarDays(today, collectedDate);
                            }
                        }
                        charges = dpdDiff * Number(config.ipcDpdInterest) / 100 * principal_amount + penaltyAmountAdjustment;
                        totalRepayAmount = Number(closing_balance !== null && closing_balance !== void 0 ? closing_balance : principal_amount) + totalInterest + charges;
                    }
                    _state.label = 5;
                case 5:
                    data = {
                        totalRepayAmount: totalRepayAmount,
                        totalInterest: totalInterest,
                        charges: charges,
                        principalAmount: principalAmount
                    };
                    return [
                        2,
                        data
                    ];
            }
        });
    })();
}

//# sourceMappingURL=ipcCalculation.js.map