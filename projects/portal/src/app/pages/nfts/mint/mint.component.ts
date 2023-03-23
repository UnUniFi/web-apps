import { ConfigService } from '../../../models/config.service';
import { NftMintApplicationService } from '../../../models/nft-mints/nft-mint.application.service';
import { StoredWallet } from '../../../models/wallets/wallet.model';
import { WalletService } from '../../../models/wallets/wallet.service';
import { MintNftEvent } from '../../../views/nfts/mint/mint.component';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';

@Component({
  selector: 'app-mint',
  templateUrl: './mint.component.html',
  styleUrls: ['./mint.component.css'],
})
export class MintComponent implements OnInit {
  address$: Observable<string>;
  classes$: Observable<string[] | undefined>;
  selectedClass$: Observable<string>;

  constructor(
    private readonly walletService: WalletService,
    private readonly nftMintApp: NftMintApplicationService,
    private configService: ConfigService,
  ) {
    this.address$ = this.walletService.currentStoredWallet$.pipe(
      filter((wallet): wallet is StoredWallet => wallet !== undefined && wallet !== null),
      map((wallet) => wallet.address),
    );
    const config$ = this.configService.config$;
    this.classes$ = config$.pipe(map((config) => config?.extension?.nftMint?.nftClasses));
    this.selectedClass$ = this.classes$.pipe(map((classes) => (classes ? classes[0] : '')));
  }

  ngOnInit(): void {}

  async onMintNft($event: MintNftEvent) {
    await this.nftMintApp.mintNft($event.classId, $event.nftId, $event.recipient);
  }
}
