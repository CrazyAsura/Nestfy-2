import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, MinLength } from "class-validator";
import { UserType, Role } from "../../../constants/enums";

export class CreateUserDto {
    @IsString({ message: 'O nome deve ser uma string' })
    name?: string;

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

    @IsEnum(UserType, { message: 'Tipo de usuário inválido' })
    userType?: UserType;

    @IsEnum(Role, { message: 'Role inválida' })
    role?: Role;

    @IsString({ message: 'A URL da imagem deve ser uma string' })
    image?: string;
}
