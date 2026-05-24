import { Knex } from 'knex'
import { StepName } from '../../enums/common.enum'
import { LeadType } from '../../enums/lead.enum'
import { Products } from '../../enums/product.enum'
import { StepProvider } from '../../enums/step.enum'
import { IStepControlModel } from '../../interfaces/stepControl.interface'
import {
  ICreateStepTrackerForProduct,
  IStepTrackerModel,
  IUpdateStep,
  TSelectStepTracker,
} from '../../interfaces/stepTracker.interface'
import {
  DeleteWhere,
  InsertData,
  KnexFindParams,
  SelectFields,
  SortCriteria,
  UpdateQuery,
  WhereQuery,
} from '../../types/model.types'
import { logger } from '../../utils/logger'
import { getKnexInstance } from '../../utils/mysql'
import { productModel } from '../mysql/products'
import { stepControlModel } from '../mysql/stepControl'
import { leadModel } from './leads'

export default class StepTrackerModel {
  private table = 'step_tracker'
  private readonly stepControlmodel = stepControlModel
  private readonly productModel = productModel
  private readonly leadModel = leadModel

  StepTrackerKnex<T>(): Knex.QueryBuilder<T> {
    const db = getKnexInstance()
    return db<T>(this.table)
  }

  async findOneStepTracker(
    where: WhereQuery<IStepTrackerModel>,
    select: SelectFields<TSelectStepTracker> = ['*'],
    orderBy?: SortCriteria<TSelectStepTracker>,
  ): Promise<IStepTrackerModel> {
    let db = getKnexInstance()

    const query = db(this.table)
      .where(where)
      .select(...select)

    if (orderBy) query.orderBy(orderBy)

    return await query.first()
  }

  public async insert(data: InsertData<IStepTrackerModel>): Promise<number[]> {
    let db = getKnexInstance()
    return await db(this.table).insert(data)
  }
  async findOneAndUpdate(
    where: WhereQuery<IStepTrackerModel>,
    update: UpdateQuery<IStepTrackerModel>,
  ): Promise<number> {
    let db = getKnexInstance()

    return await db(this.table).where(where).update(update)
  }

  async delete(deleteWhere: DeleteWhere<TSelectStepTracker>) {
    const db = getKnexInstance()
    const query = db(this.table)

    deleteWhere.forEach(element => {
      const { column, operator, value } = element

      if (operator) query.where(column, operator, value)
      else query.where(column, value)
    })

    return await query.delete()
  }

  async find(
    params: KnexFindParams<IStepTrackerModel, TSelectStepTracker>,
  ): Promise<IStepTrackerModel[]> {
    const { order, select = ['*'], where, whereIn, whereNot, whereNotNull, whereRaw } = params
    let db = getKnexInstance()

    let query = db(this.table)

    if (where) {
      if (Array.isArray(where)) {
        where.forEach(element => {
          const { column, operator, value } = element

          if (operator) query.where(column, operator, value)
          else query.where(column, value)
        })
      } else {
        query.where(where)
      }
    }

    query.select(...select)

    if (whereIn) {
      whereIn.forEach(condition => {
        const { column, value } = condition
        query.whereIn(column, value)
      })
    }

    if (whereRaw) {
      whereRaw.forEach(condition => {
        const { rawQuery, values } = condition
        query.whereRaw(rawQuery, values)
      })
    }

    if (whereNot) {
      query.whereNot(whereNot)
    }

    if (whereNotNull) {
      whereNotNull.forEach(column => query.whereNotNull(column))
    }

    if (order) query.orderBy(order)

    return await query
  }

  async count(where?: WhereQuery<IStepTrackerModel>, whereNot?: WhereQuery<IStepTrackerModel>) {
    let db = getKnexInstance()

    const count = db(this.table)

    if (where) count.where(where)
    if (whereNot) count.whereNot(whereNot)

    const data = await count.count()

    return data[0]['count(*)'] as number
  }

  async findAll(
    select: SelectFields<TSelectStepTracker> = ['*'],
    where?: WhereQuery<IStepTrackerModel>,
    orderBy?: SortCriteria<TSelectStepTracker>,
  ): Promise<IStepTrackerModel[]> {
    let db = getKnexInstance()

    const query = db(this.table)

    if (where) {
      query.where(where)
    }

    if (select) {
      query.select(...select)
    }

    if (orderBy) query.orderBy(orderBy)

    return await query
  }

  async createStepForLoanOnboarding(payload: IUpdateStep): Promise<ICreateStepTrackerForProduct> {
    const { customerID, stepId, currentStepOrder, productId, isCompleted } = payload

    const data: ICreateStepTrackerForProduct = {
      isCurrentStep: false,
      isOldStep: false,
      isNextStep: true,
      step: null,
    }

    if (!isCompleted)
      await this.findOneAndUpdate(
        { customer_id: customerID, step_id: stepId },
        { is_completed: true },
      )

    // Find all steps
    const steps = await this.stepControlmodel.findAll(
      [
        'id',
        'next_route',
        'product_id',
        'step_display_name',
        'step_order',
        'current_route',
        'step_name',
      ],
      { product_id: productId, is_active: true },
      [{ column: 'step_order', order: 'asc' }],
    )

    if (steps.length === 0) {
      logger.warn('No Steps found in db, nextStep could not be saved')
      data.isCurrentStep = true
      data.isNextStep = false
      data.step = null
      return data
    }

    const userSteps = await this.findAll(['*'], { customer_id: customerID })

    // Now get user current step order
    // let's say currentStepOrder = 4, now we have to check if step_orders 1-4 of user is completed or not
    let beforeCount = 1

    // Checking if user has completed prev steps or not
    // If not then needs to complete it first, and entry needs to be made
    while (beforeCount < currentStepOrder) {
      const step = steps.find(step => step.step_order === beforeCount)

      if (!step) {
        beforeCount++
        continue
      }
      // Check if user has completed this step or not
      const userStep = userSteps.find(userStep => userStep.step_id === step.id)

      if (userStep && !userStep.is_completed) {
        // User needs to complete this incomplete step first
        data.isOldStep = true
        data.isNextStep = false
        data.step = step
        return data
      }
      // If step is not found, then entry needs to be made for that step
      if (!userStep) {
        await this.insert({
          customer_id: customerID,
          step_id: step.id,
        })
        data.isOldStep = true
        data.isNextStep = false
        data.step = step
        return data
      }
      beforeCount++
    }

    let afterCount = currentStepOrder + 1
    // Check the next step that the user needs to complete, if they have already completed previous steps:
    while (afterCount <= steps.length) {
      const step = steps.find(step => step.step_order === afterCount)

      if (!step) {
        afterCount++
        continue
      }
      // Check if user has completed this step or not
      const userStep = userSteps.find(userStep => userStep.step_id === step.id)

      if (userStep && !userStep.is_completed) {
        // User needs to complete this incomplete step first

        data.step = step
        return data
      }
      // If step is not found, then entry needs to be made for that step
      if (!userStep) {
        await this.insert({
          customer_id: customerID,
          step_id: step.id,
        })
        data.step = step
        return data
      }
      afterCount++
    }

    // If no step got updated
    data.isNextStep = false
    return data
  }

  async completeStep(customerID: number, stepName: StepName, product: Products, leadID?: number) {
    const productDetails = await this.productModel.findOne({
      name: product,
    })

    if (!productDetails) {
      logger.error('Error saving step in step_tracker \n Reason: Product details not found')
      return
    }

    const step = await this.stepControlmodel.findOne({
      where: { step_name: stepName, product_id: productDetails.productID },
      select: ['id', 'provider_id', 'step_order', 'should_recheck'],
    })

    // If it's first step of repeat/existing flow then just make the entry as is
    if (step.provider_id === StepProvider.REPEAT_CUSTOMER && step.step_order === 1) {
      const userStep = await this.findOneStepTracker(
        {
          step_id: step.id,
          customer_id: customerID,
          lead_id: leadID ? leadID : null,
        },
        ['id'],
      )

      if (!userStep) {
        // If not completed that insert entry
        await this.insert({
          customer_id: customerID,
          step_id: step.id,
          lead_id: leadID,
          is_completed: true,
        })
      }
      return
    } else if (step.provider_id === StepProvider.GENERIC) {
      // Or if it's a generic step no extra things needed to be checked
      const userStep = await this.findOneStepTracker(
        {
          step_id: step.id,
          customer_id: customerID,
          lead_id: leadID ? leadID : null,
        },
        ['id'],
      )

      if (!userStep) {
        // If not completed that insert entry
        await this.insert({
          customer_id: customerID,
          step_id: step.id,
          lead_id: leadID,
          is_completed: true,
        })
      }
      return
    }

    // Checking if customer is completing repeat/existing flow or normal flow
    const lead = leadID ? await this.leadModel.findOne({ where: { leadID } }) : null

    const leadType = lead?.fbLeads

    // Find out the step
    let sentStep: IStepControlModel

    // TODO : Check on the basis of fbleads
    // Ignore the step which has should_recheck = 1

    if (leadType === LeadType.REPEAT_CASE || leadType === LeadType.EXISTING_CASE) {
      if (step.should_recheck) {
        const userStep = await this.findOneStepTracker(
          {
            step_id: step.id,
            customer_id: customerID,
            lead_id: leadID ? leadID : null,
          },
          ['id'],
        )

        if (!userStep) {
          // If not completed that insert entry
          await this.insert({
            customer_id: customerID,
            step_id: step.id,
            lead_id: leadID,
            is_completed: true,
          })
        }
        return
      }

      sentStep = await this.stepControlmodel.findOne({
        where: {
          step_name: stepName,
          product_id: productDetails.productID,
          provider_id: StepProvider.REPEAT_CUSTOMER,
        },
        select: ['id'],
      })
    } else {
      // Handling new flow steps
      sentStep = await this.stepControlmodel.findOne({
        where: {
          step_name: stepName,
          product_id: productDetails.productID,
        },
        select: ['id'],
      })
    }

    if (!sentStep) {
      // Check if sentStep of finbox

      sentStep = await this.stepControlmodel.findOne({
        where: {
          step_name: stepName,
          product_id: productDetails.productID,
        },
        select: ['id'],
      })

      const userStep = await this.findOneStepTracker(
        {
          step_id: sentStep.id,
          customer_id: customerID,
          lead_id: leadID ? leadID : null,
        },
        ['id', 'is_completed'],
      )

      if (!userStep) {
        // If not completed that insert entry
        await this.insert({
          customer_id: customerID,
          step_id: sentStep.id,
          lead_id: leadID,
          is_completed: true,
        })
        return
      }

      // If !is_completed, then complete that step
      if (!userStep.is_completed) {
        await this.findOneAndUpdate(
          {
            step_id: sentStep.id,
            customer_id: customerID,
            lead_id: leadID ? leadID : null,
          },
          { is_completed: true },
        )
        return
      }

      logger.error('Error saving step in step_tracker \n Reason: Step details not found')
      return
    }

    // Check if user has already completed the step

    const userStep = await this.findOneStepTracker(
      {
        step_id: sentStep.id,
        customer_id: customerID,
        lead_id: leadID ? leadID : null,
      },
      ['id', 'is_completed'],
    )

    if (!userStep) {
      // If not completed that insert entry
      await this.insert({
        customer_id: customerID,
        step_id: sentStep.id,
        lead_id: leadID,
        is_completed: true,
      })
      return
    }

    // If !is_completed, then complete that step
    if (!userStep.is_completed) {
      await this.findOneAndUpdate(
        {
          step_id: sentStep.id,
          customer_id: customerID,
          lead_id: leadID ? leadID : null,
        },
        { is_completed: true },
      )
    }
  }

  async saveFinboxIncompleteStep(customerID: number, leadID: number, product: Products) {
    // 1. Find finbox step

    const productDetails = await this.productModel.findOne(
      {
        name: product,
      },
      ['productID'],
    )

    const step = await this.stepControlmodel.findOne({
      where: {
        step_name: StepName.FINBOX,
        product_id: productDetails.productID,
      },
      select: ['id'],
    })

    // 2. Insert if no entry made with is_completed false of finbox;

    // Check if user has already done the step entry

    const userStep = await this.findOneStepTracker(
      {
        step_id: step.id,
        customer_id: customerID,
        lead_id: leadID,
        is_completed: false,
      },
      ['id'],
    )

    if (!userStep)
      await this.insert({
        customer_id: customerID,
        step_id: step.id,
        lead_id: leadID,
        is_completed: false,
      })
  }
}

export const stepTrackerModel = new StepTrackerModel()
