import { XOctagon } from "lucide-react";

import { Button } from "@/components/ui/button";

import { revokeInviteAction } from "./actions";

interface RevokeInviteButtonProps {
  inviteId: string;
}

export const RevokeInviteButton = ({ inviteId }: RevokeInviteButtonProps) => {
  return (
    <form action={revokeInviteAction.bind(null, inviteId)}>
      <Button variant="destructive" size="sm">
        <XOctagon className="size-4 mr-2" />
        Revogar convite
      </Button>
    </form>
  );
};
