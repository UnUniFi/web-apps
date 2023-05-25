import { Config, ConfigService } from '../../models/config.service';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

@Component({
  selector: 'app-developers',
  templateUrl: './developers.component.html',
  styleUrls: ['./developers.component.css'],
})
export class DevelopersComponent implements OnInit {
  config$: Observable<Config | undefined>;
  version$: Observable<string | undefined>;

  constructor(private configService: ConfigService, private http: HttpClient) {
    this.config$ = this.configService.config$;
    this.version$ = this.config$.pipe(
      mergeMap((conf) => {
        if (conf && conf.extension && conf.extension.developer) {
          return this.http.get(conf.extension.developer.developerURL + '/version', {
            responseType: 'text',
          });
        } else {
          return of(undefined);
        }
      }),
    );
  }

  ngOnInit(): void {}

  async onRebuild($event: Config) {
    await this.http
      .get($event?.extension?.developer?.developerURL + '/execute', {
        responseType: 'text',
      })
      .toPromise();
    alert('Successfully Sent Rebuild Request');
  }
  async onRestart($event: Config) {
    await this.http
      .get($event?.extension?.developer?.developerURL + '/reset', {
        responseType: 'text',
      })
      .toPromise();
    alert('Successfully Sent Rebuild Request');
  }
}
