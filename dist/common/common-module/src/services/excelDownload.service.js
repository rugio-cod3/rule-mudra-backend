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
import ExcelJS from 'exceljs';
import moment from 'moment-timezone';
import { BadRequestError } from '../errors';
import ResponseService from './response.service';
var ExcelDownloadService = /*#__PURE__*/ function(ResponseService) {
    "use strict";
    _inherits(ExcelDownloadService, ResponseService);
    function ExcelDownloadService() {
        _class_call_check(this, ExcelDownloadService);
        return _call_super(this, ExcelDownloadService, arguments);
    }
    _create_class(ExcelDownloadService, [
        {
            key: "generateExcelFile",
            value: /**
   * A generic function to create formatted Excel files from any data
   * @param data Array of objects to be exported as Excel rows
   * @param worksheetName Optional name for the worksheet (defaults to 'Data')
   * @param customColumns Optional custom column definitions
   * @returns ExcelJS.Workbook instance that can be used to write to response or buffer
   */ function generateExcelFile(data) {
                var worksheetName = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 'Data', customColumns = arguments.length > 2 ? arguments[2] : void 0;
                // Create a new workbook with metadata
                var workbook = new ExcelJS.Workbook();
                workbook.creator = 'CRM System';
                workbook.lastModifiedBy = 'CRM System';
                workbook.created = new Date();
                workbook.modified = new Date();
                workbook.properties.date1904 = true;
                // Add worksheet with page setup
                var worksheet = workbook.addWorksheet(worksheetName, {
                    pageSetup: {
                        paperSize: 9,
                        orientation: 'landscape'
                    }
                });
                // If no data, return empty workbook
                if (!data.length) {
                    return workbook;
                }
                // Define columns based on first data item's keys or use custom columns if provided
                var columns = customColumns || Object.keys(data[0]).map(function(key) {
                    return {
                        header: key.replace(/([a-z])([A-Z])/g, '$1 $2') // Only add space between lowercase and uppercase
                        .replace(/^./, function(str) {
                            return str.toUpperCase();
                        }).trim(),
                        key: key,
                        width: Math.max(15, Math.min(30, key.length * 1.5))
                    };
                });
                // Set columns to worksheet
                worksheet.columns = columns;
                // Style the header row
                var headerRow = worksheet.getRow(1);
                headerRow.font = {
                    bold: true,
                    size: 12
                };
                headerRow.alignment = {
                    horizontal: 'center',
                    vertical: 'middle'
                };
                headerRow.fill = {
                    type: 'pattern',
                    pattern: 'solid',
                    fgColor: {
                        argb: 'FFE0E0E0'
                    }
                };
                headerRow.height = 22;
                // Add data rows
                worksheet.addRows(data);
                // Pre-calculate header lengths and initialize column widths
                var minWidth = 15;
                var maxWidth = 30;
                var padding = 5;
                worksheet.columns.forEach(function(col) {
                    var _ref;
                    var _col_header;
                    // Set initial width based on header
                    var headerLength = (_ref = (_col_header = col.header) === null || _col_header === void 0 ? void 0 : _col_header.length) !== null && _ref !== void 0 ? _ref : 0;
                    var optimalWidth = Math.max(minWidth, Math.min(maxWidth, headerLength + padding));
                    // Find longest cell value in one pass
                    if (col.eachCell) {
                        col.eachCell({
                            includeEmpty: false
                        }, function(cell) {
                            if (cell.value) {
                                var cellLength = cell.value.toString().length;
                                optimalWidth = Math.max(optimalWidth, Math.min(maxWidth, cellLength + padding));
                            }
                        });
                    }
                    col.width = optimalWidth;
                    col.alignment = {
                        horizontal: 'center',
                        vertical: 'middle'
                    };
                });
                // Style data rows for better readability
                worksheet.eachRow(function(row, rowNumber) {
                    if (rowNumber > 1) {
                        // Apply formatting to all data rows
                        row.alignment = {
                            vertical: 'middle',
                            horizontal: 'left'
                        };
                        row.height = 20;
                        // Add cell borders and alternate row shading for better readability
                        row.eachCell(function(cell) {
                            cell.border = {
                                top: {
                                    style: 'thin'
                                },
                                left: {
                                    style: 'thin'
                                },
                                bottom: {
                                    style: 'thin'
                                },
                                right: {
                                    style: 'thin'
                                }
                            };
                            // Format dates automatically
                            if (_instanceof(cell.value, Date)) {
                                cell.numFmt = 'dd/mm/yyyy hh:mm:ss';
                            }
                        });
                        // Add alternate row shading
                        if (rowNumber % 2 === 0) {
                            row.fill = {
                                type: 'pattern',
                                pattern: 'solid',
                                fgColor: {
                                    argb: 'FFF5F5F5'
                                }
                            };
                        }
                    }
                });
                // Add auto-filter for easy data sorting in Excel
                worksheet.autoFilter = {
                    from: {
                        row: 1,
                        column: 1
                    },
                    to: {
                        row: 1,
                        column: columns.length
                    }
                };
                // Freeze the header row so it stays visible when scrolling
                worksheet.views = [
                    {
                        state: 'frozen',
                        xSplit: 0,
                        ySplit: 1
                    }
                ];
                return workbook;
            }
        },
        {
            key: "prepareExcelDownloadHeaders",
            value: /**
   * Prepares response headers for Excel file download
   * @param res Express Response object
   * @param fileName Name of the file to download (without extension)
   */ function prepareExcelDownloadHeaders(res, fileName) {
                // Create a consistent filename with timestamp to prevent caching issues
                var date = moment().tz('Asia/Kolkata');
                var formattedDate = date.format('YYYYMMDD_HHmmss');
                var finalFileName = "".concat(fileName, "_").concat(formattedDate, ".xlsx");
                // Properly encode the filename for all browsers
                var encodedFileName = encodeURIComponent(finalFileName);
                // Set comprehensive response headers compatible with various browsers
                res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
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
            key: "prepareTxtDownloadHeaders",
            value: /**
   * Prepares response headers for Txt file download
   * @param res Express Response object
   * @param fileName Name of the file to download (without extension)
   */ function prepareTxtDownloadHeaders(res, fileName) {
                // Create a consistent filename with timestamp to prevent caching issues
                var date = moment().tz('Asia/Kolkata');
                var formattedDate = date.format('YYYYMMDD_HHmmss');
                var finalFileName = "".concat(fileName, "_").concat(formattedDate, ".txt");
                // Properly encode the filename for all browsers
                var encodedFileName = encodeURIComponent(finalFileName);
                // Set comprehensive response headers compatible with various browsers
                res.setHeader('Content-Type', 'text/plain');
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
            key: "exportDataToExcel",
            value: /**
   * A helper function to use in controllers for quick Excel export
   * @param res Express Response object
   * @param data Data to export
   * @param fileName Name of the file to download (without extension)
   * @param worksheetName Optional name for the worksheet
   * @param customColumns Optional custom column definitions
   */ function exportDataToExcel(res, data, fileName) {
                var worksheetName = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : 'Sheet1', customColumns = arguments.length > 4 ? arguments[4] : void 0;
                return _async_to_generator(function() {
                    var workbook, error;
                    return _ts_generator(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                _state.trys.push([
                                    0,
                                    2,
                                    ,
                                    3
                                ]);
                                workbook = this.generateExcelFile(data, worksheetName, customColumns);
                                this.prepareExcelDownloadHeaders(res, fileName);
                                // Write workbook directly to response stream
                                return [
                                    4,
                                    workbook.xlsx.write(res)
                                ];
                            case 1:
                                _state.sent();
                                res.end();
                                return [
                                    3,
                                    3
                                ];
                            case 2:
                                error = _state.sent();
                                console.error('Error exporting Excel file:', error);
                                if (!res.headersSent) {
                                    res.status(500).json({
                                        error: 'Failed to generate Excel file'
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
            key: "exportDataToExcelBuffer",
            value: /**
   * A helper function to use in services for quick Excel export
   * @param data Data to export
   * @param worksheetName Optional name for the worksheet
   * @param customColumns Optional custom column definitions
   */ function exportDataToExcelBuffer(data) {
                var worksheetName = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 'Sheet1', customColumns = arguments.length > 2 ? arguments[2] : void 0;
                return _async_to_generator(function() {
                    var workbook;
                    return _ts_generator(this, function(_state) {
                        try {
                            workbook = this.generateExcelFile(data, worksheetName, customColumns);
                            return [
                                2,
                                workbook
                            ];
                        } catch (error) {
                            console.error('Error exporting Excel file:', error);
                            throw new BadRequestError('Failed to generate Excel file');
                        }
                        return [
                            2
                        ];
                    });
                }).call(this);
            }
        },
        {
            key: "excelDownloadForDateWiseCollection",
            value: function excelDownloadForDateWiseCollection(data) {
                return _async_to_generator(function() {
                    var workbook, worksheet, rows, totals, buffer, error;
                    return _ts_generator(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                _state.trys.push([
                                    0,
                                    2,
                                    ,
                                    3
                                ]);
                                workbook = new ExcelJS.Workbook();
                                worksheet = workbook.addWorksheet('Data');
                                // Define columns with sub-columns
                                worksheet.columns = [
                                    {
                                        header: 'Date',
                                        key: 'date',
                                        width: 15
                                    },
                                    {
                                        header: 'Dues - Cases',
                                        key: 'dues_cases',
                                        width: 15
                                    },
                                    {
                                        header: 'Dues - Loan Amount',
                                        key: 'dues_loanAmount',
                                        width: 15
                                    },
                                    {
                                        header: 'Dues - Interest Amount',
                                        key: 'dues_interestAmount',
                                        width: 15
                                    },
                                    {
                                        header: 'Dues - Repayment Amount',
                                        key: 'dues_repaymentAmount',
                                        width: 15
                                    },
                                    {
                                        header: 'Dues - Percentage',
                                        key: 'dues_percentage',
                                        width: 15
                                    },
                                    {
                                        header: 'Collection - Cases',
                                        key: 'collected_cases',
                                        width: 15
                                    },
                                    {
                                        header: 'Collection - Loan Amount',
                                        key: 'collected_loanAmount',
                                        width: 15
                                    },
                                    {
                                        header: 'Collection - Interest Amount',
                                        key: 'collected_interestAmount',
                                        width: 15
                                    },
                                    {
                                        header: 'Collection - Collected Amount',
                                        key: 'collected_collectedAmount',
                                        width: 15
                                    },
                                    {
                                        header: 'Collection - Penalty Amount',
                                        key: 'collected_penaltyAmount',
                                        width: 15
                                    },
                                    {
                                        header: 'Collection - Percentage',
                                        key: 'collected_percentage',
                                        width: 15
                                    },
                                    {
                                        header: 'Pending - Cases',
                                        key: 'pending_cases',
                                        width: 15
                                    },
                                    {
                                        header: 'Pending - Loan Amount',
                                        key: 'pending_loanAmount',
                                        width: 15
                                    },
                                    {
                                        header: 'Pending - Interest Amount',
                                        key: 'pending_interestAmount',
                                        width: 15
                                    },
                                    {
                                        header: 'Pending - Part Payment',
                                        key: 'pending_partPayment',
                                        width: 15
                                    },
                                    {
                                        header: 'Pending - Pending Amount',
                                        key: 'pending_pendingAmount',
                                        width: 15
                                    },
                                    {
                                        header: 'Pending - Percentage',
                                        key: 'pending_percentage',
                                        width: 15
                                    }
                                ];
                                // Prepare data rows
                                rows = data.result.map(function(item) {
                                    return {
                                        date: item.date,
                                        dues_cases: item.due.cases,
                                        dues_loanAmount: item.due.loanAmount,
                                        dues_interestAmount: item.due.interestAmount,
                                        dues_repaymentAmount: item.due.repaymentAmount,
                                        dues_percentage: item.due.percentage,
                                        collected_cases: item.collected.cases,
                                        collected_loanAmount: item.collected.loanAmount,
                                        collected_interestAmount: item.collected.interestAmount,
                                        collected_collectedAmount: item.collected.collectedAmount,
                                        collected_penaltyAmount: item.collected.penaltyAmount,
                                        collected_percentage: item.collected.percentage,
                                        pending_cases: item.pending.cases,
                                        pending_loanAmount: item.pending.loanAmount,
                                        pending_interestAmount: item.pending.interestAmount,
                                        pending_partPayment: item.pending.partPaymentAmount,
                                        pending_pendingAmount: item.pending.pending_amount,
                                        pending_percentage: item.pending.percentage
                                    };
                                });
                                // Add data rows to worksheet
                                rows.forEach(function(row) {
                                    worksheet.addRow(row);
                                });
                                // Calculate totals for all fields
                                totals = {
                                    date: 'Total',
                                    dues_cases: rows.reduce(function(sum, row) {
                                        return sum + (row.dues_cases || 0);
                                    }, 0),
                                    dues_loanAmount: rows.reduce(function(sum, row) {
                                        return sum + (row.dues_loanAmount || 0);
                                    }, 0),
                                    dues_interestAmount: rows.reduce(function(sum, row) {
                                        return sum + (row.dues_interestAmount || 0);
                                    }, 0),
                                    dues_repaymentAmount: rows.reduce(function(sum, row) {
                                        return sum + (row.dues_repaymentAmount || 0);
                                    }, 0),
                                    dues_percentage: rows.reduce(function(sum, row) {
                                        return sum + (row.dues_percentage || 0);
                                    }, 0),
                                    collected_cases: rows.reduce(function(sum, row) {
                                        return sum + (row.collected_cases || 0);
                                    }, 0),
                                    collected_loanAmount: rows.reduce(function(sum, row) {
                                        return sum + (row.collected_loanAmount || 0);
                                    }, 0),
                                    collected_interestAmount: rows.reduce(function(sum, row) {
                                        return sum + (row.collected_interestAmount || 0);
                                    }, 0),
                                    collected_collectedAmount: rows.reduce(function(sum, row) {
                                        return sum + (row.collected_collectedAmount || 0);
                                    }, 0),
                                    collected_penaltyAmount: rows.reduce(function(sum, row) {
                                        return sum + (row.penalityAmount || 0);
                                    }, 0),
                                    collected_percentage: rows.reduce(function(sum, row) {
                                        return sum + (row.collected_percentage || 0);
                                    }, 0),
                                    pending_cases: rows.reduce(function(sum, row) {
                                        return sum + (row.pending_cases || 0);
                                    }, 0),
                                    pending_loanAmount: rows.reduce(function(sum, row) {
                                        return sum + (row.pending_loanAmount || 0);
                                    }, 0),
                                    pending_interestAmount: rows.reduce(function(sum, row) {
                                        return sum + (row.pending_interestAmount || 0);
                                    }, 0),
                                    pending_partPayment: rows.reduce(function(sum, row) {
                                        return sum + (row.pending_partPayment || 0);
                                    }, 0),
                                    pending_pendingAmount: rows.reduce(function(sum, row) {
                                        return sum + (row.pending_pendingAmount || 0);
                                    }, 0),
                                    pending_percentage: rows.reduce(function(sum, row) {
                                        return sum + (row.pending_percentage || 0);
                                    }, 0)
                                };
                                // Add the totals row at the end
                                worksheet.addRow(totals);
                                return [
                                    4,
                                    workbook.xlsx.writeBuffer()
                                ];
                            case 1:
                                buffer = _state.sent();
                                return [
                                    2,
                                    buffer
                                ];
                            case 2:
                                error = _state.sent();
                                console.error('Excel generation error:', error);
                                throw new Error('Error generating Excel file');
                            case 3:
                                return [
                                    2
                                ];
                        }
                    });
                })();
            }
        }
    ]);
    return ExcelDownloadService;
}(ResponseService);
export { ExcelDownloadService as default };
export var excelDownloadService = new ExcelDownloadService();

//# sourceMappingURL=excelDownload.service.js.map