<script lang="ts">
	import EventList from '$lib/components/EventList.svelte';
	import { rootEvents } from '$lib/state/events';
</script>

<div class="rootEvents">
	<EventList events={rootEvents} />
</div>

<style>
	.rootEvents {
		padding: 20px;
	}
</style>
