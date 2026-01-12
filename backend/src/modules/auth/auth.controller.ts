import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  HttpCode,
  Req,
} from '@nestjs/common';
import { Request } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { User, UserDocument } from '../user/schemas/user.schema';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { UserType } from '../../constants/enums';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@CurrentUser() user: UserDocument) {
    return this.authService.getProfile(user);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('profile')
  @UseInterceptors(FileInterceptor('image', {
    storage: diskStorage({
      destination: './uploads',
      filename: (req, file, callback) => {
        const uniqueSuffix = Date.now() + '-' +
        Math.round(Math.random() * 1e9);
        callback(null, `${uniqueSuffix}${extname(file.originalname)}`);
      }
    })
  }))
  async updateProfile(
    @CurrentUser() user: UserDocument,
    @Body() updateDto: UpdateProfileDto,
    @UploadedFile() image?: Express.Multer.File
  ) {
    return this.authService.updateProfile(user, { ...updateDto, imageFile: image });
  }

  @Post('register/pf')
  registerPF(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto, UserType.INDIVIDUAL);
  }

  @Post('register/pj')
  registerPJ(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto, UserType.LEGAL_ENTITY);
  }

  @Post('login')
  @HttpCode(200)
  login(@Body() loginDto: LoginDto, @Req() req: Request) {
    const ip = req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    return this.authService.login(loginDto, typeof ip === 'string' ? ip : undefined);
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  logout(@CurrentUser() user: UserDocument) {
    return this.authService.logout(user);
  }

  @Post('refresh')
  refreshToken(@Body() refreshTokenDto: RefreshTokenDto) {
    return this.authService.refreshToken(refreshTokenDto.refreshToken);
  }

  @Post('reset-password')
  resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return this.authService.resetPassword(resetPasswordDto);
  }

  @Post('seed-admin')
  seedAdmin() {
    return this.authService.seedAdmin();
  }
}
