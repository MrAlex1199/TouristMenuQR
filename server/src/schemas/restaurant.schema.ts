import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type RestaurantDocument = Restaurant & Document;

@Schema({ timestamps: true })
export class Restaurant {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  description: string;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  owner: Types.ObjectId;

  @Prop({ required: true })
  address: string;

  @Prop()
  phoneNumber?: string;

  @Prop()
  email?: string;

  @Prop()
  website?: string;

  @Prop([String])
  images?: string[];

  @Prop()
  logo?: string;

  @Prop({ required: true, unique: true })
  qrCode: string;

  @Prop({ default: true })
  isActive: boolean;

  @Prop({
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number],
      required: true
    }
  })
  location: {
    type: string;
    coordinates: number[];
  };

  @Prop({
    monday: { open: String, close: String, closed: { type: Boolean, default: false } },
    tuesday: { open: String, close: String, closed: { type: Boolean, default: false } },
    wednesday: { open: String, close: String, closed: { type: Boolean, default: false } },
    thursday: { open: String, close: String, closed: { type: Boolean, default: false } },
    friday: { open: String, close: String, closed: { type: Boolean, default: false } },
    saturday: { open: String, close: String, closed: { type: Boolean, default: false } },
    sunday: { open: String, close: String, closed: { type: Boolean, default: false } }
  })
  openingHours?: {
    monday: { open: string; close: string; closed: boolean };
    tuesday: { open: string; close: string; closed: boolean };
    wednesday: { open: string; close: string; closed: boolean };
    thursday: { open: string; close: string; closed: boolean };
    friday: { open: string; close: string; closed: boolean };
    saturday: { open: string; close: string; closed: boolean };
    sunday: { open: string; close: string; closed: boolean };
  };

  @Prop([String])
  cuisineTypes?: string[];

  @Prop({ min: 1, max: 5 })
  averageRating?: number;

  @Prop({ default: 0 })
  totalReviews?: number;
}

export const RestaurantSchema = SchemaFactory.createForClass(Restaurant);

// Create geospatial index for location-based queries
RestaurantSchema.index({ location: '2dsphere' });