import { GroupType, UserGroup } from "@/types/userGroups";
import { wcaFetch } from "./wcaFetch";

export const fetchUserGroups = async (params: {
  groupTypes: GroupType;
  sort: "name";
  isActive: boolean;
}) => {
  const queryString = new URLSearchParams({
    ...params,
    isActive: params.isActive.toString(),
  });

  return wcaFetch<UserGroup[]>(`/users_groups?${queryString}`);
};
