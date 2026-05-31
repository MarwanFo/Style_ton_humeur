import { Injectable, ConflictException, UnauthorizedException, InternalServerErrorException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { generateSecret, generateURI, verify } from 'otplib';
import axios from 'axios';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async register(data: {
    email: string;
    pass: string;
    displayName: string;
    gender: string;
    age: number;
  }) {
    const existing = await this.usersService.findByEmail(data.email);
    if (existing) {
      throw new ConflictException('Email already registered');
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(data.pass, salt);

    const user = await this.usersService.create({
      email: data.email,
      passwordHash,
      displayName: data.displayName,
      gender: data.gender,
      age: data.age,
    });

    const { passwordHash: _, ...result } = user;
    return result;
  }

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);
    if (user && (await bcrypt.compare(pass, user.passwordHash))) {
      const { passwordHash, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = { email: user.email, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        displayName: user.displayName,
        gender: user.gender,
        age: user.age,
        role: user.role,
        plan: user.plan,
      },
    };
  }

  async generateTwoFactorSecret(userId: number, email: string) {
    const secret = generateSecret();
    const otpauthUrl = generateURI({
      issuer: 'StyleTonHumeur',
      label: email,
      secret,
    });
    await this.usersService.update2FactorSecret(userId, secret, false);
    return {
      secret,
      otpauthUrl,
    };
  }

  async verifyTwoFactorCode(userId: number, code: string): Promise<boolean> {
    const user = await this.usersService.findById(userId);
    if (!user || !user.twoFactorSecret) {
      return false;
    }
    const result = await verify({
      token: code,
      secret: user.twoFactorSecret,
    });
    return result.valid;
  }

  async enableTwoFactor(userId: number, code: string): Promise<boolean> {
    const isValid = await this.verifyTwoFactorCode(userId, code);
    if (isValid) {
      await this.usersService.update2FactorSecret(userId, undefined, true);
      return true;
    }
    return false;
  }

  async disableTwoFactor(userId: number, code: string): Promise<boolean> {
    const isValid = await this.verifyTwoFactorCode(userId, code);
    if (isValid) {
      await this.usersService.update2FactorSecret(userId, null, false);
      return true;
    }
    return false;
  }

  async loginWithUserId(userId: number) {
    const user = await this.usersService.findById(userId);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    return this.login(user);
  }

  async loginWithGoogleProfile(email: string, displayName: string) {
    let user = await this.usersService.findByEmail(email);
    if (!user) {
      user = await this.usersService.create({
        email,
        passwordHash: '',
        displayName,
        gender: 'femme',
        age: 20,
      });
    }
    return this.login(user);
  }

  async forgotPassword(email: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException("Cet e-mail n'existe pas dans notre base de données.");
    }

    // Generate a 6-digit verification code
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expires = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes validity

    await this.usersService.setResetToken(user.id, code, expires);

    console.log('\n=========================================');
    console.log('🔑 [CODE DE RÉINITIALISATION DE MOT DE PASSE]');
    console.log(`📧 Destinataire: ${email}`);
    console.log(`🔢 Code temporaire: ${code}`);
    console.log('=========================================\n');

    return { 
      success: true, 
      message: 'Un code de réinitialisation a été généré.',
      code // returned in development API response for convenience
    };
  }

  async resetPassword(email: string, code: string, newPass: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException("Utilisateur non trouvé.");
    }

    if (!user.resetToken || user.resetToken !== code) {
      throw new UnauthorizedException("Le code de réinitialisation est incorrect.");
    }

    if (!user.resetTokenExpires || user.resetTokenExpires.getTime() < Date.now()) {
      throw new UnauthorizedException("Le code de réinitialisation a expiré.");
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(newPass, salt);

    await this.usersService.updatePassword(user.id, passwordHash);

    return { success: true, message: 'Votre mot de passe a été réinitialisé avec succès.' };
  }
}
