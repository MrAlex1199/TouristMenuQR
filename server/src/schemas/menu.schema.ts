import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type MenuDocument = Menu & Document;
export type MenuItemDocument = MenuItem & Document;
export type MenuCategoryDocument = MenuCategory & Document;

@Schema({ timestamps: true })
export class MenuItem {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true, min: 0 })
  price: number;

  @Prop()
  image?: string;

  @Prop([String])
  allergens?: string[];

  @Prop([String])
  dietaryInfo?: string[]; // vegetarian, vegan, gluten-free, etc.

  @Prop({ default: true })
  isAvailable: boolean;

  @Prop({ default: 0 })
  preparationTime?: number; // in minutes

  @Prop({ min: 0, max: 5 })
  spicyLevel?: number;

  @Prop()
  calories?: number;

  @Prop({ default: 0 })
  orderCount?: number;
}

@Schema({ timestamps: true })
export class MenuCategory {
  @Prop({ required: true })
  name: string;

  @Prop()
  description?: string;

  @Prop()
  image?: string;

  @Prop({ default: 0 })
  sortOrder: number;

  @Prop({ default: true })
  isActive: boolean;

  @Prop([MenuItem])
  items: MenuItem[];
}

@Schema({ timestamps: true })
export class Menu {
  @Prop({ type: Types.ObjectId, ref: 'Restaurant', required: true })
  restaurant: Types.ObjectId;

  @Prop({ required: true })
  name: string;

  @Prop()
  description?: string;

  @Prop([MenuCategory])
  categories: MenuCategory[];

  @Prop({ default: true })
  isActive: boolean;

  @Prop()
  validFrom?: Date;

  @Prop()
  validUntil?: Date;

  @Prop([String])
  availableLanguages?: string[];

  @Prop({ default: 'THB' })
  currency: string;
}

export const MenuItemSchema = SchemaFactory.createForClass(MenuItem);
export const MenuCategorySchema = SchemaFactory.createForClass(MenuCategory);
export const MenuSchema = SchemaFactory.createForClass(Menu);