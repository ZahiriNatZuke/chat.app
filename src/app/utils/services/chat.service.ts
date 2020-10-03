import { Injectable } from '@angular/core';
import Echo from 'laravel-echo';
import { environment } from '../../../environments/environment.prod';
import { User } from '../interfaces/User';
import { BehaviorSubject, Observable } from 'rxjs';
import { ApiHelpers } from './api.helpers';
import { Message } from '../interfaces/message';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import { AuthService } from './auth.service';

const apiHelpers = new ApiHelpers();

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private currentUsersListSubject: BehaviorSubject<User[]>;
  public currentUsersList: Observable<User[]>;
  private currentMessageStackSubject: BehaviorSubject<Message[]>;
  public currentMessageStack: Observable<Message[]>;

  constructor(
    private httpClient: HttpClient,
    private dbService: NgxIndexedDBService,
    private authService: AuthService
  ) {
    this.currentUsersListSubject = new BehaviorSubject<User[]>([]);
    this.currentUsersList = this.currentUsersListSubject.asObservable();

    this.currentMessageStackSubject = new BehaviorSubject<Message[]>([]);
    this.currentMessageStack = this.currentMessageStackSubject.asObservable();

    this.catchDataFromIndexDB();
  }

  public get currentUserListValue(): User[] {
    return this.currentUsersListSubject.value;
  }

  public updateCurrentUserListValue(usersList: User[]): void {
    this.currentUsersListSubject.next(usersList);
  }

  public get currentMessageStackValue(): Message[] {
    return this.currentMessageStackSubject.value;
  }

  public updateMessageStackValue(messageStack: Message[]): void {
    this.currentMessageStackSubject.next(messageStack);
  }

  sendPublicMessage(message: string, socketId: string): Observable<any> {
    return this.httpClient.post(
      apiHelpers.getSendMessageURL(),
      { message },
      { headers: this.getHeaders(socketId) }
    );
  }

  sendDirectMessage(
    message: string,
    to: number,
    socketId: string
  ): Observable<any> {
    return this.httpClient.post(
      apiHelpers.getSendDirectMessageURL(),
      { message, to },
      { headers: this.getHeaders(socketId) }
    );
  }

  getEcho(): Echo {
    return new Echo({
      broadcaster: 'pusher',
      cluster: environment.PUSHER.PUSHER_APP_CLUSTER,
      key: environment.PUSHER.PUSHER_APP_KEY,
      wsHost: environment.PUSHER.PUSHER_WS_HOST,
      wsPort: environment.PUSHER.PUSHER_WS_PORT,
      enabledTransports: environment.PUSHER.PUSHER_ENABLED_TRANSPORTS,
      enableStats: false,
      forceTLS: false,
      authEndpoint: `${environment.PUSHER.PUSHER_APP_PATH}/api/broadcasting/auth`,
      auth: {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${localStorage.getItem('X-Auth-Token')}`
        }
      }
    });
  }

  getHeaders(socketId: string): HttpHeaders {
    return new HttpHeaders({
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'X-Requested-With': 'XMLHttpRequest',
      Authorization: `Bearer ${localStorage.getItem('X-Auth-Token')}`,
      'X-Socket-ID': socketId
    });
  }

  catchDataFromIndexDB(): void {
    this.dbService
      .getAll('public_message')
      .subscribe((pubMessages: Message[]) => {
        this.currentMessageStackSubject.next(pubMessages);
      });
  }
}
