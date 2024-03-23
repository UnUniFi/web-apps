<script lang="ts">
	import '../app.css';
	import Header from './Header.svelte';
</script>

<svelte:head>
	<link
		href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined"
		rel="stylesheet"
	/>
</svelte:head>

<div class="app">
	<Header />

	<main class="mx-auto px-4 max-w-screen-xl">
		<slot />
	</main>

	<footer class="footer bg-neutral text-neutral-content">
		<nav />
	</footer>
</div>
