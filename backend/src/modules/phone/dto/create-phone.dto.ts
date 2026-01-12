import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { DDI, DDD } from '../../../constants/enums';

export class CreatePhoneDto {
  @IsEnum(DDI)
  @IsNotEmpty()
  ddi: DDI;

  @IsEnum(DDD)
  @IsNotEmpty()
  ddd: DDD;

  @IsString()
  @IsNotEmpty()
  numberPhone: string;
}
