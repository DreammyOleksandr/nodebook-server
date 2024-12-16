import {
  Get,
  Body,
  Controller,
  Delete,
  Patch,
  Req,
  UseGuards,
} from '@nestjs/common'
import { ApiTags, ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger'
import { AuthenticatedGuard } from 'src/auth/authenticated.guard'
import { UsersService } from '../users/users.service'
import { UpdateUserRequest } from '../requests/users.requests'

@ApiTags('users')
@Controller('users')
@UseGuards(AuthenticatedGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(AuthenticatedGuard)
  @Get('/me')
  @ApiOperation({ summary: 'Get user details' })
  getUser(@Req() req) {
    return req.user
  }

  @UseGuards(AuthenticatedGuard)
  @Patch('me')
  @ApiOperation({ summary: 'Update current user' })
  @ApiBody({ type: UpdateUserRequest })
  @ApiResponse({ status: 200, description: 'User updated successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
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
  @ApiOperation({ summary: 'Delete current user' })
  @ApiResponse({ status: 200, description: 'User deleted successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @UseGuards(AuthenticatedGuard)
  async deleteUser(@Req() req: any) {
    const userId = req.user.userId
    await this.usersService.removeUser(userId)
    req.session.destroy()
    return { message: 'User deleted successfully' }
  }
}
