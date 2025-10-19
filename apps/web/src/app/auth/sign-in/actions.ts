"use server";

import { HTTPError } from "ky";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";

import { signInWithPassword } from "@/http/sign-in-with-password";

const signInSchema = z.object({
  email: z.email({ message: "Por favor, entre com um e-mail válido." }),
  password: z.string().min(1, { message: "A senha é obrigatória." }),
});

export async function signInWithEmailAndPassword(data: FormData) {
  const formParse = signInSchema.safeParse(Object.fromEntries(data));

  if (!formParse.success) {
    const { properties } = z.treeifyError(formParse.error);

    return {
      success: false,
      message: null,
      errors: properties && properties,
    };
  }

  const { email, password } = formParse.data;

  try {
    const { token } = await signInWithPassword({
      email,
      password,
    });

    (await cookies()).set("token", token, {
      maxAge: 60 * 60 * 24 * 7, // 7 days
      // httpOnly: true,
      // sameSite: "lax",
      // secure: process.env.NODE_ENV === "production",
      path: "/",
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
