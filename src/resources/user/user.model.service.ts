import { Injectable, BadRequestException } from '@nestjs/common';
import { SignUpInput } from './dto/sign-up.input';
import { UpdateUserInput } from './dto/update-user.input';
import { hash } from 'bcrypt';

@Injectable()
export class UserModelService {
  // This is obviously not ideal. In a production app, this state would be
  // be managed in a persisted data store like MongoDB, Postgres, etc. Beyond the
  // annoyance of data not being persisted here are numerous performance and architectural
  // disadvantages to this. See this repo's README for more details
  static users = [];

  async signUp(signUpInput: SignUpInput) {
    const isEmailAvailable = !this.findByEmail(signUpInput.email);
    if (!isEmailAvailable) {
      throw new BadRequestException(
        'A user is already registered with that email address',
      );
    }

    // Email address is available, so register the new user
    const { password, ...userDetails } = signUpInput;
    const hashedPassword = await hash(password, 10);
    const newUser = {
      ...userDetails,
      id: Date.now().toString(),
      password: hashedPassword,
    };
    UserModelService.users.push(newUser);
    return newUser;
  }

  findAll() {
    return UserModelService.users;
  }

  findById(id: string) {
    return UserModelService.users.find((post) => post.id === id);
  }

  findByEmail(email: string) {
    return UserModelService.users.find((user) => user.email === email);
  }

  findIndexById(id: string) {
    return UserModelService.users.findIndex((post) => post.id === id);
  }

  update({ id, ...updatedUserDetails }: UpdateUserInput) {
    const idx = this.findIndexById(id);
    if (idx === -1) {
      throw new BadRequestException(
        `Could not update user: No user found with id of ${id}`,
      );
    }
    UserModelService.users[idx] = {
      ...UserModelService.users[idx],
      ...updatedUserDetails,
    };
    return UserModelService.users[idx];
  }
}
