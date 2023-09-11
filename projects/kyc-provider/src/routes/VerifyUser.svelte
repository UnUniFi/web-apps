<script lang="ts">
	import { formula } from 'svelte-formula';
	import { auth, functionsService } from '../models/state';

	let processing = false;
	let givenName = '';
	let familyName = '';

	const validators = {};
	const formValidators = {};

	const { touched, validity, isFormValid } = formula({
		validators,
		formValidators
	});

	let complyCube = {};

	async function startVerification() {
		const email = auth.currentUser?.email || '';
		const token = functionsService.getKycToken(givenName, familyName, email);
		complyCube = (window as any).ComplyCube.mount({
			token,
			onComplete
		});
	}

	function onComplete(data: any) {
		console.log('Capture complete', data);
		location.href = '/';
	}
</script>

<svelte:head>
	<script src="https://assets.complycube.com/web-sdk/v1/complycube.min.js"></script>
	<link rel="stylesheet" href="https://assets.complycube.com/web-sdk/v1/style.css" />
</svelte:head>

<div class="card bg-base-100 shadow-xl">
	<div class="card-body">
		<h2 class="card-title">Verify Your Identity</h2>
		<form on:submit={startVerification}>
			<div class="form-control w-full">
				<span class="label">
					<span class="label-text">Given Name</span>
					<span class="label-text-alt" />
				</span>
				<input
					type="text"
					placeholder=""
					class="input input-bordered w-full"
					class:input-error={$touched.givenName && !$validity.givenName}
					required
					readonly={processing}
					autocomplete="given-name"
					bind:value={givenName}
					name="givenName"
				/>
				<span class="label">
					<span class="label-text" />
					<span class="label-text-alt" />
				</span>
			</div>
			<div class="form-control w-full">
				<span class="label">
					<span class="label-text">Family Name</span>
					<span class="label-text-alt" />
				</span>
				<input
					type="text"
					placeholder=""
					class="input input-bordered w-full"
					class:input-error={$touched.familyName && !$validity.familyName}
					required
					readonly={processing}
					autocomplete="family-name"
					bind:value={familyName}
					name="familyName"
				/>
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

<!-- This is where the Web SDK will be mounted -->
<div id="complycube-mount" />
