import { Controller, Delete, Get, Param, UseGuards } from '@nestjs/common';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
export class AdminController {
  constructor(private readonly admin: AdminService) {}

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
}
