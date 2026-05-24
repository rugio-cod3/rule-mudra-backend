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
import { logger } from '../../utils/logger';
import { getKnexInstance } from '../../utils/mysql';
var EmployerModel = /*#__PURE__*/ function() {
    "use strict";
    function EmployerModel() {
        _class_call_check(this, EmployerModel);
        _define_property(this, "table", 'employer');
    }
    _create_class(EmployerModel, [
        {
            key: "getEmployer",
            value: function getEmployer(where, order, select) {
                return _async_to_generator(function() {
                    var _db_where, db, employer, error;
                    return _ts_generator(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                _state.trys.push([
                                    0,
                                    2,
                                    ,
                                    3
                                ]);
                                db = getKnexInstance();
                                return [
                                    4,
                                    (_db_where = db(this.table).where(where)).select.apply(_db_where, _to_consumable_array(select)).orderBy(order.orderKey, order.orderValue)
                                ];
                            case 1:
                                employer = _state.sent();
                                if (employer == null || employer.length == 0) {
                                    return [
                                        2,
                                        []
                                    ];
                                } else {
                                    return [
                                        2,
                                        employer // Return the first lead if found
                                    ];
                                }
                                return [
                                    3,
                                    3
                                ];
                            case 2:
                                error = _state.sent();
                                logger.error('Error Inside employer.ts getEmployer function', error);
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
            key: "countEmployer",
            value: function countEmployer(where) {
                return _async_to_generator(function() {
                    var db, employer, count, error;
                    return _ts_generator(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                _state.trys.push([
                                    0,
                                    2,
                                    ,
                                    3
                                ]);
                                db = getKnexInstance();
                                return [
                                    4,
                                    db(this.table).where(where).count()
                                ];
                            case 1:
                                employer = _state.sent();
                                count = employer[0]['count(*)'];
                                if (count == null) {
                                    return [
                                        2,
                                        0
                                    ];
                                } else {
                                    return [
                                        2,
                                        +count // Return the first lead if found
                                    ];
                                }
                                return [
                                    3,
                                    3
                                ];
                            case 2:
                                error = _state.sent();
                                logger.error('Error Inside employer.ts countEmployer function', error);
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
            key: "insert",
            value: function insert(data) {
                return _async_to_generator(function() {
                    var db;
                    return _ts_generator(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                db = getKnexInstance();
                                return [
                                    4,
                                    db(this.table).insert(data)
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
            key: "findOneAndUpdate",
            value: function findOneAndUpdate(where, update, order) {
                return _async_to_generator(function() {
                    var db, query, response, error;
                    return _ts_generator(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                _state.trys.push([
                                    0,
                                    2,
                                    ,
                                    3
                                ]);
                                db = getKnexInstance();
                                // let response = await db(this.table).where(where).update(update)
                                // return response
                                query = db(this.table).where(where);
                                if (order) {
                                    query.orderBy(order.orderKey, order.orderValue);
                                }
                                return [
                                    4,
                                    query.update(update)
                                ];
                            case 1:
                                response = _state.sent();
                                return [
                                    2,
                                    response
                                ];
                            case 2:
                                error = _state.sent();
                                logger.error('Error Inside employer.ts findOneAndUpdate function', error);
                                return [
                                    2,
                                    0
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
            key: "findOneEmployer",
            value: function findOneEmployer(_0, _1) {
                return _async_to_generator(function(where) {
                    var select, order, _db_table_where, db, query;
                    var _arguments = arguments;
                    return _ts_generator(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                select = _arguments.length > 1 && _arguments[1] !== void 0 ? _arguments[1] : [
                                    '*'
                                ], order = _arguments.length > 2 ? _arguments[2] : void 0;
                                db = getKnexInstance();
                                query = (_db_table_where = db.table(this.table).where(where)).select.apply(_db_table_where, _to_consumable_array(select));
                                if (order) {
                                    query.orderBy(order);
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
                }).apply(this, arguments);
            }
        },
        {
            key: "find",
            value: function find(params) {
                return _async_to_generator(function() {
                    var _query, order, _params_select, select, where, whereIn, whereNot, whereNotNull, whereRaw, paginate, db, query;
                    return _ts_generator(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                order = params.order, _params_select = params.select, select = _params_select === void 0 ? [
                                    '*'
                                ] : _params_select, where = params.where, whereIn = params.whereIn, whereNot = params.whereNot, whereNotNull = params.whereNotNull, whereRaw = params.whereRaw, paginate = params.paginate;
                                db = getKnexInstance();
                                query = db(this.table);
                                if (where) {
                                    if (Array.isArray(where)) {
                                        where.forEach(function(element) {
                                            var column = element.column, operator = element.operator, value = element.value;
                                            if (operator) query.where(column, operator, value);
                                            else query.where(column, value);
                                        });
                                    } else {
                                        query.where(where);
                                    }
                                }
                                (_query = query).select.apply(_query, _to_consumable_array(select));
                                if (whereIn) {
                                    whereIn.forEach(function(condition) {
                                        var column = condition.column, value = condition.value;
                                        query.whereIn(column, value);
                                    });
                                }
                                if (whereRaw) {
                                    whereRaw.forEach(function(condition) {
                                        var rawQuery = condition.rawQuery, values = condition.values;
                                        query.whereRaw(rawQuery, values);
                                    });
                                }
                                if (whereNot) {
                                    query.whereNot(whereNot);
                                }
                                if (whereNotNull) {
                                    whereNotNull.forEach(function(column) {
                                        return query.whereNotNull(column);
                                    });
                                }
                                if (order) query.orderBy(order);
                                if (paginate) {
                                    query.limit(paginate.perPage).offset(paginate.page);
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
                    var where, whereNot, db, count, data;
                    return _ts_generator(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                where = params.where, whereNot = params.whereNot;
                                db = getKnexInstance();
                                count = db(this.table);
                                if (where) count.where(where);
                                if (whereNot) count.whereNot(whereNot);
                                return [
                                    4,
                                    count.count()
                                ];
                            case 1:
                                data = _state.sent();
                                return [
                                    2,
                                    data[0]['count(*)']
                                ];
                        }
                    });
                }).call(this);
            }
        }
    ]);
    return EmployerModel;
}();
export { EmployerModel as default };
export var employerModel = new EmployerModel();

//# sourceMappingURL=employer.js.map