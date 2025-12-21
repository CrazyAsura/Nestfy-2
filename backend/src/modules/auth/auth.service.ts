import { JwtService } from '@nestjs/jwt';
import argon from 'argon2';
import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { RegisterDto } from './dto/register.dto';
import { Role, User, UserType } from '@prisma/client';
import { LoginDto } from './dto/login.dto';

import { ResetPasswordDto } from './dto/reset-password.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService, 
    private readonly jwtService: JwtService
  ) {}
  
  async getProfile(user: User) {
    return user;
  }

  async generateToken(user: User) {
  const payload = {
    sub: user.id,
    email: user.email,
    role: user.role,
    userType: user.userType,
  };

  const accessToken = await this.jwtService.signAsync(payload);

  return {
    accessToken,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      userType: user.userType,
    },
  };
}


  async registerPF(registerDto: RegisterDto) {
    console.log('Iniciando registro PF para:', registerDto.email);
    const { 
      name, email, password, confirmPassword, document, image, 
      zipCode, street, number, neighborhood, city, state, country,
      ddi, ddd, numberPhone 
    } = registerDto;

    if (password !== confirmPassword) {
      console.warn('Falha no registro: Senhas não coincidem para', email);
      throw new BadRequestException('As senhas não coincidem');
    }

    const existingUser = await this.prisma.user.findFirst({
      where: {
        OR: [
          { email },
          { document }
        ]
      }
    });

    if (existingUser) {
      console.warn('Falha no registro: Email ou documento já em uso:', email, document);
      throw new BadRequestException('Email ou documento já está em uso');
    }

    const hashedPassword = await argon.hash(password);

    return await this.prisma.$transaction(async (tx) => {
      console.log('Criando usuário PF no banco de dados...');
      const user = await tx.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
          document,
          image,
          userType: UserType.INDIVIDUAL,
          role: Role.USER,
        }
      });

      if (zipCode && street && number && neighborhood && city && state) {
        console.log('Criando endereço para o usuário:', user.id);
        await tx.address.create({
          data: {
            userId: user.id,
            zipCode,
            street,
            number,
            neighborhood,
            city,
            state,
            country: country || 'Brasil',
            isDefault: true
          }
        });
      }

      if (ddd && numberPhone) {
        console.log('Criando telefone para o usuário:', user.id);
        await tx.phone.create({
          data: {
            userId: user.id,
            ddi: ddi ? `BRA_${ddi}` as any : 'BRA_55',
            ddd: `DDD_${ddd}` as any,
            numberPhone
          }
        });
      }

      console.log('Registro PF concluído com sucesso para:', email);
      return user;
    });
  }

  async registerPJ(registerDto: RegisterDto) {
    console.log('Iniciando registro PJ para:', registerDto.email);
    const { 
      name, email, password, confirmPassword, document, image, 
      zipCode, street, number, neighborhood, city, state, country,
      ddi, ddd, numberPhone 
    } = registerDto;

    if (password !== confirmPassword) {
      console.warn('Falha no registro: Senhas não coincidem para', email);
      throw new BadRequestException('As senhas não coincidem');
    }

    const existingUser = await this.prisma.user.findFirst({
      where: {
        OR: [
          { email },
          { document }
        ]
      }
    });

    if (existingUser) {
      console.warn('Falha no registro: Email ou documento já em uso:', email, document);
      throw new BadRequestException('Email ou documento já está em uso');
    }

    const hashedPassword = await argon.hash(password);

    return await this.prisma.$transaction(async (tx) => {
      console.log('Criando usuário PJ no banco de dados...');
      const user = await tx.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
          document,
          image,
          userType: UserType.LEGAL_ENTITY,
          role: Role.USER,
        }
      });

      if (zipCode && street && number && neighborhood && city && state) {
        console.log('Criando endereço para o usuário:', user.id);
        await tx.address.create({
          data: {
            userId: user.id,
            zipCode,
            street,
            number,
            neighborhood,
            city,
            state,
            country: country || 'Brasil',
            isDefault: true
          }
        });
      }

      if (ddd && numberPhone) {
        console.log('Criando telefone para o usuário:', user.id);
        await tx.phone.create({
          data: {
            userId: user.id,
            ddi: ddi ? `BRA_${ddi}` as any : 'BRA_55',
            ddd: `DDD_${ddd}` as any,
            numberPhone
          }
        });
      }

      console.log('Registro PJ concluído com sucesso para:', email);
      return user;
    });
  }
  
    async login(LoginDto: LoginDto) {
      console.log('Tentativa de login recebida para:', LoginDto.email);
      const { email, password } = LoginDto;

      try {
        const user = await this.prisma.user.findUnique({
          where: {
            email,
          }
        })

        if (!user) {
          console.warn('Falha no login: Usuário não encontrado no banco de dados:', email);
          throw new BadRequestException('Email ou senha inválidos');
        }

        console.log('Usuário encontrado, verificando senha...');
        const isPasswordValid = await argon.verify(user.password, password);

        if (!isPasswordValid) {
          console.warn('Falha no login: Senha incorreta fornecida para:', email);
          throw new BadRequestException('Email ou senha inválidos');
        }
        
        console.log('Senha validada com sucesso para:', email);
        const tokens = await this.generateToken(user);
        console.log('Tokens gerados com sucesso para:', email);
        return tokens;
      } catch (error) {
        if (error instanceof BadRequestException) throw error;
        
        console.error('Erro inesperado durante o login:', error);
        throw new InternalServerErrorException('Erro interno ao processar login');
      }
    }

    async logout(user: User){
      await this.prisma.refreshToken.deleteMany({
        where: {
          userId: user.id
        }
      })
      return { message: 'Logout realizado com sucesso' };
    }

    async refreshToken(refreshToken: string) {
      console.log('Iniciando renovação de token');
      try {
        const payload = this.jwtService.verify(refreshToken);
        const user = await this.prisma.user.findUnique({
          where: {
            id: payload.sub,
          }
        })

        if (!user) {
          console.warn('Falha na renovação: Usuário não encontrado para o token');
          throw new BadRequestException('Refresh token inválido');
        }

        console.log('Token renovado com sucesso para:', user.email);
        return this.generateToken(user);
      } catch (error) {
        console.error('Erro na renovação do token:', error.message);
        throw new BadRequestException('Refresh token inválido');
      }
    }

  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    console.log('Iniciando redefinição de senha para:', resetPasswordDto.email);
    const { email, password, confirmPassword } = resetPasswordDto;

    if (password !== confirmPassword) {
      console.warn('Falha na redefinição: Senhas não coincidem para', email);
      throw new BadRequestException('As senhas não coincidem');
    }

    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      console.warn('Falha na redefinição: Usuário não encontrado:', email);
      throw new BadRequestException('Usuário não encontrado');
    }

    const hashedPassword = await argon.hash(password);

    await this.prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword },
    });

    console.log('Senha redefinida com sucesso para:', email);
    return { message: 'Senha redefinida com sucesso' };
  }
}
