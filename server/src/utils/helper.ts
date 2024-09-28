export interface CustomError extends Error {
  status?: number;
  data?: any;
}

export const error = new Error() as CustomError;
