import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class YieldAggregatorChartService {
  constructor() {}

  createChartOption(width: number) {
    return {
      width: width,
      height: width / 2,
      backgroundColor: 'none',
      colors: ['pink'],
      lineWidth: 4,
      pointSize: 6,
      legend: {
        position: 'bottom',
        textStyle: {
          color: 'grey',
          fontSize: 14,
          bold: true,
        },
      },
      hAxis: {
        textStyle: {
          color: 'grey',
          fontSize: 14,
        },
      },
      vAxis: {
        textStyle: {
          color: 'grey',
          fontSize: 14,
        },
        // baseline: 0,
        baselineColor: 'grey',
        gridlines: { color: 'grey', count: -1 },
      },
      Animation: { duration: 1000, startup: true },
    };
  }

  createDummyChartData() {
    const day1 = new Date(2023, 0, 1);
    const day2 = new Date(2023, 0, 2);
    const day3 = new Date(2023, 0, 3);
    const day4 = new Date(2023, 0, 4);
    const day5 = new Date(2023, 0, 5);
    const day6 = new Date(2023, 0, 6);
    const day7 = new Date(2023, 0, 7);
    const day8 = new Date(2023, 0, 8);

    return [
      [day1.toLocaleDateString(), 1.0],
      [day2.toLocaleDateString(), 1.4],
      [day3.toLocaleDateString(), 1.4],
      [day4.toLocaleDateString(), 1.5],
      [day5.toLocaleDateString(), 1.5],
      [day6.toLocaleDateString(), 1.5],
      [day7.toLocaleDateString(), 1.8],
      [day8.toLocaleDateString(), 2.0],
    ];
  }
}
