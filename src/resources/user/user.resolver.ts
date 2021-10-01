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
    const { data: loginResults } = await axios.post(
      'http://localhost:3000/auth/login',
      loginInput,
    );
    return loginResults;
  }

  @Query('allUsers')
  findAll() {
    return this.userModelService.findAll();
  }

  @Query('user')
  findById(@Args('id') id: string) {
    return this.userModelService.findById(id);
  }

  @ResolveField()
  posts(@Parent() user) {
    return this.postModelService.findByAuthorId(user.id);
  }

  @Mutation('updateUser')
  update(@Args('updateUserInput') updateUserInput: UpdateUserInput) {
    return this.userModelService.update(updateUserInput);
  }
}
