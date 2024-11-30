import { Body, Controller, Post } from '@nestjs/common'
import { UsersService } from './users.service'
import * as bcrypt from 'bcrypt'
import { CreateUserDto } from 'src/DTOs/createUserDto'
import { ApiTags, ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger'

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('/signup')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({ status: 201, description: 'User successfully registered' })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  async addUser(@Body() createUserDto: CreateUserDto) {
    const saltOrRounds = Number(process.env.SALT_OR_ROUNDS)
    const hashedPassword = await bcrypt.hash(
      createUserDto.password,
      saltOrRounds,
    )
    const result = await this.usersService.insertUser(
      createUserDto.username,
      hashedPassword,
    )
    return {
      msg: 'User successfully registered',
      userId: result.id,
      userName: result.username,
    }
  }
}
