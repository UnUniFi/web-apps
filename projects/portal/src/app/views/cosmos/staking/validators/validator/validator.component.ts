import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { cosmosclient, proto } from '@cosmos-client/core';
import { InlineResponse20041Validators } from '@cosmos-client/core/esm/openapi';

@Component({
  selector: 'view-validator',
  templateUrl: './validator.component.html',
  styleUrls: ['./validator.component.css'],
})
export class ValidatorComponent implements OnInit, OnChanges {
  @Input()
  validator?: InlineResponse20041Validators | null;

  publicKey?: string;

  constructor() {}

  ngOnInit(): void {}

  ngOnChanges() {
    const pubKey = cosmosclient.codec.protoJSONToInstance(
      cosmosclient.codec.castProtoJSONOfProtoAny(this.validator?.consensus_pubkey),
    );

    if (!(pubKey instanceof proto.cosmos.crypto.ed25519.PubKey)) {
      return;
    }
    this.publicKey = Buffer.from(pubKey.key).toString('hex');
  }
}
