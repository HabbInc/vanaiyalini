import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model , Types} from 'mongoose';
import { User } from './schemas/user.schema';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  findByEmail(email: string) {
    return this.userModel.findOne({ email: email.toLowerCase() }).exec();
  }

  createUser(data: { name: string; email: string; passwordHash: string }) {
    return this.userModel.create({
      name: data.name,
      email: data.email.toLowerCase(),
      passwordHash: data.passwordHash,
      roles: ['customer'],
      status: 'active',
    });
  }

  async addRole(userId: string, role: string) {
    const updated = await this.userModel
      .findByIdAndUpdate(
        new Types.ObjectId(userId),
        { $addToSet: { roles: role } }, // add only if not exists
        { new: true },
      )
      .select('_id name email roles status')
      .exec();

    if (!updated) throw new NotFoundException('User not found');
    return updated;
  }
}
