import { ConfigSelectDialogComponent } from '../views/config-select-dialog/config-select-dialog.component';
import { Config, ConfigService } from './config.service';
import { ConfigStoreService } from './config.store.service';
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { first } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ConfigSelectDialogService {
  constructor(
    private readonly router: Router,
    private readonly dialog: MatDialog,
    private readonly config: ConfigService,
    private readonly configStore: ConfigStoreService,
  ) {}

  async open() {
    const configs = this.config.configs;
    const currentConfig = await this.configStore.currentConfig$.pipe(first()).toPromise();

    const result: Config | undefined = await this.dialog
      .open(ConfigSelectDialogComponent, {
        data: { configs, currentConfigID: currentConfig?.id },
      })
      .afterClosed()
      .toPromise();

    if (!result || result.id === currentConfig?.id) {
      return result;
    }
    this.configStore.setCurrentConfig(result);
    return result;
  }
}
