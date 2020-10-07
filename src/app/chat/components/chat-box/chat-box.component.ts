import { Component, Output, EventEmitter } from '@angular/core';
import { ChatService } from '../../../utils/services/chat.service';
import { Message } from '../../../utils/interfaces/message';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { OptionsSheetComponent } from '../options-sheet/options-sheet.component';

@Component({
  selector: 'app-chat-box',
  templateUrl: './chat-box.component.html',
  styleUrls: ['./chat-box.component.scss']
})
export class ChatBoxComponent {
  messageStack: Message[] = [];
  @Output() optionSelected: EventEmitter<{ option: string, message: Message }>;

  constructor(private chatService: ChatService,
    private bottomSheet: MatBottomSheet
  ) {
    this.chatService.currentMessageStack.subscribe(
      (stack: Message[]) => (this.messageStack = stack)
    );
    this.optionSelected = new EventEmitter<{ option: string, message: Message }>();
  }

  openOptionsSheet(event: MouseEvent, message: Message): void {
    event.preventDefault();
    const bottomSheet = this.bottomSheet.open(OptionsSheetComponent);
    bottomSheet.afterDismissed().subscribe(dismiss => {
      if (dismiss)
        this.optionSelected.emit({ option: dismiss.option, message });
    });
  }
}
