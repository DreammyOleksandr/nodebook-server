import { Test, TestingModule } from '@nestjs/testing'
import { UsersController } from './users.controller'
import { UsersService } from '../users/users.service'
import { MessagesService } from '../../libs/message'
import { UpdateUserRequest } from '../requests/users.requests'
import { SupportMessageRequest } from '../requests/support.requests'
import { AuthenticatedGuard } from '../auth/authenticated.guard'

describe('UsersController', () => {
  let controller: UsersController
  let usersService: Partial<UsersService>
  let messagesService: Partial<MessagesService>

  beforeEach(async () => {
    usersService = {
      updateUser: jest.fn(),
      removeUser: jest.fn(),
    }

    messagesService = {
      sendSupportMessage: jest.fn(),
    }

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        { provide: UsersService, useValue: usersService },
        { provide: MessagesService, useValue: messagesService },
      ],
    })
      .overrideGuard(AuthenticatedGuard)
      .useValue({ canActivate: () => true })
      .compile()

    controller = module.get<UsersController>(UsersController)
  })

  it('should return user details on GET /me', () => {
    const req = { user: { email: 'test@example.com', username: 'testuser' } }
    const result = controller.getUser(req)
    expect(result).toEqual(req.user)
  })

  it('should throw an error if no user is logged in on GET /me', () => {
    const req = undefined
    expect(() => controller.getUser(req)).toThrow()
  })

  it('should throw an error if no user is logged in on PATCH /me', async () => {
    const req = { session: { passport: { user: undefined } } }
    const updateUserDto: UpdateUserRequest = { email: 'updated@example.com' }

    await expect(controller.updateUser(updateUserDto, req)).rejects.toThrow(
      'User not logged in',
    )
  })

  it('should delete user on DELETE /me', async () => {
    const req = { user: { userId: '123' }, session: { destroy: jest.fn() } }
    jest.spyOn(usersService, 'removeUser').mockResolvedValue(undefined)

    const result = await controller.deleteUser(req)

    expect(usersService.removeUser).toHaveBeenCalledWith('123')
    expect(req.session.destroy).toHaveBeenCalled()
    expect(result).toEqual({ message: 'User deleted successfully' })
  })

  it('should send a support message on POST /message/support', async () => {
    const req = { user: { email: 'user@example.com' } }
    const supportMessageDto: SupportMessageRequest = {
      subject: 'Test Subject',
      content: 'Test Content',
    }

    const resolvedValue = {
      message: 'Message sent successfully',
      success: true,
    }

    jest
      .spyOn(messagesService, 'sendSupportMessage')
      .mockResolvedValue(resolvedValue)

    const result = await controller.sendSupportMessage(req, supportMessageDto)

    expect(messagesService.sendSupportMessage).toHaveBeenCalledWith(
      'user@example.com',
      'Test Subject',
      'Test Content',
    )
    expect(result).toEqual({
      success: true,
      message: 'Message sent successfully',
    })
  })
})
