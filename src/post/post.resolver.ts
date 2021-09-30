import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { PostModelService } from './post.model.service';
import { CreatePostInput } from './dto/create-post.input';
import { UpdatePostInput } from './dto/update-post.input';

@Resolver('Post')
export class PostResolver {
  constructor(private readonly postModelService: PostModelService) {}

  @Mutation('createPost')
  create(@Args('body') body: string) {
    return this.postModelService.create(body);
  }

  @Query('allPosts')
  findAll() {
    return this.postModelService.findAll();
  }

  @Query('post')
  findOne(@Args('id') id: number) {
    return this.postModelService.findOne(id);
  }

  @Mutation('updatePost')
  update(@Args('updatePostInput') updatePostInput: UpdatePostInput) {
    return this.postModelService.update(updatePostInput.id, updatePostInput);
  }

  @Mutation('removePost')
  remove(@Args('id') id: number) {
    return this.postModelService.remove(id);
  }
}
