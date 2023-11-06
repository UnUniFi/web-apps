<script lang="ts">
	const listedNftsLength = 0;
	const allBidsLength = 0;
	const ownListedNftsLength = 0;
</script>

<svelte:head>
	<title>UnUniFi NFLoan</title>
	<meta name="description" content="UnUniFi KYC" />
</svelte:head>

<div class="card lg:card-side bg-base-100 shadow-xl rounded-lg mb-8">
	<figure class="aspect-square lg:w-1/4">
		<img
			alt="Lender"
			src="https://img.freepik.com/free-vector/cryptocurrency-market-abstract-concept-illustration_335657-2166.jpg"
		/>
	</figure>
	<div class="card-body">
		<h2 class="card-title">
			Lend your Tokens to an NFT Holder
			<!-- The button to open modal -->
			<label for="modal-lend" class="label-text cursor-pointer">
				<span class="material-symbols-outlined">help</span>
			</label>
		</h2>
		<!-- Put this part before </body> tag -->
		<input type="checkbox" id="modal-lend" class="modal-toggle" />
		<div class="modal modal-bottom sm:modal-middle">
			<div class="modal-box">
				<h3 class="font-bold text-lg">What is the Lender?</h3>
				<p>
					The lender can lend out tokens at a set interest rate and repayment term. In addition to
					earning interest, you may have the opportunity to buy NFTs at discounted prices.
				</p>
				<p>
					The interest begins accruing as soon as the NFT lister chooses to borrow from your
					deposited tokens.
				</p>
				<div class="modal-action">
					<label for="modal-lend" class="btn">Okay</label>
				</div>
			</div>
		</div>
		<p>Set a deposit for NFT bidding and lend tokens to NFT owners.</p>

		<div class="stats">
			<div class="stat">
				<div class="stat-title">Listed NFTs</div>
				<div class="stat-value text-info">{listedNftsLength}</div>
				<div class="stat-desc" />
			</div>
			<div class="stat">
				<div class="stat-title">Bids</div>
				<div class="stat-value text-accent">{allBidsLength}</div>
				<div class="stat-desc" />
			</div>
		</div>

		<div class="card-actions justify-end">
			<a class="btn btn-accent btn-outline gap-2" href="lenders/lender">
				<span>Lending Status</span>
			</a>

			<a class="btn btn-primary gap-2 lg:px-8" href="nfts">
				<span class="material-symbols-outlined">monetization_on</span>
				<span>Start to Lend Assets</span>
			</a>
		</div>
	</div>
</div>

<div class="card lg:card-side bg-base-100 shadow-xl rounded-lg w-full">
	<figure class="aspect-square lg:w-1/4">
		<img
			alt="Borrower"
			src="https://img.freepik.com/free-vector/mobile-banking-return-money-from-purchases-conduct-financial-transactions-remotely-with-mobile-device-vector-isolated-concept-metaphor-illustration_335657-2799.jpg"
		/>
	</figure>
	<div class="card-body">
		<h2 class="card-title">
			Borrow Tokens against your Collateralized NFT
			<!-- The button to open modal -->
			<label for="modal-borrow" class="label-text cursor-pointer">
				<span class="material-symbols-outlined">help</span>
			</label>
		</h2>
		<!-- Put this part before </body> tag -->
		<input type="checkbox" id="modal-borrow" class="modal-toggle" />
		<div class="modal modal-bottom sm:modal-middle">
			<div class="modal-box">
				<h3 class="font-bold text-lg">What is the Borrower?</h3>
				<p>
					You can list an NFT and choose to borrow tokens from the bidder. You can also choose to
					sell the NFT directly to the bidder.
				</p>
				<p>In the case that loan repayment is late, the NFT will be automatically liquidated.</p>
				<div class="modal-action">
					<label for="modal-borrow" class="btn">Okay</label>
				</div>
			</div>
		</div>
		<p>List NFT, received funds from the bidders and borrow tokens.</p>

		<div class="stats">
			<div class="stat">
				<div class="stat-title">Listed NFTs</div>
				<div class="stat-value text-secondary">{ownListedNftsLength}</div>
				<div class="stat-desc" />
			</div>
		</div>

		<div class="card-actions justify-end">
			<a class="btn btn-secondary btn-outline gap-2 lg:px-8" href="borrowers/borrower">
				<span class="material-symbols-outlined">add_photo_alternate</span>
				<span class="break-all">Manage Your NFTs</span>
			</a>
		</div>
	</div>
</div>
