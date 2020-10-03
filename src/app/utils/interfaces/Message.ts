export interface Message {
  message: string;
  me?: boolean;
  from?: string;
  to?: string;
  date?: Date;
  chat?: string;
}
