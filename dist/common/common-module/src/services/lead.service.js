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
import axios, { HttpStatusCode } from 'axios';
import { addMonths, differenceInCalendarDays, differenceInDays, format, isWeekend, parseISO, subDays } from 'date-fns';
import ejs from 'ejs';
import moment from 'moment-timezone';
import path from 'path';
import puppeteer from 'puppeteer';
import { Readable } from 'stream';
import { addressModel } from '../database/mysql/address';
import { approvalModel } from '../database/mysql/approval';
import { appVideoModel } from '../database/mysql/appVideo';
import { bankIfscModel } from '../database/mysql/bankIfsc';
import { bankUpdateCheckModel } from '../database/mysql/bankUpdateCheck';
import { blackListCustomerPancardModel } from '../database/mysql/blacklistCustomerPancard';
import { callHistorymodel } from '../database/mysql/callHistory';
import { callHistoryLogsModel } from '../database/mysql/callhistorylogs';
import { collectionModel } from '../database/mysql/collection';
import { collectionFollowUpModel } from '../database/mysql/collectionFollowUp';
import { creditModel } from '../database/mysql/credit';
import { customerModel } from '../database/mysql/customer';
import { customerAccountModel } from '../database/mysql/customerAccount';
import { disbursalJobsModel } from '../database/mysql/disbursalJobs';
import { documentModel } from '../database/mysql/document';
import { emandateNotRequiredLogs } from '../database/mysql/emandateNotRequiredLogs';
import { employerModel } from '../database/mysql/employer';
import { finboxNameMatchModel } from '../database/mysql/finboxNameMatch';
import LeadApiLogModel, { leadsApiLogModel } from '../database/mysql/leadApiLogs';
import LeadModel from '../database/mysql/leads';
import { loanModel } from '../database/mysql/loan';
import { mobileTokenModel } from '../database/mysql/mobileToken';
import { noLoanFollowUpLogModel } from '../database/mysql/noLoanFollowUpLogs';
import { onlinePaymentModel } from '../database/mysql/onlinepayment';
import { paymentModeModel } from '../database/mysql/paymentMode';
import { paymentModeForBanksModel } from '../database/mysql/paymentModeForBanks';
import { pennyDropModel } from '../database/mysql/pennyDrop';
import { productModel } from '../database/mysql/product';
import { razorpayEmOrderModel } from '../database/mysql/razorpayEmOrder';
import { razorpayMandateModel } from '../database/mysql/razorpayMandate';
import { razorpayPayoutAccountsModel } from '../database/mysql/razorpayPayoutAccounts';
import { razorPayPayoutContactsModel } from '../database/mysql/razorpayPayoutContact';
import { razorpayPayoutDisbursedAmountModel } from '../database/mysql/razorpayPayoutDisbursedAmount';
import { referenceModel } from '../database/mysql/reference';
import { repayDateHolidaymodel } from '../database/mysql/repayDateHoliday';
import { stepControlModel } from '../database/mysql/stepControl';
import { stepTrackerModel } from '../database/mysql/stepTracker';
import TransactionModel from '../database/mysql/transactions';
import { userModel } from '../database/mysql/users';
import { virtualAccountModel } from '../database/mysql/virtualAccount';
import { whatsappMessageIdsModel } from '../database/mysql/whatsappMessageIds';
import { RAMFIN_WEBAPP_API } from '../enums/apis.enum';
import { CallType } from '../enums/callHistory.enum';
import { CollectedMode, CollectionStatus } from '../enums/collection.enum';
import { StepName } from '../enums/common.enum';
import { BankAccountStatus, BankAccountType } from '../enums/customerBankAccount.enum';
import { EmiStatus, ProductID } from '../enums/emi.enum';
import { LeadStatus } from '../enums/lead.enum';
import { ApiSupplierType, LeadLogApiType } from '../enums/leadApiLogs.enum';
import { LoanStatus } from '../enums/loan.enum';
import { NameMismatchType } from '../enums/logs';
import { PennyDropType, PennyStatus } from '../enums/pennyDrop.enum';
import { masterPermission } from '../enums/permission.enum';
import { Products } from '../enums/product.enum';
import { RazorPayContactType, RazorPayValidateStatus } from '../enums/razorpay.enum';
import { Roles } from '../enums/roles.enum';
import { TransactionGateway } from '../enums/transaction.enum';
import { AccessForbiddenError, BadRequestError, InternalServerError, NotFoundError } from '../errors';
import { commonHelper } from '../helpers/common';
import { formatToIST, formatToISTDate, isHoliday } from '../helpers/date.helpers';
import { emiHelper } from '../helpers/emi.helpers';
import { getDifferenceInDays, isDateAfter } from '../utils/dateTimeFunction';
import { calculatePaydayAmountIPC } from '../utils/ipcCalculation';
import { logger } from '../utils/logger';
import { getKnexInstance } from '../utils/mysql';
import { notificationUtils } from '../utils/notification';
import RazorpayPG, { razorPayPayments } from '../utils/razorpayClient.utils';
import { calculateRepayDate, calculateTotalPages, convertRupeesToPaise, createLoanNumber, generatePennyDropId, generateRandomId, generateRandomNumber, permissionAuthorizer, roleAuthorizer, roundNumber } from '../utils/util';
import AxiosService from './api.service';
import { AutoAllocationService } from './autoAllocation';
import { creditService } from './credit.service';
import { crmService } from './crm.service';
import { csvDownloadService } from './csvDownload.service';
import { emiService } from './emi.service';
import { excelDownloadService } from './excelDownload.service';
import { loanService } from './loan.service';
import MobileTokenService from './mobileToken.service';
import NotificationService from './notification.service';
import ResponseService from './response.service';
import S3Service from './thirdParty/s3.service';
import { transactionService } from './transaction.service';
export var LeadService = /*#__PURE__*/ function(ResponseService) {
    "use strict";
    _inherits(LeadService, ResponseService);
    function LeadService() {
        _class_call_check(this, LeadService);
        var _this;
        var _this1;
        _this = _call_super(this, LeadService, arguments), _this1 = _this, _define_property(_this, "customerID", void 0), _define_property(_this, "leadModel", new LeadModel()), _define_property(_this, "userModel", userModel), _define_property(_this, "AllocationService", new AutoAllocationService()), _define_property(_this, "employerModel", employerModel), _define_property(_this, "approvalModel", approvalModel), _define_property(_this, "customerModel", customerModel), _define_property(_this, "addressModel", addressModel), _define_property(_this, "referenceModel", referenceModel), _define_property(_this, "razorpayMandateModel", razorpayMandateModel), _define_property(_this, "pennyDropModel", pennyDropModel), _define_property(_this, "emandateNotRequiredLogs", emandateNotRequiredLogs), _define_property(_this, "customerAccountModel", customerAccountModel), _define_property(_this, "razorPayPayments", razorPayPayments), _define_property(_this, "callHistoryLogsModel", callHistoryLogsModel), _define_property(_this, "razorpayEmOrderModel", razorpayEmOrderModel), _define_property(_this, "onlinePaymentModel", onlinePaymentModel), _define_property(_this, "loanModel", loanModel), _define_property(_this, "productModel", productModel), _define_property(_this, "bankIfscModel", bankIfscModel), _define_property(_this, "collectionModel", collectionModel), _define_property(_this, "loanService", loanService), _define_property(_this, "creditModel", creditModel), _define_property(_this, "emiService", emiService), _define_property(_this, "transactionModel", new TransactionModel()), _define_property(_this, "collectionFollowUpModel", collectionFollowUpModel), _define_property(_this, "razorpayPg", new RazorpayPG()), _define_property(_this, "virtualAccountModel", virtualAccountModel), _define_property(_this, "commonHelper", commonHelper), _define_property(_this, "creditService", creditService), _define_property(_this, "s3Service", new S3Service()), _define_property(_this, "documentModel", documentModel), _define_property(_this, "leadApiLogModel", new LeadApiLogModel()), _define_property(_this, "mobileTokenService", new MobileTokenService()), _define_property(_this, "repayDateHolidaymodel", repayDateHolidaymodel), _define_property(_this, "mobileTokenModel", mobileTokenModel), _define_property(_this, "callHistoryModel", callHistorymodel), _define_property(_this, "stepControlModel", stepControlModel), _define_property(_this, "stepTrackerModel", stepTrackerModel), _define_property(_this, "blackListCustomerPancardModel", blackListCustomerPancardModel), _define_property(_this, "razorpayPayoutDisbursedAmountModel", razorpayPayoutDisbursedAmountModel), _define_property(_this, "disbursalJobsModel", disbursalJobsModel), _define_property(_this, "bankUpdateCheckModel", bankUpdateCheckModel), _define_property(_this, "razorPayPayoutContactsModel", razorPayPayoutContactsModel), _define_property(_this, "razorpayPayoutAccountsModel", razorpayPayoutAccountsModel), _define_property(_this, "transactionService", transactionService), _define_property(_this, "crmService", crmService), _define_property(_this, "finboxNameMatchModel", finboxNameMatchModel), _define_property(_this, "paymentModeModel", paymentModeModel), _define_property(_this, "paymentModeForBanksModel", paymentModeForBanksModel), _define_property(_this, "noLoanFollowUpLogModel", noLoanFollowUpLogModel), _define_property(_this, "appVideoModel", appVideoModel), _define_property(_this, "whatsappMessageIdsModel", whatsappMessageIdsModel), _define_property(_this, "csvDownloadService", csvDownloadService), _define_property(_this, "notificationService", new NotificationService()), _define_property(_this, "emiHelper", emiHelper), _define_property(_this, "excelDownloadService", excelDownloadService), _define_property(_this, "virtualAccountDetails", function(leadID) {
            return _async_to_generator(function() {
                var leadDetails, AccountData, baseUrl, virtualAccountData;
                return _ts_generator(this, function(_state) {
                    switch(_state.label){
                        case 0:
                            return [
                                4,
                                _this1.leadModel.findOneLead({
                                    leadID: leadID
                                })
                            ];
                        case 1:
                            leadDetails = _state.sent();
                            if (!leadDetails) throw new BadRequestError('Lead not found');
                            return [
                                4,
                                _this1.virtualAccountModel.find({
                                    where: {
                                        customerID: "".concat(leadDetails.customerID)
                                    },
                                    select: [
                                        'account_number',
                                        'ifsc',
                                        'name',
                                        'credatedDate'
                                    ],
                                    order: [
                                        {
                                            column: 'credatedDate',
                                            order: 'desc'
                                        }
                                    ],
                                    paginate: {
                                        perPage: 1,
                                        page: 0
                                    }
                                })
                            ];
                        case 2:
                            AccountData = _state.sent();
                            return [
                                4,
                                _this1.commonHelper.getBaseUrl()
                            ];
                        case 3:
                            baseUrl = _state.sent();
                            AccountData = AccountData.map(function(account) {
                                var createdDate = new Date(account.credatedDate);
                                var accountValidity = new Date(createdDate);
                                accountValidity.setDate(createdDate.getDate() + 90);
                                return _object_spread_props(_object_spread({}, account), {
                                    accountValidity: accountValidity.toISOString().split('T')[0]
                                });
                            });
                            virtualAccountData = {
                                AccountData: AccountData,
                                link: "".concat(baseUrl, "/pay-now/")
                            };
                            return [
                                2,
                                _this1.serviceResponse(HttpStatusCode.Ok, virtualAccountData, 'Success')
                            ];
                    }
                });
            })();
        }), _define_property(_this, "getPaydayLoanDetails", function(leadID, customerID) {
            return _async_to_generator(function() {
                var db, loanDetails, statements;
                return _ts_generator(this, function(_state) {
                    switch(_state.label){
                        case 0:
                            db = getKnexInstance();
                            return [
                                4,
                                db('loan').join('customer', 'loan.customerID', '=', 'customer.customerID').join('address', 'loan.customerID', '=', 'address.customerID').leftJoin('approval', 'loan.leadID', '=', 'approval.leadID').where('loan.leadID', leadID).whereIn('loan.status', [
                                    'Disbursed',
                                    'Part Payment',
                                    'Settlement'
                                ]).orderBy('loan.loanID', 'desc').select('loan.*', 'customer.name', 'approval.loanAmtApproved', 'approval.roi', 'approval.adminFee', 'approval.GstOfAdminFee', 'approval.tenure', 'approval.repayDate', 'customer.pancard', 'customer.mobile', 'address.address')
                            ];
                        case 1:
                            loanDetails = _state.sent();
                            return [
                                4,
                                Promise.all(loanDetails.map(function(loan) {
                                    return _async_to_generator(function() {
                                        var disbursalDate, disbursalAmount, customerName, repayDate, roi, mobile, address, loanAmtApproved, pfAndGst, tenure, totalAmount, debit, closingBalance, ipcCount, collectionDetails, _tmp;
                                        return _ts_generator(this, function(_state) {
                                            switch(_state.label){
                                                case 0:
                                                    disbursalDate = loan.disbursalDate;
                                                    disbursalAmount = loan.disbursalAmount;
                                                    customerName = loan.name || '';
                                                    repayDate = loan.repayDate;
                                                    roi = loan.roi;
                                                    mobile = loan.mobile;
                                                    address = loan.address;
                                                    loanAmtApproved = loan.loanAmtApproved;
                                                    pfAndGst = loan.adminFee + loan.GstOfAdminFee;
                                                    tenure = Math.round((new Date(repayDate).getTime() - new Date(disbursalDate).getTime()) / (1000 * 60 * 60 * 24));
                                                    totalAmount = parseFloat((tenure * roi * disbursalAmount / 100 + disbursalAmount).toFixed(2));
                                                    debit = disbursalAmount - loan.deduction;
                                                    closingBalance = debit;
                                                    return [
                                                        4,
                                                        db('leads').where('leadID', loan.leadID).where('ipc', 1).count('leadID as count').first()
                                                    ];
                                                case 1:
                                                    ipcCount = _state.sent();
                                                    if (!ipcCount.count) return [
                                                        3,
                                                        3
                                                    ];
                                                    return [
                                                        4,
                                                        db('collection').where('leadID', loan.leadID).whereIn('collectionStatus', [
                                                            'Approved',
                                                            'Approved-refunded'
                                                        ]).select()
                                                    ];
                                                case 2:
                                                    _tmp = _state.sent();
                                                    return [
                                                        3,
                                                        4
                                                    ];
                                                case 3:
                                                    _tmp = [];
                                                    _state.label = 4;
                                                case 4:
                                                    collectionDetails = _tmp;
                                                    return [
                                                        2,
                                                        {
                                                            customerName: customerName,
                                                            loanNo: loan.loanNo,
                                                            pancard: loan.pancard,
                                                            mobile: mobile,
                                                            address: address,
                                                            interestRateType: 'Reducing',
                                                            status: 'Disbursed',
                                                            adminFeePercentage: parseFloat((loan.adminFee / disbursalAmount * 100).toFixed(2)),
                                                            gstOnAdminFee: 18,
                                                            bounceCharge: 590,
                                                            disbursalAmount: disbursalAmount,
                                                            totalRepayAmount: totalAmount,
                                                            disbursalDate: new Date(disbursalDate).toLocaleDateString('en-IN', {
                                                                day: '2-digit',
                                                                month: 'short',
                                                                year: 'numeric'
                                                            }),
                                                            repayDate: new Date(repayDate).toLocaleDateString('en-IN', {
                                                                day: '2-digit',
                                                                month: 'short',
                                                                year: 'numeric'
                                                            }),
                                                            roi: roi,
                                                            tenure: tenure,
                                                            loanAmtApproved: loanAmtApproved,
                                                            pfAndGst: pfAndGst,
                                                            penaltyCharge: '0.1'
                                                        }
                                                    ];
                                            }
                                        });
                                    })();
                                }))
                            ];
                        case 2:
                            statements = _state.sent();
                            return [
                                2,
                                statements
                            ];
                    }
                });
            })();
        }), _define_property(_this, "processLeadData", function(data) {
            return _async_to_generator(function() {
                var db, leads, approval, loan, finalWaiveOffAmount, settlementWaiver, closedWaiver, dpd, totalCollectedSum, totalWaiveOff, totalCollectedPrincipal, totalCollectedInterest, totalCollectedPenality, totalExcessAmount, lastCollectionDate, tenure, repaymentData, totalAmountOverdue, otherCharges, collectionDetails, collectionDetailsFirst, collectionDetailsLast, otherData, transactionData, transactionDataEmi, totalSummary;
                return _ts_generator(this, function(_state) {
                    switch(_state.label){
                        case 0:
                            db = getKnexInstance();
                            leads = data.lead;
                            approval = data.approval;
                            loan = data.loan;
                            finalWaiveOffAmount = 0;
                            settlementWaiver = 0;
                            closedWaiver = 0;
                            dpd = 0;
                            return [
                                4,
                                db('collection').where('collectionStatus', 'Approved').whereNot('collectedMode', 'Waive Off').where('leadID', leads.leadID).sum('collectedAmount as sum').then(function(res) {
                                    var _res_;
                                    return ((_res_ = res[0]) === null || _res_ === void 0 ? void 0 : _res_.sum) || 0;
                                })
                            ];
                        case 1:
                            totalCollectedSum = _state.sent();
                            return [
                                4,
                                db('collection').where('collectionStatus', 'Approved').where('collectedMode', 'Waive Off').where('leadID', leads.leadID).sum('collectedAmount as sum').then(function(res) {
                                    var _res_;
                                    return ((_res_ = res[0]) === null || _res_ === void 0 ? void 0 : _res_.sum) || 0;
                                })
                            ];
                        case 2:
                            totalWaiveOff = _state.sent();
                            return [
                                4,
                                db('collection').where('collectionStatus', 'Approved').where('leadID', leads.leadID).sum('collected_principal as sum').then(function(res) {
                                    var _res_;
                                    return ((_res_ = res[0]) === null || _res_ === void 0 ? void 0 : _res_.sum) || 0;
                                })
                            ];
                        case 3:
                            totalCollectedPrincipal = _state.sent();
                            return [
                                4,
                                db('collection').where('collectionStatus', 'Approved').where('leadID', leads.leadID).sum('collected_interest as sum').then(function(res) {
                                    var _res_;
                                    return ((_res_ = res[0]) === null || _res_ === void 0 ? void 0 : _res_.sum) || 0;
                                })
                            ];
                        case 4:
                            totalCollectedInterest = _state.sent();
                            return [
                                4,
                                db('collection').where('collectionStatus', 'Approved').where('leadID', leads.leadID).sum('collected_penality as sum').then(function(res) {
                                    var _res_;
                                    return ((_res_ = res[0]) === null || _res_ === void 0 ? void 0 : _res_.sum) || 0;
                                })
                            ];
                        case 5:
                            totalCollectedPenality = _state.sent();
                            return [
                                4,
                                db('collection').where('collectionStatus', 'Approved').where('leadID', leads.leadID).sum('excess_amount as sum').then(function(res) {
                                    var _res_;
                                    return ((_res_ = res[0]) === null || _res_ === void 0 ? void 0 : _res_.sum) || 0;
                                })
                            ];
                        case 6:
                            totalExcessAmount = _state.sent();
                            return [
                                4,
                                db('collection').where('collectionStatus', 'Approved').whereIn('status', [
                                    'Closed',
                                    'Settlement'
                                ]).where('leadID', leads.leadID).orderBy('collectionID', 'desc').first()
                            ];
                        case 7:
                            lastCollectionDate = _state.sent();
                            if (!lastCollectionDate) return [
                                3,
                                9
                            ];
                            return [
                                4,
                                db('collection').where('collectionStatus', 'Approved').where('status', 'Settlement').where('leadID', leads.leadID).sum('discount_waiver_amount as sum').then(function(res) {
                                    var _res_;
                                    return ((_res_ = res[0]) === null || _res_ === void 0 ? void 0 : _res_.sum) || 0;
                                })
                            ];
                        case 8:
                            finalWaiveOffAmount = _state.sent();
                            if (lastCollectionDate.discount_waiver === 'waiver') {
                                settlementWaiver = finalWaiveOffAmount;
                            } else {
                                closedWaiver = finalWaiveOffAmount;
                            }
                            _state.label = 9;
                        case 9:
                            tenure = Math.floor((new Date(approval.repayDate).getTime() - new Date(loan.disbursalDate).getTime()) / (1000 * 60 * 60 * 24));
                            return [
                                4,
                                _this1.calculateTotalRepayPaydayAmountIPC(leads.leadID, leads.status)
                            ];
                        case 10:
                            repaymentData = _state.sent();
                            totalAmountOverdue = Number(repaymentData.totalRepayAmount);
                            otherCharges = repaymentData.charges;
                            if (leads.status != 'Disbursed' || leads.status != 'Part Payment') {
                                totalAmountOverdue = 0;
                                otherCharges = 0;
                            }
                            if (new Date().toISOString().split('T')[0] > approval.repayDate && leads.status !== 'Closed' && leads.status !== 'Settlement') {
                                dpd = Math.floor((new Date().getTime() - new Date(loan.disbursalDate).getTime()) / (1000 * 60 * 60 * 24));
                            } else if (new Date().toISOString().split('T')[0] > approval.repayDate && (leads.status === 'Closed' || leads.status === 'Settlement') && lastCollectionDate) {
                                dpd = Math.floor((new Date(lastCollectionDate.collectedDate).getTime() - new Date(loan.disbursalDate).getTime()) / (1000 * 60 * 60 * 24));
                            }
                            if (dpd > 0) {
                                dpd -= tenure;
                            }
                            return [
                                4,
                                db('collection').where('leadID', leads.leadID).where('collectionStatus', 'Approved').select()
                            ];
                        case 11:
                            collectionDetails = _state.sent();
                            return [
                                4,
                                db('collection').where('leadID', leads.leadID).where('collectionStatus', 'Approved').first()
                            ];
                        case 12:
                            collectionDetailsFirst = _state.sent();
                            return [
                                4,
                                db('collection').where('leadID', leads.leadID).where('collectionStatus', 'Approved').orderBy('collectionID', 'desc').first()
                            ];
                        case 13:
                            collectionDetailsLast = _state.sent();
                            otherData = '';
                            return [
                                4,
                                _this1.generateTransactionDetails(leads.leadID, collectionDetails, approval, +config.dpdPenalty, +config.dpdPenaltyGstPercentage)
                            ];
                        case 14:
                            transactionData = _state.sent();
                            transactionDataEmi = transactionData.transactionDetails;
                            totalSummary = transactionData.totalSummary;
                            return [
                                2,
                                {
                                    otherCharges: otherCharges,
                                    totalAmountOverdue: totalAmountOverdue,
                                    totalCollectedSum: totalCollectedSum,
                                    totalWaiveOff: totalWaiveOff,
                                    totalCollectedPrincipal: totalCollectedPrincipal,
                                    totalCollectedInterest: totalCollectedInterest,
                                    totalCollectedPenality: totalCollectedPenality,
                                    totalExcessAmount: totalExcessAmount,
                                    finalWaiveOffAmount: finalWaiveOffAmount,
                                    settlementWaiver: settlementWaiver,
                                    closedWaiver: closedWaiver,
                                    dpd: dpd,
                                    collectionDetails: collectionDetails,
                                    collectionDetailsFirst: collectionDetailsFirst,
                                    collectionDetailsLast: collectionDetailsLast,
                                    otherData: otherData,
                                    transactionDataEmi: transactionDataEmi,
                                    totalSummary: totalSummary
                                }
                            ];
                    }
                });
            })();
        }), _define_property(_this, "calculateTotalRepayPaydayAmountIPC", function(leadID, status) {
            return _async_to_generator(function() {
                var db, today, loan, approval, principalAmount, disbursalDate, repayDate, dpdDiff, sanctionDiff, totalInterest, dpdPenalty, dpdPenaltyGst, penaltyAmount, charges, totalRepayAmount, collection, principal_amount, closing_balance, collectedDate, penality_charge, total_interest, penaltyBalance, penaltyAmountAdjustment;
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
                            repayDate = typeof approval.repayDate === 'string' ? parseISO(approval.repayDate) : approval.repayDate;
                            dpdDiff = differenceInCalendarDays(today, repayDate);
                            sanctionDiff = differenceInCalendarDays(repayDate, disbursalDate);
                            totalInterest = principalAmount * (dpdDiff + sanctionDiff) * approval.roi / 100;
                            dpdPenalty = Number(config.dpdPenalty);
                            dpdPenaltyGst = Number(config.dpdPenaltyGstPercentage);
                            penaltyAmount = dpdPenalty * (1 + dpdPenaltyGst / 100);
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
                            return [
                                2,
                                {
                                    totalRepayAmount: totalRepayAmount,
                                    charges: charges
                                }
                            ];
                    }
                });
            })();
        }), _define_property(_this, "getfailedDetails", function(fileID) {
            return _async_to_generator(function() {
                var db, loanDetails, data;
                return _ts_generator(this, function(_state) {
                    switch(_state.label){
                        case 0:
                            db = getKnexInstance();
                            return [
                                4,
                                db('not_required_leads').where('fileid', fileID).where('status', 'failed').orderBy('id', 'desc').select('mobile', 'status')
                            ];
                        case 1:
                            loanDetails = _state.sent();
                            data = loanDetails.map(function(row) {
                                return {
                                    mobile: row.mobile,
                                    status: row.status
                                };
                            });
                            return [
                                2,
                                data
                            ];
                    }
                });
            })();
        }), _define_property(_this, "addReferenceDetails", function(payload, userID) {
            return _async_to_generator(function() {
                var mobileNo, name, relation, leadID, lead, customer, customerID, mobile_no, checkReference, existingReference, insertData;
                return _ts_generator(this, function(_state) {
                    switch(_state.label){
                        case 0:
                            mobileNo = payload.mobileNo, name = payload.name, relation = payload.relation, leadID = payload.leadID;
                            return [
                                4,
                                _this1.leadModel.findOneLead({
                                    leadID: leadID
                                }, [
                                    'customerID'
                                ])
                            ];
                        case 1:
                            lead = _state.sent();
                            if (!lead) {
                                throw new BadRequestError('lead not found');
                            }
                            return [
                                4,
                                _this1.customerModel.findOneCustomer({
                                    customerID: lead.customerID
                                }, [
                                    'mobile'
                                ])
                            ];
                        case 2:
                            customer = _state.sent();
                            customerID = lead.customerID;
                            mobile_no = customer.mobile;
                            if (mobileNo == mobile_no) {
                                throw new BadRequestError("Reference's mobile number cannot be same as your mobile number");
                            }
                            return [
                                4,
                                _this1.referenceModel.find({
                                    where: {
                                        customerID: customerID
                                    },
                                    select: [
                                        'referenceID',
                                        'contactNo',
                                        'relation'
                                    ]
                                })
                            ];
                        case 3:
                            checkReference = _state.sent();
                            existingReference = checkReference.find(function(reference) {
                                if (reference.contactNo === mobileNo) {
                                    return reference;
                                }
                            });
                            if (existingReference) throw new BadRequestError("You have already entered the same mobile number for reference ".concat(existingReference.relation, ", please share mobile number for reference ").concat(relation));
                            insertData = [];
                            // if (existingReference) {
                            //   insertData.push({
                            //     customerID,
                            //     relation: relation,
                            //     name: name,
                            //     contactNo: mobileNo,
                            //     createdBy: userID,
                            //     address: "N/A",
                            //     state: "N/A",
                            //     city:"N/A",
                            //     pincode: 0,
                            //   })
                            // }
                            if (!existingReference) {
                                insertData.push({
                                    customerID: customerID,
                                    relation: relation,
                                    name: name,
                                    contactNo: mobileNo,
                                    createdBy: userID,
                                    address: 'N/A',
                                    state: 'N/A',
                                    city: 'N/A',
                                    pincode: 0
                                });
                            }
                            return [
                                4,
                                _this1.referenceModel.bulkInsert(insertData)
                            ];
                        case 4:
                            _state.sent();
                            // await this.stepTrackermodel.completeStep(
                            //   customerID,
                            //   StepName.REFERENCE_DETAILS,
                            //   Products.PAYDAY,
                            //   leadID,
                            // )
                            return [
                                2,
                                _this1.serviceResponse(HttpStatusCode.Created, {}, 'Your Reference details have been saved')
                            ];
                    }
                });
            })();
        }), _define_property(_this, "insertLeadToCallHistory", function(customerID, leadID, leadStatus, userID) {
            var remark = arguments.length > 4 && arguments[4] !== void 0 ? arguments[4] : '', noteli = arguments.length > 5 && arguments[5] !== void 0 ? arguments[5] : '', appAmount = arguments.length > 6 && arguments[6] !== void 0 ? arguments[6] : '0', callType = arguments.length > 7 && arguments[7] !== void 0 ? arguments[7] : CallType.IVR;
            return _async_to_generator(function() {
                var callHistoryInsert;
                return _ts_generator(this, function(_state) {
                    switch(_state.label){
                        case 0:
                            callHistoryInsert = {
                                customerID: customerID,
                                leadID: leadID,
                                callType: callType,
                                status: leadStatus,
                                remark: remark !== null && remark !== void 0 ? remark : '',
                                noteli: noteli !== null && noteli !== void 0 ? noteli : '',
                                callbackTime: moment().format('YYYY-MM-DD'),
                                calledBy: userID
                            };
                            return [
                                4,
                                Promise.all([
                                    _this1.callHistoryModel.create(callHistoryInsert),
                                    _this1.callHistoryLogsModel.insert(_object_spread({
                                        appAmount: appAmount
                                    }, callHistoryInsert))
                                ])
                            ];
                        case 1:
                            _state.sent();
                            return [
                                2
                            ];
                    }
                });
            })();
        }), _define_property(_this, "changeLeadStatus", function(payload, leadID, userID, clientIp, permissions, role) {
            return _async_to_generator(function() {
                var status, holdDate, holdTime, repaymentDate, noteli, remark, reason, loanAmtApproved, roi, adminFee, plateFormFee, officialEmail, m1, m2, m3, m1_date, m2_date, m3_date, m_avg, p1, p2, p3, employmentType, accountID, accountType, accountNo, newAccountType, bankName, bankIfsc, loanType, alternateMobile, tenure, isAllowed, lead, customerID, leadStatus, productID, currentDate, customer, isAmountValid, permissionSet, flResp, holdResp, blackListResp, apResp, apResp1, holdResp1, blackListResp1, holdResp2, apResp2, blackListResp2, holdResp3, blackListResp3, apResp3, holdResp4, blackListResp4, aprResp, aprResp1, holdResp5, blackListResp5, holdResp6, blackListResp6, holdResp7, aprResp2, blackListResp7, holdResp8, blackListResp8, aprResp3, aprResp4, blackListResp9, lastLeadStatus, lastStatusRecord, whiteListResp;
                return _ts_generator(this, function(_state) {
                    switch(_state.label){
                        case 0:
                            status = payload.status;
                            holdDate = payload.holdDate, holdTime = payload.holdTime, repaymentDate = payload.repaymentDate, noteli = payload.noteli, remark = payload.remark, reason = payload.reason, loanAmtApproved = payload.loanAmtApproved, roi = payload.roi, adminFee = payload.adminFee, plateFormFee = payload.plateFormFee, officialEmail = payload.officialEmail, m1 = payload.m1, m2 = payload.m2, m3 = payload.m3, m1_date = payload.m1_date, m2_date = payload.m2_date, m3_date = payload.m3_date, m_avg = payload.m_avg, p1 = payload.p1, p2 = payload.p2, p3 = payload.p3, employmentType = payload.employmentType, accountID = payload.accountID, accountType = payload.accountType, accountNo = payload.accountNo, newAccountType = payload.newAccountType, bankName = payload.bankName, bankIfsc = payload.bankIfsc, loanType = payload.loanType, alternateMobile = payload.alternateMobile, tenure = payload.tenure;
                            isAllowed = true;
                            if (!roleAuthorizer(role, [
                                Roles.ADMIN,
                                Roles.SUPER_ADMIN
                            ])) {
                                isAllowed = false;
                            }
                            return [
                                4,
                                _this1.leadModel.findOneLead({
                                    leadID: leadID
                                }, [
                                    'customerID',
                                    'status',
                                    'productID'
                                ])
                            ];
                        case 1:
                            lead = _state.sent();
                            if (!lead) throw new NotFoundError('This lead does not exist');
                            customerID = lead.customerID, leadStatus = lead.status, productID = lead.productID;
                            if (leadStatus === status) {
                                throw new BadRequestError('Lead status is already in ' + status);
                            }
                            currentDate = moment().startOf('day');
                            // if (loanType !== 'emi' && repaymentDate) {
                            //   tenure = moment(repaymentDate).startOf('day').diff(currentDate, 'days')
                            // }
                            if ((status === LeadStatus.APPROVED_PROCESS || status === LeadStatus.APPROVED) && loanType === 'payday') {
                                repaymentDate = repaymentDate ? moment(repaymentDate).format('YYYY-MM-DD') : moment().format('YYYY-MM-DD');
                                tenure = moment(repaymentDate).startOf('day').diff(currentDate, 'days');
                            }
                            noteli = noteli !== null && noteli !== void 0 ? noteli : '';
                            remark = remark !== null && remark !== void 0 ? remark : '';
                            reason = reason !== null && reason !== void 0 ? reason : '';
                            loanAmtApproved = loanAmtApproved ? +loanAmtApproved : 0;
                            roi = roi ? +roi : 1;
                            adminFee = adminFee !== null && adminFee !== void 0 ? adminFee : 0;
                            plateFormFee = plateFormFee !== null && plateFormFee !== void 0 ? plateFormFee : 0;
                            m1 = m1 !== null && m1 !== void 0 ? m1 : '';
                            m2 = m2 !== null && m2 !== void 0 ? m2 : '';
                            m3 = m3 !== null && m3 !== void 0 ? m3 : '';
                            m1_date = m1_date !== null && m1_date !== void 0 ? m1_date : moment().format('YYYY-MM-DD');
                            m2_date = m2_date !== null && m2_date !== void 0 ? m2_date : moment().format('YYYY-MM-DD');
                            m3_date = m3_date !== null && m3_date !== void 0 ? m3_date : moment().format('YYYY-MM-DD');
                            m_avg = m_avg !== null && m_avg !== void 0 ? m_avg : '0';
                            p1 = p1 !== null && p1 !== void 0 ? p1 : '0';
                            p2 = p2 !== null && p2 !== void 0 ? p2 : '0';
                            p3 = p3 !== null && p3 !== void 0 ? p3 : '0';
                            employmentType = employmentType !== null && employmentType !== void 0 ? employmentType : '';
                            return [
                                4,
                                _this1.customerModel.findOneCustomer({
                                    customerID: customerID
                                }, [
                                    'email',
                                    'mobile',
                                    'pancard'
                                ])
                            ];
                        case 2:
                            customer = _state.sent();
                            officialEmail = officialEmail !== null && officialEmail !== void 0 ? officialEmail : customer.email;
                            alternateMobile = alternateMobile !== null && alternateMobile !== void 0 ? alternateMobile : customer.mobile.str;
                            if (!customer) throw new NotFoundError('Customer not found');
                            if (!(loanAmtApproved && loanType === 'payday' && !permissions.includes(masterPermission.Settings.MaxLoanAmountBypass))) return [
                                3,
                                4
                            ];
                            return [
                                4,
                                _this1.loanService.isReloanAmountValid(loanAmtApproved, customerID)
                            ];
                        case 3:
                            isAmountValid = _state.sent();
                            if (!isAmountValid.status) throw new BadRequestError("Approval amount cannot be more than ".concat(isAmountValid.amount));
                            return [
                                3,
                                5
                            ];
                        case 4:
                            if (loanAmtApproved && loanType === 'emi' && !permissions.includes(masterPermission.Settings.MaxLoanAmountBypass)) {
                                if (loanAmtApproved >= +config.emiMaxAmount) {
                                    throw new BadRequestError("Emi amount cannot be more than ".concat(+config.emiMaxAmount));
                                }
                            }
                            _state.label = 5;
                        case 5:
                            //check if user has access to this permission
                            permissionSet = new Set(permissions);
                            switch(leadStatus){
                                case LeadStatus.FRESH_LEAD:
                                    return [
                                        3,
                                        6
                                    ];
                                case LeadStatus.DOCUMENT_RECEIVED:
                                    return [
                                        3,
                                        8
                                    ];
                                case LeadStatus.HOLD_PROCESS:
                                    return [
                                        3,
                                        15
                                    ];
                                case LeadStatus.NOT_REQUIRED_PROCESS:
                                    return [
                                        3,
                                        22
                                    ];
                                case LeadStatus.REJECTED_PROCESS:
                                    return [
                                        3,
                                        29
                                    ];
                                case LeadStatus.APPROVED_PROCESS:
                                    return [
                                        3,
                                        36
                                    ];
                                case LeadStatus.HOLD:
                                    return [
                                        3,
                                        43
                                    ];
                                case LeadStatus.APPROVED:
                                    return [
                                        3,
                                        50
                                    ];
                                case LeadStatus.NOT_REQUIRED:
                                    return [
                                        3,
                                        55
                                    ];
                                case LeadStatus.REJECTED:
                                    return [
                                        3,
                                        62
                                    ];
                                case LeadStatus.DISBURSAL_SHEET_SEND:
                                    return [
                                        3,
                                        69
                                    ];
                                case LeadStatus.BLACK_LISTED:
                                    return [
                                        3,
                                        75
                                    ];
                            }
                            return [
                                3,
                                80
                            ];
                        case 6:
                            if (status !== LeadStatus.BLACK_LISTED && !isAllowed && !permissionAuthorizer([
                                masterPermission.FormAction.Transaction
                            ], permissionSet)) {
                                throw new AccessForbiddenError('You are not allowed to access this resource');
                            } else if (!isAllowed && !permissionAuthorizer([
                                masterPermission.Lead.Blacklisted
                            ], permissionSet)) {
                                throw new AccessForbiddenError('You are not allowed to access this resource');
                            }
                            return [
                                4,
                                _this1.changeLeadStatusFromFreshToVarious({
                                    customerID: customerID,
                                    leadID: leadID,
                                    noteli: noteli,
                                    reason: reason,
                                    remark: remark,
                                    status: status,
                                    userID: userID,
                                    email: customer.email,
                                    lastLeadStatus: leadStatus,
                                    mobile: customer.mobile,
                                    pancard: customer.pancard,
                                    leadStatus: leadStatus
                                })
                            ];
                        case 7:
                            flResp = _state.sent();
                            return [
                                2,
                                _this1.serviceResponse(flResp.statusCode, flResp.data, flResp.message)
                            ];
                        case 8:
                            if (!(status === LeadStatus.HOLD_PROCESS || status === LeadStatus.REJECTED_PROCESS || status === LeadStatus.NOT_REQUIRED_PROCESS)) return [
                                3,
                                10
                            ];
                            if (!isAllowed && !permissionAuthorizer([
                                masterPermission.LeadProfileDetails.CreditAdd,
                                masterPermission.LeadProfileDetails.CreditChangeStatus
                            ], permissionSet)) {
                                throw new AccessForbiddenError('You are not allowed to access this resource');
                            }
                            return [
                                4,
                                _this1.changeLeadStatusToRejectHoldStatuses({
                                    adminFee: adminFee,
                                    customerID: customerID,
                                    employmentType: employmentType,
                                    holdDate: holdDate,
                                    holdTime: holdTime,
                                    leadID: leadID,
                                    noteli: noteli,
                                    reason: reason,
                                    remark: remark,
                                    status: status,
                                    userID: userID,
                                    leadStatus: leadStatus
                                })
                            ];
                        case 9:
                            holdResp = _state.sent();
                            return [
                                2,
                                _this1.serviceResponse(holdResp.statusCode, holdResp.data, holdResp.message)
                            ];
                        case 10:
                            if (!(status === LeadStatus.BLACK_LISTED)) return [
                                3,
                                12
                            ];
                            if (!isAllowed && !permissionAuthorizer([
                                masterPermission.Lead.Blacklisted
                            ], permissionSet)) {
                                throw new AccessForbiddenError('You are not allowed to access this resource');
                            }
                            return [
                                4,
                                _this1.changeLeadStatusToBlackList({
                                    customerID: customerID,
                                    pancard: customer.pancard,
                                    lastLeadStatus: leadStatus,
                                    leadID: leadID,
                                    mobile: customer.mobile,
                                    noteli: noteli,
                                    reason: reason,
                                    remark: remark,
                                    status: status,
                                    userID: userID,
                                    leadStatus: leadStatus
                                })
                            ];
                        case 11:
                            blackListResp = _state.sent();
                            return [
                                2,
                                _this1.serviceResponse(blackListResp.statusCode, blackListResp.data, blackListResp.message)
                            ];
                        case 12:
                            if (!(status === LeadStatus.APPROVED_PROCESS)) return [
                                3,
                                14
                            ];
                            return [
                                4,
                                _this1.changeLeadStatusToApprovedProcess({
                                    adminFee: adminFee,
                                    alternateMobile: alternateMobile,
                                    customerID: customerID,
                                    employmentType: employmentType,
                                    leadID: leadID,
                                    loanAmtApproved: loanAmtApproved,
                                    m1: m1,
                                    m1_date: m1_date,
                                    m2: m2,
                                    m2_date: m2_date,
                                    m3: m3,
                                    m3_date: m3_date,
                                    m_avg: m_avg,
                                    noteli: noteli,
                                    officialEmail: officialEmail,
                                    p1: p1,
                                    p2: p2,
                                    p3: p3,
                                    plateFormFee: plateFormFee,
                                    reason: reason,
                                    remark: remark,
                                    repaymentDate: repaymentDate,
                                    roi: roi,
                                    status: status,
                                    tenure: tenure,
                                    userID: userID,
                                    leadStatus: leadStatus,
                                    loanType: loanType
                                })
                            ];
                        case 13:
                            apResp = _state.sent();
                            return [
                                2,
                                _this1.serviceResponse(apResp.statusCode, apResp.data, apResp.message)
                            ];
                        case 14:
                            throw new BadRequestError("Customer cannot be moved from ".concat(leadStatus, " to ").concat(status));
                        case 15:
                            if (status !== LeadStatus.BLACK_LISTED && !isAllowed && !permissionAuthorizer([
                                masterPermission.LeadProfileDetails.CreditAdd,
                                masterPermission.LeadProfileDetails.CreditChangeStatus
                            ], permissionSet)) {
                                throw new AccessForbiddenError('You are not allowed to access this resource');
                            } else if (!isAllowed && !permissionAuthorizer([
                                masterPermission.Lead.Blacklisted
                            ], permissionSet)) {
                                throw new AccessForbiddenError('You are not allowed to access this resource');
                            }
                            if (!(status === LeadStatus.APPROVED_PROCESS)) return [
                                3,
                                17
                            ];
                            return [
                                4,
                                _this1.changeLeadStatusToApprovedProcess({
                                    adminFee: adminFee,
                                    alternateMobile: alternateMobile,
                                    customerID: customerID,
                                    employmentType: employmentType,
                                    leadID: leadID,
                                    loanAmtApproved: loanAmtApproved,
                                    m1: m1,
                                    m1_date: m1_date,
                                    m2: m2,
                                    m2_date: m2_date,
                                    m3: m3,
                                    m3_date: m3_date,
                                    m_avg: m_avg,
                                    noteli: noteli,
                                    officialEmail: officialEmail,
                                    p1: p1,
                                    p2: p2,
                                    p3: p3,
                                    plateFormFee: plateFormFee,
                                    reason: reason,
                                    remark: remark,
                                    repaymentDate: repaymentDate,
                                    roi: roi,
                                    status: status,
                                    tenure: tenure,
                                    userID: userID,
                                    leadStatus: leadStatus,
                                    loanType: loanType
                                })
                            ];
                        case 16:
                            apResp1 = _state.sent();
                            return [
                                2,
                                _this1.serviceResponse(apResp1.statusCode, apResp1.data, apResp1.message)
                            ];
                        case 17:
                            if (!(status === LeadStatus.REJECTED_PROCESS || status === LeadStatus.NOT_REQUIRED_PROCESS)) return [
                                3,
                                19
                            ];
                            return [
                                4,
                                _this1.changeLeadStatusToRejectHoldStatuses({
                                    adminFee: adminFee,
                                    customerID: customerID,
                                    employmentType: employmentType,
                                    holdDate: holdDate,
                                    holdTime: holdTime,
                                    leadID: leadID,
                                    noteli: noteli,
                                    reason: reason,
                                    remark: remark,
                                    status: status,
                                    userID: userID,
                                    leadStatus: leadStatus
                                })
                            ];
                        case 18:
                            holdResp1 = _state.sent();
                            return [
                                2,
                                _this1.serviceResponse(holdResp1.statusCode, holdResp1.data, holdResp1.message)
                            ];
                        case 19:
                            if (!(status === LeadStatus.BLACK_LISTED)) return [
                                3,
                                21
                            ];
                            return [
                                4,
                                _this1.changeLeadStatusToBlackList({
                                    customerID: customerID,
                                    pancard: customer.pancard,
                                    lastLeadStatus: leadStatus,
                                    leadID: leadID,
                                    mobile: customer.mobile,
                                    noteli: noteli,
                                    reason: reason,
                                    remark: remark,
                                    status: status,
                                    userID: userID,
                                    leadStatus: leadStatus
                                })
                            ];
                        case 20:
                            blackListResp1 = _state.sent();
                            return [
                                2,
                                _this1.serviceResponse(blackListResp1.statusCode, blackListResp1.data, blackListResp1.message)
                            ];
                        case 21:
                            throw new BadRequestError("Customer cannot be moved from ".concat(leadStatus, " to ").concat(status));
                        case 22:
                            if (status !== LeadStatus.BLACK_LISTED && !isAllowed && !permissionAuthorizer([
                                masterPermission.LeadProfileDetails.CreditAdd,
                                masterPermission.LeadProfileDetails.CreditChangeStatus
                            ], permissionSet)) {
                                throw new AccessForbiddenError('You are not allowed to access this resource');
                            } else if (!isAllowed && !permissionAuthorizer([
                                masterPermission.Lead.Blacklisted
                            ], permissionSet)) {
                                throw new AccessForbiddenError('You are not allowed to access this resource');
                            }
                            if (!(status === LeadStatus.HOLD_PROCESS || status === LeadStatus.REJECTED_PROCESS)) return [
                                3,
                                24
                            ];
                            return [
                                4,
                                _this1.changeLeadStatusToRejectHoldStatuses({
                                    adminFee: adminFee,
                                    customerID: customerID,
                                    employmentType: employmentType,
                                    holdDate: holdDate,
                                    holdTime: holdTime,
                                    leadID: leadID,
                                    noteli: noteli,
                                    reason: reason,
                                    remark: remark,
                                    status: status,
                                    userID: userID,
                                    leadStatus: leadStatus
                                })
                            ];
                        case 23:
                            holdResp2 = _state.sent();
                            return [
                                2,
                                _this1.serviceResponse(holdResp2.statusCode, holdResp2.data, holdResp2.message)
                            ];
                        case 24:
                            if (!(status === LeadStatus.APPROVED_PROCESS)) return [
                                3,
                                26
                            ];
                            return [
                                4,
                                _this1.changeLeadStatusToApprovedProcess({
                                    adminFee: adminFee,
                                    alternateMobile: alternateMobile,
                                    customerID: customerID,
                                    employmentType: employmentType,
                                    leadID: leadID,
                                    loanAmtApproved: loanAmtApproved,
                                    m1: m1,
                                    m1_date: m1_date,
                                    m2: m2,
                                    m2_date: m2_date,
                                    m3: m3,
                                    m3_date: m3_date,
                                    m_avg: m_avg,
                                    noteli: noteli,
                                    officialEmail: officialEmail,
                                    p1: p1,
                                    p2: p2,
                                    p3: p3,
                                    plateFormFee: plateFormFee,
                                    reason: reason,
                                    remark: remark,
                                    repaymentDate: repaymentDate,
                                    roi: roi,
                                    status: status,
                                    tenure: tenure,
                                    userID: userID,
                                    leadStatus: leadStatus,
                                    loanType: loanType
                                })
                            ];
                        case 25:
                            apResp2 = _state.sent();
                            return [
                                2,
                                _this1.serviceResponse(apResp2.statusCode, apResp2.data, apResp2.message)
                            ];
                        case 26:
                            if (!(status === LeadStatus.BLACK_LISTED)) return [
                                3,
                                28
                            ];
                            return [
                                4,
                                _this1.changeLeadStatusToBlackList({
                                    customerID: customerID,
                                    pancard: customer.pancard,
                                    lastLeadStatus: leadStatus,
                                    leadID: leadID,
                                    mobile: customer.mobile,
                                    noteli: noteli,
                                    reason: reason,
                                    remark: remark,
                                    status: status,
                                    userID: userID,
                                    leadStatus: leadStatus
                                })
                            ];
                        case 27:
                            blackListResp2 = _state.sent();
                            return [
                                2,
                                _this1.serviceResponse(blackListResp2.statusCode, blackListResp2.data, blackListResp2.message)
                            ];
                        case 28:
                            throw new BadRequestError("Customer cannot be moved from ".concat(leadStatus, " to ").concat(status));
                        case 29:
                            if (status !== LeadStatus.BLACK_LISTED && !isAllowed && !permissionAuthorizer([
                                masterPermission.LeadProfileDetails.CreditAdd,
                                masterPermission.LeadProfileDetails.CreditChangeStatus
                            ], permissionSet)) {
                                throw new AccessForbiddenError('You are not allowed to access this resource');
                            } else if (!isAllowed && !permissionAuthorizer([
                                masterPermission.Lead.Blacklisted
                            ], permissionSet)) {
                                throw new AccessForbiddenError('You are not allowed to access this resource');
                            }
                            if (!(status === LeadStatus.HOLD_PROCESS || status === LeadStatus.NOT_REQUIRED_PROCESS)) return [
                                3,
                                31
                            ];
                            return [
                                4,
                                _this1.changeLeadStatusToRejectHoldStatuses({
                                    adminFee: adminFee,
                                    customerID: customerID,
                                    employmentType: employmentType,
                                    holdDate: holdDate,
                                    holdTime: holdTime,
                                    leadID: leadID,
                                    noteli: noteli,
                                    reason: reason,
                                    remark: remark,
                                    status: status,
                                    userID: userID,
                                    leadStatus: leadStatus
                                })
                            ];
                        case 30:
                            holdResp3 = _state.sent();
                            return [
                                2,
                                _this1.serviceResponse(holdResp3.statusCode, holdResp3.data, holdResp3.message)
                            ];
                        case 31:
                            if (!(status === LeadStatus.BLACK_LISTED)) return [
                                3,
                                33
                            ];
                            return [
                                4,
                                _this1.changeLeadStatusToBlackList({
                                    customerID: customerID,
                                    pancard: customer.pancard,
                                    lastLeadStatus: leadStatus,
                                    leadID: leadID,
                                    mobile: customer.mobile,
                                    noteli: noteli,
                                    reason: reason,
                                    remark: remark,
                                    status: status,
                                    userID: userID,
                                    leadStatus: leadStatus
                                })
                            ];
                        case 32:
                            blackListResp3 = _state.sent();
                            return [
                                2,
                                _this1.serviceResponse(blackListResp3.statusCode, blackListResp3.data, blackListResp3.message)
                            ];
                        case 33:
                            if (!(status === LeadStatus.APPROVED_PROCESS)) return [
                                3,
                                35
                            ];
                            return [
                                4,
                                _this1.changeLeadStatusToApprovedProcess({
                                    adminFee: adminFee,
                                    alternateMobile: alternateMobile,
                                    customerID: customerID,
                                    employmentType: employmentType,
                                    leadID: leadID,
                                    loanAmtApproved: loanAmtApproved,
                                    m1: m1,
                                    m1_date: m1_date,
                                    m2: m2,
                                    m2_date: m2_date,
                                    m3: m3,
                                    m3_date: m3_date,
                                    m_avg: m_avg,
                                    noteli: noteli,
                                    officialEmail: officialEmail,
                                    p1: p1,
                                    p2: p2,
                                    p3: p3,
                                    plateFormFee: plateFormFee,
                                    reason: reason,
                                    remark: remark,
                                    repaymentDate: repaymentDate,
                                    roi: roi,
                                    status: status,
                                    tenure: tenure,
                                    userID: userID,
                                    leadStatus: leadStatus,
                                    loanType: loanType
                                })
                            ];
                        case 34:
                            apResp3 = _state.sent();
                            return [
                                2,
                                _this1.serviceResponse(apResp3.statusCode, apResp3.data, apResp3.message)
                            ];
                        case 35:
                            throw new BadRequestError("Customer cannot be moved from ".concat(leadStatus, " to ").concat(status));
                        case 36:
                            if (status !== LeadStatus.BLACK_LISTED && !isAllowed && !permissionAuthorizer([
                                masterPermission.LeadProfileDetails.CreditAdd,
                                masterPermission.LeadProfileDetails.CreditChangeStatus
                            ], permissionSet)) {
                                throw new AccessForbiddenError('You are not allowed to access this resource');
                            } else if (!isAllowed && !permissionAuthorizer([
                                masterPermission.Lead.Blacklisted
                            ], permissionSet)) {
                                throw new AccessForbiddenError('You are not allowed to access this resource');
                            }
                            if (!(status === LeadStatus.HOLD_PROCESS || status === LeadStatus.REJECTED_PROCESS || status === LeadStatus.REJECTED || status === LeadStatus.NOT_REQUIRED_PROCESS || status === LeadStatus.NOT_REQUIRED || status === LeadStatus.HOLD)) return [
                                3,
                                38
                            ];
                            return [
                                4,
                                _this1.changeLeadStatusToRejectHoldStatuses({
                                    adminFee: adminFee,
                                    customerID: customerID,
                                    employmentType: employmentType,
                                    holdDate: holdDate,
                                    holdTime: holdTime,
                                    leadID: leadID,
                                    noteli: noteli,
                                    reason: reason,
                                    remark: remark,
                                    status: status,
                                    userID: userID,
                                    leadStatus: leadStatus
                                })
                            ];
                        case 37:
                            holdResp4 = _state.sent();
                            return [
                                2,
                                _this1.serviceResponse(holdResp4.statusCode, holdResp4.data, holdResp4.message)
                            ];
                        case 38:
                            if (!(status === LeadStatus.BLACK_LISTED)) return [
                                3,
                                40
                            ];
                            return [
                                4,
                                _this1.changeLeadStatusToBlackList({
                                    customerID: customerID,
                                    pancard: customer.pancard,
                                    lastLeadStatus: leadStatus,
                                    leadID: leadID,
                                    mobile: customer.mobile,
                                    noteli: noteli,
                                    reason: reason,
                                    remark: remark,
                                    status: status,
                                    userID: userID,
                                    leadStatus: leadStatus
                                })
                            ];
                        case 39:
                            blackListResp4 = _state.sent();
                            return [
                                2,
                                _this1.serviceResponse(blackListResp4.statusCode, blackListResp4.data, blackListResp4.message)
                            ];
                        case 40:
                            if (!(status === LeadStatus.APPROVED)) return [
                                3,
                                42
                            ];
                            return [
                                4,
                                _this1.changeLeadStatusToApproved({
                                    adminFee: adminFee,
                                    alternateMobile: alternateMobile,
                                    customerID: customerID,
                                    employmentType: employmentType,
                                    leadID: leadID,
                                    loanAmtApproved: loanAmtApproved,
                                    m1: m1,
                                    m1_date: m1_date,
                                    m2: m2,
                                    m2_date: m2_date,
                                    m3: m3,
                                    m3_date: m3_date,
                                    m_avg: m_avg,
                                    noteli: noteli,
                                    officialEmail: officialEmail,
                                    p1: p1,
                                    p2: p2,
                                    p3: p3,
                                    plateFormFee: plateFormFee,
                                    reason: reason,
                                    remark: remark,
                                    repaymentDate: repaymentDate,
                                    roi: roi,
                                    status: status,
                                    tenure: tenure,
                                    userID: userID,
                                    leadStatus: leadStatus,
                                    accountID: accountID,
                                    accountNo: accountNo,
                                    accountType: accountType,
                                    bankIfsc: bankIfsc,
                                    bankName: bankName,
                                    clientIp: clientIp,
                                    newAccountType: newAccountType,
                                    productID: productID
                                })
                            ];
                        case 41:
                            aprResp = _state.sent();
                            return [
                                2,
                                _this1.serviceResponse(aprResp.statusCode, aprResp.data, aprResp.message)
                            ];
                        case 42:
                            throw new BadRequestError("Customer cannot be moved from ".concat(leadStatus, " to ").concat(status));
                        case 43:
                            if (status !== LeadStatus.BLACK_LISTED && !isAllowed && !permissionAuthorizer([
                                masterPermission.LeadProfileDetails.CreditAdd,
                                masterPermission.LeadProfileDetails.CreditChangeStatus
                            ], permissionSet)) {
                                throw new AccessForbiddenError('You are not allowed to access this resource');
                            } else if (!isAllowed && !permissionAuthorizer([
                                masterPermission.Lead.Blacklisted
                            ], permissionSet)) {
                                throw new AccessForbiddenError('You are not allowed to access this resource');
                            }
                            if (!(status === LeadStatus.APPROVED)) return [
                                3,
                                45
                            ];
                            return [
                                4,
                                _this1.changeLeadStatusToApproved({
                                    adminFee: adminFee,
                                    alternateMobile: alternateMobile,
                                    customerID: customerID,
                                    employmentType: employmentType,
                                    leadID: leadID,
                                    loanAmtApproved: loanAmtApproved,
                                    m1: m1,
                                    m1_date: m1_date,
                                    m2: m2,
                                    m2_date: m2_date,
                                    m3: m3,
                                    m3_date: m3_date,
                                    m_avg: m_avg,
                                    noteli: noteli,
                                    officialEmail: officialEmail,
                                    p1: p1,
                                    p2: p2,
                                    p3: p3,
                                    plateFormFee: plateFormFee,
                                    reason: reason,
                                    remark: remark,
                                    repaymentDate: repaymentDate,
                                    roi: roi,
                                    status: status,
                                    tenure: tenure,
                                    userID: userID,
                                    leadStatus: leadStatus,
                                    accountID: accountID,
                                    accountNo: accountNo,
                                    accountType: accountType,
                                    bankIfsc: bankIfsc,
                                    bankName: bankName,
                                    clientIp: clientIp,
                                    newAccountType: newAccountType,
                                    productID: productID
                                })
                            ];
                        case 44:
                            aprResp1 = _state.sent();
                            return [
                                2,
                                _this1.serviceResponse(aprResp1.statusCode, aprResp1.data, aprResp1.message)
                            ];
                        case 45:
                            if (!(status === LeadStatus.NOT_REQUIRED || status === LeadStatus.REJECTED)) return [
                                3,
                                47
                            ];
                            return [
                                4,
                                _this1.changeLeadStatusToRejectHoldStatuses({
                                    adminFee: adminFee,
                                    customerID: customerID,
                                    employmentType: employmentType,
                                    holdDate: holdDate,
                                    holdTime: holdTime,
                                    leadID: leadID,
                                    noteli: noteli,
                                    reason: reason,
                                    remark: remark,
                                    status: status,
                                    userID: userID,
                                    leadStatus: leadStatus
                                })
                            ];
                        case 46:
                            holdResp5 = _state.sent();
                            return [
                                2,
                                _this1.serviceResponse(holdResp5.statusCode, holdResp5.data, holdResp5.message)
                            ];
                        case 47:
                            if (!(status === LeadStatus.BLACK_LISTED)) return [
                                3,
                                49
                            ];
                            return [
                                4,
                                _this1.changeLeadStatusToBlackList({
                                    customerID: customerID,
                                    pancard: customer.pancard,
                                    lastLeadStatus: leadStatus,
                                    leadID: leadID,
                                    mobile: customer.mobile,
                                    noteli: noteli,
                                    reason: reason,
                                    remark: remark,
                                    status: status,
                                    userID: userID,
                                    leadStatus: leadStatus
                                })
                            ];
                        case 48:
                            blackListResp5 = _state.sent();
                            return [
                                2,
                                _this1.serviceResponse(blackListResp5.statusCode, blackListResp5.data, blackListResp5.message)
                            ];
                        case 49:
                            throw new BadRequestError("Customer cannot be moved from ".concat(leadStatus, " to ").concat(status));
                        case 50:
                            if (status !== LeadStatus.BLACK_LISTED && !isAllowed && !permissionAuthorizer([
                                masterPermission.LeadProfileDetails.CreditAdd,
                                masterPermission.LeadProfileDetails.CreditChangeStatus
                            ], permissionSet)) {
                                throw new AccessForbiddenError('You are not allowed to access this resource');
                            } else if (!isAllowed && !permissionAuthorizer([
                                masterPermission.Lead.Blacklisted
                            ], permissionSet)) {
                                throw new AccessForbiddenError('You are not allowed to access this resource');
                            }
                            if (!(status === LeadStatus.HOLD || status === LeadStatus.NOT_REQUIRED || status === LeadStatus.REJECTED)) return [
                                3,
                                52
                            ];
                            return [
                                4,
                                _this1.changeLeadStatusToRejectHoldStatuses({
                                    adminFee: adminFee,
                                    customerID: customerID,
                                    employmentType: employmentType,
                                    holdDate: holdDate,
                                    holdTime: holdTime,
                                    leadID: leadID,
                                    noteli: noteli,
                                    reason: reason,
                                    remark: remark,
                                    status: status,
                                    userID: userID,
                                    leadStatus: leadStatus
                                })
                            ];
                        case 51:
                            holdResp6 = _state.sent();
                            return [
                                2,
                                _this1.serviceResponse(holdResp6.statusCode, holdResp6.data, holdResp6.message)
                            ];
                        case 52:
                            if (!(status === LeadStatus.BLACK_LISTED)) return [
                                3,
                                54
                            ];
                            return [
                                4,
                                _this1.changeLeadStatusToBlackList({
                                    customerID: customerID,
                                    pancard: customer.pancard,
                                    lastLeadStatus: leadStatus,
                                    leadID: leadID,
                                    mobile: customer.mobile,
                                    noteli: noteli,
                                    reason: reason,
                                    remark: remark,
                                    status: status,
                                    userID: userID,
                                    leadStatus: leadStatus
                                })
                            ];
                        case 53:
                            blackListResp6 = _state.sent();
                            return [
                                2,
                                _this1.serviceResponse(blackListResp6.statusCode, blackListResp6.data, blackListResp6.message)
                            ];
                        case 54:
                            // ! TODO : Bank Update status needs to be handled in a seprate ticket
                            throw new BadRequestError("Customer cannot be moved from ".concat(leadStatus, " to ").concat(status));
                        case 55:
                            if (status !== LeadStatus.BLACK_LISTED && !isAllowed && !permissionAuthorizer([
                                masterPermission.LeadProfileDetails.CreditAdd,
                                masterPermission.LeadProfileDetails.CreditChangeStatus
                            ], permissionSet)) {
                                throw new AccessForbiddenError('You are not allowed to access this resource');
                            } else if (!isAllowed && !permissionAuthorizer([
                                masterPermission.Lead.Blacklisted
                            ], permissionSet)) {
                                throw new AccessForbiddenError('You are not allowed to access this resource');
                            }
                            if (!(status === LeadStatus.HOLD || status === LeadStatus.REJECTED)) return [
                                3,
                                57
                            ];
                            return [
                                4,
                                _this1.changeLeadStatusToRejectHoldStatuses({
                                    adminFee: adminFee,
                                    customerID: customerID,
                                    employmentType: employmentType,
                                    holdDate: holdDate,
                                    holdTime: holdTime,
                                    leadID: leadID,
                                    noteli: noteli,
                                    reason: reason,
                                    remark: remark,
                                    status: status,
                                    userID: userID,
                                    leadStatus: leadStatus
                                })
                            ];
                        case 56:
                            holdResp7 = _state.sent();
                            return [
                                2,
                                _this1.serviceResponse(holdResp7.statusCode, holdResp7.data, holdResp7.message)
                            ];
                        case 57:
                            if (!(status === LeadStatus.APPROVED)) return [
                                3,
                                59
                            ];
                            return [
                                4,
                                _this1.changeLeadStatusToApproved({
                                    adminFee: adminFee,
                                    alternateMobile: alternateMobile,
                                    customerID: customerID,
                                    employmentType: employmentType,
                                    leadID: leadID,
                                    loanAmtApproved: loanAmtApproved,
                                    m1: m1,
                                    m1_date: m1_date,
                                    m2: m2,
                                    m2_date: m2_date,
                                    m3: m3,
                                    m3_date: m3_date,
                                    m_avg: m_avg,
                                    noteli: noteli,
                                    officialEmail: officialEmail,
                                    p1: p1,
                                    p2: p2,
                                    p3: p3,
                                    plateFormFee: plateFormFee,
                                    reason: reason,
                                    remark: remark,
                                    repaymentDate: repaymentDate,
                                    roi: roi,
                                    status: status,
                                    tenure: tenure,
                                    userID: userID,
                                    leadStatus: leadStatus,
                                    accountID: accountID,
                                    accountNo: accountNo,
                                    accountType: accountType,
                                    bankIfsc: bankIfsc,
                                    bankName: bankName,
                                    clientIp: clientIp,
                                    newAccountType: newAccountType,
                                    productID: productID
                                })
                            ];
                        case 58:
                            aprResp2 = _state.sent();
                            return [
                                2,
                                _this1.serviceResponse(aprResp2.statusCode, aprResp2.data, aprResp2.message)
                            ];
                        case 59:
                            if (!(status === LeadStatus.BLACK_LISTED)) return [
                                3,
                                61
                            ];
                            return [
                                4,
                                _this1.changeLeadStatusToBlackList({
                                    customerID: customerID,
                                    pancard: customer.pancard,
                                    lastLeadStatus: leadStatus,
                                    leadID: leadID,
                                    mobile: customer.mobile,
                                    noteli: noteli,
                                    reason: reason,
                                    remark: remark,
                                    status: status,
                                    userID: userID,
                                    leadStatus: leadStatus
                                })
                            ];
                        case 60:
                            blackListResp7 = _state.sent();
                            return [
                                2,
                                _this1.serviceResponse(blackListResp7.statusCode, blackListResp7.data, blackListResp7.message)
                            ];
                        case 61:
                            throw new BadRequestError("Customer cannot be moved from ".concat(leadStatus, " to ").concat(status));
                        case 62:
                            if (status !== LeadStatus.BLACK_LISTED && !isAllowed && !permissionAuthorizer([
                                masterPermission.LeadProfileDetails.CreditAdd,
                                masterPermission.LeadProfileDetails.CreditChangeStatus
                            ], permissionSet)) {
                                throw new AccessForbiddenError('You are not allowed to access this resource');
                            } else if (!isAllowed && !permissionAuthorizer([
                                masterPermission.Lead.Blacklisted
                            ], permissionSet)) {
                                throw new AccessForbiddenError('You are not allowed to access this resource');
                            }
                            if (!(status === LeadStatus.HOLD || status === LeadStatus.NOT_REQUIRED)) return [
                                3,
                                64
                            ];
                            return [
                                4,
                                _this1.changeLeadStatusToRejectHoldStatuses({
                                    adminFee: adminFee,
                                    customerID: customerID,
                                    employmentType: employmentType,
                                    holdDate: holdDate,
                                    holdTime: holdTime,
                                    leadID: leadID,
                                    noteli: noteli,
                                    reason: reason,
                                    remark: remark,
                                    status: status,
                                    userID: userID,
                                    leadStatus: leadStatus
                                })
                            ];
                        case 63:
                            holdResp8 = _state.sent();
                            return [
                                2,
                                _this1.serviceResponse(holdResp8.statusCode, holdResp8.data, holdResp8.message)
                            ];
                        case 64:
                            if (!(status === LeadStatus.BLACK_LISTED)) return [
                                3,
                                66
                            ];
                            return [
                                4,
                                _this1.changeLeadStatusToBlackList({
                                    customerID: customerID,
                                    pancard: customer.pancard,
                                    lastLeadStatus: leadStatus,
                                    leadID: leadID,
                                    mobile: customer.mobile,
                                    noteli: noteli,
                                    reason: reason,
                                    remark: remark,
                                    status: status,
                                    userID: userID,
                                    leadStatus: leadStatus
                                })
                            ];
                        case 65:
                            blackListResp8 = _state.sent();
                            return [
                                2,
                                _this1.serviceResponse(blackListResp8.statusCode, blackListResp8.data, blackListResp8.message)
                            ];
                        case 66:
                            if (!(status === LeadStatus.APPROVED)) return [
                                3,
                                68
                            ];
                            return [
                                4,
                                _this1.changeLeadStatusToApproved({
                                    adminFee: adminFee,
                                    alternateMobile: alternateMobile,
                                    customerID: customerID,
                                    employmentType: employmentType,
                                    leadID: leadID,
                                    loanAmtApproved: loanAmtApproved,
                                    m1: m1,
                                    m1_date: m1_date,
                                    m2: m2,
                                    m2_date: m2_date,
                                    m3: m3,
                                    m3_date: m3_date,
                                    m_avg: m_avg,
                                    noteli: noteli,
                                    officialEmail: officialEmail,
                                    p1: p1,
                                    p2: p2,
                                    p3: p3,
                                    plateFormFee: plateFormFee,
                                    reason: reason,
                                    remark: remark,
                                    repaymentDate: repaymentDate,
                                    roi: roi,
                                    status: status,
                                    tenure: tenure,
                                    userID: userID,
                                    leadStatus: leadStatus,
                                    accountID: accountID,
                                    accountNo: accountNo,
                                    accountType: accountType,
                                    bankIfsc: bankIfsc,
                                    bankName: bankName,
                                    clientIp: clientIp,
                                    newAccountType: newAccountType,
                                    productID: productID
                                })
                            ];
                        case 67:
                            aprResp3 = _state.sent();
                            return [
                                2,
                                _this1.serviceResponse(aprResp3.statusCode, aprResp3.data, aprResp3.message)
                            ];
                        case 68:
                            throw new BadRequestError("Customer cannot be moved from ".concat(leadStatus, " to ").concat(status));
                        case 69:
                            if (status !== LeadStatus.BLACK_LISTED && !isAllowed && !permissionAuthorizer([
                                masterPermission.LeadProfileDetails.DisbursalAdd,
                                masterPermission.LeadProfileDetails.DisbursalUpdate,
                                masterPermission.LeadProfileDetails.DisbursalUpdateRazorpay
                            ], permissionSet)) {
                                throw new AccessForbiddenError('You are not allowed to access this resource');
                            } else if (!isAllowed && !permissionAuthorizer([
                                masterPermission.Lead.Blacklisted
                            ], permissionSet)) {
                                throw new AccessForbiddenError('You are not allowed to access this resource');
                            }
                            if (!(status === LeadStatus.APPROVED)) return [
                                3,
                                71
                            ];
                            return [
                                4,
                                _this1.changeLeadStatusToApproved({
                                    adminFee: adminFee,
                                    alternateMobile: alternateMobile,
                                    customerID: customerID,
                                    employmentType: employmentType,
                                    leadID: leadID,
                                    loanAmtApproved: loanAmtApproved,
                                    m1: m1,
                                    m1_date: m1_date,
                                    m2: m2,
                                    m2_date: m2_date,
                                    m3: m3,
                                    m3_date: m3_date,
                                    m_avg: m_avg,
                                    noteli: noteli,
                                    officialEmail: officialEmail,
                                    p1: p1,
                                    p2: p2,
                                    p3: p3,
                                    plateFormFee: plateFormFee,
                                    reason: reason,
                                    remark: remark,
                                    repaymentDate: repaymentDate,
                                    roi: roi,
                                    status: status,
                                    tenure: tenure,
                                    userID: userID,
                                    leadStatus: leadStatus,
                                    accountID: accountID,
                                    accountNo: accountNo,
                                    accountType: accountType,
                                    bankIfsc: bankIfsc,
                                    bankName: bankName,
                                    clientIp: clientIp,
                                    newAccountType: newAccountType,
                                    productID: productID
                                })
                            ];
                        case 70:
                            aprResp4 = _state.sent();
                            return [
                                2,
                                _this1.serviceResponse(aprResp4.statusCode, aprResp4.data, aprResp4.message)
                            ];
                        case 71:
                            if (!(status === LeadStatus.BLACK_LISTED)) return [
                                3,
                                73
                            ];
                            return [
                                4,
                                _this1.changeLeadStatusToBlackList({
                                    customerID: customerID,
                                    pancard: customer.pancard,
                                    lastLeadStatus: leadStatus,
                                    leadID: leadID,
                                    mobile: customer.mobile,
                                    noteli: noteli,
                                    reason: reason,
                                    remark: remark,
                                    status: status,
                                    userID: userID,
                                    leadStatus: leadStatus
                                })
                            ];
                        case 72:
                            blackListResp9 = _state.sent();
                            return [
                                2,
                                _this1.serviceResponse(blackListResp9.statusCode, blackListResp9.data, blackListResp9.message)
                            ];
                        case 73:
                            if (status === LeadStatus.DISBURSED) {}
                            _state.label = 74;
                        case 74:
                            throw new BadRequestError("Customer cannot be moved from ".concat(leadStatus, " to ").concat(status));
                        case 75:
                            if (!(status === LeadStatus.WHITE_LISTED)) return [
                                3,
                                79
                            ];
                            if (!isAllowed && !permissionAuthorizer([
                                masterPermission.Lead.Blacklisted
                            ], permissionSet)) {
                                throw new AccessForbiddenError('You are not allowed to access this resource');
                            }
                            lastLeadStatus = leadStatus;
                            if (!(leadStatus === String(LeadStatus.BLACK_LISTED))) return [
                                3,
                                77
                            ];
                            return [
                                4,
                                _this1.callHistoryLogsModel.findOne({
                                    select: [
                                        'status'
                                    ],
                                    where: function where(query) {
                                        query.where('leadID', leadID);
                                        query.where('customerID', customerID);
                                        query.whereIn('status', Object.values(LeadStatus));
                                        query.whereNotIn('status', [
                                            LeadStatus.BLACK_LISTED,
                                            LeadStatus.WHITE_LISTED
                                        ]);
                                    },
                                    order: [
                                        {
                                            column: 'callHistoryID',
                                            order: 'desc'
                                        }
                                    ]
                                })
                            ];
                        case 76:
                            lastStatusRecord = _state.sent();
                            // Update lastLeadStatus if it exists
                            lastLeadStatus = lastStatusRecord.status ? lastStatusRecord.status : leadStatus;
                            _state.label = 77;
                        case 77:
                            return [
                                4,
                                _this1.changeLeadStatusToWhitelist({
                                    customerID: customerID,
                                    pancard: customer.pancard,
                                    lastLeadStatus: lastLeadStatus,
                                    leadID: leadID,
                                    mobile: customer.mobile,
                                    noteli: noteli,
                                    reason: reason,
                                    remark: remark,
                                    status: status,
                                    userID: userID,
                                    leadStatus: leadStatus
                                })
                            ];
                        case 78:
                            whiteListResp = _state.sent();
                            return [
                                2,
                                _this1.serviceResponse(whiteListResp.statusCode, whiteListResp.data, whiteListResp.message)
                            ];
                        case 79:
                            throw new BadRequestError("Customer cannot be moved from ".concat(leadStatus, " to ").concat(status));
                        case 80:
                            throw new BadRequestError("Customer cannot be moved from ".concat(leadStatus, " to ").concat(status));
                        case 81:
                            return [
                                2
                            ];
                    }
                });
            })();
        }), _define_property(_this, "changeLeadStatusToRejectHoldStatuses", function(payload) {
            return _async_to_generator(function() {
                var adminFee, customerID, employmentType, holdDate, holdTime, leadID, noteli, reason, remark, status, userID, approvalData, approval, leadUpdate;
                return _ts_generator(this, function(_state) {
                    switch(_state.label){
                        case 0:
                            adminFee = payload.adminFee, customerID = payload.customerID, employmentType = payload.employmentType, holdDate = payload.holdDate, holdTime = payload.holdTime, leadID = payload.leadID, noteli = payload.noteli, reason = payload.reason, remark = payload.remark, status = payload.status, userID = payload.userID;
                            if (!(status === LeadStatus.HOLD_PROCESS || status === LeadStatus.REJECTED_PROCESS || status === LeadStatus.REJECTED || status === LeadStatus.NOT_REQUIRED_PROCESS || status === LeadStatus.NOT_REQUIRED || status === LeadStatus.HOLD)) return [
                                3,
                                12
                            ];
                            // const callHistory = await this.callHistoryModel.findOne({
                            //   where: { status, leadID },
                            //   select: ['callHistoryID'],
                            //   order: [{ column: 'callHistoryID', order: 'desc' }],
                            // })
                            // if (callHistory) throw new BadRequestError(`Selected Lead is already in ${status}`)
                            // const callHistoryLogs = await this.callHistoryLogsModel.findOne({
                            //   where: { status, leadID },
                            //   select: ['callHistoryID'],
                            //   order: [{ column: 'callHistoryID', order: 'desc' }],
                            // })
                            // if (callHistoryLogs) throw new BadRequestError(`Selected Lead is already in ${status}`)
                            return [
                                4,
                                _this1.insertLeadToCallHistory(customerID, leadID, status, userID, remark, noteli)
                            ];
                        case 1:
                            _state.sent();
                            // Follow up time not in API
                            approvalData = {
                                customerID: customerID,
                                leadID: leadID,
                                loanType: 0,
                                branch: 'Delhi',
                                loanAmtApproved: 0,
                                tenure: 0,
                                roi: 1,
                                repayDate: moment().add(10, 'days').format('YYYY-MM-DD'),
                                adminFee: adminFee,
                                plateFormFee: 0,
                                convinineceFee: 0,
                                creditRiskAnalisys: 0,
                                GstOfAdminFee: 0,
                                alternateMobile: '0',
                                officialEmail: '...@gmail.com',
                                monthlyIncome: 0,
                                cibil: 0,
                                activeLoans: 0,
                                activePL: 0,
                                activeHL: 0,
                                activeCC: 0,
                                activePaydayLoan: 0,
                                outstandingAmount: 0,
                                monthlyObligation: 0,
                                status: status,
                                remark: remark,
                                m1: '0',
                                m2: '0',
                                m3: '0',
                                m_avg: '0',
                                p1: '0',
                                p2: '0',
                                p3: '0',
                                m1_date: moment().format('YYYY-MM-DD'),
                                m2_date: moment().format('YYYY-MM-DD'),
                                m3_date: moment().format('YYYY-MM-DD'),
                                creditedBy: userID,
                                sanctionalloUID: userID.toString(),
                                rejectionReason: reason,
                                documentr: '',
                                employmentType: employmentType
                            };
                            return [
                                4,
                                _this1.approvalModel.findOneApproval({
                                    leadID: leadID
                                }, [
                                    'approvalID'
                                ])
                            ];
                        case 2:
                            approval = _state.sent();
                            if (!!approval) return [
                                3,
                                4
                            ];
                            return [
                                4,
                                _this1.approvalModel.insert(approvalData)
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
                                _this1.approvalModel.findOneAndUpdateApproval({
                                    approvalID: approval.approvalID
                                }, approvalData)
                            ];
                        case 5:
                            _state.sent();
                            _state.label = 6;
                        case 6:
                            leadUpdate = {
                                sanctionalloUID: userID,
                                alloUID: '0',
                                status: status
                            };
                            if (status === LeadStatus.HOLD || status === LeadStatus.HOLD_PROCESS) {
                                leadUpdate.hold_date = moment(holdDate).format('YYYY-MM-DD');
                                leadUpdate.hold_time = holdTime;
                            }
                            return [
                                4,
                                _this1.leadModel.findOneAndUpdate({
                                    leadID: leadID
                                }, leadUpdate)
                            ];
                        case 7:
                            _state.sent();
                            if (!(status == LeadStatus.REJECTED_PROCESS)) return [
                                3,
                                9
                            ];
                            return [
                                4,
                                notificationUtils.sendRejectProcessMail(customerID, leadID)
                            ];
                        case 8:
                            _state.sent();
                            return [
                                3,
                                11
                            ];
                        case 9:
                            if (!(status == LeadStatus.NOT_REQUIRED)) return [
                                3,
                                11
                            ];
                            return [
                                4,
                                notificationUtils.sendNotRequiredProcessMail(customerID, leadID)
                            ];
                        case 10:
                            _state.sent();
                            _state.label = 11;
                        case 11:
                            return [
                                2,
                                _this1.serviceResponse(HttpStatusCode.Ok, {}, 'Lead status has been updated')
                            ];
                        case 12:
                            return [
                                2
                            ];
                    }
                });
            })();
        }), _define_property(_this, "changeLeadStatusToBlackList", function(payload) {
            return _async_to_generator(function() {
                var customerID, pancard, lastLeadStatus, leadID, mobile, noteli, reason, remark, status, userID;
                return _ts_generator(this, function(_state) {
                    switch(_state.label){
                        case 0:
                            customerID = payload.customerID, pancard = payload.pancard, lastLeadStatus = payload.lastLeadStatus, leadID = payload.leadID, mobile = payload.mobile, noteli = payload.noteli, reason = payload.reason, remark = payload.remark, status = payload.status, userID = payload.userID;
                            if (!(status === LeadStatus.BLACK_LISTED)) return [
                                3,
                                3
                            ];
                            // const callHistory = await this.callHistoryModel.findOne({
                            //   where: { status, leadID },
                            //   select: ['callHistoryID'],
                            //   order: [{ column: 'callHistoryID', order: 'desc' }],
                            // })
                            // if (callHistory) throw new BadRequestError(`Selected Lead is already in ${status}`)
                            // const callHistoryLogs = await this.callHistoryLogsModel.findOne({
                            //   where: { status, leadID },
                            //   select: ['callHistoryID'],
                            //   order: [{ column: 'callHistoryID', order: 'desc' }],
                            // })
                            // if (callHistoryLogs) throw new BadRequestError(`Selected Lead is already in ${status}`)
                            return [
                                4,
                                _this1.insertLeadToCallHistory(customerID, leadID, LeadStatus.BLACK_LISTED, userID, 'blacklist', noteli)
                            ];
                        case 1:
                            _state.sent();
                            return [
                                4,
                                Promise.all([
                                    _this1.customerPancardBlacklistOrWhitelist(pancard, userID, 'Active'),
                                    _this1.leadModel.findOneAndUpdate({
                                        customerID: customerID,
                                        leadID: leadID
                                    }, {
                                        status: status
                                    }),
                                    _this1.mobileTokenModel.findOneAndUpdate({
                                        mobile: mobile.toString()
                                    }, {
                                        access_token: LeadStatus.BLACK_LISTED
                                    })
                                ])
                            ];
                        case 2:
                            _state.sent();
                            return [
                                2,
                                _this1.serviceResponse(HttpStatusCode.Ok, {}, 'Lead status has been updated')
                            ];
                        case 3:
                            return [
                                2
                            ];
                    }
                });
            })();
        }), _define_property(_this, "changeLeadStatusToWhitelist", function(payload) {
            return _async_to_generator(function() {
                var customerID, pancard, lastLeadStatus, leadID, mobile, noteli, reason, remark, status, userID;
                return _ts_generator(this, function(_state) {
                    switch(_state.label){
                        case 0:
                            customerID = payload.customerID, pancard = payload.pancard, lastLeadStatus = payload.lastLeadStatus, leadID = payload.leadID, mobile = payload.mobile, noteli = payload.noteli, reason = payload.reason, remark = payload.remark, status = payload.status, userID = payload.userID;
                            if (!(status === LeadStatus.WHITE_LISTED)) return [
                                3,
                                3
                            ];
                            // Insert to call history
                            return [
                                4,
                                _this1.insertLeadToCallHistory(customerID, leadID, LeadStatus.WHITE_LISTED, userID, 'whitelist', noteli)
                            ];
                        case 1:
                            _state.sent();
                            // Database operations
                            return [
                                4,
                                Promise.all([
                                    _this1.customerPancardBlacklistOrWhitelist(pancard, userID, 'Deactive'),
                                    _this1.leadModel.findOneAndUpdate({
                                        customerID: customerID,
                                        leadID: leadID
                                    }, {
                                        status: lastLeadStatus
                                    }),
                                    _this1.mobileTokenModel.findOneAndUpdate({
                                        mobile: mobile.toString()
                                    }, {
                                        access_token: lastLeadStatus
                                    })
                                ])
                            ];
                        case 2:
                            _state.sent();
                            return [
                                2,
                                _this1.serviceResponse(HttpStatusCode.Ok, {}, 'Lead status has been updated')
                            ];
                        case 3:
                            return [
                                2
                            ];
                    }
                });
            })();
        }), _define_property(_this, "changeLeadStatusToApproved", function(payload) {
            return _async_to_generator(function() {
                var accountID, accountType, adminFee, alternateMobile, bankName, clientIp, customerID, employmentType, leadID, loanAmtApproved, m1, m1_date, m2, m2_date, m3, m3_date, m_avg, newAccountType, noteli, officialEmail, p1, p2, p3, plateFormFee, reason, remark, repaymentDate, roi, status, tenure, userID, accountNo, bankIfsc, productID, isLoanAmntValid, customerAccount, bankAccount, _ref, accountId, approvalData, approval, customerAccount1, credit, apiService, gst, emiRepay, emiData, dayOfRepayDate, FirstDueDate, emiDoc, updatedCredit, _, _tmp, error;
                return _ts_generator(this, function(_state) {
                    switch(_state.label){
                        case 0:
                            accountID = payload.accountID, accountType = payload.accountType, adminFee = payload.adminFee, alternateMobile = payload.alternateMobile, bankName = payload.bankName, clientIp = payload.clientIp, customerID = payload.customerID, employmentType = payload.employmentType, leadID = payload.leadID, loanAmtApproved = payload.loanAmtApproved, m1 = payload.m1, m1_date = payload.m1_date, m2 = payload.m2, m2_date = payload.m2_date, m3 = payload.m3, m3_date = payload.m3_date, m_avg = payload.m_avg, newAccountType = payload.newAccountType, noteli = payload.noteli, officialEmail = payload.officialEmail, p1 = payload.p1, p2 = payload.p2, p3 = payload.p3, plateFormFee = payload.plateFormFee, reason = payload.reason, remark = payload.remark, repaymentDate = payload.repaymentDate, roi = payload.roi, status = payload.status, tenure = payload.tenure, userID = payload.userID, accountNo = payload.accountNo, bankIfsc = payload.bankIfsc, productID = payload.productID;
                            if (!(status === LeadStatus.APPROVED)) return [
                                3,
                                33
                            ];
                            if (!(productID === 2)) return [
                                3,
                                15
                            ];
                            if (tenure < 6) {
                                throw new BadRequestError('Tenure cannot be less than 6 days');
                            }
                            return [
                                4,
                                _this1.loanService.isReloanAmountValid(loanAmtApproved, customerID)
                            ];
                        case 1:
                            isLoanAmntValid = _state.sent();
                            if (!isLoanAmntValid.status) {
                                throw new BadRequestError("Approval amount cannot be more than ".concat(isLoanAmntValid.amount));
                            }
                            if (!(accountType === 'old')) return [
                                3,
                                3
                            ];
                            return [
                                4,
                                _this1.customerAccountModel.findOne({
                                    where: {
                                        customerID: customerID,
                                        accountID: accountID
                                    }
                                })
                            ];
                        case 2:
                            customerAccount = _state.sent();
                            if (!customerAccount) {
                                throw new NotFoundError('Customer Account does not exist');
                            }
                            return [
                                3,
                                6
                            ];
                        case 3:
                            return [
                                4,
                                _this1.customerAccountModel.findOne({
                                    where: {
                                        accountNo: accountNo
                                    },
                                    select: [
                                        'customerID'
                                    ]
                                })
                            ];
                        case 4:
                            bankAccount = _state.sent();
                            if (bankAccount && (bankAccount === null || bankAccount === void 0 ? void 0 : bankAccount.customerID) !== customerID) {
                                throw new BadRequestError('This account belongs to another user, Please enter different bank details');
                            } else if (bankAccount && (bankAccount === null || bankAccount === void 0 ? void 0 : bankAccount.customerID) === customerID) {
                                throw new BadRequestError('This account already exists in our database, Please enter different bank details');
                            }
                            return [
                                4,
                                _this1.customerAccountModel.insert({
                                    accountNo: accountNo,
                                    accountType: newAccountType,
                                    bankIfsc: bankIfsc,
                                    bank: bankName,
                                    bankBranch: 'N/A',
                                    ip: clientIp,
                                    credatedBy: +config.defaultUserId,
                                    // bank_holder_name: accountHoldersName,
                                    customerID: customerID,
                                    leadID: leadID,
                                    status: BankAccountStatus.VERIFIED,
                                    is_credit: '1'
                                })
                            ];
                        case 5:
                            _ref = _sliced_to_array.apply(void 0, [
                                _state.sent(),
                                1
                            ]), accountId = _ref[0];
                            _state.label = 6;
                        case 6:
                            return [
                                4,
                                _this1.insertLeadToCallHistory(customerID, leadID, 'Disbursal Account Updated', userID, accountNo, noteli, loanAmtApproved.toString(), CallType.DISBURSAL_ACCOUNT_UPDATE)
                            ];
                        case 7:
                            _state.sent();
                            // check loanAmnt valid or not
                            // Check Repeat Case
                            approvalData = {
                                customerID: customerID,
                                leadID: leadID,
                                loanType: 0,
                                branch: 'Delhi',
                                loanAmtApproved: loanAmtApproved,
                                tenure: tenure,
                                roi: roi,
                                repayDate: repaymentDate,
                                adminFee: adminFee,
                                plateFormFee: plateFormFee,
                                convinineceFee: 0,
                                creditRiskAnalisys: 0,
                                GstOfAdminFee: Math.round(adminFee * (+config.gst / 100)),
                                alternateMobile: alternateMobile.toString(),
                                officialEmail: officialEmail,
                                monthlyIncome: 0,
                                cibil: 0,
                                activeLoans: 0,
                                activePL: 0,
                                activeHL: 0,
                                activeCC: 0,
                                activePaydayLoan: 0,
                                outstandingAmount: 0,
                                monthlyObligation: 0,
                                status: status,
                                remark: remark,
                                m1: m1,
                                m2: m2,
                                m3: m3,
                                m_avg: m_avg,
                                p1: p1,
                                p2: p2,
                                p3: p3,
                                m1_date: m1_date,
                                m2_date: m2_date,
                                m3_date: m3_date,
                                creditedBy: userID,
                                sanctionalloUID: userID.toString(),
                                rejectionReason: reason,
                                documentr: '',
                                employmentType: employmentType
                            };
                            return [
                                4,
                                _this1.approvalModel.findOneApproval({
                                    leadID: leadID
                                }, [
                                    'approvalID'
                                ])
                            ];
                        case 8:
                            approval = _state.sent();
                            if (!approval) return [
                                3,
                                10
                            ];
                            return [
                                4,
                                _this1.approvalModel.findOneAndUpdateApproval({
                                    approvalID: approval.approvalID
                                }, approvalData)
                            ];
                        case 9:
                            _state.sent();
                            return [
                                3,
                                12
                            ];
                        case 10:
                            return [
                                4,
                                _this1.approvalModel.insert(approvalData)
                            ];
                        case 11:
                            _state.sent();
                            _state.label = 12;
                        case 12:
                            return [
                                4,
                                _this1.insertLeadToCallHistory(customerID, leadID, status, userID, remark, noteli, loanAmtApproved.toString())
                            ];
                        case 13:
                            _state.sent();
                            return [
                                4,
                                _this1.leadModel.findOneAndUpdate({
                                    leadID: leadID
                                }, {
                                    status: status,
                                    alloUID: '0',
                                    sanctionalloUID: userID
                                })
                            ];
                        case 14:
                            _state.sent();
                            return [
                                3,
                                29
                            ];
                        case 15:
                            return [
                                4,
                                _this1.customerAccountModel.findOne({
                                    where: {
                                        customerID: customerID,
                                        accountID: accountID
                                    }
                                })
                            ];
                        case 16:
                            customerAccount1 = _state.sent();
                            if (!customerAccount1) {
                                throw new NotFoundError('Customer Account does not exist');
                            }
                            return [
                                4,
                                _this1.insertLeadToCallHistory(customerID, leadID, 'Disbursal Account Updated', userID, accountNo, noteli, loanAmtApproved.toString(), CallType.DISBURSAL_ACCOUNT_UPDATE)
                            ];
                        case 17:
                            _state.sent();
                            return [
                                4,
                                _this1.creditService.findOne({
                                    leadID: leadID
                                }, [
                                    'creditID',
                                    'firstDueDate',
                                    'principal'
                                ])
                            ];
                        case 18:
                            credit = _state.sent();
                            apiService = new AxiosService(_this1.commonHelper.getBaseUrl());
                            gst = Math.floor(adminFee * (+config.gst / 100));
                            emiRepay = +repaymentDate;
                            emiData = {
                                adminFee: adminFee,
                                gst: gst,
                                branch: 'Delhi',
                                customer_id: customerID,
                                firstDueDate: emiRepay,
                                lead_id: leadID,
                                loanAmtApproved: loanAmtApproved,
                                roi: roi,
                                tenure: tenure
                            };
                            if (!!credit) return [
                                3,
                                20
                            ];
                            return [
                                4,
                                apiService.call('post', '/new-api/crm/creditDetails', emiData)
                            ];
                        case 19:
                            _state.sent();
                            return [
                                3,
                                24
                            ];
                        case 20:
                            dayOfRepayDate = emiRepay >= 29 ? 1 : emiRepay;
                            return [
                                4,
                                calculateRepayDate(dayOfRepayDate)
                            ];
                        case 21:
                            FirstDueDate = _state.sent();
                            FirstDueDate = new Date(format(new Date(FirstDueDate), 'yyyy-MM-dd'));
                            return [
                                4,
                                _this1.emiHelper.emiGenerator(loanAmtApproved, roi, tenure, FirstDueDate)
                            ];
                        case 22:
                            emiDoc = _state.sent();
                            return [
                                4,
                                _this1.creditService.updateOne({
                                    creditID: credit.creditID
                                }, {
                                    tenure: tenure,
                                    interest: emiDoc.interest,
                                    amountToBeRepayed: emiDoc.repaymentAmount,
                                    totalEMIs: emiDoc.totalEMIs,
                                    emiLeft: emiDoc.EMILeft,
                                    principal: loanAmtApproved,
                                    processingFee: adminFee,
                                    gst: gst,
                                    roi: roi,
                                    firstDueDate: FirstDueDate
                                })
                            ];
                        case 23:
                            _state.sent();
                            _state.label = 24;
                        case 24:
                            return [
                                4,
                                _this1.creditService.findOne({
                                    leadID: leadID
                                }, [
                                    'creditID',
                                    'firstDueDate'
                                ])
                            ];
                        case 25:
                            updatedCredit = _state.sent();
                            _ = Promise.all;
                            _tmp = [
                                _this1.approvalModel.findOneAndUpdateApproval({
                                    leadID: leadID
                                }, {
                                    loanAmtApproved: loanAmtApproved,
                                    tenure: tenure,
                                    roi: roi,
                                    adminFee: adminFee,
                                    GstOfAdminFee: gst,
                                    repayDate: updatedCredit.firstDueDate
                                })
                            ];
                            return [
                                4,
                                _this1.leadModel.findOneAndUpdate({
                                    leadID: leadID
                                }, {
                                    status: status,
                                    alloUID: '0',
                                    sanctionalloUID: userID
                                })
                            ];
                        case 26:
                            _tmp = _tmp.concat([
                                _state.sent()
                            ]);
                            return [
                                4,
                                _this1.insertLeadToCallHistory(customerID, leadID, status, userID, remark, noteli, loanAmtApproved.toString())
                            ];
                        case 27:
                            return [
                                4,
                                _.apply(Promise, [
                                    _tmp.concat([
                                        _state.sent()
                                    ])
                                ])
                            ];
                        case 28:
                            _state.sent();
                            _state.label = 29;
                        case 29:
                            _state.trys.push([
                                29,
                                31,
                                ,
                                32
                            ]);
                            return [
                                4,
                                notificationUtils.sendSanctionMail(customerID, leadID, userID)
                            ];
                        case 30:
                            _state.sent();
                            return [
                                3,
                                32
                            ];
                        case 31:
                            error = _state.sent();
                            logger.error('Error sending notification email');
                            return [
                                3,
                                32
                            ];
                        case 32:
                            return [
                                2,
                                _this1.serviceResponse(HttpStatusCode.Ok, {}, 'Lead status has been updated')
                            ];
                        case 33:
                            return [
                                2
                            ];
                    }
                });
            })();
        }), _define_property(_this, "changeLeadStatusToApprovedProcess", function(payload) {
            return _async_to_generator(function() {
                var adminFee, alternateMobile, customerID, employmentType, leadID, loanAmtApproved, m1, m1_date, m2, m2_date, m3, m3_date, m_avg, noteli, officialEmail, p1, p2, p3, plateFormFee, reason, remark, repaymentDate, roi, status, tenure, userID, loanType, mobileToken, axios, emiResp, approvalData, approval, step, userStepExists, isLoanAmntValid, approvalData1, approval1, step1, userStepExists1;
                return _ts_generator(this, function(_state) {
                    switch(_state.label){
                        case 0:
                            adminFee = payload.adminFee, alternateMobile = payload.alternateMobile, customerID = payload.customerID, employmentType = payload.employmentType, leadID = payload.leadID, loanAmtApproved = payload.loanAmtApproved, m1 = payload.m1, m1_date = payload.m1_date, m2 = payload.m2, m2_date = payload.m2_date, m3 = payload.m3, m3_date = payload.m3_date, m_avg = payload.m_avg, noteli = payload.noteli, officialEmail = payload.officialEmail, p1 = payload.p1, p2 = payload.p2, p3 = payload.p3, plateFormFee = payload.plateFormFee, reason = payload.reason, remark = payload.remark, repaymentDate = payload.repaymentDate, roi = payload.roi, status = payload.status, tenure = payload.tenure, userID = payload.userID, loanType = payload.loanType;
                            if (!(status === LeadStatus.APPROVED_PROCESS)) return [
                                3,
                                29
                            ];
                            if (!(loanType === 'emi')) return [
                                3,
                                13
                            ];
                            return [
                                4,
                                _this1.mobileTokenModel.findOneMobileToken({
                                    customerID: customerID.toString()
                                }, [
                                    'access_token'
                                ], [
                                    {
                                        column: 'customerID',
                                        order: 'desc'
                                    }
                                ])
                            ];
                        case 1:
                            mobileToken = _state.sent();
                            axios = new AxiosService(_this1.commonHelper.getBaseUrl());
                            if (roi < 12 || roi > 365) throw new BadRequestError('Rate Of Intrest Can only be in Between 12% - 365%');
                            return [
                                4,
                                axios.call('post', RAMFIN_WEBAPP_API.PAYDAY_TO_EMI, {
                                    customer_id: customerID,
                                    firstDueDate: repaymentDate,
                                    lead_id: leadID,
                                    loanAmtApproved: loanAmtApproved,
                                    productId: ProductID.EMI,
                                    roi: roi,
                                    tenure: tenure,
                                    userID: userID,
                                    adminFee: adminFee
                                }, undefined, {
                                    token: mobileToken.access_token
                                })
                            ];
                        case 2:
                            emiResp = _state.sent();
                            if (!emiResp.success) {
                                throw new BadRequestError('Unable to add EMI at the moment, Please try again later');
                            }
                            // customerID: customer_id,
                            // leadID: lead_id,
                            // branch: BranchName.DELHI,
                            // loanAmtApproved: loanAmtApproved,
                            // tenure: tenure,
                            // roi: roi,
                            // repayDate: updatedCredit.firstDueDate,
                            // adminFee: adminFee,
                            // GstOfAdminFee: gst,
                            // alternateMobile: '',
                            // officialEmail: '',
                            // cibil: 0,
                            // activeLoans: 0,
                            // status: ApprovalStatus.ApprovedProcess,
                            // creditedBy: +config.defaultUserId,
                            // remark: 'Approved Process',
                            // employmentType: 'employeeType,
                            approvalData = {
                                customerID: customerID,
                                leadID: leadID,
                                loanType: 0,
                                // branch: 'Delhi',
                                loanAmtApproved: loanAmtApproved,
                                // tenure,
                                // roi,
                                // repayDate: repaymentDate as unknown as Date,
                                // adminFee,
                                plateFormFee: plateFormFee,
                                convinineceFee: 0,
                                creditRiskAnalisys: 0,
                                // GstOfAdminFee: Math.round(adminFee * (+config.gst / 100)),
                                alternateMobile: alternateMobile,
                                officialEmail: officialEmail,
                                monthlyIncome: 0,
                                cibil: 0,
                                activeLoans: 0,
                                activePL: 0,
                                activeHL: 0,
                                activeCC: 0,
                                activePaydayLoan: 0,
                                outstandingAmount: 0,
                                monthlyObligation: 0,
                                status: status,
                                // remark,
                                m1: m1,
                                m2: m2,
                                m3: m3,
                                m_avg: m_avg,
                                p1: p1,
                                p2: p2,
                                p3: p3,
                                m1_date: m1_date,
                                m2_date: m2_date,
                                m3_date: m3_date,
                                creditedBy: userID,
                                sanctionalloUID: userID.toString(),
                                rejectionReason: reason,
                                documentr: '',
                                employmentType: employmentType
                            };
                            return [
                                4,
                                _this1.approvalModel.findOneApproval({
                                    leadID: leadID
                                }, [
                                    'approvalID'
                                ])
                            ];
                        case 3:
                            approval = _state.sent();
                            if (!approval) return [
                                3,
                                5
                            ];
                            return [
                                4,
                                _this1.approvalModel.findOneAndUpdateApproval({
                                    approvalID: approval.approvalID
                                }, approvalData)
                            ];
                        case 4:
                            _state.sent();
                            _state.label = 5;
                        case 5:
                            return [
                                4,
                                _this1.stepControlModel.findOne({
                                    where: {
                                        step_name: StepName.FINBOX
                                    },
                                    select: [
                                        'id'
                                    ]
                                })
                            ];
                        case 6:
                            step = _state.sent();
                            if (!step) return [
                                3,
                                11
                            ];
                            return [
                                4,
                                _this1.stepTrackerModel.findOneStepTracker({
                                    customer_id: customerID,
                                    step_id: step.id,
                                    lead_id: leadID
                                }, [
                                    'is_completed',
                                    'id'
                                ])
                            ];
                        case 7:
                            userStepExists = _state.sent();
                            if (!!userStepExists) return [
                                3,
                                9
                            ];
                            return [
                                4,
                                _this1.stepTrackerModel.insert({
                                    customer_id: customerID,
                                    step_id: step.id,
                                    is_completed: true,
                                    lead_id: leadID
                                })
                            ];
                        case 8:
                            _state.sent();
                            return [
                                3,
                                11
                            ];
                        case 9:
                            if (!!userStepExists.is_completed) return [
                                3,
                                11
                            ];
                            return [
                                4,
                                _this1.stepTrackerModel.findOneAndUpdate({
                                    id: userStepExists.id
                                }, {
                                    is_completed: true
                                })
                            ];
                        case 10:
                            _state.sent();
                            _state.label = 11;
                        case 11:
                            // send approved process email
                            return [
                                4,
                                notificationUtils.sendApprovedProcessMail(customerID, leadID, userID)
                            ];
                        case 12:
                            _state.sent();
                            return [
                                2,
                                _this1.serviceResponse(HttpStatusCode.Ok, {}, 'Lead status has been updated')
                            ];
                        case 13:
                            if (tenure < 6) {
                                throw new BadRequestError('Tenure cannot be less than 6 days');
                            }
                            return [
                                4,
                                _this1.loanService.isReloanAmountValid(loanAmtApproved, customerID)
                            ];
                        case 14:
                            isLoanAmntValid = _state.sent();
                            if (!isLoanAmntValid.status) {
                                throw new BadRequestError("Approval amount cannot be more than ".concat(isLoanAmntValid.amount));
                            }
                            // check loanAmnt valid or not
                            // Check Repeat Case
                            approvalData1 = {
                                customerID: customerID,
                                leadID: leadID,
                                loanType: 0,
                                branch: 'Delhi',
                                loanAmtApproved: loanAmtApproved,
                                tenure: tenure,
                                roi: roi,
                                repayDate: repaymentDate,
                                adminFee: adminFee,
                                plateFormFee: plateFormFee,
                                convinineceFee: 0,
                                creditRiskAnalisys: 0,
                                GstOfAdminFee: Math.round(adminFee * (+config.gst / 100)),
                                alternateMobile: alternateMobile.toString(),
                                officialEmail: officialEmail,
                                monthlyIncome: 0,
                                cibil: 0,
                                activeLoans: 0,
                                activePL: 0,
                                activeHL: 0,
                                activeCC: 0,
                                activePaydayLoan: 0,
                                outstandingAmount: 0,
                                monthlyObligation: 0,
                                status: status,
                                remark: remark,
                                m1: m1,
                                m2: m2,
                                m3: m3,
                                m_avg: m_avg,
                                p1: p1,
                                p2: p2,
                                p3: p3,
                                m1_date: m1_date,
                                m2_date: m2_date,
                                m3_date: m3_date,
                                creditedBy: userID,
                                sanctionalloUID: userID.toString(),
                                rejectionReason: reason,
                                documentr: '',
                                employmentType: employmentType
                            };
                            return [
                                4,
                                _this1.approvalModel.findOneApproval({
                                    leadID: leadID
                                }, [
                                    'approvalID'
                                ])
                            ];
                        case 15:
                            approval1 = _state.sent();
                            if (!approval1) return [
                                3,
                                17
                            ];
                            return [
                                4,
                                _this1.approvalModel.findOneAndUpdateApproval({
                                    approvalID: approval1.approvalID
                                }, approvalData1)
                            ];
                        case 16:
                            _state.sent();
                            return [
                                3,
                                19
                            ];
                        case 17:
                            return [
                                4,
                                _this1.approvalModel.insert(approvalData1)
                            ];
                        case 18:
                            _state.sent();
                            _state.label = 19;
                        case 19:
                            return [
                                4,
                                _this1.insertLeadToCallHistory(customerID, leadID, status, userID, remark, noteli, loanAmtApproved.toString())
                            ];
                        case 20:
                            _state.sent();
                            return [
                                4,
                                _this1.leadModel.findOneAndUpdate({
                                    leadID: leadID
                                }, {
                                    status: status,
                                    alloUID: '0',
                                    sanctionalloUID: userID
                                })
                            ];
                        case 21:
                            _state.sent();
                            return [
                                4,
                                _this1.stepControlModel.findOne({
                                    where: {
                                        step_name: StepName.FINBOX
                                    },
                                    select: [
                                        'id'
                                    ]
                                })
                            ];
                        case 22:
                            step1 = _state.sent();
                            if (!step1) return [
                                3,
                                27
                            ];
                            return [
                                4,
                                _this1.stepTrackerModel.findOneStepTracker({
                                    customer_id: customerID,
                                    step_id: step1.id,
                                    lead_id: leadID
                                }, [
                                    'is_completed',
                                    'id'
                                ])
                            ];
                        case 23:
                            userStepExists1 = _state.sent();
                            if (!!userStepExists1) return [
                                3,
                                25
                            ];
                            return [
                                4,
                                _this1.stepTrackerModel.insert({
                                    customer_id: customerID,
                                    step_id: step1.id,
                                    is_completed: true,
                                    lead_id: leadID
                                })
                            ];
                        case 24:
                            _state.sent();
                            return [
                                3,
                                27
                            ];
                        case 25:
                            if (!!userStepExists1.is_completed) return [
                                3,
                                27
                            ];
                            return [
                                4,
                                _this1.stepTrackerModel.findOneAndUpdate({
                                    id: userStepExists1.id
                                }, {
                                    is_completed: true
                                })
                            ];
                        case 26:
                            _state.sent();
                            _state.label = 27;
                        case 27:
                            // send approved process email
                            return [
                                4,
                                notificationUtils.sendApprovedProcessMail(customerID, leadID, userID)
                            ];
                        case 28:
                            _state.sent();
                            return [
                                2,
                                _this1.serviceResponse(HttpStatusCode.Ok, {}, 'Lead status has been updated')
                            ];
                        case 29:
                            return [
                                2
                            ];
                    }
                });
            })();
        }), _define_property(_this, "changeLeadStatusFromFreshToVarious", function(payload) {
            return _async_to_generator(function() {
                var customerID, leadID, noteli, reason, remark, status, userID, leadStatus, email, lastLeadStatus, mobile, pancard, step, userStepExists, blackListData;
                return _ts_generator(this, function(_state) {
                    switch(_state.label){
                        case 0:
                            customerID = payload.customerID, leadID = payload.leadID, noteli = payload.noteli, reason = payload.reason, remark = payload.remark, status = payload.status, userID = payload.userID, leadStatus = payload.leadStatus, email = payload.email, lastLeadStatus = payload.lastLeadStatus, mobile = payload.mobile, pancard = payload.pancard;
                            if (!(status === LeadStatus.CALLBACK || status === LeadStatus.NOT_INTERESTED || status === LeadStatus.NO_ANSWER || status === LeadStatus.NOT_ELIGIBLE || status === LeadStatus.DUPLICATE || status === LeadStatus.DNC || status === LeadStatus.INCOMPLETE_DOCUMENTS || status === LeadStatus.INTERESTED || status === LeadStatus.DOCUMENT_RECEIVED)) return [
                                3,
                                9
                            ];
                            // const callHistory = await this.callHistoryModel.findOne({
                            //   where: { status, leadID },
                            //   select: ['callHistoryID'],
                            //   order: [{ column: 'callHistoryID', order: 'desc' }],
                            // })
                            // if (callHistory) throw new BadRequestError(`Selected Lead is already in ${status}`)
                            // const callHistoryLog = await this.callHistoryLogsModel.findOne({
                            //   where: { status, leadID },
                            //   select: ['callHistoryID'],
                            //   order: [{ column: 'callHistoryID', order: 'desc' }],
                            // })
                            // if (callHistoryLog) throw new BadRequestError(`Selected Lead is already in ${status}`)
                            return [
                                4,
                                _this1.insertLeadToCallHistory(customerID, leadID, status, userID, remark, noteli)
                            ];
                        case 1:
                            _state.sent();
                            if (!(status === LeadStatus.DOCUMENT_RECEIVED)) return [
                                3,
                                7
                            ];
                            return [
                                4,
                                _this1.stepControlModel.findOne({
                                    where: {
                                        step_name: StepName.FINBOX
                                    },
                                    select: [
                                        'id'
                                    ]
                                })
                            ];
                        case 2:
                            step = _state.sent();
                            if (!step) return [
                                3,
                                7
                            ];
                            return [
                                4,
                                _this1.stepTrackerModel.findOneStepTracker({
                                    customer_id: customerID,
                                    step_id: step.id,
                                    lead_id: leadID
                                }, [
                                    'is_completed',
                                    'id'
                                ])
                            ];
                        case 3:
                            userStepExists = _state.sent();
                            if (!!userStepExists) return [
                                3,
                                5
                            ];
                            return [
                                4,
                                _this1.stepTrackerModel.insert({
                                    customer_id: customerID,
                                    step_id: step.id,
                                    is_completed: true,
                                    lead_id: leadID
                                })
                            ];
                        case 4:
                            _state.sent();
                            return [
                                3,
                                7
                            ];
                        case 5:
                            if (!!userStepExists.is_completed) return [
                                3,
                                7
                            ];
                            return [
                                4,
                                _this1.stepTrackerModel.findOneAndUpdate({
                                    id: userStepExists.id
                                }, {
                                    is_completed: true
                                })
                            ];
                        case 6:
                            _state.sent();
                            _state.label = 7;
                        case 7:
                            return [
                                4,
                                _this1.leadModel.findOneAndUpdate({
                                    leadID: leadID
                                }, {
                                    status: status
                                })
                            ];
                        case 8:
                            _state.sent();
                            return [
                                2,
                                _this1.serviceResponse(HttpStatusCode.Ok, {}, 'Lead status has been updated')
                            ];
                        case 9:
                            if (!(status === LeadStatus.BLACK_LISTED)) return [
                                3,
                                12
                            ];
                            // const callHistory = await this.callHistoryModel.findOne({
                            //   where: { status, leadID },
                            //   select: ['callHistoryID'],
                            //   order: [{ column: 'callHistoryID', order: 'desc' }],
                            // })
                            // if (callHistory) throw new BadRequestError(`Selected Lead is already in ${status}`)
                            // const callHistoryLogs = await this.callHistoryLogsModel.findOne({
                            //   where: { status, leadID },
                            //   select: ['callHistoryID'],
                            //   order: [{ column: 'callHistoryID', order: 'desc' }],
                            // })
                            // if (callHistoryLogs) throw new BadRequestError(`Selected Lead is already in ${status}`)
                            return [
                                4,
                                _this1.insertLeadToCallHistory(customerID, leadID, 'blacklisted', userID, 'blacklist', noteli)
                            ];
                        case 10:
                            _state.sent();
                            blackListData = {
                                pancard: pancard,
                                status: 'Active',
                                addBy: userID
                            };
                            return [
                                4,
                                Promise.all([
                                    _this1.blackListCustomerPancardModel.create(blackListData),
                                    _this1.leadModel.findOneAndUpdate({
                                        customerID: customerID,
                                        leadID: leadID
                                    }, {
                                        status: status
                                    }),
                                    _this1.mobileTokenModel.findOneAndUpdate({
                                        mobile: mobile.toString()
                                    }, {
                                        access_token: LeadStatus.BLACK_LISTED
                                    })
                                ])
                            ];
                        case 11:
                            _state.sent();
                            return [
                                2,
                                _this1.serviceResponse(HttpStatusCode.Ok, {}, 'Lead status has been updated')
                            ];
                        case 12:
                            throw new BadRequestError("Customer cannot be moved from ".concat(leadStatus, " to ").concat(status));
                    }
                });
            })();
        }), _define_property(_this, "bankUpdateCheck", function(payload, leadID, userID, clientIp) {
            return _async_to_generator(function() {
                var IsEmandateGreaterEqualToLoanAmount, isAddressAndEmploymentDetailsPresent, isCustomerTransferSalaryToAnotherAccount, isLoanAmountVerified, isPanAadharSelfieVerified, isPennyDropCompleted, isRepaymentDateVerified, isSelfieClear, loanAcceptanceMode, isReference1Verified, isReference2Verified, primaryAccountId, secondaryAccountId, lead, status, customerID, dataToSave, _ref, data, message, statusCode;
                return _ts_generator(this, function(_state) {
                    switch(_state.label){
                        case 0:
                            IsEmandateGreaterEqualToLoanAmount = payload.IsEmandateGreaterEqualToLoanAmount, isAddressAndEmploymentDetailsPresent = payload.isAddressAndEmploymentDetailsPresent, isCustomerTransferSalaryToAnotherAccount = payload.isCustomerTransferSalaryToAnotherAccount, isLoanAmountVerified = payload.isLoanAmountVerified, isPanAadharSelfieVerified = payload.isPanAadharSelfieVerified, isPennyDropCompleted = payload.isPennyDropCompleted, isRepaymentDateVerified = payload.isRepaymentDateVerified, isSelfieClear = payload.isSelfieClear, loanAcceptanceMode = payload.loanAcceptanceMode, isReference1Verified = payload.isReference1Verified, isReference2Verified = payload.isReference2Verified, primaryAccountId = payload.primaryAccountId, secondaryAccountId = payload.secondaryAccountId;
                            return [
                                4,
                                _this1.leadModel.findOne({
                                    where: {
                                        leadID: leadID
                                    },
                                    select: [
                                        'customerID',
                                        'status'
                                    ]
                                })
                            ];
                        case 1:
                            lead = _state.sent();
                            if (!lead) throw new NotFoundError('This lead does not exist');
                            status = lead.status, customerID = lead.customerID;
                            if (status !== LeadStatus.APPROVED) throw new BadRequestError("Customer cannot be moved from ".concat(status, " to ").concat(LeadStatus.DISBURSAL_SHEET_SEND));
                            dataToSave = _object_spread_props(_object_spread({}, payload), {
                                customerID: customerID,
                                leadID: leadID,
                                userID: userID
                            });
                            return [
                                4,
                                _this1.bankUpdateCheckModel.insert({
                                    customerID: customerID,
                                    leadID: leadID,
                                    data: JSON.stringify(dataToSave)
                                })
                            ];
                        case 2:
                            _state.sent();
                            return [
                                4,
                                _this1.bankUpdate({
                                    accountID: primaryAccountId,
                                    accountType: 'old'
                                }, leadID, userID, clientIp)
                            ];
                        case 3:
                            _ref = _state.sent(), data = _ref.data, message = _ref.message, statusCode = _ref.statusCode;
                            return [
                                2,
                                _this1.serviceResponse(statusCode, data, message)
                            ];
                    }
                });
            })();
        }), _define_property(_this, "bankUpdate", function(payload, leadID, userID, clientIp) {
            return _async_to_generator(function() {
                var _contactResp_data_batch_id, accountID, accountNo, accountType, bankName, ifsc, lead, customerID, bankIfsc, account, _ref, accountId, bankIfsc1, loanNo, approval, customer, name, mobile, email, currentDate, repayDate, dateDiff, note, referenceId, contactId, loanExists, loanExists1, note1, referenceId1, createContactPayload, contactResp, createFundAccountPayload, createFundAccountResp, loanExists2;
                return _ts_generator(this, function(_state) {
                    switch(_state.label){
                        case 0:
                            accountID = payload.accountID, accountNo = payload.accountNo, accountType = payload.accountType, bankName = payload.bankName, ifsc = payload.ifsc;
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
                            if (!lead) throw new NotFoundError('This lead does not exist');
                            customerID = lead.customerID;
                            if (!(accountType === 'new')) return [
                                3,
                                3
                            ];
                            return [
                                4,
                                _this1.bankIfscModel.findOne({
                                    where: {
                                        IFSC: ifsc,
                                        is_active: '0'
                                    },
                                    select: [
                                        'id'
                                    ]
                                })
                            ];
                        case 2:
                            bankIfsc = _state.sent();
                            if (bankIfsc) throw new BadRequestError('This bank account is inactive, Please select another bank');
                            _state.label = 3;
                        case 3:
                            if (!(accountType === 'old')) return [
                                3,
                                5
                            ];
                            return [
                                4,
                                _this1.customerAccountModel.findOne({
                                    where: {
                                        accountID: accountID
                                    },
                                    select: [
                                        'bankIfsc',
                                        'accountNo',
                                        'accountType',
                                        'bank',
                                        'bankBranch'
                                    ]
                                })
                            ];
                        case 4:
                            account = _state.sent();
                            return [
                                3,
                                8
                            ];
                        case 5:
                            return [
                                4,
                                _this1.customerAccountModel.insert({
                                    accountNo: accountNo,
                                    accountType: BankAccountType.SAVING,
                                    bankIfsc: ifsc,
                                    bank: bankName,
                                    bankBranch: 'N/A',
                                    ip: clientIp,
                                    credatedBy: +config.defaultUserId,
                                    // bank_holder_name: accountHoldersName,
                                    customerID: customerID,
                                    leadID: leadID,
                                    status: BankAccountStatus.VERIFIED,
                                    is_credit: '1'
                                })
                            ];
                        case 6:
                            _ref = _sliced_to_array.apply(void 0, [
                                _state.sent(),
                                1
                            ]), accountId = _ref[0];
                            return [
                                4,
                                _this1.customerAccountModel.findOne({
                                    where: {
                                        accountID: accountId
                                    },
                                    select: [
                                        'bankIfsc',
                                        'accountNo',
                                        'accountType',
                                        'bank',
                                        'bankBranch'
                                    ]
                                })
                            ];
                        case 7:
                            account = _state.sent();
                            _state.label = 8;
                        case 8:
                            if (!account) throw new BadRequestError('Invalid account');
                            return [
                                4,
                                _this1.bankIfscModel.findOne({
                                    where: {
                                        IFSC: account.bankIfsc,
                                        is_active: '0'
                                    },
                                    select: [
                                        'id'
                                    ]
                                })
                            ];
                        case 9:
                            bankIfsc1 = _state.sent();
                            if (bankIfsc1) throw new BadRequestError('This bank account is inactive, Please select another bank');
                            loanNo = createLoanNumber();
                            return [
                                4,
                                _this1.approvalModel.findOneApproval({
                                    customerID: customerID,
                                    leadID: leadID
                                }, [
                                    'repayDate',
                                    'loanAmtApproved',
                                    'adminFee',
                                    'GstOfAdminFee'
                                ])
                            ];
                        case 10:
                            approval = _state.sent();
                            if (!approval) throw new NotFoundError('No approval found for this lead');
                            return [
                                4,
                                _this1.customerModel.findOneCustomer({
                                    customerID: customerID
                                }, [
                                    'name',
                                    'mobile',
                                    'email'
                                ])
                            ];
                        case 11:
                            customer = _state.sent();
                            if (!customer) throw new NotFoundError('This customer does not exist');
                            name = customer.name, mobile = customer.mobile, email = customer.email;
                            currentDate = moment().startOf('day');
                            repayDate = moment(approval.repayDate);
                            dateDiff = repayDate.diff(currentDate, 'days');
                            if (dateDiff < 6) {
                                throw new BadRequestError('Repay date cannot be less than 6 days');
                            }
                            if (!(config.nodeEnv === 'staging' || config.nodeEnv === 'development')) return [
                                3,
                                20
                            ];
                            note = "".concat(name, "-").concat(leadID, "-").concat(generateRandomNumber(1111, 9999));
                            referenceId = "".concat(name, "-").concat(mobile);
                            contactId = generateRandomId('cont');
                            return [
                                4,
                                Promise.all([
                                    _this1.razorPayPayoutContactsModel.create({
                                        customerID: customerID.str,
                                        leadID: leadID.str,
                                        cont_id: contactId,
                                        cont_entity: 'contact',
                                        cont_name: name,
                                        cont_contact: mobile.str,
                                        cont_email: email,
                                        cont_type: 'customer',
                                        cont_reference_id: referenceId,
                                        cont_batch_id: '',
                                        cont_active: '1',
                                        cont_notes_key_1: note,
                                        cont_notes_key_2: note,
                                        createdDate: moment().format('YYYY-MM-DD HH:mm:ss'),
                                        uid: userID.str
                                    }),
                                    _this1.razorpayPayoutAccountsModel.insert({
                                        customerID: customerID.str,
                                        leadID: leadID.str,
                                        acc_id: generateRandomId('fa'),
                                        entity: 'fund_account',
                                        contact_id: contactId,
                                        account_type: 'bank_account',
                                        ifsc: account.bankIfsc,
                                        bank_name: account.bank,
                                        name: name,
                                        account_number: account.accountNo,
                                        active: '1',
                                        batch_id: '',
                                        createdDate: moment().format('YYYY-MM-DD HH:mm:ss'),
                                        uid: userID.str
                                    })
                                ])
                            ];
                        case 12:
                            _state.sent();
                            return [
                                4,
                                _this1.insertLeadToCallHistory(customerID, leadID, LeadStatus.DISBURSAL_SHEET_SEND, userID)
                            ];
                        case 13:
                            _state.sent();
                            return [
                                4,
                                _this1.loanModel.findOneLoan({
                                    leadID: leadID
                                })
                            ];
                        case 14:
                            loanExists = _state.sent();
                            _state.label = 15;
                        case 15:
                            return [
                                4,
                                _this1.loanModel.findOneLoan({
                                    loanNo: loanNo
                                })
                            ];
                        case 16:
                            loanExists1 = _state.sent();
                            if (loanExists1) {
                                loanNo = createLoanNumber();
                                return [
                                    3,
                                    18
                                ];
                            }
                            _state.label = 17;
                        case 17:
                            if (loanExists) return [
                                3,
                                15
                            ];
                            _state.label = 18;
                        case 18:
                            return [
                                4,
                                Promise.all([
                                    _this1.loanModel.create({
                                        leadID: leadID,
                                        loanNo: loanNo,
                                        customerID: customerID,
                                        disbursalAmount: approval.loanAmtApproved,
                                        disbursalDate: '0000-00-00',
                                        disbursalRefrenceNo: '',
                                        accountNo: account.accountNo,
                                        accountType: account.accountType,
                                        bankIfsc: account.bankIfsc,
                                        bank: account.bank,
                                        bankBranch: account.bankBranch,
                                        chequeDetails: '',
                                        pdDate: moment().format('YYYY-MM-DD'),
                                        pdDoneBy: userID.str,
                                        deduction: approval.adminFee + approval.GstOfAdminFee,
                                        remarks: '',
                                        status: LoanStatus.DISBURSAL_SHEET_SENT,
                                        companyAccountNo: config.companyAccountNo,
                                        ip: clientIp,
                                        disbursedBy: +config.defaultUserId
                                    }),
                                    _this1.leadModel.findOneAndUpdate({
                                        leadID: leadID
                                    }, {
                                        status: LeadStatus.DISBURSAL_SHEET_SEND,
                                        alloUID: '0'
                                    })
                                ])
                            ];
                        case 19:
                            _state.sent();
                            return [
                                2,
                                _this1.serviceResponse(HttpStatusCode.Ok, {}, 'Bank Update success')
                            ];
                        case 20:
                            note1 = "".concat(name, "-").concat(leadID, "-").concat(generateRandomNumber(1111, 9999));
                            referenceId1 = "".concat(name, "-").concat(mobile);
                            createContactPayload = {
                                contact: mobile,
                                email: email,
                                name: name,
                                notes: {
                                    notes_key_1: note1,
                                    notes_key_2: note1
                                },
                                reference_id: referenceId1.substring(0, 39),
                                type: RazorPayContactType.CUSTOMER
                            };
                            return [
                                4,
                                _this1.razorPayPayments.createContact(customerID, Number(leadID), createContactPayload)
                            ];
                        case 21:
                            contactResp = _state.sent();
                            if (!contactResp.success) {
                                throw new BadRequestError('There was an issue while updating bank, Please try again later!');
                            }
                            // Now hit fund_account to create user's fund account
                            createFundAccountPayload = {
                                contact_id: contactResp.data.id,
                                account_type: 'bank_account',
                                bank_account: {
                                    account_number: account.accountNo,
                                    ifsc: account.bankIfsc,
                                    name: name
                                }
                            };
                            return [
                                4,
                                _this1.razorPayPayments.createFundAccount(customerID, Number(leadID), createFundAccountPayload)
                            ];
                        case 22:
                            createFundAccountResp = _state.sent();
                            if (!contactResp.success) {
                                throw new BadRequestError('There was an issue while updating bank, Please try again later!');
                            }
                            return [
                                4,
                                Promise.all([
                                    _this1.razorPayPayoutContactsModel.create({
                                        customerID: customerID.str,
                                        leadID: leadID.str,
                                        cont_id: contactResp.data.id,
                                        cont_entity: contactResp.data.entity,
                                        cont_name: contactResp.data.name,
                                        cont_contact: contactResp.data.contact,
                                        cont_email: contactResp.data.email,
                                        cont_type: contactResp.data.type,
                                        cont_reference_id: contactResp.data.reference_id,
                                        cont_batch_id: (_contactResp_data_batch_id = contactResp.data.batch_id) !== null && _contactResp_data_batch_id !== void 0 ? _contactResp_data_batch_id : '',
                                        cont_active: contactResp.data.active ? '1' : '0',
                                        cont_notes_key_1: contactResp.data.notes ? contactResp.data.notes.notes_key_1 : '',
                                        cont_notes_key_2: contactResp.data.notes ? contactResp.data.notes.notes_key_2 : '',
                                        createdDate: moment().format('YYYY-MM-DD HH:mm:ss'),
                                        uid: userID.str
                                    }),
                                    _this1.razorpayPayoutAccountsModel.insert({
                                        customerID: customerID.str,
                                        leadID: leadID.str,
                                        acc_id: createFundAccountResp.data.id,
                                        entity: createFundAccountResp.data.entity,
                                        contact_id: createFundAccountResp.data.contact_id,
                                        account_type: createFundAccountResp.data.account_type,
                                        ifsc: createFundAccountResp.data.bank_account.ifsc,
                                        bank_name: createFundAccountResp.data.bank_account.bank_name,
                                        name: createFundAccountResp.data.bank_account.name,
                                        account_number: createFundAccountResp.data.bank_account.account_number,
                                        active: createFundAccountResp.data.active ? '1' : '0',
                                        batch_id: '',
                                        createdDate: moment().format('YYYY-MM-DD HH:mm:ss'),
                                        uid: userID.str
                                    })
                                ])
                            ];
                        case 23:
                            _state.sent();
                            return [
                                4,
                                _this1.insertLeadToCallHistory(customerID, leadID, LeadStatus.DISBURSAL_SHEET_SEND, userID)
                            ];
                        case 24:
                            _state.sent();
                            return [
                                4,
                                _this1.loanModel.findOneLoan({
                                    leadID: leadID
                                })
                            ];
                        case 25:
                            loanExists2 = _state.sent();
                            _state.label = 26;
                        case 26:
                            return [
                                4,
                                _this1.loanModel.findOneLoan({
                                    loanNo: loanNo
                                })
                            ];
                        case 27:
                            loanExists2 = _state.sent();
                            if (loanExists2) {
                                loanNo = createLoanNumber();
                                return [
                                    3,
                                    29
                                ];
                            }
                            _state.label = 28;
                        case 28:
                            if (loanExists2) return [
                                3,
                                26
                            ];
                            _state.label = 29;
                        case 29:
                            return [
                                4,
                                Promise.all([
                                    _this1.loanModel.create({
                                        leadID: leadID,
                                        loanNo: loanNo,
                                        customerID: customerID,
                                        disbursalAmount: approval.loanAmtApproved,
                                        disbursalDate: '0000-00-00',
                                        disbursalRefrenceNo: '',
                                        accountNo: account.accountNo,
                                        accountType: account.accountType,
                                        bankIfsc: account.bankIfsc,
                                        bank: account.bank,
                                        bankBranch: account.bankBranch,
                                        chequeDetails: '',
                                        pdDate: '',
                                        pdDoneBy: '',
                                        deduction: approval.adminFee + approval.GstOfAdminFee,
                                        remarks: '',
                                        status: LoanStatus.DISBURSAL_SHEET_SENT,
                                        companyAccountNo: config.companyAccountNo,
                                        ip: clientIp,
                                        disbursedBy: +config.defaultUserId
                                    }),
                                    _this1.leadModel.findOneAndUpdate({
                                        leadID: leadID
                                    }, {
                                        status: LeadStatus.DISBURSAL_SHEET_SEND,
                                        alloUID: '0'
                                    })
                                ])
                            ];
                        case 30:
                            _state.sent();
                            return [
                                2,
                                _this1.serviceResponse(HttpStatusCode.Ok, {}, 'Bank Update success')
                            ];
                    }
                });
            })();
        }), _define_property(_this, "getBankUpdateData", function(leadID) {
            return _async_to_generator(function() {
                var checks, panCheck, aadharCheck, selfieCheck, lead, customerID, customer, approval, aadharExists, digilockerExists, selfieStepCheck, _resp_result, _resp_result1, resp, address, employer, emd, pennyData, customerAccount, emd1, approval1, pennyData1, _resp_result2, _resp_result3, resp1, references, finalPayload;
                return _ts_generator(this, function(_state) {
                    switch(_state.label){
                        case 0:
                            checks = {
                                panAadharSelfie: false,
                                addressAndEmployer: false,
                                pennyDrop: false,
                                emdCheck: false,
                                selfieClear: false,
                                repaymentDate: moment().startOf('day').add(6, 'days').format('Do MMMM, YYYY'),
                                loanAmountApproved: 0,
                                reference: null
                            };
                            panCheck = false, aadharCheck = false, selfieCheck = false;
                            return [
                                4,
                                _this1.leadModel.findOne({
                                    where: {
                                        leadID: leadID
                                    },
                                    select: [
                                        'em_id',
                                        'customerID'
                                    ]
                                })
                            ];
                        case 1:
                            lead = _state.sent();
                            if (!lead) throw new NotFoundError('This lead does not exists');
                            customerID = lead.customerID;
                            return [
                                4,
                                _this1.customerModel.findOneCustomer({
                                    customerID: customerID
                                }, [
                                    'customerID',
                                    'aadharNo',
                                    'pancard',
                                    'mobile',
                                    'gender',
                                    'employeeType',
                                    'salary_date',
                                    'name',
                                    'pan_cust_verified'
                                ])
                            ];
                        case 2:
                            customer = _state.sent();
                            if (customer.pan_cust_verified == 1) {
                                panCheck = true;
                            }
                            return [
                                4,
                                _this1.approvalModel.findOneApproval({
                                    customerID: customerID,
                                    leadID: leadID
                                }, [
                                    'loanAmtApproved',
                                    'repayDate'
                                ])
                            ];
                        case 3:
                            approval = _state.sent();
                            if (!customer.aadharNo) return [
                                3,
                                5
                            ];
                            return [
                                4,
                                leadsApiLogModel.count({
                                    where: {
                                        status: 1,
                                        api_type: LeadLogApiType.AADHAR_V2_SUBMIT_OTP,
                                        api_supplier: ApiSupplierType.SUREPASS,
                                        aadharNo: customer.aadharNo.str,
                                        mobile_no: String(customer.mobile)
                                    }
                                })
                            ];
                        case 4:
                            aadharExists = _state.sent();
                            _state.label = 5;
                        case 5:
                            return [
                                4,
                                leadsApiLogModel.count({
                                    where: {
                                        status: 1,
                                        api_type: LeadLogApiType.DIGILOCKER_EAADHAR,
                                        api_supplier: ApiSupplierType.DECENTRO,
                                        mobile_no: String(customer.mobile)
                                    }
                                })
                            ];
                        case 6:
                            digilockerExists = _state.sent();
                            if (aadharExists || digilockerExists || customer.dob_digit_match == '1') {
                                // Save AADHAR Step
                                aadharCheck = true;
                            }
                            return [
                                4,
                                leadsApiLogModel.findOneLeadsApiLog({
                                    api_type: 'face-match',
                                    api_supplier: 5,
                                    status: 1,
                                    mobile_no: String(customer.mobile)
                                }, [
                                    'api_response'
                                ], [
                                    {
                                        column: 'id',
                                        order: 'desc'
                                    }
                                ])
                            ];
                        case 7:
                            selfieStepCheck = _state.sent();
                            if (selfieStepCheck) {
                                // Save selfie step
                                if (selfieStepCheck.api_response) {
                                    ;
                                    resp = JSON.parse(selfieStepCheck.api_response);
                                    if ((resp === null || resp === void 0 ? void 0 : (_resp_result = resp.result) === null || _resp_result === void 0 ? void 0 : _resp_result.is_same_face) && (resp === null || resp === void 0 ? void 0 : (_resp_result1 = resp.result) === null || _resp_result1 === void 0 ? void 0 : _resp_result1.person_image_correctly_identified)) {
                                        selfieCheck = true;
                                    }
                                }
                            }
                            return [
                                4,
                                _this1.addressModel.count({
                                    where: {
                                        customerID: customerID
                                    }
                                })
                            ];
                        case 8:
                            address = _state.sent();
                            return [
                                4,
                                _this1.employerModel.count({
                                    where: {
                                        customerID: customerID
                                    }
                                })
                            ];
                        case 9:
                            employer = _state.sent();
                            if (!lead.em_id) return [
                                3,
                                13
                            ];
                            return [
                                4,
                                _this1.razorpayMandateModel.findOne({
                                    where: {
                                        id: lead.em_id
                                    },
                                    select: [
                                        'accountNo',
                                        'ifsc',
                                        'emMaxamount'
                                    ],
                                    order: [
                                        {
                                            column: 'id',
                                            order: 'desc'
                                        }
                                    ]
                                })
                            ];
                        case 10:
                            emd = _state.sent();
                            if (!emd) {
                                checks.emdCheck = false;
                            }
                            if (!approval) {
                                checks.emdCheck = false;
                            }
                            if ((emd === null || emd === void 0 ? void 0 : emd.emMaxamount) >= (approval === null || approval === void 0 ? void 0 : approval.loanAmtApproved) * 2.5) {
                                checks.emdCheck = true;
                            }
                            if (!(emd === null || emd === void 0 ? void 0 : emd.accountNo)) return [
                                3,
                                12
                            ];
                            return [
                                4,
                                _this1.pennyDropModel.findOne({
                                    where: {
                                        account_number: emd.accountNo,
                                        customerID: customerID,
                                        account_status: 'active',
                                        penny_status: PennyStatus.COMPLETED
                                    },
                                    order: [
                                        {
                                            column: 'id',
                                            order: 'desc'
                                        }
                                    ]
                                })
                            ];
                        case 11:
                            pennyData = _state.sent();
                            if (pennyData) {
                                checks.pennyDrop = true;
                            }
                            _state.label = 12;
                        case 12:
                            return [
                                3,
                                18
                            ];
                        case 13:
                            return [
                                4,
                                _this1.customerAccountModel.findOne({
                                    where: {
                                        customerID: customerID,
                                        is_credit: '1'
                                    },
                                    select: [
                                        'accountNo'
                                    ],
                                    order: [
                                        {
                                            column: 'accountID',
                                            order: 'desc'
                                        }
                                    ]
                                })
                            ];
                        case 14:
                            customerAccount = _state.sent();
                            if (!customerAccount) return [
                                3,
                                18
                            ];
                            return [
                                4,
                                _this1.razorpayMandateModel.findOne({
                                    where: {
                                        id: lead.em_id
                                    },
                                    select: [
                                        'accountNo',
                                        'ifsc',
                                        'emMaxamount'
                                    ],
                                    order: [
                                        {
                                            column: 'id',
                                            order: 'desc'
                                        }
                                    ]
                                })
                            ];
                        case 15:
                            emd1 = _state.sent();
                            if (!emd1) return [
                                3,
                                18
                            ];
                            return [
                                4,
                                _this1.approvalModel.findOneApproval({
                                    customerID: customerID,
                                    leadID: leadID
                                }, [
                                    'loanAmtApproved'
                                ])
                            ];
                        case 16:
                            approval1 = _state.sent();
                            if (approval1) {
                                if ((emd1 === null || emd1 === void 0 ? void 0 : emd1.emMaxamount) >= (approval1 === null || approval1 === void 0 ? void 0 : approval1.loanAmtApproved) * 2.5) {
                                    checks.emdCheck = true;
                                }
                            }
                            if (!(emd1 === null || emd1 === void 0 ? void 0 : emd1.accountNo)) return [
                                3,
                                18
                            ];
                            return [
                                4,
                                _this1.pennyDropModel.findOne({
                                    where: {
                                        account_number: emd1.accountNo,
                                        customerID: customerID,
                                        account_status: 'active',
                                        penny_status: PennyStatus.COMPLETED
                                    },
                                    order: [
                                        {
                                            column: 'id',
                                            order: 'desc'
                                        }
                                    ]
                                })
                            ];
                        case 17:
                            pennyData1 = _state.sent();
                            if (pennyData1) {
                                checks.pennyDrop = true;
                            }
                            _state.label = 18;
                        case 18:
                            if (selfieStepCheck) {
                                // Save selfie step
                                if (selfieStepCheck.api_response) {
                                    ;
                                    resp1 = JSON.parse(selfieStepCheck.api_response);
                                    if ((resp1 === null || resp1 === void 0 ? void 0 : (_resp_result2 = resp1.result) === null || _resp_result2 === void 0 ? void 0 : _resp_result2.is_same_face) && (resp1 === null || resp1 === void 0 ? void 0 : (_resp_result3 = resp1.result) === null || _resp_result3 === void 0 ? void 0 : _resp_result3.person_image_correctly_identified)) {
                                        checks.selfieClear = true;
                                    }
                                }
                            }
                            if (selfieCheck && aadharCheck && panCheck) checks.panAadharSelfie = true;
                            if (address && employer) checks.addressAndEmployer = true;
                            if (approval === null || approval === void 0 ? void 0 : approval.repayDate) {
                                checks.repaymentDate = moment(approval.repayDate).startOf('day').format('Do MMMM, YYYY');
                            }
                            if (approval === null || approval === void 0 ? void 0 : approval.loanAmtApproved) {
                                checks.loanAmountApproved = approval.loanAmtApproved;
                            }
                            return [
                                4,
                                _this1.referenceModel.find({
                                    where: {
                                        customerID: customerID
                                    },
                                    select: [
                                        'contactNo',
                                        'is_verified',
                                        'name',
                                        'relation'
                                    ],
                                    paginate: {
                                        page: 1,
                                        perPage: 2
                                    }
                                })
                            ];
                        case 19:
                            references = _state.sent();
                            checks.reference = references;
                            finalPayload = {
                                details: [
                                    {
                                        addressAndEmployer: checks.addressAndEmployer
                                    },
                                    {
                                        emdCheck: checks.emdCheck
                                    },
                                    {
                                        panAadharSelfie: checks.panAadharSelfie
                                    },
                                    {
                                        pennyDrop: checks.pennyDrop
                                    },
                                    {
                                        selfieClear: checks.selfieClear
                                    }
                                ],
                                reference: checks.reference,
                                loanDetails: {
                                    repaymentDate: checks.repaymentDate,
                                    loanAmount: checks.loanAmountApproved
                                }
                            };
                            return [
                                2,
                                _this1.serviceResponse(HttpStatusCode.Ok, finalPayload, 'Data retrieved')
                            ];
                    }
                });
            })();
        }), _define_property(_this, "razorpayDisbursalData", function(leadID) {
            return _async_to_generator(function() {
                var lead, _ref, rpayData, loan, _, _tmp, data;
                return _ts_generator(this, function(_state) {
                    switch(_state.label){
                        case 0:
                            return [
                                4,
                                _this1.leadModel.findOne({
                                    where: {
                                        leadID: leadID
                                    },
                                    select: [
                                        'leadID',
                                        'customerID'
                                    ]
                                })
                            ];
                        case 1:
                            lead = _state.sent();
                            if (!lead) throw new NotFoundError('This lead does not exist');
                            _ = Promise.all;
                            _tmp = [
                                _this1.razorpayPayoutAccountsModel.findOne({
                                    where: {
                                        leadID: leadID.str
                                    },
                                    select: [
                                        'bank_name',
                                        'account_number',
                                        'ifsc'
                                    ],
                                    order: [
                                        {
                                            column: 'payaccID',
                                            order: 'desc'
                                        }
                                    ]
                                })
                            ];
                            return [
                                4,
                                _this1.loanModel.findOneLoan({
                                    leadID: leadID,
                                    disbursalRefrenceNo: '',
                                    status: LoanStatus.DISBURSAL_SHEET_SENT
                                }, [
                                    'disbursalAmount',
                                    'deduction'
                                ])
                            ];
                        case 2:
                            return [
                                4,
                                _.apply(Promise, [
                                    _tmp.concat([
                                        _state.sent()
                                    ])
                                ])
                            ];
                        case 3:
                            _ref = _sliced_to_array.apply(void 0, [
                                _state.sent(),
                                2
                            ]), rpayData = _ref[0], loan = _ref[1];
                            if (!loan) throw new NotFoundError('Loan details not found');
                            if (!rpayData) throw new NotFoundError('Razorpay details not found');
                            data = _object_spread_props(_object_spread({}, rpayData), {
                                disbursalAmount: loan.disbursalAmount - loan.deduction
                            });
                            return [
                                2,
                                _this1.serviceResponse(HttpStatusCode.Ok, data, 'Data Fetched')
                            ];
                    }
                });
            })();
        }), _define_property(_this, "razorpayDisbursal", function(leadID) {
            return _async_to_generator(function() {
                var lead, status, _ref, rpayPayout, loan, disbursalJobCount;
                return _ts_generator(this, function(_state) {
                    switch(_state.label){
                        case 0:
                            return [
                                4,
                                _this1.leadModel.findOne({
                                    where: {
                                        leadID: leadID
                                    },
                                    select: [
                                        'leadID',
                                        'customerID',
                                        'status'
                                    ]
                                })
                            ];
                        case 1:
                            lead = _state.sent();
                            if (!lead) throw new NotFoundError('This lead does not exist');
                            status = lead.status;
                            if (status !== LeadStatus.DISBURSAL_SHEET_SEND) throw new BadRequestError("Customer cannot be moved from ".concat(status, " to ").concat(LeadStatus.DISBURSED));
                            return [
                                4,
                                Promise.all([
                                    _this1.razorpayPayoutDisbursedAmountModel.findOne({
                                        where: {
                                            leadID: leadID.str
                                        }
                                    }),
                                    _this1.loanModel.findOneLoan({
                                        leadID: leadID,
                                        disbursalRefrenceNo: '',
                                        status: LoanStatus.DISBURSAL_SHEET_SENT
                                    })
                                ])
                            ];
                        case 2:
                            _ref = _sliced_to_array.apply(void 0, [
                                _state.sent(),
                                2
                            ]), rpayPayout = _ref[0], loan = _ref[1];
                            if (!loan) throw new NotFoundError('User loan details were not found');
                            if (rpayPayout) throw new NotFoundError('Payout already in progress');
                            return [
                                4,
                                _this1.disbursalJobsModel.count({
                                    where: {
                                        leadID: leadID
                                    }
                                })
                            ];
                        case 3:
                            disbursalJobCount = _state.sent();
                            if (disbursalJobCount > 0) throw new NotFoundError('Payout already in progress');
                            return [
                                4,
                                _this1.loanService.createAutoDisbursal(leadID)
                            ];
                        case 4:
                            _state.sent();
                            return [
                                2,
                                _this1.serviceResponse(HttpStatusCode.Ok, {}, 'Success')
                            ];
                    }
                });
            })();
        }), _define_property(_this, "disbursalUpdate", function(payload, leadID, userID) {
            return _async_to_generator(function() {
                var disbursalDate, disbursalReferenceNo, remarks, lead, customerID, status, dateOfDisbursal, credit;
                return _ts_generator(this, function(_state) {
                    switch(_state.label){
                        case 0:
                            disbursalDate = payload.disbursalDate, disbursalReferenceNo = payload.disbursalReferenceNo, remarks = payload.remarks;
                            return [
                                4,
                                _this1.leadModel.findOne({
                                    where: {
                                        leadID: leadID
                                    },
                                    select: [
                                        'leadID',
                                        'customerID',
                                        'status'
                                    ]
                                })
                            ];
                        case 1:
                            lead = _state.sent();
                            if (!lead) throw new NotFoundError('This lead does not exist');
                            customerID = lead.customerID, status = lead.status;
                            dateOfDisbursal = moment(disbursalDate).utcOffset(330).startOf('day').format('YYYY-MM-DD');
                            return [
                                4,
                                _this1.loanModel.findOneAndUpdate({
                                    leadID: leadID
                                }, {
                                    disbursalDate: dateOfDisbursal,
                                    disbursalTime: moment().format('HH:mm:ss'),
                                    disbursalRefrenceNo: disbursalReferenceNo,
                                    remarks: remarks,
                                    status: LoanStatus.DISBURSED,
                                    is_manual: '1',
                                    manual_date: dateOfDisbursal,
                                    utr: disbursalReferenceNo,
                                    payout_status: 2,
                                    disbursedBy: userID
                                })
                            ];
                        case 2:
                            _state.sent();
                            return [
                                4,
                                _this1.transactionService.manageTransactions({
                                    leadID: leadID,
                                    type: 'disbursal',
                                    collectionID: null,
                                    gateway: TransactionGateway.MANUAL
                                })
                            ];
                        case 3:
                            _state.sent();
                            return [
                                4,
                                _this1.callHistoryLogsModel.insert({
                                    customerID: customerID,
                                    leadID: leadID,
                                    callType: CallType.IVR,
                                    status: LeadStatus.DISBURSED,
                                    remark: remarks !== null && remarks !== void 0 ? remarks : '',
                                    noteli: '',
                                    callbackTime: moment().startOf('day').format('YYYY-MM-DD'),
                                    calledBy: userID
                                })
                            ];
                        case 4:
                            _state.sent();
                            return [
                                4,
                                _this1.leadModel.findOneAndUpdate({
                                    leadID: leadID
                                }, {
                                    status: LeadStatus.DISBURSED
                                })
                            ];
                        case 5:
                            _state.sent();
                            return [
                                4,
                                _this1.creditModel.findOneCredit({
                                    customerID: customerID,
                                    leadID: leadID
                                }, [
                                    'creditID',
                                    'principal',
                                    'roi',
                                    'tenure'
                                ], [
                                    {
                                        column: 'creditID',
                                        order: 'desc'
                                    }
                                ])
                            ];
                        case 6:
                            credit = _state.sent();
                            if (!credit) return [
                                3,
                                8
                            ];
                            return [
                                4,
                                _this1.crmService.getDocsRequirements({
                                    creditId: credit.creditID,
                                    loanAmount: credit.principal,
                                    roi: credit.roi,
                                    tenure: credit.tenure
                                })
                            ];
                        case 7:
                            _state.sent();
                            _state.label = 8;
                        case 8:
                            return [
                                2,
                                _this1.serviceResponse(HttpStatusCode.Ok, {}, 'Success')
                            ];
                    }
                });
            })();
        }), _define_property(_this, "loanApplyStatusData", function(leadID) {
            return _async_to_generator(function() {
                var _api_response_result, _pennyDrop_, _pennyDrop_1, _pennyDrop_2, _pennyDrop_3, lead, customer, _ref, references, selfieVideo, emandateStatus, pennyDrop, emandate_details, emandate_details_less, valid_array, valid_array_less, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, es, diffInDays3, approval, lastEmandate, newEmandateAmt, accNo, err, api_response, video, _tmp, data;
                return _ts_generator(this, function(_state) {
                    switch(_state.label){
                        case 0:
                            return [
                                4,
                                _this1.leadModel.findOne({
                                    where: {
                                        leadID: leadID
                                    },
                                    select: [
                                        'leadID',
                                        'customerID',
                                        'kfs'
                                    ]
                                })
                            ];
                        case 1:
                            lead = _state.sent();
                            if (!lead) throw new NotFoundError('This lead does not exist');
                            return [
                                4,
                                _this1.customerModel.findOneCustomer({
                                    customerID: lead.customerID
                                }, [
                                    'mobile'
                                ])
                            ];
                        case 2:
                            customer = _state.sent();
                            if (!customer) throw new NotFoundError('Customer not found');
                            return [
                                4,
                                Promise.all([
                                    _this1.referenceModel.count({
                                        where: {
                                            customerID: lead.customerID
                                        }
                                    }),
                                    _this1.leadApiLogModel.findOneLeadsApiLog({
                                        mobile_no: customer.mobile.str,
                                        api_type: 'face-match',
                                        status: 1
                                    }, [
                                        'api_response'
                                    ], [
                                        {
                                            order: 'desc',
                                            column: 'id'
                                        }
                                    ]),
                                    _this1.razorpayMandateModel.find({
                                        where: {
                                            customerID: lead.customerID
                                        },
                                        whereNot: {
                                            emMaxamount: null
                                        },
                                        whereIn: [
                                            {
                                                column: 'status',
                                                value: [
                                                    'paid',
                                                    'Paid',
                                                    'PAID'
                                                ]
                                            }
                                        ]
                                    }),
                                    _this1.pennyDropModel.find({
                                        where: {
                                            customerID: lead.customerID
                                        },
                                        select: [
                                            'penny_status',
                                            'penny_drop_name_match'
                                        ]
                                    })
                                ])
                            ];
                        case 3:
                            _ref = _sliced_to_array.apply(void 0, [
                                _state.sent(),
                                4
                            ]), references = _ref[0], selfieVideo = _ref[1], emandateStatus = _ref[2], pennyDrop = _ref[3];
                            emandate_details = 'dont show';
                            emandate_details_less = 'dont show';
                            valid_array = new Set();
                            valid_array_less = new Set();
                            _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
                            _state.label = 4;
                        case 4:
                            _state.trys.push([
                                4,
                                9,
                                10,
                                11
                            ]);
                            _iterator = emandateStatus[Symbol.iterator]();
                            _state.label = 5;
                        case 5:
                            if (!!(_iteratorNormalCompletion = (_step = _iterator.next()).done)) return [
                                3,
                                8
                            ];
                            es = _step.value;
                            if (!es) return [
                                3,
                                7
                            ];
                            diffInDays3 = moment().diff(moment(es.credated_date, 'YYYY-MM-DD').startOf('day'), 'days');
                            if (!(diffInDays3 <= 270)) return [
                                3,
                                7
                            ];
                            return [
                                4,
                                _this1.approvalModel.findOne({
                                    where: {
                                        customerID: lead.customerID,
                                        leadID: leadID
                                    }
                                })
                            ];
                        case 6:
                            approval = _state.sent();
                            if (approval) {
                                lastEmandate = es.emMaxamount;
                                newEmandateAmt = approval.loanAmtApproved * 2.5;
                                accNo = es.accountNo;
                                if (lastEmandate >= newEmandateAmt) {
                                    emandate_details = 'show';
                                    valid_array.add(accNo);
                                } else {
                                    emandate_details_less = 'show';
                                    valid_array_less.add(accNo);
                                }
                            }
                            _state.label = 7;
                        case 7:
                            _iteratorNormalCompletion = true;
                            return [
                                3,
                                5
                            ];
                        case 8:
                            return [
                                3,
                                11
                            ];
                        case 9:
                            err = _state.sent();
                            _didIteratorError = true;
                            _iteratorError = err;
                            return [
                                3,
                                11
                            ];
                        case 10:
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
                        case 11:
                            api_response = (selfieVideo === null || selfieVideo === void 0 ? void 0 : selfieVideo.api_response) ? JSON.parse(selfieVideo.api_response) : null;
                            if (!(api_response === null || api_response === void 0 ? void 0 : (_api_response_result = api_response.result) === null || _api_response_result === void 0 ? void 0 : _api_response_result.is_same_face)) return [
                                3,
                                12
                            ];
                            _tmp = true;
                            return [
                                3,
                                14
                            ];
                        case 12:
                            return [
                                4,
                                _this1.appVideoModel.count({
                                    where: {
                                        customerID: lead.customerID,
                                        leadID: leadID
                                    }
                                })
                            ];
                        case 13:
                            _tmp = _state.sent() > 0;
                            _state.label = 14;
                        case 14:
                            video = _tmp;
                            data = {
                                references: references > 0,
                                selfieVideo: video,
                                pennyDrop: ((pennyDrop === null || pennyDrop === void 0 ? void 0 : (_pennyDrop_ = pennyDrop[0]) === null || _pennyDrop_ === void 0 ? void 0 : _pennyDrop_.penny_status) === 'completed' || (pennyDrop === null || pennyDrop === void 0 ? void 0 : (_pennyDrop_1 = pennyDrop[0]) === null || _pennyDrop_1 === void 0 ? void 0 : _pennyDrop_1.penny_status) === 'created') && ((pennyDrop === null || pennyDrop === void 0 ? void 0 : (_pennyDrop_2 = pennyDrop[0]) === null || _pennyDrop_2 === void 0 ? void 0 : _pennyDrop_2.penny_drop_name_match) === '0' || (pennyDrop === null || pennyDrop === void 0 ? void 0 : (_pennyDrop_3 = pennyDrop[0]) === null || _pennyDrop_3 === void 0 ? void 0 : _pennyDrop_3.penny_drop_name_match) === '1'),
                                kfs: lead.kfs === '1',
                                eMandate: emandate_details === 'show'
                            };
                            return [
                                2,
                                _this1.serviceResponse(HttpStatusCode.Ok, data, 'Data Fetched')
                            ];
                    }
                });
            })();
        }), _define_property(_this, "allocateToMe", function(payload, loggedUserId) {
            return _async_to_generator(function() {
                var leadID, customerID, user, res;
                return _ts_generator(this, function(_state) {
                    switch(_state.label){
                        case 0:
                            leadID = payload.leadID, customerID = payload.customerID;
                            // Update lead allocation
                            return [
                                4,
                                _this1.leadModel.findOneAndUpdate({
                                    leadID: leadID
                                }, {
                                    sanctionalloUID: loggedUserId,
                                    alloUID: String(loggedUserId)
                                })
                            ];
                        case 1:
                            _state.sent();
                            return [
                                4,
                                _this1.userModel.findOne({
                                    where: [
                                        {
                                            column: 'userID',
                                            value: loggedUserId
                                        }
                                    ],
                                    select: [
                                        'name'
                                    ]
                                })
                            ];
                        case 2:
                            user = _state.sent();
                            // Create call history log
                            return [
                                4,
                                _this1.callHistoryLogsModel.insert({
                                    customerID: customerID,
                                    leadID: leadID,
                                    callType: 'IVR',
                                    status: 'Lead Allocated',
                                    remark: "Lead Allocated to ".concat((user === null || user === void 0 ? void 0 : user.name) || ''),
                                    noteli: ' ',
                                    calledBy: loggedUserId
                                })
                            ];
                        case 3:
                            _state.sent();
                            if (!(payload.type === 'approved')) return [
                                3,
                                5
                            ];
                            return [
                                4,
                                _this1.assignAgent(leadID, customerID, 'Approved Process')
                            ];
                        case 4:
                            res = _state.sent();
                            if (res.error) {
                                return [
                                    2,
                                    _this1.serviceResponse(HttpStatusCode.InternalServerError, {}, 'Failed to assign agent')
                                ];
                            }
                            return [
                                3,
                                6
                            ];
                        case 5:
                            return [
                                2,
                                _this1.serviceResponse(HttpStatusCode.BadRequest, {}, "Invalid permission_type: Only 'approved' is currently supported")
                            ];
                        case 6:
                            return [
                                2,
                                _this1.serviceResponse(HttpStatusCode.Ok, {}, 'Agent assigned successfully')
                            ];
                    }
                });
            })();
        }), _define_property(_this, "approvalDetails", function(leadID) {
            return _async_to_generator(function() {
                var lead, customer, approval, loanAmtApproved, repayDate, tenure, roi, adminFee, formattedRepayDate, resp;
                return _ts_generator(this, function(_state) {
                    switch(_state.label){
                        case 0:
                            return [
                                4,
                                _this1.leadModel.findOne({
                                    where: {
                                        leadID: leadID
                                    },
                                    select: [
                                        'leadID',
                                        'customerID',
                                        'productID'
                                    ]
                                })
                            ];
                        case 1:
                            lead = _state.sent();
                            return [
                                4,
                                _this1.customerModel.findOneCustomer({
                                    customerID: lead.customerID
                                })
                            ];
                        case 2:
                            customer = _state.sent();
                            if (!lead) throw new NotFoundError('Lead not found');
                            if (!customer) throw new NotFoundError('Customer not found');
                            return [
                                4,
                                _this1.approvalModel.findOneApproval({
                                    leadID: leadID,
                                    customerID: lead.customerID
                                })
                            ];
                        case 3:
                            approval = _state.sent();
                            if (!approval) throw new NotFoundError('Approval details not found');
                            loanAmtApproved = approval.loanAmtApproved, repayDate = approval.repayDate, tenure = approval.tenure, roi = approval.roi, adminFee = approval.adminFee;
                            formattedRepayDate = moment(repayDate);
                            resp = {
                                loanAmtApproved: loanAmtApproved,
                                repayDate: repayDate,
                                tenure: tenure,
                                roi: roi,
                                adminFee: adminFee
                            };
                            if (lead.productID === 1) {
                                resp.repayDate = +formattedRepayDate.format('DD');
                            }
                            return [
                                2,
                                _this1.serviceResponse(HttpStatusCode.Ok, resp, 'Approval details fetched')
                            ];
                    }
                });
            })();
        });
        return _this;
    }
    _create_class(LeadService, [
        {
            key: "leadID",
            value: function leadID(arg0, leadID) {
                throw new Error('Method not implemented.');
            }
        },
        {
            key: "findOne",
            value: function findOne(_0, _1) {
                return _async_to_generator(function(where) {
                    var select, order, LeadData;
                    var _arguments = arguments;
                    return _ts_generator(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                select = _arguments.length > 1 && _arguments[1] !== void 0 ? _arguments[1] : [
                                    '*'
                                ], order = _arguments.length > 2 ? _arguments[2] : void 0;
                                return [
                                    4,
                                    this.leadModel.findOneLead(where, select, order)
                                ];
                            case 1:
                                LeadData = _state.sent();
                                // return this.serviceResponse(200, { LeadData }, 'Amount to be disbursed')
                                return [
                                    2,
                                    LeadData
                                ];
                        }
                    });
                }).apply(this, arguments);
            }
        },
        {
            key: "find",
            value: function find(whereConditions, order, select, skip, take, leadStartDate, leadEndDate) {
                return _async_to_generator(function() {
                    var leads, error;
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
                                    this.leadModel.getLeadData(whereConditions, order, select, skip, take, leadStartDate, leadEndDate)
                                ];
                            case 1:
                                leads = _state.sent();
                                if (leads == null || leads.length == 0) {
                                    return [
                                        2,
                                        null
                                    ];
                                } else {
                                    return [
                                        2,
                                        leads
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
            key: "find_again_no_loan",
            value: function find_again_no_loan(whereConditions, order, select, skip, take, leadStartDate, leadEndDate) {
                return _async_to_generator(function() {
                    var leads, error;
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
                                    this.leadModel.getAgainNoLoanLeadData(whereConditions, order, select, skip, take, leadStartDate, leadEndDate)
                                ];
                            case 1:
                                leads = _state.sent();
                                if (leads == null || leads.length == 0) {
                                    return [
                                        2,
                                        null
                                    ];
                                } else {
                                    return [
                                        2,
                                        leads
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
            key: "filterlist",
            value: function filterlist(payload) {
                return _async_to_generator(function() {
                    var pageName, status, customerNameEmailMobile, leadID, leadStartDate, leadEndDate, caseType, employeeType, device, db, activeUsers, utmSources, filter;
                    return _ts_generator(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                pageName = payload.pageName;
                                status = [];
                                if (pageName === 'All Leads') {
                                    status = [
                                        'Fresh Lead',
                                        'Callback',
                                        'Interested',
                                        'Not Interested'
                                    ];
                                } else if (pageName === 'Sanction') {
                                    status = [
                                        'Approved Process',
                                        'Rejected Process',
                                        'Hold Process',
                                        'Not Required Process'
                                    ];
                                }
                                customerNameEmailMobile = '';
                                leadID = '';
                                leadStartDate = '';
                                leadEndDate = '';
                                caseType = [
                                    'New Case',
                                    'Existing Case',
                                    'Repeat Case'
                                ];
                                employeeType = [
                                    'Salaried',
                                    'Self Employee',
                                    'Professional',
                                    'Not Employed',
                                    'NA'
                                ];
                                device = [
                                    'iOS',
                                    'Android'
                                ];
                                db = getKnexInstance();
                                return [
                                    4,
                                    db('users').select('userID', 'name').where('status', 'Active')
                                ];
                            case 1:
                                activeUsers = _state.sent();
                                return [
                                    4,
                                    db('leads').distinct('utmSource')
                                ];
                            case 2:
                                utmSources = _state.sent();
                                // Construct the filter object
                                filter = {
                                    // customerNameEmailMobile,
                                    // leadID,
                                    status: status,
                                    caseType: caseType,
                                    employeeType: employeeType,
                                    // leadStartDate,
                                    // leadEndDate,
                                    allocated: activeUsers,
                                    // utmSources,
                                    device: device
                                };
                                return [
                                    2,
                                    filter
                                ];
                        }
                    });
                })();
            }
        },
        {
            key: "autoallocation",
            value: function autoallocation(payload) {
                return _async_to_generator(function() {
                    var authUserID, db, userDetails, startDate, formattedStartDate, leads, error;
                    return _ts_generator(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                authUserID = payload.authUserID;
                                db = getKnexInstance();
                                return [
                                    4,
                                    db('users').where('status', 'Active').where('userID', authUserID).first()
                                ];
                            case 1:
                                userDetails = _state.sent();
                                if (!userDetails) {
                                    return [
                                        2,
                                        {
                                            success: false,
                                            message: 'User not found',
                                            statusCode: 404
                                        }
                                    ];
                                }
                                _state.label = 2;
                            case 2:
                                _state.trys.push([
                                    2,
                                    4,
                                    ,
                                    5
                                ]);
                                startDate = subDays(new Date(), 59);
                                formattedStartDate = format(startDate, 'yyyy-MM-dd');
                                return [
                                    4,
                                    this.AllocationService.assignLeadToUser(formattedStartDate, userDetails.userID, userDetails.name)
                                ];
                            case 3:
                                leads = _state.sent();
                                if (leads === 0) {
                                    return [
                                        2,
                                        null
                                    ];
                                } else {
                                    return [
                                        2,
                                        leads
                                    ];
                                }
                                return [
                                    3,
                                    5
                                ];
                            case 4:
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
            key: "updateOne",
            value: // public async autoallocation(
            //   payload: IAutoAllocation
            // ): Promise<any | ICustomResponse> {
            //     const { authUserID } = payload;
            //     const db = getKnexInstance();
            //     // Fetch active users
            //     const userDetails = await db('users')
            //       .where('status', 'Active')
            //       .where('id', authUserID);
            //     try {
            //       const startDate = subDays(new Date(), 59);
            //       const formattedStartDate = format(startDate, 'yyyy-MM-dd');
            //       let leads = await this.AllocationService.assignLeadToUser(formattedStartDate,userDetails);
            //       if (leads == null || leads.length == 0) {
            //         return null;
            //       } else {
            //         return leads;
            //       }
            //     } catch (error) {
            //       logger.error(error);
            //       return {
            //         success: false,
            //         message: 'Internal Server Error',
            //         statusCode: 500,
            //       } as ICustomResponse;
            //     }
            // }
            // public async filterlist(
            //   payload: ILeadPageNameFilter
            // ): Promise<ILead[] | ICustomResponse> {
            //   const {
            //     pageName
            //   } = payload
            //   try {
            //     let customerNameEmailMobile = ''
            //     let leadID = ''
            //     let status = []
            //     if (pageName === 'All Leads') {
            //       status = ["Fresh Lead", "Callback", "Interested", "Not Interested"];
            //     } else if (pageName === 'Sanction') {
            //       status = ['Approved Process','Rejected Process','Hold Process','Not Required Process'];
            //     }
            //     let caseType = ["New Case", "Existing Case", "Repeat Case"]
            //     let employeeType = ["Salaried","Self Employee","Professional","Not Employed","NA"]
            //     let leadStartDate = ''
            //     let leadEndDate = ''
            //     let allocated = []
            //     allocated = select userID,Name from users where status = 'Active';
            //     allocated = select utmsource from leads group by utmsource;
            //     if (leads == null || leads.length == 0) {
            //       return null;
            //     } else {
            //       return leads;
            //     }
            //   } catch (error) {
            //     logger.error(error);
            //     return {
            //       success: false,
            //       message: 'Internal Server Error',
            //       statusCode: 500,
            //     } as ICustomResponse;
            //   }
            // }
            // async find(
            //  where: WhereQuery<ILead>,
            // //  where:{},
            // // where: (builder: Knex.QueryBuilder) => void,
            //   order: SortCriteria<TSelectLead>,
            //   select: SelectFields<TSelectLead>,
            // ): Promise<ILead[]> {
            //   return await this.leadModel.findAll(where, order, select)
            // }
            // public async find(
            //   where: {},
            //   order: { orderKey: string; orderValue: string },
            //   select: string[],
            // ): Promise<ILead[] | ICustomResponse> {
            //   try {
            //     let lead = await this.leadModel.getLeadData(where, order, select)
            //     if (lead == null || lead.length == 0) {
            //       return null
            //     } else {
            //       return lead // Return the first lead if found
            //     }
            //   } catch (error) {
            //     logger.error(error)
            //     return {
            //       success: false,
            //       message: 'Internal Server Error',
            //       statusCode: 500,
            //     } as ICustomResponse
            //   }
            // }
            // ! Refactored
            function updateOne(where, update) {
                return _async_to_generator(function() {
                    return _ts_generator(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                return [
                                    4,
                                    this.leadModel.findOneAndUpdate(where, update)
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
            key: "create",
            value: function create(data) {
                return _async_to_generator(function() {
                    var insertId, error;
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
                                    this.leadModel.insert(data)
                                ];
                            case 1:
                                insertId = _state.sent();
                                return [
                                    2,
                                    insertId
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
            key: "getEmployementDetails",
            value: function getEmployementDetails(leadID) {
                return _async_to_generator(function() {
                    var lead, customerID, salaryMode, monthlyIncome, empDetails, totalExperience, office_email_id, empDesignation, address, empWorkIndustry, empSalary, currentCompany, officialEmailId, industry, designation, employeeSalary, approval, customer, response;
                    return _ts_generator(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                return [
                                    4,
                                    this.leadModel.findOneLead({
                                        leadID: leadID
                                    }, [
                                        'customerID',
                                        'salaryMode',
                                        'monthlyIncome'
                                    ])
                                ];
                            case 1:
                                lead = _state.sent();
                                if (!lead) throw new NotFoundError('Lead not found');
                                customerID = lead.customerID, salaryMode = lead.salaryMode, monthlyIncome = lead.monthlyIncome;
                                return [
                                    4,
                                    this.employerModel.findOneEmployer({
                                        customerID: customerID
                                    }, [
                                        'totalExperience',
                                        'office_email_id',
                                        'empDesignation',
                                        'address',
                                        'empWorkIndustry',
                                        'empSalary',
                                        'currentCompany',
                                        'employerID'
                                    ], [
                                        {
                                            column: 'employerID',
                                            order: 'desc'
                                        }
                                    ])
                                ];
                            case 2:
                                empDetails = _state.sent();
                                if (!empDetails) throw new NotFoundError('Employee details not available');
                                totalExperience = empDetails.totalExperience, office_email_id = empDetails.office_email_id, empDesignation = empDetails.empDesignation, address = empDetails.address, empWorkIndustry = empDetails.empWorkIndustry, empSalary = empDetails.empSalary, currentCompany = empDetails.currentCompany;
                                officialEmailId = office_email_id;
                                industry = empWorkIndustry;
                                designation = empDesignation;
                                employeeSalary = empSalary !== null && empSalary !== void 0 ? empSalary : monthlyIncome;
                                if (!!officialEmailId) return [
                                    3,
                                    4
                                ];
                                return [
                                    4,
                                    this.approvalModel.findOneApproval({
                                        leadID: leadID
                                    }, [
                                        'officialEmail'
                                    ])
                                ];
                            case 3:
                                approval = _state.sent();
                                officialEmailId = officialEmailId !== null && officialEmailId !== void 0 ? officialEmailId : approval === null || approval === void 0 ? void 0 : approval.officialEmail;
                                _state.label = 4;
                            case 4:
                                if (!(!industry || !designation)) return [
                                    3,
                                    6
                                ];
                                return [
                                    4,
                                    this.customerModel.findOneCustomer({
                                        customerID: customerID
                                    }, [
                                        'industry',
                                        'designation'
                                    ])
                                ];
                            case 5:
                                customer = _state.sent();
                                industry = industry !== null && industry !== void 0 ? industry : customer === null || customer === void 0 ? void 0 : customer.industry;
                                designation = designation !== null && designation !== void 0 ? designation : customer === null || customer === void 0 ? void 0 : customer.designation;
                                _state.label = 6;
                            case 6:
                                // Now industry
                                response = {
                                    totalExperience: totalExperience,
                                    officialEmailId: officialEmailId,
                                    designation: designation,
                                    officeAddress: address,
                                    industry: industry,
                                    income: employeeSalary,
                                    currentCompanyExperience: currentCompany,
                                    salaryMode: salaryMode,
                                    employerID: empDetails.employerID
                                };
                                return [
                                    2,
                                    this.serviceResponse(HttpStatusCode.Ok, response, 'Data Retrieved')
                                ];
                        }
                    });
                }).call(this);
            }
        },
        {
            key: "getAddress",
            value: function getAddress(leadID) {
                return _async_to_generator(function() {
                    var lead, address;
                    return _ts_generator(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                return [
                                    4,
                                    this.leadModel.findOneLead({
                                        leadID: leadID
                                    }, [
                                        'customerID'
                                    ])
                                ];
                            case 1:
                                lead = _state.sent();
                                if (!lead) throw new NotFoundError('Lead not found');
                                return [
                                    4,
                                    this.addressModel.findOneAddress({
                                        customerID: lead.customerID
                                    }, [
                                        'address',
                                        'pincode',
                                        'city',
                                        'state'
                                    ], [
                                        {
                                            column: 'addressID',
                                            order: 'desc'
                                        }
                                    ])
                                ];
                            case 2:
                                address = _state.sent();
                                if (!address) throw new NotFoundError('Address details not found');
                                return [
                                    2,
                                    this.serviceResponse(HttpStatusCode.Ok, address, 'Data Retrieved')
                                ];
                        }
                    });
                }).call(this);
            }
        },
        {
            key: "getReferences",
            value: function getReferences(leadID) {
                return _async_to_generator(function() {
                    var lead, reference;
                    return _ts_generator(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                return [
                                    4,
                                    this.leadModel.findOneLead({
                                        leadID: leadID
                                    }, [
                                        'customerID'
                                    ])
                                ];
                            case 1:
                                lead = _state.sent();
                                if (!lead) throw new NotFoundError('Lead not found');
                                return [
                                    4,
                                    this.referenceModel.find({
                                        where: {
                                            customerID: lead.customerID
                                        },
                                        select: [
                                            'relation',
                                            'name',
                                            'contactNo'
                                        ],
                                        order: [
                                            {
                                                column: 'referenceID',
                                                order: 'desc'
                                            }
                                        ]
                                    })
                                ];
                            case 2:
                                reference = _state.sent();
                                return [
                                    2,
                                    this.serviceResponse(HttpStatusCode.Ok, reference, 'Data Retrieved')
                                ];
                        }
                    });
                }).call(this);
            }
        },
        {
            key: "getEmandates",
            value: function getEmandates(leadID) {
                return _async_to_generator(function() {
                    var lead, customer, rpayMandates;
                    return _ts_generator(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                return [
                                    4,
                                    this.leadModel.findOneLead({
                                        leadID: leadID
                                    }, [
                                        'customerID',
                                        'leadID'
                                    ])
                                ];
                            case 1:
                                lead = _state.sent();
                                if (!lead) throw new NotFoundError('Lead not found');
                                return [
                                    4,
                                    this.customerModel.findOneCustomer({
                                        customerID: lead.customerID
                                    }, [
                                        'emandate_required'
                                    ])
                                ];
                            case 2:
                                customer = _state.sent();
                                if (!customer) throw new NotFoundError('Customer does not exist');
                                return [
                                    4,
                                    this.razorpayMandateModel.RpayMandateKnex.where({
                                        customerID: lead.customerID
                                    }).select('inv_id', 'accountNo', 'accountType', 'emMaxamount', 'credated_date', 'status', 'short_url', 'ifsc', 'id', getKnexInstance().raw("DATE_ADD(credated_date, INTERVAL 1 YEAR) as expiryDate"), getKnexInstance().raw("'Razorpay' as mandateType")).orderBy('id', 'desc')
                                ];
                            case 3:
                                rpayMandates = _state.sent();
                                return [
                                    2,
                                    this.serviceResponse(HttpStatusCode.Ok, {
                                        rpayMandates: rpayMandates,
                                        emandateEnabled: customer.emandate_required === '1' ? false : true
                                    }, 'Data Retrieved')
                                ];
                        }
                    });
                }).call(this);
            }
        },
        {
            key: "getPennyDrops",
            value: function getPennyDrops(leadID) {
                return _async_to_generator(function() {
                    var lead, pennyDrops, db, getMandateData, data;
                    return _ts_generator(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                return [
                                    4,
                                    this.leadModel.findOneLead({
                                        leadID: leadID
                                    }, [
                                        'customerID',
                                        'leadID'
                                    ])
                                ];
                            case 1:
                                lead = _state.sent();
                                if (!lead) throw new NotFoundError('Lead not found');
                                return [
                                    4,
                                    this.pennyDropModel.find({
                                        where: {
                                            customerID: lead.customerID
                                        },
                                        select: [
                                            'p_id',
                                            'credated_date',
                                            'name',
                                            'bank_name',
                                            'account_number',
                                            'ifsc',
                                            'penny_status',
                                            'account_status'
                                        ],
                                        order: [
                                            {
                                                column: 'id',
                                                order: 'desc'
                                            }
                                        ]
                                    })
                                ];
                            case 2:
                                pennyDrops = _state.sent();
                                //get mandate data from pennydrop
                                return [
                                    4,
                                    getKnexInstance().raw("SET sql_mode = (SELECT REPLACE(@@sql_mode, 'ONLY_FULL_GROUP_BY', ''))")
                                ];
                            case 3:
                                _state.sent();
                                db = getKnexInstance();
                                return [
                                    4,
                                    db('razorpay_mandate').where('customerID', lead.customerID).whereNot('inv_id', '').whereIn('status', [
                                        'paid',
                                        'Paid'
                                    ]).groupBy('accountNo').select('id', 'customerID', 'accountNo', 'ifsc', 'leadID')
                                ];
                            case 4:
                                getMandateData = _state.sent();
                                data = {
                                    pennyDrops: pennyDrops,
                                    getMandateData: getMandateData
                                };
                                return [
                                    2,
                                    this.serviceResponse(HttpStatusCode.Ok, data, 'Data Retrieved')
                                ];
                        }
                    });
                }).call(this);
            }
        },
        {
            key: "disableEmandate",
            value: function disableEmandate(leadID, userID) {
                return _async_to_generator(function() {
                    var lead, customer, latestRecord;
                    return _ts_generator(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                return [
                                    4,
                                    this.leadModel.findOneLead({
                                        leadID: leadID
                                    }, [
                                        'customerID',
                                        'leadID'
                                    ])
                                ];
                            case 1:
                                lead = _state.sent();
                                if (!lead) throw new NotFoundError('Lead not found');
                                return [
                                    4,
                                    this.customerModel.findOneCustomer({
                                        customerID: +lead.customerID
                                    }, [
                                        'emandate_required'
                                    ])
                                ];
                            case 2:
                                customer = _state.sent();
                                if (!customer) throw new NotFoundError('Customer not found');
                                return [
                                    4,
                                    this.customerModel.findOneAndUpdate({
                                        customerID: lead.customerID
                                    }, {
                                        emandate_required: customer.emandate_required === '1' ? '0' : '1'
                                    })
                                ];
                            case 3:
                                _state.sent();
                                if (!(customer.emandate_required === '0')) return [
                                    3,
                                    5
                                ];
                                // Means emandate has been disabled
                                return [
                                    4,
                                    this.emandateNotRequiredLogs.insert({
                                        customerID: lead.customerID,
                                        nr_startBy: userID,
                                        nr_startDate: moment().format('YYYY-MM-DD HH:mm:ss')
                                    })
                                ];
                            case 4:
                                _state.sent();
                                return [
                                    3,
                                    8
                                ];
                            case 5:
                                return [
                                    4,
                                    this.emandateNotRequiredLogs.findOne({
                                        where: {
                                            customerID: lead.customerID
                                        },
                                        order: [
                                            {
                                                column: 'id',
                                                order: 'desc'
                                            }
                                        ],
                                        select: [
                                            'id'
                                        ]
                                    })
                                ];
                            case 6:
                                latestRecord = _state.sent();
                                if (!latestRecord) return [
                                    3,
                                    8
                                ];
                                return [
                                    4,
                                    this.emandateNotRequiredLogs.findOneAndUpdate({
                                        id: latestRecord.id
                                    }, {
                                        nr_endBy: userID,
                                        nr_endDate: moment().format('YYYY-MM-DD HH:mm:ss')
                                    })
                                ];
                            case 7:
                                _state.sent();
                                _state.label = 8;
                            case 8:
                                return [
                                    2,
                                    this.serviceResponse(HttpStatusCode.Ok, {}, customer.emandate_required === '1' ? 'Emandate enabled' : 'Emandate disabled')
                                ];
                        }
                    });
                }).call(this);
            }
        },
        {
            key: "generateEmandate",
            value: function generateEmandate(leadID, accountID, userID) {
                return _async_to_generator(function() {
                    var lead, customerAccount, customer, approval, email, mobile, name, resp, data;
                    return _ts_generator(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                return [
                                    4,
                                    this.leadModel.findOneLead({
                                        leadID: leadID
                                    }, [
                                        'customerID',
                                        'leadID',
                                        'status'
                                    ])
                                ];
                            case 1:
                                lead = _state.sent();
                                if (!lead) throw new NotFoundError('Lead not found');
                                if (lead.status === LeadStatus.CLOSED || lead.status === LeadStatus.SETTLEMENT) {
                                    throw new BadRequestError('Cannot generate emandate if lead status is ' + lead.status);
                                }
                                return [
                                    4,
                                    this.customerAccountModel.findOne({
                                        where: {
                                            accountID: accountID
                                        }
                                    })
                                ];
                            case 2:
                                customerAccount = _state.sent();
                                if (!customerAccount) throw new NotFoundError('Customer account not found');
                                return [
                                    4,
                                    this.customerModel.findOneCustomer({
                                        customerID: lead.customerID
                                    })
                                ];
                            case 3:
                                customer = _state.sent();
                                if (!customer) throw new NotFoundError('Customer not found');
                                return [
                                    4,
                                    this.approvalModel.findOneApproval({
                                        customerID: lead.customerID,
                                        leadID: lead.leadID
                                    }, [
                                        'loanAmtApproved',
                                        'status'
                                    ])
                                ];
                            case 4:
                                approval = _state.sent();
                                if (!approval) throw new NotFoundError('Customer has no approval');
                                // if (approval.status !== ApprovalStatus.Approved) {
                                //   throw new BadRequestError('Approval status must be approved')
                                // }
                                email = customer.email, mobile = customer.mobile, name = customer.name;
                                return [
                                    4,
                                    this.razorPayPayments.createEmandateAuthLink(lead.customerID, lead.leadID, {
                                        accountNo: customerAccount.accountNo,
                                        accountType: customerAccount.accountType,
                                        contact: String(mobile),
                                        email: email,
                                        ifsc: customerAccount.bankIfsc,
                                        name: name,
                                        amount: approval.loanAmtApproved
                                    })
                                ];
                            case 5:
                                resp = _state.sent();
                                if (!resp.success) {
                                    throw new BadRequestError('Their was an issue in generating emandate, Please try againg later', {
                                        data: resp.data
                                    });
                                }
                                data = resp.data;
                                return [
                                    4,
                                    this.razorpayMandateModel.insert({
                                        customerID: lead.customerID,
                                        leadID: String(lead.leadID),
                                        inv_id: data.id,
                                        entity: data.entity,
                                        receipt: data.receipt,
                                        invoice_number: data.invoice_number,
                                        customer_id: data.customer_id,
                                        cust_name: data.customer_details.name,
                                        cust_email: data.customer_details.email,
                                        cust_contact: data.customer_details.contact,
                                        order_id: data.order_id,
                                        status: data.status,
                                        sms_status: data.sms_status,
                                        email_status: data.email_status,
                                        short_url: data.short_url,
                                        type: data.type,
                                        accountNo: customerAccount.accountNo,
                                        accountType: customerAccount.accountType,
                                        bank: customerAccount.bank,
                                        ifsc: customerAccount.bankIfsc,
                                        uid: config.defaultUserId,
                                        emMaxamount: approval.loanAmtApproved * 3,
                                        etype: '0',
                                        token_id: '0',
                                        res_response: JSON.stringify(data)
                                    })
                                ];
                            case 6:
                                _state.sent();
                                return [
                                    4,
                                    this.callHistoryLogsModel.insert({
                                        customerID: lead.customerID,
                                        leadID: lead.leadID,
                                        callType: 'IVR',
                                        status: 'Emandate',
                                        remark: '',
                                        noteli: '',
                                        calledBy: userID
                                    })
                                ];
                            case 7:
                                _state.sent();
                                return [
                                    2,
                                    this.serviceResponse(HttpStatusCode.Created, {
                                        url: data.short_url
                                    }, 'Emandate URL generated')
                                ];
                        }
                    });
                }).call(this);
            }
        },
        {
            key: "chargeEmandate",
            value: function chargeEmandate(payload, loggedInUserId) {
                return _async_to_generator(function() {
                    var _rpayMandate_emMaxamount, leadID, emandateAmount, emandateID, remark, lead, customer, rpayMandate, onlinePayment, collectedPayment, emandateMaxAmount, _ref, loan, order, _ref1, _ref_, emOrderId, reccuringResp;
                    return _ts_generator(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                leadID = payload.leadID, emandateAmount = payload.emandateAmount, emandateID = payload.emandateID, remark = payload.remark;
                                return [
                                    4,
                                    this.leadModel.findOneLead({
                                        leadID: leadID
                                    }, [
                                        'customerID',
                                        'leadID'
                                    ])
                                ];
                            case 1:
                                lead = _state.sent();
                                if (!lead) throw new NotFoundError('Lead not found');
                                return [
                                    4,
                                    this.customerModel.findOneCustomer({
                                        customerID: lead.customerID
                                    }, [
                                        'mobile',
                                        'email',
                                        'name',
                                        'pancard'
                                    ])
                                ];
                            case 2:
                                customer = _state.sent();
                                if (!customer) throw new NotFoundError('Customer details not found');
                                return [
                                    4,
                                    this.razorpayMandateModel.findOne({
                                        where: {
                                            id: emandateID
                                        },
                                        select: [
                                            'emMaxamount',
                                            'id',
                                            'token_id',
                                            'customer_id',
                                            'cust_name',
                                            'order_id',
                                            'status'
                                        ]
                                    })
                                ];
                            case 3:
                                rpayMandate = _state.sent();
                                if (!rpayMandate) throw new NotFoundError('This emandate is invalid');
                                if (rpayMandate.status.toLowerCase() !== 'paid') {
                                    throw new BadRequestError('Cannot create charge for an incompleted emandate');
                                }
                                return [
                                    4,
                                    this.onlinePaymentModel.Knex.where({
                                        paymentStatus: 'success',
                                        method: 'E-mandate',
                                        leadID: String(leadID)
                                    }).sum('toValue')
                                ];
                            case 4:
                                onlinePayment = _state.sent();
                                collectedPayment = onlinePayment[0].sum;
                                emandateMaxAmount = (_rpayMandate_emMaxamount = rpayMandate.emMaxamount) !== null && _rpayMandate_emMaxamount !== void 0 ? _rpayMandate_emMaxamount : -1;
                                if (collectedPayment < emandateMaxAmount && emandateMaxAmount > 0) {
                                    emandateMaxAmount = emandateMaxAmount - collectedPayment;
                                }
                                if (!(collectedPayment < 1 && emandateMaxAmount < 1)) return [
                                    3,
                                    6
                                ];
                                return [
                                    4,
                                    this.loanModel.findOneLoan({
                                        customerID: lead.customerID,
                                        leadID: lead.leadID
                                    }, [
                                        'disbursalAmount'
                                    ])
                                ];
                            case 5:
                                loan = _state.sent();
                                emandateMaxAmount = (_ref = loan === null || loan === void 0 ? void 0 : loan.disbursalAmount) !== null && _ref !== void 0 ? _ref : 0;
                                emandateMaxAmount = emandateMaxAmount * 2;
                                _state.label = 6;
                            case 6:
                                if (emandateAmount > emandateMaxAmount) {
                                    throw new BadRequestError("Max chargable amount cannot be more than Rs.".concat(emandateMaxAmount));
                                }
                                if (!(emandateAmount >= 100 && emandateAmount <= emandateMaxAmount)) return [
                                    3,
                                    10
                                ];
                                return [
                                    4,
                                    this.razorPayPayments.createOrder(lead.customerID, lead.leadID, {
                                        amount: convertRupeesToPaise(emandateAmount),
                                        currency: 'INR',
                                        receipt: 'INR',
                                        notes: {
                                            notes_key_1: "leadID:".concat(lead.leadID),
                                            notes_key_2: "leadID:".concat(lead.leadID)
                                        }
                                    })
                                ];
                            case 7:
                                order = _state.sent();
                                if (!order.success) {
                                    throw new BadRequestError('Unable to generate an order at the moment.');
                                }
                                return [
                                    4,
                                    Promise.all([
                                        this.razorpayEmOrderModel.insert({
                                            emID: String(rpayMandate.id),
                                            customerID: String(lead.customerID),
                                            orderID: order.data.id,
                                            entity: order.data.entity,
                                            amount: String(order.data.amount / 100),
                                            amount_paid: String(order.data.amount_paid),
                                            amount_due: String(order.data.amount_paid),
                                            currency: order.data.currency,
                                            receipt: order.data.receipt,
                                            status: order.data.status,
                                            notes_key_1: order.data.notes.notes_key_1,
                                            tokenID: rpayMandate.token_id,
                                            uid: "".concat(loggedInUserId),
                                            razorpay_payment_id: '',
                                            razorpay_order_id: '',
                                            razorpay_signature: '',
                                            remarks: remark,
                                            leadID: String(lead.leadID)
                                        }),
                                        this.razorPayPayments.createRecurringPayment({
                                            amount: convertRupeesToPaise(emandateAmount),
                                            contact: customer.mobile,
                                            currency: 'INR',
                                            customer_id: rpayMandate.customer_id,
                                            description: rpayMandate.cust_name,
                                            email: customer.email,
                                            notes: {
                                                notes_key_1: rpayMandate.cust_name,
                                                notes_key_2: rpayMandate.cust_name
                                            },
                                            order_id: order.data.id,
                                            recurring: '1',
                                            token: rpayMandate.token_id
                                        })
                                    ])
                                ];
                            case 8:
                                _ref1 = _sliced_to_array.apply(void 0, [
                                    _state.sent(),
                                    2
                                ]), _ref_ = _sliced_to_array(_ref1[0], 1), emOrderId = _ref_[0], reccuringResp = _ref1[1];
                                if (!reccuringResp.success) {
                                    throw new BadRequestError('Unable to generate an order at the moment.');
                                }
                                return [
                                    4,
                                    Promise.all([
                                        this.razorpayEmOrderModel.findOneAndUpdate({
                                            id: emOrderId
                                        }, {
                                            razorpay_payment_id: reccuringResp.data.razorpay_payment_id
                                        }),
                                        this.onlinePaymentModel.insert({
                                            name: customer.name,
                                            email: customer.email,
                                            phone: String(customer.mobile),
                                            service: 'Ramfincorp',
                                            typeProduct: 'Emandate',
                                            toValue: String(order.data.amount / 100),
                                            message: customer.pancard,
                                            razorpayOrderId: order.data.id,
                                            razorpayPaymentId: reccuringResp.data.razorpay_payment_id,
                                            paymentStatus: 'PENDING',
                                            status: 'no',
                                            paymentType: 'E-mandate Charge',
                                            method: 'E-mandate',
                                            leadID: lead.leadID
                                        })
                                    ])
                                ];
                            case 9:
                                _state.sent();
                                return [
                                    2,
                                    this.serviceResponse(HttpStatusCode.Ok, {}, 'Charge Created')
                                ];
                            case 10:
                                throw new BadRequestError('Amount should be greater than or equal to 100');
                        }
                    });
                }).call(this);
            }
        },
        {
            key: "createEmploymentDetails",
            value: function createEmploymentDetails(payload, userID) {
                return _async_to_generator(function() {
                    var designation, income, industry, officeAddress, officialEmailId, salaryMode, totalExperience, employerID, leadID, lead, oldEmployerDetails;
                    return _ts_generator(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                designation = payload.designation, income = payload.income, industry = payload.industry, officeAddress = payload.officeAddress, officialEmailId = payload.officialEmailId, salaryMode = payload.salaryMode, totalExperience = payload.totalExperience, employerID = payload.employerID, leadID = payload.leadID;
                                return [
                                    4,
                                    this.leadModel.findOneLead({
                                        leadID: leadID
                                    }, [
                                        'customerID',
                                        'leadID'
                                    ])
                                ];
                            case 1:
                                lead = _state.sent();
                                if (!lead) throw new NotFoundError('Customer Lead not found');
                                return [
                                    4,
                                    this.employerModel.findOneEmployer({
                                        employerID: employerID
                                    }, [
                                        '*'
                                    ], [
                                        {
                                            column: 'employerID',
                                            order: 'desc'
                                        }
                                    ])
                                ];
                            case 2:
                                oldEmployerDetails = _state.sent();
                                return [
                                    4,
                                    Promise.all([
                                        this.employerModel.insert({
                                            totalExperience: totalExperience,
                                            office_email_id: officialEmailId,
                                            address: officeAddress,
                                            empWorkIndustry: industry,
                                            empDesignation: designation,
                                            empSalary: String(income),
                                            // currentCompany: currentCompanyExperience,
                                            city: oldEmployerDetails.city,
                                            state: oldEmployerDetails.state,
                                            pincode: oldEmployerDetails.pincode,
                                            customerID: lead.customerID,
                                            employerName: oldEmployerDetails.employerName,
                                            status: 'Verified',
                                            verifiedBy: userID
                                        }),
                                        this.leadModel.findOneAndUpdate({
                                            leadID: leadID
                                        }, {
                                            salaryMode: salaryMode
                                        })
                                    ])
                                ];
                            case 3:
                                _state.sent();
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
            key: "createAddress",
            value: function createAddress(payload) {
                return _async_to_generator(function() {
                    var address, city, state, leadID, pincode, lead, addressDetails;
                    return _ts_generator(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                address = payload.address, city = payload.city, state = payload.state, leadID = payload.leadID, pincode = payload.pincode;
                                return [
                                    4,
                                    this.leadModel.findOneLead({
                                        leadID: leadID
                                    }, [
                                        'customerID'
                                    ])
                                ];
                            case 1:
                                lead = _state.sent();
                                if (!lead) throw new NotFoundError('Lead not found');
                                return [
                                    4,
                                    this.addressModel.findOneAddress({
                                        customerID: lead.customerID
                                    }, [
                                        'type'
                                    ], [
                                        {
                                            column: 'addressID',
                                            order: 'desc'
                                        }
                                    ])
                                ];
                            case 2:
                                addressDetails = _state.sent();
                                return [
                                    4,
                                    this.addressModel.insert({
                                        address: address,
                                        city: city,
                                        state: state,
                                        pincode: pincode,
                                        customerID: lead.customerID,
                                        type: (addressDetails === null || addressDetails === void 0 ? void 0 : addressDetails.type) ? addressDetails.type : 'Current Address'
                                    })
                                ];
                            case 3:
                                _state.sent();
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
            key: "getBasicLeadDetails",
            value: function getBasicLeadDetails(leadID) {
                return _async_to_generator(function() {
                    var lead, _ref, approval, callHistory, requestedTenure, leadData;
                    return _ts_generator(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                return [
                                    4,
                                    this.leadModel.findOneLead({
                                        leadID: leadID
                                    }, [
                                        'customerID',
                                        'status',
                                        'leadID',
                                        'createdDate',
                                        'loanRequeried',
                                        'fbLeads'
                                    ])
                                ];
                            case 1:
                                lead = _state.sent();
                                if (!lead) throw new NotFoundError('Lead not found');
                                return [
                                    4,
                                    Promise.all([
                                        this.approvalModel.findOneApproval({
                                            leadID: leadID
                                        }, [
                                            'repayDate'
                                        ]),
                                        this.callHistoryLogsModel.findOne({
                                            where: {
                                                status: LeadStatus.APPROVED_PROCESS,
                                                leadID: leadID
                                            },
                                            select: [
                                                'createdDate'
                                            ]
                                        })
                                    ])
                                ];
                            case 2:
                                _ref = _sliced_to_array.apply(void 0, [
                                    _state.sent(),
                                    2
                                ]), approval = _ref[0], callHistory = _ref[1];
                                requestedTenure = null;
                                if (approval && callHistory) {
                                    // First date
                                    requestedTenure = this.loanService.getActualLoanTenure(callHistory.createdDate, approval.repayDate);
                                }
                                leadData = {
                                    leadID: lead.leadID,
                                    loanApplicationDate: lead.createdDate,
                                    requestedLoanAmount: lead.loanRequeried,
                                    requestedTenure: requestedTenure,
                                    loanType: lead.fbLeads
                                };
                                return [
                                    2,
                                    this.serviceResponse(HttpStatusCode.Ok, leadData, 'Success')
                                ];
                        }
                    });
                }).call(this);
            }
        },
        {
            key: "getLoanDetails",
            value: function getLoanDetails(leadID) {
                return _async_to_generator(function() {
                    var _this, _ref, _ref1, _ref2, _ref3, lead, product, productType, loanDetails, _ref4, approval, loan, customer, _ref5, account, user, bankIfsc, dpdInterest, ipcDpdInterest, _loanDetails_penalInterest, _loanDetails_actualInterest, collection, dpd, orignalTenure, dpd1, _tmp, outstanding, _tmp1, collections, _tmp2, sumOfBounceAndGst, _loanDetails_penalInterest1, _loanDetails_actualInterest1, db, apiCall, getEmis, _emis_, emisLength, emis, paidEmis, _emis_1, paidCount, overDueCount, emis1;
                    return _ts_generator(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                _this = this;
                                return [
                                    4,
                                    this.leadModel.findOneLead({
                                        leadID: leadID
                                    }, [
                                        'customerID',
                                        'productID',
                                        'ipc',
                                        'status',
                                        'leadID'
                                    ])
                                ];
                            case 1:
                                lead = _state.sent();
                                if (!lead) throw new NotFoundError('Lead not found');
                                return [
                                    4,
                                    this.productModel.findOne({
                                        productID: lead.productID
                                    })
                                ];
                            case 2:
                                product = _state.sent();
                                productType = product.name;
                                loanDetails = {
                                    loanAmount: 0,
                                    disbursalDate: new Date(),
                                    repaymentDate: new Date(),
                                    disbursedBy: 'Name',
                                    accountNo: '',
                                    ifsc: '',
                                    accountHolderName: '',
                                    bankBranch: '',
                                    actualTenure: null,
                                    dpd: null,
                                    actualInterest: null,
                                    loanTenure: null,
                                    paidAmount: 0,
                                    repayAmount: 0,
                                    bounceCharges: 0,
                                    tax: 0,
                                    penalInterest: 0,
                                    outstandingAmount: 0,
                                    adminFee: 0,
                                    processingFee: 0,
                                    gst: 0,
                                    disbursedAmount: 0,
                                    emisPaid: null,
                                    loanNo: null,
                                    productID: null,
                                    status: lead.status,
                                    netInterest: 0,
                                    roi: 0
                                };
                                return [
                                    4,
                                    Promise.all([
                                        this.approvalModel.findOneApproval({
                                            leadID: leadID
                                        }, [
                                            'repayDate',
                                            'tenure',
                                            'loanAmtApproved',
                                            'GstOfAdminFee',
                                            'adminFee',
                                            'roi'
                                        ]),
                                        this.loanModel.findOneLoan({
                                            leadID: leadID
                                        }, [
                                            'disbursalAmount',
                                            'disbursalDate',
                                            'accountNo',
                                            'bankIfsc',
                                            'loanNo',
                                            'disbursedBy'
                                        ]),
                                        this.customerModel.findOneCustomer({
                                            customerID: lead.customerID
                                        }, [
                                            'customerID'
                                        ])
                                    ])
                                ];
                            case 3:
                                _ref4 = _sliced_to_array.apply(void 0, [
                                    _state.sent(),
                                    3
                                ]), approval = _ref4[0], loan = _ref4[1], customer = _ref4[2];
                                if (!customer) throw new NotFoundError('No Customer found against the lead');
                                if (!approval) throw new NotFoundError('No Loan found against the lead');
                                if (!loan) throw new NotFoundError('No Loan found against this lead');
                                return [
                                    4,
                                    Promise.all([
                                        this.customerAccountModel.findOne({
                                            where: {
                                                accountNo: loan.accountNo
                                            }
                                        }),
                                        this.userModel.findOne({
                                            where: {
                                                userID: loan.disbursedBy
                                            },
                                            select: [
                                                'userID',
                                                'name'
                                            ]
                                        }),
                                        this.bankIfscModel.findOne({
                                            where: {
                                                IFSC: loan.bankIfsc
                                            },
                                            select: [
                                                'BRANCH'
                                            ]
                                        })
                                    ])
                                ];
                            case 4:
                                _ref5 = _sliced_to_array.apply(void 0, [
                                    _state.sent(),
                                    3
                                ]), account = _ref5[0], user = _ref5[1], bankIfsc = _ref5[2];
                                loanDetails.loanTenure = this.loanService.getActualLoanTenure(approval.repayDate, loan.disbursalDate);
                                loanDetails.loanTenure = !Number.isNaN(loanDetails.loanTenure) ? loanDetails.loanTenure + ' days' : null;
                                loanDetails.roi = approval.roi;
                                loanDetails.loanNo = loan.loanNo;
                                loanDetails.loanAmount = loan.disbursalAmount;
                                loanDetails.disbursalDate = String(loan === null || loan === void 0 ? void 0 : loan.disbursalDate) === '0000-00-00' ? null : (_ref = loan === null || loan === void 0 ? void 0 : loan.disbursalDate) !== null && _ref !== void 0 ? _ref : null;
                                loanDetails.disbursedBy = (_ref1 = user === null || user === void 0 ? void 0 : user.name) !== null && _ref1 !== void 0 ? _ref1 : null;
                                loanDetails.repaymentDate = String(loan === null || loan === void 0 ? void 0 : loan.disbursalDate) === '0000-00-00' ? null : approval.repayDate;
                                loanDetails.accountNo = loan.accountNo;
                                loanDetails.ifsc = loan.bankIfsc;
                                loanDetails.accountHolderName = (_ref2 = account === null || account === void 0 ? void 0 : account.bank_holder_name) !== null && _ref2 !== void 0 ? _ref2 : null;
                                loanDetails.bankBranch = (_ref3 = bankIfsc === null || bankIfsc === void 0 ? void 0 : bankIfsc.BRANCH) !== null && _ref3 !== void 0 ? _ref3 : null;
                                // Dynamic fields
                                loanDetails.actualTenure = null; // only if data in collection
                                loanDetails.dpd = null;
                                loanDetails.actualInterest = null; // if collection me data hai that is part-payment then use dashboard method calculate part-payment, TODO !
                                // ! else if closed or settlement then need to find in collection table [ask papu]
                                loanDetails.paidAmount = 0;
                                loanDetails.repayAmount = roundNumber(approval.loanAmtApproved + roundNumber(approval.loanAmtApproved * (approval.roi * this.loanService.getActualLoanTenure(approval.repayDate, loan.disbursalDate) / 100)));
                                loanDetails.bounceCharges = null;
                                loanDetails.penalInterest = null;
                                loanDetails.adminFee = approval.adminFee;
                                loanDetails.processingFee = approval.loanAmtApproved != 0 ? approval.adminFee : 0;
                                loanDetails.disbursedAmount = loan.disbursalAmount;
                                loanDetails.tax = approval.GstOfAdminFee;
                                dpdInterest = +config.dpdInterest;
                                ipcDpdInterest = +config.ipcDpdInterest;
                                switch(productType){
                                    case 'payday':
                                        return [
                                            3,
                                            5
                                        ];
                                    case 'emi':
                                        return [
                                            3,
                                            21
                                        ];
                                }
                                return [
                                    3,
                                    27
                                ];
                            case 5:
                                loanDetails.productID = ProductID.PAYDAY;
                                if (!(lead.status === LeadStatus.CLOSED || lead.status === LeadStatus.SETTLEMENT)) return [
                                    3,
                                    7
                                ];
                                return [
                                    4,
                                    this.collectionModel.find({
                                        where: {
                                            leadID: leadID,
                                            collectionStatus: CollectionStatus.APPROVED.toString()
                                        },
                                        select: [
                                            'collectedDate',
                                            'collectionID',
                                            'collectedAmount',
                                            'collectedMode'
                                        ],
                                        order: [
                                            {
                                                column: 'collectionID',
                                                order: 'desc'
                                            }
                                        ]
                                    })
                                ];
                            case 6:
                                collection = _state.sent();
                                // ! Actual Loan tenure
                                // Formula : collectedDate - loan.disbursedDate
                                loanDetails.actualTenure = this.loanService.getActualLoanTenure(collection[0].collectedDate, loan.disbursalDate);
                                // ! DPD : currentDate - approval.repayDate
                                // first check even DPD or not
                                dpd = this.loanService.getDpdDays(approval.repayDate, collection[0].collectedDate);
                                loanDetails.dpd = dpd > 0 ? dpd : null;
                                loanDetails.paidAmount = +this.loanService.getPaidAmountPayday(collection).toFixed(2);
                                // ! OLD CODE:
                                // loanDetails.penalInterest =
                                //   dpd > 0
                                //     ? +(await this.loanService.getPenalInterestPayday(lead, loan, approval, dpd)).toFixed(
                                //         2,
                                //       )
                                //     : 0
                                loanDetails.penalInterest = 0;
                                orignalTenure = this.loanService.getActualLoanTenure(loan.disbursalDate, approval.repayDate);
                                // ! OLD CODE:
                                // const orignalInterest = +this.loanService
                                //   .calculateInterest(loanDetails.disbursedAmount, approval.roi, orignalTenure)
                                //   .toFixed(2)
                                // Actual Interest:
                                // loanDetails.actualInterest = +this.loanService
                                //   .calculateInterest(loan.disbursalAmount, approval.roi, loanDetails.actualTenure)
                                //   .toFixed(2)
                                loanDetails.actualInterest = 0;
                                _state.label = 7;
                            case 7:
                                if (!(lead.status === LeadStatus.DISBURSED || lead.status === LeadStatus.PART_PAYMENT)) return [
                                    3,
                                    20
                                ];
                                // ! DPD : currentDate - approval.repayDate
                                // loanDetails.tax = (+config.dpdPenalty * +config.gst) / 100
                                dpd1 = this.loanService.getDpdDays(approval.repayDate);
                                loanDetails.gst = dpd1 > 0 ? +config.dpdPenalty * +config.gst / 100 : 0;
                                loanDetails.dpd = dpd1 > 0 ? dpd1 : null;
                                loanDetails.bounceCharges = dpd1 > 0 ? +config.dpdPenalty : null;
                                if (!(dpd1 > 0)) return [
                                    3,
                                    9
                                ];
                                return [
                                    4,
                                    this.loanService.getPenalInterestPayday(lead, loan, approval, dpd1)
                                ];
                            case 8:
                                _tmp = _state.sent();
                                return [
                                    3,
                                    10
                                ];
                            case 9:
                                _tmp = null;
                                _state.label = 10;
                            case 10:
                                // !
                                loanDetails.penalInterest = _tmp;
                                if (loanDetails.penalInterest < 0) loanDetails.penalInterest = 0;
                                if (!(lead.status === LeadStatus.DISBURSED)) return [
                                    3,
                                    12
                                ];
                                return [
                                    4,
                                    this.checkDisbursed(lead, customer)
                                ];
                            case 11:
                                _tmp1 = _state.sent();
                                return [
                                    3,
                                    14
                                ];
                            case 12:
                                return [
                                    4,
                                    this.checkPartPayment(lead, customer)
                                ];
                            case 13:
                                _tmp1 = _state.sent();
                                _state.label = 14;
                            case 14:
                                outstanding = _tmp1;
                                loanDetails.outstandingAmount = outstanding.totalAmount;
                                if (!(lead.status === LeadStatus.PART_PAYMENT)) return [
                                    3,
                                    19
                                ];
                                return [
                                    4,
                                    this.collectionModel.find({
                                        where: {
                                            leadID: leadID,
                                            collectionStatus: CollectionStatus.APPROVED.toString()
                                        },
                                        select: [
                                            'collectedDate',
                                            'collectionID',
                                            'collectedAmount',
                                            'total_interest',
                                            'principal_amount'
                                        ],
                                        order: [
                                            {
                                                column: 'collectionID',
                                                order: 'desc'
                                            }
                                        ]
                                    })
                                ];
                            case 15:
                                collections = _state.sent();
                                loanDetails.paidAmount = this.loanService.getPaidAmountPayday(collections);
                                loanDetails.actualInterest = this.loanService.getRemainingInterestPayDay(collections, approval.roi);
                                if (!(dpd1 > 0)) return [
                                    3,
                                    17
                                ];
                                return [
                                    4,
                                    this.loanService.getPenalInterestPayday(lead, loan, approval, dpd1, loanDetails.gst + loanDetails.bounceCharges)
                                ];
                            case 16:
                                _tmp2 = +_state.sent().toFixed(2);
                                return [
                                    3,
                                    18
                                ];
                            case 17:
                                _tmp2 = null;
                                _state.label = 18;
                            case 18:
                                loanDetails.penalInterest = _tmp2;
                                if (loanDetails.penalInterest < 0) loanDetails.penalInterest = 0;
                                _state.label = 19;
                            case 19:
                                // Actual Tenure
                                loanDetails.actualTenure = this.loanService.getActualLoanTenure(new Date(), loan.disbursalDate);
                                // Actual Interest:
                                if (lead.status === LeadStatus.DISBURSED) {
                                    loanDetails.actualInterest = +this.loanService.calculateInterest(loan.disbursalAmount, approval.roi, loanDetails.actualTenure).toFixed(2);
                                }
                                sumOfBounceAndGst = loanDetails.gst + loanDetails.bounceCharges;
                                if (loanDetails.outstandingAmount < sumOfBounceAndGst) {
                                    loanDetails.gst = loanDetails.gst - loanDetails.outstandingAmount;
                                    if (loanDetails.gst < 0) {
                                        // loanDetails.bounceCharges = loanDetails.bounceCharges + loanDetails.gst
                                        loanDetails.gst = 0;
                                    }
                                    if (loanDetails.outstandingAmount < loanDetails.bounceCharges) {
                                        loanDetails.bounceCharges = loanDetails.outstandingAmount;
                                    }
                                }
                                _state.label = 20;
                            case 20:
                                loanDetails.netInterest = +(((_loanDetails_penalInterest = loanDetails.penalInterest) !== null && _loanDetails_penalInterest !== void 0 ? _loanDetails_penalInterest : 0) + ((_loanDetails_actualInterest = loanDetails.actualInterest) !== null && _loanDetails_actualInterest !== void 0 ? _loanDetails_actualInterest : 0) + loanDetails.gst + loanDetails.bounceCharges).toFixed(2);
                                // if (lead.status === LeadStatus.PART_PAYMENT) {
                                //   loanDetails.outstandingAmount =
                                //     loanDetails.netInterest + loanDetails.loanAmount - (loanDetails.paidAmount || 0)
                                // }
                                // if (lead.status === LeadStatus.PART_PAYMENT) {
                                //   loanDetails.outstandingAmount =
                                //     loanDetails.netInterest + loanDetails.loanAmount - (loanDetails.paidAmount || 0)
                                // }
                                loanDetails.disbursedAmount = loan.disbursalAmount - (loanDetails.adminFee || 0) - (loanDetails.tax || 0);
                                if (!(lead.status === LeadStatus.DISBURSED || lead.status === LeadStatus.PART_PAYMENT || lead.status === LeadStatus.CLOSED || lead.status === LeadStatus.SETTLEMENT)) {
                                    loanDetails.repayAmount = null;
                                    loanDetails.repaymentDate = null;
                                    loanDetails.netInterest = null;
                                }
                                return [
                                    3,
                                    27
                                ];
                            case 21:
                                db = getKnexInstance();
                                loanDetails.productID = ProductID.EMI;
                                return [
                                    4,
                                    this.emiService.getRepaymentDataV2(leadID, lead.customerID)
                                ];
                            case 22:
                                apiCall = _state.sent();
                                getEmis = apiCall.processedEmis;
                                loanDetails.loanTenure = getEmis.length > 0 ? getEmis.length + ' Months' : null;
                                if (!(lead.status === LeadStatus.CLOSED || lead.status === LeadStatus.SETTLEMENT)) return [
                                    3,
                                    24
                                ];
                                // Calculating totalEmiAmountPaid
                                // loanDetails.tax = 0
                                loanDetails.gst = 0;
                                emisLength = getEmis.length - 1;
                                return [
                                    4,
                                    db('equated_monthly_installments').where({
                                        leadID: leadID,
                                        is_deleted: 0
                                    }).sum('amountPayable as repayAmount')
                                ];
                            case 23:
                                emis = _state.sent();
                                loanDetails.repayAmount = (_emis_ = emis[0]) === null || _emis_ === void 0 ? void 0 : _emis_.repayAmount;
                                paidEmis = 0;
                                getEmis.forEach(function(element) {
                                    if (element.is_deleted == 0) {
                                        paidEmis += 1;
                                        loanDetails.emisPaid = "".concat(paidEmis, " / ").concat(paidEmis);
                                        // if (
                                        //   element.status === EmiStatus.PAID ||
                                        //   element.status === EmiStatus.DUE ||
                                        //   element.status === EmiStatus.OVERDUE
                                        // ) {
                                        //   loanDetails.repayAmount += element?.amountPayable ?? 0
                                        // } else if (element.status === EmiStatus.PARTIALLY_PAID) {
                                        //   loanDetails.repayAmount +=
                                        //     (element?.amountPayable ?? 0) + Number(element.paymentReceived)
                                        // }
                                        if (element.status === EmiStatus.PAID) {
                                            loanDetails.paidAmount += parseFloat(element.paymentReceived);
                                            // if (element.panelty) {
                                            //   loanDetails.penalInterest += element.panelty
                                            // }
                                            if (typeof element.amountRemainsPenalty === 'number') {
                                                loanDetails.penalInterest += element.amountRemainsPenalty;
                                            }
                                            // loanDetails.actualInterest += element.interest
                                            var dpd = _this.loanService.getDpdDays(element.dueDate, element.actualPaymentDate);
                                            if (dpd > 0) loanDetails.dpd += dpd;
                                            loanDetails.bounceCharges += element.amountRemainsBrokenPeriodIntrest;
                                        }
                                    }
                                });
                                loanDetails.actualInterest = 0;
                                loanDetails.actualTenure = this.loanService.getActualLoanTenureInMonthDay(getEmis[emisLength].actualPaymentDate, loan.disbursalDate);
                                // loanDetails.emisPaid = `${emisLength} / ${emisLength}`
                                loanDetails.outstandingAmount = 0;
                                return [
                                    3,
                                    26
                                ];
                            case 24:
                                if (!(lead.status === LeadStatus.DISBURSED)) return [
                                    3,
                                    26
                                ];
                                paidCount = 0;
                                overDueCount = 0;
                                return [
                                    4,
                                    db('equated_monthly_installments').where({
                                        leadID: leadID,
                                        is_deleted: 0
                                    }).sum('amountPayable as repayAmount')
                                ];
                            case 25:
                                emis1 = _state.sent();
                                loanDetails.repayAmount = (_emis_1 = emis1[0]) === null || _emis_1 === void 0 ? void 0 : _emis_1.repayAmount;
                                getEmis.forEach(function(element) {
                                    if (element.status === EmiStatus.OVERDUE) {
                                        // loanDetails.repayAmount += element?.amountPayable ?? 0
                                        overDueCount += 1;
                                    }
                                    // TODO: Interest + only if status = DUE
                                    // TODO : If Status.PARTIALLY_PAID, then amountRemainsInterest
                                    if (element.status === EmiStatus.DUE) {
                                        loanDetails.actualInterest += element.interest;
                                    } else if (element.status === EmiStatus.OVERDUE || element.status === EmiStatus.PARTIALLY_PAID) {
                                        loanDetails.actualInterest += element.amountRemainsInterest;
                                        if (element.status === EmiStatus.PARTIALLY_PAID) {
                                            loanDetails.penalInterest += element.panelty;
                                        }
                                    }
                                    loanDetails.paidAmount += parseFloat(element.paymentReceived);
                                    if (element.status !== EmiStatus.PAID) {
                                        loanDetails.outstandingAmount += element.amountPayable;
                                        if (element.amountRemainsBrokenPeriodIntrest) {
                                            if (element.amountRemainsBrokenPeriodIntrest > 500) {
                                                loanDetails.bounceCharges += 500;
                                            } else {
                                                loanDetails.bounceCharges += element.amountRemainsBrokenPeriodIntrest;
                                            }
                                        } else {
                                            if (element.brokenPeriodIntrest > 500) {
                                                loanDetails.bounceCharges += 500;
                                            } else {
                                                loanDetails.bounceCharges += element.brokenPeriodIntrest;
                                            }
                                        }
                                        // Calculate penalty
                                        var dueDate = moment(element.dueDate).utcOffset(330).startOf('day');
                                        var currentDate = moment().utcOffset(330).startOf('day');
                                        var delay = currentDate.diff(dueDate, 'days');
                                        if (delay > 0) {
                                            if (element.status === EmiStatus.PARTIALLY_PAID && (element.amountRemainsPenalty == null || element.amountRemainsPenalty == 0)) {
                                                loanDetails.penalInterest += element.panelty;
                                            } else if (element.status === EmiStatus.PARTIALLY_PAID && element.amountRemainsPenalty > 0) {
                                                loanDetails.penalInterest += element.amountRemainsPenalty;
                                            } else if (element.status === EmiStatus.OVERDUE) {
                                                loanDetails.penalInterest += element.panelty;
                                            }
                                        }
                                    }
                                    if (element.status === EmiStatus.PAID) {
                                        var dpd = _this.loanService.getDpdDays(element.dueDate, element.actualPaymentDate);
                                        if (dpd > 0) loanDetails.dpd += dpd;
                                        paidCount += 1;
                                        loanDetails.emisPaid = "".concat(paidCount, " / ").concat(getEmis.length);
                                    } else if (element.status === EmiStatus.OVERDUE) {
                                        var dpd1 = _this.loanService.getDpdDays(element.dueDate);
                                        // Old way to calculate penalty
                                        // if (typeof element.amountRemainsPenalty === 'number') {
                                        //   loanDetails.penalInterest += element.amountRemainsPenalty
                                        // }
                                        if (dpd1 > 0) loanDetails.dpd += dpd1;
                                    }
                                });
                                // loanDetails.tax = ((+config.dpdPenalty * +config.gst) / 100) * overDueCount
                                if (overDueCount !== 0) loanDetails.gst = +config.dpdPenalty * +config.gst / 100 * overDueCount;
                                loanDetails.actualTenure = this.loanService.getActualLoanTenureInMonthDay(new Date(), loan.disbursalDate);
                                _state.label = 26;
                            case 26:
                                if (loanDetails.actualInterest) {
                                    loanDetails.actualInterest = +loanDetails.actualInterest.toFixed(2);
                                }
                                if (loanDetails.penalInterest) {
                                    loanDetails.penalInterest = +loanDetails.penalInterest.toFixed(2);
                                }
                                loanDetails.netInterest = ((_loanDetails_penalInterest1 = loanDetails.penalInterest) !== null && _loanDetails_penalInterest1 !== void 0 ? _loanDetails_penalInterest1 : 0) + ((_loanDetails_actualInterest1 = loanDetails.actualInterest) !== null && _loanDetails_actualInterest1 !== void 0 ? _loanDetails_actualInterest1 : 0) + loanDetails.gst + loanDetails.bounceCharges;
                                loanDetails.disbursedAmount = loan.disbursalAmount - (loanDetails.adminFee || 0) - (loanDetails.tax || 0);
                                if (!(lead.status === LeadStatus.DISBURSED || lead.status === LeadStatus.PART_PAYMENT || lead.status === LeadStatus.CLOSED || lead.status === LeadStatus.SETTLEMENT)) {
                                    loanDetails.repayAmount = null;
                                    loanDetails.repaymentDate = null;
                                    loanDetails.netInterest = null;
                                }
                                _state.label = 27;
                            case 27:
                                return [
                                    2,
                                    this.serviceResponse(HttpStatusCode.Ok, loanDetails, 'Fetched')
                                ];
                        }
                    });
                }).call(this);
            }
        },
        {
            key: "checkDisbursed",
            value: // For disbursed calculation
            function checkDisbursed(lead, customer) {
                return _async_to_generator(function() {
                    var leadID, customerID, _ref, approval, loan, dpdInterest, totalAmount, sanctionInterest, dashboardMessages, currentDate, repayDate, disbursalDate, tenure, isOverDue, delayInterest, dpdDays, repaymentData;
                    return _ts_generator(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                leadID = lead.leadID;
                                customerID = customer.customerID;
                                return [
                                    4,
                                    Promise.all([
                                        this.approvalModel.findOneApproval({
                                            leadID: leadID,
                                            customerID: customerID
                                        }, [
                                            'approvalID',
                                            'loanAmtApproved',
                                            'tenure',
                                            'roi',
                                            'repayDate',
                                            'adminFee',
                                            'GstOfAdminFee',
                                            'status',
                                            'customerApproval'
                                        ], [
                                            {
                                                column: 'approvalID',
                                                order: 'desc'
                                            }
                                        ]),
                                        this.loanService.findOne({
                                            customerID: customerID,
                                            leadID: leadID
                                        }, [
                                            'loanNo',
                                            'createdDate',
                                            'disbursalAmount',
                                            'disbursalDate',
                                            'accountNo',
                                            'accountType',
                                            'bankIfsc',
                                            'bank',
                                            'status'
                                        ], [
                                            {
                                                column: 'loanID',
                                                order: 'desc'
                                            }
                                        ])
                                    ])
                                ];
                            case 1:
                                _ref = _sliced_to_array.apply(void 0, [
                                    _state.sent(),
                                    2
                                ]), approval = _ref[0], loan = _ref[1];
                                dpdInterest = +config.dpdInterest;
                                totalAmount = 0;
                                sanctionInterest = 0;
                                dashboardMessages = {
                                    dashboard_message1: 'Loan Repayment',
                                    dashboard_message2: 'Keep your credit shining bright. Dont forget to repay your Loan on time',
                                    dashboard_message3: 'Repay Now!!',
                                    dashboard_message4: approval.repayDate,
                                    dashboard_message5: '',
                                    dashboard_message6: 0
                                };
                                currentDate = new Date();
                                repayDate = new Date(approval.repayDate);
                                disbursalDate = loan.disbursalDate;
                                tenure = 0;
                                isOverDue = isDateAfter(currentDate, repayDate);
                                delayInterest = 0;
                                // DPD case
                                if (isOverDue) {
                                    dpdDays = getDifferenceInDays(repayDate, currentDate);
                                    delayInterest = this.loanService.calculateInterest(loan.disbursalAmount, dpdInterest, dpdDays);
                                    tenure = getDifferenceInDays(disbursalDate, repayDate);
                                    dashboardMessages.dashboard_message5 = "Days Past Due: ".concat(dpdDays, " days");
                                } else {
                                    tenure = getDifferenceInDays(disbursalDate, currentDate);
                                }
                                sanctionInterest = this.loanService.calculateInterest(loan.disbursalAmount, approval.roi, tenure);
                                totalAmount = loan.disbursalAmount + sanctionInterest + delayInterest;
                                if (!(lead.ipc === 1)) return [
                                    3,
                                    3
                                ];
                                return [
                                    4,
                                    this.loanService.calculateRepayAmountIpc(lead, customer, approval, loan, isOverDue ? currentDate : repayDate)
                                ];
                            case 2:
                                repaymentData = _state.sent();
                                totalAmount = repaymentData.totalPayableAmount;
                                sanctionInterest = repaymentData.totalInterest;
                                _state.label = 3;
                            case 3:
                                dashboardMessages.dashboard_message6 = totalAmount;
                                return [
                                    2,
                                    {
                                        interest: sanctionInterest,
                                        totalAmount: totalAmount
                                    }
                                ];
                        }
                    });
                }).call(this);
            }
        },
        {
            key: "checkPartPayment",
            value: function checkPartPayment(lead, customer) {
                return _async_to_generator(function() {
                    var leadID, customerID, _ref, approval, loan, dashboardMessages, collectionAmount, dpdInterest, collection, currentDate, repayDate, disbursalDate, tenure, sanctionInterest, totalAmount, delayInterest, isOverDue, dpdDays, repaymentData;
                    return _ts_generator(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                leadID = lead.leadID;
                                customerID = customer.customerID;
                                return [
                                    4,
                                    Promise.all([
                                        this.approvalModel.findOneApproval({
                                            leadID: leadID,
                                            customerID: customerID
                                        }, [
                                            'approvalID',
                                            'loanAmtApproved',
                                            'tenure',
                                            'roi',
                                            'repayDate',
                                            'adminFee',
                                            'GstOfAdminFee',
                                            'status',
                                            'customerApproval'
                                        ], [
                                            {
                                                column: 'approvalID',
                                                order: 'desc'
                                            }
                                        ]),
                                        this.loanService.findOne({
                                            customerID: customerID,
                                            leadID: leadID
                                        }, [
                                            'loanNo',
                                            'createdDate',
                                            'disbursalAmount',
                                            'disbursalDate',
                                            'accountNo',
                                            'accountType',
                                            'bankIfsc',
                                            'bank',
                                            'status'
                                        ], [
                                            {
                                                column: 'loanID',
                                                order: 'desc'
                                            }
                                        ])
                                    ])
                                ];
                            case 1:
                                _ref = _sliced_to_array.apply(void 0, [
                                    _state.sent(),
                                    2
                                ]), approval = _ref[0], loan = _ref[1];
                                dashboardMessages = {
                                    dashboard_message1: 'Loan Repayment',
                                    dashboard_message2: 'Keep your credit shining bright. Dont forget to repay your Loan on time',
                                    dashboard_message3: 'Repay Now!!',
                                    dashboard_message4: approval.repayDate,
                                    dashboard_message5: '',
                                    dashboard_message6: 0
                                };
                                collectionAmount = 0;
                                dpdInterest = +config.dpdInterest;
                                return [
                                    4,
                                    getKnexInstance().raw("SET sql_mode = (SELECT REPLACE(@@sql_mode, 'ONLY_FULL_GROUP_BY', ''))")
                                ];
                            case 2:
                                _state.sent();
                                return [
                                    4,
                                    this.collectionModel.find({
                                        where: {
                                            customerID: customerID,
                                            leadID: leadID,
                                            loanNo: loan.loanNo,
                                            status: CollectionStatus.PART_PAYMENT,
                                            collectionStatus: CollectionStatus.APPROVED.toString()
                                        },
                                        sum: [
                                            'collectedAmount'
                                        ]
                                    })
                                ];
                            case 3:
                                collection = _state.sent();
                                if (collection.length > 0) {
                                    collectionAmount = collection[0].collectedAmount;
                                }
                                currentDate = new Date();
                                repayDate = new Date(approval.repayDate);
                                disbursalDate = loan.disbursalDate;
                                tenure = 0;
                                sanctionInterest = 0;
                                totalAmount = 0;
                                delayInterest = 0;
                                isOverDue = isDateAfter(currentDate, repayDate);
                                if (isOverDue) {
                                    dashboardMessages.dashboard_message1 = 'Urgent Attention Needed!';
                                    dashboardMessages.dashboard_message2 = "Your loan of";
                                    dashboardMessages.dashboard_message3 = 'Repay Loan!!';
                                    dashboardMessages.dashboard_message4 = 'is overdue. Please repay promptly';
                                    dpdDays = getDifferenceInDays(repayDate, currentDate);
                                    delayInterest = this.loanService.calculateInterest(loan.disbursalAmount, dpdInterest, dpdDays);
                                    tenure = getDifferenceInDays(disbursalDate, repayDate);
                                    dashboardMessages.dashboard_message5 = "Days Past Due: ".concat(dpdDays, " days");
                                } else {
                                    tenure = getDifferenceInDays(disbursalDate, currentDate);
                                }
                                sanctionInterest = this.loanService.calculateInterest(loan.disbursalAmount, approval.roi, tenure);
                                totalAmount = collectionAmount ? loan.disbursalAmount + sanctionInterest + delayInterest - collectionAmount : loan.disbursalAmount + sanctionInterest + delayInterest;
                                if (!(lead.ipc === 1)) return [
                                    3,
                                    5
                                ];
                                return [
                                    4,
                                    this.loanService.calculateRepayAmountIpc(lead, customer, approval, loan, isOverDue ? currentDate : repayDate)
                                ];
                            case 4:
                                repaymentData = _state.sent();
                                totalAmount = repaymentData.totalPayableAmount;
                                _state.label = 5;
                            case 5:
                                dashboardMessages.dashboard_message6 = totalAmount;
                                return [
                                    2,
                                    {
                                        totalAmount: totalAmount
                                    }
                                ];
                        }
                    });
                }).call(this);
            }
        },
        {
            key: "collectionDetails",
            value: function collectionDetails(leadID, page, perPage) {
                return _async_to_generator(function() {
                    var lead, db, collectionData, totalCount, formatCollectionData;
                    return _ts_generator(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                return [
                                    4,
                                    this.leadModel.findOneLead({
                                        leadID: leadID
                                    }, [
                                        'customerID',
                                        'status',
                                        'leadID',
                                        'createdDate',
                                        'loanRequeried',
                                        'productID'
                                    ])
                                ];
                            case 1:
                                lead = _state.sent(), db = getKnexInstance();
                                if (!lead) throw new NotFoundError('Lead not found');
                                collectionData = [];
                                if (!(lead.productID === ProductID.PAYDAY)) return [
                                    3,
                                    4
                                ];
                                return [
                                    4,
                                    this.collectionModel.countAll({
                                        where: {
                                            leadID: leadID
                                        }
                                    })
                                ];
                            case 2:
                                totalCount = _state.sent();
                                return [
                                    4,
                                    db('collection as c').where('c.leadID', leadID).select([
                                        'c.referenceNo',
                                        'c.loanNo',
                                        'c.collectedAmount',
                                        'c.collectedMode',
                                        'c.remark',
                                        'c.refund_utr_no',
                                        'c.collectedDate',
                                        'c.collectionStatus',
                                        'c.collectedBy',
                                        'c.excess_amount',
                                        'r.remarks as razorpayRemarks',
                                        'u.name as collectedByName',
                                        'collectionID as id'
                                    ]).leftJoin('razorpay_emOrder as r', 'c.referenceNo', 'r.orderId').leftJoin('users as u', 'c.collectedBy', 'u.userID').orderBy('c.collectionID', 'desc').limit(perPage).offset(page * perPage)
                                ];
                            case 3:
                                collectionData = _state.sent();
                                return [
                                    3,
                                    7
                                ];
                            case 4:
                                return [
                                    4,
                                    this.transactionModel.count({
                                        leadID: leadID,
                                        type: 'collection',
                                        emiID: 0
                                    }, undefined, [
                                        {
                                            rawQuery: '(status IN (1,2,3,4))',
                                            values: []
                                        }
                                    ])
                                ];
                            case 5:
                                totalCount = _state.sent();
                                return [
                                    4,
                                    db('transactions as t').where('t.leadID', leadID).where('t.type', 'collection').where('t.emiID', 0).whereRaw('(t.status IN (1,2,3,4))').select([
                                        't.mode',
                                        't.loanNo',
                                        't.referenceNo',
                                        't.createdAt',
                                        't.createdBy',
                                        't.amount',
                                        't.status',
                                        't.remarks',
                                        'r.remarks as razorpayRemarks',
                                        'u.name as createdByName',
                                        't.id'
                                    ]).leftJoin('razorpay_emOrder as r', 't.orderID', 'r.orderId').leftJoin('users as u', 't.createdBy', 'u.userID').orderBy('t.id', 'desc').limit(perPage).offset(page * perPage)
                                ];
                            case 6:
                                collectionData = _state.sent();
                                _state.label = 7;
                            case 7:
                                formatCollectionData = function formatCollectionData(item) {
                                    return {
                                        referenceNo: item.referenceNo,
                                        loanNo: item.loanNo,
                                        amount: item.collectedAmount || item.amount,
                                        collectedMode: item.collectedMode || item.mode,
                                        remarks: item.remark || item.remarks || item.razorpayRemarks,
                                        refund_utr_no: item.refund_utr_no || '',
                                        collectedDateIST: formatToIST(item.collectedDate || item.createdAt),
                                        status: item.collectionStatus || (item.status === 1 ? 'Captured' : item.status === 2 ? 'Pending' : item.status === 3 ? 'Approved' : item.status === 4 ? 'Rejected' : item.status),
                                        refundType: '',
                                        refundRemarks: '',
                                        approvedBy: item.collectedByName || item.createdByName || 'N/A',
                                        leadID: leadID,
                                        customerID: lead.customerID,
                                        productID: lead.productID,
                                        excessAmount: item.excess_amount,
                                        id: item.id
                                    };
                                };
                                collectionData = collectionData.map(formatCollectionData);
                                return [
                                    2,
                                    this.serviceResponse(HttpStatusCode.Ok, {
                                        collection: collectionData,
                                        totalCount: totalCount,
                                        totalPages: Math.ceil(totalCount / perPage)
                                    }, 'Success')
                                ];
                        }
                    });
                }).call(this);
            }
        },
        {
            key: "collectionFollowUp",
            value: function collectionFollowUp(leadID, isSanction) {
                return _async_to_generator(function() {
                    var db, collectionFollowUp, formattedFollowUps;
                    return _ts_generator(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                db = getKnexInstance();
                                return [
                                    4,
                                    db('collectionFollowup as cf').leftJoin('users as u', 'cf.createdBy', 'u.userID').leftJoin('leads as l', 'cf.leadID', 'l.leadID').where('cf.leadID', leadID).modify(function(query) {
                                        if (isSanction) {
                                            query.where('cf.followup_type', 1);
                                        }
                                    }).select('cf.followType', 'cf.createdBy', 'cf.createdDate', 'cf.StatusType', 'cf.remark', 'u.userID as createdByUserID', 'u.name as createdByUserName').orderBy('cf.reviewID', 'desc')
                                ];
                            case 1:
                                collectionFollowUp = _state.sent();
                                // Format follow-up data
                                formattedFollowUps = collectionFollowUp.map(function(followUp) {
                                    return _object_spread_props(_object_spread({}, followUp), {
                                        collectedDateIST: formatToIST(followUp.createdDate),
                                        Executive: followUp.createdByUserName || 'N/A'
                                    });
                                });
                                return [
                                    2,
                                    this.serviceResponse(HttpStatusCode.Ok, {
                                        collectionFollowUp: formattedFollowUps
                                    }, 'Success')
                                ];
                        }
                    });
                }).call(this);
            }
        },
        {
            key: "VirtualAccountTab",
            value: function VirtualAccountTab(leadId, virtualAc, qrCode, userId) {
                return _async_to_generator(function() {
                    var db, date, lead, customer, virtualAccount, expiryDate, diffInDays, result, result1;
                    return _ts_generator(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                db = getKnexInstance();
                                date = new Date();
                                if (!(virtualAc || qrCode)) return [
                                    3,
                                    7
                                ];
                                return [
                                    4,
                                    this.leadModel.findOneLead({
                                        leadID: leadId
                                    }, [
                                        'customerID',
                                        'status',
                                        'leadID',
                                        'createdDate',
                                        'loanRequeried',
                                        'productID'
                                    ])
                                ];
                            case 1:
                                lead = _state.sent();
                                if (!lead) {
                                    throw new BadRequestError('lead not found');
                                }
                                return [
                                    4,
                                    db('customer').where({
                                        customerID: lead.customerID
                                    }).first()
                                ];
                            case 2:
                                customer = _state.sent();
                                if (!customer) {
                                    throw new BadRequestError('customer not found');
                                }
                                return [
                                    4,
                                    this.virtualAccountModel.findOne({
                                        where: {
                                            customerID: customer.customerID
                                        },
                                        order: [
                                            {
                                                column: 'credatedDate',
                                                order: 'desc'
                                            }
                                        ]
                                    })
                                ];
                            case 3:
                                virtualAccount = _state.sent();
                                if (virtualAccount) {
                                    expiryDate = moment.utc(virtualAccount.credatedDate).add({
                                        days: 90
                                    });
                                    diffInDays = expiryDate.diff(moment(), 'days');
                                    if (diffInDays >= 0) throw new BadRequestError('Virtual account already exists');
                                }
                                if (!(virtualAc && !virtualAccount)) return [
                                    3,
                                    5
                                ];
                                return [
                                    4,
                                    this.createVirtualAccount(customer, lead, date, userId)
                                ];
                            case 4:
                                result = _state.sent();
                                if (result.status === 'error') {
                                    throw new BadRequestError('error while generating virtual Account');
                                }
                                _state.label = 5;
                            case 5:
                                if (!(qrCode && !virtualAccount)) return [
                                    3,
                                    7
                                ];
                                return [
                                    4,
                                    this.createQrCode(userId, customer, lead, date)
                                ];
                            case 6:
                                result1 = _state.sent();
                                if (result1.status === 'error') {
                                    throw new BadRequestError('error while generating qr code ');
                                }
                                _state.label = 7;
                            case 7:
                                return [
                                    2,
                                    this.serviceResponse(HttpStatusCode.Ok, {}, 'virtual account generating successfully')
                                ];
                        }
                    });
                }).call(this);
            }
        },
        {
            key: "createVirtualAccount",
            value: function createVirtualAccount(customer, lead, date, userId) {
                return _async_to_generator(function() {
                    var db, trx, custID, name, data, response, virtualAccount, vc1, error;
                    return _ts_generator(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                db = getKnexInstance();
                                return [
                                    4,
                                    db.transaction()
                                ];
                            case 1:
                                trx = _state.sent();
                                _state.label = 2;
                            case 2:
                                _state.trys.push([
                                    2,
                                    11,
                                    ,
                                    13
                                ]);
                                return [
                                    4,
                                    this.getOrCreateCustomer(customer, lead, date, userId)
                                ];
                            case 3:
                                custID = _state.sent();
                                name = "".concat(customer.name, "-").concat(customer.mobile, "-").concat(lead.leadID);
                                data = {
                                    receivers: {
                                        types: [
                                            'bank_account'
                                        ]
                                    },
                                    description: name,
                                    customer_id: custID,
                                    close_by: Math.floor(Date.now() / 1000) + 90 * 24 * 60 * 60,
                                    notes: {
                                        project_name: name
                                    }
                                };
                                return [
                                    4,
                                    this.razorpayPg.razorpayVirtualAccount('https://api.razorpay.com/v1/virtual_accounts', data)
                                ];
                            case 4:
                                response = _state.sent();
                                if (!(response.data.status === 'error')) return [
                                    3,
                                    6
                                ];
                                return [
                                    4,
                                    trx.rollback()
                                ];
                            case 5:
                                _state.sent();
                                return [
                                    2,
                                    {
                                        status: 'error',
                                        message: response.data.message
                                    }
                                ];
                            case 6:
                                virtualAccount = response.data;
                                return [
                                    4,
                                    trx('virtualAccount').insert({
                                        customerID: customer.customerID,
                                        leadID: lead.leadID,
                                        accounID: virtualAccount.id,
                                        name: virtualAccount.name,
                                        customer_id: virtualAccount.customer_id,
                                        recid: virtualAccount.receivers[0].id,
                                        entity: virtualAccount.receivers[0].entity,
                                        ifsc: virtualAccount.receivers[0].ifsc,
                                        bankName: virtualAccount.receivers[0].bank_name || '',
                                        recName: virtualAccount.receivers[0].name,
                                        account_number: virtualAccount.receivers[0].account_number,
                                        credatedDate: date,
                                        uid: userId
                                    })
                                ];
                            case 7:
                                vc1 = _state.sent();
                                if (!vc1) return [
                                    3,
                                    9
                                ];
                                return [
                                    4,
                                    trx.commit()
                                ];
                            case 8:
                                _state.sent();
                                return [
                                    2,
                                    {
                                        status: 'success'
                                    }
                                ];
                            case 9:
                                return [
                                    4,
                                    trx.rollback()
                                ];
                            case 10:
                                _state.sent();
                                return [
                                    2,
                                    {
                                        status: 'error',
                                        message: 'Failed to create virtual account.'
                                    }
                                ];
                            case 11:
                                error = _state.sent();
                                return [
                                    4,
                                    trx.rollback()
                                ];
                            case 12:
                                _state.sent();
                                return [
                                    2,
                                    {
                                        status: 'error',
                                        message: error.message
                                    }
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
            key: "createQrCode",
            value: function createQrCode(userId, customer, lead, date) {
                return _async_to_generator(function() {
                    var db, trx, custID, name, data, response, virtualAccount, vc1, error;
                    return _ts_generator(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                db = getKnexInstance();
                                return [
                                    4,
                                    db.transaction()
                                ];
                            case 1:
                                trx = _state.sent();
                                _state.label = 2;
                            case 2:
                                _state.trys.push([
                                    2,
                                    11,
                                    ,
                                    13
                                ]);
                                return [
                                    4,
                                    this.getOrCreateCustomer(customer, lead, date, userId)
                                ];
                            case 3:
                                custID = _state.sent();
                                name = "".concat(customer.name, "-").concat(customer.mobile, "-").concat(lead.leadID);
                                data = {
                                    receivers: {
                                        types: [
                                            'bank_account'
                                        ]
                                    },
                                    description: name,
                                    customer_id: custID,
                                    close_by: Math.floor(Date.now() / 1000) + 90 * 24 * 60 * 60,
                                    notes: {
                                        project_name: name
                                    }
                                };
                                return [
                                    4,
                                    this.razorpayPg.razorpayVirtualAccount('https://api.razorpay.com/v1/virtual_accounts', data)
                                ];
                            case 4:
                                response = _state.sent();
                                if (!(response.data.status === 'error')) return [
                                    3,
                                    6
                                ];
                                return [
                                    4,
                                    trx.rollback()
                                ];
                            case 5:
                                _state.sent();
                                return [
                                    2,
                                    {
                                        status: 'error',
                                        message: response.data.message
                                    }
                                ];
                            case 6:
                                virtualAccount = response.data;
                                return [
                                    4,
                                    trx('virtualAccount').insert({
                                        customerID: customer.customerID,
                                        leadID: lead.leadID,
                                        accounID: virtualAccount.id,
                                        name: virtualAccount.name,
                                        customer_id: virtualAccount.customer_id,
                                        recid: virtualAccount.receivers[0].id,
                                        entity: virtualAccount.receivers[0].entity,
                                        ifsc: virtualAccount.receivers[0].ifsc,
                                        bankName: virtualAccount.receivers[0].bank_name || '',
                                        recName: virtualAccount.receivers[0].name,
                                        account_number: virtualAccount.receivers[0].account_number,
                                        credatedDate: date,
                                        uid: userId
                                    })
                                ];
                            case 7:
                                vc1 = _state.sent();
                                if (!vc1) return [
                                    3,
                                    9
                                ];
                                return [
                                    4,
                                    trx.commit()
                                ];
                            case 8:
                                _state.sent();
                                return [
                                    2,
                                    {
                                        status: 'success'
                                    }
                                ];
                            case 9:
                                return [
                                    4,
                                    trx.rollback()
                                ];
                            case 10:
                                _state.sent();
                                return [
                                    2,
                                    {
                                        status: 'error',
                                        message: 'Failed to create QR code.'
                                    }
                                ];
                            case 11:
                                error = _state.sent();
                                return [
                                    4,
                                    trx.rollback()
                                ];
                            case 12:
                                _state.sent();
                                return [
                                    2,
                                    {
                                        status: 'error',
                                        message: error.message
                                    }
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
            key: "getOrCreateCustomer",
            value: function getOrCreateCustomer(customer, lead, date, userId) {
                return _async_to_generator(function() {
                    var db, existingCustomer, data, response, customerData;
                    return _ts_generator(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                db = getKnexInstance();
                                return [
                                    4,
                                    db('virtualCustomer').where({
                                        customerID: customer.customerID
                                    }).first()
                                ];
                            case 1:
                                existingCustomer = _state.sent();
                                if (!!existingCustomer) return [
                                    3,
                                    4
                                ];
                                data = {
                                    name: "".concat(customer.name, "-").concat(customer.mobile),
                                    contact: customer.mobile,
                                    email: customer.email,
                                    fail_existing: '0'
                                };
                                return [
                                    4,
                                    this.razorpayPg.razorpayVirtualAccount('https://api.razorpay.com/v1/customers', data)
                                ];
                            case 2:
                                response = _state.sent();
                                if (response.data.status === 'error') {
                                    throw new Error(response.data.message);
                                }
                                customerData = response.data;
                                return [
                                    4,
                                    db('virtualCustomer').insert({
                                        customerID: customer.customerID,
                                        leadID: lead.leadID,
                                        custID: customerData.id,
                                        custName: customerData.name,
                                        custEmail: customerData.email,
                                        custMobile: customerData.contact,
                                        custPan: customer.pancard,
                                        credatedDate: date,
                                        uid: userId
                                    })
                                ];
                            case 3:
                                _state.sent();
                                return [
                                    2,
                                    customerData.id
                                ];
                            case 4:
                                return [
                                    2,
                                    existingCustomer.custID
                                ];
                        }
                    });
                }).call(this);
            }
        },
        {
            key: "EmandateCharges",
            value: function EmandateCharges(leadID, page, perPage) {
                return _async_to_generator(function() {
                    var db, _ref, query, totalCount, createdByIds, users, userMap, response, EmandateChargeData;
                    return _ts_generator(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                db = getKnexInstance();
                                return [
                                    4,
                                    Promise.all([
                                        db('onlinepayment').select('onlinepayment.razorpayPaymentId', 'onlinepayment.paymentType', 'onlinepayment.razorpayOrderId', 'onlinepayment.toValue', 'onlinepayment.makerstamp', 'onlinepayment.paymentStatus', 'razorpay_emOrder.uid').join('razorpay_emOrder', function() {
                                            this.on('onlinepayment.leadID', '=', 'razorpay_emOrder.leadID').andOn('onlinepayment.razorpayPaymentId', '=', 'razorpay_emOrder.razorpay_payment_id');
                                        }).where({
                                            'onlinepayment.leadID': leadID,
                                            'onlinepayment.typeProduct': 'Emandate'
                                        }).limit(perPage).offset((page - 1) * perPage),
                                        this.onlinePaymentModel.count({
                                            leadID: leadID,
                                            typeProduct: 'Emandate'
                                        })
                                    ])
                                ];
                            case 1:
                                _ref = _sliced_to_array.apply(void 0, [
                                    _state.sent(),
                                    2
                                ]), query = _ref[0], totalCount = _ref[1];
                                createdByIds = _to_consumable_array(new Set(query.map(function(data) {
                                    return data.uid;
                                })));
                                return [
                                    4,
                                    this.userModel.find({
                                        whereIn: [
                                            {
                                                column: 'userID',
                                                value: createdByIds
                                            }
                                        ],
                                        select: [
                                            'userID',
                                            'name'
                                        ]
                                    })
                                ];
                            case 2:
                                users = _state.sent();
                                userMap = users.reduce(function(map, user) {
                                    map[user.userID] = user.name;
                                    return map;
                                }, {});
                                response = query.map(function(data) {
                                    return _object_spread_props(_object_spread({}, data), {
                                        DateIST: formatToIST(data.makerstamp),
                                        ChargedBY: userMap[data.uid] || 'N/A'
                                    });
                                });
                                EmandateChargeData = {
                                    response: response,
                                    totalCount: totalCount,
                                    totalPages: Math.ceil(totalCount / perPage)
                                };
                                return [
                                    2,
                                    this.serviceResponse(HttpStatusCode.Ok, EmandateChargeData, 'Success')
                                ];
                        }
                    });
                }).call(this);
            }
        },
        {
            key: "BankAccountDetails",
            value: function BankAccountDetails(leadID, page, perPage) {
                return _async_to_generator(function() {
                    var _this, _ref, leadData, AccountData, accountPromises, accountMap, uniqueAccounts, totalCount, customerAccountData;
                    return _ts_generator(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                _this = this;
                                return [
                                    4,
                                    this.leadModel.findOneLead({
                                        leadID: leadID
                                    }, [
                                        'customerID'
                                    ])
                                ];
                            case 1:
                                leadData = _state.sent();
                                return [
                                    4,
                                    this.customerAccountModel.find({
                                        where: {
                                            customerID: leadData.customerID
                                        },
                                        select: [
                                            '*'
                                        ],
                                        order: [
                                            {
                                                column: 'accountID',
                                                order: 'desc'
                                            }
                                        ],
                                        paginate: {
                                            perPage: perPage,
                                            page: page
                                        }
                                    })
                                ];
                            case 2:
                                AccountData = _state.sent();
                                accountPromises = AccountData.map(function(account) {
                                    return _async_to_generator(function() {
                                        var bankIfsc;
                                        return _ts_generator(this, function(_state) {
                                            switch(_state.label){
                                                case 0:
                                                    return [
                                                        4,
                                                        this.bankIfscModel.findOne({
                                                            where: {
                                                                IFSC: account.bankIfsc
                                                            },
                                                            select: [
                                                                'BRANCH'
                                                            ]
                                                        })
                                                    ];
                                                case 1:
                                                    bankIfsc = _state.sent();
                                                    return [
                                                        2,
                                                        _object_spread_props(_object_spread({}, account), {
                                                            bankBranch: (bankIfsc === null || bankIfsc === void 0 ? void 0 : bankIfsc.BRANCH) || ''
                                                        })
                                                    ];
                                            }
                                        });
                                    }).call(_this);
                                });
                                return [
                                    4,
                                    Promise.all(accountPromises)
                                ];
                            case 3:
                                // Resolve all promises to get accounts with branch info
                                AccountData = _state.sent();
                                // Group accounts by account number, prioritizing verified status
                                accountMap = new Map();
                                // First pass - group accounts and bank holder names by account number
                                AccountData.forEach(function(account) {
                                    if (!accountMap.has(account.accountNo)) {
                                        accountMap.set(account.accountNo, {
                                            accounts: [
                                                account
                                            ],
                                            holderNames: account.bank_holder_name ? [
                                                account.bank_holder_name
                                            ] : []
                                        });
                                    } else {
                                        var entry = accountMap.get(account.accountNo);
                                        entry.accounts.push(account);
                                        if (account.bank_holder_name && !entry.holderNames.includes(account.bank_holder_name)) {
                                            entry.holderNames.push(account.bank_holder_name);
                                        }
                                    }
                                });
                                // Second pass - select the best account for each account number
                                uniqueAccounts = [];
                                accountMap.forEach(function(entry, accountNo) {
                                    // Prioritize accounts with status "Verified" (if any)
                                    var verifiedAccount = entry.accounts.find(function(acc) {
                                        return acc.status === 'Verified';
                                    });
                                    // Otherwise take the most recent one (highest accountID)
                                    var bestAccount = verifiedAccount || entry.accounts.reduce(function(prev, curr) {
                                        return curr.accountID > prev.accountID ? curr : prev;
                                    });
                                    // Add the consolidated holder names to the best account
                                    uniqueAccounts.push(_object_spread_props(_object_spread({}, bestAccount), {
                                        bank_holder_name: entry.holderNames.length > 1 ? entry.holderNames.join(', ') : entry.holderNames[0] || ''
                                    }));
                                });
                                // Replace AccountData with unique accounts
                                AccountData = uniqueAccounts;
                                // Update total count
                                totalCount = (_ref = AccountData === null || AccountData === void 0 ? void 0 : AccountData.length) !== null && _ref !== void 0 ? _ref : 0;
                                customerAccountData = {
                                    AccountData: AccountData,
                                    totalCount: totalCount,
                                    totalPages: Math.ceil(totalCount / perPage)
                                };
                                return [
                                    2,
                                    this.serviceResponse(HttpStatusCode.Ok, customerAccountData, 'Success')
                                ];
                        }
                    });
                }).call(this);
            }
        },
        {
            key: "getSOA",
            value: function getSOA(customerId, page, perPage) {
                return _async_to_generator(function() {
                    var db, offset, loanData, leadIds, leadProductData, productIdMap, processedData, totalCount, soaData;
                    return _ts_generator(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                db = getKnexInstance();
                                offset = (page - 1) * perPage;
                                return [
                                    4,
                                    db('loan').where('customerID', customerId).where('status', 'Disbursed').select('loanNo', 'disbursalAmount', 'leadId', 'payout_status as payoutStatus').limit(perPage).offset(offset)
                                ];
                            case 1:
                                loanData = _state.sent();
                                leadIds = loanData.map(function(loan) {
                                    return loan.leadId;
                                });
                                return [
                                    4,
                                    db('leads').whereIn('leadID', leadIds).select('leadID', 'productID')
                                ];
                            case 2:
                                leadProductData = _state.sent();
                                productIdMap = new Map(leadProductData.map(function(lead) {
                                    return [
                                        lead.id,
                                        lead.productID
                                    ];
                                }));
                                return [
                                    4,
                                    Promise.all(loanData.map(function(loan) {
                                        return _async_to_generator(function() {
                                            var productID, collectionData, collectionData1;
                                            return _ts_generator(this, function(_state) {
                                                switch(_state.label){
                                                    case 0:
                                                        productID = productIdMap.get(loan.leadId);
                                                        if (!(productID === 1)) return [
                                                            3,
                                                            2
                                                        ];
                                                        return [
                                                            4,
                                                            db('transactions').where('leadId', loan.leadId).where('emiID', 0).whereIn('status', [
                                                                1,
                                                                3
                                                            ]).sum({
                                                                totalCollectedAmount: 'amount'
                                                            }).max({
                                                                lastCollectedDate: 'transactionDate'
                                                            }).first()
                                                        ];
                                                    case 1:
                                                        collectionData = _state.sent();
                                                        return [
                                                            2,
                                                            _object_spread_props(_object_spread({}, loan), {
                                                                totalCollectedAmount: (collectionData === null || collectionData === void 0 ? void 0 : collectionData.totalCollectedAmount) || 0,
                                                                lastCollectedDate: (collectionData === null || collectionData === void 0 ? void 0 : collectionData.lastCollectedDate) ? formatToIST(collectionData.lastCollectedDate) : null
                                                            })
                                                        ];
                                                    case 2:
                                                        return [
                                                            4,
                                                            db('collection').where('leadId', loan.leadId).where('collectionStatus', 'Approved').sum({
                                                                totalCollectedAmount: 'collectedAmount'
                                                            }).max({
                                                                lastCollectedDate: 'collectedDate'
                                                            }).first()
                                                        ];
                                                    case 3:
                                                        collectionData1 = _state.sent();
                                                        return [
                                                            2,
                                                            _object_spread_props(_object_spread({}, loan), {
                                                                totalCollectedAmount: (collectionData1 === null || collectionData1 === void 0 ? void 0 : collectionData1.totalCollectedAmount) || 0,
                                                                lastCollectedDate: (collectionData1 === null || collectionData1 === void 0 ? void 0 : collectionData1.lastCollectedDate) ? formatToIST(collectionData1.lastCollectedDate) : null
                                                            })
                                                        ];
                                                    case 4:
                                                        return [
                                                            2
                                                        ];
                                                }
                                            });
                                        })();
                                    }))
                                ];
                            case 3:
                                processedData = _state.sent();
                                return [
                                    4,
                                    this.loanModel.count({
                                        customerID: customerId,
                                        status: 'Disbursed'
                                    })
                                ];
                            case 4:
                                totalCount = _state.sent();
                                soaData = {
                                    result: processedData,
                                    totalCount: totalCount,
                                    totalPages: Math.ceil(totalCount / perPage)
                                };
                                return [
                                    2,
                                    this.serviceResponse(HttpStatusCode.Ok, soaData, 'Success')
                                ];
                        }
                    });
                }).call(this);
            }
        },
        {
            key: "generateSoaByLeadId",
            value: function generateSoaByLeadId(leadID, customerID) {
                return _async_to_generator(function() {
                    var data, templatePath, renderedHtml, err;
                    return _ts_generator(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                _state.trys.push([
                                    0,
                                    3,
                                    ,
                                    4
                                ]);
                                return [
                                    4,
                                    this.getEmisLoanDetails(leadID, customerID)
                                ];
                            case 1:
                                data = _state.sent();
                                templatePath = path.join(__dirname, '..', 'views', 'loansDocs', 'soa.ejs');
                                return [
                                    4,
                                    ejs.renderFile(templatePath, {
                                        data: data
                                    })
                                ];
                            case 2:
                                renderedHtml = _state.sent();
                                renderedHtml = renderedHtml.replace(/\n/g, '');
                                return [
                                    2,
                                    this.serviceResponse(200, {
                                        renderedHtml: renderedHtml
                                    }, 'SOA rendered successfully')
                                ];
                            case 3:
                                err = _state.sent();
                                throw err;
                            case 4:
                                return [
                                    2
                                ];
                        }
                    });
                }).call(this);
            }
        },
        {
            key: "generateSoaPaydayByLeadId",
            value: function generateSoaPaydayByLeadId(leadID, customerID) {
                return _async_to_generator(function() {
                    var _loanDetails_, _data_collectionDetailsLast, _data_collectionDetailsLast1, loanDetails, db, approval, lead, customer, loan, Data, data, templatePath, htmlContent, err;
                    return _ts_generator(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                _state.trys.push([
                                    0,
                                    8,
                                    ,
                                    9
                                ]);
                                return [
                                    4,
                                    this.getPaydayLoanDetails(leadID, customerID)
                                ];
                            case 1:
                                loanDetails = _state.sent();
                                db = getKnexInstance();
                                return [
                                    4,
                                    db('approval').where('customerID', customerID).where('leadID', leadID).where('status', 'Approved').first()
                                ];
                            case 2:
                                approval = _state.sent();
                                if (!approval) {
                                    throw new NotFoundError('No approval record found.');
                                }
                                return [
                                    4,
                                    db('leads').where('leadID', leadID).select('kfs_ip', 'ipc', 'leadID', 'status').first()
                                ];
                            case 3:
                                lead = _state.sent();
                                return [
                                    4,
                                    db('customer').where('customerID', approval.customerID).first()
                                ];
                            case 4:
                                customer = _state.sent();
                                if (!customer) {
                                    throw new NotFoundError('No customer record found.');
                                }
                                return [
                                    4,
                                    db('loan').where('customerID', customer.customerID).where('leadID', approval.leadID).first()
                                ];
                            case 5:
                                loan = _state.sent();
                                Data = {
                                    lead: lead,
                                    loan: loan,
                                    approval: approval
                                };
                                return [
                                    4,
                                    this.processLeadData(Data)
                                ];
                            case 6:
                                data = _state.sent();
                                templatePath = path.join(__dirname, '..', 'views', 'loansDocs', 'payday.ejs');
                                return [
                                    4,
                                    ejs.renderFile(templatePath, {
                                        statementDate: formatToISTDate(new Date()),
                                        startDate: ((_loanDetails_ = loanDetails[0]) === null || _loanDetails_ === void 0 ? void 0 : _loanDetails_.disbursalDate) ? formatToISTDate(new Date(loanDetails[0].disbursalDate)) : null,
                                        endDate: (data === null || data === void 0 ? void 0 : (_data_collectionDetailsLast = data.collectionDetailsLast) === null || _data_collectionDetailsLast === void 0 ? void 0 : _data_collectionDetailsLast.collectedDate) ? formatToISTDate(data === null || data === void 0 ? void 0 : (_data_collectionDetailsLast1 = data.collectionDetailsLast) === null || _data_collectionDetailsLast1 === void 0 ? void 0 : _data_collectionDetailsLast1.collectedDate) : null,
                                        customerDetails: {
                                            name: loanDetails[0].customerName,
                                            address: loanDetails[0].address,
                                            pan: loanDetails[0].pancard,
                                            mobile: loanDetails[0].mobile,
                                            loanNo: loanDetails[0].loanNo,
                                            branch: 'Delhi',
                                            product: 'Pay Day Loan'
                                        },
                                        loanDetails: {
                                            roi: loanDetails[0].roi,
                                            interestRateType: loanDetails[0].interestRateType,
                                            tenure: loanDetails[0].tenure,
                                            penalty: loanDetails[0].penaltyCharge,
                                            bounceCharge: loanDetails[0].bounceCharge,
                                            status: loanDetails[0].status,
                                            loanAmount: loanDetails[0].loanAmtApproved,
                                            amountDisbursed: loanDetails[0].disbursalAmount,
                                            pfGst: loanDetails[0].pfAndGst,
                                            totalRepayment: loanDetails[0].totalRepayAmount
                                        },
                                        paymentSummary: {
                                            amountOverdue: data.totalAmountOverdue,
                                            amountPaid: data.totalCollectedSum,
                                            principalPaid: data.totalCollectedPrincipal,
                                            interestPaid: data.totalCollectedPrincipal,
                                            chargesPaid: data.totalCollectedPenality,
                                            excess: data.totalExcessAmount,
                                            otherCharges: data.otherCharges,
                                            bounceCount: data.dpd > 0 ? 1 : 0,
                                            dpd: data.dpd,
                                            settlementWaiver: data.settlementWaiver,
                                            closureWaiver: data.closedWaiver
                                        },
                                        transactionDetails: data.transactionDataEmi,
                                        totalSummary: {
                                            debit: data.totalSummary.debit,
                                            credit: data.totalSummary.credit
                                        }
                                    })
                                ];
                            case 7:
                                htmlContent = _state.sent();
                                htmlContent = htmlContent.replace(/\n/g, '');
                                return [
                                    2,
                                    this.serviceResponse(200, {
                                        htmlContent: htmlContent
                                    }, 'SOA rendered successfully')
                                ];
                            case 8:
                                err = _state.sent();
                                throw err;
                            case 9:
                                return [
                                    2
                                ];
                        }
                    });
                }).call(this);
            }
        },
        {
            key: "getEmisLoanDetails",
            value: function getEmisLoanDetails(leadId, customerId) {
                return _async_to_generator(function() {
                    var _this, db, customerData, address, loanData, credit, getEmis, emiAmount, processedEmis, InterestPaid, InstallmentOverdue, InstallmentPaid, PrincipalPaid, outStandingAmount, otherChargesPaid, penaltyInterest, dpd, writeOffPrincipal, writeOffInterest, writeOffCharges, totalAmountToBePaid, flag, transactions, totalDebit, totalCredit, deletedRows, result, result1, emiTransaction, emiID, emiIDs, closingBalance, getOrdinal, emiGroupMap, finalParticulars, _loop, emiIndex, emi_id, debitAmount, creditAmount, transactionDate, formatDate, firstDueDate, tenureInMonths, newDate, formattedDate, totalData;
                    return _ts_generator(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                _this = this;
                                db = getKnexInstance();
                                return [
                                    4,
                                    this.customerModel.findOneCustomer({
                                        customerID: customerId
                                    }, [
                                        'name',
                                        'pancard',
                                        'mobile'
                                    ], [
                                        {
                                            column: 'customerID',
                                            order: 'desc'
                                        }
                                    ])
                                ];
                            case 1:
                                customerData = _state.sent();
                                return [
                                    4,
                                    this.addressModel.findOneAddress({
                                        customerID: customerId
                                    }, [
                                        'address'
                                    ], [
                                        {
                                            column: 'addressID',
                                            order: 'desc'
                                        }
                                    ])
                                ];
                            case 2:
                                address = _state.sent();
                                return [
                                    4,
                                    db('loan').join('leads', 'loan.leadID', '=', 'leads.leadID').join('credits', 'loan.leadID', '=', 'credits.leadID').join('approval', 'approval.leadID', '=', 'leads.leadID').select('loan.loanNo', 'loan.payout_status', 'loan.disbursalDate', 'loan.disbursalAmount', 'loan.deduction', 'leads.productID', 'leads.status', 'credits.roi', 'credits.gst', 'credits.tenure', 'credits.interest', 'credits.repaymentAmount', 'credits.processingFee', 'credits.principal', 'credits.amountToBeRepayed', 'approval.loanAmtApproved').where('loan.leadID', leadId).andWhere('leads.leadID', leadId).andWhere('credits.leadID', leadId)
                                ];
                            case 3:
                                loanData = _state.sent();
                                if (loanData[0].payout_status != 2) {
                                    throw new BadRequestError('Please wait until payout status changes');
                                }
                                return [
                                    4,
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
                                        'created_at',
                                        'processingFee',
                                        'gst'
                                    ])
                                ];
                            case 4:
                                credit = _state.sent();
                                return [
                                    4,
                                    this.emiService.find({
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
                                        'waive_off_amount'
                                    ])
                                ];
                            case 5:
                                getEmis = _state.sent();
                                emiAmount = getEmis[0].amountPayable;
                                return [
                                    4,
                                    Promise.all(getEmis.map(function(emi) {
                                        return _async_to_generator(function() {
                                            return _ts_generator(this, function(_state) {
                                                return [
                                                    2,
                                                    this.emiService.processEmi(emi, credit)
                                                ];
                                            });
                                        }).call(_this);
                                    }))
                                ];
                            case 6:
                                processedEmis = _state.sent();
                                InterestPaid = 0;
                                InstallmentOverdue = 0;
                                InstallmentPaid = 0;
                                PrincipalPaid = 0;
                                outStandingAmount = 0;
                                otherChargesPaid = 0;
                                penaltyInterest = 0;
                                dpd = 0;
                                writeOffPrincipal = 0;
                                writeOffInterest = 0;
                                writeOffCharges = 0;
                                // penaltyInterest = Math.round((credit.roi / 365 + 0.1) * 365)
                                penaltyInterest = +config.ipcDpdInterest * 365;
                                totalAmountToBePaid = 0;
                                flag = false;
                                processedEmis.forEach(function(emi) {
                                    totalAmountToBePaid += emi.amountPayable;
                                    if (emi.status === 'Paid' || emi.status === 'Part Paid') {
                                        var _emi_amountRemainsInterest, _emi_amountRemainsPenalty, _emi_amountRemainsBrokenPeriodIntrest;
                                        var amountRemainsInterest = (_emi_amountRemainsInterest = emi.amountRemainsInterest) !== null && _emi_amountRemainsInterest !== void 0 ? _emi_amountRemainsInterest : 0;
                                        var amountRemainsPenalty = (_emi_amountRemainsPenalty = emi.amountRemainsPenalty) !== null && _emi_amountRemainsPenalty !== void 0 ? _emi_amountRemainsPenalty : 0;
                                        var amountRemainsBrokenPeriodIntrest = (_emi_amountRemainsBrokenPeriodIntrest = emi.amountRemainsBrokenPeriodIntrest) !== null && _emi_amountRemainsBrokenPeriodIntrest !== void 0 ? _emi_amountRemainsBrokenPeriodIntrest : 0;
                                        InterestPaid += emi.interest + emi.brokenPeriodIntrest + emi.panelty - (amountRemainsInterest + amountRemainsBrokenPeriodIntrest + amountRemainsPenalty);
                                    }
                                    if (emi.status === 'Overdue') {
                                        InstallmentOverdue += emi.amountPayable;
                                    }
                                    if (emi.status === 'Paid') {
                                        InstallmentPaid += +emi.paymentReceived;
                                    }
                                    if (emi.status === 'Paid' || emi.status === 'Part Paid') {
                                        PrincipalPaid += emi.principal - emi.amountRemains;
                                    }
                                    if (emi.status != 'Paid') {
                                        outStandingAmount += emi.amountPayable;
                                    }
                                    if (emi.status === 'Paid' || emi.status === 'Part Paid') {
                                        otherChargesPaid += emi.brokenPeriodIntrest - emi.amountRemainsBrokenPeriodIntrest;
                                    }
                                    // if (emi.status !== 'paid' && dueDate < currentDate) {
                                    //   dpd = differenceInCalendarDays(currentDate, dueDate); // Calculate Days Past Due
                                    // }
                                    var dueDate = new Date(emi.dueDate);
                                    var currentDate = new Date();
                                    if (flag === false && emi.status != 'Paid' && dueDate < currentDate) {
                                        dpd = differenceInCalendarDays(currentDate, dueDate);
                                        flag = true;
                                    }
                                });
                                transactions = [];
                                totalDebit = 0;
                                totalCredit = 0;
                                return [
                                    4,
                                    db('equated_monthly_installments').select('emiID').where({
                                        leadID: leadId,
                                        is_deleted: 1
                                    })
                                ];
                            case 7:
                                deletedRows = _state.sent();
                                if (!(deletedRows.length > 0)) return [
                                    3,
                                    9
                                ];
                                return [
                                    4,
                                    db('equated_monthly_installments').sum({
                                        totalAmountRemains: 'amountRemains',
                                        totalAmountRemainsInterest: 'amountRemainsInterest',
                                        totalAmountRemainPenalty: 'amountRemainsPenalty'
                                    }).where({
                                        leadId: leadId,
                                        is_deleted: 0,
                                        status: 'paid'
                                    })
                                ];
                            case 8:
                                result = _state.sent();
                                writeOffPrincipal = result[0].totalAmountRemains;
                                writeOffInterest = result[0].totalAmountRemainsInterest;
                                writeOffCharges = result[0].totalAmountRemainPenalty;
                                _state.label = 9;
                            case 9:
                                result1 = [];
                                result1[0] = [];
                                result1[0].length = 0;
                                return [
                                    4,
                                    db.raw("\n      SELECT emiID\n      FROM equated_monthly_installments\n      WHERE leadID = ?\n      AND status IN ('paid', 'partially-paid')\n      ORDER BY emiID DESC\n    ", [
                                        leadId
                                    ])
                                ];
                            case 10:
                                emiTransaction = _state.sent();
                                if (!(emiTransaction[0].length > 0)) return [
                                    3,
                                    12
                                ];
                                emiID = emiTransaction[0];
                                emiIDs = emiID.map(function(item) {
                                    return item.emiID;
                                });
                                return [
                                    4,
                                    db.raw("\n      SELECT emi_id, interest, principal, penalty, dpd_amount,transaction_date\n      FROM emi_transactions\n      WHERE emi_id IN (?)\n    ", [
                                        emiIDs
                                    ])
                                ];
                            case 11:
                                result1 = _state.sent();
                                _state.label = 12;
                            case 12:
                                closingBalance = loanData[0].loanAmtApproved;
                                transactions.push({
                                    txnDate: loanData[0].disbursalDate,
                                    particular: 'PAID - Loan Disbursal',
                                    debit: '',
                                    credit: loanData[0].loanAmtApproved,
                                    closingBalance: closingBalance
                                }, {
                                    txnDate: formatToISTDate(credit.created_at),
                                    particular: 'DUE - Processing fee charged',
                                    debit: credit.processingFee,
                                    credit: '',
                                    closingBalance: closingBalance
                                }, {
                                    txnDate: formatToISTDate(credit.created_at),
                                    particular: 'DUE - GST charged',
                                    debit: credit.gst,
                                    credit: '',
                                    closingBalance: closingBalance
                                });
                                totalDebit += credit.processingFee + credit.gst;
                                getOrdinal = function getOrdinal(n) {
                                    var suffix = [
                                        'th',
                                        'st',
                                        'nd',
                                        'rd'
                                    ];
                                    var value = n % 100;
                                    return n + (suffix[(value - 20) % 10] || suffix[value] || suffix[0]);
                                };
                                emiGroupMap = {};
                                finalParticulars = [];
                                if (result1[0].length > 0) {
                                    _loop = function(emi_id) {
                                        var iterationLabel = getOrdinal(emiIndex);
                                        emiGroupMap[emi_id].forEach(function(item) {
                                            if (parseFloat(item.interest) > 0) {
                                                finalParticulars.push({
                                                    particular: "PAID - Interest for ".concat(iterationLabel, " EMI Installment"),
                                                    credit: item.interest,
                                                    transactionDate: item.transaction_date
                                                });
                                                finalParticulars.push({
                                                    particular: "DUE - Interest for ".concat(iterationLabel, " EMI Installment"),
                                                    debit: item.interest,
                                                    transactionDate: item.transaction_date
                                                });
                                            }
                                            if (parseFloat(item.principal) > 0) {
                                                finalParticulars.push({
                                                    particular: "DUE - Principal for ".concat(iterationLabel, " EMI Installment"),
                                                    debit: item.principal,
                                                    transactionDate: item.transaction_date
                                                });
                                            }
                                            if (parseFloat(item.penalty) > 0) {
                                                finalParticulars.push({
                                                    particular: "Charges for ".concat(iterationLabel, " EMI Installment"),
                                                    credit: item.penalty,
                                                    transactionDate: item.transaction_date
                                                });
                                                finalParticulars.push({
                                                    particular: "Charges for ".concat(iterationLabel, " EMI Installment"),
                                                    debit: item.penalty,
                                                    transactionDate: item.transaction_date
                                                });
                                            }
                                            if (parseFloat(item.dpd_amount) > 0) {
                                                finalParticulars.push({
                                                    particular: "Bounce Charges for ".concat(iterationLabel, " EMI"),
                                                    credit: item.dpd_amount,
                                                    transactionDate: item.transaction_date
                                                });
                                                finalParticulars.push({
                                                    particular: "Bounce Charges for ".concat(iterationLabel, " EMI"),
                                                    debit: item.dpd_amount,
                                                    transactionDate: item.transaction_date
                                                });
                                            }
                                        });
                                        emiIndex++;
                                    };
                                    result1[0].forEach(function(item) {
                                        if (!emiGroupMap[item.emi_id]) {
                                            emiGroupMap[item.emi_id] = [];
                                        }
                                        emiGroupMap[item.emi_id].push(item);
                                    });
                                    // const finalParticulars: any[] = []
                                    emiIndex = 1;
                                    for(var emi_id in emiGroupMap)_loop(emi_id);
                                }
                                debitAmount = 0;
                                creditAmount = 0;
                                finalParticulars.forEach(function(item) {
                                    debitAmount = item.debit > 0 ? item.debit : 0;
                                    creditAmount = item.credit > 0 ? item.credit : 0;
                                    if (item.debit > 0) {
                                        closingBalance -= +item.debit;
                                    } else if (item.credit > 0) {
                                        closingBalance += +item.credit;
                                    }
                                    if (item.debit > 0 || item.credit > 0) {
                                        transactions.push({
                                            txnDate: formatToISTDate(item.transactionDate),
                                            particular: item.particular,
                                            debit: item.debit,
                                            credit: item.credit,
                                            closingBalance: Math.round(closingBalance)
                                        });
                                    }
                                    totalDebit += debitAmount;
                                    totalCredit += creditAmount;
                                });
                                return [
                                    4,
                                    db('equated_monthly_installments').where({
                                        leadId: leadId,
                                        status: 'paid',
                                        is_deleted: 0
                                    }).orderBy('emiID', 'desc').select('emiID', 'actualPaymentDate').limit(1)
                                ];
                            case 13:
                                transactionDate = _state.sent();
                                if (writeOffInterest > 0) {
                                    transactions.push({
                                        txnDate: formatToISTDate(transactionDate[0].actualPaymentDate),
                                        particular: 'Write off Interest',
                                        debit: '',
                                        credit: writeOffInterest,
                                        closingBalance: closingBalance + writeOffInterest
                                    });
                                    closingBalance += +writeOffInterest;
                                    transactions.push({
                                        txnDate: formatToISTDate(transactionDate[0].actualPaymentDate),
                                        particular: 'Write off Interest',
                                        debit: writeOffInterest,
                                        credit: '',
                                        closingBalance: closingBalance - writeOffInterest
                                    });
                                    closingBalance -= +writeOffInterest;
                                }
                                if (writeOffCharges > 0) {
                                    transactions.push({
                                        txnDate: formatToISTDate(transactionDate[0].actualPaymentDate),
                                        particular: 'Write off Charges',
                                        debit: '',
                                        credit: writeOffCharges,
                                        closingBalance: closingBalance + writeOffCharges
                                    });
                                    closingBalance += +writeOffCharges;
                                    transactions.push({
                                        txnDate: formatToISTDate(transactionDate[0].actualPaymentDate),
                                        particular: 'Write off Charges',
                                        debit: writeOffCharges,
                                        credit: '',
                                        closingBalance: closingBalance - writeOffCharges
                                    });
                                    closingBalance -= +writeOffCharges;
                                }
                                if (writeOffPrincipal > 0) {
                                    transactions.push({
                                        txnDate: formatToISTDate(transactionDate[0].actualPaymentDate),
                                        particular: 'Write off Principle',
                                        debit: writeOffPrincipal,
                                        credit: '',
                                        closingBalance: closingBalance - writeOffPrincipal
                                    });
                                    closingBalance -= +writeOffPrincipal;
                                }
                                formatDate = function formatDate(date) {
                                    var dateObj = new Date(date);
                                    return dateObj.toISOString().split('T')[0];
                                };
                                firstDueDate = new Date(credit.firstDueDate);
                                tenureInMonths = credit.tenure - 1;
                                newDate = addMonths(firstDueDate, tenureInMonths);
                                // Format the new date into the desired format
                                formattedDate = format(newDate, 'yyyy-MM-dd');
                                totalData = {
                                    date: formatToISTDate(new Date()),
                                    fromDate: loanData[0].disbursalDate,
                                    toDate: formatToISTDate(new Date()),
                                    customer: {
                                        name: customerData.name,
                                        mobile: customerData.mobile,
                                        pancard: customerData.pancard
                                    },
                                    address: {
                                        address: address.address
                                    },
                                    loan: {
                                        type: 'EMI',
                                        loanNo: loanData[0].loanNo,
                                        disbursalDate: loanData[0].disbursalDate,
                                        product: 'EMI (Personal Loan)'
                                    },
                                    emi: {
                                        installmentPeriod: "".concat(format(firstDueDate, 'yyyy-MM-dd'), " - ").concat(formattedDate),
                                        emiAmount: emiAmount,
                                        roi: credit.roi,
                                        penaltyInterest: penaltyInterest,
                                        writeOffAmount: {
                                            principle: writeOffPrincipal,
                                            interest: writeOffInterest,
                                            charges: writeOffCharges
                                        },
                                        dpd: loanData[0].status === 'Closed' ? 0 : dpd,
                                        restructured: false,
                                        processingFee: credit.processingFee,
                                        gst: credit.gst,
                                        tenure: credit.tenure,
                                        loanAmount: loanData[0].loanAmtApproved,
                                        disbursedAmount: loanData[0].disbursalAmount - loanData[0].deduction,
                                        repayAmount: credit.amountToBeRepayed,
                                        installmentOverdue: InstallmentOverdue,
                                        installmentPaid: Math.round(InstallmentPaid),
                                        principlePaid: PrincipalPaid,
                                        interestPaid: Math.round(InterestPaid),
                                        otherChargesPaid: otherChargesPaid,
                                        outstandingAmount: outStandingAmount
                                    },
                                    totalDebit: totalDebit,
                                    totalCredit: totalCredit,
                                    transactions: transactions
                                };
                                return [
                                    2,
                                    totalData
                                ];
                        }
                    });
                }).call(this);
            }
        },
        {
            key: "noDuesByLead",
            value: function noDuesByLead(payload) {
                return _async_to_generator(function() {
                    var leadID, customerID, customer, lead, loan, db, collectedDate, collection, transaction, res;
                    return _ts_generator(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                leadID = payload.leadID, customerID = payload.customerID;
                                return [
                                    4,
                                    this.customerModel.findOneCustomer({
                                        customerID: customerID
                                    }, [
                                        'customerID',
                                        'name'
                                    ])
                                ];
                            case 1:
                                customer = _state.sent();
                                if (!customer) {
                                    throw new NotFoundError('Customer not found');
                                }
                                return [
                                    4,
                                    this.findOne({
                                        leadID: leadID
                                    }, [
                                        '*'
                                    ])
                                ];
                            case 2:
                                lead = _state.sent();
                                if (!lead) {
                                    throw new NotFoundError('Lead not found');
                                }
                                return [
                                    4,
                                    this.loanService.findOne({
                                        leadID: leadID,
                                        customerID: customerID
                                    }, [
                                        'leadID',
                                        'disbursalAmount',
                                        'disbursalDate',
                                        'loanNo'
                                    ])
                                ];
                            case 3:
                                loan = _state.sent();
                                if (!loan) {
                                    throw new NotFoundError('loan not found');
                                }
                                db = getKnexInstance();
                                collectedDate = null;
                                if (!(lead.productID === ProductID.PAYDAY)) return [
                                    3,
                                    5
                                ];
                                return [
                                    4,
                                    db('collection').join('loan', 'loan.leadID', '=', 'collection.leadID').select('collection.collectedDate').where('loan.leadID', leadID).where('collection.status', 'Closed').orderBy('collection.collectionID', 'desc').first()
                                ];
                            case 4:
                                collection = _state.sent();
                                collectedDate = collection ? collection.collectedDate : null;
                                return [
                                    3,
                                    7
                                ];
                            case 5:
                                if (!(lead.productID === ProductID.EMI)) return [
                                    3,
                                    7
                                ];
                                return [
                                    4,
                                    db('transactions').select(db.raw('COALESCE(transactions.transactionDate, transactions.createdAt) AS collectedDate')).where('transactions.leadID', leadID).whereIn('transactions.status', [
                                        1,
                                        3
                                    ]).orderBy('transactions.id', 'desc').first()
                                ];
                            case 6:
                                transaction = _state.sent();
                                collectedDate = transaction ? transaction.collectedDate : null;
                                _state.label = 7;
                            case 7:
                                res = {
                                    customerID: customer.customerID,
                                    leadID: loan.leadID,
                                    name: customer.name,
                                    email: customer.email,
                                    loanNo: loan.loanNo,
                                    disbursalAmount: loan.disbursalAmount,
                                    disbursalDate: moment(loan.disbursalDate).format('Do MMM, YYYY'),
                                    currentDate: moment().format('Do MMM, YYYY'),
                                    collectedDate: moment(collectedDate).format('Do MMM, YYYY')
                                };
                                return [
                                    2,
                                    this.serviceResponse(200, res, 'No Dues Data retreived successfully.')
                                ];
                        }
                    });
                }).call(this);
            }
        },
        {
            key: "convertImageUrlToBase64",
            value: function convertImageUrlToBase64(url) {
                return _async_to_generator(function() {
                    var response, base64Image, error;
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
                                    axios.get(url, {
                                        responseType: 'arraybuffer'
                                    })
                                ];
                            case 1:
                                response = _state.sent();
                                base64Image = Buffer.from(response.data, 'binary').toString('base64');
                                return [
                                    2,
                                    "data:image/jpeg;base64,".concat(base64Image)
                                ];
                            case 2:
                                error = _state.sent();
                                console.error('Error fetching or encoding image:', error);
                                throw error;
                            case 3:
                                return [
                                    2
                                ];
                        }
                    });
                })();
            }
        },
        {
            key: "noDuesPdf",
            value: function noDuesPdf(payload) {
                return _async_to_generator(function() {
                    var _this;
                    return _ts_generator(this, function(_state) {
                        _this = this;
                        return [
                            2,
                            new Promise(function(resolve, reject) {
                                return _async_to_generator(function() {
                                    var noDuesData, templatePath, htmlContent, headerUrl, footerUrl, headerImage, footerImage, browser, page, pdfBuffer, s3FolderName, imageName, res, pdfStream, err;
                                    return _ts_generator(this, function(_state) {
                                        switch(_state.label){
                                            case 0:
                                                _state.trys.push([
                                                    0,
                                                    13,
                                                    ,
                                                    14
                                                ]);
                                                return [
                                                    4,
                                                    this.noDuesByLead(payload)
                                                ];
                                            case 1:
                                                noDuesData = _state.sent();
                                                templatePath = path.resolve(__dirname, '../views/loansDocs/noDues.ejs');
                                                return [
                                                    4,
                                                    ejs.renderFile(templatePath, {
                                                        data: noDuesData.data
                                                    })
                                                ];
                                            case 2:
                                                htmlContent = _state.sent();
                                                // Convert the S3 image URLs to base64
                                                headerUrl = 'https://bank-logo-ramfin.s3.ap-south-1.amazonaws.com/Sanction-Letter-Header.jpg';
                                                footerUrl = 'https://bank-logo-ramfin.s3.ap-south-1.amazonaws.com/Sanction-Letter-Footer.jpg';
                                                return [
                                                    4,
                                                    this.convertImageUrlToBase64(headerUrl)
                                                ];
                                            case 3:
                                                headerImage = _state.sent();
                                                return [
                                                    4,
                                                    this.convertImageUrlToBase64(footerUrl)
                                                ];
                                            case 4:
                                                footerImage = _state.sent();
                                                return [
                                                    4,
                                                    puppeteer.launch({
                                                        executablePath: '/usr/bin/chromium-browser'
                                                    })
                                                ];
                                            case 5:
                                                browser = _state.sent();
                                                return [
                                                    4,
                                                    browser.newPage()
                                                ];
                                            case 6:
                                                page = _state.sent();
                                                return [
                                                    4,
                                                    page.setContent(htmlContent, {
                                                        waitUntil: 'networkidle0'
                                                    })
                                                ];
                                            case 7:
                                                _state.sent();
                                                return [
                                                    4,
                                                    page.pdf({
                                                        format: 'A4',
                                                        displayHeaderFooter: true,
                                                        headerTemplate: '<div class="header" style="width: 100%; text-align: center;">\n            <img src="'.concat(headerImage, '" style="width:100%; max-height:150px; margin-top: -20px">\n          </div>'),
                                                        footerTemplate: '<div class="footer" style="width: 100%; text-align: center;">\n            <img src="'.concat(footerImage, '" style="width:100%; max-height:150px; margin-bottom: -18px">\n          </div>'),
                                                        margin: {
                                                            top: '150px',
                                                            bottom: '100px'
                                                        }
                                                    })
                                                ];
                                            case 8:
                                                pdfBuffer = _state.sent();
                                                return [
                                                    4,
                                                    browser.close()
                                                ];
                                            case 9:
                                                _state.sent();
                                                if (!pdfBuffer) return [
                                                    3,
                                                    12
                                                ];
                                                s3FolderName = 'documents/noDues/' + payload.customerID;
                                                imageName = 'noDues_' + Math.floor(Date.now() / 1000) + '.pdf';
                                                return [
                                                    4,
                                                    this.s3Service.uploadDocument(Buffer.from(pdfBuffer), s3FolderName, imageName)
                                                ];
                                            case 10:
                                                res = _state.sent();
                                                if (!(res && (res === null || res === void 0 ? void 0 : res.Key) !== null && res.Key !== '')) return [
                                                    3,
                                                    12
                                                ];
                                                return [
                                                    4,
                                                    this.documentModel.insert({
                                                        customerID: payload.customerID,
                                                        type: 'No Dues',
                                                        documentType: 'No Dues',
                                                        documentFile: res.Key,
                                                        status: 'Verified',
                                                        uploadBy: payload.customerID,
                                                        uploadedDate: moment().format('YYYY-MM-DD HH:mm:ss'),
                                                        verifiedBy: payload.customerID,
                                                        verifiedDate: moment().format('YYYY-MM-DD HH:mm:ss'),
                                                        upload_platform: 'S3'
                                                    })
                                                ];
                                            case 11:
                                                _state.sent();
                                                _state.label = 12;
                                            case 12:
                                                // Convert the buffer to a readable stream
                                                pdfStream = new Readable();
                                                pdfStream.push(pdfBuffer);
                                                pdfStream.push(null);
                                                resolve(pdfStream);
                                                return [
                                                    3,
                                                    14
                                                ];
                                            case 13:
                                                err = _state.sent();
                                                reject(err);
                                                return [
                                                    3,
                                                    14
                                                ];
                                            case 14:
                                                return [
                                                    2
                                                ];
                                        }
                                    });
                                }).call(_this);
                            })
                        ];
                    });
                }).call(this);
            }
        },
        {
            key: "getTenure",
            value: function getTenure(disbursalDate, repayDate) {
                return _async_to_generator(function() {
                    var disbursalTimestamp, repayTimestamp, daysDifference;
                    return _ts_generator(this, function(_state) {
                        try {
                            // Convert dates to timestamps
                            disbursalTimestamp = new Date(disbursalDate).getTime();
                            repayTimestamp = new Date(repayDate).getTime();
                            // Calculate the difference in seconds, then convert to days
                            daysDifference = Math.abs((repayTimestamp - disbursalTimestamp) / (1000 * 60 * 60 * 24));
                            return [
                                2,
                                Math.round(daysDifference)
                            ];
                        } catch (error) {
                            console.error('Error fetching or encoding image:', error);
                            throw error;
                        }
                        return [
                            2
                        ];
                    });
                })();
            }
        },
        {
            key: "disbursalByLead",
            value: function disbursalByLead(payload) {
                return _async_to_generator(function() {
                    var leadID, customerID, customer, lead, db, lender, loan, approval, repayAmount, repaymet, tenure, credit, res;
                    return _ts_generator(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                leadID = payload.leadID, customerID = payload.customerID;
                                return [
                                    4,
                                    this.customerModel.findOneCustomer({
                                        customerID: customerID
                                    }, [
                                        'customerID',
                                        'name',
                                        'email'
                                    ])
                                ];
                            case 1:
                                customer = _state.sent();
                                if (!customer) {
                                    throw new NotFoundError('Customer not found');
                                }
                                return [
                                    4,
                                    this.findOne({
                                        leadID: leadID
                                    }, [
                                        '*'
                                    ])
                                ];
                            case 2:
                                lead = _state.sent();
                                if (!lead) {
                                    throw new NotFoundError('Lead not found');
                                }
                                db = getKnexInstance();
                                return [
                                    4,
                                    db('lender').select('lender_info').where({
                                        lenderID: lead.lenderID,
                                        status: 1
                                    }).first()
                                ];
                            case 3:
                                lender = _state.sent();
                                return [
                                    4,
                                    this.loanService.findOne({
                                        leadID: leadID,
                                        customerID: customerID
                                    }, [
                                        'leadID',
                                        'disbursalAmount',
                                        'disbursalDate',
                                        'loanNo'
                                    ])
                                ];
                            case 4:
                                loan = _state.sent();
                                if (!loan) {
                                    throw new NotFoundError('Loan not found');
                                }
                                return [
                                    4,
                                    this.approvalModel.findOneApproval({
                                        leadID: leadID,
                                        customerID: customerID
                                    }, [
                                        '*'
                                    ])
                                ];
                            case 5:
                                approval = _state.sent();
                                if (!approval) {
                                    throw new NotFoundError('Approval not found');
                                }
                                repayAmount = 0;
                                repaymet = Math.round(loan.disbursalAmount * (approval.roi / 100));
                                repayAmount = loan.disbursalAmount + repaymet * approval.tenure;
                                tenure = approval.tenure;
                                if (!(approval && loan)) return [
                                    3,
                                    7
                                ];
                                return [
                                    4,
                                    this.getTenure(loan.disbursalDate, approval.repayDate)
                                ];
                            case 6:
                                tenure = _state.sent();
                                _state.label = 7;
                            case 7:
                                if (!(lead.productID == 1)) return [
                                    3,
                                    9
                                ];
                                return [
                                    4,
                                    this.creditModel.findOneCredit({
                                        customerID: customerID,
                                        leadID: leadID
                                    }, [
                                        'amountToBeRepayed',
                                        'tenure',
                                        'paidAmount'
                                    ], [
                                        {
                                            column: 'creditID',
                                            order: 'desc'
                                        }
                                    ])
                                ];
                            case 8:
                                credit = _state.sent();
                                tenure = (credit === null || credit === void 0 ? void 0 : credit.tenure) || 1;
                                repayAmount = (Number(credit.amountToBeRepayed) + Number(credit.paidAmount)) / tenure;
                                _state.label = 9;
                            case 9:
                                res = {
                                    customerID: customer.customerID,
                                    leadID: loan.leadID,
                                    productID: lead.productID,
                                    name: customer.name,
                                    email: customer.email,
                                    loanNo: loan.loanNo,
                                    disbursalAmount: loan.disbursalAmount,
                                    roi: "".concat(approval.roi, " ").concat(lead.productID == 1 ? '% per annum' : '% per day'),
                                    tenure: tenure ? "".concat(tenure, " ").concat(lead.productID == 1 ? 'months' : 'days') : '-',
                                    repayAmount: Math.floor(repayAmount),
                                    currentDate: moment().format('Do MMM, YYYY')
                                };
                                return [
                                    2,
                                    this.serviceResponse(200, res, 'Disbursal letter Data retreived successfully.')
                                ];
                        }
                    });
                }).call(this);
            }
        },
        {
            key: "disbursalPdf",
            value: function disbursalPdf(payload) {
                return _async_to_generator(function() {
                    var _this;
                    return _ts_generator(this, function(_state) {
                        _this = this;
                        return [
                            2,
                            new Promise(function(resolve, reject) {
                                return _async_to_generator(function() {
                                    var disbursalData, templatePath, htmlContent, headerUrl, footerUrl, headerImage, footerImage, browser, page, pdfBuffer, s3FolderName, imageName, res, pdfStream, err;
                                    return _ts_generator(this, function(_state) {
                                        switch(_state.label){
                                            case 0:
                                                _state.trys.push([
                                                    0,
                                                    13,
                                                    ,
                                                    14
                                                ]);
                                                return [
                                                    4,
                                                    this.disbursalByLead(payload)
                                                ];
                                            case 1:
                                                disbursalData = _state.sent();
                                                templatePath = path.resolve(__dirname, '../views/loansDocs/disbursal.ejs');
                                                return [
                                                    4,
                                                    ejs.renderFile(templatePath, {
                                                        data: disbursalData.data
                                                    })
                                                ];
                                            case 2:
                                                htmlContent = _state.sent();
                                                // Convert the S3 image URLs to base64
                                                headerUrl = 'https://bank-logo-ramfin.s3.ap-south-1.amazonaws.com/Sanction-Letter-Header.jpg';
                                                footerUrl = 'https://bank-logo-ramfin.s3.ap-south-1.amazonaws.com/Sanction-Letter-Footer.jpg';
                                                return [
                                                    4,
                                                    this.convertImageUrlToBase64(headerUrl)
                                                ];
                                            case 3:
                                                headerImage = _state.sent();
                                                return [
                                                    4,
                                                    this.convertImageUrlToBase64(footerUrl)
                                                ];
                                            case 4:
                                                footerImage = _state.sent();
                                                return [
                                                    4,
                                                    puppeteer.launch({
                                                        executablePath: '/usr/bin/chromium-browser'
                                                    })
                                                ];
                                            case 5:
                                                browser = _state.sent();
                                                return [
                                                    4,
                                                    browser.newPage()
                                                ];
                                            case 6:
                                                page = _state.sent();
                                                return [
                                                    4,
                                                    page.setContent(htmlContent, {
                                                        waitUntil: 'networkidle0'
                                                    })
                                                ];
                                            case 7:
                                                _state.sent();
                                                return [
                                                    4,
                                                    page.pdf({
                                                        format: 'A4',
                                                        displayHeaderFooter: true,
                                                        headerTemplate: '<div class="header" style="width: 100%; text-align: center;">\n            <img src="'.concat(headerImage, '" style="width:100%; max-height:150px; margin-top: -20px">\n          </div>'),
                                                        footerTemplate: '<div class="footer" style="width: 100%; text-align: center;">\n            <img src="'.concat(footerImage, '" style="width:100%; max-height:150px; margin-bottom: -18px">\n          </div>'),
                                                        margin: {
                                                            top: '150px',
                                                            bottom: '100px'
                                                        }
                                                    })
                                                ];
                                            case 8:
                                                pdfBuffer = _state.sent();
                                                return [
                                                    4,
                                                    browser.close()
                                                ];
                                            case 9:
                                                _state.sent();
                                                if (!pdfBuffer) return [
                                                    3,
                                                    12
                                                ];
                                                s3FolderName = 'documents/disbursalLetter/' + payload.customerID;
                                                imageName = 'disbursalLetter_' + Math.floor(Date.now() / 1000) + '.pdf';
                                                return [
                                                    4,
                                                    this.s3Service.uploadDocument(Buffer.from(pdfBuffer), s3FolderName, imageName)
                                                ];
                                            case 10:
                                                res = _state.sent();
                                                if (!(res && (res === null || res === void 0 ? void 0 : res.Key) !== null && res.Key !== '')) return [
                                                    3,
                                                    12
                                                ];
                                                return [
                                                    4,
                                                    this.documentModel.insert({
                                                        customerID: payload.customerID,
                                                        type: 'Disbursal Letter',
                                                        documentType: 'Disbursal Letter',
                                                        documentFile: res.Key,
                                                        status: 'Verified',
                                                        uploadBy: payload.customerID,
                                                        uploadedDate: moment().format('YYYY-MM-DD HH:mm:ss'),
                                                        verifiedBy: payload.customerID,
                                                        verifiedDate: moment().format('YYYY-MM-DD HH:mm:ss'),
                                                        upload_platform: 'S3'
                                                    })
                                                ];
                                            case 11:
                                                _state.sent();
                                                _state.label = 12;
                                            case 12:
                                                // Convert the buffer to a readable stream
                                                pdfStream = new Readable();
                                                pdfStream.push(pdfBuffer);
                                                pdfStream.push(null);
                                                resolve(pdfStream);
                                                return [
                                                    3,
                                                    14
                                                ];
                                            case 13:
                                                err = _state.sent();
                                                reject(err);
                                                return [
                                                    3,
                                                    14
                                                ];
                                            case 14:
                                                return [
                                                    2
                                                ];
                                        }
                                    });
                                }).call(_this);
                            })
                        ];
                    });
                }).call(this);
            }
        },
        {
            key: "crmTimeline",
            value: function crmTimeline(leadID) {
                return _async_to_generator(function() {
                    var db, callHistoryLogs, leadDetails, timelineData;
                    return _ts_generator(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                db = getKnexInstance();
                                return [
                                    4,
                                    db('callhistoryLogs as ch').leftJoin('users as u', 'ch.calledBy', 'u.userID').where('ch.leadID', leadID).orderBy('ch.callHistoryID', 'desc').select('ch.callHistoryID', 'ch.status', 'ch.remark', 'ch.calledBy', 'ch.appAmount', 'ch.createdDate', 'u.name as userName', 'u.role as userRole')
                                ];
                            case 1:
                                callHistoryLogs = _state.sent();
                                return [
                                    4,
                                    db('leads as l').leftJoin('users as u', 'l.callAssign', 'u.userID').where('l.leadID', leadID).select('l.leadID', 'l.utmSource', 'l.createdDate', 'l.callAssign', 'u.name as assignedUserName').first()
                                ];
                            case 2:
                                leadDetails = _state.sent();
                                timelineData = callHistoryLogs.map(function(log) {
                                    return {
                                        status: log.status,
                                        remarks: log.remark,
                                        role: log.calledBy === 221 ? log.userName : log.userRole || '',
                                        amount: log.appAmount,
                                        updatedBy: log.userName || '',
                                        updatedDateIST: log.createdDate
                                    };
                                });
                                if (leadDetails === null || leadDetails === void 0 ? void 0 : leadDetails.assignedUserName) {
                                    timelineData.push({
                                        status: 'Assign',
                                        amount: '',
                                        remarks: 'Automatic System',
                                        updatedDateIST: formatToIST(leadDetails.createdDate),
                                        role: leadDetails.utmSource || 'N/A',
                                        updatedBy: "Lead Generated by ".concat(leadDetails.utmSource || 'N/A')
                                    });
                                }
                                return [
                                    2,
                                    this.serviceResponse(HttpStatusCode.Ok, {
                                        collection: timelineData
                                    }, 'Success')
                                ];
                        }
                    });
                }).call(this);
            }
        },
        {
            key: "generateTransactionDetails",
            value: function generateTransactionDetails(leadID, collectionDetails, approval, dpdPenalty, dpdPenaltyGSTPercentage) {
                return _async_to_generator(function() {
                    var transactionDetails, totalDebit, totalCredit, repayDate, today, db, loan, disbursalDate, loanDisbursalAmount, bounceDate, bounceCharges, gstCharged, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, cde, collectionDate, totalSummary;
                    return _ts_generator(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                transactionDetails = [];
                                totalDebit = 0;
                                totalCredit = 0;
                                repayDate = new Date(approval.repayDate);
                                //const leadID = approval.leadID
                                today = new Date();
                                db = getKnexInstance();
                                return [
                                    4,
                                    db('loan').where('leadID', leadID).select('loanNo', 'disbursalAmount', 'leadId', 'disbursalDate', 'deduction').first()
                                ];
                            case 1:
                                loan = _state.sent();
                                // Add Loan Disbursal Details
                                disbursalDate = new Date(loan.disbursalDate).toISOString().split('T')[0];
                                loanDisbursalAmount = loan.disbursalAmount - loan.deduction;
                                transactionDetails.push({
                                    date: disbursalDate,
                                    particular: 'Loan Disbursal',
                                    debit: '',
                                    credit: loanDisbursalAmount
                                }, {
                                    date: disbursalDate,
                                    particular: 'Processing fee charged',
                                    debit: approval.adminFee,
                                    credit: ''
                                }, {
                                    date: disbursalDate,
                                    particular: 'GST charged',
                                    debit: approval.GstOfAdminFee,
                                    credit: ''
                                });
                                totalCredit += loanDisbursalAmount;
                                totalDebit += approval.adminFee + approval.GstOfAdminFee;
                                // Add Bounce Charges and GST if conditions are met
                                if (collectionDetails.length > 0 && collectionDetails[0].collectedDate > approval.repayDate) {
                                    bounceDate = new Date(approval.repayDate);
                                    bounceDate.setDate(bounceDate.getDate() + 1);
                                    bounceCharges = dpdPenalty;
                                    gstCharged = dpdPenalty * dpdPenaltyGSTPercentage / 100;
                                    transactionDetails.push({
                                        date: bounceDate.toISOString().split('T')[0],
                                        particular: 'Bounce Charges',
                                        debit: bounceCharges,
                                        credit: ''
                                    }, {
                                        date: bounceDate.toISOString().split('T')[0],
                                        particular: 'GST Charged',
                                        debit: gstCharged,
                                        credit: ''
                                    });
                                    totalDebit += bounceCharges + gstCharged;
                                }
                                _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
                                try {
                                    // Process collection details
                                    for(_iterator = collectionDetails[Symbol.iterator](); !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true){
                                        cde = _step.value;
                                        collectionDate = new Date(cde.collectedDate).toISOString().split('T')[0];
                                        if (cde.collectedMode === 'Waive Off') {
                                            transactionDetails.push({
                                                date: collectionDate,
                                                particular: 'Waive Off Amount',
                                                debit: cde.collectedAmount,
                                                credit: ''
                                            });
                                            totalDebit += cde.collectedAmount;
                                        } else if (cde.status === 'Settlement') {
                                            transactionDetails.push({
                                                date: collectionDate,
                                                particular: 'Settlement Amount',
                                                debit: cde.collectedAmount,
                                                credit: ''
                                            });
                                            totalDebit += cde.collectedAmount;
                                        } else {
                                            transactionDetails.push({
                                                date: collectionDate,
                                                particular: 'Payment Received',
                                                debit: cde.collectedAmount,
                                                credit: ''
                                            });
                                            totalDebit += cde.collectedAmount;
                                            if (cde.collected_interest) {
                                                transactionDetails.push({
                                                    date: collectionDate,
                                                    particular: "Interest Adjusted",
                                                    debit: '',
                                                    credit: ''
                                                });
                                            }
                                            if (cde.collected_principal) {
                                                transactionDetails.push({
                                                    date: collectionDate,
                                                    particular: "Principal Adjusted",
                                                    debit: '',
                                                    credit: ''
                                                });
                                            }
                                            if (cde.collected_penality) {
                                                transactionDetails.push({
                                                    date: collectionDate,
                                                    particular: "Charges Adjusted",
                                                    debit: '',
                                                    credit: ''
                                                });
                                            }
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
                                // Create total summary
                                totalSummary = {
                                    debit: totalDebit,
                                    credit: totalCredit
                                };
                                return [
                                    2,
                                    {
                                        transactionDetails: transactionDetails,
                                        totalSummary: totalSummary
                                    }
                                ];
                        }
                    });
                })();
            }
        },
        {
            key: "addCollectionDetails",
            value: function addCollectionDetails(payload) {
                return _async_to_generator(function() {
                    var leadID, cooling_period, collectedAmount, status, collectedMode, collectedDate, referenceNo, discountAmount, settlemenAmount, remark, discount_waiver, discount_waiver_amount, userID, collectionStatus, db, disba, currentDate, mandate, leadStatusResult, leadDetail, approvalDetail, collectionStatusNew, collectedBy, updateCollectionResult, date, getLoanLeadDetail, repaymentAmount, tenure, findDiff, excessAmount, collectionId, collectionID, transaction_status, data;
                    return _ts_generator(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                leadID = payload.leadID, cooling_period = payload.cooling_period, collectedAmount = payload.collectedAmount, status = payload.status, collectedMode = payload.collectedMode, collectedDate = payload.collectedDate, referenceNo = payload.referenceNo, discountAmount = payload.discountAmount, settlemenAmount = payload.settlemenAmount, remark = payload.remark, discount_waiver = payload.discount_waiver, discount_waiver_amount = payload.discount_waiver_amount, userID = payload.userID, collectionStatus = payload.collectionStatus;
                                db = getKnexInstance();
                                return [
                                    4,
                                    db('loan').where('leadID', leadID).first()
                                ];
                            case 1:
                                disba = _state.sent();
                                currentDate = new Date().toISOString().split('T')[0];
                                return [
                                    4,
                                    db('exsl_mandate').where('leadID', leadID).where('status', 0).whereRaw('DATE(created_at) = ?', [
                                        currentDate
                                    ]).first()
                                ];
                            case 2:
                                mandate = _state.sent();
                                if (mandate) {
                                    throw new BadRequestError('Mandate is in process for this user ,please add collection after some time');
                                }
                                return [
                                    4,
                                    db('leads').join('collection', 'leads.leadID', '=', 'collection.leadID').where('leads.leadID', leadID).whereIn('leads.status', [
                                        'Settlement',
                                        'Closed'
                                    ]).whereIn('collection.status', [
                                        'Settlement',
                                        'Closed'
                                    ]).where('collection.collectionStatus', 'Approved').select('leads.status', 'leads.customerID').distinct().first()
                                ];
                            case 3:
                                leadStatusResult = _state.sent();
                                if (leadStatusResult && leadStatusResult.status !== status) {
                                    throw new BadRequestError('Check if the loan is closed/settlement then only collection with status closed/settlement is acceptable');
                                }
                                return [
                                    4,
                                    db('leads').where('leadID', leadID).first()
                                ];
                            case 4:
                                leadDetail = _state.sent();
                                return [
                                    4,
                                    db('approval').where('leadID', leadID).first()
                                ];
                            case 5:
                                approvalDetail = _state.sent();
                                if (!((leadDetail === null || leadDetail === void 0 ? void 0 : leadDetail.ipc) === 1)) return [
                                    3,
                                    7
                                ];
                                collectionStatusNew = collectionStatus ? collectionStatus : 'Approval Waiting';
                                collectedBy = userID;
                                return [
                                    4,
                                    this.updateCollectedAmount(leadID, leadDetail.customerID, collectedAmount, status, collectedDate, collectedMode, remark, referenceNo, discountAmount, settlemenAmount, collectionStatusNew, collectedBy, discount_waiver, discount_waiver_amount, 1, cooling_period)
                                ];
                            case 6:
                                updateCollectionResult = _state.sent();
                                if (updateCollectionResult === 2) {
                                    throw new BadRequestError("You cannot close because Repayment Amount is more than Collected Amount (Rs. ".concat(collectedAmount, ")"));
                                } else {
                                    return [
                                        2,
                                        this.serviceResponse(HttpStatusCode.Ok, {}, 'Success')
                                    ];
                                }
                                return [
                                    3,
                                    12
                                ];
                            case 7:
                                date = new Date();
                                return [
                                    4,
                                    this.check_repayment_amount(leadID, collectedDate)
                                ];
                            case 8:
                                getLoanLeadDetail = _state.sent();
                                repaymentAmount = getLoanLeadDetail.Remanning_Amount;
                                tenure = Math.round((new Date(approvalDetail.repayDate).getTime() - new Date(disba.disbursalDate).getTime()) / (1000 * 60 * 60 * 24));
                                findDiff = new Date(collectedDate).getTime() - new Date(disba.disbursalDate).getTime();
                                if (tenure < 7 && Math.round(findDiff / (1000 * 60 * 60 * 24)) <= 1 && cooling_period === 'Yes') {
                                    repaymentAmount = disba.disbursalAmount - disba.deduction;
                                } else if (tenure >= 7 && Math.round(findDiff / (1000 * 60 * 60 * 24)) <= 3 && cooling_period === 'Yes') {
                                    repaymentAmount = disba.disbursalAmount - disba.deduction;
                                }
                                excessAmount = 0;
                                if (status === CollectionStatus.CLOSED) {
                                    if (repaymentAmount > collectedAmount) {
                                        throw new BadRequestError("You cannot close because Repayment Amount (Rs. ".concat(repaymentAmount, ") is more than Collected Amount (Rs. ").concat(collectedAmount, ")"));
                                    } else if (repaymentAmount < collectedAmount) {
                                        excessAmount = collectedAmount - repaymentAmount;
                                    }
                                } else if (status === CollectionStatus.PART_PAYMENT) {
                                    if (repaymentAmount === collectedAmount) {
                                        status = CollectionStatus.CLOSED;
                                    } else if (repaymentAmount < collectedAmount) {
                                        excessAmount = collectedAmount - repaymentAmount;
                                        status = CollectionStatus.PART_PAYMENT;
                                    }
                                } else if (status === CollectionStatus.SETTLEMENT) {
                                    discount_waiver = discount_waiver;
                                    discount_waiver_amount = discount_waiver_amount;
                                }
                                return [
                                    4,
                                    db('collection').insert({
                                        customerID: leadDetail.customerID,
                                        leadID: leadID,
                                        loanNo: disba.loanNo,
                                        collectedAmount: collectedAmount,
                                        collectedMode: collectedMode,
                                        collectedDate: collectedDate,
                                        referenceNo: referenceNo,
                                        discountAmount: 0,
                                        settlemenAmount: 0,
                                        remark: '',
                                        status: status,
                                        collectedBy: userID,
                                        createdDate: date,
                                        collectionStatus: 'Approval Waiting',
                                        collectionStatusby: 'no',
                                        excess_amount: excessAmount,
                                        discount_waiver: discount_waiver,
                                        discount_waiver_amount: discount_waiver_amount
                                    })
                                ];
                            case 9:
                                collectionId = _state.sent();
                                collectionID = collectionId[0];
                                transaction_status = 1;
                                if (!collectionID) return [
                                    3,
                                    11
                                ];
                                return [
                                    4,
                                    this.manageTransaction(leadID, leadDetail.customerID, 'Collection', collectionID, 'Manual', null, collectedDate, null, collectedMode, referenceNo, referenceNo, userID, collectedAmount, transaction_status)
                                ];
                            case 10:
                                _state.sent();
                                _state.label = 11;
                            case 11:
                                data = {
                                    collectionID: collectionID
                                };
                                return [
                                    2,
                                    this.serviceResponse(HttpStatusCode.Ok, data, 'Payday collection added successfully')
                                ];
                            case 12:
                                return [
                                    2
                                ];
                        }
                    });
                }).call(this);
            }
        },
        {
            key: "generateFailedFile",
            value: function generateFailedFile(fileId) {
                return _async_to_generator(function() {
                    var data, templatePath, htmlContent, browser, page, pdfBuffer, pdfStream, err;
                    return _ts_generator(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                _state.trys.push([
                                    0,
                                    10,
                                    ,
                                    11
                                ]);
                                return [
                                    4,
                                    this.getfailedDetails(fileId)
                                ];
                            case 1:
                                data = _state.sent();
                                templatePath = path.resolve(__dirname, '../views/loansDocs/not_required_failed_leads.ejs');
                                return [
                                    4,
                                    ejs.renderFile(templatePath, {
                                        data: data
                                    })
                                ];
                            case 2:
                                htmlContent = _state.sent();
                                return [
                                    4,
                                    puppeteer.launch({
                                        executablePath: '/usr/bin/chromium-browser'
                                    })
                                ];
                            case 3:
                                browser = _state.sent();
                                return [
                                    4,
                                    browser.newPage()
                                ];
                            case 4:
                                page = _state.sent();
                                return [
                                    4,
                                    page.setContent(htmlContent, {
                                        waitUntil: 'domcontentloaded',
                                        timeout: 60000
                                    })
                                ];
                            case 5:
                                _state.sent();
                                return [
                                    4,
                                    page.waitForSelector('body', {
                                        timeout: 5000
                                    })
                                ];
                            case 6:
                                _state.sent();
                                return [
                                    4,
                                    page.waitForSelector('h1')
                                ];
                            case 7:
                                _state.sent();
                                return [
                                    4,
                                    page.pdf({
                                        format: 'A4',
                                        margin: {
                                            top: '8mm',
                                            bottom: '8mm',
                                            left: '15mm',
                                            right: '15mm'
                                        },
                                        scale: 0.7
                                    })
                                ];
                            case 8:
                                pdfBuffer = _state.sent();
                                return [
                                    4,
                                    browser.close()
                                ];
                            case 9:
                                _state.sent();
                                pdfStream = new Readable();
                                pdfStream.push(pdfBuffer);
                                pdfStream.push(null);
                                return [
                                    2,
                                    pdfStream
                                ];
                            case 10:
                                err = _state.sent();
                                throw err;
                            case 11:
                                return [
                                    2
                                ];
                        }
                    });
                }).call(this);
            }
        },
        {
            key: "notRequiredLeads",
            value: function notRequiredLeads(page, perPage) {
                return _async_to_generator(function() {
                    var db, offset, data, countResult, totalCount, fileData;
                    return _ts_generator(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                db = getKnexInstance();
                                offset = (page - 1) * perPage;
                                return [
                                    4,
                                    db('not_required_leads_filelog').orderBy('Id', 'desc').limit(perPage).offset(offset)
                                ];
                            case 1:
                                data = _state.sent();
                                return [
                                    4,
                                    db('not_required_leads_filelog').count('* as total')
                                ];
                            case 2:
                                countResult = _state.sent();
                                totalCount = countResult[0].total;
                                fileData = {
                                    data: data,
                                    totalCount: totalCount,
                                    totalPages: Math.ceil(+totalCount / perPage)
                                };
                                return [
                                    2,
                                    this.serviceResponse(HttpStatusCode.Ok, fileData, 'Success')
                                ];
                        }
                    });
                }).call(this);
            }
        },
        {
            key: "updateCollectedAmount",
            value: function updateCollectedAmount(_0, _1, _2, _3, _4, _5, _6, _7, _8, _9, _10, _11, _12, _13, _14) {
                return _async_to_generator(function(leadID, customerID, collectedAmount, status) {
                    var collectedDate, collectedMode, remarks, referenceNo, discountAmount, settlemenAmount, collectionStatus, userID, discount_waiver, discount_waiver_amount, bycrm, cooling_period, excess_amount, penality_charge, total_interest, returnCode, opening_bal, closing_bal, collected_interest, collected_principal, collected_penality, principal_amount, transaction_status, check_principal, principal_amount_over, total_interest_actual, penality_charge_actual, db, loan, approval_detail, repayment_data, repayment_amount, check_cooling_period, leadStatusResult, collectionId, collection_id;
                    var _arguments = arguments;
                    return _ts_generator(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                collectedDate = _arguments.length > 4 && _arguments[4] !== void 0 ? _arguments[4] : moment().format('YYYY-MM-DD'), collectedMode = _arguments.length > 5 ? _arguments[5] : void 0, remarks = _arguments.length > 6 ? _arguments[6] : void 0, referenceNo = _arguments.length > 7 ? _arguments[7] : void 0, discountAmount = _arguments.length > 8 ? _arguments[8] : void 0, settlemenAmount = _arguments.length > 9 ? _arguments[9] : void 0, collectionStatus = _arguments.length > 10 ? _arguments[10] : void 0, userID = _arguments.length > 11 ? _arguments[11] : void 0, discount_waiver = _arguments.length > 12 ? _arguments[12] : void 0, discount_waiver_amount = _arguments.length > 13 ? _arguments[13] : void 0, bycrm = _arguments.length > 14 ? _arguments[14] : void 0, cooling_period = _arguments.length > 15 ? _arguments[15] : void 0;
                                excess_amount = 0;
                                penality_charge = 0;
                                total_interest = 0;
                                returnCode = 0;
                                opening_bal = 0;
                                closing_bal = 0;
                                collected_interest = 0;
                                collected_principal = 0;
                                collected_penality = 0;
                                principal_amount = 0;
                                transaction_status = 1;
                                check_principal = 0;
                                principal_amount_over = 0;
                                total_interest_actual = 0;
                                penality_charge_actual = 0;
                                remarks = '';
                                db = getKnexInstance();
                                return [
                                    4,
                                    db('loan').select('disbursalAmount', 'loanNo', 'disbursalDate', 'deduction').where({
                                        leadID: leadID,
                                        customerID: customerID
                                    }).first()
                                ];
                            case 1:
                                loan = _state.sent();
                                return [
                                    4,
                                    db('approval').where('leadID', leadID).first()
                                ];
                            case 2:
                                approval_detail = _state.sent();
                                return [
                                    4,
                                    calculatePaydayAmountIPC(leadID, status)
                                ];
                            case 3:
                                repayment_data = _state.sent();
                                repayment_amount = repayment_data.totalRepayAmount;
                                penality_charge = repayment_data.charges;
                                total_interest = repayment_data.totalInterest;
                                principal_amount = repayment_data.principalAmount;
                                total_interest_actual = total_interest;
                                penality_charge_actual = penality_charge;
                                if (repayment_amount > collectedAmount && status === CollectionStatus.CLOSED) {
                                    status = CollectionStatus.PART_PAYMENT;
                                }
                                if (!(cooling_period === 'Yes' && bycrm === 1)) return [
                                    3,
                                    5
                                ];
                                return [
                                    4,
                                    this.checkCoolingPeriod(loan, approval_detail, bycrm, cooling_period, collectedAmount, repayment_data, collectedDate)
                                ];
                            case 4:
                                check_cooling_period = _state.sent();
                                if (check_cooling_period.is_cooling_period) {
                                    repayment_amount = check_cooling_period.repayment_amount;
                                    principal_amount = check_cooling_period.principal_amount;
                                    if (repayment_amount === principal_amount) {
                                        total_interest = 0;
                                        penality_charge = 0;
                                    }
                                }
                                _state.label = 5;
                            case 5:
                                if (status === 'Closed') {
                                    if (repayment_amount > collectedAmount) {
                                        return [
                                            2,
                                            2
                                        ];
                                    } else if (repayment_amount < collectedAmount) {
                                        excess_amount = collectedAmount - repayment_amount;
                                    }
                                    opening_bal = repayment_amount;
                                    collected_interest = total_interest;
                                    collected_principal = principal_amount;
                                    collected_penality = penality_charge;
                                    closing_bal = 0;
                                    principal_amount = 0;
                                    if (collectedAmount - repayment_amount >= 0) {
                                        penality_charge = 0;
                                        total_interest = 0;
                                    }
                                } else if (status === 'Part Payment') {
                                    opening_bal = repayment_amount;
                                    closing_bal = 0;
                                    if (repayment_amount == collectedAmount) {
                                        status = CollectionStatus.CLOSED;
                                        collected_interest = total_interest;
                                        collected_principal = principal_amount;
                                        collected_penality = penality_charge;
                                        principal_amount = 0;
                                        total_interest = 0;
                                        penality_charge = 0;
                                    } else if (repayment_amount < collectedAmount) {
                                        excess_amount = collectedAmount - repayment_amount > 0 ? collectedAmount - repayment_amount : 0;
                                        status = CollectionStatus.CLOSED;
                                        collected_interest = total_interest;
                                        collected_principal = principal_amount;
                                        collected_penality = penality_charge;
                                        principal_amount = 0;
                                        total_interest = 0;
                                        penality_charge = 0;
                                    } else {
                                        closing_bal = repayment_amount - collectedAmount;
                                        if (collectedAmount > total_interest) {
                                            if (total_interest == 0 && collectedAmount >= principal_amount) {
                                                collected_principal = principal_amount;
                                            } else if (total_interest == 0 && collectedAmount < principal_amount) {
                                                collected_principal = collectedAmount;
                                            } else {
                                                collected_principal = collectedAmount - total_interest;
                                                if (collectedAmount > principal_amount + total_interest) {
                                                    check_principal = 1;
                                                    principal_amount_over = principal_amount;
                                                }
                                            }
                                            total_interest = 0;
                                            principal_amount -= collected_principal;
                                            collected_interest = total_interest_actual - total_interest;
                                            if (principal_amount < 0) {
                                                penality_charge += principal_amount;
                                                principal_amount = 0;
                                                if (penality_charge < 0) {
                                                    penality_charge = 0;
                                                }
                                            } else {
                                                penality_charge = penality_charge_actual - (collectedAmount - collected_principal - collected_interest) > 0 ? penality_charge_actual - (collectedAmount - collected_principal - collected_interest) : 0.0;
                                            }
                                            if (check_principal == 1) {
                                                collected_principal = principal_amount_over;
                                                principal_amount = 0;
                                            }
                                            collected_interest = total_interest_actual - total_interest;
                                            collected_penality = penality_charge_actual - penality_charge > 0 ? penality_charge_actual - penality_charge : 0.0;
                                            if (collected_interest == 0 && collected_principal == 0) {
                                                collected_penality = collectedAmount;
                                                penality_charge = penality_charge_actual - collected_penality;
                                            }
                                        } else {
                                            total_interest -= collectedAmount;
                                            collected_interest = total_interest_actual - total_interest;
                                        }
                                    }
                                } else if (status === 'Settlement') {
                                    closing_bal = repayment_amount - collectedAmount;
                                    if (collectedAmount > total_interest) {
                                        if (total_interest == 0 && collectedAmount >= principal_amount) {
                                            collected_principal = principal_amount;
                                        } else if (total_interest == 0 && collectedAmount < principal_amount) {
                                            collected_principal = collectedAmount;
                                        } else {
                                            collected_principal = collectedAmount - total_interest;
                                            if (collectedAmount > principal_amount + total_interest) {
                                                check_principal = 1;
                                                principal_amount_over = principal_amount;
                                            }
                                        }
                                        total_interest = 0;
                                        principal_amount -= collected_principal;
                                        if (principal_amount < 0) {
                                            penality_charge += principal_amount;
                                            principal_amount = 0;
                                            if (penality_charge < 0) {
                                                penality_charge = 0;
                                            }
                                        } else {
                                            penality_charge = penality_charge_actual - (collectedAmount - collected_principal - collected_interest) > 0 ? penality_charge_actual - (collectedAmount - collected_principal - collected_interest) : 0.0;
                                        }
                                        if (check_principal == 1) {
                                            collected_principal = principal_amount_over;
                                            principal_amount = 0;
                                        }
                                        collected_interest = total_interest_actual - total_interest;
                                        collected_penality = penality_charge_actual - penality_charge > 0 ? penality_charge_actual - penality_charge : 0.0;
                                        if (collected_interest == 0 && collected_principal == 0) {
                                            collected_penality = collectedAmount;
                                            penality_charge = penality_charge_actual - collected_penality;
                                        }
                                    } else {
                                        total_interest -= collectedAmount;
                                        collected_interest = total_interest_actual - total_interest;
                                    }
                                }
                                return [
                                    4,
                                    db('leads').join('collection', 'leads.leadID', 'collection.leadID').where('leads.leadID', leadID).whereIn('leads.status', [
                                        'Settlement',
                                        'Closed'
                                    ]).whereIn('collection.status', [
                                        'Settlement',
                                        'Closed'
                                    ]).where('collection.collectionStatus', 'Approved').select('leads.status').distinct().first()
                                ];
                            case 6:
                                leadStatusResult = _state.sent();
                                if (leadStatusResult && leadStatusResult.status !== status) {
                                    return [
                                        2,
                                        2
                                    ];
                                }
                                return [
                                    4,
                                    db('collection').insert({
                                        customerID: customerID,
                                        leadID: leadID,
                                        loanNo: loan.loanNo,
                                        collectedAmount: collectedAmount,
                                        collectedMode: collectedMode,
                                        collectedDate: collectedDate,
                                        referenceNo: referenceNo,
                                        orderID: referenceNo,
                                        discountAmount: discountAmount,
                                        settlemenAmount: settlemenAmount,
                                        remark: remarks,
                                        status: status,
                                        collectedBy: userID,
                                        createdDate: new Date().toISOString().replace('T', ' ').replace('Z', '').split('.')[0],
                                        collectionStatus: collectionStatus,
                                        collectionStatusby: 'no',
                                        excess_amount: Math.round(excess_amount),
                                        discount_waiver: discount_waiver,
                                        discount_waiver_amount: discount_waiver_amount,
                                        opening_balance: opening_bal,
                                        closing_balance: closing_bal,
                                        total_interest: total_interest,
                                        principal_amount: principal_amount,
                                        penality_charge: penality_charge,
                                        collected_interest: collected_interest,
                                        collected_principal: collected_principal,
                                        collected_penality: collected_penality
                                    })
                                ];
                            case 7:
                                collectionId = _state.sent();
                                collection_id = collectionId[0];
                                if (!collection_id) return [
                                    3,
                                    9
                                ];
                                return [
                                    4,
                                    this.manageTransaction(leadID, customerID, 'Collection', collection_id, 'Manual', null, collectedDate, null, collectedMode, referenceNo, referenceNo, userID, collectedAmount, transaction_status)
                                ];
                            case 8:
                                _state.sent();
                                _state.label = 9;
                            case 9:
                                return [
                                    2,
                                    returnCode
                                ];
                        }
                    });
                }).apply(this, arguments);
            }
        },
        {
            key: "manageTransaction",
            value: function manageTransaction(leadID, customerID) {
                var type = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : null, collectionID = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : null, gateway = arguments.length > 4 && arguments[4] !== void 0 ? arguments[4] : null, emiID = arguments.length > 5 && arguments[5] !== void 0 ? arguments[5] : null, transactionDate = arguments.length > 6 && arguments[6] !== void 0 ? arguments[6] : null, remarks = arguments.length > 7 && arguments[7] !== void 0 ? arguments[7] : null, mode = arguments.length > 8 && arguments[8] !== void 0 ? arguments[8] : null, referenceNo = arguments.length > 9 && arguments[9] !== void 0 ? arguments[9] : null, orderID = arguments.length > 10 && arguments[10] !== void 0 ? arguments[10] : null, createdBy = arguments.length > 11 && arguments[11] !== void 0 ? arguments[11] : null, amount = arguments.length > 12 && arguments[12] !== void 0 ? arguments[12] : null, status = arguments.length > 13 && arguments[13] !== void 0 ? arguments[13] : null;
                return _async_to_generator(function() {
                    var db, loan, approval_detail, commonData, disbursal_transaction_id, pf_transaction_id, gst_transaction_id, transaction_id, error;
                    return _ts_generator(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                _state.trys.push([
                                    0,
                                    8,
                                    ,
                                    9
                                ]);
                                if (!leadID || !customerID) {
                                    return [
                                        2,
                                        0
                                    ];
                                }
                                db = getKnexInstance();
                                transactionDate = transactionDate || new Date().toISOString();
                                return [
                                    4,
                                    db('loan').where({
                                        leadID: leadID,
                                        customerID: customerID
                                    }).first()
                                ];
                            case 1:
                                loan = _state.sent();
                                return [
                                    4,
                                    db('approval').where({
                                        leadID: leadID,
                                        customerID: customerID
                                    }).first()
                                ];
                            case 2:
                                approval_detail = _state.sent();
                                if (!loan && !approval_detail) {
                                    return [
                                        2,
                                        0
                                    ];
                                }
                                if (!(type === 'disbursal')) return [
                                    3,
                                    6
                                ];
                                commonData = {
                                    customerID: customerID,
                                    leadID: leadID,
                                    loanNo: loan.loanNo,
                                    status: gateway === 'Manual' ? 2 : 1,
                                    mode: 'Payout',
                                    referenceNo: loan.disbursalRefrenceNo || '',
                                    orderId: loan.disbursalRefrenceNo || '',
                                    deleted: 0,
                                    gateway: gateway,
                                    createdBy: loan.disbursedBy,
                                    updatedBy: loan.disbursedBy,
                                    collectionID: collectionID,
                                    emiID: emiID,
                                    transactionDate: transactionDate,
                                    remarks: remarks
                                };
                                return [
                                    4,
                                    db('transactions').insert(_object_spread_props(_object_spread({}, commonData), {
                                        type: 'disbursal',
                                        amount: loan.disbursalAmount - loan.deduction
                                    }))
                                ];
                            case 3:
                                disbursal_transaction_id = _state.sent();
                                return [
                                    4,
                                    db('transactions').insert(_object_spread_props(_object_spread({}, commonData), {
                                        type: 'pf',
                                        amount: approval_detail.adminFee
                                    }))
                                ];
                            case 4:
                                pf_transaction_id = _state.sent();
                                return [
                                    4,
                                    db('transactions').insert(_object_spread_props(_object_spread({}, commonData), {
                                        type: 'gst',
                                        amount: approval_detail.GstOfAdminFee
                                    }))
                                ];
                            case 5:
                                gst_transaction_id = _state.sent();
                                return [
                                    2,
                                    {
                                        disbursal_transaction_id: disbursal_transaction_id,
                                        pf_transaction_id: pf_transaction_id,
                                        gst_transaction_id: gst_transaction_id
                                    }
                                ];
                            case 6:
                                gateway = mode == 'PayU' ? 'Payu' : gateway;
                                return [
                                    4,
                                    db('transactions').insert({
                                        customerID: customerID,
                                        leadID: leadID,
                                        loanNo: loan.loanNo,
                                        status: status,
                                        type: type,
                                        mode: mode,
                                        referenceNo: referenceNo,
                                        orderId: orderID,
                                        deleted: 0,
                                        gateway: gateway,
                                        createdBy: createdBy,
                                        updatedBy: createdBy,
                                        amount: amount,
                                        collectionID: collectionID,
                                        emiID: emiID,
                                        transactionDate: transactionDate,
                                        remarks: remarks
                                    })
                                ];
                            case 7:
                                transaction_id = _state.sent();
                                return [
                                    2,
                                    transaction_id
                                ];
                            case 8:
                                error = _state.sent();
                                console.error('Transaction Error:', error.message);
                                return [
                                    2,
                                    null
                                ];
                            case 9:
                                return [
                                    2
                                ];
                        }
                    });
                })();
            }
        },
        {
            key: "checkCoolingPeriod",
            value: function checkCoolingPeriod(loan, approvalDetail, bycrm, coolingPeriod, collectedAmount, repaymentData, collectedDate) {
                return _async_to_generator(function() {
                    var repaymentAmount, principalAmount, isCoolingPeriod, tenure, findDiff;
                    return _ts_generator(this, function(_state) {
                        repaymentAmount = 0;
                        principalAmount = 0;
                        isCoolingPeriod = false;
                        try {
                            tenure = Math.round((new Date(approvalDetail.repayDate).getTime() - new Date(loan.disbursalDate).getTime()) / (1000 * 60 * 60 * 24));
                            findDiff = new Date(collectedDate).getTime() - new Date(loan.disbursalDate).getTime();
                            if (tenure < 7 && Math.round(findDiff / (1000 * 60 * 60 * 24)) <= 1 && coolingPeriod === 'Yes' && bycrm === 1 || tenure >= 7 && Math.round(findDiff / (1000 * 60 * 60 * 24)) <= 3 && coolingPeriod === 'Yes' && bycrm === 1) {
                                repaymentAmount = loan.disbursalAmount - loan.deduction;
                                isCoolingPeriod = true;
                                if (repaymentAmount === collectedAmount) {
                                    principalAmount = repaymentAmount;
                                }
                                if (repaymentAmount < collectedAmount) {
                                    repaymentAmount = repaymentData.totalRepayAmount;
                                }
                            }
                        } catch (error) {
                            return [
                                2,
                                {
                                    repayment_amount: 0,
                                    principal_amount: 0,
                                    is_cooling_period: false
                                }
                            ];
                        }
                        return [
                            2,
                            {
                                repayment_amount: repaymentAmount,
                                principal_amount: principalAmount,
                                is_cooling_period: isCoolingPeriod
                            }
                        ];
                    });
                })();
            }
        },
        {
            key: "getLoanLeadDetail",
            value: function getLoanLeadDetail(leadId) {
                return _async_to_generator(function() {
                    var repaymentAmount, loanDisbursed, roi, nod, rd, penDay, toi, penAmount, coAmount, gstAmount, adminFee, repayAmount, approvalAmount, loanTenure, disba, creda, db, leadDetail, sta, cur, mi1, mi, totPay, adgst, svs, dbu, pa_a, tda, error;
                    return _ts_generator(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                repaymentAmount = 0;
                                loanDisbursed = 0;
                                roi = 0;
                                nod = 0;
                                rd = 0;
                                penDay = 0;
                                toi = 0;
                                penAmount = 0;
                                coAmount = 0;
                                gstAmount = 0;
                                adminFee = 0;
                                repayAmount = 0;
                                approvalAmount = 0;
                                loanTenure = 0;
                                disba = {};
                                creda = '';
                                _state.label = 1;
                            case 1:
                                _state.trys.push([
                                    1,
                                    7,
                                    ,
                                    8
                                ]);
                                db = getKnexInstance();
                                return [
                                    4,
                                    db('leads').where('leadID', leadId).first()
                                ];
                            case 2:
                                leadDetail = _state.sent();
                                if (!leadDetail) return [
                                    3,
                                    6
                                ];
                                return [
                                    4,
                                    db('loan').where('customerID', leadDetail.customerID).where('leadID', leadDetail.leadID).first()
                                ];
                            case 3:
                                disba = _state.sent();
                                loanDisbursed = (disba === null || disba === void 0 ? void 0 : disba.disbursalAmount) || 0;
                                if (!(disba === null || disba === void 0 ? void 0 : disba.disbursalRefrenceNo)) return [
                                    3,
                                    6
                                ];
                                return [
                                    4,
                                    db('approval').where('leadID', leadDetail.leadID).where('customerID', leadDetail.customerID).first()
                                ];
                            case 4:
                                creda = _state.sent();
                                approvalAmount = (creda === null || creda === void 0 ? void 0 : creda.loanAmtApproved) || 0;
                                loanTenure = (creda === null || creda === void 0 ? void 0 : creda.tenure) || 0;
                                roi = (creda === null || creda === void 0 ? void 0 : creda.roi) || 0;
                                sta = new Date(creda === null || creda === void 0 ? void 0 : creda.repayDate).toISOString().split('T')[0];
                                cur = new Date().toISOString().split('T')[0];
                                mi1 = roi / 100;
                                mi = Math.round(((disba === null || disba === void 0 ? void 0 : disba.disbursalAmount) || 0) * mi1);
                                nod = (new Date(creda === null || creda === void 0 ? void 0 : creda.repayDate).getTime() - new Date(disba === null || disba === void 0 ? void 0 : disba.disbursalDate).getTime()) / (1000 * 60 * 60 * 24);
                                rd = new Date(creda === null || creda === void 0 ? void 0 : creda.repayDate).getTime() >= new Date(cur).getTime() ? (new Date(cur).getTime() - new Date(disba === null || disba === void 0 ? void 0 : disba.disbursalDate).getTime()) / (1000 * 60 * 60 * 24) : nod;
                                penDay = cur > sta ? (new Date(cur).getTime() - new Date(sta).getTime()) / (1000 * 60 * 60 * 24) : 0;
                                toi = mi * rd;
                                if (penDay > 0) {
                                    penAmount = Math.round(((disba === null || disba === void 0 ? void 0 : disba.disbursalAmount) || 0) * (1.25 / 100)) * penDay;
                                }
                                totPay = ((disba === null || disba === void 0 ? void 0 : disba.disbursalAmount) || 0) + toi + penAmount;
                                return [
                                    4,
                                    db('collection').where('collectionStatus', 'Approved').where('customerID', leadDetail.customerID).where('leadID', leadDetail.leadID).sum('collectedAmount').first()
                                ];
                            case 5:
                                coAmount = _state.sent();
                                repaymentAmount = totPay - (coAmount['sum(`collectedAmount`)'] || 0);
                                adgst = Math.round(((creda === null || creda === void 0 ? void 0 : creda.adminFee) || 0) * (18 / 100));
                                svs = adgst + ((creda === null || creda === void 0 ? void 0 : creda.adminFee) || 0);
                                dbu = ((disba === null || disba === void 0 ? void 0 : disba.disbursalAmount) || 0) - svs;
                                gstAmount = adgst;
                                adminFee = (creda === null || creda === void 0 ? void 0 : creda.adminFee) || 0;
                                pa_a = Math.round(((disba === null || disba === void 0 ? void 0 : disba.disbursalAmount) || 0) * (roi / 100));
                                tda = pa_a * loanTenure;
                                repayAmount = ((disba === null || disba === void 0 ? void 0 : disba.disbursalAmount) || 0) + tda;
                                _state.label = 6;
                            case 6:
                                return [
                                    3,
                                    8
                                ];
                            case 7:
                                error = _state.sent();
                                console.error('Error in getLoanLeadDetail:', error.message);
                                throw new BadRequestError('Error in adding collection');
                            case 8:
                                return [
                                    2,
                                    {
                                        loan_disbursed: loanDisbursed,
                                        roi: roi,
                                        no_days: nod,
                                        real_days: rd,
                                        penalty_days: penDay,
                                        real_interest: toi,
                                        penalty_interest: penAmount,
                                        paid_amount: coAmount,
                                        repayment_amount: repaymentAmount,
                                        gst_amount: gstAmount,
                                        admin_fee: adminFee,
                                        repay_amount: repayAmount,
                                        approval_amount: approvalAmount,
                                        loan_tenure: loanTenure,
                                        creda: creda,
                                        disba: disba
                                    }
                                ];
                        }
                    });
                })();
            }
        },
        {
            key: "getProfileByLeadId",
            value: function getProfileByLeadId(payload) {
                return _async_to_generator(function() {
                    var leadID, lead, customer, aadharStatus, aadharNo, aadharVerifyLink, whereCondition, leadApiLog, pancardStatus, pancardNo, pancardVerifyLink, pancardWhereCondition, pancardLeadApiLog, digilockerVerifyLink, repay_date, today, weekend, holiday, response;
                    return _ts_generator(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                leadID = payload.leadID;
                                return [
                                    4,
                                    this.leadModel.findOneLead({
                                        leadID: leadID
                                    }, [
                                        'customerID',
                                        'leadID',
                                        'status',
                                        'productID',
                                        'fbLeads'
                                    ])
                                ];
                            case 1:
                                lead = _state.sent();
                                if (!lead) throw new NotFoundError('Lead not found');
                                return [
                                    4,
                                    this.customerModel.findOneCustomer({
                                        customerID: lead.customerID
                                    }, [
                                        '*'
                                    ])
                                ];
                            case 2:
                                customer = _state.sent();
                                if (!customer) throw new NotFoundError('Customer not found');
                                aadharStatus = 'Not verify';
                                aadharNo = '';
                                aadharVerifyLink = '';
                                if (!customer.aadharNo) return [
                                    3,
                                    4
                                ];
                                aadharNo = String(customer.aadharNo);
                                whereCondition = {
                                    api_supplier: 4,
                                    status: 1,
                                    api_type: 'aadhaar-v2-submit-otp',
                                    aadharNo: aadharNo
                                };
                                return [
                                    4,
                                    this.leadApiLogModel.findOneLeadApiLog(whereCondition, [
                                        'api_response',
                                        'aadharNo',
                                        'status',
                                        'created_at'
                                    ])
                                ];
                            case 3:
                                leadApiLog = _state.sent();
                                if (leadApiLog) {
                                    aadharStatus = 'Verify';
                                } else {
                                    aadharVerifyLink = "".concat(this.commonHelper.getBaseUrl(), "/newcrm/thirdparty/surepass/surepass_lead_type?lead_id=").concat(leadID);
                                }
                                return [
                                    3,
                                    5
                                ];
                            case 4:
                                aadharStatus = '';
                                aadharNo = '';
                                _state.label = 5;
                            case 5:
                                pancardStatus = 'Not verify';
                                pancardNo = '';
                                pancardVerifyLink = '';
                                if (!customer.pancard) return [
                                    3,
                                    7
                                ];
                                pancardNo = customer.pancard;
                                pancardWhereCondition = {
                                    api_supplier: 4,
                                    status: 1,
                                    api_type: 'pan-comprehensive',
                                    pancard: pancardNo
                                };
                                return [
                                    4,
                                    this.leadApiLogModel.findOneLeadApiLog(pancardWhereCondition, [
                                        'api_response',
                                        'pancard',
                                        'status',
                                        'created_at'
                                    ])
                                ];
                            case 6:
                                pancardLeadApiLog = _state.sent();
                                if (pancardLeadApiLog) {
                                    pancardStatus = 'Verify';
                                } else {
                                    pancardVerifyLink = "".concat(this.commonHelper.getBaseUrl(), "/newcrm/thirdparty/surepass/surepass_lead_type?lead_id=").concat(leadID);
                                }
                                return [
                                    3,
                                    8
                                ];
                            case 7:
                                pancardStatus = '';
                                pancardNo = '';
                                _state.label = 8;
                            case 8:
                                // Digilocker e sign link
                                digilockerVerifyLink = '';
                                if (customer.mobile) {
                                    digilockerVerifyLink = "".concat(this.commonHelper.getBaseUrl(), "/loanapply/digilocker?mobile_no=").concat(customer.mobile);
                                } else {
                                    digilockerVerifyLink = '';
                                }
                                today = moment(); // Current date
                                if (customer.salary_date) {
                                    // Construct a date for this month's salary date
                                    repay_date = moment().date(+customer.salary_date);
                                    // If salary date is in the past, move it to next month
                                    if (repay_date.isBefore(today, 'day')) {
                                        repay_date.add(1, 'month');
                                    }
                                } else {
                                    // Default to 5 days from today if salary_date is not available
                                    repay_date = moment().add(5, 'days').startOf('day');
                                }
                                _state.label = 9;
                            case 9:
                                weekend = isWeekend(repay_date.toDate());
                                return [
                                    4,
                                    isHoliday(repay_date.toDate())
                                ];
                            case 10:
                                holiday = _state.sent();
                                if (weekend || holiday) {
                                    repay_date.add(1, 'days'); // Move to the next day
                                } else {
                                    return [
                                        3,
                                        12
                                    ]; // If it's not a weekend or holiday, break the loop
                                }
                                _state.label = 11;
                            case 11:
                                if (true) return [
                                    3,
                                    9
                                ];
                                _state.label = 12;
                            case 12:
                                response = {
                                    customerID: customer.customerID,
                                    name: customer.name,
                                    mobile: customer.mobile,
                                    email: customer.email,
                                    dob: customer.dob,
                                    pancard: customer.pancard,
                                    pancard_verify: pancardStatus,
                                    pancard_verify_link: pancardVerifyLink,
                                    aadharNo: aadharNo,
                                    aadhar_verify: aadharStatus,
                                    aadhar_verify_link: aadharVerifyLink,
                                    digilocker_verify_link: digilockerVerifyLink,
                                    status: lead.status,
                                    productID: lead.productID,
                                    leadType: lead.fbLeads,
                                    repay_date: repay_date,
                                    salary_date: customer.salary_date
                                };
                                return [
                                    2,
                                    this.serviceResponse(200, response, 'Lead profile data retreived successfully.')
                                ];
                        }
                    });
                }).call(this);
            }
        },
        {
            key: "addCollectionFollowup",
            value: function addCollectionFollowup(payload, userID) {
                return _async_to_generator(function() {
                    var _ref, lead, loan, data, savedData, error;
                    return _ts_generator(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                _state.trys.push([
                                    0,
                                    3,
                                    ,
                                    4
                                ]);
                                return [
                                    4,
                                    Promise.all([
                                        this.findOne({
                                            leadID: payload.leadID
                                        }, [
                                            'customerID'
                                        ]),
                                        this.loanModel.findOneLoan({
                                            leadID: payload.leadID
                                        }, [
                                            'loanNo'
                                        ])
                                    ])
                                ];
                            case 1:
                                _ref = _sliced_to_array.apply(void 0, [
                                    _state.sent(),
                                    2
                                ]), lead = _ref[0], loan = _ref[1];
                                // Check if the lead or loan was not found
                                if (!lead) throw new NotFoundError('Lead not found');
                                if (!loan) throw new NotFoundError('Loan not found');
                                // Prepare data to be inserted
                                data = {
                                    followType: payload.followType,
                                    StatusType: payload.StatusType,
                                    remark: payload.remark,
                                    leadID: payload.leadID,
                                    customerID: lead.customerID,
                                    loanNo: loan.loanNo,
                                    createdBy: userID,
                                    createdDate: new Date(),
                                    followup_type: payload.followup_type
                                };
                                return [
                                    4,
                                    this.collectionFollowUpModel.insert(data)
                                ];
                            case 2:
                                savedData = _state.sent();
                                // Check if the insert operation failed
                                if (!savedData) throw new NotFoundError('Failed to save collection follow-up');
                                // Return a successful response
                                return [
                                    2,
                                    this.serviceResponse(HttpStatusCode.Ok, savedData, 'Collection follow-up successfully saved')
                                ];
                            case 3:
                                error = _state.sent();
                                throw error;
                            case 4:
                                return [
                                    2
                                ];
                        }
                    });
                }).call(this);
            }
        },
        {
            key: "checkPincode",
            value: function checkPincode(payload) {
                return _async_to_generator(function() {
                    var pincode, db, pinDetails;
                    return _ts_generator(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                pincode = payload.pincode;
                                db = getKnexInstance();
                                return [
                                    4,
                                    db('pincode_city_list as pcl').leftJoin('states as s', 'pcl.state_id', 's.stateID').where('pcl.pincode', pincode).first([
                                        'pcl.city_name',
                                        'pcl.state_id',
                                        'pcl.state_name',
                                        's.stateName'
                                    ])
                                ];
                            case 1:
                                pinDetails = _state.sent();
                                if (pinDetails) {
                                    return [
                                        2,
                                        this.serviceResponse(200, pinDetails, 'Pin details found')
                                    ];
                                } else {
                                    return [
                                        2,
                                        this.serviceResponse(400, {}, 'Pin details not found')
                                    ];
                                }
                                return [
                                    2
                                ];
                        }
                    });
                }).call(this);
            }
        },
        {
            key: "modifyLoan",
            value: function modifyLoan(payload, leadID, userId) {
                return _async_to_generator(function() {
                    var adminFee, loanAmount, repaymentDate, roi, lead, customerID, dayOfWeek, formattedRepayDate, holidayCheck, currentDate, dayDiff, isAmountValid, updatedAdminFee;
                    return _ts_generator(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                adminFee = payload.adminFee, loanAmount = payload.loanAmount, repaymentDate = payload.repaymentDate, roi = payload.roi;
                                return [
                                    4,
                                    this.leadModel.findOneLead({
                                        leadID: leadID
                                    }, [
                                        'customerID',
                                        'status'
                                    ])
                                ];
                            case 1:
                                lead = _state.sent();
                                customerID = lead.customerID;
                                if (!lead) throw new NotFoundError('Lead not found');
                                if (lead.status !== LeadStatus.APPROVED_PROCESS) {
                                    throw new BadRequestError("Lead status must be ".concat(LeadStatus.APPROVED_PROCESS));
                                }
                                dayOfWeek = moment().format('dddd');
                                formattedRepayDate = moment(repaymentDate);
                                return [
                                    4,
                                    this.repayDateHolidaymodel.findOneRepayDateHoliday({
                                        repaydate: formattedRepayDate.startOf('day').format('YYYY-MM-DD')
                                    }, [
                                        'repaydate'
                                    ])
                                ];
                            case 2:
                                holidayCheck = _state.sent();
                                if (dayOfWeek === 'Saturday' || dayOfWeek === 'Sunday' || holidayCheck) {
                                    throw new BadRequestError('Loan repayment cannot lie on a holiday');
                                }
                                // 6 days check
                                currentDate = moment().startOf('day');
                                dayDiff = formattedRepayDate.diff(currentDate, 'days');
                                if (dayDiff < 6) {
                                    throw new BadRequestError('Loan tenure cannot be less than 6 days');
                                }
                                return [
                                    4,
                                    this.loanService.isReloanAmountValid(loanAmount, customerID)
                                ];
                            case 3:
                                isAmountValid = _state.sent();
                                if (!isAmountValid.status) throw new BadRequestError("Approval amount cannot be more than ".concat(isAmountValid.amount));
                                updatedAdminFee = this.loanService.calculateAdminFee(loanAmount, adminFee);
                                return [
                                    4,
                                    Promise.all([
                                        this.approvalModel.findOneAndUpdateApproval({
                                            leadID: leadID
                                        }, {
                                            tenure: dayDiff,
                                            roi: roi,
                                            repayDate: moment(repaymentDate).utcOffset(330).startOf('day').format('YYYY-MM-DD'),
                                            adminFee: updatedAdminFee,
                                            GstOfAdminFee: Math.round(updatedAdminFee * 0.18),
                                            loanAmtApproved: loanAmount
                                        }),
                                        this.callHistoryLogsModel.insert({
                                            customerID: customerID,
                                            leadID: leadID,
                                            callType: CallType.IVR,
                                            calledBy: userId,
                                            status: 'Approved Process',
                                            remark: 'Modified Approved Process',
                                            noteli: '',
                                            callbackTime: moment().startOf('day').format('YYYY-MM-DD'),
                                            appAmount: loanAmount.toString()
                                        })
                                    ])
                                ];
                            case 4:
                                _state.sent();
                                return [
                                    2,
                                    this.serviceResponse(HttpStatusCode.Ok, {}, 'Loan Details have been updated')
                                ];
                        }
                    });
                }).call(this);
            }
        },
        {
            key: "addEmiCollectionDetails",
            value: function addEmiCollectionDetails(payload) {
                return _async_to_generator(function() {
                    var leadID, collectedAmount, collectedMode, referenceNo, collectedDate, status, remarks, waiver, discount_type, userID, db, lead, date, formattedDate, data, _ref, isFoundTransactions, isFoundCollection, baseUrl, response, json;
                    return _ts_generator(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                leadID = payload.leadID, collectedAmount = payload.collectedAmount, collectedMode = payload.collectedMode, referenceNo = payload.referenceNo, collectedDate = payload.collectedDate, status = payload.status, remarks = payload.remarks, waiver = payload.waiver, discount_type = payload.discount_type, userID = payload.userID;
                                db = getKnexInstance();
                                if (!leadID) {
                                    throw new BadRequestError('please send leadId');
                                }
                                return [
                                    4,
                                    this.leadModel.findOneLead({
                                        leadID: leadID
                                    }, [
                                        'customerID'
                                    ])
                                ];
                            case 1:
                                lead = _state.sent();
                                date = new Date(collectedDate);
                                formattedDate = date.toISOString().split('T')[0];
                                data = {
                                    customerID: lead.customerID,
                                    leadID: leadID,
                                    userID: userID,
                                    payment_transaction_status: status,
                                    status: 'pending',
                                    method: collectedMode,
                                    orderId: referenceNo,
                                    amount: collectedAmount,
                                    gateway: 4,
                                    transactionDate: formattedDate,
                                    remarks: remarks,
                                    waiver: waiver || 0,
                                    discount_type: discount_type || 0
                                };
                                return [
                                    4,
                                    Promise.all([
                                        db('transactions').where('orderID', referenceNo).first(),
                                        db('collection').where('orderID', referenceNo).first()
                                    ])
                                ];
                            case 2:
                                _ref = _sliced_to_array.apply(void 0, [
                                    _state.sent(),
                                    2
                                ]), isFoundTransactions = _ref[0], isFoundCollection = _ref[1];
                                if (isFoundTransactions && isFoundCollection) {
                                    throw new BadRequestError("ReferenceNo ".concat(referenceNo, " already exists in the database."));
                                }
                                baseUrl = this.commonHelper.getBaseUrl();
                                return [
                                    4,
                                    axios.post("".concat(baseUrl, "/new-api/collection-crm/add"), data, {
                                        headers: {
                                            api_key: config.phpApiKey,
                                            api_secret: config.phpApiSecret,
                                            'Content-Type': 'application/json'
                                        }
                                    })
                                ];
                            case 3:
                                response = _state.sent();
                                json = response.data;
                                if (!json) {
                                    throw new BadRequestError('Error while adding Emi collection ');
                                }
                                if (!json.success) {
                                    throw new BadRequestError('Error while adding Emi collection ');
                                }
                                return [
                                    2,
                                    this.serviceResponse(HttpStatusCode.Ok, json.data, 'Emi Collection Added')
                                ];
                        }
                    });
                }).call(this);
            }
        },
        {
            key: "modifyEmiLoan",
            value: function modifyEmiLoan(payload, leadID, userID) {
                return _async_to_generator(function() {
                    var adminFee, loanAmount, repaymentDate, roi, tenure, lead, approval, customerID, approvalID, mobileToken, firstDueDate, axios, emiResp, newAdminFee;
                    return _ts_generator(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                adminFee = payload.adminFee, loanAmount = payload.loanAmount, repaymentDate = payload.repaymentDate, roi = payload.roi, tenure = payload.tenure;
                                return [
                                    4,
                                    this.leadModel.findOneLead({
                                        leadID: leadID
                                    }, [
                                        'customerID',
                                        'status'
                                    ])
                                ];
                            case 1:
                                lead = _state.sent();
                                if (!lead) throw new NotFoundError('Lead not found');
                                if (lead.status !== LeadStatus.APPROVED && lead.status !== LeadStatus.APPROVED_PROCESS) {
                                    throw new BadRequestError("Lead status must be one of ".concat(LeadStatus.APPROVED, " or ").concat(LeadStatus.APPROVED_PROCESS));
                                }
                                return [
                                    4,
                                    this.approvalModel.findOneApproval({
                                        leadID: leadID
                                    }, [
                                        'approvalID'
                                    ])
                                ];
                            case 2:
                                approval = _state.sent();
                                if (!approval) throw new NotFoundError('Approval details not found');
                                customerID = lead.customerID;
                                approvalID = approval.approvalID;
                                if (loanAmount >= +config.emiMaxAmount) {
                                    throw new BadRequestError("Emi amount cannot be more than ".concat(+config.emiMaxAmount));
                                }
                                return [
                                    4,
                                    this.mobileTokenModel.findOneMobileToken({
                                        customerID: customerID.toString()
                                    }, [
                                        'access_token'
                                    ], [
                                        {
                                            column: 'customerID',
                                            order: 'desc'
                                        }
                                    ])
                                ];
                            case 3:
                                mobileToken = _state.sent();
                                firstDueDate = moment(repaymentDate).date();
                                axios = new AxiosService(this.commonHelper.getBaseUrl());
                                return [
                                    4,
                                    axios.call('post', RAMFIN_WEBAPP_API.PAYDAY_TO_EMI, {
                                        customer_id: customerID,
                                        firstDueDate: firstDueDate,
                                        lead_id: leadID,
                                        loanAmtApproved: loanAmount,
                                        productId: ProductID.EMI,
                                        roi: roi,
                                        tenure: tenure,
                                        userID: userID
                                    }, undefined, {
                                        token: mobileToken.access_token
                                    })
                                ];
                            case 4:
                                emiResp = _state.sent();
                                if (!emiResp.success) {
                                    throw new BadRequestError('Unable to modify EMI at the moment, Please try again later');
                                }
                                newAdminFee = this.loanService.calculateAdminFee(loanAmount, adminFee);
                                return [
                                    4,
                                    this.approvalModel.findOneAndUpdateApproval({
                                        approvalID: approvalID
                                    }, {
                                        adminFee: newAdminFee,
                                        GstOfAdminFee: Math.round(newAdminFee * (+config.gst / 100))
                                    })
                                ];
                            case 5:
                                _state.sent();
                                return [
                                    2,
                                    this.serviceResponse(HttpStatusCode.Ok, {}, 'EMI updated')
                                ];
                        }
                    });
                }).call(this);
            }
        },
        {
            key: "getAccountList",
            value: function getAccountList(leadID) {
                return _async_to_generator(function() {
                    var lead, customerID, customerAccounts;
                    return _ts_generator(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                return [
                                    4,
                                    this.leadModel.findOneLead({
                                        leadID: leadID
                                    }, [
                                        'customerID'
                                    ])
                                ];
                            case 1:
                                lead = _state.sent();
                                if (!lead) throw new NotFoundError('Lead not found');
                                customerID = lead.customerID;
                                return [
                                    4,
                                    getKnexInstance().raw("SET sql_mode = (SELECT REPLACE(@@sql_mode, 'ONLY_FULL_GROUP_BY', ''))")
                                ];
                            case 2:
                                _state.sent();
                                return [
                                    4,
                                    this.customerAccountModel.CustomerAccountKnex.where('customerID', customerID).select('accountID', 'accountNo', 'accountType', 'bank', 'bankIfsc').orderBy('accountID', 'desc').groupBy('accountNo')
                                ];
                            case 3:
                                customerAccounts = _state.sent();
                                getKnexInstance().raw("SET sql_mode = CONCAT(@@sql_mode, ',ONLY_FULL_GROUP_BY')");
                                return [
                                    2,
                                    this.serviceResponse(HttpStatusCode.Ok, customerAccounts, 'Fetched')
                                ];
                        }
                    });
                }).call(this);
            }
        },
        {
            key: "downloadCollectionCSV",
            value: function downloadCollectionCSV(leadID) {
                return _async_to_generator(function() {
                    var db, lead, collectionData, csvBuffer, collectionData1, csvBuffer1;
                    return _ts_generator(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                db = getKnexInstance();
                                return [
                                    4,
                                    this.leadModel.findOneLead({
                                        leadID: leadID
                                    }, [
                                        'customerID',
                                        'productID'
                                    ])
                                ];
                            case 1:
                                lead = _state.sent();
                                if (!lead) throw new NotFoundError('Lead not found');
                                if (!(lead.productID === ProductID.EMI)) return [
                                    3,
                                    4
                                ];
                                return [
                                    4,
                                    db('transactions as t').leftJoin('users as u', 't.createdBy', 'u.userID').select('t.loanNo', db.raw("\n          CASE\n            WHEN t.status = 0 THEN 'Failed'\n            WHEN t.status = 1 THEN 'Captured'\n            WHEN t.status = 2 THEN 'Pending'\n            WHEN t.status = 3 THEN 'Approved'\n            WHEN t.status = 3 THEN 'Rejected'\n            ELSE 'Unknown'\n          END AS status\n        "), 't.mode', 't.referenceNo', 't.orderId', 't.gateway', 't.createdAt', db.raw('COALESCE(u.name, "Unknown") as createdBy'), 't.amount', db.raw('COALESCE(t.transactionDate, t.createdAt) AS transactionDate'), 't.remarks', 't.discount_type', 't.payment_transaction_status', 't.waiver').where('t.leadID', leadID).where('emiID', '0').orderBy('t.id', 'desc')
                                ];
                            case 2:
                                collectionData = _state.sent();
                                if (collectionData.length === 0) {
                                    throw new BadRequestError('No collection found');
                                }
                                return [
                                    4,
                                    this.csvDownloadService.exportDataToCsvString(collectionData)
                                ];
                            case 3:
                                csvBuffer = _state.sent();
                                return [
                                    2,
                                    this.serviceResponse(HttpStatusCode.Ok, {
                                        csvBuffer: csvBuffer
                                    }, 'Collection data fetched successfully')
                                ];
                            case 4:
                                return [
                                    4,
                                    db('collection').select([
                                        'collection.loanNo',
                                        'collection.status',
                                        'collection.collectedMode',
                                        'collection.referenceNo',
                                        'collection.orderID',
                                        'collection.createdDate',
                                        db.raw("CASE WHEN collection.collectedBy = 1001 THEN 'Automatic System' ELSE users.name END AS collectedBy"),
                                        'collection.collectedAmount',
                                        'collection.remark',
                                        'collection.collectionStatus',
                                        'collection.discount_waiver',
                                        'collection.discount_waiver_amount',
                                        'collection.collectedDate'
                                    ]).leftJoin('users', 'collection.collectedBy', 'users.userID').where('collection.leadID', leadID).orderBy('collection.collectionID', 'desc')
                                ];
                            case 5:
                                collectionData1 = _state.sent();
                                if (collectionData1.length === 0) {
                                    throw new BadRequestError('No collection found');
                                }
                                return [
                                    4,
                                    this.csvDownloadService.exportDataToCsvString(collectionData1)
                                ];
                            case 6:
                                csvBuffer1 = _state.sent();
                                return [
                                    2,
                                    this.serviceResponse(HttpStatusCode.Ok, {
                                        csvBuffer: csvBuffer1
                                    }, 'Collection data fetched successfully')
                                ];
                            case 7:
                                return [
                                    2
                                ];
                        }
                    });
                }).call(this);
            }
        },
        {
            key: "customerPancardBlacklistOrWhitelist",
            value: function customerPancardBlacklistOrWhitelist(pancard, userID) {
                var status = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : 'Active', isWebhook = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : false;
                return _async_to_generator(function() {
                    var existingRecord, url, error, currentDate, error1;
                    return _ts_generator(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                _state.trys.push([
                                    0,
                                    12,
                                    ,
                                    13
                                ]);
                                return [
                                    4,
                                    this.blackListCustomerPancardModel.findOne({
                                        where: {
                                            pancard: pancard
                                        },
                                        order: [
                                            {
                                                column: 'id',
                                                order: 'desc'
                                            }
                                        ]
                                    })
                                ];
                            case 1:
                                existingRecord = _state.sent();
                                if (!(!existingRecord || existingRecord.status !== status)) return [
                                    3,
                                    11
                                ];
                                if (!!isWebhook) return [
                                    3,
                                    5
                                ];
                                url = config.blacklistCustomerWebhook;
                                _state.label = 2;
                            case 2:
                                _state.trys.push([
                                    2,
                                    4,
                                    ,
                                    5
                                ]);
                                return [
                                    4,
                                    axios.post(url, {
                                        pancard: pancard,
                                        userID: userID,
                                        status: status
                                    }, {
                                        headers: {
                                            'Content-Type': 'application/json',
                                            Authorization: "Basic ".concat(config.kamakshiMoneyApiKey)
                                        }
                                    })
                                ];
                            case 3:
                                _state.sent();
                                return [
                                    3,
                                    5
                                ];
                            case 4:
                                error = _state.sent();
                                throw new BadRequestError('Blacklist webhook error');
                            case 5:
                                currentDate = moment().format('YYYY-MM-DD HH:mm:ss');
                                if (!(status === 'Active' && existingRecord)) return [
                                    3,
                                    7
                                ];
                                // Blacklisting - update the existing record to Active
                                return [
                                    4,
                                    this.blackListCustomerPancardModel.findOneAndUpdate({
                                        id: existingRecord.id
                                    }, {
                                        status: 'Active',
                                        removeBy: userID,
                                        removeDate: currentDate
                                    })
                                ];
                            case 6:
                                _state.sent();
                                return [
                                    3,
                                    11
                                ];
                            case 7:
                                if (!(status === 'Active')) return [
                                    3,
                                    9
                                ];
                                // Blacklisting - add a new record with Active status
                                return [
                                    4,
                                    this.blackListCustomerPancardModel.create({
                                        pancard: pancard,
                                        addBy: userID,
                                        status: 'Active',
                                        addDate: currentDate,
                                        createdDate: currentDate
                                    })
                                ];
                            case 8:
                                _state.sent();
                                return [
                                    3,
                                    11
                                ];
                            case 9:
                                if (!(status === 'Deactive' && existingRecord)) return [
                                    3,
                                    11
                                ];
                                // Whitelisting - update the existing record to Deactive
                                return [
                                    4,
                                    this.blackListCustomerPancardModel.findOneAndUpdate({
                                        id: existingRecord.id
                                    }, {
                                        status: 'Deactive',
                                        removeBy: userID,
                                        removeDate: currentDate
                                    })
                                ];
                            case 10:
                                _state.sent();
                                _state.label = 11;
                            case 11:
                                return [
                                    3,
                                    13
                                ];
                            case 12:
                                error1 = _state.sent();
                                throw new BadRequestError('Error updating pancard blacklist status');
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
            key: "creditList",
            value: function creditList(payload, userID, page, perPage, isExcelDownload) {
                return _async_to_generator(function() {
                    var _ref, _ref1, lead_id, search_by, customer_search, city, state, status, employment_type, salary_mode, monthly_income, start_date, end_date, allocated, allocatedFilter, utm_source, flow, device, apID, scID, leadStatus, db, startDate, endDate, query, data, workbook, totalCountQuery, paginatedQuery, _ref2, totalCountResult, paginatedData, res;
                    return _ts_generator(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                lead_id = payload.lead_id, search_by = payload.search_by, customer_search = payload.customer_search, city = payload.city, state = payload.state, status = payload.status, employment_type = payload.employment_type, salary_mode = payload.salary_mode, monthly_income = payload.monthly_income, start_date = payload.start_date, end_date = payload.end_date, allocated = payload.allocated, allocatedFilter = payload.allocatedFilter, utm_source = payload.utm_source, flow = payload.flow, device = payload.device, apID = payload.apID, scID = payload.scID;
                                leadStatus = status ? [
                                    status
                                ] : [
                                    'Approved',
                                    'Rejected',
                                    'Hold',
                                    'Not Required'
                                ];
                                db = getKnexInstance();
                                return [
                                    4,
                                    getKnexInstance().raw("SET sql_mode = (SELECT REPLACE(@@sql_mode, 'ONLY_FULL_GROUP_BY', ''))")
                                ];
                            case 1:
                                _state.sent();
                                if (!start_date && !end_date) {
                                    startDate = moment().startOf('month').format('YYYY-MM-DD');
                                    endDate = moment().format('YYYY-MM-DD');
                                } else {
                                    startDate = start_date;
                                    endDate = end_date;
                                }
                                query = db('customer').select('leads.leadID', 'customer.customerID', 'leads.utmSource', 'leads.step', 'leads.alloUID', 'alloUser.name as allocatedTo', db.raw("CASE\n          WHEN leads.MLresponse IS NOT NULL\n          THEN ROUND((1 - leads.MLresponse) * 100, 2)\n          ELSE NULL\n      END AS observation"), 'leads.MLamount as preApprovedAmt', 'leads.MLsalary as 	mLAvgSalary', 'customer.name', 'customer.email', 'customer.mobile', 'leads.loanRequeried', 'leads.monthlyIncome', 'customer.employeeType', 'leads.city', 'leads.state', 'leads.pincode', 'leads.status', 'callUser.name as approvedBy', 'callhistoryLogs.createdDate as approvedDate', 'sanctionUser.name as sanctionBy', 'sanction.createdDate as sanctionDate', 'approval.rejectionReason as reason', 'approval.remark as Remark', 'approval.disbursalRemark as disbursalRemark', 'leads.fbLeads as leadType', 'leads.createdDate as leadcreatedDate', 'followup.createdDate as followupDate', 'collectionFollowupUser.name as followupExecutive', 'followup.StatusType as followupStatus', db.raw("CASE\n        WHEN deviceDetail.android_version IS NOT NULL\n        THEN 'Android'\n        ELSE 'IOS'\n       END AS deviceType"), db.raw("CASE\n        WHEN leads.step LIKE ? THEN 'Repeat'\n        WHEN leads.step LIKE ? THEN 'Short'\n        WHEN leads.step LIKE ? THEN 'Long'\n        WHEN leads.step LIKE ? THEN 'Common'\n        WHEN leads.step LIKE ? THEN 'Existing'\n        WHEN leads.step LIKE ? THEN '1_page'\n        WHEN leads.utmSource LIKE ? THEN 'Old App'\n        WHEN leads.utmSource LIKE ? AND leads.step IS NULL THEN 'Not Captured'\n        ELSE 'Web'\n      END AS flow", [
                                    '%Repeat%',
                                    '%Short%',
                                    '%Long%',
                                    '%Common%',
                                    '%Existing%',
                                    '%1_page%',
                                    '%apps%',
                                    '%APP_V%'
                                ]), db.raw("CASE\n        WHEN leads.step LIKE '%Short%' THEN\n          CASE WHEN LENGTH(leads.step) - LENGTH(REPLACE(leads.step, 'Short', '')) > 0\n               THEN SUBSTRING_INDEX(leads.step, 'Short', -1)\n               ELSE ''\n          END\n        WHEN leads.step LIKE '%Long%' THEN\n          CASE WHEN LENGTH(leads.step) - LENGTH(REPLACE(leads.step, 'Long', '')) > 0\n               THEN SUBSTRING_INDEX(leads.step, 'Long', -1)\n               ELSE ''\n          END\n        WHEN leads.step LIKE '%Common%' THEN\n          CASE WHEN LENGTH(leads.step) - LENGTH(REPLACE(leads.step, 'Common', '')) > 0\n               THEN SUBSTRING_INDEX(leads.step, 'Common', -1)\n               ELSE ''\n          END\n        WHEN leads.step LIKE '%Repeat%' THEN 'Repeat'\n        WHEN leads.step LIKE '%Existing%' THEN 'Existing'\n        WHEN leads.step LIKE '%1_page%' THEN '1_page'\n        WHEN leads.utmSource LIKE '%APP_V%' AND leads.step IS NULL THEN 'Not Captured'\n        WHEN leads.utmSource LIKE '%apps%' THEN 'Stage Completed'\n        ELSE 'Stage Completed'\n      END AS stage"), db.raw("CASE\n        WHEN leads.step LIKE '%Repeat%' OR leads.step LIKE '%Short%' OR leads.step LIKE '%Long%'\n          OR leads.step LIKE '%Common%' OR leads.step LIKE '%Existing%' OR leads.step LIKE '%1_page%'\n          THEN COALESCE(\n            (SELECT screen_name FROM flow_screen_map\n             WHERE flow_screen_map.flow =\n              CASE\n                WHEN leads.step LIKE '%Repeat%' THEN 'Repeat'\n                WHEN leads.step LIKE '%Short%' THEN 'Short'\n                WHEN leads.step LIKE '%Long%' THEN 'Long'\n                WHEN leads.step LIKE '%Common%' THEN 'Common'\n                WHEN leads.step LIKE '%Existing%' THEN 'Existing'\n                WHEN leads.step LIKE '%1_page%' THEN '1_page'\n              END\n             AND flow_screen_map.stage = TRIM(SUBSTRING_INDEX(leads.step, '/', 1))\n             LIMIT 1),\n            'Not Mapped'\n          )\n        WHEN leads.utmSource LIKE '%apps%' THEN 'Page Completed'\n        WHEN leads.utmSource LIKE '%APP_V%' AND leads.step IS NULL THEN 'Not Captured'\n        ELSE ''\n      END AS page")).orderBy('leads.leadID', 'desc').join('leads', 'customer.customerID', '=', 'leads.customerID').leftJoin('callhistoryLogs', function() {
                                    this.on('leads.leadID', '=', 'callhistoryLogs.leadID').andOn(db.raw('callhistoryLogs.status IN (?)', [
                                        leadStatus
                                    ])).andOn('callhistoryLogs.createdDate', '=', db.raw("(SELECT MIN(callHistoryID) FROM callhistoryLogs WHERE leadID = leads.leadID AND status IN (?))", [
                                        leadStatus
                                    ]));
                                }).leftJoin('users as alloUser', 'leads.alloUID', '=', 'alloUser.userID').leftJoin('users as callUser', 'callhistoryLogs.calledBy', '=', 'callUser.userID').leftJoin('approval', function() {
                                    this.on('approval.customerID', '=', 'customer.customerID').andOn('approval.leadID', '=', 'leads.leadID');
                                }).leftJoin('collectionFollowup as followup', function() {
                                    this.on('followup.leadID', '=', 'leads.leadID').andOn('followup.followup_type', '=', db.raw('?', [
                                        1
                                    ])).andOn('followup.reviewID', '=', db.raw("(SELECT MAX(reviewID) FROM collectionFollowup WHERE leadID = leads.leadID AND followup_type = 1)"));
                                }).leftJoin('users as collectionFollowupUser', 'followup.createdBy', '=', 'collectionFollowupUser.userID').leftJoin('callhistoryLogs as sanction', function() {
                                    this.on('sanction.customerID', '=', db.ref('customer.customerID')).andOn('sanction.leadID', '=', db.ref('leads.leadID')).andOn('sanction.status', '=', db.raw('?', [
                                        'Approved Process'
                                    ])).andOn('sanction.createdDate', '=', db.raw("(SELECT MAX(l.createdDate) FROM callhistoryLogs as l WHERE l.leadID = leads.leadID AND l.status = ?)", [
                                        'Approved Process'
                                    ]));
                                }).leftJoin('users as sanctionUser', 'sanction.calledBy', '=', 'sanctionUser.userID').leftJoin(db('login_device_detail as deviceDetail').select('deviceDetail.*').whereIn('id', function() {
                                    this.select(db.raw('MAX(id)')).from('login_device_detail').whereNotNull('modelName').whereNotNull('android_version').groupBy('mobile');
                                }).as('deviceDetail'), 'deviceDetail.mobile', 'customer.mobile').whereIn('leads.status', leadStatus);
                                query.whereBetween('leads.createdDate', [
                                    startDate,
                                    endDate
                                ]);
                                // Flow Filters Optimized
                                if (flow) {
                                    switch(flow){
                                        case 'Long':
                                        case 'Short':
                                        case 'Common':
                                        case 'Repeat':
                                        case 'Existing':
                                        case '1_page':
                                            query.whereRaw("leads.step LIKE ? AND leads.utmSource LIKE 'APP_V%'", [
                                                "%".concat(flow, "%")
                                            ]);
                                            break;
                                        case 'Old App':
                                            query.where('leads.utmSource', 'like', "%".concat(flow, "%"));
                                            break;
                                        case 'Web':
                                            query.whereNot('leads.utmSource', 'like', 'apps%').whereNot('leads.utmSource', 'like', 'APP_V%');
                                            break;
                                    }
                                }
                                //search_by case handling
                                if (search_by && customer_search) {
                                    switch(search_by){
                                        case 'mobile':
                                            query.where('customer.mobile', customer_search);
                                            break;
                                        case 'name':
                                            query.where('customer.name', customer_search);
                                            break;
                                        case 'email':
                                            query.where('customer.email', customer_search);
                                            break;
                                        case 'aadharNo':
                                            query.where('customer.aadharNo', customer_search);
                                            break;
                                        case 'pancard':
                                            query.where('customer.pancard', customer_search);
                                            break;
                                    }
                                }
                                // Optimized Monthly Income Condition
                                if (monthly_income) {
                                    query.where('leads.monthlyIncome', monthly_income == 1 ? '<' : '>=', 20000);
                                }
                                // Optimized Allocation Filters
                                if (allocated) {
                                    query.where(function(builder) {
                                        if (allocated == 0) {
                                            builder.where('leads.sanctionalloUID', 0);
                                        } else {
                                            builder.whereIn('leads.alloUID', [
                                                allocated,
                                                userID
                                            ]);
                                        }
                                    });
                                }
                                if (allocatedFilter) {
                                    query.where(function(builder) {
                                        if (allocatedFilter == 2) {
                                            builder.whereNotIn('leads.alloUID', [
                                                userID,
                                                '',
                                                0
                                            ]);
                                        } else if (allocatedFilter == 3) {
                                            builder.where('leads.alloUID', userID);
                                        }
                                    });
                                }
                                if (lead_id) query.where('leads.leadID', lead_id);
                                if (city) query.where('leads.city', city);
                                if (state) query.where('leads.state', state);
                                if (utm_source) query.where('leads.utmSource', utm_source);
                                // Optimized Device Filtering
                                if (device && device !== 'All') {
                                    if (device === 'android') {
                                        query.whereExists(function() {
                                            this.select(db.raw(1)).from('login_device_detail').whereRaw('login_device_detail.mobile = customer.mobile').whereNotNull('modelName').whereNotNull('android_version');
                                        });
                                    } else {
                                        query.whereNotExists(function() {
                                            this.select(db.raw(1)).from('login_device_detail').whereRaw('login_device_detail.mobile = customer.mobile');
                                        });
                                    }
                                }
                                if (!isExcelDownload) return [
                                    3,
                                    4
                                ];
                                return [
                                    4,
                                    query
                                ];
                            case 2:
                                data = _state.sent();
                                if (data.length == 0) {
                                    data = [
                                        {
                                            leadID: '-',
                                            customerID: '-',
                                            utmSource: '-',
                                            step: '-',
                                            alloUID: '-',
                                            allocatedTo: '-',
                                            observation: '-',
                                            preApprovedAmt: '-',
                                            mLAvgSalary: '-',
                                            name: '-',
                                            email: '-',
                                            mobile: '-',
                                            loanRequeried: '-',
                                            monthlyIncome: '-',
                                            employeeType: '-',
                                            city: '-',
                                            state: '-',
                                            pincode: '-',
                                            status: '-',
                                            approvedBy: '-',
                                            approvedDate: '-',
                                            sanctionBy: '-',
                                            sanctionDate: '-',
                                            reason: '-',
                                            Remark: '-',
                                            disbursalRemark: '-',
                                            leadType: '-',
                                            leadcreatedDate: '-',
                                            followupDate: '-',
                                            followupExecutive: '-',
                                            followupStatus: '-',
                                            deviceType: '-',
                                            flow: '-',
                                            stage: '-',
                                            page: '-'
                                        }
                                    ];
                                }
                                return [
                                    4,
                                    this.excelDownloadService.exportDataToExcelBuffer(data)
                                ];
                            case 3:
                                workbook = _state.sent();
                                return [
                                    2,
                                    this.serviceResponse(200, {
                                        workbook: workbook
                                    }, 'Excel generated successfully')
                                ];
                            case 4:
                                totalCountQuery = query.clone().count('* as totalCount').first();
                                paginatedQuery = query.clone().limit(perPage).offset(page);
                                return [
                                    4,
                                    Promise.all([
                                        totalCountQuery,
                                        paginatedQuery
                                    ])
                                ];
                            case 5:
                                _ref2 = _sliced_to_array.apply(void 0, [
                                    _state.sent(),
                                    2
                                ]), totalCountResult = _ref2[0], paginatedData = _ref2[1];
                                res = {
                                    result: paginatedData,
                                    totalCount: Number((_ref = totalCountResult === null || totalCountResult === void 0 ? void 0 : totalCountResult.totalCount) !== null && _ref !== void 0 ? _ref : 0),
                                    totalPages: calculateTotalPages(Number((_ref1 = totalCountResult === null || totalCountResult === void 0 ? void 0 : totalCountResult.totalCount) !== null && _ref1 !== void 0 ? _ref1 : 0), perPage)
                                };
                                return [
                                    2,
                                    this.serviceResponse(200, res, 'Credit data retreived successfully.')
                                ];
                        }
                    });
                }).call(this);
            }
        },
        {
            key: "sanctionList",
            value: function sanctionList(payload, userID, page, perPage, isExcelDownload) {
                return _async_to_generator(function() {
                    var _ref, _ref1, sanction, search_by, customer_search, lead_id, city, state, status, lead_case, employment_type, salary_mode, monthly_income, disposition, start_date, end_date, allocated, apID, utm_source, flow, device, action_start_date, action_end_date, allocatedFilter, leadStatus, startDate, endDate, db, query, data, workbook, totalCountQuery, paginatedQuery, _ref2, totalCountResult, paginatedData, res;
                    return _ts_generator(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                sanction = payload.sanction, search_by = payload.search_by, customer_search = payload.customer_search, lead_id = payload.lead_id, city = payload.city, state = payload.state, status = payload.status, lead_case = payload.lead_case, employment_type = payload.employment_type, salary_mode = payload.salary_mode, monthly_income = payload.monthly_income, disposition = payload.disposition, start_date = payload.start_date, end_date = payload.end_date, allocated = payload.allocated, apID = payload.apID, utm_source = payload.utm_source, flow = payload.flow, device = payload.device, action_start_date = payload.action_start_date, action_end_date = payload.action_end_date, allocatedFilter = payload.allocatedFilter;
                                leadStatus = [];
                                if (status) {
                                    leadStatus = [
                                        status
                                    ];
                                } else {
                                    leadStatus = [
                                        'Approved Process',
                                        'Rejected Process',
                                        'Hold Process',
                                        'Not Required Process'
                                    ];
                                }
                                if (!start_date && !end_date) {
                                    startDate = moment().startOf('month').format('YYYY-MM-DD');
                                    endDate = moment().format('YYYY-MM-DD');
                                } else {
                                    startDate = start_date;
                                    endDate = end_date;
                                }
                                db = getKnexInstance();
                                return [
                                    4,
                                    getKnexInstance().raw("SET sql_mode = (SELECT REPLACE(@@sql_mode, 'ONLY_FULL_GROUP_BY', ''))")
                                ];
                            case 1:
                                _state.sent();
                                query = db('customer').select('leads.leadID', 'customer.customerID', 'leads.utmSource', 'leads.step', 'leads.alloUID', 'alloUser.name as allocatedTo', db.raw("CASE\n            WHEN leads.MLresponse IS NOT NULL\n            THEN ROUND((1 - leads.MLresponse) * 100, 2)\n            ELSE NULL\n        END AS observation"), 'leads.MLamount as preApprovedAmt', 'leads.MLsalary as 	MLAvgSalary', 'customer.name', 'customer.email', 'customer.mobile', 'leads.loanRequeried', 'leads.monthlyIncome', 'customer.employeeType', 'approval.loanAmtApproved as approvedAmount', 'leads.city', 'leads.state', 'leads.pincode', 'leads.status', // 'callUser.name as approvedBy',
                                // 'callhistoryLogs.createdDate as approvedDate',
                                'approval.rejectionReason as reason', 'approval.remark as Remark', 'approval.disbursalRemark as disbursalRemark', 'leads.fbLeads as leadType', 'leads.createdDate as leadcreatedDate', 'followup.createdDate as sanctionDate', 'collectionFollowupUser.name as sanctionExecutive', 'followup.StatusType as sanctionStatus', db.raw("CASE\n          WHEN deviceDetail.android_version IS NOT NULL\n          THEN 'Android'\n          ELSE 'IOS'\n        END AS deviceType"), db.raw("CASE\n          WHEN leads.step LIKE ? THEN 'Repeat'\n          WHEN leads.step LIKE ? THEN 'Short'\n          WHEN leads.step LIKE ? THEN 'Long'\n          WHEN leads.step LIKE ? THEN 'Common'\n          WHEN leads.step LIKE ? THEN 'Existing'\n          WHEN leads.step LIKE ? THEN '1_page'\n          WHEN leads.utmSource LIKE ? THEN 'Old App'\n          WHEN leads.utmSource LIKE ? AND leads.step IS NULL THEN 'Not Captured'\n          ELSE 'Web'\n        END AS flow", [
                                    '%Repeat%',
                                    '%Short%',
                                    '%Long%',
                                    '%Common%',
                                    '%Existing%',
                                    '%1_page%',
                                    '%apps%',
                                    '%APP_V%'
                                ]), db.raw("CASE\n          WHEN leads.step LIKE '%Short%' THEN\n            CASE WHEN LENGTH(leads.step) - LENGTH(REPLACE(leads.step, 'Short', '')) > 0\n                THEN SUBSTRING_INDEX(leads.step, 'Short', -1)\n                ELSE ''\n            END\n          WHEN leads.step LIKE '%Long%' THEN\n            CASE WHEN LENGTH(leads.step) - LENGTH(REPLACE(leads.step, 'Long', '')) > 0\n                THEN SUBSTRING_INDEX(leads.step, 'Long', -1)\n                ELSE ''\n            END\n          WHEN leads.step LIKE '%Common%' THEN\n            CASE WHEN LENGTH(leads.step) - LENGTH(REPLACE(leads.step, 'Common', '')) > 0\n                THEN SUBSTRING_INDEX(leads.step, 'Common', -1)\n                ELSE ''\n            END\n          WHEN leads.step LIKE '%Repeat%' THEN 'Repeat'\n          WHEN leads.step LIKE '%Existing%' THEN 'Existing'\n          WHEN leads.step LIKE '%1_page%' THEN '1_page'\n          WHEN leads.utmSource LIKE '%APP_V%' AND leads.step IS NULL THEN 'Not Captured'\n          WHEN leads.utmSource LIKE '%apps%' THEN 'Stage Completed'\n          ELSE 'Stage Completed'\n        END AS stage"), db.raw("CASE\n          WHEN leads.step LIKE '%Repeat%' OR leads.step LIKE '%Short%' OR leads.step LIKE '%Long%'\n            OR leads.step LIKE '%Common%' OR leads.step LIKE '%Existing%' OR leads.step LIKE '%1_page%'\n            THEN COALESCE(\n              (SELECT screen_name FROM flow_screen_map\n              WHERE flow_screen_map.flow =\n                CASE\n                  WHEN leads.step LIKE '%Repeat%' THEN 'Repeat'\n                  WHEN leads.step LIKE '%Short%' THEN 'Short'\n                  WHEN leads.step LIKE '%Long%' THEN 'Long'\n                  WHEN leads.step LIKE '%Common%' THEN 'Common'\n                  WHEN leads.step LIKE '%Existing%' THEN 'Existing'\n                  WHEN leads.step LIKE '%1_page%' THEN '1_page'\n                END\n              AND flow_screen_map.stage = TRIM(SUBSTRING_INDEX(leads.step, '/', 1))\n              LIMIT 1),\n              'Not Mapped'\n            )\n          WHEN leads.utmSource LIKE '%apps%' THEN 'Page Completed'\n          WHEN leads.utmSource LIKE '%APP_V%' AND leads.step IS NULL THEN 'Not Captured'\n          ELSE ''\n        END AS page"), 'credit_reports.score').join('leads', 'customer.customerID', '=', 'leads.customerID').leftJoin('approval', function() {
                                    this.on('approval.leadID', '=', 'leads.leadID');
                                }).leftJoin('dialerFollowup', 'dialerFollowup.leadID', '=', 'leads.leadID').leftJoin('credit_reports', function() {
                                    this.on('leads.customerID', '=', 'credit_reports.customerID').andOn('credit_reports.id', '=', db.raw('(SELECT MAX(id) FROM credit_reports WHERE customerID = credit_reports.customerID AND score != 0 limit 1)'));
                                });
                                if (sanction == 'Approved Process') {
                                    query.leftJoin('callhistoryLogs', function() {
                                        this.on('leads.leadID', '=', 'callhistoryLogs.leadID').andOn(db.raw('callhistoryLogs.status IN (?)', [
                                            leadStatus
                                        ])).andOn('callhistoryLogs.callHistoryID', '=', db.raw("(SELECT MIN(callHistoryID) FROM callhistoryLogs WHERE leadID = leads.leadID AND status IN (?))", [
                                            leadStatus
                                        ]));
                                    });
                                }
                                query.leftJoin('users as alloUser', 'leads.alloUID', '=', 'alloUser.userID');
                                if (sanction == 'Approved Process') {
                                    query.leftJoin('users as callUser', 'callhistoryLogs.calledBy', '=', 'callUser.userID');
                                }
                                query.leftJoin('collectionFollowup as followup', function() {
                                    this.on('followup.leadID', '=', 'leads.leadID').andOn('followup.followup_type', '=', db.raw('?', [
                                        1
                                    ])).andOn('followup.reviewID', '=', db.raw("(SELECT MAX(reviewID) FROM collectionFollowup WHERE leadID = leads.leadID AND followup_type = 1)"));
                                }).leftJoin('users as collectionFollowupUser', 'followup.createdBy', '=', 'collectionFollowupUser.userID').leftJoin(db('login_device_detail as deviceDetail').select('deviceDetail.*').whereIn('id', function() {
                                    this.select(db.raw('MAX(id)')).from('login_device_detail').whereNotNull('modelName').whereNotNull('android_version').groupBy('mobile');
                                }).as('deviceDetail'), 'deviceDetail.mobile', 'customer.mobile');
                                query.whereIn('leads.status', leadStatus);
                                if (sanction == 'Approved Process') {
                                    query.select('callhistoryLogs.createdDate as approvedDate');
                                    query.select('callUser.name as approvedBy');
                                }
                                if (startDate && startDate) {
                                    if (sanction != 'Approved Process') {
                                        query.whereBetween('leads.createdDate', [
                                            startDate,
                                            endDate
                                        ]);
                                    } else {
                                        query.whereBetween('callhistoryLogs.createdDate', [
                                            startDate,
                                            endDate
                                        ]);
                                    }
                                }
                                if (action_start_date && action_end_date) {
                                    query.whereBetween('approval.createdDate', [
                                        action_start_date,
                                        action_end_date
                                    ]);
                                }
                                if (employment_type) {
                                    query.where('customer.employeeType', employment_type);
                                }
                                if (lead_id) {
                                    query.where('leads.leadID', lead_id);
                                }
                                if (salary_mode) {
                                    query.where('leads.salaryMode', salary_mode);
                                }
                                if (city) {
                                    query.where('leads.city', city);
                                }
                                if (utm_source) {
                                    query.where('leads.utmSource', utm_source);
                                }
                                if (state) {
                                    query.where('leads.state', state);
                                }
                                if (lead_case) {
                                    query.where('leads.fbLeads', lead_case);
                                }
                                // if (status) {
                                //   query.where('leads.status', status)
                                // }
                                if (disposition) {
                                    query.where('dialerFollowup.disposition', disposition);
                                }
                                if (flow) {
                                    switch(flow){
                                        case 'Long':
                                        case 'Short':
                                        case 'Common':
                                        case 'Repeat':
                                        case 'Existing':
                                        case '1_page':
                                            query.where(function(builder) {
                                                builder.where('leads.step', 'like', "%".concat(flow, "%")).where('leads.utmSource', 'like', 'APP_V%');
                                            });
                                            break;
                                        case 'Old App':
                                            query.where('leads.utmSource', 'like', "%".concat(flow, "%"));
                                            break;
                                        case 'Web':
                                            query.where(function(builder) {
                                                builder.whereNot('leads.utmSource', 'like', 'apps%').whereNot('leads.utmSource', 'like', 'APP_V%');
                                            });
                                            break;
                                    }
                                }
                                if (monthly_income) {
                                    if (monthly_income == 1) {
                                        query.where('leads.monthlyIncome', '<', 20000);
                                    } else if (monthly_income == 2) {
                                        query.where('leads.monthlyIncome', '>=', 20000);
                                    }
                                }
                                if (allocated) {
                                    if (allocated == 0) {
                                        query.where('leads.sanctionalloUID', 0);
                                    } else {
                                        query.where(function(builder) {
                                            builder.where('leads.callAssign', allocated).orWhere('leads.creditAssign', allocated).orWhere('leads.alloUID', allocated).orWhere('leads.sanctionalloUID', allocated);
                                        });
                                    }
                                }
                                // Filter based on allocatedFilter
                                if (allocatedFilter) {
                                    if (allocatedFilter == 2) {
                                        query.where(function() {
                                            this.where('leads.alloUID', '').orWhere('leads.alloUID', 'no');
                                        });
                                    } else if (allocatedFilter == 3) {
                                        query.where('leads.alloUID', '!=', '').where('leads.alloUID', '!=', 0).where('leads.alloUID', '!=', userID);
                                    } else {
                                        query.where('leads.alloUID', userID);
                                    }
                                }
                                if (apID != null && apID != undefined) {
                                    query.where('callhistoryLogs.calledBy', apID);
                                }
                                if (search_by && customer_search) {
                                    query.where(function(builder) {
                                        builder.where("customer.".concat(search_by), 'like', "%".concat(customer_search, "%"));
                                    });
                                }
                                if (device != null && device != undefined && device != 'All') {
                                    if (device === 'android') {
                                        query.whereExists(function() {
                                            this.select(db.raw(1)).from('login_device_detail').whereRaw('login_device_detail.mobile = customer.mobile').whereNotNull('login_device_detail.modelName').whereNotNull('login_device_detail.android_version');
                                        });
                                    } else {
                                        query.whereNotExists(function() {
                                            this.select(db.raw(1)).from('login_device_detail').whereRaw('login_device_detail.mobile = customer.mobile').whereNull('login_device_detail.modelName').whereNull('login_device_detail.android_version');
                                        });
                                    }
                                }
                                query.orderBy('leads.leadID', 'desc');
                                if (!isExcelDownload) return [
                                    3,
                                    4
                                ];
                                return [
                                    4,
                                    query
                                ];
                            case 2:
                                data = _state.sent();
                                if (data.length == 0) {
                                    data = [
                                        {
                                            leadID: '-',
                                            customerID: '-',
                                            utmSource: '-',
                                            step: '-',
                                            alloUID: '-',
                                            allocatedTo: '-',
                                            observation: '-',
                                            preApprovedAmt: '-',
                                            MLAvgSalary: '-',
                                            name: '-',
                                            email: '-',
                                            mobile: '-',
                                            loanRequeried: '-',
                                            monthlyIncome: '-',
                                            employeeType: '-',
                                            approvedAmount: '-',
                                            city: '-',
                                            state: '-',
                                            pincode: '-',
                                            status: '-',
                                            reason: '-',
                                            Remark: '-',
                                            disbursalRemark: '-',
                                            leadType: '-',
                                            leadcreatedDate: '-',
                                            sanctionDate: '-',
                                            sanctionExecutive: '-',
                                            sanctionStatus: '-',
                                            deviceType: '-',
                                            flow: '-',
                                            stage: '-',
                                            page: '-',
                                            score: '-'
                                        }
                                    ];
                                }
                                return [
                                    4,
                                    this.excelDownloadService.exportDataToExcelBuffer(data)
                                ];
                            case 3:
                                workbook = _state.sent();
                                return [
                                    2,
                                    this.serviceResponse(200, {
                                        workbook: workbook
                                    }, 'Excel generated successfully')
                                ];
                            case 4:
                                totalCountQuery = query.clone().count('* as totalCount').first();
                                paginatedQuery = query.clone().limit(perPage).offset(page);
                                return [
                                    4,
                                    Promise.all([
                                        totalCountQuery,
                                        paginatedQuery
                                    ])
                                ];
                            case 5:
                                _ref2 = _sliced_to_array.apply(void 0, [
                                    _state.sent(),
                                    2
                                ]), totalCountResult = _ref2[0], paginatedData = _ref2[1];
                                res = {
                                    result: paginatedData,
                                    totalCount: Number((_ref = totalCountResult === null || totalCountResult === void 0 ? void 0 : totalCountResult.totalCount) !== null && _ref !== void 0 ? _ref : 0),
                                    totalPages: calculateTotalPages(Number((_ref1 = totalCountResult === null || totalCountResult === void 0 ? void 0 : totalCountResult.totalCount) !== null && _ref1 !== void 0 ? _ref1 : 0), perPage)
                                };
                                return [
                                    2,
                                    this.serviceResponse(200, res, 'Sanction data retreived successfully.')
                                ];
                        }
                    });
                }).call(this);
            }
        },
        {
            key: "unprocessedList",
            value: function unprocessedList(payload, userID, page, perPage, isExcelDownload) {
                return _async_to_generator(function() {
                    var search_by, customer_search, lead_id, city, state, status, lead_case, employment_type, salary_mode, monthly_income, start_date, end_date, allocated, utm_source, flow, device, allocatedFilter, statuses, leadStatus, db, startDate, endDate, query, data, workbook, totalCountQuery, paginatedQuery, _ref, totalCountResult, paginatedData, res;
                    return _ts_generator(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                search_by = payload.search_by, customer_search = payload.customer_search, lead_id = payload.lead_id, city = payload.city, state = payload.state, status = payload.status, lead_case = payload.lead_case, employment_type = payload.employment_type, salary_mode = payload.salary_mode, monthly_income = payload.monthly_income, start_date = payload.start_date, end_date = payload.end_date, allocated = payload.allocated, utm_source = payload.utm_source, flow = payload.flow, device = payload.device, allocatedFilter = payload.allocatedFilter;
                                statuses = [
                                    LeadStatus.FRESH_LEAD,
                                    LeadStatus.CALLBACK,
                                    LeadStatus.INTERESTED,
                                    LeadStatus.NOT_INTERESTED,
                                    LeadStatus.NOT_ELIGIBLE,
                                    LeadStatus.DUPLICATE,
                                    LeadStatus.DNC,
                                    LeadStatus.DOCUMENT_RECEIVED,
                                    LeadStatus.INCOMPLETE_DOCUMENTS,
                                    LeadStatus.INTERESTED,
                                    LeadStatus.BLACK_LISTED,
                                    LeadStatus.INCOMPLETE_USER
                                ];
                                leadStatus = [];
                                if (status) {
                                    leadStatus = [
                                        status
                                    ];
                                } else {
                                    leadStatus = statuses;
                                }
                                db = getKnexInstance();
                                return [
                                    4,
                                    getKnexInstance().raw("SET sql_mode = (SELECT REPLACE(@@sql_mode, 'ONLY_FULL_GROUP_BY', ''))")
                                ];
                            case 1:
                                _state.sent();
                                if (!start_date && !end_date) {
                                    startDate = moment().startOf('month').format('YYYY-MM-DD');
                                    endDate = moment().format('YYYY-MM-DD');
                                } else {
                                    startDate = start_date;
                                    endDate = end_date;
                                }
                                query = db('customer').select('leads.leadID', 'customer.customerID', 'leads.utmSource', 'leads.step', 'leads.alloUID', 'alloUser.name as allocatedTo', db.raw("CASE\n              WHEN leads.MLresponse IS NOT NULL\n              THEN ROUND((1 - leads.MLresponse) * 100, 2)\n              ELSE NULL\n          END AS observation"), 'leads.MLamount as preApprovedAmt', 'leads.MLsalary as 	mLAvgSalary', 'customer.name', 'customer.email', 'customer.mobile', 'leads.loanRequeried', 'leads.monthlyIncome', 'customer.employeeType', 'leads.city', 'leads.state', 'leads.pincode', 'leads.status', 'callUser.name as approvedBy', 'sanctionUser.name as sanctionTeamAgent', 'callhistoryLogs.createdDate as approvedDate', 'approval.rejectionReason as reason', 'approval.remark as remark', 'approval.disbursalRemark as disbursalRemark', 'leads.fbLeads as leadType', 'leads.createdDate as leadcreatedDate', 'collectionFollowupUser.name as sanctionExecutive', 'creditAssignUser.name as creditAssign', db.raw("CASE\n            WHEN deviceDetail.android_version IS NOT NULL\n            THEN 'Android'\n            ELSE 'IOS'\n           END AS deviceType"), db.raw("CASE\n            WHEN leads.step LIKE ? THEN 'Repeat'\n            WHEN leads.step LIKE ? THEN 'Short'\n            WHEN leads.step LIKE ? THEN 'Long'\n            WHEN leads.step LIKE ? THEN 'Common'\n            WHEN leads.step LIKE ? THEN 'Existing'\n            WHEN leads.step LIKE ? THEN '1_page'\n            WHEN leads.utmSource LIKE ? THEN 'Old App'\n            WHEN leads.utmSource LIKE ? AND leads.step IS NULL THEN 'Not Captured'\n            ELSE 'Web'\n          END AS flow", [
                                    '%Repeat%',
                                    '%Short%',
                                    '%Long%',
                                    '%Common%',
                                    '%Existing%',
                                    '%1_page%',
                                    '%apps%',
                                    '%APP_V%'
                                ]), db.raw("CASE\n            WHEN leads.step LIKE '%Short%' THEN\n              CASE WHEN LENGTH(leads.step) - LENGTH(REPLACE(leads.step, 'Short', '')) > 0\n                   THEN SUBSTRING_INDEX(leads.step, 'Short', -1)\n                   ELSE ''\n              END\n            WHEN leads.step LIKE '%Long%' THEN\n              CASE WHEN LENGTH(leads.step) - LENGTH(REPLACE(leads.step, 'Long', '')) > 0\n                   THEN SUBSTRING_INDEX(leads.step, 'Long', -1)\n                   ELSE ''\n              END\n            WHEN leads.step LIKE '%Common%' THEN\n              CASE WHEN LENGTH(leads.step) - LENGTH(REPLACE(leads.step, 'Common', '')) > 0\n                   THEN SUBSTRING_INDEX(leads.step, 'Common', -1)\n                   ELSE ''\n              END\n            WHEN leads.step LIKE '%Repeat%' THEN 'Repeat'\n            WHEN leads.step LIKE '%Existing%' THEN 'Existing'\n            WHEN leads.step LIKE '%1_page%' THEN '1_page'\n            WHEN leads.utmSource LIKE '%APP_V%' AND leads.step IS NULL THEN 'Not Captured'\n            WHEN leads.utmSource LIKE '%apps%' THEN 'Stage Completed'\n            ELSE 'Stage Completed'\n          END AS stage"), db.raw("CASE\n            WHEN leads.step LIKE '%Repeat%' OR leads.step LIKE '%Short%' OR leads.step LIKE '%Long%'\n              OR leads.step LIKE '%Common%' OR leads.step LIKE '%Existing%' OR leads.step LIKE '%1_page%'\n              THEN COALESCE(\n                (SELECT screen_name FROM flow_screen_map\n                 WHERE flow_screen_map.flow =\n                  CASE\n                    WHEN leads.step LIKE '%Repeat%' THEN 'Repeat'\n                    WHEN leads.step LIKE '%Short%' THEN 'Short'\n                    WHEN leads.step LIKE '%Long%' THEN 'Long'\n                    WHEN leads.step LIKE '%Common%' THEN 'Common'\n                    WHEN leads.step LIKE '%Existing%' THEN 'Existing'\n                    WHEN leads.step LIKE '%1_page%' THEN '1_page'\n                  END\n                 AND flow_screen_map.stage = TRIM(SUBSTRING_INDEX(leads.step, '/', 1))\n                 LIMIT 1),\n                'Not Mapped'\n              )\n            WHEN leads.utmSource LIKE '%apps%' THEN 'Page Completed'\n            WHEN leads.utmSource LIKE '%APP_V%' AND leads.step IS NULL THEN 'Not Captured'\n            ELSE ''\n          END AS page"), db.raw("(CASE WHEN leads.status = 'Document Received'\n            THEN (SELECT users.name FROM users WHERE users.userID = callhistoryLogs.calledBy LIMIT 1)\n            ELSE (SELECT users.name FROM users WHERE users.userID = leads.creditAssign LIMIT 1) END)\n          AS callAssignDetail"), db.raw("\n          CASE\n            WHEN leads.status = 'Not Eligible' THEN\n              JSON_OBJECT(\n                'monthlyIncome',\n                  CASE\n                    WHEN leads.monthlyIncome IS NOT NULL AND leads.monthlyIncome < 20000 THEN 'Salary < 20000'\n                    WHEN leads.monthlyIncome IS NULL THEN 'Not Captured'\n                    ELSE ''\n                  END,\n                'salaryMode',\n                  CASE\n                    WHEN leads.salaryMode IS NOT NULL AND leads.salaryMode != 'Bank Transfer' THEN leads.salaryMode\n                    WHEN leads.salaryMode IS NULL THEN 'Not Captured'\n                    ELSE ''\n                  END,\n                'employeeType',\n                  CASE\n                    WHEN customer.employeeType IS NOT NULL AND customer.employeeType != 'Salaried' THEN customer.employeeType\n                    WHEN customer.employeeType IS NULL THEN 'Not Captured'\n                    ELSE ''\n                  END,\n                'state',\n                  CASE\n                    WHEN leads.state IS NOT NULL AND leads.state IN ('Andaman & Nicobar Islands','Arunachal Pradesh','Assam','Jammu & Kashmir','Lakshadweep','Manipur','Meghalaya','Mizoram','Nagaland','Sikkim','Tripura','Ladakh') THEN leads.state\n                    WHEN leads.state IS NULL THEN 'Not Captured'\n                    ELSE ''\n                  END,\n                'ivrRemark',\n                  CASE\n                    WHEN callhistoryLogs.remark IS NOT NULL THEN callhistoryLogs.remark\n                    WHEN callhistoryLogs.remark IS NULL THEN 'Not Captured'\n                    ELSE ''\n                  END\n              )\n            ELSE NULL\n          END AS notEligibleDetails\n        ")).join('leads', 'customer.customerID', '=', 'leads.customerID').leftJoin('callhistoryLogs', function() {
                                    this.on('leads.leadID', '=', 'callhistoryLogs.leadID').andOn(db.raw('callhistoryLogs.status IN (?)', [
                                        leadStatus
                                    ])).andOn('callhistoryLogs.createdDate', '=', db.raw("(SELECT MAX(createdDate) FROM callhistoryLogs WHERE leadID = leads.leadID AND status IN (?))", [
                                        leadStatus
                                    ]));
                                }).leftJoin('users as alloUser', 'leads.alloUID', '=', 'alloUser.userID').leftJoin('users as callUser', 'callhistoryLogs.calledBy', '=', 'callUser.userID').leftJoin('users as sanctionUser', 'leads.sanctionalloUID', '=', 'sanctionUser.userID').leftJoin('approval', function() {
                                    this.on('approval.customerID', '=', 'customer.customerID').andOn('approval.leadID', '=', 'leads.leadID');
                                }).leftJoin('collectionFollowup as followup', function() {
                                    this.on('followup.leadID', '=', 'leads.leadID').andOn('followup.followup_type', '=', db.raw('?', [
                                        1
                                    ])).andOn('followup.reviewID', '=', db.raw("(SELECT MAX(reviewID) FROM collectionFollowup WHERE leadID = leads.leadID AND followup_type = 1)"));
                                }).leftJoin('users as collectionFollowupUser', 'followup.createdBy', '=', 'collectionFollowupUser.userID').leftJoin('users as creditAssignUser', 'followup.createdBy', '=', 'creditAssignUser.userID').leftJoin(db('login_device_detail as deviceDetail').select('deviceDetail.*').whereIn('id', function() {
                                    this.select(db.raw('MAX(id)')).from('login_device_detail').whereNotNull('modelName').whereNotNull('android_version').groupBy('mobile');
                                }).as('deviceDetail'), 'deviceDetail.mobile', 'customer.mobile');
                                // .whereIn('leads.status', leadStatus)
                                if (startDate && endDate) {
                                    query.whereBetween('leads.createdDate', [
                                        startDate,
                                        endDate
                                    ]);
                                }
                                if (employment_type) {
                                    query.where('customer.employeeType', employment_type);
                                }
                                if (lead_id) {
                                    query.where('leads.leadID', lead_id);
                                }
                                if (salary_mode) {
                                    query.where('leads.salaryMode', salary_mode);
                                }
                                if (city) {
                                    query.where('leads.city', city);
                                }
                                if (utm_source) {
                                    query.where('leads.utmSource', utm_source);
                                }
                                if (state) {
                                    query.where('leads.state', state);
                                }
                                if (lead_case) {
                                    query.where('leads.fbLeads', lead_case);
                                }
                                if (status) {
                                    query.where('leads.status', status);
                                }
                                if (flow) {
                                    switch(flow){
                                        case 'Long':
                                        case 'Short':
                                        case 'Common':
                                        case 'Repeat':
                                        case 'Existing':
                                        case '1_page':
                                            query.where(function(builder) {
                                                builder.where('leads.step', 'like', "%".concat(flow, "%")).where('leads.utmSource', 'like', 'APP_V%');
                                            });
                                            break;
                                        case 'Old App':
                                            query.where('leads.utmSource', 'like', "%".concat(flow, "%"));
                                            break;
                                        case 'Web':
                                            query.where(function(builder) {
                                                builder.whereNot('leads.utmSource', 'like', 'apps%').whereNot('leads.utmSource', 'like', 'APP_V%');
                                            });
                                            break;
                                    }
                                }
                                if (monthly_income) {
                                    if (monthly_income == 1) {
                                        query.where('leads.monthlyIncome', '<', 20000);
                                    } else if (monthly_income == 2) {
                                        query.where('leads.monthlyIncome', '>=', 20000);
                                    }
                                }
                                if (allocated) {
                                    if (allocated == 0) {
                                        query.where('leads.sanctionalloUID', 0);
                                    } else {
                                        query.where(function(builder) {
                                            builder.where('leads.callAssign', allocated).orWhere('leads.creditAssign', allocated).orWhere('leads.alloUID', allocated).orWhere('leads.sanctionalloUID', allocated);
                                        });
                                    }
                                }
                                if (allocatedFilter) {
                                    if (allocatedFilter == 2) {
                                        query.where(function() {
                                            this.where('leads.alloUID', '').orWhere('leads.alloUID', 0);
                                        });
                                    } else if (allocatedFilter == 3) {
                                        query.where('leads.alloUID', '!=', '').where('leads.alloUID', '!=', 0).where('leads.alloUID', '!=', userID);
                                    } else {
                                        query.where('leads.alloUID', userID);
                                    }
                                }
                                if (customer_search) {
                                    query.where(function(builder) {
                                        builder.where("customer.".concat(search_by), 'like', "%".concat(customer_search, "%"));
                                    });
                                }
                                if (device) {
                                    if (device === 'android') {
                                        query.whereExists(function() {
                                            this.select(db.raw(1)).from('login_device_detail').whereRaw('login_device_detail.mobile = customer.mobile').whereNotNull('login_device_detail.modelName').whereNotNull('login_device_detail.android_version');
                                        });
                                    } else {
                                        query.whereNotExists(function() {
                                            this.select(db.raw(1)).from('login_device_detail').whereRaw('login_device_detail.mobile = customer.mobile');
                                        });
                                    }
                                }
                                query.orderBy('leads.leadID', 'desc');
                                if (!isExcelDownload) return [
                                    3,
                                    4
                                ];
                                return [
                                    4,
                                    query
                                ];
                            case 2:
                                data = _state.sent();
                                if (data.length == 0) {
                                    data = [
                                        {
                                            leadID: '-',
                                            customerID: '-',
                                            utmSource: '-',
                                            step: '-',
                                            alloUID: '-',
                                            allocatedTo: '-',
                                            observation: '-',
                                            preApprovedAmt: '-',
                                            mLAvgSalary: '-',
                                            name: '-',
                                            email: '-',
                                            mobile: '-',
                                            loanRequeried: '-',
                                            monthlyIncome: '-',
                                            employeeType: '-',
                                            city: '-',
                                            state: '-',
                                            pincode: '-',
                                            status: '-',
                                            approvedBy: '-',
                                            sanctionTeamAgent: '-',
                                            approvedDate: '-',
                                            reason: '-',
                                            remark: '-',
                                            disbursalRemark: '-',
                                            leadType: '-',
                                            leadcreatedDate: '-',
                                            sanctionExecutive: '-',
                                            creditAssign: '-',
                                            deviceType: '-',
                                            flow: '-',
                                            stage: '-',
                                            page: '-',
                                            callAssignDetail: '-',
                                            notEligibilityReason: '-'
                                        }
                                    ];
                                }
                                return [
                                    4,
                                    this.excelDownloadService.exportDataToExcelBuffer(data)
                                ];
                            case 3:
                                workbook = _state.sent();
                                return [
                                    2,
                                    this.serviceResponse(200, {
                                        workbook: workbook
                                    }, 'Excel generated successfully')
                                ];
                            case 4:
                                totalCountQuery = query.clone().count('* as totalCount').first();
                                paginatedQuery = query.clone().limit(perPage).offset(page);
                                return [
                                    4,
                                    Promise.all([
                                        totalCountQuery,
                                        paginatedQuery
                                    ])
                                ];
                            case 5:
                                _ref = _sliced_to_array.apply(void 0, [
                                    _state.sent(),
                                    2
                                ]), totalCountResult = _ref[0], paginatedData = _ref[1];
                                res = {
                                    result: paginatedData,
                                    totalCount: Number((totalCountResult === null || totalCountResult === void 0 ? void 0 : totalCountResult.totalCount) || 0),
                                    totalPages: calculateTotalPages(Number((totalCountResult === null || totalCountResult === void 0 ? void 0 : totalCountResult.totalCount) || 0), perPage)
                                };
                                return [
                                    2,
                                    this.serviceResponse(200, res, 'Unprocessed data retreived successfully.')
                                ];
                        }
                    });
                }).call(this);
            }
        },
        {
            key: "noteligibilityReason",
            value: function noteligibilityReason(leadData) {
                return _async_to_generator(function() {
                    var nc, notOperational, res, calHist;
                    return _ts_generator(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                nc = 'Not Captured';
                                notOperational = [
                                    'Andaman & Nicobar Islands',
                                    'Arunachal Pradesh',
                                    'Assam',
                                    'Jammu & Kashmir',
                                    'Lakshadweep',
                                    'Manipur',
                                    'Meghalaya',
                                    'Mizoram',
                                    'Nagaland',
                                    'Sikkim',
                                    'Tripura',
                                    'Ladakh'
                                ];
                                res = '';
                                return [
                                    4,
                                    this.callHistoryModel.findOne({
                                        where: {
                                            leadID: leadData.leadID,
                                            customerID: leadData.customerID,
                                            status: 'Not Eligible'
                                        },
                                        select: [
                                            'remark'
                                        ],
                                        order: [
                                            {
                                                column: 'callHistoryID',
                                                order: 'desc'
                                            }
                                        ]
                                    })
                                ];
                            case 1:
                                calHist = _state.sent();
                                if (leadData.monthlyIncome && leadData.monthlyIncome < 20000) {
                                    res += 'Salary < 20000\n';
                                } else if (!leadData.monthlyIncome) {
                                    res += '\nSalary :' + nc;
                                }
                                if (leadData.salaryMode && leadData.salaryMode !== 'Bank Transfer') {
                                    res += '\nSalary Mode :' + leadData.salaryMode;
                                } else if (!leadData.salaryMode) {
                                    res += '\nSalary Mode :' + nc;
                                }
                                if (leadData.employeeType && leadData.employeeType !== 'Salaried') {
                                    res += '\nEmployee Type :' + leadData.employeeType;
                                } else if (!leadData.employeeType) {
                                    res += '\nEmployee Type :' + nc;
                                }
                                if (leadData.state && notOperational.includes(leadData.state)) {
                                    res += '\nState :' + leadData.state;
                                } else if (!leadData.state) {
                                    res += '\nState :' + nc;
                                }
                                if (calHist && calHist.remark) {
                                    res += '\nIVR Remark :' + calHist.remark;
                                } else if (calHist && !calHist.remark) {
                                    res += '\nIVR Remark :' + nc;
                                }
                                return [
                                    2,
                                    res
                                ];
                        }
                    });
                }).call(this);
            }
        },
        {
            key: "getRepaymentDateData",
            value: function getRepaymentDateData(search_by, customer_search, page, perPage) {
                return _async_to_generator(function() {
                    var whereCondition, _ref, repaymentData, totalCount, data;
                    return _ts_generator(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                whereCondition = {};
                                if (search_by && customer_search) {
                                    switch(search_by){
                                        case 'mobile':
                                            whereCondition['c.mobile'] = parseInt(customer_search);
                                            break;
                                        case 'name':
                                            whereCondition['c.name'] = customer_search;
                                            break;
                                        case 'email':
                                            whereCondition['c.email'] = customer_search;
                                            break;
                                        case 'aadharNo':
                                            whereCondition['c.aadharNo'] = parseInt(customer_search);
                                            break;
                                        case 'pancard':
                                            whereCondition['c.pancard'] = customer_search;
                                            break;
                                    }
                                }
                                return [
                                    4,
                                    customerModel.findRepaymentDate({
                                        where: whereCondition,
                                        paginate: {
                                            perPage: perPage,
                                            page: page
                                        }
                                    })
                                ];
                            case 1:
                                _ref = _state.sent(), repaymentData = _ref.repaymentData, totalCount = _ref.totalCount;
                                if (repaymentData.length === 0) {
                                    throw new NotFoundError('Data not found');
                                }
                                data = {
                                    totalRows: totalCount,
                                    totalPages: calculateTotalPages(totalCount, perPage),
                                    table: repaymentData
                                };
                                return [
                                    2,
                                    this.serviceResponse(200, data, 'Fetch Repayment Date Data Successfully...')
                                ];
                        }
                    });
                }).call(this);
            }
        },
        {
            key: "updateRepaymentDateData",
            value: function updateRepaymentDateData(payload) {
                return _async_to_generator(function() {
                    var approvalID, date, customerID, leadID, isWeekendDate, isHolidayDate, findCustomerID, findLeadID, findApprovalID, appAmount, getDisbursalDate, disbursalDate, daysGap, findStatus, status;
                    return _ts_generator(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                approvalID = payload.approvalID, date = payload.date, customerID = payload.customerID, leadID = payload.leadID;
                                isWeekendDate = isWeekend(date);
                                if (isWeekendDate) {
                                    throw new BadRequestError('Date can not be a weekend');
                                }
                                return [
                                    4,
                                    isHoliday(date)
                                ];
                            case 1:
                                isHolidayDate = _state.sent();
                                if (isHolidayDate) {
                                    throw new BadRequestError('Date can not be a holiday');
                                }
                                return [
                                    4,
                                    this.customerModel.getCustomerById(customerID)
                                ];
                            case 2:
                                findCustomerID = _state.sent();
                                if (findCustomerID.length === 0) {
                                    throw new NotFoundError('Customer ID is not found');
                                }
                                return [
                                    4,
                                    this.leadModel.findOneLead({
                                        leadID: leadID
                                    })
                                ];
                            case 3:
                                findLeadID = _state.sent();
                                if (!findLeadID) {
                                    throw new NotFoundError('Lead ID is not found');
                                }
                                return [
                                    4,
                                    approvalModel.findOneApproval({
                                        approvalID: approvalID
                                    })
                                ];
                            case 4:
                                findApprovalID = _state.sent();
                                if (!findApprovalID) {
                                    throw new NotFoundError('Approval ID is not found');
                                }
                                appAmount = findApprovalID.loanAmtApproved;
                                return [
                                    4,
                                    loanModel.findOneLoan({
                                        customerID: customerID
                                    }, [
                                        'disbursalDate'
                                    ])
                                ];
                            case 5:
                                getDisbursalDate = _state.sent();
                                if (!getDisbursalDate) {
                                    throw new NotFoundError('Disbursal Date not found');
                                }
                                disbursalDate = new Date(getDisbursalDate.disbursalDate);
                                daysGap = differenceInDays(date, disbursalDate);
                                if (daysGap < 6) {
                                    throw new BadRequestError('Repayment date must be at least 6 days after the disbursal date');
                                }
                                return [
                                    4,
                                    this.leadModel.findOneLead({
                                        leadID: leadID,
                                        customerID: customerID
                                    })
                                ];
                            case 6:
                                findStatus = _state.sent();
                                if (!findStatus) {
                                    throw new NotFoundError('Status is not found');
                                }
                                status = findStatus.status;
                                return [
                                    4,
                                    approvalModel.findOneAndUpdateApproval({
                                        approvalID: approvalID
                                    }, {
                                        repayDate: date
                                    })
                                ];
                            case 7:
                                _state.sent();
                                return [
                                    4,
                                    callHistoryLogsModel.insert({
                                        customerID: customerID,
                                        leadID: leadID,
                                        callType: CallType.IVR,
                                        status: status,
                                        appAmount: appAmount.toString(),
                                        remark: 'Repayment Date is updated',
                                        noteli: '',
                                        callbackTime: moment().startOf('day').format('YYYY-MM-DD'),
                                        calledBy: customerID
                                    })
                                ];
                            case 8:
                                _state.sent();
                                return [
                                    2,
                                    this.serviceResponse(200, {}, 'Update Repayment Date Data Successfully...')
                                ];
                        }
                    });
                }).call(this);
            }
        },
        {
            key: "getNameMismatchData",
            value: function getNameMismatchData(search_by, customer_search, type, page, perPage) {
                return _async_to_generator(function() {
                    var nameMatchData, whereCondition, totalCount, ref, ref1, db, nameType, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, data, pancard, aadhar, _obj, err, data1;
                    return _ts_generator(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                whereCondition = {};
                                if (search_by && customer_search) {
                                    switch(search_by){
                                        case 'aadharNo':
                                            whereCondition['c.aadharNo'] = parseInt(customer_search);
                                            break;
                                        case 'pancard':
                                            whereCondition['c.pancard'] = customer_search;
                                            break;
                                        case 'name':
                                            whereCondition['c.name'] = customer_search;
                                            break;
                                        case 'email':
                                            whereCondition['c.email'] = customer_search;
                                            break;
                                        case 'mobile':
                                            whereCondition['c.mobile '] = parseInt(customer_search);
                                            break;
                                    }
                                }
                                switch(type){
                                    case NameMismatchType.FINBOX:
                                        return [
                                            3,
                                            1
                                        ];
                                    case NameMismatchType.PENNY:
                                        return [
                                            3,
                                            3
                                        ];
                                }
                                return [
                                    3,
                                    5
                                ];
                            case 1:
                                return [
                                    4,
                                    customerModel.getCustomerFinbox({
                                        where: whereCondition,
                                        paginate: {
                                            perPage: perPage,
                                            page: page
                                        }
                                    })
                                ];
                            case 2:
                                ref = _state.sent(), nameMatchData = ref.data, totalCount = ref.totalCount, ref;
                                return [
                                    3,
                                    5
                                ];
                            case 3:
                                return [
                                    4,
                                    customerModel.getCustomerPenny({
                                        where: whereCondition,
                                        paginate: {
                                            perPage: perPage,
                                            page: page
                                        }
                                    })
                                ];
                            case 4:
                                ref1 = _state.sent(), nameMatchData = ref1.data, totalCount = ref1.totalCount, ref1;
                                return [
                                    3,
                                    5
                                ];
                            case 5:
                                db = getKnexInstance();
                                nameType = type === 'penny' ? 'penny' : 'finbox';
                                _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
                                _state.label = 6;
                            case 6:
                                _state.trys.push([
                                    6,
                                    12,
                                    13,
                                    14
                                ]);
                                _iterator = nameMatchData[Symbol.iterator]();
                                _state.label = 7;
                            case 7:
                                if (!!(_iteratorNormalCompletion = (_step = _iterator.next()).done)) return [
                                    3,
                                    11
                                ];
                                data = _step.value;
                                return [
                                    4,
                                    db('customer_name_match').where('customer_id', data.customerID).where('type', "".concat(nameType, " - pancard")).orderBy('id', 'desc').first()
                                ];
                            case 8:
                                pancard = _state.sent();
                                return [
                                    4,
                                    db('customer_name_match').where('customer_id', data.customerID).whereIn('type', [
                                        "".concat(nameType, " - aadhar"),
                                        "".concat(nameType, " - digilocker"),
                                        "".concat(nameType, " - ckyc")
                                    ]).orderBy('id', 'desc').first()
                                ];
                            case 9:
                                aadhar = _state.sent();
                                if (pancard && pancard.second_name) {
                                    data.pancard_name = pancard.second_name;
                                }
                                if (pancard && pancard.percentage) {
                                    data.percentage_pancard = "".concat(pancard.percentage, "%");
                                }
                                if (aadhar && (aadhar.first_name || aadhar.second_name)) {
                                    ;
                                    data.aadhar_name = (_obj = {}, _define_property(_obj, nameType, aadhar.first_name), _define_property(_obj, "aadhar", aadhar.second_name), _obj);
                                }
                                if (aadhar && aadhar.percentage) {
                                    data.percentage_aadhar = "".concat(aadhar.percentage, "%");
                                }
                                if (aadhar && aadhar.first_name) {
                                    data.finbox_name = aadhar.first_name;
                                }
                                if (pancard && pancard.first_name) {
                                    data.finbox_name = pancard.first_name;
                                }
                                _state.label = 10;
                            case 10:
                                _iteratorNormalCompletion = true;
                                return [
                                    3,
                                    7
                                ];
                            case 11:
                                return [
                                    3,
                                    14
                                ];
                            case 12:
                                err = _state.sent();
                                _didIteratorError = true;
                                _iteratorError = err;
                                return [
                                    3,
                                    14
                                ];
                            case 13:
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
                            case 14:
                                data1 = {
                                    totalRows: totalCount,
                                    totalPages: calculateTotalPages(totalCount, perPage),
                                    table: nameMatchData
                                };
                                return [
                                    2,
                                    this.serviceResponse(200, data1, 'Fetch Name Mismatch  Data Successfully...')
                                ];
                        }
                    });
                }).call(this);
            }
        },
        {
            key: "nameMismatchAcceptReject",
            value: function nameMismatchAcceptReject(customerID, id, type, status, userID) {
                return _async_to_generator(function() {
                    var findCustomerID, findFinboxID, findPennyID;
                    return _ts_generator(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                return [
                                    4,
                                    this.customerModel.getCustomerById(customerID)
                                ];
                            case 1:
                                findCustomerID = _state.sent();
                                if (findCustomerID.length === 0) {
                                    throw new NotFoundError('Customer ID is not found');
                                }
                                switch(type){
                                    case NameMismatchType.FINBOX:
                                        return [
                                            3,
                                            2
                                        ];
                                    case NameMismatchType.PENNY:
                                        return [
                                            3,
                                            5
                                        ];
                                }
                                return [
                                    3,
                                    8
                                ];
                            case 2:
                                return [
                                    4,
                                    this.finboxNameMatchModel.getFinboxById(id)
                                ];
                            case 3:
                                findFinboxID = _state.sent();
                                if (findFinboxID.length == 0) {
                                    throw new NotFoundError('Finbox ID is not found');
                                }
                                return [
                                    4,
                                    this.finboxNameMatchModel.findOneAndUpdate({
                                        customerID: customerID,
                                        id: id
                                    }, {
                                        status: status.toString(),
                                        action_by: userID
                                    })
                                ];
                            case 4:
                                _state.sent();
                                return [
                                    3,
                                    8
                                ];
                            case 5:
                                return [
                                    4,
                                    this.pennyDropModel.getPennyById(id)
                                ];
                            case 6:
                                findPennyID = _state.sent();
                                if (findPennyID.length == 0) {
                                    throw new NotFoundError('Penny ID is not found');
                                }
                                return [
                                    4,
                                    this.pennyDropModel.proceedNameMismatchAcceptRejectPenny(customerID, id, status, userID)
                                ];
                            case 7:
                                _state.sent();
                                return [
                                    3,
                                    8
                                ];
                            case 8:
                                return [
                                    2,
                                    this.serviceResponse(200, {}, 'Operation Done Successfully...')
                                ];
                        }
                    });
                }).call(this);
            }
        },
        {
            key: "getPaymentMode",
            value: function getPaymentMode(searchInput, type) {
                return _async_to_generator(function() {
                    var fetchData;
                    return _ts_generator(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                if (type === 'bank') {
                                    throw new BadRequestError('Enter correct type');
                                }
                                switch(type){
                                    case 'global':
                                        return [
                                            3,
                                            1
                                        ];
                                    case 'bankSearch':
                                        return [
                                            3,
                                            3
                                        ];
                                }
                                return [
                                    3,
                                    5
                                ];
                            case 1:
                                return [
                                    4,
                                    this.paymentModeModel.find({
                                        where: {
                                            status: '1'
                                        }
                                    })
                                ];
                            case 2:
                                fetchData = _state.sent();
                                return [
                                    3,
                                    5
                                ];
                            case 3:
                                return [
                                    4,
                                    this.bankIfscModel.find({
                                        select: [
                                            'BANK'
                                        ],
                                        where: [
                                            {
                                                column: 'BANK',
                                                operator: 'like',
                                                value: "".concat(searchInput, "%")
                                            }
                                        ],
                                        order: [
                                            {
                                                column: 'BANK',
                                                order: 'asc'
                                            }
                                        ],
                                        distinct: true,
                                        paginate: {
                                            perPage: 10,
                                            page: 0
                                        }
                                    })
                                ];
                            case 4:
                                fetchData = _state.sent();
                                return [
                                    3,
                                    5
                                ];
                            case 5:
                                return [
                                    2,
                                    this.serviceResponse(200, fetchData, 'Fetch Data Successfully...')
                                ];
                        }
                    });
                }).call(this);
            }
        },
        {
            key: "updatePaymentMode",
            value: function updatePaymentMode(mode, payment_mode, searchInput, type, userID, page, perPage) {
                return _async_to_generator(function() {
                    var checkRecord, currentDate, db, data;
                    return _ts_generator(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                if (type === 'bankSearch') {
                                    throw new BadRequestError('Enter correct type');
                                }
                                switch(type){
                                    case 'bank':
                                        return [
                                            3,
                                            1
                                        ];
                                    case 'global':
                                        return [
                                            3,
                                            7
                                        ];
                                }
                                return [
                                    3,
                                    10
                                ];
                            case 1:
                                return [
                                    4,
                                    this.paymentModeForBanksModel.find({
                                        where: {
                                            bank_name: searchInput
                                        }
                                    })
                                ];
                            case 2:
                                checkRecord = _state.sent();
                                currentDate = new Date();
                                if (!(checkRecord && checkRecord.length !== 0)) return [
                                    3,
                                    4
                                ];
                                return [
                                    4,
                                    this.paymentModeForBanksModel.findOneAndUpdate({
                                        payment_mode: payment_mode,
                                        updated_by: userID,
                                        updated_date: currentDate,
                                        status: '1'
                                    }, {
                                        bank_name: searchInput
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
                                    this.paymentModeForBanksModel.insert({
                                        bank_name: searchInput,
                                        payment_mode: payment_mode,
                                        created_by: userID,
                                        created_date: currentDate,
                                        status: '1'
                                    })
                                ];
                            case 5:
                                _state.sent();
                                _state.label = 6;
                            case 6:
                                return [
                                    3,
                                    10
                                ];
                            case 7:
                                return [
                                    4,
                                    this.paymentModeModel.findOneAndUpdate({
                                        status: 0
                                    })
                                ];
                            case 8:
                                _state.sent();
                                return [
                                    4,
                                    this.paymentModeModel.findOneAndUpdate({
                                        status: 1
                                    }, {
                                        mode: mode
                                    })
                                ];
                            case 9:
                                _state.sent();
                                return [
                                    3,
                                    10
                                ];
                            case 10:
                                db = getKnexInstance();
                                return [
                                    4,
                                    db('payment_mode_for_banks as pb').where('pb.status', '1').orderBy([
                                        {
                                            column: 'id',
                                            order: 'desc'
                                        }
                                    ]).select([
                                        'pb.id',
                                        'pb.bank_name',
                                        'pb.payment_mode',
                                        'pb.updated_by',
                                        'pb.updated_date',
                                        'users.name as updated_by'
                                    ]).leftJoin('users', 'pb.updated_by', '=', 'users.userID').offset(page).limit(perPage)
                                ];
                            case 11:
                                data = _state.sent();
                                return [
                                    2,
                                    this.serviceResponse(200, data, 'Operation Done Successfully...')
                                ];
                        }
                    });
                }).call(this);
            }
        },
        {
            key: "deletePaymentMode",
            value: function deletePaymentMode(id) {
                return _async_to_generator(function() {
                    var findID;
                    return _ts_generator(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                return [
                                    4,
                                    this.paymentModeForBanksModel.find({
                                        where: {
                                            id: id
                                        }
                                    })
                                ];
                            case 1:
                                findID = _state.sent();
                                if (findID.length === 0) return [
                                    2,
                                    new NotFoundError('Id does not present in db')
                                ];
                                return [
                                    4,
                                    this.paymentModeForBanksModel.delete([
                                        {
                                            column: 'id',
                                            operator: '=',
                                            value: id
                                        }
                                    ])
                                ];
                            case 2:
                                _state.sent();
                                return [
                                    2,
                                    this.serviceResponse(200, {}, 'Operation done Successfully...')
                                ];
                        }
                    });
                }).call(this);
            }
        },
        {
            key: "getAssignedLeadId",
            value: function getAssignedLeadId(userId, role) {
                return _async_to_generator(function() {
                    var startDate, leadId;
                    return _ts_generator(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                startDate = moment().subtract(159, 'days').format('YYYY-MM-DD HH:mm:ss');
                                leadId = null;
                                return [
                                    4,
                                    this.getUserLeadIdToAllocate(startDate, userId)
                                ];
                            case 1:
                                //update hold or in progress lead id if found
                                leadId = _state.sent();
                                if (!leadId) return [
                                    2,
                                    this.serviceResponse(HttpStatusCode.NotFound, {}, 'Fresh Lead not found')
                                ];
                                //update user's lead status
                                return [
                                    4,
                                    this.userModel.updateUserById(userId, {
                                        lead_status: 'start'
                                    })
                                ];
                            case 2:
                                _state.sent();
                                return [
                                    2,
                                    this.serviceResponse(HttpStatusCode.Ok, {
                                        leadId: leadId
                                    }, 'Successfully Added')
                                ];
                        }
                    });
                }).call(this);
            }
        },
        {
            key: "getUserLeadIdToAllocate",
            value: function getUserLeadIdToAllocate(startDate, userId) {
                return _async_to_generator(function() {
                    var leadId, db, holdLead, holdTime, currentTime, holdId, _ref, newLead, priorityLead, freshLead;
                    return _ts_generator(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                db = getKnexInstance();
                                return [
                                    4,
                                    this.getUserHoldLeadByStartdate(startDate, userId)
                                ];
                            case 1:
                                holdLead = _state.sent();
                                if (!holdLead) return [
                                    3,
                                    2
                                ];
                                holdTime = moment(holdLead.hold_time, 'HH:mm:ss'); // Convert hold time
                                currentTime = moment();
                                holdId = 0;
                                if (currentTime.isAfter(holdTime)) holdId = 1;
                                if ([
                                    'Hold Process',
                                    'Hold'
                                ].includes(holdLead.status) && holdId) leadId = holdLead.leadID;
                                return [
                                    3,
                                    6
                                ];
                            case 2:
                                return [
                                    4,
                                    Promise.all([
                                        db('leads').select('leads.leadID', 'leads.status', 'leads.customerID', 'leads.hold_time').join('callhistoryLogs', 'callhistoryLogs.leadID', 'leads.leadID').where(function() {
                                            this.whereIn('leads.status', [
                                                'Document Received'
                                            ]).whereIn('leads.fbLeads', [
                                                'Existing Case',
                                                'New Case'
                                            ]).where('callhistoryLogs.createdDate', '>', startDate).where('leads.sanctionalloUID', userId).where('leads.alloUID', userId);
                                        }).first(),
                                        this.getPriorityUserLead(startDate)
                                    ])
                                ];
                            case 3:
                                _ref = _sliced_to_array.apply(void 0, [
                                    _state.sent(),
                                    2
                                ]), newLead = _ref[0], priorityLead = _ref[1];
                                freshLead = newLead || priorityLead;
                                if (!freshLead) return [
                                    3,
                                    6
                                ];
                                // Assign the lead to the current user
                                return [
                                    4,
                                    this.updateOne({
                                        leadID: freshLead.leadID
                                    }, {
                                        sanctionalloUID: userId,
                                        alloUID: "".concat(userId)
                                    })
                                ];
                            case 4:
                                _state.sent();
                                // Insert call history log
                                return [
                                    4,
                                    this.callHistoryLogsModel.insert({
                                        customerID: freshLead.customerID,
                                        leadID: freshLead.leadID,
                                        callType: 'IVR',
                                        status: 'Lead Allocated',
                                        appAmount: ' ',
                                        noteli: ' ',
                                        remark: "Lead Allocated to ".concat(userId),
                                        callbackTime: new Date(),
                                        calledBy: userId,
                                        createdDate: new Date()
                                    })
                                ];
                            case 5:
                                _state.sent();
                                leadId = freshLead.leadID;
                                _state.label = 6;
                            case 6:
                                return [
                                    2,
                                    leadId
                                ];
                        }
                    });
                }).call(this);
            }
        },
        {
            key: "getPriorityUserLead",
            value: function getPriorityUserLead(startDate) {
                return _async_to_generator(function() {
                    var db;
                    return _ts_generator(this, function(_state) {
                        db = getKnexInstance();
                        return [
                            2,
                            db('leads').select('leads.leadID', 'leads.status', 'leads.customerID', 'leads.hold_time').join('callhistoryLogs', 'callhistoryLogs.leadID', 'leads.leadID').join('customer', 'customer.customerID', 'leads.customerID').join('credit_reports', function() {
                                this.on('credit_reports.customerID', '=', 'leads.customerID').andOn(db.raw('credit_reports.id = (SELECT MAX(id) FROM credit_reports WHERE customerID = leads.customerID)'));
                            }).where(function() {
                                this.whereNotNull('customer.employeeType').where('leads.status', 'Document Received').whereIn('leads.fbLeads', [
                                    'Existing Case',
                                    'New Case'
                                ]).where('callhistoryLogs.createdDate', '>', startDate).where('leads.sanctionalloUID', 0).where('leads.alloUID', 0);
                            }).orderBy('customer.employeeType').orderBy('leads.monthlyIncome', 'desc').orderBy('credit_reports.score', 'desc').orderBy('leads.salaryMode').forUpdate() // Lock for update
                            .first()
                        ];
                    });
                })();
            }
        },
        {
            key: "getUserHoldLeadByStartdate",
            value: function getUserHoldLeadByStartdate(startDate, userId) {
                return _async_to_generator(function() {
                    var db;
                    return _ts_generator(this, function(_state) {
                        db = getKnexInstance();
                        return [
                            2,
                            db('leads').select('leads.leadID', 'leads.status', 'leads.customerID', 'leads.hold_time').join('callhistoryLogs', 'callhistoryLogs.leadID', 'leads.leadID').where(function() {
                                this.whereIn('leads.status', [
                                    'Hold Process',
                                    'Hold'
                                ]).whereIn('leads.fbLeads', [
                                    'Existing Case',
                                    'New Case'
                                ]).where('callhistoryLogs.createdDate', '>', startDate).where('leads.hold_date', moment().format('YYYY-MM-DD')).where('leads.sanctionalloUID', userId).where('leads.alloUID', userId);
                            }).first()
                        ];
                    });
                })();
            }
        },
        {
            key: "againNoLoanList",
            value: function againNoLoanList(payload, page, perPage, isExcelDownload) {
                return _async_to_generator(function() {
                    var _ref, _ref1, search_by, customer_search, lead_id, city, state, status, lead_case, start_date, end_date, allocated, utm_source, device, db, query, startDate, endDate, data, workbook, totalCountQuery, paginatedQuery, _ref2, totalCountResult, paginatedData, res;
                    return _ts_generator(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                search_by = payload.search_by, customer_search = payload.customer_search, lead_id = payload.lead_id, city = payload.city, state = payload.state, status = payload.status, lead_case = payload.lead_case, start_date = payload.start_date, end_date = payload.end_date, allocated = payload.allocated, utm_source = payload.utm_source, device = payload.device;
                                db = getKnexInstance();
                                return [
                                    4,
                                    getKnexInstance().raw("SET sql_mode = (SELECT REPLACE(@@sql_mode, 'ONLY_FULL_GROUP_BY', ''))")
                                ];
                            case 1:
                                _state.sent();
                                query = db('customer').join('leads', 'customer.customerID', '=', 'leads.customerID').leftJoin('users as alloUser', 'leads.alloUID', '=', 'alloUser.userID').leftJoin('approval', function() {
                                    this.on('approval.customerID', '=', 'customer.customerID').andOn('approval.leadID', '=', 'leads.leadID');
                                }).leftJoin('no_loan_follow_up_logs', function() {
                                    this.on('no_loan_follow_up_logs.lead_id', '=', 'leads.leadID').andOn('no_loan_follow_up_logs.created_at', '=', db.raw("(SELECT MAX(created_at) FROM no_loan_follow_up_logs WHERE lead_id = leads.leadID )"));
                                }).leftJoin('users as followUpUser', 'followUpUser.userID', '=', 'no_loan_follow_up_logs.follow_up_by').leftJoin('collection', function() {
                                    this.on('collection.customerID', '=', 'customer.customerID').andOn('collection.status', '=', db.raw('?', [
                                        'Closed'
                                    ])).andOn('collection.collectedDate', '=', db.raw("(SELECT MAX(collectedDate) FROM collection WHERE customerID = customer.customerID )"));
                                }).leftJoin(db('login_device_detail as deviceDetail').select('deviceDetail.*').whereIn('id', function() {
                                    this.select(db.raw('MAX(id)')).from('login_device_detail').whereNotNull('modelName').whereNotNull('android_version').groupBy('mobile');
                                }).as('deviceDetail'), 'deviceDetail.mobile', 'customer.mobile');
                                if (status) {
                                    query.where('leads.status', status);
                                } else {
                                    query.where('leads.status', 'closed');
                                }
                                query.select('leads.leadID', 'customer.customerID', 'leads.utmSource', 'customer.name', 'customer.email', 'customer.mobile', 'leads.city', 'leads.state', 'leads.pincode', 'leads.status', 'collection.collectedDate as lastLoanClosedDate', 'followUpUser.name as followUpUserName', 'no_loan_follow_up_logs.created_at', 'no_loan_follow_up_logs.follow_type', 'no_loan_follow_up_logs.status_type', 'no_loan_follow_up_logs.remark', db.raw("CASE\n            WHEN deviceDetail.android_version IS NOT NULL\n            THEN 'Android'\n            ELSE 'IOS'\n           END AS deviceType"));
                                if (start_date && end_date) {
                                    startDate = start_date;
                                    endDate = end_date;
                                    query.whereBetween('leads.createdDate', [
                                        startDate,
                                        endDate
                                    ]);
                                }
                                if (!status || status === 'Closed') {
                                    query.whereNotExists(function() {
                                        this.select(db.raw('1')).from('leads as l2').whereRaw('l2.customerID = leads.customerID').whereRaw('l2.leadID > leads.leadID');
                                    });
                                } else {
                                    query.whereExists(function() {
                                        this.select(db.raw('1')).from('leads as l2').whereRaw('l2.customerID = customer.customerID').where('l2.status', 'closed');
                                    }).where('leads.leadID', '=', function() {
                                        this.select(db.raw('MAX(l1.leadID)')).from('leads as l1').whereRaw('l1.customerID = customer.customerID').where('l1.status', '<>', 'closed');
                                    });
                                }
                                if (lead_id) {
                                    query.where('leads.leadID', lead_id);
                                }
                                if (city) {
                                    query.where('leads.city', city);
                                }
                                if (utm_source) {
                                    query.where('leads.utmSource', utm_source);
                                }
                                if (state) {
                                    query.where('leads.state', state);
                                }
                                if (lead_case) {
                                    query.where('leads.fbLeads', lead_case);
                                }
                                if (allocated) {
                                    if (allocated == 0) {
                                        query.where('leads.sanctionalloUID', 0);
                                    } else {
                                        query.where(function(builder) {
                                            builder.where('leads.callAssign', allocated).orWhere('leads.creditAssign', allocated).orWhere('leads.alloUID', allocated).orWhere('leads.sanctionalloUID', allocated);
                                        });
                                    }
                                }
                                if (customer_search) {
                                    query.where(function(builder) {
                                        builder.where("customer.".concat(search_by), 'like', "%".concat(customer_search, "%"));
                                    });
                                }
                                if (device) {
                                    if (device === 'android') {
                                        query.whereExists(function() {
                                            this.select(db.raw(1)).from('login_device_detail').whereRaw('login_device_detail.mobile = customer.mobile').whereNotNull('login_device_detail.modelName').whereNotNull('login_device_detail.android_version');
                                        });
                                    } else {
                                        query.whereNotExists(function() {
                                            this.select(db.raw(1)).from('login_device_detail').whereRaw('login_device_detail.mobile = customer.mobile');
                                        });
                                    }
                                }
                                query.orderBy('leads.leadID', 'desc');
                                if (!isExcelDownload) return [
                                    3,
                                    4
                                ];
                                return [
                                    4,
                                    query
                                ];
                            case 2:
                                data = _state.sent();
                                if (data.length == 0) {
                                    data = [
                                        {
                                            leadID: '-',
                                            customerID: '-',
                                            utmSource: '-',
                                            name: '-',
                                            email: '-',
                                            mobile: '-',
                                            city: '-',
                                            state: '-',
                                            pincode: '-',
                                            status: '-',
                                            lastLoanClosedDate: '-',
                                            followUpUserName: '-',
                                            created_at: '-',
                                            follow_type: '-',
                                            status_type: '-',
                                            remark: '-',
                                            deviceType: '-'
                                        }
                                    ];
                                }
                                return [
                                    4,
                                    this.excelDownloadService.exportDataToExcelBuffer(data)
                                ];
                            case 3:
                                workbook = _state.sent();
                                return [
                                    2,
                                    this.serviceResponse(200, {
                                        workbook: workbook
                                    }, 'Excel generated successfully')
                                ];
                            case 4:
                                totalCountQuery = query.clone().count('* as totalCount').first();
                                paginatedQuery = query.clone().limit(perPage).offset(page);
                                return [
                                    4,
                                    Promise.all([
                                        totalCountQuery,
                                        paginatedQuery
                                    ])
                                ];
                            case 5:
                                _ref2 = _sliced_to_array.apply(void 0, [
                                    _state.sent(),
                                    2
                                ]), totalCountResult = _ref2[0], paginatedData = _ref2[1];
                                res = {
                                    result: paginatedData,
                                    totalCount: Number((_ref = totalCountResult === null || totalCountResult === void 0 ? void 0 : totalCountResult.totalCount) !== null && _ref !== void 0 ? _ref : 0),
                                    totalPages: calculateTotalPages(Number((_ref1 = totalCountResult === null || totalCountResult === void 0 ? void 0 : totalCountResult.totalCount) !== null && _ref1 !== void 0 ? _ref1 : 0), perPage)
                                };
                                return [
                                    2,
                                    this.serviceResponse(200, res, 'Again NoLoan data retreived successfully.')
                                ];
                        }
                    });
                }).call(this);
            }
        },
        {
            key: "noEligibleList",
            value: function noEligibleList(payload, page, perPage, isExcelDownload) {
                return _async_to_generator(function() {
                    var _ref, _ref1, search_by, customer_search, lead_id, city, state, lead_case, start_date, end_date, allocated, utm_source, flow, device, leadStatus, db, startDate, endDate, query, data, workbook, totalCountQuery, paginatedQuery, _ref2, totalCountResult, paginatedData, res;
                    return _ts_generator(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                search_by = payload.search_by, customer_search = payload.customer_search, lead_id = payload.lead_id, city = payload.city, state = payload.state, lead_case = payload.lead_case, start_date = payload.start_date, end_date = payload.end_date, allocated = payload.allocated, utm_source = payload.utm_source, flow = payload.flow, device = payload.device;
                                leadStatus = LeadStatus.NOT_ELIGIBLE;
                                db = getKnexInstance();
                                return [
                                    4,
                                    getKnexInstance().raw("SET sql_mode = (SELECT REPLACE(@@sql_mode, 'ONLY_FULL_GROUP_BY', ''))")
                                ];
                            case 1:
                                _state.sent();
                                if (!start_date && !end_date) {
                                    startDate = moment().startOf('month').format('YYYY-MM-DD');
                                    endDate = moment().format('YYYY-MM-DD');
                                } else {
                                    startDate = start_date;
                                    endDate = end_date;
                                }
                                query = db('customer').join('leads', 'customer.customerID', '=', 'leads.customerID').leftJoin('callhistoryLogs', function() {
                                    this.on('leads.leadID', '=', 'callhistoryLogs.leadID').andOn('callhistoryLogs.status', '=', db.raw('?', [
                                        leadStatus
                                    ])).andOn('callhistoryLogs.createdDate', '=', db.raw("(SELECT MAX(createdDate) FROM callhistoryLogs WHERE leadID = leads.leadID AND status = ?)", [
                                        leadStatus
                                    ]));
                                }).leftJoin('users as alloUser', 'leads.alloUID', '=', 'alloUser.userID').leftJoin('users as callUser', 'callhistoryLogs.calledBy', '=', 'callUser.userID').leftJoin('users as sanctionUser', 'leads.sanctionalloUID', '=', 'sanctionUser.userID').leftJoin('approval', function() {
                                    this.on('approval.customerID', '=', 'customer.customerID').andOn('approval.leadID', '=', 'leads.leadID');
                                }).leftJoin('collectionFollowup as followup', function() {
                                    this.on('followup.leadID', '=', 'leads.leadID').andOn('followup.followup_type', '=', db.raw('?', [
                                        1
                                    ])).andOn('followup.reviewID', '=', db.raw("(SELECT MAX(reviewID) FROM collectionFollowup WHERE leadID = leads.leadID AND followup_type = 1)"));
                                }).leftJoin('users as collectionFollowupUser', 'followup.createdBy', '=', 'collectionFollowupUser.userID').leftJoin('users as creditAssignUser', 'followup.createdBy', '=', 'creditAssignUser.userID').leftJoin(db('login_device_detail as deviceDetail').select('deviceDetail.*').whereIn('id', function() {
                                    this.select(db.raw('MAX(id)')).from('login_device_detail').whereNotNull('modelName').whereNotNull('android_version').groupBy('mobile');
                                }).as('deviceDetail'), 'deviceDetail.mobile', 'customer.mobile');
                                query.where('leads.status', leadStatus);
                                query.select('leads.leadID', 'customer.customerID', 'leads.utmSource', 'leads.step', 'leads.alloUID', 'alloUser.name as allocatedTo', db.raw("CASE\n              WHEN leads.MLresponse IS NOT NULL\n              THEN ROUND((1 - leads.MLresponse) * 100, 2)\n              ELSE NULL\n          END AS observation"), 'leads.MLamount as preApprovedAmt', 'leads.MLsalary as 	mLAvgSalary', 'customer.name', 'customer.email', 'customer.mobile', 'leads.loanRequeried', 'leads.monthlyIncome', 'customer.employeeType', 'leads.city', 'leads.state', 'leads.pincode', 'leads.status', 'callUser.name as approvedBy', 'sanctionUser.name as sanctionTeamAgent', 'callhistoryLogs.createdDate as approvedDate', 'approval.rejectionReason as reason', 'approval.remark as remark', 'approval.disbursalRemark as disbursalRemark', 'leads.fbLeads as leadType', 'leads.createdDate as leadcreatedDate', 'collectionFollowupUser.name as sanctionExecutive', 'creditAssignUser.name as creditAssign', db.raw("CASE\n            WHEN deviceDetail.android_version IS NOT NULL\n            THEN 'Android'\n            ELSE 'IOS'\n           END AS deviceType"), db.raw("CASE\n            WHEN leads.step LIKE ? THEN 'Repeat'\n            WHEN leads.step LIKE ? THEN 'Short'\n            WHEN leads.step LIKE ? THEN 'Long'\n            WHEN leads.step LIKE ? THEN 'Common'\n            WHEN leads.step LIKE ? THEN 'Existing'\n            WHEN leads.step LIKE ? THEN '1_page'\n            WHEN leads.utmSource LIKE ? THEN 'Old App'\n            WHEN leads.utmSource LIKE ? AND leads.step IS NULL THEN 'Not Captured'\n            ELSE 'Web'\n          END AS flow", [
                                    '%Repeat%',
                                    '%Short%',
                                    '%Long%',
                                    '%Common%',
                                    '%Existing%',
                                    '%1_page%',
                                    '%apps%',
                                    '%APP_V%'
                                ]), db.raw("CASE\n            WHEN leads.step LIKE '%Short%' THEN\n              CASE WHEN LENGTH(leads.step) - LENGTH(REPLACE(leads.step, 'Short', '')) > 0\n                   THEN SUBSTRING_INDEX(leads.step, 'Short', -1)\n                   ELSE ''\n              END\n            WHEN leads.step LIKE '%Long%' THEN\n              CASE WHEN LENGTH(leads.step) - LENGTH(REPLACE(leads.step, 'Long', '')) > 0\n                   THEN SUBSTRING_INDEX(leads.step, 'Long', -1)\n                   ELSE ''\n              END\n            WHEN leads.step LIKE '%Common%' THEN\n              CASE WHEN LENGTH(leads.step) - LENGTH(REPLACE(leads.step, 'Common', '')) > 0\n                   THEN SUBSTRING_INDEX(leads.step, 'Common', -1)\n                   ELSE ''\n              END\n            WHEN leads.step LIKE '%Repeat%' THEN 'Repeat'\n            WHEN leads.step LIKE '%Existing%' THEN 'Existing'\n            WHEN leads.step LIKE '%1_page%' THEN '1_page'\n            WHEN leads.utmSource LIKE '%APP_V%' AND leads.step IS NULL THEN 'Not Captured'\n            WHEN leads.utmSource LIKE '%apps%' THEN 'Stage Completed'\n            ELSE 'Stage Completed'\n          END AS stage"), db.raw("CASE\n            WHEN leads.step LIKE '%Repeat%' OR leads.step LIKE '%Short%' OR leads.step LIKE '%Long%'\n              OR leads.step LIKE '%Common%' OR leads.step LIKE '%Existing%' OR leads.step LIKE '%1_page%'\n              THEN COALESCE(\n                (SELECT screen_name FROM flow_screen_map\n                 WHERE flow_screen_map.flow =\n                  CASE\n                    WHEN leads.step LIKE '%Repeat%' THEN 'Repeat'\n                    WHEN leads.step LIKE '%Short%' THEN 'Short'\n                    WHEN leads.step LIKE '%Long%' THEN 'Long'\n                    WHEN leads.step LIKE '%Common%' THEN 'Common'\n                    WHEN leads.step LIKE '%Existing%' THEN 'Existing'\n                    WHEN leads.step LIKE '%1_page%' THEN '1_page'\n                  END\n                 AND flow_screen_map.stage = TRIM(SUBSTRING_INDEX(leads.step, '/', 1))\n                 LIMIT 1),\n                'Not Mapped'\n              )\n            WHEN leads.utmSource LIKE '%apps%' THEN 'Page Completed'\n            WHEN leads.utmSource LIKE '%APP_V%' AND leads.step IS NULL THEN 'Not Captured'\n            ELSE ''\n          END AS page"), db.raw("(CASE WHEN leads.status = 'Document Received'\n            THEN (SELECT users.name FROM users WHERE users.userID = callhistoryLogs.calledBy LIMIT 1)\n            ELSE (SELECT users.name FROM users WHERE users.userID = leads.creditAssign LIMIT 1) END)\n          AS callAssignDetail"), 'approval.remark as notEligibilityReason');
                                query.whereBetween('leads.createdDate', [
                                    startDate,
                                    endDate
                                ]);
                                if (lead_id) {
                                    query.where('leads.leadID', lead_id);
                                }
                                if (city) {
                                    query.where('leads.city', city);
                                }
                                if (utm_source) {
                                    query.where('leads.utmSource', utm_source);
                                }
                                if (state) {
                                    query.where('leads.state', state);
                                }
                                if (lead_case) {
                                    query.where('leads.fbLeads', lead_case);
                                }
                                if (flow) {
                                    switch(flow){
                                        case 'Long':
                                        case 'Short':
                                        case 'Common':
                                        case 'Repeat':
                                        case 'Existing':
                                        case '1_page':
                                            query.where(function(builder) {
                                                builder.where('leads.step', 'like', "%".concat(flow, "%")).where('leads.utmSource', 'like', 'APP_V%');
                                            });
                                            break;
                                        case 'Old App':
                                            query.where('leads.utmSource', 'like', "%".concat(flow, "%"));
                                            break;
                                        case 'Web':
                                            query.where(function(builder) {
                                                builder.whereNot('leads.utmSource', 'like', 'apps%').whereNot('leads.utmSource', 'like', 'APP_V%');
                                            });
                                            break;
                                    }
                                }
                                if (allocated) {
                                    if (allocated == 0) {
                                        query.where('leads.sanctionalloUID', 0);
                                    } else {
                                        query.where(function(builder) {
                                            builder.where('leads.callAssign', allocated).orWhere('leads.creditAssign', allocated).orWhere('leads.alloUID', allocated).orWhere('leads.sanctionalloUID', allocated);
                                        });
                                    }
                                }
                                if (customer_search) {
                                    query.where(function(builder) {
                                        builder.where("customer.".concat(search_by), 'like', "%".concat(customer_search, "%"));
                                    });
                                }
                                if (device) {
                                    if (device === 'android') {
                                        query.whereExists(function() {
                                            this.select(db.raw(1)).from('login_device_detail').whereRaw('login_device_detail.mobile = customer.mobile').whereNotNull('login_device_detail.modelName').whereNotNull('login_device_detail.android_version');
                                        });
                                    } else {
                                        query.whereNotExists(function() {
                                            this.select(db.raw(1)).from('login_device_detail').whereRaw('login_device_detail.mobile = customer.mobile');
                                        });
                                    }
                                }
                                query.orderBy('leads.leadID', 'desc');
                                if (!isExcelDownload) return [
                                    3,
                                    4
                                ];
                                return [
                                    4,
                                    query
                                ];
                            case 2:
                                data = _state.sent();
                                if (data.length == 0) {
                                    data = [
                                        {
                                            leadID: '-',
                                            customerID: '-',
                                            utmSource: '-',
                                            step: '-',
                                            alloUID: '-',
                                            allocatedTo: '-',
                                            observation: '-',
                                            preApprovedAmt: '-',
                                            mLAvgSalary: '-',
                                            name: '-',
                                            email: '-',
                                            mobile: '-',
                                            loanRequeried: '-',
                                            monthlyIncome: '-',
                                            employeeType: '-',
                                            city: '-',
                                            state: '-',
                                            pincode: '-',
                                            status: '-',
                                            approvedBy: '-',
                                            sanctionTeamAgent: '-',
                                            approvedDate: '-',
                                            reason: '-',
                                            remark: '-',
                                            disbursalRemark: '-',
                                            leadType: '-',
                                            leadcreatedDate: '-',
                                            sanctionExecutive: '-',
                                            creditAssign: '-',
                                            deviceType: '-',
                                            flow: '-',
                                            stage: '-',
                                            page: '-',
                                            callAssignDetail: '-',
                                            notEligibilityReason: '-'
                                        }
                                    ];
                                }
                                return [
                                    4,
                                    this.excelDownloadService.exportDataToExcelBuffer(data)
                                ];
                            case 3:
                                workbook = _state.sent();
                                return [
                                    2,
                                    this.serviceResponse(200, {
                                        workbook: workbook
                                    }, 'Excel generated successfully')
                                ];
                            case 4:
                                totalCountQuery = query.clone().count('* as totalCount').first();
                                paginatedQuery = query.clone().limit(perPage).offset(page);
                                return [
                                    4,
                                    Promise.all([
                                        totalCountQuery,
                                        paginatedQuery
                                    ])
                                ];
                            case 5:
                                _ref2 = _sliced_to_array.apply(void 0, [
                                    _state.sent(),
                                    2
                                ]), totalCountResult = _ref2[0], paginatedData = _ref2[1];
                                res = {
                                    totalRecords: Number((_ref = totalCountResult === null || totalCountResult === void 0 ? void 0 : totalCountResult.totalCount) !== null && _ref !== void 0 ? _ref : 0),
                                    totalPages: calculateTotalPages(Number((_ref1 = totalCountResult === null || totalCountResult === void 0 ? void 0 : totalCountResult.totalCount) !== null && _ref1 !== void 0 ? _ref1 : 0), perPage),
                                    results: paginatedData
                                };
                                return [
                                    2,
                                    this.serviceResponse(200, res, 'Not Eligible data retreived successfully.')
                                ];
                        }
                    });
                }).call(this);
            }
        },
        {
            key: "againNoLoanFollowUp",
            value: function againNoLoanFollowUp(payload, followUpBy) {
                return _async_to_generator(function() {
                    var insertData, res;
                    return _ts_generator(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                insertData = _object_spread_props(_object_spread({}, payload), {
                                    follow_up_by: followUpBy
                                });
                                return [
                                    4,
                                    this.noLoanFollowUpLogModel.insert(insertData)
                                ];
                            case 1:
                                res = _state.sent();
                                return [
                                    2,
                                    this.serviceResponse(200, {
                                        response: res
                                    }, 'Operation Done Successfully...')
                                ];
                        }
                    });
                }).call(this);
            }
        },
        {
            key: "getAgainNoLoanFollowUp",
            value: function getAgainNoLoanFollowUp(query, page, perPage) {
                return _async_to_generator(function() {
                    var lead_id, customer_id, whereObj, _ref, totalCountResult, paginatedData, data;
                    return _ts_generator(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                lead_id = query.lead_id, customer_id = query.customer_id;
                                whereObj = {};
                                if (lead_id) {
                                    whereObj['lead_id'] = lead_id;
                                }
                                if (customer_id) {
                                    whereObj['customer_id'] = customer_id;
                                }
                                return [
                                    4,
                                    Promise.all([
                                        this.noLoanFollowUpLogModel.count({
                                            where: whereObj
                                        }),
                                        this.noLoanFollowUpLogModel.find({
                                            where: whereObj,
                                            order: [
                                                {
                                                    column: 'created_at',
                                                    order: 'desc'
                                                }
                                            ],
                                            paginate: {
                                                perPage: perPage,
                                                page: page
                                            }
                                        })
                                    ])
                                ];
                            case 1:
                                _ref = _sliced_to_array.apply(void 0, [
                                    _state.sent(),
                                    2
                                ]), totalCountResult = _ref[0], paginatedData = _ref[1];
                                data = {
                                    result: paginatedData,
                                    totalCount: totalCountResult,
                                    totalPages: calculateTotalPages(totalCountResult, perPage)
                                };
                                return [
                                    2,
                                    this.serviceResponse(200, data, 'Operation Done Successfully...')
                                ];
                        }
                    });
                }).call(this);
            }
        },
        {
            key: "noDuesPdfEmail",
            value: function noDuesPdfEmail(payload) {
                return _async_to_generator(function() {
                    var _noDuesData_data, lead, noDuesData, email, templatePath, htmlContent, headerUrl, footerUrl, headerImage, footerImage, browser, page, pdfBuffer, newhtmlContent, s3FolderName, imageName, res, pdfBase64, response;
                    return _ts_generator(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                return [
                                    4,
                                    this.leadModel.findOne({
                                        where: {
                                            leadID: payload.leadID
                                        },
                                        select: [
                                            'status',
                                            'lenderID'
                                        ]
                                    })
                                ];
                            case 1:
                                lead = _state.sent();
                                if (!lead) throw new NotFoundError('Lead not found');
                                if (lead.status !== LeadStatus.CLOSED) throw new BadRequestError('Cannot generate No Dues lead is not closed');
                                return [
                                    4,
                                    this.noDuesByLead(payload)
                                ];
                            case 2:
                                noDuesData = _state.sent();
                                if (!noDuesData) {
                                    throw new NotFoundError('NoDues data not found.');
                                }
                                email = (_noDuesData_data = noDuesData.data) === null || _noDuesData_data === void 0 ? void 0 : _noDuesData_data.email;
                                if (!email) {
                                    throw new NotFoundError('Email not found');
                                }
                                templatePath = path.resolve(__dirname, '../views/loansDocs/noDues.ejs');
                                return [
                                    4,
                                    ejs.renderFile(templatePath, {
                                        data: noDuesData.data
                                    })
                                ];
                            case 3:
                                htmlContent = _state.sent();
                                // Convert the S3 image URLs to base64
                                headerUrl = 'https://bank-logo-ramfin.s3.ap-south-1.amazonaws.com/Sanction-Letter-Header.jpg';
                                footerUrl = 'https://bank-logo-ramfin.s3.ap-south-1.amazonaws.com/Sanction-Letter-Footer.jpg';
                                return [
                                    4,
                                    this.convertImageUrlToBase64(headerUrl)
                                ];
                            case 4:
                                headerImage = _state.sent();
                                return [
                                    4,
                                    this.convertImageUrlToBase64(footerUrl)
                                ];
                            case 5:
                                footerImage = _state.sent();
                                return [
                                    4,
                                    puppeteer.launch({
                                        executablePath: '/usr/bin/chromium-browser'
                                    })
                                ];
                            case 6:
                                browser = _state.sent();
                                return [
                                    4,
                                    browser.newPage()
                                ];
                            case 7:
                                page = _state.sent();
                                return [
                                    4,
                                    page.setContent(htmlContent, {
                                        waitUntil: 'networkidle0'
                                    })
                                ];
                            case 8:
                                _state.sent();
                                return [
                                    4,
                                    page.pdf({
                                        format: 'A4',
                                        displayHeaderFooter: true,
                                        headerTemplate: '<div class="header" style="width: 100%; text-align: center;">\n        <img src="'.concat(headerImage, '" style="width:100%; max-height:150px; margin-top: -20px">\n      </div>'),
                                        footerTemplate: '<div class="footer" style="width: 100%; text-align: center;">\n        <img src="'.concat(footerImage, '" style="width:100%; max-height:150px; margin-bottom: -18px">\n      </div>'),
                                        margin: {
                                            top: '150px',
                                            bottom: '100px'
                                        }
                                    })
                                ];
                            case 9:
                                pdfBuffer = _state.sent();
                                return [
                                    4,
                                    browser.close()
                                ];
                            case 10:
                                _state.sent();
                                if (!pdfBuffer) {
                                    throw new InternalServerError('An error occurred while generating the PDF');
                                }
                                newhtmlContent = '\n      <!DOCTYPE html>\n      <html>\n      <head>\n        <style>\n          .header, .footer {\n            width: 100%;\n            text-align: center;\n          }\n          .header img {\n            width: 100%;\n            max-height: 150px;\n            margin-top: -20px;\n          }\n          .footer img {\n            width: 100%;\n            max-height: 150px;\n            margin-bottom: -18px;\n          }\n        </style>\n      </head>\n      <body>\n        <div class="header">\n          <img src="'.concat(headerUrl, '" alt="Header Image">\n        </div>\n        ').concat(htmlContent, '\n        <div class="footer">\n          <img src="').concat(footerUrl, '" alt="Footer Image">\n        </div>\n      </body>\n      </html>\n    ');
                                s3FolderName = 'documents/noDues/' + payload.customerID;
                                imageName = 'noDues_' + Math.floor(Date.now() / 1000) + '.pdf';
                                return [
                                    4,
                                    this.s3Service.uploadDocument(Buffer.from(pdfBuffer), s3FolderName, imageName)
                                ];
                            case 11:
                                res = _state.sent();
                                if (!(res && (res === null || res === void 0 ? void 0 : res.Key) !== null && res.Key !== '')) return [
                                    3,
                                    13
                                ];
                                return [
                                    4,
                                    this.documentModel.insert({
                                        customerID: payload.customerID,
                                        type: 'No Dues',
                                        documentType: 'No Dues',
                                        documentFile: res.Key,
                                        status: 'Verified',
                                        uploadBy: payload.customerID,
                                        uploadedDate: moment().format('YYYY-MM-DD HH:mm:ss'),
                                        verifiedBy: payload.customerID,
                                        verifiedDate: moment().format('YYYY-MM-DD HH:mm:ss'),
                                        upload_platform: 'S3'
                                    })
                                ];
                            case 12:
                                _state.sent();
                                return [
                                    3,
                                    14
                                ];
                            case 13:
                                throw new InternalServerError('An error occurred while storing the file in S3');
                            case 14:
                                pdfBase64 = Buffer.from(pdfBuffer).toString('base64');
                                return [
                                    4,
                                    notificationUtils.sendingPDFEmail(email, 'NO DUES CERTIFICATE', pdfBase64, 'pdf', 'NO_DUE_CERTIFICATE')
                                ];
                            case 15:
                                response = _state.sent();
                                if (!response.success) {
                                    throw new InternalServerError('An error occurred while sending the email.');
                                }
                                return [
                                    4,
                                    this.notificationService.create({
                                        customerID: payload.customerID,
                                        leadID: payload.leadID,
                                        notification: newhtmlContent,
                                        type: 'Email',
                                        subject: 'No Dues Certificate Ramfin Corp',
                                        createdDate: new Date(Date.now()),
                                        uid: '221'
                                    })
                                ];
                            case 16:
                                _state.sent();
                                return [
                                    2,
                                    this.serviceResponse(200, {}, 'No Dues certificate sent successfully.')
                                ];
                        }
                    });
                }).call(this);
            }
        },
        {
            key: "disbursalPdfEmail",
            value: function disbursalPdfEmail(payload) {
                return _async_to_generator(function() {
                    var _disbursalData_data, disbursalData, email, templatePath, htmlContent, headerUrl, footerUrl, headerImage, footerImage, browser, page, pdfBuffer, newhtmlContent, s3FolderName, imageName, res, pdfBase64, response;
                    return _ts_generator(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                return [
                                    4,
                                    this.disbursalByLead(payload)
                                ];
                            case 1:
                                disbursalData = _state.sent();
                                if (!disbursalData) {
                                    throw new NotFoundError('Disbursal data not found.');
                                }
                                email = (_disbursalData_data = disbursalData.data) === null || _disbursalData_data === void 0 ? void 0 : _disbursalData_data.email;
                                if (!email) {
                                    throw new NotFoundError('Email not found');
                                }
                                templatePath = path.resolve(__dirname, '../views/loansDocs/disbursal.ejs');
                                return [
                                    4,
                                    ejs.renderFile(templatePath, {
                                        data: disbursalData.data
                                    })
                                ];
                            case 2:
                                htmlContent = _state.sent();
                                // Convert the S3 image URLs to base64
                                headerUrl = 'https://bank-logo-ramfin.s3.ap-south-1.amazonaws.com/Sanction-Letter-Header.jpg';
                                footerUrl = 'https://bank-logo-ramfin.s3.ap-south-1.amazonaws.com/Sanction-Letter-Footer.jpg';
                                return [
                                    4,
                                    this.convertImageUrlToBase64(headerUrl)
                                ];
                            case 3:
                                headerImage = _state.sent();
                                return [
                                    4,
                                    this.convertImageUrlToBase64(footerUrl)
                                ];
                            case 4:
                                footerImage = _state.sent();
                                return [
                                    4,
                                    puppeteer.launch({
                                        executablePath: '/usr/bin/chromium-browser'
                                    })
                                ];
                            case 5:
                                browser = _state.sent();
                                return [
                                    4,
                                    browser.newPage()
                                ];
                            case 6:
                                page = _state.sent();
                                return [
                                    4,
                                    page.setContent(htmlContent, {
                                        waitUntil: 'networkidle0'
                                    })
                                ];
                            case 7:
                                _state.sent();
                                return [
                                    4,
                                    page.pdf({
                                        format: 'A4',
                                        displayHeaderFooter: true,
                                        headerTemplate: '<div class="header" style="width: 100%; text-align: center;">\n        <img src="'.concat(headerImage, '" style="width:100%; max-height:150px; margin-top: -20px">\n      </div>'),
                                        footerTemplate: '<div class="footer" style="width: 100%; text-align: center;">\n        <img src="'.concat(footerImage, '" style="width:100%; max-height:150px; margin-bottom: -18px">\n      </div>'),
                                        margin: {
                                            top: '150px',
                                            bottom: '100px'
                                        }
                                    })
                                ];
                            case 8:
                                pdfBuffer = _state.sent();
                                return [
                                    4,
                                    browser.close()
                                ];
                            case 9:
                                _state.sent();
                                if (!pdfBuffer) {
                                    throw new InternalServerError('An error occurred while generating the PDF');
                                }
                                newhtmlContent = '\n      <!DOCTYPE html>\n      <html>\n      <head>\n        <style>\n          .header, .footer {\n            width: 100%;\n            text-align: center;\n          }\n          .header img {\n            width: 100%;\n            max-height: 150px;\n            margin-top: -20px;\n          }\n          .footer img {\n            width: 100%;\n            max-height: 150px;\n            margin-bottom: -18px;\n          }\n        </style>\n      </head>\n      <body>\n        <div class="header">\n          <img src="'.concat(headerUrl, '" alt="Header Image">\n        </div>\n        ').concat(htmlContent, '\n        <div class="footer">\n          <img src="').concat(footerUrl, '" alt="Footer Image">\n        </div>\n      </body>\n      </html>\n    ');
                                s3FolderName = 'documents/disbursalLetter/' + payload.customerID;
                                imageName = 'disbursalLetter_' + Math.floor(Date.now() / 1000) + '.pdf';
                                return [
                                    4,
                                    this.s3Service.uploadDocument(Buffer.from(pdfBuffer), s3FolderName, imageName)
                                ];
                            case 10:
                                res = _state.sent();
                                if (!(res && (res === null || res === void 0 ? void 0 : res.Key) !== null && res.Key !== '')) return [
                                    3,
                                    12
                                ];
                                return [
                                    4,
                                    this.documentModel.insert({
                                        customerID: payload.customerID,
                                        type: 'Disbursal Letter',
                                        documentType: 'Disbursal Letter',
                                        documentFile: res.Key,
                                        status: 'Verified',
                                        uploadBy: payload.customerID,
                                        uploadedDate: moment().format('YYYY-MM-DD HH:mm:ss'),
                                        verifiedBy: payload.customerID,
                                        verifiedDate: moment().format('YYYY-MM-DD HH:mm:ss'),
                                        upload_platform: 'S3'
                                    })
                                ];
                            case 11:
                                _state.sent();
                                return [
                                    3,
                                    13
                                ];
                            case 12:
                                throw new InternalServerError('An error occurred while storing the file in S3');
                            case 13:
                                pdfBase64 = Buffer.from(pdfBuffer).toString('base64');
                                return [
                                    4,
                                    notificationUtils.sendingPDFEmail(email, 'DISBURSAL LETTER', pdfBase64, 'pdf', 'DISBURSAL_LETTER')
                                ];
                            case 14:
                                response = _state.sent();
                                if (!response.success) {
                                    throw new InternalServerError('An error occurred while sending the email.');
                                }
                                return [
                                    4,
                                    this.notificationService.create({
                                        customerID: payload.customerID,
                                        leadID: payload.leadID,
                                        notification: newhtmlContent,
                                        type: 'Email',
                                        subject: 'Disbursal Letter Ram Fincorp',
                                        createdDate: moment().utcOffset(330).format('YYYY-MM-DD HH:mm:ss'),
                                        uid: '221'
                                    })
                                ];
                            case 15:
                                _state.sent();
                                return [
                                    2,
                                    this.serviceResponse(200, {}, 'Disbursal Letter sent successfully.')
                                ];
                        }
                    });
                }).call(this);
            }
        },
        {
            key: "getAlloUID",
            value: function getAlloUID(leadID) {
                return _async_to_generator(function() {
                    var lead;
                    return _ts_generator(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                return [
                                    4,
                                    this.leadModel.findOne({
                                        where: [
                                            {
                                                column: 'leadID',
                                                value: leadID
                                            }
                                        ],
                                        select: [
                                            'alloUID'
                                        ]
                                    })
                                ];
                            case 1:
                                lead = _state.sent();
                                if (!lead) {
                                    throw new NotFoundError('Lead not found');
                                }
                                return [
                                    2,
                                    lead
                                ];
                        }
                    });
                }).call(this);
            }
        },
        {
            key: "getCustomerDetails",
            value: function getCustomerDetails(customerID) {
                return _async_to_generator(function() {
                    var customer;
                    return _ts_generator(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                return [
                                    4,
                                    this.customerModel.findOneCustomer({
                                        customerID: customerID
                                    }, [
                                        'name',
                                        'mobile',
                                        'email'
                                    ])
                                ];
                            case 1:
                                customer = _state.sent();
                                if (!customer) {
                                    throw new NotFoundError('Customer not found');
                                }
                                return [
                                    2,
                                    customer
                                ];
                        }
                    });
                }).call(this);
            }
        },
        {
            key: "getWcId",
            value: function getWcId(leadID, status) {
                return _async_to_generator(function() {
                    var message;
                    return _ts_generator(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                return [
                                    4,
                                    this.whatsappMessageIdsModel.findOne({
                                        where: [
                                            {
                                                column: 'leadID',
                                                value: leadID
                                            },
                                            {
                                                column: 'lead_status',
                                                value: status
                                            }
                                        ],
                                        select: [
                                            'wc_id'
                                        ],
                                        order: [
                                            {
                                                column: 'id',
                                                order: 'desc'
                                            }
                                        ]
                                    })
                                ];
                            case 1:
                                message = _state.sent();
                                if (!message) {
                                    throw new NotFoundError('Message not found');
                                }
                                return [
                                    2,
                                    message
                                ];
                        }
                    });
                }).call(this);
            }
        },
        {
            key: "assignAgent",
            value: function assignAgent(leadID, customerID, status) {
                return _async_to_generator(function() {
                    var leadDetail, customerDetails, userDetails, whatsapp_email, e;
                    return _ts_generator(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                _state.trys.push([
                                    0,
                                    4,
                                    ,
                                    5
                                ]);
                                return [
                                    4,
                                    this.getAlloUID(leadID)
                                ];
                            case 1:
                                leadDetail = _state.sent();
                                return [
                                    4,
                                    this.getCustomerDetails(customerID)
                                ];
                            case 2:
                                customerDetails = _state.sent();
                                return [
                                    4,
                                    this.userModel.findOne({
                                        where: [
                                            {
                                                column: 'userID',
                                                value: Number(leadDetail.alloUID)
                                            }
                                        ],
                                        select: [
                                            'whatsapp_email'
                                        ]
                                    })
                                ];
                            case 3:
                                userDetails = _state.sent();
                                whatsapp_email = (userDetails === null || userDetails === void 0 ? void 0 : userDetails.whatsapp_email) || '';
                                // TODO: Implement WhatsAppInteraktService
                                // const whatsAppInteraktService = new WhatsAppInteraktService();
                                // whatsAppInteraktService.mobile = customerDetails.mobile;
                                // whatsAppInteraktService.agentEmail = whatsapp_email;
                                // whatsAppInteraktService.wcId = messageDetails.wc_id;
                                // await whatsAppInteraktService.assignCustomerToAgent();
                                // await this.whatsappMessageIdsModel.findOneAndUpdate(
                                //   { wc_id: messageDetails.wc_id },
                                //   { user_id: Number(leadDetail.alloUID) },
                                // )
                                return [
                                    2,
                                    {
                                        success: '',
                                        statusCode: 200
                                    }
                                ];
                            case 4:
                                e = _state.sent();
                                logger.error('Failed to assign agent: ', e);
                                return [
                                    2,
                                    {
                                        error: e,
                                        statusCode: 500
                                    }
                                ];
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
            key: "creditDetail",
            value: function creditDetail(payload) {
                return _async_to_generator(function() {
                    var _approval_loanAmtApproved, _approval_employmentType, _lead_salaryMode, leadID, lead, customer, loan, approval, tenure, credit, creditData;
                    return _ts_generator(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                leadID = payload.leadID;
                                return [
                                    4,
                                    this.findOne({
                                        leadID: leadID
                                    }, [
                                        '*'
                                    ])
                                ];
                            case 1:
                                lead = _state.sent();
                                if (!lead) {
                                    throw new NotFoundError('Lead not found');
                                }
                                return [
                                    4,
                                    this.customerModel.findOneCustomer({
                                        customerID: lead.customerID
                                    }, [
                                        '*'
                                    ])
                                ];
                            case 2:
                                customer = _state.sent();
                                if (!customer) {
                                    throw new NotFoundError('Customer not found');
                                }
                                return [
                                    4,
                                    this.loanService.findOne({
                                        leadID: leadID,
                                        customerID: lead.customerID
                                    }, [
                                        'leadID',
                                        'disbursalAmount',
                                        'disbursalDate',
                                        'loanNo'
                                    ])
                                ];
                            case 3:
                                loan = _state.sent();
                                return [
                                    4,
                                    this.approvalModel.findOneApproval({
                                        leadID: leadID,
                                        customerID: lead.customerID
                                    }, [
                                        '*'
                                    ])
                                ];
                            case 4:
                                approval = _state.sent();
                                if (!approval) {
                                    throw new NotFoundError('Approval not found');
                                }
                                tenure = approval.tenure;
                                if (!(approval && loan)) return [
                                    3,
                                    6
                                ];
                                return [
                                    4,
                                    this.getTenure(loan.disbursalDate, approval.repayDate)
                                ];
                            case 5:
                                tenure = _state.sent();
                                _state.label = 6;
                            case 6:
                                if (!(lead.productID == 1)) return [
                                    3,
                                    8
                                ];
                                return [
                                    4,
                                    this.creditModel.findOneCredit({
                                        customerID: lead.customerID,
                                        leadID: leadID
                                    }, [
                                        'amountToBeRepayed',
                                        'tenure'
                                    ], [
                                        {
                                            column: 'creditID',
                                            order: 'desc'
                                        }
                                    ])
                                ];
                            case 7:
                                credit = _state.sent();
                                tenure = credit.tenure;
                                _state.label = 8;
                            case 8:
                                creditData = {
                                    loanType: lead.productID == 1 ? 'EMI' : 'Payday',
                                    tenure: tenure ? "".concat(tenure, " ").concat(lead.productID == 1 ? 'months' : 'days') : '-',
                                    roi: "".concat(approval.roi).concat(lead.productID == 1 ? '% per annum' : '% per day'),
                                    approvalAmount: (_approval_loanAmtApproved = approval.loanAmtApproved) !== null && _approval_loanAmtApproved !== void 0 ? _approval_loanAmtApproved : 0,
                                    employeeType: (_approval_employmentType = approval.employmentType) !== null && _approval_employmentType !== void 0 ? _approval_employmentType : '',
                                    monthlyIncome: lead.monthlyIncome,
                                    salaryMode: (_lead_salaryMode = lead.salaryMode) !== null && _lead_salaryMode !== void 0 ? _lead_salaryMode : '',
                                    repaymentDate: moment(approval.repayDate).format('DD/MM/YYYY'),
                                    creditDate: moment(approval.createdDate).format('Do MMM, YYYY, h:mm A')
                                };
                                return [
                                    2,
                                    this.serviceResponse(200, creditData, 'Credit details retreived successfully.')
                                ];
                        }
                    });
                }).call(this);
            }
        },
        {
            key: "collectionModeUpdate",
            value: function collectionModeUpdate(payload) {
                return _async_to_generator(function() {
                    var leadID, customerID, referenceNo, id, collectedMode, productID, status, userID, db, collection, transactions, normalizedCollectedMode, data, statusMap, transaction;
                    return _ts_generator(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                leadID = payload.leadID, customerID = payload.customerID, referenceNo = payload.referenceNo, id = payload.id, collectedMode = payload.collectedMode, productID = payload.productID, status = payload.status, userID = payload.userID;
                                db = getKnexInstance();
                                if (!(ProductID.PAYDAY === productID)) return [
                                    3,
                                    6
                                ];
                                return [
                                    4,
                                    collectionModel.findOne({
                                        where: {
                                            collectionID: id
                                        }
                                    })
                                ];
                            case 1:
                                collection = _state.sent();
                                if (!collection) {
                                    throw new NotFoundError('The collection does not exist');
                                }
                                return [
                                    4,
                                    this.transactionModel.find({
                                        where: {
                                            leadID: leadID,
                                            customerID: customerID,
                                            collectionID: id
                                        },
                                        select: [
                                            'id'
                                        ]
                                    })
                                ];
                            case 2:
                                transactions = _state.sent();
                                if (transactions.length > 1) {
                                    throw new BadRequestError('Duplicate transactions found');
                                }
                                normalizedCollectedMode = Object.values(CollectedMode).includes(collectedMode) ? collectedMode : undefined;
                                return [
                                    4,
                                    collectionModel.findOneAndUpdate({
                                        collectionID: id
                                    }, {
                                        collectedMode: collectedMode === 'CASH' ? CollectedMode.CASH : normalizedCollectedMode,
                                        referenceNo: referenceNo
                                    })
                                ];
                            case 3:
                                _state.sent();
                                return [
                                    4,
                                    this.transactionModel.findOneAndUpdate({
                                        leadID: leadID,
                                        customerID: customerID,
                                        collectionID: id
                                    }, {
                                        mode: normalizedCollectedMode,
                                        referenceNo: referenceNo
                                    })
                                ];
                            case 4:
                                _state.sent();
                                data = {
                                    customerID: customerID,
                                    leadID: leadID,
                                    callType: productID == ProductID.PAYDAY ? 'payDay' : 'emi',
                                    status: status,
                                    appAmount: '',
                                    noteli: 'Payment Mode Update',
                                    remark: 'Payment Mode Update',
                                    callbackTime: moment().format('YYYY-MM-DD'),
                                    calledBy: userID,
                                    createdDate: moment().format('YYYY-MM-DD HH:mm:ss')
                                };
                                return [
                                    4,
                                    callHistoryLogsModel.insert(data)
                                ];
                            case 5:
                                _state.sent();
                                return [
                                    3,
                                    10
                                ];
                            case 6:
                                statusMap = {
                                    1: 'Captured',
                                    2: 'Pending',
                                    3: 'Approved',
                                    4: 'Rejected'
                                };
                                console.log(statusMap[2]);
                                if (statusMap[1] == status || statusMap[4] == status) {
                                    throw new BadRequestError('Only transactions with a status of Pending or Approved are allowed');
                                }
                                return [
                                    4,
                                    this.transactionModel.findOneTransaction({
                                        id: id
                                    })
                                ];
                            case 7:
                                transaction = _state.sent();
                                if (!transaction) {
                                    throw new NotFoundError('Transaction not found');
                                }
                                return [
                                    4,
                                    this.transactionModel.findAndUpdate([
                                        {
                                            key: 'id',
                                            valueArray: [
                                                id
                                            ]
                                        }
                                    ], {
                                        mode: collectedMode,
                                        referenceNo: referenceNo
                                    })
                                ];
                            case 8:
                                _state.sent();
                                return [
                                    4,
                                    callHistoryLogsModel.insert({
                                        customerID: customerID,
                                        leadID: leadID,
                                        callType: productID == ProductID.PAYDAY ? 'payDay' : 'emi',
                                        status: statusMap[parseInt(status, 10)] || 'Failed',
                                        appAmount: '',
                                        remark: 'Payment Mode Update',
                                        noteli: 'Payment Mode Update',
                                        callbackTime: moment().format('YYYY-MM-DD'),
                                        calledBy: userID,
                                        createdDate: moment().format('YYYY-MM-DD HH:mm:ss')
                                    })
                                ];
                            case 9:
                                _state.sent();
                                _state.label = 10;
                            case 10:
                                return [
                                    2,
                                    this.serviceResponse(200, {}, 'Collection mode updated successfully.')
                                ];
                        }
                    });
                }).call(this);
            }
        },
        {
            key: "leadRefundUpdate",
            value: function leadRefundUpdate(payload) {
                return _async_to_generator(function() {
                    var collectionID, leadID, refundDate, utrNo, status, remark, prAmount, userID, db, currentDate, collectionData, error;
                    return _ts_generator(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                collectionID = payload.collectionID, leadID = payload.leadID, refundDate = payload.refundDate, utrNo = payload.utrNo, status = payload.status, remark = payload.remark, prAmount = payload.prAmount, userID = payload.userID;
                                db = getKnexInstance();
                                currentDate = new Date();
                                _state.label = 1;
                            case 1:
                                _state.trys.push([
                                    1,
                                    4,
                                    ,
                                    5
                                ]);
                                return [
                                    4,
                                    db('collection').where({
                                        leadID: leadID,
                                        collectionID: collectionID
                                    }).first()
                                ];
                            case 2:
                                collectionData = _state.sent();
                                if (!collectionData) {
                                    return [
                                        2,
                                        this.serviceResponse(HttpStatusCode.NotFound, {}, 'Collection Data Not Available.')
                                    ];
                                }
                                if (collectionData.excess_amount < prAmount) {
                                    return [
                                        2,
                                        this.serviceResponse(HttpStatusCode.BadRequest, {}, "Please enter a valid amount below ".concat(collectionData.excess_amount))
                                    ];
                                }
                                return [
                                    4,
                                    db.transaction(function(trx) {
                                        return _async_to_generator(function() {
                                            return _ts_generator(this, function(_state) {
                                                switch(_state.label){
                                                    case 0:
                                                        return [
                                                            4,
                                                            trx('collectionRefund').insert({
                                                                collectionID: collectionID,
                                                                leadID: leadID,
                                                                refundAmount: prAmount,
                                                                refundDate: refundDate,
                                                                utrNo: utrNo,
                                                                changeStatus: status,
                                                                uid: userID,
                                                                remark: remark,
                                                                refundApproved: userID,
                                                                refundApprovedDate: currentDate,
                                                                credatedDate: currentDate
                                                            })
                                                        ];
                                                    case 1:
                                                        _state.sent();
                                                        return [
                                                            4,
                                                            trx('collection').insert({
                                                                customerID: collectionData.customerID,
                                                                leadID: collectionData.leadID,
                                                                loanNo: collectionData.loanNo,
                                                                collectedAmount: prAmount,
                                                                collectedMode: collectionData.collectedMode,
                                                                collectedDate: refundDate,
                                                                referenceNo: "".concat(collectionData.referenceNo, "_refundAmount"),
                                                                status: status,
                                                                remark: remark,
                                                                collectedBy: userID,
                                                                collectionStatus: CollectionStatus.APPROVED_REFUNDED,
                                                                approvedDate: currentDate,
                                                                orderID: "".concat(collectionData.orderID, "_refundAmount"),
                                                                refund_utr_no: utrNo
                                                            })
                                                        ];
                                                    case 2:
                                                        _state.sent();
                                                        return [
                                                            4,
                                                            trx('leads').where({
                                                                leadID: leadID
                                                            }).update({
                                                                status: status
                                                            })
                                                        ];
                                                    case 3:
                                                        _state.sent();
                                                        return [
                                                            4,
                                                            trx('callhistoryLogs').insert({
                                                                customerID: collectionData.customerID,
                                                                leadID: collectionData.leadID,
                                                                callType: CallType.IVR,
                                                                status: status,
                                                                remark: remark,
                                                                noteli: remark,
                                                                callbackTime: currentDate,
                                                                calledBy: userID,
                                                                createdDate: currentDate,
                                                                appAmount: ''
                                                            })
                                                        ];
                                                    case 4:
                                                        _state.sent();
                                                        return [
                                                            2
                                                        ];
                                                }
                                            });
                                        })();
                                    })
                                ];
                            case 3:
                                _state.sent();
                                return [
                                    2,
                                    this.serviceResponse(HttpStatusCode.Ok, {}, 'Refund added successfully')
                                ];
                            case 4:
                                error = _state.sent();
                                return [
                                    2,
                                    this.serviceResponse(HttpStatusCode.InternalServerError, {}, error)
                                ];
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
            key: "checkPennyDrop",
            value: function checkPennyDrop(payload) {
                return _async_to_generator(function() {
                    var _ref, _payload_noteli, _ref1, _payload_remark, _customerDetails_, _customerDetails_1, _customerDetails_2, _validateFundAccountResp_data_results, _validateFundAccountResp_data, _validateFundAccountResp_data_results1, _validateFundAccountResp_data1, accountDetails, remark, data, pennyDropData, customerDetails, uniqueReference, referenceName, pennyIdDummy, createContactPayload, contactResp, createFundAccountPayload, createFundAccountResp, fundAccountValidationPayload, validateFundAccountResp, pennyId;
                    return _ts_generator(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                return [
                                    4,
                                    razorpayMandateModel.findOne({
                                        where: {
                                            accountNo: payload.accountNo
                                        },
                                        whereNotNull: [
                                            'emMaxamount'
                                        ],
                                        whereIn: [
                                            {
                                                column: 'status',
                                                value: [
                                                    'paid',
                                                    'Paid',
                                                    'PAID'
                                                ]
                                            }
                                        ],
                                        order: [
                                            {
                                                column: 'id',
                                                order: 'desc'
                                            }
                                        ]
                                    })
                                ];
                            case 1:
                                accountDetails = _state.sent();
                                if (!accountDetails) {
                                    throw new NotFoundError('Account Details Not Found');
                                }
                                remark = (_ref = accountDetails === null || accountDetails === void 0 ? void 0 : accountDetails.accountNo) !== null && _ref !== void 0 ? _ref : 0;
                                data = {
                                    customerID: +accountDetails.customerID,
                                    leadID: payload.leadID,
                                    callType: 'IVR',
                                    status: 'Pennydrop Acc. Validation',
                                    appAmount: '',
                                    noteli: (_payload_noteli = payload.noteli) !== null && _payload_noteli !== void 0 ? _payload_noteli : '',
                                    remark: String((_ref1 = (_payload_remark = payload.remark) !== null && _payload_remark !== void 0 ? _payload_remark : accountDetails.accountNo) !== null && _ref1 !== void 0 ? _ref1 : '0'),
                                    callbackTime: moment().format('YYYY-MM-DD'),
                                    calledBy: payload.userID,
                                    createdDate: moment().format('YYYY-MM-DD HH:mm:ss')
                                };
                                return [
                                    4,
                                    callHistoryLogsModel.insert(data)
                                ];
                            case 2:
                                _state.sent();
                                return [
                                    4,
                                    pennyDropModel.findOne({
                                        where: {
                                            customerID: +(accountDetails === null || accountDetails === void 0 ? void 0 : accountDetails.customerID),
                                            account_number: accountDetails.accountNo,
                                            account_status: 'active',
                                            penny_status: 'completed'
                                        },
                                        whereNot: {
                                            registered_name: ''
                                        },
                                        whereNotNull: [
                                            'registered_name'
                                        ],
                                        order: [
                                            {
                                                column: 'id',
                                                order: 'desc'
                                            }
                                        ]
                                    })
                                ];
                            case 3:
                                pennyDropData = _state.sent();
                                if (pennyDropData) {
                                    return [
                                        2,
                                        this.serviceResponse(200, {}, 'Penny drop on this account has been already done.')
                                    ];
                                }
                                return [
                                    4,
                                    customerModel.find({
                                        where: {
                                            customerID: +(accountDetails === null || accountDetails === void 0 ? void 0 : accountDetails.customerID)
                                        }
                                    })
                                ];
                            case 4:
                                customerDetails = _state.sent();
                                uniqueReference = "".concat(customerDetails[0].name, "-").concat(payload.leadID, "-").concat(Math.floor(Math.random() * (9999 - 1111 + 1)) + 1111);
                                referenceName = ((_customerDetails_ = customerDetails[0]) === null || _customerDetails_ === void 0 ? void 0 : _customerDetails_.name) + '-' + ((_customerDetails_1 = customerDetails[0]) === null || _customerDetails_1 === void 0 ? void 0 : _customerDetails_1.mobile);
                                if (!(config.nodeEnv !== 'production')) return [
                                    3,
                                    7
                                ];
                                return [
                                    4,
                                    this.pennyDropModel.insert({
                                        account_number: accountDetails.accountNo,
                                        bank_name: accountDetails.bank,
                                        customerID: +(accountDetails === null || accountDetails === void 0 ? void 0 : accountDetails.customerID),
                                        ifsc: accountDetails.ifsc,
                                        leadID: String(payload.leadID),
                                        logs: JSON.stringify({
                                            bypass: true
                                        }),
                                        name: customerDetails[0].name,
                                        p_id: generatePennyDropId(),
                                        penny_status: 'completed',
                                        uid: config.defaultUserId,
                                        account_status: 'active',
                                        registered_name: customerDetails[0].name,
                                        penny_type: PennyDropType.RAZORPAY
                                    })
                                ];
                            case 5:
                                pennyIdDummy = _state.sent();
                                return [
                                    4,
                                    this.stepTrackerModel.completeStep(+(accountDetails === null || accountDetails === void 0 ? void 0 : accountDetails.customerID), StepName.PENNY_DROP, Products.PAYDAY, payload.leadID)
                                ];
                            case 6:
                                _state.sent();
                                return [
                                    2,
                                    this.serviceResponse(200, {
                                        pennyStatus: 'completed',
                                        metaData: {
                                            pennyDropId: pennyIdDummy[0]
                                        }
                                    }, 'Your Bank Details have been verified')
                                ];
                            case 7:
                                createContactPayload = {
                                    name: customerDetails[0].name,
                                    email: customerDetails[0].email,
                                    contact: customerDetails[0].mobile,
                                    type: RazorPayContactType.CUSTOMER,
                                    reference_id: referenceName.substring(0, 39),
                                    notes: {
                                        notes_key_1: uniqueReference,
                                        notes_key_2: uniqueReference
                                    }
                                };
                                return [
                                    4,
                                    this.razorPayPayments.createContact(+(accountDetails === null || accountDetails === void 0 ? void 0 : accountDetails.customerID), payload.leadID, createContactPayload)
                                ];
                            case 8:
                                contactResp = _state.sent();
                                if (!contactResp.success) {
                                    logger.error('Error in RazorPay Contacts API');
                                    throw new BadRequestError('An Issue occured in initializing the bank verification process', {
                                        data: {
                                            pennyStatus: PennyStatus.INCOMPLETE,
                                            metaData: {
                                                pennyDropId: null
                                            }
                                        }
                                    });
                                }
                                createFundAccountPayload = {
                                    contact_id: contactResp.data.id,
                                    account_type: 'bank_account',
                                    bank_account: {
                                        name: customerDetails[0].name,
                                        ifsc: accountDetails.ifsc,
                                        account_number: accountDetails.accountNo
                                    }
                                };
                                return [
                                    4,
                                    this.razorPayPayments.createFundAccount(+(accountDetails === null || accountDetails === void 0 ? void 0 : accountDetails.customerID), Number(payload === null || payload === void 0 ? void 0 : payload.leadID), createFundAccountPayload)
                                ];
                            case 9:
                                createFundAccountResp = _state.sent();
                                if (!createFundAccountResp.success) {
                                    logger.error('Error in RazorPay Fund Account API');
                                    throw new BadRequestError('An Issue occured initializing the bank verification process', {
                                        data: {
                                            pennyStatus: PennyStatus.INCOMPLETE,
                                            metaData: {
                                                pennyDropId: null
                                            }
                                        }
                                    });
                                }
                                fundAccountValidationPayload = {
                                    account_number: config.defaultAccountNo,
                                    fund_account: {
                                        id: createFundAccountResp.data.id
                                    },
                                    amount: 100,
                                    currency: 'INR',
                                    notes: {
                                        random_key_1: customerDetails[0].name,
                                        random_key_2: 'Payouts Account Validation'
                                    }
                                };
                                return [
                                    4,
                                    this.razorPayPayments.validateAccount(+(accountDetails === null || accountDetails === void 0 ? void 0 : accountDetails.customerID), Number(payload === null || payload === void 0 ? void 0 : payload.leadID), fundAccountValidationPayload)
                                ];
                            case 10:
                                validateFundAccountResp = _state.sent();
                                if (!validateFundAccountResp.success) {
                                    logger.error('Error in RazorPay Validate Account API');
                                    throw new BadRequestError('An Issue occured initializing the bank verification process', {
                                        data: {
                                            pennyStatus: PennyStatus.INCOMPLETE,
                                            metaData: {
                                                pennyDropId: null
                                            }
                                        }
                                    });
                                }
                                return [
                                    4,
                                    this.pennyDropModel.insert({
                                        account_number: accountDetails.accountNo,
                                        bank_name: accountDetails.bank,
                                        customerID: +accountDetails.customerID,
                                        ifsc: accountDetails.ifsc,
                                        leadID: String(payload.leadID),
                                        logs: JSON.stringify(validateFundAccountResp.data),
                                        name: (_customerDetails_2 = customerDetails[0]) === null || _customerDetails_2 === void 0 ? void 0 : _customerDetails_2.name,
                                        p_id: validateFundAccountResp.data.id,
                                        penny_status: validateFundAccountResp.data.status,
                                        uid: config.defaultUserId,
                                        account_status: (_validateFundAccountResp_data = validateFundAccountResp.data) === null || _validateFundAccountResp_data === void 0 ? void 0 : (_validateFundAccountResp_data_results = _validateFundAccountResp_data.results) === null || _validateFundAccountResp_data_results === void 0 ? void 0 : _validateFundAccountResp_data_results.account_status,
                                        registered_name: (_validateFundAccountResp_data1 = validateFundAccountResp.data) === null || _validateFundAccountResp_data1 === void 0 ? void 0 : (_validateFundAccountResp_data_results1 = _validateFundAccountResp_data1.results) === null || _validateFundAccountResp_data_results1 === void 0 ? void 0 : _validateFundAccountResp_data_results1.registered_name,
                                        penny_type: PennyDropType.RAZORPAY
                                    })
                                ];
                            case 11:
                                pennyId = _state.sent();
                                if (validateFundAccountResp.data.status === RazorPayValidateStatus.FAILED) {
                                    logger.error('RazorPay Validate Account API sent status of FAILED');
                                    throw new BadRequestError('Failed to validate your bank details, Please try again in a few minutes', {
                                        data: {
                                            pennyStatus: PennyStatus.FAILED,
                                            metaData: {
                                                pennyDropId: pennyId[0]
                                            }
                                        }
                                    });
                                }
                                return [
                                    2,
                                    this.serviceResponse(200, {}, 'Credit details retreived successfully.')
                                ];
                        }
                    });
                }).call(this);
            }
        },
        {
            key: "check_repayment_amount",
            value: function check_repayment_amount(leadID) {
                var collectedDate = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : null;
                return _async_to_generator(function() {
                    var dpd_Intrest, dpd_days, remainingDays, total_amount, sanction_intrest, delay_intrest, collectionAmount, DataCode, now, curr_date, db, data, re_pay_date, datediff2, disbursalDate, tenure, collection, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, col, delay_tenure, delay_tenure1, Remanning_Amount;
                    return _ts_generator(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                dpd_Intrest = 1.25;
                                dpd_days = 0;
                                remainingDays = 0;
                                total_amount = 0;
                                sanction_intrest = 0;
                                delay_intrest = 0;
                                collectionAmount = 0;
                                DataCode = {
                                    Total_Payable_Amount: 0,
                                    Remanning_Amount: 0,
                                    RepayDate: '0000-00-00'
                                };
                                now = moment().format('YYYY-MM-DD'); // Current date in 'YYYY-MM-DD' format
                                curr_date = collectedDate || now;
                                db = getKnexInstance();
                                return [
                                    4,
                                    db('leads').select('leads.*', 'customer.*', 'approval.*', 'loan.*').join('customer', 'leads.customerID', 'customer.customerID').join('approval', 'leads.leadID', 'approval.leadID').join('loan', 'leads.leadID', 'loan.leadID').where('leads.leadID', leadID).whereIn('leads.status', [
                                        'Disbursed',
                                        'Part Payment'
                                    ]).first() // Fetch only the first record
                                ];
                            case 1:
                                data = _state.sent();
                                if (!data) return [
                                    3,
                                    3
                                ];
                                re_pay_date = moment(data.repayDate).format('YYYY-MM-DD');
                                datediff2 = moment(re_pay_date).diff(moment(now), 'days');
                                if (datediff2 > 0) {
                                    remainingDays = datediff2;
                                    dpd_days = 0;
                                } else {
                                    remainingDays = 0;
                                    dpd_days = Math.abs(datediff2);
                                }
                                disbursalDate = moment(data.disbursalDate).format('YYYY-MM-DD');
                                if (moment(curr_date).isAfter(moment(re_pay_date))) {
                                    tenure = moment(re_pay_date).diff(moment(disbursalDate), 'days');
                                } else {
                                    tenure = moment(now).diff(moment(disbursalDate), 'days');
                                }
                                sanction_intrest = data.disbursalAmount * (data.roi / 100) * tenure;
                                return [
                                    4,
                                    db('collection').select('collectionID', 'collectedAmount', 'status').where('customerID', data.customerID).where('leadID', data.leadID).where('loanNo', data.loanNo).where('status', 'Part Payment').where('collectionStatus', 'Approved').orderBy('collectionID', 'desc')
                                ];
                            case 2:
                                collection = _state.sent();
                                if (collection.length > 0) {
                                    _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
                                    try {
                                        for(_iterator = collection[Symbol.iterator](); !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true){
                                            col = _step.value;
                                            collectionAmount += col.collectedAmount;
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
                                    if (moment(curr_date).isAfter(moment(data.repayDate))) {
                                        delay_tenure = moment(curr_date).diff(moment(data.repayDate), 'days');
                                        dpd_days = delay_tenure;
                                        delay_intrest = data.disbursalAmount * (dpd_Intrest / 100) * dpd_days;
                                    }
                                } else {
                                    if (moment(curr_date).isAfter(moment(data.repayDate))) {
                                        delay_tenure1 = moment(curr_date).diff(moment(data.repayDate), 'days');
                                        dpd_days = delay_tenure1;
                                        delay_intrest = data.disbursalAmount * (dpd_Intrest / 100) * dpd_days;
                                    }
                                }
                                total_amount = data.disbursalAmount + sanction_intrest + delay_intrest;
                                Remanning_Amount = total_amount - collectionAmount;
                                DataCode.Total_Payable_Amount = Math.round(total_amount * 100) / 100; // Round to 2 decimal places
                                DataCode.Remanning_Amount = Math.round(Remanning_Amount * 100) / 100; // Round to 2 decimal places
                                DataCode.RepayDate = data.repayDate;
                                _state.label = 3;
                            case 3:
                                return [
                                    2,
                                    DataCode
                                ];
                        }
                    });
                })();
            }
        }
    ]);
    return LeadService;
}(ResponseService);
export var leadService = new LeadService();

//# sourceMappingURL=lead.service.js.map