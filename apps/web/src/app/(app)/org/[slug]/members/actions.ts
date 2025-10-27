"use server";

import { roleSchema } from "@saas/auth";
import { HTTPError } from "ky";
import { z } from "zod";

import { getCurrentOrganization } from "@/auth/auth";
import { createInvite } from "@/http/create-invite";
import { removeMember } from "@/http/remove-member";
import { revokeInvite } from "@/http/revoke-invite";
import { updateMember } from "@/http/update-member";

const inviteSchema = z.object({
  email: z.email({ message: "Insira um email válido." }),
  role: roleSchema,
});

export async function removeMemberAction(memberId: string) {
  const currentOrg = (await getCurrentOrganization())!;

  await removeMember({
    org: currentOrg,
    memberId,
  });

  // revalidateTag(`${currentOrg}/members`);
}

export async function updateMemberAction(memberId: string, role: string) {
  const currentOrg = (await getCurrentOrganization())!;

  await updateMember({
    org: currentOrg,
    memberId,
    role,
  });

  // revalidateTag(`${currentOrg}/members`);
}

export async function revokeInviteAction(inviteId: string) {
  const currentOrg = (await getCurrentOrganization())!;

  await revokeInvite({
    org: currentOrg,
    inviteId,
  });

  // revalidateTag(`${currentOrg}/invites`);
}

export async function createInviteAction(data: FormData) {
  const formParse = inviteSchema.safeParse(Object.fromEntries(data));

  if (!formParse.success) {
    const { properties } = z.treeifyError(formParse.error);

    return {
      success: false,
      message: null,
      errors: properties && properties,
    };
  }

  const { email, role } = formParse.data;

  const org = (await getCurrentOrganization())!;

  try {
    await createInvite({
      org,
      email,
      role,
    });

    // revalidateTag(`${org}/invites`);
  } catch (error) {
    if (error instanceof HTTPError) {
      const { message } = await error.response.json();

      return { success: false, message, errors: null };
    }

    console.error(error);

    return {
      success: false,
      message: "Something went wrong. Please, try again later.",
      errors: null,
    };
  }

  // redirect("/");
  return {
    success: true,
    message: "Convite criado com sucesso!",
    errors: null,
  };
}
