import { IAddPageInstructionPayload, IPageInstructionPayload } from '@/interfaces/pageInstructions.interface'
import Joi, { ObjectSchema } from 'joi'

export const pageInstructionSchema: ObjectSchema<IPageInstructionPayload> =
  Joi.object<IPageInstructionPayload>({
    page_name: Joi.string().required(),
  }).unknown(false)

export const addPageInstructionSchema: ObjectSchema<IAddPageInstructionPayload> =
  Joi.object<IAddPageInstructionPayload>({
    page_name: Joi.string().required(),
    instruction: Joi.string().required(),
  }).unknown(false)
