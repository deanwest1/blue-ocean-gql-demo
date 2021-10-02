import { GqlExecutionContext } from '@nestjs/graphql';
import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

// AuthGuard is a Passport guard. This guard will implement
// the passport-jwt strategy and any operation that uses this guard
// will automatically kick off the passport-jwt strategy flow
@Injectable()
export class GqlJwtAuthGuard extends AuthGuard('jwt') {
  // Override the getRequest() method of AuthGuard so that our guard
  // has access to the request object
  getRequest(context: ExecutionContext) {
    const ctx = GqlExecutionContext.create(context);
    return ctx.getContext().req;
  }
}
