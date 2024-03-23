import { writable, type Writable } from 'svelte/store';
import { getCosmosWalletManager } from './cosmos-wallet';
import type { ChainWalletBase } from '@cosmos-kit/core';
import { Buffer } from 'buffer';

window.Buffer = Buffer;

export const cosmosWalletManager = getCosmosWalletManager();
export const currentChainWallet: Writable<ChainWalletBase | null> = writable(null);
