import { TxCommonService } from '../cosmos/tx-common.service';
import { Injectable } from '@angular/core';
import ununificlient from 'ununifi-client';

@Injectable({
  providedIn: 'root',
})
export class CopyTradingService {
  constructor(private readonly txCommon: TxCommonService) {}

  buildMsgCreateExemplaryTrader(
    sender: string,
    name: string,
    description: string,
    profitCommissionRate: number,
  ) {
    const decProfitCommissionRate = this.txCommon.numberToDecString(profitCommissionRate);
    const msgCreateExemplaryTrader =
      new ununificlient.proto.ununifi.copytrading.MsgCreateExemplaryTrader({
        sender,
        name,
        description,
        profit_commission_rate: decProfitCommissionRate,
      });
    return msgCreateExemplaryTrader;
  }

  buildMsgUpdateExemplaryTrader(
    sender: string,
    name: string,
    description: string,
    profitCommissionRate: number,
  ) {
    const decProfitCommissionRate = this.txCommon.numberToDecString(profitCommissionRate);
    const msgUpdateExemplaryTrader =
      new ununificlient.proto.ununifi.copytrading.MsgUpdateExemplaryTrader({
        sender,
        name,
        description,
        profit_commission_rate: decProfitCommissionRate,
      });
    return msgUpdateExemplaryTrader;
  }

  buildMsgDeleteExemplaryTrader(sender: string) {
    const msgDeleteExemplaryTrader =
      new ununificlient.proto.ununifi.copytrading.MsgDeleteExemplaryTrader({
        sender,
      });
    return msgDeleteExemplaryTrader;
  }

  buildMsgCreateTracing(
    sender: string,
    exemplaryTrader: string,
    sizeCoef: number,
    leverageCoef: number,
    reverse: boolean,
  ) {
    const decSizeCoef = this.txCommon.numberToDecString(sizeCoef);
    const decLeverageCoef = this.txCommon.numberToDecString(leverageCoef);
    const msgCreateTracing = new ununificlient.proto.ununifi.copytrading.MsgCreateTracing({
      sender,
      exemplary_trader: exemplaryTrader,
      size_coefficient: decSizeCoef,
      leverage_coefficient: decLeverageCoef,
      reverse,
    });
    return msgCreateTracing;
  }

  buildMsgDeleteTracing(sender: string) {
    const msgDeleteTracing = new ununificlient.proto.ununifi.copytrading.MsgDeleteTracing({
      sender,
    });
    return msgDeleteTracing;
  }
}
