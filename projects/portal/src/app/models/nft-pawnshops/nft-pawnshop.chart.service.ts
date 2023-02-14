import { Injectable } from '@angular/core';
import { BidderBids200ResponseBidsInner } from 'ununifi-client/esm/openapi';

@Injectable({
  providedIn: 'root',
})
export class NftPawnshopChartService {
  constructor() {}

  createChartOption() {
    const innerWidth = window.innerWidth;
    let width: number;
    if (innerWidth < 640) {
      width = innerWidth;
    } else if (innerWidth > 1440) {
      width = 460;
    } else if (innerWidth > 1024) {
      width = 400;
    } else {
      width = innerWidth / 3;
    }
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
          color: 'black',
          fontSize: 14,
          bold: true,
        },
      },
      hAxis: {
        textStyle: {
          color: 'black',
          fontSize: 14,
        },
      },
      vAxis: {
        textStyle: {
          color: 'black',
          fontSize: 14,
        },
        baseline: 0,
        baselineColor: 'black',
        gridlines: { color: 'grey', count: -1 },
      },
      bar: { groupWidth: '75%' },
      annotations: {
        alwaysOutside: true,
        highContrast: false,
        stem: {
          color: 'black',
          length: 0,
        },
        textStyle: {
          fontSize: 14,
          bold: true,
          color: 'black',
          opacity: 0.8,
        },
      },
      Animation: { duration: 1000, startup: true },
    };
  }

  createBidAmountChartData(bidders: BidderBids200ResponseBidsInner[]) {
    const primaryColor = '#3A4D8F';
    return bidders.map((bidder) => {
      if (
        bidder.bidding_period &&
        bidder.bid_amount &&
        bidder.bid_amount.amount &&
        bidder.deposit_lending_rate
      ) {
        const date = new Date(bidder.bidding_period).toLocaleString();
        const bidAmount = Number(bidder.bid_amount.amount) / 1000000;
        const rate = (Number(bidder.deposit_lending_rate) * 100).toFixed(2) + '%';
        return [date, bidAmount, primaryColor, rate];
      } else {
        return [];
      }
    });
  }

  createDepositAmountChartData(bidders: BidderBids200ResponseBidsInner[]) {
    const primaryColor = '#3A4D8F';
    const warningColor = '#D62755';
    let data = [];
    for (let bidder of bidders) {
      if (
        bidder.bidding_period &&
        bidder.deposit_amount &&
        bidder.deposit_amount.amount &&
        bidder.deposit_lending_rate
      ) {
        const date = new Date(bidder.bidding_period).toLocaleString();
        const depositAmount = Number(bidder.deposit_amount.amount) / 1000000;
        const rate = (Number(bidder.deposit_lending_rate) * 100).toFixed(2) + '%';
        if (bidder.borrowings && bidder.borrowings.length) {
          const borrowedAmount = bidder.borrowings.reduce(
            (sum, curr) => sum + Number(curr.amount?.amount) / 1000000,
            0,
          );
          data.push([date, borrowedAmount, warningColor, rate]);
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
}
