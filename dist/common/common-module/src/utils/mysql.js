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
import { config } from '@/config.server';
import knex from 'knex';
import { logger } from '../utils/logger';
import { injectBindings } from '../utils/util';
var primaryDb = null;
var replicaDb = null;
// Create a new Knex connection
function create(dbConfig) {
    return _async_to_generator(function() {
        var db, error;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    db = knex({
                        client: 'mysql2',
                        connection: {
                            host: dbConfig.host,
                            port: +dbConfig.port,
                            user: dbConfig.user,
                            password: dbConfig.password,
                            database: dbConfig.database
                        },
                        pool: {
                            min: 2,
                            max: 10
                        },
                        migrations: {
                            tableName: 'knex_migrations',
                            directory: 'migrations'
                        }
                    });
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
                        db.raw('SELECT 1')
                    ];
                case 2:
                    _state.sent();
                    return [
                        2,
                        db
                    ];
                case 3:
                    error = _state.sent();
                    logger.error(error);
                    throw new Error("Unable to connect to MySQL @ ".concat(dbConfig.host));
                case 4:
                    return [
                        2
                    ];
            }
        });
    })();
}
(function() {
    return _async_to_generator(function() {
        var error;
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
                        create({
                            host: config.dbHost,
                            port: config.dbPort,
                            user: config.dbUsername,
                            password: config.dbPassword,
                            database: config.dbDatabase,
                            timezone: config.dbTimeZone
                        })
                    ];
                case 1:
                    primaryDb = _state.sent();
                    return [
                        4,
                        create({
                            host: config.dbReplicaHost,
                            port: config.dbReplicaPort,
                            user: config.dbReplicaUsername,
                            password: config.dbReplicaPassword,
                            database: config.dbReplicaDatabase,
                            timezone: config.dbTimeZone
                        })
                    ];
                case 2:
                    replicaDb = _state.sent();
                    primaryDb.on('query', function(query) {
                        var fullQuery = injectBindings(query.sql, query.bindings);
                        logger.info('Primary → ' + fullQuery);
                    });
                    replicaDb.on('query', function(query) {
                        var fullQuery = injectBindings(query.sql, query.bindings);
                        logger.info('Replica → ' + fullQuery);
                    });
                    logger.info('MySQL connected: primary and replica');
                    return [
                        3,
                        4
                    ];
                case 3:
                    error = _state.sent();
                    logger.error(error);
                    throw new Error('Unable to connect to MySQL primary/replica via Knex.');
                case 4:
                    return [
                        2
                    ];
            }
        });
    })();
})();
export var runQuery = function runQuery(sql, values) {
    var onPrimary = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : true;
    return _async_to_generator(function() {
        var db, _tmp;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    db = onPrimary ? primaryDb : replicaDb;
                    if (!(values === null || values === void 0 ? void 0 : values.length)) return [
                        3,
                        2
                    ];
                    return [
                        4,
                        db.raw(sql, values)
                    ];
                case 1:
                    _tmp = _state.sent();
                    return [
                        3,
                        4
                    ];
                case 2:
                    return [
                        4,
                        db.raw(sql)
                    ];
                case 3:
                    _tmp = _state.sent();
                    _state.label = 4;
                case 4:
                    return [
                        2,
                        _tmp
                    ];
            }
        });
    })();
};
// Accessors
export var getKnexInstance = function getKnexInstance() {
    return primaryDb;
};
export var getReadDb = function getReadDb() {
    return replicaDb;
};

//# sourceMappingURL=mysql.js.map