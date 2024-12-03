import { PassportStrategy } from '@nestjs/passport'
import { Strategy } from 'passport-google-oauth20'
import { UsersService } from 'src/users/users.service'

export class GoogleStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly usersService: UsersService) {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
      scope: ['email', 'profile'],
    })
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
  ): Promise<any> {
    const { emails, displayName } = profile

    const email = emails[0].value
    const user = await this.usersService.getOAuthUserByEmail(email)

    return !user
      ? await this.usersService.insertOAuthUser(email, displayName, 'GOOGLE')
      : user
  }
}
