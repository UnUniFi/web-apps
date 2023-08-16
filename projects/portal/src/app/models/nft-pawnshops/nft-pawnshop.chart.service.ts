import { getDenomExponent } from '../cosmos/bank.model';
import { Injectable } from '@angular/core';
import { Chart, ChartItem } from 'chart.js/auto';
import 'chartjs-adapter-date-fns';
import { BidderBids200ResponseBidsInner } from 'ununifi-client/esm/openapi';

export type BidChartData = {
  price: number;
  deposit: number;
  interest: number;
  expiry: Date;
  borrowed: boolean;
};

export const chartUtils = {
  transparentize: (value: string, opacity: number) => {
    var alpha = opacity === undefined ? 0.5 : 1 - opacity;
    return value.replace('rgb', 'rgba').replace(')', ', ' + opacity + ')');
  },
  CHART_COLORS: {
    red: 'rgb(255, 99, 132)',
    orange: 'rgb(255, 159, 64)',
    yellow: 'rgb(255, 205, 86)',
    green: 'rgb(75, 192, 192)',
    blue: 'rgb(54, 162, 235)',
    purple: 'rgb(153, 102, 255)',
    grey: 'rgb(201, 203, 207)',
  },
};

@Injectable({
  providedIn: 'root',
})
export class NftPawnshopChartService {
  constructor() {}

  convertChartData(bids: BidderBids200ResponseBidsInner[], denom: string): BidChartData[] {
    const exponent = getDenomExponent(denom);
    const chartData = bids.map((bid) => {
      return {
        price: Number(bid.price?.amount) / 10 ** exponent,
        deposit: Number(bid.deposit?.amount) / 10 ** exponent,
        interest: Number(bid.interest_rate) * 100,
        expiry: new Date(bid.expiry!),
        borrowed: Number(bid.loan?.amount?.amount) > 0,
      };
    });
    return chartData;
  }

  calcRadius(min: number, max: number, value: number) {
    return ((16 - 4) / (max - min)) * (value - min) + 4;
  }

  createInterestDepositChart(chartItem: ChartItem, data: BidChartData[]) {
    console.log(data);
    const minPrice = Math.min(...data.map((d) => d.price));
    const maxPrice = Math.max(...data.map((d) => d.price));

    const dataDepositInterest = {
      datasets: [
        {
          label: 'Borrowed',
          data: data
            .filter((d) => d.borrowed)
            .map((d) => ({
              x: d.interest,
              y: d.deposit,
              r: this.calcRadius(minPrice, maxPrice, d.price),
              price: d.price,
              expiry: d.expiry,
            })),
          backgroundColor: chartUtils.transparentize(chartUtils.CHART_COLORS.red, 0.5),
        },
        {
          label: 'Not Borrowed',
          data: data
            .filter((d) => !d.borrowed)
            .map((d) => ({
              x: d.interest,
              y: d.deposit,
              r: this.calcRadius(minPrice, maxPrice, d.price),
              price: d.price,
              expiry: d.expiry,
            })),
          backgroundColor: chartUtils.transparentize(chartUtils.CHART_COLORS.blue, 0.5),
        },
      ],
    };
    Chart.defaults.font.family = 'Consolas';
    Chart.defaults.borderColor = chartUtils.transparentize(chartUtils.CHART_COLORS.grey, 0.5);
    const chart = new Chart(chartItem, {
      type: 'bubble',
      data: dataDepositInterest,
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          },
          title: {
            display: true,
            text: 'Interest-Deposit-(Price)',
          },
          tooltip: {
            callbacks: {
              label: function (context: any) {
                return [
                  'Price: ' + context.raw.price + '\n',
                  'Deposit: ' + context.raw.y + '\n',
                  'Annual Interest Rate: ' + context.raw.x + '\n',
                  'Expiry: ' + context.raw.expiry.toLocaleString(),
                ];
              },
            },
          },
        },
        scales: {
          x: {
            title: {
              display: true,
              text: 'Interest',
            },
            grid: {
              color: chartUtils.transparentize(chartUtils.CHART_COLORS.grey, 0.1),
            },
          },
          y: {
            title: {
              display: true,
              text: 'Deposit',
            },
            grid: {
              color: chartUtils.transparentize(chartUtils.CHART_COLORS.grey, 0.1),
            },
          },
        },
      },
    });
    return chart;
  }

  createExpiryInterestChart(chartItem: ChartItem, data: BidChartData[]) {
    console.log(data);
    const minDeposit = Math.min(...data.map((d) => d.deposit));
    const maxDeposit = Math.max(...data.map((d) => d.deposit));

    const dataExpiryInterest = {
      datasets: [
        {
          label: 'Borrowed',
          data: data
            .filter((d) => d.borrowed)
            .map((d) => ({
              x: d.expiry,
              y: d.interest,
              r: this.calcRadius(minDeposit, maxDeposit, d.deposit),
              price: d.price,
              deposit: d.deposit,
            })),
          backgroundColor: chartUtils.transparentize(chartUtils.CHART_COLORS.red, 0.5),
        },
        {
          label: 'Not Borrowed',
          data: data
            .filter((d) => !d.borrowed)
            .map((d) => ({
              x: d.expiry,
              y: d.interest,
              r: this.calcRadius(minDeposit, maxDeposit, d.deposit),
              price: d.price,
              deposit: d.deposit,
            })),
          backgroundColor: chartUtils.transparentize(chartUtils.CHART_COLORS.blue, 0.5),
        },
      ],
    };
    Chart.defaults.font.family = 'Consolas';
    Chart.defaults.borderColor = chartUtils.transparentize(chartUtils.CHART_COLORS.grey, 0.5);
    const chart = new Chart(chartItem, {
      type: 'bubble',
      data: dataExpiryInterest,
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          },
          title: {
            display: true,
            text: 'Expiry-Interest-(Deposit)',
          },
          tooltip: {
            callbacks: {
              label: function (context: any) {
                return [
                  'Price: ' + context.raw.price + '\n',
                  'Deposit: ' + context.raw.deposit + '\n',
                  'Annual Interest Rate: ' + context.raw.y + '\n',
                  'Expiry: ' + context.raw.x.toLocaleString(),
                ];
              },
            },
          },
        },
        scales: {
          x: {
            type: 'time',
            time: {
              unit: 'day',
            },
            title: {
              display: true,
              text: 'Expiry',
            },
            grid: {
              color: chartUtils.transparentize(chartUtils.CHART_COLORS.grey, 0.1),
            },
          },
          y: {
            title: {
              display: true,
              text: 'Interest',
            },
            grid: {
              color: chartUtils.transparentize(chartUtils.CHART_COLORS.grey, 0.1),
            },
          },
        },
      },
    });
    return chart;
  }

  createExpiryDepositChart(chartItem: ChartItem, data: BidChartData[]) {
    console.log(data);
    const minPrice = Math.min(...data.map((d) => d.price));
    const maxPrice = Math.max(...data.map((d) => d.price));

    const dataExpiryDeposit = {
      datasets: [
        {
          label: 'Borrowed',
          data: data
            .filter((d) => d.borrowed)
            .map((d) => ({
              x: d.expiry,
              y: d.deposit,
              r: this.calcRadius(minPrice, maxPrice, d.price),
              price: d.price,
              interest: d.interest,
            })),
          backgroundColor: chartUtils.transparentize(chartUtils.CHART_COLORS.red, 0.5),
        },
        {
          label: 'Not Borrowed',
          data: data
            .filter((d) => !d.borrowed)
            .map((d) => ({
              x: d.expiry,
              y: d.deposit,
              r: this.calcRadius(minPrice, maxPrice, d.price),
              price: d.price,
              interest: d.interest,
            })),
          backgroundColor: chartUtils.transparentize(chartUtils.CHART_COLORS.blue, 0.5),
        },
      ],
    };

    Chart.defaults.font.family = 'Consolas';
    Chart.defaults.borderColor = chartUtils.transparentize(chartUtils.CHART_COLORS.grey, 0.5);
    const chart = new Chart(chartItem, {
      type: 'bubble',
      data: dataExpiryDeposit,
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          },
          title: {
            display: true,
            text: 'Expiry-Deposit-(Price)',
          },
          tooltip: {
            callbacks: {
              label: function (context: any) {
                return [
                  'Price: ' + context.raw.price + '\n',
                  'Deposit: ' + context.raw.y + '\n',
                  'Annual Interest Rate: ' + context.raw.interest + '\n',
                  'Expiry: ' + context.raw.x.toLocaleString(),
                ];
              },
            },
          },
        },
        scales: {
          x: {
            type: 'time',
            time: {
              unit: 'day',
            },
            title: {
              display: true,
              text: 'Expiry',
            },
            grid: {
              color: chartUtils.transparentize(chartUtils.CHART_COLORS.grey, 0.1),
            },
          },
          y: {
            title: {
              display: true,
              text: 'Deposit',
            },
            grid: {
              color: chartUtils.transparentize(chartUtils.CHART_COLORS.grey, 0.1),
            },
          },
        },
      },
    });
    return chart;
  }

  createChartOption(width: number) {
    return {
      width: width,
      height: width / 2,
      backgroundColor: 'none',
      // colors: ['pink'],
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
        baseline: 0,
        baselineColor: 'grey',
        gridlines: { color: 'grey', count: -1 },
      },
      bar: { groupWidth: '75%' },
      annotations: {
        alwaysOutside: true,
        highContrast: false,
        stem: {
          color: 'grey',
          length: 0,
        },
        textStyle: {
          fontSize: 14,
          bold: true,
          color: 'grey',
          opacity: 0.8,
        },
      },
      Animation: { duration: 1000, startup: true },
    };
  }

  createBidAmountChartData(bids: BidderBids200ResponseBidsInner[]) {
    const primaryColor = '#3A4D8F';
    if (bids.length === 0) {
      return [];
    }
    if (!bids[0].price?.denom) {
      return [];
    }
    const exponent = getDenomExponent(bids[0].price.denom);
    return bids.map((bid) => {
      if (bid.expiry && bid.price && bid.price.amount && bid.interest_rate) {
        const date = new Date(bid.expiry).toLocaleString();
        const bidAmount = Number(bid.price.amount) / 10 ** exponent;
        const rate = (Number(bid.interest_rate) * 100).toFixed(2) + '%';
        return [date, bidAmount, primaryColor, rate];
      } else {
        return [];
      }
    });
  }

  createDepositAmountChartData(bids: BidderBids200ResponseBidsInner[]) {
    const primaryColor = '#3A4D8F';
    const disableColor = '#BFBFBF';
    if (bids.length === 0) {
      return [];
    }
    if (!bids[0].price?.denom) {
      return [];
    }
    const exponent = getDenomExponent(bids[0].price.denom);
    let data = [];
    for (let bid of bids) {
      if (bid.expiry && bid.deposit && bid.deposit.amount && bid.interest_rate) {
        const date = new Date(bid.expiry).toLocaleString();
        const depositAmount = Number(bid.deposit.amount) / 10 ** exponent;
        const rate = (Number(bid.interest_rate) * 100).toFixed(2) + '%';
        if (bid.loan?.amount?.amount !== '0') {
          const borrowedAmount = Number(bid.loan?.amount?.amount) / 10 ** exponent;
          data.push([date, borrowedAmount, disableColor, rate]);
          const restAmount = depositAmount - borrowedAmount;
          if (restAmount > 0) {
            data.push([date, restAmount, primaryColor, rate]);
          }
        } else {
          data.push([date, depositAmount, primaryColor, rate]);
        }
      } else {
        data.push([]);
      }
    }
    return data;
  }

  createBorrowingAmountChartData(bids: BidderBids200ResponseBidsInner[]) {
    const primaryColor = '#3A4D8F';
    if (bids.length === 0) {
      return [];
    }
    if (!bids[0].price?.denom) {
      return [];
    }
    const exponent = getDenomExponent(bids[0].price.denom);
    return bids.map((bid) => {
      if (bid.expiry && bid.loan?.amount?.amount !== '0' && bid.interest_rate) {
        const date = new Date(bid.expiry).toLocaleString();
        const borrowedAmount = Number(bid.loan?.amount?.amount) / 10 ** exponent;
        const rate = (Number(bid.interest_rate) * 100).toFixed(2) + '%';
        return [date, borrowedAmount, primaryColor, rate];
      } else {
        return [];
      }
    });
  }
}
