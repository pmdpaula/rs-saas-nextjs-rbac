import Image from "next/image";
import Link from "next/link";

import githubIcon from "@/assets/github-icon.svg";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

const SignUpPage = () => {
  return (
    <form action="" className="space-y-4">
      <div className="space-y-4">
        <Label htmlFor="name">Nome</Label>
        <Input type="name" id="name" name="name" />
      </div>

      <div className="space-y-4">
        <Label htmlFor="email">E-mail</Label>
        <Input type="text" id="email" name="email" />
      </div>

      <div className="space-y-4">
        <Label htmlFor="password">Senha</Label>
        <Input type="password" id="password" name="password" />
      </div>

      <div className="space-y-4">
        <Label htmlFor="password_confirmation">Confirme a senha</Label>
        <Input
          type="password"
          id="password_confirmation"
          name="password_confirmation"
        />
      </div>

      <Button type="submit" className="w-full">
        Criar conta
      </Button>

      <Button variant="link" className="w-full" asChild>
        <Link href="/auth/sign-in">Já cadastrado? Acessar</Link>
      </Button>

      <Separator />

      <Button type="submit" variant="outline" size="sm" className="w-full">
        <Image
          src={githubIcon}
          alt="GitHub"
          className="size-4 mr-4 dark:invert"
        />
        Criar conta com GitHub
      </Button>
    </form>
  );
};

export default SignUpPage;
