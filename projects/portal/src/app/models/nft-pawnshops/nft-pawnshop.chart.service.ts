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
    if (!bids[0].price?.denom) {
      return [];
    }
    const exponent = denomExponentMap[bids[0].price.denom];
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
    const exponent = denomExponentMap[bids[0].price.denom];
    let data = [];
    for (let bid of bids) {
      if (bid.expiry && bid.deposit && bid.deposit.amount && bid.interest_rate) {
        const date = new Date(bid.expiry).toLocaleString();
        const depositAmount = Number(bid.deposit.amount) / 10 ** exponent;
        const rate = (Number(bid.interest_rate) * 100).toFixed(2) + '%';
        if (bid.borrow?.amount?.amount !== '0') {
          const borrowedAmount = Number(bid.borrow?.amount?.amount) / 10 ** exponent;
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
    const exponent = denomExponentMap[bids[0].price.denom];
    return bids.map((bid) => {
      if (bid.expiry && bid.borrow?.amount?.amount !== '0' && bid.interest_rate) {
        const date = new Date(bid.expiry).toLocaleString();
        const borrowedAmount = Number(bid.borrow?.amount?.amount) / 10 ** exponent;
        const rate = (Number(bid.interest_rate) * 100).toFixed(2) + '%';
        return [date, borrowedAmount, primaryColor, rate];
      } else {
        return [];
      }
    });
  }
}
