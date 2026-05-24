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
function _type_of(obj) {
    "@swc/helpers - typeof";
    return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol ? "symbol" : typeof obj;
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
import bcrypt from 'bcrypt';
import { differenceInCalendarDays, format } from 'date-fns';
import rateLimit from 'express-rate-limit';
import momentTz from 'moment-timezone';
import reader from 'xlsx';
import { logger } from './logger';
import { getKnexInstance } from './mysql';
var crypto = require('crypto');
var SALT_ROUNDS = 10;
export var maskString = function maskString(str, lengthToMask, char) {
    if (typeof str === 'number') {
        str = String(str);
    }
    return char ? char.repeat(lengthToMask) + str.slice(lengthToMask) : 'X'.repeat(lengthToMask) + str.slice(lengthToMask);
};
/**
 * Removes title prefixes and other clippings from a name
 * @param name The name to process
 * @returns Cleaned name without prefixes or clippings
 */ export var replaceNameClippingsRe = function replaceNameClippingsRe(name) {
    if (!name || typeof name !== 'string') {
        return '';
    }
    try {
        // Convert to lowercase for case-insensitive matching
        var normalizedName = name.toLowerCase().trim();
        if (!normalizedName) return '';
        // Title prefixes and honorifics to remove
        var clippings = [
            'mr.',
            'miss.',
            'mrs.',
            'ms.',
            'dr.',
            'prof.',
            'rev.',
            'capt.',
            'col.',
            'sgt.',
            'fr.',
            'sr.',
            'jr.',
            'adv.',
            'engr.',
            'cdr.',
            'gov.',
            'er.',
            'smt.',
            'lt.',
            'maj.',
            'gen.',
            'pt.',
            // Versions without dots
            'mr',
            'miss',
            'mrs',
            'ms',
            'dr',
            'prof',
            'rev',
            'capt',
            'col',
            'sgt',
            'fr',
            'sr',
            'jr',
            'adv',
            'engr',
            'cdr',
            'gov',
            'er',
            'smt',
            'lt',
            'maj',
            'gen',
            // Cultural and regional titles
            'swami',
            'guruji',
            'pandit',
            'panditji',
            'acharya',
            'maharaj',
            'baba',
            'dean',
            'ca',
            'cs',
            "hon'ble",
            'shri',
            'shree',
            'air cmde',
            'justice',
            'mp',
            'mla',
            'cm',
            'pm',
            'ji',
            'sahib',
            'saheb',
            'thiru',
            'seth',
            'bhai',
            'behen',
            'ben',
            'chacha',
            'tai'
        ];
        // Sort by length descending to handle longer prefixes first
        var sortedClippings = clippings.sort(function(a, b) {
            return b.length - a.length;
        });
        // Relationship markers that should terminate name processing
        var excludeClippings = {
            's/o': 's/o',
            'd/o': 'd/o',
            'w/o': 'w/o',
            'h/o': 'h/o',
            'c/o': 'c/o'
        };
        var processedName = normalizedName;
        var _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
        try {
            // Remove title prefixes at the beginning
            for(var _iterator = sortedClippings[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true){
                var clipping = _step.value;
                if (processedName === clipping || processedName.startsWith(clipping + ' ')) {
                    processedName = processedName.substring(clipping.length).trim();
                    break;
                }
            }
        } catch (err) {
            _didIteratorError = true;
            _iteratorError = err;
        } finally{
            try {
                if (!_iteratorNormalCompletion && _iterator.return != null) {
                    _iterator.return();
                }
            } finally{
                if (_didIteratorError) {
                    throw _iteratorError;
                }
            }
        }
        // Handle relationship markers - stop processing at these boundaries
        for(var clipping1 in excludeClippings){
            if (Object.prototype.hasOwnProperty.call(excludeClippings, clipping1)) {
                var regex = new RegExp("(^|\\s)".concat(excludeClippings[clipping1], "\\s+"), 'i');
                var matches = processedName.match(regex);
                if (matches) {
                    processedName = processedName.split(regex)[0].trim();
                    break;
                }
            }
        }
        // Final cleanup - remove any remaining prefixes and normalize spaces
        var nameWords = processedName.split(/\s+/).filter(Boolean);
        while(nameWords.length > 0 && sortedClippings.includes(nameWords[0])){
            nameWords.shift();
        }
        return removeDotsAndAddSpace(nameWords.join(' ')).trim();
    } catch (error) {
        logger.error("Error processing name: ".concat(error.message), {
            error: error
        });
        return name // Return original name if any error occurs
        ;
    }
};
/**
 * Formats a string by removing and replacing dots
 * @param str The string to format
 * @returns Formatted string with dots replaced by spaces
 */ export function removeDotsAndAddSpace(str) {
    if (!str || typeof str !== 'string') {
        return '';
    }
    try {
        // Single regex to handle all dot replacements and space normalization
        return str.replace(/^\.+|\.+$/g, '') // Remove dots at beginning and end
        .replace(/\.+/g, ' ') // Replace dots with spaces
        .replace(/\s+/g, ' ') // Normalize spaces
        .trim();
    } catch (error) {
        logger.error("Error removing dots: ".concat(error.message), {
            error: error
        });
        return str;
    }
}
/**
 * Calculates the similarity percentage between two strings.
 * @param first The first string to compare
 * @param second The second string to compare
 * @returns A number between 0 (no similarity) and 100 (identical)
 */ export function similarityPercent(first, second) {
    // Handle edge cases
    if (first === second) return 100;
    if (!first || !second) return 0;
    try {
        var match = similarText(first, second);
        return Math.min(100, match * 200 / (first.length + second.length));
    } catch (error) {
        logger.error("Error calculating similarity: ".concat(error.message), {
            error: error
        });
        return 0;
    }
}
/**
 * Computes the similarity between two strings using an iterative approach
 * @param first The first string to compare
 * @param second The second string to compare
 * @returns A number representing similarity strength
 */ function similarText(first, second) {
    if (!first || !second) return 0;
    var firstLength = first.length;
    var secondLength = second.length;
    // Use dynamic programming to avoid recursion and potential stack overflow
    var result = 0;
    var stack = [
        [
            first,
            second
        ]
    ];
    while(stack.length > 0){
        var _stack_pop = _sliced_to_array(stack.pop(), 2), s1 = _stack_pop[0], s2 = _stack_pop[1];
        if (!s1 || !s2) continue;
        var pos1 = 0, pos2 = 0, maxLen = 0;
        // Find the longest common substring
        for(var i = 0; i < s1.length; i++){
            for(var j = 0; j < s2.length; j++){
                var len = 0;
                while(i + len < s1.length && j + len < s2.length && s1[i + len] === s2[j + len]){
                    len++;
                }
                if (len > maxLen) {
                    maxLen = len;
                    pos1 = i;
                    pos2 = j;
                }
            }
        }
        if (maxLen > 0) {
            result += maxLen;
            // Process remaining parts
            if (pos1 > 0 && pos2 > 0) {
                stack.push([
                    s1.substring(0, pos1),
                    s2.substring(0, pos2)
                ]);
            }
            if (pos1 + maxLen < s1.length && pos2 + maxLen < s2.length) {
                stack.push([
                    s1.substring(pos1 + maxLen),
                    s2.substring(pos2 + maxLen)
                ]);
            }
        }
    }
    return result;
}
/**
 * Creates a memoized version of the similarityPercent function with LRU caching
 * @param options Configuration options for the memoization
 * @returns A memoized version of the similarity percentage calculator
 */ export var memoizedSimilarityPercent = function memoizedSimilarityPercent() {
    var options = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
    var _options_maxCacheSize = options.maxCacheSize, maxCacheSize = _options_maxCacheSize === void 0 ? 1000 : _options_maxCacheSize;
    var cache = new Map();
    var accessCounter = 0;
    // Create consistent cache keys regardless of parameter order
    var createCacheKey = function createCacheKey(a, b) {
        return a.localeCompare(b) < 0 ? "".concat(a, "|").concat(b) : "".concat(b, "|").concat(a);
    };
    // Efficiently manage cache size
    var trimCache = function trimCache() {
        if (cache.size < maxCacheSize) return;
        // Convert to array for sorting
        var entries = Array.from(cache.entries());
        entries.sort(function(a, b) {
            return a[1].lastAccessed - b[1].lastAccessed;
        });
        // Remove oldest 10% to avoid frequent trimming
        var removeCount = Math.max(1, Math.floor(maxCacheSize * 0.1));
        for(var i = 0; i < removeCount && i < entries.length; i++){
            cache.delete(entries[i][0]);
        }
    };
    return function(first, second) {
        if (first === second) return 100;
        if (!first || !second) return 0;
        var key = createCacheKey(first, second);
        // Check cache
        if (cache.has(key)) {
            var entry = cache.get(key);
            entry.lastAccessed = ++accessCounter;
            return entry.value;
        }
        // Calculate similarity
        var result = similarityPercent(first, second);
        // Manage cache
        if (cache.size >= maxCacheSize) {
            trimCache();
        }
        cache.set(key, {
            value: result,
            lastAccessed: ++accessCounter
        });
        return result;
    };
};
export var applyExcelRateLimit = function applyExcelRateLimit() {
    return rateLimit({
        windowMs: 5 * 60 * 1000,
        max: 5,
        message: 'Too many download requests, please try again after 5 minutes'
    });
};
export var hashPassword = function hashPassword(password) {
    return _async_to_generator(function() {
        var salt, hashedPassword, error;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    _state.trys.push([
                        0,
                        3,
                        ,
                        4
                    ]);
                    return [
                        4,
                        bcrypt.genSalt(SALT_ROUNDS)
                    ];
                case 1:
                    salt = _state.sent();
                    return [
                        4,
                        bcrypt.hash(password, salt)
                    ];
                case 2:
                    hashedPassword = _state.sent();
                    return [
                        2,
                        hashedPassword
                    ];
                case 3:
                    error = _state.sent();
                    throw new Error('Error hashing password');
                case 4:
                    return [
                        2
                    ];
            }
        });
    })();
};
export var comparePassword = function comparePassword(password, hash) {
    return _async_to_generator(function() {
        var match, error;
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
                        bcrypt.compare(password, hash)
                    ];
                case 1:
                    match = _state.sent();
                    return [
                        2,
                        match
                    ];
                case 2:
                    error = _state.sent();
                    throw new Error('Error comparing password');
                case 3:
                    return [
                        2
                    ];
            }
        });
    })();
};
export var capitalizeWords = function capitalizeWords(str) {
    return str.split(' ').map(function(word) {
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    }) // Capitalize each word
    .join(' ');
};
export var generateRandomId = function generateRandomId(prefix) {
    // Randomly select either 15 or 16 as the string length
    var length = Math.floor(Math.random() * 2) + 15 // Generates either 15 or 16
    ;
    // Generate random bytes and convert them to hexadecimal
    var uniqueString = crypto.randomBytes(length).toString('hex') // Convert to hexadecimal format
    .slice(0, length) // Ensure the length is exactly 15 or 16
    ;
    return prefix + '_' + uniqueString;
};
export var isWeekend = function isWeekend(date) {
    return _async_to_generator(function() {
        var day;
        return _ts_generator(this, function(_state) {
            day = date.getDay();
            return [
                2,
                day === 0 || day === 6 // Sunday (0) or Saturday (6)
            ];
        });
    })();
};
export var formatDateToYYYYMMDD = function formatDateToYYYYMMDD(date) {
    return date.toISOString().split('T')[0];
};
export var isHoliday = function isHoliday(date) {
    return _async_to_generator(function() {
        var db, formattedDate, result;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    db = getKnexInstance();
                    formattedDate = formatDateToYYYYMMDD(date);
                    return [
                        4,
                        db('repaydate_holiday').whereRaw('DATE(repaydate) = ?', [
                            formattedDate
                        ]).orderBy('id', 'desc').first()
                    ];
                case 1:
                    result = _state.sent();
                    return [
                        2,
                        !!result
                    ];
            }
        });
    })();
};
// Increase the date by one day
export var incrementDate = function incrementDate(date) {
    return _async_to_generator(function() {
        var newDate, _tmp, _tmp1;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    newDate = new Date(date);
                    newDate.setDate(newDate.getDate() + 1);
                    _state.label = 1;
                case 1:
                    return [
                        4,
                        isWeekend(newDate)
                    ];
                case 2:
                    _tmp = _state.sent();
                    if (_tmp) return [
                        3,
                        4
                    ];
                    return [
                        4,
                        isHoliday(newDate)
                    ];
                case 3:
                    _tmp = _state.sent();
                    _state.label = 4;
                case 4:
                    if (!_tmp) return [
                        3,
                        7
                    ];
                    newDate.setDate(newDate.getDate() + 1);
                    _tmp1 = !isWeekend(newDate);
                    if (!_tmp1) return [
                        3,
                        6
                    ];
                    return [
                        4,
                        isHoliday(newDate)
                    ];
                case 5:
                    _tmp1 = !_state.sent();
                    _state.label = 6;
                case 6:
                    if (_tmp1) return [
                        3,
                        7
                    ];
                    return [
                        3,
                        1
                    ];
                case 7:
                    return [
                        2,
                        newDate
                    ];
            }
        });
    })();
};
export var adjustIfEndOfMonth = function adjustIfEndOfMonth(date) {
    return _async_to_generator(function() {
        var day, _tmp;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    day = date.getDate();
                    if (day >= 29) {
                        date.setDate(1);
                        date.setMonth(date.getMonth() + 1);
                    }
                    _state.label = 1;
                case 1:
                    return [
                        4,
                        isWeekend(date)
                    ];
                case 2:
                    _tmp = _state.sent();
                    if (_tmp) return [
                        3,
                        4
                    ];
                    return [
                        4,
                        isHoliday(date)
                    ];
                case 3:
                    _tmp = _state.sent();
                    _state.label = 4;
                case 4:
                    if (!_tmp) return [
                        3,
                        6
                    ];
                    return [
                        4,
                        incrementDate(date)
                    ];
                case 5:
                    date = _state.sent();
                    return [
                        3,
                        1
                    ];
                case 6:
                    return [
                        2,
                        date
                    ];
            }
        });
    })();
};
export var decrementDate = function decrementDate(date) {
    return _async_to_generator(function() {
        var newDate, _tmp, _tmp1;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    newDate = new Date(date);
                    newDate.setDate(newDate.getDate() - 1);
                    _state.label = 1;
                case 1:
                    return [
                        4,
                        isWeekend(newDate)
                    ];
                case 2:
                    _tmp = _state.sent();
                    if (_tmp) return [
                        3,
                        4
                    ];
                    return [
                        4,
                        isHoliday(newDate)
                    ];
                case 3:
                    _tmp = _state.sent();
                    _state.label = 4;
                case 4:
                    if (!_tmp) return [
                        3,
                        7
                    ];
                    newDate.setDate(newDate.getDate() - 1);
                    _tmp1 = !isWeekend(newDate);
                    if (!_tmp1) return [
                        3,
                        6
                    ];
                    return [
                        4,
                        isHoliday(newDate)
                    ];
                case 5:
                    _tmp1 = !_state.sent();
                    _state.label = 6;
                case 6:
                    if (_tmp1) return [
                        3,
                        7
                    ];
                    return [
                        3,
                        1
                    ];
                case 7:
                    return [
                        2,
                        newDate
                    ];
            }
        });
    })();
};
export var dateCheck = function dateCheck(firstDueDate) {
    var dueDate = new Date(firstDueDate);
    var currentDate = new Date();
    // const differenceInMillis: number = dueDate.getTime() - currentDate.getTime()
    // const differenceInDays: number = Math.ceil(
    //   differenceInMillis / (1000 * 60 * 60 * 24),
    // )
    var differenceInDays = differenceInCalendarDays(dueDate, currentDate);
    return differenceInDays;
};
export var adjustIfEndOfMonthSubtract = function adjustIfEndOfMonthSubtract(date) {
    return _async_to_generator(function() {
        var day, _tmp;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    day = date.getDate();
                    if (day >= 29) {
                        while(date.getDate() > 28){
                            date.setDate(date.getDate() - 1);
                        }
                    }
                    _state.label = 1;
                case 1:
                    return [
                        4,
                        isWeekend(date)
                    ];
                case 2:
                    _tmp = _state.sent();
                    if (_tmp) return [
                        3,
                        4
                    ];
                    return [
                        4,
                        isHoliday(date)
                    ];
                case 3:
                    _tmp = _state.sent();
                    _state.label = 4;
                case 4:
                    if (!_tmp) return [
                        3,
                        6
                    ];
                    return [
                        4,
                        decrementDate(date)
                    ];
                case 5:
                    date = _state.sent();
                    return [
                        3,
                        1
                    ];
                case 6:
                    return [
                        2,
                        date
                    ];
            }
        });
    })();
};
export var calculateRepayDate = function calculateRepayDate(day) {
    return _async_to_generator(function() {
        var today, currentMonth, currentYear, repayDate, diff, _tmp, _tmp1, days, _tmp2, _tmp3;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    today = new Date();
                    currentMonth = today.getMonth();
                    currentYear = today.getFullYear();
                    repayDate = new Date(format(new Date(currentYear, currentMonth, day), 'yyyy-MM-dd'));
                    diff = differenceInCalendarDays(repayDate, today);
                    if (!(diff <= 0 || diff < 15)) return [
                        3,
                        8
                    ];
                    repayDate = new Date(format(new Date(currentYear, currentMonth + 1, day), 'yyyy-MM-dd'));
                    return [
                        4,
                        adjustIfEndOfMonth(repayDate)
                    ];
                case 1:
                    repayDate = _state.sent();
                    diff = differenceInCalendarDays(repayDate, today);
                    if (!(diff < 15)) return [
                        3,
                        3
                    ];
                    repayDate = new Date(format(new Date(currentYear, currentMonth + 2, day), 'yyyy-MM-dd'));
                    return [
                        4,
                        adjustIfEndOfMonth(repayDate)
                    ];
                case 2:
                    repayDate = _state.sent();
                    _state.label = 3;
                case 3:
                    return [
                        4,
                        isWeekend(repayDate)
                    ];
                case 4:
                    _tmp = _state.sent();
                    if (_tmp) return [
                        3,
                        6
                    ];
                    return [
                        4,
                        isHoliday(repayDate)
                    ];
                case 5:
                    _tmp = _state.sent();
                    _state.label = 6;
                case 6:
                    if (!_tmp) return [
                        3,
                        8
                    ];
                    return [
                        4,
                        incrementDate(repayDate)
                    ];
                case 7:
                    repayDate = _state.sent();
                    return [
                        3,
                        3
                    ];
                case 8:
                    return [
                        4,
                        isWeekend(repayDate)
                    ];
                case 9:
                    _tmp1 = _state.sent();
                    if (_tmp1) return [
                        3,
                        11
                    ];
                    return [
                        4,
                        isHoliday(repayDate)
                    ];
                case 10:
                    _tmp1 = _state.sent();
                    _state.label = 11;
                case 11:
                    if (!_tmp1) return [
                        3,
                        13
                    ];
                    return [
                        4,
                        decrementDate(repayDate)
                    ];
                case 12:
                    repayDate = _state.sent();
                    return [
                        3,
                        8
                    ];
                case 13:
                    return [
                        4,
                        adjustIfEndOfMonth(repayDate)
                    ];
                case 14:
                    repayDate = _state.sent();
                    days = dateCheck(repayDate);
                    if (!(days > 45)) return [
                        3,
                        25
                    ];
                    _state.label = 15;
                case 15:
                    if (!(days > 45)) return [
                        3,
                        24
                    ];
                    return [
                        4,
                        decrementDate(repayDate)
                    ];
                case 16:
                    repayDate = _state.sent();
                    _state.label = 17;
                case 17:
                    return [
                        4,
                        isWeekend(repayDate)
                    ];
                case 18:
                    _tmp2 = _state.sent();
                    if (_tmp2) return [
                        3,
                        20
                    ];
                    return [
                        4,
                        isHoliday(repayDate)
                    ];
                case 19:
                    _tmp2 = _state.sent();
                    _state.label = 20;
                case 20:
                    if (!_tmp2) return [
                        3,
                        22
                    ];
                    return [
                        4,
                        decrementDate(repayDate)
                    ];
                case 21:
                    repayDate = _state.sent();
                    return [
                        3,
                        17
                    ];
                case 22:
                    return [
                        4,
                        adjustIfEndOfMonthSubtract(repayDate)
                    ];
                case 23:
                    repayDate = _state.sent();
                    days = dateCheck(repayDate);
                    return [
                        3,
                        15
                    ];
                case 24:
                    return [
                        3,
                        35
                    ];
                case 25:
                    if (!(days < 15)) return [
                        3,
                        35
                    ];
                    _state.label = 26;
                case 26:
                    if (!(days < 15)) return [
                        3,
                        35
                    ];
                    return [
                        4,
                        incrementDate(repayDate)
                    ];
                case 27:
                    repayDate = _state.sent();
                    _state.label = 28;
                case 28:
                    return [
                        4,
                        isWeekend(repayDate)
                    ];
                case 29:
                    _tmp3 = _state.sent();
                    if (_tmp3) return [
                        3,
                        31
                    ];
                    return [
                        4,
                        isHoliday(repayDate)
                    ];
                case 30:
                    _tmp3 = _state.sent();
                    _state.label = 31;
                case 31:
                    if (!_tmp3) return [
                        3,
                        33
                    ];
                    return [
                        4,
                        incrementDate(repayDate)
                    ];
                case 32:
                    repayDate = _state.sent();
                    return [
                        3,
                        28
                    ];
                case 33:
                    return [
                        4,
                        adjustIfEndOfMonth(repayDate)
                    ];
                case 34:
                    repayDate = _state.sent();
                    days = dateCheck(repayDate);
                    return [
                        3,
                        26
                    ];
                case 35:
                    return [
                        2,
                        repayDate
                    ];
            }
        });
    })();
};
export function getEmiAPR(loanAmount, platFormFee, otherFee, tenure, roi) {
    // Convert comma-separated values to numeric
    var periods = parseFloat(tenure.replace(/,/g, ''));
    var loanAmt = parseFloat(loanAmount.replace(/,/g, ''));
    var charges = parseFloat(platFormFee.replace(/,/g, '')) + parseFloat(otherFee.replace(/,/g, ''));
    // Calculate present value
    var present = loanAmt - charges;
    // Initialize variables
    var guess = 0.01;
    var future = 0;
    var type = 0;
    var ROI = parseFloat(roi) / 100;
    var rateI = ROI / 12;
    var fv = 0;
    // Calculate payment amount
    var pvif = Math.pow(1 + rateI, periods);
    var pmt = rateI / (pvif - 1) * -(loanAmt * pvif + fv);
    var payment = pmt;
    // Set maximum epsilon for end of iteration
    var epsMax = 1e-10;
    // Set maximum number of iterations
    var iterMax = 10;
    // Implement Newton's method
    var y = 0;
    var y0 = 0;
    var y1 = 0;
    var x0 = 0;
    var x1 = 0;
    var f = 0;
    var i = 0;
    var rate = guess;
    if (Math.abs(rate) < epsMax) {
        y = present * (1 + periods * rate) + payment * (1 + rate * type) * periods + future;
    } else {
        f = Math.exp(periods * Math.log(1 + rate));
        y = present * f + payment * (1 / rate + type) * (f - 1) + future;
    }
    y0 = present + payment * periods + future;
    y1 = present * f + payment * (1 / rate + type) * (f - 1) + future;
    i = x0 = 0;
    x1 = rate;
    while(Math.abs(y0 - y1) > epsMax && i < iterMax){
        rate = (y1 * x0 - y0 * x1) / (y1 - y0);
        x0 = x1;
        x1 = rate;
        if (Math.abs(rate) < epsMax) {
            y = present * (1 + periods * rate) + payment * (1 + rate * type) * periods + future;
        } else {
            f = Math.exp(periods * Math.log(1 + rate));
            y = present * f + payment * (1 / rate + type) * (f - 1) + future;
        }
        y0 = y1;
        y1 = y;
        i++;
    }
    var rate1 = rate * 100;
    var ddk = rate1 * 12;
    var APR = ddk.toFixed(2);
    // Output the result
    return +APR;
}
export var isEmpty = function isEmpty(value) {
    if (value === null) {
        return true;
    } else if (typeof value !== 'number' && value === '') {
        return true;
    } else if (typeof value === 'undefined' || value === undefined) {
        return true;
    } else if (value !== null && (typeof value === "undefined" ? "undefined" : _type_of(value)) === 'object' && !Object.keys(value).length) {
        return true;
    } else {
        return false;
    }
};
/**
 * @method formatDate
 * @param {string} date
 * @returns yyyy-MM-dd formatted date
 */ export var formatDate = function formatDate(date) {
    // edge case
    if (!date) return null;
    if (date.length > 10) date = date.slice(0, 10);
    var arr = date.split('/');
    if (arr.length == 1) return arr[0];
    arr.reverse();
    var newDate = arr.join('-');
    return newDate;
};
/**
 * @method isGoodDate
 * @param {String } dt
 * @returns {Boolean} true & false
 * @description this dt is date format Check ie (DD-MM-YYYY)
 */ export var isGoodDate = function isGoodDate(dt) {
    var reGoodDate = /^(0?[1-9]|[12][0-9]|3[01])[- /.]((0?[1-9]|1[012])[- /.](19|20)?[0-9]{2})*$/;
    return reGoodDate.test(dt);
};
/**
 * @method formatDates
 * @param {String } dt
 * @returns {Date} true & false
 * @description dt will be formatted to (YYYY/MM/DD)
 */ export var formatDates = function formatDates(dt) {
    if (dt.includes('-')) {
        return new Date(dt.split('-').reverse().join('/'));
    }
    return new Date(dt.split('/').reverse().join('/'));
};
export var getDataFromFile = function getDataFromFile(fileParam) {
    var file = reader.read(fileParam.buffer, {
        type: 'buffer'
    });
    var data = [];
    var sheets = file.SheetNames;
    for(var i = 0; i < sheets.length; i++){
        var temp = reader.utils.sheet_to_json(file.Sheets[file.SheetNames[i]]);
        temp.forEach(function(res) {
            data.push(res);
        });
    }
    return data;
};
export var convertToNumbers = function convertToNumbers(objBody, paramsArr) {
    for(var key in objBody){
        if (paramsArr.includes(key)) objBody[key] = Number(objBody[key]);
    }
};
export var convertToArray = function convertToArray(objBody, paramsArr) {
    var _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
    try {
        for(var _iterator = paramsArr[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true){
            var param = _step.value;
            var val = objBody[param];
            if (val && !Array.isArray(val)) {
                try {
                    objBody[param] = JSON.parse(val);
                } catch (err) {
                    logger.error(err.stack);
                }
            }
        }
    } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
    } finally{
        try {
            if (!_iteratorNormalCompletion && _iterator.return != null) {
                _iterator.return();
            }
        } finally{
            if (_didIteratorError) {
                throw _iteratorError;
            }
        }
    }
};
export function truncateString(inputString) {
    var maxLength = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 35;
    if (inputString.length > maxLength) {
        var truncatedString = inputString.substring(0, maxLength);
        return truncatedString;
    } else {
        return inputString;
    }
}
export var convertRupeesToPaise = function convertRupeesToPaise(amount) {
    return amount * 100;
};
export var generateRandomNumber = function generateRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};
export var roundNumber = function roundNumber(num, precision) {
    if (precision) return parseFloat(num.toFixed(2));
    return Math.round(num);
};
export var calculateTotalPages = function calculateTotalPages(totalData, limitPerPage) {
    if (totalData === 0) return 0;
    return Math.ceil(totalData / limitPerPage);
};
export function injectBindings(sql, bindings) {
    var index = 0;
    return sql.replace(/\?/g, function() {
        var binding = bindings[index++];
        return typeof binding === 'string' ? "'".concat(binding, "'") : binding;
    });
}
export var createLoanNumber = function createLoanNumber() {
    return 'HC' + momentTz().format('YYYYMMDDHHmmss') + crypto.randomInt(1000, 10000);
};
export function findAndParseJson(inputString) {
    var start = -1;
    var openBraces = 0;
    for(var i = 0; i < inputString.length; i++){
        var char = inputString[i];
        if (char === '{') {
            if (openBraces === 0) start = i;
            openBraces++;
        } else if (char === '}') {
            openBraces--;
            if (openBraces === 0 && start !== -1) {
                var jsonString = inputString.slice(start, i + 1);
                try {
                    return JSON.parse(jsonString);
                } catch (error) {
                    return null;
                }
            }
        }
    }
    return null;
}
export function convertQueryStringToJson(queryString) {
    var jsonObject = {};
    queryString.split('&').forEach(function(pair) {
        var _pair_split = _sliced_to_array(pair.split('='), 2), key = _pair_split[0], value = _pair_split[1];
        jsonObject[key] = value ? decodeURIComponent(value) : '';
    });
    return jsonObject;
}
export function isJson(value) {
    try {
        return JSON.parse(value);
    } catch (error) {
        return false;
    }
}
export function processLogsApiRequest(logsData) {
    if (typeof logsData === 'string') {
        if (logsData.includes('=') && logsData.includes('&')) {
            return convertQueryStringToJson(logsData);
        }
    }
    var parsedJson = isJson(logsData);
    return parsedJson !== false ? parsedJson : findAndParseJson(logsData);
}
export function generateOTP() {
    var otp = Math.floor(Math.random() * (9999 - 1111 + 1)) + 1111;
    return otp;
}
export var roleAuthorizer = function roleAuthorizer(role, roles) {
    if (roles.includes(role)) {
        return true;
    }
    return false;
};
export var permissionAuthorizer = function permissionAuthorizer(permissions, userPermissions) {
    return permissions.every(function(item) {
        return userPermissions.has(item);
    });
};
export var generatePennyDropId = function generatePennyDropId() {
    // Randomly select either 15 or 16 as the string length
    var length = Math.floor(Math.random() * 2) + 15 // Generates either 15 or 16
    ;
    // Generate random bytes and convert them to hexadecimal
    var uniqueString = crypto.randomBytes(length).toString('hex') // Convert to hexadecimal format
    .slice(0, length) // Ensure the length is exactly 15 or 16
    ;
    return 'fav_' + uniqueString;
};
export var generateFinboxLinkId = function generateFinboxLinkId(customerID, env) {
    if (env === 'rf') return "rf-".concat(customerID);
    else return "km-".concat(customerID);
};
export function isObjectEmpty(value) {
    if (value == null || (typeof value === "undefined" ? "undefined" : _type_of(value)) !== 'object') {
        return false;
    }
    if (Array.isArray(value)) {
        return false;
    }
    return Object.keys(value).length === 0;
}
export var calculateBounceCharge = function calculateBounceCharge() {
    var fixedBounce = +config.dpdPenalty;
    var gst = Math.round(fixedBounce * (+config.gst / 100));
    var totalBounce = fixedBounce + gst;
    return totalBounce;
};
export var calculatePenalty = function calculatePenalty(emiAmount, overdueDays, roi) {
    var perDay = roi / 365 + +config.ipcDpdInterest;
    var result = emiAmount * perDay / 100 * overdueDays;
    var fixResult = round(result);
    return fixResult;
};
export var round = function round(num) {
    return Math.ceil(num);
};
export var stringifyError = function stringifyError(err) {
    return JSON.stringify(err, Object.getOwnPropertyNames(err));
};
export var generateWaiverId = function generateWaiverId() {
    var length = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : 14;
    var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    return Array.from(crypto.randomBytes(length)).map(function(byte) {
        return chars[byte % chars.length];
    }).join('');
};
export var roundAmountBanking = function roundAmountBanking(amount) {
    // Convert to integer
    amount = Math.floor(Number(amount));
    var roundedAmount;
    if (amount % 1000 !== 0) {
        roundedAmount = Math.ceil(amount / 1000) * 1000;
    } else {
        roundedAmount = amount;
    }
    // Cap at 30000
    if (roundedAmount > 30000) {
        roundedAmount = 30000;
    }
    return roundedAmount;
};

//# sourceMappingURL=util.js.map