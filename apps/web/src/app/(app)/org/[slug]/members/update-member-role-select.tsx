"use client";

import type { ComponentProps } from "react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { updateMemberAction } from "./actions";

interface UpdateMemberRoleSelectProps extends ComponentProps<typeof Select> {
  memberId: string;
}

export const UpdateMemberRoleSelect = ({
  memberId,
  ...props
}: UpdateMemberRoleSelectProps) => {
  async function updateMemberRole(role: string) {
    await updateMemberAction(memberId, role);
  }

  return (
    <Select onValueChange={updateMemberRole} {...props}>
      <SelectTrigger className="w-32 h-8">
        <SelectValue placeholder="Select role" />
      </SelectTrigger>

      <SelectContent>
        <SelectItem value="ADMIN">Admin</SelectItem>
        <SelectItem value="MEMBER">Membro</SelectItem>
        <SelectItem value="BILLING">Faturamento</SelectItem>
      </SelectContent>
    </Select>
  );
};
