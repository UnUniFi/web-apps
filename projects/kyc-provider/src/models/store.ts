import { writable } from 'svelte/store';
import { getEvmWalletManager } from './evm-wallet';
import { getCosmosWalletManager } from './cosmos-wallet';

export const evmWalletManager = writable(getEvmWalletManager());
export const cosmosWalletManager = writable(getCosmosWalletManager());
