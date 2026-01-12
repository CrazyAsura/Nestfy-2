import { JwtService } from '@nestjs/jwt';
import * as argon from 'argon2';
import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Connection } from 'mongoose';
import { RegisterDto } from './dto/register.dto';
import { User, UserDocument } from '../user/schemas/user.schema';
import { RefreshToken, RefreshTokenDocument } from '../refresh-token/schemas/refresh-token.schema';
import { Address, AddressDocument } from '../address/schemas/address.schema';
import { Phone, PhoneDocument } from '../phone/schemas/phone.schema';
import { Cart, CartDocument } from '../cart/schemas/cart.schema';
import { Role, UserType, DDI, DDD } from '../../constants/enums';
import { LoginDto } from './dto/login.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { InjectConnection } from '@nestjs/mongoose';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
    @InjectModel(RefreshToken.name)
    private readonly refreshTokenModel: Model<RefreshTokenDocument>,
    @InjectModel(Address.name)
    private readonly addressModel: Model<AddressDocument>,
    @InjectModel(Phone.name)
    private readonly phoneModel: Model<PhoneDocument>,
    @InjectModel(Cart.name)
    private readonly cartModel: Model<CartDocument>,
    private readonly jwtService: JwtService,
    @InjectConnection() private readonly connection: Connection,
  ) {}

  async getProfile(user: UserDocument) {
    const fullUser = await this.userModel.findById(user.id).exec();

    if (!fullUser) {
      throw new NotFoundException('Usuário não encontrado');
    }

    const addresses = await this.addressModel.find({ userId: user.id }).exec();
    const phones = await this.phoneModel.find({ userId: user.id }).exec();

    const defaultAddress = addresses.find(a => a.isDefault);
    const defaultPhone = phones[0];

    return {
      ...fullUser.toObject(),
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

  async updateProfile(user: UserDocument, updateDto: UpdateProfileDto & { imageFile?: Express.Multer.File }) {
    this.logger.log(`Updating profile for user ${user.id}`);
    this.logger.debug(`Update data: ${JSON.stringify(updateDto)}`);

    try {
      const {
        name, email: rawEmail, image, userType, document, imageFile,
        zipCode, street, number, neighborhood, city, state, country,
        ddi, ddd, numberPhone
      } = updateDto;

      const email = rawEmail?.trim().toLowerCase();

      // Verificar se o email já está em uso por outro usuário
      if (email && email !== user.email) {
        const existingEmail = await this.userModel.findOne({ email }).exec();
        if (existingEmail) {
          throw new BadRequestException({ code: 'email_already_exists', message: 'Este e-mail já está em uso por outra conta.' });
        }
      }

      // Verificar se o documento já está em uso por outro usuário
      if (document && document !== user.document) {
        const existingDoc = await this.userModel.findOne({ document }).exec();
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

      await this.userModel.findByIdAndUpdate(user.id, {
        name: name !== undefined ? name : undefined,
        email: email !== undefined ? email : undefined,
        image: finalImage !== undefined ? finalImage : undefined,
        userType: userType !== undefined ? userType : undefined,
        document: document !== undefined ? document : undefined,
      }).exec();

      const updatedUser = await this.userModel.findById(user.id).exec();

      if (!updatedUser) {
        throw new BadRequestException('Falha ao atualizar o perfil do usuário');
      }

      if (zipCode) {
        await this.upsertAddress(user.id, {
          zipCode, street, number, neighborhood, city, state, country
        });
      }

      if (finalDdd && numberPhone) {
        await this.upsertPhone(user.id, { ddi: finalDdi, ddd: finalDdd, numberPhone });
      }

      return this.getProfile(updatedUser);
    } catch (error) {
      this.logger.error(`Error in updateProfile for user ${user.id}:`, error);
      
      if (error instanceof BadRequestException) {
        throw error;
      }

      // Erros do MongoDB
      if (error.code === 11000) {
        if (error.message.includes('email')) {
          throw new BadRequestException({ code: 'email_already_exists', message: 'Este e-mail já está em uso.' });
        }
        if (error.message.includes('document')) {
          throw new BadRequestException({ code: 'document_already_exists', message: 'Este documento já está em uso.' });
        }
      }

      throw new BadRequestException({
        message: 'Não foi possível salvar as alterações. Verifique se todos os campos estão preenchidos corretamente.',
        error: error.message
      });
    }
  }

  private async upsertAddress(userId: string, addressData: any) {
    const data = {
      zipCode: addressData.zipCode || '',
      street: addressData.street || '',
      number: addressData.number || '',
      neighborhood: addressData.neighborhood || '',
      city: addressData.city || '',
      state: addressData.state || '',
      country: addressData.country || 'Brasil',
      isDefault: true,
      userId,
    };

    return await this.addressModel.findOneAndUpdate(
      { userId, isDefault: true },
      data,
      { upsert: true, new: true }
    ).exec();
  }

  private async upsertPhone(userId: string, phoneData: any) {
    const { ddi, ddd, numberPhone } = phoneData;
    
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
      userId,
    };

    return await this.phoneModel.findOneAndUpdate(
      { userId },
      data,
      { upsert: true, new: true }
    ).exec();
  }

  private formatEnum(value: string | undefined, prefix: string, defaultValue: any) {
    if (!value) return defaultValue;
    return value.startsWith(prefix) ? value : `${prefix}${value}`;
  }

  async generateToken(user: UserDocument) {
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
      await this.refreshTokenModel.deleteMany({
        userId: user.id
      }).exec().catch(err => this.logger.warn(`Erro ao limpar tokens antigos: ${err.message}`));

      // Salvar o novo refresh token
      const newToken = new this.refreshTokenModel({
        token: refreshToken,
        userId: user.id,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 dias
      });
      await newToken.save();

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
      this.logger.error(`Erro ao gerar tokens para o usuário ${user.email}: ${error.message}`, error.stack);
      throw new InternalServerErrorException(`Erro ao processar autenticação: ${error.message}`);
    }
  }

  async register(registerDto: RegisterDto, type: UserType) {
    this.logger.log(`Iniciando registro ${type} para: ${registerDto.email}`);
    
    const { 
      name, email: rawEmail, password, confirmPassword, document, image, 
      zipCode, street, number, neighborhood, city, state, country,
      ddi, ddd, numberPhone 
    } = registerDto;

    const email = rawEmail.trim().toLowerCase();

    if (password !== confirmPassword) {
      throw new BadRequestException('As senhas não coincidem');
    }

    const existingUser = await this.userModel.findOne({
      $or: [
        { email },
        { document }
      ]
    }).exec();

    if (existingUser) {
      // @ts-ignore - Propriedade deletedAt pode existir em documentos antigos no MongoDB
      if (existingUser.deletedAt || (existingUser as any).deletedAt) {
        this.logger.log(`Usuário antigo (soft-deleted) encontrado com email/documento: ${email}/${document}. Removendo permanentemente para permitir novo registro.`);
        
        // Se o usuário foi "removido" (soft delete) anteriormente, vamos removê-lo 
        // permanentemente agora para que o novo registro não falhe por duplicidade.
        const oldUserId = (existingUser as any)._id || existingUser.id;
        
        // Limpar dados relacionados do usuário antigo
        await Promise.all([
          this.addressModel.deleteMany({ userId: oldUserId }).exec(),
          this.phoneModel.deleteMany({ userId: oldUserId }).exec(),
          this.cartModel.deleteMany({ userId: oldUserId }).exec(),
          this.refreshTokenModel.deleteMany({ userId: oldUserId }).exec(),
        ]);
        
        // Deletar o usuário antigo
        await this.userModel.findByIdAndDelete(oldUserId).exec();
        
        this.logger.log(`Usuário antigo ${oldUserId} removido com sucesso.`);
      } else {
        if (existingUser.isBanned) {
          throw new BadRequestException({ code: 'user_banned', message: 'Este usuário está banido permanentemente.' });
        }
        if (existingUser.email === email) {
          throw new BadRequestException({ code: 'email_already_exists', message: 'Email já está em uso' });
        }
        if (existingUser.document === document) {
          throw new BadRequestException({ code: 'document_already_exists', message: 'Documento já está em uso' });
        }
        throw new BadRequestException('Email ou documento já está em uso');
      }
    }

    const hashedPassword = await argon.hash(password);

    const session = await this.connection.startSession();
    session.startTransaction();

    try {
      const user = new this.userModel({
        name,
        email,
        password: hashedPassword,
        document,
        image,
        userType: type,
        role: Role.USER,
      });
      const savedUser = await user.save({ session });

      if (zipCode && street && number && neighborhood && city && state) {
        await this.upsertAddressWithSession(savedUser.id, {
          zipCode, street, number, neighborhood, city, state, country
        }, session);
      }

      if (ddd && numberPhone) {
        await this.upsertPhoneWithSession(savedUser.id, { ddi, ddd, numberPhone }, session);
      }

      await session.commitTransaction();
      this.logger.log(`Registro ${type} concluído com sucesso para: ${email}`);
      return savedUser;
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }

  private async upsertAddressWithSession(userId: string, addressData: any, session: any) {
    const data = {
      zipCode: addressData.zipCode || '',
      street: addressData.street || '',
      number: addressData.number || '',
      neighborhood: addressData.neighborhood || '',
      city: addressData.city || '',
      state: addressData.state || '',
      country: addressData.country || 'Brasil',
      isDefault: true,
      userId,
    };

    return await this.addressModel.findOneAndUpdate(
      { userId, isDefault: true },
      data,
      { upsert: true, new: true, session }
    ).exec();
  }

  private async upsertPhoneWithSession(userId: string, phoneData: any, session: any) {
    const { ddi, ddd, numberPhone } = phoneData;
    
    let formattedDDI = ddi;
    if (ddi && !Object.values(DDI).includes(ddi as DDI)) {
        formattedDDI = this.formatEnum(ddi, 'BRA_', DDI.BRA_55);
    }
    
    let formattedDDD = ddd;
    if (ddd && !Object.values(DDD).includes(ddd as DDD)) {
        formattedDDD = this.formatEnum(ddd, 'DDD_', null);
    }

    const data = {
      ddi: (formattedDDI || DDI.BRA_55) as DDI,
      ddd: formattedDDD as DDD,
      numberPhone,
      userId,
    };

    return await this.phoneModel.findOneAndUpdate(
      { userId },
      data,
      { upsert: true, new: true, session }
    ).exec();
  }

  async login(loginDto: LoginDto, ip?: string) {
    const { email, password } = loginDto;
    
    if (!email) {
      throw new BadRequestException('E-mail é obrigatório');
    }

    this.logger.log(`[DEBUG LOGIN] Tentativa para o email: ${email}`);

    try {
      const user = await this.userModel.findOne({
        email: email.trim().toLowerCase() // Forçar lowercase para evitar erros de digitação
      }).exec();

      if (!user) {
        this.logger.warn(`[DEBUG LOGIN] Usuário não encontrado no banco para o email: ${email}`);
        throw new UnauthorizedException('E-mail ou senha incorretos.');
      }

      this.logger.log(`[DEBUG LOGIN] Usuário encontrado: ID=${user.id}, Email=${user.email}, Role=${user.role}, Ativo=${user.isActive}`);

      if (!user.isActive) {
        this.logger.warn(`[DEBUG LOGIN] Conta desativada: ${email}`);
        throw new UnauthorizedException('Esta conta está desativada. Entre em contato com o suporte.');
      }

      if (user.isBanned) {
        this.logger.warn(`[DEBUG LOGIN] Usuário banido tentou logar: ${email}`);
        throw new UnauthorizedException('Esta conta foi banida permanentemente.');
      }

      // Logar o tamanho da senha no banco para conferência (sem logar o hash)
      this.logger.log(`[DEBUG LOGIN] Tamanho do hash no banco: ${user.password.length}`);

      const isPasswordValid = await argon.verify(user.password, password).catch((err) => {
        this.logger.error(`[DEBUG LOGIN] Erro técnico no argon.verify para ${email}: ${err.message}`, err.stack);
        throw new InternalServerErrorException(`Erro na verificação de segurança: ${err.message}`);
      });

      if (isPasswordValid && ip) {
        // Atualizar IP no login
        await this.userModel.findByIdAndUpdate(user.id, { lastIp: ip }).exec();
      }

      if (!isPasswordValid) {
        this.logger.warn(`[DEBUG LOGIN] Senha incorreta para o usuário: ${email}`);
        throw new UnauthorizedException('E-mail ou senha incorretos.');
      }

      this.logger.log(`[DEBUG LOGIN] Login bem-sucedido para: ${email}`);
      return await this.generateToken(user);
    } catch (error) {
      this.logger.error(`ERRO DETALHADO NO LOGIN (${email}):`, error);
      
      if (error instanceof UnauthorizedException || error instanceof InternalServerErrorException || error instanceof BadRequestException) {
        throw error;
      }

      // Se for um erro do banco de dados, ele terá um código ou mensagem específica
      const dbMessage = error.code ? `[DB ${error.code}] ${error.message}` : error.message;
      
      throw new InternalServerErrorException(`Erro no banco de dados: ${dbMessage}`);
    }
  }

  async logout(user: UserDocument) {
    await this.refreshTokenModel.deleteMany({
      userId: user.id
    }).exec();
    return { message: 'Logout realizado com sucesso' };
  }

  async seedAdmin() {
    const adminEmail = 'adminnestfy@gmail.com'.toLowerCase();
    const adminPassword = 'None@3355';

    // Procurar inclusive entre deletados (Mongoose não tem soft delete por padrão unless configured)
    const existingAdmin = await this.userModel.findOne({ email: adminEmail }).exec();

    if (existingAdmin) {
      this.logger.log(`[SEED] Atualizando administrador existente: ${adminEmail}`);
      const hashedPassword = await argon.hash(adminPassword);
      existingAdmin.password = hashedPassword;
      existingAdmin.isActive = true;
      existingAdmin.role = Role.ADMIN;
      await existingAdmin.save();
      return { message: 'Administrador atualizado e ativado com sucesso' };
    }

    this.logger.log(`[SEED] Criando novo administrador: ${adminEmail}`);
    const hashedPassword = await argon.hash(adminPassword);

    const admin = new this.userModel({
      name: 'Administrador Nestfy',
      email: adminEmail,
      password: hashedPassword,
      role: Role.ADMIN,
      userType: UserType.INDIVIDUAL,
      document: '00000000000',
      isActive: true
    });
    
    try {
      await admin.save();
      return { message: 'Administrador criado com sucesso' };
    } catch (error) {
      this.logger.error(`[SEED] Erro ao criar administrador: ${error.message}`);
      // Se der erro de duplicidade no documento, tenta atualizar o existente pelo documento
      if (error.code === 11000 || error.message.includes('unique') || error.message.includes('Duplicate')) {
        const adminByDoc = await this.userModel.findOne({ document: '00000000000' }).exec();
        if (adminByDoc) {
          adminByDoc.email = adminEmail;
          adminByDoc.password = hashedPassword;
          adminByDoc.isActive = true;
          adminByDoc.role = Role.ADMIN;
          await adminByDoc.save();
          return { message: 'Administrador atualizado via documento com sucesso' };
        }
      }
      throw error;
    }
  }

  async refreshToken(refreshToken: string) {
    try {
      // Verificar se o token existe no banco
      const storedToken = await this.refreshTokenModel.findOne({ token: refreshToken }).exec();

      if (!storedToken) {
        throw new UnauthorizedException('Token de atualização inválido');
      }

      // Verificar se o token expirou no banco
      if (storedToken.expiresAt < new Date()) {
        await this.refreshTokenModel.findByIdAndDelete(storedToken.id).exec();
        throw new UnauthorizedException('Token de atualização expirado');
      }

      // Validar o JWT
      const payload = await this.jwtService.verifyAsync(refreshToken, {
        secret: process.env.JWT_REFRESH_SECRET || 'refresh_secret_mudar',
      });

      const user = await this.userModel.findById(payload.sub).exec();
      if (!user) {
        throw new UnauthorizedException('Usuário não encontrado');
      }

      // Gerar novos tokens
      return await this.generateToken(user);
    } catch (error) {
      this.logger.error(`Erro ao atualizar token: ${error.message}`);
      throw new UnauthorizedException('Token de atualização inválido ou expirado');
    }
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    const { email: rawEmail, password, confirmPassword } = resetPasswordDto;

    const email = rawEmail?.trim().toLowerCase();

    if (password !== confirmPassword) {
      throw new BadRequestException('As senhas não coincidem');
    }

    const user = await this.userModel.findOne({ email }).exec();
    if (!user) {
      this.logger.warn(`[RESET PASSWORD] Usuário não encontrado para o e-mail: ${email}`);
      throw new NotFoundException('Usuário não encontrado');
    }

    if (!user.isActive) {
      this.logger.warn(`[RESET PASSWORD] Tentativa de reset para conta desativada: ${email}`);
      throw new BadRequestException('Não é possível redefinir a senha de uma conta desativada.');
    }

    const hashedPassword = await argon.hash(password);
    user.password = hashedPassword;
    await user.save();

    this.logger.log(`[RESET PASSWORD] Senha redefinida com sucesso para: ${email}`);
    return { message: 'Senha redefinida com sucesso' };
  }
}
