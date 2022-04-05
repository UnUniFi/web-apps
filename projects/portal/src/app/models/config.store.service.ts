import { Config, ConfigService } from './config.service';
import { DbService } from './db.service';
import { Injectable } from '@angular/core';
import Dexie from 'dexie';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ConfigStoreService {
  currentConfig$: BehaviorSubject<Config | undefined>;
  private db: Dexie;

  constructor(private readonly config: ConfigService, private readonly dbS: DbService) {
    this.currentConfig$ = new BehaviorSubject<Config | undefined>(undefined);
    this.db = this.dbS.db;

    this.init();
  }

  async init() {
    try {
      const currentConfig: Config = await this.db
        .table('current_configs')
        .get({ id: 'current_config' });
      if (!currentConfig) {
        await this.db.table('current_configs').where('id').equals('current_config').delete();
        return;
      }

      this.currentConfig$.next(currentConfig);
    } catch (error) {
      console.error(error);
      return;
    }
  }

  async setCurrentConfig(config: Config) {
    try {
      await this.db.table('current_configs').where('id').equals('current_config').delete();
    } catch (error) {
      console.error(error);
    }
    try {
      await this.db.table('current_configs').put({ id: 'current_config', config_id: config.id });
      this.currentConfig$.next(config);
    } catch (error) {
      console.error(error);
    }
  }

  resetCurrentConfig() {
    this.currentConfig$.next(undefined);
  }
}
