import { PrimaryNft } from './nft-pawnshop.model';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class NftPawnshopPocService {
  constructor() {}

  getPocValue(address?: string, classId?: string, nftId?: string): string {
    // primary nft list
    const primaryList: PrimaryNft[] = [];
    const matchPrimary = primaryList.find((primary) => primary.address == address);
    if (matchPrimary && matchPrimary.class_id == classId && matchPrimary.nft_id == nftId) {
      console.log('primary NFT');
      return '1000GUU';
    }

    if (address && classId) {
      const lastChar = address.slice(-1);
      const lastCharCode = lastChar.charCodeAt(0);
      console.log('lastCharCode : ' + lastCharCode);
      const userPointType = this.changeQuinary(this.getLastNum(lastCharCode));
      console.log('address binary: ' + userPointType);
      // class list
      const classPointList = [
        {
          class: 'ununifi-4C356B50F7D9B8A735309E5F5F3F8748E1F8FF28',
          binary: 0,
        },
        {
          class: 'ununifi-55BE4AD4921F5258EE780346EF61739FDA1F88A0',
          binary: 1,
        },
      ];
      const classPointType = classPointList.find((cls) => cls.class == classId)?.binary;
      console.log('class ID binary: ' + classPointType);
      if (userPointType == classPointType) {
        if (nftId) {
          const nftLastChar = nftId.slice(-1);
          const nftLastCharCode = nftLastChar.charCodeAt(0);
          const nftPointType = this.changeQuinary(this.getLastNum(nftLastCharCode));
          console.log('NFT ID binary: ' + nftPointType);
          if (classPointType == nftPointType) {
            console.log('3 arg match');
            return '1000GUU';
          } else {
            console.log('address & class ID match');
            return '100GUU';
          }
        } else {
          console.log('address & class ID match,  no NFT ID');
          return '100GUU';
        }
      } else {
        console.log('no arg match');
        return '1GUU';
      }
    } else {
      console.log('no address or class ID');
      return '1GUU';
    }
  }

  changeQuinary(num: number) {
    return num % 2;
  }
  getLastNum(num: number) {
    return num % 10;
  }
}
