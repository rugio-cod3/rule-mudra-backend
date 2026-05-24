import Joi from 'joi';
var csvFileValidation = Joi.object({
    mimetype: Joi.string().pattern(/\.(xlsx|csv)$/i).required(),
    size: Joi.number().max(100 * 1024 * 1024) // Limit 100MB
    .messages({
        'number.max': 'The CSV file size must be less than or equal to 100MB.'
    })
}).unknown(true);
export var FileUploadSchema = Joi.object({
    image: csvFileValidation,
    type: Joi.string().valid('xlsx', 'csv').required()
}).unknown(false);
export var callMonitoringSchema = Joi.object({
    startDate: Joi.date().required(),
    endDate: Joi.date().required()
}).unknown(false);
export var callDescriptionSchema = Joi.object({
    callDate: Joi.date().required(),
    repayDate: Joi.date().required()
}).unknown(false);
export var ProjectionReportPayloadSchema = Joi.object({
    startDate: Joi.date().required(),
    endDate: Joi.date().required()
}).unknown(false);

//# sourceMappingURL=projection.validator.js.map