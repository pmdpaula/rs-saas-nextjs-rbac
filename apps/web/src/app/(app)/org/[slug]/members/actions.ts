"use server";

import { getCurrentOrganization } from "@/auth/auth";
import { removeMember } from "@/http/remove-member";

export async function removeMemberAction(memberId: string) {
  const currentOrg = (await getCurrentOrganization())!;

  await removeMember({
    org: currentOrg,
    memberId,
  });

  // revalidateTag(`${currentOrg}/members`);
}
