import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

// Allow us to fetch the value of req.user from a param decorator
// req.user will only be populated (by Passport) if the user can be
// authenticated (e.g. a valid JWT is provided)
export const CurrentUser = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    const ctx = GqlExecutionContext.create(context);
    return ctx.getContext().req.user;
  },
);
