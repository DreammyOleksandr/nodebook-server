import { Module } from '@nestjs/common'
import { UsersService } from './users.service'
import { MongooseModule } from '@nestjs/mongoose'
import { UserSchema } from './users.model'

@Module({
  imports: [MongooseModule.forFeature([{ name: 'user', schema: UserSchema }])],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
