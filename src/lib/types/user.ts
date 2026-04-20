import type { GetUsersQuery } from "$lib/graphql/generated";

export type User = GetUsersQuery["user_public_view"][number]