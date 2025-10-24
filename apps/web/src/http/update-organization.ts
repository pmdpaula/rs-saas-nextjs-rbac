import { apiClient } from "./api-client";

interface UpdateOrganizationRequest {
  org: string;
  name: string;
  domain: string | null;
  shouldAttachUsersByDomain: boolean;
}

export async function updateOrganization({
  org,
  name,
  domain,
  shouldAttachUsersByDomain,
}: UpdateOrganizationRequest) {
  await apiClient.put(`organizations/${org}`, {
    json: { name, domain, shouldAttachUsersByDomain },
  });
}
