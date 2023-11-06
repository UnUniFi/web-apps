<script lang="ts">
	let isSearchBoxOpened = false;

	const validators = {};
	const formValidators = {};

	const { form, touched, validity, isFormValid } = formula({
		validators,
		formValidators
	});
</script>

<div class="mx-auto max-w-screen-xl">
	<div class="flex flex-row flex-wrap justify-end">
		<div class="text-xl breadcrumbs">
			<ul>
				<li><a href="..">Top</a></li>
				<li>NFTs</li>
			</ul>
		</div>
		<span class="flex-auto" />
		<a
			class="btn btn-outline btn-secondary px-8 mb-2 w-full xl:w-auto gap-2"
			href="../lenders/lender"
		>
			<span class="material-symbols-outlined">gavel</span>
			Lending Status
		</a>
		<div class="w-0 xl:w-4" />
		<a class="btn btn-outline btn-primary px-8 mb-2 w-full xl:w-auto" href="../borrowers/borrower">
			Borrowing
		</a>
	</div>

	<div class="card lg:card-side bg-base-100 shadow-xl mb-8">
		<div class="card-body">
			<div class="form-control">
				<label class="cursor-pointer label">
					<span class="label-text mr-2">Advanced Search</span>
					<input
						type="checkbox"
						class="toggle toggle-primary"
						name="openSearch"
						bind:value={isSearchBoxOpened}
					/>
					<span class="flex-auto" />
				</label>
			</div>

			<form #formRef="ngForm" (submit)="onSubmit()" *ngIf="isSearchBoxOpened">
				<div class="form-control">
					<label class="label">
						<span class="label-text">Keyword</span>
					</label>
					<label class="input-group">
						<input
							#keywordRef
							name="keyword"
							placeholder="Owner's Address, Class ID, NFT ID, etc."
							[(ngModel)]="keyword"
							class="input input-bordered w-full"
						/>
					</label>
				</div>
				<div class="form-control">
					<label class="label">
						<span class="label-text">Bidding State</span>
					</label>
					<select #stateRef [(ngModel)]="state" name="state" class="select select-bordered">
						<option [value]="undefined" disabled>Select a Bid State</option>
						<option [value]="undefined">All State</option>
						<option [value]="'LISTING'">LISTING (No Bid)</option>
						<option [value]="'BIDDING'">BIDDING</option>
						<option [value]="'SELLING_DECISION'">SELLING DECISION</option>
						<option [value]="'SUCCESSFUL_BID'">SUCCESSFUL BID (Transferring)</option>
						<option [value]="'LIQUIDATION'">LIQUIDATION</option>
					</select>
					<label class="label">
						<span class="label-text">Started After</span>
					</label>
					<label class="input-group">
						<input
							required
							type="date"
							name="expiryDate"
							[(ngModel)]="date"
							class="input input-bordered w-3/5"
						/>
						<input
							#timeRef
							type="time"
							required
							name="expiryTime"
							[(ngModel)]="time"
							class="input input-bordered w-2/5"
						/>
					</label>
				</div>
				<div class="form-control">
					<label class="label">
						<span class="label-text">Minimum Bid Expiry Date</span>
					</label>
					<label class="input-group">
						<input
							#minExpiryDateRef
							type="number"
							name="minExpiryDate"
							[(ngModel)]="minExpiryDate"
							class="input input-bordered w-full"
							[min]="0"
							[step]="1"
							pattern="^[0-9]*\.?[0-9]{(0, 4)}$"
						/>
						<span>Days</span>
					</label>
				</div>
				<div class="form-control">
					<label class="label">
						<span class="label-text">Minimum Interest Rate (Coming soon)</span>
					</label>
					<label class="input-group">
						<input
							#interestRef
							name="interest"
							[(ngModel)]="interestRate"
							class="input input-bordered w-full"
							[min]="0"
							pattern="^[0-9]*\.?[0-9]{(0, 6)}$"
						/>
						<span>%</span>
					</label>
					<input
						type="range"
						min="0"
						max="20"
						class="range mt-1"
						[(ngModel)]="interestRate"
						name="slider"
					/>
				</div>
				<div class="card-actions justify-end mt-4">
					<button type="button" class="btn btn-warning btn-outline gap-2" (click)="onRefresh()">
						<span class="material-symbols-outlined">refresh</span>
						Refresh
					</button>
					<button class="btn btn-primary gap-2">
						<span class="material-symbols-outlined">photo_library</span>
						Search NFTs
					</button>
				</div>
			</form>
		</div>
	</div>

	<ng-container *ngIf="listedNfts === null; then loading; else loaded" />
	<ng-template #loading>
		<p class="text-center">
			<span class="loading loading-ring loading-lg" />
		</p>
	</ng-template>
	<ng-template #loaded>
		<ng-container *ngIf="!listedNfts || listedNfts.length === 0; then empty; else filled" />
	</ng-template>

	<ng-template #filled>
		<div class="flex flex-row flex-wrap -mr-12 -mb-12">
			{#each nfts as nft, i}
				<div class="pr-12 pb-12 md:w-1/3 lg:w-1/4 xl:w-1/5">
					<div class="card w-full glass shadow-xl">
						<figure class="aspect-square w-full">
							<img
								src={images[i] || 'assets/UnUniFi-logo.png'}
								alt=""
								class="h-full object-cover"
							/>
							<img
								*ngIf="!images"
								src="assets/UnUniFi-logo.png"
								alt=""
								class="h-full object-cover"
							/>
						</figure>
						<div class="card-body">
							<span class="badge badge-primary">{nft.listing?.state}</span>
							<h2 class="card-title break-all">
								<span>
									{nftsMetadata[i].name}
								</span>
								<span>{nft.listing?.nft_id?.token_id}</span>
							</h2>
							<a
								class="btn btn-outline btn-info"
								href={`./${nft.listing?.nft_id?.class_id}/${nft.listing?.nft_id?.token_id}`}
							>
								View
							</a>
						</div>
					</div>
				</div>
			{/each}
		</div>
	</ng-template>
	<ng-template #empty>
		<p>There is no Listing NFT.</p>
	</ng-template>
</div>
