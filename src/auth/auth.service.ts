import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common'
import * as bcrypt from 'bcrypt'
import { UsersService } from '../users/users.service'
import { CreateUserRequest } from '../requests/users.requests'

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService) {}

  async registerUser(createUserDto: CreateUserRequest) {
    const { email, username, password } = createUserDto

    const existingUser = await this.usersService.getUserByEmail(email)
    if (existingUser) {
      throw new ConflictException('User already exists')
    }

    const hashedPassword = await this.hashPassword(password)
    const user = await this.usersService.insertUser(
      email,
      username,
      hashedPassword,
    )

    return { message: 'User registered successfully', userId: user.id }
  }

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.getUserByEmail(email)
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new NotFoundException('Invalid email or password')
    }
    return { userId: user.id, email: user.email, username: user.username }
  }

  private async hashPassword(password: string) {
    const saltOrRounds = Number(process.env.SALT_OR_ROUNDS)
    return await bcrypt.hash(password, saltOrRounds)
  }

  async validateOAuthUser(email: string) {
    const user = await this.usersService.getOAuthUserByEmail(email)
    if (!user) {
      return null
    }
    return { userId: user.id, email: user.email, service: user.service }
  }

  async registerOAuthUser(email: string, username: string, service: string) {
    return await this.usersService.insertOAuthUser(email, username, service)
  }
}
