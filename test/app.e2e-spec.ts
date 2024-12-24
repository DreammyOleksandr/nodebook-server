import * as request from 'supertest'
import { INestApplication, ValidationPipe } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { AppModule } from '../src/app.module'
import * as session from 'express-session'
import * as passport from 'passport'
import { SupportMessageRequest } from 'src/requests/support.requests'
import { Model } from 'mongoose'

describe('CategoriesController (e2e)', () => {
  let app: INestApplication

  beforeAll(async () => {
    const mockUserModel = {
      create: jest.fn(),
      find: jest.fn(),
      findById: jest.fn(),
      findByIdAndUpdate: jest.fn(),
      findByIdAndDelete: jest.fn(),
      exec: jest.fn(),
    }

    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(Model)
      .useValue(mockUserModel)
      .compile()

    app = moduleFixture.createNestApplication()

    app.use(
      session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
      }),
    )
    app.use(passport.initialize())
    app.use(passport.session())

    app.useGlobalPipes(
      new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }),
    )
    await app.init()
  })

  afterAll(async () => {
    await app.close()
  })

  it('/POST categories (create category)', async () => {
    const category = { name: 'Test Category' }

    const response = await request(app.getHttpServer())
      .post('/categories')
      .send(category)
      .expect(201)

    expect(response.body).toMatchObject({
      name: category.name,
    })
  })

  it('/GET categories (get all categories)', async () => {
    const response = await request(app.getHttpServer())
      .get('/categories')
      .expect(200)

    expect(Array.isArray(response.body)).toBe(true)
  })

  it('/GET categories/:id (get category by id)', async () => {
    const category = {
      name: 'Specific Category',
    }
    const createdCategory = await request(app.getHttpServer())
      .post('/categories')
      .send(category)
      .expect(201)

    const response = await request(app.getHttpServer())
      .get(`/categories/${createdCategory.body._id}`)
      .expect(200)

    expect(response.body).toMatchObject({
      name: category.name,
    })
  })

  it('/GET categories/search/:name (get categories by name)', async () => {
    const category = {
      name: 'Searchable Category',
    }
    await request(app.getHttpServer())
      .post('/categories')
      .send(category)
      .expect(201)

    const response = await request(app.getHttpServer())
      .get(`/categories/search/${category.name}`)
      .expect(200)

    expect(Array.isArray(response.body)).toBe(true)
    expect(response.body.some((c) => c.name === category.name)).toBe(true)
  })

  it('/PUT categories/:id (update category by id)', async () => {
    const category = {
      name: 'Updatable Category',
    }
    const createdCategory = await request(app.getHttpServer())
      .post('/categories')
      .send(category)
      .expect(201)

    const updatedData = {
      name: 'Updated Name',
    }

    const response = await request(app.getHttpServer())
      .put(`/categories/${createdCategory.body._id}`)
      .send(updatedData)
      .expect(200)

    expect(response.body).toMatchObject({
      name: updatedData.name,
    })
  })

  it('/DELETE categories/:id (delete category by id)', async () => {
    const category = {
      name: 'Deletable Category',
    }
    const createdCategory = await request(app.getHttpServer())
      .post('/categories')
      .send(category)
      .expect(201)

    await request(app.getHttpServer())
      .delete(`/categories/${createdCategory.body._id}`)
      .expect(200)

    await request(app.getHttpServer())
      .get(`/categories/${createdCategory.body._id}`)
      .expect(404)
  })

  const loginUser = async () => {
    const agent = request.agent(app.getHttpServer())
    await agent.post('/auth/login').send({
      email: 'john_doe@gmail.com',
      password: 'SecurePassword123',
    })
    return agent
  }

  describe('GET /users/me', () => {
    it('should return user details if authenticated', async () => {
      const agent = await loginUser()

      const response = await agent.get('/users/me').expect(200)

      expect(response.body).toEqual(
        expect.objectContaining({
          email: 'john_doe@gmail.com',
          username: expect.any(String),
          userId: expect.any(String),
        }),
      )
    })

    it('should return 401 if not authenticated', async () => {
      await request(app.getHttpServer()).get('/users/me').expect(401)
    })
  })

  describe('PATCH /users/me', () => {
    it('should return 401 if not authenticated', async () => {
      await request(app.getHttpServer())
        .patch('/users/me')
        .send({
          email: 'unauth@example.com',
          username: 'unauthuser',
        })
        .expect(401)
    })
  })
  describe('POST /users/message/support', () => {
    it('should send a support message if authenticated', async () => {
      const agent = await loginUser()

      const supportMessageRequest: SupportMessageRequest = {
        subject: 'Support Needed',
        content: 'I need help with my account.',
      }

      const response = await agent
        .post('/users/message/support')
        .send(supportMessageRequest)
        .expect(201)

      expect(response.body).toStrictEqual({
        message: 'Message sent successfully',
        success: true,
      })
    })

    it('should return 401 if not authenticated', async () => {
      await request(app.getHttpServer())
        .post('/users/message/support')
        .send({
          subject: 'Unauthenticated Support',
          content: 'I need help but not logged in.',
        })
        .expect(401)
    })
  })
  // describe('DELETE /users/me', () => {
  //   it('should delete the user if authenticated', async () => {
  //     const agent = await loginUser()

  //     const response = await agent.delete('/users/me').expect(200)

  //     expect(response.body.message).toStrictEqual('User deleted successfully')
  //   })

  //   it('should return 401 if not authenticated', async () => {
  //     await request(app.getHttpServer()).delete('/users/me').expect(401)
  //   })
  // })
})
