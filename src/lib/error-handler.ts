import { ServiceResponse } from '@/types/service-response.type';
import { Prisma } from '@prisma/client';
import { ZodError } from 'zod';
import { ResponseBuilder } from './response';

function handleServiceError(error: unknown): ServiceResponse<null> {
  if (error instanceof ZodError) {
    return ResponseBuilder.badRequest(
      'Validation failed',
      error.issues.map((issue) => `${issue.path.join('.')}: ${issue.message}`),
    );
  }

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    switch (error.code) {
      case 'P2025':
        return ResponseBuilder.notFound('Record not found');
      case 'P2002':
        return ResponseBuilder.error('Unique constraint violation', 409);
      case 'P2014':
        return ResponseBuilder.error('Relation violation', 409);
      default:
        return ResponseBuilder.error('Database error', 500);
    }
  }

  if (error instanceof Error) {
    if (error.message.includes('auth') || error.message.includes('session')) {
      return ResponseBuilder.unauthorized('Authentication required');
    }
  }

  return ResponseBuilder.error('Internal server error', 500);
}

export { handleServiceError };
