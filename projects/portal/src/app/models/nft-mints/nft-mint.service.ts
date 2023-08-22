import { Injectable } from '@angular/core';
import ununificlient from 'ununifi-client';

@Injectable({
  providedIn: 'root',
})
export class NftMintService {
  constructor() {}

  buildMsgCreateClass(
    senderAddress: string,
    subclass: string,
    name: string,
    symbol: string,
    description: string,
    uri: string,
    uriHash: string,
  ) {
    const msg = new ununificlient.proto.ununifi.nftfactory.MsgCreateClass({
      sender: senderAddress,
      subclass,
      name,
      symbol,
      description,
      uri,
      uri_hash: uriHash,
    });

    return msg;
  }

  buildMsgMintNft(senderAddress: string, classId: string, nftId: string, recipientAddress: string) {
    const msg = new ununificlient.proto.ununifi.nftfactory.MsgMintNFT({
      sender: senderAddress,
      class_id: classId,
      token_id: nftId,
      recipient: recipientAddress,
    });

    return msg;
  }
}
