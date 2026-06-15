import { Prisma } from '@/lib/prisma-client';
import { ResponseBuilder } from '@/lib/response';
import { ErrorContext, ServiceResponse } from '@/types/service-response.type';
import { ZodError } from 'zod';

function handleServiceError(
  error: unknown,
  context: ErrorContext = {},
): ServiceResponse<null> {
  const { /*originalError, userId,*/ action } = context;

  // console.error('Service error:', {
  //   error,
  //   userId,
  //   action,
  //   timestamp: new Date().toISOString(),
  // });

  if (error instanceof ZodError) {
    const errorDetails = error.issues.map((issue) => ({
      field: issue.path.join('.'),
      message: issue.message,
      code: issue.code,
    }));

    return ResponseBuilder.badRequest(
      'Validation failed',
      errorDetails.map((detail) =>
        detail.field ? `${detail.field}: ${detail.message}` : detail.message,
      ),
    );
  }

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    const prismaError = error as Prisma.PrismaClientKnownRequestError & {
      meta?: { target?: string[] };
    };

    switch (prismaError.code) {
      case 'P2025':
        return ResponseBuilder.notFound(
          action
            ? `${action.replace(/^\w/, (c) => c.toUpperCase())} not found`
            : 'Record not found',
        );

      case 'P2002':
        //TODO find a better way to grab and show error
        const fieldName = prismaError.meta?.target?.[0] || 'field';
        return ResponseBuilder.error(`${fieldName} already exists`, 409, [
          `Duplicate value for ${fieldName}`,
        ]);

      case 'P2003':
        return ResponseBuilder.error('Related record not found', 400, [
          'Foreign key constraint failed',
        ]);

      case 'P2014':
        return ResponseBuilder.error('Relationship violation', 409, [
          'Cannot perform action due to existing relationships',
        ]);

      case 'P2015':
        return ResponseBuilder.notFound('Related record not found');

      case 'P2016':
        return ResponseBuilder.error('Query interpretation error', 400);

      case 'P2021':
        return ResponseBuilder.error('Database table does not exist', 500);

      case 'P2022':
        return ResponseBuilder.error('Database column does not exist', 500);

      default:
        console.warn('Unhandled Prisma error code:', prismaError.code);
        return ResponseBuilder.error('Database operation failed', 500);
    }
  }

  if (error instanceof Prisma.PrismaClientUnknownRequestError) {
    return ResponseBuilder.error('Database operation failed', 500);
  }

  if (error instanceof Error) {
    const message = error.message.toLowerCase();

    if (
      message.includes('auth') ||
      message.includes('session') ||
      message.includes('unauthorized')
    ) {
      return ResponseBuilder.unauthorized('Authentication required');
    }

    if (message.includes('forbidden') || message.includes('permission')) {
      return ResponseBuilder.error('Access denied', 403);
    }

    if (
      message.includes('network') ||
      message.includes('fetch') ||
      message.includes('connect')
    ) {
      return ResponseBuilder.error('Network connection failed', 503);
    }

    if (message.includes('timeout')) {
      return ResponseBuilder.error('Operation timed out', 408);
    }

    if (message.includes('not found')) {
      return ResponseBuilder.notFound('Resource not found');
    }
  }

  console.error('Unhandled error type:', {
    errorType: typeof error,
    error,
    context,
  });

  return ResponseBuilder.error('An unexpected error occurred', 500);
}

export { handleServiceError };
