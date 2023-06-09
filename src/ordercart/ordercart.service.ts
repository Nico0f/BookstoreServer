import { Shipping } from './../shipping/entities/shipping.entity';
import { Injectable } from '@nestjs/common';
import { CreateOrdercartDto } from './dto/create-ordercart.dto';
import { UpdateOrdercartDto } from './dto/update-ordercart.dto';
import { PrismaService } from 'src/prisma.service';
import { CustomRequest } from 'src/middleware/types';
import { CartItem } from './dto/create-ordercart-types';

@Injectable()
export class OrdercartService {
  constructor(private prisma: PrismaService) { }

  async create(request: CustomRequest, createOrdercartDto: CreateOrdercartDto) {
    if (request.payload.message === 'Access granted') {
      const userId = request.user
      const {
        firstName,
        lastName,
        email,
        address,
        detail,
        city,
        country,
        state,
        postalCode,
        phone,
        method,
        price } = createOrdercartDto.shipping

        const items: object[] =  createOrdercartDto.subTotal

        const createdCheckoutOrder = await this.prisma.checkoutOrder.upsert({
          where: {
            userId
          },
          create: {
            userId,
            userName: `${firstName} ${lastName}`,
            email,
            address: `Address: ${address}, Detail: ${detail}, City: ${city}, Country: ${country}, State: ${state}, Postal code: ${postalCode}`,
            phone,
            items,
            shippingMethod: method,
            createdAt: Date.now()
          },
          update: {
            userName: `${firstName} ${lastName}`,
            email,
            address: `Address: ${address}, Detail: ${detail}, City: ${city}, Country: ${country}, State: ${state}, Postal code: ${postalCode}`,
            phone,
            items,
            shippingMethod: method,
            createdAt: Date.now()
          }
        })
        return {
          message: 'Success'
        }
    
    }

  }

}
