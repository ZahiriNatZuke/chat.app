import { Component, OnInit, Inject } from '@angular/core';
import { MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';

@Component({
  templateUrl: './public-toast.component.html',
  styleUrls: ['./public-toast.component.scss']
})
export class PublicToastComponent implements OnInit {

  constructor(@Inject(MAT_SNACK_BAR_DATA) public data: { from: string, message: string, date: Date }) { }

  ngOnInit(): void {
  }

}
