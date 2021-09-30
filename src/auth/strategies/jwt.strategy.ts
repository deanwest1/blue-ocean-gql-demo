import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'secret', // Of course this is bad and you should never do this. See README
    });
  }

  // JWT signing already handles validating the JWT, so we just return user data
  // Passport will populate request.user object from the value returned here
  // Then, we can use a custom decorator, @CurrentUser() to fetch the current user from req.user
  // for any further checks that may be required throughout the request lifecycle
  async validate(payload: any) {
    return { id: payload.sub, email: payload.email };
  }
}
