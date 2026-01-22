import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Menu, MenuDocument } from '../schemas/menu.schema';
import { Restaurant, RestaurantDocument } from '../schemas/restaurant.schema';
import { 
  CreateMenuDto, 
  UpdateMenuDto, 
  CreateMenuCategoryDto, 
  UpdateMenuCategoryDto,
  CreateMenuItemDto,
  UpdateMenuItemDto,
  AddItemToCategoryDto,
  UpdateItemInCategoryDto
} from '../dto/menu.dto';
import { UserRole } from '../schemas/user.schema';

@Injectable()
export class MenusService {
  constructor(
    @InjectModel(Menu.name) private menuModel: Model<MenuDocument>,
    @InjectModel(Restaurant.name) private restaurantModel: Model<RestaurantDocument>,
  ) {}

  async create(createMenuDto: CreateMenuDto, userId: string, userRole: UserRole): Promise<Menu> {
    // Check if restaurant exists and user has permission
    const restaurant = await this.restaurantModel.findById(createMenuDto.restaurant);
    if (!restaurant) {
      throw new NotFoundException('Restaurant not found');
    }

    if (userRole !== UserRole.ADMIN && restaurant.owner.toString() !== userId) {
      throw new ForbiddenException('You can only create menus for your own restaurants');
    }

    // Check if menu with same name already exists for this restaurant
    const existingMenu = await this.menuModel.findOne({
      restaurant: createMenuDto.restaurant,
      name: createMenuDto.name,
    });

    if (existingMenu) {
      throw new BadRequestException('Menu with this name already exists for this restaurant');
    }

    const menu = new this.menuModel(createMenuDto);
    return menu.save();
  }

  async findAll(page: number = 1, limit: number = 10): Promise<{ menus: Menu[]; total: number }> {
    const skip = (page - 1) * limit;
    
    const [menus, total] = await Promise.all([
      this.menuModel
        .find({ isActive: true })
        .populate('restaurant', 'name address')
        .skip(skip)
        .limit(limit)
        .exec(),
      this.menuModel.countDocuments({ isActive: true }),
    ]);

    return { menus, total };
  }

  async findByRestaurant(restaurantId: string): Promise<Menu[]> {
    return this.menuModel
      .find({ restaurant: restaurantId, isActive: true })
      .populate('restaurant', 'name address')
      .exec();
  }

  async findOne(id: string): Promise<Menu> {
    const menu = await this.menuModel
      .findById(id)
      .populate('restaurant', 'name address owner')
      .exec();
    
    if (!menu) {
      throw new NotFoundException('Menu not found');
    }
    
    return menu;
  }

  async update(
    id: string, 
    updateMenuDto: UpdateMenuDto, 
    userId: string, 
    userRole: UserRole
  ): Promise<Menu> {
    const menu = await this.findOne(id);
    
    // Check permissions
    if (userRole !== UserRole.ADMIN && (menu.restaurant as any).owner.toString() !== userId) {
      throw new ForbiddenException('You can only update menus for your own restaurants');
    }

    const updatedMenu = await this.menuModel
      .findByIdAndUpdate(id, updateMenuDto, { new: true })
      .populate('restaurant', 'name address')
      .exec();

    return updatedMenu;
  }

  async remove(id: string, userId: string, userRole: UserRole): Promise<void> {
    const menu = await this.findOne(id);
    
    // Check permissions
    if (userRole !== UserRole.ADMIN && (menu.restaurant as any).owner.toString() !== userId) {
      throw new ForbiddenException('You can only delete menus for your own restaurants');
    }

    await this.menuModel.findByIdAndDelete(id).exec();
  }

  // Category Management
  async addCategory(
    menuId: string, 
    categoryDto: CreateMenuCategoryDto, 
    userId: string, 
    userRole: UserRole
  ): Promise<Menu> {
    const menu = await this.findOne(menuId);
    
    // Check permissions
    if (userRole !== UserRole.ADMIN && (menu.restaurant as any).owner.toString() !== userId) {
      throw new ForbiddenException('You can only modify menus for your own restaurants');
    }

    // Check if category name already exists in this menu
    const existingCategory = menu.categories.find(cat => cat.name === categoryDto.name);
    if (existingCategory) {
      throw new BadRequestException('Category with this name already exists in this menu');
    }

    const newCategory = {
      _id: new Types.ObjectId(),
      ...categoryDto,
      items: categoryDto.items || [],
    };

    menu.categories.push(newCategory as any);
    return menu.save();
  }

  async updateCategory(
    menuId: string,
    categoryId: string,
    categoryDto: UpdateMenuCategoryDto,
    userId: string,
    userRole: UserRole
  ): Promise<Menu> {
    const menu = await this.findOne(menuId);
    
    // Check permissions
    if (userRole !== UserRole.ADMIN && (menu.restaurant as any).owner.toString() !== userId) {
      throw new ForbiddenException('You can only modify menus for your own restaurants');
    }

    const categoryIndex = menu.categories.findIndex(cat => cat._id.toString() === categoryId);
    if (categoryIndex === -1) {
      throw new NotFoundException('Category not found');
    }

    // Update category
    Object.assign(menu.categories[categoryIndex], categoryDto);
    return menu.save();
  }

  async removeCategory(
    menuId: string,
    categoryId: string,
    userId: string,
    userRole: UserRole
  ): Promise<Menu> {
    const menu = await this.findOne(menuId);
    
    // Check permissions
    if (userRole !== UserRole.ADMIN && (menu.restaurant as any).owner.toString() !== userId) {
      throw new ForbiddenException('You can only modify menus for your own restaurants');
    }

    menu.categories = menu.categories.filter(cat => cat._id.toString() !== categoryId);
    return menu.save();
  }

  // Item Management
  async addItemToCategory(
    menuId: string,
    addItemDto: AddItemToCategoryDto,
    userId: string,
    userRole: UserRole
  ): Promise<Menu> {
    const menu = await this.findOne(menuId);
    
    // Check permissions
    if (userRole !== UserRole.ADMIN && (menu.restaurant as any).owner.toString() !== userId) {
      throw new ForbiddenException('You can only modify menus for your own restaurants');
    }

    const category = menu.categories.find(cat => cat._id.toString() === addItemDto.categoryId);
    if (!category) {
      throw new NotFoundException('Category not found');
    }

    // Check if item name already exists in this category
    const existingItem = category.items.find(item => item.name === addItemDto.item.name);
    if (existingItem) {
      throw new BadRequestException('Item with this name already exists in this category');
    }

    const newItem = {
      _id: new Types.ObjectId(),
      ...addItemDto.item,
    };

    category.items.push(newItem as any);
    return menu.save();
  }

  async updateItemInCategory(
    menuId: string,
    updateItemDto: UpdateItemInCategoryDto,
    userId: string,
    userRole: UserRole
  ): Promise<Menu> {
    const menu = await this.findOne(menuId);
    
    // Check permissions
    if (userRole !== UserRole.ADMIN && (menu.restaurant as any).owner.toString() !== userId) {
      throw new ForbiddenException('You can only modify menus for your own restaurants');
    }

    const category = menu.categories.find(cat => cat._id.toString() === updateItemDto.categoryId);
    if (!category) {
      throw new NotFoundException('Category not found');
    }

    const itemIndex = category.items.findIndex(item => item._id.toString() === updateItemDto.itemId);
    if (itemIndex === -1) {
      throw new NotFoundException('Item not found');
    }

    // Update item
    Object.assign(category.items[itemIndex], updateItemDto.item);
    return menu.save();
  }

  async removeItemFromCategory(
    menuId: string,
    categoryId: string,
    itemId: string,
    userId: string,
    userRole: UserRole
  ): Promise<Menu> {
    const menu = await this.findOne(menuId);
    
    // Check permissions
    if (userRole !== UserRole.ADMIN && (menu.restaurant as any).owner.toString() !== userId) {
      throw new ForbiddenException('You can only modify menus for your own restaurants');
    }

    const category = menu.categories.find(cat => cat._id.toString() === categoryId);
    if (!category) {
      throw new NotFoundException('Category not found');
    }

    category.items = category.items.filter(item => item._id.toString() !== itemId);
    return menu.save();
  }

  // Search and Filter
  async searchMenuItems(
    restaurantId: string,
    query: string,
    category?: string,
    dietaryInfo?: string[],
    maxPrice?: number,
    minPrice?: number
  ): Promise<any[]> {
    const menus = await this.menuModel
      .find({ restaurant: restaurantId, isActive: true })
      .exec();

    const results = [];

    for (const menu of menus) {
      for (const menuCategory of menu.categories) {
        if (!menuCategory.isActive) continue;
        
        // Filter by category if specified
        if (category && menuCategory.name.toLowerCase() !== category.toLowerCase()) {
          continue;
        }

        for (const item of menuCategory.items) {
          if (!item.isAvailable) continue;

          // Text search
          const matchesQuery = !query || 
            item.name.toLowerCase().includes(query.toLowerCase()) ||
            item.description.toLowerCase().includes(query.toLowerCase());

          // Price filter
          const matchesPrice = (!minPrice || item.price >= minPrice) &&
                              (!maxPrice || item.price <= maxPrice);

          // Dietary filter
          const matchesDietary = !dietaryInfo || 
            dietaryInfo.some(diet => item.dietaryInfo?.includes(diet));

          if (matchesQuery && matchesPrice && matchesDietary) {
            results.push({
              menuId: menu._id,
              menuName: menu.name,
              categoryId: menuCategory._id,
              categoryName: menuCategory.name,
              item: item,
            });
          }
        }
      }
    }

    return results;
  }

  async getPopularItems(restaurantId: string, limit: number = 10): Promise<any[]> {
    const menus = await this.menuModel
      .find({ restaurant: restaurantId, isActive: true })
      .exec();

    const items = [];

    for (const menu of menus) {
      for (const category of menu.categories) {
        if (!category.isActive) continue;
        
        for (const item of category.items) {
          if (item.isAvailable) {
            items.push({
              menuId: menu._id,
              menuName: menu.name,
              categoryId: category._id,
              categoryName: category.name,
              item: item,
            });
          }
        }
      }
    }

    // Sort by order count and return top items
    return items
      .sort((a, b) => (b.item.orderCount || 0) - (a.item.orderCount || 0))
      .slice(0, limit);
  }
}