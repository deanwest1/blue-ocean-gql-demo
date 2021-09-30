import { Injectable, NotFoundException } from '@nestjs/common';
import { UserModelService } from '../resources/user/user.model.service';
import { compare } from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private userService: UserModelService) {}

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
}
