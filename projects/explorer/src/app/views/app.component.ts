import { SearchResult } from './toolbar/toolbar.component';
import { Component, OnInit, ViewChild, Input, Output, EventEmitter, NgZone } from '@angular/core';
import { MatDrawerMode, MatSidenav } from '@angular/material/sidenav';
import { Router, NavigationEnd } from '@angular/router';
import { Config } from '@ununifi/shared';
import { BehaviorSubject, combineLatest } from 'rxjs';

@Component({
  selector: 'view-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  @Input()
  config?: Config | null;

  @Input()
  searchResult?: SearchResult | null;

  @Input()
  configs?: string[];

  @Input()
  selectedConfig?: string | null;

  @Input()
  navigations?: { name: string; link: string; icon: string }[] | null;

  @Output()
  appSubmitSearchResult: EventEmitter<SearchResult>;

  @Output()
  appChangeInputValue: EventEmitter<string>;

  @Output()
  appChangeConfig: EventEmitter<string>;

  @ViewChild('drawer')
  sidenav!: MatSidenav;

  drawerMode$: BehaviorSubject<MatDrawerMode> = new BehaviorSubject('side' as MatDrawerMode);

  drawerOpened$ = new BehaviorSubject(true);

  constructor(private router: Router, private ngZone: NgZone) {
    this.appSubmitSearchResult = new EventEmitter();
    this.appChangeInputValue = new EventEmitter();
    this.appChangeConfig = new EventEmitter();

    window.onresize = (_) => {
      this.ngZone.run(() => {
        this.handleResizeWindow(window.innerWidth);
      });
    };

    combineLatest([this.drawerMode$, this.router.events]).subscribe(([drawerMode, event]) => {
      if (drawerMode === 'over' && event instanceof NavigationEnd) {
        this.sidenav?.close();
      }
    });
  }

  ngOnInit() {
    this.handleResizeWindow(window.innerWidth);
  }

  handleResizeWindow(width: number): void {
    if (width < 640) {
      this.drawerMode$.next('over');
      this.drawerOpened$.next(false);
    } else {
      this.drawerMode$.next('side');
      this.drawerOpened$.next(true);
    }
  }

  onSubmitSearchResult(searchResult: SearchResult) {
    this.appSubmitSearchResult.emit(searchResult);
  }

  onChangeInputValue(inputValue: string) {
    this.appChangeInputValue.emit(inputValue);
  }

  onChangeConfig(selectedConfig: string): void {
    this.appChangeConfig.emit(selectedConfig);
  }
}
