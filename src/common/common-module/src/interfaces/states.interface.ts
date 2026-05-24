
export interface IState {
    stateID: number
    stateName: string
    status: number
    createdDate: Date
    code: string
    cibil_state_code: string
  }
  
  export type TSelectState = keyof IState
  