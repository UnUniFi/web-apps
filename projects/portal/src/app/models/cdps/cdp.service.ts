import { SimulatedTxResultResponse } from '../cosmos/tx-common.model';
import { Key } from '../keys/key.model';
import { CdpInfrastructureService } from './cdp.infrastructure.service';
import { Injectable } from '@angular/core';
import cosmosclient from '@cosmos-client/core';
import { BroadcastTx200Response } from '@cosmos-client/core/esm/openapi';

export interface ICdpInfrastructure {
  createCDP(
    key: Key,
    privateKey: Uint8Array,
    collateralType: string,
    collateral: cosmosclient.proto.cosmos.base.v1beta1.ICoin,
    principal: cosmosclient.proto.cosmos.base.v1beta1.ICoin,
    gas: cosmosclient.proto.cosmos.base.v1beta1.ICoin,
    fee: cosmosclient.proto.cosmos.base.v1beta1.ICoin,
  ): Promise<BroadcastTx200Response>;

  simulateToCreateCDP(
    key: Key,
    privateKey: Uint8Array,
    collateralType: string,
    collateral: cosmosclient.proto.cosmos.base.v1beta1.ICoin,
    principal: cosmosclient.proto.cosmos.base.v1beta1.ICoin,
    minimumGasPrice: cosmosclient.proto.cosmos.base.v1beta1.ICoin,
    gasRatio: number,
  ): Promise<SimulatedTxResultResponse>;

  drawCDP(
    key: Key,
    privateKey: Uint8Array,
    collateralType: string,
    principal: cosmosclient.proto.cosmos.base.v1beta1.ICoin,
    gas: cosmosclient.proto.cosmos.base.v1beta1.ICoin,
    fee: cosmosclient.proto.cosmos.base.v1beta1.ICoin,
  ): Promise<BroadcastTx200Response>;

  simulateToDrawCDP(
    key: Key,
    privateKey: Uint8Array,
    collateralType: string,
    principal: cosmosclient.proto.cosmos.base.v1beta1.ICoin,
    minimumGasPrice: cosmosclient.proto.cosmos.base.v1beta1.ICoin,
    gasRatio: number,
  ): Promise<SimulatedTxResultResponse>;

  repayCDP(
    key: Key,
    privateKey: Uint8Array,
    collateralType: string,
    repayment: cosmosclient.proto.cosmos.base.v1beta1.ICoin,
    gas: cosmosclient.proto.cosmos.base.v1beta1.ICoin,
    fee: cosmosclient.proto.cosmos.base.v1beta1.ICoin,
  ): Promise<BroadcastTx200Response>;

  simulateToRepayCDP(
    key: Key,
    privateKey: Uint8Array,
    collateralType: string,
    repayment: cosmosclient.proto.cosmos.base.v1beta1.ICoin,
    minimumGasPrice: cosmosclient.proto.cosmos.base.v1beta1.ICoin,
    gasRatio: number,
  ): Promise<SimulatedTxResultResponse>;

  depositCDP(
    key: Key,
    privateKey: Uint8Array,
    ownerAddr: cosmosclient.AccAddress,
    collateralType: string,
    collateral: cosmosclient.proto.cosmos.base.v1beta1.ICoin,
    gas: cosmosclient.proto.cosmos.base.v1beta1.ICoin,
    fee: cosmosclient.proto.cosmos.base.v1beta1.ICoin,
  ): Promise<BroadcastTx200Response>;

  simulateToDepositCDP(
    key: Key,
    privateKey: Uint8Array,
    ownerAddr: cosmosclient.AccAddress,
    collateralType: string,
    collateral: cosmosclient.proto.cosmos.base.v1beta1.ICoin,
    minimumGasPrice: cosmosclient.proto.cosmos.base.v1beta1.ICoin,
    gasRatio: number,
  ): Promise<SimulatedTxResultResponse>;

  withdrawCDP(
    key: Key,
    privateKey: Uint8Array,
    ownerAddr: cosmosclient.AccAddress,
    collateralType: string,
    collateral: cosmosclient.proto.cosmos.base.v1beta1.ICoin,
    gas: cosmosclient.proto.cosmos.base.v1beta1.ICoin,
    fee: cosmosclient.proto.cosmos.base.v1beta1.ICoin,
  ): Promise<BroadcastTx200Response>;

  simulateToWithdrawCDP(
    key: Key,
    privateKey: Uint8Array,
    ownerAddr: cosmosclient.AccAddress,
    collateralType: string,
    collateral: cosmosclient.proto.cosmos.base.v1beta1.ICoin,
    minimumGasPrice: cosmosclient.proto.cosmos.base.v1beta1.ICoin,
    gasRatio: number,
  ): Promise<SimulatedTxResultResponse>;
}

@Injectable({
  providedIn: 'root',
})
export class CdpService {
  private readonly iCdpInfrastructure: ICdpInfrastructure;
  constructor(readonly cdpInfrastructure: CdpInfrastructureService) {
    this.iCdpInfrastructure = cdpInfrastructure;
  }

  createCDP(
    key: Key,
    privateKey: Uint8Array,
    collateralType: string,
    collateral: cosmosclient.proto.cosmos.base.v1beta1.ICoin,
    principal: cosmosclient.proto.cosmos.base.v1beta1.ICoin,
    gas: cosmosclient.proto.cosmos.base.v1beta1.ICoin,
    fee: cosmosclient.proto.cosmos.base.v1beta1.ICoin,
  ): Promise<BroadcastTx200Response> {
    return this.iCdpInfrastructure.createCDP(
      key,
      privateKey,
      collateralType,
      collateral,
      principal,
      gas,
      fee,
    );
  }

  simulateToCreateCDP(
    key: Key,
    privateKey: Uint8Array,
    collateralType: string,
    collateral: cosmosclient.proto.cosmos.base.v1beta1.ICoin,
    principal: cosmosclient.proto.cosmos.base.v1beta1.ICoin,
    minimumGasPrice: cosmosclient.proto.cosmos.base.v1beta1.ICoin,
    gasRatio: number,
  ): Promise<SimulatedTxResultResponse> {
    return this.iCdpInfrastructure.simulateToCreateCDP(
      key,
      privateKey,
      collateralType,
      collateral,
      principal,
      minimumGasPrice,
      gasRatio,
    );
  }

  drawCDP(
    key: Key,
    privateKey: Uint8Array,
    collateralType: string,
    principal: cosmosclient.proto.cosmos.base.v1beta1.ICoin,
    gas: cosmosclient.proto.cosmos.base.v1beta1.ICoin,
    fee: cosmosclient.proto.cosmos.base.v1beta1.ICoin,
  ): Promise<BroadcastTx200Response> {
    return this.iCdpInfrastructure.drawCDP(key, privateKey, collateralType, principal, gas, fee);
  }

  simulateToDrawCDP(
    key: Key,
    privateKey: Uint8Array,
    collateralType: string,
    principal: cosmosclient.proto.cosmos.base.v1beta1.ICoin,
    minimumGasPrice: cosmosclient.proto.cosmos.base.v1beta1.ICoin,
    gasRatio: number,
  ): Promise<SimulatedTxResultResponse> {
    return this.iCdpInfrastructure.simulateToDrawCDP(
      key,
      privateKey,
      collateralType,
      principal,
      minimumGasPrice,
      gasRatio,
    );
  }

  repayCDP(
    key: Key,
    privateKey: Uint8Array,
    collateralType: string,
    repayment: cosmosclient.proto.cosmos.base.v1beta1.ICoin,
    gas: cosmosclient.proto.cosmos.base.v1beta1.ICoin,
    fee: cosmosclient.proto.cosmos.base.v1beta1.ICoin,
  ): Promise<BroadcastTx200Response> {
    return this.iCdpInfrastructure.repayCDP(key, privateKey, collateralType, repayment, gas, fee);
  }

  simulateToRepayCDP(
    key: Key,
    privateKey: Uint8Array,
    collateralType: string,
    repayment: cosmosclient.proto.cosmos.base.v1beta1.ICoin,
    minimumGasPrice: cosmosclient.proto.cosmos.base.v1beta1.ICoin,
    gasRatio: number,
  ): Promise<SimulatedTxResultResponse> {
    return this.iCdpInfrastructure.simulateToRepayCDP(
      key,
      privateKey,
      collateralType,
      repayment,
      minimumGasPrice,
      gasRatio,
    );
  }

  depositCDP(
    key: Key,
    privateKey: Uint8Array,
    ownerAddr: cosmosclient.AccAddress,
    collateralType: string,
    collateral: cosmosclient.proto.cosmos.base.v1beta1.ICoin,
    gas: cosmosclient.proto.cosmos.base.v1beta1.ICoin,
    fee: cosmosclient.proto.cosmos.base.v1beta1.ICoin,
  ): Promise<BroadcastTx200Response> {
    return this.iCdpInfrastructure.depositCDP(
      key,
      privateKey,
      ownerAddr,
      collateralType,
      collateral,
      gas,
      fee,
    );
  }

  simulateToDepositCDP(
    key: Key,
    privateKey: Uint8Array,
    ownerAddr: cosmosclient.AccAddress,
    collateralType: string,
    collateral: cosmosclient.proto.cosmos.base.v1beta1.ICoin,
    minimumGasPrice: cosmosclient.proto.cosmos.base.v1beta1.ICoin,
    gasRatio: number,
  ): Promise<SimulatedTxResultResponse> {
    return this.iCdpInfrastructure.simulateToDepositCDP(
      key,
      privateKey,
      ownerAddr,
      collateralType,
      collateral,
      minimumGasPrice,
      gasRatio,
    );
  }

  withdrawCDP(
    key: Key,
    privateKey: Uint8Array,
    ownerAddr: cosmosclient.AccAddress,
    collateralType: string,
    collateral: cosmosclient.proto.cosmos.base.v1beta1.ICoin,
    gas: cosmosclient.proto.cosmos.base.v1beta1.ICoin,
    fee: cosmosclient.proto.cosmos.base.v1beta1.ICoin,
  ): Promise<BroadcastTx200Response> {
    return this.iCdpInfrastructure.withdrawCDP(
      key,
      privateKey,
      ownerAddr,
      collateralType,
      collateral,
      gas,
      fee,
    );
  }

  simulateToWithdrawCDP(
    key: Key,
    privateKey: Uint8Array,
    ownerAddr: cosmosclient.AccAddress,
    collateralType: string,
    collateral: cosmosclient.proto.cosmos.base.v1beta1.ICoin,
    minimumGasPrice: cosmosclient.proto.cosmos.base.v1beta1.ICoin,
    gasRatio: number,
  ): Promise<SimulatedTxResultResponse> {
    return this.iCdpInfrastructure.simulateToWithdrawCDP(
      key,
      privateKey,
      ownerAddr,
      collateralType,
      collateral,
      minimumGasPrice,
      gasRatio,
    );
  }
}
