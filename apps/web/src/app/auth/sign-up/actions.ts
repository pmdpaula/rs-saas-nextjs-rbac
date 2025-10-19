"use server";

import { HTTPError } from "ky";
import { redirect } from "next/navigation";
import { z } from "zod";

import { signUp } from "@/http/sign-up";

const signUpSchema = z
  .object({
    name: z
      .string()
      .refine((value) => value.split(" ").length > 1, {
        message: "Por favor, entre com o nome completo.",
      })
      .min(1, { message: "Nome é obrigatório." }),
    email: z.email({ message: "Por favor, entre com um e-mail válido." }),
    password: z
      .string()
      .min(6, { message: "A senha deve ter pelo menos 6 caracteres." }),
    password_confirmation: z.string(),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: "As senhas não coincidem.",
    path: ["password_confirmation"],
  });

export async function signUpAction(data: FormData) {
  const formParse = signUpSchema.safeParse(Object.fromEntries(data));

  if (!formParse.success) {
    const { properties } = z.treeifyError(formParse.error);

    return {
      success: false,
      message: null,
      errors: properties && properties,
    };
  }

  const { name, email, password } = formParse.data;

  try {
    await signUp({
      name,
      email,
      password,
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

  redirect("/");
  // return { success: true, message: null, errors: null };
}
