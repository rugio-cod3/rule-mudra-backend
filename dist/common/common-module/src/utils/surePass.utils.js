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
import axios from 'axios';
import { leadsApiLogModel } from '../database/mysql/leadApiLogs';
import { ApiSupplierType, LeadLogApiType, SurePassApiUrl } from '../enums/common.enum';
import AxiosService from '../services/api.service';
import LeadApiLogService from '../services/leadApiLog.service';
var leadApiLogService = new LeadApiLogService();
var apiService = new AxiosService(config.surePassApi);
var headers = {
    'Content-Type': 'application/json',
    Authorization: "Bearer ".concat(config.surePassToken)
};
export function generateAadharOtpBySurepass(aadharNo, customerID) {
    return _async_to_generator(function() {
        var url, response, data, saveObject, error;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    url = config.surePassApi + '/api/v1/aadhaar-v2/generate-otp';
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
                        axios.post(url, {
                            id_number: aadharNo
                        }, {
                            headers: {
                                'content-type': 'application/json',
                                Authorization: "Bearer ".concat(config.surePassToken)
                            }
                        })
                    ];
                case 2:
                    response = _state.sent();
                    data = response.data;
                    saveObject = {
                        customerID: customerID,
                        api_type: 'aadhaar-v2-generate-otp',
                        api_supplier: 4,
                        api_response: JSON.stringify(data),
                        status: 1,
                        api_endpoint_url: url,
                        api_method: 'POST',
                        api_headers: JSON.stringify({
                            'content-type': 'application/json',
                            Authorization: "Bearer ".concat(config.surePassToken)
                        }),
                        api_request: JSON.stringify({
                            id_number: aadharNo
                        })
                    };
                    return [
                        4,
                        leadApiLogService.create(saveObject)
                    ];
                case 3:
                    _state.sent();
                    return [
                        2,
                        data
                    ];
                case 4:
                    error = _state.sent();
                    console.log('Error', error.message);
                    throw new Error('Error while generating otp through surePass');
                case 5:
                    return [
                        2
                    ];
            }
        });
    })();
}
export function verifyAadharOtpBySurepass(otp, customerId) {
    return _async_to_generator(function() {
        var logData, apiResponse, url, _apiResponse_data, _data_data, response, data, saveObject, error;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    return [
                        4,
                        leadsApiLogModel.findOneLeadsApiLog({
                            customerID: customerId,
                            status: 1,
                            api_type: 'aadhaar-v2-generate-otp'
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
                    logData = _state.sent();
                    apiResponse = JSON.parse(logData.api_response);
                    url = config.surePassApi + '/api/v1/aadhaar-v2/submit-otp';
                    _state.label = 2;
                case 2:
                    _state.trys.push([
                        2,
                        5,
                        ,
                        6
                    ]);
                    return [
                        4,
                        axios.post(url, {
                            client_id: apiResponse === null || apiResponse === void 0 ? void 0 : apiResponse.data.client_id,
                            otp: otp,
                            aadhaar_pdf_generate: true
                        }, {
                            headers: {
                                'content-type': 'application/json',
                                Authorization: "Bearer ".concat(config.surePassToken)
                            }
                        })
                    ];
                case 3:
                    response = _state.sent();
                    data = response.data;
                    saveObject = {
                        customerID: customerId,
                        api_type: 'aadhaar-v2-submit-otp',
                        api_supplier: 4,
                        api_response: JSON.stringify(data),
                        status: 1,
                        api_endpoint_url: url,
                        api_method: 'POST',
                        api_headers: JSON.stringify({
                            'content-type': 'application/json',
                            Authorization: "Bearer ".concat(config.surePassToken)
                        }),
                        api_request: JSON.stringify({
                            client_id: apiResponse === null || apiResponse === void 0 ? void 0 : (_apiResponse_data = apiResponse.data) === null || _apiResponse_data === void 0 ? void 0 : _apiResponse_data.client_id,
                            otp: otp
                        }),
                        aadharNo: data === null || data === void 0 ? void 0 : (_data_data = data.data) === null || _data_data === void 0 ? void 0 : _data_data.aadhaar_number
                    };
                    return [
                        4,
                        leadApiLogService.create(saveObject)
                    ];
                case 4:
                    _state.sent();
                    return [
                        2,
                        data
                    ];
                case 5:
                    error = _state.sent();
                    console.log('Error', error);
                    throw new Error('Error while verifying otp through surePass');
                case 6:
                    return [
                        2
                    ];
            }
        });
    })();
}
export function verifyPanSurePass(payload) {
    return _async_to_generator(function() {
        var panNumber, customerId, mobileNo, result, saveObject;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    panNumber = payload.panNumber, customerId = payload.customerId, mobileNo = payload.mobileNo;
                    return [
                        4,
                        apiService.call('post', SurePassApiUrl.PAN_COMPREHENSIVE, {
                            id_number: panNumber
                        }, undefined, headers)
                    ];
                case 1:
                    result = _state.sent();
                    saveObject = {
                        customerID: customerId,
                        api_type: LeadLogApiType.PAN_COMPREHENSIVE,
                        api_supplier: ApiSupplierType.SUREPASS,
                        api_response: JSON.stringify(result.data),
                        status: result.success ? 1 : 0,
                        api_endpoint_url: config.surePassApi + SurePassApiUrl.PAN_COMPREHENSIVE,
                        api_method: 'POST',
                        api_headers: JSON.stringify(headers),
                        api_request: JSON.stringify({
                            id_number: panNumber
                        }),
                        mobile_no: String(mobileNo),
                        pancard: panNumber
                    };
                    return [
                        4,
                        leadApiLogService.create(saveObject)
                    ];
                case 2:
                    _state.sent();
                    return [
                        2,
                        result
                    ];
            }
        });
    })();
}
// ! Depracated
// export async function verifyPanBySurepass(
//   panNumber: string,
//   customerId: number,
// ): Promise<any> {
//   const url = config.surePassApi + '/api/v1/pan/pan-comprehensive'
//   try {
//     const response = await axios.post(
//       url,
//       {
//         id_number: panNumber,
//       },
//       {
//         headers: {
//           'content-type': 'application/json',
//           Authorization: `Bearer ${config.surePassToken}`,
//         },
//       },
//     )
//     const { data } = response
//     let saveObject = {
//       customerID: customerId,
//       api_type: 'pan-comprehensive',
//       api_supplier: 4,
//       api_response: JSON.stringify(data),
//       status: 1,
//       api_endpoint_url: url,
//       api_method: 'POST',
//       api_headers: JSON.stringify({
//         'content-type': 'application/json',
//         Authorization: `Bearer ${config.surePassToken}`,
//       }),
//       api_request: JSON.stringify({
//         id_number: panNumber,
//       }),
//       pancard: data?.data?.pan_number,
//     }
//     await leadApiLogService.create(saveObject)
//     return data
//   } catch (error) {
//     console.log('Error', error)
//     throw new Error('Error while verifying pan through surePass')
//   }
// }
export function ckycSearchBySurePass(panNumber, customerId, mobileNumber) {
    return _async_to_generator(function() {
        var url, response, data, saveObject, error;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    url = 'https://kyc-api.surepass.io/api/v1/ckyc/search';
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
                        axios.post(url, {
                            id_number: panNumber,
                            document_type: 'PAN'
                        }, {
                            headers: {
                                'content-type': 'application/json',
                                Authorization: "Bearer ".concat(config.surePassToken)
                            }
                        })
                    ];
                case 2:
                    response = _state.sent();
                    data = response.data;
                    saveObject = {
                        customerID: customerId,
                        api_type: 'ckyc_search',
                        api_supplier: 4,
                        api_response: JSON.stringify(data),
                        status: 1,
                        api_endpoint_url: url,
                        api_method: 'POST',
                        api_headers: JSON.stringify({
                            'content-type': 'application/json',
                            Authorization: "Bearer ".concat(config.surePassToken)
                        }),
                        api_request: JSON.stringify({
                            id_number: panNumber,
                            document_type: 'PAN'
                        }),
                        pancard: panNumber,
                        mobile_no: String(mobileNumber)
                    };
                    return [
                        4,
                        leadApiLogService.create(saveObject)
                    ];
                case 3:
                    _state.sent();
                    return [
                        2,
                        data
                    ];
                case 4:
                    error = _state.sent();
                    console.log('Error', error);
                    throw new Error('Error while verifying pan through surePass');
                case 5:
                    return [
                        2
                    ];
            }
        });
    })();
}
export function ckycDownloadBySurePass(dob, customerId, mobileNumber) {
    return _async_to_generator(function() {
        var logData, apiResponse, url, response, data, saveObject, error;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    return [
                        4,
                        leadsApiLogModel.findOneLeadsApiLog({
                            customerID: customerId,
                            status: 1,
                            api_type: 'ckyc_search'
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
                    logData = _state.sent();
                    apiResponse = JSON.parse(logData.api_response);
                    url = 'https://kyc-api.surepass.io/api/v1/ckyc/download';
                    _state.label = 2;
                case 2:
                    _state.trys.push([
                        2,
                        5,
                        ,
                        6
                    ]);
                    return [
                        4,
                        axios.post(url, {
                            client_id: apiResponse === null || apiResponse === void 0 ? void 0 : apiResponse.data.client_id,
                            dob: dob
                        }, {
                            headers: {
                                'content-type': 'application/json',
                                Authorization: "Bearer ".concat(config.surePassToken)
                            }
                        })
                    ];
                case 3:
                    response = _state.sent();
                    data = response.data;
                    saveObject = {
                        customerID: customerId,
                        api_type: 'ckyc_download',
                        api_supplier: 4,
                        api_response: JSON.stringify(data),
                        status: 1,
                        api_endpoint_url: url,
                        api_method: 'POST',
                        api_headers: JSON.stringify({
                            'content-type': 'application/json',
                            Authorization: "Bearer ".concat(config.surePassToken)
                        }),
                        api_request: JSON.stringify({
                            client_id: apiResponse === null || apiResponse === void 0 ? void 0 : apiResponse.data.client_id,
                            dob: dob
                        }),
                        mobile_no: String(mobileNumber)
                    };
                    return [
                        4,
                        leadApiLogService.create(saveObject)
                    ];
                case 4:
                    _state.sent();
                    return [
                        2,
                        data
                    ];
                case 5:
                    error = _state.sent();
                    console.log('Error', error);
                    throw new Error('Error while verifying pan through surePass');
                case 6:
                    return [
                        2
                    ];
            }
        });
    })();
}
export function ckycSearch(payload, customerID, mobileNo) {
    return _async_to_generator(function() {
        var id_number, result, saveObject;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    id_number = payload.id_number;
                    return [
                        4,
                        apiService.call('post', SurePassApiUrl.CKYC_SEARCH, {
                            id_number: id_number
                        }, undefined, headers)
                    ];
                case 1:
                    result = _state.sent();
                    saveObject = {
                        customerID: customerID,
                        api_type: LeadLogApiType.CKYC_SEARCH,
                        api_supplier: ApiSupplierType.SUREPASS,
                        api_response: JSON.stringify(result.data),
                        status: result.success ? 1 : 0,
                        api_endpoint_url: config.surePassApi + SurePassApiUrl.CKYC_SEARCH,
                        api_method: 'POST',
                        api_headers: JSON.stringify(headers),
                        api_request: JSON.stringify({
                            payload: payload
                        }),
                        mobile_no: String(mobileNo),
                        pancard: id_number,
                        leadID: 0
                    };
                    return [
                        4,
                        leadApiLogService.delete([
                            {
                                column: 'api_supplier',
                                value: ApiSupplierType.SUREPASS
                            },
                            {
                                column: 'api_type',
                                value: LeadLogApiType.CKYC_SEARCH
                            },
                            {
                                column: 'pancard',
                                value: id_number
                            }
                        ])
                    ];
                case 2:
                    _state.sent();
                    return [
                        4,
                        leadApiLogService.create(saveObject)
                    ];
                case 3:
                    _state.sent();
                    return [
                        2,
                        result
                    ];
            }
        });
    })();
}
export function ckycDownload(payload, customerID, mobileNo, panNumber) {
    return _async_to_generator(function() {
        var client_id, dob, result, saveObject;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    client_id = payload.client_id, dob = payload.dob;
                    return [
                        4,
                        apiService.call('post', SurePassApiUrl.CKYC_DOWNLOAD, {
                            client_id: client_id,
                            dob: dob
                        }, undefined, headers)
                    ];
                case 1:
                    result = _state.sent();
                    saveObject = {
                        customerID: customerID,
                        api_type: LeadLogApiType.CKYC_DOWNLOAD,
                        api_supplier: ApiSupplierType.SUREPASS,
                        api_response: JSON.stringify(result.data),
                        status: result.success ? 1 : 0,
                        api_endpoint_url: config.surePassApi + SurePassApiUrl.CKYC_DOWNLOAD,
                        api_method: 'POST',
                        api_headers: JSON.stringify(headers),
                        api_request: JSON.stringify({
                            payload: payload
                        }),
                        mobile_no: String(mobileNo),
                        pancard: panNumber,
                        leadID: 0
                    };
                    return [
                        4,
                        leadApiLogService.create(saveObject)
                    ];
                case 2:
                    _state.sent();
                    return [
                        2,
                        result
                    ];
            }
        });
    })();
}

//# sourceMappingURL=surePass.utils.js.map