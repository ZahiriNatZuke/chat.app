import { Component, OnInit, OnDestroy } from '@angular/core';
import { User } from '../../../utils/interfaces/User';
import { ChatService } from '../../../utils/services/chat.service';
import { AuthService } from '../../../utils/services/auth.service';
import Echo from 'laravel-echo';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.scss']
})
export class UsersListComponent implements OnInit, OnDestroy {
  echo: Echo;
  authUser: User;
  usersList: User[];
  showM = false;
  userDM: User;
  messageDM: string;

  constructor(
    private chatService: ChatService,
    private authService: AuthService,
    private snack: MatSnackBar
  ) {
    this.authService.currentUser.subscribe(
      (user: User) => (this.authUser = user)
    );
    this.echo = this.chatService.getEcho();
    this.chatService.currentUsersList.subscribe((users: User[]) => {
      const realUsersList = users.filter(
        (user: User) => user.id !== this.authUser.id
      );
      this.usersList = realUsersList;
    });
  }

  ngOnInit(): void {
    this.connectToDirectMsgChannel();
  }

  showModal(user: User): void {
    this.userDM = user;
    this.showM = true;
  }

  closeModal(): void {
    this.showM = false;
  }

  sendDirectMessage(): void {
    this.closeModal();
    this.chatService
      .sendDirectMessage(this.messageDM, this.userDM.id, this.echo.socketId())
      .subscribe(() => (this.messageDM = ''));
  }

  connectToDirectMsgChannel(): void {
    this.echo
      .private(`channel-direct.${this.authUser.id}`)
      .listen('DirectMessageEvents', res => {
        this.snack.open(
          `from: ${res.response.from.name}`,
          res.response.message,
          {
            duration: 4500,
            horizontalPosition: 'end',
            verticalPosition: 'top'
          }
        );
      });
  }

  ngOnDestroy(): void {
    this.echo.disconnect();
  }
}
