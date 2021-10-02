import {
  Resolver,
  Query,
  Mutation,
  Args,
  Parent,
  ResolveField,
} from '@nestjs/graphql';
import { UserModelService } from './user.model.service';
import { SignUpInput } from './dto/sign-up.input';
import { LogInInput } from './dto/log-in.input';
import { UpdateUserInput } from './dto/update-user.input';
import axios from 'axios';
import { PostModelService } from '../post/post.model.service';
import {
  UseGuards,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { GqlJwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { UserWriteAccessGuard } from 'src/guards/user-write-access.guard';
import { CurrentUser } from 'src/decorators/current-user.decorator';

@Resolver('User')
export class UserResolver {
  constructor(
    private readonly userModelService: UserModelService,
    private readonly postModelService: PostModelService,
  ) {}

  @Mutation('signUp')
  signUp(@Args('signUpInput') signUpInput: SignUpInput) {
    return this.userModelService.signUp(signUpInput);
  }

  // This login mutation acts as a proxy for a REST endpoint that performs the login
  // This is only done to make logging in more convenient through the GraphiQL UI
  // If our application had a front-end, we wouldn't need to bother with doing this.
  // See README for details
  @Mutation('login')
  async login(@Args('loginInput') loginInput: LogInInput) {
    try {
      const { data: loginResults } = await axios.post(
        'http://localhost:3000/auth/login',
        loginInput,
      );
      return loginResults;
    } catch (err) {
      if (err.response.status === 404) {
        throw new NotFoundException('No user found with that email address');
      }
      throw new BadRequestException('Invalid email/password combination');
    }
  }

  @Query('allUsers')
  findAll() {
    return this.userModelService.findAll();
  }

  @Query('user')
  findById(@Args('id') id: string) {
    return this.userModelService.findById(id);
  }

  @ResolveField('posts')
  getPosts(@Parent() user) {
    // We are not solving the GraphQL n+1 problem here
    return this.postModelService.findByAuthorId(user.id);
  }

  @ResolveField('followers')
  getFollowers(@Parent() user) {
    // We are not solving the GraphQL n+1 problem here
    return user.followers.map((email) =>
      this.userModelService.findByEmail(email),
    );
  }

  @ResolveField('following')
  getFollowing(@Parent() user) {
    // We are not solving the GraphQL n+1 problem here
    return user.following.map((email) =>
      this.userModelService.findByEmail(email),
    );
  }

  @Mutation('updateUser')
  @UseGuards(GqlJwtAuthGuard, UserWriteAccessGuard)
  update(
    @Args('id') id: string,
    @Args('updateUserInput') updateUserInput: UpdateUserInput,
  ) {
    return this.userModelService.update(id, updateUserInput);
  }

  @Mutation('followUser')
  @UseGuards(GqlJwtAuthGuard)
  follow(@Args('email') userToFollowEmail: string, @CurrentUser() user: any) {
    const currentUserEmail = user.email;
    if (userToFollowEmail === currentUserEmail) {
      throw new BadRequestException(`You can't follow yourself.`);
    }
    return this.userModelService.followUser(
      userToFollowEmail,
      currentUserEmail,
    );
  }
}
