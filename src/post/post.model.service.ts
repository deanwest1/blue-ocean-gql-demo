import { Injectable } from '@nestjs/common';
import { CreatePostInput } from './dto/create-post.input';
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

  findOne(id: number) {
    return `This action returns a #${id} post`;
  }

  update(id: number, updatePostInput: UpdatePostInput) {
    return `This action updates a #${id} post`;
  }

  remove(id: number) {
    return `This action removes a #${id} post`;
  }
}
