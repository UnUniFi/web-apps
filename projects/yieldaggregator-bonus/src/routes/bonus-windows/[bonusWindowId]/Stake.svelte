<script lang="ts">
	export let bonusWindowId: string;

	import { formula } from 'svelte-formula';
	import type { VaultShareStaking } from '../../../models/YieldaggregatorBonus.types';

	let processing = false;
	let vaultId = 0;
	let shareAmount = 0;

	const validators = {};
	const formValidators = {};

	const { touched, validity, isFormValid } = formula({
		validators,
		formValidators
	});

	$: vaultShareStaking = new Promise((resolve) => {
		setTimeout(() => {
			resolve({ bonusWindowId } as any);
		}, 1000);
	}) as Promise<VaultShareStaking | undefined>;

	$: alreadyStaked = vaultShareStaking.then((v) => v !== undefined);

	function stake() {}
</script>

<section class="my-4">
	<div class="card bg-base-100 shadow-xl">
		<div class="card-body">
			<h2 class="card-title">Stake your Vault Share Token</h2>

			{#await alreadyStaked then alreadyStaked}
				{#if alreadyStaked}
					<p>You have already staked in this bonus window</p>
				{:else}
					<form on:submit={stake}>
						<div class="form-control w-full">
							<span class="label">
								<span class="label-text">Bonus Window ID</span>
								<span class="label-text-alt" />
							</span>
							<input
								type="text"
								placeholder=""
								class="input input-bordered w-full"
								required
								readonly
								bind:value={bonusWindowId}
								name="bonusWindowId"
							/>
							<span class="label">
								<span class="label-text" />
								<span class="label-text-alt" />
							</span>
						</div>
						<div class="form-control w-full">
							<span class="label">
								<span class="label-text">Vault ID</span>
								<span class="label-text-alt" />
							</span>
							<input
								type="number"
								placeholder=""
								class="input input-bordered w-full"
								class:input-error={$touched.vaultId && !$validity.vaultId}
								required
								readonly={processing}
								bind:value={vaultId}
								name="vaultId"
							/>
							<span class="label">
								<span class="label-text" />
								<span class="label-text-alt" />
							</span>
						</div>
						<div class="form-control w-full">
							<span class="label">
								<span class="label-text">Share Amount</span>
								<span class="label-text-alt" />
							</span>
							<div class="join">
								<input
									type="number"
									placeholder=""
									class="join-item input input-bordered w-full"
									class:input-error={$touched.shareAmount && !$validity.shareAmount}
									required
									readonly={processing}
									bind:value={shareAmount}
									name="shareAmount"
								/>
								<button disabled class="join-item btn">YA-SHARE-</button>
							</div>

							<span class="label">
								<span class="label-text" />
								<span class="label-text-alt" />
							</span>
						</div>
						<div class="card-actions justify-end">
							<button class="btn btn-primary" disabled={!$isFormValid || processing}>
								Sign In
							</button>
						</div>
					</form>
				{/if}
			{/await}
		</div>
	</div>
</section>
