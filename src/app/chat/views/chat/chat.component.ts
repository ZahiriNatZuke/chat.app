import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  OnDestroy
} from '@angular/core';
import { ChatService } from '../../../utils/services/chat.service';
import { Message } from '../../../utils/interfaces/message';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import Echo from 'laravel-echo';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import { FormBuilder, FormControl } from '@angular/forms';
import { User } from '../../../utils/interfaces/User';
import { AuthService } from '../../../utils/services/auth.service';
import { PrivateToastComponent } from '../../components/private-toast/private-toast.component';
import { NotificationToastComponent } from '../../components/notification-toast/notification-toast.component';
import { PublicToastComponent } from '../../components/public-toast/public-toast.component';
import { scrollTo } from 'scroll-js';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit, OnDestroy {
  inputMessage = this.formBuilder.group({
    message: new FormControl(''),
    aws: new FormControl(false)
  });
  @ViewChild('chatBox') chatBox: ElementRef<HTMLDivElement>;
  authUser: User;
  echoPublic: Echo;
  echoPrivate: Echo;
  echoDelete: Echo;
  userDM: User;
  referenceMessage: Message = null;
  kindChatChange: 'chat' | 'message' = 'chat';

  constructor(
    private chatService: ChatService,
    private authService: AuthService,
    private snack: MatSnackBar,
    private router: Router,
    private dbService: NgxIndexedDBService,
    private formBuilder: FormBuilder
  ) {
    this.echoPublic = this.chatService.getEcho();
    this.echoPrivate = this.chatService.getEcho();
    this.echoDelete = this.chatService.getEcho();
    this.authService.currentUser.subscribe(
      (user: User) => (this.authUser = user)
    );
    this.chatService.currentMessageStack.subscribe(() =>
      setTimeout(() => {
        this.scrollToBottom(this.kindChatChange === 'chat' ? 'auto' : 'smooth');
        this.kindChatChange = "chat";
      }, 300)
    );
  }

  ngOnInit(): void {
    this.connectToPublicChatChannel();
    this.joinAndListenPublicChatChannel();
    this.connectToDirectMsgChannel();
    this.connectToDeleteMessageChannel();
  }

  connectToPublicChatChannel(): void {
    this.echoPublic.private('channel-chat').listen('ChatEvents', resp => {
      const pubMsg = {
        hash: resp.response.hash,
        message: resp.response.message,
        me: false,
        from: resp.response.from.name,
        date: resp.response.date,
        reference: {
          _message: resp.response.reference.message ?? null,
          _hash: resp.response.reference.hash ?? null,
          _from: resp.response.reference.from ?? null
        }
      };
      this.dbService.add('public_message', pubMsg);
      if (this.userDM === null) {
        const currentStack: Message[] = this.chatService
          .currentMessageStackValue;
        this.kindChatChange = 'message';
        this.chatService.updateMessageStackValue(currentStack.concat(pubMsg));
      } else {
        this.snack.openFromComponent(PublicToastComponent,
          {
            duration: 3000,
            horizontalPosition: 'end',
            verticalPosition: 'top',
            panelClass: ['p-0'],
            data: {
              from: resp.response.from.name,
              message: resp.response.message,
              date: resp.response.date
            }
          }
        );
      }
    });
  }

  joinAndListenPublicChatChannel(): void {
    this.echoPublic
      .join('channel-chat')
      .here((users: User[]) => {
        this.chatService.updateCurrentUserListValue(users);
      })
      .joining((inUser: User) => {
        const usersList: User[] = this.chatService.currentUserListValue;
        usersList.push(inUser);
        this.chatService.updateCurrentUserListValue(usersList);
      })
      .leaving((outUser: User) => {
        const usersList: User[] = this.chatService.currentUserListValue;
        const newUsersList = usersList.filter(
          (user: User) => user.id !== outUser.id
        );
        this.chatService.updateCurrentUserListValue(newUsersList);
      });
  }

  connectToDirectMsgChannel(): void {
    this.echoPrivate
      .private(`channel-direct.${this.authUser.id}`)
      .listen('DirectMessageEvents', resp => {
        const pvMsg = {
          hash: resp.response.hash,
          message: resp.response.message,
          me: false,
          to: 'Me',
          from: resp.response.from.name,
          date: resp.response.date,
          chat: `chat-${this.authUser.id}-${resp.response.from.id}`,
          reference: {
            _message: resp.response.reference.message ?? null,
            _hash: resp.response.reference.hash ?? null,
            _from: resp.response.reference.from ?? null
          }
        };
        this.dbService.add('private_message', pvMsg);
        if (this.userDM?.id === resp.response.from.id) {
          const currentStack: Message[] = this.chatService
            .currentMessageStackValue;
          this.kindChatChange = 'message';
          this.chatService.updateMessageStackValue(currentStack.concat(pvMsg));
        } else {
          this.snack.openFromComponent(PrivateToastComponent,
            {
              duration: 3000,
              horizontalPosition: 'end',
              verticalPosition: 'top',
              panelClass: ['p-0'],
              data: {
                from: resp.response.from.name,
                message: resp.response.message,
                date: resp.response.date
              }
            }
          );
        }
      });
  }

  connectToDeleteMessageChannel(): void {
    this.echoPublic.private('channel-delete').listen('DeleteMessageEvents', resp => {
      const data = resp.response;
      const scheme = data.channel === 'private' ? 'private_message' : 'public_message';
      this.dbService.getAllByIndex(scheme, 'hash', IDBKeyRange.only(data.hash))
        .subscribe(resp => {
          if (resp[0]) {
            this.dbService.delete(scheme, IDBKeyRange.only(resp[0].webId));
            this.catchUserSelected(this.userDM);
          }
        });
    });
  }

  catchUserSelected(user: User): void {
    this.userDM = user;
    if (this.userDM) {
      this.dbService
        .getAllByIndex(
          'private_message',
          'chat',
          IDBKeyRange.only(`chat-${this.authUser.id}-${this.userDM.id}`)
        )
        .subscribe((msgStack: Message[]) => {
          this.kindChatChange = 'chat';
          this.chatService.updateMessageStackValue(msgStack);
        });
    } else {
      this.dbService
        .getAll('public_message')
        .subscribe((pubMessages: Message[]) => {
          this.kindChatChange = 'chat';
          this.chatService.updateMessageStackValue(pubMessages);
        });
    }
  }

  sendMessage(): void {
    try {
      if (this.inputMessage.get('message').value.length > 0) {
        const msg: string = this.inputMessage.get('message').value;
        this.inputMessage.reset();
        this.userDM ? this.sendDirectMessage(msg) : this.sendPublicMessage(msg);
      }
    } catch (e) { }
  }

  sendPublicMessage(msg: string): void {
    if (this.inputMessage.get('aws') && this.referenceMessage) {
      const body = {
        message: msg,
        ref_hash: this.referenceMessage.hash,
        ref_message: this.referenceMessage.message,
        ref_from: this.referenceMessage.from
      }
      this.chatService
        .sendPublicMessage(body, this.echoPublic.socketId())
        .subscribe(resp => {
          const pubMsg = {
            hash: resp.hash,
            message: msg,
            me: true,
            from: 'Me',
            date: resp.date,
            reference: {
              _message: this.referenceMessage.message,
              _hash: this.referenceMessage.hash,
              _from: this.referenceMessage.from
            }
          };
          this.dbService.add('public_message', pubMsg);
          const currentStack: Message[] = this.chatService
            .currentMessageStackValue;
          this.kindChatChange = 'message';
          this.chatService.updateMessageStackValue(currentStack.concat(pubMsg));
          this.referenceMessage = null;
        });
    } else {
      this.chatService
        .sendPublicMessage({ message: msg }, this.echoPublic.socketId())
        .subscribe(resp => {
          const pubMsg = {
            hash: resp.hash,
            message: msg,
            me: true,
            from: 'Me',
            date: resp.date,
          };
          this.dbService.add('public_message', pubMsg);
          const currentStack: Message[] = this.chatService
            .currentMessageStackValue;
          this.kindChatChange = 'message';
          this.chatService.updateMessageStackValue(currentStack.concat(pubMsg));
          this.referenceMessage = null;
        });
    }
  }

  sendDirectMessage(msg: string): void {
    if (this.inputMessage.get('aws') && this.referenceMessage) {
      const body = {
        message: msg,
        to: this.userDM.id,
        ref_hash: this.referenceMessage.hash,
        ref_message: this.referenceMessage.message,
        ref_from: this.referenceMessage.from
      }
      this.chatService
        .sendDirectMessage(body, this.echoPrivate.socketId())
        .subscribe(resp => {
          const pvMsg = {
            hash: resp.hash,
            message: msg,
            me: true,
            to: this.userDM.name,
            from: 'Me',
            date: resp.date,
            chat: `chat-${this.authUser.id}-${this.userDM.id}`,
            reference: {
              _message: this.referenceMessage.message,
              _hash: this.referenceMessage.hash,
              _from: this.referenceMessage.from
            }
          };
          this.dbService.add('private_message', pvMsg);
          const currentStack: Message[] = this.chatService
            .currentMessageStackValue;
          this.kindChatChange = 'message';
          this.chatService.updateMessageStackValue(currentStack.concat(pvMsg));
          this.referenceMessage = null;
        });
    } else {
      this.chatService
        .sendDirectMessage({ message: msg, to: this.userDM.id }, this.echoPrivate.socketId())
        .subscribe(resp => {
          const pvMsg = {
            hash: resp.hash,
            message: msg,
            me: true,
            to: this.userDM.name,
            from: 'Me',
            date: resp.date,
            chat: `chat-${this.authUser.id}-${this.userDM.id}`,
          };
          this.dbService.add('private_message', pvMsg);
          const currentStack: Message[] = this.chatService
            .currentMessageStackValue;
          this.kindChatChange = 'message';
          this.chatService.updateMessageStackValue(currentStack.concat(pvMsg));
          this.referenceMessage = null;
        });
    }
  }

  logout(): void {
    this.authService.GetForLogout().subscribe(resp => {
      this.authService.updateCurrentUserValue(null);
      this.authService.updateCurrentTokenValue(null);
      this.router.navigate(['/auth/login']);
      this.snack.openFromComponent(NotificationToastComponent, {
        duration: 2000,
        verticalPosition: 'top',
        horizontalPosition: 'center',
        panelClass: ['p-0'],
        data: { message: resp.message }
      });
    });
  }

  catchOptionSelected(event: { option: string, message: Message }): void {
    if (event.option === 'Answer') {
      this.referenceMessage = event.message;
      this.inputMessage.patchValue({ aws: true });
    } else {
      this.chatService.deleteMessage(
        this.userDM ? 'private' : 'public',
        event.message.hash, this.echoDelete.socketId())
        .subscribe(resp => {
          const scheme = this.userDM ? 'private_message' : 'public_message';
          this.dbService.getAllByIndex(scheme, 'hash', IDBKeyRange.only(event.message.hash))
            .subscribe(res => {
              const msg = res[0];
              if (msg) {
                this.dbService.delete(scheme, IDBKeyRange.only(msg.webId));
                this.catchUserSelected(this.userDM);
              }
            });
          this.snack.openFromComponent(NotificationToastComponent, {
            duration: 2000,
            verticalPosition: 'bottom',
            horizontalPosition: 'center',
            panelClass: ['p-0'],
            data: { message: resp.status }
          });
        });
    }
  }

  scrollToBottom(behavior: 'smooth' | 'auto'): void {
    const scrollHeight = this.chatBox.nativeElement.scrollHeight;
    scrollTo(this.chatBox.nativeElement, {
      top: scrollHeight,
      behavior: behavior,
      duration: behavior === 'auto' ? 200 : 500,
      easing: behavior === 'auto' ? 'ease-in-out' : 'ease-in'
    });
  }

  closeReference(): void {
    this.referenceMessage = null;
  }

  ngOnDestroy(): void {
    this.echoPublic.disconnect();
    this.echoPrivate.disconnect();
    this.echoDelete.disconnect();
  }
}
