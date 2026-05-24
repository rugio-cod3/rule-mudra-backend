import Joi from 'joi';

export const stepCheckerSchema = Joi.object({
    user_id: Joi.number().required(),
    step_name: Joi.string().required(),
    loan_id: Joi.number().optional(),
});