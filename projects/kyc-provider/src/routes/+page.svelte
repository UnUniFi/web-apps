<script lang="ts">
	import { auth, userService } from '../models/state';
	import VerifyAddress from './VerifyAddress.svelte';
	import VerifyUser from './VerifyUser.svelte';

	auth.authStateReady().then(() => {
		if (auth.currentUser === null) {
			location.href = '/auth/sign-in';
		}
	});

	const userId = auth
		.authStateReady()
		.then(() => userService.userIdByAuthUid(auth.currentUser!.uid));

	const user = userId.then((id) => {
		return id ? userService.get(id) : undefined;
	});
</script>

<svelte:head>
	<title>Home</title>
	<meta name="description" content="Svelte demo app" />
</svelte:head>

<section>
	<h1 class="text-5xl font-bold py-4">Start your KYC</h1>

	{#await user}
		<div class="loading loading-ring loading-lg mx-auto" />
	{:then user}
		{#if user}
			<div class="flex flex-col gap-4">
				<VerifyUser {user} />
				<VerifyAddress {user} />
			</div>
		{/if}
	{/await}
</section>
