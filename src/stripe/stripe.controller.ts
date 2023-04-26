import { Controller, Get, Post, Body, Patch, Param, Delete, Req } from '@nestjs/common';
import { StripeService } from './stripe.service';
import { CreateStripeDto } from './dto/create-stripe.dto';
import { UpdateStripeDto } from './dto/update-stripe.dto';
import { CustomRequest } from 'src/middleware/types';

@Controller('stripe')
export class StripeController {
  constructor(private readonly stripeService: StripeService) {}

  @Post()
  createPayment(@Req() request: CustomRequest, @Body() createStripeDto: CreateStripeDto) {
    return this.stripeService.createPayment(request, createStripeDto);
  }

}
