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
import { logger } from '@/utils/logger';
import { deleteCacheByPattern, getCache, setCache } from '../redis/cacheService';
// Cache tags for invalidation patterns
export var CACHE_TAGS = {
    STAGES: 'chatbot:stages',
    CONTENT: 'chatbot:content',
    QUERIES: 'chatbot:queries',
    QUERY_DETAILS: 'chatbot:query_details',
    ALL: 'chatbot:all'
};
// Cache TTL configurations (in seconds)
export var CACHE_TTL = {
    STAGES: 60 * 15,
    CONTENT: 60 * 10,
    QUERIES: 60 * 5,
    QUERY_DETAILS: 60 * 2
};
// Cache key generation helper
var generateCacheKey = function generateCacheKey(req) {
    var method = req.method, originalUrl = req.originalUrl, query = req.query, params = req.params;
    var customer = req.customer;
    // Include customer ID in cache key if present for user-specific caching
    var customerPart = (customer === null || customer === void 0 ? void 0 : customer.id) ? "_customer_".concat(customer.id) : '';
    // Create a consistent key from URL, query params, and route params
    var queryString = Object.keys(query).length > 0 ? JSON.stringify(query) : '';
    var paramsString = Object.keys(params).length > 0 ? JSON.stringify(params) : '';
    // Build key without using buildKey to avoid double prefixes
    return "".concat(method, "_").concat(originalUrl, "_").concat(queryString, "_").concat(paramsString).concat(customerPart);
};
var _obj;
/**
 * Cache resource map with dependency relationships
 * This defines which cache types depend on each other for proper invalidation
 */ export var CACHE_RESOURCE_MAP = (_obj = {}, _define_property(_obj, CACHE_TAGS.STAGES, {
    prefix: 'chatbot_stages',
    pattern: 'chatbot_stages:*',
    dependencies: [
        CACHE_TAGS.CONTENT
    ]
}), _define_property(_obj, CACHE_TAGS.CONTENT, {
    prefix: 'chatbot_content',
    pattern: 'chatbot_content:*',
    dependencies: []
}), _define_property(_obj, CACHE_TAGS.QUERIES, {
    prefix: 'chatbot_queries',
    pattern: 'chatbot_queries:*',
    dependencies: []
}), _define_property(_obj, CACHE_TAGS.QUERY_DETAILS, {
    prefix: 'chatbot_query_details',
    pattern: 'chatbot_query_details:*',
    dependencies: []
}), _obj);
/**
 * Redis cache middleware for chatbot CRM endpoints
 */ export var chatbotCacheMiddleware = function chatbotCacheMiddleware() {
    var options = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
    return function(req, res, next) {
        return _async_to_generator(function() {
            var method, _options_keyPrefix, keyPrefix, _options_ttlSeconds, ttlSeconds, cacheKey, cachedData, originalJson, error;
            return _ts_generator(this, function(_state) {
                switch(_state.label){
                    case 0:
                        method = req.method;
                        _options_keyPrefix = options.keyPrefix, keyPrefix = _options_keyPrefix === void 0 ? 'chatbot_crm' : _options_keyPrefix, _options_ttlSeconds = options.ttlSeconds, ttlSeconds = _options_ttlSeconds === void 0 ? 300 : _options_ttlSeconds;
                        _state.label = 1;
                    case 1:
                        _state.trys.push([
                            1,
                            3,
                            ,
                            4
                        ]);
                        // Only cache GET requests
                        if (method !== 'GET') {
                            return [
                                2,
                                next()
                            ];
                        }
                        // Generate cache key without prefix (prefix will be added by getCache)
                        cacheKey = generateCacheKey(req);
                        req.cacheKey = cacheKey;
                        logger.info("[Cache] Checking cache for key: ".concat(keyPrefix, ":").concat(cacheKey));
                        return [
                            4,
                            getCache(cacheKey, {
                                keyPrefix: keyPrefix,
                                ttlSeconds: ttlSeconds
                            })
                        ];
                    case 2:
                        cachedData = _state.sent();
                        if (cachedData) {
                            logger.info("[Cache] Cache HIT for key: ".concat(cacheKey));
                            return [
                                2,
                                res.json(cachedData)
                            ];
                        }
                        logger.info("[Cache] Cache MISS for key: ".concat(cacheKey));
                        // Store original res.json method
                        originalJson = res.json.bind(res);
                        // Override res.json to cache the response
                        res.json = function(data) {
                            // Only cache successful responses (2xx status codes)
                            if (res.statusCode >= 200 && res.statusCode < 300) {
                                setCache(cacheKey, data, {
                                    keyPrefix: keyPrefix,
                                    ttlSeconds: ttlSeconds
                                }).then(function() {
                                    logger.info("[Cache] Cached response for key: ".concat(cacheKey));
                                }).catch(function(error) {
                                    logger.error("[Cache] Failed to cache response for key: ".concat(cacheKey), error);
                                });
                            }
                            return originalJson(data);
                        };
                        next();
                        return [
                            3,
                            4
                        ];
                    case 3:
                        error = _state.sent();
                        logger.error('[Cache] Cache middleware error:', error);
                        // Continue without caching if there's an error
                        next();
                        return [
                            3,
                            4
                        ];
                    case 4:
                        return [
                            2
                        ];
                }
            });
        })();
    };
};
/**
 * Cache invalidation middleware for mutating operations
 */ export var chatbotCacheInvalidation = function chatbotCacheInvalidation() {
    var tags = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : [];
    return function(req, res, next) {
        return _async_to_generator(function() {
            var method, originalJson;
            return _ts_generator(this, function(_state) {
                method = req.method;
                try {
                    // Store original res.json method
                    originalJson = res.json.bind(res);
                    // Override res.json to invalidate cache after successful mutations
                    res.json = function(data) {
                        // Only invalidate cache for successful mutations (2xx status codes)
                        if (res.statusCode >= 200 && res.statusCode < 300 && [
                            'POST',
                            'PUT',
                            'PATCH',
                            'DELETE'
                        ].includes(method)) {
                            invalidateRelatedCaches(req, tags).then(function() {
                                logger.info("[Cache] Invalidated caches for tags: ".concat(tags.join(', ')));
                            }).catch(function(error) {
                                logger.error('[Cache] Failed to invalidate caches:', error);
                            });
                        }
                        return originalJson(data);
                    };
                    next();
                } catch (error) {
                    logger.error('[Cache] Cache invalidation middleware error:', error);
                    next();
                }
                return [
                    2
                ];
            });
        })();
    };
};
/**
 * Invalidate related caches based on operation and tags
 */ function invalidateRelatedCaches(_0) {
    return _async_to_generator(function(req) {
        var tags, originalUrl, resourcesNeedingInvalidation, invalidationPatterns, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, pattern, err, error;
        var _arguments = arguments;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    tags = _arguments.length > 1 && _arguments[1] !== void 0 ? _arguments[1] : [];
                    originalUrl = req.originalUrl;
                    _state.label = 1;
                case 1:
                    _state.trys.push([
                        1,
                        10,
                        ,
                        11
                    ]);
                    // Track which resources need to be invalidated (including dependencies)
                    resourcesNeedingInvalidation = new Set();
                    // First, determine resources to invalidate based on URL
                    if (originalUrl.includes('/stages')) {
                        resourcesNeedingInvalidation.add(CACHE_TAGS.STAGES);
                    }
                    if (originalUrl.includes('/content')) {
                        resourcesNeedingInvalidation.add(CACHE_TAGS.CONTENT);
                    }
                    if (originalUrl.includes('/queries')) {
                        // Determine if it's a specific query detail or general queries endpoint
                        if (originalUrl.includes('/queries') && originalUrl.includes('/:id')) {
                            resourcesNeedingInvalidation.add(CACHE_TAGS.QUERY_DETAILS);
                            resourcesNeedingInvalidation.add(CACHE_TAGS.QUERIES); // Update to query also affects query listing
                        } else {
                            resourcesNeedingInvalidation.add(CACHE_TAGS.QUERIES);
                        }
                    }
                    // Add tags specified in the middleware configuration
                    tags.forEach(function(tag) {
                        if (tag === CACHE_TAGS.ALL) {
                            // Special case for ALL tag - add all resource types
                            Object.keys(CACHE_RESOURCE_MAP).forEach(function(resourceTag) {
                                resourcesNeedingInvalidation.add(resourceTag);
                            });
                        } else {
                            resourcesNeedingInvalidation.add(tag);
                        }
                    });
                    // Generate patterns to invalidate (including dependencies)
                    invalidationPatterns = new Set();
                    // Process each resource and its dependencies
                    resourcesNeedingInvalidation.forEach(function(resourceTag) {
                        var resource = CACHE_RESOURCE_MAP[resourceTag];
                        if (resource) {
                            // Add the resource's own pattern
                            invalidationPatterns.add(resource.pattern);
                            // Add patterns for any dependencies
                            resource.dependencies.forEach(function(dependencyTag) {
                                var dependency = CACHE_RESOURCE_MAP[dependencyTag];
                                if (dependency) {
                                    invalidationPatterns.add(dependency.pattern);
                                }
                            });
                        }
                    });
                    _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
                    _state.label = 2;
                case 2:
                    _state.trys.push([
                        2,
                        7,
                        8,
                        9
                    ]);
                    _iterator = invalidationPatterns[Symbol.iterator]();
                    _state.label = 3;
                case 3:
                    if (!!(_iteratorNormalCompletion = (_step = _iterator.next()).done)) return [
                        3,
                        6
                    ];
                    pattern = _step.value;
                    return [
                        4,
                        deleteCacheByPattern(pattern)
                    ];
                case 4:
                    _state.sent();
                    logger.info("[Cache] Invalidated cache pattern: ".concat(pattern));
                    _state.label = 5;
                case 5:
                    _iteratorNormalCompletion = true;
                    return [
                        3,
                        3
                    ];
                case 6:
                    return [
                        3,
                        9
                    ];
                case 7:
                    err = _state.sent();
                    _didIteratorError = true;
                    _iteratorError = err;
                    return [
                        3,
                        9
                    ];
                case 8:
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
                case 9:
                    return [
                        3,
                        11
                    ];
                case 10:
                    error = _state.sent();
                    logger.error('[Cache] Error invalidating caches:', error);
                    throw error;
                case 11:
                    return [
                        2
                    ];
            }
        });
    }).apply(this, arguments);
}
/**
 * Manual cache invalidation utility
 */ export var invalidateChatbotCache = function invalidateChatbotCache() {
    var patterns = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : [], tags = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : [];
    return _async_to_generator(function() {
        var patternsToInvalidate, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, pattern, err, error;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    _state.trys.push([
                        0,
                        9,
                        ,
                        10
                    ]);
                    patternsToInvalidate = [];
                    // If specific patterns are provided, use those
                    if (patterns.length > 0) {
                        patternsToInvalidate = patterns;
                    } else if (tags.length > 0) {
                        tags.forEach(function(tag) {
                            var resource = CACHE_RESOURCE_MAP[tag];
                            if (resource) {
                                patternsToInvalidate.push(resource.pattern);
                                // Add dependencies
                                resource.dependencies.forEach(function(dependencyTag) {
                                    var dependency = CACHE_RESOURCE_MAP[dependencyTag];
                                    if (dependency) {
                                        patternsToInvalidate.push(dependency.pattern);
                                    }
                                });
                            }
                        });
                    } else {
                        Object.values(CACHE_RESOURCE_MAP).forEach(function(resource) {
                            patternsToInvalidate.push(resource.pattern);
                        });
                    }
                    // Remove duplicates
                    patternsToInvalidate = _to_consumable_array(new Set(patternsToInvalidate));
                    _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
                    _state.label = 1;
                case 1:
                    _state.trys.push([
                        1,
                        6,
                        7,
                        8
                    ]);
                    _iterator = patternsToInvalidate[Symbol.iterator]();
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
                    logger.info("[Cache] Manually invalidated cache pattern: ".concat(pattern));
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
                    return [
                        2,
                        {
                            success: true,
                            invalidatedPatterns: patternsToInvalidate,
                            invalidatedResources: tags.length > 0 ? tags : Object.keys(CACHE_RESOURCE_MAP)
                        }
                    ];
                case 9:
                    error = _state.sent();
                    logger.error('[Cache] Error in manual cache invalidation:', error);
                    throw error;
                case 10:
                    return [
                        2
                    ];
            }
        });
    })();
};

//# sourceMappingURL=chatbotCache.middleware.js.map