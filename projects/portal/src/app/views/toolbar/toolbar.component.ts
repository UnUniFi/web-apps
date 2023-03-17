import { StoredWallet } from '../../models/wallets/wallet.model';
import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import * as crypto from 'crypto';

export type SearchResult = {
  searchValue: string;
  type: string;
};

@Component({
  selector: 'view-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css'],
})
export class ToolbarComponent implements OnInit {
  @Input()
  searchResult?: SearchResult | null;

  @Input()
  currentStoredWallet?: StoredWallet | null;

  @Output()
  appSubmitSearchResult: EventEmitter<SearchResult>;

  @Output()
  appChangeInputValue: EventEmitter<string>;

  @Output()
  appConnectWallet: EventEmitter<{}>;

  searchValue: string;

  constructor() {
    this.searchValue = '';
    this.searchResult = {
      searchValue: '',
      type: '',
    };
    this.appSubmitSearchResult = new EventEmitter();
    this.appChangeInputValue = new EventEmitter();
    this.appConnectWallet = new EventEmitter();
  }

  ngOnInit(): void {}

  onOptionSelected(): void {
    if (this.searchResult) {
      this.appSubmitSearchResult.emit(this.searchResult);
      this.searchResult = { searchValue: '', type: '' };
      this.searchValue = '';
    }
  }

  onSubmitSearchResult(): void {
    if (this.searchResult) {
      this.appSubmitSearchResult.emit(this.searchResult);
      this.searchResult = { searchValue: '', type: '' };
      this.searchValue = '';
    }
  }

  onChangeInput(inputValue: string): void {
    this.appChangeInputValue.emit(inputValue);
  }

  onFocusInput(inputValue: string): void {
    this.appChangeInputValue.emit(inputValue);
  }

  onConnectWallet(): void {
    this.appConnectWallet.emit();
  }

  getColorCode(storedWallet: StoredWallet) {
    const hash = crypto
      .createHash('sha256')
      .update(Buffer.from(storedWallet.id))
      .digest()
      .toString('hex');
    return `#${hash.substr(0, 6)}`;
  }
}
