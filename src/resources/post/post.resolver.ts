import {
  Resolver,
  Query,
  Mutation,
  Args,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
import { PostModelService } from './post.model.service';
import { UseGuards } from '@nestjs/common';
import { GqlJwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { PostWriteAccessGuard } from 'src/guards/post-write-access.guard';
import { CurrentUser } from 'src/decorators/current-user.decorator';
import { UserModelService } from '../user/user.model.service';

@Resolver('Post')
export class PostResolver {
  constructor(
    private readonly postModelService: PostModelService,
    private readonly userModelService: UserModelService,
  ) {}

  @Mutation('createPost')
  @UseGuards(GqlJwtAuthGuard)
  create(
    @Args('body') body: string,
    @CurrentUser() user: { id: string; email: string },
  ) {
    return this.postModelService.create(body, user.id);
  }

  @Query('allPosts')
  findAll() {
    return this.postModelService.findAll();
  }

  @Query('post')
  findById(@Args('id') id: string) {
    return this.postModelService.findById(id);
  }

  @ResolveField('author')
  getAuthorOfPost(@Parent() post) {
    // We are not solving the GraphQL n+1 problem here.
    // See the notes in the field resolvers for the user entity for more details.
    return this.userModelService.findById(post.authorId);
  }

  @Mutation('updatePost')
  @UseGuards(GqlJwtAuthGuard, PostWriteAccessGuard)
  update(@Args('id') id: string, @Args('body') body: string) {
    return this.postModelService.update({ id, body });
  }

  @Mutation('removePost')
  @UseGuards(GqlJwtAuthGuard, PostWriteAccessGuard)
  remove(@Args('id') id: string) {
    return this.postModelService.remove(id);
  }
}
