<script lang="ts">
	import { formula } from 'svelte-formula';

	let processing = false;
	let email = '';
	let password = '';

	const validators = {};
	const formValidators = {};

	const { touched, validity, isFormValid } = formula({
		validators,
		formValidators
	});

	function signInGoogle() {}

	function signInGithub() {}

	function signInEmail() {}
</script>

<div class="card bg-base-100 shadow-xl">
	<div class="card-body">
		<h2 class="card-title">Sign In</h2>
		<div class="flex flex-col">
			<button class="btn btn-neutral btn-outline w-full my-2" on:click={signInGoogle}>
				Google
			</button>
			<button class="btn btn-neutral btn-outline w-full my-2" on:click={signInGithub}>
				GitHub
			</button>
		</div>
		<form on:submit={signInEmail}>
			<div class="form-control w-full">
				<span class="label">
					<span class="label-text">Email</span>
					<span class="label-text-alt" />
				</span>
				<input
					type="text"
					placeholder=""
					class="input input-bordered w-full"
					class:input-error={$touched.email && !$validity.email}
					required
					readonly={processing}
					autocomplete="email"
					bind:value={email}
					name="email"
				/>
				<span class="label">
					<span class="label-text" />
					<span class="label-text-alt" />
				</span>
			</div>
			<div class="form-control w-full">
				<span class="label">
					<span class="label-text">Password</span>
					<span class="label-text-alt" />
				</span>
				<input
					type="password"
					placeholder=""
					class="input input-bordered w-full"
					class:input-error={$touched.password && !$validity.password}
					required
					readonly={processing}
					autocomplete="current-password"
					bind:value={password}
					name="password"
				/>
				<span class="label">
					<span class="label-text" />
					<span class="label-text-alt" />
				</span>
			</div>
			<div class="card-actions justify-end">
				<button class="btn btn-primary" disabled={!$isFormValid || processing}> Sign In </button>
			</div>
		</form>
	</div>
</div>
