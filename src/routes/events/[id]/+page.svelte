<script lang="ts">
	import EventList from '$lib/components/EventList.svelte';
	import { eventsMap } from '$lib/state/events';
	import type { Event } from '$lib/types/events';
	import type { PageProps } from './$types';

	const { params }: PageProps = $props();

	const getEventChildren = (ev: Event) => {
		const children: Event[] = [];
		ev.children.forEach((child) => {
			const childEvent = eventsMap.get(child.id);
			if (childEvent) children.push(childEvent);
		});
		return children;
	};

	const parentEvent = $derived(eventsMap.get(+params.id));
</script>

{#if parentEvent}
	<div class="rootEvents">
		<EventList events={getEventChildren(parentEvent)} />
	</div>
{:else}
	Event #{params.id} not found
{/if}

<style>
	.rootEvents {
		padding: 20px;
	}
</style>
