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
var LeadModel = /*#__PURE__*/ function() {
    "use strict";
    function LeadModel() {
        _class_call_check(this, LeadModel);
        _define_property(this, "table", 'leads');
    }
    _create_class(LeadModel, [
        {
            key: "LeadsKnex",
            get: function get() {
                var db = getKnexInstance();
                return db(this.table);
            }
        },
        {
            key: "Knex",
            get: function get() {
                var db = getKnexInstance();
                return db;
            }
        },
        {
            key: "getLeadData",
            value: function getLeadData(whereConditions, order, select, skip, take, leadStartDate, leadEndDate) {
                return _async_to_generator(function() {
                    var db, selectColumns, query, leads;
                    return _ts_generator(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                db = getKnexInstance();
                                // Prepare the select array
                                // let selectColumns = [
                                //   ...select.map(column => `l.${column}`),
                                //   'c.customerID as customerID',
                                //   'c.name as customerName',
                                //   'c.firstName as customerFirstName',
                                //   'c.middleName as customerMiddleName',
                                //   'c.lastName as customerLastName',
                                //   'c.gender as customerGender',
                                //   'c.dob as customerDOB',
                                //   'c.mobile as customerMobile',
                                //   'c.email as customerEmail',
                                //   'c.pancard as customerPancard',
                                //   'c.employeeType as customerEmployeeType',
                                //   // Add more fields from the customers table as needed
                                // ];
                                selectColumns = [
                                    'l.leadID as leadID',
                                    'c.name as Name',
                                    'c.email as EMail',
                                    'c.mobile as Mobile',
                                    'l.status as Status',
                                    'l.fbleads as CaseType',
                                    'l.callAssign as CallAssign'
                                ];
                                query = db('leads as l').join('customer as c', 'l.customerID', 'c.customerID').select(selectColumns).orderBy(order.orderKey, order.orderValue);
                                // Apply whereIn conditions
                                whereConditions.forEach(function(condition) {
                                    var columnPrefix = condition.column === 'employeeType' ? 'c.' : 'l.';
                                    query = query.whereIn("".concat(columnPrefix).concat(condition.column), condition.values);
                                });
                                if (leadStartDate) {
                                    query = query.where('l.createdDate', '>=', leadStartDate);
                                }
                                if (leadEndDate) {
                                    query = query.where('l.createdDate', '<=', leadEndDate);
                                }
                                if (take !== undefined && take !== null) {
                                    query = query.limit(take);
                                }
                                if (skip !== undefined && skip !== null) {
                                    query = query.offset(skip);
                                }
                                return [
                                    4,
                                    query
                                ];
                            case 1:
                                leads = _state.sent();
                                return [
                                    2,
                                    leads
                                ];
                        }
                    });
                })();
            }
        },
        {
            key: "getAgainNoLoanLeadData",
            value: function getAgainNoLoanLeadData(whereConditions, order, select, skip, take, leadStartDate, leadEndDate, device, loanType, customerSearch, alloUID, leadStatus, utmSource) {
                return _async_to_generator(function() {
                    var db, selectColumns, query, leads, downloadExcel, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, thisData, closedDate, err;
                    return _ts_generator(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                db = getKnexInstance();
                                // let selectColumns = [
                                //   ...select.map(column => `l.${column}`),
                                //   'c.customerID as customerID',
                                //   'c.name as customerName',
                                //   'c.mobile as customerMobile',
                                //   'c.email as customerEmail',
                                //   'l.status as status',
                                //   // Add more fields as needed
                                // ];
                                selectColumns = [
                                    'l.leadID as leadID',
                                    'c.name as customerID',
                                    'c.name as Name',
                                    'c.email as EMail',
                                    'c.mobile as Mobile'
                                ];
                                query = db('leads as l1').join('customer as c', 'l1.customerID', 'c.customerID').select('l1.*', 'c.*').where('l1.status', 'Closed').whereNotExists(function() {
                                    this.select(db.raw('1')).from('leads as l2').whereRaw('l2.customerID = l1.customerID').andWhereRaw('l2.leadID > l1.leadID');
                                }).orderBy(order.orderKey, order.orderValue);
                                // Apply whereIn conditions
                                whereConditions.forEach(function(condition) {
                                    var columnPrefix = condition.column === 'employeeType' ? 'c.' : 'l.';
                                    query = query.whereIn("".concat(columnPrefix).concat(condition.column), condition.values);
                                });
                                // Apply date filters
                                if (leadStartDate) {
                                    query = query.where('l.createdDate', '>=', leadStartDate);
                                }
                                if (leadEndDate) {
                                    query = query.where('l.createdDate', '<=', leadEndDate);
                                }
                                // Apply device filter
                                if (device) {
                                    if (device === 'android') {
                                        query = query.whereExists(function() {
                                            this.select(db.raw('1')).from('login_device_detail').whereRaw('login_device_detail.mobile = c.mobile').whereNotNull('login_device_detail.modelName').whereNotNull('login_device_detail.android_version');
                                        });
                                    } else {
                                        query = query.whereNotExists(function() {
                                            this.select(db.raw('1')).from('login_device_detail').whereRaw('login_device_detail.mobile = c.mobile');
                                        });
                                    }
                                }
                                // Apply loan type filter
                                if (loanType) {
                                    query = query.where('l.productID', loanType);
                                }
                                // Apply customer search filter
                                if (customerSearch) {
                                    query = query.where(function() {
                                        this.where('c.name', 'LIKE', "%".concat(customerSearch, "%")).orWhere('c.mobile', 'LIKE', "%".concat(customerSearch, "%")).orWhere('c.email', 'LIKE', "%".concat(customerSearch, "%"));
                                    });
                                }
                                // Apply alloUID filter
                                if (alloUID) {
                                    if (alloUID === '0') {
                                        query = query.where('l.sanctionalloUID', 'no');
                                    } else {
                                        query = query.where(function() {
                                            this.where('l.callAssign', alloUID).orWhere('l.creditAssign', alloUID).orWhere('l.alloUID', alloUID).orWhere('l.sanctionalloUID', alloUID);
                                        });
                                    }
                                }
                                // Apply utmSource filter
                                if (utmSource && utmSource !== 'All') {
                                    query = query.where('l.utmSource', utmSource);
                                }
                                // Apply pagination
                                if (skip !== undefined && skip !== null) {
                                    query = query.offset(skip);
                                }
                                if (take !== undefined && take !== null) {
                                    query = query.limit(take);
                                }
                                return [
                                    4,
                                    query
                                ];
                            case 1:
                                leads = _state.sent();
                                // return leads
                                // return leads
                                downloadExcel = [];
                                _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
                                _state.label = 2;
                            case 2:
                                _state.trys.push([
                                    2,
                                    7,
                                    8,
                                    9
                                ]);
                                _iterator = leads[Symbol.iterator]();
                                _state.label = 3;
                            case 3:
                                if (!!(_iteratorNormalCompletion = (_step = _iterator.next()).done)) return [
                                    3,
                                    6
                                ];
                                thisData = _step.value;
                                return [
                                    4,
                                    db('collection').select('collectedDate').where('customerID', thisData.customerID).where('leadID', thisData.leadID).where('status', 'Closed').orderBy('collectedDate', 'desc').first()
                                ];
                            case 4:
                                closedDate = _state.sent();
                                downloadExcel.push({
                                    customerID: thisData.customerID,
                                    Name: thisData.name,
                                    Mobile: thisData.mobile,
                                    EMail: thisData.email,
                                    'Last Loan Closed Date': closedDate ? closedDate.collectedDate : ''
                                });
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
                                    2,
                                    downloadExcel
                                ];
                        }
                    });
                })();
            }
        },
        {
            key: "findOneLead",
            value: // public async getAgainNoLoanLeadData(
            //   whereConditions: { column: string; values: string[] | number[] }[],
            //   order: { orderKey: string; orderValue: string },
            //   select: string[],
            //   skip?: number,
            //   take?: number,
            //   leadStartDate?: string,
            //   leadEndDate?: string,
            //   device?: string,
            //   loanType?: string,
            //   customerSearch?: string,
            //   alloUID?: string,
            // ): Promise<ILead[] | null> {
            //   const db: Knex = getKnexInstance();
            //   let selectColumns = [
            //     ...select.map(column => `l.${column}`),
            //     'c.customerID as customerID',
            //     'c.name as customerName',
            //     'c.mobile as customerMobile',
            //     'c.email as customerEmail',
            //     'l.status as status',
            //     // Add more fields as needed
            //   ];
            //   let query = db('leads as l')
            //     .join('customer as c', 'l.customerID', 'c.customerID')
            //     .select(selectColumns)
            //     .orderBy(order.orderKey, order.orderValue);
            //   // Apply whereIn conditions
            //   whereConditions.forEach(condition => {
            //     const columnPrefix = condition.column === 'employeeType' ? 'c.' : 'l.';
            //     query = query.whereIn(`${columnPrefix}${condition.column}`, condition.values);
            //   });
            //   if (leadStartDate) {
            //     query = query.where('l.createdDate', '>=', leadStartDate);
            //   }
            //   if (leadEndDate) {
            //     query = query.where('l.createdDate', '<=', leadEndDate);
            //   }
            //   if (device) {
            //     if (device === 'android') {
            //       query = query.whereExists(function (subQuery) {
            //         subQuery.select(db.raw(1))
            //           .from('login_device_detail')
            //           .whereRaw('login_device_detail.mobile = c.mobile')
            //           .whereNotNull('login_device_detail.modelName')
            //           .whereNotNull('login_device_detail.android_version');
            //       });
            //     } else {
            //       query = query.whereNotExists(function (subQuery) {
            //         subQuery.select(db.raw(1))
            //           .from('login_device_detail')
            //           .whereRaw('login_device_detail.mobile = c.mobile');
            //       });
            //     }
            //   }
            //   if (loanType) {
            //     query = query.where('l.productID', loanType);
            //   }
            //   if (customerSearch) {
            //     query = query.where(function () {
            //       this.where('c.name', 'LIKE', `%${customerSearch}%`)
            //         .orWhere('c.mobile', 'LIKE', `%${customerSearch}%`)
            //         .orWhere('c.email', 'LIKE', `%${customerSearch}%`);
            //     });
            //   }
            //   if (alloUID) {
            //     if (alloUID === '0') {
            //       query = query.where('l.sanctionalloUID', 'no');
            //     } else {
            //       query = query.where(function () {
            //         this.where('l.callAssign', alloUID)
            //           .orWhere('l.creditAssign', alloUID)
            //           .orWhere('l.alloUID', alloUID)
            //           .orWhere('l.sanctionalloUID', alloUID);
            //       });
            //     }
            //   }
            //   if (device) {
            //     if (device === 'android') {
            //     query = query.whereExists(function (subQuery) {
            //         subQuery.select(db.raw(1))
            //         .from('login_device_detail')
            //         .whereRaw('login_device_detail.mobile = c.mobile')
            //         .whereNotNull('login_device_detail.modelName')
            //         .whereNotNull('login_device_detail.android_version');
            //     });
            //     } else {
            //     query = query.whereNotExists(function (subQuery) {
            //         subQuery.select(db.raw(1))
            //         .from('login_device_detail')
            //         .whereRaw('login_device_detail.mobile = c.mobile');
            //     });
            //     }
            // }
            //   if (skip !== undefined && skip !== null) {
            //     query = query.offset(skip);
            //   }
            //   if (take !== undefined && take !== null) {
            //     query = query.limit(take);
            //   }
            //   const leads =await query;
            //   return leads;
            // }
            // public async getAgainNoLoanLeadData(
            //   whereConditions: { column: string, values: string[]|number[] }[],
            //   order: { orderKey: string; orderValue: string },
            //   select: string[],
            //   skip?: number,
            //   take?: number,
            //   leadStartDate?: string,
            //   leadEndDate?: string
            // ): Promise<ILead[] | null> {
            //     let db = getKnexInstance();
            //     // Prepare the select array
            //     let selectColumns = [
            //       ...select.map(column => `l.${column}`),
            //       'c.customerID as customerID',
            //       'c.name as customerName',
            //       'c.firstName as customerFirstName',
            //       'c.middleName as customerMiddleName',
            //       'c.lastName as customerLastName',
            //       'c.gender as customerGender',
            //       'c.dob as customerDOB',
            //       'c.mobile as customerMobile',
            //       'c.email as customerEmail',
            //       'c.pancard as customerPancard',
            //       'c.employeeType as customerEmployeeType',
            //       // Add more fields from the customers table as needed
            //     ];
            //     let query = db('leads as l')
            //       .join('customer as c', 'l.customerID', 'c.customerID')
            //       .select(selectColumns)
            //       .orderBy(order.orderKey, order.orderValue);
            //     // Apply whereIn conditions
            //     whereConditions.forEach(condition => {
            //       const columnPrefix = condition.column === 'employeeType' ? 'c.' : 'l.';
            //       query = query.whereIn(`${columnPrefix}${condition.column}`, condition.values);
            //     });
            //     if (leadStartDate) {
            //       query = query.where('l.createdDate', '>=', leadStartDate);
            //     }
            //     if (leadEndDate) {
            //       query = query.where('l.createdDate', '<=', leadEndDate);
            //     }
            //     if (take !== undefined && take !== null) {
            //       query = query.limit(take);
            //     }
            //     if (skip !== undefined && skip !== null) {
            //       query = query.offset(skip);
            //     }
            //     let leads = await query;
            //     return leads;
            // }
            // In your leadModel class
            // public async getLeadData(
            //   whereConditions: { column: string, values: string[] }[],
            //   order: { orderKey: string; orderValue: string },
            //   select: string[],
            //   skip: number,
            //   take: number
            // ): Promise<ILead[]> {
            //   try {
            //       const query = this.knex('leads')
            //           .join('customers', 'leads.customerID', 'customers.customerID')
            //           .select([
            //               ...select,
            //               'customers.name as customerName',
            //               'customers.firstName as customerFirstName',
            //               'customers.lastName as customerLastName',
            //               // Add other customer fields you need
            //           ]);
            //       whereConditions.forEach(condition => {
            //           query.whereIn(condition.column, condition.values);
            //       });
            //       query.orderBy(order.orderKey, order.orderValue)
            //           .limit(take)
            //           .offset(skip);
            //       const leads = await query;
            //       return leads;
            //   } catch (error) {
            //       throw error;
            //   }
            // }
            // public async getLeadData(
            //   whereConditions: { column: string, values: string[] }[],
            //   order: { orderKey: string; orderValue: string },
            //   select: string[],
            //   skip: number,
            //   take: number
            // ): Promise<ILead[] | null> {
            //   try {
            //     let db = getKnexInstance();
            //     // let query = db(this.table)
            //     //   .select(...select)
            //     //   .orderBy(order.orderKey, order.orderValue)
            //     //   .limit(take)
            //     //   .offset(skip);
            //     let query = db(this.table) .select([...select, 'customer.name', 'customer.firstName', 'customer.middleName', 'customer.lastName', 'customer.gender']) .leftJoin('customer', 'leads.customerId', 'customer.id') .orderBy(order.orderKey, order.orderValue) .limit(take) .offset(skip);
            //     // Apply whereIn conditions
            //     whereConditions.forEach(condition => {
            //       query = query.whereIn(condition.column, condition.values);
            //     });
            //     let leads = await query;
            //     if (leads == null || leads.length == 0) {
            //       return null;
            //     } else {
            //       return leads;
            //     }
            //   } catch (error) {
            //     logger.error('Error Inside lead.ts getLeadData function', error);
            //     return null;
            //   }
            // }
            // public async getLeadData(
            //   whereConditions: { column: string, values: string[] }[],
            //   order: { orderKey: string; orderValue: string },
            //   select: string[],
            //   skip: number,
            //   take: number
            // ): Promise<ILead[] | null> {
            //   try {
            //     let db = getKnexInstance();
            //     let query = db(this.table)
            //       .select(...select)
            //       .orderBy(order.orderKey, order.orderValue)
            //       .limit(take)
            //       .offset(skip);
            //     // Apply whereIn conditions
            //     whereConditions.forEach(condition => {
            //       query = query.whereIn(condition.column, condition.values);
            //     });
            //     let leads = await query;
            //     if (leads == null || leads.length == 0) {
            //       return null;
            //     } else {
            //       return leads;
            //     }
            //   } catch (error) {
            //     logger.error('Error Inside lead.ts getLeadData function', error);
            //     return null;
            //   }
            // }
            // public async getLeadData(
            //   where: {},
            //   order: { orderKey: string; orderValue: string },
            //   select: string[],
            // ): Promise<ILead[] | null> {
            //   try {
            //     let db = getKnexInstance()
            //     let leads = await db(this.table)
            //       .where(where)
            //       .select(...select)
            //       .orderBy(order.orderKey, order.orderValue)
            //     if (leads == null || leads?.length == 0) {
            //       return null
            //     } else {
            //       return leads // Return the first lead if found
            //     }
            //   } catch (error) {
            //     logger.error('Error Inside lead.ts getLeadData function', error)
            //   }
            // }
            // async findOneLead(
            //   where: Partial<ILead>,
            //   select: TSelectLead[] | ['*'] = ['*'],
            //   order?: TSelectLead[],
            // ): Promise<ILead> {
            //   let db = getKnexInstance()
            //   let query = db
            //     .table(this.table)
            //     .where(where)
            //     .select(...select)
            //   if (order) {
            //     query.orderBy(order)
            //   }
            //   return await query.first()
            // }
            function findOneLead(_0, _1) {
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
                                    query.orderBy(order); // Now it expects an array of objects
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
            key: "findAll",
            value: // ! Remove this
            // public async getSingleLeadData(
            //   where: {},
            //   order: { orderKey: string; orderValue: string },
            //   select: string[],
            // ): Promise<ILead | null> {
            //   try {
            //     let db = getKnexInstance()
            //     let leads = await db(this.table)
            //       .where(where)
            //       .select(...select)
            //       .orderBy(order.orderKey, order.orderValue)
            //       .first()
            //     if (leads == null || leads?.length == 0) {
            //       return null
            //     } else {
            //       return leads // Return the first lead if found
            //     }
            //   } catch (error) {
            //     logger.error('Error Inside lead.ts getLeadData function', error)
            //   }
            // }
            function findAll(where, order, select) {
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
            key: "updateLeadRow",
            value: function updateLeadRow(leadID, dataToUpdate) {
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
                                    db(this.table).where('leadID', leadID).update(dataToUpdate)
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
            key: "insert",
            value: // public async insert(data: {}): Promise<number | null> {
            //   try {
            //     let db = getKnexInstance()
            //     let [insertedID] = await db(this.table).insert(data).returning('id')
            //     return insertedID
            //   } catch (error) {
            //     logger.error('Error Inside leads.ts insert function', error)
            //   }
            // }
            function insert(data) {
                return _async_to_generator(function() {
                    var db, result, insertedID, error;
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
                                    db(this.table).insert(data)
                                ];
                            case 1:
                                result = _state.sent();
                                insertedID = result[0];
                                return [
                                    2,
                                    insertedID
                                ];
                            case 2:
                                error = _state.sent();
                                logger.error('Error Inside leads.ts insert function', error);
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
            key: "findOne",
            value: // Updated findOne
            function findOne(params) {
                return _async_to_generator(function() {
                    var _query, order, _params_select, select, where, whereIn, whereNot, whereNotNull, paginate, db, query;
                    return _ts_generator(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                order = params.order, _params_select = params.select, select = _params_select === void 0 ? [
                                    '*'
                                ] : _params_select, where = params.where, whereIn = params.whereIn, whereNot = params.whereNot, whereNotNull = params.whereNotNull, paginate = params.paginate;
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
            key: "countLeads",
            value: function countLeads(where, whereNot) {
                return _async_to_generator(function() {
                    var db, count, data;
                    return _ts_generator(this, function(_state) {
                        switch(_state.label){
                            case 0:
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
        }
    ]);
    return LeadModel;
}();
export { LeadModel as default };
export var leadModel = new LeadModel();

//# sourceMappingURL=leads.js.map