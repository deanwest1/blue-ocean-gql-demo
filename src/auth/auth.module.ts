import { Module, forwardRef } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserModule } from '../resources/user/user.module';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import { PostModule } from 'src/resources/post/post.module';

@Module({
  imports: [
    JwtModule.register({
      secret: 'secret', // Of course this is bad and you should never do this. See README
      signOptions: { expiresIn: '30m' },
    }),
    // forwardRef fixes circular dependencies
    forwardRef(() => UserModule),
    forwardRef(() => PostModule),
    PassportModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
