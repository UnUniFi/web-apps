import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';

export interface Item {
  id: string;
  collectionName: string;
  price: string;
  contractAddress: string;
  tokenStandard: string;
  blockchain: string;
  liked: number;
  image: string;
  avatarUrl: string;
  createrName: string;
  createrUrl: string;
  description: string;
}

@Component({
  selector: 'app-assets',
  templateUrl: './assets.component.html',
  styleUrls: ['./assets.component.css'],
})
export class AssetsComponent implements OnInit {
  items$: Observable<Item[]>;
  constructor() {
    const items = [
      {
        id: '1',
        collectionName: 'Good Monkey',
        price: '129',
        contractAddress: '0x23581767a106ae21c074b2276D25e5C3e136a68b',
        tokenStandard: 'ERC-721',
        blockchain: 'Ethereum',
        liked: 24,
        image:
          'https://lh3.googleusercontent.com/1EVmMZzJyHZkN7B6Hgq2BRz4GTfkuJH0AVPaaBTM2jpDtu6N_eIbsD7LizOmyielZQxmKwaZTBG7_x-kC9_T6AMqIFvQ3JnaNYRm=s550',
        avatarUrl:
          'https://lh3.googleusercontent.com/aJBpzLB_hI3zX_PlcxsJukmbNoikpOJrhtJUrz7q6XXbsBD59r7LHQq7vmusTtVn9ex4WsQf1KFzz_fXy8FkovvDwOErH5IMNWSlsA=s0',
        createrName: 'moondust',
        createrUrl: ' https://opensea.io/moondust?tab=created',
        description: 'Switzerland based artist. Approved creator & ambassador on Sign Art. ...',
      },
      {
        id: '2',
        collectionName: 'The Raven',
        price: '129',
        contractAddress: '0x23581767a106ae21c074b2276D25e5C3e136a68b',
        tokenStandard: 'ERC-721',
        blockchain: 'Ethereum',
        liked: 24,
        image:
          'https://lh3.googleusercontent.com/wzHle0nGsxzq0tPRevPGkmWMAHQeF_QDtUg6fed7R610wb--1ubSx6C5l4sLnF-QDR4PX6cMaLTWFht36AzpkFSV9TmJQvAZ8PKl=w600',
        avatarUrl:
          'https://lh3.googleusercontent.com/dajx50F-VzEd3YeUMmZhKWPy42X7vq0d4Emqe7BB2c5XDYToFgpbi_VlmpHMofZJ6RVi7VEJ-G_WAH3D0MN48fAmAV0Uq2S1iY_yAQs=s0',
        createrName: 'TomSachsDeployer',
        createrUrl: ' https://opensea.io/TomSachsDeployer?tab=created',
        description: 'Tom Sachs Rocket Factory is a trans-dimensional manufacturing plant: ...',
      },
      {
        id: '3',
        collectionName: 'SushiCats #3597',
        price: '129',
        contractAddress: '0x23581767a106ae21c074b2276D25e5C3e136a68b',
        tokenStandard: 'ERC-721',
        blockchain: 'Ethereum',
        liked: 24,
        image:
          'https://lh3.googleusercontent.com/V7CBs320JUMkH5RPmouMLL-4ZhYn0tSNanRPlUxA6RUCLzOTYQoghZ0D5tfevOvTonulbFxWGDWxP1EqT0NH2ABD9OQH4PPDCf696Jk=w600',
        avatarUrl:
          'https://lh3.googleusercontent.com/Rdy4rpIQwSk5Gdzxc0HueX9pXARDtz9J2ifBXBus2n-eLzqu-3xTh1nC24Nl8Uh857Wk7Ax9QUbWuHANqp0dMlRNWYIuhltLoJBTag=s0',
        createrName: 'SushiCatsTeam',
        createrUrl: ' https://opensea.io/SushiCatsTeam?tab=created',
        description: 'S5,555 collectibles of Modern Anime Aesthetics bring you into the world ...',
      },
      {
        id: '4',
        collectionName: 'HAPE #2979',
        price: '129',
        contractAddress: '0x23581767a106ae21c074b2276D25e5C3e136a68b',
        tokenStandard: 'ERC-721',
        blockchain: 'Ethereum',
        liked: 24,
        image:
          'https://lh3.googleusercontent.com/Tx1kHuEvnVdYUJ3gP0fRYeZgqtZflJk312AEphyHYd9wRbWYo3X9V6htuD0ZCeLrUwRAtgyrt4sp9LAvUQ5AAiW2gjZz6ut8Uy1A=w600',
        avatarUrl:
          'https://lh3.googleusercontent.com/aJBpzLB_hI3zX_PlcxsJukmbNoikpOJrhtJUrz7q6XXbsBD59r7LHQq7vmusTtVn9ex4WsQf1KFzz_fXy8FkovvDwOErH5IMNWSlsA=s0',
        createrName: 'TeamHape',
        createrUrl: ' https://opensea.io/TeamHape?tab=created',
        description: '8192 next-generation, high-fashion HAPES.',
      },
      {
        id: '5',
        collectionName: 'DeadFellaz #5784',
        price: '129',
        contractAddress: '0x23581767a106ae21c074b2276D25e5C3e136a68b',
        tokenStandard: 'ERC-721',
        blockchain: 'Ethereum',
        liked: 24,
        image:
          'https://lh3.googleusercontent.com/nNcKiB6MuhxWlfWs5uyTSD3xra3cmaC5lSUCMJFYhcyL7rMelQtEKr1f_eJU5HFBKS-DHhMnBRowyTkKm12NaSFLP38FyiupkAXbTv8=w600',
        avatarUrl:
          'https://lh3.googleusercontent.com/jJFVwGaM_JuN0aw1ZI_qR6F2noeowaSLKV9GJmQx6jz9Z73ZhTYRyQC5SWCMxOukUttJFTzMj28p4xv1b1SJRVVYmigz782pqoylTTU=s0',
        createrName: 'DeadFellaz',
        createrUrl: ' https://opensea.io/Deadfellaz?tab=created',
        description: 'A collection of 10,000 undead NFTs minted on the Ethereum blockchain. ...',
      },
      {
        id: '6',
        collectionName: 'Moments on Film #95',
        price: '129',
        contractAddress: '0x23581767a106ae21c074b2276D25e5C3e136a68b',
        tokenStandard: 'ERC-721',
        blockchain: 'Ethereum',
        liked: 24,
        image:
          'https://lh3.googleusercontent.com/kYjRVe-j-DkzUg5ghCLt4Mtfgp68invaBj_AiunH_l9mLwmwpBli53Z7_A8HTwiJ3CdZir_OB3jRlf4AeSYSdy4bwEaZB1BsIWwPdQ=w600',
        avatarUrl:
          'https://lh3.googleusercontent.com/s0Hq5cB-8WjMM9Q-SZwEOwXksVOf_EfG9aj1KGfoQhtTgHHkkHXfksV1XXa-eDPPlN3XTr1i513g7RnOYG340nqTO5hpgCZvGyCo=s0',
        createrName: 'johnwingfield',
        createrUrl: ' https://opensea.io/johnwingfield?tab=created',
        description: 'Location: Iceland Filmstock: Kodak Portra 800',
      },
    ];
    this.items$ = of(items);
  }

  ngOnInit(): void {}
}
