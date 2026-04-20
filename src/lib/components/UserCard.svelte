<script lang="ts">
	import type { User } from '$lib/types/user';

	let { user, userLevel }: { user: User; userLevel: number } = $props();
</script>

<article class="user-card">
	<header class="user-header">
		<div
			class={{
				avatar: true,
				banned: !user.canAccessPlatform,
				unavailable: !user.canBeAuditor
			}}
		>
			{#if user.avatarUrl}
				<img src={user.avatarUrl} alt={user.login} />
			{/if}
			<div class="banned-status">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="24"
					height="24"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2.5"
					stroke-linecap="round"
					stroke-linejoin="round"
				>
					<circle cx="12" cy="12" r="10" /><path d="m4.9 4.9 14.2 14.2" />
				</svg>
			</div>
		</div>

		<div class="user-meta">
			<div class="title-row">
				<h2 class="login">{user.login}</h2>
				{#if userLevel}
					<span class="user-level" data-level={userLevel}>
						{userLevel}
					</span>
				{/if}
			</div>
			<p class="id">#{user.id}</p>
		</div>
	</header>

	<dl class="details">
		<div>
			<dt>firstName</dt>
			<dd>{user.firstName}</dd>
		</div>

		<div>
			<dt>lastName</dt>
			<dd>{user.lastName}</dd>
		</div>
	</dl>
</article>

<style>
	.user-card {
		border-radius: 1rem;
		border: 1px solid hsla(215, 40%, 70%, 0.08);
		background: hsla(215, 40%, 70%, 0.04);
		padding: 1.25rem;
		box-shadow:
			0 8px 32px rgba(0, 0, 0, 0.25),
			inset 0 1px 0 rgba(255, 255, 255, 0.04);
		backdrop-filter: blur(10px);
	}

	.user-header {
		display: flex;
		gap: 1rem;
		align-items: flex-start;
	}

	.avatar {
		border-radius: 100%;
		overflow: hidden;
		width: 7rem;
		position: relative;
		aspect-ratio: 1;

		&.banned {
			img {
				filter: grayscale(1) opacity(0.5);
			}
			.banned-status {
				display: flex;
			}
		}
		&:hover {
			img {
				filter: none;
			}
			.banned-status {
				display: none;
			}
		}
		.banned-status {
			display: none;

			position: absolute;
			inset: 0;
			align-items: center;
			justify-content: center;
			background: hsla(0, 70%, 20%, 0.4);
			color: #ff4444;
			backdrop-filter: blur(1px);

			svg {
				filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.5));
			}
		}
	}

	.user-meta {
		min-width: 0;
		width: 100%;
	}

	.title-row {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		min-width: 0;
		width: 100%;
		justify-content: space-between;
	}

	.login {
		font-size: 1.125rem;
		font-weight: 600;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		color: hsl(210, 20%, 90%);
		letter-spacing: -0.01em;
	}

	.id {
		font-size: 0.875rem;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		color: hsl(215, 15%, 50%);
	}

	.user-level {
		display: inline-flex;
		align-items: center;
		padding: 0.2rem 0.55rem;
		border-radius: 9999px;
		font-size: 0.7rem;
		font-weight: 700;
		letter-spacing: 0.04em;
		text-transform: uppercase;
		border: 1px solid hsla(210, 70%, 60%, 0.2);
		background: hsla(210, 70%, 60%, 0.12);
		color: hsl(210, 70%, 75%);
		white-space: nowrap;
		flex-shrink: 0;
	}

	.details {
		margin-top: 1rem;
		font-size: 0.875rem;
	}

	.details dt {
		color: hsl(215, 15%, 45%);
		font-size: 0.72rem;
		text-transform: uppercase;
		letter-spacing: 0.04em;
	}

	.details dd {
		color: hsl(210, 15%, 78%);
		font-weight: 500;
	}

	/* .labels {
		margin-top: 0.5rem;
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.label-card {
		border: 1px solid rgba(255, 255, 255, 0.1);
		background: rgba(0, 0, 0, 0.2);
		padding: 0.75rem;
		border-radius: 0.75rem;
	} */
</style>
