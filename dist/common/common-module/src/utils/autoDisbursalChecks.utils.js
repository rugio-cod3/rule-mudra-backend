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
import momentTz from 'moment-timezone';
import ApprovalModel from '../../../../database/mysql/approval';
import LeadModel from '../../../../database/mysql/leads';
import RazorpayMandateModel from '../../../../database/mysql/razorpay_mandate';
import LeadApiLogService from '../../../../services/lead_api_log.service';
import LoanService from '../../../../services/loan.service';
import AppVideoModel from '../database/mysql/appVideo';
import PennyDropModel from '../database/mysql/pennyDrop';
import BlackListCustomerModel from '../database/mysql/blackListCustomer';
import { ApiSupplierType, LeadLogApiType } from '../enums/common.enum';
import { leadsApiLogModel } from '../database/mysql/leadApiLogs';
import { CollectionStatus } from '../enums/collectionStatus.enum';
import { NameMatchType } from '../enums/finbox.enum';
import { LeadStatus, LeadType } from '../enums/leadStatus.enum';
import { PennyStatus } from '../enums/pennyDrop.enum';
import FinboxService from '../services/thirdParty/finbox.service';
var leadApiLogService = new LeadApiLogService();
var findBoxService = new FinboxService();
//const leadsApiLogModel = new LeadApiLogModel()
var approvalModel = new ApprovalModel();
var appVideoModel = new AppVideoModel();
var leadModel = new LeadModel();
var razorpayMandateModel = new RazorpayMandateModel();
var pennyDropModel = new PennyDropModel();
var loanService = new LoanService();
var blackListCustomerModel = new BlackListCustomerModel();
function checkPanAadharLastFourDigits(customerID, mobile, leadID, aadharNo, pancard) {
    return _async_to_generator(function() {
        var panData, dob, masked_aadhaar, aadharData, aadharResp, aadharFullName, aadharDob, _$aadharNo, panAadhar, lastFourDigitsAadhar, fourDigitMatch, dobMatch, digiAadhar, aadarResponse, _aadarResponse_proofOfIdentity, aadharDob1, aadharFullName1, _$aadharNo1, panAadhar1, lastFourDigitsAadhar1, aadharDobFormatted, fourDigitMatch1, dobMatch1, digiAadhar1, aadarResponse1, _aadarResponse_proofOfIdentity1, aadharDob2, aadharFullName2, aadharNoDigi, panAadhar2, lastFourDigitsAadhar2, aadharDobFormatted1, fourDigitMatch2, dobMatch2;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    return [
                        4,
                        leadApiLogService.findPanComprehensiveResponse(pancard, String(mobile))
                    ];
                case 1:
                    panData = _state.sent();
                    dob = panData.dob, masked_aadhaar = panData.masked_aadhaar;
                    if (!aadharNo) return [
                        3,
                        10
                    ];
                    return [
                        4,
                        leadsApiLogModel.findOneLeadsApiLog({
                            status: 1,
                            api_type: LeadLogApiType.AADHAR_V2_SUBMIT_OTP,
                            api_supplier: ApiSupplierType.SUREPASS,
                            mobile_no: String(mobile)
                        }, [
                            'api_response'
                        ], [
                            {
                                column: 'id',
                                order: 'desc'
                            }
                        ])
                    ];
                case 2:
                    aadharData = _state.sent();
                    if (!aadharData) return [
                        3,
                        5
                    ];
                    aadharResp = JSON.parse(aadharData.api_response).data;
                    aadharFullName = aadharResp.full_name, aadharDob = aadharResp.dob, _$aadharNo = aadharResp.aadhaar_number;
                    panAadhar = masked_aadhaar.slice(-4);
                    lastFourDigitsAadhar = _$aadharNo.slice(-4);
                    return [
                        4,
                        findBoxService.checkNamePercentage({
                            customerID: customerID,
                            leadId: leadID,
                            customerMobileNo: String(mobile),
                            firstName: panAadhar,
                            secondName: lastFourDigitsAadhar,
                            type: NameMatchType.KFS
                        }, false)
                    ];
                case 3:
                    fourDigitMatch = _state.sent();
                    if (fourDigitMatch.percentageResult !== 100) return [
                        2,
                        false
                    ];
                    return [
                        4,
                        findBoxService.checkNamePercentage({
                            customerID: customerID,
                            leadId: leadID,
                            customerMobileNo: String(mobile),
                            firstName: dob,
                            secondName: aadharDob,
                            type: NameMatchType.KFS
                        }, false)
                    ];
                case 4:
                    dobMatch = _state.sent();
                    if (dobMatch.percentageResult !== 100) return [
                        2,
                        false
                    ];
                    return [
                        2,
                        true
                    ];
                case 5:
                    return [
                        4,
                        leadsApiLogModel.findOneLeadsApiLog({
                            status: 1,
                            api_type: LeadLogApiType.DIGILOCKER_EAADHAR,
                            api_supplier: ApiSupplierType.DECENTRO,
                            mobile_no: String(mobile)
                        }, [
                            'api_response'
                        ], [
                            {
                                column: 'id',
                                order: 'desc'
                            }
                        ])
                    ];
                case 6:
                    digiAadhar = _state.sent();
                    aadarResponse = JSON.parse(digiAadhar.api_response).data;
                    _aadarResponse_proofOfIdentity = aadarResponse.proofOfIdentity, aadharDob1 = _aadarResponse_proofOfIdentity.dob, aadharFullName1 = _aadarResponse_proofOfIdentity.name, _$aadharNo1 = aadarResponse.aadhaarUid;
                    panAadhar1 = masked_aadhaar.slice(-4);
                    lastFourDigitsAadhar1 = _$aadharNo1.slice(-4);
                    aadharDobFormatted = momentTz(aadharDob1, 'DD-MM-YYYY').format('YYYY-MM-DD');
                    return [
                        4,
                        findBoxService.checkNamePercentage({
                            customerID: customerID,
                            leadId: leadID,
                            customerMobileNo: String(mobile),
                            firstName: panAadhar1,
                            secondName: lastFourDigitsAadhar1,
                            type: NameMatchType.KFS
                        }, false)
                    ];
                case 7:
                    fourDigitMatch1 = _state.sent();
                    if (fourDigitMatch1.percentageResult !== 100) return [
                        2,
                        false
                    ];
                    return [
                        4,
                        findBoxService.checkNamePercentage({
                            customerID: customerID,
                            leadId: leadID,
                            customerMobileNo: String(mobile),
                            firstName: dob,
                            secondName: aadharDobFormatted,
                            type: NameMatchType.KFS
                        }, false)
                    ];
                case 8:
                    dobMatch1 = _state.sent();
                    if (dobMatch1.percentageResult !== 100) return [
                        2,
                        false
                    ];
                    return [
                        2,
                        true
                    ];
                case 9:
                    return [
                        3,
                        14
                    ];
                case 10:
                    return [
                        4,
                        leadsApiLogModel.findOneLeadsApiLog({
                            status: 1,
                            api_type: LeadLogApiType.DIGILOCKER_EAADHAR,
                            api_supplier: ApiSupplierType.DECENTRO,
                            mobile_no: String(mobile)
                        }, [
                            'api_response'
                        ], [
                            {
                                column: 'id',
                                order: 'desc'
                            }
                        ])
                    ];
                case 11:
                    digiAadhar1 = _state.sent();
                    if (!digiAadhar1) return [
                        2,
                        false
                    ];
                    aadarResponse1 = JSON.parse(digiAadhar1.api_response).data;
                    _aadarResponse_proofOfIdentity1 = aadarResponse1.proofOfIdentity, aadharDob2 = _aadarResponse_proofOfIdentity1.dob, aadharFullName2 = _aadarResponse_proofOfIdentity1.name, aadharNoDigi = aadarResponse1.aadhaarUid;
                    panAadhar2 = masked_aadhaar.slice(-4);
                    lastFourDigitsAadhar2 = aadharNo.slice(-4);
                    aadharDobFormatted1 = momentTz(aadharDob2, 'DD-MM-YYYY').format('YYYY-MM-DD');
                    return [
                        4,
                        findBoxService.checkNamePercentage({
                            customerID: customerID,
                            leadId: leadID,
                            customerMobileNo: String(mobile),
                            firstName: panAadhar2,
                            secondName: lastFourDigitsAadhar2,
                            type: NameMatchType.KFS
                        }, false)
                    ];
                case 12:
                    fourDigitMatch2 = _state.sent();
                    if (fourDigitMatch2.percentageResult !== 100) return [
                        2,
                        false
                    ];
                    return [
                        4,
                        findBoxService.checkNamePercentage({
                            customerID: customerID,
                            leadId: leadID,
                            customerMobileNo: String(mobile),
                            firstName: dob,
                            secondName: aadharDobFormatted1,
                            type: NameMatchType.KFS
                        }, false)
                    ];
                case 13:
                    dobMatch2 = _state.sent();
                    if (dobMatch2.percentageResult !== 100) return [
                        2,
                        false
                    ];
                    return [
                        2,
                        true
                    ];
                case 14:
                    return [
                        2
                    ];
            }
        });
    })();
}
function selfieCheck(mobile) {
    return _async_to_generator(function() {
        var data, decodeData;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    return [
                        4,
                        leadsApiLogModel.findOneLeadsApiLog({
                            mobile_no: mobile,
                            api_supplier: ApiSupplierType.FACE_MATCH,
                            status: 1,
                            api_type: LeadLogApiType.FACE_MATCH
                        }, [
                            'api_response'
                        ], [
                            {
                                column: 'id',
                                order: 'desc'
                            }
                        ])
                    ];
                case 1:
                    data = _state.sent();
                    if (data && data.api_response) {
                        decodeData = JSON.parse(data.api_response);
                        if (decodeData.status === 'success' && decodeData.statusCode == '200') {
                            if (decodeData.result.person_image_correctly_identified === true) {
                                return [
                                    2,
                                    true
                                ];
                            }
                        }
                    }
                    return [
                        2,
                        false
                    ];
            }
        });
    })();
}
function checkTenure(customerID, leadID) {
    return _async_to_generator(function() {
        var approval, currentDate, repayDate, dateDiff;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    return [
                        4,
                        approvalModel.findOneApproval({
                            customerID: customerID,
                            leadID: leadID
                        }, [
                            'repayDate'
                        ])
                    ];
                case 1:
                    approval = _state.sent();
                    if (approval) {
                        currentDate = momentTz().tz('Asia/Kolkata');
                        repayDate = momentTz(approval.repayDate);
                        dateDiff = currentDate.diff(repayDate, 'days');
                        if (dateDiff > 5 && dateDiff <= 40) {
                            return [
                                2,
                                true
                            ];
                        }
                    }
                    return [
                        2,
                        false
                    ];
            }
        });
    })();
}
function checkSalaryGapAndRepayDate(customerID, leadID, salaryDate) {
    return _async_to_generator(function() {
        var approval, repayDate, repayDateDay, daysDiff, currentDate, diff;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    return [
                        4,
                        approvalModel.findOneApproval({
                            customerID: customerID,
                            leadID: leadID
                        }, [
                            'repayDate'
                        ])
                    ];
                case 1:
                    approval = _state.sent();
                    if (approval) {
                        repayDate = momentTz(approval.repayDate);
                        repayDateDay = repayDate.day();
                        daysDiff = salaryDate - repayDateDay;
                        if (daysDiff > 5) {
                            currentDate = momentTz().tz('Asia/Kolkata');
                            currentDate = momentTz().add(1, 'month');
                            currentDate = momentTz().set({
                                year: currentDate.year(),
                                month: currentDate.month(),
                                date: salaryDate
                            });
                            diff = currentDate.day() - repayDateDay;
                            if (diff > 5) {
                                return [
                                    2,
                                    false
                                ];
                            }
                        }
                        return [
                            2,
                            true
                        ];
                    }
                    return [
                        2,
                        true
                    ];
            }
        });
    })();
}
function checkSelfieVideo(customerID) {
    return _async_to_generator(function() {
        var video;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    return [
                        4,
                        appVideoModel.findOne({
                            where: {
                                customerID: customerID,
                                rejected_status: '0'
                            },
                            select: [
                                'vid'
                            ]
                        })
                    ];
                case 1:
                    video = _state.sent();
                    if (video) {
                        return [
                            2,
                            true
                        ];
                    }
                    return [
                        2,
                        true // always true
                    ];
            }
        });
    })();
}
function checkPennyDropStatusNameMatch(customerID, emdID, pancard, mobile, leadID, aadharNo) {
    return _async_to_generator(function() {
        var emandDetails;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    return [
                        4,
                        razorpayMandateModel.findOne({
                            where: {
                                customerID: customerID,
                                id: emdID
                            },
                            select: [
                                'accountNo'
                            ]
                        })
                    ];
                case 1:
                    emandDetails = _state.sent();
                    if (!emandDetails) {
                        return [
                            2,
                            false
                        ];
                    }
                    return [
                        4,
                        this.pennyDropStatusNameMatch(+customerID, emandDetails.accountNo, pancard, mobile, leadID, aadharNo)
                    ];
                case 2:
                    return [
                        2,
                        _state.sent()
                    ];
            }
        });
    }).call(this);
}
function checkAddressEmployementReference(customerID, leadID) {
    return _async_to_generator(function() {
        var lead, referenceCount;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    return [
                        4,
                        leadModel.LeadsKnex.join('approval as a', 'a.leadID', 'leads.leadID').where('leads.customerID', customerID).where('leads.leadID', leadID).select('leads.fbLeads', 'a.loanAmtApproved').first()
                    ];
                case 1:
                    lead = _state.sent();
                    if ((lead.fbLeads === LeadType.NEW_CASE || lead.fbLeads === LeadType.EXISTING_CASE) && lead.loanAmtApproved <= 26000) {
                        return [
                            2,
                            true
                        ];
                    }
                    return [
                        4,
                        this.referenceModel.count({
                            where: {
                                customerID: customerID
                            }
                        })
                    ];
                case 2:
                    referenceCount = _state.sent();
                    if (referenceCount > 0) {
                        return [
                            2,
                            true
                        ];
                    }
                    return [
                        2,
                        false
                    ];
            }
        });
    }).call(this);
}
function checkLeadStatus(customerID, mobile) {
    return _async_to_generator(function() {
        var _ref, lead, blackListCustomer;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    return [
                        4,
                        Promise.all([
                            leadModel.findOne({
                                where: {
                                    customerID: customerID
                                },
                                whereIn: [
                                    {
                                        column: 'status',
                                        value: [
                                            LeadStatus.DISBURSED,
                                            LeadStatus.PART_PAYMENT,
                                            LeadStatus.SETTLEMENT,
                                            LeadStatus.BLACK_LISTED
                                        ]
                                    }
                                ],
                                select: [
                                    'leadID'
                                ]
                            }),
                            blackListCustomerModel.findOne({
                                where: {
                                    mobile: mobile
                                },
                                select: [
                                    'id'
                                ]
                            })
                        ])
                    ];
                case 1:
                    _ref = _sliced_to_array.apply(void 0, [
                        _state.sent(),
                        2
                    ]), lead = _ref[0], blackListCustomer = _ref[1];
                    if (!lead && !blackListCustomer) {
                        return [
                            2,
                            true
                        ];
                    }
                    return [
                        2,
                        false
                    ];
            }
        });
    })();
}
function checkMinimunProcessingFee(customerID, leadID) {
    return _async_to_generator(function() {
        return _ts_generator(this, function(_state) {
            return [
                2,
                true
            ];
        });
    })();
}
function checkEmailAcceptance(customerID, leadID) {
    return _async_to_generator(function() {
        var lead;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    return [
                        4,
                        leadModel.findOne({
                            where: {
                                customerID: customerID,
                                leadID: leadID
                            },
                            select: [
                                'kfs'
                            ]
                        })
                    ];
                case 1:
                    lead = _state.sent();
                    if (lead.kfs === '1') return [
                        2,
                        true
                    ];
                    return [
                        2,
                        false
                    ];
            }
        });
    })();
}
function checkEmandateStatus(customerID, leadID, emandateRequired, emdID) {
    return _async_to_generator(function() {
        var approval, emCount;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    return [
                        4,
                        approvalModel.findOneApproval({
                            customerID: customerID,
                            leadID: leadID
                        }, [
                            'loanAmtApproved'
                        ])
                    ];
                case 1:
                    approval = _state.sent();
                    if (!(approval && approval.loanAmtApproved <= 25000 || emandateRequired === '1')) return [
                        3,
                        2
                    ];
                    return [
                        2,
                        true
                    ];
                case 2:
                    if (!(approval.loanAmtApproved > 25000)) return [
                        3,
                        4
                    ];
                    return [
                        4,
                        razorpayMandateModel.count({
                            // where: { customerID: String(customerID), id:emdID },
                            where: [
                                {
                                    column: 'customerID',
                                    value: customerID
                                },
                                {
                                    column: 'id',
                                    value: emdID
                                },
                                {
                                    column: 'emMaxamount',
                                    operator: '>=',
                                    value: approval.loanAmtApproved * 1
                                }
                            ],
                            whereRaw: [
                                {
                                    rawQuery: 'LOWER(status) = ?',
                                    values: [
                                        'paid'
                                    ]
                                }
                            ]
                        })
                    ];
                case 3:
                    emCount = _state.sent();
                    if (emCount > 0) {
                        return [
                            2,
                            true
                        ];
                    }
                    return [
                        2,
                        false
                    ];
                case 4:
                    return [
                        2
                    ];
            }
        });
    })();
}
function checkPennyDropStatus(customerID, leadID, emandateID) {
    return _async_to_generator(function() {
        var rpayMandate, pennyCount;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    return [
                        4,
                        razorpayMandateModel.findOne({
                            where: {
                                customerID: customerID,
                                id: emandateID
                            }
                        })
                    ];
                case 1:
                    rpayMandate = _state.sent();
                    if (!rpayMandate) return [
                        2,
                        false
                    ];
                    return [
                        4,
                        pennyDropModel.count({
                            where: {
                                customerID: customerID,
                                account_number: rpayMandate.accountNo,
                                penny_status: PennyStatus.COMPLETED
                            }
                        })
                    ];
                case 2:
                    pennyCount = _state.sent();
                    if (pennyCount > 0) {
                        return [
                            2,
                            true
                        ];
                    }
                    return [
                        2,
                        false
                    ];
            }
        });
    })();
}
function checkLastLoanDpd(type, customerID) {
    return _async_to_generator(function() {
        var lastClosedLead, lastClosedApproval, lastClosedLoan, lastClosedCollection, lastCollectedDate, lastApprovalRepayDate, daysDiff;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    if (type === 'New Case') {
                        return [
                            2,
                            'N/A'
                        ];
                    }
                    return [
                        4,
                        leadModel.findOne({
                            where: {
                                customerID: customerID,
                                status: LeadStatus.CLOSED
                            },
                            order: [
                                {
                                    column: 'leadID',
                                    order: 'desc'
                                }
                            ],
                            select: [
                                'leadID'
                            ]
                        })
                    ];
                case 1:
                    lastClosedLead = _state.sent();
                    if (!lastClosedLead) return [
                        2,
                        false
                    ];
                    return [
                        4,
                        approvalModel.findOneApproval({
                            customerID: customerID,
                            leadID: lastClosedLead.leadID
                        }, [
                            'repayDate'
                        ])
                    ];
                case 2:
                    lastClosedApproval = _state.sent();
                    if (!lastClosedApproval) return [
                        2,
                        false
                    ];
                    return [
                        4,
                        loanService.findOne({
                            customerID: customerID,
                            leadID: lastClosedLead.leadID
                        })
                    ];
                case 3:
                    lastClosedLoan = _state.sent();
                    if (!lastClosedLoan) {
                        return [
                            2,
                            false
                        ];
                    }
                    return [
                        4,
                        this.collectionModel.findOneCollection({
                            customerID: customerID,
                            leadID: lastClosedLead.leadID,
                            status: CollectionStatus.CLOSED,
                            collectionStatus: CollectionStatus.APPROVED
                        }, [
                            'collectedDate'
                        ])
                    ];
                case 4:
                    lastClosedCollection = _state.sent();
                    if (!lastClosedCollection) {
                        return [
                            2,
                            false
                        ];
                    }
                    lastCollectedDate = momentTz(lastClosedCollection.collectedDate).startOf('day');
                    lastApprovalRepayDate = momentTz(lastClosedApproval.repayDate).startOf('day');
                    daysDiff = lastCollectedDate.diff(lastApprovalRepayDate, 'days');
                    if (daysDiff < 7) {
                        return [
                            2,
                            "The total DPD days for the last loan is ".concat(daysDiff)
                        ];
                    }
                    return [
                        2,
                        'Last loan shows no DPD days recorded'
                    ];
            }
        });
    }).call(this);
}
function checkLoanAmount(customerID, leadID) {
    return _async_to_generator(function() {
        return _ts_generator(this, function(_state) {
            return [
                2,
                true
            ];
        });
    })();
}
function checkApprovedAmount(customerID, leadID) {
    return _async_to_generator(function() {
        return _ts_generator(this, function(_state) {
            return [
                2,
                true
            ];
        });
    })();
}
function checkPennyDropStatusOnAccount(customerID, leadID) {
    return _async_to_generator(function() {
        var loan, pennyStatus;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    return [
                        4,
                        loanService.findOne({
                            customerID: customerID,
                            leadID: leadID
                        }, [
                            'accountNo'
                        ])
                    ];
                case 1:
                    loan = _state.sent();
                    if (!loan) return [
                        2,
                        false
                    ];
                    return [
                        4,
                        pennyDropModel.count({
                            where: {
                                customerID: customerID,
                                account_number: loan.accountNo,
                                penny_status: PennyStatus.COMPLETED
                            }
                        })
                    ];
                case 2:
                    pennyStatus = _state.sent();
                    if (pennyStatus > 0) {
                        return [
                            2,
                            true
                        ];
                    }
                    return [
                        2,
                        false
                    ];
            }
        });
    })();
}
export function autoDisbursalChecks(payload) {
    return _async_to_generator(function() {
        var mobile, customerID, leadID, salaryDate, emandateRequired, emdID, customerType, aadharNo, pancard, checkPanAadharLastFourDigitsData, selfieCheckData, checkTenureData, checkSalaryGapData, checkSelfieVideoData, checkAddressEmployementReferenceData, checkLeadStatusData, checkEmailAcceptanceData, checkEmandateStatusData, checkPennyDropStatusData, lastLoanDpdCheckData, checkPennyDropStatusOnAccountData, checkLoanAmountData, checkMinimunProcessingFeeData, checkApprovedAmountData, returnObj;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    mobile = payload.mobile, customerID = payload.customerID, leadID = payload.leadID, salaryDate = payload.salaryDate, emandateRequired = payload.emandateRequired, emdID = payload.emdID, customerType = payload.customerType, aadharNo = payload.aadharNo, pancard = payload.pancard;
                    return [
                        4,
                        checkPanAadharLastFourDigits(customerID, mobile, leadID, aadharNo, pancard)
                    ];
                case 1:
                    checkPanAadharLastFourDigitsData = _state.sent();
                    return [
                        4,
                        selfieCheck(mobile.toString())
                    ];
                case 2:
                    selfieCheckData = _state.sent();
                    return [
                        4,
                        checkTenure(customerID, leadID)
                    ];
                case 3:
                    checkTenureData = _state.sent();
                    return [
                        4,
                        checkSalaryGapAndRepayDate(customerID, leadID, salaryDate)
                    ];
                case 4:
                    checkSalaryGapData = _state.sent();
                    return [
                        4,
                        checkSelfieVideo(customerID)
                    ];
                case 5:
                    checkSelfieVideoData = _state.sent();
                    return [
                        4,
                        checkAddressEmployementReference(customerID, leadID)
                    ];
                case 6:
                    checkAddressEmployementReferenceData = _state.sent();
                    return [
                        4,
                        checkLeadStatus(customerID, mobile)
                    ];
                case 7:
                    checkLeadStatusData = _state.sent();
                    return [
                        4,
                        checkEmailAcceptance(customerID, leadID)
                    ];
                case 8:
                    checkEmailAcceptanceData = _state.sent();
                    return [
                        4,
                        checkEmandateStatus(customerID, leadID, emandateRequired, emdID)
                    ];
                case 9:
                    checkEmandateStatusData = _state.sent();
                    return [
                        4,
                        checkPennyDropStatus(customerID, leadID, emdID)
                    ];
                case 10:
                    checkPennyDropStatusData = _state.sent();
                    return [
                        4,
                        checkLastLoanDpd(customerType, customerID)
                    ];
                case 11:
                    lastLoanDpdCheckData = _state.sent();
                    return [
                        4,
                        checkPennyDropStatusOnAccount(customerID, leadID)
                    ];
                case 12:
                    checkPennyDropStatusOnAccountData = _state.sent();
                    return [
                        4,
                        checkLoanAmount(customerID, leadID)
                    ];
                case 13:
                    checkLoanAmountData = _state.sent();
                    return [
                        4,
                        checkMinimunProcessingFee(customerID, leadID)
                    ];
                case 14:
                    checkMinimunProcessingFeeData = _state.sent();
                    return [
                        4,
                        checkApprovedAmount(customerID, leadID)
                    ];
                case 15:
                    checkApprovedAmountData = _state.sent();
                    returnObj = {
                        selfieCheckData: selfieCheckData,
                        checkTenureData: checkTenureData,
                        checkSalaryGapData: checkSalaryGapData,
                        checkSelfieVideoData: checkSelfieVideoData,
                        checkEmailAcceptanceData: checkEmailAcceptanceData,
                        checkEmandateStatusData: checkEmandateStatusData,
                        checkPennyDropStatusData: checkPennyDropStatusData,
                        checkAddressEmployementReferenceData: checkAddressEmployementReferenceData,
                        checkLeadStatusData: checkLeadStatusData,
                        checkApprovedAmountData: checkApprovedAmountData,
                        checkLoanAmountData: checkLoanAmountData,
                        checkMinimunProcessingFeeData: checkMinimunProcessingFeeData,
                        lastLoanDpdCheckData: lastLoanDpdCheckData,
                        checkPennyDropStatusOnAccountData: checkPennyDropStatusOnAccountData,
                        checkPanAadharLastFourDigitsData: checkPanAadharLastFourDigitsData
                    };
                    return [
                        2,
                        returnObj
                    ];
            }
        });
    })();
}

//# sourceMappingURL=autoDisbursalChecks.utils.js.map