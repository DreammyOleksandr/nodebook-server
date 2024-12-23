import { Injectable } from '@nestjs/common'
import * as nodemailer from 'nodemailer'

@Injectable()
export class MessagesService {
  private transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE,
    host: process.env.EMAIL_HOST,
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    logger: true,
    debug: true,
  })

  async sendSupportMessage(email: string, subject: string, content: string) {
    subject = `${email}: ${subject}`
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      subject,
      text: content,
    }

    await this.transporter.sendMail(mailOptions)
    return { success: true, message: 'Message sent successfully' }
  }
}
