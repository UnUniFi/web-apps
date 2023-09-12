import { WalletManager, Logger } from '@cosmos-kit/core';
import { chains, assets } from 'chain-registry';
import { wallets } from 'cosmos-kit';

export function getCosmosWalletManager() {
	const logger = new Logger();
	return new WalletManager(chains, assets, wallets, logger);
}
