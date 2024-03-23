<script lang="ts">
	import { auth, userService } from '../models/state';
	import { guard } from './auth-guard';
	guard();

	const userId = auth
		.authStateReady()
		.then(() =>
			auth.currentUser?.uid ? userService.userIdByAuthUid(auth.currentUser!.uid) : undefined
		);

	const user = userId.then((id) => {
		return id ? userService.get(id) : undefined;
	});
</script>

<header>
	<div class="navbar glass px-4 sticky top-0 z-50 shadow-xl">
		<h1 class="text-xl font-bold">KYC</h1>
		<span class="flex-auto" />
		<div class="flex flex-row gap-4">
			{#await user then user}
				{#if user}
					<div class="flex-none">
						<div class="dropdown dropdown-end">
							<label tabindex="0" class="btn btn-ghost btn-sm btn-circle avatar">
								<img
									src={user.image_url}
									loading="lazy"
									width="32px"
									height="32px"
									class="rounded-full"
								/>
							</label>
							<ul tabindex="0" class="menu dropdown-content bg-base-100 shadow-xl rounded-box w-48">
								<li>
									<a href="/auth/sign-out">Sign Out</a>
								</li>
							</ul>
						</div>
					</div>
				{:else}
					<div class="flex-none">
						<ul class="menu menu-horizontal px-1">
							<li>
								<a href="/auth/sign-in">Sign In</a>
							</li>
							<li>
								<a href="/auth/sign-up">Sign Up</a>
							</li>
						</ul>
					</div>
				{/if}
			{/await}
		</div>
	</div>
</header>
