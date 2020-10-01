import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from '../interfaces/User';
import { HttpClient } from '@angular/common/http';
import { first } from 'rxjs/operators';
import { ApiHelpers } from './api.helpers';
import { BodyLogin } from '../interfaces/BodyLogin';
import { ResponseLogin } from '../interfaces/ResponseLogin';
import { RegisterBody } from '../interfaces/RegisterBody';

const apiHelpers = new ApiHelpers();

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject: BehaviorSubject<User>;
  public currentUser: Observable<User>;
  private currentTokenSubject: BehaviorSubject<string>;
  public currentToken: Observable<string>;

  constructor(private httpClient: HttpClient) {
    this.currentUserSubject = new BehaviorSubject<User>(
      localStorage.getItem('Auth-User') !== undefined
        ? JSON.parse(localStorage.getItem('Auth-User'))
        : null
    );
    this.currentTokenSubject = new BehaviorSubject<string>(
      localStorage.getItem('X-Auth-Token') !== undefined
        ? localStorage.getItem('X-Auth-Token')
        : null
    );
    this.currentUser = this.currentUserSubject.asObservable();
    this.currentToken = this.currentTokenSubject.asObservable();
  }

  public get currentUserValue(): User {
    return this.currentUserSubject.value;
  }

  public updateCurrentUserValue(user: User): void {
    localStorage.setItem('Auth-User', JSON.stringify(user));
    this.currentUserSubject.next(user);
  }

  public get currentTokenValue(): string {
    return this.currentTokenSubject.value;
  }

  public updateCurrentTokenValue(token: string): void {
    localStorage.setItem('X-Auth-Token', token);
    this.currentTokenSubject.next(token);
  }

  PostForRegister(body: RegisterBody): Observable<any> {
    return this.httpClient
      .post<any>(apiHelpers.getRegisterURL(), body, {
        headers: apiHelpers.getHeadersWithOutAuth()
      })
      .pipe(first());
  }

  PostForLogin(body: BodyLogin): Observable<ResponseLogin> {
    return this.httpClient
      .post<ResponseLogin>(apiHelpers.getLoginURL(), body, {
        headers: apiHelpers.getHeadersWithOutAuth()
      })
      .pipe(first());
  }

  GetForUserData(): Observable<any> {
    return this.httpClient
      .get<any>(apiHelpers.getUserURL(), {
        headers: apiHelpers.getHeadersWithAuth()
      })
      .pipe(first());
  }

  GetForLogout(): Observable<any> {
    return this.httpClient
      .get<any>(apiHelpers.getLogOutURL(), {
        headers: apiHelpers.getHeadersWithAuth()
      })
      .pipe(first());
  }

  checkAuthStatus(): boolean {
    return !!this.currentTokenValue && !!this.currentUserValue;
  }
}
