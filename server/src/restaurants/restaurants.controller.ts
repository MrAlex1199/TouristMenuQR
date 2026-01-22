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
  DefaultValuePipe
} from '@nestjs/common';
import { RestaurantsService } from './restaurants.service';
import { CreateRestaurantDto, UpdateRestaurantDto } from '../dto/restaurant.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../decorators/roles.decorator';
import { Public } from '../decorators/public.decorator';
import { UserRole } from '../schemas/user.schema';

@Controller('restaurants')
@UseGuards(JwtAuthGuard, RolesGuard)
export class RestaurantsController {
  constructor(private readonly restaurantsService: RestaurantsService) {}

  @Post()
  @Roles(UserRole.RESTAURANT_OWNER, UserRole.ADMIN)
  create(@Body() createRestaurantDto: CreateRestaurantDto, @Request() req) {
    return this.restaurantsService.create(createRestaurantDto, req.user._id);
  }

  @Public()
  @Get()
  findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ) {
    return this.restaurantsService.findAll(page, limit);
  }

  @Public()
  @Get('nearby')
  findNearby(
    @Query('lat', ParseIntPipe) lat: number,
    @Query('lng', ParseIntPipe) lng: number,
    @Query('maxDistance', new DefaultValuePipe(5000), ParseIntPipe) maxDistance: number,
  ) {
    return this.restaurantsService.findNearby(lat, lng, maxDistance);
  }

  @Get('my-restaurants')
  @Roles(UserRole.RESTAURANT_OWNER, UserRole.ADMIN)
  findMyRestaurants(@Request() req) {
    return this.restaurantsService.findByOwner(req.user._id);
  }

  @Public()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.restaurantsService.findOne(id);
  }

  @Patch(':id')
  @Roles(UserRole.RESTAURANT_OWNER, UserRole.ADMIN)
  update(
    @Param('id') id: string, 
    @Body() updateRestaurantDto: UpdateRestaurantDto,
    @Request() req
  ) {
    return this.restaurantsService.update(id, updateRestaurantDto, req.user._id, req.user.role);
  }

  @Delete(':id')
  @Roles(UserRole.RESTAURANT_OWNER, UserRole.ADMIN)
  remove(@Param('id') id: string, @Request() req) {
    return this.restaurantsService.remove(id, req.user._id, req.user.role);
  }

  @Post(':id/regenerate-qr')
  @Roles(UserRole.RESTAURANT_OWNER, UserRole.ADMIN)
  regenerateQRCode(@Param('id') id: string, @Request() req) {
    return this.restaurantsService.regenerateQRCode(id, req.user._id, req.user.role);
  }
}