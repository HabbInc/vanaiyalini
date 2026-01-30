import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ProductsModule } from './products/products.module';
import { CartModule } from './cart/cart.module';
import { OrdersModule } from './orders/orders.module';
import { AdminModule } from './admin/admin.module';

@Module({
  imports: [
    // Loads variables from backend/.env
    ConfigModule.forRoot({ isGlobal: true }),

    // Connects MongoDB using MONGO_URI from .env
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        uri: config.get<string>('MONGO_URI'),
      }),
    }),

    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
      serveRoot: '/uploads',
    }),

    UsersModule,

    AuthModule,

    ProductsModule,

    CartModule,

    OrdersModule,

    AdminModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
