import { Injectable } from '@nestjs/common';
import { CustomRequest } from 'src/middleware/types';
import { PrismaService } from 'src/prisma.service';
import { CreateShoppingcartDto } from './dto/create-shoppingcart.dto';
import { UpdateShoppingcartDto } from './dto/update-shoppingcart.dto';

@Injectable()
export class ShoppingcartService {
  constructor(private prisma: PrismaService) { }
  
  async create(bookId: number, request: CustomRequest) {
    const userId = request.user;
    const userCart = await this.prisma.shoppingCart.upsert({
      where: { userId },
      create: { userId },
      update: {},
    });
    const userCartProduct = await this.prisma.cartProduct.upsert({
      where: {
        cartId_bookId: {
          cartId: userCart.id,
          bookId,
        }
      },
      create: {
        cartId: userCart.id,
        bookId
      },
      update: {}
    })
    if (request.payload.message === 'Access granted') {
      return {
        message: 'Item Added'
      }
    } else if (request.payload.message === 'New tokens') {
      return {
        message: 'Item Added',
        firstName: request.payload.firstName,
        lastName: request.payload.lastName,
        avatar: request.payload.avatar,
        accessToken: request.payload.accessToken,
      }
    }
  }

  findOne() {
    return `This action returns all shoppingcart`;
  }

  async findAll(request: CustomRequest) {
    const userId = request.user;
    const userCart = await this.prisma.shoppingCart.findUnique({
      where: { userId },
      include: {
        cartProducts: {
          include: {
            book: {
              select: {
                id: true,
                title: true,
                authorName: true,
                cover: true,
                priceHardcover: true,
                pricePaperback: true,
                priceAudiobook: true,
                priceEbook: true,
              }
            }
          }
        },
      },
    })
    const books = []
    if (Object.keys(userCart).includes('cartProducts')) {
      for (const entry of userCart.cartProducts) {
        books.push(entry.book)
      }
    }

    if (request.payload.message === 'Access granted') {
      return {
        message: 'Cart found',
        books
      }
    } else if (request.payload.message === 'New tokens') {

      return {
        message: 'Cart found, New tokens',
        firstName: request.payload.firstName,
        lastName: request.payload.lastName,
        avatar: request.payload.avatar,
        accessToken: request.payload.accessToken,
        books
      }
    }
  }

  update(id: number, updateShoppingcartDto: UpdateShoppingcartDto) {
    return `This action updates a #${id} shoppingcart`;
  }

  async removeOne(bookId: number, request: CustomRequest) {
    const userId = request.user;
    if (request.payload.message === 'Access granted') {
      const userCart = await this.prisma.shoppingCart.findUnique({
        where: { userId }
      })

      const productCart = await this.prisma.cartProduct.delete({
        where: {
          cartId_bookId: {
            cartId: userCart.id,
            bookId,
          },
        },
      });

      return {
        message: 'Item Removed',
      }
    } else if (request.payload.message === 'New tokens') {
      const userCart = await this.prisma.shoppingCart.findUnique({
        where: { userId }
      })

      const productCart = await this.prisma.cartProduct.delete({
        where: {
          cartId_bookId: {
            cartId: userCart.id,
            bookId,
          },
        },
      });

      return {
        message: 'Item Removed',
        firstName: request.payload.firstName,
        lastName: request.payload.lastName,
        avatar: request.payload.avatar,
        accessToken: request.payload.accessToken,
      };
    }
  }

  async remove(request: CustomRequest) {
    const userId = request.user;

    const userCart = await this.prisma.shoppingCart.delete({
      where: { userId },
    });

    return userCart;
  }
}
