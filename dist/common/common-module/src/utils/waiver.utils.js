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
import config from '@/config/default';
import { CollectedMode } from '@/enums/collection.enum';
import { ProductID } from '@/enums/product.enum';
import moment from 'moment';
import { WaiverModel } from '../database/mysql/waiver';
import { CollectionStatus } from '../enums/collection.enum';
import { LeadStatus } from '../enums/lead.enum';
import { Products } from '../enums/product.enum';
import { WaiverStatus, WaiverType } from '../enums/waiver.enum';
import CollectionService from '../services/collection.service';
import { leadService } from '../services/lead.service';
import { logger } from './logger';
export var WaiverUtil = /*#__PURE__*/ function() {
    "use strict";
    function WaiverUtil() {
        _class_call_check(this, WaiverUtil);
        _define_property(this, "waiverModel", new WaiverModel());
        _define_property(this, "commonLeadService", leadService);
        _define_property(this, "commonCollectionService", new CollectionService());
    }
    _create_class(WaiverUtil, [
        {
            key: "handlePaydayTemporaryWaiver",
            value: function handlePaydayTemporaryWaiver(remainingAmount, leadDetails, payingAmount) {
                return _async_to_generator(function() {
                    var waivedOffAmount, waiverDetails, expiration_time, amount, waiverId, isExpired, isPartialPayment;
                    return _ts_generator(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                waivedOffAmount = 0;
                                logger.info("Request recieved to handle waiver for lead ".concat(JSON.stringify(leadDetails)));
                                return [
                                    4,
                                    this.waiverModel.findOne({
                                        where: {
                                            lead_id: leadDetails.leadID,
                                            customer_id: leadDetails.customerID,
                                            status: WaiverStatus.APPROVED,
                                            product: Products.PAYDAY,
                                            type: WaiverType.TEMPORARY
                                        }
                                    })
                                ];
                            case 1:
                                waiverDetails = _state.sent();
                                if (!waiverDetails) {
                                    logger.info("No approved temporary payday waiver found for lead ID ".concat(leadDetails.leadID));
                                } else {
                                    expiration_time = waiverDetails.expiration_time, amount = waiverDetails.amount, waiverId = waiverDetails.id;
                                    isExpired = moment().isAfter(moment(expiration_time));
                                    isPartialPayment = remainingAmount - (payingAmount + amount) > 0;
                                    if (isExpired) {
                                        logger.info("Waiver ID ".concat(waiverId, " applicable time has expired."));
                                    } else if (isPartialPayment) {
                                        logger.info("Partial payment case — skipping waiver, Remaining amount: ".concat(remainingAmount, ", \n          Waiver amount: ").concat(amount, ", Waiver ID: ").concat(waiverId, ", value of partial payment: ").concat(isPartialPayment, "\n          based on result ").concat(remainingAmount - (payingAmount + amount)));
                                    } else {
                                        waivedOffAmount = remainingAmount - payingAmount;
                                        logger.info("Waiver applied: ".concat(waivedOffAmount, " waived off using waiver ID ").concat(waiverId));
                                    }
                                }
                                logger.info("Request completed and returing waiver amount ".concat(waivedOffAmount));
                                return [
                                    2,
                                    {
                                        waivedOffAmount: waivedOffAmount,
                                        waiverId: waiverDetails.id
                                    }
                                ];
                        }
                    });
                }).call(this);
            }
        },
        {
            key: "checkAndApplyWaiver",
            value: function checkAndApplyWaiver(leadsQuery, remainingAmount, payingAmount, waiverReference) {
                return _async_to_generator(function() {
                    var waiverAmount, waiverResponse, details, collectionID, collectionData;
                    return _ts_generator(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                logger.info("Request recieved to check and handle waiver for lead details ".concat(JSON.stringify(leadsQuery), " \n    and remaining amount ").concat(remainingAmount));
                                waiverAmount = 0;
                                if (!(leadsQuery.productID === ProductID.PAYDAY)) return [
                                    3,
                                    6
                                ];
                                return [
                                    4,
                                    this.handlePaydayTemporaryWaiver(remainingAmount, leadsQuery, payingAmount)
                                ];
                            case 1:
                                waiverResponse = _state.sent();
                                waiverAmount = waiverResponse.waivedOffAmount;
                                if (!(waiverAmount && waiverAmount > 0)) return [
                                    3,
                                    6
                                ];
                                logger.info("Finally applying waiver for amount ".concat(waiverAmount, " and inserting in collection table"));
                                return [
                                    4,
                                    this.commonLeadService.addCollectionDetails({
                                        leadID: leadsQuery.leadID,
                                        collectedAmount: waiverAmount,
                                        collectedMode: CollectedMode.WAIVE_OFF,
                                        collectedDate: moment().format('YYYY-MM-DD'),
                                        referenceNo: waiverReference,
                                        // settlemenAmount: waiverAmount, // ! Waiver: discount_waiver_amount me jayega
                                        status: CollectionStatus.PART_PAYMENT,
                                        remark: 'waive off done',
                                        userID: +config.defaultUserId,
                                        collectionStatus: CollectionStatus.APPROVED,
                                        // discount_waiver_amount: waiverAmount.toString(),
                                        discount_waiver: 'waiver'
                                    })
                                ];
                            case 2:
                                details = _state.sent();
                                collectionID = details.data.collectionID;
                                if (!!collectionID) return [
                                    3,
                                    4
                                ];
                                return [
                                    4,
                                    this.commonCollectionService.findOne({
                                        leadID: leadsQuery.leadID,
                                        collectedAmount: waiverAmount,
                                        discount_waiver: 'waiver',
                                        collectedMode: CollectedMode.WAIVE_OFF,
                                        customerID: leadsQuery.customerID
                                    })
                                ];
                            case 3:
                                collectionData = _state.sent();
                                collectionID = collectionData.collectionID;
                                _state.label = 4;
                            case 4:
                                // await this.commonCollectionService.collectionManagerAction(
                                //   {
                                //     collectionID: collectionID,
                                //     transactionID: 0,
                                //     action: 'Accepted',
                                //     type: Products.PAYDAY,
                                //   },
                                //   +config.defaultUserId,
                                // ),
                                return [
                                    4,
                                    Promise.all([
                                        this.commonLeadService.updateOne({
                                            leadID: leadsQuery.leadID
                                        }, {
                                            status: LeadStatus.PART_PAYMENT
                                        }),
                                        this.waiverModel.findOneAndUpdate({
                                            id: waiverResponse.waiverId
                                        }, {
                                            is_paid: true,
                                            updated_at: moment().format('YYYY-MM-DD HH:mm:ss'),
                                            collection_id: collectionID
                                        })
                                    ])
                                ];
                            case 5:
                                _state.sent();
                                _state.label = 6;
                            case 6:
                                logger.info("Request completed and returing back to consumer for lead id ".concat(leadsQuery.leadID));
                                return [
                                    2,
                                    waiverAmount
                                ];
                        }
                    });
                }).call(this);
            }
        }
    ]);
    return WaiverUtil;
}();

//# sourceMappingURL=waiver.utils.js.map