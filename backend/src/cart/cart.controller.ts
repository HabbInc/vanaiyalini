import { Body, Controller, Delete, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CartService } from './cart.service';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';

@UseGuards(JwtAuthGuard)
@Controller('cart')
export class CartController {
  constructor(private readonly cart: CartService) {}

  @Get()
  get(@Req() req: any) {
    return this.cart.getCart(req.user.userId);
  }

  @Post('items')
  add(@Req() req: any, @Body() dto: AddToCartDto) {
    return this.cart.addItem(req.user.userId, dto.productId, dto.qty);
  }

  @Patch('items/:productId')
  updateQty(@Req() req: any, @Param('productId') productId: string, @Body() dto: UpdateCartItemDto) {
    return this.cart.updateQty(req.user.userId, productId, dto.qty);
  }

  @Delete('items/:productId')
  remove(@Req() req: any, @Param('productId') productId: string) {
    return this.cart.removeItem(req.user.userId, productId);
  }

  @Delete()
  clear(@Req() req: any) {
    return this.cart.clearCart(req.user.userId);
  }
}
