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
import { format } from 'date-fns';
import { PennyDropNameMismatch } from '../../enums/pennyDrop.enum';
import { logger } from '../../utils/logger';
import { getKnexInstance, runQuery } from '../../utils/mysql';
var CustomerModel = /*#__PURE__*/ function() {
    "use strict";
    function CustomerModel() {
        _class_call_check(this, CustomerModel);
        _define_property(this, "table", 'customer');
    }
    _create_class(CustomerModel, [
        {
            key: "CustomerKnex",
            get: function get() {
                var db = getKnexInstance();
                return db(this.table);
            }
        },
        {
            key: "getCustomer",
            value: function getCustomer(mobile) {
                return _async_to_generator(function() {
                    var sql, result, error;
                    return _ts_generator(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                sql = "SELECT * FROM ".concat(this.table, " WHERE mobile = ").concat(mobile, " LIMIT 1");
                                _state.label = 1;
                            case 1:
                                _state.trys.push([
                                    1,
                                    3,
                                    ,
                                    4
                                ]);
                                return [
                                    4,
                                    runQuery(sql)
                                ];
                            case 2:
                                result = _state.sent();
                                if (result.length === 0) {
                                    return [
                                        2,
                                        []
                                    ];
                                } else {
                                    return [
                                        2,
                                        result[0]
                                    ];
                                }
                                return [
                                    3,
                                    4
                                ];
                            case 3:
                                error = _state.sent();
                                logger.error(error);
                                return [
                                    2,
                                    []
                                ];
                            case 4:
                                return [
                                    2
                                ];
                        }
                    });
                }).call(this);
            }
        },
        {
            key: "findOneCustomer",
            value: // New Code
            function findOneCustomer(_0, _1) {
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
            key: "saveCustomer",
            value: // ! TO BE REMOVED
            // public async getCustome(
            //   where: Partial<ICustomer>,
            //   order: IOrder,
            //   select: string[],
            // ): Promise<ICustomer[] | null> {
            //   try {
            //     let db = getKnexInstance()
            //     let customer = await db(this.table)
            //       .where(where)
            //       .select(...select)
            //       .orderBy(order.orderKey, order.orderValue)
            //     if (customer == null || customer?.length == 0) {
            //       return null
            //     } else {
            //       return customer // Return the first product if found
            //     }
            //   } catch (error) {
            //     logger.error('Error Inside customer.ts getCustom function', error)
            //     return null
            //   }
            // }
            function saveCustomer(mobile) {
                return _async_to_generator(function() {
                    var insertedData, columns, values, sql, _ref, resultSetHeader, error;
                    return _ts_generator(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                insertedData = {
                                    gender: 'NA',
                                    dob: '1970-01-01',
                                    mobile: mobile,
                                    email: 'NA',
                                    password: 'NA',
                                    employeeType: 'Not Employed',
                                    // status: 'Incomplete',
                                    createdDate: format(new Date(), 'yyyy-MM-dd HH:mm:ss')
                                };
                                if (!insertedData) return [
                                    3,
                                    4
                                ];
                                columns = Object.keys(insertedData);
                                values = Object.values(insertedData);
                                sql = "\n        INSERT INTO ".concat(this.table, " (").concat(columns.map(function(col) {
                                    return col;
                                }).join(','), ")\n        VALUES (").concat(values.map(function() {
                                    return '?';
                                }).join(','), ")\n      ");
                                _state.label = 1;
                            case 1:
                                _state.trys.push([
                                    1,
                                    3,
                                    ,
                                    4
                                ]);
                                return [
                                    4,
                                    runQuery(sql, values)
                                ];
                            case 2:
                                _ref = _sliced_to_array.apply(void 0, [
                                    _state.sent(),
                                    1
                                ]), resultSetHeader = _ref[0];
                                // console.log("save", resultSetHeader.insertId)
                                return [
                                    2,
                                    resultSetHeader
                                ];
                            case 3:
                                error = _state.sent();
                                logger.error(error);
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
                }).call(this);
            }
        },
        {
            key: "updateCustomerCol",
            value: function updateCustomerCol(counsmer_id, col, val) {
                return _async_to_generator(function() {
                    var sql, updateObjResp, error;
                    return _ts_generator(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                _state.trys.push([
                                    0,
                                    2,
                                    ,
                                    3
                                ]);
                                if (!counsmer_id || !col || !val) {
                                    return [
                                        2,
                                        false
                                    ];
                                }
                                sql = "UPDATE ".concat(this.table, " SET ").concat(col, " = ? WHERE customerID = ?");
                                return [
                                    4,
                                    runQuery(sql, [
                                        val,
                                        counsmer_id
                                    ])
                                ];
                            case 1:
                                updateObjResp = _state.sent();
                                return [
                                    2,
                                    updateObjResp
                                ];
                            case 2:
                                error = _state.sent();
                                logger.error(error);
                                return [
                                    2,
                                    false
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
            key: "getCustomerById",
            value: function getCustomerById(customerId) {
                return _async_to_generator(function() {
                    var sql, getObjResp, error;
                    return _ts_generator(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                sql = "SELECT * FROM ".concat(this.table, " WHERE customerID=").concat(customerId);
                                _state.label = 1;
                            case 1:
                                _state.trys.push([
                                    1,
                                    3,
                                    ,
                                    4
                                ]);
                                return [
                                    4,
                                    runQuery(sql)
                                ];
                            case 2:
                                getObjResp = _state.sent();
                                return [
                                    2,
                                    getObjResp[0]
                                ];
                            case 3:
                                error = _state.sent();
                                logger.error(error);
                                return [
                                    2,
                                    []
                                ];
                            case 4:
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
            key: "find",
            value: function find(params) {
                return _async_to_generator(function() {
                    var _query, _params_select, select, paginate, where, db, query;
                    return _ts_generator(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                _params_select = params.select, select = _params_select === void 0 ? [
                                    '*'
                                ] : _params_select, paginate = params.paginate, where = params.where;
                                db = getKnexInstance();
                                query = db(this.table);
                                if (where) {
                                    query.where(where);
                                }
                                if (paginate) {
                                    query.limit(paginate.perPage).offset(paginate.page);
                                }
                                (_query = query).select.apply(_query, _to_consumable_array(select));
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
                    var where, whereNot, whereIn, db, count, data;
                    return _ts_generator(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                where = params.where, whereNot = params.whereNot, whereIn = params.whereIn;
                                db = getKnexInstance();
                                count = db(this.table);
                                if (where) count.where(where);
                                if (whereNot) count.whereNot(whereNot);
                                if (whereIn) {
                                    whereIn.forEach(function(condition) {
                                        var column = condition.column, value = condition.value;
                                        count.whereIn(column, value);
                                    });
                                }
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
        },
        {
            key: "findRepaymentDate",
            value: function findRepaymentDate(params) {
                return _async_to_generator(function() {
                    var selectColumns, where, paginate, db, countQuery, dataQuery, _ref, countResult, repaymentData;
                    return _ts_generator(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                selectColumns = [
                                    'l.leadID as leadID',
                                    'c.name as Name',
                                    'c.mobile as Mobile',
                                    'c.customerID as customerID',
                                    'l.status as Status',
                                    'a.repayDate as repayDate',
                                    'a.loanAmtApproved as approvedAmount',
                                    'a.approvalID as approvalID'
                                ];
                                where = params.where, paginate = params.paginate;
                                db = getKnexInstance();
                                // **Get the total count**
                                countQuery = db('customer as c').join('leads as l', 'l.customerID', 'c.customerID').join('approval as a', function() {
                                    this.on('a.customerID', '=', 'c.customerID').andOn('a.leadID', '=', 'l.leadID');
                                }).where(where).whereIn('l.status', [
                                    'Part Payment',
                                    'Disbursed'
                                ]).count('* as total').first();
                                // **Get the paginated data**
                                dataQuery = db('customer as c').join('leads as l', 'l.customerID', 'c.customerID').join('approval as a', function() {
                                    this.on('a.customerID', '=', 'c.customerID').andOn('a.leadID', '=', 'l.leadID');
                                }).select(selectColumns).where(where).whereIn('l.status', [
                                    'Part Payment',
                                    'Disbursed'
                                ]);
                                if (paginate) {
                                    dataQuery.limit(paginate.perPage).offset(paginate.page);
                                }
                                return [
                                    4,
                                    Promise.all([
                                        countQuery,
                                        dataQuery
                                    ])
                                ];
                            case 1:
                                _ref = _sliced_to_array.apply(void 0, [
                                    _state.sent(),
                                    2
                                ]), countResult = _ref[0], repaymentData = _ref[1];
                                return [
                                    2,
                                    {
                                        repaymentData: repaymentData,
                                        totalCount: Number(countResult === null || countResult === void 0 ? void 0 : countResult.total) || 0
                                    }
                                ];
                        }
                    });
                })();
            }
        },
        {
            key: "getCustomerFinbox",
            value: function getCustomerFinbox(params) {
                return _async_to_generator(function() {
                    var where, paginate, selectColumns, db, totalCountQuery, dataQuery, _ref, totalCountResult, data;
                    return _ts_generator(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                where = params.where, paginate = params.paginate;
                                selectColumns = [
                                    'fm.accountNo as account',
                                    'c.customerID',
                                    'c.name',
                                    'c.mobile',
                                    'c.pancard',
                                    'c.createdDate',
                                    'fm.id'
                                ];
                                db = getKnexInstance();
                                // Query to get total count
                                totalCountQuery = db('customer as c').join('finbox_name_match as fm', 'c.customerID', '=', 'fm.customerID').where('fm.status', 0).modify(function(query) {
                                    if (where) query.where(where);
                                }).count('* as total').first();
                                // Query to get paginated data
                                dataQuery = db('customer as c').join('finbox_name_match as fm', 'c.customerID', '=', 'fm.customerID').select(selectColumns).where('fm.status', 0).modify(function(query) {
                                    if (where) query.where(where);
                                    if (paginate) query.limit(paginate.perPage).offset(paginate.page);
                                }).orderBy('fm.id', 'desc');
                                return [
                                    4,
                                    Promise.all([
                                        totalCountQuery,
                                        dataQuery
                                    ])
                                ];
                            case 1:
                                _ref = _sliced_to_array.apply(void 0, [
                                    _state.sent(),
                                    2
                                ]), totalCountResult = _ref[0], data = _ref[1];
                                return [
                                    2,
                                    {
                                        data: data,
                                        totalCount: totalCountResult ? totalCountResult.total : 0
                                    }
                                ];
                        }
                    });
                })();
            }
        },
        {
            key: "getCustomerPenny",
            value: function getCustomerPenny(params) {
                return _async_to_generator(function() {
                    var where, paginate, selectColumns, db, totalCountQuery, dataQuery, _ref, totalCountResult, data;
                    return _ts_generator(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                where = params.where, paginate = params.paginate;
                                selectColumns = [
                                    'p.account_number as account',
                                    'c.customerID',
                                    'c.name',
                                    'c.mobile',
                                    'c.pancard',
                                    'c.createdDate',
                                    'p.registered_name',
                                    'p.credated_date',
                                    'p.id'
                                ];
                                db = getKnexInstance();
                                totalCountQuery = db('customer as c').join('penny_drop as p', 'c.customerID', '=', 'p.customerID').where('p.penny_drop_name_match', PennyDropNameMismatch.THIRD).modify(function(query) {
                                    if (where) query.where(where);
                                }).count('* as total').first();
                                // Query to get paginated data
                                dataQuery = db('customer as c').join('penny_drop as p', 'c.customerID', '=', 'p.customerID').select(selectColumns).where('p.penny_drop_name_match', PennyDropNameMismatch.THIRD).modify(function(query) {
                                    if (where) query.where(where);
                                    if (paginate) query.limit(paginate.perPage).offset(paginate.page);
                                }).orderBy('p.id', 'desc');
                                return [
                                    4,
                                    Promise.all([
                                        totalCountQuery,
                                        dataQuery
                                    ])
                                ];
                            case 1:
                                _ref = _sliced_to_array.apply(void 0, [
                                    _state.sent(),
                                    2
                                ]), totalCountResult = _ref[0], data = _ref[1];
                                return [
                                    2,
                                    {
                                        data: data,
                                        totalCount: totalCountResult ? totalCountResult.total : 0
                                    }
                                ];
                        }
                    });
                })();
            }
        }
    ]);
    return CustomerModel;
}();
export { CustomerModel as default };
export var customerModel = new CustomerModel();

//# sourceMappingURL=customer.js.map