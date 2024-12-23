import { Test, TestingModule } from '@nestjs/testing'
import { UsersService } from './users.service'
import { getModelToken } from '@nestjs/mongoose'
import { NotFoundException, ConflictException } from '@nestjs/common'

describe('UsersService', () => {
  let service: UsersService
  let userModelMock: any
  let oAuthUserModelMock: any

  beforeEach(async () => {
    userModelMock = {
      findOne: jest.fn(),
      findByIdAndUpdate: jest.fn(),
      findByIdAndDelete: jest.fn(),
      save: jest.fn(),
    }
    oAuthUserModelMock = {
      findOne: jest.fn(),
      save: jest.fn(),
    }

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: getModelToken('user'), useValue: userModelMock },
        { provide: getModelToken('oAuthUser'), useValue: oAuthUserModelMock },
      ],
    }).compile()

    service = module.get<UsersService>(UsersService)
  })

  describe('updateUser', () => {
    it('should throw NotFoundException if user does not exist', async () => {
      userModelMock.findByIdAndUpdate.mockResolvedValue(null)

      await expect(
        service.updateUser('nonexistentId', { username: 'newUsername' }),
      ).rejects.toThrow(NotFoundException)
    })
  })

  describe('removeUser', () => {
    it('should delete a user and return success message', async () => {
      userModelMock.findByIdAndDelete.mockResolvedValue({ id: 'userId' })

      const result = await service.removeUser('userId')
      expect(userModelMock.findByIdAndDelete).toHaveBeenCalledWith('userId')
      expect(result).toEqual({ message: 'User deleted successfully' })
    })

    it('should throw NotFoundException if user does not exist', async () => {
      userModelMock.findByIdAndDelete.mockResolvedValue(null)

      await expect(service.removeUser('nonexistentId')).rejects.toThrow(
        NotFoundException,
      )
    })
  })

  describe('insertOAuthUser', () => {
    it('should throw ConflictException if OAuth user already exists', async () => {
      oAuthUserModelMock.findOne.mockResolvedValue({ id: 'existingId' })

      await expect(
        service.insertOAuthUser('existing@example.com', 'username', 'GOOGLE'),
      ).rejects.toThrow(ConflictException)
    })
  })

  describe('getOAuthUserByEmail', () => {
    it('should return an OAuth user if found', async () => {
      oAuthUserModelMock.findOne.mockResolvedValue({
        email: 'oauth@example.com',
      })

      const result = await service.getOAuthUserByEmail('oauth@example.com')
      expect(oAuthUserModelMock.findOne).toHaveBeenCalledWith({
        email: 'oauth@example.com',
      })
      expect(result).toEqual({ email: 'oauth@example.com' })
    })

    it('should return null if OAuth user not found', async () => {
      oAuthUserModelMock.findOne.mockResolvedValue(null)

      const result = await service.getOAuthUserByEmail(
        'nonexistent@example.com',
      )
      expect(result).toBeNull()
    })
  })
})
