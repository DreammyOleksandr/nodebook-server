import { applyDecorators } from '@nestjs/common'
import { ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger'

export function SwaggerUpsert(
  summary: string,
  bodyType: any,
  responseType: any,
) {
  return applyDecorators(
    ApiOperation({ summary }),
    ApiBody({ type: bodyType }),
    ApiResponse({
      status: 200,
      description: `${summary} successfully`,
      type: responseType,
    }),
  )
}

export function SwaggerGet(summary: string, responseType: any) {
  return applyDecorators(
    ApiOperation({ summary }),
    ApiResponse({
      status: 200,
      description: `${summary} successfully`,
      type: responseType,
    }),
  )
}

export function SwaggerDelete(summary: string) {
  return applyDecorators(
    ApiOperation({ summary }),
    ApiResponse({ status: 204, description: `${summary} successfully` }),
  )
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
