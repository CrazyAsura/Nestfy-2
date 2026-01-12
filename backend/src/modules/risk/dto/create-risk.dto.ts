import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateRiskDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  severity?: string; // e.g., Low, Medium, High
}
