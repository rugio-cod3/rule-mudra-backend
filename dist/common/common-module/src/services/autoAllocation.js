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
import { getKnexInstance } from '../utils/mysql';
var AutoAllocationService = /*#__PURE__*/ function() {
    "use strict";
    function AutoAllocationService() {
        _class_call_check(this, AutoAllocationService);
    }
    _create_class(AutoAllocationService, [
        {
            key: "assignLeadToUser",
            value: function assignLeadToUser(startDate, authUserID, authUserName) {
                return _async_to_generator(function() {
                    var db, freshLead, trx, leadQuery, salariedLeadsHighIncome, selfEmployedLeadsHighIncome, salariedLeadsLowIncome, selfEmployedLeadsLowIncome, check, check2, data, error;
                    return _ts_generator(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                db = getKnexInstance();
                                console.log(startDate, authUserID, authUserName);
                                return [
                                    4,
                                    db.transaction()
                                ];
                            case 1:
                                trx = _state.sent();
                                _state.label = 2;
                            case 2:
                                _state.trys.push([
                                    2,
                                    11,
                                    ,
                                    13
                                ]);
                                return [
                                    4,
                                    db('leads').join('callhistoryLogs', 'callhistoryLogs.leadID', 'leads.leadID').whereIn('leads.status', [
                                        'Document Received'
                                    ]).whereIn('leads.fbLeads', [
                                        'Existing Case',
                                        'New Case'
                                    ]).where('callhistoryLogs.createdDate', '>', startDate).whereIn('leads.sanctionalloUID', [
                                        authUserID
                                    ]).whereIn('leads.alloUID', [
                                        authUserID
                                    ]).transacting(trx).first()
                                ];
                            case 3:
                                // Fetch the lead based on the initial criteria
                                freshLead = _state.sent();
                                console.log(freshLead);
                                if (!!freshLead) return [
                                    3,
                                    9
                                ];
                                leadQuery = db('leads').join('callhistoryLogs', 'callhistoryLogs.leadID', 'leads.leadID').join('customer', 'customer.customerID', 'leads.customerID').whereIn('leads.status', [
                                    'Document Received'
                                ]).whereIn('leads.fbLeads', [
                                    'Existing Case',
                                    'New Case'
                                ]).where('callhistoryLogs.createdDate', '>', '2024-01-01').andWhere(function() {
                                    this.where('leads.sanctionalloUID', 0).orWhereNull('leads.sanctionalloUID');
                                }).andWhere(function() {
                                    this.where('leads.alloUID', 0).orWhereNull('leads.alloUID');
                                }).orderBy('leads.monthlyIncome', 'DESC');
                                salariedLeadsHighIncome = leadQuery.clone().where('customer.employeeType', 'Salaried').where('leads.monthlyIncome', '>=', 50000);
                                selfEmployedLeadsHighIncome = leadQuery.clone().where('customer.employeeType', 'Self Employed').where('leads.monthlyIncome', '>=', 50000);
                                salariedLeadsLowIncome = leadQuery.clone().where('customer.employeeType', 'Salaried').where('leads.monthlyIncome', '<', 50000);
                                selfEmployedLeadsLowIncome = leadQuery.clone().where('customer.employeeType', 'Self Employed').where('leads.monthlyIncome', '<', 50000);
                                return [
                                    4,
                                    salariedLeadsHighIncome
                                ];
                            case 4:
                                check = _state.sent();
                                console.log(check);
                                return [
                                    4,
                                    salariedLeadsHighIncome.unionAll([
                                        selfEmployedLeadsHighIncome,
                                        salariedLeadsLowIncome,
                                        selfEmployedLeadsLowIncome
                                    ]).forUpdate().transacting(trx).first()
                                ];
                            case 5:
                                freshLead = _state.sent();
                                return [
                                    4,
                                    selfEmployedLeadsHighIncome
                                ];
                            case 6:
                                check2 = _state.sent();
                                console.log(check2);
                                if (!freshLead) return [
                                    3,
                                    9
                                ];
                                return [
                                    4,
                                    db('leads').where('leadID', freshLead.leadID).update({
                                        sanctionalloUID: authUserID,
                                        alloUID: authUserID
                                    }).transacting(trx)
                                ];
                            case 7:
                                _state.sent();
                                data = {
                                    customerID: freshLead.customerID,
                                    leadID: freshLead.leadID,
                                    callType: 'IVR',
                                    status: 'Lead Allocated',
                                    remark: "Lead Allocated to ".concat(authUserName),
                                    noteli: ' ',
                                    callbackTime: new Date().toISOString().split('T')[0],
                                    calledBy: authUserID,
                                    createdDate: new Date().toISOString()
                                };
                                return [
                                    4,
                                    db('callhistoryLogs').insert(data).transacting(trx)
                                ];
                            case 8:
                                _state.sent();
                                _state.label = 9;
                            case 9:
                                return [
                                    4,
                                    trx.commit()
                                ];
                            case 10:
                                _state.sent();
                                return [
                                    3,
                                    13
                                ];
                            case 11:
                                error = _state.sent();
                                return [
                                    4,
                                    trx.rollback()
                                ];
                            case 12:
                                _state.sent();
                                console.error('Error assigning lead:', error);
                                throw error // Re-throw the error after rollback
                                ;
                            case 13:
                                return [
                                    2,
                                    freshLead ? freshLead.leadID : 0
                                ];
                        }
                    });
                })();
            }
        }
    ]);
    return AutoAllocationService;
}();
export { AutoAllocationService };

//# sourceMappingURL=autoAllocation.js.map