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
import CreditModel from '../database/mysql/credit';
import EMIHelper from '../helpers/emi.helpers';
import { logger } from '../utils/logger';
var CreditService = /*#__PURE__*/ function() {
    "use strict";
    function CreditService() {
        _class_call_check(this, CreditService);
        _define_property(this, "creditModel", new CreditModel());
        _define_property(this, "emiHelper", new EMIHelper());
    }
    _create_class(CreditService, [
        {
            key: "getCredit",
            value: // ! Remove this
            function getCredit(filter) {
                return _async_to_generator(function() {
                    var credit, error;
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
                                    this.creditModel.getCreditDataByQuery(filter)
                                ];
                            case 1:
                                credit = _state.sent();
                                return [
                                    2,
                                    credit
                                ];
                            case 2:
                                error = _state.sent();
                                logger.error('Error Inside credit.service.ts inside getCredit', error);
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
            key: "createCredit",
            value: function createCredit(customerID, leadID, productID, foir, aqb, branch, loanAmount, roi, tenure, processingFee) {
                return _async_to_generator(function() {
                    var emiDoc, principal, intrest, amountToBeRepayed, paidAmount, repaymentAmount, totalEmis, emiLeft, credit, error;
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
                                    this.emiHelper.emiGenerator(loanAmount, roi, tenure)
                                ];
                            case 1:
                                emiDoc = _state.sent();
                                if (!emiDoc) {
                                    return [
                                        2,
                                        {
                                            success: false,
                                            message: 'Error In Generating EMI',
                                            statusCode: 400
                                        }
                                    ];
                                }
                                // console.log(emiDoc);
                                principal = emiDoc.amount;
                                intrest = emiDoc === null || emiDoc === void 0 ? void 0 : emiDoc.interest;
                                amountToBeRepayed = emiDoc.repaymentAmount;
                                paidAmount = 0;
                                repaymentAmount = 0;
                                totalEmis = emiDoc.totalEMIs;
                                emiLeft = emiDoc.EMILeft;
                                return [
                                    4,
                                    this.creditModel.insertCreditData(customerID, leadID, productID, foir, aqb, branch, roi, tenure, intrest, paidAmount, repaymentAmount, totalEmis, emiLeft, processingFee, principal, amountToBeRepayed)
                                ];
                            case 2:
                                credit = _state.sent();
                                // console.log(credit)
                                return [
                                    2,
                                    {
                                        success: true,
                                        message: 'Credit Created!',
                                        statusCode: 200,
                                        credit: credit
                                    }
                                ];
                            case 3:
                                error = _state.sent();
                                logger.error('Error Inside product.service.ts inside createProduct', error);
                                return [
                                    2,
                                    null
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
            key: "create",
            value: function create(customerID, leadID, productID, foir, aqb, branch, roi, tenure, processingFee, principal, firstDueDate, gst) {
                return _async_to_generator(function() {
                    var emiDoc, principalAmount, intrest, amountToBeRepayed, paidAmount, repaymentAmount, totalEmis, emiLeft, insertId, error;
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
                                    this.emiHelper.emiGenerator(principal, roi, tenure, firstDueDate)
                                ];
                            case 1:
                                emiDoc = _state.sent();
                                // console.log(emiDoc);
                                principalAmount = emiDoc.amount;
                                intrest = emiDoc === null || emiDoc === void 0 ? void 0 : emiDoc.interest;
                                amountToBeRepayed = emiDoc.repaymentAmount;
                                paidAmount = 0;
                                repaymentAmount = 0;
                                totalEmis = emiDoc.totalEMIs;
                                emiLeft = emiDoc.EMILeft;
                                return [
                                    4,
                                    this.creditModel.insert(customerID, leadID, productID, branch, foir, aqb, roi, tenure, intrest, repaymentAmount, totalEmis, emiLeft, processingFee, paidAmount, 0, 'initiated', principalAmount, amountToBeRepayed, firstDueDate, gst)
                                ];
                            case 2:
                                insertId = _state.sent();
                                return [
                                    2,
                                    insertId
                                ];
                            case 3:
                                error = _state.sent();
                                logger.error(error);
                                return [
                                    2,
                                    {
                                        success: false,
                                        message: 'Internal Server Error',
                                        statusCode: 500
                                    }
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
            key: "updateOne",
            value: function updateOne(where, update) {
                return _async_to_generator(function() {
                    return _ts_generator(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                return [
                                    4,
                                    this.creditModel.findOneAndUpdate(where, update)
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
            value: function findOne(_0, _1) {
                return _async_to_generator(function(where) {
                    var select, order;
                    var _arguments = arguments;
                    return _ts_generator(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                select = _arguments.length > 1 && _arguments[1] !== void 0 ? _arguments[1] : [
                                    '*'
                                ], order = _arguments.length > 2 ? _arguments[2] : void 0;
                                return [
                                    4,
                                    this.creditModel.findOneCredit(where, select, order)
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
            value: function find(where, order, select) {
                return _async_to_generator(function() {
                    var credit, error;
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
                                    this.creditModel.getCreditData(where, order, select)
                                ];
                            case 1:
                                credit = _state.sent();
                                if (credit == null || credit.length == 0) {
                                    return [
                                        2,
                                        null
                                    ];
                                } else {
                                    return [
                                        2,
                                        credit // Return the first lead if found
                                    ];
                                }
                                return [
                                    3,
                                    3
                                ];
                            case 2:
                                error = _state.sent();
                                logger.error(error);
                                return [
                                    2,
                                    {
                                        success: false,
                                        message: 'Internal Server Error',
                                        statusCode: 500
                                    }
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
    return CreditService;
}();
export default CreditService;
export var creditService = new CreditService();

//# sourceMappingURL=credit.service.js.map