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
function _instanceof(left, right) {
    "@swc/helpers - instanceof";
    if (right != null && typeof Symbol !== "undefined" && right[Symbol.hasInstance]) {
        return !!right[Symbol.hasInstance](left);
    } else {
        return left instanceof right;
    }
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
function _type_of(obj) {
    "@swc/helpers - typeof";
    return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol ? "symbol" : typeof obj;
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
import { CreditStatus } from '@/enums/credit.enum';
import axios, { HttpStatusCode } from 'axios';
import csvParser from 'csv-parser';
import { differenceInCalendarDays, format } from 'date-fns';
import fs from 'fs';
import path from 'path';
import { Readable } from 'stream';
import { promisify } from 'util';
import { v4 as uuidv4 } from 'uuid';
import { approvalModel } from '../database/mysql/approval';
import { callHistoryLogsModel } from '../database/mysql/callhistorylogs';
import { customerModel } from '../database/mysql/customer';
import { customerAccountModel } from '../database/mysql/customerAccount';
import EmiModel from '../database/mysql/emi';
import { ProductID } from '../enums/emi.enum';
import { LeadStatus } from '../enums/lead.enum';
import { BadRequestError, NotFoundError } from '../errors';
import CommonHelper from '../helpers/common';
import EMIHelper from '../helpers/emi.helpers';
import { projectionService } from '../services/projection.service';
import { checkUploadTimeIST, compareDates, dateCheck } from '../utils/dateTimeFunction';
import { calculateTotalRepayPaydayAmountIPC, calculateTotalRepayPaydayAmountNonIPC } from '../utils/ipcCalculation';
import { getKnexInstance } from '../utils/mysql';
import RazorpayPG from '../utils/razorpayClient.utils';
import CallHistoryLogService from './callhistorylog.service';
import CollectionService from './collection.service';
import CreditService from './credit.service';
import { EmiService } from './emi.service';
import { loanService } from './loan.service';
import OtherChargesService from './otherCharges.service';
import ResponseService from './response.service';
import S3Service from './thirdParty/s3.service';
import TransactionService from './transaction.service';
var CrmService = /*#__PURE__*/ function(ResponseService) {
    "use strict";
    _inherits(CrmService, ResponseService);
    function CrmService() {
        _class_call_check(this, CrmService);
        var _this;
        var _this1;
        _this = _call_super(this, CrmService), _this1 = _this, _define_property(_this, "leadService", void 0), _define_property(_this, "emiHelper", new EMIHelper()), _define_property(_this, "creditService", new CreditService()), _define_property(_this, "emiModel", new EmiModel()), _define_property(_this, "emiService", new EmiService()), _define_property(_this, "transactionService", new TransactionService()), _define_property(_this, "collectionService", new CollectionService()), _define_property(_this, "callHistoryLogService", new CallHistoryLogService()), _define_property(_this, "otherChargesService", new OtherChargesService()), _define_property(_this, "s3Service", new S3Service()), _define_property(_this, "razorpayPg", new RazorpayPG()), _define_property(_this, "projectionService", projectionService), _define_property(_this, "customerAccountModel", customerAccountModel), _define_property(_this, "approvalModel", approvalModel), _define_property(_this, "callHistoryLogsModel", callHistoryLogsModel), _define_property(_this, "customerModel", customerModel), _define_property(_this, "validateCSVHeaders", function(header) {
            var pattern = /[^a-zA-Z0-9\s]/g // Remove special characters
            ;
            var loanHeader = header[0] ? header[0].replace(pattern, '') : 'column1';
            var amountHeader = header[1] ? header[1].replace(pattern, '') : 'column2';
            return header.length === 2 && loanHeader.trim() === 'loanNo' && amountHeader.trim() === 'amount';
        }), _define_property(_this, "writeFile", promisify(fs.writeFile)), _define_property(_this, "unlinkFile", promisify(fs.unlink)), _define_property(_this, "processChunk", function(chunk, trx, uploadedTrack, userID, fileName, csvlink) {
            return _async_to_generator(function() {
                var db, phoneNumbers, loanData, loanMap, insertBatch, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, row, _ref, leadID, customerID, err, fileLogData, error;
                return _ts_generator(this, function(_state) {
                    switch(_state.label){
                        case 0:
                            db = getKnexInstance();
                            phoneNumbers = chunk.map(function(row) {
                                return row.mobile;
                            }).filter(Boolean);
                            _state.label = 1;
                        case 1:
                            _state.trys.push([
                                1,
                                16,
                                ,
                                17
                            ]);
                            return [
                                4,
                                trx('customer').whereIn('mobile', phoneNumbers).join('leads', 'customer.customerID', '=', 'leads.customerID').where('leads.status', 'Approved Process').select('customer.mobile', 'leads.leadID', 'leads.customerID').orderBy('leads.leadID', 'desc')
                            ];
                        case 2:
                            loanData = _state.sent();
                            loanMap = loanData.reduce(function(acc, param) {
                                var mobile = param.mobile, leadID = param.leadID, customerID = param.customerID;
                                acc[mobile] = {
                                    leadID: leadID,
                                    customerID: customerID
                                };
                                return acc;
                            }, {});
                            insertBatch = [];
                            _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
                            _state.label = 3;
                        case 3:
                            _state.trys.push([
                                3,
                                10,
                                11,
                                12
                            ]);
                            _iterator = chunk[Symbol.iterator]();
                            _state.label = 4;
                        case 4:
                            if (!!(_iteratorNormalCompletion = (_step = _iterator.next()).done)) return [
                                3,
                                9
                            ];
                            row = _step.value;
                            //const leadID = loanMap[row.mobile] || null
                            _ref = loanMap[row.mobile] || {}, leadID = _ref.leadID, customerID = _ref.customerID;
                            if (!!leadID) return [
                                3,
                                5
                            ];
                            insertBatch.push({
                                leadID: null,
                                fileId: uploadedTrack,
                                status: 'failed',
                                mobile: row.mobile,
                                disposition: row.disposition ? row.disposition : ''
                            });
                            return [
                                3,
                                8
                            ];
                        case 5:
                            return [
                                4,
                                _this1.leadService.updateOne({
                                    leadID: leadID
                                }, {
                                    status: LeadStatus.NOT_REQUIRED,
                                    sanctionalloUID: userID
                                })
                            ];
                        case 6:
                            _state.sent();
                            _this1.approvalModel.findOneAndUpdateApproval({
                                leadID: leadID
                            }, {
                                status: LeadStatus.NOT_REQUIRED,
                                rejectionReason: 'Not Required Now',
                                remark: 'Not Required'
                            });
                            return [
                                4,
                                _this1.callHistoryLogsModel.insert({
                                    customerID: customerID,
                                    leadID: leadID,
                                    callType: 'IVR',
                                    status: LeadStatus.NOT_REQUIRED,
                                    remark: 'Not Required',
                                    noteli: '',
                                    calledBy: userID,
                                    appAmount: '',
                                    callbackTime: new Date()
                                })
                            ];
                        case 7:
                            _state.sent();
                            insertBatch.push({
                                leadID: leadID,
                                fileId: uploadedTrack,
                                status: 'success',
                                mobile: row.mobile,
                                disposition: row.disposition
                            });
                            _state.label = 8;
                        case 8:
                            _iteratorNormalCompletion = true;
                            return [
                                3,
                                4
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
                            fileLogData = {
                                fileName: fileName,
                                userID: userID,
                                filelink: csvlink,
                                fileId: uploadedTrack
                            };
                            if (!(insertBatch.length > 0)) return [
                                3,
                                15
                            ];
                            return [
                                4,
                                db('not_required_leads_filelog').insert(fileLogData)
                            ];
                        case 13:
                            _state.sent();
                            return [
                                4,
                                db('not_required_leads').insert(insertBatch)
                            ];
                        case 14:
                            _state.sent();
                            _state.label = 15;
                        case 15:
                            return [
                                3,
                                17
                            ];
                        case 16:
                            error = _state.sent();
                            console.error('Error processing chunk:', error);
                            throw new BadRequestError('Failed to process the chunk');
                        case 17:
                            return [
                                2
                            ];
                    }
                });
            })();
        });
        _this.getLeadService();
        return _this;
    }
    _create_class(CrmService, [
        {
            key: "getLeadService",
            value: function getLeadService() {
                return _async_to_generator(function() {
                    var leadService;
                    return _ts_generator(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                return [
                                    4,
                                    import('../services/lead.service')
                                ];
                            case 1:
                                leadService = _state.sent().leadService;
                                this.leadService = leadService;
                                return [
                                    2
                                ];
                        }
                    });
                }).call(this);
            }
        },
        {
            key: "leadUpdate",
            value: // New code
            function leadUpdate(payload) {
                return _async_to_generator(function() {
                    var leadID, lead;
                    return _ts_generator(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                leadID = payload.leadID;
                                return [
                                    4,
                                    this.leadService.findOne({
                                        leadID: leadID
                                    }, [
                                        '*'
                                    ])
                                ];
                            case 1:
                                lead = _state.sent();
                                if (!lead) throw new NotFoundError('No Lead Found');
                                if (lead.status == LeadStatus.FRESH_LEAD) throw new BadRequestError('Emi Loan Is Only For Repeted Users For Now');
                                return [
                                    4,
                                    this.leadService.updateOne({
                                        leadID: leadID
                                    }, {
                                        productID: 1
                                    })
                                ];
                            case 2:
                                _state.sent();
                                return [
                                    2,
                                    this.serviceResponse(200, {}, 'Lead Updates To Product Type: EMI')
                                ];
                        }
                    });
                }).call(this);
            }
        },
        {
            key: "emiCalculator",
            value: // New code
            function emiCalculator(payload) {
                return _async_to_generator(function() {
                    var loanAmount, roi, tenure, emiDoc;
                    return _ts_generator(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                loanAmount = payload.loanAmount, roi = payload.roi, tenure = payload.tenure;
                                return [
                                    4,
                                    this.emiHelper.emiGenerator(loanAmount, roi, tenure)
                                ];
                            case 1:
                                emiDoc = _state.sent();
                                return [
                                    2,
                                    this.serviceResponse(200, emiDoc, 'Here Is The Proposed EMI Breakdown')
                                ];
                        }
                    });
                }).call(this);
            }
        },
        {
            key: "creditDetails",
            value: // New code
            function creditDetails(payload) {
                return _async_to_generator(function() {
                    var adminFee, aqb, branch, customer_id, firstDueDate, foir, lead_id, loanAmtApproved, roi, tenure, customerID, leadID, loanAmount, processingFee, credit, lead, days;
                    return _ts_generator(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                adminFee = payload.adminFee, aqb = payload.aqb, branch = payload.branch, customer_id = payload.customer_id, firstDueDate = payload.firstDueDate, foir = payload.foir, lead_id = payload.lead_id, loanAmtApproved = payload.loanAmtApproved, roi = payload.roi, tenure = payload.tenure;
                                customerID = customer_id;
                                leadID = lead_id;
                                loanAmount = loanAmtApproved;
                                processingFee = adminFee;
                                return [
                                    4,
                                    this.creditService.findOne({
                                        leadID: leadID,
                                        customerID: customerID
                                    }, [
                                        '*'
                                    ])
                                ];
                            case 1:
                                credit = _state.sent();
                                if (credit) throw new BadRequestError('Credit with this lead already exist');
                                return [
                                    4,
                                    this.leadService.findOne({
                                        leadID: leadID,
                                        productID: 1,
                                        customerID: customerID
                                    }, [
                                        '*'
                                    ])
                                ];
                            case 2:
                                lead = _state.sent();
                                if (!lead) throw new BadRequestError('Lead Not Found of EMI Type');
                                // roi check
                                if (roi < 12 && roi > 60) throw new BadRequestError('Rate Of Intrest Can only be in Between 12% - 60%');
                                //tenure check
                                if (tenure < 3 && tenure > 12) throw new BadRequestError('Allowed Tenure: 3 months to 12 months');
                                days = dateCheck(firstDueDate);
                                if (days > 50) {
                                    throw new BadRequestError('Invalid Date: Should Be Less Then 50 Days From Now');
                                } else if (days < 30) {
                                    throw new BadRequestError('Invalid Date: Should Be Greater Then 30 Days From Now');
                                }
                                return [
                                    4,
                                    this.creditService.create(customerID, leadID, 1, foir, aqb, branch, roi, tenure, processingFee, loanAmount, new Date(firstDueDate))
                                ];
                            case 3:
                                _state.sent();
                                return [
                                    2,
                                    this.serviceResponse(200, {}, 'Credit Details Recorded')
                                ];
                        }
                    });
                }).call(this);
            }
        },
        {
            key: "getAmountToDisbursed",
            value: // New code
            function getAmountToDisbursed(payload) {
                return _async_to_generator(function() {
                    var creditID, credit, amount, brokenPeriodIntrest;
                    return _ts_generator(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                creditID = payload.creditID;
                                return [
                                    4,
                                    this.creditService.findOne({
                                        creditID: creditID
                                    }, [
                                        '*'
                                    ])
                                ];
                            case 1:
                                credit = _state.sent();
                                if (!credit) throw new NotFoundError('Credit not found');
                                amount = credit.principal - credit.processingFee;
                                return [
                                    4,
                                    this.emiHelper.bpiCalculator(credit.principal, credit.roi, credit.firstDueDate)
                                ];
                            case 2:
                                brokenPeriodIntrest = _state.sent();
                                amount = amount - brokenPeriodIntrest;
                                return [
                                    4,
                                    this.creditService.updateOne({
                                        creditID: creditID
                                    }, {
                                        brokenPeriodIntrest: brokenPeriodIntrest
                                    })
                                ];
                            case 3:
                                _state.sent();
                                return [
                                    2,
                                    this.serviceResponse(200, {
                                        amount: amount
                                    }, 'Amount to be disbursed')
                                ];
                        }
                    });
                }).call(this);
            }
        },
        {
            key: "generateEMI",
            value: // New code
            function generateEMI(payload) {
                return _async_to_generator(function() {
                    var creditID, createdBy, gateway, loanNo, mode, order_id, referanceId, updatedBy, credit, emi, emiDoc, openingBalance, dueDate, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, emi1, err, emis;
                    return _ts_generator(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                creditID = payload.creditID, createdBy = payload.createdBy, gateway = payload.gateway, loanNo = payload.loanNo, mode = payload.mode, order_id = payload.order_id, referanceId = payload.referanceId, updatedBy = payload.updatedBy;
                                return [
                                    4,
                                    this.creditService.findOne({
                                        creditID: creditID
                                    })
                                ];
                            case 1:
                                credit = _state.sent();
                                if (!credit) throw new NotFoundError('Credit not found');
                                return [
                                    4,
                                    this.emiModel.findAll({
                                        creditID: creditID
                                    }, [
                                        {
                                            column: 'emiID',
                                            order: 'desc'
                                        }
                                    ], [
                                        'creditID',
                                        'emiID'
                                    ])
                                ];
                            case 2:
                                emi = _state.sent();
                                if (emi.length > 0) throw new BadRequestError('EMIs Already Exists');
                                return [
                                    4,
                                    this.emiHelper.emiGenerator(credit.principal, credit.roi, credit.tenure)
                                ];
                            case 3:
                                emiDoc = _state.sent();
                                if (!emiDoc) throw new BadRequestError('Error In Generating EMI');
                                openingBalance = emiDoc.amount;
                                dueDate = credit.firstDueDate;
                                _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
                                _state.label = 4;
                            case 4:
                                _state.trys.push([
                                    4,
                                    9,
                                    10,
                                    11
                                ]);
                                _iterator = (emiDoc === null || emiDoc === void 0 ? void 0 : emiDoc.emiBreakdown)[Symbol.iterator]();
                                _state.label = 5;
                            case 5:
                                if (!!(_iteratorNormalCompletion = (_step = _iterator.next()).done)) return [
                                    3,
                                    8
                                ];
                                emi1 = _step.value;
                                // create emi documents
                                return [
                                    4,
                                    this.emiService.createEMI(credit.creditID, credit.customerID, credit.leadID, credit.productID, emi1.principal, emi1.interest, openingBalance, emi1.remainingPrincipal, emi1.month, credit.roi, credit.firstDueDate)
                                ];
                            case 6:
                                _state.sent();
                                openingBalance = emi1.remainingPrincipal;
                                dueDate.setMonth(dueDate.getMonth() + 1);
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
                                return [
                                    4,
                                    this.emiModel.findAll({
                                        creditID: creditID
                                    }, [
                                        {
                                            column: 'emiID',
                                            order: 'asc'
                                        }
                                    ], [
                                        '*'
                                    ])
                                ];
                            case 12:
                                emis = _state.sent();
                                //UPDATE Credit Status To Disbursed
                                return [
                                    4,
                                    this.creditService.updateOne({
                                        creditID: creditID
                                    }, {
                                        status: CreditStatus.DISBURSED
                                    })
                                ];
                            case 13:
                                _state.sent();
                                //INSERT Transection
                                return [
                                    4,
                                    this.transactionService.create(credit.customerID, credit.leadID, loanNo, 100, CreditStatus.DISBURSED, mode, referanceId, order_id, 0, gateway, new Date(Date.now()), new Date(Date.now()), createdBy, updatedBy, credit.principal)
                                ];
                            case 14:
                                _state.sent();
                                return [
                                    2,
                                    this.serviceResponse(200, emis, 'EMI Generated')
                                ];
                        }
                    });
                }).call(this);
            }
        },
        {
            key: "updatePayment",
            value: // New code
            function updatePayment(payload) {
                return _async_to_generator(function() {
                    var creditID, amount, gateway, method, credit, lastEmi, loan, emis, amountRemains, payingEmiCount, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, emi, delayDays, updateemi, err, emiRemains, updateCredit, lead;
                    return _ts_generator(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                creditID = payload.creditID, amount = payload.amount, gateway = payload.gateway, method = payload.method;
                                return [
                                    4,
                                    this.creditService.findOne({
                                        creditID: creditID
                                    }, [
                                        '*'
                                    ])
                                ];
                            case 1:
                                credit = _state.sent();
                                if (amount > credit.amountToBeRepayed) throw new BadRequestError('Amount Should Be Less Then Outstanding');
                                return [
                                    4,
                                    this.emiService.findOne({
                                        creditID: creditID
                                    }, [
                                        '*'
                                    ])
                                ];
                            case 2:
                                lastEmi = _state.sent();
                                return [
                                    4,
                                    loanService.findOne({
                                        leadID: credit.leadID
                                    }, [
                                        'loanNo'
                                    ])
                                ];
                            case 3:
                                loan = _state.sent();
                                return [
                                    4,
                                    this.emiService.find(function(knex) {
                                        return knex.where(function() {
                                            this.where('status', 'partial-paid').orWhere('status', 'due');
                                        }).andWhere('creditID', creditID);
                                    }, [
                                        {
                                            column: 'emiID',
                                            order: 'desc'
                                        }
                                    ], [
                                        '*'
                                    ])
                                ];
                            case 4:
                                emis = _state.sent();
                                amountRemains = amount;
                                payingEmiCount = 0;
                                if (!emis) return [
                                    3,
                                    44
                                ];
                                _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
                                _state.label = 5;
                            case 5:
                                _state.trys.push([
                                    5,
                                    36,
                                    37,
                                    38
                                ]);
                                _iterator = emis[Symbol.iterator]();
                                _state.label = 6;
                            case 6:
                                if (!!(_iteratorNormalCompletion = (_step = _iterator.next()).done)) return [
                                    3,
                                    35
                                ];
                                emi = _step.value;
                                delayDays = Math.floor(new Date(Date.now()).getTime() - new Date(emi.dueDate).getTime()) / (1000 * 60 * 60 * 24);
                                if (!(amountRemains > emi.amountRemains)) return [
                                    3,
                                    14
                                ];
                                return [
                                    4,
                                    this.emiService.updateOne({
                                        emiID: emi.emiID
                                    }, {
                                        status: 'paid',
                                        actualPaymentDate: new Date(Date.now()),
                                        delayDays: delayDays,
                                        // paymentID: paymentdetails.id,
                                        amountRemains: 0
                                    })
                                ];
                            case 7:
                                _state.sent();
                                if (!(Math.round(emi.amountRemains) > Math.round(emi.panelty || 0))) return [
                                    3,
                                    11
                                ];
                                //INSERT TRANSECTION
                                return [
                                    4,
                                    this.transactionService.create(credit.customerID, credit.leadID, loan.loanNo, 100, 'collection', method, "refid/".concat(emi.emiID), "order_id", 0, 'razorpay', new Date(Date.now()), new Date(Date.now()), 221, 221, Math.round(emi.amountRemains) - Math.round(emi.panelty || 0))
                                ];
                            case 8:
                                _state.sent();
                                if (!(emi.panelty > 0 && emi.paneltyID)) return [
                                    3,
                                    10
                                ];
                                return [
                                    4,
                                    this.transactionService.create(credit.customerID, credit.leadID, loan.loanNo, 100, 'panelty', method, "refid/".concat(emi.paneltyID), "order_id", 0, 'razorpay', new Date(Date.now()), new Date(Date.now()), 221, 221, Math.round(emi.panelty))
                                ];
                            case 9:
                                _state.sent();
                                _state.label = 10;
                            case 10:
                                return [
                                    3,
                                    13
                                ];
                            case 11:
                                if (!(emi.panelty > 0 && emi.paneltyID)) return [
                                    3,
                                    13
                                ];
                                return [
                                    4,
                                    this.transactionService.create(credit.customerID, credit.leadID, loan.loanNo, 100, 'panelty', method, "refid/".concat(emi.paneltyID), "order_id", 0, 'razorpay', new Date(Date.now()), new Date(Date.now()), 221, 221, Math.round(emi.amountRemains))
                                ];
                            case 12:
                                _state.sent();
                                _state.label = 13;
                            case 13:
                                payingEmiCount += 1;
                                return [
                                    3,
                                    30
                                ];
                            case 14:
                                if (!(amountRemains < emi.amountRemains)) return [
                                    3,
                                    22
                                ];
                                return [
                                    4,
                                    this.emiService.updateOne({
                                        emiID: emi.emiID
                                    }, {
                                        status: 'partially-paid',
                                        actualPaymentDate: new Date(Date.now()),
                                        delayDays: delayDays,
                                        // paymentID: paymentdetails.id,
                                        amountRemains: emi.amountRemains - amountRemains
                                    })
                                ];
                            case 15:
                                updateemi = _state.sent();
                                if (!(Math.round(emi.amountRemains) > Math.round(emi.panelty || 0))) return [
                                    3,
                                    19
                                ];
                                //INSERT TRANSECTION
                                return [
                                    4,
                                    this.transactionService.create(credit.customerID, credit.leadID, loan.loanNo, 100, 'collection', method, "refid/".concat(emi.emiID), "order_id", 0, 'razorpay', new Date(Date.now()), new Date(Date.now()), 221, 221, Math.round(emi.amountRemains) - Math.round(emi.panelty || 0))
                                ];
                            case 16:
                                _state.sent();
                                if (!(emi.panelty > 0 && emi.paneltyID)) return [
                                    3,
                                    18
                                ];
                                return [
                                    4,
                                    this.transactionService.create(credit.customerID, credit.leadID, loan.loanNo, 100, 'panelty', method, "refid/".concat(emi.paneltyID), "order_id", 0, 'razorpay', new Date(Date.now()), new Date(Date.now()), 221, 221, Math.round(emi.panelty))
                                ];
                            case 17:
                                _state.sent();
                                _state.label = 18;
                            case 18:
                                return [
                                    3,
                                    21
                                ];
                            case 19:
                                if (!(emi.panelty > 0 && emi.paneltyID)) return [
                                    3,
                                    21
                                ];
                                return [
                                    4,
                                    this.transactionService.create(credit.customerID, credit.leadID, loan.loanNo, 100, 'panelty', method, "refid/".concat(emi.paneltyID), "order_id", 0, 'razorpay', new Date(Date.now()), new Date(Date.now()), 221, 221, Math.round(emi.amountRemains))
                                ];
                            case 20:
                                _state.sent();
                                _state.label = 21;
                            case 21:
                                payingEmiCount += 1;
                                return [
                                    3,
                                    35
                                ];
                            case 22:
                                return [
                                    4,
                                    this.emiService.updateOne({
                                        emiID: emi.emiID
                                    }, {
                                        status: 'paid',
                                        actualPaymentDate: new Date(Date.now()),
                                        delayDays: delayDays,
                                        // paymentID: paymentdetails.id,
                                        amountRemains: 0
                                    })
                                ];
                            case 23:
                                _state.sent();
                                if (!(Math.round(emi.amountRemains) > Math.round(emi.panelty || 0))) return [
                                    3,
                                    27
                                ];
                                //INSERT TRANSECTION
                                return [
                                    4,
                                    this.transactionService.create(credit.customerID, credit.leadID, loan.loanNo, 100, 'collection', method, "refid/".concat(emi.emiID), "order_id", 0, 'razorpay', new Date(Date.now()), new Date(Date.now()), 221, 221, Math.round(emi.amountRemains) - Math.round(emi.panelty || 0))
                                ];
                            case 24:
                                _state.sent();
                                if (!(emi.panelty > 0 && emi.paneltyID)) return [
                                    3,
                                    26
                                ];
                                return [
                                    4,
                                    this.transactionService.create(credit.customerID, credit.leadID, loan.loanNo, 100, 'panelty', method, "refid/".concat(emi.paneltyID), "order_id", 0, 'razorpay', new Date(Date.now()), new Date(Date.now()), 221, 221, Math.round(emi.panelty))
                                ];
                            case 25:
                                _state.sent();
                                _state.label = 26;
                            case 26:
                                return [
                                    3,
                                    29
                                ];
                            case 27:
                                if (!(emi.panelty > 0 && emi.paneltyID)) return [
                                    3,
                                    29
                                ];
                                return [
                                    4,
                                    this.transactionService.create(credit.customerID, credit.leadID, loan.loanNo, 100, 'panelty', method, "refid/".concat(emi.paneltyID), "order_id", 0, 'razorpay', new Date(Date.now()), new Date(Date.now()), 221, 221, Math.round(emi.amountRemains))
                                ];
                            case 28:
                                _state.sent();
                                _state.label = 29;
                            case 29:
                                payingEmiCount += 1;
                                return [
                                    3,
                                    35
                                ];
                            case 30:
                                if (!(payingEmiCount > 1)) return [
                                    3,
                                    32
                                ];
                                return [
                                    4,
                                    this.transactionService.create(credit.customerID, credit.leadID, loan.loanNo, 100, 'collection', method, "REFID/".concat(emi.emiID), 'order_id', 0, gateway, new Date(Date.now()), new Date(Date.now()), 221, 221, amount)
                                ];
                            case 31:
                                _state.sent();
                                _state.label = 32;
                            case 32:
                                return [
                                    4,
                                    this.collectionService.create(credit.customerID, credit.leadID, loan.loanNo, amount, 'Payment Gateway', new Date(Date.now()), 'orderid', // paymentdetails.order_id,
                                    0.0, 0.0, amountRemains >= emi.amountRemains ? 'Closed' : 'Part Payment', 'EMI Manual Paid', 1001, new Date(Date.now()), 'Approved', 'no', 'orderid')
                                ];
                            case 33:
                                _state.sent();
                                _state.label = 34;
                            case 34:
                                _iteratorNormalCompletion = true;
                                return [
                                    3,
                                    6
                                ];
                            case 35:
                                return [
                                    3,
                                    38
                                ];
                            case 36:
                                err = _state.sent();
                                _didIteratorError = true;
                                _iteratorError = err;
                                return [
                                    3,
                                    38
                                ];
                            case 37:
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
                            case 38:
                                return [
                                    4,
                                    this.emiService.countRows(function(query) {
                                        return query.where(function() {
                                            this.where('status', 'partial-paid').orWhere('status', 'due');
                                        }).andWhere('creditID', credit.creditID);
                                    })
                                ];
                            case 39:
                                emiRemains = _state.sent();
                                return [
                                    4,
                                    this.creditService.updateOne({
                                        creditID: creditID
                                    }, {
                                        emiLeft: emiRemains,
                                        paidAmount: credit.paidAmount + amount,
                                        amountToBeRepayed: credit.amountToBeRepayed - amount
                                    })
                                ];
                            case 40:
                                updateCredit = _state.sent();
                                return [
                                    4,
                                    this.leadService.findOne({
                                        leadID: credit.leadID
                                    }, [
                                        'status'
                                    ])
                                ];
                            case 41:
                                lead = _state.sent();
                                return [
                                    4,
                                    this.callHistoryLogService.create(credit.customerID, credit.leadID, 'IVR', lead.status, String(amount), lead.status, 'Manual EMI Payment', new Date(Date.now()), 1001, new Date(Date.now()))
                                ];
                            case 42:
                                _state.sent();
                                return [
                                    4,
                                    CommonHelper.lastEMIUpdater(emiRemains, credit.creditID, lastEmi.dueDate, credit.actualTenure, credit.leadID)
                                ];
                            case 43:
                                _state.sent();
                                _state.label = 44;
                            case 44:
                                return [
                                    2,
                                    this.serviceResponse(200, {}, 'Payment Update')
                                ];
                        }
                    });
                }).call(this);
            }
        },
        {
            key: "applyPanelty",
            value: // New code
            function applyPanelty(payload) {
                return _async_to_generator(function() {
                    var amount, emiID, emi, credit, panelty;
                    return _ts_generator(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                amount = payload.amount, emiID = payload.emiID;
                                return [
                                    4,
                                    this.emiService.findOne(function(knex) {
                                        return knex.where(function() {
                                            this.where('status', 'partial-paid').orWhere('status', 'due');
                                        }).andWhere('emiID', emiID);
                                    }, [
                                        '*'
                                    ])
                                ];
                            case 1:
                                emi = _state.sent();
                                if (!emi) throw new NotFoundError('Emi is Paid Or Wrong EMI Id');
                                //find credit for some calculations
                                if (compareDates(emi.dueDate, Date.now())) throw new BadRequestError('Emi is not Applicable For Paneltys');
                                return [
                                    4,
                                    this.creditService.findOne({
                                        creditID: emi.creditID
                                    }, [
                                        '*'
                                    ])
                                ];
                            case 2:
                                credit = _state.sent();
                                return [
                                    4,
                                    this.otherChargesService.create(emiID, emi.creditID, amount, emi.customerID, 0, 'panelty')
                                ];
                            case 3:
                                panelty = _state.sent();
                                //update emi
                                return [
                                    4,
                                    this.emiService.updateOne({
                                        emiID: emiID
                                    }, {
                                        panelty: emi.panelty || 0 + amount,
                                        amountPayable: emi.amountPayable + amount,
                                        paneltyID: panelty,
                                        amountRemains: emi.amountRemains + amount
                                    })
                                ];
                            case 4:
                                _state.sent();
                                //update credit
                                return [
                                    4,
                                    this.creditService.updateOne({
                                        creditID: emi.creditID
                                    }, {
                                        paneltyEmis: credit.paneltyEmis ? credit.paneltyEmis += 1 : 1,
                                        amountToBeRepayed: credit.amountToBeRepayed + amount
                                    })
                                ];
                            case 5:
                                _state.sent();
                                return [
                                    2,
                                    this.serviceResponse(200, {}, 'Penalty Applied')
                                ];
                        }
                    });
                }).call(this);
            }
        },
        {
            key: "getEmis",
            value: // New code
            function getEmis(payload) {
                return _async_to_generator(function() {
                    var customerID, credit, getEmis;
                    return _ts_generator(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                customerID = payload.customerID;
                                return [
                                    4,
                                    this.creditService.findOne({
                                        customerID: customerID,
                                        status: CreditStatus.DISBURSED
                                    }, [
                                        'creditID'
                                    ])
                                ];
                            case 1:
                                credit = _state.sent();
                                if (!credit) throw new NotFoundError('No Active Emi Loan Found');
                                return [
                                    4,
                                    this.emiService.find({
                                        creditID: credit.creditID
                                    }, [
                                        {
                                            column: 'customerID',
                                            order: 'desc'
                                        }
                                    ], [
                                        'creditID',
                                        'customerID',
                                        'principal',
                                        'interest',
                                        'panelty',
                                        'amountPayable',
                                        'openingBalance',
                                        'closingBalance',
                                        'dueDate',
                                        'status',
                                        'amountRemains'
                                    ])
                                ];
                            case 2:
                                getEmis = _state.sent();
                                return [
                                    2,
                                    this.serviceResponse(200, getEmis, 'Here is the list of all emis')
                                ];
                        }
                    });
                }).call(this);
            }
        },
        {
            key: "getDocsRequirements",
            value: // New code
            function getDocsRequirements(payload) {
                return _async_to_generator(function() {
                    var loanAmount, roi, tenure, creditId, credit, processingFee, principal, firstDueDate, Roi, gst, bpiCharges, netDisbursedAmount, loan, isValidDate, emiDoc, amountToBeRepayed, finalEmiDoc;
                    return _ts_generator(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                loanAmount = payload.loanAmount, roi = payload.roi, tenure = payload.tenure, creditId = payload.creditId;
                                return [
                                    4,
                                    this.creditService.findOne({
                                        creditID: creditId
                                    }, [
                                        'creditID',
                                        'processingFee',
                                        'principal',
                                        'firstDueDate',
                                        'brokenPeriodIntrest',
                                        'roi',
                                        'gst',
                                        'created_at',
                                        'leadID'
                                    ])
                                ];
                            case 1:
                                credit = _state.sent();
                                if (!credit) throw new NotFoundError('No Active Emi Loan Found');
                                processingFee = credit.processingFee;
                                principal = credit.principal;
                                firstDueDate = new Date(format(credit.firstDueDate, 'yyyy-MM-dd'));
                                //let brokenPeriodIntrest = credit.brokenPeriodIntrest
                                Roi = credit.roi;
                                gst = credit.gst;
                                return [
                                    4,
                                    this.emiHelper.bpiCalculator(principal, Roi, firstDueDate)
                                ];
                            case 2:
                                bpiCharges = _state.sent();
                                //let brokenPeriodInterest = bpiCharges
                                netDisbursedAmount = principal - processingFee - gst;
                                return [
                                    4,
                                    loanService.findOne({
                                        leadID: credit.leadID
                                    }, [
                                        'loanNo',
                                        'disbursalDate'
                                    ])
                                ];
                            case 3:
                                loan = _state.sent();
                                isValidDate = function isValidDate(date) {
                                    var parsedDate = typeof date === 'string' ? new Date(date) : date;
                                    return _instanceof(parsedDate, Date) && !isNaN(parsedDate.getTime()) && parsedDate.getFullYear() > 1900;
                                };
                                if (!(!loan || !isValidDate(loan.disbursalDate))) return [
                                    3,
                                    5
                                ];
                                return [
                                    4,
                                    this.emiHelper.emiGenerator(+loanAmount, +roi, +tenure, firstDueDate)
                                ];
                            case 4:
                                emiDoc = _state.sent();
                                return [
                                    3,
                                    7
                                ];
                            case 5:
                                return [
                                    4,
                                    this.emiHelper.emiGenerator(+loanAmount, +roi, +tenure, firstDueDate, loan.disbursalDate)
                                ];
                            case 6:
                                emiDoc = _state.sent();
                                _state.label = 7;
                            case 7:
                                // throw new BadRequestError('Error In Generating EMI[loan not Found]')
                                // let emiDoc = (await this.emiHelper.emiGenerator(
                                //   +loanAmount,
                                //   +roi,
                                //   +tenure,
                                //   firstDueDate,
                                // )) as IEMIDoc
                                amountToBeRepayed = emiDoc.repaymentAmount;
                                return [
                                    4,
                                    this.creditService.updateOne({
                                        creditID: creditId
                                    }, {
                                        // actually when bpiCharges is negative then this is not bpi as discussed with arvindSir
                                        brokenPeriodIntrest: bpiCharges < 0 ? 0 : bpiCharges,
                                        amountToBeRepayed: amountToBeRepayed,
                                        interest: emiDoc.interest
                                    })
                                ];
                            case 8:
                                _state.sent();
                                emiDoc.emiBreakdown.forEach(function(emi, index) {
                                    var dueDate = new Date(firstDueDate);
                                    dueDate.setMonth(dueDate.getMonth() + index);
                                    emi.dueDate = new Date(format(new Date(dueDate), 'yyyy-MM-dd'));
                                    emi['status'] = 'due';
                                });
                                finalEmiDoc = _object_spread_props(_object_spread({}, emiDoc), {
                                    processingFee: processingFee,
                                    firstDueDate: firstDueDate,
                                    brokenPeriodInterest: bpiCharges < 0 ? 0 : bpiCharges,
                                    netDisbursedAmount: netDisbursedAmount,
                                    gst: gst
                                });
                                return [
                                    2,
                                    this.serviceResponse(200, finalEmiDoc, 'Final EMI docs')
                                ];
                        }
                    });
                }).call(this);
            }
        },
        {
            key: "getEmiLoanDetails",
            value: // New code
            function getEmiLoanDetails(payload) {
                return _async_to_generator(function() {
                    var leadID, customerID, lead, credit, db, getEmis, totalPaneltyAmount, totalBouncingAmount, paneltyEmis, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, emi, loanDetails, _iteratorNormalCompletion1, _didIteratorError1, _iteratorError1, _iterator1, _step1, emi1, dueDateSplit, dueDate;
                    return _ts_generator(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                leadID = payload.leadID, customerID = payload.customerID;
                                return [
                                    4,
                                    this.leadService.findOne({
                                        leadID: leadID,
                                        customerID: customerID
                                    }, [
                                        'leadID',
                                        'status'
                                    ])
                                ];
                            case 1:
                                lead = _state.sent();
                                if (!lead) throw new NotFoundError('No lead data found');
                                return [
                                    4,
                                    this.creditService.findOne({
                                        customerID: customerID,
                                        leadID: leadID
                                    }, [
                                        '*'
                                    ])
                                ];
                            case 2:
                                credit = _state.sent();
                                if (!credit) throw new NotFoundError("Emi Loan Not Found'");
                                db = getKnexInstance();
                                return [
                                    4,
                                    db('equated_monthly_installments as emi').where({
                                        'emi.creditID': credit.creditID
                                    }).leftJoin('other_charges as oc', 'emi.emiID', 'oc.emiID').select('emi.emiID', db.raw("DATE_FORMAT(emi.dueDate, '%d/%m/%Y') as dueDate"), 'emi.actualPaymentDate', 'emi.creditID', 'emi.principal', 'emi.interest', 'emi.amountPayable', 'emi.status', 'emi.amountRemains', 'oc.id as other_charge_id', 'oc.amount as other_charge_amount', 'oc.discription as other_charge_discription', 'oc.status as other_charge_status')
                                ];
                            case 3:
                                getEmis = _state.sent();
                                totalPaneltyAmount = 0;
                                totalBouncingAmount = 0;
                                paneltyEmis = 0;
                                _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
                                try {
                                    for(_iterator = getEmis[Symbol.iterator](); !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true){
                                        emi = _step.value;
                                        if (emi.other_charge_amount) {
                                            paneltyEmis += 1;
                                            totalPaneltyAmount += emi.other_charge_amount;
                                            emi.other_charge_discription == 'Bouns Charge' ? totalBouncingAmount += emi.other_charge_amount : null;
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
                                loanDetails = {
                                    branch: credit.branch,
                                    loanDisbursed: credit.principal - credit.processingFee - credit.brokenPeriodIntrest,
                                    principle: credit.principal,
                                    tenure: credit.tenure,
                                    actualTenure: credit.actualTenure,
                                    roi: credit.roi,
                                    intrest: credit.interest,
                                    paneltyAmount: totalPaneltyAmount,
                                    bouncingPenalty: totalBouncingAmount,
                                    paidAmount: credit.repaymentAmount,
                                    dueAmount: credit.amountToBeRepayed,
                                    totalEmis: credit.totalEMIs,
                                    emiLeft: credit.emiLeft,
                                    peneltyEmis: paneltyEmis,
                                    proccessingFee: credit.processingFee
                                };
                                _iteratorNormalCompletion1 = true, _didIteratorError1 = false, _iteratorError1 = undefined;
                                try {
                                    for(_iterator1 = getEmis[Symbol.iterator](); !(_iteratorNormalCompletion1 = (_step1 = _iterator1.next()).done); _iteratorNormalCompletion1 = true){
                                        emi1 = _step1.value;
                                        dueDateSplit = emi1.dueDate.split('/');
                                        dueDate = new Date(dueDateSplit[2], dueDateSplit[1] - 1, dueDateSplit[0]);
                                        console.log(dueDate, new Date(Date.now()), dueDate.getTime() < new Date(Date.now()).getTime());
                                        if (dueDate.getTime() < new Date(Date.now()).getTime()) {
                                            emi1.dpd = Math.floor((new Date(Date.now()).getTime() - dueDate.getTime()) / (1000 * 24 * 60 * 60));
                                        } else {
                                            emi1.dpd = 0;
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
                                return [
                                    2,
                                    this.serviceResponse(200, {
                                        loanDetails: loanDetails,
                                        emiList: getEmis
                                    }, 'EMI Loan Details')
                                ];
                        }
                    });
                }).call(this);
            }
        },
        {
            key: "uploadBulkMandateFile",
            value: function uploadBulkMandateFile(payload) {
                return _async_to_generator(function() {
                    var image, userId, name, results, db, uploadedTrack, message, fileStream, header, filename, folder, s3UploadResponse, newfilename, key, csvlink, insertData, errorLog, errorFileName, logData, totalRepayAmount, loanQuery, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, row, normalizedRow, key1, loanNo, amount, loanQuery1, ema, active, ifscData, _ref, _ref1, _query__, _query_, query, maxAmount, expiryDate, agentName, err, errorFileS3, err1;
                    return _ts_generator(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                image = payload.image, userId = payload.userId, name = payload.name;
                                results = [];
                                db = getKnexInstance();
                                uploadedTrack = uuidv4();
                                message = 'File uploaded successfully.';
                                checkUploadTimeIST();
                                if (image.size > 2 * 1024 * 1024) {
                                    throw new BadRequestError('File size must be less than 2MB.');
                                }
                                fileStream = Readable.from(image.buffer);
                                _state.label = 1;
                            case 1:
                                _state.trys.push([
                                    1,
                                    33,
                                    ,
                                    34
                                ]);
                                return [
                                    4,
                                    new Promise(function(resolve, reject) {
                                        fileStream.pipe(csvParser()).on('data', function(data) {
                                            results.push(data);
                                        }).on('end', function() {
                                            resolve();
                                        }).on('error', function(err) {
                                            message = 'Error processing the file.';
                                            reject(err);
                                        });
                                    })
                                ];
                            case 2:
                                _state.sent();
                                if (results.length > 10000) {
                                    return [
                                        2,
                                        this.serviceResponse(400, {}, 'Max upload limit is 10000 rows.')
                                    ];
                                }
                                header = Object.keys(results[0]);
                                if (!this.validateCSVHeaders(header)) {
                                    return [
                                        2,
                                        this.serviceResponse(400, {}, 'Column header should be loanNo and amount.')
                                    ];
                                }
                                filename = "".concat(Math.floor(Date.now() / 1000), "/").concat(uploadedTrack, ".").concat(image.originalname);
                                folder = "documents/csv";
                                return [
                                    4,
                                    this.s3Service.uploadDocument(image.buffer, folder, filename)
                                ];
                            case 3:
                                s3UploadResponse = _state.sent();
                                if (!s3UploadResponse) {
                                    return [
                                        2,
                                        this.serviceResponse(400, {}, 'File extension is not allowed.')
                                    ];
                                }
                                newfilename = "".concat(uploadedTrack, ".").concat(image.originalname);
                                key = "".concat(folder, "/").concat(filename);
                                return [
                                    4,
                                    this.s3Service.getPresignedUrl(key)
                                ];
                            case 4:
                                csvlink = _state.sent();
                                insertData = [];
                                errorLog = [];
                                errorFileName = '';
                                totalRepayAmount = null;
                                _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
                                _state.label = 5;
                            case 5:
                                _state.trys.push([
                                    5,
                                    24,
                                    25,
                                    26
                                ]);
                                _iterator = results[Symbol.iterator]();
                                _state.label = 6;
                            case 6:
                                if (!!(_iteratorNormalCompletion = (_step = _iterator.next()).done)) return [
                                    3,
                                    23
                                ];
                                row = _step.value;
                                normalizedRow = {};
                                for(var key1 in row){
                                    normalizedRow[key1.trim().toLowerCase()] = row[key1];
                                }
                                loanNo = normalizedRow['loanno'];
                                amount = parseFloat(row['amount']);
                                if (!(loanNo && amount)) return [
                                    3,
                                    22
                                ];
                                return [
                                    4,
                                    db('loan AS ll').leftJoin('leads', 'leads.leadID', '=', 'll.leadID').select('leads.leadID', 'll.loanNo', 'leads.customerID', 'leads.productID', 'leads.ipc', 'leads.status', 'leads.em_id', 'll.accountNo').whereIn('leads.status', [
                                        'Disbursed',
                                        'Part Payment'
                                    ]).where('ll.status', 'Disbursed').where('ll.loanNo', loanNo).first()
                                ];
                            case 7:
                                loanQuery1 = _state.sent();
                                if (!loanQuery1) return [
                                    3,
                                    21
                                ];
                                return [
                                    4,
                                    db('razorpay_mandate').where('status', 'paid').whereNotNull('customerID').where('customerID', loanQuery1.customerID).orderBy('id', 'desc').first()
                                ];
                            case 8:
                                ema = _state.sent();
                                active = void 0;
                                if (!!ema) return [
                                    3,
                                    9
                                ];
                                errorLog.push({
                                    LoanNumber: loanNo,
                                    Amount: amount,
                                    message: 'Mandate not found',
                                    uploadDate: new Date()
                                });
                                return [
                                    3,
                                    11
                                ];
                            case 9:
                                return [
                                    4,
                                    db('bank_ifsc').where('IFSC', ema === null || ema === void 0 ? void 0 : ema.ifsc).orderBy('id', 'desc').first()
                                ];
                            case 10:
                                ifscData = _state.sent();
                                active = ifscData ? ifscData.is_active : '1';
                                _state.label = 11;
                            case 11:
                                if (!(ema && active === '1')) return [
                                    3,
                                    19
                                ];
                                if (!(loanQuery1.productID === ProductID.PAYDAY)) return [
                                    3,
                                    16
                                ];
                                if (!(loanQuery1.ipc === 1)) return [
                                    3,
                                    13
                                ];
                                return [
                                    4,
                                    calculateTotalRepayPaydayAmountIPC(loanQuery1.leadID, loanQuery1.status)
                                ];
                            case 12:
                                totalRepayAmount = _state.sent();
                                return [
                                    3,
                                    15
                                ];
                            case 13:
                                return [
                                    4,
                                    calculateTotalRepayPaydayAmountNonIPC(loanQuery1.leadID)
                                ];
                            case 14:
                                totalRepayAmount = _state.sent();
                                _state.label = 15;
                            case 15:
                                return [
                                    3,
                                    18
                                ];
                            case 16:
                                return [
                                    4,
                                    db.raw("\n                  SELECT \n                      ROUND(\n                          CASE\n                              WHEN emi.status = 'due' AND emi.dueDate < CURRENT_DATE THEN\n                                  emi.principal + emi.interest + \n                                  emi.principal * (((COALESCE(cr.roi, 0) / 12) / 100) + 0.1) * \n                                  DATEDIFF(CURRENT_DATE, emi.dueDate) + \n                                  590\n                              WHEN emi.status = 'part-payment' AND emi.actualPaymentDate > emi.dueDate THEN\n                                  emi.principal + emi.interest + emi.panelty + \n                                  emi.amountRemains * (((COALESCE(cr.roi, 0) / 12) / 100) + 0.1) * \n                                  DATEDIFF(CURRENT_DATE, emi.actualPaymentDate) + \n                                  590 - emi.amountPayable\n                              WHEN emi.status = 'part-payment' AND emi.actualPaymentDate < emi.dueDate AND emi.dueDate < CURRENT_DATE THEN\n                                  emi.principal + emi.interest + \n                                  emi.amountRemains * (((COALESCE(cr.roi, 0) / 12) / 100) + 0.1) * \n                                  DATEDIFF(CURRENT_DATE, emi.dueDate) + \n                                  590 - emi.amountPayable\n                              ELSE emi.amountPayable\n                          END, 2\n                      ) AS Repay_Amount\n                  FROM equated_monthly_installments emi\n                  LEFT JOIN credits cr ON emi.creditID = cr.creditID\n                  WHERE emi.leadID = ? \n                  AND emi.dueDate <= CURRENT_DATE\n                  AND emi.status != 'paid'\n              ", [
                                        loanQuery1.leadID
                                    ])
                                ];
                            case 17:
                                query = _state.sent();
                                // console.log("query",query)
                                totalRepayAmount = (_ref1 = (_query_ = query[0]) === null || _query_ === void 0 ? void 0 : (_query__ = _query_[0]) === null || _query__ === void 0 ? void 0 : _query__.Repay_Amount) !== null && _ref1 !== void 0 ? _ref1 : 0;
                                console.log('totalRepayamount', totalRepayAmount);
                                _state.label = 18;
                            case 18:
                                maxAmount = (_ref = ema === null || ema === void 0 ? void 0 : ema.emMaxamount) !== null && _ref !== void 0 ? _ref : -1;
                                expiryDate = new Date(new Date(ema === null || ema === void 0 ? void 0 : ema.credated_date).getTime() + 270 * 24 * 60 * 60 * 1000);
                                if (expiryDate > new Date() || (ema === null || ema === void 0 ? void 0 : ema.status) === 'expired') {
                                    if (amount <= maxAmount && amount > 100 && amount <= totalRepayAmount) {
                                        insertData.push({
                                            loanNo: loanQuery1.loanNo,
                                            leadID: loanQuery1.leadID,
                                            track: uploadedTrack,
                                            userID: userId,
                                            emandateID: ema.id,
                                            status: '0',
                                            customerID: loanQuery1.customerID,
                                            accountNo: loanQuery1.accountNo,
                                            collectable_amount: amount,
                                            productID: loanQuery1.productID
                                        });
                                        agentName = name;
                                        logData = {
                                            customerID: loanQuery1.customerID,
                                            leadID: loanQuery1.leadID,
                                            callType: 'IVR',
                                            status: 'In Queue',
                                            remark: "Loan Number (".concat(loanQuery1.loanNo, ") added in Queue for mandate by ").concat(agentName),
                                            appAmount: amount,
                                            noteli: '',
                                            callbackTime: new Date(),
                                            calledBy: userId
                                        };
                                    } else {
                                        errorLog.push({
                                            LoanNumber: loanNo,
                                            Amount: amount,
                                            message: "Amount ".concat(amount, " is not within acceptable range."),
                                            uploadDate: new Date()
                                        });
                                    }
                                } else {
                                    errorLog.push({
                                        LoanNumber: loanNo,
                                        Amount: amount,
                                        message: 'Mandate Expired',
                                        uploadDate: new Date()
                                    });
                                }
                                return [
                                    3,
                                    20
                                ];
                            case 19:
                                errorLog.push({
                                    LoanNumber: loanNo,
                                    Amount: amount,
                                    message: 'Emandate status must be paid or bank must be active',
                                    uploadDate: new Date()
                                });
                                _state.label = 20;
                            case 20:
                                return [
                                    3,
                                    22
                                ];
                            case 21:
                                errorLog.push({
                                    LoanNumber: loanNo,
                                    Amount: amount,
                                    message: 'This loan number does not match certain conditions.',
                                    uploadDate: new Date()
                                });
                                _state.label = 22;
                            case 22:
                                _iteratorNormalCompletion = true;
                                return [
                                    3,
                                    6
                                ];
                            case 23:
                                return [
                                    3,
                                    26
                                ];
                            case 24:
                                err = _state.sent();
                                _didIteratorError = true;
                                _iteratorError = err;
                                return [
                                    3,
                                    26
                                ];
                            case 25:
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
                            case 26:
                                if (!(errorLog.length > 0)) return [
                                    3,
                                    28
                                ];
                                errorFileName = "Errorlist".concat(uploadedTrack).concat(new Date().toISOString().split('T')[0], ".csv");
                                return [
                                    4,
                                    this.generateAndUploadCSV({
                                        data: errorLog,
                                        headers: [
                                            'LoanNumber',
                                            'Amount',
                                            'message',
                                            'uploadDate'
                                        ],
                                        filename: errorFileName,
                                        folder: "documents/errorcsv"
                                    })
                                ];
                            case 27:
                                errorFileS3 = _state.sent();
                                if (!errorFileS3) {
                                    return [
                                        2,
                                        this.serviceResponse(400, {}, 'Failed to upload error file.')
                                    ];
                                }
                                _state.label = 28;
                            case 28:
                                return [
                                    4,
                                    db('exsl_filelog').insert({
                                        fileName: filename,
                                        uploadStatus: 'uploaded',
                                        processStatus: 'In Queue',
                                        error: "documents/errorcsv/".concat(errorFileName),
                                        errorfilelink: "".concat(folder, "/").concat(uploadedTrack, ".csv"),
                                        filelink: csvlink,
                                        succesfile: uploadedTrack,
                                        cron_status: 0,
                                        userID: userId,
                                        productID: loanQuery === null || loanQuery === void 0 ? void 0 : loanQuery.productID
                                    })
                                ];
                            case 29:
                                _state.sent();
                                if (insertData.length === 0) {
                                    message = 'No valid records found.';
                                    return [
                                        2,
                                        this.serviceResponse(400, {}, message)
                                    ];
                                }
                                if (!(insertData.length > 0)) return [
                                    3,
                                    32
                                ];
                                return [
                                    4,
                                    db('exsl_mandate').insert(insertData)
                                ];
                            case 30:
                                _state.sent();
                                return [
                                    4,
                                    db('callhistoryLogs').insert(logData)
                                ];
                            case 31:
                                _state.sent();
                                _state.label = 32;
                            case 32:
                                message = "File uploaded successfully. ".concat(insertData.length, " entries added.");
                                return [
                                    2,
                                    this.serviceResponse(200, {}, message)
                                ];
                            case 33:
                                err1 = _state.sent();
                                console.error(err1);
                                return [
                                    2,
                                    this.serviceResponse(500, {}, 'An error occurred while processing the file.')
                                ];
                            case 34:
                                return [
                                    2
                                ];
                        }
                    });
                }).call(this);
            }
        },
        {
            key: "callSetBulkMandate",
            value: function callSetBulkMandate() {
                return _async_to_generator(function() {
                    var db, mandateList;
                    return _ts_generator(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                db = getKnexInstance();
                                return [
                                    4,
                                    db('exsl_filelog').whereNotNull('succesfile').where('cron_status', 0).whereNot('succesfile', '').whereNot('succesfile', 'like', '%documents/successcsv%').orderBy('id', 'desc').first()
                                ];
                            case 1:
                                mandateList = _state.sent();
                                if (!(mandateList && mandateList.succesfile)) return [
                                    3,
                                    4
                                ];
                                return [
                                    4,
                                    db('exsl_filelog').where('succesfile', mandateList.succesfile).update({
                                        cron_status: 1
                                    })
                                ];
                            case 2:
                                _state.sent();
                                return [
                                    4,
                                    this.setBulkMandate(mandateList.succesfile)
                                ];
                            case 3:
                                _state.sent();
                                _state.label = 4;
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
            key: "setBulkMandate",
            value: function setBulkMandate(track) {
                return _async_to_generator(function() {
                    var db, mandateList, out, loan_data, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, mnd, _ref, _ebulkemd_message, _mnd_collectable_amount, _ebulkemd_message1, ebulkemd, statusKey, data, calllog, message, err, folder, loanheader, loanfile, successFileS3Path;
                    return _ts_generator(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                db = getKnexInstance();
                                if (!db) {
                                    console.error('Failed to initialize the Knex instance.');
                                }
                                return [
                                    4,
                                    db('exsl_mandate AS bemd').join('leads AS l1', 'l1.leadID', '=', 'bemd.leadID').join('razorpay_mandate', 'razorpay_mandate.customerID', '=', 'bemd.customerID').join('leads AS l2', 'l2.em_id', '=', 'razorpay_mandate.id').join('loan', 'loan.accountNo', '=', 'razorpay_mandate.accountNo').select('bemd.leadID', 'bemd.emandateID', 'bemd.loanNo', 'bemd.collectable_amount', 'bemd.accountNo', 'bemd.customerID', 'bemd.productID').whereIn('l1.status', [
                                        'Disbursed',
                                        'Part Payment'
                                    ]).where('razorpay_mandate.status', 'paid').where('bemd.status', '0').where('bemd.track', track).distinct()
                                ];
                            case 1:
                                mandateList = _state.sent();
                                if (!mandateList || mandateList.length === 0) {
                                    console.log('No mandates found for the given conditions.');
                                }
                                out = [];
                                loan_data = [];
                                _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
                                _state.label = 2;
                            case 2:
                                _state.trys.push([
                                    2,
                                    10,
                                    11,
                                    12
                                ]);
                                _iterator = mandateList[Symbol.iterator]();
                                _state.label = 3;
                            case 3:
                                if (!!(_iteratorNormalCompletion = (_step = _iterator.next()).done)) return [
                                    3,
                                    9
                                ];
                                mnd = _step.value;
                                return [
                                    4,
                                    this.submitEmdCharge(mnd.customerID, mnd.leadID, mnd.emandateID, mnd.collectable_amount)
                                ];
                            case 4:
                                ebulkemd = _state.sent();
                                statusKey = (_ref = ebulkemd === null || ebulkemd === void 0 ? void 0 : ebulkemd.status) !== null && _ref !== void 0 ? _ref : 'In Process';
                                data = {
                                    customerID: mnd.customerID,
                                    leadID: mnd.leadID,
                                    callType: 'IVR',
                                    status: statusKey,
                                    remark: (_ebulkemd_message = ebulkemd.message) !== null && _ebulkemd_message !== void 0 ? _ebulkemd_message : "Loan Number (".concat(mnd.loanNo, ") in Processed for mandate"),
                                    noteli: ' ',
                                    appAmount: (_mnd_collectable_amount = mnd.collectable_amount) !== null && _mnd_collectable_amount !== void 0 ? _mnd_collectable_amount : 0,
                                    callbackTime: new Date().toISOString().split('T')[0],
                                    calledBy: 221,
                                    createdDate: new Date()
                                };
                                return [
                                    4,
                                    db('callhistoryLogs').where('customerID', mnd.customerID).where('leadID', mnd.leadID).first()
                                ];
                            case 5:
                                calllog = _state.sent();
                                message = (_ebulkemd_message1 = ebulkemd.message) !== null && _ebulkemd_message1 !== void 0 ? _ebulkemd_message1 : "Loan Number (".concat(mnd.loanNo, ") in Processed for mandate");
                                loan_data.push({
                                    LoanNumber: mnd.loanNo,
                                    Amount: mnd.collectable_amount,
                                    Status: statusKey,
                                    message: message,
                                    date_of_emandate: new Date().toISOString()
                                });
                                return [
                                    4,
                                    db('exsl_mandate').where('leadID', mnd.leadID).where('productID', mnd.productID).where('status', '0').orderBy('id', 'desc').update({
                                        status: statusKey
                                    }).limit(1)
                                ];
                            case 6:
                                _state.sent();
                                return [
                                    4,
                                    db('callhistoryLogs').insert(data)
                                ];
                            case 7:
                                _state.sent();
                                out.push(ebulkemd);
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
                                if (!(loan_data.length > 0)) return [
                                    3,
                                    15
                                ];
                                folder = 'documents/successcsv';
                                loanheader = [
                                    'LoanNumber',
                                    'Amount',
                                    'Status',
                                    'message',
                                    'date_of_emandate'
                                ];
                                loanfile = "Loanlist".concat(track).concat(new Date().toISOString().split('T')[0], ".csv");
                                return [
                                    4,
                                    this.generateAndUploadCSV({
                                        data: loan_data,
                                        headers: loanheader,
                                        filename: loanfile,
                                        folder: folder
                                    })
                                ];
                            case 13:
                                successFileS3Path = _state.sent();
                                if (!successFileS3Path) {
                                    throw new BadRequestError('Failed to upload Loanlist.');
                                }
                                return [
                                    4,
                                    db('exsl_filelog').where('succesfile', track).update({
                                        uploadStatus: 'uploaded',
                                        processStatus: 'Success',
                                        succesfile: track
                                    })
                                ];
                            case 14:
                                _state.sent();
                                _state.label = 15;
                            case 15:
                                return [
                                    2,
                                    out
                                ];
                        }
                    });
                }).call(this);
            }
        },
        {
            key: "generateAndUploadCSV",
            value: function generateAndUploadCSV(_0) {
                return _async_to_generator(function(param) {
                    var data, headers, filename, folder, filePath, fileStream, s3FileName, s3UploadResponse;
                    return _ts_generator(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                data = param.data, headers = param.headers, filename = param.filename, folder = param.folder;
                                filePath = path.join(__dirname, "".concat(filename));
                                fileStream = fs.createWriteStream(filePath);
                                fileStream.write("".concat(headers.join(','), "\n"));
                                data.forEach(function(row) {
                                    var csvRow = headers.map(function(header) {
                                        var _row_header;
                                        return (_row_header = row[header]) !== null && _row_header !== void 0 ? _row_header : '';
                                    }).join(',');
                                    fileStream.write("".concat(csvRow, "\n"));
                                });
                                fileStream.end();
                                return [
                                    4,
                                    new Promise(function(resolve) {
                                        return fileStream.on('finish', resolve);
                                    })
                                ];
                            case 1:
                                _state.sent();
                                s3FileName = path.basename(filePath);
                                return [
                                    4,
                                    this.s3Service.uploadDocument(fs.readFileSync(filePath), folder, s3FileName)
                                ];
                            case 2:
                                s3UploadResponse = _state.sent();
                                return [
                                    4,
                                    this.unlinkFile(filePath)
                                ];
                            case 3:
                                _state.sent();
                                return [
                                    2,
                                    s3UploadResponse
                                ];
                        }
                    });
                }).apply(this, arguments);
            }
        },
        {
            key: "submitEmdCharge",
            value: function submitEmdCharge(customerID, leadId, emID, emAmount) {
                return _async_to_generator(function() {
                    var _ref, _ref1, _ref2, _ref3, _ref4, _orderResponse_id, _ref5, _ref6, _ref7, _ref8, _ref9, _ref10, _ref11, _ref12, _paymentResponse_razorpay_payment_id, _ref13, _ref14, _ref15, _ref16, _paymentResponse_razorpay_payment_id1, db, ema, collectedPayment, emMaxAmount, _ref17, loan, totalRepayAmount, leadData, data1, orderResponse, _orderResponse_error_description, message, orderID, data2, paymentResponse, _paymentResponse_error_description, message1, orderIDValue, customerData;
                    return _ts_generator(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                db = getKnexInstance();
                                return [
                                    4,
                                    db('razorpay_mandate').where('id', emID).first()
                                ];
                            case 1:
                                ema = _state.sent();
                                return [
                                    4,
                                    db('onlinepayment').where('paymentStatus', 'success').where('method', 'E-mandate').where('leadID', leadId).sum('toValue as total')
                                ];
                            case 2:
                                collectedPayment = _state.sent();
                                emMaxAmount = (_ref = ema === null || ema === void 0 ? void 0 : ema.emMaxamount) !== null && _ref !== void 0 ? _ref : -1;
                                if (collectedPayment[0].total < emMaxAmount && emMaxAmount > 0) {
                                    emMaxAmount -= collectedPayment[0].total;
                                }
                                if (!(collectedPayment[0].total < 1 && emMaxAmount < 1)) return [
                                    3,
                                    4
                                ];
                                return [
                                    4,
                                    db('loan').where('customerID', customerID).where('leadID', leadId).first()
                                ];
                            case 3:
                                loan = _state.sent();
                                emMaxAmount = ((_ref17 = loan === null || loan === void 0 ? void 0 : loan.disbursalAmount) !== null && _ref17 !== void 0 ? _ref17 : 0) * 2;
                                _state.label = 4;
                            case 4:
                                if (emAmount > emMaxAmount) {
                                    return [
                                        2,
                                        {
                                            status: 'Failed',
                                            leadId: leadId,
                                            customerID: customerID,
                                            message: "Max chargeable amount is ".concat(emMaxAmount, "rs.")
                                        }
                                    ];
                                }
                                if (emAmount < 100) {
                                    return [
                                        2,
                                        {
                                            status: 'Failed',
                                            leadId: leadId,
                                            customerID: customerID,
                                            message: "Minimum amount is 100rs."
                                        }
                                    ];
                                }
                                totalRepayAmount = 0;
                                return [
                                    4,
                                    this.leadService.findOne({
                                        leadID: leadId
                                    }, [
                                        'customerID',
                                        'leadID',
                                        'status'
                                    ])
                                ];
                            case 5:
                                leadData = _state.sent();
                                data1 = {
                                    amount: +emAmount * 100,
                                    currency: 'INR',
                                    payment_capture: true,
                                    leadID: leadId,
                                    customerID: customerID,
                                    customer_id: (_ref1 = ema === null || ema === void 0 ? void 0 : ema.customer_id) !== null && _ref1 !== void 0 ? _ref1 : customerID,
                                    receipt: 'INR',
                                    notes: {
                                        notes_key_1: (_ref2 = ema === null || ema === void 0 ? void 0 : ema.cust_name) !== null && _ref2 !== void 0 ? _ref2 : '',
                                        notes_key_2: (_ref3 = ema === null || ema === void 0 ? void 0 : ema.cust_name) !== null && _ref3 !== void 0 ? _ref3 : ''
                                    }
                                };
                                return [
                                    4,
                                    this.sendRazorpayRequestNew("".concat(config.razorPayBaseUrl, "/orders/"), data1, 'e-mandate nach orders')
                                ];
                            case 6:
                                orderResponse = _state.sent();
                                if (orderResponse.error && orderResponse.error.description) {
                                    ;
                                    message = (_orderResponse_error_description = orderResponse.error.description) !== null && _orderResponse_error_description !== void 0 ? _orderResponse_error_description : 'data error by third party';
                                    return [
                                        2,
                                        {
                                            status: 'Failed',
                                            leadId: leadId,
                                            customerID: customerID,
                                            message: 'Mandate is not active[Error received from razorpay]'
                                        }
                                    ];
                                }
                                return [
                                    4,
                                    db('razorpay_emOrder').insert({
                                        emID: (_ref4 = ema === null || ema === void 0 ? void 0 : ema.id) !== null && _ref4 !== void 0 ? _ref4 : emID,
                                        customerID: customerID,
                                        leadID: leadId,
                                        orderID: orderResponse.id,
                                        entity: orderResponse.entity,
                                        amount: orderResponse.amount / 100,
                                        amount_paid: orderResponse.amount_paid,
                                        amount_due: orderResponse.amount_due / 100,
                                        currency: orderResponse.currency,
                                        receipt: orderResponse.receipt,
                                        status: orderResponse.status,
                                        razorpay_payment_id: 'no payment',
                                        razorpay_signature: 'no signature',
                                        razorpay_order_id: (_orderResponse_id = orderResponse.id) !== null && _orderResponse_id !== void 0 ? _orderResponse_id : 'no order',
                                        notes_key_1: orderResponse.notes.notes_key_1,
                                        tokenID: (_ref5 = ema === null || ema === void 0 ? void 0 : ema.token_id) !== null && _ref5 !== void 0 ? _ref5 : 'token_XYZ',
                                        uid: 221,
                                        createdDate: new Date(),
                                        remarks: 'Auto Collect'
                                    })
                                ];
                            case 7:
                                orderID = _state.sent();
                                if (!orderID) {
                                    return [
                                        2,
                                        {
                                            status: 'Failed',
                                            leadId: leadId,
                                            customerID: customerID,
                                            message: 'Order insertion failed'
                                        }
                                    ];
                                }
                                data2 = {
                                    email: (_ref6 = ema === null || ema === void 0 ? void 0 : ema.cust_email) !== null && _ref6 !== void 0 ? _ref6 : '',
                                    contact: (_ref7 = ema === null || ema === void 0 ? void 0 : ema.cust_contact) !== null && _ref7 !== void 0 ? _ref7 : '',
                                    leadID: leadId,
                                    amount: emAmount * 100,
                                    currency: 'INR',
                                    order_id: orderResponse.id,
                                    customerID: customerID,
                                    customer_id: (_ref8 = ema === null || ema === void 0 ? void 0 : ema.customer_id) !== null && _ref8 !== void 0 ? _ref8 : '',
                                    token: (_ref9 = ema === null || ema === void 0 ? void 0 : ema.token_id) !== null && _ref9 !== void 0 ? _ref9 : 'token_XYZ',
                                    recurring: '1',
                                    description: (_ref10 = ema === null || ema === void 0 ? void 0 : ema.cust_name) !== null && _ref10 !== void 0 ? _ref10 : '',
                                    notes: {
                                        notes_key_1: (_ref11 = ema === null || ema === void 0 ? void 0 : ema.cust_name) !== null && _ref11 !== void 0 ? _ref11 : '',
                                        notes_key_2: (_ref12 = ema === null || ema === void 0 ? void 0 : ema.cust_name) !== null && _ref12 !== void 0 ? _ref12 : ''
                                    }
                                };
                                return [
                                    4,
                                    this.sendRazorpayRequestNew("".concat(config.razorPayBaseUrl, "/payments/create/recurring/"), data2, 'e-mandate nach recurring')
                                ];
                            case 8:
                                paymentResponse = _state.sent();
                                if (paymentResponse.error && paymentResponse.error.description) {
                                    ;
                                    message1 = (_paymentResponse_error_description = paymentResponse.error.description) !== null && _paymentResponse_error_description !== void 0 ? _paymentResponse_error_description : 'data error by third party';
                                    return [
                                        2,
                                        {
                                            status: 'Failed',
                                            leadId: leadId,
                                            customerID: customerID,
                                            message: 'Mandate is not active[Error received from razorpay]'
                                        }
                                    ];
                                }
                                if (Array.isArray(orderID) && orderID.length > 0) {
                                    orderIDValue = orderID[0];
                                }
                                return [
                                    4,
                                    db('razorpay_emOrder').where('id', orderIDValue).update({
                                        razorpay_payment_id: (_paymentResponse_razorpay_payment_id = paymentResponse.razorpay_payment_id) !== null && _paymentResponse_razorpay_payment_id !== void 0 ? _paymentResponse_razorpay_payment_id : 'no payment id',
                                        razorpay_order_id: orderResponse.id,
                                        razorpay_signature: paymentResponse.razorpay_signature
                                    })
                                ];
                            case 9:
                                _state.sent();
                                return [
                                    4,
                                    db('customer').where('customerID', customerID).first()
                                ];
                            case 10:
                                customerData = _state.sent();
                                return [
                                    4,
                                    db('onlinepayment').insert({
                                        name: (_ref13 = customerData === null || customerData === void 0 ? void 0 : customerData.name) !== null && _ref13 !== void 0 ? _ref13 : '',
                                        email: (_ref14 = customerData === null || customerData === void 0 ? void 0 : customerData.email) !== null && _ref14 !== void 0 ? _ref14 : '',
                                        phone: (_ref15 = customerData === null || customerData === void 0 ? void 0 : customerData.mobile) !== null && _ref15 !== void 0 ? _ref15 : '',
                                        service: 'Ramfincorp',
                                        typeProduct: 'E-mandate',
                                        toValue: orderResponse.amount / 100,
                                        message: (_ref16 = customerData === null || customerData === void 0 ? void 0 : customerData.pancard) !== null && _ref16 !== void 0 ? _ref16 : '',
                                        razorpayOrderId: orderResponse.id,
                                        razorpayPaymentId: (_paymentResponse_razorpay_payment_id1 = paymentResponse.razorpay_payment_id) !== null && _paymentResponse_razorpay_payment_id1 !== void 0 ? _paymentResponse_razorpay_payment_id1 : 'no payment id',
                                        paymentStatus: 'PENDING',
                                        makerstamp: new Date(),
                                        updatestamp: new Date(),
                                        status: 'no',
                                        paymentType: 'E-mandate Charge',
                                        method: 'E-mandate',
                                        leadID: leadId
                                    })
                                ];
                            case 11:
                                _state.sent();
                                return [
                                    2,
                                    {
                                        status: 'Success',
                                        leadId: leadId,
                                        customerID: customerID,
                                        message: 'Success'
                                    }
                                ];
                        }
                    });
                }).call(this);
            }
        },
        {
            key: "sendRazorpayRequestNew",
            value: function sendRazorpayRequestNew(url, data, apiType) {
                return _async_to_generator(function() {
                    var jsonResponse;
                    return _ts_generator(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                this.prepareRequestData(data, apiType);
                                return [
                                    4,
                                    this.postRazorpayRequest(url, data)
                                ];
                            case 1:
                                jsonResponse = _state.sent();
                                if (!jsonResponse.success) {
                                    return [
                                        2,
                                        {
                                            error: {
                                                description: jsonResponse.message
                                            }
                                        }
                                    ];
                                }
                                return [
                                    2,
                                    jsonResponse
                                ];
                        }
                    });
                }).call(this);
            }
        },
        {
            key: "prepareRequestData",
            value: function prepareRequestData(data, apiType) {
                return _async_to_generator(function() {
                    return _ts_generator(this, function(_state) {
                        if (apiType !== 'e-mandate nach recurring') {
                            delete data.customer_id;
                        }
                        delete data.customerID;
                        delete data.leadID;
                        return [
                            2
                        ];
                    });
                })();
            }
        },
        {
            key: "postRazorpayRequest",
            value: function postRazorpayRequest(url, data) {
                return _async_to_generator(function() {
                    var response, error, _error_response;
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
                                    axios.post(url, data, {
                                        headers: {
                                            Authorization: "Basic ".concat(this.razorpayPg.auth),
                                            'Cache-Control': 'no-cache',
                                            'Content-Type': 'application/json'
                                        },
                                        timeout: 30000,
                                        maxRedirects: 10
                                    })
                                ];
                            case 1:
                                response = _state.sent();
                                return [
                                    2,
                                    _object_spread({
                                        success: true
                                    }, response.data)
                                ];
                            case 2:
                                error = _state.sent();
                                console.error('Error in Razorpay request:', error.response ? error.response.data : error.message);
                                return [
                                    2,
                                    {
                                        success: false,
                                        message: ((_error_response = error.response) === null || _error_response === void 0 ? void 0 : _error_response.data) || 'Error in Razorpay Request'
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
            key: "getBulkMandateData",
            value: function getBulkMandateData(payload) {
                return _async_to_generator(function() {
                    var _payload_page, page, _payload_limit, limit, db, pageTitle, currentPage, offset, fileData, fileDataTotal, insertData, insertDataTotal, fileDataTotalPages, insertDataTotalPages;
                    return _ts_generator(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                _payload_page = payload.page, page = _payload_page === void 0 ? 1 : _payload_page, _payload_limit = payload.limit, limit = _payload_limit === void 0 ? 20 : _payload_limit;
                                db = getKnexInstance();
                                pageTitle = 'Bulk E-mandate by Excel';
                                currentPage = page;
                                offset = (currentPage - 1) * limit;
                                return [
                                    4,
                                    db('exsl_filelog').where('uploadStatus', 'uploaded').orderBy('id', 'DESC').limit(limit).offset(offset)
                                ];
                            case 1:
                                fileData = _state.sent();
                                return [
                                    4,
                                    db('exsl_filelog').where('uploadStatus', 'uploaded').count({
                                        count: '*'
                                    }).first()
                                ];
                            case 2:
                                fileDataTotal = _state.sent();
                                return [
                                    4,
                                    db('exsl_mandate').join('customer', 'exsl_mandate.customerID', '=', 'customer.customerID').select('exsl_mandate.*', 'customer.name').whereIn('exsl_mandate.status', [
                                        '0',
                                        '1',
                                        '2',
                                        '3',
                                        '4'
                                    ]).orderBy('exsl_mandate.id', 'DESC').limit(limit).offset(offset)
                                ];
                            case 3:
                                insertData = _state.sent();
                                return [
                                    4,
                                    db('exsl_mandate').join('customer', 'exsl_mandate.customerID', '=', 'customer.customerID').whereIn('exsl_mandate.status', [
                                        '0',
                                        '1',
                                        '2',
                                        '3',
                                        '4'
                                    ]).count({
                                        count: '*'
                                    }).first()
                                ];
                            case 4:
                                insertDataTotal = _state.sent();
                                fileDataTotalPages = Math.ceil((fileDataTotal === null || fileDataTotal === void 0 ? void 0 : fileDataTotal.count) / limit);
                                insertDataTotalPages = Math.ceil((insertDataTotal === null || insertDataTotal === void 0 ? void 0 : insertDataTotal.count) / limit);
                                return [
                                    2,
                                    this.serviceResponse(200, {
                                        insertData: insertData,
                                        fileData: fileData,
                                        pageTitle: pageTitle,
                                        currentPage: currentPage,
                                        fileDataTotalPages: fileDataTotalPages,
                                        insertDataTotalPages: insertDataTotalPages,
                                        fileDataTotal: fileDataTotal.count,
                                        insertDataTotal: insertDataTotal.count
                                    }, 'Data for bulk mandate ')
                                ];
                        }
                    });
                }).call(this);
            }
        },
        {
            key: "getUrlforBulkMandateFile",
            value: function getUrlforBulkMandateFile(payload) {
                return _async_to_generator(function() {
                    var fileName, csvlink;
                    return _ts_generator(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                fileName = payload.fileName;
                                return [
                                    4,
                                    this.s3Service.getPresignedUrl(fileName)
                                ];
                            case 1:
                                csvlink = _state.sent();
                                return [
                                    2,
                                    this.serviceResponse(200, {
                                        csvlink: csvlink
                                    }, 'url')
                                ];
                        }
                    });
                }).call(this);
            }
        },
        {
            key: "sanitizeXLSXData",
            value: function sanitizeXLSXData(parsedData) {
                return parsedData.map(function(row) {
                    return {
                        mobile: row['customer_cid'] || null,
                        disposition: row['primary_dispo'] || null
                    };
                });
            }
        },
        {
            key: "uploadNotRequiredFile",
            value: function uploadNotRequiredFile(payload) {
                return _async_to_generator(function() {
                    var _this, image, userId, db, parsedData, validXLSXHeaders, headers, isValid, hasNoExtraHeaders, normalizedData, sanitizedData, uploadedTrack, filename, folder, s3UploadResponse, key, csvlink, error;
                    return _ts_generator(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                _this = this;
                                image = payload.image, userId = payload.userId;
                                db = getKnexInstance();
                                parsedData = [];
                                parsedData = projectionService.parseXLSX(image.buffer);
                                if (parsedData.length === 0) {
                                    throw new BadRequestError('No data available for insertion');
                                }
                                validXLSXHeaders = [
                                    'customer_cid',
                                    'primary_dispo'
                                ];
                                headers = Object.keys(parsedData[0]);
                                isValid = headers.every(function(header) {
                                    return validXLSXHeaders.includes(header);
                                });
                                hasNoExtraHeaders = headers.length === validXLSXHeaders.length;
                                if (!isValid || !hasNoExtraHeaders) {
                                    throw new BadRequestError("Invalid headers in XLSX file. Expected headers: ".concat(validXLSXHeaders.join(', ')));
                                }
                                normalizedData = parsedData.map(function(row) {
                                    var normalizedRow = {};
                                    Object.keys(row).forEach(function(key) {
                                        normalizedRow[key.trim()] = row[key];
                                    });
                                    return normalizedRow;
                                });
                                _state.label = 1;
                            case 1:
                                _state.trys.push([
                                    1,
                                    5,
                                    6,
                                    7
                                ]);
                                sanitizedData = this.sanitizeXLSXData(normalizedData);
                                uploadedTrack = uuidv4();
                                filename = "".concat(Math.floor(Date.now() / 1000), "/").concat(uploadedTrack, ".").concat(image.originalname);
                                folder = "documents/notRequiredLeads/csv";
                                return [
                                    4,
                                    this.s3Service.uploadDocument(image.buffer, folder, filename)
                                ];
                            case 2:
                                s3UploadResponse = _state.sent();
                                if (!s3UploadResponse) {
                                    throw new BadRequestError('File extension is not allowed.');
                                }
                                key = "".concat(folder, "/").concat(filename);
                                return [
                                    4,
                                    this.s3Service.getPresignedUrl(key)
                                ];
                            case 3:
                                csvlink = _state.sent();
                                return [
                                    4,
                                    db.transaction(function(trx) {
                                        return _async_to_generator(function() {
                                            var CHUNK_SIZE, i, chunk;
                                            return _ts_generator(this, function(_state) {
                                                switch(_state.label){
                                                    case 0:
                                                        CHUNK_SIZE = 1000;
                                                        i = 0;
                                                        _state.label = 1;
                                                    case 1:
                                                        if (!(i < sanitizedData.length)) return [
                                                            3,
                                                            4
                                                        ];
                                                        chunk = sanitizedData.slice(i, i + CHUNK_SIZE);
                                                        return [
                                                            4,
                                                            this.processChunk(chunk, trx, uploadedTrack, userId, filename, csvlink)
                                                        ];
                                                    case 2:
                                                        _state.sent();
                                                        _state.label = 3;
                                                    case 3:
                                                        i += CHUNK_SIZE;
                                                        return [
                                                            3,
                                                            1
                                                        ];
                                                    case 4:
                                                        return [
                                                            2
                                                        ];
                                                }
                                            });
                                        }).call(_this);
                                    })
                                ];
                            case 4:
                                _state.sent();
                                return [
                                    2,
                                    this.serviceResponse(HttpStatusCode.Ok, {
                                        totalRecords: parsedData.length,
                                        totalSuccessful: parsedData.length,
                                        failedRecord: 0
                                    }, 'File data successfully uploaded and inserted into the database')
                                ];
                            case 5:
                                error = _state.sent();
                                console.error('Transaction failed:', error.message);
                                throw error;
                            case 6:
                                if (image.buffer) {
                                    image.buffer = null;
                                    console.log('Buffer cleared successfully');
                                }
                                return [
                                    7
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
            key: "webengageUsers",
            value: function webengageUsers(userData) {
                return _async_to_generator(function() {
                    var WEBENGAGE_URL, response;
                    return _ts_generator(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                WEBENGAGE_URL = "".concat(config.webengageHost, "/v1/accounts/").concat(config.webengageLicenseCode, "/users");
                                return [
                                    4,
                                    axios.post(WEBENGAGE_URL, userData, {
                                        headers: {
                                            Authorization: "Bearer ".concat(config.webengageApiKey),
                                            'Content-Type': 'application/json'
                                        }
                                    })
                                ];
                            case 1:
                                response = _state.sent();
                                return [
                                    2,
                                    this.serviceResponse(200, response.data, 'send user data successfully')
                                ];
                        }
                    });
                }).call(this);
            }
        },
        {
            key: "webengageEvents",
            value: function webengageEvents(eventData) {
                return _async_to_generator(function() {
                    var WEBENGAGE_URL, response, error, _error_response;
                    return _ts_generator(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                WEBENGAGE_URL = "".concat(config.webengageHost, "/v1/accounts/").concat(config.webengageLicenseCode, "/events");
                                _state.label = 1;
                            case 1:
                                _state.trys.push([
                                    1,
                                    3,
                                    ,
                                    4
                                ]);
                                return [
                                    4,
                                    axios.post(WEBENGAGE_URL, eventData, {
                                        headers: {
                                            Authorization: "Bearer ".concat(config.webengageApiKey),
                                            'Content-Type': 'application/json'
                                        }
                                    })
                                ];
                            case 2:
                                response = _state.sent();
                                if (response.data.response.status === 'queued') {
                                    return [
                                        2,
                                        this.serviceResponse(200, response.data, 'send events successfully')
                                    ];
                                } else {
                                    return [
                                        2,
                                        this.serviceResponse(500, {}, 'Error in sending events to webengage')
                                    ];
                                }
                                return [
                                    3,
                                    4
                                ];
                            case 3:
                                error = _state.sent();
                                console.error('WebEngage API Error:', ((_error_response = error.response) === null || _error_response === void 0 ? void 0 : _error_response.data) || error.message);
                                return [
                                    2,
                                    this.serviceResponse(400, {}, 'Invalid request sent to WebEngage')
                                ];
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
            key: "callRepayDateBulkMandate",
            value: function callRepayDateBulkMandate() {
                return _async_to_generator(function() {
                    var db, date, emiQuery, paydayLeadIDs, loanDetails, loan_data, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, mnd, _ref, _ebulkemd_message, _mnd_amountPayable, ebulkemd, statusKey, data, err;
                    return _ts_generator(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                db = getKnexInstance();
                                if (!db) {
                                    console.error('Failed to initialize the Knex instance.');
                                }
                                //const date = '2025-01-08'
                                date = format(new Date(), 'yyyy-MM-dd');
                                return [
                                    4,
                                    db('equated_monthly_installments as emi').select('emi.leadID', 'emi.customerID', 'emi.dueDate', 'emi.amountPayable', 'rm.id').select(db.raw("'emi' AS source")).innerJoin('razorpay_mandate as rm', function(join) {
                                        join.on('emi.customerID', '=', 'rm.customerID').on('rm.status', '=', db.raw('?', [
                                            'paid'
                                        ])).on(db.raw('DATE_ADD(rm.credated_date, INTERVAL 270 DAY) > ?', [
                                            new Date()
                                        ]));
                                    }).whereRaw('DATE(emi.dueDate) = ?', [
                                        date
                                    ]).where('emi.status', 'due').union(function() {
                                        this.select('leads.leadID', 'leads.customerID', 'rm.id', db.raw('approval.repayDate as dueDate'), db.raw('approval.loanAmtApproved as amountPayable'), db.raw("'payday' AS source")).from('leads').innerJoin('approval', 'leads.leadID', 'approval.leadID').innerJoin('razorpay_mandate as rm', function(join) {
                                            join.on('leads.customerID', '=', 'rm.customerID').on('rm.status', '=', db.raw('?', [
                                                'paid'
                                            ])).on(db.raw('DATE_ADD(rm.credated_date, INTERVAL 270 DAY) > ?', [
                                                new Date()
                                            ]));
                                        }).whereRaw('DATE(approval.repayDate) = ?', [
                                            date
                                        ]).whereIn('leads.status', [
                                            'Disbursed',
                                            'Part Payment'
                                        ]);
                                    })
                                ];
                            case 1:
                                emiQuery = _state.sent();
                                paydayLeadIDs = emiQuery.filter(function(item) {
                                    return item.source === 'payday';
                                }).map(function(item) {
                                    return item.leadID;
                                });
                                if (!(paydayLeadIDs.length > 0)) return [
                                    3,
                                    3
                                ];
                                return [
                                    4,
                                    db('approval as a').select('a.leadID', 'a.loanAmtApproved', 'a.roi', 'a.repayDate', 'l.disbursalDate', 'l.disbursalAmount').join('loan as l', 'l.leadID', 'a.leadID').whereIn('a.leadID', paydayLeadIDs)
                                ];
                            case 2:
                                loanDetails = _state.sent();
                                console.log('loanDetails', loanDetails);
                                emiQuery.forEach(function(entry) {
                                    if (entry.source === 'payday') {
                                        var loanDetail = loanDetails.find(function(loan) {
                                            return loan.leadID === entry.leadID;
                                        });
                                        if (loanDetail) {
                                            var tenure = differenceInCalendarDays(new Date(loanDetail.repayDate), new Date(loanDetail.disbursalDate));
                                            var interest = loanDetail.roi * loanDetail.loanAmtApproved * tenure / 100;
                                            entry.amountPayable = +Math.round(interest + Number(loanDetail.loanAmtApproved)).toString();
                                        }
                                    }
                                });
                                _state.label = 3;
                            case 3:
                                if (!emiQuery || emiQuery.length === 0) {
                                    console.log('No mandates found for the given conditions.');
                                }
                                loan_data = [];
                                _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
                                _state.label = 4;
                            case 4:
                                _state.trys.push([
                                    4,
                                    10,
                                    11,
                                    12
                                ]);
                                _iterator = emiQuery[Symbol.iterator]();
                                _state.label = 5;
                            case 5:
                                if (!!(_iteratorNormalCompletion = (_step = _iterator.next()).done)) return [
                                    3,
                                    9
                                ];
                                mnd = _step.value;
                                return [
                                    4,
                                    this.submitEmdChargeDueDate(mnd.customerID, mnd.leadID, mnd.id, mnd.amountPayable)
                                ];
                            case 6:
                                ebulkemd = _state.sent();
                                statusKey = (_ref = ebulkemd === null || ebulkemd === void 0 ? void 0 : ebulkemd.status) !== null && _ref !== void 0 ? _ref : '2';
                                data = {
                                    customerID: mnd.customerID,
                                    leadID: mnd.leadID,
                                    callType: 'IVR',
                                    status: statusKey,
                                    remark: (_ebulkemd_message = ebulkemd.message) !== null && _ebulkemd_message !== void 0 ? _ebulkemd_message : "Lead Id (".concat(mnd.leadID, ") in Processed for mandate"),
                                    noteli: ' ',
                                    appAmount: (_mnd_amountPayable = mnd.amountPayable) !== null && _mnd_amountPayable !== void 0 ? _mnd_amountPayable : 0,
                                    callbackTime: new Date().toISOString().split('T')[0],
                                    calledBy: 221,
                                    createdDate: new Date()
                                };
                                return [
                                    4,
                                    db('callhistoryLogs').insert(data)
                                ];
                            case 7:
                                _state.sent();
                                _state.label = 8;
                            case 8:
                                _iteratorNormalCompletion = true;
                                return [
                                    3,
                                    5
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
                                    2
                                ];
                        }
                    });
                }).call(this);
            }
        },
        {
            key: "submitEmdChargeDueDate",
            value: function submitEmdChargeDueDate(customerID, leadId, emID, emAmount) {
                return _async_to_generator(function() {
                    var _ref, _ref1, _ref2, _ref3, _orderResponse_id, _ref4, _ref5, _ref6, _ref7, _ref8, _ref9, _ref10, _ref11, _paymentResponse_razorpay_payment_id, _ref12, _ref13, _ref14, _ref15, _paymentResponse_razorpay_payment_id1, db, ema, data1, orderResponse, _orderResponse_error_description, message, orderID, data2, paymentResponse, _paymentResponse_error_description, message1, orderIDValue, customerData;
                    return _ts_generator(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                db = getKnexInstance();
                                return [
                                    4,
                                    db('razorpay_mandate').where('id', emID).first()
                                ];
                            case 1:
                                ema = _state.sent();
                                data1 = {
                                    amount: emAmount * 100,
                                    currency: 'INR',
                                    payment_capture: true,
                                    leadID: leadId,
                                    customerID: customerID,
                                    customer_id: (_ref = ema === null || ema === void 0 ? void 0 : ema.customer_id) !== null && _ref !== void 0 ? _ref : customerID,
                                    receipt: 'INR',
                                    notes: {
                                        notes_key_1: (_ref1 = ema === null || ema === void 0 ? void 0 : ema.cust_name) !== null && _ref1 !== void 0 ? _ref1 : '',
                                        notes_key_2: (_ref2 = ema === null || ema === void 0 ? void 0 : ema.cust_name) !== null && _ref2 !== void 0 ? _ref2 : ''
                                    }
                                };
                                return [
                                    4,
                                    this.sendRazorpayRequestNew("".concat(config.razorPayBaseUrl, "/orders/"), data1, 'e-mandate nach orders')
                                ];
                            case 2:
                                orderResponse = _state.sent();
                                if (orderResponse.error && orderResponse.error.description) {
                                    ;
                                    message = (_orderResponse_error_description = orderResponse.error.description) !== null && _orderResponse_error_description !== void 0 ? _orderResponse_error_description : 'data error by third party';
                                    return [
                                        2,
                                        {
                                            status: '3',
                                            leadId: leadId,
                                            customerID: customerID,
                                            message: 'Mandate is not active[Error received from razorpay]'
                                        }
                                    ];
                                }
                                return [
                                    4,
                                    db('razorpay_emOrder').insert({
                                        emID: (_ref3 = ema === null || ema === void 0 ? void 0 : ema.id) !== null && _ref3 !== void 0 ? _ref3 : emID,
                                        customerID: customerID,
                                        leadID: leadId,
                                        orderID: orderResponse.id,
                                        entity: orderResponse.entity,
                                        amount: orderResponse.amount / 100,
                                        amount_paid: orderResponse.amount_paid,
                                        amount_due: orderResponse.amount_due / 100,
                                        currency: orderResponse.currency,
                                        receipt: orderResponse.receipt,
                                        status: orderResponse.status,
                                        razorpay_payment_id: 'no payment',
                                        razorpay_signature: 'no signature',
                                        razorpay_order_id: (_orderResponse_id = orderResponse.id) !== null && _orderResponse_id !== void 0 ? _orderResponse_id : 'no order',
                                        notes_key_1: orderResponse.notes.notes_key_1,
                                        tokenID: (_ref4 = ema === null || ema === void 0 ? void 0 : ema.token_id) !== null && _ref4 !== void 0 ? _ref4 : 'token_XYZ',
                                        uid: 221,
                                        createdDate: new Date(),
                                        remarks: 'Auto Collect'
                                    })
                                ];
                            case 3:
                                orderID = _state.sent();
                                if (!orderID) {
                                    return [
                                        2,
                                        {
                                            status: '3',
                                            leadId: leadId,
                                            customerID: customerID,
                                            message: 'Order insertion failed'
                                        }
                                    ];
                                }
                                data2 = {
                                    email: (_ref5 = ema === null || ema === void 0 ? void 0 : ema.cust_email) !== null && _ref5 !== void 0 ? _ref5 : '',
                                    contact: (_ref6 = ema === null || ema === void 0 ? void 0 : ema.cust_contact) !== null && _ref6 !== void 0 ? _ref6 : '',
                                    leadID: leadId,
                                    amount: emAmount * 100,
                                    currency: 'INR',
                                    order_id: orderResponse.id,
                                    customerID: customerID,
                                    customer_id: (_ref7 = ema === null || ema === void 0 ? void 0 : ema.customer_id) !== null && _ref7 !== void 0 ? _ref7 : '',
                                    token: (_ref8 = ema === null || ema === void 0 ? void 0 : ema.token_id) !== null && _ref8 !== void 0 ? _ref8 : 'token_XYZ',
                                    recurring: '1',
                                    description: (_ref9 = ema === null || ema === void 0 ? void 0 : ema.cust_name) !== null && _ref9 !== void 0 ? _ref9 : '',
                                    notes: {
                                        notes_key_1: (_ref10 = ema === null || ema === void 0 ? void 0 : ema.cust_name) !== null && _ref10 !== void 0 ? _ref10 : '',
                                        notes_key_2: (_ref11 = ema === null || ema === void 0 ? void 0 : ema.cust_name) !== null && _ref11 !== void 0 ? _ref11 : ''
                                    }
                                };
                                return [
                                    4,
                                    this.sendRazorpayRequestNew("".concat(config.razorPayBaseUrl, "/payments/create/recurring/"), data2, 'e-mandate nach recurring')
                                ];
                            case 4:
                                paymentResponse = _state.sent();
                                if (paymentResponse.error && paymentResponse.error.description) {
                                    ;
                                    message1 = (_paymentResponse_error_description = paymentResponse.error.description) !== null && _paymentResponse_error_description !== void 0 ? _paymentResponse_error_description : 'data error by third party';
                                    return [
                                        2,
                                        {
                                            status: '3',
                                            leadId: leadId,
                                            customerID: customerID,
                                            message: 'Mandate is not active[Error received from razorpay]'
                                        }
                                    ];
                                }
                                if (Array.isArray(orderID) && orderID.length > 0) {
                                    orderIDValue = orderID[0];
                                }
                                return [
                                    4,
                                    db('razorpay_emOrder').where('id', orderIDValue).update({
                                        razorpay_payment_id: (_paymentResponse_razorpay_payment_id = paymentResponse.razorpay_payment_id) !== null && _paymentResponse_razorpay_payment_id !== void 0 ? _paymentResponse_razorpay_payment_id : 'no payment id',
                                        razorpay_order_id: orderResponse.id,
                                        razorpay_signature: paymentResponse.razorpay_signature
                                    })
                                ];
                            case 5:
                                _state.sent();
                                return [
                                    4,
                                    db('customer').where('customerID', customerID).first()
                                ];
                            case 6:
                                customerData = _state.sent();
                                // same here
                                return [
                                    4,
                                    db('onlinepayment').insert({
                                        name: (_ref12 = customerData === null || customerData === void 0 ? void 0 : customerData.name) !== null && _ref12 !== void 0 ? _ref12 : '',
                                        email: (_ref13 = customerData === null || customerData === void 0 ? void 0 : customerData.email) !== null && _ref13 !== void 0 ? _ref13 : '',
                                        phone: (_ref14 = customerData === null || customerData === void 0 ? void 0 : customerData.mobile) !== null && _ref14 !== void 0 ? _ref14 : '',
                                        service: 'Ramfincorp',
                                        typeProduct: 'E-mandate',
                                        toValue: orderResponse.amount / 100,
                                        message: (_ref15 = customerData === null || customerData === void 0 ? void 0 : customerData.pancard) !== null && _ref15 !== void 0 ? _ref15 : '',
                                        razorpayOrderId: orderResponse.id,
                                        razorpayPaymentId: (_paymentResponse_razorpay_payment_id1 = paymentResponse.razorpay_payment_id) !== null && _paymentResponse_razorpay_payment_id1 !== void 0 ? _paymentResponse_razorpay_payment_id1 : 'no payment id',
                                        paymentStatus: 'PENDING',
                                        makerstamp: new Date(),
                                        updatestamp: new Date(),
                                        status: 'no',
                                        paymentType: 'E-mandate Charge',
                                        method: 'E-mandate',
                                        leadID: leadId
                                    })
                                ];
                            case 7:
                                _state.sent();
                                return [
                                    2,
                                    {
                                        status: '4',
                                        leadId: leadId,
                                        customerID: customerID,
                                        message: 'Success'
                                    }
                                ];
                        }
                    });
                }).call(this);
            }
        },
        {
            key: "fetchPaymentsFromRazorpay",
            value: function fetchPaymentsFromRazorpay(from, to) {
                return _async_to_generator(function() {
                    var payments, skip, count, response, fetchedItems, error, _error_response;
                    return _ts_generator(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                payments = [];
                                skip = 0;
                                count = 100;
                                _state.label = 1;
                            case 1:
                                if (!true) return [
                                    3,
                                    6
                                ];
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
                                    axios.get("".concat(config.razorPayBaseUrl, "/payments?from=").concat(from, "&to=").concat(to, "&count=").concat(count, "&skip=").concat(skip), {
                                        auth: {
                                            username: config.razorpayDisbursalKeyId,
                                            password: config.razorpayDisbursalKeySecret
                                        }
                                    })
                                ];
                            case 3:
                                response = _state.sent();
                                fetchedItems = response.data.items || [];
                                payments = payments.concat(fetchedItems);
                                console.log("Fetched ".concat(fetchedItems.length, " payments (Skip: ").concat(skip, ")"));
                                if (fetchedItems.length < count) return [
                                    3,
                                    6
                                ];
                                skip += count;
                                return [
                                    3,
                                    5
                                ];
                            case 4:
                                error = _state.sent();
                                console.error('Error fetching payments:', ((_error_response = error.response) === null || _error_response === void 0 ? void 0 : _error_response.data) || error.message);
                                return [
                                    3,
                                    6
                                ];
                            case 5:
                                return [
                                    3,
                                    1
                                ];
                            case 6:
                                return [
                                    2,
                                    payments
                                ];
                        }
                    });
                })();
            }
        },
        {
            key: "processPayments",
            value: function processPayments(payments) {
                return _async_to_generator(function() {
                    var db, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, payment, orderId, paymentData, _error_response, err;
                    return _ts_generator(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                db = getKnexInstance();
                                _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
                                _state.label = 1;
                            case 1:
                                _state.trys.push([
                                    1,
                                    6,
                                    7,
                                    8
                                ]);
                                _iterator = payments[Symbol.iterator]();
                                _state.label = 2;
                            case 2:
                                if (!!(_iteratorNormalCompletion = (_step = _iterator.next()).done)) return [
                                    3,
                                    5
                                ];
                                payment = _step.value;
                                if (!(payment.status === 'captured')) return [
                                    3,
                                    4
                                ];
                                orderId = payment.order_id;
                                return [
                                    4,
                                    db('onlinepayment').where('razorpayOrderId', orderId).first()
                                ];
                            case 3:
                                paymentData = _state.sent();
                                if (!paymentData || paymentData.paymentStatus !== 'SUCCESS') {
                                    console.log("Calling addCollection API for order_id: ".concat(orderId));
                                    try {
                                        // await axios.post(ADD_COLLECTION_API_URL, { order_id: orderId });
                                        console.log('calling add collection api ================>>>>>>>>>>>', orderId);
                                    } catch (error) {
                                        ;
                                        console.error("Error calling addCollection API for order_id ".concat(orderId, ":"), ((_error_response = error.response) === null || _error_response === void 0 ? void 0 : _error_response.data) || error.message);
                                    }
                                } else {
                                    console.log("Order ID ".concat(orderId, " already exists with SUCCESS status."));
                                }
                                _state.label = 4;
                            case 4:
                                _iteratorNormalCompletion = true;
                                return [
                                    3,
                                    2
                                ];
                            case 5:
                                return [
                                    3,
                                    8
                                ];
                            case 6:
                                err = _state.sent();
                                _didIteratorError = true;
                                _iteratorError = err;
                                return [
                                    3,
                                    8
                                ];
                            case 7:
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
                            case 8:
                                return [
                                    2
                                ];
                        }
                    });
                })();
            }
        },
        {
            key: "loanDetailsByPan",
            value: function loanDetailsByPan(payload) {
                return _async_to_generator(function() {
                    var pancard, customer, leadData, loanData, callHistoryLogs, data;
                    return _ts_generator(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                pancard = payload.pancard;
                                return [
                                    4,
                                    this.customerModel.findOneCustomer({
                                        pancard: pancard
                                    }, [
                                        'customerID'
                                    ], [
                                        {
                                            column: 'customerID',
                                            order: 'desc'
                                        }
                                    ])
                                ];
                            case 1:
                                customer = _state.sent();
                                if (!customer) {
                                    throw new BadRequestError('customer not found');
                                }
                                return [
                                    4,
                                    this.leadService.findOne({
                                        customerID: customer.customerID
                                    }, [
                                        'customerID',
                                        'leadID',
                                        'status',
                                        'createdDate'
                                    ])
                                ];
                            case 2:
                                leadData = _state.sent();
                                if (!leadData) {
                                    throw new BadRequestError('till now leadNot Created ');
                                }
                                return [
                                    4,
                                    loanService.findOne({
                                        leadID: leadData.leadID
                                    }, [
                                        'loanNo',
                                        'disbursalAmount',
                                        'disbursalDate',
                                        'createdDate',
                                        'status'
                                    ], [
                                        {
                                            column: 'loanID',
                                            order: 'desc'
                                        }
                                    ])
                                ];
                            case 3:
                                loanData = _state.sent();
                                if (!loanData) {
                                    throw new BadRequestError('there is no loan found in ramfincorp');
                                }
                                return [
                                    4,
                                    this.callHistoryLogsModel.findOne({
                                        where: {
                                            leadID: leadData.leadID
                                        },
                                        select: [
                                            'createdDate'
                                        ],
                                        order: [
                                            {
                                                column: 'callHistoryID',
                                                order: 'desc'
                                            }
                                        ]
                                    })
                                ];
                            case 4:
                                callHistoryLogs = _state.sent();
                                data = {
                                    dateOfApplication: loanData.createdDate.toISOString().split('T')[0],
                                    leadID: leadData.leadID,
                                    loanAmount: loanData.disbursalAmount,
                                    status: loanData.status,
                                    dateOfLastStatusChange: callHistoryLogs.createdDate.toISOString().split('T')[0]
                                };
                                return [
                                    2,
                                    this.serviceResponse(200, data, 'loan Data from ramfincorp')
                                ];
                        }
                    });
                }).call(this);
            }
        }
    ]);
    return CrmService;
}(ResponseService);
export var crmService = new CrmService();

//# sourceMappingURL=crm.service.js.map