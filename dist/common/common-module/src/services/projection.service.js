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
import { HttpStatusCode } from 'axios';
import ejs from 'ejs';
import moment from 'moment';
import path from 'path';
import puppeteer from 'puppeteer';
import { Readable } from 'stream';
import { v4 as uuidv4 } from 'uuid'; // For generating unique IDs
import XLSX from 'xlsx';
import { BadRequestError } from '../errors';
import { convertToDate, convertToMySQLDateTime } from '../utils/dateTimeFunction';
import { getKnexInstance } from '../utils/mysql';
import ResponseService from './response.service';
import S3Service from './thirdParty/s3.service';
var ProjectionService = /*#__PURE__*/ function(ResponseService) {
    "use strict";
    _inherits(ProjectionService, ResponseService);
    function ProjectionService() {
        _class_call_check(this, ProjectionService);
        var _this;
        _this = _call_super(this, ProjectionService, arguments), _define_property(_this, "s3Service", new S3Service()), _define_property(_this, "processChunk", function(chunk, trx, type, fileId) {
            return _async_to_generator(function() {
                var isXlsx, table, keyColumn, loanMap, phoneNumbers, loanData, insertBatch;
                return _ts_generator(this, function(_state) {
                    switch(_state.label){
                        case 0:
                            isXlsx = type === 'xlsx';
                            table = isXlsx ? 'call_dispositions' : 'whatsapp_dispositions';
                            keyColumn = isXlsx ? 'loan_no' : 'phone_number';
                            loanMap = {};
                            if (!!isXlsx) return [
                                3,
                                2
                            ];
                            phoneNumbers = chunk.map(function(row) {
                                return row.phone_number;
                            }).filter(Boolean);
                            return [
                                4,
                                trx('customer').whereIn('mobile', phoneNumbers).join('loan', 'customer.customerID', '=', 'loan.customerID').select('customer.mobile as phone_number', 'loan.loanNo').orderBy('loan.loanID', 'desc').groupBy('customer.mobile', 'loan.loanNo').limit(1)
                            ];
                        case 1:
                            loanData = _state.sent();
                            loanMap = loanData.reduce(function(acc, param) {
                                var phone_number = param.phone_number, loanNo = param.loanNo;
                                acc[phone_number] = loanNo;
                                return acc;
                            }, {});
                            _state.label = 2;
                        case 2:
                            insertBatch = [];
                            chunk.forEach(function(row) {
                                var failedReason = null;
                                var loanNo = isXlsx ? null : loanMap[row.phone_number] || null;
                                if (isXlsx) {
                                    if (!row.loan_no && !row.customer_mobile) {
                                        failedReason = 'loanNo and  mobile not exists';
                                    }
                                    if (!row.loan_no && row.customer_mobile) {
                                        failedReason = 'loanNo  not exists';
                                    }
                                    if (!row.customer_mobile && row.loan_no) {
                                        failedReason = 'mobile not exists';
                                    }
                                } else {
                                    if (!row.phone_number) {
                                        failedReason = 'mobile not exists';
                                    }
                                }
                                if (failedReason) {
                                    if (isXlsx) {
                                        insertBatch.push(_object_spread_props(_object_spread({}, row), {
                                            failed_reason: failedReason,
                                            fileId: fileId
                                        }));
                                    } else {
                                        insertBatch.push(_object_spread_props(_object_spread({}, row), {
                                            failed_reason: failedReason,
                                            loan_no: loanNo,
                                            fileId: fileId
                                        }));
                                    }
                                } else {
                                    if (!isXlsx) {
                                        insertBatch.push(_object_spread_props(_object_spread({}, row), {
                                            loan_no: loanNo,
                                            failed_reason: null,
                                            fileId: fileId
                                        }));
                                    } else {
                                        insertBatch.push(_object_spread_props(_object_spread({}, row), {
                                            failed_reason: null,
                                            fileId: fileId
                                        }));
                                    }
                                }
                            });
                            if (!(insertBatch.length > 0)) return [
                                3,
                                4
                            ];
                            return [
                                4,
                                trx(table).insert(insertBatch)
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
        }), _define_property(_this, "getTotalCallsMade", function(repayDate, startDate, endDate) {
            return _async_to_generator(function() {
                var db, formattedDate, formattedStartDate, formattedEndDate, result, error;
                return _ts_generator(this, function(_state) {
                    switch(_state.label){
                        case 0:
                            db = getKnexInstance();
                            formattedDate = repayDate.toISOString().split('T')[0];
                            formattedStartDate = startDate.toISOString().split('T')[0];
                            formattedEndDate = endDate.toISOString().split('T')[0];
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
                                db.raw("\n        SELECT COUNT(*) AS callTotalCount\n        FROM approval a\n        INNER JOIN `call_dispositions` c ON a.repayDate = c.repay_date\n        WHERE a.repayDate = ?\n        AND c.call_date BETWEEN ? AND ?\n      ", [
                                    formattedDate,
                                    formattedStartDate,
                                    formattedEndDate
                                ])
                            ];
                        case 2:
                            result = _state.sent();
                            return [
                                2,
                                result[0][0].callTotalCount
                            ];
                        case 3:
                            error = _state.sent();
                            console.error('Error fetching total call count:', error);
                            throw new Error('Unable to fetch total call count');
                        case 4:
                            return [
                                2
                            ];
                    }
                });
            })();
        }), _define_property(_this, "getfailedDetails", function(fileID, type) {
            return _async_to_generator(function() {
                var db, failedData, data, failedData1, data1;
                return _ts_generator(this, function(_state) {
                    switch(_state.label){
                        case 0:
                            db = getKnexInstance();
                            if (!(type === 'whatsapp_disposition')) return [
                                3,
                                2
                            ];
                            return [
                                4,
                                db('whatsapp_dispositions').where('fileId', fileID).whereNotNull('failed_reason').orderBy('id', 'desc').select('phone_number', 'failed_reason', 'id')
                            ];
                        case 1:
                            failedData = _state.sent();
                            data = failedData.map(function(row) {
                                return {
                                    row_number: row.id,
                                    mobile: row.phone_number,
                                    status: row.failed_reason
                                };
                            });
                            return [
                                2,
                                data
                            ];
                        case 2:
                            if (!(type === 'call_disposition')) return [
                                3,
                                4
                            ];
                            return [
                                4,
                                db('call_dispositions').where('fileId', fileID).whereNotNull('failed_reason').orderBy('id', 'desc').select('customer_mobile', 'failed_reason', 'id')
                            ];
                        case 3:
                            failedData1 = _state.sent();
                            // console.log("failedData",failedData)
                            data1 = failedData1.map(function(row) {
                                return {
                                    row_number: row.id,
                                    mobile: row.customer_mobile,
                                    status: row.failed_reason
                                };
                            });
                            return [
                                2,
                                data1
                            ];
                        case 4:
                            return [
                                2
                            ];
                    }
                });
            })();
        });
        return _this;
    }
    _create_class(ProjectionService, [
        {
            key: "uploadProjectionFile",
            value: function uploadProjectionFile(payload) {
                return _async_to_generator(function() {
                    var _this, image, type, userId, db, parsedData, _tmp, validXLSXHeaders, validCSVHeaders, headers, trimmedHeaders, isValid, hasNoExtraHeaders, headers1, trimmedHeaders1, isValid1, hasNoExtraHeaders1, normalizedData, sanitizedData, uploadedTrack, filename, folder, s3UploadResponse, key, csvlink, data, fileType, error;
                    return _ts_generator(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                _this = this;
                                image = payload.image, type = payload.type, userId = payload.userId;
                                db = getKnexInstance();
                                parsedData = [];
                                if (!(type === 'xlsx')) return [
                                    3,
                                    1
                                ];
                                _tmp = this.parseXLSX(image.buffer);
                                return [
                                    3,
                                    3
                                ];
                            case 1:
                                return [
                                    4,
                                    this.parseCSV(image.buffer)
                                ];
                            case 2:
                                _tmp = _state.sent();
                                _state.label = 3;
                            case 3:
                                parsedData = _tmp;
                                if (parsedData.length === 0) {
                                    throw new Error('No data available for insertion');
                                }
                                validXLSXHeaders = [
                                    'Date',
                                    'Time',
                                    'Campaign',
                                    'Disposition',
                                    'Next Action DateTime',
                                    'Loan No.',
                                    'Mobile',
                                    'RepayDate'
                                ];
                                validCSVHeaders = [
                                    'Phone Number',
                                    'Sent Timestamp (UTC time)',
                                    'Delivered Timestamp (UTC time)',
                                    'Read Timestamp (UTC time)',
                                    'Replied Timestamp (IST time)'
                                ];
                                if (type === 'xlsx') {
                                    headers = Object.keys(parsedData[0]);
                                    trimmedHeaders = headers.map(function(header) {
                                        return header.trim().replace(/[\r\n\t]/g, '');
                                    });
                                    isValid = trimmedHeaders.every(function(header) {
                                        return validXLSXHeaders.includes(header);
                                    });
                                    hasNoExtraHeaders = trimmedHeaders.length === validXLSXHeaders.length;
                                    if (!isValid || !hasNoExtraHeaders) {
                                        throw new BadRequestError("Invalid headers in XLSX file. Expected headers: ".concat(validXLSXHeaders.join(', ')));
                                    }
                                }
                                if (type === 'csv') {
                                    headers1 = Object.keys(parsedData[0]);
                                    trimmedHeaders1 = headers1.map(function(header) {
                                        return header.trim().replace(/[\r\n\t]/g, '');
                                    });
                                    isValid1 = trimmedHeaders1.every(function(header) {
                                        return validCSVHeaders.includes(header);
                                    });
                                    hasNoExtraHeaders1 = trimmedHeaders1.length === validCSVHeaders.length;
                                    if (!isValid1 || !hasNoExtraHeaders1) {
                                        throw new BadRequestError("Invalid headers in CSV file. Expected headers: ".concat(validCSVHeaders.join(', ')));
                                    }
                                }
                                normalizedData = parsedData.map(function(row) {
                                    var normalizedRow = {};
                                    Object.keys(row).forEach(function(key) {
                                        normalizedRow[key.trim()] = row[key];
                                    });
                                    return normalizedRow;
                                });
                                _state.label = 4;
                            case 4:
                                _state.trys.push([
                                    4,
                                    9,
                                    ,
                                    10
                                ]);
                                sanitizedData = type === 'xlsx' ? this.sanitizeXLSXData(normalizedData) : this.sanitizeCSVData(parsedData);
                                uploadedTrack = uuidv4();
                                filename = "".concat(Math.floor(Date.now() / 1000), "/").concat(uploadedTrack, ".").concat(image.originalname);
                                folder = "documents/disposition/csv";
                                return [
                                    4,
                                    this.s3Service.uploadDocument(image.buffer, folder, filename)
                                ];
                            case 5:
                                s3UploadResponse = _state.sent();
                                if (!s3UploadResponse) {
                                    throw new BadRequestError('File extension is not allowed.');
                                }
                                key = "".concat(folder, "/").concat(filename);
                                return [
                                    4,
                                    this.s3Service.getPresignedUrl(key)
                                ];
                            case 6:
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
                                                            this.processChunk(chunk, trx, type, uploadedTrack)
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
                            case 7:
                                _state.sent();
                                data = {
                                    fileName: filename,
                                    userID: userId,
                                    filelink: csvlink,
                                    fileId: uploadedTrack,
                                    type: type === 'xlsx' ? 'call_disposition' : 'whatsapp_disposition'
                                };
                                return [
                                    4,
                                    db('projection_filelog').insert(data)
                                ];
                            case 8:
                                _state.sent();
                                if (image.buffer) {
                                    image.buffer = null;
                                    console.log('Buffer cleared successfully');
                                }
                                fileType = type === 'xlsx' ? 'call_disposition' : 'whatsapp_disposition';
                                return [
                                    2,
                                    this.serviceResponse(HttpStatusCode.Ok, {
                                        recordsInserted: parsedData.length,
                                        totalRecord: parsedData.length,
                                        failedRecord: 0,
                                        fileId: uploadedTrack,
                                        fileType: fileType
                                    }, 'File data successfully uploaded and inserted into the database')
                                ];
                            case 9:
                                error = _state.sent();
                                console.error('Transaction failed:', error.message);
                                throw error;
                            case 10:
                                return [
                                    2
                                ];
                        }
                    });
                }).call(this);
            }
        },
        {
            key: "parseXLSX",
            value: function parseXLSX(buffer) {
                var workbook = XLSX.read(buffer, {
                    type: 'buffer'
                });
                var sheetName = workbook.SheetNames[0];
                return XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
            }
        },
        {
            key: "parseCSV",
            value: function parseCSV(buffer) {
                return _async_to_generator(function() {
                    var parsedData;
                    return _ts_generator(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                return [
                                    4,
                                    this.parseCSVFromBuffer(buffer)
                                ];
                            case 1:
                                parsedData = _state.sent();
                                return [
                                    2,
                                    parsedData
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
                        call_date: row['Date'] || null,
                        call_time: row['Time'] || null,
                        loan_no: row['Loan No.'] || null,
                        campaign: row['Campaign'] || null,
                        disposition: row['Disposition'] || null,
                        next_action_datetime: convertToMySQLDateTime(row['Next Action DateTime']) || null,
                        customer_mobile: row['Mobile'] || null,
                        repay_date: convertToDate(row['RepayDate']) || null
                    };
                });
            }
        },
        {
            key: "sanitizeCSVData",
            value: function sanitizeCSVData(parsedData) {
                return parsedData.map(function(row) {
                    return {
                        phone_number: row['Phone Number'] || null,
                        sent_timestamp: row['Sent Timestamp (UTC time)'] || null,
                        delivered_timestamp: row['Delivered Timestamp (UTC time)'] || null,
                        read_timestamp: row['Read Timestamp (UTC time)'] || null,
                        replied_timestamp: row['Replied Timestamp (IST time)'] ? moment(row['Replied Timestamp (IST time)'], 'D/M/YYYY HH:mm').format('YYYY-MM-DD HH:mm:ss') : null
                    };
                });
            }
        },
        {
            key: "parseCSVFromBuffer",
            value: function parseCSVFromBuffer(buffer) {
                return new Promise(function(resolve, reject) {
                    var rows = [];
                    var stream = require('stream');
                    var bufferStream = new stream.PassThrough();
                    bufferStream.end(buffer);
                    bufferStream.pipe(require('csv-parser')()).on('data', function(row) {
                        return rows.push(row);
                    }).on('end', function() {
                        return resolve(rows);
                    }).on('error', function(error) {
                        return reject(error);
                    });
                });
            }
        },
        {
            key: "callMonitoringData",
            value: function callMonitoringData(startDate, endDate) {
                return _async_to_generator(function() {
                    var db, formatDate, totalCallCountForDate, dateRange, data, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, date, DPD, formattedDate, loanCounts, i, _ref, _ref1, _ref2, adjustedDate, approvalAndCallCounts, due, callCount, err;
                    return _ts_generator(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                db = getKnexInstance();
                                formatDate = function formatDate(date) {
                                    return date.toISOString().split('T')[0];
                                };
                                totalCallCountForDate = 0;
                                dateRange = this.getDateRange(startDate, endDate);
                                data = {};
                                _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
                                _state.label = 1;
                            case 1:
                                _state.trys.push([
                                    1,
                                    10,
                                    11,
                                    12
                                ]);
                                _iterator = dateRange[Symbol.iterator]();
                                _state.label = 2;
                            case 2:
                                if (!!(_iteratorNormalCompletion = (_step = _iterator.next()).done)) return [
                                    3,
                                    9
                                ];
                                date = _step.value;
                                DPD = [];
                                formattedDate = formatDate(date);
                                return [
                                    4,
                                    this.getLoanCountForDate(date)
                                ];
                            case 3:
                                loanCounts = _state.sent();
                                i = -7;
                                _state.label = 4;
                            case 4:
                                if (!(i <= 7)) return [
                                    3,
                                    7
                                ];
                                adjustedDate = new Date(date);
                                adjustedDate.setDate(adjustedDate.getDate() + i);
                                return [
                                    4,
                                    this.getApprovalAndCallCountsForDate(date, adjustedDate)
                                ];
                            case 5:
                                approvalAndCallCounts = _state.sent();
                                due = loanCounts - ((_ref = approvalAndCallCounts === null || approvalAndCallCounts === void 0 ? void 0 : approvalAndCallCounts.approvalCount) !== null && _ref !== void 0 ? _ref : 0);
                                callCount = (_ref1 = approvalAndCallCounts === null || approvalAndCallCounts === void 0 ? void 0 : approvalAndCallCounts.callCount) !== null && _ref1 !== void 0 ? _ref1 : 0;
                                totalCallCountForDate += callCount;
                                DPD.push({
                                    due: "Due- ".concat(due),
                                    callCount: (_ref2 = approvalAndCallCounts === null || approvalAndCallCounts === void 0 ? void 0 : approvalAndCallCounts.callCount) !== null && _ref2 !== void 0 ? _ref2 : 0,
                                    callDate: formatDate(adjustedDate),
                                    repayDate: formattedDate
                                });
                                _state.label = 6;
                            case 6:
                                i++;
                                return [
                                    3,
                                    4
                                ];
                            case 7:
                                data[formattedDate] = {
                                    NumberOfUsersDueDate: loanCounts,
                                    DPD: DPD,
                                    totalCallsMade: totalCallCountForDate
                                };
                                totalCallCountForDate = 0;
                                _state.label = 8;
                            case 8:
                                _iteratorNormalCompletion = true;
                                return [
                                    3,
                                    2
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
                                    2,
                                    this.serviceResponse(HttpStatusCode.Ok, data, 'Call Monitoring Data fetched successfully')
                                ];
                        }
                    });
                }).call(this);
            }
        },
        {
            key: "getLoanCountForDate",
            value: // private async getLoanCountsForDateRange(
            //   dateRange: Date[],
            // ): Promise<{ [key: string]: number }> {
            //   const db = getKnexInstance()
            //   // Format dates as 'YYYY-MM-DD' for database queries
            //   const formattedDates = dateRange.map(
            //     (date) => date.toISOString().split('T')[0],
            //   )
            //  // console.log('formattedDates:', formattedDates)
            //   try {
            //     // Construct the raw SQL query
            //     const sqlQuery = `
            //       SELECT COUNT(DISTINCT a.leadID) AS loanCount, DATE(a.repayDate) AS repayDate
            //       FROM approval a
            //       INNER JOIN loan l ON a.leadID = l.leadID
            //       WHERE DATE(a.repayDate) IN (?)
            //       AND l.status = 'Disbursed'
            //       GROUP BY DATE(a.repayDate);
            //     `
            //     // Execute the query with the formattedDates array
            //     const result = await db.raw(sqlQuery, [formattedDates])
            //     //console.log('result:', result)
            //     // Initialize loanCounts object with default values of 0
            //     const loanCounts: { [key: string]: number } = {}
            //     formattedDates.forEach((date) => {
            //       loanCounts[date] = 0
            //     })
            //     // Populate loanCounts with actual data from the query result
            //     result[0].forEach((row: any) => {
            //       const formattedRepayDate = new Date(row.repayDate)
            //         .toISOString()
            //         .split('T')[0] // Format to 'YYYY-MM-DD'
            //       if (loanCounts.hasOwnProperty(formattedRepayDate)) {
            //         loanCounts[formattedRepayDate] = row.loanCount
            //       }
            //     })
            //     return loanCounts
            //   } catch (error) {
            //     console.error('Error fetching loan counts:', error)
            //     throw new Error('Unable to fetch loan counts')
            //   }
            // }
            function getLoanCountForDate(date) {
                return _async_to_generator(function() {
                    var db, formattedDate, _result__, sqlQuery, result, loanCount, error;
                    return _ts_generator(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                db = getKnexInstance();
                                formattedDate = date.toISOString().split('T')[0];
                                _state.label = 1;
                            case 1:
                                _state.trys.push([
                                    1,
                                    3,
                                    ,
                                    4
                                ]);
                                sqlQuery = "\n        SELECT COUNT(DISTINCT a.leadID) AS loanCount\n        FROM approval a\n        INNER JOIN loan l ON a.leadID = l.leadID\n        WHERE DATE(a.repayDate) = ?\n        AND l.status = 'Disbursed';\n      ";
                                return [
                                    4,
                                    db.raw(sqlQuery, [
                                        formattedDate
                                    ])
                                ];
                            case 2:
                                result = _state.sent();
                                loanCount = ((_result__ = result[0][0]) === null || _result__ === void 0 ? void 0 : _result__.loanCount) || 0;
                                return [
                                    2,
                                    loanCount
                                ];
                            case 3:
                                error = _state.sent();
                                console.error('Error fetching loan count:', error);
                                throw new BadRequestError('Unable to fetch loan count');
                            case 4:
                                return [
                                    2
                                ];
                        }
                    });
                })();
            }
        },
        {
            key: "getApprovalAndCallCountsForDate",
            value: function getApprovalAndCallCountsForDate(date, callDate) {
                return _async_to_generator(function() {
                    var _approvalCountResult__, _callCountResult__, db, formattedDate, formattedCallDate, approvalCountResult, callCountResult, approvalCount, callCount;
                    return _ts_generator(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                db = getKnexInstance();
                                formattedDate = date.toISOString().split('T')[0];
                                formattedCallDate = callDate.toISOString().split('T')[0];
                                return [
                                    4,
                                    db.raw("\n      SELECT COUNT(DISTINCT a.leadID) AS approvalCount\n      FROM approval a\n      INNER JOIN `callhistoryLogs` c ON a.leadID = c.leadID\n      WHERE DATE(a.repayDate) = ?\n      AND c.status IN ('Settlement', 'Closed')\n      AND c.createdDate <= ?\n      ", [
                                        formattedDate,
                                        formattedCallDate
                                    ])
                                ];
                            case 1:
                                approvalCountResult = _state.sent();
                                return [
                                    4,
                                    db.raw("\n      SELECT COUNT(*) AS callCount\n      FROM `call_dispositions` c\n      WHERE DATE(c.repay_date) = ?\n      AND DATE(c.call_date) = ?\n      AND c.loan_no IS NOT NULL\n      ", [
                                        formattedDate,
                                        formattedCallDate
                                    ])
                                ];
                            case 2:
                                callCountResult = _state.sent();
                                approvalCount = ((_approvalCountResult__ = approvalCountResult[0][0]) === null || _approvalCountResult__ === void 0 ? void 0 : _approvalCountResult__.approvalCount) || 0;
                                callCount = ((_callCountResult__ = callCountResult[0][0]) === null || _callCountResult__ === void 0 ? void 0 : _callCountResult__.callCount) || 0;
                                return [
                                    2,
                                    {
                                        approvalCount: approvalCount,
                                        callCount: callCount
                                    }
                                ];
                        }
                    });
                })();
            }
        },
        {
            key: "getDateRange",
            value: function getDateRange(startDate, endDate) {
                var dateRange = [];
                var currentDate = new Date(startDate);
                while(currentDate <= endDate){
                    dateRange.push(new Date(currentDate));
                    currentDate.setDate(currentDate.getDate() + 1);
                }
                return dateRange;
            }
        },
        {
            key: "callDescriptionData",
            value: function callDescriptionData(callDate, repayDate) {
                return _async_to_generator(function() {
                    var _data_AverageCalls_minimumCallsMade, _data_AverageCalls_maximumCallsMade, db, formatDate, formattedCallDate, formattedRepayDate, dispositions, userCallData, data, totalCalls, middle, middle1;
                    return _ts_generator(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                db = getKnexInstance();
                                formatDate = function formatDate(date) {
                                    return date.toISOString().split('T')[0];
                                };
                                formattedCallDate = formatDate(callDate);
                                formattedRepayDate = formatDate(repayDate);
                                return [
                                    4,
                                    db('call_dispositions').select('loan_no', 'disposition', 'call_date', 'repay_date').where('call_date', formattedCallDate).andWhere('repay_date', formattedRepayDate)
                                ];
                            case 1:
                                dispositions = _state.sent();
                                userCallData = {};
                                dispositions.forEach(function(row) {
                                    var loan_no = row.loan_no, disposition = row.disposition;
                                    if (loan_no === null) return;
                                    if (!userCallData[loan_no]) {
                                        userCallData[loan_no] = {
                                            userCount: 1,
                                            attemptedCallsCount: 0,
                                            connectedCallsCount: 0,
                                            totalCallsMade: 0
                                        };
                                    } else {
                                        userCallData[loan_no].userCount += 1;
                                    }
                                    userCallData[loan_no].totalCallsMade += 1;
                                    if (disposition === 'NC' || disposition === 'NR') {
                                        userCallData[loan_no].attemptedCallsCount += 1;
                                    } else {
                                        userCallData[loan_no].connectedCallsCount += 1;
                                    }
                                });
                                data = {
                                    calls: {},
                                    Total: {
                                        totalUserCount: 0,
                                        attemptedCallsCount: 0,
                                        connectedCallsCount: 0
                                    },
                                    AverageCalls: {
                                        minimumCallsMade: null,
                                        maximumCallsMade: null,
                                        AverageCallsMade: 0,
                                        MedianCallsMade: 0
                                    }
                                };
                                totalCalls = [];
                                Object.keys(userCallData).forEach(function(loan_no) {
                                    var _userCallData_loan_no = userCallData[loan_no], userCount = _userCallData_loan_no.userCount, attemptedCallsCount = _userCallData_loan_no.attemptedCallsCount, connectedCallsCount = _userCallData_loan_no.connectedCallsCount, totalCallsMade = _userCallData_loan_no.totalCallsMade;
                                    var frequency = totalCallsMade;
                                    var callGroup = "".concat(frequency, "x calls");
                                    data.Total.totalUserCount += userCount;
                                    data.Total.attemptedCallsCount += attemptedCallsCount;
                                    data.Total.connectedCallsCount += connectedCallsCount;
                                    if (!data.calls[callGroup]) {
                                        data.calls[callGroup] = {
                                            userCount: userCount,
                                            attemptedCallsCount: attemptedCallsCount,
                                            connectedCallsCount: connectedCallsCount
                                        };
                                    } else {
                                        data.calls[callGroup].userCount += userCount;
                                        data.calls[callGroup].attemptedCallsCount += attemptedCallsCount;
                                        data.calls[callGroup].connectedCallsCount += connectedCallsCount;
                                    }
                                    totalCalls.push(attemptedCallsCount + connectedCallsCount);
                                    if (totalCallsMade != null) {
                                        if (data.AverageCalls.minimumCallsMade === null || totalCallsMade < data.AverageCalls.minimumCallsMade) {
                                            data.AverageCalls.minimumCallsMade = totalCallsMade;
                                        }
                                        if (data.AverageCalls.maximumCallsMade === null || totalCallsMade > data.AverageCalls.maximumCallsMade) {
                                            data.AverageCalls.maximumCallsMade = totalCallsMade;
                                        }
                                    }
                                });
                                Object.keys(data.calls).forEach(function(callGroup) {
                                    var groupData = data.calls[callGroup];
                                    var frequency = parseInt(callGroup.split('x')[0]);
                                    // groupData.userCount /= frequency
                                    // groupData.attemptedCallsCount /= frequency
                                    // groupData.connectedCallsCount /= frequency
                                    groupData.userCount = Math.floor(groupData.userCount / frequency);
                                    groupData.attemptedCallsCount = Math.floor(groupData.attemptedCallsCount / frequency);
                                    groupData.connectedCallsCount = Math.floor(groupData.connectedCallsCount / frequency);
                                });
                                data.Total.totalUserCount = 0;
                                data.Total.attemptedCallsCount = 0;
                                data.Total.connectedCallsCount = 0;
                                Object.keys(data.calls).forEach(function(callGroup) {
                                    var groupData = data.calls[callGroup];
                                    data.Total.totalUserCount += groupData.userCount;
                                    data.Total.attemptedCallsCount += groupData.attemptedCallsCount;
                                    data.Total.connectedCallsCount += groupData.connectedCallsCount;
                                });
                                if (data.Total.totalUserCount > 0) {
                                    data.AverageCalls.AverageCallsMade = +(totalCalls.reduce(function(acc, curr) {
                                        return acc + curr;
                                    }, 0) / data.Total.totalUserCount).toFixed(2);
                                }
                                totalCalls.sort(function(a, b) {
                                    return a - b;
                                });
                                middle = Math.floor(totalCalls.length / 2);
                                if (totalCalls.length > 0) {
                                    totalCalls.sort(function(a, b) {
                                        return a - b;
                                    });
                                    middle1 = Math.floor(totalCalls.length / 2);
                                    if (totalCalls.length % 2 === 0) {
                                        data.AverageCalls.MedianCallsMade = (totalCalls[middle1 - 1] + totalCalls[middle1]) / 2;
                                    } else {
                                        data.AverageCalls.MedianCallsMade = totalCalls[middle1];
                                    }
                                } else {
                                    data.AverageCalls.MedianCallsMade = 0;
                                }
                                data.AverageCalls.minimumCallsMade = (_data_AverageCalls_minimumCallsMade = data.AverageCalls.minimumCallsMade) !== null && _data_AverageCalls_minimumCallsMade !== void 0 ? _data_AverageCalls_minimumCallsMade : 0;
                                data.AverageCalls.maximumCallsMade = (_data_AverageCalls_maximumCallsMade = data.AverageCalls.maximumCallsMade) !== null && _data_AverageCalls_maximumCallsMade !== void 0 ? _data_AverageCalls_maximumCallsMade : 0;
                                return [
                                    2,
                                    this.serviceResponse(HttpStatusCode.Ok, data, 'Call Description Data fetched successfully')
                                ];
                        }
                    });
                }).call(this);
            }
        },
        {
            key: "projectionReport",
            value: function projectionReport(payload) {
                return _async_to_generator(function() {
                    var startDate, endDate, db, result;
                    return _ts_generator(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                startDate = payload.startDate, endDate = payload.endDate;
                                db = getKnexInstance();
                                return [
                                    4,
                                    db('leads').select(db.raw('COALESCE(emi.dueDate, approval.repayDate) AS `dueDate`'), db.raw('COUNT(DISTINCT loan.loanNo) AS `dueCases`'), db.raw("\n          SUM(CASE \n            WHEN leads.productID = 1 THEN emi.amountPayable\n            WHEN leads.productID = 2 THEN loan.disbursalAmount + \n              (loan.disbursalAmount * (approval.roi / 100) * DATEDIFF(approval.repayDate, loan.disbursalDate))\n          END) AS 'dueAmount'"), db.raw("\n          COUNT(DISTINCT CASE \n            WHEN (emi.status IN ('paid', 'partially-paid')) OR (collection.collectionStatus = 'Approved') THEN loan.loanNo\n          END) AS 'paidUsers'"), db.raw("\n          SUM(CASE \n            WHEN emi.status IN ('paid', 'partially-paid') THEN emi.paymentReceived\n            WHEN collection.collectionStatus = 'Approved' THEN collection.collectedAmount\n          END) AS 'paidAmount'"), db.raw("\n          COUNT(DISTINCT CASE \n            WHEN emi.status = 'paid' OR leads.status = 'Closed' THEN loan.loanNo\n          END) AS 'fullyPaid'"), db.raw("\n          SUM(CASE \n            WHEN emi.status = 'paid' THEN emi.paymentReceived\n            WHEN leads.status = 'Closed' THEN loan.disbursalAmount + \n              (loan.disbursalAmount * (approval.roi / 100) * DATEDIFF(approval.repayDate, loan.disbursalDate))\n          END) AS 'fullyPaidAmount'"), db.raw("\n          COUNT(DISTINCT CASE \n            WHEN emi.status = 'partially-paid' OR leads.status = 'Part Payment' THEN loan.loanNo\n          END) AS 'partiallyPaid'"), db.raw("\n          SUM(CASE \n            WHEN emi.status = 'partially-paid' THEN emi.paymentReceived\n            WHEN leads.status = 'Part Payment' THEN collection.collectedAmount\n          END) AS 'partiallyPaidAmount'"), db.raw("\n          COUNT(DISTINCT CASE \n            WHEN emi.status = 'due' OR leads.status = 'Disbursed' THEN loan.loanNo\n          END) AS 'unpaidUsers'"), db.raw("\n          SUM(CASE \n            WHEN emi.status = 'due' THEN emi.amountPayable\n            WHEN leads.status = 'Disbursed' THEN loan.disbursalAmount + \n              (loan.disbursalAmount * (approval.roi / 100) * DATEDIFF(approval.repayDate, loan.disbursalDate))\n          END) AS 'unpaidAmount'"), db.raw("\n          COUNT(DISTINCT CASE \n            WHEN cd.disposition = 'PTP' THEN loan.loanNo\n          END) AS 'PTP'"), db.raw("\n          SUM(CASE \n            WHEN cd.disposition = 'PTP' THEN \n              CASE \n                WHEN leads.productID = 1 THEN emi.amountPayable\n                WHEN leads.productID = 2 THEN loan.disbursalAmount + \n                  (loan.disbursalAmount * (approval.roi / 100) * DATEDIFF(approval.repayDate, loan.disbursalDate))\n              END\n          END) AS 'ptpAmount'"), db.raw("\n          SUM(COUNT(DISTINCT CASE \n            WHEN cd.disposition = 'PTP' THEN loan.loanNo \n          END)) OVER () AS 'totalPTP'"), db.raw("\n          SUM(SUM(CASE \n            WHEN cd.disposition = 'PTP' THEN \n              CASE \n                WHEN leads.productID = 1 THEN emi.amountPayable\n                WHEN leads.productID = 2 THEN loan.disbursalAmount +\n                  (loan.disbursalAmount * (approval.roi / 100) * DATEDIFF(approval.repayDate, loan.disbursalDate))\n              END \n          END)) OVER () AS 'totalPtpAmount'"), db.raw("\n          COUNT(DISTINCT CASE \n            WHEN cd.disposition = 'Callback' THEN loan.loanNo\n          END) AS 'callback'"), db.raw("\n          SUM(CASE \n            WHEN cd.disposition = 'callback' THEN \n              CASE \n                WHEN leads.productID = 1 THEN emi.amountPayable\n                WHEN leads.productID = 2 THEN loan.disbursalAmount + \n                  (loan.disbursalAmount * (approval.roi / 100) * DATEDIFF(approval.repayDate, loan.disbursalDate))\n              END\n          END) AS 'callbackAmount'"), db.raw("\n          SUM(COUNT(DISTINCT CASE \n            WHEN cd.disposition = 'callback' THEN loan.loanNo \n          END)) OVER () AS 'totalCallback'"), db.raw("\n          SUM(SUM(CASE \n            WHEN cd.disposition = 'callback' THEN \n              CASE \n                WHEN leads.productID = 1 THEN emi.amountPayable\n                WHEN leads.productID = 2 THEN loan.disbursalAmount +\n                  (loan.disbursalAmount * (approval.roi / 100) * DATEDIFF(approval.repayDate, loan.disbursalDate))\n              END \n          END)) OVER () AS 'totalCallbackAmount'"), db.raw("\n          COUNT(DISTINCT CASE \n            WHEN cd.disposition = 'PTP' AND cd.next_action_datetime < CURRENT_DATE THEN loan.loanNo\n          END) AS 'brokenPTP'"), db.raw("\n          SUM(CASE \n            WHEN cd.disposition = 'PTP' AND cd.next_action_datetime < CURRENT_DATE THEN \n              CASE \n                WHEN leads.productID = 1 THEN emi.amountPayable\n                WHEN leads.productID = 2 THEN loan.disbursalAmount + \n                  (loan.disbursalAmount * (approval.roi / 100) * DATEDIFF(approval.repayDate, loan.disbursalDate))\n              END\n          END) AS 'brokenPtpAmount'"), db.raw("\n          SUM(COUNT(DISTINCT CASE \n            WHEN cd.disposition = 'PTP' AND cd.next_action_datetime < CURRENT_DATE THEN loan.loanNo\n          END)) OVER () AS 'totalBrokenPTP'"), db.raw("\n          SUM(SUM(CASE \n            WHEN cd.disposition = 'PTP' AND cd.next_action_datetime < CURRENT_DATE THEN \n              CASE \n                WHEN leads.productID = 1 THEN emi.amountPayable\n                WHEN leads.productID = 2 THEN loan.disbursalAmount + \n                  (loan.disbursalAmount * (approval.roi / 100) * DATEDIFF(approval.repayDate, loan.disbursalDate))\n              END\n          END)) OVER () AS 'totalBrokenPtpAmount'"), db.raw("\n          COUNT(DISTINCT CASE \n            WHEN wd.read_timestamp IS NOT NULL THEN loan.loanNo\n          END) AS 'messageRead'"), db.raw("\n          SUM(CASE \n            WHEN wd.read_timestamp IS NOT NULL THEN\n              CASE \n                WHEN leads.productID = 1 THEN emi.amountPayable\n                WHEN leads.productID = 2 THEN loan.disbursalAmount +\n                  (loan.disbursalAmount * (approval.roi / 100) * DATEDIFF(approval.repayDate, loan.disbursalDate))\n                END\n          END) AS 'messageReadAmount'"), db.raw("\n          SUM(COUNT(DISTINCT CASE \n            WHEN wd.read_timestamp IS NOT NULL THEN loan.loanNo\n          END)) OVER () AS 'totalMessageRead'"), db.raw("\n          SUM(SUM(CASE \n            WHEN wd.read_timestamp IS NOT NULL THEN\n              CASE \n                WHEN leads.productID = 1 THEN emi.amountPayable\n                WHEN leads.productID = 2 THEN loan.disbursalAmount +\n                  (loan.disbursalAmount * (approval.roi / 100) * DATEDIFF(approval.repayDate, loan.disbursalDate))\n                END\n          END)) OVER () AS 'totalMessageReadAmount'"), db.raw("\n          COUNT(DISTINCT CASE \n            WHEN cd.disposition = 'RTP' THEN loan.loanNo\n          END) AS 'RTP'"), db.raw("\n          SUM(CASE \n            WHEN cd.disposition = 'RTP' THEN\n              CASE \n                WHEN leads.productID = 1 THEN emi.amountPayable\n                WHEN leads.productID = 2 THEN loan.disbursalAmount +\n                  (loan.disbursalAmount * (approval.roi / 100) * DATEDIFF(approval.repayDate, loan.disbursalDate))\n                END\n          END) AS 'rtpAmount'"), db.raw("\n          SUM(COUNT(DISTINCT CASE \n            WHEN cd.disposition = 'RTP' THEN loan.loanNo\n          END)) OVER () AS 'totalRTP'"), db.raw("\n          Sum(SUM(CASE \n            WHEN cd.disposition = 'RTP' THEN\n              CASE \n                WHEN leads.productID = 1 THEN emi.amountPayable\n                WHEN leads.productID = 2 THEN loan.disbursalAmount +\n                  (loan.disbursalAmount * (approval.roi / 100) * DATEDIFF(approval.repayDate, loan.disbursalDate))\n                END\n          END)) OVER () AS 'totalRtpAmount'"), db.raw("\n          COUNT(DISTINCT CASE \n            WHEN cd.disposition = 'NC' THEN loan.loanNo\n          END) AS 'NC'"), db.raw("\n          SUM(COUNT(DISTINCT CASE \n            WHEN cd.disposition = 'NC' THEN loan.loanNo\n          END)) OVER () AS 'totalNC'"), db.raw("\n          COUNT(DISTINCT CASE \n            WHEN cd.disposition = 'NR' THEN loan.loanNo\n          END) AS 'NR'"), db.raw("\n          SUM(COUNT(DISTINCT CASE \n            WHEN cd.disposition = 'NR' THEN loan.loanNo\n          END)) OVER () AS 'totalNR'"), db.raw("\n          CASE \n            WHEN COUNT(DISTINCT loan.loanNo) = 0 THEN 0\n            ELSE ((COUNT(DISTINCT CASE \n                      WHEN (emi.status IN ('paid', 'partially-paid')) OR (collection.collectionStatus = 'Approved') THEN loan.loanNo\n                    END) +\n                    COUNT(DISTINCT CASE \n                      WHEN cd.disposition = 'PTP' THEN loan.loanNo\n                    END) -\n                    COUNT(DISTINCT CASE \n                      WHEN cd.disposition = 'PTP' AND cd.next_action_datetime < CURRENT_DATE THEN loan.loanNo\n                    END)\n                  ) * 100.0) / COUNT(DISTINCT loan.loanNo)\n          END AS 'projection'")).leftJoin('approval', 'leads.leadID', 'approval.leadID').leftJoin('loan', 'leads.leadID', 'loan.leadID').leftJoin('collection', 'leads.leadID', 'collection.leadID').leftJoin('equated_monthly_installments as emi', 'leads.leadID', 'emi.leadID').leftJoin('call_dispositions as cd', 'loan.loanNo', 'cd.loan_no').leftJoin('whatsapp_dispositions as wd', 'loan.loanNo', 'wd.loan_no').where(function() {
                                        this.whereIn('leads.status', [
                                            'Closed',
                                            'Settlement',
                                            'Part Payment',
                                            'Disbursed'
                                        ]).andWhereRaw('COALESCE(emi.dueDate, approval.repayDate) BETWEEN ? AND ?', [
                                            startDate,
                                            endDate
                                        ]);
                                    }).groupByRaw('COALESCE(emi.dueDate, approval.repayDate)').orderByRaw('`dueDate` DESC')
                                ];
                            case 1:
                                result = _state.sent();
                                return [
                                    2,
                                    this.serviceResponse(200, result, 'Projection report data retrieved successfully.')
                                ];
                        }
                    });
                }).call(this);
            }
        },
        {
            key: "projectionFailedFile",
            value: function projectionFailedFile(fileId, type) {
                return _async_to_generator(function() {
                    var data, templatePath, htmlContent, browser, page, pdfBuffer, pdfStream, err;
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
                                    this.getfailedDetails(fileId, type)
                                ];
                            case 1:
                                data = _state.sent();
                                templatePath = path.resolve(__dirname, '../views/loansDocs/projection_failed.ejs');
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
                                        executablePath: '/usr/bin/chromium-browser',
                                        args: [
                                            '--no-sandbox',
                                            '--disable-setuid-sandbox',
                                            '--disable-web-security'
                                        ],
                                        headless: true
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
                                        waitUntil: 'networkidle0',
                                        timeout: 60000
                                    })
                                ];
                            case 5:
                                _state.sent();
                                return [
                                    4,
                                    page.pdf({
                                        format: 'A4',
                                        timeout: 60000
                                    })
                                ];
                            case 6:
                                pdfBuffer = _state.sent();
                                return [
                                    4,
                                    browser.close()
                                ];
                            case 7:
                                _state.sent();
                                pdfStream = new Readable();
                                pdfStream.push(pdfBuffer);
                                pdfStream.push(null);
                                return [
                                    2,
                                    pdfStream
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
            key: "projectionFailedFileDetails",
            value: function projectionFailedFileDetails(page, perPage) {
                return _async_to_generator(function() {
                    var db, offset, data, countResult, totalCount, fileData;
                    return _ts_generator(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                db = getKnexInstance();
                                offset = (page - 1) * perPage;
                                return [
                                    4,
                                    db('projection_filelog').limit(perPage).offset(offset)
                                ];
                            case 1:
                                data = _state.sent();
                                return [
                                    4,
                                    db('projection_filelog').count('* as total')
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
        }
    ]);
    return ProjectionService;
}(ResponseService);
export var projectionService = new ProjectionService();

//# sourceMappingURL=projection.service.js.map