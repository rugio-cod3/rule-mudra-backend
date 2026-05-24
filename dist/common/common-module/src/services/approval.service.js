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
import { logger } from '@/utils/logger';
import moment from 'moment';
import { approvalModel } from '../database/mysql/approval';
import { callHistorymodel } from '../database/mysql/callHistory';
import { callHistoryLogsModel } from '../database/mysql/callhistorylogs';
import { collectionModel } from '../database/mysql/collection';
import { customerModel } from '../database/mysql/customer';
import { leadModel } from '../database/mysql/leads';
import { leadsApiLogModel } from '../database/mysql/leadsApiLog';
import { leadsAutoStatusmodel } from '../database/mysql/leadsAutoStatus';
import { loanModel } from '../database/mysql/loan';
import { repayDateHolidaymodel } from '../database/mysql/repayDateHoliday';
import { ApprovalStatus } from '../enums/approvalStatus.enum';
import { CollectionStatus } from '../enums/collectionStatus.enum';
import { adminFeeInPercentage, BranchName, CallType } from '../enums/common.enum';
import { LeadStatus } from '../enums/leadStatus.enum';
import { loanService } from '../services/loan.service';
import { finboxService } from '../services/thirdParty/finbox.service';
import { leadService } from './lead.service';
var ApprovalService = /*#__PURE__*/ function() {
    "use strict";
    function ApprovalService() {
        _class_call_check(this, ApprovalService);
        _define_property(this, "callHistoryLogsModel", callHistoryLogsModel);
        _define_property(this, "callHistorymodel", callHistorymodel);
        _define_property(this, "leadModel", leadModel);
        _define_property(this, "loanModel", loanModel);
        _define_property(this, "collectionModel", collectionModel);
        _define_property(this, "customerModel", customerModel);
        _define_property(this, "finboxService", finboxService);
        _define_property(this, "approvalModel", approvalModel);
        _define_property(this, "repayDateHolidaymodel", repayDateHolidaymodel);
        _define_property(this, "loanService", loanService);
        _define_property(this, "leadApiLogModel", leadsApiLogModel);
        _define_property(this, "leadAutoStatusModel", leadsAutoStatusmodel);
    }
    _create_class(ApprovalService, [
        {
            key: "autoApproveRepeatCustomer",
            value: function autoApproveRepeatCustomer(leadID, customerID) {
                var checkOfferAmount = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : 0, newOfferAmount = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : 0;
                return _async_to_generator(function() {
                    var offerAmount, days, endDate, leadIds, leadCount, loanCount, collection, getLastLeadId, getLoanLeadDetail, approval, cloaCheck, crp, repayDateDay, customerData, salaryDate, repayDateFind, repayDate, diff, tenureDays, lastLoanRepayDate, lastLoanClosed, lastLoanDisbursed, collectedTimestamp, disbursalTimestamp, checkDifference, daysDifference, repayTimestamp, dpd, currentLoanAmount, increase, newLoanAmount, newLoanAmountRounded, increase1, newLoanAmount1, newLoanAmountRounded1, currentPFRatio, newProcessingFee, currentLoanAmount1, currentPFRatio1, newProcessingFee1, approvalId, callHistoryData, callHistoryLogData, data;
                    return _ts_generator(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                offerAmount = 0;
                                if (!(leadID && customerID)) return [
                                    3,
                                    18
                                ];
                                days = 7;
                                endDate = new Date();
                                endDate.setDate(endDate.getDate() + 30);
                                leadIds = [];
                                if (!(checkOfferAmount === 0)) return [
                                    3,
                                    2
                                ];
                                return [
                                    4,
                                    this.leadModel.countLeads({
                                        customerID: customerID,
                                        status: LeadStatus.CLOSED
                                    }, {
                                        leadID: leadID
                                    })
                                ];
                            case 1:
                                leadCount = _state.sent();
                                return [
                                    3,
                                    4
                                ];
                            case 2:
                                return [
                                    4,
                                    this.leadModel.countLeads({
                                        customerID: customerID,
                                        status: LeadStatus.CLOSED
                                    })
                                ];
                            case 3:
                                leadCount = _state.sent();
                                _state.label = 4;
                            case 4:
                                return [
                                    4,
                                    this.loanModel.count({
                                        customerID: customerID,
                                        status: LeadStatus.DISBURSED
                                    }, {
                                        disbursalRefrenceNo: ''
                                    })
                                ];
                            case 5:
                                loanCount = _state.sent();
                                if (!(leadCount === loanCount)) return [
                                    3,
                                    14
                                ];
                                return [
                                    4,
                                    this.collectionModel.findOneCollection({
                                        customerID: customerID,
                                        collectionStatus: LeadStatus.APPROVED,
                                        status: CollectionStatus.CLOSED
                                    }, [
                                        '*'
                                    ], [
                                        {
                                            column: 'leadID',
                                            order: 'desc'
                                        }
                                    ])
                                ];
                            case 6:
                                collection = _state.sent();
                                if (!collection) return [
                                    3,
                                    14
                                ];
                                getLastLeadId = collection.leadID;
                                return [
                                    4,
                                    this.loanService.getLoanLeadDetail(getLastLeadId)
                                ];
                            case 7:
                                getLoanLeadDetail = _state.sent();
                                approval = getLoanLeadDetail === null || getLoanLeadDetail === void 0 ? void 0 : getLoanLeadDetail.creda;
                                if (!approval) return [
                                    3,
                                    14
                                ];
                                return [
                                    4,
                                    this.collectionModel.findOneCollection({
                                        customerID: customerID,
                                        leadID: getLastLeadId,
                                        collectionStatus: LeadStatus.APPROVED,
                                        status: CollectionStatus.CLOSED
                                    }, [
                                        '*'
                                    ], [
                                        {
                                            column: 'leadID',
                                            order: 'desc'
                                        }
                                    ])
                                ];
                            case 8:
                                cloaCheck = _state.sent();
                                crp = new Date(approval.repayDate);
                                crp.setDate(crp.getDate() + days);
                                if (!(cloaCheck && crp >= new Date(cloaCheck.collectedDate))) return [
                                    3,
                                    14
                                ];
                                offerAmount = approval.loanAmtApproved;
                                repayDateDay = new Date(getLoanLeadDetail.creda.repayDate).getDate();
                                return [
                                    4,
                                    this.customerModel.findOneCustomer({
                                        customerID: customerID
                                    })
                                ];
                            case 9:
                                customerData = _state.sent();
                                salaryDate = repayDateDay;
                                if (customerData && customerData.salary_date) {
                                    salaryDate = Number(customerData.salary_date);
                                }
                                return [
                                    4,
                                    this.finboxService.repayDateFind(String(salaryDate))
                                ];
                            case 10:
                                repayDateFind = _state.sent();
                                repayDate = (repayDateFind === null || repayDateFind === void 0 ? void 0 : repayDateFind.formattedDate) ? repayDateFind === null || repayDateFind === void 0 ? void 0 : repayDateFind.formattedDate : endDate.toISOString().split('T')[0];
                                diff = new Date(repayDate).getTime() - new Date().getTime();
                                tenureDays = Math.abs(Math.round(diff / (1000 * 60 * 60 * 24)));
                                delete approval.createdDate;
                                delete approval.approvalID;
                                if (approval.adminFee === 0) {
                                    approval.adminFee = Math.round(approval.loanAmtApproved * 0.1);
                                }
                                approval.GstOfAdminFee = Math.round(approval.adminFee * 0.18);
                                lastLoanRepayDate = getLoanLeadDetail.creda.repayDate;
                                lastLoanClosed = cloaCheck.collectedDate;
                                lastLoanDisbursed = getLoanLeadDetail.disba.disbursalDate;
                                collectedTimestamp = new Date(lastLoanClosed).getTime();
                                disbursalTimestamp = new Date(lastLoanDisbursed).getTime();
                                checkDifference = collectedTimestamp - disbursalTimestamp;
                                daysDifference = Math.floor(checkDifference / (1000 * 60 * 60 * 24));
                                repayTimestamp = new Date(lastLoanRepayDate).getTime();
                                dpd = (collectedTimestamp - repayTimestamp) / (1000 * 60 * 60 * 24);
                                if (collectedTimestamp > disbursalTimestamp && daysDifference >= 15 && dpd <= 0 && loanCount + 1 >= 4 && (loanCount + 1) % 4 === 0) {
                                    currentLoanAmount = approval.loanAmtApproved;
                                    if (currentLoanAmount < 7000) {
                                        increase = 500;
                                        newLoanAmount = currentLoanAmount + increase;
                                        newLoanAmountRounded = newLoanAmount;
                                        offerAmount = newLoanAmountRounded;
                                    } else {
                                        increase1 = currentLoanAmount * 0.08;
                                        newLoanAmount1 = currentLoanAmount + increase1;
                                        newLoanAmountRounded1 = Math.round(newLoanAmount1 / 1000) * 1000;
                                        offerAmount = newLoanAmountRounded1;
                                    }
                                    approval.loanAmtApproved = offerAmount;
                                    currentPFRatio = approval.adminFee / currentLoanAmount;
                                    newProcessingFee = Math.round(offerAmount * currentPFRatio);
                                    approval.adminFee = newProcessingFee;
                                    approval.GstOfAdminFee = this.loanService.calculateGst(approval.adminFee);
                                }
                                if (newOfferAmount > 999) {
                                    currentLoanAmount1 = approval.loanAmtApproved;
                                    approval.loanAmtApproved = newOfferAmount;
                                    currentPFRatio1 = approval.adminFee / currentLoanAmount1;
                                    newProcessingFee1 = Math.round(newOfferAmount * currentPFRatio1);
                                    approval.adminFee = newProcessingFee1;
                                    approval.GstOfAdminFee = this.loanService.calculateGst(approval.adminFee);
                                }
                                if (!(checkOfferAmount === 0)) return [
                                    3,
                                    14
                                ];
                                approval.leadID = leadID;
                                approval.tenure = tenureDays;
                                approval.repayDate = moment(repayDate).toDate();
                                approval.status = ApprovalStatus.ApprovedProcess;
                                approval.remark = ApprovalStatus.ApprovedProcess;
                                approval.creditedBy = 221;
                                approval.sanctionalloUID = '221';
                                return [
                                    4,
                                    this.approvalModel.insert(approval)
                                ];
                            case 11:
                                approvalId = _state.sent();
                                leadIds.push(leadID);
                                leadIds.push(approval);
                                if (!approvalId) return [
                                    3,
                                    14
                                ];
                                return [
                                    4,
                                    this.leadModel.findOneAndUpdate({
                                        leadID: leadID
                                    }, {
                                        status: LeadStatus.APPROVED_PROCESS
                                    })
                                ];
                            case 12:
                                _state.sent();
                                // save to callHistory and logs
                                callHistoryData = {
                                    customerID: customerID,
                                    leadID: leadID,
                                    callType: CallType.IVR,
                                    status: LeadStatus.APPROVED_PROCESS,
                                    remark: LeadStatus.APPROVED_PROCESS,
                                    noteli: 'App Auto Approved',
                                    callbackTime: new Date(),
                                    calledBy: 221
                                };
                                callHistoryLogData = {
                                    customerID: customerID,
                                    leadID: leadID,
                                    callType: CallType.IVR,
                                    status: LeadStatus.APPROVED_PROCESS,
                                    remark: LeadStatus.APPROVED_PROCESS,
                                    noteli: 'App Auto Approved',
                                    callbackTime: new Date(),
                                    appAmount: (approval === null || approval === void 0 ? void 0 : approval.loanAmtApproved) ? String(approval === null || approval === void 0 ? void 0 : approval.loanAmtApproved) : '0',
                                    calledBy: 221
                                };
                                return [
                                    4,
                                    Promise.all([
                                        this.callHistorymodel.insert(callHistoryData),
                                        this.callHistoryLogsModel.insert(callHistoryLogData)
                                    ])
                                ];
                            case 13:
                                _state.sent();
                                _state.label = 14;
                            case 14:
                                if (!(checkOfferAmount === 0)) return [
                                    3,
                                    17
                                ];
                                if (!(leadIds.length > 0)) return [
                                    3,
                                    16
                                ];
                                data = {
                                    type: 1,
                                    agent_id: 221,
                                    lead_ids: JSON.stringify(leadIds)
                                };
                                return [
                                    4,
                                    this.leadAutoStatusModel.insert(data)
                                ];
                            case 15:
                                _state.sent();
                                return [
                                    2,
                                    1
                                ];
                            case 16:
                                return [
                                    3,
                                    18
                                ];
                            case 17:
                                return [
                                    2,
                                    offerAmount
                                ];
                            case 18:
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
                    return _ts_generator(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                return [
                                    4,
                                    this.approvalModel.insert(data)
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
            key: "rejectProcessCustomer",
            value: function rejectProcessCustomer(leadID, remark) {
                return _async_to_generator(function() {
                    var lead, customer, amount, repayDate, alternateMobile, officialEmail, status, approvedBy, adminFee, GstOfAdminFee, approvalData, error;
                    return _ts_generator(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                _state.trys.push([
                                    0,
                                    6,
                                    ,
                                    7
                                ]);
                                return [
                                    4,
                                    leadService.findOne({
                                        leadID: leadID
                                    })
                                ];
                            case 1:
                                lead = _state.sent();
                                if (!lead) return [
                                    2,
                                    false
                                ];
                                return [
                                    4,
                                    this.customerModel.findOneCustomer({
                                        customerID: lead.customerID
                                    })
                                ];
                            case 2:
                                customer = _state.sent();
                                if (!customer) return [
                                    2,
                                    false
                                ];
                                amount = 0;
                                repayDate = new Date();
                                alternateMobile = customer.mobile;
                                officialEmail = customer.email;
                                status = ApprovalStatus.RejectedProcess;
                                approvedBy = 221; // default user id
                                adminFee = amount * adminFeeInPercentage / 100;
                                GstOfAdminFee = adminFee * 0.18;
                                approvalData = {
                                    leadID: leadID,
                                    customerID: lead.customerID,
                                    branch: BranchName.DELHI,
                                    loanAmtApproved: amount,
                                    tenure: 0,
                                    roi: 1,
                                    repayDate: repayDate,
                                    adminFee: adminFee,
                                    GstOfAdminFee: GstOfAdminFee,
                                    alternateMobile: String(alternateMobile),
                                    officialEmail: officialEmail,
                                    cibil: 0,
                                    activeLoans: 0,
                                    status: status,
                                    remark: remark,
                                    employmentType: customer.employeeType,
                                    creditedBy: approvedBy,
                                    createdDate: new Date()
                                };
                                return [
                                    4,
                                    this.create(approvalData)
                                ];
                            case 3:
                                _state.sent();
                                return [
                                    4,
                                    leadService.updateOne({
                                        customerID: customer.customerID,
                                        leadID: leadID
                                    }, {
                                        status: LeadStatus.REJECTED_PROCESS
                                    })
                                ];
                            case 4:
                                _state.sent();
                                return [
                                    4,
                                    this.callHistoryLogsModel.insert({
                                        customerID: lead.customerID,
                                        leadID: leadID,
                                        callType: 'IVR',
                                        status: status,
                                        appAmount: String(amount),
                                        noteli: status,
                                        remark: remark,
                                        callbackTime: new Date(),
                                        calledBy: approvedBy
                                    })
                                ];
                            case 5:
                                _state.sent();
                                return [
                                    2,
                                    true
                                ];
                            case 6:
                                error = _state.sent();
                                logger.error('Error in rejectProcessCustomer:', error);
                                return [
                                    2,
                                    false
                                ];
                            case 7:
                                return [
                                    2
                                ];
                        }
                    });
                }).call(this);
            }
        }
    ]);
    return ApprovalService;
}();
export var approvalService = new ApprovalService();

//# sourceMappingURL=approval.service.js.map