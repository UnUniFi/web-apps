<script lang="ts">
	import { authService } from '../../../models/state';

	authService.signOut().then(() => {
		location.href = '/';
	});
</script>

<div class="card bg-base-100 shadow-xl">
	<div class="card-body">
		<h2 class="card-title">Succeeded To Sign Out</h2>
		<p>Redirecting...</p>
	</div>
</div>
