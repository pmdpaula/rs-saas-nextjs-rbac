"use client";

import "dayjs/locale/pt-br";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { Check, UserPlus2, X } from "lucide-react";
import { useState } from "react";

import { getPenddingInvites } from "@/http/get-pending-invites";

import { Button } from "../ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { acceptInviteAction, rejectInviteAction } from "./actions";

dayjs.extend(relativeTime);
dayjs.locale("pt-br");

export const PendingInvites = () => {
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);

  const { data } = useQuery({
    queryKey: ["pending-invites"],
    queryFn: getPenddingInvites,
    enabled: isOpen,
  });

  async function handleAcceptInvite(inviteId: string) {
    await acceptInviteAction(inviteId);
    await queryClient.invalidateQueries({ queryKey: ["pending-invites"] });
  }

  async function handleRejectInvite(inviteId: string) {
    await rejectInviteAction(inviteId);
    await queryClient.invalidateQueries({ queryKey: ["pending-invites"] });
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost">
          <UserPlus2 className="size-4" />
          <span className="sr-only">Convites pendentes</span>
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-80 space-y-2">
        <span className="block text-sm font-medium">
          Convites pendentes ({data?.invites.length ?? 0})
        </span>

        {data?.invites.length === 0 && (
          <p className="text-xs text-muted-foreground">
            Nenhum convite pendente no momento.
          </p>
        )}

        {data?.invites.map((invite) => {
          return (
            <div className="space-y-2" key={invite.id}>
              <p className="text-xs leading-relaxed text-muted-foreground">
                <span className="font-medium text-foreground">
                  {invite.author?.name ?? "Alguém"}
                </span>{" "}
                convidou você para se juntar à{" "}
                <span className="font-medium text-foreground">
                  {invite.organization.name}
                </span>{" "}
                <span>{dayjs(invite.createdAt).fromNow()}.</span>
              </p>

              <div className="flex gap-2">
                <Button
                  type="button"
                  onClick={() => handleAcceptInvite(invite.id)}
                  variant="outline"
                  size="xs"
                >
                  <Check className="size-3 mr-1" />
                  Aceitar
                </Button>

                <Button
                  type="button"
                  onClick={() => handleRejectInvite(invite.id)}
                  variant="ghost"
                  size="xs"
                  className="text-muted-foreground"
                >
                  <X className="size-3 mr-1" />
                  Rejeitar
                </Button>
              </div>
            </div>
          );
        })}
      </PopoverContent>
    </Popover>
  );
};
