import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Product } from './schemas/product.schema';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<Product>,
  ) {}

  // Seller creates product
  create(sellerId: string, data: any) {
    return this.productModel.create({
      ...data,
      sellerId: new Types.ObjectId(sellerId),
    });
  }

  // Public list
  findAll() {
    return this.productModel.find({ status: 'active' }).exec();
  }

  // Public detail
  async findOne(id: string) {
    const product = await this.productModel.findById(id).exec();
    if (!product) throw new NotFoundException('Product not found');
    return product;
  }

  // Seller deletes own product
  async remove(id: string, sellerId: string) {
    const product = await this.productModel.findOneAndDelete({
      _id: id,
      sellerId: new Types.ObjectId(sellerId),
    });

    if (!product) throw new NotFoundException('Product not found');
    return { deleted: true };
  }
}
