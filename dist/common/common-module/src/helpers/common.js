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
function _sliced_to_array(arr, i) {
    return _array_with_holes(arr) || _iterable_to_array_limit(arr, i) || _unsupported_iterable_to_array(arr, i) || _non_iterable_rest();
}
function _to_array(arr) {
    return _array_with_holes(arr) || _iterable_to_array(arr) || _unsupported_iterable_to_array(arr) || _non_iterable_rest();
}
function _to_consumable_array(arr) {
    return _array_without_holes(arr) || _iterable_to_array(arr) || _unsupported_iterable_to_array(arr) || _non_iterable_spread();
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
import config from '@/config/default';
import { Buffer } from 'buffer';
import * as validator from 'class-validator';
import { format } from 'date-fns';
import fs from 'fs';
import jwt from 'jsonwebtoken';
import { performance } from 'perf_hooks';
import { leadModel } from '../database/mysql/leads';
import MediaFileModel from '../database/mysql/mediaFile';
import { roleModel } from '../database/mysql/roles';
import { userModel } from '../database/mysql/users';
import { LeadStatus } from '../enums/lead.enum';
import { BadRequestError } from '../errors';
import { sendSendinblueMail } from '../services/common';
import CreditService from '../services/credit.service';
import S3Service from '../services/thirdParty/s3.service';
import { logger } from '../utils/logger';
import { getKnexInstance } from '../utils/mysql';
import { calculateMonthsAndDays } from './date.helpers';
var crypto = require('crypto');
var Algorithm = 'aes-256-cbc';
var CommonHelper = /*#__PURE__*/ function() {
    "use strict";
    function CommonHelper() {
        var _this = this;
        _class_call_check(this, CommonHelper);
        _define_property(this, "roleModel", roleModel);
        _define_property(this, "leadModel", leadModel);
        _define_property(this, "sendResponse", function(res, success, message, data, statusCode) {
            return Promise.resolve(res.status(statusCode).json({
                success: success,
                message: message,
                data: data
            }));
        });
        _define_property(this, "getBaseUrl", function() {
            switch(config.nodeEnv){
                case 'development':
                    return config.devBaseUrl;
                case 'staging':
                    return config.stagingBaseUrl;
                case 'preprod':
                    return config.preprodBaseUrl;
                case 'production':
                    return config.prodBaseUrl;
                default:
                    throw new Error("Unknown environment: ".concat(config.nodeEnv));
            }
        });
        _define_property(this, "getReactBaseUrl", function() {
            switch(config.nodeEnv){
                case 'development':
                    return config.reactDevBaseUrl;
                case 'staging':
                    return config.reactStagingBaseUrl;
                case 'production':
                    return config.reactProdBaseUrl;
                default:
                    throw new Error("Unknown environment: ".concat(config.nodeEnv));
            }
        });
        // public getJWT = async (
        //   entityId: number,
        //   secret: string,
        // ): Promise<string | boolean> => {
        //   try {
        //     return await Promise.resolve(
        //       jwt.sign({ _id: entityId }, secret, {
        //         expiresIn: '15d',
        //       }),
        //     )
        //   } catch (error) {
        //     logger.debug('Error In getJWT:-', error)
        //     return false
        //   }
        // }
        // public verifyJWT = async (
        //   token: string,
        //   secret: string,
        // ): Promise<{} | boolean> => {
        //   try {
        //     let decoded = jwt.verify(token, secret)
        //     return decoded
        //   } catch (error) {
        //     logger.info('Error In VerifyJWT Function:-', error)
        //     return false
        //   }
        // }
        _define_property(this, "getJWT", function(entityId, roleName) {
            return _async_to_generator(function() {
                var _ref, rolePermissions, payload;
                return _ts_generator(this, function(_state) {
                    switch(_state.label){
                        case 0:
                            return [
                                4,
                                this.roleModel.getUserPermissions(entityId, roleName)
                            ];
                        case 1:
                            rolePermissions = _state.sent();
                            payload = {
                                _id: entityId,
                                isp: Math.floor(Date.now() / 1000),
                                exp: Math.floor(Date.now() / 1000) + 86400 * 15,
                                roleId: (_ref = rolePermissions === null || rolePermissions === void 0 ? void 0 : rolePermissions.role_id) !== null && _ref !== void 0 ? _ref : null,
                                permissions: (rolePermissions === null || rolePermissions === void 0 ? void 0 : rolePermissions.permissions) ? _to_consumable_array(new Set(rolePermissions.permissions.split(','))) : []
                            };
                            if (!payload.roleId || payload.permissions.length === 0) {
                                throw new BadRequestError('There is an issue with your role & permissions, please contact admin!');
                            }
                            return [
                                2,
                                jwt.sign(payload, config.jwtPrivateKey, {
                                    algorithm: 'RS256'
                                })
                            ];
                    }
                });
            }).call(_this);
        });
        _define_property(this, "verifyJWT", function(token) {
            return _async_to_generator(function() {
                var decoded;
                return _ts_generator(this, function(_state) {
                    try {
                        decoded = jwt.verify(token, config.jwtPublicKey, {
                            algorithms: [
                                'RS256'
                            ]
                        });
                        return [
                            2,
                            decoded
                        ];
                    } catch (error) {
                        console.error('Error in verifyJWT:', error);
                        return [
                            2,
                            false
                        ];
                    }
                    return [
                        2
                    ];
                });
            })();
        });
        _define_property(this, "getCrossPlatformBaseUrl", function() {
            switch(config.nodeEnv){
                case 'development':
                    return config.devCrossPlatformBaseUrl;
                case 'staging':
                    return config.stagCrossPlatformBaseUrl;
                case 'preprod':
                    return config.preprodCrossPlatformBaseUrl;
                case 'production':
                    return config.prodCrossPlatformBaseUrl;
                default:
                    throw new Error("Unknown environment: ".concat(config.nodeEnv));
            }
        });
    }
    _create_class(CommonHelper, [
        {
            key: "sendMailSwitcher",
            value: // common function to send mail eighter aws ses or sendInBlue
            function sendMailSwitcher(mailData) {
                return _async_to_generator(function() {
                    var _;
                    return _ts_generator(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                _ = config.mailServiceProvider;
                                switch(_){
                                    case 'SES':
                                        return [
                                            3,
                                            1
                                        ];
                                    case 'SEND_IN_BLUE':
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
                                    CommonHelper.s3Service.sendEmail(mailData)
                                ];
                            case 2:
                                _state.sent();
                                return [
                                    3,
                                    6
                                ];
                            case 3:
                                return [
                                    4,
                                    sendSendinblueMail(mailData)
                                ];
                            case 4:
                                _state.sent();
                                return [
                                    3,
                                    6
                                ];
                            case 5:
                                throw new Error('Invalid mail service provider specified.');
                            case 6:
                                return [
                                    2
                                ];
                        }
                    });
                })();
            }
        },
        {
            key: "getClientIp",
            value: function getClientIp(req) {
                var ipAddress = req.headers['x-client-ip'] || req.headers['x-forwarded-for'] || req.headers['x-forwarded'] || req.headers['forwarded-for'] || req.headers['forwarded'] || req.socket.remoteAddress || req.socket.remoteAddress || '0';
                if (Array.isArray(ipAddress)) {
                    ipAddress = ipAddress[0];
                }
                // Handle x-forwarded-for which can be a comma-separated string
                if (typeof ipAddress === 'string' && ipAddress.includes(',')) {
                    ipAddress = ipAddress.split(',')[0].trim();
                }
                if (ipAddress === '::1') {
                    ipAddress = '127.0.0.1';
                }
                return ipAddress;
            }
        },
        {
            key: "getUserNamesByIds",
            value: /**
   * Get user names by user IDs from the database
   * @param items - Array of objects that may contain user IDs in created_by and/or updated_by fields
   * @param userFields - Array of field names to look for user IDs (default: ['created_by', 'updated_by'])
   * @returns The original items with added *_name fields for each user field
   */ function getUserNamesByIds(_0) {
                return _async_to_generator(function(items) {
                    var userFields, userIDs, users, userMap;
                    var _arguments = arguments;
                    return _ts_generator(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                userFields = _arguments.length > 1 && _arguments[1] !== void 0 ? _arguments[1] : [
                                    'created_by',
                                    'updated_by'
                                ];
                                if (!items || items.length === 0) {
                                    return [
                                        2,
                                        items
                                    ];
                                }
                                // Extract unique userIDs from all specified fields
                                userIDs = new Set();
                                items.forEach(function(item) {
                                    userFields.forEach(function(field) {
                                        if (item[field] !== null && item[field] !== undefined) {
                                            if (typeof item[field] === 'number') {
                                                userIDs.add(item[field]);
                                            } else if (typeof item[field] === 'string' && item[field].trim() !== '') {
                                                var numericId = Number(item[field]);
                                                if (!isNaN(numericId)) {
                                                    userIDs.add(numericId);
                                                }
                                            }
                                        }
                                    });
                                });
                                // If no user IDs found, return original items
                                if (userIDs.size === 0) {
                                    return [
                                        2,
                                        items
                                    ];
                                }
                                return [
                                    4,
                                    userModel.find({
                                        whereIn: [
                                            {
                                                column: 'userID',
                                                value: Array.from(userIDs)
                                            }
                                        ],
                                        select: [
                                            'userID',
                                            'name'
                                        ]
                                    })
                                ];
                            case 1:
                                users = _state.sent();
                                // Create a mapping of userID to user's name
                                userMap = users.reduce(function(map, user) {
                                    map[user.userID] = user.name;
                                    return map;
                                }, {});
                                // Enhance each item with user names
                                return [
                                    2,
                                    items.map(function(item) {
                                        // Create a new object that will contain all properties from item
                                        var enhancedItem = _object_spread({}, item);
                                        // Add new fields for each user field
                                        userFields.forEach(function(field) {
                                            if (item[field]) {
                                                // Add a new field with the pattern: field_name
                                                var nameField = "".concat(field, "_name");
                                                enhancedItem[nameField] = userMap[item[field]] || 'Unknown User';
                                            }
                                        });
                                        return enhancedItem;
                                    })
                                ];
                        }
                    });
                }).apply(this, arguments);
            }
        }
    ], [
        {
            key: "ucwords",
            value: function ucwords(str) {
                return (str + '').replace(/^([a-z])|\s+([a-z])/g, function($1) {
                    return $1.toUpperCase();
                });
            }
        },
        {
            key: "indianFormateAmount",
            value: function indianFormateAmount(x) {
                return x.toString().split('.')[0].length > 3 ? x.toString().substring(0, x.toString().split('.')[0].length - 3).replace(/\B(?=(\d{2})+(?!\d))/g, ',') + ',' + x.toString().substring(x.toString().split('.')[0].length - 3) : x.toString();
            }
        },
        {
            key: "getSuccessResponse",
            value: function getSuccessResponse(res) {
                var code = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 200, message = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : '', value = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : true, result = arguments.length > 4 && arguments[4] !== void 0 ? arguments[4] : {}, totalCount = arguments.length > 5 && arguments[5] !== void 0 ? arguments[5] : 0, tpApiAccessData = arguments.length > 6 ? arguments[6] : void 0;
                if (code == 200 && value == true) {
                    value = true;
                } else {
                    value = false;
                }
                var responseBody = {
                    message: message,
                    status: value,
                    data: result,
                    count: totalCount
                };
                if (tpApiAccessData) {
                    try {
                        var respTime;
                        if (tpApiAccessData === null || tpApiAccessData === void 0 ? void 0 : tpApiAccessData.startTime) {
                            var startTime = tpApiAccessData.startTime;
                            var endTime = performance.now();
                            respTime = (endTime - startTime).toFixed(2);
                            delete tpApiAccessData.startTime;
                        }
                        var data = _object_spread_props(_object_spread({}, tpApiAccessData), {
                            response_time: respTime || null,
                            response_params: responseBody,
                            request_headers: res.req.rawHeaders,
                            request_params: res.req.body,
                            response_status: code,
                            url: res.req.url,
                            created_at: format(new Date(), 'yyyy-MM-dd HH:mm:ss')
                        });
                    // this.apiModel.addTpApiAccessData(data);
                    } catch (err) {
                        logger.error(err);
                    }
                }
                res.resBody = responseBody;
                res.status(code).json(responseBody);
            }
        },
        {
            key: "getResponse",
            value: function getResponse(res) {
                var code = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 200, message = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : '', value = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : true, result = arguments.length > 4 && arguments[4] !== void 0 ? arguments[4] : {}, totalCount = arguments.length > 5 && arguments[5] !== void 0 ? arguments[5] : 0;
                var status = code === 200 && value;
                var responseBody = _object_spread_props(_object_spread({
                    message: message,
                    status: status
                }, result), {
                    count: totalCount
                });
                res.resBody = responseBody;
                res.status(code).json(responseBody);
            }
        },
        {
            key: "commonValidations",
            value: function commonValidations(data, validatorDate) {
                var errorArray = [];
                if (validatorDate) {
                    var specificValidationValue;
                    var min, max;
                    Object.entries(validatorDate).forEach(function(param) {
                        var _param = _sliced_to_array(param, 2), key = _param[0], value = _param[1];
                        return _async_to_generator(function() {
                            var validationList;
                            return _ts_generator(this, function(_state) {
                                validationList = value.split(' | ');
                                validationList.forEach(function(listData) {
                                    if (listData.indexOf(':') !== -1) {
                                        var specificValidationList = listData.split(':');
                                        listData = specificValidationList[0];
                                        specificValidationValue = specificValidationList[1];
                                        min = specificValidationValue;
                                        if (specificValidationList[0] == 'min') {
                                            min = specificValidationList[1];
                                        } else if (specificValidationList[0] == 'max') {
                                            max = specificValidationList[1];
                                        }
                                    }
                                    switch(listData){
                                        case 'required':
                                            if (validator.isEmpty(data[key])) {
                                                key = key.replace(/([A-Z]+)*([A-Z][a-z])/g, '$1 $2');
                                                key = key.split(' ').map(function(w) {
                                                    return w[0].toUpperCase() + w.substring(1).toLowerCase();
                                                }).join(' ');
                                                errorArray.push(key + ' is a required field.');
                                            }
                                            break;
                                        case 'numeric':
                                            if (!validator.isNumber(data[key])) {
                                                errorArray.push(key + ' should be numeric - ' + data[key]);
                                            }
                                            break;
                                        case 'string':
                                            if (!validator.isString(data[key])) {
                                                errorArray.push(key + ' should be string - ' + data[key]);
                                            }
                                            break;
                                        case 'object':
                                            if (!validator.isObject(data[key])) {
                                                errorArray.push(key + ' should be object - ' + data[key]);
                                            }
                                            break;
                                        case 'email':
                                            if (!validator.isEmail(data[key])) {
                                                errorArray.push(key + ' should be valid email - ' + data[key]);
                                            }
                                            break;
                                        case 'boolean':
                                            if (!validator.isBoolean(data[key])) {
                                                errorArray.push(key + ' should be valid boolean - ' + data[key]);
                                            }
                                            break;
                                        case 'date':
                                            if (!validator.isString(data[key])) {
                                                errorArray.push(key + ' should be valid date string- ' + data[key]);
                                            } else if (isNaN(new Date(data[key]).getTime())) {
                                                errorArray.push(key + ' should be valid date- ' + data[key]);
                                            }
                                            break;
                                        case 'digits':
                                        case 'min':
                                        case 'max':
                                            if (!validator.isByteLength(String(data[key]), min, max)) {
                                                errorArray.push("".concat(key, " should be of ").concat(min && max ? 'minimum ' + min + ' and maximum ' + max : specificValidationValue, " digits - ").concat(data[key]));
                                            }
                                            break;
                                        case 'no_start_05':
                                            if (/^[0-5]/.test(data[key])) {
                                                errorArray.push("".concat(key, " should not start with digits 0 through 5."));
                                            }
                                            break;
                                    }
                                });
                                return [
                                    2
                                ];
                            });
                        })();
                    });
                }
                return errorArray;
            }
        },
        {
            key: "formatBytes",
            value: function formatBytes(bytes) {
                return _async_to_generator(function() {
                    var decimals, k, dm, sizes, i, fileSize;
                    return _ts_generator(this, function(_state) {
                        decimals = 2;
                        if (!+bytes) return [
                            2,
                            '0 Bytes'
                        ];
                        k = 1024;
                        dm = decimals < 0 ? 0 : decimals;
                        sizes = [
                            'Bytes',
                            'KB',
                            'MB',
                            'GB',
                            'TB',
                            'PB',
                            'EB',
                            'ZB',
                            'YB'
                        ];
                        i = Math.floor(Math.log(bytes) / Math.log(k));
                        fileSize = "".concat(parseFloat((bytes / Math.pow(k, i)).toFixed(dm)), " ").concat(sizes[i]);
                        return [
                            2,
                            fileSize
                        ];
                    });
                })();
            }
        },
        {
            key: "uploadData",
            value: function uploadData(data) {
                return _async_to_generator(function() {
                    var localfilePath;
                    return _ts_generator(this, function(_state) {
                        localfilePath = "/tmp/".concat(data.filename, ".").concat(data.fileformat);
                        fs.writeFile(localfilePath, data.base64Data, 'base64', function(err) {
                            return _async_to_generator(function() {
                                var uploadFileData;
                                return _ts_generator(this, function(_state) {
                                    if (err) {
                                        throw err;
                                    } else {
                                        uploadFileData = {
                                            localfilePath: localfilePath,
                                            fileFormat: data.fileformat,
                                            fileName: data.filename,
                                            docType: data.docType,
                                            userId: data.user_id,
                                            leadId: data.lead_id,
                                            title: data.docyType,
                                            docyTypeId: data.docyTypeId,
                                            transactionId: '0',
                                            s3GenerateFileName: false
                                        };
                                    // await uploadFileOnServer(uploadFileData);
                                    } // writes out fiuploadFileOnServerle without error
                                    return [
                                        2
                                    ];
                                });
                            })();
                        });
                        return [
                            2
                        ];
                    });
                })();
            }
        },
        {
            key: "is_valid_mobile_number",
            value: function is_valid_mobile_number(mobile_number) {
                var regex = "/^[6789]d{9}$/";
                return regex.match(mobile_number);
            }
        },
        {
            key: "prepareDataForCsv",
            value: function prepareDataForCsv(data) {
                var csvData = '';
                var headers = Object.keys(data[0]);
                var rows = data.map(function(user) {
                    return Object.values(user).join(',');
                });
                csvData += headers.join(',') + '\r\n';
                csvData += rows.join('\r\n');
                return csvData;
            }
        },
        {
            key: "onlyDigits",
            value: function onlyDigits(s) {
                return _async_to_generator(function() {
                    var i, d;
                    return _ts_generator(this, function(_state) {
                        for(i = s.length - 1; i >= 0; i--){
                            d = s.charCodeAt(i);
                            if (d < 48 || d > 57) return [
                                2,
                                false
                            ];
                        }
                        return [
                            2,
                            true
                        ];
                    });
                })();
            }
        },
        {
            key: "parseName",
            value: function parseName(input) {
                var _trim_split = _to_array((input || '').trim().split(' ')), firstName = _trim_split[0], restNames = _trim_split.slice(1);
                var lastName = restNames.pop() || '';
                var middleName = restNames.join(' ');
                return {
                    firstName: firstName,
                    middleName: middleName,
                    lastName: lastName
                };
            }
        },
        {
            key: "createUserName",
            value: function createUserName(length) {
                var result = '';
                var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
                var charactersLength = characters.length;
                var counter = 0;
                while(counter < length){
                    result += characters.charAt(Math.floor(Math.random() * charactersLength));
                    counter += 1;
                }
                return 'AK' + format(new Date(), 'yyyyMMdd') + result;
            }
        },
        {
            key: "generateSHA256Hash",
            value: function generateSHA256Hash(payload) {
                return crypto.createHash('sha256').update(payload).digest('hex');
            }
        },
        {
            key: "otpCode",
            value: function otpCode() {
                var randomNumber = Math.floor(Math.random() * (9999 - 1000 + 1)) + 1000;
                var randomCode = String(randomNumber).padStart(4, '0');
                return randomCode;
            }
        },
        {
            key: "aesEncryption",
            value: function aesEncryption(data) {
                var cipher1 = crypto.createCipheriv('aes-256-cbc', Buffer.from(this.encryptionKey1, 'utf8'), Buffer.from(this.ivKey1, 'utf8'));
                var encryptedData1 = cipher1.update(data, 'utf8', 'base64');
                encryptedData1 += cipher1.final('base64');
                var cipher2 = crypto.createCipheriv('aes-256-cbc', Buffer.from(this.encryptionKey2, 'utf8'), Buffer.from(this.ivKey2, 'utf8'));
                var encryptedData2 = cipher2.update(encryptedData1, 'base64', 'base64');
                encryptedData2 += cipher2.final('base64');
                return encryptedData2;
            }
        },
        {
            key: "aesDecryption",
            value: function aesDecryption(data) {
                var decipher2 = crypto.createDecipheriv('aes-256-cbc', Buffer.from(this.encryptionKey2, 'utf8'), Buffer.from(this.ivKey2, 'utf8'));
                var decryptedData2 = decipher2.update(data, 'base64', 'base64');
                decryptedData2 += decipher2.final('base64');
                var decipher1 = crypto.createDecipheriv('aes-256-cbc', Buffer.from(this.encryptionKey1, 'utf8'), Buffer.from(this.ivKey1, 'utf8'));
                var decryptedData1 = decipher1.update(Buffer.from(decryptedData2, 'base64'), 'base64', 'utf8');
                decryptedData1 += decipher1.final('utf8');
                return decryptedData1;
            }
        }
    ]);
    return CommonHelper;
}();
_define_property(CommonHelper, "db", getKnexInstance);
_define_property(CommonHelper, "FileModel", new MediaFileModel());
_define_property(CommonHelper, "creditService", new CreditService());
_define_property(CommonHelper, "s3Service", new S3Service());
// private static encryptionKey1 = 'aunIZIqqJ61r9axoVHlzJlrivpTIz0mKLaKIEa27MjQ7TobK90qRys6MweJZSBLU'
_define_property(CommonHelper, "encryptionKey1", crypto.createHash('sha256').update('aunIZIqqJ61r9axoVHlzJlrivpTIz0mKLaKIEa27MjQ7TobK90qRys6MweJZSBLU').digest('hex').substr(0, 32));
_define_property(CommonHelper, "ivKey1", 'CPhD7qM6s7JJ8ccs');
// private static encryptionKey2 = 'SJnJ3yBvaJYY7avV5U9zxeJO2hAZyjPMKmrvmpVU6SZuVBNXkCWfSiNA3n0F7ozR'
_define_property(CommonHelper, "encryptionKey2", crypto.createHash('sha256').update('SJnJ3yBvaJYY7avV5U9zxeJO2hAZyjPMKmrvmpVU6SZuVBNXkCWfSiNA3n0F7ozR').digest('hex').substr(0, 32));
_define_property(CommonHelper, "ivKey2", 'f79wsjljb5kn8cyr');
_define_property(CommonHelper, "lastEMIUpdater", function(emiRemains, creditID, lastEMIDate, creditActualTenure, leadID) {
    return _async_to_generator(function() {
        var _ref, months, days;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    return [
                        4,
                        calculateMonthsAndDays(new Date(lastEMIDate), new Date(Date.now()))
                    ];
                case 1:
                    _ref = _state.sent(), months = _ref.months, days = _ref.days;
                    if (!(emiRemains == 0)) return [
                        3,
                        4
                    ];
                    return [
                        4,
                        CommonHelper.creditService.updateOne({
                            creditID: creditID
                        }, {
                            status: 'closed',
                            actualTenure: creditActualTenure + months + parseFloat("0.".concat(days)),
                            emiLeft: 0,
                            amountToBeRepayed: 0
                        })
                    ];
                case 2:
                    _state.sent();
                    return [
                        4,
                        leadModel.findOneAndUpdate({
                            leadID: leadID
                        }, {
                            status: LeadStatus.CLOSED
                        })
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
    })();
});
export { CommonHelper as default };
export var commonHelper = new CommonHelper();

//# sourceMappingURL=common.js.map