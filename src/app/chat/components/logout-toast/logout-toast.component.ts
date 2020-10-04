import { Component, OnInit, Inject } from '@angular/core';
import { MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';

@Component({
  templateUrl: './logout-toast.component.html',
  styleUrls: ['./logout-toast.component.scss']
})
export class LogoutToastComponent implements OnInit {

  constructor(@Inject(MAT_SNACK_BAR_DATA) public data: { message: string }) { }

  ngOnInit(): void {
  }

}
