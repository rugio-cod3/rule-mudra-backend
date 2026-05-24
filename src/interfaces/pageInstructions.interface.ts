export interface IPageInstructions {
  id?: number; // Primary key, unique identifier
  page_name: string;
  instruction: string;
  created_at?: Date;
  updated_at?: Date;
}
export type TSelectPageInstructions = keyof IPageInstructions

export interface IPageInstructionPayload {
  page_name: string
}

export interface IAddPageInstructionPayload {
  page_name: string
  instruction: string
}
