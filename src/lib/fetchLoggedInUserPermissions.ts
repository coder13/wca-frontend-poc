import React from "react";
import { fetchMyPermissions } from "@/api/users";
import { GroupType, Role } from "@/types/userGroups";
import { getTokenFromCookie } from "./getTokenFromCookie";

export default async function fetchLoggedInUserPermissions() {
  // FIXME: We won't be knowing whether the user is logged in or not. If the user is not logged in,
  // this will throw and error and even display the error in browser console, which won't be good.
  // THere are two possible solutions for this in long term:
  // 1. Handle the error when migrating from useLoadedData to react-query.
  // 2. Once we are in react-only environment, we can have a global state which will tell us whether
  // the user is logged in or not. But at that time, we won't even need this hook, as the
  // permissions can be fetched just once and stored in global state.
  // const { data, loading } = useLoadedData(apiV0Urls.users.me.permissions);

  const token = await getTokenFromCookie();
  const data = token ? await fetchMyPermissions(token) : undefined;

  const loggedInUserPermissions = () => ({
    canViewDelegateAdminPage: Boolean(
      data?.can_view_delegate_admin_page.scope === "*"
    ),
    canEditRole: (role: Role) => {
      const roleGroupType = role.group.group_type;
      const roleGroupId = role.group.id.toString();

      switch (roleGroupType) {
        case GroupType.delegateRegions:
          return Boolean(
            data?.can_edit_groups.scope === "*" ||
              data?.can_edit_groups.scope.some(
                (groupId) => groupId === roleGroupId
              )
          );
        case GroupType.teamsCommittees:
          return Boolean(
            data?.can_edit_teams_committees.scope === "*" ||
              data?.can_edit_teams_committees.scope.some(
                (groupId) => groupId === roleGroupId
              )
          );
        case GroupType.translators:
          return Boolean(data?.can_edit_translators.scope === "*");
        default:
          return false;
      }
    },
    canAccessWfcSeniorMatters: Boolean(
      data?.can_access_wfc_senior_matters.scope === "*"
    ),
  });

  return loggedInUserPermissions;
}
