import { ConfigService } from '../config.service';
import { Uint128 } from './StrategyOsmosis.types';
import { Injectable } from '@angular/core';
import { CosmWasmClient } from '@cosmjs/cosmwasm-stargate';
import { take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class CosmwasmQueryService {
  constructor(private readonly configService: ConfigService) {}

  async executeWasmQuery(address: string, queryMsg: any) {
    const config = await this.configService.config$.pipe(take(1)).toPromise();
    const client = await CosmWasmClient.connect(config?.rpc || '');
    const res = await client.queryContractSmart(address, queryMsg);
    return res;
  }

  async getUnbonding(contractAddress: string, address: string): Promise<Uint128> {
    const queryMsg = {
      unbonding: { addr: address },
    };
    const res = await this.executeWasmQuery(contractAddress, queryMsg);
    return res;
  }
}
