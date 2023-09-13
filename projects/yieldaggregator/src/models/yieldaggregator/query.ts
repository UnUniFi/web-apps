import { CosmosSDKService } from '../cosmos-sdk.service';
import ununifi from 'ununifi-client';
import {
	EstimateMintAmount200Response,
	EstimateRedeemAmount200Response,
	QueryApi,
	StrategyAll200ResponseStrategiesInner,
	Vault200Response,
	VaultAll200ResponseVaultsInner,
	YieldAggregatorParams200ResponseParams
} from 'ununifi-client/esm/openapi';

export class YieldAggregatorQueryService {
	constructor(private readonly url: string) {}

	params() {
		return this.api.yieldAggregatorParams();
	}

	strategyAll(denom?: string) {
		this.api.strategyAll(denom);
	}

	strategy(denom: string, id: string) {
		this.api.strategy(id, denom);
	}

	listVaults$(): Observable<VaultAll200ResponseVaultsInner[]> {
		return this.restSdk$.pipe(
			mergeMap((sdk) => ununifi.rest.yieldAggregator.vaultAll(sdk)),
			map((res) => res.data.vaults!)
		);
	}

	getVault$(id: string): Observable<Vault200Response> {
		return this.restSdk$.pipe(
			mergeMap((sdk) => ununifi.rest.yieldAggregator.vault(sdk, id)),
			map((res) => res.data)
		);
	}

	getEstimatedMintAmount$(id: string, amount?: string): Observable<EstimateMintAmount200Response> {
		return this.restSdk$.pipe(
			mergeMap((sdk) => ununifi.rest.yieldAggregator.estimateMintAmount(sdk, id, amount)),
			map((res) => res.data!)
		);
	}

	getEstimatedRedeemAmount$(
		id: string,
		amount?: string
	): Observable<EstimateRedeemAmount200Response> {
		return this.restSdk$.pipe(
			mergeMap((sdk) => ununifi.rest.yieldAggregator.estimateRedeemAmount(sdk, id, amount)),
			map((res) => res.data!)
		);
	}

	async getEstimatedRedeemAmount(
		id: string,
		amount?: string
	): Promise<EstimateRedeemAmount200Response> {
		const sdk = await this.cosmosSDK.sdk().then((sdk) => sdk.rest);
		const res = await ununifi.rest.yieldAggregator.estimateRedeemAmount(sdk, id, amount);
		return res.data!;
	}
}
