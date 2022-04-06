import { ConfigService } from './config.service';
import { GentxResponse } from './cosmos/gentx.model';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

export type Data = {
  before_date: string;
  date: string;
  result: { [key: string]: any };
};

@Injectable({
  providedIn: 'root',
})
export class MonitorService {
  constructor(private readonly http: HttpClient, private readonly config: ConfigService) {}

  list(year: number, month: number, day: number, count: number): Observable<Data[]> {
    return this.config.configType$.pipe(
      mergeMap((config) =>
        this.http.get<Data[]>(`${config?.extension?.monitor?.monitorURL}/list`, {
          params: {
            start_year: year,
            start_month: month,
            start_day: day,
            count: count,
          },
        }),
      ),
    );
  }

  postGentxStringToSlack$(gentxString: string): Observable<GentxResponse> {
    const requestBody = {
      gentx_string: gentxString,
    };
    return this.config.configType$.pipe(
      mergeMap((config) => {
        const requestUrl = `${config?.extension?.monitor?.monitorURL}/gentx`;
        if (config?.extension?.monitor?.monitorURL !== undefined) {
          return this.http.post<GentxResponse>(requestUrl, requestBody);
        } else {
          return of({
            status: false,
            message: 'requestUrl is undefined!',
          });
        }
      }),
    );
  }
}
