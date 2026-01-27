import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type ProductDocument = HydratedDocument<Product>;

@Schema({ timestamps: true })
export class Product {
  @Prop({ required: true })
  title: string;

  @Prop()
  description: string;

  @Prop({ required: true })
  price: number;

  @Prop({ default: 0 })
  stock: number;

  @Prop({ type: [String], default: [] })
  images: string[];

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  sellerId: Types.ObjectId;

  @Prop({ default: 'active' })
  status: 'active' | 'disabled';
}

export const ProductSchema = SchemaFactory.createForClass(Product);
