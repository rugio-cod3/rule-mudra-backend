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
import * as fastCsv from 'fast-csv';
import { Readable } from 'stream';
import { BadRequestError } from '../errors';
import ResponseService from './response.service';
var CsvDownloadService = /*#__PURE__*/ function(ResponseService) {
    "use strict";
    _inherits(CsvDownloadService, ResponseService);
    function CsvDownloadService() {
        _class_call_check(this, CsvDownloadService);
        return _call_super(this, CsvDownloadService, arguments);
    }
    _create_class(CsvDownloadService, [
        {
            key: "generateCsvFile",
            value: /**
   * A generic function to create formatted CSV files from any data
   * @param data Array of objects to be exported as CSV rows
   * @returns Promise<string> CSV string that can be used to write to response or buffer
   */ function generateCsvFile(data) {
                return _async_to_generator(function() {
                    var formattedData;
                    return _ts_generator(this, function(_state) {
                        // If no data, return empty string
                        if (!data.length) {
                            return [
                                2,
                                ''
                            ];
                        }
                        try {
                            // Transform data to format dates properly
                            formattedData = data.map(function(item) {
                                var newItem = _object_spread({}, item);
                                for(var key in newItem){
                                    if (_type_of(newItem[key]) === 'object' && newItem[key] !== null && _instanceof(Object(newItem[key]), Date)) {
                                        newItem[key] = newItem[key].toISOString().split('T')[0];
                                    }
                                }
                                return newItem;
                            });
                            // Use fast-csv to convert data to CSV string
                            return [
                                2,
                                new Promise(function(resolve, reject) {
                                    var rows = [];
                                    fastCsv.write(formattedData, {
                                        headers: true
                                    }).on('data', function(row) {
                                        return rows.push(row.toString());
                                    }).on('error', function(error) {
                                        return reject(error);
                                    }).on('end', function() {
                                        return resolve(rows.join(''));
                                    });
                                })
                            ];
                        } catch (error) {
                            console.error('Error generating CSV file:', error);
                            throw new BadRequestError('Failed to generate CSV file');
                        }
                        return [
                            2
                        ];
                    });
                })();
            }
        },
        {
            key: "prepareCsvDownloadHeaders",
            value: /**
   * Prepares response headers for CSV file download
   * @param res Express Response object
   * @param fileName Name of the file to download (without extension)
   */ function prepareCsvDownloadHeaders(res, fileName) {
                // Create a consistent filename with timestamp to prevent caching issues
                var date = new Date();
                var formattedDate = date.toISOString().split('T')[0];
                var finalFileName = "".concat(fileName, "_").concat(formattedDate, ".csv");
                // Properly encode the filename for all browsers
                var encodedFileName = encodeURIComponent(finalFileName);
                // Set comprehensive response headers compatible with various browsers
                res.setHeader('Content-Type', 'text/csv');
                // Support multiple browser filename specifications
                res.setHeader('Content-Disposition', 'attachment; filename="'.concat(finalFileName, "\"; filename*=UTF-8''").concat(encodedFileName));
                // Ensure Content-Disposition is exposed for CORS requests
                res.setHeader('Access-Control-Expose-Headers', 'Content-Disposition, Content-Type');
                // Prevent any caching of the file
                res.setHeader('Cache-Control', 'private, no-cache, no-store, must-revalidate');
                res.setHeader('Pragma', 'no-cache');
                res.setHeader('Expires', '0');
            }
        },
        {
            key: "exportDataToCsv",
            value: /**
   * A helper function to use in controllers for quick CSV export
   * Using streams for more efficient memory usage
   * @param res Express Response object
   * @param data Data to export
   * @param fileName Name of the file to download (without extension)
   */ function exportDataToCsv(res, data, fileName) {
                return _async_to_generator(function() {
                    var csvContent, csvStream, error;
                    return _ts_generator(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                _state.trys.push([
                                    0,
                                    2,
                                    ,
                                    3
                                ]);
                                this.prepareCsvDownloadHeaders(res, fileName);
                                return [
                                    4,
                                    this.generateCsvFile(data)
                                ];
                            case 1:
                                csvContent = _state.sent();
                                // Create a readable stream from the CSV string
                                csvStream = Readable.from([
                                    csvContent
                                ]);
                                // Pipe the stream directly to the response
                                csvStream.pipe(res).on('error', function(error) {
                                    console.error('Error streaming CSV:', error);
                                    if (!res.headersSent) {
                                        res.status(500).json({
                                            error: 'Failed to generate CSV file'
                                        });
                                    }
                                });
                                return [
                                    3,
                                    3
                                ];
                            case 2:
                                error = _state.sent();
                                console.error('Error exporting CSV file:', error);
                                if (!res.headersSent) {
                                    res.status(500).json({
                                        error: 'Failed to generate CSV file'
                                    });
                                } else {
                                    res.end();
                                }
                                return [
                                    3,
                                    3
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
            key: "exportDataToCsvString",
            value: /**
   * A helper function to use in services for quick CSV export
   * @param data Data to export
   * @returns Promise<string> CSV string
   */ function exportDataToCsvString(data) {
                return _async_to_generator(function() {
                    return _ts_generator(this, function(_state) {
                        try {
                            return [
                                2,
                                this.generateCsvFile(data)
                            ];
                        } catch (error) {
                            console.error('Error exporting CSV file:', error);
                            throw new BadRequestError('Failed to generate CSV file');
                        }
                        return [
                            2
                        ];
                    });
                }).call(this);
            }
        }
    ]);
    return CsvDownloadService;
}(ResponseService);
export { CsvDownloadService as default };
export var csvDownloadService = new CsvDownloadService();

//# sourceMappingURL=csvDownload.service.js.map