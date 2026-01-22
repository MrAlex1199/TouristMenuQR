import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

export enum UserRole {
  ADMIN = 'admin',
  RESTAURANT_OWNER = 'restaurant_owner',
  CUSTOMER = 'customer',
}

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  lastName: string;

  @Prop({ type: String, enum: UserRole, default: UserRole.CUSTOMER })
  role: UserRole;

  @Prop({ default: true })
  isActive: boolean;

  @Prop()
  phoneNumber?: string;

  @Prop()
  profileImage?: string;

  @Prop({ default: Date.now })
  lastLogin?: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);