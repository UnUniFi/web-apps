import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import cosmosclient from '@cosmos-client/core';
import { BandProtocolService } from 'projects/portal/src/app/models/band-protocols/band-protocol.service';
import { CosmosSDKService } from 'projects/portal/src/app/models/cosmos-sdk.service';
import { BankQueryService } from 'projects/portal/src/app/models/cosmos/bank.query.service';
import { YieldAggregatorQueryService } from 'projects/portal/src/app/models/yield-aggregators/yield-aggregator.query.service';
import { Observable, combineLatest, timer } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import ununificlient from 'ununifi-client';

@Component({
  selector: 'app-address',
  templateUrl: './address.component.html',
  styleUrls: ['./address.component.css'],
})
export class AddressComponent implements OnInit {
  pollingInterval = 30;
  address$: Observable<string>;
  depositMsgs$?: Observable<
    {
      txHash: string;
      height: string;
      timestamp: string;
      msg: ununificlient.proto.ununifi.yieldaggregator.MsgDepositToVault;
    }[]
  >;
  withdrawMsgs$?: Observable<
    {
      txHash: string;
      height: string;
      timestamp: string;
      msg: ununificlient.proto.ununifi.yieldaggregator.MsgWithdrawFromVault;
    }[]
  >;
  tvl$?: Observable<{
    vaultBalances: cosmosclient.proto.cosmos.base.v1beta1.ICoin[] | undefined;
    values: number[];
    tvl: number;
  }>;

  constructor(
    private route: ActivatedRoute,
    private cosmosSDK: CosmosSDKService,
    private readonly bankQuery: BankQueryService,
    private readonly iyaQuery: YieldAggregatorQueryService,
    private readonly bandProtocolService: BandProtocolService,
  ) {
    this.address$ = this.route.params.pipe(map((params) => params.address));
    const timer$ = timer(0, this.pollingInterval * 1000);
    const sdk$ = timer$.pipe(mergeMap((_) => this.cosmosSDK.sdk$));
    const txsResponse$ = sdk$.pipe(
      mergeMap((sdk) => {
        return cosmosclient.rest.tx
          .getTxsEvent(
            sdk.rest,
            [`message.module='yieldaggregator'`],
            undefined,
            undefined,
            undefined,
            true,
            true,
            2 as any,
          )
          .then((res) => {
            console.log(res);
            return res.data;
          })
          .catch((error) => {
            console.error(error);
            return undefined;
          });
      }),
    );
    this.depositMsgs$ = combineLatest([txsResponse$, this.address$]).pipe(
      map(([txs, address]) => {
        const msgs: {
          txHash: string;
          height: string;
          timestamp: string;
          msg: ununificlient.proto.ununifi.yieldaggregator.MsgDepositToVault;
        }[] = [];
        txs?.txs?.map((tx, index) =>
          tx.body?.messages?.map((message) => {
            const instance = cosmosclient.codec.protoJSONToInstance(
              cosmosclient.codec.castProtoJSONOfProtoAny(message),
            );
            if (
              instance instanceof ununificlient.proto.ununifi.yieldaggregator.MsgDepositToVault &&
              instance.sender === address
            ) {
              msgs.push({
                txHash: txs.tx_responses?.[index].txhash || '',
                height: txs.tx_responses?.[index].height || '',
                timestamp: txs.tx_responses?.[index].timestamp || '',
                msg: instance,
              });
            }
          }),
        );
        return msgs;
      }),
    );
    this.depositMsgs$.subscribe((msgs) => console.log(msgs[0].msg.amount));
    this.withdrawMsgs$ = combineLatest([txsResponse$, this.address$]).pipe(
      map(([txs, address]) => {
        const msgs: {
          txHash: string;
          height: string;
          timestamp: string;
          msg: ununificlient.proto.ununifi.yieldaggregator.MsgWithdrawFromVault;
        }[] = [];
        txs?.txs?.map((tx, index) =>
          tx.body?.messages?.map((message) => {
            const instance = cosmosclient.codec.protoJSONToInstance(
              cosmosclient.codec.castProtoJSONOfProtoAny(message),
            );
            if (
              instance instanceof
                ununificlient.proto.ununifi.yieldaggregator.MsgWithdrawFromVault &&
              instance.sender === address
            ) {
              msgs.push({
                txHash: txs.tx_responses?.[index].txhash || '',
                height: txs.tx_responses?.[index].height || '',
                timestamp: txs.tx_responses?.[index].timestamp || '',
                msg: instance,
              });
            }
          }),
        );
        return msgs;
      }),
    );

    const balances$ = combineLatest([sdk$, this.address$]).pipe(
      mergeMap(
        ([sdk, address]) =>
          cosmosclient.rest.bank.allBalances(sdk.rest, address).then((res) => res.data.balances) ||
          [],
      ),
    );

    const denomMetadataMap$ = this.bankQuery.getDenomMetadataMap$();
    this.tvl$ = combineLatest([balances$, denomMetadataMap$]).pipe(
      mergeMap(async ([balances, denomMetadataMap]) => {
        const vaultBalances = balances
          ?.filter((balance) => balance.denom?.includes('yieldaggregator/vaults/'))
          .reverse();
        const amounts = await Promise.all(
          vaultBalances?.map(async (balance) => {
            const amount = await this.iyaQuery.getEstimatedRedeemAmount(
              balance.denom?.replace('yieldaggregator/vaults/', '')!,
              balance.amount!,
            );
            return amount;
          }) || [],
        );
        const values = await Promise.all(
          amounts.map(async (redeemAmount) => {
            return this.bandProtocolService.convertToUSDAmount(
              redeemAmount.total_amount?.denom || '',
              redeemAmount.total_amount?.amount || '',
              denomMetadataMap,
            );
          }),
        );
        const tvl = values.reduce((a, b) => a + b, 0);
        return { vaultBalances, values, tvl };
      }),
    );
  }

  ngOnInit(): void {}
}
