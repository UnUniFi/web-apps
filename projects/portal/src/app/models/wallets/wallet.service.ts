import { WalletInfrastructureService } from './wallet.infrastructure.service';
import { Wallet, StoredWallet, CosmosWallet } from './wallet.model';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface IWalletInfrastructure {
  storedWallets$: BehaviorSubject<StoredWallet[] | null | undefined>;
  storedWallets?: StoredWallet[] | null;
  cosmosWallets$: BehaviorSubject<CosmosWallet[] | null | undefined>;
  cosmosWallets?: CosmosWallet[] | null;
  wallets$: BehaviorSubject<Wallet[] | null | undefined>;
  wallets?: Wallet[] | null;

  currentStoredWallets$: BehaviorSubject<StoredWallet[] | null | undefined>;
  currentStoredWallets?: StoredWallet[] | null;
  currentCosmosWallets$: BehaviorSubject<CosmosWallet[] | null | undefined>;
  currentCosmosWallets?: CosmosWallet[] | null;
  currentWallets$: BehaviorSubject<Wallet[] | null | undefined>;
  currentWallets?: Wallet[] | null;

  currentStoredWallet$: BehaviorSubject<StoredWallet | null | undefined>;
  currentStoredWallet?: StoredWallet | null;
  currentCosmosWallet$: BehaviorSubject<CosmosWallet | null | undefined>;
  currentCosmosWallet?: CosmosWallet | null;
  currentWallet$: BehaviorSubject<Wallet | null | undefined>;
  currentWallet?: Wallet | null;

  load(): Promise<void>;

  convertStoredWalletToCosmosWallet(storedWallet: StoredWallet): CosmosWallet;
  convertCosmosWalletToStoredWallet(cosmosWallet: CosmosWallet): StoredWallet;
  convertCosmosWalletToWallet(cosmosWallet: CosmosWallet): Wallet;
  convertWalletToStoredWallet(wallet: Wallet): StoredWallet;

  listCurrentStoredWallets(): Promise<StoredWallet[] | undefined>;
  listCurrentCosmosWallets(): Promise<CosmosWallet[] | undefined>;
  listCurrentWallets(): Promise<Wallet[] | undefined>;

  getCurrentStoredWallet(): Promise<StoredWallet | undefined>;
  getCurrentCosmosWallet(): Promise<CosmosWallet | undefined>;
  getCurrentWallet(): Promise<Wallet | undefined>;

  listStoredWallets(): Promise<StoredWallet[] | undefined>;
  listCosmosWallets(): Promise<CosmosWallet[] | undefined>;
  listWallets(): Promise<Wallet[] | undefined>;

  getStoredWallet(id: string): Promise<StoredWallet | undefined>;
  getCosmosWallet(id: string): Promise<CosmosWallet | undefined>;
  getWallet(id: string): Promise<Wallet | undefined>;

  setCurrentStoredWallet(storedWallet: StoredWallet): Promise<void>;
  setCurrentCosmosWallet(cosmosWallet: CosmosWallet): Promise<void>;
  setCurrentWallet(wallet: Wallet): Promise<void>;

  setStoredWallet(storedWallet: StoredWallet): Promise<void>;
  setCosmosWallet(cosmosWallet: CosmosWallet): Promise<void>;
  setWallet(wallet: Wallet): Promise<void>;
}

@Injectable({
  providedIn: 'root',
})
export class WalletService {
  private readonly iWalletInfrastructure: IWalletInfrastructure;

  readonly storedWallets$: Observable<StoredWallet[] | null | undefined>;
  readonly cosmosWallets$: Observable<CosmosWallet[] | null | undefined>;
  readonly wallets$: Observable<Wallet[] | null | undefined>;

  readonly currentStoredWallets$: Observable<StoredWallet[] | null | undefined>;
  readonly currentCosmosWallets$: Observable<CosmosWallet[] | null | undefined>;
  readonly currentWallets$: Observable<Wallet[] | null | undefined>;

  readonly currentStoredWallet$: Observable<StoredWallet | null | undefined>;
  readonly currentCosmosWallet$: Observable<CosmosWallet | null | undefined>;
  readonly currentWallet$: Observable<Wallet | null | undefined>;

  constructor(readonly walletInfrastructure: WalletInfrastructureService) {
    this.iWalletInfrastructure = this.walletInfrastructure;

    this.load();

    this.storedWallets$ = this.iWalletInfrastructure.storedWallets$.asObservable();
    this.cosmosWallets$ = this.iWalletInfrastructure.cosmosWallets$.asObservable();
    this.wallets$ = this.iWalletInfrastructure.wallets$.asObservable();

    this.currentStoredWallets$ = this.iWalletInfrastructure.currentStoredWallets$.asObservable();
    this.currentCosmosWallets$ = this.iWalletInfrastructure.currentCosmosWallets$.asObservable();
    this.currentWallets$ = this.iWalletInfrastructure.currentWallets$.asObservable();

    this.currentStoredWallet$ = this.iWalletInfrastructure.currentStoredWallet$.asObservable();
    this.currentCosmosWallet$ = this.iWalletInfrastructure.currentCosmosWallet$.asObservable();
    this.currentWallet$ = this.iWalletInfrastructure.currentWallet$.asObservable();
  }

  async load(): Promise<void> {
    return this.iWalletInfrastructure.load();
  }

  convertStoredWalletToCosmosWallet(storedWallet: StoredWallet): CosmosWallet {
    return this.iWalletInfrastructure.convertStoredWalletToCosmosWallet(storedWallet);
  }

  convertCosmosWalletToStoredWallet(cosmosWallet: CosmosWallet): StoredWallet {
    return this.iWalletInfrastructure.convertCosmosWalletToStoredWallet(cosmosWallet);
  }

  convertCosmosWalletToWallet(cosmosWallet: CosmosWallet): Wallet {
    return this.iWalletInfrastructure.convertCosmosWalletToWallet(cosmosWallet);
  }

  convertWalletToStoredWallet(wallet: Wallet): StoredWallet {
    return this.iWalletInfrastructure.convertWalletToStoredWallet(wallet);
  }

  async listCurrentStoredWallets(): Promise<StoredWallet[] | undefined> {
    return this.iWalletInfrastructure.listCurrentStoredWallets();
  }

  async listCurrentCosmosWallets(): Promise<CosmosWallet[] | undefined> {
    return this.iWalletInfrastructure.listCurrentCosmosWallets();
  }

  async listCurrentWallets(): Promise<Wallet[] | undefined> {
    return this.iWalletInfrastructure.listCurrentWallets();
  }

  async getCurrentStoredWallet(): Promise<StoredWallet | undefined> {
    return this.iWalletInfrastructure.getCurrentStoredWallet();
  }

  async getCurrentCosmosWallet(): Promise<CosmosWallet | undefined> {
    return this.iWalletInfrastructure.getCurrentCosmosWallet();
  }

  async getCurrentWallet(): Promise<Wallet | undefined> {
    return this.iWalletInfrastructure.getCurrentWallet();
  }

  async listStoredWallets(): Promise<StoredWallet[] | undefined> {
    return this.iWalletInfrastructure.listStoredWallets();
  }

  async listCosmosWallets(): Promise<CosmosWallet[] | undefined> {
    return this.iWalletInfrastructure.listCosmosWallets();
  }
  async listWallets(): Promise<Wallet[] | undefined> {
    return this.iWalletInfrastructure.listWallets();
  }

  async getStoredWallet(id: string): Promise<StoredWallet | undefined> {
    return this.iWalletInfrastructure.getStoredWallet(id);
  }

  async getCosmosWallet(id: string): Promise<CosmosWallet | undefined> {
    return this.iWalletInfrastructure.getCosmosWallet(id);
  }

  async getWallet(id: string): Promise<Wallet | undefined> {
    return this.iWalletInfrastructure.getWallet(id);
  }

  async setCurrentStoredWallet(storedWallet: StoredWallet): Promise<void> {
    return this.iWalletInfrastructure.setCurrentStoredWallet(storedWallet);
  }

  async setCurrentCosmosWallet(cosmosWallet: CosmosWallet): Promise<void> {
    return this.iWalletInfrastructure.setCurrentCosmosWallet(cosmosWallet);
  }

  async setCurrentWallet(wallet: Wallet): Promise<void> {
    return this.iWalletInfrastructure.setCurrentWallet(wallet);
  }

  async setStoredWallet(storedWallet: StoredWallet): Promise<void> {
    return this.iWalletInfrastructure.setStoredWallet(storedWallet);
  }

  async setCosmosWallet(cosmosWallet: CosmosWallet): Promise<void> {
    return this.iWalletInfrastructure.setCosmosWallet(cosmosWallet);
  }

  async setWallet(wallet: Wallet): Promise<void> {
    return this.iWalletInfrastructure.setWallet(wallet);
  }
}
