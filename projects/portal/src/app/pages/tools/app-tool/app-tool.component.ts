import { AppNavigation, ConfigService } from '../../../models/config.service';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-app-tool',
  templateUrl: './app-tool.component.html',
  styleUrls: ['./app-tool.component.css'],
})
export class AppToolComponent implements OnInit {
  apps$: Observable<AppNavigation[] | undefined>;

  constructor(private readonly configS: ConfigService) {
    const config$ = this.configS.config$;
    this.apps$ = config$.pipe(map((conf) => conf?.apps));
  }

  ngOnInit(): void {}
}
