export interface ICreditScoreUserJourney {
  id: number
  step: number //1:view_t&c, 2:accept_t&c 3: subscription_attempted 4: subscription_success 5: subscription_failed 6:to_be_questioned 7: questioned_success 8: questioned_failed 9: complete
  attempt: number
  customerID: number
}

export type TSelectCreditScoreUserJourney = keyof ICreditScoreUserJourney
