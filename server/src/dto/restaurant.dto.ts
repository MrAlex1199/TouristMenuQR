import { IsString, IsOptional, IsArray, IsNumber, IsBoolean, IsEmail, ValidateNested, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';

class LocationDto {
  @IsString()
  type: string;

  @IsArray()
  @IsNumber({}, { each: true })
  coordinates: number[];
}

class OpeningHoursDto {
  @IsString()
  @IsOptional()
  open?: string;

  @IsString()
  @IsOptional()
  close?: string;

  @IsBoolean()
  @IsOptional()
  closed?: boolean;
}

class WeeklyHoursDto {
  @ValidateNested()
  @Type(() => OpeningHoursDto)
  @IsOptional()
  monday?: OpeningHoursDto;

  @ValidateNested()
  @Type(() => OpeningHoursDto)
  @IsOptional()
  tuesday?: OpeningHoursDto;

  @ValidateNested()
  @Type(() => OpeningHoursDto)
  @IsOptional()
  wednesday?: OpeningHoursDto;

  @ValidateNested()
  @Type(() => OpeningHoursDto)
  @IsOptional()
  thursday?: OpeningHoursDto;

  @ValidateNested()
  @Type(() => OpeningHoursDto)
  @IsOptional()
  friday?: OpeningHoursDto;

  @ValidateNested()
  @Type(() => OpeningHoursDto)
  @IsOptional()
  saturday?: OpeningHoursDto;

  @ValidateNested()
  @Type(() => OpeningHoursDto)
  @IsOptional()
  sunday?: OpeningHoursDto;
}

export class CreateRestaurantDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsString()
  address: string;

  @IsString()
  @IsOptional()
  phoneNumber?: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  website?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  images?: string[];

  @IsString()
  @IsOptional()
  logo?: string;

  @ValidateNested()
  @Type(() => LocationDto)
  location: LocationDto;

  @ValidateNested()
  @Type(() => WeeklyHoursDto)
  @IsOptional()
  openingHours?: WeeklyHoursDto;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  cuisineTypes?: string[];
}

export class UpdateRestaurantDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  address?: string;

  @IsString()
  @IsOptional()
  phoneNumber?: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  website?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  images?: string[];

  @IsString()
  @IsOptional()
  logo?: string;

  @ValidateNested()
  @Type(() => LocationDto)
  @IsOptional()
  location?: LocationDto;

  @ValidateNested()
  @Type(() => WeeklyHoursDto)
  @IsOptional()
  openingHours?: WeeklyHoursDto;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  cuisineTypes?: string[];

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}