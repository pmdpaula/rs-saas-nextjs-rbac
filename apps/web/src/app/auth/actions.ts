import { redirect } from "next/navigation";

export const signInWithGithub = async () => {
  const githubSignInUrl = new URL(
    "login/oauth/authorize",
    "https://github.com",
  );

  githubSignInUrl.searchParams.set("client_id", "Ov23liApaZtu0gSRKcMX");
  githubSignInUrl.searchParams.set(
    "redirect_uri",
    "http://localhost:3000/api/auth/callback",
  );
  githubSignInUrl.searchParams.set("scope", "user");

  redirect(githubSignInUrl.toString());
};
