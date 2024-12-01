import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { User } from './users.model'
@Injectable()
export class UsersService {
  constructor(@InjectModel('user') private readonly userModel: Model<User>) {}
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

  async getUser(userName: string) {
    const username = userName.toLowerCase()
    const user = await this.userModel.findOne({ username })
    return user
  }
}
