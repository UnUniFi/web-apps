import { Injectable } from '@angular/core';
import { BidderBids200ResponseBidsInner } from 'ununifi-client/esm/openapi';
import { denomExponentMap } from '../cosmos/bank.model';

@Injectable({
  providedIn: 'root',
})
export class NftPawnshopChartService {
  constructor() {}

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

  createBidAmountChartData(bidders: BidderBids200ResponseBidsInner[]) {
    const primaryColor = '#3A4D8F';
    const exponent = denomExponentMap[bidders[0].bid_amount?.denom!];
    return bidders.map((bidder) => {
      if (
        bidder.bidding_period &&
        bidder.bid_amount &&
        bidder.bid_amount.amount &&
        bidder.deposit_lending_rate
      ) {
        const date = new Date(bidder.bidding_period).toLocaleString();
        const bidAmount = Number(bidder.bid_amount.amount) / 10 ** exponent;
        const rate = (Number(bidder.deposit_lending_rate) * 100).toFixed(2) + '%';
        return [date, bidAmount, primaryColor, rate];
      } else {
        return [];
      }
    });
  }

  createDepositAmountChartData(bidders: BidderBids200ResponseBidsInner[]) {
    const primaryColor = '#3A4D8F';
    const disableColor = '#BFBFBF';
    const exponent = denomExponentMap[bidders[0].bid_amount?.denom!];
    let data = [];
    for (let bidder of bidders) {
      if (
        bidder.bidding_period &&
        bidder.deposit_amount &&
        bidder.deposit_amount.amount &&
        bidder.deposit_lending_rate
      ) {
        const date = new Date(bidder.bidding_period).toLocaleString();
        const depositAmount = Number(bidder.deposit_amount.amount) / 10 ** exponent;
        const rate = (Number(bidder.deposit_lending_rate) * 100).toFixed(2) + '%';
        if (bidder.borrowings && bidder.borrowings.length) {
          const borrowedAmount = bidder.borrowings.reduce(
            (sum, curr) => sum + Number(curr.amount?.amount) / 10 ** exponent,
            0,
          );
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

  createBorrowingAmountChartData(bidders: BidderBids200ResponseBidsInner[]) {
    const primaryColor = '#3A4D8F';
    const exponent = denomExponentMap[bidders[0].bid_amount?.denom!];
    return bidders.map((bidder) => {
      if (
        bidder.bidding_period &&
        bidder.borrowings &&
        bidder.borrowings.length &&
        bidder.deposit_lending_rate
      ) {
        const date = new Date(bidder.bidding_period).toLocaleString();
        const borrowAmount =
          bidder.borrowings.reduce((sum, curr) => sum + Number(curr.amount?.amount), 0) /
          10 ** exponent;
        const rate = (Number(bidder.deposit_lending_rate) * 100).toFixed(2) + '%';
        return [date, borrowAmount, primaryColor, rate];
      } else {
        return [];
      }
    });
  }
}
