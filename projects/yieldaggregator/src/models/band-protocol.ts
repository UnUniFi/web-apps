import cosmosclient from '@cosmos-client/core';
import {
	convertCoinsToDenomReadableAmountMap,
	getDenomExponent,
	getDisplay,
	getSymbol
} from './bank/utils';
import Decimal from 'decimal.js';

export const rest = 'https://laozi1.bandchain.org/api';
export type TokenAmountUSD = {
	symbol: string;
	display: string;
	symbolAmount: number;
	usdAmount?: number;
};

export class BandProtocolService {
	async getPrice(symbol: string): Promise<number | undefined> {
		const url = `${rest}/oracle/v1/request_prices?symbols=${symbol}`;
		try {
			const result = await this.http
				.get(url)
				.toPromise()
				.then((res: any) => {
					const multiplier = Number(res.price_results[0].multiplier);
					const px = Number(res.price_results[0].px);
					return px / multiplier;
				});
			return result;
		} catch {
			console.error(`Failed to get price for ${symbol}`);
			return;
		}
	}

	async convertToUSDAmounts(
		coins: cosmosclient.proto.cosmos.base.v1beta1.ICoin[],
		metadata: cosmosclient.proto.cosmos.bank.v1beta1.IMetadata[]
	) {
		const readableAmountMap = convertCoinsToDenomReadableAmountMap(coins);

		return Promise.all(
			coins.map(async (coin) => {
				const denom = coin.denom || '';

				const symbol = getSymbol(denom, metadata);
				if (!symbol) {
					throw new Error(`Symbol not found for denom ${denom}`);
				}

				const price = await this.getPrice(symbol);
				const usdAmount = price ? readableAmountMap[denom].mul(price).toNumber() : undefined;

				return { denom, symbol, usdAmount };
			})
		);
	}
}
