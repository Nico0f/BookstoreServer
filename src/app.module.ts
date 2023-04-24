import { Module, MiddlewareConsumer  } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BooksModule } from './books/books.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { AuthMiddleware } from './middleware/auth.middleware';
import { MiddlewareModule } from './middleware/auth.middleware.module';
import { MiddlewareService } from './middleware/auth.service.middleware';
import { PrismaService } from './prisma.service';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { ShoppingcartModule } from './shoppingcart/shoppingcart.module';
import { ShippingModule } from './shipping/shipping.module';
import { MailModule } from './mail/mail.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { StripeService } from './stripe/stripe.service';
import { StripeModule } from './stripe/stripe.module';
import { ShoppingorderModule } from './shoppingorder/shoppingorder.module';
import { TestModule } from './test/test.module';
import { OrdercartModule } from './ordercart/ordercart.module';
import { AuthorsModule } from './authors/authors.module';
import { FirebaseModule } from './firebase/firebase.module';

@Module({
  imports: [BooksModule, MiddlewareModule, JwtModule.register({}), UsersModule, AuthModule, ConfigModule.forRoot({ isGlobal: true }), ShoppingcartModule, ShippingModule, MailModule, CloudinaryModule, StripeModule, ShoppingorderModule,
    // TestModule,
    OrdercartModule,
    AuthorsModule,
    FirebaseModule],
  controllers: [AppController],
  providers: [AppService, MiddlewareService, PrismaService, StripeService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes('shoppingcart', 'auth/local/status', 'users', 'users/avatar', 'ordercart', 'stripe');
  }
}
