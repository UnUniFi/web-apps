import { ConfigSelectDialogService } from './config-select-dialog.service';
import { ConfigService } from './config.service';
import { ConfigStoreService } from './config.store.service';
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { first } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class KeySelectGuard implements CanActivate {
  constructor(
    private readonly router: Router,
    private readonly config: ConfigService,
    private readonly configStore: ConfigStoreService,
    private readonly configSelectDialog: ConfigSelectDialogService,
  ) {}

  async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
    const configs = this.config.configs;
    if (configs.length === 0) {
      window.alert('There is no config. Please create config.js.');
      this.router.navigate(['']);
      return true;
    }
    return this.configStore.currentConfig$
      .pipe(first())
      .toPromise()
      .then(async (currentConfig) => {
        currentConfig = await this.configSelectDialog.open();

        let count = 0;
        while (!currentConfig) {
          if (count > 0) {
            return false;
          }
          currentConfig = await this.configSelectDialog.open();
          count++;
        }

        return true;
      });
  }
}
