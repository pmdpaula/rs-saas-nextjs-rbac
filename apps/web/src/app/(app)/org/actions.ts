"use server";

import { HTTPError } from "ky";
import { z } from "zod";

import { getCurrentOrganization } from "@/auth/auth";
import { createOrganization } from "@/http/create-organization";
import { updateOrganization } from "@/http/update-organization";

// import { createOrganization } from "@/http/sign-up";

const organizationSchema = z
  .object({
    name: z
      .string()
      .min(4, "O nome da organização deve ter no mínimo 4 caracteres."),
    domain: z
      .string()
      .nullable()
      .refine(
        (value) => {
          if (value) {
            const domainRegex = /^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

            return domainRegex.test(value);
          }

          return true;
        },
        {
          message:
            "O domínio deve ser um endereço válido (exemplo: dominio.com).",
          path: ["domain"],
        },
      ),
    shouldAttachUsersByDomain: z
      .union([z.literal("on"), z.literal("off"), z.boolean()])
      .transform((value) => value === "on" || value === true)
      .default(false),
  })
  .refine(
    (data) => {
      if (data.shouldAttachUsersByDomain === true && !data.domain) {
        return false;
      }

      return true;
    },
    {
      message:
        "O domínio é obrigatório quando a opção de anexar usuários pelo domínio está ativada.",
      path: ["domain"],
    },
  );

export type OrganizationSchema = z.infer<typeof organizationSchema>;

export async function createOrganizationAction(data: FormData) {
  const formParse = organizationSchema.safeParse(Object.fromEntries(data));

  if (!formParse.success) {
    const { properties } = z.treeifyError(formParse.error);

    return {
      success: false,
      message: null,
      errors: properties && properties,
    };
  }

  const { name, domain, shouldAttachUsersByDomain } = formParse.data;

  try {
    await createOrganization({
      name,
      domain,
      shouldAttachUsersByDomain,
    });
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
    message: "Organização criada com sucesso!",
    errors: null,
  };
}

export async function updateOrganizationAction(data: FormData) {
  const currentOrg = (await getCurrentOrganization())!;

  const formParse = organizationSchema.safeParse(Object.fromEntries(data));

  if (!formParse.success) {
    const { properties } = z.treeifyError(formParse.error);

    return {
      success: false,
      message: null,
      errors: properties && properties,
    };
  }

  const { name, domain, shouldAttachUsersByDomain } = formParse.data;

  try {
    await updateOrganization({
      org: currentOrg,
      name,
      domain,
      shouldAttachUsersByDomain,
    });

    // revalidateTag("organizations");
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
    message: "Organização salva com sucesso!",
    errors: null,
  };
}
