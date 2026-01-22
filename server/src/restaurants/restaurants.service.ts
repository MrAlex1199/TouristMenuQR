import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as QRCode from 'qrcode';
import { Restaurant, RestaurantDocument } from '../schemas/restaurant.schema';
import { CreateRestaurantDto, UpdateRestaurantDto } from '../dto/restaurant.dto';
import { UserRole } from '../schemas/user.schema';

@Injectable()
export class RestaurantsService {
  constructor(
    @InjectModel(Restaurant.name) private restaurantModel: Model<RestaurantDocument>,
  ) {}

  async create(createRestaurantDto: CreateRestaurantDto, ownerId: string): Promise<Restaurant> {
    // Generate unique QR code
    const qrCodeData = `restaurant:${Date.now()}:${Math.random().toString(36).substr(2, 9)}`;
    const qrCodeUrl = await QRCode.toDataURL(qrCodeData);

    const restaurant = new this.restaurantModel({
      ...createRestaurantDto,
      owner: ownerId,
      qrCode: qrCodeUrl,
    });

    return restaurant.save();
  }

  async findAll(page: number = 1, limit: number = 10): Promise<{ restaurants: Restaurant[]; total: number }> {
    const skip = (page - 1) * limit;
    
    const [restaurants, total] = await Promise.all([
      this.restaurantModel
        .find({ isActive: true })
        .populate('owner', 'firstName lastName email')
        .skip(skip)
        .limit(limit)
        .exec(),
      this.restaurantModel.countDocuments({ isActive: true }),
    ]);

    return { restaurants, total };
  }

  async findOne(id: string): Promise<Restaurant> {
    const restaurant = await this.restaurantModel
      .findById(id)
      .populate('owner', 'firstName lastName email')
      .exec();
    
    if (!restaurant) {
      throw new NotFoundException('Restaurant not found');
    }
    
    return restaurant;
  }

  async findByOwner(ownerId: string): Promise<Restaurant[]> {
    return this.restaurantModel
      .find({ owner: ownerId })
      .populate('owner', 'firstName lastName email')
      .exec();
  }

  async update(
    id: string, 
    updateRestaurantDto: UpdateRestaurantDto, 
    userId: string, 
    userRole: UserRole
  ): Promise<Restaurant> {
    const restaurant = await this.findOne(id);
    
    // Check if user is owner or admin
    if (userRole !== UserRole.ADMIN && restaurant.owner.toString() !== userId) {
      throw new ForbiddenException('You can only update your own restaurants');
    }

    const updatedRestaurant = await this.restaurantModel
      .findByIdAndUpdate(id, updateRestaurantDto, { new: true })
      .populate('owner', 'firstName lastName email')
      .exec();

    return updatedRestaurant;
  }

  async remove(id: string, userId: string, userRole: UserRole): Promise<void> {
    const restaurant = await this.findOne(id);
    
    // Check if user is owner or admin
    if (userRole !== UserRole.ADMIN && restaurant.owner.toString() !== userId) {
      throw new ForbiddenException('You can only delete your own restaurants');
    }

    await this.restaurantModel.findByIdAndDelete(id).exec();
  }

  async findNearby(lat: number, lng: number, maxDistance: number = 5000): Promise<Restaurant[]> {
    return this.restaurantModel
      .find({
        isActive: true,
        location: {
          $near: {
            $geometry: {
              type: 'Point',
              coordinates: [lng, lat]
            },
            $maxDistance: maxDistance
          }
        }
      })
      .populate('owner', 'firstName lastName email')
      .exec();
  }

  async regenerateQRCode(id: string, userId: string, userRole: UserRole): Promise<Restaurant> {
    const restaurant = await this.findOne(id);
    
    // Check if user is owner or admin
    if (userRole !== UserRole.ADMIN && restaurant.owner.toString() !== userId) {
      throw new ForbiddenException('You can only regenerate QR code for your own restaurants');
    }

    // Generate new QR code
    const qrCodeData = `restaurant:${id}:${Date.now()}:${Math.random().toString(36).substr(2, 9)}`;
    const qrCodeUrl = await QRCode.toDataURL(qrCodeData);

    const updatedRestaurant = await this.restaurantModel
      .findByIdAndUpdate(id, { qrCode: qrCodeUrl }, { new: true })
      .populate('owner', 'firstName lastName email')
      .exec();

    return updatedRestaurant;
  }
}