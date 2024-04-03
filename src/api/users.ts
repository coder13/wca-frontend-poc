import { Permissions } from "@/types/userGroups";
import { wcaFetch } from "./wcaFetch";

export const fetchMyPermissions = (token: string) =>
  wcaFetch<Permissions>("/users/me/permissions", token);
