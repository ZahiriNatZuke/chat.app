import { Component, OnInit } from '@angular/core';
import { ChatService } from '../../../utils/services/chat.service';
import { Message } from '../../../utils/interfaces/message';

@Component({
  selector: 'app-chat-box',
  templateUrl: './chat-box.component.html',
  styleUrls: ['./chat-box.component.scss']
})
export class ChatBoxComponent implements OnInit {
  messageStack: Message[] = [];

  constructor(private chatService: ChatService) {}

  ngOnInit(): void {
    this.chatService.currentMessageStack.subscribe(
      (stack: Message[]) => (this.messageStack = stack)
    );
  }
}
