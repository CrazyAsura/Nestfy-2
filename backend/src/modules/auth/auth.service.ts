import { JwtService } from '@nestjs/jwt';
import * as argon from 'argon2';
import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException, UnauthorizedException } from '@nestjs/common';
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

      // Verificar se o email já está em uso por outro usuário
      if (email && email !== user.email) {
        const existingEmail = await this.prisma.user.findUnique({ where: { email } });
        if (existingEmail) {
          throw new BadRequestException({ code: 'email_already_exists', message: 'Este e-mail já está em uso por outra conta.' });
        }
      }

      // Verificar se o documento já está em uso por outro usuário
      if (document && document !== user.document) {
        const existingDoc = await this.prisma.user.findUnique({ where: { document } });
        if (existingDoc) {
          throw new BadRequestException({ code: 'document_already_exists', message: 'Este CPF/CNPJ já está cadastrado em nosso sistema.' });
        }
      }

      const finalImage = imageFile ? imageFile.filename : image;

      // Converter DDI e DDD para o formato do enum se necessário
      let finalDdi = ddi;
      if (ddi && !ddi.startsWith('BRA_') && !ddi.startsWith('USA_') && !ddi.startsWith('ARG_') && !ddi.startsWith('CHI_') && !ddi.startsWith('URU_') && !ddi.startsWith('PAR_')) {
        if (ddi === '55') finalDdi = DDI.BRA_55;
        else if (ddi === '1') finalDdi = DDI.USA_1;
        else if (ddi === '54') finalDdi = DDI.ARG_54;
        else if (ddi === '56') finalDdi = DDI.CHI_56;
        else if (ddi === '598') finalDdi = DDI.URU_598;
        else if (ddi === '595') finalDdi = DDI.PAR_595;
      }

      let finalDdd = ddd;
      if (ddd && !ddd.startsWith('DDD_')) {
        finalDdd = `DDD_${ddd}` as any;
      }

      return await this.prisma.$transaction(async (tx) => {
        const updatedUser = await tx.user.update({
          where: { id: user.id },
          data: {
            name: name !== undefined ? name : undefined,
            email: email !== undefined ? email : undefined,
            image: finalImage !== undefined ? finalImage : undefined,
            userType: userType !== undefined ? userType : undefined,
            document: document !== undefined ? document : undefined,
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
      
      if (error instanceof BadRequestException) {
        throw error;
      }

      if (error.code === 'P2002') {
        const target = error.meta?.target;
        if (Array.isArray(target) && target.includes('email')) {
          throw new BadRequestException({ code: 'email_already_exists', message: 'Este e-mail já está em uso.' });
        }
        if (Array.isArray(target) && target.includes('document')) {
          throw new BadRequestException({ code: 'document_already_exists', message: 'Este documento já está em uso.' });
        }
      }

      throw new BadRequestException({
        message: 'Não foi possível salvar as alterações. Verifique se todos os campos estão preenchidos corretamente.',
        error: error.message
      });
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

    // Se ddi já estiver formatado como enum, use-o, senão tente formatar
    let formattedDDI = ddi;
    if (ddi && !Object.values(DDI).includes(ddi as DDI)) {
        formattedDDI = this.formatEnum(ddi, 'BRA_', DDI.BRA_55);
    }
    
    // Se ddd já estiver formatado como enum, use-o, senão tente formatar
    let formattedDDD = ddd;
    if (ddd && !Object.values(DDD).includes(ddd as DDD)) {
        formattedDDD = this.formatEnum(ddd, 'DDD_', null);
    }

    const data = {
      ddi: (formattedDDI || DDI.BRA_55) as DDI,
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

    const accessTokenSecret = process.env.JWT_SECRET || 'sung';
    const refreshTokenSecret = process.env.JWT_REFRESH_SECRET || 'refresh_secret_mudar';

    try {
      const [accessToken, refreshToken] = await Promise.all([
        this.jwtService.signAsync(payload, {
          secret: accessTokenSecret,
          expiresIn: (process.env.JWT_EXPIRES_IN as any) || '7d',
        }),
        this.jwtService.signAsync(payload, {
          secret: refreshTokenSecret,
          expiresIn: '30d' as any,
        }),
      ]);

      // Opcional: Limpar tokens antigos do usuário para evitar poluição no banco
      await this.prisma.refreshToken.deleteMany({
        where: { userId: user.id }
      }).catch(err => this.logger.warn(`Erro ao limpar tokens antigos: ${err.message}`));

      // Salvar o novo refresh token
      await this.prisma.refreshToken.create({
        data: {
          token: refreshToken,
          userId: user.id,
          expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 dias
        },
      });

      return {
        accessToken,
        refreshToken,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          userType: user.userType,
        },
      };
    } catch (error) {
      this.logger.error(`Erro ao gerar tokens para o usuário ${user.email}:`, error);
      throw new InternalServerErrorException('Erro ao processar autenticação. Por favor, tente novamente mais tarde.');
    }
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
      if (existingUser.email === email) {
        throw new BadRequestException({ code: 'email_already_exists', message: 'Email já está em uso' });
      }
      if (existingUser.document === document) {
        throw new BadRequestException({ code: 'document_already_exists', message: 'Documento já está em uso' });
      }
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
    this.logger.log(`Tentativa de login para o email: ${email}`);

    try {
      const user = await this.prisma.user.findFirst({
        where: {
          email: {
            equals: email.trim(),
            mode: 'insensitive'
          },
          deletedAt: null
        }
      });

      if (!user) {
        this.logger.warn(`Usuário não encontrado: ${email}`);
        throw new UnauthorizedException('E-mail ou senha incorretos.');
      }

      if (!user.isActive) {
        this.logger.warn(`Tentativa de login em conta desativada: ${email}`);
        throw new UnauthorizedException('Esta conta está desativada. Entre em contato com o suporte.');
      }

      const isPasswordValid = await argon.verify(user.password, password).catch((err) => {
        this.logger.error(`Erro técnico ao verificar senha para ${email}:`, err);
        throw new InternalServerErrorException('Erro na verificação de segurança.');
      });

      if (!isPasswordValid) {
        this.logger.warn(`Senha inválida para o usuário: ${email}`);
        throw new UnauthorizedException('E-mail ou senha incorretos.');
      }

      this.logger.log(`Login bem-sucedido para: ${email}`);
      return await this.generateToken(user);
    } catch (error) {
      if (error instanceof UnauthorizedException || error instanceof InternalServerErrorException) {
        throw error;
      }

      this.logger.error(`Erro inesperado no login para ${email}:`, error);
      throw new InternalServerErrorException('Ocorreu um erro inesperado. Tente novamente mais tarde.');
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
      // Verificar se o token existe no banco
      const storedToken = await this.prisma.refreshToken.findUnique({
        where: { token: refreshToken },
        include: { user: true }
      });

      if (!storedToken || storedToken.expiresAt < new Date()) {
        if (storedToken) {
          await this.prisma.refreshToken.delete({ where: { id: storedToken.id } });
        }
        throw new BadRequestException('Sessão expirada. Por favor, faça login novamente.');
      }

      const payload = await this.jwtService.verifyAsync(refreshToken, {
        secret: process.env.JWT_REFRESH_SECRET || 'refresh_secret_mudar',
      });

      if (payload.sub !== storedToken.userId) {
        throw new BadRequestException('Token inválido');
      }

      // Remover o token antigo (estratégia de rotação de refresh token)
      await this.prisma.refreshToken.delete({
        where: { id: storedToken.id }
      });

      return this.generateToken(storedToken.user);
    } catch (error) {
      this.logger.error('Erro na renovação do token:', error.message);
      if (error instanceof BadRequestException) throw error;
      throw new BadRequestException('Não foi possível renovar sua sessão. Faça login novamente.');
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
