import { type GetEventChildrenQuery } from '$lib/graphql/generated';
export type Event = GetEventChildrenQuery['allEvents'][number];
