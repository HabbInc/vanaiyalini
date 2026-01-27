import { Controller, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { OrdersService } from './orders.service';

@UseGuards(JwtAuthGuard)
@Controller('orders')
export class OrdersController {
  constructor(private readonly orders: OrdersService) {}

  @Post()
  checkout(@Req() req: any) {
    return this.orders.checkout(req.user.userId);
  }

  @Get()
  myOrders(@Req() req: any) {
    return this.orders.myOrders(req.user.userId);
  }

  @Get(':id')
  myOrder(@Req() req: any, @Param('id') id: string) {
    return this.orders.myOrderById(req.user.userId, id);
  }

  @Patch(':id/cancel')
  cancel(@Req() req: any, @Param('id') id: string) {
    return this.orders.cancel(req.user.userId, id);
  }
}
