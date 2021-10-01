import { Module, forwardRef } from '@nestjs/common';
import { PostModelService } from './post.model.service';
import { PostResolver } from './post.resolver';
import { AuthModule } from 'src/auth/auth.module';
import { UserModule } from '../user/user.module';

@Module({
  imports: [AuthModule, forwardRef(() => UserModule)],
  providers: [PostResolver, PostModelService],
  exports: [PostModelService],
})
export class PostModule {}
