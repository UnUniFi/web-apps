import { CosmosSDKService } from '../../../models/cosmos-sdk.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { rest } from '@cosmos-client/core';
import { CosmosTxV1beta1GetTxResponse, } from '@cosmos-client/core/esm/openapi';
import { combineLatest, Observable } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import { txParseMsgs, } from "./../../../utils/tx-parser"
import { txTitle, txSignature } from './../../../models/cosmos/tx-common.model';
import { cosmosclient, proto, } from '@cosmos-client/core';

@Component({
  selector: 'app-transaction',
  templateUrl: './tx.component.html',
  styleUrls: ['./tx.component.css'],
})
export class TxComponent implements OnInit {
  txHash$: Observable<string>;
  tx$: Observable<CosmosTxV1beta1GetTxResponse>;
  txDetails$: Observable<txTitle[] | undefined>;
  txSignature$: Observable<txSignature | undefined>;
  txTypes: string[] | undefined = []

  constructor(private route: ActivatedRoute, private cosmosSDK: CosmosSDKService) {
    this.txHash$ = this.route.params.pipe(map((params) => params.tx_hash));
    this.tx$ = combineLatest([this.cosmosSDK.sdk$, this.txHash$]).pipe(
      mergeMap(([sdk, hash]) => rest.tx.getTx(sdk.rest, hash).then((res) => res.data)),
    );
    this.txDetails$ = this.tx$.pipe(
      map(x => {
        const tx = x?.tx
        if (!tx) return undefined
        const parsedTx = txParseMsgs(tx)
        this.txTypes = parsedTx?.map(tx => tx.txType)
        return parsedTx
      })
    )
    this.txDetails$.subscribe(x => console.log("debug_tx_comp", x))
    this.txSignature$ = this.tx$.pipe(
      map(tx => {
        const publicKeyInfo = tx.tx?.auth_info?.signer_infos?.[0].public_key
        const publicKey = cosmosclient.codec.protoJSONToInstance(cosmosclient.codec.castProtoJSONOfProtoAny(publicKeyInfo))
        if (publicKey instanceof proto.cosmos.crypto.secp256k1.PubKey) {
          const address = cosmosclient.AccAddress.fromPublicKey(publicKey)
          return {
            publicKey: publicKey.accPubkey(),
            accAddress: address.toString(),
            type: publicKey.constructor.name
          }
        } else {
          return {
            publicKey: "",
            accAddress: "",
            type: ""
          }
        }
      })
    )
  }

  ngOnInit() { }
}
