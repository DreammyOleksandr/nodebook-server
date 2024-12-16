import {
  Get,
  Body,
  Controller,
  Delete,
  Patch,
  Req,
  UseGuards,
} from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { AuthenticatedGuard } from 'src/auth/authenticated.guard'
import { UsersService } from '../users/users.service'
import { UpdateUserRequest } from '../requests/users.requests'
import {
  SwaggerGet,
  SwaggerUpsert,
  SwaggerDelete,
  SwaggerForbidden,
} from '../utils/swagger/swagger.decorators'
import { UsersResponse } from 'src/responses/users.response'

@ApiTags('users')
@Controller('users')
@UseGuards(AuthenticatedGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('/me')
  @SwaggerGet('Get user details', UsersResponse)
  @SwaggerForbidden()
  getUser(@Req() req) {
    return req.user
  }

  @Patch('me')
  @SwaggerUpsert('Update current user', UpdateUserRequest, UsersResponse)
  @SwaggerForbidden()
  async updateUser(@Body() updateUserDto: UpdateUserRequest, @Req() req) {
    const userId = req.session.passport?.user?.userId

    if (!userId) {
      throw new Error('User not logged in')
    }

    const updatedUser = await this.usersService.updateUser(
      userId,
      updateUserDto,
    )

    console.log(req.session.passport.user)

    req.session.passport.user = {
      userId: userId,
      email: updatedUser.email,
      username: updatedUser.username,
    }

    console.log(req.session.passport.user)

    return {
      user: { email: updatedUser.email, username: updatedUser.username },
      message: 'User details successfully updated',
    }
  }

  @Delete('me')
  @SwaggerDelete('Delete current user')
  @SwaggerForbidden()
  async deleteUser(@Req() req: any) {
    const userId = req.user.userId
    await this.usersService.removeUser(userId)
    req.session.destroy()
    return { message: 'User deleted successfully' }
  }
}
