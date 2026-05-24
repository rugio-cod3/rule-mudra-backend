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
import axios from 'axios';
import { ApiSupplierType, DecentroApiUrl, LeadLogApiType } from '../../enums/common.enum';
import CommonHelper from '../../helpers/common';
import { logger } from '../../utils/logger';
import AxiosService from '../api.service';
import LeadApiLogService from '../leadApiLog.service';
import LeadApiLogMongoDBService from '../leadApiLogMongo.service';
import UserMetaDataService from '../userMetadata.service';
var DigilockerService = /*#__PURE__*/ function() {
    "use strict";
    function DigilockerService() {
        _class_call_check(this, DigilockerService);
        _define_property(this, "leadApiLogService", new LeadApiLogService());
        _define_property(this, "userMetaDataService", new UserMetaDataService());
        _define_property(this, "leadApiLogMongoDBService", new LeadApiLogMongoDBService());
        _define_property(this, "commonHelper", new CommonHelper());
        _define_property(this, "url", config.decentro_api);
        _define_property(this, "apiService", new AxiosService(config.decentroBaseUrl));
    }
    _create_class(DigilockerService, [
        {
            key: "headers",
            value: function headers() {
                return {
                    accept: 'application/json',
                    client_id: config.decentro_client_id,
                    client_secret: config.decentro_client_secret,
                    module_secret: config.decentro_module_secret,
                    'content-type': 'application/json'
                };
            }
        },
        {
            key: "apiCall",
            value: //UT Done
            function apiCall(url, method, headers, body) {
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
                                    axios({
                                        method: method,
                                        url: url,
                                        headers: headers,
                                        data: body,
                                        maxBodyLength: Infinity
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
                })();
            }
        },
        {
            key: "initiateDigiLockerAadhar",
            value: function initiateDigiLockerAadhar(customerID, mobileNo, callBackUrl) {
                return _async_to_generator(function() {
                    var reference_id, baseUrl, requestBody, result, saveObject, error;
                    return _ts_generator(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                reference_id = customerID.toString() + Date.now();
                                baseUrl = this.commonHelper.getBaseUrl();
                                requestBody = {
                                    reference_id: reference_id,
                                    consent: true,
                                    consent_purpose: 'For Bank Account Purpose Only',
                                    redirect_url: callBackUrl,
                                    // redirect_url: `${baseUrl}/new-api/customer_onboarding/aadhar-verification-webhook-digilocker?customerID=${customerID}&mobile=${mobileNo}`,
                                    // redirect_url: `https://fintest.loca.lt/customer_onboarding/aadhar-verification-webhook-digilocker?customerID=${customerID}&mobile=${mobileNo}`,
                                    redirect_to_signup: true
                                };
                                return [
                                    4,
                                    this.apiService.call('post', DecentroApiUrl.AADHAR_INITIATE, requestBody, undefined, this.headers())
                                ];
                            case 1:
                                result = _state.sent();
                                saveObject = {
                                    customerID: customerID,
                                    api_type: LeadLogApiType.DIGILOCKER_INITIATE_AADHAR,
                                    api_supplier: ApiSupplierType.DECENTRO,
                                    api_response: JSON.stringify(result.data),
                                    status: result.success ? 1 : 0,
                                    api_endpoint_url: config.decentroBaseUrl + DecentroApiUrl.AADHAR_INITIATE,
                                    api_method: 'POST',
                                    api_headers: JSON.stringify(this.headers()),
                                    api_request: JSON.stringify(requestBody),
                                    mobile_no: mobileNo.toString()
                                };
                                return [
                                    4,
                                    this.leadApiLogService.create(saveObject)
                                ];
                            case 2:
                                _state.sent();
                                _state.label = 3;
                            case 3:
                                _state.trys.push([
                                    3,
                                    5,
                                    ,
                                    6
                                ]);
                                return [
                                    4,
                                    this.leadApiLogMongoDBService.create('Digilocker', saveObject)
                                ];
                            case 4:
                                _state.sent();
                                return [
                                    3,
                                    6
                                ];
                            case 5:
                                error = _state.sent();
                                logger.error('Error while saving to MongoDB collection : Digilocker', error);
                                return [
                                    3,
                                    6
                                ];
                            case 6:
                                return [
                                    2,
                                    result
                                ];
                        }
                    });
                }).call(this);
            }
        },
        {
            key: "generateDecentroAccessToken",
            value: function generateDecentroAccessToken(state, code, customerID, mobile) {
                return _async_to_generator(function() {
                    var requestBody, result, saveObject, error;
                    return _ts_generator(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                // TODO : Check result
                                requestBody = {
                                    reference_id: Date.now().toString(),
                                    initial_decentro_transaction_id: state,
                                    consent: true,
                                    consent_purpose: 'For Bank Account Purpose Only',
                                    digilocker_code: code
                                };
                                return [
                                    4,
                                    this.apiService.call('post', DecentroApiUrl.GET_ACCESS_TOKEN, requestBody, undefined, this.headers())
                                ];
                            case 1:
                                result = _state.sent();
                                saveObject = {
                                    customerID: customerID,
                                    api_type: LeadLogApiType.DIGILOCKER_ACCESS_TOKEN,
                                    api_supplier: ApiSupplierType.DECENTRO,
                                    api_response: JSON.stringify(result.data),
                                    status: result.success ? 1 : 0,
                                    api_endpoint_url: config.decentroBaseUrl + DecentroApiUrl.GET_ACCESS_TOKEN,
                                    api_method: 'POST',
                                    api_headers: JSON.stringify(this.headers()),
                                    api_request: JSON.stringify(requestBody),
                                    mobile_no: mobile.toString()
                                };
                                return [
                                    4,
                                    this.leadApiLogService.create(saveObject)
                                ];
                            case 2:
                                _state.sent();
                                _state.label = 3;
                            case 3:
                                _state.trys.push([
                                    3,
                                    5,
                                    ,
                                    6
                                ]);
                                return [
                                    4,
                                    this.leadApiLogMongoDBService.create('digilocker', saveObject)
                                ];
                            case 4:
                                _state.sent();
                                return [
                                    3,
                                    6
                                ];
                            case 5:
                                error = _state.sent();
                                logger.error('Error while saving to MongoDB collection : digilocker', error);
                                return [
                                    3,
                                    6
                                ];
                            case 6:
                                return [
                                    2,
                                    result
                                ];
                        }
                    });
                }).call(this);
            }
        },
        {
            key: "getEaadharData",
            value: // ! Depracated
            // public async getAccessTokenDigilocker(
            //   state: string,
            //   code: string,
            //   customerID: number,
            //   mobile: string,
            // ): Promise<{ success: boolean; message: string; code: number; data: {} }> {
            //   try {
            //     const url = config.decentro_access_token_Api
            //     const referenceId = Date.now().toString()
            //     const initial_decentro_transaction_id = state
            //     const Data = JSON.stringify({
            //       initial_decentro_transaction_id: initial_decentro_transaction_id,
            //       consent: true,
            //       consent_purpose: 'For Bank Account Purpose Only',
            //       reference_id: String(referenceId),
            //       digilocker_code: code,
            //     })
            //     const response = await this.apiCall(url, 'POST', this.headers(), Data)
            //     let saveObject = {
            //       customerID: customerID,
            //       api_type: 'digilocker_access_token',
            //       api_supplier: 1,
            //       api_response: JSON.stringify(response.data),
            //       status: 1,
            //       api_endpoint_url: url,
            //       api_method: 'POST',
            //       api_headers: JSON.stringify(this.headers()),
            //       api_request: JSON.stringify({
            //         initial_decentro_transaction_id: initial_decentro_transaction_id,
            //         consent: true,
            //         consent_purpose: 'For Bank Account Purpose Only',
            //         reference_id: String(referenceId),
            //         digilocker_code: code,
            //       }),
            //       mobile_no: mobile,
            //     }
            //     await this.leadApiLogService.create(saveObject)
            //     if (response?.status == 200) {
            //       return {
            //         success: true,
            //         message: response?.data?.message,
            //         code: response?.status || 400,
            //         data: response?.data,
            //       }
            //     } else {
            //       return {
            //         success: false,
            //         message: response?.data?.message,
            //         code: response?.status || 400,
            //         data: response?.data,
            //       }
            //     }
            //   } catch (error) {
            //     console.error('Error fetching access token from Digilocker:', error)
            //     throw error
            //   }
            // }
            function getEaadharData(state, customerID, mobile) {
                return _async_to_generator(function() {
                    var requestBody, result;
                    return _ts_generator(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                requestBody = {
                                    initial_decentro_transaction_id: state,
                                    consent: true,
                                    consent_purpose: 'For Bank Account Purpose Only',
                                    reference_id: Date.now().toString(),
                                    generate_xml: false
                                };
                                return [
                                    4,
                                    this.apiService.call('post', DecentroApiUrl.EAADHAR, requestBody, undefined, this.headers())
                                ];
                            case 1:
                                result = _state.sent();
                                // Not to save here
                                return [
                                    2,
                                    result
                                ];
                        }
                    });
                }).call(this);
            }
        }
    ]);
    return DigilockerService;
}();
export default DigilockerService;

//# sourceMappingURL=digilocker.service.js.map