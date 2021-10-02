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
    // We are not solving the GraphQL n+1 problem here. If you query allUsers,
    // for x number of users, you will run the below function, which itself is O(n) time complexity
    // because it needs to search the entire user array. In a real application,
    // you would want to use a tool like DataLoader to batch these operations, so instead of saying,
    // "For every single user in our system, we need to find all of their posts" O(n^2), we would say,
    // "I want all the posts that belong to users in this list" (as a single call)
    // Overall, the combination of using DataLoader, a key/val storage as opposed to arrays,
    // database indexes and other built-in database optimizations would significantly increase performance here.
    return this.postModelService.findByAuthorId(user.id);
  }

  @ResolveField('followers')
  getFollowers(@Parent() user) {
    // We are _really_ _really_ not solving the GraphQL n+1 problem here
    // So if you query allUsers, for x number of users, we run findByEmail()
    // y number of times (once for each follower), and each call to findByEmail()
    // in and of itself is already O(n) time complexity because it has to search the entire array.
    // In a real application, you'd want to batch these operations as much as possible.
    // For example, instead of mapping through the user.followers array one at a time and calling
    // findByEmail for each follower, you could batch this call to say,
    // "I want all of the users who have an email address that's in this list", which could
    // be achieved in a single function call, making the call below O(n) instead of O(n^2)
    return user.followers.map((email) =>
      this.userModelService.findByEmail(email),
    );
  }

  @ResolveField('following')
  getFollowing(@Parent() user) {
    // See notes above about the n + 1 problem
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
      throw new BadRequestException(
        `You can't follow yourself. Sorry about that!`,
      );
    }
    return this.userModelService.followUser(
      userToFollowEmail,
      currentUserEmail,
    );
  }
}
