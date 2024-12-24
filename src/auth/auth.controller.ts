import {
  Get,
  Body,
  Controller,
  Post,
  UseGuards,
  Req,
  Redirect,
} from '@nestjs/common'
import { AuthService } from './auth.service'
import { CreateUserRequest, LoginUserRequest } from '../requests/users.requests'
import { ApiTags } from '@nestjs/swagger'
import {
  SwaggerUpsert,
  SwaggerGet,
  SwaggerUnauthorized,
  SwaggerConflict,
} from '../utils/swagger/swagger.decorators'
import { LocalAuthGuard } from '../utils/local/local.auth.guard'
import GoogleAuthGuard from '../utils/google/google.auth.guard'
import { AuthResponse } from '../responses/auth.responses'

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/signup')
  @SwaggerUpsert('Register a new user', CreateUserRequest, AuthResponse)
  @SwaggerConflict()
  async signUp(@Body() createUserDto: CreateUserRequest, @Req() req) {
    const user = await this.authService.registerUser(createUserDto)
    req.session.passport = {
      user: {
        userId: user.userId,
        email: createUserDto.email,
        username: createUserDto.username,
      },
    }
    return {
      usersResponse: {
        userId: user.userId,
        email: createUserDto.email,
        username: createUserDto.username,
      },
      message: 'User successfully signed up',
    }
  }

  @UseGuards(LocalAuthGuard)
  @Post('/login')
  @SwaggerUpsert('Login', LoginUserRequest, AuthResponse)
  @SwaggerUnauthorized()
  async login(@Req() req) {
    return { usersResponse: req.user, message: 'User logged in successfully' }
  }

  @Post('/logout')
  @SwaggerGet('Logout user', String)
  @SwaggerUnauthorized()
  logout(@Req() req) {
    req.session.destroy()
    return { message: 'User session ended' }
  }

  @Post('google/login')
  @SwaggerGet('Login through Google (only redirect)', String)
  @UseGuards(GoogleAuthGuard)
  googleLogin() {}

  @Get('google/callback')
  @SwaggerGet('Handle Google login callback', AuthResponse)
  @SwaggerUnauthorized()
  @UseGuards(GoogleAuthGuard)
  @Redirect('/swagger')
  async googleCallback(@Req() req) {
    const { email, name } = req.user

    const existingUser = await this.authService.validateOAuthUser(email)

    if (!existingUser) {
      const newUser = await this.authService.registerOAuthUser(
        email,
        name,
        'GOOGLE',
      )
      return { usersResponse: newUser, message: 'Google login successful' }
    }

    return { usersResponse: existingUser, message: 'Google login successful' }
  }
}
