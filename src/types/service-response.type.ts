export type ServiceResponse<T = void> = {
  success: boolean;
  message: string;
  data?: T | null;
  status?: number;
  errors?: string[];
};

export interface ErrorContext {
  originalError?: unknown;
  userId?: string;
  action?: string;
}

export type SuccessResponse<T> = ServiceResponse<T> & {
  success: true;
  data: T;
};

export type ErrorResponse = ServiceResponse<null> & { success: false };
