function _array_like_to_array(arr, len) {
    if (len == null || len > arr.length) len = arr.length;
    for(var i = 0, arr2 = new Array(len); i < len; i++)arr2[i] = arr[i];
    return arr2;
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
function _iterable_to_array(iter) {
    if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter);
}
function _non_iterable_spread() {
    throw new TypeError("Invalid attempt to spread non-iterable instance.\\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
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
// redis/cacheService.ts
import { logger } from '../utils/logger';
import redis from './redisClient';
var defaultTTL = 60 * 60 * 24 * 7 // 7 days
;
export var buildKey = function buildKey(key) {
    var prefix = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : '';
    return "".concat(prefix).concat(prefix ? ':' : '').concat(key);
};
export var setCache = function setCache(key, value, options) {
    return _async_to_generator(function() {
        var ttl, fullKey, serialized;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    logger.info("Setting cache:, ".concat(key));
                    ttl = (options === null || options === void 0 ? void 0 : options.ttlSeconds) || defaultTTL;
                    return [
                        4,
                        buildKey(key, options === null || options === void 0 ? void 0 : options.keyPrefix)
                    ];
                case 1:
                    fullKey = _state.sent();
                    logger.info("Cache key: ".concat(fullKey));
                    serialized = JSON.stringify(value);
                    return [
                        4,
                        redis.set(fullKey, serialized, 'EX', ttl)
                    ];
                case 2:
                    _state.sent();
                    return [
                        2
                    ];
            }
        });
    })();
};
export var getCache = function getCache(key, options) {
    return _async_to_generator(function() {
        var fullKey, result;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    logger.info("Getting cache:, ".concat(key));
                    fullKey = buildKey(key, options === null || options === void 0 ? void 0 : options.keyPrefix);
                    logger.info("Full cache key:, ".concat(fullKey));
                    return [
                        4,
                        redis.get(fullKey)
                    ];
                case 1:
                    result = _state.sent();
                    logger.info("Cache result: ".concat(result));
                    return [
                        2,
                        result ? JSON.parse(result) : null
                    ];
            }
        });
    })();
};
export var deleteCache = function deleteCache(key) {
    var prefix = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : '';
    return _async_to_generator(function() {
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    return [
                        4,
                        redis.del(buildKey(key, prefix))
                    ];
                case 1:
                    _state.sent();
                    return [
                        2
                    ];
            }
        });
    })();
};
/**
 * Delete cache keys by pattern (supports wildcards)
 * This is specifically for pattern-based deletion without affecting the original deleteCache function
 */ export var deleteCacheByPattern = function deleteCacheByPattern(keyPattern) {
    return _async_to_generator(function() {
        var matchingKeys, _redis, result, error;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    _state.trys.push([
                        0,
                        8,
                        ,
                        9
                    ]);
                    if (!keyPattern.includes('*')) return [
                        3,
                        5
                    ];
                    return [
                        4,
                        redis.keys(keyPattern)
                    ];
                case 1:
                    matchingKeys = _state.sent();
                    if (!(matchingKeys.length > 0)) return [
                        3,
                        3
                    ];
                    return [
                        4,
                        (_redis = redis).del.apply(_redis, _to_consumable_array(matchingKeys))
                    ];
                case 2:
                    _state.sent();
                    logger.info("Deleted ".concat(matchingKeys.length, " cache keys matching pattern: ").concat(keyPattern));
                    return [
                        3,
                        4
                    ];
                case 3:
                    logger.info("No cache keys found matching pattern: ".concat(keyPattern));
                    _state.label = 4;
                case 4:
                    return [
                        3,
                        7
                    ];
                case 5:
                    return [
                        4,
                        redis.del(keyPattern)
                    ];
                case 6:
                    result = _state.sent();
                    logger.info("Deleted cache key: ".concat(keyPattern, " (").concat(result, " keys removed)"));
                    _state.label = 7;
                case 7:
                    return [
                        3,
                        9
                    ];
                case 8:
                    error = _state.sent();
                    logger.error("Error deleting cache pattern ".concat(keyPattern, ":"), error);
                    throw error;
                case 9:
                    return [
                        2
                    ];
            }
        });
    })();
};
/**
 * Delete multiple cache keys by patterns
 */ export var deleteCachePatterns = function deleteCachePatterns(patterns) {
    return _async_to_generator(function() {
        var _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, pattern, err, error;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    _state.trys.push([
                        0,
                        9,
                        ,
                        10
                    ]);
                    _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
                    _state.label = 1;
                case 1:
                    _state.trys.push([
                        1,
                        6,
                        7,
                        8
                    ]);
                    _iterator = patterns[Symbol.iterator]();
                    _state.label = 2;
                case 2:
                    if (!!(_iteratorNormalCompletion = (_step = _iterator.next()).done)) return [
                        3,
                        5
                    ];
                    pattern = _step.value;
                    return [
                        4,
                        deleteCacheByPattern(pattern)
                    ];
                case 3:
                    _state.sent();
                    _state.label = 4;
                case 4:
                    _iteratorNormalCompletion = true;
                    return [
                        3,
                        2
                    ];
                case 5:
                    return [
                        3,
                        8
                    ];
                case 6:
                    err = _state.sent();
                    _didIteratorError = true;
                    _iteratorError = err;
                    return [
                        3,
                        8
                    ];
                case 7:
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
                case 8:
                    logger.info("Deleted cache patterns: ".concat(patterns.join(', ')));
                    return [
                        3,
                        10
                    ];
                case 9:
                    error = _state.sent();
                    logger.error('Error deleting cache patterns:', error);
                    throw error;
                case 10:
                    return [
                        2
                    ];
            }
        });
    })();
};
/**
 * Get from cache or set it if not found
 */ export var getOrSetCache = function getOrSetCache(key, fetchFn, options) {
    return _async_to_generator(function() {
        var cached, freshData;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    logger.info("Fetching from cache: ".concat(key));
                    return [
                        4,
                        getCache(key, options)
                    ];
                case 1:
                    cached = _state.sent();
                    if (cached) return [
                        2,
                        cached
                    ];
                    logger.info("Cache miss, fetching fresh data:, ".concat(key));
                    return [
                        4,
                        fetchFn()
                    ];
                case 2:
                    freshData = _state.sent();
                    if (!freshData) {
                        logger.error("Failed to fetch fresh data for key: ".concat(key));
                        return [
                            2,
                            null
                        ];
                    }
                    return [
                        4,
                        setCache(key, freshData, options)
                    ];
                case 3:
                    _state.sent();
                    return [
                        2,
                        freshData
                    ];
            }
        });
    })();
};

//# sourceMappingURL=cacheService.js.map