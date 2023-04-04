import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'view-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css'],
})
export class CreateComponent implements OnInit {
  commissionRate?: number;

  constructor() {}

  ngOnInit(): void {}
}
