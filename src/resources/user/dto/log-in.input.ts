import { SignUpInput } from './sign-up.input';
export type LogInInput = Pick<SignUpInput, 'email' | 'password'>;
