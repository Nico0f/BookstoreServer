import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';
import { CreateMailDto } from './dto/create-mail.dto';
import { UpdateMailDto } from './dto/update-mail.dto';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter
  constructor(private prisma: PrismaService) {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    })
  }

async sendEmail(to: string, subject: string, body: string) {
    await this.transporter.sendMail({
      from: process.env.SMTP_USER,
      to,
      subject,
      html: body,
    });
  }

async subscribeToNewsletter(createMailDto: CreateMailDto) {
  const user = await this.prisma.newsletterList.create({
    data: {
      email: createMailDto.email,
    },
  })
}

findAll() {
  return `This action returns all mail`;
}

findOne(id: number) {
  return `This action returns a #${id} mail`;
}

update(id: number, updateMailDto: UpdateMailDto) {
  return `This action updates a #${id} mail`;
}

remove(id: number) {
  return `This action removes a #${id} mail`;
}
}
