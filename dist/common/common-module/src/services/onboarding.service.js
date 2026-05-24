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
import { HttpStatusCode } from 'axios';
import moment from 'moment';
import { blackListCustomerPancardModel } from '../database/mysql/blacklistCustomerPancard';
import { customerModel } from '../database/mysql/customer';
import { documentFinboxmodel } from '../database/mysql/documentFinbox';
import { finboxNameMatchModel } from '../database/mysql/finboxNameMatch';
import { leadsApiLogModel } from '../database/mysql/leadApiLogs';
import { leadModel } from '../database/mysql/leads';
import { stepTrackerModel } from '../database/mysql/stepTracker';
import UserMetaDataModel from '../database/mysql/userMetadata';
import { ApiSupplierType, DecentroApiUrl, LeadLogApiType, StepName, SurePassApiUrl } from '../enums/common.enum';
import { FinBoxBankConnectProgressStatus, FinboxUrls, NameSimilarityStatus } from '../enums/finbox.enum';
import { AddressStatus, AddressType } from '../enums/lead.enum';
import { LeadStatus } from '../enums/leadStatus.enum';
import { Products } from '../enums/product.enum';
import { LeadSteps } from '../enums/step.enum';
import { BadRequestError, NotFoundError } from '../errors';
import { CkycStatus } from '../interfaces/customer.interface';
import AddressService from '../services/address.service';
import { customerService } from '../services/customer.service';
import ResponseService from '../services/response.service';
import DigilockerService from '../services/thirdParty/digilocker.service';
import { finboxService } from '../services/thirdParty/finbox.service';
import SurepassService from '../services/thirdParty/surepass.service';
import { logger } from '../utils/logger';
import { getKnexInstance } from '../utils/mysql';
import { onboardAadharPanMatch } from '../utils/nameMatch.utils';
import { ckycDownload, ckycSearch, verifyPanSurePass } from '../utils/surePass.utils';
import { generateFinboxLinkId, isObjectEmpty, maskString } from '../utils/util';
import LeadApiLogService from './leadApiLog.service';
import LeadApiLogMongoDBService from './leadApiLogMongo.service';
export var OnboardingService = /*#__PURE__*/ function(ResponseService) {
    "use strict";
    _inherits(OnboardingService, ResponseService);
    function OnboardingService() {
        _class_call_check(this, OnboardingService);
        var _this;
        var _this1;
        _this = _call_super(this, OnboardingService), _this1 = _this, _define_property(_this, "leadApiLogService", new LeadApiLogService()), _define_property(_this, "customerService", customerService), _define_property(_this, "stepTrackermodel", stepTrackerModel), _define_property(_this, "blackListCustomerPancardModel", blackListCustomerPancardModel), _define_property(_this, "customerModel", customerModel), _define_property(_this, "surepassService", new SurepassService()), _define_property(_this, "digiLockerService", new DigilockerService()), _define_property(_this, "findBoxService", finboxService), _define_property(_this, "leadsApiLogModel", leadsApiLogModel), _define_property(_this, "finboxNameMatchmodel", finboxNameMatchModel), _define_property(_this, "documentFinboxmodel", documentFinboxmodel), _define_property(_this, "leadModel", leadModel), _define_property(_this, "addressService", new AddressService()), _define_property(_this, "userMetaDataModel", new UserMetaDataModel()), _define_property(_this, "leadApiLogMongoDBService", new LeadApiLogMongoDBService()), _define_property(_this, "onboardPanVerification", function(payload) {
            return _async_to_generator(function() {
                var _surePassData_data, _surePassData_data_data, _surePassData_data1, panNumber, customerID, mobileNo, customerPanCardNo, isBlackListedPan, panLeadApiLogData, customer, _surePassData_data2, _surePassData_data_data1, _surePassData_data3, panLeadApiLogData1, surePassData, panLeadApiLogData2, surePassData1;
                return _ts_generator(this, function(_state) {
                    switch(_state.label){
                        case 0:
                            panNumber = payload.panNumber, customerID = payload.customerID, mobileNo = payload.mobileNo, customerPanCardNo = payload.customerPanCardNo;
                            return [
                                4,
                                _this1.blackListCustomerPancardModel.isBlackListedCustomer(panNumber)
                            ];
                        case 1:
                            isBlackListedPan = _state.sent();
                            if (isBlackListedPan) throw new BadRequestError('You cannot apply for loan');
                            if (!(customerPanCardNo && (payload === null || payload === void 0 ? void 0 : payload.pan_cust_verified) === 1)) return [
                                3,
                                3
                            ];
                            return [
                                4,
                                _this1.leadApiLogService.findPanComprehensiveResponse(customerPanCardNo, String(mobileNo))
                            ];
                        case 2:
                            panLeadApiLogData = _state.sent();
                            // If the details exist then send it as payload
                            if (panLeadApiLogData) {
                                return [
                                    2,
                                    _this1.serviceResponse(200, panLeadApiLogData, 'PAN Already Linked, Details fetched')
                                ];
                            }
                            _state.label = 3;
                        case 3:
                            return [
                                4,
                                _this1.customerModel.findOneCustomer({
                                    pancard: panNumber
                                }, [
                                    'mobile'
                                ])
                            ];
                        case 4:
                            customer = _state.sent();
                            if (!customer) return [
                                3,
                                10
                            ];
                            // Check if mobileNo of customer is same, if same then only proceed further with lead_api_log
                            // If not same then pan is linked to another customer
                            if (customer.mobile !== mobileNo) {
                                logger.error("PAN no ".concat(panNumber, " is already linked to another mobile ").concat(customer.mobile));
                                throw new BadRequestError('This PAN number is associated with another existing account', {
                                    data: {
                                        mobileNo: maskString(String(customer.mobile), 6)
                                    }
                                });
                            }
                            return [
                                4,
                                _this1.leadApiLogService.findPanComprehensiveResponse(panNumber, String(mobileNo))
                            ];
                        case 5:
                            panLeadApiLogData1 = _state.sent();
                            if (!panLeadApiLogData1) return [
                                3,
                                7
                            ];
                            return [
                                4,
                                Promise.all([
                                    _this1.stepTrackermodel.completeStep(customerID, StepName.PAN_VERIFICATION, Products.PAYDAY),
                                    _this1.customerModel.findOneAndUpdate({
                                        customerID: customerID
                                    }, {
                                        step: LeadSteps.PAN_VERIFICATION
                                    })
                                ])
                            ];
                        case 6:
                            _state.sent();
                            return [
                                2,
                                _this1.serviceResponse(200, panLeadApiLogData1, 'PAN Details fetched')
                            ];
                        case 7:
                            return [
                                4,
                                verifyPanSurePass({
                                    panNumber: panNumber,
                                    customerId: customerID,
                                    mobileNo: mobileNo
                                })
                            ];
                        case 8:
                            surePassData = _state.sent();
                            if (!surePassData.success) throw new BadRequestError(surePassData.statusCode === HttpStatusCode.UnprocessableEntity ? (_surePassData_data2 = surePassData.data) === null || _surePassData_data2 === void 0 ? void 0 : _surePassData_data2.message : 'Pan fetch failure', {
                                data: {
                                    clientId: (_surePassData_data3 = surePassData.data) === null || _surePassData_data3 === void 0 ? void 0 : (_surePassData_data_data1 = _surePassData_data3.data) === null || _surePassData_data_data1 === void 0 ? void 0 : _surePassData_data_data1.client_id
                                }
                            });
                            // Update step
                            return [
                                4,
                                Promise.all([
                                    _this1.stepTrackermodel.completeStep(customerID, StepName.PAN_VERIFICATION, Products.PAYDAY),
                                    _this1.customerModel.findOneAndUpdate({
                                        customerID: customerID
                                    }, {
                                        step: LeadSteps.PAN_VERIFICATION
                                    })
                                ])
                            ];
                        case 9:
                            _state.sent();
                            return [
                                2,
                                _this1.serviceResponse(200, surePassData.data.data, 'PAN Details')
                            ];
                        case 10:
                            return [
                                4,
                                _this1.leadApiLogService.findPanComprehensiveResponse(panNumber, String(mobileNo))
                            ];
                        case 11:
                            panLeadApiLogData2 = _state.sent();
                            if (!panLeadApiLogData2) return [
                                3,
                                13
                            ];
                            return [
                                4,
                                Promise.all([
                                    _this1.stepTrackermodel.completeStep(customerID, StepName.PAN_VERIFICATION, Products.PAYDAY),
                                    _this1.customerModel.findOneAndUpdate({
                                        customerID: customerID
                                    }, {
                                        step: LeadSteps.PAN_VERIFICATION
                                    })
                                ])
                            ];
                        case 12:
                            _state.sent();
                            return [
                                2,
                                _this1.serviceResponse(200, panLeadApiLogData2, 'PAN Details fetched')
                            ];
                        case 13:
                            return [
                                4,
                                verifyPanSurePass({
                                    panNumber: panNumber,
                                    customerId: customerID,
                                    mobileNo: mobileNo
                                })
                            ];
                        case 14:
                            surePassData1 = _state.sent();
                            if (!surePassData1.success) throw new BadRequestError(surePassData1.statusCode === HttpStatusCode.UnprocessableEntity ? (_surePassData_data = surePassData1.data) === null || _surePassData_data === void 0 ? void 0 : _surePassData_data.message : 'Pan fetch failure', {
                                data: {
                                    clientId: (_surePassData_data1 = surePassData1.data) === null || _surePassData_data1 === void 0 ? void 0 : (_surePassData_data_data = _surePassData_data1.data) === null || _surePassData_data_data === void 0 ? void 0 : _surePassData_data_data.client_id
                                }
                            });
                            // Update step
                            return [
                                4,
                                Promise.all([
                                    _this1.stepTrackermodel.completeStep(customerID, StepName.PAN_VERIFICATION, Products.PAYDAY),
                                    _this1.customerModel.findOneAndUpdate({
                                        customerID: customerID
                                    }, {
                                        step: LeadSteps.PAN_VERIFICATION
                                    })
                                ])
                            ];
                        case 15:
                            _state.sent();
                            return [
                                2,
                                _this1.serviceResponse(200, surePassData1.data.data, 'PAN Details')
                            ];
                    }
                });
            })();
        }), _define_property(_this, "onboardAadharVerificationGenerateOtp", function(payload) {
            return _async_to_generator(function() {
                var aadharNo, customerID, mobileNo, customerAadharNo, surepassCheck, resp, _resp_data_data, _resp_data;
                return _ts_generator(this, function(_state) {
                    switch(_state.label){
                        case 0:
                            aadharNo = payload.aadharNo, customerID = payload.customerID, mobileNo = payload.mobileNo, customerAadharNo = payload.customerAadharNo;
                            // Check if
                            if (customerAadharNo && ((payload === null || payload === void 0 ? void 0 : payload.dob_digit_match) !== null || (payload === null || payload === void 0 ? void 0 : payload.dob_digit_match) == '1')) {
                                throw new BadRequestError('Customer Aadhar is already linked');
                            }
                            return [
                                4,
                                leadsApiLogModel.findOneLeadsApiLog({
                                    status: 1,
                                    api_type: LeadLogApiType.AADHAR_V2_SUBMIT_OTP,
                                    api_supplier: ApiSupplierType.SUREPASS,
                                    aadharNo: aadharNo
                                }, [
                                    'mobile_no'
                                ], [
                                    {
                                        column: 'id',
                                        order: 'desc'
                                    }
                                ])
                            ];
                        case 1:
                            surepassCheck = _state.sent();
                            if (surepassCheck && surepassCheck.mobile_no !== String(mobileNo)) {
                                throw new BadRequestError('This aadhaar number is associated with another existing account', {
                                    data: {
                                        mobileNo: maskString(surepassCheck.mobile_no, 6)
                                    }
                                });
                            }
                            return [
                                4,
                                _this1.surepassService.generateAadharOtpSurepass({
                                    aadharNo: aadharNo,
                                    customerID: customerID,
                                    mobileNo: mobileNo
                                })
                            ];
                        case 2:
                            resp = _state.sent();
                            if (!resp.success) {
                                ;
                                throw new BadRequestError('Aadhaar Verification Service is facing an issue, Please try other service', {
                                    data: {
                                        clientId: (_resp_data = resp.data) === null || _resp_data === void 0 ? void 0 : (_resp_data_data = _resp_data.data) === null || _resp_data_data === void 0 ? void 0 : _resp_data_data.client_id
                                    }
                                });
                            }
                            return [
                                2,
                                _this1.serviceResponse(200, {}, 'OTP sent to your registered mobile')
                            ];
                    }
                });
            })();
        }), _define_property(_this, "onboardAadharVerificationVerifyOtp", function(payload) {
            return _async_to_generator(function() {
                var customerID, mobileNo, customerAadharNo, otp, aadharNo, customer, leadLogs, resp, _ref, _resp_data, _resp_data1, errorMessage, saveObject, error;
                return _ts_generator(this, function(_state) {
                    switch(_state.label){
                        case 0:
                            customerID = payload.customerID, mobileNo = payload.mobileNo, customerAadharNo = payload.customerAadharNo, otp = payload.otp, aadharNo = payload.aadharNo;
                            // const { step_order, product_id, step_id, is_completed } = payload.userStep
                            // Check if
                            if (customerAadharNo && ((payload === null || payload === void 0 ? void 0 : payload.dob_digit_match) !== null || (payload === null || payload === void 0 ? void 0 : payload.dob_digit_match) == '1')) throw new BadRequestError('Customer Aadhar is already linked');
                            return [
                                4,
                                _this1.customerModel.findOneCustomer({
                                    aadharNo: Number(aadharNo)
                                }, [
                                    'mobile'
                                ])
                            ];
                        case 1:
                            customer = _state.sent();
                            if (customer && (customer === null || customer === void 0 ? void 0 : customer.mobile) !== mobileNo) {
                                logger.error("Aadhar no ".concat(aadharNo, " is already linked to another mobile ").concat(customer.mobile));
                                throw new BadRequestError('This Aadhar Number is already linked with another account, Please enter a different Aadhar number');
                            }
                            return [
                                4,
                                _this1.leadApiLogService.findAadharV2SendOtpResponse(aadharNo, String(mobileNo))
                            ];
                        case 2:
                            leadLogs = _state.sent();
                            if (!leadLogs) {
                                logger.error("No data found for surepass ".concat(LeadLogApiType.AADHAR_V2_GENERATE_OTP, " for customer with id ").concat(customerID));
                                throw new BadRequestError('There was an issue in verifying your OTP, Please contact the administrator');
                            }
                            return [
                                4,
                                _this1.surepassService.verifyAadharOtpSurepass({
                                    client_id: leadLogs.client_id,
                                    customerID: customerID,
                                    mobileNo: mobileNo,
                                    otp: otp,
                                    aadharNo: aadharNo
                                })
                            ];
                        case 3:
                            resp = _state.sent();
                            if (!resp.success) {
                                ;
                                ;
                                logger.error("Surepass submit otp hit error: ".concat((_ref = resp === null || resp === void 0 ? void 0 : (_resp_data = resp.data) === null || _resp_data === void 0 ? void 0 : _resp_data.message) !== null && _ref !== void 0 ? _ref : 'Verify failure', ", with data ").concat(JSON.stringify(resp.data)));
                                errorMessage = 'Aadhaar Verification Service is facing an issue, Please try other service';
                                if ((resp === null || resp === void 0 ? void 0 : (_resp_data1 = resp.data) === null || _resp_data1 === void 0 ? void 0 : _resp_data1.message) === 'OTP Already Submitted.') {
                                    errorMessage = 'Your OTP has expired. Please request a new one.';
                                }
                                throw new BadRequestError(errorMessage);
                            }
                            // // Also check digilocker
                            // await this.checkDigilockerAadharExists(
                            //   aadharNo,
                            //   mobileNo,
                            //   customerID,
                            //   false,
                            // )
                            saveObject = {
                                customerID: customerID,
                                api_type: LeadLogApiType.AADHAR_V2_SUBMIT_OTP,
                                api_supplier: ApiSupplierType.SUREPASS,
                                api_response: JSON.stringify(resp.data),
                                status: resp.success ? 1 : 0,
                                api_endpoint_url: config.surePassApi + SurePassApiUrl.AADHAR_SUBMIT,
                                api_method: 'POST',
                                api_headers: JSON.stringify({
                                    'Content-Type': 'application/json',
                                    Authorization: "Bearer ".concat(config.surePassToken)
                                }),
                                api_request: JSON.stringify({
                                    otp: otp,
                                    client_id: leadLogs.client_id,
                                    aadhaar_pdf_generate: true
                                }),
                                mobile_no: String(mobileNo),
                                aadharNo: aadharNo
                            };
                            return [
                                4,
                                _this1.leadApiLogService.create(saveObject)
                            ];
                        case 4:
                            _state.sent();
                            _state.label = 5;
                        case 5:
                            _state.trys.push([
                                5,
                                7,
                                ,
                                8
                            ]);
                            return [
                                4,
                                _this1.leadApiLogMongoDBService.create('aadhaarKYC', saveObject)
                            ];
                        case 6:
                            _state.sent();
                            return [
                                3,
                                8
                            ];
                        case 7:
                            error = _state.sent();
                            logger.error('Error while saving to MongoDB collection : aadhaarKYC', error);
                            return [
                                3,
                                8
                            ];
                        case 8:
                            return [
                                2,
                                _this1.serviceResponse(200, {}, 'Aadhar details saved')
                            ];
                    }
                });
            })();
        }), _define_property(_this, "onboardAadharInitiateDigiLocker", function(payload) {
            return _async_to_generator(function() {
                var customerID, mobile, customerAadharNo, callBackUrl, resp;
                return _ts_generator(this, function(_state) {
                    switch(_state.label){
                        case 0:
                            customerID = payload.customerID, mobile = payload.mobile, customerAadharNo = payload.customerAadharNo, callBackUrl = payload.callBackUrl;
                            if (customerAadharNo && ((payload === null || payload === void 0 ? void 0 : payload.dob_digit_match) !== null || (payload === null || payload === void 0 ? void 0 : payload.dob_digit_match) == '1')) {
                                throw new BadRequestError('Customer Aadhar is already linked');
                            }
                            return [
                                4,
                                _this1.digiLockerService.initiateDigiLockerAadhar(customerID, mobile, callBackUrl)
                            ];
                        case 1:
                            resp = _state.sent();
                            if (!resp.success) {
                                logger.error('Error in Decentro API: ' + JSON.stringify(resp.data));
                                throw new BadRequestError('DigiLocker service is currently unavailable');
                            }
                            return [
                                2,
                                _this1.serviceResponse(200, {
                                    url: resp.data.data.authorizationUrl
                                }, 'Initiate Digilocker URL')
                            ];
                    }
                });
            })();
        }), _define_property(_this, "aadharVerificationWebhookDigiLocker", function(payload) {
            return _async_to_generator(function() {
                var _resp_data_message, _resp2_data_message, state, code, customerID, mobile, resp, resp2, aadharNo, saveObject, error;
                return _ts_generator(this, function(_state) {
                    switch(_state.label){
                        case 0:
                            state = payload.state, code = payload.code, customerID = payload.customerID, mobile = payload.mobile;
                            return [
                                4,
                                _this1.digiLockerService.generateDecentroAccessToken(state, code, customerID, mobile)
                            ];
                        case 1:
                            resp = _state.sent();
                            if (!resp.success) throw new BadRequestError((_resp_data_message = resp.data.message) !== null && _resp_data_message !== void 0 ? _resp_data_message : 'Failed to verify aadhar', {
                                data: resp.data
                            });
                            return [
                                4,
                                _this1.digiLockerService.getEaadharData(state, customerID, mobile)
                            ];
                        case 2:
                            resp2 = _state.sent();
                            if (!resp.success) throw new BadRequestError((_resp2_data_message = resp2.data.message) !== null && _resp2_data_message !== void 0 ? _resp2_data_message : 'Failed to verify aadhar', {
                                data: resp2.data
                            });
                            // Check if this aadhar number exists for any customer who did surepass aadhar
                            aadharNo = resp2.data.data.aadhaarUid.slice(-4);
                            return [
                                4,
                                _this1.checkDigilockerAadharExists(aadharNo, +mobile, customerID, true)
                            ];
                        case 3:
                            _state.sent();
                            // Save here
                            saveObject = {
                                customerID: customerID,
                                api_type: LeadLogApiType.DIGILOCKER_EAADHAR,
                                api_supplier: ApiSupplierType.DECENTRO,
                                api_response: JSON.stringify(resp2.data),
                                status: resp2.success ? 1 : 0,
                                api_endpoint_url: config.decentroBaseUrl + DecentroApiUrl.EAADHAR,
                                api_method: 'POST',
                                api_headers: JSON.stringify({
                                    accept: 'application/json',
                                    client_id: config.decentro_client_id,
                                    client_secret: config.decentro_client_secret,
                                    module_secret: config.decentro_module_secret,
                                    'content-type': 'application/json'
                                }),
                                api_request: JSON.stringify({
                                    initial_decentro_transaction_id: state,
                                    consent: true,
                                    consent_purpose: 'For Bank Account Purpose Only',
                                    reference_id: Date.now().toString(),
                                    generate_xml: false
                                }),
                                mobile_no: mobile.toString()
                            };
                            return [
                                4,
                                _this1.leadApiLogService.create(saveObject)
                            ];
                        case 4:
                            _state.sent();
                            _state.label = 5;
                        case 5:
                            _state.trys.push([
                                5,
                                7,
                                ,
                                8
                            ]);
                            return [
                                4,
                                _this1.leadApiLogMongoDBService.create('digilocker', saveObject)
                            ];
                        case 6:
                            _state.sent();
                            return [
                                3,
                                8
                            ];
                        case 7:
                            error = _state.sent();
                            logger.error('Error while saving to MongoDB collection : digilocker', error);
                            return [
                                3,
                                8
                            ];
                        case 8:
                            return [
                                2,
                                _this1.serviceResponse(200, {}, 'Success')
                            ];
                    }
                });
            })();
        }), _define_property(_this, "fetchThirdPartyDetails", function(customerID) {
            return _async_to_generator(function() {
                var customer, panDetails, aadharDetails, ckycDetailsDownload, ckycDetailsSearch;
                return _ts_generator(this, function(_state) {
                    switch(_state.label){
                        case 0:
                            return [
                                4,
                                _this1.customerModel.findOneCustomer({
                                    customerID: customerID
                                }, [
                                    '*'
                                ])
                            ];
                        case 1:
                            customer = _state.sent();
                            if (!customer) {
                                throw new BadRequestError('customer not found');
                            }
                            return [
                                4,
                                leadsApiLogModel.findOneLeadsApiLog({
                                    status: 1,
                                    api_type: LeadLogApiType.PAN_COMPREHENSIVE,
                                    api_supplier: ApiSupplierType.SUREPASS,
                                    mobile_no: String(customer.mobile)
                                }, [
                                    '*'
                                ], [
                                    {
                                        column: 'id',
                                        order: 'desc'
                                    }
                                ])
                            ];
                        case 2:
                            panDetails = _state.sent();
                            return [
                                4,
                                leadsApiLogModel.findOneLeadsApiLog({
                                    status: 1,
                                    api_type: LeadLogApiType.AADHAR_V2_SUBMIT_OTP,
                                    api_supplier: ApiSupplierType.SUREPASS,
                                    aadharNo: String(customer.aadharNo)
                                }, [
                                    '*'
                                ], [
                                    {
                                        column: 'id',
                                        order: 'desc'
                                    }
                                ])
                            ];
                        case 3:
                            aadharDetails = _state.sent();
                            return [
                                4,
                                leadsApiLogModel.findOneLeadsApiLog({
                                    api_supplier: ApiSupplierType.SUREPASS,
                                    status: 1,
                                    api_type: LeadLogApiType.CKYC_DOWNLOAD,
                                    pancard: customer.pancard
                                }, [
                                    'api_response'
                                ])
                            ];
                        case 4:
                            ckycDetailsDownload = _state.sent();
                            return [
                                4,
                                leadsApiLogModel.findOneLeadsApiLog({
                                    api_supplier: ApiSupplierType.SUREPASS,
                                    status: 1,
                                    api_type: LeadLogApiType.CKYC_SEARCH,
                                    pancard: customer.pancard
                                }, [
                                    'api_response'
                                ])
                            ];
                        case 5:
                            ckycDetailsSearch = _state.sent();
                            return [
                                2,
                                _this1.serviceResponse(200, {
                                    panDetails: panDetails,
                                    aadharDetails: aadharDetails,
                                    ckycDetailsDownload: ckycDetailsDownload,
                                    ckycDetailsSearch: ckycDetailsSearch
                                }, 'Fetched details ')
                            ];
                    }
                });
            })();
        }), _define_property(_this, "finboxCreateUrl", function(payload) {
            return _async_to_generator(function() {
                var mobileNo, callBackUrl, customerID, redirect_url, logo_url, response;
                return _ts_generator(this, function(_state) {
                    switch(_state.label){
                        case 0:
                            mobileNo = payload.mobileNo, callBackUrl = payload.callBackUrl, customerID = payload.customerID;
                            redirect_url = callBackUrl ? callBackUrl : "".concat(config.frontendBaseUrl).concat(FinboxUrls.CREATE_URL);
                            logo_url = "".concat(config.frontendBaseUrl, "/").concat(FinboxUrls.LOGO_URL);
                            return [
                                4,
                                finboxService.bankConnect({
                                    link_id: generateFinboxLinkId(+customerID, 'rf'),
                                    redirect_url: redirect_url,
                                    logo_url: logo_url
                                })
                            ];
                        case 1:
                            response = _state.sent();
                            if (!response.is_success) throw new BadRequestError('Failed to create a url', {
                                data: response.apimsg
                            });
                            return [
                                2,
                                _this1.serviceResponse(200, response.apimsg, 'Url created')
                            ];
                    }
                });
            })();
        }), _define_property(_this, "finboxBankConnect", function(payload) {
            return _async_to_generator(function() {
                var _identityReportResponse_apimsg, _bankConnectXlsxReportResponse_apimsg, entityId, mobileNo, leadID, aadharNo, customerID, pancard, step, email, lead, predictors, identityReportResponse, status, bankConnectName, customerName, saveObject, error, identityProgress, isProgressArray, progressArrayLength, lastProgress, saveObject1, predictors1, leadApiLogs, error1, aadharData, digilocker, pancardDetails, checkNameType, _pancardJson_data, _pancardJson_data1, pancardJson, identity, foundIdentity, _ref, accountNo, checkFinboxNameMatch, nameMatchObj, checkSimilarNamePercentage, _aadharDataJson_data, aadharDataJson, _digilockerJson_data_proofOfIdentity, _digilockerJson_data, _digilockerJson_data_proofOfIdentity1, _digilockerJson_data1, digilockerJson, nameMatchObj1, checkSimilarNamePercentage1, data, checkFinboxNameMatch1, data1, checkFinboxNameMatch2, bankConnectXlsxReportResponse, bankConnectXlsxProgress, _bankConnectXlsxReportResponse_apimsg_reports_, _bankConnectXlsxReportResponse_apimsg1, _bankConnectXlsxReportResponse_apimsg2, _bankConnectXlsxReportResponse_apimsg_reports_1, _bankConnectXlsxReportResponse_apimsg3, bankConnectXlsxReport, statementId, source, link, checkdocumentFinbox, documentFinboxData, isPredictorSuccess, check, approvedStatus, pageName, route;
                return _ts_generator(this, function(_state) {
                    switch(_state.label){
                        case 0:
                            entityId = payload.entityId, mobileNo = payload.mobileNo, leadID = payload.leadID, aadharNo = payload.aadharNo, customerID = payload.customerID, pancard = payload.pancard, step = payload.step, email = payload.email;
                            return [
                                4,
                                _this1.leadsApiLogModel.findOneLeadsApiLog({
                                    leadID: leadID
                                })
                            ];
                        case 1:
                            lead = _state.sent();
                            if (!lead) throw new NotFoundError('Lead not found');
                            return [
                                4,
                                finboxService.bankConnectIdentity({
                                    entityId: entityId
                                })
                            ];
                        case 2:
                            identityReportResponse = _state.sent();
                            status = identityReportResponse.is_success ? 1 : 0;
                            saveObject = {
                                api_type: LeadLogApiType.IDENTITY,
                                api_supplier: 2,
                                leadID: 0,
                                api_response: JSON.stringify(identityReportResponse.apimsg),
                                entity_id: entityId,
                                status: status,
                                customerID: customerID
                            };
                            return [
                                4,
                                _this1.leadApiLogService.create(saveObject)
                            ];
                        case 3:
                            _state.sent();
                            _state.label = 4;
                        case 4:
                            _state.trys.push([
                                4,
                                6,
                                ,
                                7
                            ]);
                            return [
                                4,
                                _this1.leadApiLogMongoDBService.create('finbox', saveObject)
                            ];
                        case 5:
                            _state.sent();
                            return [
                                3,
                                7
                            ];
                        case 6:
                            error = _state.sent();
                            logger.error('Error while saving to MongoDB collection : finbox', error);
                            return [
                                3,
                                7
                            ];
                        case 7:
                            if (!identityReportResponse.is_success) {
                                logger.error('Finbox 3rd party API: Identity Error for entity id: ' + entityId);
                                throw new BadRequestError("We're facing technical issues with Finbox Bank Connect. Our team is working on it", {
                                    data: identityReportResponse.apimsg
                                });
                            }
                            // if identity api is successful, proceed
                            identityProgress = (_identityReportResponse_apimsg = identityReportResponse.apimsg) === null || _identityReportResponse_apimsg === void 0 ? void 0 : _identityReportResponse_apimsg.progress;
                            isProgressArray = Array.isArray(identityProgress);
                            progressArrayLength = isProgressArray ? identityProgress.length : 0;
                            if (identityProgress && isProgressArray && identityProgress.length > 0) {
                                lastProgress = identityProgress[identityProgress.length - 1];
                                if (lastProgress.status === FinBoxBankConnectProgressStatus.PROCESSING) {
                                    logger.error("Last progress status: ".concat(FinBoxBankConnectProgressStatus.PROCESSING, " for entity id: ").concat(entityId));
                                    throw new BadRequestError("We're facing technical issues with Finbox Bank Connect. Our team is working on it", {
                                        data: {
                                            apiStatus: lastProgress.status,
                                            status: 0,
                                            finboxName: '',
                                            kycName: '',
                                            pageName: 'dashboard',
                                            route: '/dashboard'
                                        }
                                    });
                                } else if (lastProgress.status === FinBoxBankConnectProgressStatus.FAILED) {
                                    logger.error("Last progress status: ".concat(FinBoxBankConnectProgressStatus.FAILED, " for entity id: ").concat(entityId));
                                    throw new BadRequestError('Invalid bank statement. Please upload a valid one.', {
                                        data: {
                                            apiStatus: lastProgress.status,
                                            status: 0,
                                            finboxName: '',
                                            kycName: '',
                                            pageName: 'dashboard',
                                            route: '/dashboard'
                                        }
                                    });
                                }
                            }
                            if (!(identityReportResponse.is_success && identityProgress && Array.isArray(identityProgress) && progressArrayLength > 0)) return [
                                3,
                                36
                            ];
                            saveObject1 = {
                                api_type: LeadLogApiType.IDENTITY,
                                api_supplier: 2,
                                leadID: leadID,
                                api_response: JSON.stringify(identityReportResponse.apimsg),
                                entity_id: entityId,
                                status: status,
                                customerID: customerID
                            };
                            return [
                                4,
                                finboxService.predictors(mobileNo, entityId, leadID, customerID)
                            ];
                        case 8:
                            predictors1 = _state.sent();
                            return [
                                4,
                                _this1.leadsApiLogModel.findOneLeadsApiLog({
                                    entity_id: entityId,
                                    api_type: LeadLogApiType.IDENTITY
                                })
                            ];
                        case 9:
                            leadApiLogs = _state.sent();
                            if (!!leadApiLogs) return [
                                3,
                                15
                            ];
                            return [
                                4,
                                _this1.leadApiLogService.create(saveObject1)
                            ];
                        case 10:
                            _state.sent();
                            _state.label = 11;
                        case 11:
                            _state.trys.push([
                                11,
                                13,
                                ,
                                14
                            ]);
                            return [
                                4,
                                _this1.leadApiLogMongoDBService.create('finbox', saveObject1)
                            ];
                        case 12:
                            _state.sent();
                            return [
                                3,
                                14
                            ];
                        case 13:
                            error1 = _state.sent();
                            logger.error('Error while saving to MongoDB collection : finbox', error1);
                            return [
                                3,
                                14
                            ];
                        case 14:
                            return [
                                3,
                                17
                            ];
                        case 15:
                            return [
                                4,
                                _this1.leadApiLogService.updateOne({
                                    entity_id: entityId
                                }, saveObject1)
                            ];
                        case 16:
                            _state.sent();
                            _state.label = 17;
                        case 17:
                            return [
                                4,
                                _this1.leadsApiLogModel.findOneLeadsApiLog({
                                    status: 1,
                                    api_type: LeadLogApiType.PAN_COMPREHENSIVE,
                                    pancard: pancard
                                }, [
                                    'api_response'
                                ], [
                                    {
                                        column: 'id',
                                        order: 'desc'
                                    }
                                ])
                            ];
                        case 18:
                            pancardDetails = _state.sent();
                            if (pancardDetails) {
                                ;
                                pancardJson = JSON.parse(pancardDetails.api_response);
                                customerName = (pancardJson === null || pancardJson === void 0 ? void 0 : (_pancardJson_data = pancardJson.data) === null || _pancardJson_data === void 0 ? void 0 : _pancardJson_data.full_name) ? pancardJson === null || pancardJson === void 0 ? void 0 : (_pancardJson_data1 = pancardJson.data) === null || _pancardJson_data1 === void 0 ? void 0 : _pancardJson_data1.full_name : '';
                                checkNameType = 'finbox - pancard';
                            }
                            customerName = customerName.toLowerCase();
                            identity = identityReportResponse.apimsg.identity; // identity is an array
                            foundIdentity = {};
                            if (!(identity && Array.isArray(identity))) return [
                                3,
                                35
                            ];
                            foundIdentity = finboxService.findLastUpdatedAccount(identityReportResponse.apimsg);
                            if (!!isObjectEmpty(foundIdentity)) return [
                                3,
                                35
                            ];
                            bankConnectName = foundIdentity.name;
                            if (!(bankConnectName !== 'summary' || identity.length == 1 && bankConnectName == 'summary')) return [
                                3,
                                35
                            ];
                            accountNo = (_ref = foundIdentity === null || foundIdentity === void 0 ? void 0 : foundIdentity.account_number) !== null && _ref !== void 0 ? _ref : '';
                            if (!accountNo) return [
                                3,
                                20
                            ];
                            return [
                                4,
                                _this1.finboxNameMatchmodel.findOneFinboxNameMatch({
                                    customerID: customerID,
                                    leadID: leadID,
                                    status: 1,
                                    accountNo: accountNo
                                }, [
                                    '*'
                                ], [
                                    {
                                        column: 'id',
                                        order: 'desc'
                                    }
                                ])
                            ];
                        case 19:
                            // TODO : Create finbox_name_match model
                            checkFinboxNameMatch = _state.sent();
                            _state.label = 20;
                        case 20:
                            if (!!checkFinboxNameMatch) return [
                                3,
                                35
                            ];
                            if (!(customerName && bankConnectName)) return [
                                3,
                                31
                            ];
                            nameMatchObj = {
                                leadId: leadID || 0,
                                customerID: customerID || 0,
                                customerMobileNo: mobileNo || '0',
                                type: checkNameType,
                                firstName: bankConnectName,
                                secondName: customerName
                            };
                            return [
                                4,
                                finboxService.checkNamePercentage(nameMatchObj)
                            ];
                        case 21:
                            checkSimilarNamePercentage = _state.sent();
                            if (!(checkSimilarNamePercentage.errorCode === 0 && checkSimilarNamePercentage.status === NameSimilarityStatus.REJECT)) return [
                                3,
                                30
                            ];
                            if (!aadharNo) return [
                                3,
                                23
                            ];
                            return [
                                4,
                                _this1.leadsApiLogModel.findOneLeadsApiLog({
                                    status: 1,
                                    api_type: LeadLogApiType.AADHAR_V2_SUBMIT_OTP,
                                    aadharNo: aadharNo.toString()
                                }, [
                                    'api_response'
                                ], [
                                    {
                                        column: 'id',
                                        order: 'desc'
                                    }
                                ])
                            ];
                        case 22:
                            aadharData = _state.sent();
                            _state.label = 23;
                        case 23:
                            if (!!aadharData) return [
                                3,
                                25
                            ];
                            return [
                                4,
                                _this1.leadsApiLogModel.findOneLeadsApiLog({
                                    status: 1,
                                    api_type: LeadLogApiType.DIGILOCKER_EAADHAR,
                                    mobile_no: mobileNo
                                }, [
                                    'api_response'
                                ], [
                                    {
                                        column: 'id',
                                        order: 'desc'
                                    }
                                ])
                            ];
                        case 24:
                            digilocker = _state.sent();
                            _state.label = 25;
                        case 25:
                            if (aadharData) {
                                ;
                                aadharDataJson = JSON.parse(aadharData.api_response);
                                customerName = (aadharDataJson === null || aadharDataJson === void 0 ? void 0 : (_aadharDataJson_data = aadharDataJson.data) === null || _aadharDataJson_data === void 0 ? void 0 : _aadharDataJson_data.full_name) ? aadharDataJson.data.full_name : '';
                                checkNameType = 'finbox - aadhar';
                            } else if (digilocker) {
                                ;
                                digilockerJson = JSON.parse(digilocker.api_response);
                                customerName = (digilockerJson === null || digilockerJson === void 0 ? void 0 : (_digilockerJson_data = digilockerJson.data) === null || _digilockerJson_data === void 0 ? void 0 : (_digilockerJson_data_proofOfIdentity = _digilockerJson_data.proofOfIdentity) === null || _digilockerJson_data_proofOfIdentity === void 0 ? void 0 : _digilockerJson_data_proofOfIdentity.name) ? digilockerJson === null || digilockerJson === void 0 ? void 0 : (_digilockerJson_data1 = digilockerJson.data) === null || _digilockerJson_data1 === void 0 ? void 0 : (_digilockerJson_data_proofOfIdentity1 = _digilockerJson_data1.proofOfIdentity) === null || _digilockerJson_data_proofOfIdentity1 === void 0 ? void 0 : _digilockerJson_data_proofOfIdentity1.name : '';
                                checkNameType = 'finbox - digilocker';
                            }
                            customerName = customerName.toLowerCase();
                            nameMatchObj1 = {
                                leadId: leadID || 0,
                                customerID: customerID || 0,
                                customerMobileNo: mobileNo || '0',
                                type: checkNameType,
                                firstName: bankConnectName,
                                secondName: customerName
                            };
                            return [
                                4,
                                finboxService.checkNamePercentage(nameMatchObj1)
                            ];
                        case 26:
                            checkSimilarNamePercentage1 = _state.sent();
                            if (!(checkSimilarNamePercentage1.errorCode === 0 && checkSimilarNamePercentage1.status === NameSimilarityStatus.REJECT)) return [
                                3,
                                30
                            ];
                            data = {
                                leadID: leadID,
                                customerID: customerID,
                                accountNo: accountNo,
                                firstName: bankConnectName,
                                secondName: customerName,
                                pecentageMatch: checkSimilarNamePercentage1.percentageResult
                            };
                            return [
                                4,
                                _this1.finboxNameMatchmodel.findOneFinboxNameMatch({
                                    customerID: customerID,
                                    leadID: leadID,
                                    accountNo: accountNo
                                })
                            ];
                        case 27:
                            checkFinboxNameMatch1 = _state.sent();
                            if (!!checkFinboxNameMatch1) return [
                                3,
                                29
                            ];
                            return [
                                4,
                                _this1.finboxNameMatchmodel.insert(data)
                            ];
                        case 28:
                            _state.sent();
                            _state.label = 29;
                        case 29:
                            throw new BadRequestError('Bank Statement Name and Aadhar/Digilocker/Pancard Name is Mismatch', {
                                data: {
                                    status: 0,
                                    apiStatus: 0,
                                    finboxName: bankConnectName,
                                    kycName: customerName,
                                    pageName: 'dashboard',
                                    route: '/dashboard'
                                }
                            });
                        case 30:
                            return [
                                3,
                                35
                            ];
                        case 31:
                            data1 = {
                                leadID: leadID,
                                customerID: customerID,
                                accountNo: accountNo,
                                firstName: bankConnectName,
                                secondName: customerName,
                                pecentageMatch: 0.0
                            };
                            return [
                                4,
                                _this1.finboxNameMatchmodel.findOneFinboxNameMatch({
                                    customerID: customerID,
                                    leadID: leadID,
                                    accountNo: accountNo
                                })
                            ];
                        case 32:
                            checkFinboxNameMatch2 = _state.sent();
                            if (!!checkFinboxNameMatch2) return [
                                3,
                                34
                            ];
                            return [
                                4,
                                _this1.finboxNameMatchmodel.insert(data1)
                            ];
                        case 33:
                            _state.sent();
                            _state.label = 34;
                        case 34:
                            throw new BadRequestError('Bank Statement Name and Aadhar/Digilocker/Pancard Name is Mismatch', {
                                data: {
                                    status: 0,
                                    apiStatus: 0,
                                    finboxName: bankConnectName,
                                    kycName: customerName,
                                    pageName: 'dashboard',
                                    route: '/dashboard'
                                }
                            });
                        case 35:
                            return [
                                3,
                                37
                            ];
                        case 36:
                            throw new BadRequestError('Something went wrong!', {
                                data: {
                                    status: 1,
                                    apiStatus: '',
                                    finboxName: '',
                                    kycName: '',
                                    pageName: 'dashboard',
                                    route: '/dashboard',
                                    identity: _object_spread({}, identityReportResponse.apimsg)
                                }
                            });
                        case 37:
                            return [
                                4,
                                finboxService.bankConnectXlsxReport(entityId, customerID)
                            ];
                        case 38:
                            bankConnectXlsxReportResponse = _state.sent();
                            bankConnectXlsxProgress = (_bankConnectXlsxReportResponse_apimsg = bankConnectXlsxReportResponse.apimsg) === null || _bankConnectXlsxReportResponse_apimsg === void 0 ? void 0 : _bankConnectXlsxReportResponse_apimsg.progress;
                            if (!(bankConnectXlsxReportResponse.is_success && bankConnectXlsxProgress && Array.isArray(bankConnectXlsxProgress))) return [
                                3,
                                45
                            ];
                            bankConnectXlsxReport = (_bankConnectXlsxReportResponse_apimsg1 = bankConnectXlsxReportResponse.apimsg) === null || _bankConnectXlsxReportResponse_apimsg1 === void 0 ? void 0 : (_bankConnectXlsxReportResponse_apimsg_reports_ = _bankConnectXlsxReportResponse_apimsg1.reports[0]) === null || _bankConnectXlsxReportResponse_apimsg_reports_ === void 0 ? void 0 : _bankConnectXlsxReportResponse_apimsg_reports_.link;
                            if (!!bankConnectXlsxReport) return [
                                3,
                                41
                            ];
                            return [
                                4,
                                new Promise(function(resolve) {
                                    return setTimeout(resolve, 6000);
                                })
                            ];
                        case 39:
                            _state.sent();
                            return [
                                4,
                                finboxService.bankConnectXlsxReport(entityId, customerID)
                            ];
                        case 40:
                            bankConnectXlsxReportResponse = _state.sent();
                            _state.label = 41;
                        case 41:
                            bankConnectXlsxProgress = (_bankConnectXlsxReportResponse_apimsg2 = bankConnectXlsxReportResponse.apimsg) === null || _bankConnectXlsxReportResponse_apimsg2 === void 0 ? void 0 : _bankConnectXlsxReportResponse_apimsg2.progress;
                            bankConnectXlsxReport = (_bankConnectXlsxReportResponse_apimsg3 = bankConnectXlsxReportResponse.apimsg) === null || _bankConnectXlsxReportResponse_apimsg3 === void 0 ? void 0 : (_bankConnectXlsxReportResponse_apimsg_reports_1 = _bankConnectXlsxReportResponse_apimsg3.reports[0]) === null || _bankConnectXlsxReportResponse_apimsg_reports_1 === void 0 ? void 0 : _bankConnectXlsxReportResponse_apimsg_reports_1.link;
                            if (!(bankConnectXlsxProgress && (bankConnectXlsxProgress === null || bankConnectXlsxProgress === void 0 ? void 0 : bankConnectXlsxProgress.length) > 0)) return [
                                3,
                                45
                            ];
                            statementId = bankConnectXlsxProgress[0].statement_id;
                            source = bankConnectXlsxProgress[0].source;
                            link = '--';
                            if (bankConnectXlsxReport) {
                                link = bankConnectXlsxReport;
                            }
                            return [
                                4,
                                _this1.documentFinboxmodel.findOneDocumentFinbox({
                                    leadID: leadID,
                                    entityID: entityId
                                })
                            ];
                        case 42:
                            checkdocumentFinbox = _state.sent();
                            documentFinboxData = {};
                            if (!!checkdocumentFinbox) return [
                                3,
                                45
                            ];
                            documentFinboxData.customerID = customerID;
                            documentFinboxData.leadID = leadID;
                            documentFinboxData.entityID = entityId;
                            documentFinboxData.type = source;
                            documentFinboxData.statement_id = statementId;
                            documentFinboxData.documentType = 'Bank Statement';
                            documentFinboxData.documentFile = link;
                            documentFinboxData.verifiedBy = 'finbox';
                            documentFinboxData.verifiedDate = new Date();
                            // save to document finbox
                            return [
                                4,
                                _this1.documentFinboxmodel.insert(documentFinboxData)
                            ];
                        case 43:
                            _state.sent();
                            return [
                                4,
                                finboxService.leadStatusChangedDocumentReceivedNew(leadID)
                            ];
                        case 44:
                            _state.sent();
                            _state.label = 45;
                        case 45:
                            if (!(step && leadID)) return [
                                3,
                                47
                            ];
                            return [
                                4,
                                leadModel.findOneAndUpdate({
                                    leadID: leadID
                                }, {
                                    step: step
                                })
                            ];
                        case 46:
                            _state.sent();
                            _state.label = 47;
                        case 47:
                            return [
                                4,
                                finboxService.predictors(mobileNo, entityId, leadID, customerID)
                            ];
                        case 48:
                            // if (email) {
                            //   await this.sendApplyMail(email)
                            // }
                            predictors = _state.sent();
                            status = 0;
                            isPredictorSuccess = 'processing';
                            return [
                                4,
                                _this1.leadsApiLogModel.findOneLeadsApiLog({
                                    status: 1,
                                    api_supplier: 2,
                                    mobile_no: mobileNo,
                                    leadID: leadID,
                                    entity_id: entityId
                                })
                            ];
                        case 49:
                            check = _state.sent();
                            if (check) {
                                status = 1;
                                isPredictorSuccess = '';
                            }
                            return [
                                4,
                                leadModel.findOneLead({
                                    leadID: leadID
                                })
                            ];
                        case 50:
                            approvedStatus = _state.sent();
                            if (approvedStatus && approvedStatus.status === LeadStatus.APPROVED_PROCESS) {
                                pageName = 'approval';
                                route = '/loan-approval';
                            } else if (approvedStatus && (approvedStatus.status === LeadStatus.REJECTED || approvedStatus.status === LeadStatus.REJECTED_PROCESS)) {
                                pageName = 'rejected';
                                route = '/finbox-reject';
                            } else {
                                pageName = 'dashboard';
                                route = '/dashboard';
                            }
                            return [
                                4,
                                _this1.stepTrackermodel.completeStep(customerID, StepName.FINBOX, Products.PAYDAY, leadID)
                            ];
                        case 51:
                            _state.sent();
                            // }
                            return [
                                2,
                                _this1.serviceResponse(200, {
                                    status: status,
                                    api_status: isPredictorSuccess,
                                    finboxName: bankConnectName,
                                    kycName: customerName,
                                    pageName: pageName,
                                    finboxResult: predictors.sync_result,
                                    route: route
                                }, 'Success')
                            ];
                    }
                });
            })();
        }), _define_property(_this, "aadharPanVerifyMatch", function(customerID, mobile) {
            return _async_to_generator(function() {
                var _ref, _ref1, _ref2, _ref3, _ref4, _ref5, _ref6, _ref7, _ref8, _ref9, _matches_surePassAadharData_address, _matches_surePassAadharData, _matches_surePassAadharData_address1, _matches_surePassAadharData1, _matches_surePassAadharData_address2, _matches_surePassAadharData2, _matches_surePassAadharData_address3, _matches_surePassAadharData3, _matches_surePassAadharData_address4, _matches_surePassAadharData4, _matches_surePassAadharData_address5, _matches_surePassAadharData5, _matches_surePassAadharData6, _matches_surePassAadharData7, _matches_digilockerAadharData_proofOfAddress, _matches_digilockerAadharData, _matches_digilockerAadharData_proofOfAddress1, _matches_digilockerAadharData1, _matches_digilockerAadharData_proofOfAddress2, _matches_digilockerAadharData2, _matches_digilockerAadharData_proofOfAddress3, _matches_digilockerAadharData3, _matches_digilockerAadharData_proofOfAddress4, _matches_digilockerAadharData4, _matches_digilockerAadharData_proofOfAddress5, _matches_digilockerAadharData5, _matches_digilockerAadharData_proofOfAddress6, _matches_digilockerAadharData6, _matches_digilockerAadharData_proofOfAddress7, _matches_digilockerAadharData7, matches, customerTableUpdate, addressData, errorResponseData, promises, promises1;
                return _ts_generator(this, function(_state) {
                    switch(_state.label){
                        case 0:
                            return [
                                4,
                                onboardAadharPanMatch(mobile, customerID)
                            ];
                        case 1:
                            matches = _state.sent();
                            // match should be 100
                            customerTableUpdate = {
                                dob_digit_match: '0',
                                is_dob_match: 'No',
                                is_pan_aadhar_linked: 'No',
                                aadharNo: null
                            };
                            errorResponseData = {
                                isAadharLinked: false,
                                isDobNameMatch: false,
                                route: '/dashboard'
                            };
                            matches.isSurePassAadhar ? addressData = {
                                customerID: customerID,
                                address: "".concat((_ref = (_matches_surePassAadharData = matches.surePassAadharData) === null || _matches_surePassAadharData === void 0 ? void 0 : (_matches_surePassAadharData_address = _matches_surePassAadharData.address) === null || _matches_surePassAadharData_address === void 0 ? void 0 : _matches_surePassAadharData_address.house) !== null && _ref !== void 0 ? _ref : '', " . ").concat((_ref1 = (_matches_surePassAadharData1 = matches.surePassAadharData) === null || _matches_surePassAadharData1 === void 0 ? void 0 : (_matches_surePassAadharData_address1 = _matches_surePassAadharData1.address) === null || _matches_surePassAadharData_address1 === void 0 ? void 0 : _matches_surePassAadharData_address1.street) !== null && _ref1 !== void 0 ? _ref1 : '', " ").concat((_ref2 = (_matches_surePassAadharData2 = matches.surePassAadharData) === null || _matches_surePassAadharData2 === void 0 ? void 0 : (_matches_surePassAadharData_address2 = _matches_surePassAadharData2.address) === null || _matches_surePassAadharData_address2 === void 0 ? void 0 : _matches_surePassAadharData_address2.subdist) !== null && _ref2 !== void 0 ? _ref2 : '', " ").concat((_ref3 = (_matches_surePassAadharData3 = matches.surePassAadharData) === null || _matches_surePassAadharData3 === void 0 ? void 0 : (_matches_surePassAadharData_address3 = _matches_surePassAadharData3.address) === null || _matches_surePassAadharData_address3 === void 0 ? void 0 : _matches_surePassAadharData_address3.po) !== null && _ref3 !== void 0 ? _ref3 : ''),
                                city: (_ref4 = (_matches_surePassAadharData4 = matches.surePassAadharData) === null || _matches_surePassAadharData4 === void 0 ? void 0 : (_matches_surePassAadharData_address4 = _matches_surePassAadharData4.address) === null || _matches_surePassAadharData_address4 === void 0 ? void 0 : _matches_surePassAadharData_address4.dist) !== null && _ref4 !== void 0 ? _ref4 : '',
                                state: (_matches_surePassAadharData5 = matches.surePassAadharData) === null || _matches_surePassAadharData5 === void 0 ? void 0 : (_matches_surePassAadharData_address5 = _matches_surePassAadharData5.address) === null || _matches_surePassAadharData_address5 === void 0 ? void 0 : _matches_surePassAadharData_address5.state,
                                pincode: ((_matches_surePassAadharData6 = matches.surePassAadharData) === null || _matches_surePassAadharData6 === void 0 ? void 0 : _matches_surePassAadharData6.zip) ? Number((_matches_surePassAadharData7 = matches.surePassAadharData) === null || _matches_surePassAadharData7 === void 0 ? void 0 : _matches_surePassAadharData7.zip) : 0,
                                status: AddressStatus.VERIFIED,
                                type: AddressType.PERMANENT_ADDRESS
                            } : addressData = {
                                customerID: customerID,
                                address: "".concat((_ref5 = (_matches_digilockerAadharData = matches.digilockerAadharData) === null || _matches_digilockerAadharData === void 0 ? void 0 : (_matches_digilockerAadharData_proofOfAddress = _matches_digilockerAadharData.proofOfAddress) === null || _matches_digilockerAadharData_proofOfAddress === void 0 ? void 0 : _matches_digilockerAadharData_proofOfAddress.careOf) !== null && _ref5 !== void 0 ? _ref5 : '', " . ").concat((_ref6 = (_matches_digilockerAadharData1 = matches.digilockerAadharData) === null || _matches_digilockerAadharData1 === void 0 ? void 0 : (_matches_digilockerAadharData_proofOfAddress1 = _matches_digilockerAadharData1.proofOfAddress) === null || _matches_digilockerAadharData_proofOfAddress1 === void 0 ? void 0 : _matches_digilockerAadharData_proofOfAddress1.house) !== null && _ref6 !== void 0 ? _ref6 : '', " ").concat((_ref7 = (_matches_digilockerAadharData2 = matches.digilockerAadharData) === null || _matches_digilockerAadharData2 === void 0 ? void 0 : (_matches_digilockerAadharData_proofOfAddress2 = _matches_digilockerAadharData2.proofOfAddress) === null || _matches_digilockerAadharData_proofOfAddress2 === void 0 ? void 0 : _matches_digilockerAadharData_proofOfAddress2.street) !== null && _ref7 !== void 0 ? _ref7 : '', " ").concat((_ref8 = (_matches_digilockerAadharData3 = matches.digilockerAadharData) === null || _matches_digilockerAadharData3 === void 0 ? void 0 : (_matches_digilockerAadharData_proofOfAddress3 = _matches_digilockerAadharData3.proofOfAddress) === null || _matches_digilockerAadharData_proofOfAddress3 === void 0 ? void 0 : _matches_digilockerAadharData_proofOfAddress3.locality) !== null && _ref8 !== void 0 ? _ref8 : ''),
                                city: (_ref9 = (_matches_digilockerAadharData4 = matches.digilockerAadharData) === null || _matches_digilockerAadharData4 === void 0 ? void 0 : (_matches_digilockerAadharData_proofOfAddress4 = _matches_digilockerAadharData4.proofOfAddress) === null || _matches_digilockerAadharData_proofOfAddress4 === void 0 ? void 0 : _matches_digilockerAadharData_proofOfAddress4.district) !== null && _ref9 !== void 0 ? _ref9 : '',
                                state: (_matches_digilockerAadharData5 = matches.digilockerAadharData) === null || _matches_digilockerAadharData5 === void 0 ? void 0 : (_matches_digilockerAadharData_proofOfAddress5 = _matches_digilockerAadharData5.proofOfAddress) === null || _matches_digilockerAadharData_proofOfAddress5 === void 0 ? void 0 : _matches_digilockerAadharData_proofOfAddress5.state,
                                pincode: ((_matches_digilockerAadharData6 = matches.digilockerAadharData) === null || _matches_digilockerAadharData6 === void 0 ? void 0 : (_matches_digilockerAadharData_proofOfAddress6 = _matches_digilockerAadharData6.proofOfAddress) === null || _matches_digilockerAadharData_proofOfAddress6 === void 0 ? void 0 : _matches_digilockerAadharData_proofOfAddress6.pincode) ? Number((_matches_digilockerAadharData7 = matches.digilockerAadharData) === null || _matches_digilockerAadharData7 === void 0 ? void 0 : (_matches_digilockerAadharData_proofOfAddress7 = _matches_digilockerAadharData7.proofOfAddress) === null || _matches_digilockerAadharData_proofOfAddress7 === void 0 ? void 0 : _matches_digilockerAadharData_proofOfAddress7.pincode) : 0,
                                status: AddressStatus.VERIFIED,
                                type: AddressType.PERMANENT_ADDRESS
                            };
                            return [
                                4,
                                Promise.all([
                                    _this1.addressService.create(addressData),
                                    matches.isSurePassAadhar ? _this1.userMetaDataModel.createOrUpdateUserMeta({
                                        customerID: customerID,
                                        type: LeadLogApiType.AADHAR_V2_SUBMIT_OTP,
                                        data: matches.surePassAadharData,
                                        mobile: mobile
                                    }) : _this1.userMetaDataModel.createOrUpdateUserMeta({
                                        customerID: customerID,
                                        type: LeadLogApiType.DIGILOCKER_EAADHAR,
                                        data: matches.digilockerAadharData,
                                        mobile: mobile
                                    })
                                ])
                            ];
                        case 2:
                            _state.sent();
                            if (!!matches.aadharExistsInPan) return [
                                3,
                                7
                            ];
                            if (!(matches.dobMatch === 100)) return [
                                3,
                                4
                            ];
                            promises = [
                                _this1.customerModel.findOneAndUpdate({
                                    customerID: customerID
                                }, {
                                    dob_digit_match: '0',
                                    is_dob_match: 'Yes',
                                    is_pan_aadhar_linked: 'No',
                                    aadharNo: matches.isSurePassAadhar ? Number(matches.surePassAadharData.aadhaar_number) : null
                                })
                            ];
                            return [
                                4,
                                Promise.all(promises)
                            ];
                        case 3:
                            _state.sent();
                            errorResponseData.isDobNameMatch = true;
                            return [
                                3,
                                6
                            ];
                        case 4:
                            // Aadhar details are not fine, hence step will not be completed
                            customerTableUpdate.aadharNo = matches.isSurePassAadhar ? Number(matches.surePassAadharData.aadhaar_number) : null;
                            return [
                                4,
                                _this1.customerModel.findOneAndUpdate({
                                    customerID: customerID
                                }, customerTableUpdate)
                            ];
                        case 5:
                            _state.sent();
                            _state.label = 6;
                        case 6:
                            throw new BadRequestError('Your PAN is not linked with your aadhar, Please Re-Verify', {
                                data: errorResponseData
                            });
                        case 7:
                            if (!(matches.dobMatch === 100)) return [
                                3,
                                9
                            ];
                            customerTableUpdate.is_dob_match = 'Yes';
                            return [
                                4,
                                _this1.customerModel.findOneAndUpdate({
                                    customerID: customerID
                                }, customerTableUpdate)
                            ];
                        case 8:
                            _state.sent();
                            _state.label = 9;
                        case 9:
                            if (!(matches.dobMatch !== 100)) return [
                                3,
                                11
                            ];
                            errorResponseData.isAadharLinked = true;
                            return [
                                4,
                                _this1.customerModel.findOneAndUpdate({
                                    customerID: customerID
                                }, {
                                    dob_digit_match: '0',
                                    is_dob_match: 'No',
                                    is_pan_aadhar_linked: 'Yes',
                                    aadharNo: matches.isSurePassAadhar ? Number(matches.surePassAadharData.aadhaar_number) : null
                                })
                            ];
                        case 10:
                            _state.sent();
                            throw new BadRequestError("Your Aadhar DOB does not match your PAN's DOB", {
                                data: errorResponseData
                            });
                        case 11:
                            if (!(matches.lastDigitsMatch !== 100)) return [
                                3,
                                13
                            ];
                            errorResponseData.isAadharLinked = true;
                            return [
                                4,
                                _this1.customerModel.findOneAndUpdate({
                                    customerID: customerID
                                }, {
                                    dob_digit_match: '0',
                                    is_dob_match: 'Yes',
                                    is_pan_aadhar_linked: 'Yes',
                                    aadharNo: matches.isSurePassAadhar ? Number(matches.surePassAadharData.aadhaar_number) : null
                                })
                            ];
                        case 12:
                            _state.sent();
                            throw new BadRequestError('Your Aadhar/PAN is unverified', {
                                data: errorResponseData
                            });
                        case 13:
                            // if (matches.nameMatch !== 100) {
                            //   errorResponseData.isAadharLinked = true
                            //   throw new BadRequestError("Your Aadhar and PAN's name do not match", {
                            //     data: errorResponseData,
                            //   })
                            // }
                            // Update record in db telling customer table that everything is verified
                            // Save Aadhar address to DB
                            // Add data to userMeta
                            promises1 = [
                                _this1.customerModel.findOneAndUpdate({
                                    customerID: customerID
                                }, {
                                    dob_digit_match: '1',
                                    is_dob_match: 'Yes',
                                    is_pan_aadhar_linked: 'Yes',
                                    aadharNo: matches.isSurePassAadhar ? Number(matches.surePassAadharData.aadhaar_number) : null
                                }),
                                _this1.stepTrackermodel.completeStep(customerID, StepName.AADHAR_CONFIRMATION, Products.PAYDAY)
                            ];
                            return [
                                4,
                                Promise.all(promises1)
                            ];
                        case 14:
                            _state.sent();
                            return [
                                2,
                                _this1.serviceResponse(200, {}, 'Aadhar/PAN Verified')
                            ];
                    }
                });
            })();
        });
        return _this;
    }
    _create_class(OnboardingService, [
        {
            key: "checkDigilockerAadharExists",
            value: function checkDigilockerAadharExists(aadharNo, mobileNo, customerID, isSurepass) {
                return _async_to_generator(function() {
                    var panDetails, db, digilockerCheck, aadarResponse, _aadarResponse_proofOfIdentity, aadharDob, aadharFullName, panResponse, panFullName, panDob, aadharDobFormatted, dobMatch, nameMatch, aadhar, aadhaarDetails, aadarResponse1, panResponse1, aadharFullName1, aadharDob1, panFullName1, panDob1, dobMatch1, nameMatch1;
                    return _ts_generator(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                return [
                                    4,
                                    leadsApiLogModel.findOneLeadsApiLog({
                                        status: 1,
                                        api_type: LeadLogApiType.PAN_COMPREHENSIVE,
                                        api_supplier: ApiSupplierType.SUREPASS,
                                        mobile_no: String(mobileNo)
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
                                panDetails = _state.sent();
                                db = getKnexInstance();
                                switch(isSurepass){
                                    case false:
                                        return [
                                            3,
                                            2
                                        ];
                                    case true:
                                        return [
                                            3,
                                            7
                                        ];
                                }
                                return [
                                    3,
                                    13
                                ];
                            case 2:
                                return [
                                    4,
                                    db('leads_api_log').select('mobile_no', 'api_response') // Selecting all fields
                                    .where('api_type', 'digilocker_eaadhaar') // Filtering by api_type
                                    .whereRaw('JSON_VALID(api_response)') // Ensuring the JSON is valid
                                    .whereRaw("RIGHT(JSON_UNQUOTE(JSON_EXTRACT(api_response, '$.data.aadhaarUid')), 4) = ?", [
                                        aadharNo.slice(-4)
                                    ]).first()
                                ];
                            case 3:
                                digilockerCheck = _state.sent();
                                if (!digilockerCheck) return [
                                    3,
                                    6
                                ];
                                aadarResponse = JSON.parse(digilockerCheck.api_response).data;
                                _aadarResponse_proofOfIdentity = aadarResponse.proofOfIdentity, aadharDob = _aadarResponse_proofOfIdentity.dob, aadharFullName = _aadarResponse_proofOfIdentity.name;
                                if (!panDetails) return [
                                    3,
                                    6
                                ];
                                panResponse = JSON.parse(panDetails.api_response).data;
                                panFullName = panResponse.full_name, panDob = panResponse.dob;
                                aadharDobFormatted = moment(aadharDob, 'DD-MM-YYYY').format('YYYY-MM-DD');
                                return [
                                    4,
                                    this.findBoxService.checkNamePercentage({
                                        firstName: panDob,
                                        secondName: aadharDobFormatted,
                                        type: 'panDOB - aadharDOB',
                                        leadId: 0,
                                        customerID: customerID,
                                        customerMobileNo: String(mobileNo)
                                    }, false)
                                ];
                            case 4:
                                dobMatch = _state.sent();
                                if (!(dobMatch.percentageResult === 100)) return [
                                    3,
                                    6
                                ];
                                return [
                                    4,
                                    this.findBoxService.checkNamePercentageByRajatApi({
                                        firstName: panFullName,
                                        secondName: aadharFullName,
                                        type: 'pan - aadhar',
                                        leadId: 0,
                                        customerID: customerID,
                                        customerMobileNo: String(mobileNo)
                                    }, false)
                                ];
                            case 5:
                                nameMatch = _state.sent();
                                if (nameMatch.percentageResult === 100) {
                                    // If 100% match then aadhar already exists
                                    throw new BadRequestError('This aadhaar number is associated with another existing account', {
                                        data: {
                                            mobileNo: maskString(digilockerCheck.mobile_no, 6)
                                        }
                                    });
                                }
                                _state.label = 6;
                            case 6:
                                return [
                                    3,
                                    14
                                ];
                            case 7:
                                return [
                                    4,
                                    this.customerModel.CustomerKnex.whereRaw('RIGHT(aadharNo,4) = ?', [
                                        aadharNo
                                    ]).select('mobile').first()
                                ];
                            case 8:
                                aadhar = _state.sent();
                                if (!(aadhar && (aadhar === null || aadhar === void 0 ? void 0 : aadhar.mobile) !== mobileNo && panDetails)) return [
                                    3,
                                    12
                                ];
                                return [
                                    4,
                                    leadsApiLogModel.findOneLeadsApiLog({
                                        status: 1,
                                        api_type: LeadLogApiType.AADHAR_V2_SUBMIT_OTP,
                                        api_supplier: ApiSupplierType.SUREPASS,
                                        mobile_no: String(aadhar.mobile)
                                    }, [
                                        'api_response',
                                        'mobile_no'
                                    ], [
                                        {
                                            column: 'id',
                                            order: 'desc'
                                        }
                                    ])
                                ];
                            case 9:
                                aadhaarDetails = _state.sent();
                                if (!aadhaarDetails) return [
                                    2
                                ];
                                aadarResponse1 = JSON.parse(aadhaarDetails.api_response).data;
                                panResponse1 = JSON.parse(panDetails.api_response).data;
                                aadharFullName1 = aadarResponse1.full_name, aadharDob1 = aadarResponse1.dob;
                                panFullName1 = panResponse1.full_name, panDob1 = panResponse1.dob;
                                return [
                                    4,
                                    this.findBoxService.checkNamePercentage({
                                        firstName: panDob1,
                                        secondName: aadharDob1,
                                        type: 'panDOB - aadharDOB',
                                        leadId: 0,
                                        customerID: customerID,
                                        customerMobileNo: String(mobileNo)
                                    }, false)
                                ];
                            case 10:
                                dobMatch1 = _state.sent();
                                if (!(dobMatch1.percentageResult === 100)) return [
                                    3,
                                    12
                                ];
                                return [
                                    4,
                                    this.findBoxService.checkNamePercentageByRajatApi({
                                        firstName: panFullName1,
                                        secondName: aadharFullName1,
                                        type: 'pan - aadhar',
                                        leadId: 0,
                                        customerID: customerID,
                                        customerMobileNo: String(mobileNo)
                                    }, false)
                                ];
                            case 11:
                                nameMatch1 = _state.sent();
                                if (nameMatch1.percentageResult === 100) {
                                    // If 100% match then aadhar already exists
                                    throw new BadRequestError('This aadhaar number is associated with another existing account', {
                                        data: {
                                            mobileNo: maskString(aadhaarDetails.mobile_no, 6)
                                        }
                                    });
                                }
                                _state.label = 12;
                            case 12:
                                return [
                                    3,
                                    14
                                ];
                            case 13:
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
                }).call(this);
            }
        },
        {
            key: "ckycFetch",
            value: function ckycFetch(payload) {
                return _async_to_generator(function() {
                    var pancard, mobileNo, customerID, dob, ckycDownloadResp, ckycSearchResponse, ckycDownloadResponse, isChecksPassed, updateCustomer;
                    return _ts_generator(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                pancard = payload.pancard, mobileNo = payload.mobileNo, customerID = payload.customerID, dob = payload.dob;
                                return [
                                    4,
                                    leadsApiLogModel.findCkycDownloadResponse(pancard)
                                ];
                            case 1:
                                ckycDownloadResp = _state.sent();
                                if (!!ckycDownloadResp) return [
                                    3,
                                    4
                                ];
                                return [
                                    4,
                                    ckycSearch({
                                        id_number: pancard
                                    }, customerID, mobileNo)
                                ];
                            case 2:
                                ckycSearchResponse = _state.sent();
                                if (!ckycSearchResponse.success) {
                                    logger.error('Error in CKYC search API ' + JSON.stringify(ckycSearchResponse.data));
                                    throw new BadRequestError('An error occured in initialising your CKYC process, Please try again!');
                                }
                                return [
                                    4,
                                    ckycDownload({
                                        client_id: ckycSearchResponse.data.client_id,
                                        dob: dob
                                    }, customerID, mobileNo, pancard)
                                ];
                            case 3:
                                ckycDownloadResponse = _state.sent();
                                if (!ckycDownloadResponse.success) {
                                    logger.error('Error in CKYC search API ' + JSON.stringify(ckycSearchResponse.data));
                                    throw new BadRequestError('An error occured in initialising your CKYC process, Please try again!');
                                }
                                ckycDownloadResp = ckycDownloadResponse.data;
                                _state.label = 4;
                            case 4:
                                return [
                                    4,
                                    this.ckycChecks(pancard, customerID, String(mobileNo))
                                ];
                            case 5:
                                isChecksPassed = _state.sent();
                                // Update CKYC in customer table
                                updateCustomer = {
                                    ckyc_status: CkycStatus.SUCCESS
                                };
                                if (!isChecksPassed) {
                                    updateCustomer.dob_digit_match = null;
                                    updateCustomer.is_pan_aadhar_linked = 'Not';
                                    updateCustomer.is_dob_match = 'Not';
                                    updateCustomer.ckyc_status = CkycStatus.CKYC_FAILED;
                                }
                                return [
                                    4,
                                    this.customerModel.findOneAndUpdate({
                                        customerID: customerID
                                    }, updateCustomer)
                                ];
                            case 6:
                                _state.sent();
                                return [
                                    2,
                                    this.serviceResponse(HttpStatusCode.Ok, {
                                        success: isChecksPassed
                                    }, isChecksPassed ? 'Success' : 'Failure')
                                ];
                        }
                    });
                }).call(this);
            }
        },
        {
            key: "ckycChecks",
            value: function ckycChecks(pancard, customerID, mobileNo) {
                return _async_to_generator(function() {
                    var isMatched, ckycData, mobileNoMatch;
                    return _ts_generator(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                isMatched = true;
                                return [
                                    4,
                                    leadsApiLogModel.findCkycDataForMatch(pancard)
                                ];
                            case 1:
                                ckycData = _state.sent();
                                return [
                                    4,
                                    this.findBoxService.checkNamePercentage({
                                        firstName: mobileNo,
                                        secondName: ckycData.cykcMobile,
                                        type: 'mobileNumber - ckycMobileNumber',
                                        leadId: 0,
                                        customerID: customerID,
                                        customerMobileNo: mobileNo
                                    })
                                ];
                            case 2:
                                mobileNoMatch = _state.sent();
                                // Check if image exists or not
                                if (mobileNoMatch.percentageResult !== 100 || !ckycData.ckycImage) {
                                    isMatched = false;
                                }
                                return [
                                    2,
                                    isMatched
                                ];
                        }
                    });
                }).call(this);
            }
        }
    ]);
    return OnboardingService;
}(ResponseService);
export var onboardingservice = new OnboardingService();

//# sourceMappingURL=onboarding.service.js.map