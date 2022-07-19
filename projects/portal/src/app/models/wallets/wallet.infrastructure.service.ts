import { DbService } from '../db.service';
import { KeyType } from '../keys/key.model';
import { CosmosWallet, StoredWallet, Wallet, WalletType } from './wallet.model';
import { IWalletInfrastructure } from './wallet.service';
import { Injectable } from '@angular/core';
import cosmosclient from '@cosmos-client/core';
import Dexie from 'dexie';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class WalletInfrastructureService implements IWalletInfrastructure {
  private db: Dexie;

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

  constructor(private readonly dbService: DbService) {
    this.storedWallets = null;
    this.storedWallets$ = new BehaviorSubject<StoredWallet[] | null | undefined>(null);
    this.cosmosWallets = null;
    this.cosmosWallets$ = new BehaviorSubject<CosmosWallet[] | null | undefined>(null);
    this.wallets = null;
    this.wallets$ = new BehaviorSubject<Wallet[] | null | undefined>(null);

    this.currentStoredWallets = null;
    this.currentStoredWallets$ = new BehaviorSubject<StoredWallet[] | null | undefined>(null);
    this.currentCosmosWallets = null;
    this.currentCosmosWallets$ = new BehaviorSubject<CosmosWallet[] | null | undefined>(null);
    this.currentWallets = null;
    this.currentWallets$ = new BehaviorSubject<Wallet[] | null | undefined>(null);

    this.currentStoredWallet = null;
    this.currentStoredWallet$ = new BehaviorSubject<StoredWallet | null | undefined>(null);
    this.currentCosmosWallet = null;
    this.currentCosmosWallet$ = new BehaviorSubject<CosmosWallet | null | undefined>(null);
    this.currentWallet = null;
    this.currentWallet$ = new BehaviorSubject<Wallet | null | undefined>(null);

    this.db = this.dbService.db;

    this.load();
  }

  async load(): Promise<void> {
    this.storedWallets = await this.listStoredWallets();
    this.storedWallets$.next(this.storedWallets);
    this.cosmosWallets = await this.listCosmosWallets();
    this.cosmosWallets$.next(this.cosmosWallets);
    this.wallets = await this.listWallets();
    this.wallets$.next(this.wallets);

    this.currentStoredWallets = await this.listCurrentStoredWallets();
    this.currentStoredWallets$.next(this.currentStoredWallets);
    this.currentCosmosWallets = await this.listCurrentCosmosWallets();
    this.currentCosmosWallets$.next(this.currentCosmosWallets);
    this.currentWallets = await this.listCurrentWallets();
    this.currentWallets$.next(this.currentWallets);

    this.currentStoredWallet = await this.getCurrentStoredWallet();
    this.currentStoredWallet$.next(this.currentStoredWallet);
    this.currentCosmosWallet = await this.getCurrentCosmosWallet();
    this.currentCosmosWallet$.next(this.currentCosmosWallet);
    this.currentWallet = await this.getCurrentWallet();
    this.currentWallet$.next(this.currentWallet);
  }

  convertStoredWalletToCosmosWallet(storedWallet: StoredWallet): CosmosWallet {
    const public_key: CosmosWallet['public_key'] = new cosmosclient.proto.cosmos.crypto.secp256k1.PubKey({
      key: Uint8Array.from(Buffer.from(storedWallet.public_key, 'hex')),
    });
    const address: cosmosclient.AccAddress = cosmosclient.AccAddress.fromString(
      storedWallet.address,
    );
    return {
      id: storedWallet.id,
      type: WalletType[storedWallet.type],
      key_type: KeyType[storedWallet.key_type],
      public_key,
      address,
    };
  }

  convertCosmosWalletToStoredWallet(cosmosWallet: CosmosWallet): StoredWallet {
    const public_key: string = cosmosWallet.public_key.bytes().toString();
    const address: string = cosmosWallet.address.toAccAddress().toString();
    return {
      id: cosmosWallet.id,
      type: WalletType[cosmosWallet.type],
      key_type: KeyType[cosmosWallet.key_type],
      public_key,
      address,
    };
  }

  convertCosmosWalletToWallet(cosmosWallet: CosmosWallet): Wallet {
    const public_key: Uint8Array = cosmosWallet.public_key.bytes();
    const address: Uint8Array = cosmosWallet.address.value();
    return {
      id: cosmosWallet.id,
      type: WalletType[cosmosWallet.type],
      key_type: KeyType[cosmosWallet.key_type],
      public_key,
      address,
    };
  }

  convertWalletToStoredWallet(wallet: Wallet): StoredWallet {
    const public_key: string = Buffer.from(wallet.public_key).toString('hex');
    const address: string = new cosmosclient.AccAddress(wallet.address).toAccAddress().toString();
    return {
      id: wallet.id,
      type: wallet.type,
      key_type: wallet.key_type,
      public_key,
      address,
    };
  }

  async listCurrentStoredWallets(): Promise<StoredWallet[] | undefined> {
    try {
      const array = await this.db.table('current_wallets').toArray();
      const storedWallets: StoredWallet[] = array.map((element) => {
        return {
          id: element.id,
          type: element.type,
          key_type: element.key_type,
          public_key: element.public_key,
          address: element.address,
        };
      });
      return storedWallets;
    } catch (error) {
      console.error(error);
      return undefined;
    }
  }

  async listCurrentCosmosWallets(): Promise<CosmosWallet[] | undefined> {
    try {
      const storedWallets = await this.listCurrentStoredWallets();
      const cosmosWallets = storedWallets?.map((storedWallet) =>
        this.convertStoredWalletToCosmosWallet(storedWallet),
      );
      return cosmosWallets;
    } catch (error) {
      console.error(error);
      return undefined;
    }
  }

  async listCurrentWallets(): Promise<Wallet[] | undefined> {
    try {
      const cosmosWallets = await this.listCurrentCosmosWallets();
      const wallet = cosmosWallets?.map((cosmosWallet) =>
        this.convertCosmosWalletToWallet(cosmosWallet),
      );
      return wallet;
    } catch (error) {
      console.error(error);
      return undefined;
    }
  }

  async getCurrentStoredWallet(): Promise<StoredWallet | undefined> {
    try {
      const array = await this.db.table('current_wallets').toArray();
      if (!array?.length) {
        throw Error('There is no current_wallets!');
      }
      if (array?.length !== 1) {
        console.error(array);
        throw Error('Unintended duplicate detected in current_wallets!');
      }
      const data = array[0];
      const storedWallet: StoredWallet = {
        id: data.id,
        type: data.type,
        key_type: data.key_type,
        public_key: data.public_key,
        address: data.address,
      };
      return storedWallet;
    } catch (error) {
      console.error(error);
      return undefined;
    }
  }

  async getCurrentCosmosWallet(): Promise<CosmosWallet | undefined> {
    try {
      const storedWallet = await this.getCurrentStoredWallet();
      if (!storedWallet) {
        throw Error('There is no current_wallets!');
      }
      const cosmosWallet = this.convertStoredWalletToCosmosWallet(storedWallet);
      return cosmosWallet;
    } catch (error) {
      console.error(error);
      return undefined;
    }
  }

  async getCurrentWallet(): Promise<Wallet | undefined> {
    try {
      const cosmosWallet = await this.getCurrentCosmosWallet();
      if (!cosmosWallet) {
        throw Error('There is no current_wallets!');
      }
      const wallet = this.convertCosmosWalletToWallet(cosmosWallet);
      return wallet;
    } catch (error) {
      console.error(error);
      return undefined;
    }
  }

  async listStoredWallets(): Promise<StoredWallet[] | undefined> {
    try {
      const array = await this.db.table('wallets').toArray();
      const storedWallets: StoredWallet[] = array.map((element) => {
        return {
          id: element.id,
          type: element.type,
          key_type: element.key_type,
          public_key: element.public_key,
          address: element.address,
        };
      });
      return storedWallets;
    } catch (error) {
      console.error(error);
      return undefined;
    }
  }

  async listCosmosWallets(): Promise<CosmosWallet[] | undefined> {
    try {
      const storedWallets = await this.listStoredWallets();
      const cosmosWallets = storedWallets?.map((storedWallet) =>
        this.convertStoredWalletToCosmosWallet(storedWallet),
      );
      return cosmosWallets;
    } catch (error) {
      console.error(error);
      return undefined;
    }
  }

  async listWallets(): Promise<Wallet[] | undefined> {
    try {
      const cosmosWallets = await this.listCosmosWallets();
      const wallet = cosmosWallets?.map((cosmosWallet) =>
        this.convertCosmosWalletToWallet(cosmosWallet),
      );
      return wallet;
    } catch (error) {
      console.error(error);
      return undefined;
    }
  }

  async getStoredWallet(id: string): Promise<StoredWallet | undefined> {
    try {
      const data = await this.db.table('wallets').where('id').equals(id).first();
      const storedWallet: StoredWallet = {
        id: id,
        type: data.type,
        key_type: data.key_type,
        public_key: data.public_key,
        address: data.address,
      };
      return storedWallet;
    } catch (error) {
      console.error(error);
      return undefined;
    }
  }

  async getCosmosWallet(id: string): Promise<CosmosWallet | undefined> {
    try {
      const storedWallet = await this.getStoredWallet(id);
      if (!storedWallet) {
        throw Error(`There is no wallet with id: ${id}!`);
      }
      const cosmosWallet = this.convertStoredWalletToCosmosWallet(storedWallet);
      return cosmosWallet;
    } catch (error) {
      console.error(error);
      return undefined;
    }
  }

  async getWallet(id: string): Promise<Wallet | undefined> {
    try {
      const cosmosWallet = await this.getCosmosWallet(id);
      if (!cosmosWallet) {
        throw Error(`There is no wallet with id: ${id}!`);
      }
      const wallet = this.convertCosmosWalletToWallet(cosmosWallet);
      return wallet;
    } catch (error) {
      console.error(error);
      return undefined;
    }
  }

  async setCurrentStoredWallet(storedWallet: StoredWallet): Promise<void> {
    try {
      const existingCurrentStoredWallets = await this.db.table('current_wallets').toArray();
      if (existingCurrentStoredWallets?.length) {
        const primaryKeys = existingCurrentStoredWallets.map(
          (existingCurrentStoredWallet) => existingCurrentStoredWallet.index,
        );
        await this.db.table('current_wallets').bulkDelete(primaryKeys);
      }
      await this.db.table('current_wallets').put(storedWallet);
    } catch (error) {
      console.error(storedWallet);
      console.error(error);
    } finally {
      await this.load();
    }
  }

  async setCurrentCosmosWallet(cosmosWallet: CosmosWallet): Promise<void> {
    try {
      const storedWallet = this.convertCosmosWalletToStoredWallet(cosmosWallet);
      await this.setCurrentStoredWallet(storedWallet);
    } catch (error) {
      console.error(error);
    } finally {
      await this.load();
    }
  }

  async setCurrentWallet(wallet: Wallet): Promise<void> {
    try {
      const storedWallet = this.convertWalletToStoredWallet(wallet);
      await this.setCurrentStoredWallet(storedWallet);
    } catch (error) {
      console.error(error);
    } finally {
      await this.load();
    }
  }

  async setStoredWallet(storedWallet: StoredWallet): Promise<void> {
    try {
      const sameStoredWallet = await this.getStoredWallet(storedWallet.id);
      if (sameStoredWallet) {
        throw Error('The wallet is already exists!');
      }
      await this.db.table('wallets').put(storedWallet);
    } catch (error) {
      console.error(storedWallet);
      console.error(error);
    } finally {
      await this.load();
    }
  }

  async setCosmosWallet(cosmosWallet: CosmosWallet): Promise<void> {
    try {
      const storedWallet = this.convertCosmosWalletToStoredWallet(cosmosWallet);
      await this.setStoredWallet(storedWallet);
    } catch (error) {
      console.error(error);
    } finally {
      await this.load();
    }
  }

  async setWallet(wallet: Wallet): Promise<void> {
    try {
      const storedWallet = this.convertWalletToStoredWallet(wallet);
      await this.setStoredWallet(storedWallet);
    } catch (error) {
      console.error(error);
    } finally {
      await this.load();
    }
  }
}
