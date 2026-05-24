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
import { logger } from '../../utils/logger';
import { getKnexInstance } from '../../utils/mysql';
var EmiModel = /*#__PURE__*/ function() {
    "use strict";
    function EmiModel() {
        _class_call_check(this, EmiModel);
        _define_property(this, "table", 'equated_monthly_installments');
    }
    _create_class(EmiModel, [
        {
            key: "findOneEmi",
            value: //where :{customerID}
            //order:{orderKey:"emiID",orderValue:"desc/asc"}
            //select: ["emiID","dueDate"]
            // New code
            function findOneEmi(_0) {
                return _async_to_generator(function(where) {
                    var select, _db_table_where, db;
                    var _arguments = arguments;
                    return _ts_generator(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                select = _arguments.length > 1 && _arguments[1] !== void 0 ? _arguments[1] : [
                                    '*'
                                ];
                                db = getKnexInstance();
                                return [
                                    4,
                                    (_db_table_where = db.table(this.table).where(where)).select.apply(_db_table_where, _to_consumable_array(select)).first()
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
            key: "findAll",
            value: function findAll(where, order, select) {
                return _async_to_generator(function() {
                    var _db_table_where, db;
                    return _ts_generator(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                db = getKnexInstance();
                                return [
                                    4,
                                    (_db_table_where = db.table(this.table).where(where)).select.apply(_db_table_where, _to_consumable_array(select)).orderBy(order)
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
            key: "insertEMI",
            value: function insertEMI(creditID, customerID, leadID, productID, principal, interest, openingBalance, closingBalance, dueDate) {
                return _async_to_generator(function() {
                    var db, error;
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
                                    db(this.table).insert({
                                        creditID: creditID,
                                        customerID: customerID,
                                        leadID: leadID,
                                        productID: productID,
                                        principal: principal,
                                        interest: interest,
                                        amountPayable: principal + interest,
                                        openingBalance: openingBalance,
                                        closingBalance: closingBalance,
                                        dueDate: dueDate,
                                        amountRemains: principal + interest,
                                        status: 'due',
                                        createdAt: new Date(Date.now()),
                                        updatedAt: new Date(Date.now())
                                    })
                                ];
                            case 1:
                                _state.sent();
                                return [
                                    3,
                                    3
                                ];
                            case 2:
                                error = _state.sent();
                                logger.error('Error Inside lead.ts updateLeadRow function', error);
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
            key: "findOneAndUpdate",
            value: function findOneAndUpdate(where, update) {
                return _async_to_generator(function() {
                    var db;
                    return _ts_generator(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                db = getKnexInstance();
                                return [
                                    4,
                                    db.table(this.table).where(where).update(_object_spread_props(_object_spread({}, update), {
                                        updatedAt: new Date(Date.now())
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
            key: "findAndUpdate",
            value: function findAndUpdate(where, update) {
                return _async_to_generator(function() {
                    var db, emis, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, obj, emi, _iteratorNormalCompletion1, _didIteratorError1, _iteratorError1, _iterator1, _step1, e, err, emiSet, emiArray, emi1, error;
                    return _ts_generator(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                _state.trys.push([
                                    0,
                                    10,
                                    ,
                                    11
                                ]);
                                db = getKnexInstance();
                                emis = [];
                                _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
                                _state.label = 1;
                            case 1:
                                _state.trys.push([
                                    1,
                                    6,
                                    7,
                                    8
                                ]);
                                _iterator = where[Symbol.iterator]();
                                _state.label = 2;
                            case 2:
                                if (!!(_iteratorNormalCompletion = (_step = _iterator.next()).done)) return [
                                    3,
                                    5
                                ];
                                obj = _step.value;
                                return [
                                    4,
                                    db(this.table).whereIn(obj.key, obj.valueArray).select('emiID')
                                ];
                            case 3:
                                emi = _state.sent();
                                if (emi) {
                                    _iteratorNormalCompletion1 = true, _didIteratorError1 = false, _iteratorError1 = undefined;
                                    try {
                                        for(_iterator1 = emi[Symbol.iterator](); !(_iteratorNormalCompletion1 = (_step1 = _iterator1.next()).done); _iteratorNormalCompletion1 = true){
                                            e = _step1.value;
                                            emis.push(e.emiID);
                                        }
                                    } catch (err) {
                                        _didIteratorError1 = true;
                                        _iteratorError1 = err;
                                    } finally{
                                        try {
                                            if (!_iteratorNormalCompletion1 && _iterator1.return != null) {
                                                _iterator1.return();
                                            }
                                        } finally{
                                            if (_didIteratorError1) {
                                                throw _iteratorError1;
                                            }
                                        }
                                    }
                                }
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
                                emiSet = new Set(emis);
                                emiArray = Array.from(emiSet);
                                return [
                                    4,
                                    db(this.table).whereIn('emiID', emiArray).update(update)
                                ];
                            case 9:
                                emi1 = _state.sent();
                                return [
                                    2,
                                    true
                                ];
                            case 10:
                                error = _state.sent();
                                logger.error('Error Inside emi.ts findAndUpdate function', error);
                                return [
                                    2,
                                    false
                                ];
                            case 11:
                                return [
                                    2
                                ];
                        }
                    });
                }).call(this);
            }
        },
        {
            key: "countEMI",
            value: function countEMI(where) {
                return _async_to_generator(function() {
                    var db, razorpayEMOrder, count, error;
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
                                razorpayEMOrder = _state.sent();
                                count = razorpayEMOrder[0]['count(*)'];
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
                                logger.error('Error Inside razorpay_emOrder.ts getRazorpayEMOrder function', error);
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
            key: "getEmisQueryForFetchPaymentCronJob",
            value: function getEmisQueryForFetchPaymentCronJob() {
                return _async_to_generator(function() {
                    var db, today, todayDay, todayMonth, todayYear, emi, error;
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
                                today = new Date();
                                todayDay = today.getDate();
                                todayMonth = today.getMonth() + 1;
                                todayYear = today.getFullYear();
                                return [
                                    4,
                                    db(this.table).select('*').whereRaw('DAY(dueDate) = ?', [
                                        todayDay
                                    ]).andWhere(function() {
                                        this.whereRaw('MONTH(dueDate) <= ? AND YEAR(dueDate) <= ?', [
                                            todayMonth,
                                            todayYear
                                        ]).andWhere(function() {
                                            this.where('status', 'partially-paid').orWhere('status', 'due');
                                        });
                                    })
                                ];
                            case 1:
                                emi = _state.sent();
                                if ((emi === null || emi === void 0 ? void 0 : emi.length) == 0) {
                                    return [
                                        2,
                                        null
                                    ];
                                } else {
                                    return [
                                        2,
                                        emi // Return the first lead if found
                                    ];
                                }
                                return [
                                    3,
                                    3
                                ];
                            case 2:
                                error = _state.sent();
                                logger.error('Error Inside emi.ts getEmisQueryForFetchPaymentCronJob function', error);
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
            key: "getEmisQueryForManualPayment",
            value: function getEmisQueryForManualPayment(creditID) {
                return _async_to_generator(function() {
                    var db, today, todayDay, todayMonth, todayYear, emis, error;
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
                                today = new Date();
                                todayDay = today.getDate();
                                todayMonth = today.getMonth() + 1;
                                todayYear = today.getFullYear();
                                return [
                                    4,
                                    db(this.table).select('*').where({
                                        creditID: creditID
                                    }).andWhereRaw('DAY(dueDate) <= ?', [
                                        todayDay
                                    ]).andWhere(function() {
                                        this.where('status', 'partially-paid').orWhere('status', 'due');
                                    }).andWhere(function() {
                                        this.whereRaw('MONTH(dueDate) <= ? AND YEAR(dueDate) <= ?', [
                                            todayMonth,
                                            todayYear
                                        ]);
                                    })
                                ];
                            case 1:
                                emis = _state.sent();
                                if ((emis === null || emis === void 0 ? void 0 : emis.length) == 0) {
                                    return [
                                        2,
                                        null
                                    ];
                                } else {
                                    return [
                                        2,
                                        emis // Return the first lead if found
                                    ];
                                }
                                return [
                                    3,
                                    3
                                ];
                            case 2:
                                error = _state.sent();
                                logger.error('Error Inside emi.ts getEmisQueryForFetchPaymentCronJob function', error);
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
            key: "getEmisQueryForPreClosure",
            value: function getEmisQueryForPreClosure(creditID) {
                return _async_to_generator(function() {
                    var db, today, todayDay, todayMonth, todayYear, emis, error;
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
                                today = new Date();
                                todayDay = today.getDate();
                                todayMonth = today.getMonth() + 1;
                                todayYear = today.getFullYear();
                                return [
                                    4,
                                    db(this.table).select('*').where({
                                        creditID: creditID
                                    }).andWhereRaw('DAY(dueDate) <= ?', [
                                        todayDay
                                    ]).andWhere(function() {
                                        this.where('status', 'partially-paid').orWhere('status', 'due');
                                    }).andWhere(function() {
                                        this.whereRaw('MONTH(dueDate) <= ? AND YEAR(dueDate) <= ?', [
                                            todayMonth,
                                            todayYear
                                        ]);
                                    })
                                ];
                            case 1:
                                emis = _state.sent();
                                if ((emis === null || emis === void 0 ? void 0 : emis.length) == 0) {
                                    return [
                                        2,
                                        null
                                    ];
                                } else {
                                    return [
                                        2,
                                        emis // Return the first lead if found
                                    ];
                                }
                                return [
                                    3,
                                    3
                                ];
                            case 2:
                                error = _state.sent();
                                logger.error('Error Inside emi.ts getEmisQueryForFetchPaymentCronJob function', error);
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
            key: "findOne",
            value: function findOne(params) {
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
            key: "findLastEmi",
            value: function findLastEmi(_0) {
                return _async_to_generator(function(where) {
                    var select, _db_table_where, db;
                    var _arguments = arguments;
                    return _ts_generator(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                select = _arguments.length > 1 && _arguments[1] !== void 0 ? _arguments[1] : [
                                    '*'
                                ];
                                db = getKnexInstance();
                                return [
                                    4,
                                    (_db_table_where = db.table(this.table).where(where)).select.apply(_db_table_where, _to_consumable_array(select)).orderBy('emiID', 'desc').first()
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
            key: "insertEmiInDb",
            value: function insertEmiInDb(creditID, customerID, leadID, productID, principal, interest, penalty, brokenPeriodInterest, status, amountRemains, amountRemainsInterest, amountRemainsPenalty, amountRemainsBrokenPeriodIntrest, openingBalance, closingBalance, dueDate, actualPaymentDate, delayDays, penaltyID, paymentID) {
                var accessAmount = arguments.length > 20 && arguments[20] !== void 0 ? arguments[20] : 0, paymentReceived = arguments.length > 21 && arguments[21] !== void 0 ? arguments[21] : 0, waive_off_amount = arguments.length > 22 ? arguments[22] : void 0;
                return _async_to_generator(function() {
                    var db, emiID, error;
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
                                    db(this.table).insert({
                                        creditID: creditID,
                                        customerID: customerID,
                                        leadID: leadID,
                                        productID: productID,
                                        principal: principal,
                                        interest: interest,
                                        panelty: penalty,
                                        amountPayable: principal + interest,
                                        openingBalance: openingBalance,
                                        closingBalance: closingBalance,
                                        dueDate: dueDate,
                                        actualPaymentDate: actualPaymentDate,
                                        delayDays: delayDays,
                                        paneltyID: penaltyID,
                                        paymentID: paymentID,
                                        brokenPeriodIntrest: brokenPeriodInterest,
                                        status: status,
                                        amountRemains: amountRemains,
                                        amountRemainsInterest: amountRemainsInterest,
                                        amountRemainsPenalty: amountRemainsPenalty,
                                        amountRemainsBrokenPeriodIntrest: amountRemainsBrokenPeriodIntrest,
                                        createdAt: new Date(),
                                        updatedAt: new Date(),
                                        accessAmount: accessAmount,
                                        paymentReceived: paymentReceived,
                                        waive_off_amount: waive_off_amount
                                    }).returning('emiID')
                                ];
                            case 1:
                                emiID = _state.sent();
                                logger.info("EMI inserted successfully for Credit ID: ".concat(creditID));
                                return [
                                    2,
                                    emiID[0]
                                ];
                            case 2:
                                error = _state.sent();
                                logger.error('Error in insertEMI function:', error);
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
        }
    ]);
    return EmiModel;
}();
export { EmiModel as default };
export var emiModel = new EmiModel();

//# sourceMappingURL=emi.js.map