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
