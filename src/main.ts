import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'
import * as session from 'express-session'
import * as passport from 'passport'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  app.setGlobalPrefix('api')

  app.use(
    session({
      secret: process.env.SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 3600000,
      },
    }),
  )
  app.use(passport.initialize())
  app.use(passport.session())

  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type, Accept, Authorization',
    credentials: true,
  })

  const config = new DocumentBuilder()
    .setTitle('Nodebook Server')
    .setDescription('The Nodebook API description')
    .setVersion('1.0')
    .addTag('nodebook')
    .build()
  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('swagger', app, document)

  console.log(`Server is running on port: ${process.env.PORT}`)
  await app.listen(process.env.PORT)
}
bootstrap()
