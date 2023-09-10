import { WalletManager, Logger } from '@cosmos-kit/core';
import { wallets } from 'cosmos-kit';
import { getChainWalletContext } from './utils';

const logger = new Logger();
const manager = new WalletManager([], [], wallets, logger);

const wallet = manager.getChainWallet('ununifi-beta-v1', 'keplr');
wallet.activate();
const context = getChainWalletContext(wallet.chain.chain_id, wallet, true);
