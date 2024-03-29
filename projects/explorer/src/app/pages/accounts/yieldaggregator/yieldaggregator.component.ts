import { CosmosSDKService } from '../../../models/cosmos-sdk.service';
import { Component, OnInit } from '@angular/core';
import cosmosclient from '@cosmos-client/core';
import { BandProtocolService } from 'projects/portal/src/app/models/band-protocols/band-protocol.service';
import { getDenomExponent } from 'projects/portal/src/app/models/cosmos/bank.model';
import { BankQueryService } from 'projects/portal/src/app/models/cosmos/bank.query.service';
import { YieldAggregatorQueryService } from 'projects/portal/src/app/models/yield-aggregators/yield-aggregator.query.service';
import { LoadingDialogService } from 'projects/shared/src/lib/components/loading-dialog';
import { CSVCommonService } from 'projects/shared/src/lib/models/csv/csv-common.service';
import { Observable, combineLatest, timer } from 'rxjs';
import { map, mergeMap, take } from 'rxjs/operators';
import ununificlient from 'ununifi-client';

@Component({
  selector: 'app-yieldaggregator',
  templateUrl: './yieldaggregator.component.html',
  styleUrls: ['./yieldaggregator.component.css'],
})
export class YieldaggregatorComponent implements OnInit {
  pollingInterval = 30;
  depositors$?: Observable<string[]>;
  msgs$?: Observable<
    {
      type: string;
      txHash: string;
      height: string;
      timestamp: string;
      sender: string;
      vaultId: string;
      amount: string;
      microAmount: string;
      denom?: string;
    }[]
  >;
  addressBalances$?: Observable<
    {
      address: string;
      balances: cosmosclient.proto.cosmos.base.v1beta1.ICoin[] | undefined;
    }[]
  >;
  addressTVLs$?: Observable<
    {
      address: string;
      vaultBalances: cosmosclient.proto.cosmos.base.v1beta1.ICoin[] | undefined;
      values: number[];
      tvl: number;
    }[]
  >;

  constructor(
    private cosmosSDK: CosmosSDKService,
    private readonly bankQuery: BankQueryService,
    private readonly iyaQuery: YieldAggregatorQueryService,
    private readonly bandProtocolService: BandProtocolService,
    private readonly csvCommonService: CSVCommonService,
    private readonly loadingDialog: LoadingDialogService,
  ) {
    const timer$ = timer(0, this.pollingInterval * 1000);
    const sdk$ = timer$.pipe(mergeMap((_) => this.cosmosSDK.sdk$));

    // SDK query not support denom with /
    // const availableVaults$ = this.iyaQuery.listVaults$();
    // this.depositors$ = combineLatest([sdk$, availableVaults$]).pipe(
    //   map(([sdk, vaults]) => {
    //     const depositors: string[] = [];
    //     Promise.all(
    //       vaults.map(async (vault) => {
    //         const denomOwners = await cosmosclient.rest.bank
    //           .denomOwners(sdk.rest, 'yieldaggregator/vaults/' + vault.vault?.id)
    //           .then((res) => {
    //             console.log(res);
    //             return res.data;
    //           })
    //           .catch((error) => {
    //             console.error(error);
    //             return undefined;
    //           });
    //         denomOwners?.denom_owners?.map(
    //           (denomOwner) => denomOwner.address && depositors.push(denomOwner.address),
    //         );
    //       }),
    //     );
    //     return depositors;
    //   }),
    // );

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
    const depositMsgs$ = txsResponse$.pipe(
      map((txs) => {
        const msgs: ununificlient.proto.ununifi.yieldaggregator.MsgDepositToVault[] = [];
        txs?.txs?.map((tx) =>
          tx.body?.messages?.map((message) => {
            const instance = cosmosclient.codec.protoJSONToInstance(
              cosmosclient.codec.castProtoJSONOfProtoAny(message),
            );
            if (instance instanceof ununificlient.proto.ununifi.yieldaggregator.MsgDepositToVault) {
              msgs.push(instance);
            }
          }),
        );
        return msgs;
      }),
    );
    const denomMetadataMap$ = this.bankQuery.getDenomMetadataMap$();
    this.msgs$ = combineLatest([txsResponse$, denomMetadataMap$]).pipe(
      map(([txs, denomMetadataMap]) => {
        const msgs: {
          type: string;
          txHash: string;
          height: string;
          timestamp: string;
          sender: string;
          vaultId: string;
          amount: string;
          microAmount: string;
          denom?: string;
        }[] = [];
        txs?.txs?.map((tx, index) =>
          tx.body?.messages?.map((message) => {
            const instance = cosmosclient.codec.protoJSONToInstance(
              cosmosclient.codec.castProtoJSONOfProtoAny(message),
            );
            if (instance instanceof ununificlient.proto.ununifi.yieldaggregator.MsgDepositToVault) {
              const denom = instance.amount?.denom || '';
              const exponent = getDenomExponent(denom);
              const amount = Number(instance.amount?.amount) / Math.pow(10, exponent);
              msgs.push({
                type: 'deposit',
                txHash: txs.tx_responses?.[index].txhash || '',
                height: txs.tx_responses?.[index].height || '',
                timestamp: txs.tx_responses?.[index].timestamp || '',
                sender: instance.sender,
                vaultId: instance.vault_id.toString(),
                amount: amount + ' ' + (denomMetadataMap?.[denom].display || ''),
                microAmount: instance.amount?.amount || '',
                denom: denom,
              });
            }
            if (
              instance instanceof ununificlient.proto.ununifi.yieldaggregator.MsgWithdrawFromVault
            ) {
              const amount = Number(instance.lp_token_amount) / Math.pow(10, 6);
              msgs.push({
                type: 'withdraw',
                txHash: txs.tx_responses?.[index].txhash || '',
                height: txs.tx_responses?.[index].height || '',
                timestamp: txs.tx_responses?.[index].timestamp || '',
                sender: instance.sender,
                vaultId: instance.vault_id.toString(),
                amount: amount + ' YA-Vault-' + instance.vault_id.toString(),
                microAmount: instance.lp_token_amount,
                denom: 'yieldaggregator/vaults/' + instance.vault_id.toString(),
              });
            }
          }),
        );
        return msgs;
      }),
    );
    this.depositors$ = depositMsgs$.pipe(
      map((msgs) => {
        const addressArray = msgs?.map((msg) => msg.sender);
        return [...new Set(addressArray)];
      }),
    );
    this.addressBalances$ = combineLatest([sdk$, this.depositors$]).pipe(
      mergeMap(([sdk, depositors]) =>
        Promise.all(
          depositors.map(async (address) => {
            const balances = await cosmosclient.rest.bank
              .allBalances(sdk.rest, address)
              .then((res) => res.data.balances);
            return { address, balances };
          }),
        ),
      ),
    );
    this.addressTVLs$ = this.addressBalances$.pipe(
      mergeMap((addressBalances) =>
        Promise.all(
          addressBalances.map(async (addressBalance) => {
            const vaultBalances = addressBalance.balances?.filter((balance) =>
              balance.denom?.includes('yieldaggregator/vaults/'),
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
                  redeemAmount.symbol || '',
                  redeemAmount.total_amount || '',
                );
              }),
            );
            const tvl = values.reduce((a, b) => a + b, 0);
            return { address: addressBalance.address, vaultBalances, values, tvl };
          }),
        ),
      ),
      map((addressTVLs) => addressTVLs.sort((a, b) => b.tvl - a.tvl)),
    );
  }

  ngOnInit(): void {}

  async downloadTVLsCSV() {
    const dialogRef = this.loadingDialog.open('Downloading...');
    const tvls = await this.addressTVLs$?.pipe(take(1)).toPromise();
    const data = tvls?.map((addressTVL, index) => {
      return {
        rank: index + 1,
        address: addressTVL.address,
        tvl: addressTVL.tvl,
      };
    });
    if (!data) {
      alert('No data');
      return;
    }
    const csvString = this.csvCommonService.jsonToCsv(data, ',');
    const now = new Date();
    dialogRef.close();
    this.csvCommonService.downloadCsv(csvString, 'UYA-TVLs-' + now.toISOString());
  }

  async downloadMsgsCSV() {
    const dialogRef = this.loadingDialog.open('Downloading...');
    const msgs = await this.msgs$?.pipe(take(1)).toPromise();
    const data = msgs;
    if (!data) {
      alert('No data');
      return;
    }
    const csvString = this.csvCommonService.jsonToCsv(data, ',');
    const now = new Date();
    dialogRef.close();
    this.csvCommonService.downloadCsv(csvString, 'UYA-Msgs-' + now.toISOString());
  }
}
