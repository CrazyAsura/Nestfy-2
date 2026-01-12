import { IsNotEmpty, IsOptional, IsString, IsUrl } from 'class-validator';

export class CreateMaterialDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  type?: string;

  @IsString()
  @IsOptional()
  @IsUrl()
  imageUrl?: string;
}
