import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import cosmosclient from '@cosmos-client/core';
import { TokenAmountUSD } from 'projects/portal/src/app/models/band-protocols/band-protocol.service';
import { ExternalChainInfo, YieldInfo } from 'projects/portal/src/app/models/config.service';
import { ExternalWallet } from 'projects/portal/src/app/models/wallets/wallet.model';
import {
  DepositToVaultFromCosmosRequest,
  DepositToVaultFromEvmRequest,
  DepositToVaultRequest,
  WithdrawFromVaultRequest,
} from 'projects/portal/src/app/models/yield-aggregators/yield-aggregator.model';
import { CoinAmountPipe } from 'projects/portal/src/app/pipes/coin-amount.pipe';
import {
  EstimateMintAmount200Response,
  EstimateRedeemAmount200Response,
  StrategyAll200ResponseStrategiesInnerStrategy,
  Vault200Response,
} from 'ununifi-client/esm/openapi';

@Component({
  selector: 'view-vault',
  templateUrl: './vault.component.html',
  styleUrls: ['./vault.component.css'],
})
export class VaultComponent implements OnInit, OnChanges {
  @Input()
  vault?: Vault200Response | null;
  @Input()
  denom?: string | null;
  @Input()
  symbolImage?: string | null;
  @Input()
  denomBalancesMap?: { [denom: string]: cosmosclient.proto.cosmos.base.v1beta1.ICoin } | null;
  @Input()
  denomMetadataMap?: { [denom: string]: cosmosclient.proto.cosmos.bank.v1beta1.IMetadata } | null;
  @Input()
  totalDepositAmount?: TokenAmountUSD | null;
  @Input()
  totalBondedAmount?: TokenAmountUSD | null;
  @Input()
  totalUnbondingAmount?: TokenAmountUSD | null;
  @Input()
  withdrawReserve?: TokenAmountUSD | null;
  @Input()
  estimatedMintAmount?: EstimateMintAmount200Response | null;
  @Input()
  estimatedRedeemAmount?: EstimateRedeemAmount200Response | null;
  @Input()
  vaultBalance?: cosmosclient.proto.cosmos.base.v1beta1.ICoin | null;
  @Input()
  usdDepositAmount?: TokenAmountUSD | null;
  @Input()
  vaultInfo?: YieldInfo | null;
  @Input()
  externalChains?: ExternalChainInfo[] | null;
  @Input()
  externalWallet?: ExternalWallet;

  @Output()
  changeDeposit: EventEmitter<number>;
  @Output()
  appDeposit: EventEmitter<DepositToVaultRequest>;
  @Output()
  changeWithdraw: EventEmitter<number>;
  @Output()
  appWithdraw: EventEmitter<WithdrawFromVaultRequest>;
  @Output()
  appClickChain: EventEmitter<ExternalChainInfo>;
  @Output()
  appDepositFromCosmos: EventEmitter<DepositToVaultFromCosmosRequest>;
  @Output()
  appDepositFromEvm: EventEmitter<DepositToVaultFromEvmRequest>;

  mintAmount?: number;
  burnAmount?: number;
  tab: 'mint' | 'burn' = 'mint';
  selectedChain?: ExternalChainInfo | undefined;
  selectedToken?: { symbol: string; denom: string; contractAddress: string; decimal: number };
  withdrawOptions = [
    {
      id: 'immediate',
      display: 'Immediate withdrawal',
      disabled: false,
    },
    {
      id: 'unbonding',
      display: 'Withdrawal after the unbonding period (coming soon)',
      disabled: true,
    },
  ];
  withdrawOption = this.withdrawOptions[0];

  constructor(private coinAmountPipe: CoinAmountPipe) {
    this.changeDeposit = new EventEmitter();
    this.appDeposit = new EventEmitter();
    this.changeWithdraw = new EventEmitter();
    this.appWithdraw = new EventEmitter();
    this.appClickChain = new EventEmitter();
    this.appDepositFromCosmos = new EventEmitter();
    this.appDepositFromEvm = new EventEmitter();
  }

  ngOnInit(): void {}

  ngOnChanges(): void {}

  onClickChain(chain?: ExternalChainInfo) {
    this.selectedChain = chain;
    this.appClickChain.emit(this.selectedChain);
    this.selectedToken = this.selectedChain?.availableTokens![0];
    (global as any).chain_select_modal.close();
  }

  onDepositAmountChange() {
    this.changeDeposit.emit(this.mintAmount);
  }

  onSubmitDeposit() {
    if (!this.mintAmount) {
      alert('Please enter the amount to deposit.');
      return;
    }
    if (!this.vault?.vault?.denom || !this.vault?.vault?.id) {
      alert('Invalid vault info.');
      return;
    }

    if (!this.selectedChain) {
      this.appDeposit.emit({
        vaultId: this.vault.vault.id,
        readableAmount: this.mintAmount,
        denom: this.vault.vault.denom,
      });
    } else {
      if (!this.externalWallet) {
        alert('Please connect your wallet of External Chain.');
        return;
      }
      if (this.selectedChain.cosmos) {
        console.log(this.externalWallet);
        this.appDepositFromCosmos.emit({
          vaultId: this.vault.vault.id,
          externalChainId: this.selectedChain.chainId,
          externalWallet: this.externalWallet,
          externalDenom: this.denomMetadataMap?.[this.vault.vault.denom!].denom_units?.[0].denom!,
          readableAmount: this.mintAmount,
          vaultDenom: this.vault.vault.denom,
        });
      } else {
        this.appDepositFromEvm.emit({
          vaultId: this.vault.vault.id,
          externalChainName: this.selectedChain.chainName,
          externalWallet: this.externalWallet,
          // todo: fix erc20Symbol
          erc20Symbol: 'aUSDC',
          readableAmount: this.mintAmount,
          vaultDenom: this.vault.vault.denom,
        });
      }
    }
  }

  onWithdrawAmountChange() {
    this.changeWithdraw.emit(this.burnAmount);
  }

  onSubmitWithdraw() {
    if (!this.burnAmount) {
      alert('Please enter the amount to withdraw.');
      return;
    }
    this.appWithdraw.emit({
      vaultId: this.vault?.vault?.id!,
      readableAmount: this.burnAmount,
      denom: this.vault?.vault?.denom!,
    });
  }

  getStrategyInfo(id?: string): StrategyAll200ResponseStrategiesInnerStrategy | undefined {
    return this.vault?.strategies?.find((strategy) => strategy.id === id);
  }

  // todo: fix use denom exponent
  setMintAmount(rate: number) {
    this.mintAmount =
      Number(
        this.coinAmountPipe.transform(
          this.denomBalancesMap?.[this.vault?.vault?.denom || ''].amount,
          this.vault?.vault?.denom,
        ),
      ) * rate;
    this.mintAmount = Math.floor(this.mintAmount * Math.pow(10, 6)) / Math.pow(10, 6);
    this.onDepositAmountChange();
  }

  setBurnAmount(rate: number) {
    const denom = 'yieldaggregator/vaults/' + this.vault?.vault?.id;
    this.burnAmount =
      Number(this.coinAmountPipe.transform(this.denomBalancesMap?.[denom].amount, denom)) * rate;
    this.burnAmount = Math.floor(this.burnAmount * Math.pow(10, 6)) / Math.pow(10, 6);
    this.onWithdrawAmountChange();
  }
}
