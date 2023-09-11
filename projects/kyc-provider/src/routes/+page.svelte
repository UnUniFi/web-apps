<script>
	import { auth } from '../models/state';
	import VerifyAddress from './VerifyAddress.svelte';
	import VerifyUser from './VerifyUser.svelte';

	if (auth.currentUser === null) {
		location.href = '/auth/sign-in';
	}
</script>

<svelte:head>
	<title>Home</title>
	<meta name="description" content="Svelte demo app" />
</svelte:head>

<section>
	<h1>Start your KYC</h1>

	<VerifyUser />
	<VerifyAddress />
</section>
