import { PrismaService } from './../prisma.service';
import { Module } from '@nestjs/common';
import { StripeService } from './stripe.service';
import { StripeController } from './stripe.controller';

@Module({
  controllers: [StripeController],
  providers: [StripeService, PrismaService]
})
export class StripeModule {}
