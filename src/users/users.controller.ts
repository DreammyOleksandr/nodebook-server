import { Body, Controller, Delete, Patch, Req, UseGuards } from '@nestjs/common'
import { ApiTags, ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger'
import { AuthenticatedGuard } from 'src/auth/authenticated.guard'
import { UsersService } from '../users/users.service'
import { UpdateUserRequest } from '../requests/users.requests'

@ApiTags('users')
@Controller('users')
@UseGuards(AuthenticatedGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Patch('me')
  @ApiOperation({ summary: 'Update current user' })
  @ApiBody({ type: UpdateUserRequest })
  @ApiResponse({ status: 200, description: 'User updated successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async updateUser(
    @Req() req: any,
    @Body() UpdateUserRequest: UpdateUserRequest,
  ) {
    const userId = req.user.userId
    const updatedUser = await this.usersService.updateUser(
      userId,
      UpdateUserRequest,
    )
    return { message: 'User updated successfully', user: updatedUser }
  }

  @Delete('me')
  @ApiOperation({ summary: 'Delete current user' })
  @ApiResponse({ status: 200, description: 'User deleted successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async deleteUser(@Req() req: any) {
    const userId = req.user.userId
    await this.usersService.removeUser(userId)
    return { message: 'User deleted successfully' }
  }
}
