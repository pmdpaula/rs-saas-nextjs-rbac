import { Slash } from "lucide-react";
import Image from "next/image";

import fingerprintLogo from "@/assets/fingerprint.svg";
import { ability } from "@/auth/auth";

import { OrganizationSwitcher } from "./organization-switcher";
import { ProfileButton } from "./profile-button";
import { ProjectSwitcher } from "./project-switcher";
import { ThemeSwitcher } from "./theme/theme-switcher";
import { Separator } from "./ui/separator";

export const Header = async () => {
  const permissions = await ability();

  return (
    <div className="mx-auto flex max-w-[1200px] items-center justify-between px-4">
      <div className="flex items-center gap-3">
        <Image src={fingerprintLogo} alt="Logo" width={32} className="size-6" />

        <Slash className="size-3 -rotate-[24deg] text-border" />

        <OrganizationSwitcher />

        {permissions?.can("create", "Project") && (
          <>
            <Slash className="size-3 -rotate-[24deg] text-border" />
            <ProjectSwitcher />
          </>
        )}
      </div>

      <div className="flex items-center gap-4">
        <ThemeSwitcher />
        <Separator orientation="vertical" className="h-5" />
        <ProfileButton />
      </div>
    </div>
  );
};
