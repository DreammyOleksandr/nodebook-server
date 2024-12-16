import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { User } from './models/users.model'
import { OAuthUser } from './models/users.oauth.model'
import { NotFoundException, ConflictException } from '@nestjs/common'
import * as bcrypt from 'bcrypt'

@Injectable()
export class UsersService {
  constructor(
    @InjectModel('user') private readonly userModel: Model<User>,
    @InjectModel('oAuthUser') private readonly oAuthUserModel: Model<OAuthUser>,
  ) {}

  async insertUser(email: string, username: string, password: string) {
    const newUser = new this.userModel({
      email: email.toLowerCase(),
      username,
      password,
    })
    return await newUser.save()
  }

  async getUserByEmail(email: string) {
    return await this.userModel.findOne({ email: email.toLowerCase() })
  }

  async updateUser(userId: string, updates: Partial<User>) {
    if (updates.password) {
      updates.password = await bcrypt.hash(
        updates.password,
        Number(process.env.SALT_OR_ROUNDS),
      )
    }

    const updatedUser = await this.userModel.findByIdAndUpdate(
      userId,
      updates,
      { new: true },
    )
    if (!updatedUser) {
      throw new NotFoundException(`User with ID ${userId} not found`)
    }
    return updatedUser
  }

  async removeUser(userId: string) {
    const deletedUser = await this.userModel.findByIdAndDelete(userId)
    if (!deletedUser) {
      throw new NotFoundException(`User with ID ${userId} not found`)
    }
    return { message: 'User deleted successfully' }
  }

  async insertOAuthUser(email: string, username: string, service: string) {
    const existingUser = await this.oAuthUserModel.findOne({
      email: email.toLowerCase(),
    })
    if (existingUser) {
      throw new ConflictException('OAuth user already exists')
    }

    const newOAuthUser = new this.oAuthUserModel({
      email: email.toLowerCase(),
      username,
      service,
    })

    return await newOAuthUser.save()
  }

  async getOAuthUserByEmail(email: string) {
    return await this.oAuthUserModel.findOne({ email: email.toLowerCase() })
  }
}
