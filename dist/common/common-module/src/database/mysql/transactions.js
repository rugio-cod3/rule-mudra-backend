function _array_like_to_array(arr, len) {
    if (len == null || len > arr.length) len = arr.length;
    for(var i = 0, arr2 = new Array(len); i < len; i++)arr2[i] = arr[i];
    return arr2;
}
function _array_with_holes(arr) {
    if (Array.isArray(arr)) return arr;
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
function _non_iterable_spread() {
    throw new TypeError("Invalid attempt to spread non-iterable instance.\\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function _sliced_to_array(arr, i) {
    return _array_with_holes(arr) || _iterable_to_array_limit(arr, i) || _unsupported_iterable_to_array(arr, i) || _non_iterable_rest();
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
var TransactionModel = /*#__PURE__*/ function() {
    "use strict";
    function TransactionModel() {
        _class_call_check(this, TransactionModel);
        _define_property(this, "table", 'transactions');
    }
    _create_class(TransactionModel, [
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
            key: "getTransactions",
            value: function getTransactions(where, order, select) {
                return _async_to_generator(function() {
                    var _db_where, db, transactions, error;
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
                                transactions = _state.sent();
                                if (transactions == null || transactions.length == 0) {
                                    return [
                                        2,
                                        null
                                    ];
                                } else {
                                    return [
                                        2,
                                        transactions // Return the first lead if found
                                    ];
                                }
                                return [
                                    3,
                                    3
                                ];
                            case 2:
                                error = _state.sent();
                                logger.error('Error Inside transactions.ts getTransactions function', error);
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
            key: "countTransactions",
            value: function countTransactions(where) {
                return _async_to_generator(function() {
                    var db, transactions, count, error;
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
                                transactions = _state.sent();
                                count = transactions[0]['count(*)'];
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
                                logger.error('Error Inside transactions.ts countTransactions function', error);
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
            value: function insert(customerID, leadID, loanNo, status, type, mode, referenceNo, orderId, deleted, gateway, createdAt, updatedAt, createdBy, updatedBy, amount) {
                return _async_to_generator(function() {
                    var db, _ref, insertedID;
                    return _ts_generator(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                db = getKnexInstance();
                                return [
                                    4,
                                    db.table(this.table).insert({
                                        customerID: customerID,
                                        leadID: leadID,
                                        loanNo: loanNo,
                                        status: status,
                                        type: type,
                                        mode: mode,
                                        referenceNo: referenceNo,
                                        orderId: orderId,
                                        deleted: deleted,
                                        gateway: gateway,
                                        createdAt: createdAt,
                                        updatedAt: updatedAt,
                                        createdBy: createdBy,
                                        updatedBy: updatedBy,
                                        amount: amount
                                    }).returning('id')
                                ];
                            case 1:
                                _ref = _sliced_to_array.apply(void 0, [
                                    _state.sent(),
                                    1
                                ]), insertedID = _ref[0];
                                return [
                                    2,
                                    insertedID
                                ];
                        }
                    });
                }).call(this);
            }
        },
        {
            key: "insertV2",
            value: function insertV2(customerID, leadID, loanNo, status, type, mode, referenceNo, orderId, deleted, gateway, createdBy, updatedBy, amount, emiID, transactionDate, remarks, payment_transaction_status, waiver, discount_type) {
                return _async_to_generator(function() {
                    var db, _ref, insertedID;
                    return _ts_generator(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                db = getKnexInstance();
                                return [
                                    4,
                                    db.table(this.table).insert({
                                        customerID: customerID,
                                        leadID: leadID,
                                        loanNo: loanNo,
                                        status: status,
                                        type: type,
                                        mode: mode,
                                        referenceNo: referenceNo,
                                        orderId: orderId,
                                        deleted: deleted,
                                        gateway: gateway,
                                        createdBy: createdBy,
                                        updatedBy: updatedBy,
                                        amount: amount,
                                        emiID: emiID,
                                        transactionDate: transactionDate,
                                        remarks: remarks,
                                        payment_transaction_status: payment_transaction_status,
                                        waiver: waiver,
                                        discount_type: discount_type
                                    }).returning('id')
                                ];
                            case 1:
                                _ref = _sliced_to_array.apply(void 0, [
                                    _state.sent(),
                                    1
                                ]), insertedID = _ref[0];
                                return [
                                    2,
                                    insertedID
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
                                    db.table(this.table).where(where).update(update)
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
                    var db, transectionIds, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, obj, transactions, _iteratorNormalCompletion1, _didIteratorError1, _iteratorError1, _iterator1, _step1, t, err, transactionset, transectionArray, emi, error;
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
                                transectionIds = [];
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
                                    db(this.table).whereIn(obj.key, obj.valueArray).select('id')
                                ];
                            case 3:
                                transactions = _state.sent();
                                if (transactions) {
                                    _iteratorNormalCompletion1 = true, _didIteratorError1 = false, _iteratorError1 = undefined;
                                    try {
                                        for(_iterator1 = transactions[Symbol.iterator](); !(_iteratorNormalCompletion1 = (_step1 = _iterator1.next()).done); _iteratorNormalCompletion1 = true){
                                            t = _step1.value;
                                            transectionIds.push(t.id);
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
                                transactionset = new Set(transectionIds);
                                transectionArray = Array.from(transactionset);
                                return [
                                    4,
                                    db(this.table).whereIn('id', transectionArray).update(update)
                                ];
                            case 9:
                                emi = _state.sent();
                                return [
                                    2,
                                    true
                                ];
                            case 10:
                                error = _state.sent();
                                logger.error('Error Inside transection.ts findAndUpdate function', error);
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
            key: "getUserTransactions",
            value: function getUserTransactions(where, order, select) {
                return _async_to_generator(function() {
                    var _db_where, db, query, transactions, error;
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
                                query = (_db_where = db(this.table).where({
                                    customerID: where.customerID,
                                    status: where.status
                                })).select.apply(_db_where, _to_consumable_array(select)).orderBy(order.orderKey, order.orderValue);
                                if (where.type && where.type.$in) {
                                    query = query.whereIn('type', where.type.$in);
                                }
                                return [
                                    4,
                                    query
                                ];
                            case 1:
                                transactions = _state.sent();
                                if (transactions == null || transactions.length == 0) {
                                    return [
                                        2,
                                        null
                                    ];
                                } else {
                                    return [
                                        2,
                                        transactions
                                    ];
                                }
                                return [
                                    3,
                                    3
                                ];
                            case 2:
                                error = _state.sent();
                                logger.error('Error Inside transactions.ts getUserTransactions function', error);
                                return [
                                    2,
                                    null
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
            key: "getUserTransactions2",
            value: function getUserTransactions2(where, order, select) {
                return _async_to_generator(function() {
                    var _db_where, db, query, transactions, error;
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
                                query = (_db_where = db(this.table).where({
                                    customerID: where.customerID
                                })).select.apply(_db_where, _to_consumable_array(select)).orderBy(order.orderKey, order.orderValue);
                                if (where.type && where.type.$in) {
                                    query = query.whereIn('type', where.type.$in);
                                }
                                return [
                                    4,
                                    query
                                ];
                            case 1:
                                transactions = _state.sent();
                                if (transactions == null || transactions.length == 0) {
                                    return [
                                        2,
                                        null
                                    ];
                                } else {
                                    return [
                                        2,
                                        transactions
                                    ];
                                }
                                return [
                                    3,
                                    3
                                ];
                            case 2:
                                error = _state.sent();
                                logger.error('Error Inside transactions.ts getUserTransactions function', error);
                                return [
                                    2,
                                    null
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
                                // if (paginate) {
                                //   const offset = (paginate.page - 1) * paginate.perPage
                                //   query.limit(paginate.perPage).offset(offset)
                                // }
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
            value: function count(where, whereNot, whereRaw) {
                return _async_to_generator(function() {
                    var db, query, result;
                    return _ts_generator(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                db = getKnexInstance();
                                query = db(this.table);
                                if (where) query.where(where);
                                if (whereNot) query.whereNot(whereNot);
                                if (whereRaw) {
                                    whereRaw.forEach(function(condition) {
                                        query.whereRaw(condition.rawQuery, condition.values);
                                    });
                                }
                                return [
                                    4,
                                    query.count('* as count')
                                ];
                            case 1:
                                result = _state.sent();
                                return [
                                    2,
                                    result[0].count
                                ];
                        }
                    });
                }).call(this);
            }
        },
        {
            key: "findOneTransaction",
            value: function findOneTransaction(_0, _1) {
                return _async_to_generator(function(where) {
                    var select, order, _query, db, query;
                    var _arguments = arguments;
                    return _ts_generator(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                select = _arguments.length > 1 && _arguments[1] !== void 0 ? _arguments[1] : [
                                    '*'
                                ], order = _arguments.length > 2 ? _arguments[2] : void 0;
                                db = getKnexInstance();
                                query = db.table(this.table).where(where);
                                if (order) query.orderBy(order);
                                return [
                                    4,
                                    (_query = query).select.apply(_query, _to_consumable_array(select)).first()
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
        }
    ]);
    return TransactionModel;
}();
export { TransactionModel as default };
export var transactionModel = new TransactionModel();

//# sourceMappingURL=transactions.js.map