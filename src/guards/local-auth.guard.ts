import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

// AuthGuard is a Passport guard. This guard will implement
// the passport-local strategy and any operation that uses this guard
// will automatically kick off the passport-local strategy flow
@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {}
