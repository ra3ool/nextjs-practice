import type {
  ErrorResponse,
  ServiceResponse,
  SuccessResponse,
} from '@/types/service-response.type';

class ResponseBuilder {
  static success<T>(data: T, message: string = 'Success'): ServiceResponse<T> {
    return {
      success: true,
      message,
      data,
      status: 200,
    };
  }

  static error(
    message: string = 'Something went wrong',
    status: number = 500,
    errors: string[] = [],
  ): ServiceResponse<null> {
    return {
      success: false,
      message,
      data: null,
      status,
      errors,
    };
  }

  static notFound(
    message: string = 'Resource not found',
  ): ServiceResponse<null> {
    return this.error(message, 404);
  }

  static badRequest(
    message: string = 'Bad request',
    errors: string[] = [],
  ): ServiceResponse<null> {
    return this.error(message, 400, errors);
  }

  static unauthorized(message: string = 'Unauthorized'): ServiceResponse<null> {
    return this.error(message, 401);
  }
}

function isSuccessResponse<T>(
  response: ServiceResponse<T>,
): response is SuccessResponse<T> {
  return response.success === true;
}

function isErrorResponse<T>(
  response: ServiceResponse<T>,
): response is ErrorResponse {
  return response.success === false;
}

export { isErrorResponse, isSuccessResponse, ResponseBuilder };
