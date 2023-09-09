<script>
	import Ranking from './Ranking.svelte';
	import Stake from './Stake.svelte';
	import { page } from '$app/stores';

	$: bonusWindowId = $page.params.bonusWindowId;
</script>

<Ranking />

<Stake {bonusWindowId} />
