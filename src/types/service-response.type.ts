export type ServiceResponse<T = void> = {
  success: boolean;
  message: string;
  data?: T | null;
  status?: number;
  errors?: string[];
};

export type SuccessResponse<T> = ServiceResponse<T> & {
  success: true;
  data: T;
};

export type ErrorResponse = ServiceResponse<null> & { success: false };
