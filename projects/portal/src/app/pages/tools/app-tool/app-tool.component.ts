import { AppNavigation, ConfigService } from '../../../models/config.service';
import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-app-tool',
  templateUrl: './app-tool.component.html',
  styleUrls: ['./app-tool.component.css'],
})
export class AppToolComponent implements OnInit {
  @Input()
  selectedAppName?: string;
  apps$: Observable<AppNavigation[] | undefined>;
  selectedApp$: Observable<AppNavigation | undefined>;

  constructor(private readonly configS: ConfigService) {
    const config$ = this.configS.config$;
    const allApps$ = config$.pipe(map((conf) => conf?.apps));
    this.selectedApp$ = allApps$.pipe(
      map((apps) => apps?.find((app) => app.name === this.selectedAppName)),
    );
    this.apps$ = allApps$.pipe(
      map((apps) => apps?.filter((app) => app.name !== this.selectedAppName)),
    );
  }

  ngOnInit(): void {}
}
