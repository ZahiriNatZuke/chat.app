import { User } from './User';

export interface ResponseLogin {
  user: User;
  token: string;
}
