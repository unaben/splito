import { User } from "@/types";

export const getMember = (id: string, members: User[]) => {
  const membersById = Object.fromEntries(members.map((m) => [m.id, m]));
  return membersById[id];
};
