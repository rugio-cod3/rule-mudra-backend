function _array_like_to_array(arr, len) {
    if (len == null || len > arr.length) len = arr.length;
    for(var i = 0, arr2 = new Array(len); i < len; i++)arr2[i] = arr[i];
    return arr2;
}
function _array_with_holes(arr) {
    if (Array.isArray(arr)) return arr;
}
function _assert_this_initialized(self) {
    if (self === void 0) {
        throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }
    return self;
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
function _call_super(_this, derived, args) {
    derived = _get_prototype_of(derived);
    return _possible_constructor_return(_this, _is_native_reflect_construct() ? Reflect.construct(derived, args || [], _get_prototype_of(_this).constructor) : derived.apply(_this, args));
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
function _get_prototype_of(o) {
    _get_prototype_of = Object.setPrototypeOf ? Object.getPrototypeOf : function getPrototypeOf(o) {
        return o.__proto__ || Object.getPrototypeOf(o);
    };
    return _get_prototype_of(o);
}
function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
        throw new TypeError("Super expression must either be null or a function");
    }
    subClass.prototype = Object.create(superClass && superClass.prototype, {
        constructor: {
            value: subClass,
            writable: true,
            configurable: true
        }
    });
    if (superClass) _set_prototype_of(subClass, superClass);
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
function _possible_constructor_return(self, call) {
    if (call && (_type_of(call) === "object" || typeof call === "function")) {
        return call;
    }
    return _assert_this_initialized(self);
}
function _set_prototype_of(o, p) {
    _set_prototype_of = Object.setPrototypeOf || function setPrototypeOf(o, p) {
        o.__proto__ = p;
        return o;
    };
    return _set_prototype_of(o, p);
}
function _sliced_to_array(arr, i) {
    return _array_with_holes(arr) || _iterable_to_array_limit(arr, i) || _unsupported_iterable_to_array(arr, i) || _non_iterable_rest();
}
function _type_of(obj) {
    "@swc/helpers - typeof";
    return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol ? "symbol" : typeof obj;
}
function _unsupported_iterable_to_array(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return _array_like_to_array(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(n);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _array_like_to_array(o, minLen);
}
function _is_native_reflect_construct() {
    try {
        var result = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {}));
    } catch (_) {}
    return (_is_native_reflect_construct = function() {
        return !!result;
    })();
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
import { BadRequestError, NotFoundError } from '@/errors';
import ResponseService from '@/services/response.service';
import S3Service from '@/services/thirdParty/s3.service';
import { HttpStatusCode } from 'axios';
import { chatbotCustomerQueryModel } from '../database/mysql/chatbotCustomerQuery';
import { chatbotStageModel } from '../database/mysql/chatbotStage';
import { chatbotStageContentModel } from '../database/mysql/chatbotStageContent';
import { ChatbotContentType, ChatbotQueryStatus } from '../enums/chatbot.enum';
import { calculateTotalPages } from '../utils/util';
export var ChatbotCrmService = /*#__PURE__*/ function(ResponseService) {
    "use strict";
    _inherits(ChatbotCrmService, ResponseService);
    function ChatbotCrmService() {
        _class_call_check(this, ChatbotCrmService);
        var _this;
        _this = _call_super(this, ChatbotCrmService), _define_property(_this, "chatbotStageModel", chatbotStageModel), _define_property(_this, "chatbotStageContentModel", chatbotStageContentModel), _define_property(_this, "chatbotCustomerQueryModel", chatbotCustomerQueryModel), _define_property(_this, "s3Service", new S3Service());
        return _this;
    }
    _create_class(ChatbotCrmService, [
        {
            key: "getStages",
            value: // Stage Management APIs
            function getStages(pagination) {
                return _async_to_generator(function() {
                    var totalItems, stages, response, error;
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
                                    this.chatbotStageModel.count({})
                                ];
                            case 1:
                                totalItems = _state.sent();
                                // Error - not found
                                if (totalItems === 0) {
                                    throw new NotFoundError('No stages found');
                                }
                                return [
                                    4,
                                    this.chatbotStageModel.find({
                                        order: [
                                            {
                                                column: 'id',
                                                order: 'asc'
                                            }
                                        ],
                                        paginate: pagination
                                    })
                                ];
                            case 2:
                                stages = _state.sent();
                                response = {
                                    data: stages,
                                    pagination: {
                                        current_page: Math.floor(pagination.page / pagination.perPage) + 1,
                                        total_pages: calculateTotalPages(totalItems, pagination.perPage),
                                        total_items: totalItems,
                                        per_page: pagination.perPage
                                    }
                                };
                                return [
                                    2,
                                    this.serviceResponse(200, response, 'Stages retrieved successfully')
                                ];
                            case 3:
                                error = _state.sent();
                                throw error;
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
            key: "createStage",
            value: function createStage(payload) {
                return _async_to_generator(function() {
                    var existingStage, newStage, createdStage, response, error;
                    return _ts_generator(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                _state.trys.push([
                                    0,
                                    4,
                                    ,
                                    5
                                ]);
                                return [
                                    4,
                                    this.chatbotStageModel.findOne({
                                        where: {
                                            stage_key: payload.stage_key
                                        }
                                    })
                                ];
                            case 1:
                                existingStage = _state.sent();
                                if (existingStage) {
                                    throw new BadRequestError("Stage with key '".concat(payload.stage_key, "' already exists"));
                                }
                                return [
                                    4,
                                    this.chatbotStageModel.create(payload)
                                ];
                            case 2:
                                newStage = _state.sent();
                                return [
                                    4,
                                    this.chatbotStageModel.findOne({
                                        where: {
                                            id: newStage[0]
                                        }
                                    })
                                ];
                            case 3:
                                createdStage = _state.sent();
                                response = {
                                    data: createdStage
                                };
                                return [
                                    2,
                                    this.serviceResponse(201, response, 'Stage created successfully')
                                ];
                            case 4:
                                error = _state.sent();
                                throw error;
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
            key: "updateStage",
            value: function updateStage(id, payload) {
                return _async_to_generator(function() {
                    var existingStage, duplicateKey, updatedStage, response, error;
                    return _ts_generator(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                _state.trys.push([
                                    0,
                                    6,
                                    ,
                                    7
                                ]);
                                return [
                                    4,
                                    this.chatbotStageModel.findOne({
                                        where: {
                                            id: id
                                        }
                                    })
                                ];
                            case 1:
                                existingStage = _state.sent();
                                if (!existingStage) {
                                    throw new NotFoundError("Stage with id ".concat(id, " not found"));
                                }
                                if (!((payload === null || payload === void 0 ? void 0 : payload.stage_key) && payload.stage_key !== existingStage.stage_key)) return [
                                    3,
                                    3
                                ];
                                return [
                                    4,
                                    this.chatbotStageModel.findOne({
                                        where: {
                                            stage_key: payload.stage_key
                                        }
                                    })
                                ];
                            case 2:
                                duplicateKey = _state.sent();
                                if (duplicateKey) {
                                    throw new BadRequestError("Stage with key '".concat(payload.stage_key, "' already exists"));
                                }
                                _state.label = 3;
                            case 3:
                                // Update stage
                                return [
                                    4,
                                    this.chatbotStageModel.update({
                                        id: id
                                    }, {
                                        stage_key: (payload === null || payload === void 0 ? void 0 : payload.stage_key) || existingStage.stage_key,
                                        stage_name: (payload === null || payload === void 0 ? void 0 : payload.stage_name) || existingStage.stage_name
                                    })
                                ];
                            case 4:
                                _state.sent();
                                return [
                                    4,
                                    this.chatbotStageModel.findOne({
                                        where: {
                                            id: id
                                        }
                                    })
                                ];
                            case 5:
                                updatedStage = _state.sent();
                                response = {
                                    data: updatedStage
                                };
                                return [
                                    2,
                                    this.serviceResponse(200, response, 'Stage updated successfully')
                                ];
                            case 6:
                                error = _state.sent();
                                throw error;
                            case 7:
                                return [
                                    2
                                ];
                        }
                    });
                }).call(this);
            }
        },
        {
            key: "deleteStage",
            value: function deleteStage(id) {
                return _async_to_generator(function() {
                    var existingStage, contentCount, error;
                    return _ts_generator(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                _state.trys.push([
                                    0,
                                    4,
                                    ,
                                    5
                                ]);
                                return [
                                    4,
                                    this.chatbotStageModel.findOne({
                                        where: {
                                            id: id
                                        }
                                    })
                                ];
                            case 1:
                                existingStage = _state.sent();
                                if (!existingStage) {
                                    throw new NotFoundError("Stage with id ".concat(id, " not found"));
                                }
                                return [
                                    4,
                                    this.chatbotStageContentModel.count({
                                        where: {
                                            stage_id: id
                                        }
                                    })
                                ];
                            case 2:
                                contentCount = _state.sent();
                                if (contentCount > 0) {
                                    throw new BadRequestError("Cannot delete stage with ".concat(contentCount, " associated content item(s). Delete the content first."));
                                }
                                // Delete stage
                                return [
                                    4,
                                    this.chatbotStageModel.delete({
                                        id: id
                                    })
                                ];
                            case 3:
                                _state.sent();
                                return [
                                    2,
                                    this.serviceResponse(200, {
                                        success: true
                                    }, 'Stage deleted successfully')
                                ];
                            case 4:
                                error = _state.sent();
                                throw error;
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
            key: "getContent",
            value: // Content Management APIs
            function getContent(query, pagination) {
                return _async_to_generator(function() {
                    var stage_id, content_type, is_active, stage, whereConditions, content, totalContent, activeContent, response, error;
                    return _ts_generator(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                _state.trys.push([
                                    0,
                                    5,
                                    ,
                                    6
                                ]);
                                stage_id = query.stage_id, content_type = query.content_type, is_active = query.is_active;
                                return [
                                    4,
                                    this.chatbotStageModel.findOne({
                                        where: {
                                            id: stage_id
                                        }
                                    })
                                ];
                            case 1:
                                stage = _state.sent();
                                if (!stage) {
                                    throw new NotFoundError('Stage not found');
                                }
                                // Build where conditions
                                whereConditions = {
                                    stage_id: stage_id
                                };
                                if (content_type) {
                                    whereConditions.content_type = content_type;
                                }
                                if (is_active !== undefined) {
                                    whereConditions.is_active = is_active;
                                }
                                return [
                                    4,
                                    this.chatbotStageContentModel.findWithStage({
                                        where: whereConditions,
                                        paginate: pagination,
                                        order: [
                                            {
                                                column: 'chatbot_stage_content.id',
                                                order: 'asc'
                                            },
                                            {
                                                column: 'chatbot_stage_content.content_type',
                                                order: 'asc'
                                            }
                                        ]
                                    })
                                ];
                            case 2:
                                content = _state.sent();
                                return [
                                    4,
                                    this.chatbotStageContentModel.count({
                                        where: {
                                            stage_id: stage_id
                                        }
                                    })
                                ];
                            case 3:
                                totalContent = _state.sent();
                                return [
                                    4,
                                    this.chatbotStageContentModel.count({
                                        where: {
                                            stage_id: stage_id,
                                            is_active: true
                                        }
                                    })
                                ];
                            case 4:
                                activeContent = _state.sent();
                                response = {
                                    data: content,
                                    meta: {
                                        stage_name: stage.stage_name,
                                        total_content: totalContent,
                                        active_content: activeContent
                                    }
                                };
                                return [
                                    2,
                                    this.serviceResponse(200, response, 'Content retrieved successfully')
                                ];
                            case 5:
                                error = _state.sent();
                                throw error;
                            case 6:
                                return [
                                    2
                                ];
                        }
                    });
                }).call(this);
            }
        },
        {
            key: "createContent",
            value: function createContent(payload) {
                return _async_to_generator(function() {
                    var stage_id, content_type, question_text, answer_text, _payload_is_active, is_active, stage, contentData, _ref, contentId, createdContent, response, error;
                    return _ts_generator(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                _state.trys.push([
                                    0,
                                    4,
                                    ,
                                    5
                                ]);
                                stage_id = payload.stage_id, content_type = payload.content_type, question_text = payload.question_text, answer_text = payload.answer_text, _payload_is_active = payload.is_active, is_active = _payload_is_active === void 0 ? true : _payload_is_active;
                                return [
                                    4,
                                    this.chatbotStageModel.findOne({
                                        where: {
                                            id: stage_id
                                        }
                                    })
                                ];
                            case 1:
                                stage = _state.sent();
                                if (!stage) {
                                    throw new NotFoundError('Stage not found');
                                }
                                // Validate content based on type
                                if (content_type === ChatbotContentType.FAQ && (!question_text || question_text.trim() === '')) {
                                    throw new BadRequestError('Question text is required for FAQ content type');
                                }
                                if (content_type === ChatbotContentType.NUDGE && question_text) {
                                    throw new BadRequestError('Question text should be null for Nudge content type');
                                }
                                // Validate answer text
                                if (!answer_text || answer_text.trim().length < 10) {
                                    throw new BadRequestError('Answer text must be at least 10 characters long');
                                }
                                if (answer_text.length > 2000) {
                                    throw new BadRequestError('Answer text cannot exceed 2000 characters');
                                }
                                // Create content
                                contentData = {
                                    stage_id: stage_id,
                                    content_type: content_type,
                                    question_text: content_type === ChatbotContentType.FAQ ? question_text : null,
                                    answer_text: answer_text.trim(),
                                    is_active: is_active,
                                    created_at: new Date(),
                                    updated_at: new Date()
                                };
                                return [
                                    4,
                                    this.chatbotStageContentModel.create(contentData)
                                ];
                            case 2:
                                _ref = _sliced_to_array.apply(void 0, [
                                    _state.sent(),
                                    1
                                ]), contentId = _ref[0];
                                return [
                                    4,
                                    this.chatbotStageContentModel.findOne({
                                        where: {
                                            id: contentId
                                        }
                                    })
                                ];
                            case 3:
                                createdContent = _state.sent();
                                response = {
                                    data: createdContent
                                };
                                return [
                                    2,
                                    this.serviceResponse(201, response, 'Content created successfully')
                                ];
                            case 4:
                                error = _state.sent();
                                throw error;
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
            key: "updateContent",
            value: function updateContent(id, payload) {
                return _async_to_generator(function() {
                    var stage_id, content_type, question_text, answer_text, _payload_is_active, is_active, existingContent, stage, updateData, updatedContent, response, error;
                    return _ts_generator(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                _state.trys.push([
                                    0,
                                    5,
                                    ,
                                    6
                                ]);
                                stage_id = payload.stage_id, content_type = payload.content_type, question_text = payload.question_text, answer_text = payload.answer_text, _payload_is_active = payload.is_active, is_active = _payload_is_active === void 0 ? true : _payload_is_active;
                                return [
                                    4,
                                    this.chatbotStageContentModel.findOne({
                                        where: {
                                            id: id
                                        }
                                    })
                                ];
                            case 1:
                                existingContent = _state.sent();
                                if (!existingContent) {
                                    throw new NotFoundError('Content not found');
                                }
                                return [
                                    4,
                                    this.chatbotStageModel.findOne({
                                        where: {
                                            id: stage_id
                                        }
                                    })
                                ];
                            case 2:
                                stage = _state.sent();
                                if (!stage) {
                                    throw new NotFoundError('Stage not found');
                                }
                                // Validate that content_type cannot be changed
                                if (existingContent.content_type !== content_type) {
                                    throw new BadRequestError('Content type cannot be changed after creation');
                                }
                                // Validate content based on type
                                if (content_type === ChatbotContentType.FAQ && (!question_text || question_text.trim() === '')) {
                                    throw new BadRequestError('Question text is required for FAQ content type');
                                }
                                if (content_type === ChatbotContentType.NUDGE && question_text) {
                                    throw new BadRequestError('Question text should be null for Nudge content type');
                                }
                                // Update content
                                updateData = {
                                    stage_id: stage_id,
                                    question_text: content_type === ChatbotContentType.FAQ ? question_text : null,
                                    answer_text: answer_text.trim(),
                                    is_active: is_active,
                                    updated_at: new Date()
                                };
                                return [
                                    4,
                                    this.chatbotStageContentModel.update({
                                        id: id
                                    }, updateData)
                                ];
                            case 3:
                                _state.sent();
                                return [
                                    4,
                                    this.chatbotStageContentModel.findOne({
                                        where: {
                                            id: id
                                        }
                                    })
                                ];
                            case 4:
                                updatedContent = _state.sent();
                                response = {
                                    data: updatedContent
                                };
                                return [
                                    2,
                                    this.serviceResponse(200, response, 'Content updated successfully')
                                ];
                            case 5:
                                error = _state.sent();
                                throw error;
                            case 6:
                                return [
                                    2
                                ];
                        }
                    });
                }).call(this);
            }
        },
        {
            key: "deleteContent",
            value: function deleteContent(id) {
                var hardDelete = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : false;
                return _async_to_generator(function() {
                    var existingContent, response, error;
                    return _ts_generator(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                _state.trys.push([
                                    0,
                                    6,
                                    ,
                                    7
                                ]);
                                return [
                                    4,
                                    this.chatbotStageContentModel.findOne({
                                        where: {
                                            id: id
                                        }
                                    })
                                ];
                            case 1:
                                existingContent = _state.sent();
                                if (!existingContent) {
                                    throw new NotFoundError('Content not found');
                                }
                                if (!hardDelete) return [
                                    3,
                                    3
                                ];
                                // Permanent deletion
                                return [
                                    4,
                                    this.chatbotStageContentModel.delete({
                                        id: id
                                    })
                                ];
                            case 2:
                                _state.sent();
                                return [
                                    3,
                                    5
                                ];
                            case 3:
                                // Soft delete (set is_active to false)
                                return [
                                    4,
                                    this.chatbotStageContentModel.softDelete({
                                        id: id
                                    })
                                ];
                            case 4:
                                _state.sent();
                                _state.label = 5;
                            case 5:
                                response = {
                                    message: hardDelete ? 'Content deleted permanently' : 'Content deactivated successfully',
                                    deleted_id: id
                                };
                                return [
                                    2,
                                    this.serviceResponse(200, response, response.message)
                                ];
                            case 6:
                                error = _state.sent();
                                throw error;
                            case 7:
                                return [
                                    2
                                ];
                        }
                    });
                }).call(this);
            }
        },
        {
            key: "getQueries",
            value: // Query Management APIs
            function getQueries(customer, query, pagination) {
                return _async_to_generator(function() {
                    var status, category, startDate, endDate, search, _query_sort, sort, _query_order, order, whereConditions, dateRange, queries, totalItems, _ref, rawQueries, totalItems1, _ref1, rawQueries1, totalItems2, totalPages, response, error;
                    return _ts_generator(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                _state.trys.push([
                                    0,
                                    5,
                                    ,
                                    6
                                ]);
                                status = query.status, category = query.category, startDate = query.startDate, endDate = query.endDate, search = query.search, _query_sort = query.sort, sort = _query_sort === void 0 ? 'id' : _query_sort, _query_order = query.order, order = _query_order === void 0 ? 'desc' : _query_order;
                                // Build where conditions
                                whereConditions = {};
                                if (status) whereConditions.status = status;
                                if (category) whereConditions.query_category = category;
                                // Build date range
                                dateRange = {};
                                if (startDate) dateRange.startDate = startDate;
                                if (endDate) dateRange.endDate = endDate;
                                queries = [];
                                totalItems = 0;
                                if (!(customer === null || customer === void 0 ? void 0 : customer.customerID)) return [
                                    3,
                                    2
                                ];
                                // Add customer_id to where conditions
                                whereConditions.customer_id = customer.customerID;
                                return [
                                    4,
                                    Promise.all([
                                        // Get queries with filters but without joining the customer table
                                        this.chatbotCustomerQueryModel.findWithFilters({
                                            where: whereConditions,
                                            search: search,
                                            dateRange: dateRange,
                                            order: [
                                                {
                                                    column: sort,
                                                    order: order
                                                }
                                            ],
                                            paginate: pagination
                                        }),
                                        // Use count method that works with where conditions
                                        this.chatbotCustomerQueryModel.countWithFilters({
                                            where: whereConditions,
                                            search: search,
                                            dateRange: dateRange
                                        })
                                    ])
                                ];
                            case 1:
                                _ref = _sliced_to_array.apply(void 0, [
                                    _state.sent(),
                                    2
                                ]), rawQueries = _ref[0], totalItems1 = _ref[1];
                                // Return empty response if no queries found
                                if (totalItems1 === 0 || rawQueries.length === 0) {
                                    return [
                                        2,
                                        this.serviceResponse(HttpStatusCode.NotFound, {
                                            data: [],
                                            pagination: {},
                                            filters_applied: {}
                                        }, 'No queries found')
                                    ];
                                }
                                // Format queries according to IQueryDetailsResponse interface
                                queries = rawQueries.map(function(queryItem) {
                                    return {
                                        data: _object_spread_props(_object_spread({}, queryItem), {
                                            customer_name: customer.name || 'Unknown',
                                            customer_email: customer.email || 'N/A',
                                            customer_mobile: String(customer.mobile) || 'N/A'
                                        })
                                    };
                                });
                                return [
                                    3,
                                    4
                                ];
                            case 2:
                                return [
                                    4,
                                    Promise.all([
                                        // No customer in request context - use join approach (CRM admin case)
                                        this.chatbotCustomerQueryModel.findWithCustomers({
                                            where: whereConditions,
                                            search: search,
                                            dateRange: dateRange,
                                            order: [
                                                {
                                                    column: sort,
                                                    order: order
                                                }
                                            ],
                                            paginate: pagination
                                        }),
                                        // Use countWithFilters that works with search and dateRange
                                        this.chatbotCustomerQueryModel.countWithFilters({
                                            where: whereConditions,
                                            search: search,
                                            dateRange: dateRange
                                        })
                                    ])
                                ];
                            case 3:
                                _ref1 = _sliced_to_array.apply(void 0, [
                                    _state.sent(),
                                    2
                                ]), rawQueries1 = _ref1[0], totalItems2 = _ref1[1];
                                // Return empty response if no queries found
                                if (totalItems2 === 0 || rawQueries1.length === 0) {
                                    return [
                                        2,
                                        this.serviceResponse(HttpStatusCode.NotFound, {
                                            data: [],
                                            pagination: {},
                                            filters_applied: {}
                                        }, 'No queries found')
                                    ];
                                }
                                // Format queries to include customer data (for rows with customer join data)
                                queries = rawQueries1.map(function(queryItem) {
                                    return {
                                        data: _object_spread_props(_object_spread({}, queryItem), {
                                            customer_name: queryItem.customer_name || 'Unknown',
                                            customer_email: queryItem.customer_email || 'N/A',
                                            customer_mobile: String(queryItem.customer_mobile) || 'N/A'
                                        })
                                    };
                                });
                                _state.label = 4;
                            case 4:
                                totalPages = calculateTotalPages(totalItems, pagination === null || pagination === void 0 ? void 0 : pagination.perPage);
                                response = {
                                    data: queries,
                                    pagination: {
                                        current_page: Math.floor((pagination === null || pagination === void 0 ? void 0 : pagination.page) / (pagination === null || pagination === void 0 ? void 0 : pagination.perPage)) + 1,
                                        total_pages: totalPages,
                                        total_items: totalItems,
                                        per_page: pagination === null || pagination === void 0 ? void 0 : pagination.perPage
                                    },
                                    filters_applied: _object_spread({}, status && {
                                        status: status
                                    }, category && {
                                        category: category
                                    })
                                };
                                return [
                                    2,
                                    this.serviceResponse(200, response, 'Queries retrieved successfully')
                                ];
                            case 5:
                                error = _state.sent();
                                throw error;
                            case 6:
                                return [
                                    2
                                ];
                        }
                    });
                }).call(this);
            }
        },
        {
            key: "getQueryDetails",
            value: function getQueryDetails(id, customer) {
                return _async_to_generator(function() {
                    var query, relatedQueries, response, queries, query1, relatedQueries1, response1, error;
                    return _ts_generator(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                _state.trys.push([
                                    0,
                                    8,
                                    ,
                                    9
                                ]);
                                if (!(customer === null || customer === void 0 ? void 0 : customer.customerID)) return [
                                    3,
                                    3
                                ];
                                return [
                                    4,
                                    this.chatbotCustomerQueryModel.findOne({
                                        where: {
                                            id: id,
                                            customer_id: customer.customerID
                                        }
                                    })
                                ];
                            case 1:
                                query = _state.sent();
                                if (!query) {
                                    throw new NotFoundError('Query not found for this customer');
                                }
                                // Get related queries from the same customer
                                relatedQueries = [];
                                return [
                                    4,
                                    this.chatbotCustomerQueryModel.findRelatedQueries(customer.customerID, id)
                                ];
                            case 2:
                                relatedQueries = _state.sent();
                                // Enrich with customer data from the request
                                response = {
                                    data: _object_spread_props(_object_spread({}, query), {
                                        customer_name: customer.name || 'Unknown',
                                        customer_email: customer.email || 'N/A',
                                        customer_mobile: String(customer.mobile) || 'N/A',
                                        // Include related queries
                                        related_queries: relatedQueries
                                    })
                                };
                                return [
                                    2,
                                    this.serviceResponse(200, response, 'Query details retrieved successfully')
                                ];
                            case 3:
                                return [
                                    4,
                                    this.chatbotCustomerQueryModel.findWithCustomers({
                                        where: {
                                            id: id
                                        }
                                    })
                                ];
                            case 4:
                                queries = _state.sent();
                                if (!queries || queries.length === 0) {
                                    throw new NotFoundError('Query not found');
                                }
                                query1 = queries[0];
                                // Get related queries from the same customer
                                relatedQueries1 = [];
                                if (!query1.customer_id) return [
                                    3,
                                    6
                                ];
                                return [
                                    4,
                                    this.chatbotCustomerQueryModel.findRelatedQueries(query1.customer_id, query1.id)
                                ];
                            case 5:
                                relatedQueries1 = _state.sent();
                                _state.label = 6;
                            case 6:
                                response1 = {
                                    data: _object_spread_props(_object_spread({}, query1), {
                                        customer_name: query1.customer_name || 'Unknown',
                                        customer_email: query1.customer_email || 'N/A',
                                        customer_mobile: String(query1.customer_mobile) || 'N/A',
                                        // Include related queries
                                        related_queries: relatedQueries1
                                    })
                                };
                                return [
                                    2,
                                    this.serviceResponse(200, response1, 'Query details retrieved successfully')
                                ];
                            case 7:
                                return [
                                    3,
                                    9
                                ];
                            case 8:
                                error = _state.sent();
                                throw error;
                            case 9:
                                return [
                                    2
                                ];
                        }
                    });
                }).call(this);
            }
        },
        {
            key: "updateQueryStatus",
            value: function updateQueryStatus(id, payload) {
                return _async_to_generator(function() {
                    var status, resolution_notes, existingQuery, updateData, updatedQuery, error;
                    return _ts_generator(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                _state.trys.push([
                                    0,
                                    4,
                                    ,
                                    5
                                ]);
                                status = payload.status, resolution_notes = payload.resolution_notes;
                                return [
                                    4,
                                    this.chatbotCustomerQueryModel.findOne({
                                        where: {
                                            id: id
                                        }
                                    })
                                ];
                            case 1:
                                existingQuery = _state.sent();
                                if (!existingQuery) {
                                    throw new NotFoundError('Query not found');
                                }
                                // Update query status
                                updateData = {
                                    status: status,
                                    resolution_notes: resolution_notes ? resolution_notes.trim() : null,
                                    updated_at: new Date()
                                };
                                // Note: resolution_notes would be stored in a separate resolution log table
                                // For now, we're just updating the status
                                return [
                                    4,
                                    this.chatbotCustomerQueryModel.update({
                                        id: id
                                    }, updateData)
                                ];
                            case 2:
                                _state.sent();
                                return [
                                    4,
                                    this.chatbotCustomerQueryModel.findOne({
                                        where: {
                                            id: id
                                        }
                                    })
                                ];
                            case 3:
                                updatedQuery = _state.sent();
                                return [
                                    2,
                                    this.serviceResponse(200, {
                                        query: updatedQuery
                                    }, 'Query status updated successfully')
                                ];
                            case 4:
                                error = _state.sent();
                                throw error;
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
            key: "createQuery",
            value: function createQuery(customerId, payload) {
                return _async_to_generator(function() {
                    var query_category, query_text, attachment, attachment_url, allowedMimeTypes, timestamp, fileExtension, filename, folder, s3UploadResponse, s3Key, uploadError, queryData, _ref, queryId, createdQuery, response, error;
                    return _ts_generator(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                _state.trys.push([
                                    0,
                                    8,
                                    ,
                                    9
                                ]);
                                query_category = payload.query_category, query_text = payload.query_text, attachment = payload.attachment;
                                attachment_url = null;
                                if (!attachment) return [
                                    3,
                                    5
                                ];
                                // Validate file
                                allowedMimeTypes = [
                                    'image/jpeg',
                                    'image/jpg',
                                    'image/png',
                                    'image/gif',
                                    'image/webp',
                                    'application/pdf',
                                    'application/msword',
                                    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
                                ];
                                if (!allowedMimeTypes.includes(attachment.mimetype)) {
                                    throw new BadRequestError('Invalid file type. Only images (JPEG, PNG, GIF, WEBP) and documents (PDF, DOC, DOCX) are allowed.');
                                }
                                // Generate unique filename
                                timestamp = Math.floor(Date.now() / 1000);
                                fileExtension = attachment.originalname.split('.').pop();
                                filename = "".concat(timestamp, "_customer_").concat(customerId, "_query.").concat(fileExtension);
                                folder = 'chatbot/query-attachments';
                                _state.label = 1;
                            case 1:
                                _state.trys.push([
                                    1,
                                    4,
                                    ,
                                    5
                                ]);
                                return [
                                    4,
                                    this.s3Service.uploadDocument(attachment.buffer, folder, filename)
                                ];
                            case 2:
                                s3UploadResponse = _state.sent();
                                if (!s3UploadResponse || !s3UploadResponse.Location) {
                                    throw new BadRequestError('Failed to upload attachment');
                                }
                                // Get the S3 key for generating presigned URL
                                s3Key = "".concat(folder, "/").concat(filename);
                                return [
                                    4,
                                    this.s3Service.getPresignedUrl(s3Key)
                                ];
                            case 3:
                                attachment_url = _state.sent();
                                if (!attachment_url) {
                                    throw new BadRequestError('Failed to generate attachment URL');
                                }
                                return [
                                    3,
                                    5
                                ];
                            case 4:
                                uploadError = _state.sent();
                                throw new BadRequestError('Failed to upload attachment to cloud storage');
                            case 5:
                                // Create query data
                                queryData = {
                                    customer_id: customerId,
                                    query_category: query_category,
                                    query_text: query_text.trim(),
                                    attachment_url: attachment_url,
                                    status: ChatbotQueryStatus.PENDING,
                                    created_at: new Date(),
                                    updated_at: new Date()
                                };
                                return [
                                    4,
                                    this.chatbotCustomerQueryModel.create(queryData)
                                ];
                            case 6:
                                _ref = _sliced_to_array.apply(void 0, [
                                    _state.sent(),
                                    1
                                ]), queryId = _ref[0];
                                return [
                                    4,
                                    this.chatbotCustomerQueryModel.findOne({
                                        where: {
                                            id: queryId
                                        }
                                    })
                                ];
                            case 7:
                                createdQuery = _state.sent();
                                if (!createdQuery) {
                                    throw new BadRequestError('Failed to create query');
                                }
                                response = {
                                    data: createdQuery
                                };
                                return [
                                    2,
                                    this.serviceResponse(201, response, 'Query created successfully')
                                ];
                            case 8:
                                error = _state.sent();
                                throw error;
                            case 9:
                                return [
                                    2
                                ];
                        }
                    });
                }).call(this);
            }
        }
    ]);
    return ChatbotCrmService;
}(ResponseService);

//# sourceMappingURL=chatbotCrm.service.js.map