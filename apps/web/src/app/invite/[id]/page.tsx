import "dayjs/locale/pt-br";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { CheckCircle, LogIn, LogOut, SendToBack } from "lucide-react";
import { cookies } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";

import { auth, isAuthenticated } from "@/auth/auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { acceptInvite } from "@/http/accept-invite";
import { getInvite } from "@/http/get-invite";

dayjs.extend(relativeTime);
dayjs.locale("pt-br");

interface InvitePageProps {
  params: {
    id: string;
  };
}

const InvitePage = async ({ params }: InvitePageProps) => {
  const { id: inviteId } = await params;
  const { invite } = await getInvite(inviteId);

  const isUserAuthenticated = await isAuthenticated();

  let currentUserEmail = null;

  if (isUserAuthenticated) {
    const { user } = await auth();
    currentUserEmail = user.email;
  }

  const userIsAuthenticatedWithSameEmailFromInvite =
    currentUserEmail === invite.email;

  async function signInFormInvite() {
    "use server";

    (await cookies()).set("inviteId", inviteId);

    redirect(`/auth/sign-in?email=${invite.email}`);
  }

  async function acceptInviteAction() {
    "use server";

    await acceptInvite(inviteId);

    redirect("/");
  }

  return (
    <div className="min-h-screen flex items-center justify-center flex-col px-4">
      <div className="w-full max-w-sm space-y-6 flex flex-col">
        <div className="flex flex-col items-center space-y-4">
          <Avatar className="size-16">
            {invite.author?.avatarUrl && (
              <AvatarImage src={invite.author.avatarUrl} />
            )}

            <AvatarFallback />
          </Avatar>

          <p className="text-center leading-relaxed text-muted-foreground text-balance">
            <span className="font-medium text-foreground">
              {invite.author?.name ?? "Alguém"}
            </span>{" "}
            convidou você para se juntar à{" "}
            <span className="font-medium text-foreground">
              {invite.organization.name}
            </span>
            .{" "}
            <span className="text-xs">
              {dayjs(invite.createdAt).fromNow()}.
            </span>
          </p>
        </div>
        <Separator />
        {!isUserAuthenticated && (
          <form action={signInFormInvite} className="space-y-4">
            <Button type="submit" variant="secondary" className="w-full">
              <LogIn className="size-4 mr-2" />
              Entrar para aceitar o convite
            </Button>
          </form>
        )}

        {userIsAuthenticatedWithSameEmailFromInvite && (
          <form action={acceptInviteAction}>
            <Button type="submit" variant="secondary" className="w-full">
              <CheckCircle className="size-4 mr-2" />
              Junte-se à {invite.organization.name}
            </Button>
          </form>
        )}

        {isUserAuthenticated && !userIsAuthenticatedWithSameEmailFromInvite && (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground text-center leading-relaxed">
              Este convite foi enviado para{" "}
              <span className="font-medium text-foreground">
                {invite.email}
              </span>{" "}
              porém você está autenticado com o e-mail{" "}
              <span className="font-medium text-foreground">
                {currentUserEmail}
              </span>
            </p>

            <div className="space-y-2">
              <Button variant="secondary" className="w-full" asChild>
                <a href="/api/auth/sign-out">
                  <LogOut className="size-4 mr-2" />
                  Sair de {currentUserEmail}
                </a>
              </Button>

              <Button variant="outline" className="w-full" asChild>
                <Link href="/">
                  <SendToBack className="size-4 mr-2" />
                  Voltar para o dashboard
                </Link>
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InvitePage;
