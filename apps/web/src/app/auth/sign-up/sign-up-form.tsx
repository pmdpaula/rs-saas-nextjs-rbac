"use client";

import { AlertTriangle, Loader2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

// import { useRouter } from "next/navigation";
import githubIcon from "@/assets/github-icon.svg";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useFormState } from "@/hook/use-form-state";

import { signInWithGithub } from "../actions";
import { signUpAction } from "./actions";

export const SignUpForm = () => {
  const router = useRouter();

  const [{ success, message, errors }, handleSubmit, isPending] = useFormState(
    signUpAction,
    () => {
      router.push("/auth/sign-up");
    },
  );

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        {success === false && message && (
          <Alert variant="destructive">
            <AlertTriangle className="size-4 mr-2" />
            <AlertTitle>Erro no cadastro</AlertTitle>
            <AlertDescription>
              <p>{message}</p>
            </AlertDescription>
          </Alert>
        )}

        <div className="space-y-4">
          <Label htmlFor="name">Nome</Label>
          <Input type="name" id="name" name="name" />

          {errors?.name && (
            <p className="text-xs font-medium text-red-500 dark:text-red-400">
              {errors.name.errors[0]}
            </p>
          )}
        </div>

        <div className="space-y-4">
          <Label htmlFor="email">E-mail</Label>
          <Input type="text" id="email" name="email" />

          {errors?.email && (
            <p className="text-xs font-medium text-red-500 dark:text-red-400">
              {errors.email.errors[0]}
            </p>
          )}
        </div>

        <div className="space-y-4">
          <Label htmlFor="password">Senha</Label>
          <Input type="password" id="password" name="password" />

          {errors?.password && (
            <p className="text-xs font-medium text-red-500 dark:text-red-400">
              {errors.password.errors[0]}
            </p>
          )}
        </div>

        <div className="space-y-4">
          <Label htmlFor="password_confirmation">Confirme a senha</Label>
          <Input
            type="password"
            id="password_confirmation"
            name="password_confirmation"
          />

          {errors?.password_confirmation && (
            <p className="text-xs font-medium text-red-500 dark:text-red-400">
              {errors.password_confirmation.errors[0]}
            </p>
          )}
        </div>

        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            "Criar conta"
          )}
        </Button>

        <Button variant="link" className="w-full" asChild>
          <Link href="/auth/sign-in">Já cadastrado? Acessar</Link>
        </Button>
      </form>
      <Separator />

      <form action={signInWithGithub}>
        <Button type="submit" variant="outline" className="w-full">
          <Image
            src={githubIcon}
            alt="GitHub"
            className="size-4 mr-4 dark:invert"
          />
          Cadastrar com GitHub
        </Button>
      </form>
    </div>
  );
};
