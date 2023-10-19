import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CSVCommonService {
  constructor() {}

  jsonToCsv(json: any[], delimiter: string | undefined): string {
    var header = Object.keys(json[0]).join(delimiter) + '\n';
    var body = json
      .map(function (d) {
        return Object.keys(d)
          .map(function (key) {
            return d[key];
          })
          .join(delimiter);
      })
      .join('\n');
    return header + body;
  }

  downloadCsv(csvString: string, title: string) {
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8' });
    const url = (window.URL || window.webkitURL).createObjectURL(blob);
    const link = document.createElement('a');
    link.download = title + '.csv';
    link.href = url;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}
