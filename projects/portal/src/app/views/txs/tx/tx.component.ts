import { Clipboard } from '@angular/cdk/clipboard';
import { Component, OnInit, Input } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import cosmosclient from '@cosmos-client/core';
import { CosmosTxV1beta1GetTxResponse } from '@cosmos-client/core/esm/openapi';

@Component({
  selector: 'view-tx',
  templateUrl: './tx.component.html',
  styleUrls: ['./tx.component.css'],
})
export class TxComponent implements OnInit {
  @Input()
  tx?: CosmosTxV1beta1GetTxResponse | null;

  constructor(private readonly snackBar: MatSnackBar, private clipboard: Clipboard) {}

  ngOnInit(): void {}

  unpackMsg(value: any) {
    try {
      return cosmosclient.codec.protoJSONToInstance(value);
    } catch {
      return null;
    }
  }

  unpackKey(value: any) {
    try {
      return cosmosclient.codec.protoJSONToInstance(value) as cosmosclient.PubKey;
    } catch {
      return null;
    }
  }

  constructorName(instance: any) {
    return instance.constructor.name;
  }

  entries(value: unknown) {
    return Object.entries(value as any);
  }

  copyClipboard(value: string) {
    if (value.length > 0) {
      this.clipboard.copy(value);
      this.snackBar.open('Copied to clipboard', undefined, {
        duration: 3000,
      });
    }
    return false;
  }
}
