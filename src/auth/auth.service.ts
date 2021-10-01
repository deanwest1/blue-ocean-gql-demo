import { Injectable, NotFoundException } from '@nestjs/common';
import { UserModelService } from '../resources/user/user.model.service';
import { compare } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { PostModelService } from 'src/resources/post/post.model.service';

@Injectable()
export class AuthService {
  constructor(
    private userModelService: UserModelService,
    private postModelService: PostModelService,
    private jwtService: JwtService,
  ) {}

  // Validate that a user exists and that the correct password was provided.
  // This method uses the UserModelService to retrieve a user by email address
  // and then it compares the hashed input password with the hashed password stored for that user
  async validateUser(email: string, pass: string): Promise<unknown> {
    const user = this.userModelService.findByEmail(email);
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

  // Validate that a given user is the author of a given post
  async validateUserIsAuthor(email: string, postId: string) {
    const post = this.postModelService.findById(postId);
    if (!post) {
      throw new NotFoundException(`No post exists with ID ${postId}`);
    }
    return post.authorEmail === email;
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
