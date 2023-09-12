<script>
	import '../app.css';
	import Header from './Header.svelte';
</script>

<svelte:head>
	<link
		href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined"
		rel="stylesheet"
	/>
</svelte:head>

<div class="app bg-base-200">
	<script src="static/config.js"></script>

	<Header />

	<main class="mx-auto p-4 max-w-screen-xl">
		<slot />
	</main>

	<footer class="footer p-4 bg-neutral text-neutral-content">
		<nav />
	</footer>
</div>
