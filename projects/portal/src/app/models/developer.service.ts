import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class DeveloperService {
  developerAddresses: string[] = [
    'ununifi155u042u8wk3al32h3vzxu989jj76k4zcu44v6w',
    'ununifi1v0h8j7x7kfys29kj4uwdudcc9y0nx6twwxahla',
    'ununifi1y3t7sp0nfe2nfda7r9gf628g6ym6e7d44evfv6',
    'ununifi1pp2ruuhs0k7ayaxjupwj4k5qmgh0d72wrdyjyu',
    'ununifi1gnfsfp340h33glkccjet38faxwkspwpz3r4raj',
  ];
  constructor() {}

  isDeveloper(address: string): boolean {
    return this.developerAddresses.includes(address);
  }
}
