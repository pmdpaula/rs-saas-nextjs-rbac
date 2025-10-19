import { apiClient } from "./api-client";

interface GetOrganizationsResponse {
  organizations: {
    id: string;
    name: string;
    slug: string;
    avatarUrl: string;
  }[];
}

export async function getOrganizations() {
  const result = await apiClient
    .get("organizations")
    .json<GetOrganizationsResponse>();

  return result;
}
