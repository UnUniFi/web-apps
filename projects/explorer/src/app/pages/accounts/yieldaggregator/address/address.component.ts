import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import cosmosclient from '@cosmos-client/core';
import { BandProtocolService } from 'projects/portal/src/app/models/band-protocols/band-protocol.service';
import { CosmosSDKService } from 'projects/portal/src/app/models/cosmos-sdk.service';
import { BankQueryService } from 'projects/portal/src/app/models/cosmos/bank.query.service';
import { YieldAggregatorQueryService } from 'projects/portal/src/app/models/yield-aggregators/yield-aggregator.query.service';
import { LoadingDialogService } from 'projects/shared/src/lib/components/loading-dialog';
import { CSVCommonService } from 'projects/shared/src/lib/models/csv/csv-common.service';
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
    private readonly csvCommonService: CSVCommonService,
    private readonly loadingDialog: LoadingDialogService,
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
          .sort(
            (a, b) =>
              Number(a.denom?.replace('yieldaggregator/vaults/', '')) -
              Number(b.denom?.replace('yieldaggregator/vaults/', '')),
          );
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

  downloadDepositsCSV(address: string) {
    this.tvl$?.subscribe((tvl) => {
      const dialogRef = this.loadingDialog.open('Downloading...');
      const data = tvl.vaultBalances?.map((vaultBalance, index) => {
        return {
          vault: vaultBalance.denom?.replace('yieldaggregator/vaults/', ''),
          amount: vaultBalance.amount,
          value: tvl.values[index],
        };
      });
      if (!data) {
        alert('No data');
        return;
      }
      const csvString = this.csvCommonService.jsonToCsv(data, ',');
      const now = new Date();
      dialogRef.close();
      this.csvCommonService.downloadCsv(
        csvString,
        'UYA-Deposits-' + address + '-' + now.toISOString(),
      );
    });
  }

  downloadDepositHistoryCSV(address: string) {
    this.depositMsgs$?.subscribe((msgs) => {
      const dialogRef = this.loadingDialog.open('Downloading...');
      if (msgs.length === 0) {
        alert('No deposit history data');
        return;
      }
      const data = msgs.reverse().map((msg) => {
        return {
          height: msg.height,
          timestamp: msg.timestamp,
          txHash: msg.txHash,
          vault: msg.msg.vault_id,
          amount: msg.msg.amount?.amount,
          denom: msg.msg.amount?.denom,
        };
      });
      const csvString = this.csvCommonService.jsonToCsv(data, ',');
      const now = new Date();
      dialogRef.close();
      this.csvCommonService.downloadCsv(
        csvString,
        'UYA-MsgDepositToVault-' + address + '-' + now.toISOString(),
      );
    });
  }

  downloadWithdrawHistoryCSV(address: string) {
    this.withdrawMsgs$?.subscribe((msgs) => {
      const dialogRef = this.loadingDialog.open('Downloading...');
      if (msgs.length === 0) {
        alert('No withdrawal history data');
        return;
      }
      const data = msgs.reverse().map((msg) => {
        return {
          height: msg.height,
          timestamp: msg.timestamp,
          txHash: msg.txHash,
          vault: msg.msg.vault_id,
          amount: msg.msg.lp_token_amount,
        };
      });
      const csvString = this.csvCommonService.jsonToCsv(data, ',');
      const now = new Date();
      dialogRef.close();
      this.csvCommonService.downloadCsv(
        csvString,
        'UYA-MsgWithdrawFromVault-' + address + '-' + now.toISOString(),
      );
    });
  }
}
