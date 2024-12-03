import { Body, Controller, Delete, Patch, Req, UseGuards } from '@nestjs/common'
import { UsersService } from '../users/users.service'
import { AuthenticatedGuard } from 'src/auth/authenticated.guard'
import { ApiBody } from '@nestjs/swagger'
import { UpdateUserRequest } from 'src/requests/update.user.request'

@Controller('users')
@UseGuards(AuthenticatedGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Patch('me')
  @ApiBody({ type: UpdateUserRequest })
  async editUser(
    @Req() req: any,
    @Body('email') email: string,
    @Body('username') username: string,
    @Body('password') password: string,
  ) {
    const userId = req.user.userId
    return await this.usersService.updateUser(userId, email, username, password)
  }

  @Delete('me')
  async deleteUser(@Req() req: any) {
    const userId = req.user.userId
    return await this.usersService.removeUser(userId)
  }
}
