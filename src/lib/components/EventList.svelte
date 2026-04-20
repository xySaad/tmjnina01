<script lang="ts">
	import EventCard from '$lib/components/EventCard.svelte';
	import { eventsMap } from '$lib/state/events';
	import type { Event } from '$lib/types/events';
	import type { EmblaOptionsType, EmblaPluginType } from 'embla-carousel';
	import emblaCarouselSvelte from 'embla-carousel-svelte';

	const { events }: { events: Event[] } = $props();

	const groupRootEvents = () => {
		// eslint-disable-next-line svelte/prefer-svelte-reactivity
		const eventsByPathMap = new Map<string, Event[]>();
		events.forEach((event) => {
			const key = event.path;
			const eventGroup = eventsByPathMap.get(key);
			if (eventGroup) eventGroup.push(event);
			else eventsByPathMap.set(key, [event]);
		});
		return eventsByPathMap;
	};

	const emblaParams: { options: EmblaOptionsType; plugins: EmblaPluginType[] } = {
		options: { dragFree: true, containScroll: 'keepSnaps' },
		plugins: []
	};
</script>

<div class="eventsList">
	{#each groupRootEvents() as [path, group] (path)}
		<header>{path}</header>
		<div class="embla" use:emblaCarouselSvelte={emblaParams}>
			<div class="embla__container">
				{#each group as { id } (id)}
					{@const event = eventsMap.get(id)}
					{#if event}
						<div class="embla__slide">
							<EventCard {event} />
						</div>
					{:else}
						Events #{id} Not Found
					{/if}
				{/each}
			</div>
		</div>
	{/each}
</div>

<style>
	.eventsList {
		display: flex;
		flex-direction: column;
		gap: 10px;
	}

	.embla {
		/* overflow: scroll; */
		user-select: none;
		cursor: grab;

		&:active {
			cursor: grabbing;
		}
	}

	.embla__container {
		display: flex;
		gap: 10px;
	}

	.embla__slide {
		flex: 0 0 250px;
		min-width: 0;
		background: none;
		border: none;
		padding: 0;
		text-align: left;
	}
</style>
