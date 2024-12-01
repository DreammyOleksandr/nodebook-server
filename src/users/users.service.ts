import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { User } from './users.model'
import { OAuthUser } from './users.oauth.model'
@Injectable()
export class UsersService {
  constructor(
    @InjectModel('user') private readonly userModel: Model<User>,
    @InjectModel('oAuthUser') private readonly oAuthUserModel: Model<OAuthUser>,
  ) {}
  async insertUser(email: string, username: string, password: string) {
    email = email.toLowerCase()
    username = username.toLowerCase()
    const newUser = new this.userModel({
      email,
      username,
      password,
    })
    await newUser.save()
    return newUser
  }

  async insertOAuthUser(email: string, username: string) {
    email = email.toLowerCase()
    username = username.toLowerCase()
    const newUser = new this.oAuthUserModel({
      email,
      username,
    })
    await newUser.save()
    return newUser
  }

  async getUser(email: string) {
    email = email.toLowerCase()
    const user = await this.userModel.findOne({ email })
    return user
  }

  async getOAuthUser(email: string) {
    email = email.toLowerCase()
    const user = await this.oAuthUserModel.findOne({ email })
    return user
  }
}
