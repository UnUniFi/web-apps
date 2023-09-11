<script lang="ts">
	import { formula } from 'svelte-formula';
	import type { AddressProof } from '../models/users';
	import { evmWalletManager, cosmosWalletManager } from '../models/state';
	import { signMessage } from '@wagmi/core';

	let processing = false;
	let addressProofs: AddressProof[] = [];
	let chain = '';

	const chains = [
		{
			display: 'EVM (Ethereum, Avalanche, Polygon, BSC, etc.)',
			value: 'evm'
		},
		{
			display: 'UnUniFi',
			value: 'ununifi'
		},
		{
			display: 'Sei',
			value: 'sei'
		}
	];

	const validators = {};
	const formValidators = {};

	const { touched, validity, isFormValid } = formula({
		validators,
		formValidators
	});

	function removeAddress(i: number) {
		addressProofs.splice(i, 1);
		addressProofs = addressProofs;
	}

	function getMessage(address: string) {
		return `The owner of the address ${address} declares that he/she agrees to the KYC process and terms.`;
	}

	async function addAddress() {
		switch (chain) {
			case 'evm': {
				if (evmWalletManager.ethereumClient.getAccount().address === undefined) {
					await evmWalletManager.web3modal.openModal();
				}
				const account = evmWalletManager.ethereumClient.getAccount();
				const address = account.address;
				if (!address) {
					return;
				}
				const message = getMessage(address);
				const signatureHex = (await signMessage({ message })).substring(2);

				addressProofs = [
					...addressProofs,
					{
						address,
						message_hex: Buffer.from(message).toString('hex'),
						signature_hex: signatureHex
					}
				];

				break;
			}
			default: {
				const chainWallet = cosmosWalletManager.getChainWallet(chain, 'keplr-extension');
				chainWallet.activate();
				await chainWallet.connect(true);

				const address = chainWallet.address;
				if (!address) {
					return;
				}
				const result = await chainWallet.sign([], undefined, getMessage(address));
				const signature = result.signatures[0];
				const signatureHex = Buffer.from(signature).toString('hex');

				console.log(result);

				break;
			}
		}
	}

	async function submit() {}
</script>

<div class="card bg-base-100 shadow-xl">
	<div class="card-body">
		<h2 class="card-title">Verify Your Addresses</h2>
		<form on:submit={submit}>
			{#each addressProofs as addressProof, i}
				<div class="form-control w-full">
					<span class="label">
						<span class="label-text">Address</span>
						<span class="label-text-alt" />
					</span>
					<div class="join">
						<input
							type="text"
							placeholder=""
							class="join-item input input-bordered w-full"
							class:input-error={$touched[`address-${i}`] && !$validity[`address-${i}`]}
							required
							readonly
							bind:value={addressProof.address}
							name="address-{i}"
						/>
						<button
							type="button"
							class="join-item btn btn-error"
							disabled={processing}
							on:click={() => removeAddress(i)}
						>
							Remove
						</button>
					</div>
					<span class="label">
						<span class="label-text" />
						<span class="label-text-alt" />
					</span>
				</div>
			{/each}

			<div class="form-control w-full">
				<span class="label">
					<span class="label-text">Add Your Address</span>
					<span class="label-text-alt" />
				</span>
				<div class="join">
					<select
						placeholder="Chain"
						class="join-item select select-bordered w-full"
						class:input-error={$touched.chain && !$validity.chain}
						bind:value={chain}
						name="chain"
					>
						{#each chains as chain}
							<option value={chain.value}>{chain.display}</option>
						{/each}
					</select>
					<button
						type="button"
						class="join-item btn btn-neutral"
						disabled={processing}
						on:click={addAddress}
					>
						Add
					</button>
				</div>
				<span class="label">
					<span class="label-text" />
					<span class="label-text-alt" />
				</span>
			</div>

			<div class="card-actions justify-end">
				<button class="btn btn-primary" disabled={!$isFormValid || processing}> Submit </button>
			</div>
		</form>
	</div>
</div>
