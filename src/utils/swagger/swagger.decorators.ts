import { applyDecorators } from '@nestjs/common'
import { ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger'

export function SwaggerUpsert(
  summary: string,
  requestType: any,
  responseType: any,
) {
  return applyDecorators(
    ApiOperation({ summary }),
    ApiBody({ type: requestType }),
    ApiResponse({
      status: 201,
      description: 'Operation successful',
      type: responseType,
    }),
    ApiResponse({
      status: 400,
      description: 'Bad Request: Invalid input or ID format',
    }),
    ApiResponse({
      status: 404,
      description: 'Resource not found',
    }),
  )
}

export function SwaggerUpsertNoBody(summary: string, responseType: any) {
  return applyDecorators(
    ApiOperation({ summary }),
    ApiResponse({
      status: 201,
      description: 'Operation successful',
      type: responseType,
    }),
    ApiResponse({
      status: 400,
      description: 'Bad Request: Invalid input or ID format',
    }),
    ApiResponse({
      status: 404,
      description: 'Resource not found',
    }),
  )
}

export function SwaggerGet(summary: string, responseType: any) {
  return applyDecorators(
    ApiOperation({ summary }),
    ApiResponse({
      status: 200,
      description: 'Operation successful',
      type: responseType,
    }),
    ApiResponse({
      status: 404,
      description: 'Resource not found',
    }),
    ApiResponse({
      status: 400,
      description: 'Bad Request: Invalid request format',
    }),
  )
}

export function SwaggerDelete(summary: string) {
  return applyDecorators(
    ApiOperation({ summary }),
    ApiResponse({
      status: 200,
      description: 'Resource deleted successfully',
    }),
    ApiResponse({
      status: 400,
      description: 'Bad Request: Invalid ID format',
    }),
    ApiResponse({
      status: 404,
      description: 'Resource not found',
    }),
  )
}

export function SwaggerNotFound() {
  return ApiResponse({
    status: 404,
    description: 'Resource not found',
  })
}

export function SwaggerBadRequest() {
  return ApiResponse({
    status: 400,
    description: 'Bad Request: Invalid input or ID format',
  })
}

export function SwaggerForbidden() {
  return applyDecorators(
    ApiResponse({
      status: 403,
      description: 'Forbidden: User is not authorized to perform this action',
    }),
  )
}

export function SwaggerConflict() {
  return applyDecorators(
    ApiResponse({
      status: 409,
      description: 'Conflict: The resource already exists',
      schema: {
        type: 'object',
        properties: {
          message: {
            type: 'string',
            example: 'User already exists',
          },
          error: {
            type: 'string',
            example: 'Conflict',
          },
          statusCode: {
            type: 'integer',
            example: 409,
          },
        },
      },
    }),
  )
}
