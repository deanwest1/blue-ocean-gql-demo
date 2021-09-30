import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { UserModelService } from './user.model.service';
import { SignUpInput } from './dto/sign-up.input';
import { UpdateUserInput } from './dto/update-user.input';

@Resolver('User')
export class UserResolver {
  constructor(private readonly userModelService: UserModelService) {}

  @Mutation('signUp')
  signUp(@Args('signUpInput') signUpInput: SignUpInput) {
    return this.userModelService.signUp(signUpInput);
  }

  @Query('allUsers')
  findAll() {
    return this.userModelService.findAll();
  }

  @Query('user')
  findById(@Args('id') id: string) {
    return this.userModelService.findById(id);
  }

  @Mutation('updateUser')
  update(@Args('updateUserInput') updateUserInput: UpdateUserInput) {
    return this.userModelService.update(updateUserInput);
  }
}
