import { PrismaService } from 'src/prisma.service';
import { Module } from '@nestjs/common';
import { OrdercartService } from './ordercart.service';
import { OrdercartController } from './ordercart.controller';

@Module({
  controllers: [OrdercartController],
  providers: [OrdercartService, PrismaService]
})
export class OrdercartModule {}
