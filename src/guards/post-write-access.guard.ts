import {
  Injectable,
  CanActivate,
  ExecutionContext,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AuthService } from '../auth/auth.service';

// For protected operations like editing or removing a post,
// validate that the currently logged-in user is the author of the post
// that he/she is attempting to modify
@Injectable()
export class PostWriteAccessGuard implements CanActivate {
  constructor(
    @Inject(forwardRef(() => AuthService)) private authService: AuthService,
  ) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const ctx = GqlExecutionContext.create(context);
    const { id: postId } = ctx.getArgs();
    const { id: userId } = ctx.getContext().req.user;
    return this.authService.validateUserIsAuthor(userId, postId);
  }
}
