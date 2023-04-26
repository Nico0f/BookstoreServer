import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { MailService } from './mail.service';
import { CreateMailDto } from './dto/create-mail.dto';
import { UpdateMailDto } from './dto/update-mail.dto';

@Controller('mail')
export class MailController {
  constructor(private readonly mailService: MailService) {}

  @Post()
  subscribeToNewsletter(@Body() createMailDto: CreateMailDto) {
    return this.mailService.subscribeToNewsletter(createMailDto);
  }

  @Get()
  findAll() {
    return this.mailService.sendEmail('franconicoletti.14@gmail.com', 'test 2', '<p>holasss</p>')
  }

}
