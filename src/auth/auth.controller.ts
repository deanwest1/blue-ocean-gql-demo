import { Controller, Request, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from '../guards/local-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  // The LocalAuthGuard will automatically trigger the passport-local
  // strategy flow, which is defined in stragies/local.strategy.ts
  // passport-local reads credentials from a simple JSON payload in req.body,
  // so a REST endpoint is required to use this strategy
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req) {
    // If this code was even reached, then the user successfully logged in.
    // We can then sign and return a JWT accessToken to the user
    return req.user;
  }
}
