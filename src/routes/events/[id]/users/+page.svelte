<script lang="ts">
	import UserCard from '$lib/components/UserCard.svelte';
	import { eventsMap } from '$lib/state/events';
	import { recordsMap, usersMap } from '$lib/state/users';
	import type { User } from '$lib/types/user';
	import type { PageProps } from './$types';

	const { params }: PageProps = $props();
	const event = $derived(eventsMap.get(+params.id));

	let search = $state('');

	type SortKey = 'createdAt' | 'level' | 'userAuditRatio' | 'available';
	type SortDir = 'asc' | 'desc';

	let sortKey = $state<SortKey>('createdAt');
	let sortDir = $state<SortDir>('desc');

	const sortOptions: { key: SortKey; label: string }[] = [
		{ key: 'createdAt', label: 'Joined' },
		{ key: 'level', label: 'Level' },
		{ key: 'userAuditRatio', label: 'Audit' },
		{ key: 'available', label: 'Available' }
	];

	function toggleSort(key: SortKey) {
		if (sortKey === key) {
			sortDir = sortDir === 'asc' ? 'desc' : 'asc';
		} else {
			sortKey = key;
			sortDir = 'desc';
		}
	}

	const getEventUsers = () => {
		const users = event?.usersRelation
			.map((eventUserRel) => {
				const user = usersMap.get(eventUserRel.userId);
				if (user) return { ...user, eventUserRel };
			})
			.filter(
				(u): u is NonNullable<typeof u> =>
					u !== undefined &&
					[u.login, u.firstName, u.lastName, `${u.firstName} ${u.lastName}`].some((str) =>
						str?.toLocaleLowerCase().includes(search.trim())
					)
			);

		if (!users) return users;

		const dir = sortDir === 'asc' ? 1 : -1;

		return [...users].sort((a, b) => {
			switch (sortKey) {
				case 'createdAt': {
					const aVal = a.eventUserRel.createdAt ? new Date(a.eventUserRel.createdAt).getTime() : 0;
					const bVal = b.eventUserRel.createdAt ? new Date(b.eventUserRel.createdAt).getTime() : 0;
					return (aVal - bVal) * dir;
				}
				case 'level': {
					const aVal = a.eventUserRel.level;
					const bVal = b.eventUserRel.level;
					return (aVal - bVal) * dir;
				}
				case 'userAuditRatio': {
					const aVal = a.eventUserRel.userAuditRatio
						? Number(a.eventUserRel.userAuditRatio)
						: -Infinity;
					const bVal = b.eventUserRel.userAuditRatio
						? Number(b.eventUserRel.userAuditRatio)
						: -Infinity;
					return (aVal - bVal) * dir;
				}
				case 'available': {
					if (!a.canAccessPlatform) return 1 * dir;
					if (!b.canAccessPlatform) return -1 * dir;
					const getVal = (id?: number | null): number => {
						if (!id) return -Infinity;
						const endAt = recordsMap.get(id);
						if (endAt === undefined) return -Infinity;
						if (endAt === null) return Infinity;
						return new Date(endAt.toString()).getTime();
					};
					return (getVal(a.id) - getVal(b.id)) * dir;
				}
			}
		});
	};

	const eventUsers = $derived(getEventUsers());
</script>

<div class="eventUsers">
	<div class="controls">
		<input bind:value={search} type="search" placeholder="Search by login or name" class="search" />
		<div class="sort-bar" role="group" aria-label="Sort users">
			<span class="sort-label">Sort</span>
			{#each sortOptions as opt (opt.key)}
				<button
					class="sort-btn"
					class:active={sortKey === opt.key}
					onclick={() => toggleSort(opt.key)}
					aria-pressed={sortKey === opt.key}
				>
					{opt.label}
					<span class="sort-arrow" class:visible={sortKey === opt.key}>
						{#if sortDir === 'asc'}
							↑
						{:else}
							↓
						{/if}
					</span>
				</button>
			{/each}
		</div>
	</div>

	<div class="usersList">
		{#each eventUsers as user (user?.id)}
			<div class="user">
				<UserCard {user} eventUserRel={user.eventUserRel} />
			</div>
		{/each}
	</div>
</div>

<style>
	.controls {
		display: flex;
		align-items: center;
		gap: 12px;
		flex-wrap: wrap;
	}

	.search {
		border-radius: 12px;
		padding: 5px 12px;
		width: 200px;
		max-width: 600px;
	}

	.search::placeholder {
		color: rgba(255, 255, 255, 0.45);
	}

	.search:focus {
		border-color: rgba(255, 255, 255, 0.28);
		background: rgba(255, 255, 255, 0.09);
		box-shadow:
			0 0 0 4px rgba(255, 255, 255, 0.06),
			0 10px 28px rgba(0, 0, 0, 0.24);
		transform: translateY(-1px);
	}

	.sort-bar {
		display: flex;
		align-items: center;
		gap: 4px;
		padding: 4px;
		border-radius: 10px;
		background: hsla(215, 40%, 70%, 0.04);
		border: 1px solid hsla(215, 40%, 70%, 0.08);
		backdrop-filter: blur(10px);
	}

	.sort-label {
		font-size: 0.68rem;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.07em;
		color: hsl(215, 15%, 40%);
		padding: 0 6px 0 4px;
		user-select: none;
	}

	.sort-btn {
		display: inline-flex;
		align-items: center;
		gap: 4px;
		padding: 0.25rem 0.6rem;
		border-radius: 7px;
		border: 1px solid transparent;
		background: transparent;
		font-size: 0.72rem;
		font-weight: 600;
		letter-spacing: 0.03em;
		text-transform: uppercase;
		color: hsl(215, 15%, 50%);
		cursor: pointer;
		transition:
			color 0.18s ease,
			background 0.18s ease,
			border-color 0.18s ease,
			box-shadow 0.18s ease;

		&:hover {
			color: hsl(210, 20%, 78%);
			background: hsla(215, 40%, 70%, 0.07);
		}

		&.active {
			color: hsl(210, 70%, 75%);
			background: hsla(210, 70%, 60%, 0.12);
			border-color: hsla(210, 70%, 60%, 0.2);
			box-shadow: inset 0 1px 0 hsla(210, 70%, 80%, 0.06);
		}
	}

	.sort-arrow {
		font-size: 0.8rem;
		line-height: 1;
		opacity: 0;
		transform: translateY(1px);
		transition:
			opacity 0.18s ease,
			transform 0.18s ease;

		&.visible {
			opacity: 0.9;
			transform: translateY(0);
		}
	}

	.eventUsers {
		padding: 20px;
		display: flex;
		gap: 10px;
		flex-direction: column;
	}

	.usersList {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
		gap: 16px;
		align-items: stretch;
	}

	.user {
		min-width: 0;
		display: contents;
	}
</style>
