import { AxiosError } from "axios";

export const catchAsync = (func: Function) => {
  return async (...args: any[]) => {
    try {
      return await func(...args);
    } catch (error) {
      let message = "Internal server error.";
      if (error instanceof AxiosError) {
        message = error.response?.data.message;
      }
      return { message, status: "error" };
    }
  };
};
