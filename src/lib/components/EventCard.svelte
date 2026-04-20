<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import type { Event } from '$lib/types/events';

	const { event, variant = 'default' }: { event: Event; variant?: 'default' | 'leaf' } = $props();

	type Status = 'active' | 'upcoming' | 'ended';

	const getStatus = (startAt: string, endAt: string): Status => {
		const now = Date.now();
		const start = new Date(startAt).getTime();
		const end = new Date(endAt).getTime();
		if (now < start) return 'upcoming';
		if (now > end) return 'ended';
		return 'active';
	};

	const getProgress = (startAt: string, endAt: string): number => {
		const now = Date.now();
		const start = new Date(startAt).getTime();
		const end = new Date(endAt).getTime();
		return Math.min(100, Math.max(0, Math.round(((now - start) / (end - start)) * 100)));
	};

	const formatDate = (d: string): string =>
		new Date(d).toLocaleString('en-GB', {
			day: '2-digit',
			month: 'short',
			year: 'numeric',
			hour: 'numeric',
			minute: 'numeric'
		});

	const status = $derived(getStatus(event.startAt, event.endAt));
	const progress = $derived(getProgress(event.startAt, event.endAt));
	const userCount = $derived(event.usersRelation.length);
	const childCount = $derived(event.children.length);
</script>

<article class="card" class:leaf={variant === 'leaf'} data-status={status}>
	<div class="card-top">
		<div class="card-name">{event.object.name}</div>
		<div class="card-id">#{event.id}</div>
	</div>

	<span class="badge" data-status={status}>
		{#if status === 'active'}Active{:else if status === 'upcoming'}Upcoming{:else}Ended{/if}
	</span>

	<div class="progress-bar">
		<div class="progress-fill" style="width: {progress}%"></div>
	</div>

	<dl class="dates">
		<div class="date-row">
			<dt>Start</dt>
			<dd>{formatDate(event.startAt)}</dd>
		</div>
		<div class="date-row">
			<dt>End</dt>
			<dd>{formatDate(event.endAt)}</dd>
		</div>
	</dl>

	<div class="card-footer">
		<span class="type-pill">{event.object.type}</span>
		<span class="meta-right">
			<!-- {#if childCount > 0}
				<button class="children-link" onclick={() => goto(resolve(`/events/${event.id}`))}>
					{childCount} events
					<span class="chevron" aria-hidden="true"></span>
				</button>
			{:else if userCount > 0}
				<span class="users-count">{userCount} users</span>
			{:else}
				<span class="users-count">—</span>
			{/if} -->
		</span>
	</div>
	<div class="card-actions">
		<button
			class="children-link"
			onclick={() => goto(resolve(`/events/${event.id}/users`))}
			disabled={userCount < 1}
		>
			{userCount} users
			<span class="chevron" aria-hidden="true"></span>
		</button>
		<button class="children-link" onclick={() => goto(resolve(`/events/${event.id}`))}>
			{childCount} events
			<span class="chevron" aria-hidden="true"></span>
		</button>
	</div>
</article>

<style>
	.card {
		background: hsl(213, 60%, 10%);
		border: 1px solid hsl(213, 40%, 18%);
		border-radius: var(--border-radius-lg);
		padding: 14px 16px;
		transition:
			border-color 0.15s,
			background 0.15s;
		display: flex;
		flex-direction: column;
		gap: 0;
	}

	.card:hover {
		background: hsl(213, 60%, 13%);
		border-color: hsl(213, 40%, 25%);
	}

	.card.leaf[data-status='active'] {
		border-left: 2px solid #34d399;
		border-radius: 0 var(--border-radius-lg) var(--border-radius-lg) 0;
	}
	.card.leaf[data-status='ended'] {
		border-left: 2px solid hsl(213, 40%, 30%);
		border-radius: 0 var(--border-radius-lg) var(--border-radius-lg) 0;
	}
	.card.leaf[data-status='upcoming'] {
		border-left: 2px solid #60a5fa;
		border-radius: 0 var(--border-radius-lg) var(--border-radius-lg) 0;
	}

	.card-top {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		gap: 8px;
		margin-bottom: 8px;
	}

	.card-name {
		font-size: 14px;
		font-weight: 500;
		color: #e8edf2;
		line-height: 1.3;
	}

	.card-id {
		font-size: 11px;
		color: #6b7f96;
		white-space: nowrap;
		flex-shrink: 0;
	}

	.badge {
		display: inline-block;
		font-size: 11px;
		font-weight: 500;
		padding: 2px 7px;
		border-radius: var(--border-radius-md);
		width: fit-content;
	}
	.badge[data-status='active'] {
		background: hsl(158, 60%, 12%);
		color: #6ee7b7;
	}
	.badge[data-status='ended'] {
		background: hsl(213, 30%, 14%);
		color: #7a90a8;
	}
	.badge[data-status='upcoming'] {
		background: hsl(213, 60%, 14%);
		color: #93c5fd;
	}

	.progress-bar {
		height: 3px;
		background: hsl(213, 40%, 16%);
		border-radius: 2px;
		overflow: hidden;
		margin-top: 8px;
		margin-bottom: 10px;
	}

	.progress-fill {
		height: 100%;
		border-radius: 2px;
		transition: width 0.3s ease;
	}
	.card[data-status='active'] .progress-fill {
		background: #34d399;
	}
	.card[data-status='ended'] .progress-fill {
		background: hsl(213, 30%, 30%);
	}
	.card[data-status='upcoming'] .progress-fill {
		background: #60a5fa;
	}

	.dates {
		font-size: 12px;
		display: flex;
		flex-direction: column;
		gap: 3px;
		margin-bottom: 10px;
	}

	.date-row {
		display: flex;
		justify-content: space-between;
	}

	.dates dt {
		color: #4e6278;
	}
	.dates dd {
		color: #a8bdd0;
	}

	.card-footer {
		display: flex;
		align-items: center;
		justify-content: space-between;
		border-top: 1px solid hsl(213, 40%, 16%);
		padding-top: 10px;
		margin-top: auto;
	}

	.type-pill {
		font-size: 11px;
		padding: 2px 7px;
		border-radius: var(--border-radius-md);
		background: hsl(213, 40%, 14%);
		color: #7a90a8;
		border: 1px solid hsl(213, 40%, 20%);
	}

	.meta-right {
		font-size: 12px;
		color: #6b7f96;
	}

	.children-link {
		color: #93c5fd;
		display: flex;
		align-items: center;
		gap: 3px;
		cursor: pointer;
	}

	.chevron {
		display: inline-block;
		width: 12px;
		height: 12px;
		position: relative;
		top: 1px;
	}

	.chevron::after {
		content: '';
		display: block;
		width: 5px;
		height: 5px;
		border-right: 1.5px solid currentColor;
		border-top: 1.5px solid currentColor;
		transform: rotate(45deg);
		margin-left: 2px;
		margin-top: 3px;
	}

	.card-actions {
		margin-top: 10px;
		display: flex;
		justify-content: space-between;
		font-size: 12px;
	}
	.children-link:disabled {
		opacity: 0.35;
		color: #6b7f96;
		cursor: not-allowed;
		background: hsl(213, 40%, 12%);
		border-color: hsl(213, 40%, 18%);
	}

	.children-link:disabled:hover {
		transform: none;
	}
</style>
