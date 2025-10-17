import { apiClient } from "./api-client";

interface SignInWithGitHubRequest {
  code: string;
}

interface SignInWithGitHubResponse {
  token: string;
}

export async function signInWithGitHub({ code }: SignInWithGitHubRequest) {
  const result = await apiClient
    .post("sessions/github", {
      json: { code },
    })
    .json<SignInWithGitHubResponse>();

  return result;
}
