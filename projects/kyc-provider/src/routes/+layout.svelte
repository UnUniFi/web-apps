<script>
	import '../app.css';
	import Header from './Header.svelte';
</script>

<div class="app">
	<Header />

	<main class="mx-auto px-4 max-w-screen-xl">
		<slot />
	</main>

	<footer class="footer bg-neutral text-neutral-content">
		<nav />
	</footer>
</div>
