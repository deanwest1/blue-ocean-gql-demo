import { Module } from '@nestjs/common';
import { PostModelService } from './post.model.service';
import { PostResolver } from './post.resolver';

@Module({
  providers: [PostResolver, PostModelService],
})
export class PostModule {}
