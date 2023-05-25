import { Injectable } from '@angular/core';
import ununificlient from 'ununifi-client';

@Injectable({
  providedIn: 'root',
})
export class NftMintService {
  constructor() {}

  buildMsgMintNft(senderAddress: string, classId: string, nftId: string, recipientAddress: string) {
    const msg = new ununificlient.proto.ununifi.nftmint.MsgMintNFT({
      sender: senderAddress,
      class_id: classId,
      nft_id: nftId,
      recipient: recipientAddress,
    });

    return msg;
  }
}
