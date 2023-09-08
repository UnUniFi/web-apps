<script lang="ts">
	export let bonusWindowId: string;

	const alreadyStaked = false;
</script>

{#if alreadyStaked}
	<p>You have already staked in this bonus window</p>
{:else}
	<p>Stake in this bonus window</p>
{/if}
