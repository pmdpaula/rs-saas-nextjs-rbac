import { apiClient } from "./api-client";

export async function acceptInvite(inviteId: string) {
  await apiClient.post(`invites/${inviteId}/accept`);
}
