import { Component, Output, EventEmitter, Input } from '@angular/core';
import { User } from '../../../utils/interfaces/User';
import { ChatService } from '../../../utils/services/chat.service';
import { AuthService } from '../../../utils/services/auth.service';

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.scss']
})
export class UsersListComponent {
  authUser: User;
  usersList: User[];
  usersCount: number;
  @Output() userSelected: EventEmitter<User>;
  currentUserChat: User = null;

  constructor(
    private chatService: ChatService,
    private authService: AuthService
  ) {
    this.authService.currentUser.subscribe(
      (user: User) => (this.authUser = user)
    );
    this.chatService.currentUsersList.subscribe((users: User[]) => {
      this.usersList = users.filter(
        (user: User) => user.id !== this.authUser.id
      );
      this.usersCount = users.length;
    });
    this.userSelected = new EventEmitter<User>();
    this.userSelected.emit(null);
  }
}
