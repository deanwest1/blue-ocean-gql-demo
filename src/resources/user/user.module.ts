import { Module, forwardRef } from '@nestjs/common';
import { UserModelService } from './user.model.service';
import { UserResolver } from './user.resolver';
import { PostModule } from '../post/post.module';

@Module({
  imports: [PostModule],
  providers: [UserResolver, UserModelService],
  exports: [UserModelService],
})
export class UserModule {}
