"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ComponentProps } from "react";

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface NavLinkProps extends ComponentProps<typeof Link> {}

export const NavLink = (props: NavLinkProps) => {
  const pathname = usePathname();

  const isCurrent = props.href.toString() === pathname;

  return <Link data-current={isCurrent} {...props} />;
};
