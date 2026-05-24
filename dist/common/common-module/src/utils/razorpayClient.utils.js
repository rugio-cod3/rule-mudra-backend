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
import config from '@/config/default';
import AxiosService from '../services/api.service';
import axios from 'axios';
import crypto from 'crypto';
import moment from 'moment';
import short from 'short-uuid';
import { razorPayLogsModel } from '../database/mysql/razorpayLogs';
import { razorpayMandateModel } from '../database/mysql/razorpayMandate';
import { razorpayMandateStatusModel } from '../database/mysql/razorpayMandateStatus';
import { RazorPayApiUrl, RazorPayLogApiType } from '../enums/razorpay.enum';
import { convertRupeesToPaise, generateRandomNumber, truncateString } from './util';
import { LenderCredentials, LenderStatus } from '../enums/lender.enum';
import { getDecryptedObject } from './AESEncryption';
import { lenderCredsModel } from '../database/mysql/lender_creds';
import { leadModel } from '../database/mysql/leads';
var RazorpayPG = /*#__PURE__*/ function() {
    "use strict";
    function RazorpayPG() {
        var _this = this;
        var _this1 = this;
        _class_call_check(this, RazorpayPG);
        _define_property(this, "baseUrl", 'https://api.razorpay.com/v1');
        _define_property(this, "auth", Buffer.from("".concat(config.razorpayDisbursalKeyId, ":").concat(config.razorpayDisbursalKeySecret)).toString('base64'));
        _define_property(this, "pennyAuth", Buffer.from("".concat(config.razorpayPennyKeyId, ":").concat(config.razorpayPennyKeySecret)).toString('base64'));
        _define_property(this, "apiService", new AxiosService(config.razorPayBaseUrl));
        _define_property(this, "razorPayLogsModel", razorPayLogsModel);
        _define_property(this, "razorpayMandateModel", razorpayMandateModel);
        _define_property(this, "razorpayMandateStatusModel", razorpayMandateStatusModel);
        _define_property(this, "lenderCredsModel", lenderCredsModel);
        _define_property(this, "leadModel", leadModel);
        _define_property(this, "createOrder2", function(requestBody) {
            return _async_to_generator(function() {
                var apiUrl, response, error;
                return _ts_generator(this, function(_state) {
                    switch(_state.label){
                        case 0:
                            _state.trys.push([
                                0,
                                2,
                                ,
                                3
                            ]);
                            apiUrl = "".concat(this.baseUrl, "/orders/");
                            return [
                                4,
                                axios.post(apiUrl, requestBody, {
                                    headers: {
                                        'Content-Type': 'application/json',
                                        Authorization: "Basic ".concat(this.auth)
                                    }
                                })
                            ];
                        case 1:
                            response = _state.sent();
                            return [
                                2,
                                response.data
                            ];
                        case 2:
                            error = _state.sent();
                            // Handle the error
                            if (error.response) {
                                console.error("Error creating order: ".concat(error.response.status, " ").concat(error.response.statusText));
                                console.error('Error details:', error.response.data);
                            }
                            return [
                                2,
                                error
                            ];
                        case 3:
                            return [
                                2
                            ];
                    }
                });
            }).call(_this);
        });
        // public createRecurringPayment = async (requestBody: {}) => {
        //   try {
        //     let apiUrl = `${this.baseUrl}/payments/create/recurring/`
        //     const response = await axios.post(apiUrl, requestBody, {
        //       headers: {
        //         'Content-Type': 'application/json',
        //         Authorization: `Basic ${this.auth}`,
        //       },
        //     })
        //     return response.data
        //   } catch (error) {
        //     // Handle the error
        //     if (error.response) {
        //       console.error(
        //         `Error creating order: ${error.response.status} ${error.response.statusText}`,
        //       )
        //       console.error('Error details:', error.response.data)
        //     }
        //     return error
        //   }
        // }
        _define_property(this, "createPlan", function(requestBody) {
            return _async_to_generator(function() {
                var apiUrl, response, error;
                return _ts_generator(this, function(_state) {
                    switch(_state.label){
                        case 0:
                            _state.trys.push([
                                0,
                                2,
                                ,
                                3
                            ]);
                            apiUrl = "".concat(this.baseUrl, "/plans/");
                            return [
                                4,
                                axios.post(apiUrl, requestBody, {
                                    headers: {
                                        'Content-Type': 'application/json',
                                        Authorization: "Basic ".concat(this.auth)
                                    }
                                })
                            ];
                        case 1:
                            response = _state.sent();
                            // console.log(response.data)
                            return [
                                2,
                                response.data
                            ];
                        case 2:
                            error = _state.sent();
                            // Handle the error
                            if (error.response) {
                                console.error("Error creating order: ".concat(error.response.status, " ").concat(error.response.statusText));
                                console.error('Error details:', error.response.data);
                            }
                            return [
                                2,
                                error
                            ];
                        case 3:
                            return [
                                2
                            ];
                    }
                });
            }).call(_this);
        });
        _define_property(this, "createNormalRefund", function(requestBody, paymentId) {
            return _async_to_generator(function() {
                var apiUrl, response, error;
                return _ts_generator(this, function(_state) {
                    switch(_state.label){
                        case 0:
                            _state.trys.push([
                                0,
                                2,
                                ,
                                3
                            ]);
                            apiUrl = "".concat(this.baseUrl, "/payments/").concat(paymentId, "/refund");
                            return [
                                4,
                                axios.post(apiUrl, requestBody, {
                                    headers: {
                                        'Content-Type': 'application/json',
                                        Authorization: "Basic ".concat(this.auth)
                                    }
                                })
                            ];
                        case 1:
                            response = _state.sent();
                            return [
                                2,
                                response
                            ];
                        case 2:
                            error = _state.sent();
                            // Handle the error
                            if (error.response) {
                                console.error("Error creating refund: ".concat(error.response.status, " ").concat(error.response.statusText));
                                console.error('Error details:', error.response);
                            }
                            return [
                                2,
                                error.response
                            ];
                        case 3:
                            return [
                                2
                            ];
                    }
                });
            }).call(_this);
        });
        // ! Depracated
        // public createEmandate = async (requestBody: {
        //   name: string
        //   email: string
        //   mobile: number
        //   auth_type: string
        //   account_number: string
        //   ifsc_code: string
        //   account_type: string
        // }) => {
        //   try {
        //     let customer = await this.createCustomer({
        //       name: requestBody?.name,
        //       contact: requestBody?.mobile,
        //       email: requestBody?.email,
        //       fail_existing: '0',
        //     })
        //     if (customer.status != 200 || customer.data.hasOwnProperty('error')) {
        //       return { error: { ...customer?.data?.error } }
        //     }
        //     let currentTimestamp = Math.floor(Date.now() / 1000) // Current timestamp in seconds
        //     let fortyYearsInSeconds = 40 * 365 * 24 * 60 * 60 // 40 years in seconds
        //     let validExpireAt = currentTimestamp + fortyYearsInSeconds
        //     let order = await this.createOrder({
        //       amount: 0,
        //       currency: 'INR',
        //       payment_capture: true,
        //       method: 'emandate',
        //       customer_id: customer.data.id,
        //       token: {
        //         auth_type: requestBody?.auth_type
        //           ? requestBody?.auth_type
        //           : 'netbanking',
        //         max_amount: 100000,
        //         expire_at: validExpireAt,
        //         bank_account: {
        //           beneficiary_name: 'Tarun Sharma',
        //           account_number: 34977767419,
        //           account_type: 'savings',
        //           ifsc_code: 'SBIN0001028',
        //         },
        //       },
        //     })
        //     if (order?.id) {
        //       return { order: { ...order }, customerId: customer?.data?.id }
        //     } else {
        //       return { error: { ...order?.response?.data?.error } }
        //     }
        //   } catch (error) {
        //     // Handle the error
        //     if (error.response) {
        //       console.error(
        //         `Error creating e-mandate: ${error.response.status} ${error.response.statusText}`,
        //       )
        //       console.error('Error details:', error.response)
        //     }
        //     return error.response
        //   }
        // }
        // public createEmandateCharge = async (requestBody: {}) => {
        //   try {
        //     let order = await this.createOrder({
        //       amount: 10000,
        //       currency: 'INR',
        //       payment_capture: true,
        //     })
        //     if (order?.id) {
        //       let payment = await this.createRecurringPayment({
        //         email: 'dev1@ramfincorp.com',
        //         contact: 9410040742,
        //         amount: 10000,
        //         currency: 'INR',
        //         order_id: order.id,
        //         customer_id: 'cust_OS7OgHgcfk7o2Q',
        //         token: 'token_OSAlmXiEgOl3im',
        //         recurring: '1',
        //         description: 'Creating recurring payment for Tarun Sharma',
        //       })
        //       console.log('ppppppppppp', payment)
        //       if (payment.id) {
        //         return { payment: { ...payment } }
        //       } else {
        //         return { error: { ...payment.response.data } }
        //       }
        //     } else {
        //       return { error: { ...order?.response?.data?.error } }
        //     }
        //   } catch (error) {
        //     // Handle the error
        //     if (error.response) {
        //       console.error(
        //         `Error creating e-mandate: ${error.response.status} ${error.response.statusText}`,
        //       )
        //       console.error('Error details:', error.response)
        //     }
        //     return error.response
        //   }
        // }
        _define_property(this, "fetchDisbursedPayment", function(id) {
            return _async_to_generator(function() {
                var apiUrl, response, error, _error_response_data, _error_response;
                return _ts_generator(this, function(_state) {
                    switch(_state.label){
                        case 0:
                            _state.trys.push([
                                0,
                                2,
                                ,
                                3
                            ]);
                            apiUrl = "".concat(this.baseUrl, "/payouts/").concat(id);
                            return [
                                4,
                                axios.get(apiUrl, {
                                    headers: {
                                        'Content-Type': 'application/json',
                                        Authorization: "Basic ".concat(this.auth)
                                    }
                                })
                            ];
                        case 1:
                            response = _state.sent();
                            return [
                                2,
                                response
                            ];
                        case 2:
                            error = _state.sent();
                            // Handle the error
                            if (error.response) {
                                ;
                                console.error("Error fetching dusbursal payment: ".concat(error === null || error === void 0 ? void 0 : (_error_response = error.response) === null || _error_response === void 0 ? void 0 : (_error_response_data = _error_response.data) === null || _error_response_data === void 0 ? void 0 : _error_response_data.message));
                            }
                            return [
                                2,
                                error.response
                            ];
                        case 3:
                            return [
                                2
                            ];
                    }
                });
            }).call(_this);
        });
        _define_property(this, "createEmandateAuthLink", function(customerID, leadID, payload) {
            return _async_to_generator(function() {
                var email, contact, accountNo, accountType, ifsc, amount, name, maxAmount, notesData, apiPayload, response;
                return _ts_generator(this, function(_state) {
                    switch(_state.label){
                        case 0:
                            email = payload.email, contact = payload.contact, accountNo = payload.accountNo, accountType = payload.accountType, ifsc = payload.ifsc, amount = payload.amount;
                            name = payload.name;
                            name = truncateString(name);
                            maxAmount = convertRupeesToPaise(amount * 3);
                            notesData = name.substring(0, 20) + '-' + contact + '-' + generateRandomNumber(1111, 9999);
                            apiPayload = {
                                customer: {
                                    contact: contact,
                                    email: email,
                                    name: name
                                },
                                amount: 0,
                                currency: 'INR',
                                description: name,
                                email_notify: 1,
                                sms_notify: 1,
                                expire_by: moment().add(24, 'months').unix(),
                                receipt: notesData,
                                type: 'link',
                                subscription_registration: {
                                    auth_type: '',
                                    expire_at: moment().add(24, 'months').unix(),
                                    max_amount: maxAmount,
                                    method: 'emandate',
                                    bank_account: {
                                        account_number: accountNo,
                                        account_type: accountType.toLowerCase() + 's',
                                        beneficiary_name: name,
                                        ifsc_code: ifsc
                                    }
                                },
                                notes: {
                                    note_key_1: notesData,
                                    note_key_2: notesData
                                }
                            };
                            return [
                                4,
                                this.apiService.call('post', RazorPayApiUrl.CREATE_SUBSCRIPTION_LINK, apiPayload, undefined, this.headers)
                            ];
                        case 1:
                            response = _state.sent();
                            // save the response to razorpay logs
                            if (response.data.currency_symbol) delete response.data.currency_symbol;
                            return [
                                4,
                                this.razorPayLogsModel.insert({
                                    api_request: JSON.stringify(apiPayload),
                                    api_response: JSON.stringify(response.data),
                                    customerID: customerID,
                                    leadID: leadID,
                                    req_url: config.razorPayBaseUrl + RazorPayApiUrl.CREATE_SUBSCRIPTION_LINK,
                                    type: RazorPayLogApiType.EMANDATE
                                })
                            ];
                        case 2:
                            _state.sent();
                            return [
                                2,
                                response
                            ];
                    }
                });
            }).call(_this);
        });
        _define_property(this, "createOrder", function(customerID, leadID, payload) {
            var isCustomer = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : false;
            return _async_to_generator(function() {
                var amount, currency, customer_id, method, payment_capture, receipt, token, notes, apiPayload, creds, auth, headers, response, _tmp;
                return _ts_generator(this, function(_state) {
                    switch(_state.label){
                        case 0:
                            amount = payload.amount, currency = payload.currency, customer_id = payload.customer_id, method = payload.method, payment_capture = payload.payment_capture, receipt = payload.receipt, token = payload.token, notes = payload.notes;
                            apiPayload = {
                                amount: amount,
                                currency: currency,
                                payment_capture: typeof payment_capture === 'undefined' ? true : false,
                                notes: notes,
                                receipt: receipt !== null && receipt !== void 0 ? receipt : customerID + '-' + short.generate() + '-' + leadID
                            };
                            if (token) {
                                apiPayload.token = token;
                            }
                            if (customer_id) {
                                apiPayload.customer_id = customer_id;
                            }
                            if (method) {
                                apiPayload.method = method;
                            }
                            return [
                                4,
                                this.getLenderCredentialsByLeadId(leadID, LenderCredentials.RAZORPAY_EMANDATE)
                            ];
                        case 1:
                            creds = _state.sent();
                            auth = Buffer.from("".concat(creds.razorpay_disbursal_key_id, ":").concat(creds.razorpay_disbursal_secret_key)).toString('base64');
                            headers = {
                                Authorization: "Basic ".concat(auth),
                                'Cache-Control': 'no-cache',
                                'Content-Type': 'application/json'
                            };
                            return [
                                4,
                                this.apiService.call('post', RazorPayApiUrl.CREATE_ORDER, apiPayload, undefined, headers)
                            ];
                        case 2:
                            response = _state.sent();
                            _tmp = isCustomer;
                            if (!_tmp) return [
                                3,
                                4
                            ];
                            return [
                                4,
                                this.razorPayLogsModel.insert({
                                    api_request: JSON.stringify(apiPayload),
                                    api_response: JSON.stringify(response.data),
                                    customerID: customerID,
                                    leadID: leadID,
                                    req_url: config.razorPayBaseUrl + RazorPayApiUrl.CREATE_ORDER,
                                    type: RazorPayLogApiType.CREATE_ORDER
                                })
                            ];
                        case 3:
                            _tmp = _state.sent();
                            _state.label = 4;
                        case 4:
                            _tmp;
                            return [
                                2,
                                response
                            ];
                    }
                });
            }).call(_this1);
        });
        _define_property(this, "createContact", function(customerID, leadID, payload) {
            return _async_to_generator(function() {
                var response;
                return _ts_generator(this, function(_state) {
                    switch(_state.label){
                        case 0:
                            return [
                                4,
                                this.apiService.call('post', RazorPayApiUrl.CREATE_CONTACT, payload, undefined, this.xHeaders)
                            ];
                        case 1:
                            response = _state.sent();
                            // save the response to razorpay logs
                            return [
                                4,
                                this.razorPayLogsModel.insert({
                                    api_request: JSON.stringify(payload),
                                    api_response: JSON.stringify(response.data),
                                    customerID: customerID,
                                    leadID: leadID,
                                    req_url: config.razorPayBaseUrl + RazorPayApiUrl.CREATE_CONTACT,
                                    type: RazorPayLogApiType.CONTACTS
                                })
                            ];
                        case 2:
                            _state.sent();
                            return [
                                2,
                                response
                            ];
                    }
                });
            }).call(_this);
        });
        _define_property(this, "createFundAccount", function(customerID, leadID, payload) {
            return _async_to_generator(function() {
                var response;
                return _ts_generator(this, function(_state) {
                    switch(_state.label){
                        case 0:
                            return [
                                4,
                                this.apiService.call('post', RazorPayApiUrl.CREATE_FUND_ACCOUNT, payload, undefined, this.xHeaders)
                            ];
                        case 1:
                            response = _state.sent();
                            return [
                                4,
                                this.razorPayLogsModel.insert({
                                    api_request: JSON.stringify(payload),
                                    api_response: JSON.stringify(response.data),
                                    customerID: customerID,
                                    leadID: leadID,
                                    req_url: config.razorPayBaseUrl + RazorPayApiUrl.CREATE_FUND_ACCOUNT,
                                    type: RazorPayLogApiType.FUND_ACCOUNTS
                                })
                            ];
                        case 2:
                            _state.sent();
                            return [
                                2,
                                response
                            ];
                    }
                });
            }).call(_this);
        });
        _define_property(this, "validateAccount", function(customerID, leadID, payload) {
            return _async_to_generator(function() {
                var response;
                return _ts_generator(this, function(_state) {
                    switch(_state.label){
                        case 0:
                            return [
                                4,
                                this.apiService.call('post', RazorPayApiUrl.VALIDATE_ACCOUNT, payload, undefined, this.xHeaders)
                            ];
                        case 1:
                            response = _state.sent();
                            return [
                                4,
                                this.razorPayLogsModel.insert({
                                    api_request: JSON.stringify(payload),
                                    api_response: JSON.stringify(response.data),
                                    customerID: customerID,
                                    leadID: leadID,
                                    req_url: config.razorPayBaseUrl + RazorPayApiUrl.VALIDATE_ACCOUNT,
                                    type: RazorPayLogApiType.VALIDATE_ACCOUNT
                                })
                            ];
                        case 2:
                            _state.sent();
                            return [
                                2,
                                response
                            ];
                    }
                });
            }).call(_this);
        });
    }
    _create_class(RazorpayPG, [
        {
            key: "headers",
            get: function get() {
                return {
                    Authorization: "Basic ".concat(this.auth),
                    'Cache-Control': 'no-cache',
                    'Content-Type': 'application/json'
                };
            }
        },
        {
            key: "xHeaders",
            get: function get() {
                return {
                    Authorization: "Basic ".concat(this.pennyAuth),
                    'Cache-Control': 'no-cache',
                    'Content-Type': 'application/json'
                };
            }
        },
        {
            key: "verifySignature",
            value: function verifySignature(orderId, paymentId, signature) {
                // Generate the expected signature using the order_id and payment_id
                var hmac = crypto.createHmac('sha256', config.razorpayDisbursalKeySecret);
                hmac.update(orderId + '|' + paymentId);
                var generatedSignature = hmac.digest('hex');
                return generatedSignature === signature;
            }
        },
        {
            key: "createRecurringPayment",
            value: function createRecurringPayment(payload) {
                return _async_to_generator(function() {
                    var response;
                    return _ts_generator(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                return [
                                    4,
                                    this.apiService.call('post', RazorPayApiUrl.RECURRING_PAYMENT, payload, undefined, this.headers)
                                ];
                            case 1:
                                response = _state.sent();
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
            key: "razorpayVirtualAccount",
            value: function razorpayVirtualAccount(url, data) {
                return _async_to_generator(function() {
                    var response, error;
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
                                            Authorization: "Basic ".concat(this.auth),
                                            'Cache-Control': 'no-cache',
                                            'Content-Type': 'application/json'
                                        },
                                        maxRedirects: 10,
                                        timeout: 30000
                                    })
                                ];
                            case 1:
                                response = _state.sent();
                                if (response.data.error) {
                                    return [
                                        2,
                                        {
                                            status: 'error',
                                            message: response.data.error.description
                                        }
                                    ];
                                }
                                return [
                                    2,
                                    {
                                        status: 'success',
                                        data: response.data
                                    }
                                ];
                            case 2:
                                error = _state.sent();
                                return [
                                    2,
                                    {
                                        status: 'error',
                                        message: error.message
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
            key: "getLenderCredentialsByLeadId",
            value: function getLenderCredentialsByLeadId(leadId, keyType) {
                return _async_to_generator(function() {
                    var leadRecord, lenderRecord, decrytedCredentials;
                    return _ts_generator(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                return [
                                    4,
                                    this.leadModel.findOne({
                                        where: {
                                            leadID: leadId
                                        },
                                        select: [
                                            'lenderID'
                                        ]
                                    })
                                ];
                            case 1:
                                leadRecord = _state.sent();
                                if (!leadRecord) {
                                    throw new Error("Lead not found with ID: ".concat(leadId));
                                }
                                return [
                                    4,
                                    this.lenderCredsModel.findOne({
                                        where: {
                                            lenderID: leadRecord.lenderID,
                                            cred_name: keyType,
                                            status: LenderStatus.ACTIVE
                                        },
                                        select: [
                                            'credentials'
                                        ]
                                    })
                                ];
                            case 2:
                                lenderRecord = _state.sent();
                                if (!(lenderRecord === null || lenderRecord === void 0 ? void 0 : lenderRecord.credentials)) {
                                    throw new Error("Lender credentials not found with ID: ".concat(leadRecord.lenderID));
                                }
                                decrytedCredentials = getDecryptedObject(lenderRecord.credentials);
                                return [
                                    2,
                                    decrytedCredentials
                                ];
                        }
                    });
                }).call(this);
            }
        }
    ]);
    return RazorpayPG;
}();
export default RazorpayPG;
export var razorPayPayments = new RazorpayPG();

//# sourceMappingURL=razorpayClient.utils.js.map