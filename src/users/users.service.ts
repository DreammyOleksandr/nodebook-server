import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { User } from './users.model'
import { OAuthUser } from './users.oauth.model'
import * as bcrypt from 'bcrypt'

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
    const service: string = 'GOOGLE'
    const newUser = new this.oAuthUserModel({
      email,
      username,
      service,
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

  async updateUser(
    userId: string,
    email?: string,
    username?: string,
    password?: string,
  ) {
    const saltOrRounds = Number(process.env.SALT_OR_ROUNDS)
    const updates: Partial<{
      email: string
      username: string
      password: string
    }> = {}

    if (email) updates.email = email.toLowerCase()
    if (username) updates.username = username.toLowerCase()
    if (password) updates.password = await bcrypt.hash(password, saltOrRounds)

    const updatedUser = await this.userModel.findByIdAndUpdate(
      userId,
      updates,
      { new: true },
    )

    if (!updatedUser) {
      throw new Error(`User with ID ${userId} not found`)
    }

    await updatedUser.save()
  }

  async removeUser(userId: string) {
    const deletedUser = await this.userModel.findByIdAndDelete(userId)

    if (!deletedUser) {
      throw new Error(`User with ID ${userId} not found`)
    }

    return { message: 'User deleted successfully' }
  }
}
