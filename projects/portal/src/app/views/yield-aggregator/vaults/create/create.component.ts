import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'view-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css'],
})
export class CreateComponent implements OnInit {
  firstStrategy = { id: '', distRate: 0 };
  strategies: { id: string; distRate: number }[] = [];

  constructor() {}

  ngOnInit(): void {}

  onClickAddStrategy() {
    this.strategies.push({ id: '', distRate: 0 });
  }
}
