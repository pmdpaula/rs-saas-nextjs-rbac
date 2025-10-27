import { apiClient } from "./api-client";

interface RevokeInviteRequest {
  org: string;
  inviteId: string;
}

export async function revokeInvite({ org, inviteId }: RevokeInviteRequest) {
  await apiClient.delete(`organizations/${org}/invites/${inviteId}`);
}
