import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly users: UsersService,
    private readonly jwt: JwtService,
  ) {}

  async register(name: string, email: string, password: string) {
    const existing = await this.users.findByEmail(email);
    if (existing) throw new BadRequestException('Email already registered');

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await this.users.createUser({ name, email, passwordHash });

    const tokens = await this.issueTokens(user._id.toString(), user.roles);

    return {
      user: { id: user._id, name: user.name, email: user.email, roles: user.roles },
      ...tokens,
    };
  }

  async login(email: string, password: string) {
    const user = await this.users.findByEmail(email);
    if (!user) throw new BadRequestException('Invalid email or password');

    if (user.status === 'blocked') throw new ForbiddenException('User is blocked');

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) throw new BadRequestException('Invalid email or password');

    const tokens = await this.issueTokens(user._id.toString(), user.roles);

    return {
      user: { id: user._id, name: user.name, email: user.email, roles: user.roles },
      ...tokens,
    };
  }

  private async issueTokens(userId: string, roles: string[]) {
    const accessToken = await this.jwt.signAsync(
      { sub: userId, roles },
      { secret: process.env.JWT_SECRET, expiresIn: '15m' },
    );

    const refreshToken = await this.jwt.signAsync(
      { sub: userId },
      { secret: process.env.JWT_REFRESH_SECRET, expiresIn: '7d' },
    );

    return { accessToken, refreshToken };
  }
}
