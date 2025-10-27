import { apiClient } from "./api-client";

interface CreateInviteRequest {
  org: string;
  email: string;
  role: string;
}

export async function createInvite({ org, email, role }: CreateInviteRequest) {
  await apiClient.post(`organizations/${org}/invites`, {
    json: { email, role },
  });
}
