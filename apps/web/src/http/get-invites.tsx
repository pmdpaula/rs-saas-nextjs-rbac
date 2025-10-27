import type { Role } from "@saas/auth";

import { apiClient } from "./api-client";

interface GetInvitesResponse {
  invites: {
    id: string;
    email: string;
    role: Role;
    createdAt: string;
    author: {
      id: string;
      name: string | null;
    } | null;
  }[];
}

export async function getInvites(org: string) {
  const result = await apiClient
    .get(`organizations/${org}/invites`)
    .json<GetInvitesResponse>();

  return result;
}
