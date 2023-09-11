<script lang="ts">
	import { formula } from 'svelte-formula';
	import { authService } from '../../../models/state';
	import { GoogleAuthProvider } from 'firebase/auth';

	let processing = false;
	let email = '';
	let password = '';
	let passwordMatch = '';

	const validators = {};
	const formValidators = {
		passwordsMatch: (values: any) =>
			values.password === values.passwordMatch ? null : 'Passwords Must Match'
	};

	const { touched, validity, isFormValid } = formula({
		validators,
		formValidators
	});

	function signUpGoogle() {
		authService.signUp(new GoogleAuthProvider());
	}

	function signUpGithub() {}

	function signUpEmail() {}
</script>

<div class="card bg-base-100 shadow-xl">
	<div class="card-body">
		<h2 class="card-title">Sign Up</h2>
		<div class="flex flex-col">
			<button class="btn btn-neutral btn-outline w-full my-2" on:click={signUpGoogle}>
				Google
			</button>
			<button class="btn btn-neutral btn-outline w-full my-2" on:click={signUpGithub}>
				GitHub
			</button>
		</div>
		<form on:submit={signUpEmail}>
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
					autocomplete="new-password"
					bind:value={password}
					name="password"
				/>
				<span class="label">
					<span class="label-text" />
					<span class="label-text-alt" />
				</span>
			</div>
			<div class="form-control w-full">
				<span class="label">
					<span class="label-text">Confirm Password</span>
					<span class="label-text-alt" />
				</span>
				<input
					type="password"
					placeholder=""
					class="input input-bordered w-full"
					class:input-error={$touched.passwordMatch && !$validity.passwordMatch}
					required
					readonly={processing}
					autocomplete="new-password"
					bind:value={passwordMatch}
					name="passwordMatch"
				/>
				<span class="label">
					<span class="label-text" />
					<span class="label-text-alt" />
				</span>
			</div>
			<div class="card-actions justify-end">
				<button class="btn btn-primary" disabled={!$isFormValid || processing}> Sign Up </button>
			</div>
		</form>
	</div>
</div>
