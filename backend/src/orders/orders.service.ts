import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Order } from './schemas/order.schema';
import { CartService } from '../cart/cart.service';
import { ProductsService } from '../products/products.service';

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<Order>,
    private readonly cartService: CartService,
    private readonly productsService: ProductsService,
  ) {}

  async checkout(userId: string) {
    // 1) Get cart
    const cart = await this.cartService.getCart(userId);

    // cartService.getCart() returns either real cart or {items: []}
    const items = (cart as any).items ?? [];
    if (!items.length) throw new BadRequestException('Cart is empty');

    // 2) Build order items from product snapshots
    let totalAmount = 0;

    const orderItems: Array<{
      productId: Types.ObjectId;
      sellerId: Types.ObjectId;
      title: string;
      price: number;
      qty: number;
      lineTotal: number;
    }> = [];
    for (const cartItem of items) {
      // if populated, cartItem.productId is an object; otherwise string/objectId
      const productId =
        typeof cartItem.productId === 'object' && cartItem.productId?._id
          ? cartItem.productId._id.toString()
          : cartItem.productId.toString();

      const product = await this.productsService.findOne(productId);

      if (product.status !== 'active') {
        throw new BadRequestException(`Product not available: ${product.title}`);
      }

      if (product.stock < cartItem.qty) {
        throw new BadRequestException(`Not enough stock for: ${product.title}`);
      }

      const price = product.price;
      const qty = cartItem.qty;
      const lineTotal = price * qty;

      totalAmount += lineTotal;

      orderItems.push({
        productId: new Types.ObjectId(productId),
        sellerId: new Types.ObjectId((product as any).sellerId),
        title: product.title,
        price,
        qty,
        lineTotal,
      });
    }

    // 3) Reduce stock (MVP approach)
    for (const item of orderItems) {
      await (this.productsService as any).productModel?.updateOne(
        { _id: item.productId, stock: { $gte: item.qty } },
        { $inc: { stock: -item.qty } },
      );
      // If you want “clean” architecture, we can add a ProductsService method for this next.
    }

    // 4) Create order
    const order = await this.orderModel.create({
      userId: new Types.ObjectId(userId),
      items: orderItems,
      totalAmount,
      status: 'pending',
    });

    // 5) Clear cart
    await this.cartService.clearCart(userId);

    return order;
  }

  async myOrders(userId: string) {
    return this.orderModel
      .find({ userId: new Types.ObjectId(userId) })
      .sort({ createdAt: -1 })
      .exec();
  }

  async myOrderById(userId: string, orderId: string) {
    const order = await this.orderModel
      .findOne({ _id: orderId, userId: new Types.ObjectId(userId) })
      .exec();
    if (!order) throw new NotFoundException('Order not found');
    return order;
  }

  async cancel(userId: string, orderId: string) {
    const order = await this.orderModel
      .findOne({ _id: orderId, userId: new Types.ObjectId(userId) })
      .exec();
    if (!order) throw new NotFoundException('Order not found');

    if (order.status !== 'pending') {
      throw new BadRequestException('Only pending orders can be cancelled');
    }

    order.status = 'cancelled';
    await order.save();

    // Optional: restore stock (we can add this next)
    return order;
  }
}
