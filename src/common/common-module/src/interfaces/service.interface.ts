export interface serviceResponse {
  ok: boolean
  err?: string
  data?: any
}

export interface IServiceResponse{
  statusCode: number;
  data: Record<string, any>;
  message: string;
}