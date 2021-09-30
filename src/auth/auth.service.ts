import { Injectable, NotFoundException } from '@nestjs/common';
import { UserModelService } from '../resources/user/user.model.service';
import { compare } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserModelService,
    private jwtService: JwtService,
  ) {}

  // Validate that a user exists and that the correct password was provided.
  // This method uses the UserModelService to retrieve a user by email address
  // and then it compares the hashed input password with the hashed password stored for that user
  async validateUser(email: string, pass: string): Promise<unknown> {
    const user = await this.userService.findByEmail(email);
    if (!user) {
      throw new NotFoundException(`Could not find user with email ${email}`);
    }
    const passwordsMatch = await compare(pass, user.password);
    if (user && passwordsMatch) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  // This method runs after passport-local strategy has already verified
  // email and password for a user. This method completes the login process
  // by signing an accessToken that contains user information
  async login(user) {
    const payload = { sub: user.id, email: user.email };
    return {
      accessToken: this.jwtService.sign(payload),
    };
  }
}
