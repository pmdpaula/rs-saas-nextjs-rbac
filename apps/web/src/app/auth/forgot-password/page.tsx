import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const ForgotPasswordPage = () => {
  return (
    <form action="" className="space-y-4">
      <div className="space-y-4">
        <Label htmlFor="email">E-mail</Label>
        <Input type="email" id="email" name="email" />
      </div>

      <Button type="submit" className="w-full">
        Recuperar senha
      </Button>

      <Button variant="link" className="w-full" asChild>
        <Link href="/auth/sign-in">Acessar</Link>
      </Button>
    </form>
  );
};

export default ForgotPasswordPage;
