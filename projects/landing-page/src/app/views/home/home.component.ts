import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'view-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}

  toggler() {
    const toggled = document.getElementById('toggled');
    toggled?.classList.toggle('d-none');
  }
}
