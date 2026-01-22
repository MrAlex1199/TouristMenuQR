import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  Query,
  ParseIntPipe,
  DefaultValuePipe,
} from '@nestjs/common';
import { MenusService } from './menus.service';
import {
  CreateMenuDto,
  UpdateMenuDto,
  CreateMenuCategoryDto,
  UpdateMenuCategoryDto,
  AddItemToCategoryDto,
  UpdateItemInCategoryDto,
} from '../dto/menu.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../decorators/roles.decorator';
import { Public } from '../decorators/public.decorator';
import { UserRole } from '../schemas/user.schema';

@Controller('menus')
@UseGuards(JwtAuthGuard, RolesGuard)
export class MenusController {
  constructor(private readonly menusService: MenusService) {}

  @Post()
  @Roles(UserRole.RESTAURANT_OWNER, UserRole.ADMIN)
  create(@Body() createMenuDto: CreateMenuDto, @Request() req) {
    return this.menusService.create(createMenuDto, req.user._id, req.user.role);
  }

  @Public()
  @Get()
  findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ) {
    return this.menusService.findAll(page, limit);
  }

  @Public()
  @Get('restaurant/:restaurantId')
  findByRestaurant(@Param('restaurantId') restaurantId: string) {
    return this.menusService.findByRestaurant(restaurantId);
  }

  @Public()
  @Get('search/:restaurantId')
  searchMenuItems(
    @Param('restaurantId') restaurantId: string,
    @Query('q') query: string,
    @Query('category') category?: string,
    @Query('dietary') dietaryInfo?: string,
    @Query('maxPrice', new DefaultValuePipe(0), ParseIntPipe) maxPrice?: number,
    @Query('minPrice', new DefaultValuePipe(0), ParseIntPipe) minPrice?: number,
  ) {
    const dietaryArray = dietaryInfo ? dietaryInfo.split(',') : undefined;
    const maxPriceFilter = maxPrice > 0 ? maxPrice : undefined;
    const minPriceFilter = minPrice > 0 ? minPrice : undefined;
    
    return this.menusService.searchMenuItems(
      restaurantId,
      query,
      category,
      dietaryArray,
      maxPriceFilter,
      minPriceFilter,
    );
  }

  @Public()
  @Get('popular/:restaurantId')
  getPopularItems(
    @Param('restaurantId') restaurantId: string,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ) {
    return this.menusService.getPopularItems(restaurantId, limit);
  }

  @Public()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.menusService.findOne(id);
  }

  @Patch(':id')
  @Roles(UserRole.RESTAURANT_OWNER, UserRole.ADMIN)
  update(
    @Param('id') id: string,
    @Body() updateMenuDto: UpdateMenuDto,
    @Request() req,
  ) {
    return this.menusService.update(id, updateMenuDto, req.user._id, req.user.role);
  }

  @Delete(':id')
  @Roles(UserRole.RESTAURANT_OWNER, UserRole.ADMIN)
  remove(@Param('id') id: string, @Request() req) {
    return this.menusService.remove(id, req.user._id, req.user.role);
  }

  // Category Management
  @Post(':id/categories')
  @Roles(UserRole.RESTAURANT_OWNER, UserRole.ADMIN)
  addCategory(
    @Param('id') menuId: string,
    @Body() categoryDto: CreateMenuCategoryDto,
    @Request() req,
  ) {
    return this.menusService.addCategory(menuId, categoryDto, req.user._id, req.user.role);
  }

  @Patch(':id/categories/:categoryId')
  @Roles(UserRole.RESTAURANT_OWNER, UserRole.ADMIN)
  updateCategory(
    @Param('id') menuId: string,
    @Param('categoryId') categoryId: string,
    @Body() categoryDto: UpdateMenuCategoryDto,
    @Request() req,
  ) {
    return this.menusService.updateCategory(menuId, categoryId, categoryDto, req.user._id, req.user.role);
  }

  @Delete(':id/categories/:categoryId')
  @Roles(UserRole.RESTAURANT_OWNER, UserRole.ADMIN)
  removeCategory(
    @Param('id') menuId: string,
    @Param('categoryId') categoryId: string,
    @Request() req,
  ) {
    return this.menusService.removeCategory(menuId, categoryId, req.user._id, req.user.role);
  }

  // Item Management
  @Post(':id/items')
  @Roles(UserRole.RESTAURANT_OWNER, UserRole.ADMIN)
  addItemToCategory(
    @Param('id') menuId: string,
    @Body() addItemDto: AddItemToCategoryDto,
    @Request() req,
  ) {
    return this.menusService.addItemToCategory(menuId, addItemDto, req.user._id, req.user.role);
  }

  @Patch(':id/items')
  @Roles(UserRole.RESTAURANT_OWNER, UserRole.ADMIN)
  updateItemInCategory(
    @Param('id') menuId: string,
    @Body() updateItemDto: UpdateItemInCategoryDto,
    @Request() req,
  ) {
    return this.menusService.updateItemInCategory(menuId, updateItemDto, req.user._id, req.user.role);
  }

  @Delete(':id/categories/:categoryId/items/:itemId')
  @Roles(UserRole.RESTAURANT_OWNER, UserRole.ADMIN)
  removeItemFromCategory(
    @Param('id') menuId: string,
    @Param('categoryId') categoryId: string,
    @Param('itemId') itemId: string,
    @Request() req,
  ) {
    return this.menusService.removeItemFromCategory(
      menuId,
      categoryId,
      itemId,
      req.user._id,
      req.user.role,
    );
  }
}