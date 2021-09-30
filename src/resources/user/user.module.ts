import { Module } from '@nestjs/common';
import { UserModelService } from './user.model.service';
import { UserResolver } from './user.resolver';

@Module({
  providers: [UserResolver, UserModelService],
  exports: [UserModelService],
})
export class UserModule {}