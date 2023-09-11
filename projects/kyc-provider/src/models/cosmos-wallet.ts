import { WalletManager, Logger } from '@cosmos-kit/core';
import { chains, assets } from 'chain-registry';
import { wallets } from 'cosmos-kit';

export function getCosmosWalletManager() {
	const logger = new Logger();
	return new WalletManager(chains, assets, wallets, logger);
}

// const wallet = manager.getChainWallet('ununifi-beta-v1', 'keplr');
// wallet.activate();
// wallet.connect();
