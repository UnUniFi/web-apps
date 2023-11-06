<script lang="ts">
	let denom = '';
	let strategy = {
		name: '',
		description: '',
		git_url: '',
		contract_address: ''
	};
	let apr = 0;

	function getSymbolImage(denom: string) {
		return '';
	}
</script>

<div class="mx-auto max-w-screen-xl">
	<div class="text-xl breadcrumbs">
		<ul>
			<li><a href="/yield-aggregator/vaults">Vaults</a></li>
			<li>
				<a href="..">Strategies {denom}</a>
			</li>
			<li>{strategy.name}</li>
		</ul>
	</div>
	<div class="w-full md:w-auto mb-8">
		<div class="card bg-base-100 shadow-xl w-full">
			<div #cardRef class="card-body">
				<h2 class="card-title">
					<ng-container
						*ngIf="symbolImageMap && symbolImageMap[denomMetadataMap?.[denom||'']?.symbol || '']"
					>
						<div class="avatar">
							<div class="mask mask-circle w-6 h-6">
								<img src={getSymbolImage(denom)} alt="Asset Symbol" />
							</div>
						</div>
					</ng-container>
					<ng-container
						*ngIf="!symbolImageMap || !symbolImageMap[denomMetadataMap?.[denom||'']?.symbol || '']"
					>
						<span class="material-symbols-outlined">question_mark</span>
					</ng-container>
					<span>
						{strategy.name}
					</span>
					<div class="badge badge-primary">{denom}</div>
					<div class="badge badge-info">NO KYC</div>
				</h2>
				<p *ngIf="strategy?.strategy?.description" class="m-8" style="white-space: pre-wrap">
					{strategy.description}
				</p>

				<table class="table w-full">
					<tbody>
						<tr>
							<td>Strategy ID</td>
							<td>{id}</td>
						</tr>
						<tr>
							<td>Contract Address</td>
							<td class="font-mono break-all">{strategy.contract_address}</td>
						</tr>
						<tr>
							<td>Git URL</td>
							<td class="break-all">
								<a href={strategy.git_url} target="_blank">{strategy.git_url}</a>
							</td>
						</tr>
					</tbody>
				</table>

				<div class="stats flex flex-col md:flex-row">
					<div class="stat">
						<div class="stat-title" *ngIf="!strategyInfo?.certainty">Estimated APR</div>
						<div class="stat-title" *ngIf="strategyInfo?.certainty">
							APR
							<div class="badge badge-info">Secure</div>
						</div>

						<div class="stat-value text-secondary">
							<ng-container *ngIf="strategyAPR !== null">
								{apr.toFixed(2)}
							</ng-container>
							<ng-container *ngIf="strategyAPR === null">
								<div class="animate-pulse bg-slate-200 w-32 h-12 rounded-full" />
							</ng-container>
						</div>
						<div class="stat-desc" />
					</div>
				</div>
			</div>
		</div>
	</div>

	<h3>Vaults that contains this strategy</h3>
	<div class="flex flex-row flex-wrap -mr-12 -mb-12">
		<div *ngFor="let vault of vaults; let i = index" class="pr-12 pb-12 w-full md:w-1/2 xl:w-1/3">
			<div class="card bg-base-100 shadow-xl w-full">
				<div class="card-body">
					<h2 class="card-title break-all">
						<ng-container
							*ngIf="symbolImageMap && symbolImageMap[denomMetadataMap?.[denom||'']?.symbol || '']"
						>
							<div class="avatar">
								<div class="mask mask-circle w-6 h-6">
									<img src={getSymbolImage(denom)} alt="Asset Symbol" />
								</div>
							</div>
						</ng-container>
						<ng-container
							*ngIf="!symbolImageMap || !symbolImageMap[denomMetadataMap?.[denom||'']?.symbol || '']"
						>
							<span class="material-symbols-outlined">question_mark</span>
						</ng-container>
						<span>Vault #{vault.id}</span>
					</h2>

					<div class="stats">
						<div class="stat" *ngIf="weights">
							<div class="stat-title">Weight</div>
							<div class="stat-value">{Number(0).toFixed(2)}</div>
							<div class="stat-desc" />
						</div>
					</div>

					<a href="/yield-aggregator/vaults/{vault.id}" class="btn btn-outline btn-info"> View </a>
				</div>
			</div>
		</div>
		<p *ngIf="!vaults?.length" class="ml-4">There is no vault.</p>
	</div>
</div>
