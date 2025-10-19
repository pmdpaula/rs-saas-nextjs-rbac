import { Role } from "@saas/auth";

import { apiClient } from "./api-client";

interface GetMembershipResponse {
  membership: {
    id: string;
    role: Role;
    userId: string;
    organizationId: string;
  };
}

export async function getMembership(org: string) {
  const result = await apiClient
    .get(`organizations/${org}/membership`)
    .json<GetMembershipResponse>();

  return result;
}
