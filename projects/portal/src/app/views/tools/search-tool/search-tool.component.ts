import { SearchResult } from '../../toolbar/toolbar.component';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'view-search-tool',
  templateUrl: './search-tool.component.html',
  styleUrls: ['./search-tool.component.css'],
})
export class SearchToolComponent implements OnInit {
  @Input()
  searchResult?: SearchResult | null;
  @Output()
  appSubmitSearchResult: EventEmitter<SearchResult>;
  @Output()
  appChangeInputValue: EventEmitter<string>;
  searchValue: string;

  constructor() {
    this.searchValue = '';
    this.searchResult = {
      searchValue: '',
      type: '',
    };
    this.appSubmitSearchResult = new EventEmitter();
    this.appChangeInputValue = new EventEmitter();
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
}
