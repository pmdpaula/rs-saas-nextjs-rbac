import type { Role } from "@saas/auth";

import { apiClient } from "./api-client";

interface GetInviteResponse {
  invite: {
    id: string;
    email: string;
    role: Role;
    createdAt: string;
    organization: {
      name: string;
    };
    author: {
      id: string;
      name: string | null;
      avatarUrl: string | null;
    } | null;
  };
}

export async function getInvite(inviteId: string) {
  const result = await apiClient
    .get(`invites/${inviteId}`)
    .json<GetInviteResponse>();

  return result;
}
