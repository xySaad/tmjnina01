import type { EventFieldsFragment } from '$lib/graphql/generated';

export type Event = EventFieldsFragment;
export type EventUserRel = EventFieldsFragment['usersRelation'][number];
