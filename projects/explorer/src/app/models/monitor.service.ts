import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConfigService } from '@ununifi/shared';
import { Observable } from 'rxjs';
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
    return this.config.config$.pipe(
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
}
