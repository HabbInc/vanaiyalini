import { Controller, Get, Patch, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly users: UsersService) {}

  @Get('ping')
  ping() {
    return { message: 'Users module is working' };
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  me(@Req() req: any) {
    return req.user; // { userId, roles } from JwtStrategy.validate()
  }

  // ✅ Become seller
  @UseGuards(JwtAuthGuard)
  @Patch('become-seller')
  async becomeSeller(@Req() req: any) {
    const userId = req.user.userId;
    return this.users.addRole(userId, 'seller');
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  profile(@Req() req: any) {
    return this.users.findByIdSafe(req.user.userId);
  }

}
