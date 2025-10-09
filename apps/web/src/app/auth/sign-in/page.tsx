import Image from "next/image";
import Link from "next/link";

import githubIcon from "@/assets/github-icon.svg";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

const SignInPage = () => {
  return (
    <form action="" className="space-y-4">
      <div className="space-y-4">
        <Label htmlFor="email">E-mail</Label>
        <Input type="email" id="email" name="email" />
      </div>

      <div className="space-y-4">
        <Label htmlFor="password">Password</Label>
        <Input type="password" id="password" name="password" />

        <Link
          href="/auth/forgot-password"
          className="text-sm font-medium text-foreground hover:underline"
        >
          Forgot your password?
        </Link>
      </div>

      <Button type="submit" className="w-full">
        Acessar com e-mail
      </Button>

      <Button variant="link" className="w-full" asChild>
        <Link href="/auth/sign-up">Criar conta</Link>
      </Button>

      <Separator />

      <Button type="submit" variant="outline" className="w-full">
        <Image
          src={githubIcon}
          alt="GitHub"
          className="size-4 mr-4 dark:invert"
        />
        Acessar com GitHub
      </Button>
    </form>
  );
};

export default SignInPage;
