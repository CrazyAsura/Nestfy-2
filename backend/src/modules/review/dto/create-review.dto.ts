import { IsInt, IsNotEmpty, IsOptional, IsString, IsUUID, Max, Min } from 'class-validator';

export class CreateReviewDto {
  @IsInt({ message: 'A avaliação deve ser um número inteiro' })
  @Min(1, { message: 'A avaliação mínima é 1' })
  @Max(5, { message: 'A avaliação máxima é 5' })
  @IsNotEmpty({ message: 'A avaliação é obrigatória' })
  rating: number;

  @IsString({ message: 'O comentário deve ser uma string' })
  @IsOptional()
  comment?: string;

  @IsString({ message: 'ID do produto inválido' })
  @IsNotEmpty({ message: 'O ID do produto é obrigatório' })
  productId: string;
}
