import { apiClient } from "./api-client";

interface ShutdownOrganizationRequest {
  org: string;
}

export async function shutdownOrganization({
  org,
}: ShutdownOrganizationRequest) {
  await apiClient.delete(`organizations/${org}`);
}
