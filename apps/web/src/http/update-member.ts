import { apiClient } from "./api-client";

interface UpdateMemberRequest {
  org: string;
  memberId: string;
  role: string;
}

export async function updateMember({
  org,
  memberId,
  role,
}: UpdateMemberRequest) {
  await apiClient.put(`organizations/${org}/members/${memberId}`, {
    json: { role },
  });
}
