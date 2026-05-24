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
function _object_without_properties(source, excluded) {
    if (source == null) return {};
    var target = {}, sourceKeys, key, i;
    if (typeof Reflect !== "undefined" && Reflect.ownKeys) {
        sourceKeys = Reflect.ownKeys(Object(source));
        for(i = 0; i < sourceKeys.length; i++){
            key = sourceKeys[i];
            if (excluded.indexOf(key) >= 0) continue;
            if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
            target[key] = source[key];
        }
        return target;
    }
    target = _object_without_properties_loose(source, excluded);
    if (Object.getOwnPropertySymbols) {
        sourceKeys = Object.getOwnPropertySymbols(source);
        for(i = 0; i < sourceKeys.length; i++){
            key = sourceKeys[i];
            if (excluded.indexOf(key) >= 0) continue;
            if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
            target[key] = source[key];
        }
    }
    return target;
}
function _object_without_properties_loose(source, excluded) {
    if (source == null) return {};
    var target = {}, sourceKeys = Object.getOwnPropertyNames(source), key, i;
    for(i = 0; i < sourceKeys.length; i++){
        key = sourceKeys[i];
        if (excluded.indexOf(key) >= 0) continue;
        if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
        target[key] = source[key];
    }
    return target;
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
import md5 from 'md5';
import { BadRequestError, NotFoundError } from '../../errors';
import { logger } from '../../utils/logger';
import { getKnexInstance } from '../../utils/mysql';
import { isEmpty } from '../../utils/util';
var UserModel = /*#__PURE__*/ function() {
    "use strict";
    function UserModel() {
        _class_call_check(this, UserModel);
        _define_property(this, "table", 'users');
    }
    _create_class(UserModel, [
        {
            key: "UsersKnex",
            get: function get() {
                var db = getKnexInstance();
                return db(this.table);
            }
        },
        {
            key: "findOneUser",
            value: // Find a single user by a condition
            function findOneUser(_0) {
                return _async_to_generator(function(where) {
                    var select, _db_table_where, db, user, error;
                    var _arguments = arguments;
                    return _ts_generator(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                select = _arguments.length > 1 && _arguments[1] !== void 0 ? _arguments[1] : [
                                    '*'
                                ];
                                _state.label = 1;
                            case 1:
                                _state.trys.push([
                                    1,
                                    3,
                                    ,
                                    4
                                ]);
                                db = getKnexInstance();
                                return [
                                    4,
                                    (_db_table_where = db.table(this.table).where(where)).select.apply(_db_table_where, _to_consumable_array(select)).first()
                                ];
                            case 2:
                                user = _state.sent();
                                return [
                                    2,
                                    user || null
                                ];
                            case 3:
                                error = _state.sent();
                                logger.error('Error Inside UserModel findOneUser function', error);
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
                }).apply(this, arguments);
            }
        },
        {
            key: "getUsers",
            value: // Get multiple users with specific conditions
            function getUsers(where, order, select) {
                return _async_to_generator(function() {
                    var _db_where, db, users, error;
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
                                users = _state.sent();
                                return [
                                    2,
                                    users.length ? users : []
                                ];
                            case 2:
                                error = _state.sent();
                                logger.error('Error Inside UserModel getUsers function', error);
                                return [
                                    2,
                                    []
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
                    var _query, order, _params_select, select, where, whereIn, whereNot, whereNotNull, whereRaw, db, query;
                    return _ts_generator(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                order = params.order, _params_select = params.select, select = _params_select === void 0 ? [
                                    '*'
                                ] : _params_select, where = params.where, whereIn = params.whereIn, whereNot = params.whereNot, whereNotNull = params.whereNotNull, whereRaw = params.whereRaw;
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
            key: "updateUserList",
            value: function updateUserList(payload, userID, loggedUser, ipAddress, role_name) {
                return _async_to_generator(function() {
                    var _this, _existingUser_accessPer, db, getExistingUser, updatePermissions, existingUser, existingAccessPer, password, accessPer, rest, updateData, result, logData;
                    return _ts_generator(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                _this = this;
                                db = getKnexInstance();
                                // Extract helper functions
                                getExistingUser = function getExistingUser(userID) {
                                    return _async_to_generator(function() {
                                        var user;
                                        return _ts_generator(this, function(_state) {
                                            switch(_state.label){
                                                case 0:
                                                    return [
                                                        4,
                                                        this.findOneUser({
                                                            userID: userID
                                                        })
                                                    ];
                                                case 1:
                                                    user = _state.sent();
                                                    if (!user) throw new NotFoundError('User not found');
                                                    return [
                                                        2,
                                                        user
                                                    ];
                                            }
                                        });
                                    }).call(_this);
                                };
                                updatePermissions = function updatePermissions(existingPerms, newPerms) {
                                    var permSet = new Set(existingPerms);
                                    newPerms === null || newPerms === void 0 ? void 0 : newPerms.forEach(function(param) {
                                        var name = param.name, isChecked = param.isChecked;
                                        isChecked ? permSet.add(name) : permSet.delete(name);
                                    });
                                    return Array.from(permSet).join(',');
                                };
                                return [
                                    4,
                                    getExistingUser(userID)
                                ];
                            case 1:
                                existingUser = _state.sent();
                                existingAccessPer = ((_existingUser_accessPer = existingUser.accessPer) === null || _existingUser_accessPer === void 0 ? void 0 : _existingUser_accessPer.split(',')) || [];
                                // Prepare update data
                                password = payload.password, accessPer = payload.accessPer, rest = _object_without_properties(payload, [
                                    "password",
                                    "accessPer"
                                ]);
                                updateData = _object_spread({}, rest, password && {
                                    password: md5(password)
                                }, accessPer && {
                                    accessPer: updatePermissions(existingAccessPer, payload.accessPer)
                                });
                                if (!(updateData.status === 'Active')) return [
                                    3,
                                    3
                                ];
                                if (!((existingUser === null || existingUser === void 0 ? void 0 : existingUser.status) === 'In Active')) return [
                                    3,
                                    3
                                ];
                                return [
                                    4,
                                    db('loginLogs').insert({
                                        userID: loggedUser.userID,
                                        name: loggedUser.name,
                                        email: loggedUser.email,
                                        ip: ipAddress
                                    })
                                ];
                            case 2:
                                _state.sent();
                                _state.label = 3;
                            case 3:
                                return [
                                    4,
                                    db(this.table).where('userID', userID).update(_object_spread_props(_object_spread({}, updateData), {
                                        role: !isEmpty(role_name) ? role_name : existingUser.role
                                    }))
                                ];
                            case 4:
                                result = _state.sent();
                                // Log the user edit
                                logData = _object_spread_props(_object_spread({
                                    name: existingUser.name,
                                    email: existingUser.email,
                                    mobile: existingUser.mobile,
                                    did_no: existingUser.did_no,
                                    userName: existingUser.userName,
                                    branch: existingUser.branch,
                                    status: existingUser.status,
                                    convoque_login_id: existingUser.convoque_login_id,
                                    convoque_exten: existingUser.convoque_exten,
                                    whatsapp_email: existingUser.whatsapp_email,
                                    accessPer: existingUser.accessPer
                                }, updateData), {
                                    role: !isEmpty(role_name) ? role_name : existingUser.role,
                                    userID: userID,
                                    password: 'null',
                                    createdBy: loggedUser.userID
                                });
                                return [
                                    4,
                                    db('user_edit_logs').insert(logData)
                                ];
                            case 5:
                                _state.sent();
                                return [
                                    2,
                                    result ? userID : 0
                                ];
                        }
                    });
                }).call(this);
            }
        },
        {
            key: "addUserList",
            value: function addUserList(payload, loggedUser, role_name) {
                return _async_to_generator(function() {
                    var _this, db, checkExistingUser, getFormattedPermissions, password, accessPer, restPayload, userData, _ref, insertId, logData;
                    return _ts_generator(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                _this = this;
                                db = getKnexInstance();
                                // Extract reusable validation function
                                checkExistingUser = function checkExistingUser(payload) {
                                    return _async_to_generator(function() {
                                        var existingUser;
                                        return _ts_generator(this, function(_state) {
                                            switch(_state.label){
                                                case 0:
                                                    return [
                                                        4,
                                                        this.findOne({
                                                            where: function where(query) {
                                                                query.orWhere('email', payload.email).orWhere('userName', payload.userName).orWhere('mobile', payload.mobile);
                                                            }
                                                        })
                                                    ];
                                                case 1:
                                                    existingUser = _state.sent();
                                                    if (existingUser) {
                                                        throw new BadRequestError('User already exists');
                                                    }
                                                    return [
                                                        2
                                                    ];
                                            }
                                        });
                                    }).call(_this);
                                };
                                // Extract permission handling logic
                                getFormattedPermissions = function getFormattedPermissions(accessPer) {
                                    var permissions = new Set();
                                    if (accessPer === null || accessPer === void 0 ? void 0 : accessPer.length) {
                                        accessPer.forEach(function(param) {
                                            var name = param.name, isChecked = param.isChecked;
                                            if (isChecked) permissions.add(name);
                                        });
                                    }
                                    return permissions.size ? Array.from(permissions).join(',') : '';
                                };
                                // Validate user existence
                                return [
                                    4,
                                    checkExistingUser(payload)
                                ];
                            case 1:
                                _state.sent();
                                // Prepare user data
                                password = payload.password, accessPer = payload.accessPer, restPayload = _object_without_properties(payload, [
                                    "password",
                                    "accessPer"
                                ]);
                                userData = _object_spread_props(_object_spread({}, restPayload, password && {
                                    password: md5(password)
                                }, accessPer && {
                                    accessPer: getFormattedPermissions(accessPer)
                                }), {
                                    createdBy: loggedUser.userID
                                });
                                //remove role_id from userData
                                delete userData.role_id;
                                return [
                                    4,
                                    db(this.table).insert(_object_spread_props(_object_spread({}, userData), {
                                        role: role_name
                                    }))
                                ];
                            case 2:
                                _ref = _sliced_to_array.apply(void 0, [
                                    _state.sent(),
                                    1
                                ]), insertId = _ref[0];
                                // Log the user creation
                                logData = _object_spread_props(_object_spread({}, userData), {
                                    role: role_name,
                                    userID: insertId,
                                    password: 'null',
                                    createdBy: loggedUser.userID
                                });
                                return [
                                    4,
                                    db('user_edit_logs').insert(logData)
                                ];
                            case 3:
                                _state.sent();
                                return [
                                    2,
                                    insertId || 0
                                ];
                        }
                    });
                }).call(this);
            }
        },
        {
            key: "updateUserById",
            value: function updateUserById(userId, payload) {
                return _async_to_generator(function() {
                    var db, existingUser;
                    return _ts_generator(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                db = getKnexInstance();
                                return [
                                    4,
                                    this.findOneUser({
                                        userID: userId
                                    })
                                ];
                            case 1:
                                existingUser = _state.sent();
                                if (existingUser) {
                                    throw new BadRequestError('User already exists');
                                }
                                return [
                                    2,
                                    db('users').where('userID', userId).update(payload)
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
            key: "getUserNameById",
            value: function getUserNameById(userID) {
                return _async_to_generator(function() {
                    var id, user;
                    return _ts_generator(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                if (!userID || typeof userID === 'string' && userID.trim() === '') {
                                    return [
                                        2,
                                        ''
                                    ];
                                }
                                id = typeof userID === 'string' ? Number(userID.trim()) : userID;
                                if (isNaN(id)) {
                                    return [
                                        2,
                                        ''
                                    ];
                                }
                                return [
                                    4,
                                    userModel.findOne({
                                        where: {
                                            userID: id
                                        },
                                        select: [
                                            'name'
                                        ]
                                    })
                                ];
                            case 1:
                                user = _state.sent();
                                return [
                                    2,
                                    (user === null || user === void 0 ? void 0 : user.name) || ''
                                ];
                        }
                    });
                })();
            }
        }
    ]);
    return UserModel;
}();
export { UserModel as default };
export var userModel = new UserModel();

//# sourceMappingURL=users.js.map