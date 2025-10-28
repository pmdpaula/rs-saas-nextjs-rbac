import type { Role } from "@saas/auth";

import { apiClient } from "./api-client";

interface GetPenddingInvitesResponse {
  invites: {
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
  }[];
}

export async function getPenddingInvites() {
  const result = await apiClient
    .get(`pending-invites`)
    .json<GetPenddingInvitesResponse>();

  return result;
}
