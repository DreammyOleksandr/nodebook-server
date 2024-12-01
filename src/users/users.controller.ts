import { Get, Body, Request, Controller, Post, UseGuards } from '@nestjs/common'
import { UsersService } from './users.service'
import * as bcrypt from 'bcrypt'
import { CreateUserRequest } from 'src/requests/CreateUserRequest'
import { ApiTags, ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger'
import { LocalAuthGuard } from 'src/auth/local.auth.guard'
import { AuthenticatedGuard } from 'src/auth/authenticated.guard'
import { LoginUserRequest } from 'src/requests/LoginUserRequest'

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('/signup')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiBody({ type: CreateUserRequest })
  @ApiResponse({ status: 201, description: 'User successfully registered' })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  async addUser(@Body() request: CreateUserRequest) {
    const saltOrRounds = Number(process.env.SALT_OR_ROUNDS)
    const hashedPassword = await bcrypt.hash(request.password, saltOrRounds)
    const result = await this.usersService.insertUser(
      request.email,
      request.username,
      hashedPassword,
    )
    return {
      msg: 'User successfully registered',
      userId: result.id,
      userName: result.username,
    }
  }

  @UseGuards(LocalAuthGuard)
  @Post('/login')
  @ApiBody({ type: LoginUserRequest })
  @ApiOperation({ summary: 'Login' })
  @ApiResponse({ status: 200, description: 'User successfully logged in' })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  login(@Request() req) {
    return { User: req.user, msg: 'User logged in' }
  }

  @UseGuards(AuthenticatedGuard)
  @ApiOperation({ summary: 'Test protected route' })
  @ApiResponse({ status: 200, description: 'Success' })
  @ApiResponse({ status: 403, description: 'User was not authenticated' })
  @Get('/protected')
  getHello(@Request() req): string {
    return req.user
  }

  @Get('/logout')
  @ApiOperation({ summary: 'Logout user' })
  @ApiResponse({ status: 200, description: 'Success' })
  logout(@Request() req): any {
    req.session.destroy()
    return { msg: 'The user session has ended' }
  }
}
