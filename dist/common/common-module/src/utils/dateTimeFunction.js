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
import moment from 'moment-timezone';
import { BadRequestError } from '../errors';
export var timestampsForEmiAutoPay = function timestampsForEmiAutoPay() {
    return _async_to_generator(function() {
        var startTimeStramp, endTimeStramp;
        return _ts_generator(this, function(_state) {
            startTimeStramp = new Date(Date.now());
            startTimeStramp.setDate(startTimeStramp.getDate() - 1);
            startTimeStramp.setHours(18, 30, 0, 0);
            endTimeStramp = new Date(Date.now());
            endTimeStramp.setHours(18, 30, 0, 0);
            return [
                2,
                Promise.resolve({
                    startTimeStramp: startTimeStramp,
                    endTimeStramp: endTimeStramp
                })
            ];
        });
    })();
};
export var dateCheck = function dateCheck(firstDueDate) {
    var dueDate = new Date(firstDueDate);
    var currentDate = new Date();
    var differenceInMillis = dueDate.getTime() - currentDate.getTime();
    var differenceInDays = Math.floor(differenceInMillis / (1000 * 60 * 60 * 24));
    return differenceInDays;
};
export function compareDates(date1, date2) {
    var d1 = new Date(date1);
    var d2 = new Date(date2);
    // Extract DDMMYY parts
    var dd1 = d1.getDate();
    var mm1 = d1.getMonth();
    var yy1 = d1.getFullYear();
    var dd2 = d2.getDate();
    var mm2 = d2.getMonth();
    var yy2 = d2.getFullYear();
    // Create new dates from extracted parts (ignoring time)
    var datePart1 = new Date(yy1, mm1, dd1);
    var datePart2 = new Date(yy2, mm2, dd2);
    // Compare dates
    return datePart1 < datePart2;
}
export var getTimeInIst = function getTimeInIst(date) {
    var options = {
        timeZone: 'Asia/Kolkata',
        hour12: false
    };
    return new Date(date ? date.toLocaleString('en-US', options) : new Date().toLocaleString('en-US', options));
};
export var getDifferenceInDays = function getDifferenceInDays(date1, date2) {
    var now = moment().tz('Asia/Kolkata');
    return date2 ? moment(date2).diff(moment(date1), 'days') : now.diff(moment(date1), 'days');
};
export var isDateAfter = function isDateAfter(date, date2) {
    var same = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : false;
    return same ? moment(date).isSameOrAfter(moment(date2)) : moment(date).isAfter(moment(date2));
};
export var convertToDate = function convertToDate(dateString) {
    // console.log('dateString', dateString)
    if (!dateString) {
        return null;
    }
    var months = {
        January: 0,
        February: 1,
        March: 2,
        April: 3,
        May: 4,
        June: 5,
        July: 6,
        August: 7,
        September: 8,
        October: 9,
        November: 10,
        December: 11
    };
    var _dateString_split = _sliced_to_array(dateString.split('-'), 3), day = _dateString_split[0], month = _dateString_split[1], year = _dateString_split[2];
    var dayNum = parseInt(day, 10);
    var monthIndex = months[month];
    var yearNum = parseInt(year, 10);
    if (isNaN(dayNum) || isNaN(monthIndex) || isNaN(yearNum)) {
        return null;
    }
    return new Date(yearNum, monthIndex, dayNum);
};
export var convertToSeconds = function convertToSeconds(time) {
    if (!time || !time.includes(':')) return null;
    var _time_split_map = _sliced_to_array(time.split(':').map(Number), 3), hours = _time_split_map[0], minutes = _time_split_map[1], seconds = _time_split_map[2];
    if (isNaN(hours) || isNaN(minutes) || isNaN(seconds)) return null;
    return hours * 3600 + minutes * 60 + seconds;
};
export var convertToMySQLDateTime = function convertToMySQLDateTime(dateTime) {
    if (!dateTime || !dateTime.includes(' ')) return null;
    var _dateTime_split = _sliced_to_array(dateTime.split(' '), 2), datePart = _dateTime_split[0], timePart = _dateTime_split[1];
    var _datePart_split = _sliced_to_array(datePart.split('-'), 3), day = _datePart_split[0], month = _datePart_split[1], year = _datePart_split[2];
    if (!day || !month || !year) return null;
    return "".concat(year, "-").concat(month, "-").concat(day, " ").concat(timePart);
};
export var convertToMySQLDateTimePro = function convertToMySQLDateTimePro(dateTime) {
    if (!dateTime || !dateTime.includes(' ')) return null;
    var _dateTime_split = _sliced_to_array(dateTime.split(' '), 2), datePart = _dateTime_split[0], timePart = _dateTime_split[1];
    var _datePart_split = _sliced_to_array(datePart.split('-'), 3), year = _datePart_split[0], month = _datePart_split[1], day = _datePart_split[2];
    if (!day || !month || !year || !timePart) return null;
    if (isNaN(Number(day)) || isNaN(Number(month)) || isNaN(Number(year))) return null;
    var timeParts = timePart === null || timePart === void 0 ? void 0 : timePart.split(':');
    if (timeParts.length !== 3 || timeParts.some(function(part) {
        return isNaN(Number(part));
    })) return null;
    return "".concat(year, "-").concat(month, "-").concat(day, " ").concat(timePart);
};
export var checkUploadTimeIST = function checkUploadTimeIST() {
    var currentDateUTC = new Date();
    var ISTOffset = 5.5 * 60 * 60 * 1000;
    var currentDateIST = new Date(currentDateUTC.getTime() + ISTOffset);
    var currentHourIST = currentDateIST.getUTCHours();
    var currentMinuteIST = currentDateIST.getUTCMinutes();
    var cutoffHourIST = 21 //21
    ;
    var cutoffMinuteIST = 30 //30
    ;
    if (currentHourIST > cutoffHourIST || currentHourIST === cutoffHourIST && currentMinuteIST > cutoffMinuteIST) {
        throw new BadRequestError('Please upload the file before 9:30 PM IST.');
    //return false
    }
};
export var addMonthNoOverflow = function addMonthNoOverflow(date, day) {
    // Clone the date to avoid mutating the original
    var newDate = date.clone();
    // Add one month
    newDate.add(1, 'month');
    // Ensure the day does not overflow
    var daysInMonth = newDate.daysInMonth();
    newDate.date(Math.min(day, daysInMonth));
    return newDate;
};
export var addMonthsToDate = function addMonthsToDate(date, months) {
    return moment(date).add(months, 'month');
};
export var subtractDayFromDate = function subtractDayFromDate(date, day) {
    return moment(date).subtract(day, 'day');
};
export var addDaysToDate = function addDaysToDate(date, daysToAdd) {
    return moment(date).add(daysToAdd, 'days');
};
export var getCurrentTime = function getCurrentTime() {
    var withTime = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : true;
    return withTime ? new Date() : new Date(new Date().setHours(0, 0, 0, 0));
};

//# sourceMappingURL=dateTimeFunction.js.map