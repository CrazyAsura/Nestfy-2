import { JwtService } from '@nestjs/jwt';
import argon from 'argon2';
import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { User } from '@prisma/client';
import { Role, UserType, DDI, DDD } from '../../constants/enums';
import { LoginDto } from './dto/login.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async getProfile(user: User) {
    const fullUser = await this.prisma.user.findUnique({
      where: { id: user.id },
      include: {
        addresses: {
          where: { isDefault: true },
          take: 1,
        },
        phones: {
          take: 1,
        },
      },
    });

    if (!fullUser) {
      throw new NotFoundException('Usuário não encontrado');
    }

    const defaultAddress = fullUser.addresses[0];
    const defaultPhone = fullUser.phones[0];

    return {
      ...fullUser,
      zipCode: defaultAddress?.zipCode,
      street: defaultAddress?.street,
      number: defaultAddress?.number,
      neighborhood: defaultAddress?.neighborhood,
      city: defaultAddress?.city,
      state: defaultAddress?.state,
      country: defaultAddress?.country,
      ddi: defaultPhone?.ddi,
      ddd: defaultPhone?.ddd,
      numberPhone: defaultPhone?.numberPhone,
    };
  }

  async updateProfile(user: User, updateDto: UpdateProfileDto & { imageFile?: Express.Multer.File }) {
    this.logger.log(`Updating profile for user ${user.id}`);
    this.logger.debug(`Update data: ${JSON.stringify(updateDto)}`);

    try {
      const {
        name, email, image, userType, document, imageFile,
        zipCode, street, number, neighborhood, city, state, country,
        ddi, ddd, numberPhone
      } = updateDto;

      const finalImage = imageFile ? imageFile.filename : image;

      // Converter DDI e DDD para o formato do enum se necessário
      let finalDdi = ddi;
      if (ddi && !ddi.startsWith('BRA_') && !ddi.startsWith('USA_') && !ddi.startsWith('ARG_')) {
        // Mapeamento simples ou prefixo padrão
        if (ddi === '55') finalDdi = DDI.BRA_55;
        else if (ddi === '1') finalDdi = DDI.USA_1;
        // Adicione outros conforme necessário ou use um mapeamento mais robusto
      }

      let finalDdd = ddd;
      if (ddd && !ddd.startsWith('DDD_')) {
        finalDdd = `DDD_${ddd}` as any;
      }

      return await this.prisma.$transaction(async (tx) => {
        const updatedUser = await tx.user.update({
          where: { id: user.id },
          data: {
            name,
            email,
            image: finalImage,
            userType,
            document,
          },
        });

        if (zipCode) {
          await this.upsertAddress(tx, user.id, {
            zipCode, street, number, neighborhood, city, state, country
          });
        }

        if (finalDdd && numberPhone) {
          await this.upsertPhone(tx, user.id, { ddi: finalDdi, ddd: finalDdd, numberPhone });
        }

        return this.getProfile(updatedUser);
      });
    } catch (error) {
      this.logger.error(`Error in updateProfile for user ${user.id}:`, error);
      throw error;
    }
  }

  private async upsertAddress(tx: any, userId: string, addressData: any) {
    const existingAddress = await tx.address.findFirst({
      where: { userId, isDefault: true },
    });

    const data = {
      zipCode: addressData.zipCode || '',
      street: addressData.street || '',
      number: addressData.number || '',
      neighborhood: addressData.neighborhood || '',
      city: addressData.city || '',
      state: addressData.state || '',
      country: addressData.country || 'Brasil',
      isDefault: true,
    };

    if (existingAddress) {
      return tx.address.update({
        where: { id: existingAddress.id },
        data,
      });
    }

    return tx.address.create({
      data: { ...data, userId },
    });
  }

  private async upsertPhone(tx: any, userId: string, phoneData: any) {
    const { ddi, ddd, numberPhone } = phoneData;
    const existingPhone = await tx.phone.findFirst({
      where: { userId },
    });

    const formattedDDI = this.formatEnum(ddi, 'BRA_', DDI.BRA_55);
    const formattedDDD = this.formatEnum(ddd, 'DDD_', null);

    const data = {
      ddi: formattedDDI as DDI,
      ddd: formattedDDD as DDD,
      numberPhone,
    };

    if (existingPhone) {
      return tx.phone.update({
        where: { id: existingPhone.id },
        data,
      });
    }

    return tx.phone.create({
      data: { ...data, userId },
    });
  }

  private formatEnum(value: string | undefined, prefix: string, defaultValue: any) {
    if (!value) return defaultValue;
    return value.startsWith(prefix) ? value : `${prefix}${value}`;
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

  async register(registerDto: RegisterDto, type: UserType) {
    this.logger.log(`Iniciando registro ${type} para: ${registerDto.email}`);
    
    const { 
      name, email, password, confirmPassword, document, image, 
      zipCode, street, number, neighborhood, city, state, country,
      ddi, ddd, numberPhone 
    } = registerDto;

    if (password !== confirmPassword) {
      throw new BadRequestException('As senhas não coincidem');
    }

    const existingUser = await this.prisma.user.findFirst({
      where: {
        OR: [{ email }, { document }]
      }
    });

    if (existingUser) {
      throw new BadRequestException('Email ou documento já está em uso');
    }

    const hashedPassword = await argon.hash(password);

    return await this.prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
          document,
          image,
          userType: type,
          role: Role.USER,
        }
      });

      if (zipCode && street && number && neighborhood && city && state) {
        await this.upsertAddress(tx, user.id, {
          zipCode, street, number, neighborhood, city, state, country
        });
      }

      if (ddd && numberPhone) {
        await this.upsertPhone(tx, user.id, { ddi, ddd, numberPhone });
      }

      this.logger.log(`Registro ${type} concluído com sucesso para: ${email}`);
      return user;
    });
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    try {
      const user = await this.prisma.user.findUnique({
        where: { email }
      });

      if (!user) {
        throw new BadRequestException('Email ou senha inválidos');
      }

      const isPasswordValid = await argon.verify(user.password, password);

      if (!isPasswordValid) {
        throw new BadRequestException('Email ou senha inválidos');
      }
      
      return this.generateToken(user);
    } catch (error) {
      if (error instanceof BadRequestException) throw error;
      this.logger.error('Erro inesperado durante o login:', error);
      throw new InternalServerErrorException('Erro interno ao processar login');
    }
  }

  async logout(user: User) {
    await this.prisma.refreshToken.deleteMany({
      where: { userId: user.id }
    });
    return { message: 'Logout realizado com sucesso' };
  }

  async refreshToken(refreshToken: string) {
    try {
      const payload = this.jwtService.verify(refreshToken);
      const user = await this.prisma.user.findUnique({
        where: { id: payload.sub }
      });

      if (!user) {
        throw new BadRequestException('Refresh token inválido');
      }

      return this.generateToken(user);
    } catch (error) {
      this.logger.error('Erro na renovação do token:', error.message);
      throw new BadRequestException('Refresh token inválido');
    }
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    const { email, password, confirmPassword } = resetPasswordDto;

    if (password !== confirmPassword) {
      throw new BadRequestException('As senhas não coincidem');
    }

    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new BadRequestException('Usuário não encontrado');
    }

    const hashedPassword = await argon.hash(password);

    await this.prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword },
    });

    return { message: 'Senha redefinida com sucesso' };
  }
}
