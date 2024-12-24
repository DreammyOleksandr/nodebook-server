import { Module } from '@nestjs/common'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { UsersModule } from '../users/users.module'
import { PassportModule } from '@nestjs/passport'
import { LocalStrategy } from '../utils/local/local.strategy'
import { SessionSerializer } from '../utils/local/session.serializer'
import GoogleAuthGuard from '../utils/google/google.auth.guard'

@Module({
  imports: [UsersModule, PassportModule.register({ session: true })],
  controllers: [AuthController],
  providers: [
    AuthService,
    LocalStrategy,
    SessionSerializer,
    {
      provide: 'AUTH_SERVICE',
      useClass: AuthService,
    },
    GoogleAuthGuard,
  ],
})
export class AuthModule {}
