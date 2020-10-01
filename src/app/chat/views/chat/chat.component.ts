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

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit, OnDestroy {
  inputMessage = '';
  @ViewChild('chatBox') chatBox: ElementRef<HTMLDivElement>;
  authUser: User;
  echo: Echo;

  constructor(
    private chatService: ChatService,
    private authService: AuthService,
    private snack: MatSnackBar,
    private router: Router
  ) {
    this.echo = this.chatService.getEcho();
    this.authService.currentUser.subscribe(
      (user: User) => (this.authUser = user)
    );
  }

  ngOnInit(): void {
    this.connectChatChannel();
    this.joinAndListenChatChannel();
  }

  sendMessage(): void {
    if (this.inputMessage.length > 0) {
      this.chatService
        .sendMessage(this.inputMessage, this.echo.socketId())
        .subscribe(() => {
          const currentStack: Message[] = this.chatService
            .currentMessageStackValue;
          this.chatService.updateMessageStackValue(
            currentStack.concat({
              message: this.inputMessage,
              me: true,
              from: 'Me'
            })
          );
          this.inputMessage = '';
          this.scrollToBottom();
        });
    }
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
      behavior: 'smooth',
      top: newTop
    });
  }

  connectChatChannel(): void {
    this.echo.private('channel-chat').listen('ChatEvents', resp => {
      const currentStack: Message[] = this.chatService.currentMessageStackValue;
      this.chatService.updateMessageStackValue(
        currentStack.concat({
          message: resp.message,
          me: false,
          from: resp.from
        })
      );
    });
  }

  joinAndListenChatChannel(): void {
    this.echo
      .join('channel-chat')
      .here((users: User[]) => {
        // console.log(users);
        this.chatService.updateCurrentUserListValue(users);
      })
      .joining((inUser: User) => {
        // console.log(inUser);
        const usersList: User[] = this.chatService.currentUserListValue;
        usersList.push(inUser);
        this.chatService.updateCurrentUserListValue(usersList);
      })
      .leaving((outUser: User) => {
        // console.log(outUser);
        const usersList: User[] = this.chatService.currentUserListValue;
        const newUsersList = usersList.filter(
          (user: User) => user.id !== outUser.id
        );
        this.chatService.updateCurrentUserListValue(newUsersList);
      });
  }

  ngOnDestroy(): void {
    this.echo.disconnect();
  }
}
