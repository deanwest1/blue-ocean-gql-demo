import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { UserModelService } from './user.model.service';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';

@Resolver('User')
export class UserResolver {
  constructor(private readonly userModelService: UserModelService) {}

  @Mutation('createUser')
  create(@Args('createUserInput') createUserInput: CreateUserInput) {
    return this.userModelService.create(createUserInput);
  }

  @Query('user')
  findAll() {
    return this.userModelService.findAll();
  }

  @Query('user')
  findOne(@Args('id') id: number) {
    return this.userModelService.findOne(id);
  }

  @Mutation('updateUser')
  update(@Args('updateUserInput') updateUserInput: UpdateUserInput) {
    return this.userModelService.update(updateUserInput.id, updateUserInput);
  }

  @Mutation('removeUser')
  remove(@Args('id') id: number) {
    return this.userModelService.remove(id);
  }
}
