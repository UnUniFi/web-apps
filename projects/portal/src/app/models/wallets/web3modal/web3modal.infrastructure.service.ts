import { ConfigService } from '../../config.service';
import { IWeb3ModalInfrastructureService } from './web3modal.service';
import { Injectable } from '@angular/core';
import { configureChains, createConfig } from '@wagmi/core';
import { mainnet } from '@wagmi/core/chains';
import { EthereumClient, w3mConnectors, w3mProvider } from '@web3modal/ethereum';
import { Web3Modal } from '@web3modal/html';

@Injectable({
  providedIn: 'root',
})
export class Web3ModalInfrastructureService implements IWeb3ModalInfrastructureService {
  constructor(private readonly configService: ConfigService) {}

  getEvmWalletManager() {
    const chains = [mainnet];
    const projectId = '4e66683f93467fd09ea8a876ea88f621';

    const { publicClient } = configureChains(chains, [w3mProvider({ projectId })]);
    const wagmiConfig = createConfig({
      autoConnect: true,
      connectors: w3mConnectors({ projectId, chains }),
      publicClient,
    });
    const ethereumClient = new EthereumClient(wagmiConfig, chains);
    const web3modal = new Web3Modal({ projectId }, ethereumClient);

    return { ethereumClient, web3modal };
  }
}
