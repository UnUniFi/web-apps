<script lang="ts">
	let vaults: Promise<{ id: number; name: string }[]> = new Promise((resolve) => {
		setTimeout(() => {
			resolve([{ id: 0, name: '' }]);
		}, 1000);
	});
</script>

<section class="my-4">
	<div class="card bg-base-100 shadow-xl">
		<div class="card-body">
			<h2 class="card-title">Ranking</h2>
			<div class="overflow-x-auto">
				<table class="table">
					<thead>
						<tr>
							<th>Rank</th>
							<th>ID</th>
							<th>Name</th>
							<th>Description</th>
						</tr>
					</thead>
					<tbody>
						{#await vaults}
							<div class="loading loading-ring loading-lg mx-auto" />
						{:then vaults}
							{#if vaults.length === 0}
								<p>No vault is voted.</p>
							{:else}
								{#each vaults as vault, i}
									<tr class="hover cursor-pointer">
										<td>{i}</td>
										<td>
											{vault.id}
										</td>
										<td>
											{vault.name}
										</td>
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
