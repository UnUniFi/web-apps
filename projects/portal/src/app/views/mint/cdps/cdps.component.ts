import { Component, Input, OnInit } from '@angular/core';
import * as crypto from 'crypto';
import { CdpAll200ResponseCdpInner } from 'ununifi-client/esm/openapi';

@Component({
  selector: 'view-cdps',
  templateUrl: './cdps.component.html',
  styleUrls: ['./cdps.component.css'],
})
export class CdpsComponent implements OnInit {
  @Input()
  cdps?: (CdpAll200ResponseCdpInner | undefined)[] | null;

  constructor() {}

  ngOnInit(): void {}

  getColorCode(cdp: CdpAll200ResponseCdpInner) {
    const hash = crypto
      .createHash('sha256')
      .update(Buffer.from(`${cdp.cdp!.owner}/${cdp.cdp!.collateral!.denom}`))
      .digest()
      .toString('hex');

    return `#${hash.substr(0, 6)}`;
  }
}
