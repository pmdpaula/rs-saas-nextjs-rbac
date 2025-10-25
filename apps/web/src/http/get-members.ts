import type { Role } from "@saas/auth";

import { apiClient } from "./api-client";

interface GetMembersResponse {
  members: {
    id: string;
    userId: string;
    role: Role;
    name: string | null;
    avatarUrl: string | null;
    email: string;
  }[];
}

export async function getMembers(org: string) {
  const result = await apiClient
    .get(`organizations/${org}/members`, {
      // next: {
      //   tags: [`${org}/members`],
      // }
    })
    .json<GetMembersResponse>();

  return result;
}
