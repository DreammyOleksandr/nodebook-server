import { Injectable } from '@nestjs/common'

export interface User {
  email: string
  password: string
}

@Injectable()
export class AuthService {}
