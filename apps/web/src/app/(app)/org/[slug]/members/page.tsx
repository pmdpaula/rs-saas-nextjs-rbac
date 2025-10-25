import { ability } from "@/auth/auth";

import { Invites } from "./Invites";
import { MembersList } from "./members-list";

const MembersPage = async () => {
  const permissions = await ability();

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Membros</h1>

      <div className="space-y-4">
        {permissions?.can("get", "Invite") && <Invites />}
        {permissions?.can("get", "User") && <MembersList />}
      </div>
    </div>
  );
};

export default MembersPage;
