import { Client } from '$lib/graphql/client';
import { GetEventChildrenDocument } from '$lib/graphql/generated';
import type { Event } from '$lib/types/events';

export const { rootEvents, childEvents } = await Client.request(GetEventChildrenDocument);

export const eventsMap = new Map<number, Event>();
for (const event of [...rootEvents, ...childEvents]) {
	eventsMap.set(event.id, event);
}
