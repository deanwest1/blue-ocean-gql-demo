import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
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
    const now = new Date();
    const newUser = {
      ...userDetails,
      id: now.getTime().toString(),
      signUpDate: now.toISOString(),
      password: hashedPassword,
      followers: [],
      following: [],
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

  update(id: string, updateUserInput: UpdateUserInput) {
    const idx = this.findIndexById(id);
    if (idx === -1) {
      throw new NotFoundException(
        `Could not update user: No user found with id of ${id}`,
      );
    }
    UserModelService.users[idx] = {
      ...UserModelService.users[idx],
      ...updateUserInput,
    };
    return UserModelService.users[idx];
  }

  followUser(userToFollowEmail: string, currentUserEmail: string) {
    const currentUser = this.findByEmail(currentUserEmail);
    const userToFollow = this.findByEmail(userToFollowEmail);
    if (!userToFollow) {
      throw new NotFoundException(
        `Could not follow user: No user found with email of ${userToFollowEmail}`,
      );
    }
    const isAlreadyFollowing = currentUser.following.find(
      (email) => email === userToFollowEmail,
    );
    if (isAlreadyFollowing) {
      throw new BadRequestException(
        `You're already following ${userToFollowEmail}`,
      );
    }
    currentUser.following.push(userToFollowEmail);
    userToFollow.followers.push(currentUserEmail);
    return userToFollow;
  }
}
