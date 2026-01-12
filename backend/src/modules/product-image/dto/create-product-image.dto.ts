import { IsString, IsUrl, IsBoolean, IsOptional } from 'class-validator';

export class CreateProductImageDto {
  @IsString()
  @IsUrl()
  url: string;

  @IsBoolean()
  @IsOptional()
  isMain?: boolean;
}
