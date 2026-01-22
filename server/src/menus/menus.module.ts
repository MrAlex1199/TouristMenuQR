import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MenusService } from './menus.service';
import { MenusController } from './menus.controller';
import { Menu, MenuSchema } from '../schemas/menu.schema';
import { Restaurant, RestaurantSchema } from '../schemas/restaurant.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Menu.name, schema: MenuSchema },
      { name: Restaurant.name, schema: RestaurantSchema },
    ]),
  ],
  controllers: [MenusController],
  providers: [MenusService],
  exports: [MenusService],
})
export class MenusModule {}