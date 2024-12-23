import { Module } from '@nestjs/common'
import { UsersService } from './users.service'
import { MongooseModule } from '@nestjs/mongoose'
import { UserSchema } from './models/users.model'
import { OAuthUserSchema } from './models/users.oauth.model'
import { UsersController } from './users.controller'
import { MessagesService } from './messages.service'

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'user', schema: UserSchema },
      { name: 'oAuthUser', schema: OAuthUserSchema },
    ]),
  ],
  providers: [MessagesService, UsersService],
  exports: [UsersService],
  controllers: [UsersController],
})
export class UsersModule {}
