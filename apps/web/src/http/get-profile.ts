import { apiClient } from "./api-client";

interface GetProfileResponse {
  user: {
    id: string;
    name: string | null;
    email: string;
    avatarUrl: string | null;
  };
}

export async function getProfile() {
  const result = await apiClient.get("profile").json<GetProfileResponse>();
  console.log("🚀 ~ getProfile ~ result:", result);

  return result;
}
