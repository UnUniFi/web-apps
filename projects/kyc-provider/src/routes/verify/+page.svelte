<script lang="ts">
	import { formula } from 'svelte-formula';

	let processing = false;
	let name = '';
	let country = '';
	let postalCode = '';

	const validators = {};
	const formValidators = {};

	const { touched, validity, isFormValid } = formula({
		validators,
		formValidators
	});

	function submit() {}
</script>

<div class="card bg-base-100 shadow-xl">
	<div class="card-body">
		<h2 class="card-title">Verify Your Identity</h2>
		<form on:submit={submit}>
			<div class="form-control w-full">
				<span class="label">
					<span class="label-text">Name</span>
					<span class="label-text-alt" />
				</span>
				<input
					type="text"
					placeholder=""
					class="input input-bordered w-full"
					class:input-error={$touched.name && !$validity.name}
					required
					readonly={processing}
					autocomplete="name"
					bind:value={name}
					name="name"
				/>
				<span class="label">
					<span class="label-text" />
					<span class="label-text-alt" />
				</span>
			</div>
			<div class="form-control w-full">
				<span class="label">
					<span class="label-text">Country</span>
					<span class="label-text-alt" />
				</span>
				<select
					class="select select-bordered w-full"
					class:input-error={$touched.country && !$validity.country}
					required
					disabled={processing}
					bind:value={country}
					name="country"
				>
					<option />
				</select>
				<span class="label">
					<span class="label-text" />
					<span class="label-text-alt" />
				</span>
			</div>
			<div class="form-control w-full">
				<span class="label">
					<span class="label-text">Postal Code</span>
					<span class="label-text-alt" />
				</span>
				<input
					type="text"
					placeholder=""
					class="input input-bordered w-full"
					class:input-error={$touched.name && !$validity.name}
					required
					readonly={processing}
					autocomplete="postal-code"
					bind:value={postalCode}
					name="name"
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
