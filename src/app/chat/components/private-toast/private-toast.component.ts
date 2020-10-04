import { Component, OnInit, Inject } from '@angular/core';
import { MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';

@Component({
  templateUrl: './private-toast.component.html',
  styleUrls: ['./private-toast.component.scss']
})
export class PrivateToastComponent implements OnInit {

  constructor(@Inject(MAT_SNACK_BAR_DATA) public data: { from: string, message: string, date: Date }) { }

  ngOnInit(): void {
  }

}
