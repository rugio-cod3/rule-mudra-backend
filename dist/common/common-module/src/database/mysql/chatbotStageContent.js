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
import { getKnexInstance } from '@/utils/mysql';
var ChatbotStageContentModel = /*#__PURE__*/ function() {
    "use strict";
    function ChatbotStageContentModel() {
        _class_call_check(this, ChatbotStageContentModel);
        _define_property(this, "table", 'chatbot_stage_content');
    }
    _create_class(ChatbotStageContentModel, [
        {
            key: "ChatbotStageContentKnex",
            get: function get() {
                var db = getKnexInstance();
                return db(this.table);
            }
        },
        {
            key: "find",
            value: function find(params) {
                return _async_to_generator(function() {
                    var _query, where, _params_select, select, order, paginate, db, query;
                    return _ts_generator(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                where = params.where, _params_select = params.select, select = _params_select === void 0 ? [
                                    '*'
                                ] : _params_select, order = params.order, paginate = params.paginate;
                                db = getKnexInstance();
                                query = db.table(this.table);
                                if (where) {
                                    if (Array.isArray(where)) {
                                        where.forEach(function(condition) {
                                            query = query.where(condition.column, condition.value);
                                        });
                                    } else {
                                        query = query.where(where);
                                    }
                                }
                                query = (_query = query).select.apply(_query, _to_consumable_array(select));
                                if (order) {
                                    order.forEach(function(o) {
                                        if (typeof o === 'string') {
                                            query = query.orderBy(o);
                                        } else {
                                            query = query.orderBy(o.column, o.order);
                                        }
                                    });
                                }
                                if (paginate) {
                                    query = query.offset(paginate.page).limit(paginate.perPage);
                                }
                                return [
                                    4,
                                    query
                                ];
                            case 1:
                                return [
                                    2,
                                    _state.sent()
                                ];
                        }
                    });
                }).call(this);
            }
        },
        {
            key: "findOne",
            value: function findOne(params) {
                return _async_to_generator(function() {
                    var _query, where, _params_select, select, order, db, query;
                    return _ts_generator(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                where = params.where, _params_select = params.select, select = _params_select === void 0 ? [
                                    '*'
                                ] : _params_select, order = params.order;
                                db = getKnexInstance();
                                query = db.table(this.table);
                                if (where) {
                                    if (Array.isArray(where)) {
                                        where.forEach(function(condition) {
                                            query = query.where(condition.column, condition.value);
                                        });
                                    } else {
                                        query = query.where(where);
                                    }
                                }
                                query = (_query = query).select.apply(_query, _to_consumable_array(select));
                                if (order) {
                                    order.forEach(function(o) {
                                        if (typeof o === 'string') {
                                            query = query.orderBy(o);
                                        } else {
                                            query = query.orderBy(o.column, o.order);
                                        }
                                    });
                                }
                                return [
                                    4,
                                    query.first()
                                ];
                            case 1:
                                return [
                                    2,
                                    _state.sent()
                                ];
                        }
                    });
                }).call(this);
            }
        },
        {
            key: "findWithStage",
            value: function findWithStage(params) {
                return _async_to_generator(function() {
                    var _this, where, _params_select, select, order, paginate, db, query, _query;
                    return _ts_generator(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                _this = this;
                                where = params.where, _params_select = params.select, select = _params_select === void 0 ? [
                                    '*'
                                ] : _params_select, order = params.order, paginate = params.paginate;
                                db = getKnexInstance();
                                query = db.table(this.table).leftJoin('chatbot_stages', 'chatbot_stage_content.stage_id', 'chatbot_stages.id');
                                if (where) {
                                    if (Array.isArray(where)) {
                                        where.forEach(function(condition) {
                                            query = query.where("".concat(_this.table, ".").concat(condition.column), condition.value);
                                        });
                                    } else {
                                        Object.keys(where).forEach(function(key) {
                                            query = query.where("".concat(_this.table, ".").concat(key), where[key]);
                                        });
                                    }
                                }
                                // Default select includes table prefixes
                                if (select.includes('*')) {
                                    query = query.select("".concat(this.table, ".*"), 'chatbot_stages.stage_name');
                                } else {
                                    ;
                                    query = (_query = query).select.apply(_query, _to_consumable_array(select));
                                }
                                if (order) {
                                    order.forEach(function(o) {
                                        query = query.orderBy(o.column, o.order || 'asc');
                                    });
                                }
                                if (paginate) {
                                    query = query.offset(paginate.page).limit(paginate.perPage);
                                }
                                return [
                                    4,
                                    query
                                ];
                            case 1:
                                return [
                                    2,
                                    _state.sent()
                                ];
                        }
                    });
                }).call(this);
            }
        },
        {
            key: "count",
            value: function count(params) {
                return _async_to_generator(function() {
                    var db, query, result;
                    return _ts_generator(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                db = getKnexInstance();
                                query = db.table(this.table);
                                if (params === null || params === void 0 ? void 0 : params.where) {
                                    if (Array.isArray(params.where)) {
                                        params.where.forEach(function(condition) {
                                            query = query.where(condition.column, condition.value);
                                        });
                                    } else {
                                        query = query.where(params.where);
                                    }
                                }
                                return [
                                    4,
                                    query.count('* as count').first()
                                ];
                            case 1:
                                result = _state.sent();
                                return [
                                    2,
                                    Number((result === null || result === void 0 ? void 0 : result.count) || 0)
                                ];
                        }
                    });
                }).call(this);
            }
        },
        {
            key: "create",
            value: function create(data) {
                return _async_to_generator(function() {
                    var db;
                    return _ts_generator(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                db = getKnexInstance();
                                return [
                                    4,
                                    db.table(this.table).insert(data)
                                ];
                            case 1:
                                return [
                                    2,
                                    _state.sent()
                                ];
                        }
                    });
                }).call(this);
            }
        },
        {
            key: "update",
            value: function update(where, data) {
                return _async_to_generator(function() {
                    var db, query;
                    return _ts_generator(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                db = getKnexInstance();
                                query = db.table(this.table);
                                if (Array.isArray(where)) {
                                    where.forEach(function(condition) {
                                        query = query.where(condition.column, condition.value);
                                    });
                                } else {
                                    query = query.where(where);
                                }
                                return [
                                    4,
                                    query.update(_object_spread_props(_object_spread({}, data), {
                                        updated_at: new Date()
                                    }))
                                ];
                            case 1:
                                return [
                                    2,
                                    _state.sent()
                                ];
                        }
                    });
                }).call(this);
            }
        },
        {
            key: "delete",
            value: function _delete(where) {
                return _async_to_generator(function() {
                    var db, query;
                    return _ts_generator(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                db = getKnexInstance();
                                query = db.table(this.table);
                                if (Array.isArray(where)) {
                                    where.forEach(function(condition) {
                                        query = query.where(condition.column, condition.value);
                                    });
                                } else {
                                    query = query.where(where);
                                }
                                return [
                                    4,
                                    query.del()
                                ];
                            case 1:
                                return [
                                    2,
                                    _state.sent()
                                ];
                        }
                    });
                }).call(this);
            }
        },
        {
            key: "softDelete",
            value: function softDelete(where) {
                return _async_to_generator(function() {
                    return _ts_generator(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                return [
                                    4,
                                    this.update(where, {
                                        is_active: false
                                    })
                                ];
                            case 1:
                                return [
                                    2,
                                    _state.sent()
                                ];
                        }
                    });
                }).call(this);
            }
        }
    ]);
    return ChatbotStageContentModel;
}();
export { ChatbotStageContentModel as default };
export var chatbotStageContentModel = new ChatbotStageContentModel();

//# sourceMappingURL=chatbotStageContent.js.map