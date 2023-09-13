import type cosmosclient from '@cosmos-client/core';
import Decimal from 'decimal.js';

export function getDisplay(
	denom: string,
	metadata: cosmosclient.proto.cosmos.bank.v1beta1.IMetadata[]
) {
	const meta = metadata.find((m) => m.base === denom);
	return meta?.display || '';
}

export function getSymbol(
	denom: string,
	metadata: cosmosclient.proto.cosmos.bank.v1beta1.IMetadata[]
) {
	const meta = metadata.find((m) => m.base === denom);
	return meta?.symbol || '';
}

export function getDenomExponent(denom: string): number {
	switch (denom) {
		default: {
			return 6;
		}
	}
}

export function convertDenomReadableAmountMapToCoins(denomReadableAmountMap: {
	[denom: string]: Decimal;
}): cosmosclient.proto.cosmos.base.v1beta1.ICoin[] {
	const coins = Object.keys(denomReadableAmountMap).map((denom) => {
		const denomExponent = getDenomExponent(denom);
		const amount = denomReadableAmountMap[denom]
			.mul(10 ** denomExponent)
			.floor()
			.toString();

		return {
			denom,
			amount
		};
	});

	return coins;
}

export function convertCoinsToDenomReadableAmountMap(
	coins: cosmosclient.proto.cosmos.base.v1beta1.ICoin[]
): { [denom: string]: Decimal } {
	const denomReadableAmountMap: { [denom: string]: Decimal } = {};
	for (const coin of coins) {
		const denom = coin.denom || '';
		const amount = coin.amount || '';

		const denomExponent = getDenomExponent(denom);
		const readableAmount = new Decimal(amount).div(10 ** denomExponent);
		denomReadableAmountMap[denom] = readableAmount;
	}
	return denomReadableAmountMap;
}
