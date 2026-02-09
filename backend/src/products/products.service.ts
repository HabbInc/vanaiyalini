import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Product } from './schemas/product.schema';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<Product>,
  ) {}

  // ✅ NEW: Related products
  async findRelated(productId: string) {
    const current = await this.productModel.findById(productId).lean();
    if (!current) throw new NotFoundException('Product not found');

    const limit = 6;

    // 1) Try same seller
    const sameSeller = await this.productModel
      .find({
        _id: { $ne: new Types.ObjectId(productId) },
        sellerId: current.sellerId,
      })
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();

    // If enough, return
    if (sameSeller.length >= 3) return sameSeller;

    // 2) Fill remaining with similar price
    const min = Math.max(0, (current.price ?? 0) - 2000);
    const max = (current.price ?? 0) + 2000;

    const fill = await this.productModel
      .find({
        _id: { $ne: new Types.ObjectId(productId) },
        price: { $gte: min, $lte: max },
      })
      .sort({ createdAt: -1 })
      .limit(limit - sameSeller.length)
      .lean();

    // Merge + remove duplicates
    const map = new Map<string, any>();
    for (const p of [...sameSeller, ...fill]) map.set(String(p._id), p);

    return Array.from(map.values()).slice(0, limit);
  }


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

  async findBySeller(sellerId: string) {
    return this.productModel
      .find({ sellerId: new Types.ObjectId(sellerId) })
      .sort({ createdAt: -1 })
      .exec();
  }

  async setImage(productId: string, imageUrl: string) {
    const updated = await this.productModel.findByIdAndUpdate(
      productId,
      { imageUrl },
      { new: true },
    );
    return updated;
  }

  async addImages(productId: string, imageUrls: string[]) {
    const updated = await this.productModel.findByIdAndUpdate(
      productId,
      {
        $push: { images: { $each: imageUrls } }, // ✅ append to array
        $set: { imageUrl: imageUrls[0] },        // ✅ optional: set main image to first
      },
      { new: true },
    );
    return updated;
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

  //Ensures a seller can update only their own product.
  async update(id: string, sellerId: string, data: any) {
  const updated = await this.productModel
    .findOneAndUpdate(
      { _id: id, sellerId: new Types.ObjectId(sellerId) }, // ✅ ownership check
      { $set: data },
      { new: true },
    )
    .exec();

  if (!updated) throw new NotFoundException('Product not found');
  return updated;
}

}
