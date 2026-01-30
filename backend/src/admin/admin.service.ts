import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

import { User } from '../users/schemas/user.schema';
import { Order } from '../orders/schemas/order.schema';
import { Product } from '../products/schemas/product.schema';

@Injectable()
export class AdminService {
  async getMe(adminId: string) {
  const user = await this.userModel
    .findById(adminId)
    .select('_id name email roles status createdAt')
    .exec();

  return user;
}

  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Order.name) private orderModel: Model<Order>,
    @InjectModel(Product.name) private productModel: Model<Product>,
  ) {}

  // USERS
  getUsers() {
    return this.userModel
      .find()
      .select('_id name email roles status createdAt')
      .sort({ createdAt: -1 });
  }

  deleteUser(id: string) {
    return this.userModel.findByIdAndDelete(id);
  }

  // PRODUCTS
  getProducts() {
    return this.productModel.find().sort({ createdAt: -1 });
  }

  deleteProduct(id: string) {
    return this.productModel.findByIdAndDelete(id);
  }

  // ORDERS
  getOrders() {
    return this.orderModel
      .find()
      .populate('userId', 'name email')
      .sort({ createdAt: -1 });
  }

  async createProduct(adminId: string, dto: any) {
    return this.productModel.create({
      ...dto,
      sellerId: new Types.ObjectId(adminId),
    });
  }

  async getSummary() {
    const totalUsers = await this.userModel.countDocuments();
    const totalOrders = await this.orderModel.countDocuments();

    const revenueAgg = await this.orderModel.aggregate([
      { $match: { status: 'paid' } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } },
    ]);

    return {
      totalUsers,
      totalOrders,
      totalRevenue: revenueAgg[0]?.total || 0,
    };
  }

  async blockUser(id: string) {
    const updated = await this.userModel.findByIdAndUpdate(
      id,
      { status: 'blocked' },
      { new: true },
    );

    if (!updated) throw new NotFoundException('User not found');
    return { message: 'User blocked', user: updated };
  }

  async unblockUser(id: string) {
    const updated = await this.userModel.findByIdAndUpdate(
      id,
      { status: 'active' },
      { new: true },
    );

    if (!updated) throw new NotFoundException('User not found');
    return { message: 'User unblocked', user: updated };
  }

  async updateOrderStatus(orderId: string, status: string) {
    const updated = await this.orderModel.findByIdAndUpdate(
      orderId,
      { status },
      { new: true },
    );

    if (!updated) throw new NotFoundException('Order not found');
    return { message: 'Order status updated', order: updated };
  }
}
