import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { PostModelService } from './post.model.service';
import { CreatePostInput } from './dto/create-post.input';
import { UpdatePostInput } from './dto/update-post.input';
import { UseGuards } from '@nestjs/common';
import { GqlJwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { PostWriteAccessGuard } from 'src/guards/post-write-access.guard';
import { CurrentUser } from 'src/decorators/current-user.decorator';

@Resolver('Post')
export class PostResolver {
  constructor(private readonly postModelService: PostModelService) {}

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
