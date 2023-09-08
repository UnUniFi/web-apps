<script>
	import '../app.css';
	import Header from './Header.svelte';
</script>

<div class="app">
  <script src="static/config.js"></script>

	<Header />

	<main class="max-w-xl mx-auto">
		<slot />
	</main>

	<footer>
		<p>visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to learn SvelteKit</p>
	</footer>
</div>
