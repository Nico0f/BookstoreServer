import { ForbiddenException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CreateStripeDto } from './dto/create-stripe.dto';
import Stripe from 'stripe';
import { CustomRequest } from 'src/middleware/types';
import { PrismaService } from 'src/prisma.service';
import { CartItem } from 'src/ordercart/dto/create-ordercart-types';
import { totalAmount } from './dto/types';

@Injectable()
export class StripeService {
  private stripe: Stripe;
  constructor(private readonly configService: ConfigService,
    private prisma: PrismaService) {
    this.stripe = new Stripe(this.configService.get<string>('STRIPE_SECRET_KEY'), {
      apiVersion: '2022-11-15',
    });
  }




  async createPayment(request: CustomRequest, createStripeDto: CreateStripeDto) {
    if (request.payload.message === 'Access granted') {
      const userId = request.user
      const cartOrder = await this.prisma.checkoutOrder.findUnique({
        where: {
          userId
        }
      })

      if ((Date.now() - Number(cartOrder.createdAt)) > 60000) throw new ForbiddenException('Generate new order')

      // @ts-ignore
      const items: CartItem[] = cartOrder.items

      const shippingMethod = cartOrder.shippingMethod

      const { totalAmount, displayItems, totalProducts, taxes, shippingAmount } = await this.amountCalculation(items, shippingMethod)

      console.log('total amount: ', totalAmount)


      const paymentIntent = await this.stripe.paymentIntents.create({
        amount: totalAmount,
        currency: "usd",
        automatic_payment_methods: {
          enabled: true,
        },
      });
      return {
        clientSecret: paymentIntent.client_secret,
        items: displayItems,
        totalProducts,
        taxes,
        shippingAmount
      }
    }
  }

  async amountCalculation(items: CartItem[], shippingMethod: string): Promise<totalAmount> {
    const itemsList = items.map((element: CartItem) => element.id)

    const itemsAmount = await this.prisma.book.findMany({
      where: {
        id: { in: itemsList }
      },
      select: {
        id: true,
        title: true,
        cover: true,
        authorName: true,
        priceHardcover: true,
        priceAudiobook: true,
        priceEbook: true,
        pricePaperback: true,
      }
    })

    const total = []

    const displayItems = []

    for (const product of items) {
      let entry = itemsAmount.find(element => element.id === product.id)
      const { title, cover, authorName } = entry
      let item = {
        title,
        authorName,
        cover,
      }
      product.version === 'Hardcover'
        ?
        (total.push((entry.priceHardcover * product.quantity).toFixed(2)),
          item['price'] = entry.priceHardcover,
          item['version'] = 'Hardcover',
          item['quantity'] = product.quantity,
          displayItems.push(item))
        :
        product.version === 'Paperback'
          ?
          (total.push((entry.pricePaperback * product.quantity).toFixed(2)),
            item['price'] = entry.pricePaperback,
            item['version'] = 'Paperback',
            item['quantity'] = product.quantity,
            displayItems.push(item))
          :
          product.version === 'eBook'
            ?
            (total.push((entry.priceEbook * product.quantity).toFixed(2)),
              item['price'] = entry.priceEbook,
              item['version'] = 'eBook',
              item['quantity'] = product.quantity,
              displayItems.push(item))
            :
            product.version === 'Audio Book'
              ?
              (total.push((entry.priceAudiobook * product.quantity).toFixed(2)),
                item['price'] = entry.priceAudiobook,
                item['version'] = 'Audio Book',
                item['quantity'] = product.quantity,
                displayItems.push(item))
              :
              new Error('Missing item!')
    }

    const totalProducts = total.reduce((a, b) => Number(a) + Number(b), 0)
    const taxes = Number((totalProducts * 0.16).toFixed(2))
    const shippingAmount = (shippingMethod === 'free' || (shippingMethod === 'standard' && totalProducts >= 40))
    ? 0
    :
    (shippingMethod === 'standard' && totalProducts < 40)
        ?
        5
        :
        shippingMethod === 'express'
          ?
          12
          :
          new Error('Error with shipping!')

    const totalAmount = totalProducts + taxes + shippingAmount
    return {
      totalAmount: Number((totalAmount * 100).toFixed(2)),
      displayItems,
      totalProducts,
      taxes,
      shippingAmount
    }
  }
}
