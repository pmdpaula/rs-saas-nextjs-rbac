import { apiClient } from "./api-client";

interface RemoveMemberRequest {
  org: string;
  memberId: string;
}

export async function removeMember({ org, memberId }: RemoveMemberRequest) {
  await apiClient.delete(`organizations/${org}/members/${memberId}`);
}
