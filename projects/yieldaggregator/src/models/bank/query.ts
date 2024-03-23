import type cosmosclient from '@cosmos-client/core';
import { QueryApi } from '@cosmos-client/core/esm/openapi';

export class BankQueryService {
	constructor(private readonly url: string) {}

	getSupply$(denom: string): Promise<cosmosclient.proto.cosmos.base.v1beta1.ICoin> {
		return new QueryApi(undefined, this.url).supplyOf(denom).then((res) => res.data.amount!);
	}

	getBalance(
		address: string,
		denoms?: string[]
	): Promise<cosmosclient.proto.cosmos.base.v1beta1.ICoin[]> {
		if (!denoms) {
			return new QueryApi(undefined, this.url)
				.allBalances(address)
				.then((res) => res.data.balances || []);
		}

		return Promise.all(
			denoms.map((denom) =>
				new QueryApi(undefined, this.url).balance(address, denom).then((res) => res.data.balance!)
			)
		);
	}

	getSymbolImageMap(symbols?: string[]): {
		[symbol: string]: string;
	} {
		const map: { [symbol: string]: string } = {};
		const images = this.symbolImages();
		if (!symbols) {
			for (const img of images) {
				map[img.symbol] = img.image;
			}
		} else {
			for (const s of symbols) {
				const img = images.find((i) => i.symbol === s);
				map[s] = img?.image || '';
			}
		}
		return map;
	}

	// TODO: remove this after metadata is embed in bank module
	async _denomsMetadata() {
		const config = await this.configS.config$.pipe(take(1)).toPromise();
		const metadata = config?.denomMetadata || [];
		for (let i = 0; i < 100; i++) {
			metadata?.push({
				description: 'Yield Aggregator Vault #' + i + 'Token',
				denom_units: [
					{
						denom: 'yieldaggregator/vaults/' + i,
						exponent: 6,
						aliases: []
					}
				],
				base: 'yieldaggregator/vaults/' + i,
				display: 'YA-Vault-' + i,
				name: 'YA Vault #' + i,
				symbol: 'YA-VAULT-' + i
			});
		}
		return {
			data: {
				metadata
			}
		};
	}

	// TODO: remove this after metadata is embed in bank module
	async _denomMetadata(denom: string) {
		const metadata = await this._denomsMetadata().then((res) =>
			res.data.metadata.find((m) => m.base === denom)
		);

		return {
			data: {
				metadata
			}
		};
	}

	async getDenomMetadata(
		denoms?: string[]
	): Promise<cosmosclient.proto.cosmos.bank.v1beta1.IMetadata[]> {
		if (!denoms) {
			const res = await this._denomsMetadata();
			return res.data.metadata || [];
		}

		const res = await Promise.all(
			denoms.map((denom) => this._denomMetadata(denom).then((res) => res.data.metadata!))
		);
		return res;
	}

	symbolImages() {
		const symbolImages = [
			{
				symbol: 'GUU',
				image: 'assets/UnUniFi-logo.png'
			},
			{
				symbol: 'BTC',
				image:
					'https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons@1a63530be6e374711a8554f31b17e4cb92c25fa5/svg/color/btc.svg'
			},
			{
				symbol: 'ETH',
				image:
					'https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons@1a63530be6e374711a8554f31b17e4cb92c25fa5/svg/color/eth.svg'
			},
			{
				symbol: 'USDC',
				image:
					'https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons@1a63530be6e374711a8554f31b17e4cb92c25fa5/svg/color/usdc.svg'
			},
			{
				symbol: 'ATOM',
				image:
					'https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons@1a63530be6e374711a8554f31b17e4cb92c25fa5/svg/color/atom.svg'
			},
			{
				symbol: 'OSMO',
				image: 'assets/osmosis-logo.svg'
			}
		];
		return symbolImages;
	}
}
