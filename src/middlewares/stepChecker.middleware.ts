import { productModel } from '@/database/mysql/product'
import { stepControlModel } from '@/database/mysql/step-control'
import { stepTrackerModel } from '@/database/mysql/step_tracker'
import { StepName } from '@/enums/common.enum'
import { Products } from '@/enums/product.enum'
import { FaultyStepError } from '@/errors'
import { IStepTrackerJoinStepControl } from '@/interfaces/step-tracker'
import { NextFunction, Request, Response } from 'express'
import { logger } from '../utils/logger'

export const stepCheck = (stepName: StepName, product: Products) => {
  return async (req: Request, _res: Response, next: NextFunction) => {
    try {
      const { customerID } = req.customer
      const step = await stepControlModel.findOneStepControl({
        step_name: stepName,
      })
      if (!step) {
        logger.error(`Step: ${stepName} does not exist in table`)

        throw new FaultyStepError('Invalid Step')
      }

      const userSteps = <IStepTrackerJoinStepControl[]>(
        await stepTrackerModel
          .StepTrackerKnex<IStepTrackerJoinStepControl[]>()
          .join('step_control', 'step_tracker.step_id', 'step_control.id')
          .where({ customer_id: customerID })
          .orderBy('step_tracker.id', 'desc')
      )

      if (userSteps.length === 0) {
        logger.error(
          `User's step entry not found in database, Step Name: ${stepName}`,
        )

        throw new FaultyStepError('User step details not found')
      }

      // Check if step found == user step
      // If yes then let the user proceed
      if (step.id === userSteps[0].step_id) {
        req.userStep = userSteps[0]
        return next()
      }

      // If already completed step, user can still access the route
      const completeStep = userSteps.find((userStep) => {
        return userStep.step_id === step.id && userStep.is_completed
      })

      if (completeStep) {
        req.userStep = completeStep
        return next()
      }

      // If the step found is incompleted in user's journey then check it and do next();

      const incompleteStep = userSteps.find((userStep) => {
        return userStep.step_id === step.id && !userStep.is_completed
      })

      if (incompleteStep) {
        req.userStep = incompleteStep
        return next()
      }

      // Now at this point all the currentSteps check have been made,
      // Now we first need to check if user has completed previous steps or not

      // Find the product id first
      const productData = await productModel.findOne({ name: product }, [
        'productID',
      ])
      // Find all steps

      if (!productData) throw new FaultyStepError('Product not found')

      const steps = await stepControlModel.findAll(
        ['current_route','id','step_name','product_id','step_order','step_display_name'],
        { product_id: productData.productID, is_active: true },
        [{ column: 'step_order', order: 'asc' }],
      )

      // Now get user current step order
      // let's say currentStepOrder = 4, now we have to check if step_orders 1-4 of user is completed or not
      let beforeCount = 1
      const currentStepOrder = userSteps[0].step_order

      // Checking if user has completed prev steps or not
      // If not then needs to complete it first, and entry needs to be made
      while (beforeCount <= currentStepOrder) {
        const step = steps.find((step) => step.step_order === beforeCount)

        if (!step) {
          beforeCount++
          continue
        }
        // Check if user has completed this step or not
        const userStep = userSteps.find(
          (userStep) => userStep.step_id === step.id,
        )

        if (userStep && !userStep.is_completed) {
          // User needs to complete this incomplete step first
          throw new FaultyStepError(
            'Please complete your previous step first',
            {
              data: {
                isPreviousStep: true,
                isNextStep: false,
                isCurrentStep:false,
                step,
              },
            },
          )
        }

        beforeCount++
      }

      req.userStep = userSteps[0]
      next()
    } catch (error) {
      next(error)
    }
  }
}
