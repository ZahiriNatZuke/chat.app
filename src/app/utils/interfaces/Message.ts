export interface Message {
  webId?: number;
  hash: string; // PK
  message: string;
  from: string;
  me: boolean;
  date: Date;
  to?: string;
  chat?: string;
  reference?: Reference
}

export interface Reference {
  _message: string;
  _hash: string;
  _from: string;
}
