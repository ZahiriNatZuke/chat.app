import { Component, OnInit } from '@angular/core';
import { MatBottomSheetRef } from '@angular/material/bottom-sheet';

@Component({
  templateUrl: './options-sheet.component.html',
  styleUrls: ['./options-sheet.component.scss']
})
export class OptionsSheetComponent implements OnInit {

  constructor(private bottomSheetRef: MatBottomSheetRef<OptionsSheetComponent>) { }

  ngOnInit(): void {
  }

  openLink(event: MouseEvent, option: 'Answer' | 'Delete'): void {
    event.preventDefault();
    this.bottomSheetRef.dismiss({ option });
  }

}
