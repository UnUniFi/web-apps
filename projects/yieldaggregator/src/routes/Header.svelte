<script lang="ts">
	import { cosmosWalletManager, currentChainWallet } from '../models/state';

	async function connect(wallet: string) {
		const chainWallet = cosmosWalletManager.getChainWallet('ununifi', wallet);
		chainWallet.activate();
		await chainWallet.connect(true);

		currentChainWallet.set(chainWallet);

		const address = chainWallet.address;
		if (!address) {
			return;
		}
	}

	async function disconnect() {
		await $currentChainWallet?.disconnect();
		$currentChainWallet?.inactivate();
		currentChainWallet.set(null);
	}
</script>

<header>
	<div class="navbar glass px-4 sticky top-0 z-50 shadow-xl">
		<h1 class="text-xl font-bold">UnUniFi YieldAggregator</h1>
		<span class="flex-auto" />
		<div class="flex flex-row gap-4">
			<div class="flex-none">
				<div class="dropdown dropdown-end">
					<label tabindex="0" class="btn btn-ghost btn-circle avatar">
						<span class="material-symbols-outlined"> wallet </span>
					</label>
					<div tabindex="0" class="dropdown-content card bg-base-100 shadow-xl w-96">
						<div class="card-body">
							{#if $currentChainWallet}
								<div class="join">
									<input
										class="join-item input input-bordered w-full"
										bind:value={$currentChainWallet.address}
										readonly
									/>
									<button type="button" class="join-item btn btn-info">
										<span class="material-symbols-outlined"> content_copy </span>
									</button>
								</div>
							{/if}
							<ul class="menu">
								{#if !$currentChainWallet}
									<li>
										<a on:click={() => connect('keplr-extension')}>Connect Keplr</a>
									</li>
									<li>
										<a on:click={() => connect('leap-extension')}>Connect Leap</a>
									</li>
								{:else}
									<li>
										<a on:click={disconnect}>Disconnect</a>
									</li>
								{/if}
							</ul>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</header>
