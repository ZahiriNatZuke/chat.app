import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ChatRoutingModule } from './chat-routing.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ChatComponent } from './views/chat/chat.component';
import { UsersListComponent } from './components/users-list/users-list.component';
import { ChatBoxComponent } from './components/chat-box/chat-box.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { TextFieldModule } from '@angular/cdk/text-field';
import { MatDividerModule } from '@angular/material/divider';

@NgModule({
  declarations: [ChatComponent, UsersListComponent, ChatBoxComponent],
  imports: [
    CommonModule,
    ChatRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    MatSnackBarModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    TextFieldModule,
    MatDividerModule
  ]
})
export class ChatModule {}
