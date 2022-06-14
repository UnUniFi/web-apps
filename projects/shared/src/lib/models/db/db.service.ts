import { Injectable } from '@angular/core';
import { cosmosclient, proto } from '@cosmos-client/core';
import { PubKey } from '@cosmos-client/core/esm/types';
import Dexie from 'dexie';
import { KeyType } from 'projects/shared/src/lib/models/keys/key.model';
import { WalletType } from 'projects/shared/src/lib/models/wallets/wallet.model';

@Injectable({
  providedIn: 'root',
})
export class DbService {
  db: Dexie;

  constructor() {
    const dbName = 'telescope';
    this.db = new Dexie(dbName);
    this.db.version(1).stores({
      keys: '++index, &id, type, public_key',
      current_keys: '++index, &id, key_id',
    });
    this.db
      .version(2)
      .stores({
        wallets: '++index, &id, type, key_type, public_key, address',
        current_wallets: '++index, &id, type, key_type, public_key, address',
      })
      .upgrade(async (tx) => {
        const keys = await this.db.table('keys').toArray();
        const wallets = keys.map((key) => {
          const id = `ununifi_${key.id}`;
          const type = WalletType.ununifi;
          const key_type = key.type as KeyType;
          const public_key = key.public_key as string;
          let cosmosPublicKey: PubKey;
          switch (key_type) {
            case KeyType.secp256k1:
              cosmosPublicKey = new proto.cosmos.crypto.secp256k1.PubKey({
                key: Uint8Array.from(Buffer.from(public_key, 'hex')),
              });
              break;
            case KeyType.ed25519:
              throw Error('Unsupported key type!');
            case KeyType.sr25519:
              throw Error('Unsupported key type!');
            default:
              throw Error('Unsupported key type!');
          }
          const accAddress = cosmosclient.AccAddress.fromPublicKey(cosmosPublicKey);
          const address = accAddress.toString();
          return {
            id,
            type,
            key_type,
            public_key,
            address,
          };
        });
        await tx.db.table('wallets').bulkAdd(wallets);
      });
  }
}
