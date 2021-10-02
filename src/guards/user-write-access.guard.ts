import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';
import { GqlExecutionContext } from '@nestjs/graphql';

// For protected operations like updating a user's profile,
// validate that the currently logged-in user is the owner of that user profile
@Injectable()
export class UserWriteAccessGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const ctx = GqlExecutionContext.create(context);
    const { id: inputUserId } = ctx.getArgs();
    const { id: loggedInUserId } = ctx.getContext().req.user;
    return inputUserId === loggedInUserId;
  }
}
