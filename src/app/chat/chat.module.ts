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
import { NgxIndexedDBModule, DBConfig } from 'ngx-indexed-db';
import { ChatService } from '../utils/services/chat.service';
import { DateChatPipe } from '../utils/pipes/date-chat.pipe';
import { AgoDatePipe } from '../utils/pipes/ago-date.pipe';

const dbConfig: DBConfig = {
  name: 'Chat.DB',
  version: 3,
  objectStoresMeta: [
    {
      store: 'private_message',
      storeConfig: { keyPath: 'webId', autoIncrement: true },
      storeSchema: [
        { name: 'message', keypath: 'message', options: { unique: false } },
        { name: 'from', keypath: 'from', options: { unique: false } },
        { name: 'to', keypath: 'to', options: { unique: false } },
        { name: 'date', keypath: 'date', options: { unique: false } },
        { name: 'me', keypath: 'me', options: { unique: false } },
        { name: 'chat', keypath: 'chat', options: { unique: false } }
      ]
    },
    {
      store: 'public_message',
      storeConfig: { keyPath: 'webId', autoIncrement: true },
      storeSchema: [
        { name: 'message', keypath: 'message', options: { unique: false } },
        { name: 'from', keypath: 'from', options: { unique: false } },
        { name: 'date', keypath: 'date', options: { unique: false } },
        { name: 'me', keypath: 'me', options: { unique: false } }
      ]
    }
  ]
};

@NgModule({
  declarations: [ChatComponent, UsersListComponent, ChatBoxComponent, DateChatPipe, AgoDatePipe],
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
    MatDividerModule,
    NgxIndexedDBModule.forRoot(dbConfig)
  ],
  providers: [ChatService]
})
export class ChatModule {}
