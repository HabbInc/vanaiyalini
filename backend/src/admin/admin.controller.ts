import { Body, Controller, Delete, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CreateProductDto } from 'src/products/dto/create-product.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
export class AdminController {
  constructor(private readonly admin: AdminService) {}

  // ✅ Admin profile
  @Get('me')
  getMe(@Req() req: any) {
    return this.admin.getMe(req.user.userId);
  }

  @Get('users')
  getAllUsers() {
    return this.admin.getUsers();
  }

  @Delete('users/:id')
  removeUser(@Param('id') id: string) {
    return this.admin.deleteUser(id);
  }

  @Get('products')
  getAllProducts() {
    return this.admin.getProducts();
  }

  @Delete('products/:id')
  removeProduct(@Param('id') id: string) {
    return this.admin.deleteProduct(id);
  }

  @Get('orders')
  getAllOrders() {
    return this.admin.getOrders();
  }

  @Get('summary')
  getSummary() {
    return this.admin.getSummary();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Post('products')
  createProduct(@Req() req: any, @Body() dto: any) {
    return this.admin.createProduct(req.user.userId, dto);
  }

  // ✅ Block user
  @Patch('users/:id/block')
  blockUser(@Param('id') id: string) {
    return this.admin.blockUser(id);
  }

  // ✅ Unblock user
  @Patch('users/:id/unblock')
  unblockUser(@Param('id') id: string) {
    return this.admin.unblockUser(id);
  }

  @Patch('orders/:id/status')
  updateOrderStatus(@Param('id') id: string, @Body() dto: UpdateOrderStatusDto) {
    return this.admin.updateOrderStatus(id, dto.status);
  }

}
