<script lang="ts">
	import { formula } from 'svelte-formula';
	import { evmWalletManager, cosmosWalletManager, addressProofService } from '../models/state';
	import { signMessage } from '@wagmi/core';
	import type { User } from '@local/common';

	export let user: User;

	let processing = false;
	let reload = true;

	let addressProofs = addressProofService.list(user.id);

	$: if (reload) {
		addressProofs = addressProofService.list(user.id);
	}
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
			display: 'Neutron',
			value: 'neutron'
		},
		{
			display: 'Sei',
			value: 'sei'
		}
	];

	const validators = {};
	const formValidators = {};

	const { form, touched, validity, isFormValid } = formula({
		validators,
		formValidators
	});

	async function removeAddress(i: number) {}

	function getMessage(address: string) {
		return `The owner of the address ${address} declares that he/she agrees to the KYC process and terms.`;
	}

	async function submit() {
		processing = true;

		try {
			switch (chain) {
				case 'evm': {
					await evmWalletManager.web3modal.openModal();
					const account = evmWalletManager.ethereumClient.getAccount();
					const address = account.address;
					if (!address) {
						return;
					}
					const message = getMessage(address);
					const signatureHex = (await signMessage({ message })).substring(2);

					await addressProofService.create({
						user_id: user.id,
						address,
						message_hex: Buffer.from(message).toString('hex'),
						signature_hex: signatureHex
					});
					reload = true;

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
					if (!chainWallet.client.signArbitrary) {
						return;
					}
					const message = getMessage(address);
					const result = await chainWallet.client.signArbitrary(
						chainWallet.chainId,
						address,
						message
					);
					const signatureBase64 = result.signature;
					console.log(signatureBase64);
					const signatureHex = Buffer.from(signatureBase64, 'base64').toString('hex');
					console.log(signatureHex);

					await addressProofService.create({
						user_id: user.id,
						address,
						message_hex: Buffer.from(message).toString('hex'),
						signature_hex: signatureHex
					});
					reload = true;

					break;
				}
			}
		} catch (e) {
			console.error(e);
		} finally {
			processing = false;
		}
	}
</script>

<div class="card bg-base-100 shadow-xl">
	<div class="card-body">
		<h2 class="card-title">Verify Your Addresses</h2>

		{#await addressProofs}
			<div class="loading loading-ring loading-lg mx-auto" />
		{:then addressProofs}
			{#each addressProofs || [] as addressProof, i}
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
		{/await}

		<form use:form on:submit={submit}>
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
						required
						bind:value={chain}
						name="chain"
					>
						{#each chains as chain}
							<option value={chain.value}>{chain.display}</option>
						{/each}
					</select>
				</div>
				<span class="label">
					<span class="label-text" />
					<span class="label-text-alt" />
				</span>
			</div>

			<div class="card-actions justify-end">
				<button class="btn btn-primary" disabled={!$isFormValid || processing}>
					Add Address
				</button>
			</div>
		</form>
	</div>
</div>
