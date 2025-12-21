import { Role, UserType } from "@prisma/client";
import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, MinLength } from "class-validator";

export class RegisterDto {
    @IsString({ message: 'O nome deve ser uma string' })
    @IsNotEmpty({ message: 'O nome é obrigatório' })
    name: string;

    @IsEmail({}, { message: 'Email inválido' })
    @IsNotEmpty({ message: 'O email é obrigatório' })
    email: string;

    @IsNotEmpty({ message: 'A senha é obrigatória' })
    @MinLength(8, { message: 'A senha deve ter no mínimo 8 caracteres' })
    password: string;

    @IsNotEmpty({ message: 'A confirmação de senha é obrigatória' })
    @MinLength(8, { message: 'A senha deve ter no mínimo 8 caracteres' })
    confirmPassword: string;

    @IsNotEmpty({ message: 'O documento (CPF/CNPJ) é obrigatório' })
    @IsString({ message: 'O documento deve ser uma string' })
    document: string;

    @IsOptional()
    @IsString({ message: 'A URL da imagem deve ser uma string' })
    image?: string;

    @IsEnum(UserType, { message: 'Tipo de usuário inválido' })
    @IsOptional()
    userType?: UserType;

    @IsEnum(Role, { message: 'Role inválido' })
    @IsOptional()
    role?: Role;

    // Address fields
    @IsOptional()
    @IsString()
    zipCode?: string;

    @IsOptional()
    @IsString()
    street?: string;

    @IsOptional()
    @IsString()
    number?: string;

    @IsOptional()
    @IsString()
    neighborhood?: string;

    @IsOptional()
    @IsString()
    city?: string;

    @IsOptional()
    @IsString()
    state?: string;

    @IsOptional()
    @IsString()
    country?: string;

    // Phone fields
    @IsOptional()
    @IsString()
    ddi?: string;

    @IsOptional()
    @IsString()
    ddd?: string;

    @IsOptional()
    @IsString()
    numberPhone?: string;
}
