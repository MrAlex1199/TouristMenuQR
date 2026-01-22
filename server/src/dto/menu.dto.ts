import { 
  IsString, 
  IsNumber, 
  IsOptional, 
  IsArray, 
  IsBoolean, 
  ValidateNested, 
  Min, 
  Max,
  IsMongoId,
  IsDateString
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateMenuItemDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsNumber()
  @Min(0)
  price: number;

  @IsString()
  @IsOptional()
  image?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  allergens?: string[];

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  dietaryInfo?: string[];

  @IsBoolean()
  @IsOptional()
  isAvailable?: boolean;

  @IsNumber()
  @IsOptional()
  @Min(0)
  preparationTime?: number;

  @IsNumber()
  @IsOptional()
  @Min(0)
  @Max(5)
  spicyLevel?: number;

  @IsNumber()
  @IsOptional()
  @Min(0)
  calories?: number;
}

export class UpdateMenuItemDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  @Min(0)
  @IsOptional()
  price?: number;

  @IsString()
  @IsOptional()
  image?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  allergens?: string[];

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  dietaryInfo?: string[];

  @IsBoolean()
  @IsOptional()
  isAvailable?: boolean;

  @IsNumber()
  @IsOptional()
  @Min(0)
  preparationTime?: number;

  @IsNumber()
  @IsOptional()
  @Min(0)
  @Max(5)
  spicyLevel?: number;

  @IsNumber()
  @IsOptional()
  @Min(0)
  calories?: number;
}

export class CreateMenuCategoryDto {
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  image?: string;

  @IsNumber()
  @IsOptional()
  @Min(0)
  sortOrder?: number;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @ValidateNested({ each: true })
  @Type(() => CreateMenuItemDto)
  @IsOptional()
  items?: CreateMenuItemDto[];
}

export class UpdateMenuCategoryDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  image?: string;

  @IsNumber()
  @IsOptional()
  @Min(0)
  sortOrder?: number;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}

export class CreateMenuDto {
  @IsMongoId()
  restaurant: string;

  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @ValidateNested({ each: true })
  @Type(() => CreateMenuCategoryDto)
  @IsOptional()
  categories?: CreateMenuCategoryDto[];

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @IsDateString()
  @IsOptional()
  validFrom?: string;

  @IsDateString()
  @IsOptional()
  validUntil?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  availableLanguages?: string[];

  @IsString()
  @IsOptional()
  currency?: string;
}

export class UpdateMenuDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @IsDateString()
  @IsOptional()
  validFrom?: string;

  @IsDateString()
  @IsOptional()
  validUntil?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  availableLanguages?: string[];

  @IsString()
  @IsOptional()
  currency?: string;
}

export class AddItemToCategoryDto {
  @IsMongoId()
  categoryId: string;

  @ValidateNested()
  @Type(() => CreateMenuItemDto)
  item: CreateMenuItemDto;
}

export class UpdateItemInCategoryDto {
  @IsMongoId()
  categoryId: string;

  @IsMongoId()
  itemId: string;

  @ValidateNested()
  @Type(() => UpdateMenuItemDto)
  item: UpdateMenuItemDto;
}