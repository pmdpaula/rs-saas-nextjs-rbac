import { apiClient } from "./api-client";

export async function rejectInvite(inviteId: string) {
  await apiClient.post(`invites/${inviteId}/reject`);
}
