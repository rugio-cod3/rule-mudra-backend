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
import { LeadLogApiType } from '../../enums/common.enum';
import { logger } from '../../utils/logger';
import { getKnexInstance } from '../../utils/mysql';
import { maskString } from '../../utils/util';
var UserMetaDataModel = /*#__PURE__*/ function() {
    "use strict";
    function UserMetaDataModel() {
        _class_call_check(this, UserMetaDataModel);
        _define_property(this, "table", 'user_metadata');
    }
    _create_class(UserMetaDataModel, [
        {
            key: "getUserMetaDatas",
            value: function getUserMetaDatas(where, order, select) {
                return _async_to_generator(function() {
                    var _db_where, db, metadata, error;
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
                                metadata = _state.sent();
                                if (metadata == null || metadata.length == 0) {
                                    return [
                                        2,
                                        []
                                    ];
                                } else {
                                    return [
                                        2,
                                        metadata // Return the first lead if found
                                    ];
                                }
                                return [
                                    3,
                                    3
                                ];
                            case 2:
                                error = _state.sent();
                                logger.error('Error Inside user_metadata.ts getUserMetaDatas function', error);
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
            key: "getUserMetaData",
            value: function getUserMetaData(where, order, select) {
                return _async_to_generator(function() {
                    var _db_where, db, metadata, error;
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
                                    (_db_where = db(this.table).where(where)).select.apply(_db_where, _to_consumable_array(select)).orderBy(order.orderKey, order.orderValue).limit(1)
                                ];
                            case 1:
                                metadata = _state.sent();
                                if (metadata == null || metadata.length == 0) {
                                    return [
                                        2,
                                        null
                                    ];
                                } else {
                                    return [
                                        2,
                                        metadata[0] // Return the first lead if found
                                    ];
                                }
                                return [
                                    3,
                                    3
                                ];
                            case 2:
                                error = _state.sent();
                                logger.error('Error Inside user_metadata.ts getUserMetaData function', error);
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
            value: function findOneAndUpdate(where, update) {
                return _async_to_generator(function() {
                    var db;
                    return _ts_generator(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                db = getKnexInstance();
                                return [
                                    4,
                                    db(this.table).where(where).update(update)
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
            key: "findOneUserMetaData",
            value: function findOneUserMetaData(_0, _1) {
                return _async_to_generator(function(where) {
                    var select, orderBy, _db_where, db, query;
                    var _arguments = arguments;
                    return _ts_generator(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                select = _arguments.length > 1 && _arguments[1] !== void 0 ? _arguments[1] : [
                                    '*'
                                ], orderBy = _arguments.length > 2 ? _arguments[2] : void 0;
                                db = getKnexInstance();
                                query = (_db_where = db(this.table).where(where)).select.apply(_db_where, _to_consumable_array(select));
                                if (orderBy) query.orderBy(orderBy);
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
            key: "createOrUpdateUserMeta",
            value: function createOrUpdateUserMeta(payload) {
                return _async_to_generator(function() {
                    var customerID, type, data, mobile, userMeta, userMetaJson, isUserMetaExists, surePassPanNo, surePassMaskedAadhar, surePassPanGender, surePassPanName, _data_address, surePassPanAddress, surePassPanDob, userMetaPanJson, metaJsonUpdate, _surePassAadharAddress_country, _surePassAadharAddress_dist, _surePassAadharAddress_house, _surePassAadharAddress_landmark, _surePassAadharAddress_loc, _surePassAadharAddress_po, _surePassAadharAddress_state, _surePassAadharAddress_street, _surePassAadharAddress_subdist, _surePassAadharAddress_vtc, _surePassAadharAddress_country1, _surePassAadharAddress_country2, _surePassAadharAddress_dist1, _surePassAadharAddress_state1, _surePassAadharAddress_po1, _surePassAadharAddress_loc1, _surePassAadharAddress_vtc1, _surePassAadharAddress_subdist1, _surePassAadharAddress_street1, _surePassAadharAddress_house1, _surePassAadharAddress_landmark1, surePassAadharNo, surePassAadharFullName, surePassAadharGender, surePassAadharDob, surePassAadharAddress, surePassAadharPdfLink, surePassAadharImage, userMetaSurepassAadharJson, metaJsonUpdateAadhar, digiAadharNo, _data_proofOfIdentity, digiAadharName, digiAadharDob, digiAadharGender, _data_proofOfAddress, country, district, state, postOffice, locality, vtc, subDistrict, street, house, landmark, image, pdf, userMetaDigiAadharJson, metaJsonUpdateAadharDigi, surePassPanNo1, surePassMaskedAadhar1, surePassPanGender1, surePassPanName1, _data_address1, surePassPanAddress1, surePassPanDob1, userMetaPanJson1, _surePassAadharAddress_country3, _surePassAadharAddress_dist2, _surePassAadharAddress_house2, _surePassAadharAddress_landmark2, _surePassAadharAddress_loc2, _surePassAadharAddress_po2, _surePassAadharAddress_state2, _surePassAadharAddress_street2, _surePassAadharAddress_subdist2, _surePassAadharAddress_vtc2, _surePassAadharAddress_country4, _surePassAadharAddress_country5, _surePassAadharAddress_dist3, _surePassAadharAddress_state3, _surePassAadharAddress_po3, _surePassAadharAddress_loc3, _surePassAadharAddress_vtc3, _surePassAadharAddress_subdist3, _surePassAadharAddress_street3, _surePassAadharAddress_house3, _surePassAadharAddress_landmark3, surePassAadharNo1, surePassAadharFullName1, surePassAadharGender1, surePassAadharDob1, surePassAadharAddress1, surePassAadharPdfLink1, surePassAadharImage1, userMetaSurepassAadharJson1, digiAadharNo1, _data_proofOfIdentity1, digiAadharName1, digiAadharDob1, digiAadharGender1, _data_proofOfAddress1, country1, district1, state1, postOffice1, locality1, vtc1, subDistrict1, street1, house1, landmark1, image1, pdf1, userMetaDigiAadharJson1;
                    return _ts_generator(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                customerID = payload.customerID, type = payload.type, data = payload.data, mobile = payload.mobile;
                                return [
                                    4,
                                    this.findOneUserMetaData({
                                        customerID: customerID
                                    })
                                ];
                            case 1:
                                userMeta = _state.sent();
                                if (!userMeta) return [
                                    3,
                                    9
                                ];
                                userMetaJson = JSON.parse(userMeta.metaJSON);
                                isUserMetaExists = userMetaJson ? true : false;
                                switch(type){
                                    case LeadLogApiType.PAN_COMPREHENSIVE:
                                        return [
                                            3,
                                            2
                                        ];
                                    case LeadLogApiType.AADHAR_V2_SUBMIT_OTP:
                                        return [
                                            3,
                                            4
                                        ];
                                    case LeadLogApiType.DIGILOCKER_EAADHAR:
                                        return [
                                            3,
                                            6
                                        ];
                                }
                                return [
                                    3,
                                    8
                                ];
                            case 2:
                                surePassPanNo = data.pan_number, surePassMaskedAadhar = data.masked_aadhaar, surePassPanGender = data.gender, surePassPanName = data.full_name, _data_address = data.address, surePassPanAddress = _data_address.full, surePassPanDob = data.dob;
                                // if not exist then add
                                userMetaPanJson = _define_property({}, LeadLogApiType.PAN_COMPREHENSIVE, {
                                    address: surePassPanAddress !== null && surePassPanAddress !== void 0 ? surePassPanAddress : '',
                                    dob: surePassPanDob !== null && surePassPanDob !== void 0 ? surePassPanDob : '',
                                    fullName: surePassPanName !== null && surePassPanName !== void 0 ? surePassPanName : '',
                                    gender: surePassPanGender !== null && surePassPanGender !== void 0 ? surePassPanGender : '',
                                    maskAadhar: surePassMaskedAadhar !== null && surePassMaskedAadhar !== void 0 ? surePassMaskedAadhar : '',
                                    pancard_no: surePassPanNo !== null && surePassPanNo !== void 0 ? surePassPanNo : ''
                                });
                                metaJsonUpdate = userMetaPanJson;
                                if (isUserMetaExists && !userMetaJson[LeadLogApiType.PAN_COMPREHENSIVE]) {
                                    metaJsonUpdate = _object_spread({}, metaJsonUpdate, userMetaJson);
                                } else if (isUserMetaExists && userMetaJson[LeadLogApiType.PAN_COMPREHENSIVE]) {
                                    return [
                                        3,
                                        8
                                    ];
                                }
                                return [
                                    4,
                                    this.findOneAndUpdate({
                                        customerID: customerID
                                    }, {
                                        metaJSON: JSON.stringify(metaJsonUpdate)
                                    })
                                ];
                            case 3:
                                _state.sent();
                                return [
                                    3,
                                    8
                                ];
                            case 4:
                                surePassAadharNo = data.aadhaar_number, surePassAadharFullName = data.full_name, surePassAadharGender = data.gender, surePassAadharDob = data.dob, surePassAadharAddress = data.address, surePassAadharPdfLink = data.aadhaar_pdf, surePassAadharImage = data.profile_image;
                                userMetaSurepassAadharJson = _define_property({}, LeadLogApiType.AADHAR_V2_SUBMIT_OTP, {
                                    // Check JSON
                                    gender: surePassAadharGender !== null && surePassAadharGender !== void 0 ? surePassAadharGender : '',
                                    fullName: surePassAadharFullName !== null && surePassAadharFullName !== void 0 ? surePassAadharFullName : '',
                                    aadhar_no: surePassAadharNo,
                                    aadhar_image: surePassAadharImage !== null && surePassAadharImage !== void 0 ? surePassAadharImage : '',
                                    aadhar_pdf: surePassAadharPdfLink !== null && surePassAadharPdfLink !== void 0 ? surePassAadharPdfLink : '',
                                    dob: surePassAadharDob,
                                    maskAadhar: maskString(surePassAadharNo, 8),
                                    address_json: {
                                        country: (_surePassAadharAddress_country = surePassAadharAddress.country) !== null && _surePassAadharAddress_country !== void 0 ? _surePassAadharAddress_country : '',
                                        dist: (_surePassAadharAddress_dist = surePassAadharAddress.dist) !== null && _surePassAadharAddress_dist !== void 0 ? _surePassAadharAddress_dist : '',
                                        house: (_surePassAadharAddress_house = surePassAadharAddress.house) !== null && _surePassAadharAddress_house !== void 0 ? _surePassAadharAddress_house : '',
                                        landmark: (_surePassAadharAddress_landmark = surePassAadharAddress.landmark) !== null && _surePassAadharAddress_landmark !== void 0 ? _surePassAadharAddress_landmark : '',
                                        loc: (_surePassAadharAddress_loc = surePassAadharAddress.loc) !== null && _surePassAadharAddress_loc !== void 0 ? _surePassAadharAddress_loc : '',
                                        po: (_surePassAadharAddress_po = surePassAadharAddress.po) !== null && _surePassAadharAddress_po !== void 0 ? _surePassAadharAddress_po : '',
                                        state: (_surePassAadharAddress_state = surePassAadharAddress.state) !== null && _surePassAadharAddress_state !== void 0 ? _surePassAadharAddress_state : '',
                                        street: (_surePassAadharAddress_street = surePassAadharAddress.street) !== null && _surePassAadharAddress_street !== void 0 ? _surePassAadharAddress_street : '',
                                        subdist: (_surePassAadharAddress_subdist = surePassAadharAddress.subdist) !== null && _surePassAadharAddress_subdist !== void 0 ? _surePassAadharAddress_subdist : '',
                                        vtc: (_surePassAadharAddress_vtc = surePassAadharAddress.vtc) !== null && _surePassAadharAddress_vtc !== void 0 ? _surePassAadharAddress_vtc : ''
                                    },
                                    address: "".concat((_surePassAadharAddress_country1 = surePassAadharAddress.country) !== null && _surePassAadharAddress_country1 !== void 0 ? _surePassAadharAddress_country1 : '', "/").concat((_surePassAadharAddress_country2 = surePassAadharAddress.country) !== null && _surePassAadharAddress_country2 !== void 0 ? _surePassAadharAddress_country2 : '', "/").concat((_surePassAadharAddress_dist1 = surePassAadharAddress.dist) !== null && _surePassAadharAddress_dist1 !== void 0 ? _surePassAadharAddress_dist1 : '', "/").concat((_surePassAadharAddress_state1 = surePassAadharAddress.state) !== null && _surePassAadharAddress_state1 !== void 0 ? _surePassAadharAddress_state1 : '', "/").concat((_surePassAadharAddress_po1 = surePassAadharAddress.po) !== null && _surePassAadharAddress_po1 !== void 0 ? _surePassAadharAddress_po1 : '', "/").concat((_surePassAadharAddress_loc1 = surePassAadharAddress.loc) !== null && _surePassAadharAddress_loc1 !== void 0 ? _surePassAadharAddress_loc1 : '', "/").concat((_surePassAadharAddress_vtc1 = surePassAadharAddress.vtc) !== null && _surePassAadharAddress_vtc1 !== void 0 ? _surePassAadharAddress_vtc1 : '', "/").concat((_surePassAadharAddress_subdist1 = surePassAadharAddress.subdist) !== null && _surePassAadharAddress_subdist1 !== void 0 ? _surePassAadharAddress_subdist1 : '', "/").concat((_surePassAadharAddress_street1 = surePassAadharAddress.street) !== null && _surePassAadharAddress_street1 !== void 0 ? _surePassAadharAddress_street1 : '', "/").concat((_surePassAadharAddress_house1 = surePassAadharAddress.house) !== null && _surePassAadharAddress_house1 !== void 0 ? _surePassAadharAddress_house1 : '', "/").concat((_surePassAadharAddress_landmark1 = surePassAadharAddress.landmark) !== null && _surePassAadharAddress_landmark1 !== void 0 ? _surePassAadharAddress_landmark1 : '')
                                });
                                metaJsonUpdateAadhar = userMetaSurepassAadharJson;
                                if (isUserMetaExists && !userMetaJson[LeadLogApiType.AADHAR_V2_SUBMIT_OTP]) {
                                    metaJsonUpdateAadhar = _object_spread({}, metaJsonUpdateAadhar, userMetaJson);
                                } else if (isUserMetaExists && userMetaJson[LeadLogApiType.AADHAR_V2_SUBMIT_OTP]) {
                                    return [
                                        3,
                                        8
                                    ];
                                }
                                return [
                                    4,
                                    this.findOneAndUpdate({
                                        customerID: customerID
                                    }, {
                                        metaJSON: JSON.stringify(metaJsonUpdateAadhar)
                                    })
                                ];
                            case 5:
                                _state.sent();
                                return [
                                    3,
                                    8
                                ];
                            case 6:
                                digiAadharNo = data.aadhaarUid, _data_proofOfIdentity = data.proofOfIdentity, digiAadharName = _data_proofOfIdentity.name, digiAadharDob = _data_proofOfIdentity.dob, digiAadharGender = _data_proofOfIdentity.gender, _data_proofOfAddress = data.proofOfAddress, country = _data_proofOfAddress.country, district = _data_proofOfAddress.district, state = _data_proofOfAddress.state, postOffice = _data_proofOfAddress.postOffice, locality = _data_proofOfAddress.locality, vtc = _data_proofOfAddress.vtc, subDistrict = _data_proofOfAddress.subDistrict, street = _data_proofOfAddress.street, house = _data_proofOfAddress.house, landmark = _data_proofOfAddress.landmark, image = data.image, pdf = data.pdf;
                                userMetaDigiAadharJson = _define_property({}, LeadLogApiType.DIGILOCKER_EAADHAR, {
                                    // Check JSON
                                    gender: digiAadharGender !== null && digiAadharGender !== void 0 ? digiAadharGender : '',
                                    fullName: digiAadharName !== null && digiAadharName !== void 0 ? digiAadharName : '',
                                    aadhar_no: digiAadharNo,
                                    aadhar_image: image !== null && image !== void 0 ? image : '',
                                    aadhar_pdf: pdf !== null && pdf !== void 0 ? pdf : '',
                                    dob: digiAadharDob,
                                    maskAadhar: digiAadharNo,
                                    address_json: {
                                        country: country !== null && country !== void 0 ? country : '',
                                        dist: district !== null && district !== void 0 ? district : '',
                                        house: house !== null && house !== void 0 ? house : '',
                                        landmark: landmark !== null && landmark !== void 0 ? landmark : '',
                                        loc: locality !== null && locality !== void 0 ? locality : '',
                                        po: postOffice !== null && postOffice !== void 0 ? postOffice : '',
                                        state: state !== null && state !== void 0 ? state : '',
                                        street: street !== null && street !== void 0 ? street : '',
                                        subdist: subDistrict !== null && subDistrict !== void 0 ? subDistrict : '',
                                        vtc: vtc !== null && vtc !== void 0 ? vtc : ''
                                    },
                                    address: "".concat(country !== null && country !== void 0 ? country : '', "/").concat(district !== null && district !== void 0 ? district : '', "/").concat(state !== null && state !== void 0 ? state : '', "/").concat(postOffice !== null && postOffice !== void 0 ? postOffice : '', "/").concat(locality !== null && locality !== void 0 ? locality : '', "/").concat(vtc !== null && vtc !== void 0 ? vtc : '', "/").concat(subDistrict !== null && subDistrict !== void 0 ? subDistrict : '', "/").concat(street !== null && street !== void 0 ? street : '', "/").concat(house !== null && house !== void 0 ? house : '', "/").concat(landmark !== null && landmark !== void 0 ? landmark : '')
                                });
                                metaJsonUpdateAadharDigi = userMetaDigiAadharJson;
                                if (isUserMetaExists && !userMetaJson[LeadLogApiType.DIGILOCKER_EAADHAR]) {
                                    metaJsonUpdateAadharDigi = _object_spread({}, metaJsonUpdateAadharDigi, userMetaJson);
                                } else if (isUserMetaExists && userMetaJson[LeadLogApiType.DIGILOCKER_EAADHAR]) {
                                    return [
                                        3,
                                        8
                                    ];
                                }
                                return [
                                    4,
                                    this.findOneAndUpdate({
                                        customerID: customerID
                                    }, {
                                        metaJSON: JSON.stringify(metaJsonUpdateAadharDigi)
                                    })
                                ];
                            case 7:
                                _state.sent();
                                return [
                                    3,
                                    8
                                ];
                            case 8:
                                return [
                                    3,
                                    16
                                ];
                            case 9:
                                switch(type){
                                    case LeadLogApiType.PAN_COMPREHENSIVE:
                                        return [
                                            3,
                                            10
                                        ];
                                    case LeadLogApiType.AADHAR_V2_SUBMIT_OTP:
                                        return [
                                            3,
                                            12
                                        ];
                                    case LeadLogApiType.DIGILOCKER_EAADHAR:
                                        return [
                                            3,
                                            14
                                        ];
                                }
                                return [
                                    3,
                                    16
                                ];
                            case 10:
                                surePassPanNo1 = data.pan_number, surePassMaskedAadhar1 = data.masked_aadhaar, surePassPanGender1 = data.gender, surePassPanName1 = data.full_name, _data_address1 = data.address, surePassPanAddress1 = _data_address1.full, surePassPanDob1 = data.dob;
                                // if not exist then add
                                userMetaPanJson1 = _define_property({}, LeadLogApiType.PAN_COMPREHENSIVE, {
                                    address: surePassPanAddress1 !== null && surePassPanAddress1 !== void 0 ? surePassPanAddress1 : '',
                                    dob: surePassPanDob1 !== null && surePassPanDob1 !== void 0 ? surePassPanDob1 : '',
                                    fullName: surePassPanName1 !== null && surePassPanName1 !== void 0 ? surePassPanName1 : '',
                                    gender: surePassPanGender1 !== null && surePassPanGender1 !== void 0 ? surePassPanGender1 : '',
                                    maskAadhar: surePassMaskedAadhar1 !== null && surePassMaskedAadhar1 !== void 0 ? surePassMaskedAadhar1 : '',
                                    pancard_no: surePassPanNo1 !== null && surePassPanNo1 !== void 0 ? surePassPanNo1 : ''
                                });
                                return [
                                    4,
                                    this.insert({
                                        customerID: customerID,
                                        metaJSON: JSON.stringify(userMetaPanJson1),
                                        panVerify: surePassPanNo1,
                                        aadhar_mask: surePassMaskedAadhar1,
                                        mobile: mobile
                                    })
                                ];
                            case 11:
                                _state.sent();
                                return [
                                    3,
                                    16
                                ];
                            case 12:
                                surePassAadharNo1 = data.aadhaar_number, surePassAadharFullName1 = data.full_name, surePassAadharGender1 = data.gender, surePassAadharDob1 = data.dob, surePassAadharAddress1 = data.address, surePassAadharPdfLink1 = data.aadhaar_pdf, surePassAadharImage1 = data.profile_image;
                                userMetaSurepassAadharJson1 = _define_property({}, LeadLogApiType.AADHAR_V2_SUBMIT_OTP, {
                                    // Check JSON
                                    gender: surePassAadharGender1 !== null && surePassAadharGender1 !== void 0 ? surePassAadharGender1 : '',
                                    fullName: surePassAadharFullName1 !== null && surePassAadharFullName1 !== void 0 ? surePassAadharFullName1 : '',
                                    aadhar_no: surePassAadharNo1,
                                    aadhar_image: surePassAadharImage1 !== null && surePassAadharImage1 !== void 0 ? surePassAadharImage1 : '',
                                    aadhar_pdf: surePassAadharPdfLink1 !== null && surePassAadharPdfLink1 !== void 0 ? surePassAadharPdfLink1 : '',
                                    dob: surePassAadharDob1,
                                    maskAadhar: maskString(surePassAadharNo1, 8),
                                    address_json: {
                                        country: (_surePassAadharAddress_country3 = surePassAadharAddress1.country) !== null && _surePassAadharAddress_country3 !== void 0 ? _surePassAadharAddress_country3 : '',
                                        dist: (_surePassAadharAddress_dist2 = surePassAadharAddress1.dist) !== null && _surePassAadharAddress_dist2 !== void 0 ? _surePassAadharAddress_dist2 : '',
                                        house: (_surePassAadharAddress_house2 = surePassAadharAddress1.house) !== null && _surePassAadharAddress_house2 !== void 0 ? _surePassAadharAddress_house2 : '',
                                        landmark: (_surePassAadharAddress_landmark2 = surePassAadharAddress1.landmark) !== null && _surePassAadharAddress_landmark2 !== void 0 ? _surePassAadharAddress_landmark2 : '',
                                        loc: (_surePassAadharAddress_loc2 = surePassAadharAddress1.loc) !== null && _surePassAadharAddress_loc2 !== void 0 ? _surePassAadharAddress_loc2 : '',
                                        po: (_surePassAadharAddress_po2 = surePassAadharAddress1.po) !== null && _surePassAadharAddress_po2 !== void 0 ? _surePassAadharAddress_po2 : '',
                                        state: (_surePassAadharAddress_state2 = surePassAadharAddress1.state) !== null && _surePassAadharAddress_state2 !== void 0 ? _surePassAadharAddress_state2 : '',
                                        street: (_surePassAadharAddress_street2 = surePassAadharAddress1.street) !== null && _surePassAadharAddress_street2 !== void 0 ? _surePassAadharAddress_street2 : '',
                                        subdist: (_surePassAadharAddress_subdist2 = surePassAadharAddress1.subdist) !== null && _surePassAadharAddress_subdist2 !== void 0 ? _surePassAadharAddress_subdist2 : '',
                                        vtc: (_surePassAadharAddress_vtc2 = surePassAadharAddress1.vtc) !== null && _surePassAadharAddress_vtc2 !== void 0 ? _surePassAadharAddress_vtc2 : ''
                                    },
                                    address: "".concat((_surePassAadharAddress_country4 = surePassAadharAddress1.country) !== null && _surePassAadharAddress_country4 !== void 0 ? _surePassAadharAddress_country4 : '', "/").concat((_surePassAadharAddress_country5 = surePassAadharAddress1.country) !== null && _surePassAadharAddress_country5 !== void 0 ? _surePassAadharAddress_country5 : '', "/").concat((_surePassAadharAddress_dist3 = surePassAadharAddress1.dist) !== null && _surePassAadharAddress_dist3 !== void 0 ? _surePassAadharAddress_dist3 : '', "/").concat((_surePassAadharAddress_state3 = surePassAadharAddress1.state) !== null && _surePassAadharAddress_state3 !== void 0 ? _surePassAadharAddress_state3 : '', "/").concat((_surePassAadharAddress_po3 = surePassAadharAddress1.po) !== null && _surePassAadharAddress_po3 !== void 0 ? _surePassAadharAddress_po3 : '', "/").concat((_surePassAadharAddress_loc3 = surePassAadharAddress1.loc) !== null && _surePassAadharAddress_loc3 !== void 0 ? _surePassAadharAddress_loc3 : '', "/").concat((_surePassAadharAddress_vtc3 = surePassAadharAddress1.vtc) !== null && _surePassAadharAddress_vtc3 !== void 0 ? _surePassAadharAddress_vtc3 : '', "/").concat((_surePassAadharAddress_subdist3 = surePassAadharAddress1.subdist) !== null && _surePassAadharAddress_subdist3 !== void 0 ? _surePassAadharAddress_subdist3 : '', "/").concat((_surePassAadharAddress_street3 = surePassAadharAddress1.street) !== null && _surePassAadharAddress_street3 !== void 0 ? _surePassAadharAddress_street3 : '', "/").concat((_surePassAadharAddress_house3 = surePassAadharAddress1.house) !== null && _surePassAadharAddress_house3 !== void 0 ? _surePassAadharAddress_house3 : '', "/").concat((_surePassAadharAddress_landmark3 = surePassAadharAddress1.landmark) !== null && _surePassAadharAddress_landmark3 !== void 0 ? _surePassAadharAddress_landmark3 : '')
                                });
                                return [
                                    4,
                                    this.insert({
                                        customerID: customerID,
                                        mobile: mobile,
                                        metaJSON: JSON.stringify(userMetaSurepassAadharJson1),
                                        profile_image: surePassAadharImage1 !== null && surePassAadharImage1 !== void 0 ? surePassAadharImage1 : '',
                                        aadharVerify: surePassAadharNo1,
                                        aadhar_mask: userMetaSurepassAadharJson1['aadhaar-v2-submit-otp'].maskAadhar
                                    })
                                ];
                            case 13:
                                _state.sent();
                                return [
                                    3,
                                    16
                                ];
                            case 14:
                                digiAadharNo1 = data.aadhaarUid, _data_proofOfIdentity1 = data.proofOfIdentity, digiAadharName1 = _data_proofOfIdentity1.name, digiAadharDob1 = _data_proofOfIdentity1.dob, digiAadharGender1 = _data_proofOfIdentity1.gender, _data_proofOfAddress1 = data.proofOfAddress, country1 = _data_proofOfAddress1.country, district1 = _data_proofOfAddress1.district, state1 = _data_proofOfAddress1.state, postOffice1 = _data_proofOfAddress1.postOffice, locality1 = _data_proofOfAddress1.locality, vtc1 = _data_proofOfAddress1.vtc, subDistrict1 = _data_proofOfAddress1.subDistrict, street1 = _data_proofOfAddress1.street, house1 = _data_proofOfAddress1.house, landmark1 = _data_proofOfAddress1.landmark, image1 = data.image, pdf1 = data.pdf;
                                userMetaDigiAadharJson1 = _define_property({}, LeadLogApiType.DIGILOCKER_EAADHAR, {
                                    // Check JSON
                                    gender: digiAadharGender1 !== null && digiAadharGender1 !== void 0 ? digiAadharGender1 : '',
                                    fullName: digiAadharName1 !== null && digiAadharName1 !== void 0 ? digiAadharName1 : '',
                                    aadhar_no: digiAadharNo1,
                                    aadhar_image: image1 !== null && image1 !== void 0 ? image1 : '',
                                    aadhar_pdf: pdf1 !== null && pdf1 !== void 0 ? pdf1 : '',
                                    dob: digiAadharDob1,
                                    maskAadhar: digiAadharNo1,
                                    address_json: {
                                        country: country1 !== null && country1 !== void 0 ? country1 : '',
                                        dist: district1 !== null && district1 !== void 0 ? district1 : '',
                                        house: house1 !== null && house1 !== void 0 ? house1 : '',
                                        landmark: landmark1 !== null && landmark1 !== void 0 ? landmark1 : '',
                                        loc: locality1 !== null && locality1 !== void 0 ? locality1 : '',
                                        po: postOffice1 !== null && postOffice1 !== void 0 ? postOffice1 : '',
                                        state: state1 !== null && state1 !== void 0 ? state1 : '',
                                        street: street1 !== null && street1 !== void 0 ? street1 : '',
                                        subdist: subDistrict1 !== null && subDistrict1 !== void 0 ? subDistrict1 : '',
                                        vtc: vtc1 !== null && vtc1 !== void 0 ? vtc1 : ''
                                    },
                                    address: "".concat(country1 !== null && country1 !== void 0 ? country1 : '', "/").concat(district1 !== null && district1 !== void 0 ? district1 : '', "/").concat(state1 !== null && state1 !== void 0 ? state1 : '', "/").concat(postOffice1 !== null && postOffice1 !== void 0 ? postOffice1 : '', "/").concat(locality1 !== null && locality1 !== void 0 ? locality1 : '', "/").concat(vtc1 !== null && vtc1 !== void 0 ? vtc1 : '', "/").concat(subDistrict1 !== null && subDistrict1 !== void 0 ? subDistrict1 : '', "/").concat(street1 !== null && street1 !== void 0 ? street1 : '', "/").concat(house1 !== null && house1 !== void 0 ? house1 : '', "/").concat(landmark1 !== null && landmark1 !== void 0 ? landmark1 : '')
                                });
                                return [
                                    4,
                                    this.insert({
                                        customerID: customerID,
                                        metaJSON: JSON.stringify(userMetaDigiAadharJson1),
                                        profile_image: image1 !== null && image1 !== void 0 ? image1 : '',
                                        aadharVerify: digiAadharNo1,
                                        aadhar_mask: digiAadharNo1,
                                        mobile: mobile
                                    })
                                ];
                            case 15:
                                _state.sent();
                                return [
                                    3,
                                    16
                                ];
                            case 16:
                                return [
                                    2
                                ];
                        }
                    });
                }).call(this);
            }
        }
    ]);
    return UserMetaDataModel;
}();
export { UserMetaDataModel as default };
export var userMetaDataModel = new UserMetaDataModel();

//# sourceMappingURL=userMetadata.js.map