"use server";

import { HTTPError } from "ky";
import { z } from "zod";

import { getCurrentOrganization } from "@/auth/auth";
import { createProject } from "@/http/create-project";

// import { createProject } from "@/http/sign-up";

const projectSchema = z.object({
  name: z
    .string()
    .min(4, "O nome da organização deve ter no mínimo 4 caracteres."),
  description: z.string(),
});

export async function createProjectAction(data: FormData) {
  const formParse = projectSchema.safeParse(Object.fromEntries(data));

  if (!formParse.success) {
    const { properties } = z.treeifyError(formParse.error);

    return {
      success: false,
      message: null,
      errors: properties && properties,
    };
  }

  const { name, description } = formParse.data;

  try {
    await createProject({
      org: (await getCurrentOrganization())!,
      name,
      description,
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
    message: "Projeto criado com sucesso!",
    errors: null,
  };
}
