import { denomExponentMap } from '../cosmos/bank.model';
import { Injectable } from '@angular/core';
import { BidderBids200ResponseBidsInner } from 'ununifi-client/esm/openapi';

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

  createBidAmountChartData(bids: BidderBids200ResponseBidsInner[]) {
    const primaryColor = '#3A4D8F';
    if (bids.length === 0) {
      return [];
    }
    if (!bids[0].bid_amount?.denom) {
      return [];
    }
    const exponent = denomExponentMap[bids[0].bid_amount.denom];
    return bids.map((bid) => {
      if (
        bid.bidding_period &&
        bid.bid_amount &&
        bid.bid_amount.amount &&
        bid.deposit_lending_rate
      ) {
        const date = new Date(bid.bidding_period).toLocaleString();
        const bidAmount = Number(bid.bid_amount.amount) / 10 ** exponent;
        const rate = (Number(bid.deposit_lending_rate) * 100).toFixed(2) + '%';
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
    if (!bids[0].bid_amount?.denom) {
      return [];
    }
    const exponent = denomExponentMap[bids[0].bid_amount.denom];
    let data = [];
    for (let bid of bids) {
      if (
        bid.bidding_period &&
        bid.deposit_amount &&
        bid.deposit_amount.amount &&
        bid.deposit_lending_rate
      ) {
        const date = new Date(bid.bidding_period).toLocaleString();
        const depositAmount = Number(bid.deposit_amount.amount) / 10 ** exponent;
        const rate = (Number(bid.deposit_lending_rate) * 100).toFixed(2) + '%';
        if (bid.borrowings && bid.borrowings.length) {
          const borrowedAmount = bid.borrowings.reduce(
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

  createBorrowingAmountChartData(bids: BidderBids200ResponseBidsInner[]) {
    const primaryColor = '#3A4D8F';
    if (bids.length === 0) {
      return [];
    }
    if (!bids[0].bid_amount?.denom) {
      return [];
    }
    const exponent = denomExponentMap[bids[0].bid_amount.denom];
    return bids.map((bid) => {
      if (
        bid.bidding_period &&
        bid.borrowings &&
        bid.borrowings.length &&
        bid.deposit_lending_rate
      ) {
        const date = new Date(bid.bidding_period).toLocaleString();
        const borrowAmount =
          bid.borrowings.reduce((sum, curr) => sum + Number(curr.amount?.amount), 0) /
          10 ** exponent;
        const rate = (Number(bid.deposit_lending_rate) * 100).toFixed(2) + '%';
        return [date, borrowAmount, primaryColor, rate];
      } else {
        return [];
      }
    });
  }
}
