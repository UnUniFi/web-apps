<script lang="ts">
	let denom = '';
	let availableDenoms = [''];

	let strategy = {
		id: 0,
		denom: '',
		name: ''
	};

	function getSymbolImage(denom: string) {
		return '';
	}

	function onChangeDenom() {}
</script>

<div class="mx-auto max-w-screen-xl">
	<div class="text-xl breadcrumbs">
		<ul>
			<li>
				<a href="/yield-aggregator/vaults">Vaults</a>
			</li>
			<li>Strategies of {denom}</li>
		</ul>
	</div>
	<div class="form-control mb-4">
		<span class="label">
			<span class="label-text">Asset</span>
		</span>
		<select
			class="select select-bordered text-center w-auto sm:w-64"
			name="symbol"
			bind:value={denom}
			on:change={onChangeDenom}
		>
			<option value={undefined} disabled>
				<span>Select an Asset</span>
			</option>
			{#each availableDenoms as d}
				<option value={d}>
					{d}
				</option>
			{/each}
		</select>
	</div>

	<div class="flex flex-row flex-wrap -mr-12 -mb-12">
		<div
			*ngFor="let strategy of strategies; let i = index"
			class="pr-12 pb-12 w-full md:w-1/2 xl:w-1/3"
		>
			<div class="card bg-base-100 shadow-xl w-full">
				<div class="card-body">
					<div class="flex flex-row">
						<div class="badge badge-lg badge-primary mr-1">
							{strategy.denom}#{strategy.id}
						</div>
					</div>
					<h2 class="card-title break-all">
						<ng-container
							*ngIf="symbolImageMap && symbolImageMap[denomMetadataMap?.[strategy.strategy?.denom!]?.symbol || '']"
						>
							<div class="avatar">
								<div class="mask mask-circle w-6 h-6">
									<img src={getSymbolImage(strategy.denom)} alt="Asset Symbol" />
								</div>
							</div>
						</ng-container>
						<ng-container
							*ngIf="!symbolImageMap || !symbolImageMap[denomMetadataMap?.[strategy.strategy?.denom!]?.symbol || '']"
						>
							<span class="material-symbols-outlined">question_mark</span>
						</ng-container>
						<span>
							{strategy.name}
						</span>
					</h2>

					<a
						href="/yield-aggregator/strategies/{strategy.denom}/{strategy.id}"
						class="btn btn-outline btn-info"
					>
						View
					</a>
				</div>
			</div>
		</div>
		<p class="ml-4">There is no strategy.</p>
	</div>
</div>
