import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Cart } from './schemas/cart.schema';
import { ProductsService } from '../products/products.service';

@Injectable()
export class CartService {
  constructor(
    @InjectModel(Cart.name) private cartModel: Model<Cart>,
    private readonly products: ProductsService,
  ) {}

  private userObjectId(userId: string) {
    return new Types.ObjectId(userId);
  }

  async getCart(userId: string) {
    const cart = await this.cartModel
      .findOne({ userId: this.userObjectId(userId) })
      .populate('items.productId') // optional, shows product details
      .exec();

    return cart ?? { userId, items: [] };
  }

  async addItem(userId: string, productId: string, qty: number) {
    // validate product exists
    const product = await this.products.findOne(productId);
    if (product.status !== 'active') throw new BadRequestException('Product is not available');

    const uId = this.userObjectId(userId);
    const pId = new Types.ObjectId(productId);

    // ensure cart exists
    let cart = await this.cartModel.findOne({ userId: uId }).exec();
    if (!cart) cart = await this.cartModel.create({ userId: uId, items: [] });

    const existing = cart.items.find((i: any) => i.productId.toString() === pId.toString());
    if (existing) {
      existing.qty += qty;
    } else {
      cart.items.push({ productId: pId, qty } as any);
    }

    await cart.save();
    return this.getCart(userId);
  }

  async updateQty(userId: string, productId: string, qty: number) {
    const cart = await this.cartModel.findOne({ userId: this.userObjectId(userId) }).exec();
    if (!cart) throw new NotFoundException('Cart not found');

    const item = cart.items.find((i: any) => i.productId.toString() === productId);
    if (!item) throw new NotFoundException('Item not found in cart');

    item.qty = qty;
    await cart.save();
    return this.getCart(userId);
  }

  async removeItem(userId: string, productId: string) {
    const cart = await this.cartModel.findOne({ userId: this.userObjectId(userId) }).exec();
    if (!cart) throw new NotFoundException('Cart not found');

    cart.items = cart.items.filter((i: any) => i.productId.toString() !== productId) as any;
    await cart.save();
    return this.getCart(userId);
  }

  async clearCart(userId: string) {
    await this.cartModel.updateOne(
      { userId: this.userObjectId(userId) },
      { $set: { items: [] } },
      { upsert: true },
    );
    return this.getCart(userId);
  }
}
