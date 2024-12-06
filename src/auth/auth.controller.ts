import { Get, Body, Controller, Post, UseGuards, Req } from '@nestjs/common'
import { AuthService } from './auth.service'
import { CreateUserRequest, LoginUserRequest } from '../requests/users.requests'
import { ApiTags, ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger'
import { LocalAuthGuard } from 'src/utils/local/local.auth.guard'
import { AuthenticatedGuard } from 'src/auth/authenticated.guard'
import GoogleAuthGuard from '../utils/google/google.auth.guard'

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/signup')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiBody({ type: CreateUserRequest })
  @ApiResponse({ status: 201, description: 'User successfully registered' })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  async signUp(@Body() createUserDto: CreateUserRequest) {
    return this.authService.registerUser(createUserDto)
  }

  @UseGuards(LocalAuthGuard)
  @Post('/login')
  @ApiOperation({ summary: 'Login' })
  @ApiBody({ type: LoginUserRequest })
  login(@Req() req) {
    return { user: req.user, message: 'User logged in successfully' }
  }

  @UseGuards(AuthenticatedGuard)
  @Get('/protected')
  @ApiOperation({ summary: 'Test protected route' })
  getHello(@Req() req) {
    return req.user
  }

  @Get('/logout')
  @ApiOperation({ summary: 'Logout user' })
  logout(@Req() req) {
    req.session.destroy()
    return { message: 'User session ended' }
  }

  @Get('google/login')
  @UseGuards(GoogleAuthGuard)
  @ApiOperation({ summary: 'Login through Google (only redirect)' })
  googleLogin() {}

  @Get('google/callback')
  @UseGuards(GoogleAuthGuard)
  @ApiOperation({ summary: 'Handle Google login callback' })
  async googleCallback(@Req() req) {
    const { email, name } = req.user

    const existingUser = await this.authService.validateOAuthUser(email)

    if (!existingUser) {
      const newUser = await this.authService.registerOAuthUser(
        email,
        name,
        'GOOGLE',
      )
      return { message: 'Google login successful', user: newUser }
    }

    return { message: 'Google login successful', user: existingUser }
  }
}
