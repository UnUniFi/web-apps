import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-kyc',
  templateUrl: './kyc.component.html',
  styleUrls: ['./kyc.component.css'],
})
export class KycComponent implements OnInit {
  address$ = this.route.paramMap.pipe(map((params) => params.get('address')));

  email = '';
  name = '';
  country = '';
  zipcode = '';
  address = '';
  birthday = '';

  processing = false;

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {}

  onSubmit() {
    this.processing = true;

    this.processing = false;
  }
}
