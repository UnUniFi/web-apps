import { DialogRef } from '@angular/cdk/dialog';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ListedClasses200ResponseClassesInner } from 'ununifi-client/esm/openapi';

@Component({
  selector: 'view-nfts-dialog',
  templateUrl: './nfts-dialog.component.html',
  styleUrls: ['./nfts-dialog.component.css'],
})
export class NftsDialogComponent implements OnInit {
  @Input()
  classID: string | undefined;
  @Input()
  listedClass?: ListedClasses200ResponseClassesInner | null;
  @Input()
  classImage?: string | null;
  @Input()
  nftImages?: string[] | null;
  @Output()
  appSubmit: EventEmitter<string>;

  constructor(public dialogRef: DialogRef) {
    this.appSubmit = new EventEmitter();
  }

  ngOnInit(): void {}

  onSubmit(nftID: string) {
    this.appSubmit.emit(nftID);
  }

  onClickClose() {
    this.dialogRef.close();
  }
}
