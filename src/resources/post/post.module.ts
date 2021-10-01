import { Module } from '@nestjs/common';
import { PostModelService } from './post.model.service';
import { PostResolver } from './post.resolver';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [AuthModule],
  providers: [PostResolver, PostModelService],
  exports: [PostModelService],
})
export class PostModule {}
