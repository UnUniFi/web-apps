import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'view-edit-validator-simple',
  templateUrl: './edit-validator-simple.component.html',
  styleUrls: ['./edit-validator-simple.component.css'],
})
export class ViewEditValidatorSimpleComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}

  onChangeFile($event: Event) {
    console.log('change file');
  }
}
