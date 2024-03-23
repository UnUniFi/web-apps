<script lang="ts">
	let bonusWindowIds: Promise<number[]> = new Promise((resolve) => {
		setTimeout(() => {
			resolve([1, 2, 3]);
		}, 1000);
	});
</script>

<svelte:head>
	<title>UnUniFi YieldAggregator Bonus</title>
	<meta name="description" content="UnUniFi KYC" />
</svelte:head>

<section class="my-4">
	<div class="hero bg-base-200">
		<div class="hero-content text-center">
			<div>
				<h1 class="text-5xl font-bold">Earn Bonus in UnUniFi Yield Aggregator</h1>
				<p class="py-6">Stake your Vault Share Tokens to get additional bonus rewards.</p>
			</div>
		</div>
	</div>
</section>

<section class="my-4">
	<h2 class="text-xl font-bold py-2">Rules</h2>
	<div class="flex flex-col gap-4">
		<div class="card bg-base-100 shadow-xl">
			<div class="card-body">
				<p>
					By depositing into the vaults in UnUniFi Yield Aggregator, you will receive Vault Share
					Tokens.
				</p>
			</div>
		</div>
		<div class="card bg-base-100 shadow-xl">
			<div class="card-body">
				<p>Stake your Vault Share Tokens once in a bonus window.</p>
			</div>
		</div>
		<div class="card bg-base-100 shadow-xl">
			<div class="card-body">
				<p>
					The stakers of Vault Share Tokens of the vault which are top prized in the voting will be
					rewarded with the bonus.
				</p>
			</div>
		</div>
		<div class="card bg-base-100 shadow-xl">
			<div class="card-body">
				<p>
					You can't modify the stake in the window, so carefully decide which vault and how much to
					stake.
				</p>
			</div>
		</div>
		<div class="card bg-base-100 shadow-xl">
			<div class="card-body">
				<p>
					If you want to support the popularity of the vault, you can vote by consuming GUU tokens.
					Though a part of the GUU tokens will be burned, almost all of the GUU tokens will be used
					for distribution, so voting will be better for you than the vault which you staked your
					Vault Share token loses in the voting.
				</p>
			</div>
		</div>
	</div>
</section>

<section class="my-4">
	<div class="card bg-base-100 shadow-xl">
		<div class="card-body">
			<h2 class="card-title">Bonus Windows</h2>
			<div class="overflow-x-auto">
				<table class="table">
					<thead>
						<tr>
							<th>ID</th>
							<th>Status</th>
							<th>Start Date</th>
							<th>End Date</th>
						</tr>
					</thead>
					<tbody>
						{#await bonusWindowIds}
							<div class="loading loading-ring loading-lg mx-auto" />
						{:then bonusWindowIds}
							{#if bonusWindowIds.length === 0}
								<p>No bonus window is available.</p>
							{:else}
								{#each bonusWindowIds as bonusWindowId}
									<tr class="hover cursor-pointer" data-href="/bonus-windows/{bonusWindowId}">
										<td>
											{bonusWindowId}
										</td>
										<td>U.C.</td>
										<td>U.C.</td>
										<td>U.C.</td>
									</tr>
								{/each}
							{/if}
						{/await}
					</tbody>
				</table>
			</div>
		</div>
	</div>
</section>
