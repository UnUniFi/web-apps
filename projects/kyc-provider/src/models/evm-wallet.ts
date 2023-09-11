import { EthereumClient, w3mConnectors, w3mProvider } from '@web3modal/ethereum';
import { Web3Modal } from '@web3modal/html';
import { configureChains, createConfig } from '@wagmi/core';
import { mainnet } from '@wagmi/core/chains';

export function getEvmWalletManager() {
	const chains = [mainnet];
	const projectId = 'YOUR_PROJECT_ID';

	const { publicClient } = configureChains(chains, [w3mProvider({ projectId })]);
	const wagmiConfig = createConfig({
		autoConnect: true,
		connectors: w3mConnectors({ projectId, chains }),
		publicClient
	});
	const ethereumClient = new EthereumClient(wagmiConfig, chains);
	const web3modal = new Web3Modal({ projectId }, ethereumClient);

	return { ethereumClient, web3modal };
}
