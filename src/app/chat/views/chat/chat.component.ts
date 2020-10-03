import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  OnDestroy
} from '@angular/core';
import { ChatService } from '../../../utils/services/chat.service';
import { Message } from '../../../utils/interfaces/message';
import { User } from 'src/app/utils/interfaces/User';
import { AuthService } from 'src/app/utils/services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import Echo from 'laravel-echo';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import * as moment from 'moment';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit, OnDestroy {
  inputMessage = '';
  @ViewChild('chatBox') chatBox: ElementRef<HTMLDivElement>;
  authUser: User;
  echoPublic: Echo;
  echoPrivate: Echo;
  userDM: User;
  lastInteraction: string;

  constructor(
    private chatService: ChatService,
    private authService: AuthService,
    private snack: MatSnackBar,
    private router: Router,
    private dbService: NgxIndexedDBService
  ) {
    this.echoPublic = this.chatService.getEcho();
    this.echoPrivate = this.chatService.getEcho();
    this.authService.currentUser.subscribe(
      (user: User) => (this.authUser = user)
    );
    this.chatService.currentMessageStack.subscribe(() =>
      setTimeout(() => this.scrollToBottom(), 300)
    );
  }

  ngOnInit(): void {
    this.connectToPublicChatChannel();
    this.joinAndListenPublicChatChannel();
    this.connectToDirectMsgChannel();
  }

  connectToPublicChatChannel(): void {
    this.echoPublic.private('channel-chat').listen('ChatEvents', resp => {
      const pubMsg = {
        message: resp.message,
        me: false,
        from: resp.from,
        date: resp.date
      };
      this.dbService.add('public_message', pubMsg);
      if (this.userDM === null) {
        const currentStack: Message[] = this.chatService
          .currentMessageStackValue;
        this.chatService.updateMessageStackValue(currentStack.concat(pubMsg));
      } else {
        this.snack.open('Public Group', `${resp.from}: ${resp.message}`, {
          duration: 4500,
          horizontalPosition: 'end',
          verticalPosition: 'top'
        });
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
          message: resp.response.message,
          me: false,
          to: 'Me',
          from: resp.response.from.name,
          date: resp.response.date,
          chat: `chat-${this.authUser.id}-${resp.response.from.id}`
        };
        this.dbService.add('private_message', pvMsg);
        if (this.userDM?.id === resp.response.from.id) {
          const currentStack: Message[] = this.chatService
            .currentMessageStackValue;
          this.chatService.updateMessageStackValue(currentStack.concat(pvMsg));
        } else {
          this.snack.open(
            `from: ${resp.response.from.name}`,
            resp.response.message,
            {
              duration: 4500,
              horizontalPosition: 'end',
              verticalPosition: 'top'
            }
          );
        }
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
          this.chatService.updateMessageStackValue(msgStack);
        });
    } else {
      this.dbService
        .getAll('public_message')
        .subscribe((pubMessages: Message[]) => {
          this.chatService.updateMessageStackValue(pubMessages);
        });
    }
  }

  sendMessage(): void {
    if (this.inputMessage.length > 0) {
      this.userDM ? this.sendDirectMessage() : this.sendPublicMessage();
    }
  }

  sendPublicMessage(): void {
    this.chatService
      .sendPublicMessage(this.inputMessage, this.echoPublic.socketId())
      .subscribe(resp => {
        this.lastInteraction = moment(resp.date.date).fromNow();
        const pubMsg = {
          message: this.inputMessage,
          me: true,
          from: 'Me',
          date: resp.date
        };
        this.dbService.add('public_message', pubMsg);
        const currentStack: Message[] = this.chatService
          .currentMessageStackValue;
        this.chatService.updateMessageStackValue(currentStack.concat(pubMsg));
        this.inputMessage = '';
      });
  }

  sendDirectMessage(): void {
    this.chatService
      .sendDirectMessage(
        this.inputMessage,
        this.userDM.id,
        this.echoPrivate.socketId()
      )
      .subscribe(resp => {
        const pvMsg = {
          message: this.inputMessage,
          me: true,
          to: this.userDM.name,
          from: 'Me',
          date: resp.date,
          chat: `chat-${this.authUser.id}-${this.userDM.id}`
        };
        this.dbService.add('private_message', pvMsg);
        const currentStack: Message[] = this.chatService
          .currentMessageStackValue;
        this.chatService.updateMessageStackValue(currentStack.concat(pvMsg));
        this.inputMessage = '';
      });
  }

  logout(): void {
    this.authService.GetForLogout().subscribe(res => {
      this.authService.updateCurrentUserValue(null);
      this.authService.updateCurrentTokenValue(null);
      this.router.navigate(['/auth/login']);
      this.snack.open(res.message, '', {
        duration: 2000,
        verticalPosition: 'top',
        horizontalPosition: 'center'
      });
    });
  }

  scrollToBottom(): void {
    const newTop = this.chatBox.nativeElement.scrollHeight;
    this.chatBox.nativeElement.scroll({
      behavior: 'auto',
      top: newTop
    });
  }

  ngOnDestroy(): void {
    this.echoPublic.disconnect();
    this.echoPrivate.disconnect();
  }
}
