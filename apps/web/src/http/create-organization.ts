import { apiClient } from "./api-client";

interface CreateOrganizationRequest {
  name: string;
  domain: string | null;
  shouldAttachUsersByDomain: boolean;
}

export async function createOrganization({
  name,
  domain,
  shouldAttachUsersByDomain,
}: CreateOrganizationRequest) {
  await apiClient.post("organizations", {
    json: { name, domain, shouldAttachUsersByDomain },
  });
}
