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

        // second part

        // const items =  createOrdercartDto.subTotal
  
    //     const itemsList = items.map((element: CartItem) => element.id)
  
    //     const itemsAmount = await this.prisma.book.findMany({
    //       where: {
    //         id: { in: itemsList}
    //       },
    //       select: {
    //         id: true,
    //         priceHardcover: true,
    //         priceAudiobook: true,
    //         priceEbook: true,
    //         pricePaperback: true
    //       }
    //     })

    //     const total = []

    // for (const product of items) {
    //   let entry = itemsAmount.find(element => element.id === product.id)
    //   product.version === 'Hardcover'
    //   ?  
    //   total.push((entry.priceHardcover * product.quantity).toFixed(2))
    //   :
    //   product.version === 'Paperback'
    //   ?
    //   total.push((entry.pricePaperback * product.quantity).toFixed(2))
    //   :
    //   product.version === 'eBook'
    //   ?
    //   total.push((entry.priceEbook * product.quantity).toFixed(2))
    //   :
    //   product.version === 'Audio Book'
    //   ?
    //   total.push((entry.priceAudiobook * product.quantity).toFixed(2))
    //   :
    //   new Error('Missing item!')
    // }

    //     const totalProducts = total.reduce((a,b) => Number(a) + Number(b), 0)
    //     const taxes = Number((totalProducts * 0.16).toFixed(2))
    //     const shippingAmount = (method === 'free' || (method === 'standard' && totalProducts >= 40))
    //     ? 0
    //     :
    //     (method === 'standard' && totalProducts < 40)
    //     ?
    //     5
    //     :
    //     method === 'express'
    //     ?
    //     12
    //     :
    //     new Error('Error with shipping!')

        // console.log('Products: ', totalProducts)
        // console.log('Taxes: ', taxes)
        // console.log('Shipping: ', shippingAmount)
    
    }

  }

  findAll() {
    return `This action returns all ordercart`;
  }

  findOne(id: number) {
    return `This action returns a #${id} ordercart`;
  }

  update(id: number, updateOrdercartDto: UpdateOrdercartDto) {
    return `This action updates a #${id} ordercart`;
  }

  remove(id: number) {
    return `This action removes a #${id} ordercart`;
  }
}
