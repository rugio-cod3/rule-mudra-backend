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
import bcrypt from 'bcrypt';
import { createCipheriv, createDecipheriv, createHmac, timingSafeEqual } from 'crypto';
import { EncryptionAlgos, HashMethods } from '../enums/security.enum';
import { logger } from './logger';
export var SecurityUtils = /*#__PURE__*/ function() {
    "use strict";
    function SecurityUtils() {
        _class_call_check(this, SecurityUtils);
        _define_property(this, "DEFAULT_SALT_ROUNDS", 4);
        _define_property(this, "ENCRYPTION_KEY", 'k5Hf9sXa1LzRq83YbM7D4pWq2vXc8JYe');
        _define_property(this, "ENCRYPTION_IV", '7Tu9XpQs4FbL0wVe');
        _define_property(this, "HMAC_KEY", Buffer.from('rD9kRzZqGpX2cfsPzyTeR7Xlhq3dO7bZZ1bWcWg5qPY=', 'base64'));
    }
    _create_class(SecurityUtils, [
        {
            key: "encrypt",
            value: function encrypt(algorithm, value) {
                switch(algorithm){
                    case EncryptionAlgos.AES_256_CBC:
                        {
                            var cipher = createCipheriv(algorithm, Buffer.from(this.ENCRYPTION_KEY), this.ENCRYPTION_IV);
                            var encryptedData = cipher.update(value, 'utf8', 'hex');
                            encryptedData += cipher.final('hex');
                            logger.info('Encrypted data from SecurityUtils: ' + encryptedData);
                            return encryptedData;
                        }
                    default:
                        throw new Error('No Algorithm provided for encryption');
                }
            }
        },
        {
            key: "decrypt",
            value: function decrypt(algorithm, value) {
                switch(algorithm){
                    case EncryptionAlgos.AES_256_CBC:
                        {
                            var decipher = createDecipheriv(algorithm, Buffer.from(this.ENCRYPTION_KEY), this.ENCRYPTION_IV);
                            try {
                                var decryptedData = decipher.update(value, 'hex', 'utf8');
                                decryptedData += decipher.final('utf8');
                                logger.info('Decrypted data from SecurityUtils: ' + decryptedData);
                                return decryptedData;
                            } catch (error) {
                                logger.error('Invalid encrypted value from security.utils');
                                return null;
                            }
                        }
                    default:
                        logger.error('No Algorithm provided for decryption');
                        return null;
                }
            }
        },
        {
            key: "createHash",
            value: function createHash(method, value, saltRounds) {
                return _async_to_generator(function() {
                    var salt;
                    return _ts_generator(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                switch(method){
                                    case HashMethods.BCRYPT:
                                        return [
                                            3,
                                            1
                                        ];
                                    case HashMethods.HMAC_SHA256:
                                        return [
                                            3,
                                            4
                                        ];
                                }
                                return [
                                    3,
                                    5
                                ];
                            case 1:
                                return [
                                    4,
                                    bcrypt.genSalt(saltRounds || this.DEFAULT_SALT_ROUNDS)
                                ];
                            case 2:
                                salt = _state.sent();
                                return [
                                    4,
                                    bcrypt.hash(value, salt)
                                ];
                            case 3:
                                return [
                                    2,
                                    _state.sent()
                                ];
                            case 4:
                                // Implementation required
                                return [
                                    2,
                                    createHmac('sha256', this.HMAC_KEY).update(value).digest('hex')
                                ];
                            case 5:
                                return [
                                    2
                                ];
                        }
                    });
                }).call(this);
            }
        },
        {
            key: "compareHash",
            value: function compareHash(method, value, hash) {
                return _async_to_generator(function() {
                    return _ts_generator(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                switch(method){
                                    case HashMethods.BCRYPT:
                                        return [
                                            3,
                                            1
                                        ];
                                    case HashMethods.HMAC_SHA256:
                                        return [
                                            3,
                                            3
                                        ];
                                }
                                return [
                                    3,
                                    4
                                ];
                            case 1:
                                return [
                                    4,
                                    bcrypt.compare(value, hash)
                                ];
                            case 2:
                                return [
                                    2,
                                    _state.sent()
                                ];
                            case 3:
                                return [
                                    2,
                                    timingSafeEqual(Buffer.from(value, 'hex'), Buffer.from(hash, 'hex'))
                                ];
                            case 4:
                                logger.error('No method found');
                                return [
                                    2,
                                    false
                                ];
                            case 5:
                                return [
                                    2
                                ];
                        }
                    });
                })();
            }
        }
    ], [
        {
            key: "getInstance",
            value: function getInstance() {
                if (!this.instance) {
                    this.instance = new SecurityUtils();
                }
                return this.instance;
            }
        }
    ]);
    return SecurityUtils;
}();
_define_property(SecurityUtils, "instance", void 0);

//# sourceMappingURL=security.js.map