import { Client } from '$lib/graphql/client';
import { GetUsersDocument } from '$lib/graphql/generated';
import type { User } from '$lib/types/user';

export const { user_public_view } = await Client.request(GetUsersDocument);

export const usersMap = new Map<number, User>();

for (const user of user_public_view) {
	if (!user.id) continue;
	usersMap.set(user.id, user);
}
