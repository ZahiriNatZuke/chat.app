import { HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment.prod';

export class ApiHelpers {
  public URL_API: string;
  public URL_BASE: string;

  constructor() {
    this.URL_BASE = environment.URLS.URL_BASE;
    this.URL_API = environment.URLS.URL_API;
  }

  getRegisterURL(): string {
    return this.URL_API + '/auth/register';
  }

  getLoginURL(): string {
    return this.URL_API + '/auth/login';
  }

  getLogOutURL(): string {
    return this.URL_API + '/auth/logout';
  }

  getUserURL(): string {
    return this.URL_API + '/auth/user';
  }

  getSendMessageURL(): string {
    return this.URL_API + '/message/send';
  }

  getSendDirectMessageURL(): string {
    return this.URL_API + '/message/send-direct-msg';
  }

  getHeadersWithOutAuth(): HttpHeaders {
    return new HttpHeaders({
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'X-Requested-With': 'XMLHttpRequest'
    });
  }

  getHeadersWithAuth(): HttpHeaders {
    return new HttpHeaders({
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'X-Requested-With': 'XMLHttpRequest',
      Authorization: `Bearer ${localStorage.getItem('X-Auth-Token')}`
    });
  }
}
