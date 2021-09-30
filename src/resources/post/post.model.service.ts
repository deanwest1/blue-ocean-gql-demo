import { Injectable, BadRequestException } from '@nestjs/common';
import { UpdatePostInput } from './dto/update-post.input';

@Injectable()
export class PostModelService {
  // This is obviously not ideal. In a production app, this state would be
  // be managed in a persisted data store like MongoDB, Postgres, etc. Beyond the
  // annoyance of data not being persisted here are numerous performance and architectural
  // disadvantages to this. See this repo's README for more details
  static posts = [];

  create(body: string) {
    const createdAt = new Date().toISOString();
    const newPost = {
      body,
      id: Date.now().toString(),
      createdAt,
      updatedAt: createdAt,
    };
    PostModelService.posts.push(newPost);
    return newPost;
  }

  findAll() {
    return PostModelService.posts;
  }

  findById(id: string) {
    return PostModelService.posts.find((post) => post.id === id);
  }

  findIndexById(id: string) {
    return PostModelService.posts.findIndex((post) => post.id === id);
  }

  update({ id, body }: UpdatePostInput) {
    const idx = this.findIndexById(id);
    if (idx === -1) {
      throw new BadRequestException(
        `Could not update post: No post found with id of ${id}`,
      );
    }
    PostModelService.posts[idx] = {
      ...PostModelService.posts[idx],
      updatedAt: new Date().toISOString(),
      body,
    };
    return PostModelService.posts[idx];
  }

  remove(id: string) {
    const idx = this.findIndexById(id);
    if (idx === -1) {
      throw new BadRequestException(
        `Could not remove post: No post found with id of ${id}`,
      );
    }
    return PostModelService.posts.splice(idx, 1)[0];
  }
}