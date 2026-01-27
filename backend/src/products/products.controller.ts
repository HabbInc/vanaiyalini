import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
  Patch ,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UpdateProductDto } from './dto/update-product.dto';

@Controller('products')
export class ProductsController {
  constructor(private readonly products: ProductsService) {}

  // 🌍 Public
  @Get()
  findAll() {
    return this.products.findAll();
  }

  // 🌍 Public
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.products.findOne(id);
  }

  // 🧑‍💼 Seller only
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('seller')
  @Post()
  create(@Req() req: any, @Body() dto: CreateProductDto) {
    return this.products.create(req.user.userId, dto);
  }

  // 🧑‍💼 Seller only (delete own product)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('seller')
  @Delete(':id')
  remove(@Req() req: any, @Param('id') id: string) {
    return this.products.remove(id, req.user.userId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('seller')
  @Patch(':id')
  update(@Req() req: any, @Param('id') id: string, @Body() dto: UpdateProductDto) {
    return this.products.update(id, req.user.userId, dto);
  }
  
}
