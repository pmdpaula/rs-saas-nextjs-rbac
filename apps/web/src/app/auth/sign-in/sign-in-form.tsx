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
import { signInWithEmailAndPassword } from "./actions";

export const SignInForm = () => {
  // const [{ success, message, errors }, setFormState] = useState<{
  //   success: boolean;
  //   message: string | null;
  //   errors: Record<string, string[]> | null;
  // }>({
  //   success: false,
  //   message: null,
  //   errors: null,
  // });

  const router = useRouter();

  const [{ success, message, errors }, handleSubmit, isPending] = useFormState(
    signInWithEmailAndPassword,
    () => {
      router.push("/");
    },
  );

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        {success === false && message && (
          <Alert variant="destructive">
            <AlertTriangle className="size-4 mr-2" />
            <AlertTitle>Erro no login</AlertTitle>
            <AlertDescription>
              <p>{message}</p>
            </AlertDescription>
          </Alert>
        )}
        <div className="space-y-4">
          <Label htmlFor="email">E-mail</Label>
          <Input type="email" id="email" name="email" />

          {errors && errors.email && (
            <p className="text-xs font-medium text-red-500 dark:text-red-400">
              {errors.email.errors[0]}
            </p>
          )}
        </div>

        <div className="space-y-4">
          <Label htmlFor="password">Password</Label>
          <Input type="password" id="password" name="password" />

          {errors && errors.password && (
            <p className="text-xs font-medium text-red-500 dark:text-red-400">
              {errors.password.errors[0]}
            </p>
          )}

          <Link
            href="/auth/forgot-password"
            className="text-sm font-medium text-foreground hover:underline"
          >
            Forgot your password?
          </Link>
        </div>

        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            "Acessar com e-mail e senha"
          )}
        </Button>

        <Button variant="link" className="w-full" asChild>
          <Link href="/auth/sign-up">Criar conta</Link>
        </Button>

        <Separator />
      </form>

      <form action={signInWithGithub}>
        <Button type="submit" variant="outline" className="w-full">
          <Image
            src={githubIcon}
            alt="GitHub"
            className="size-4 mr-4 dark:invert"
          />
          Acessar com GitHub
        </Button>
      </form>
    </div>
  );
};
