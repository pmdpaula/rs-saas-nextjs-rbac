import { apiClient } from "./api-client";

interface CreateProjectRequest {
  org: string;
  name: string;
  description: string | null;
}

export async function createProject({
  org,
  name,
  description,
}: CreateProjectRequest) {
  await apiClient.post(`organizations/${org}/projects`, {
    json: { name, description },
  });
}
