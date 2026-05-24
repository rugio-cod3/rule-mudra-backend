function _class_call_check(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
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
var ResponseService = function ResponseService() {
    "use strict";
    var _this = this;
    _class_call_check(this, ResponseService);
    _define_property(this, "isSuccess", function(statusCode) {
        var errorStatusCodes = [
            400,
            401,
            404,
            403,
            500,
            469,
            412,
            422
        ];
        return errorStatusCodes.every(function(status) {
            return status !== statusCode;
        });
    });
    _define_property(this, "sendResponse", function(res, statusCode, data, message) {
        return res.status(statusCode).json({
            success: _this.isSuccess(statusCode) ? true : false,
            statusCode: Number(statusCode),
            message: message,
            data: data
        });
    });
    _define_property(this, "serviceResponse", function(statusCode, data, message) {
        return {
            statusCode: statusCode,
            data: data,
            message: message
        };
    });
};
export default ResponseService;

//# sourceMappingURL=response.service.js.map