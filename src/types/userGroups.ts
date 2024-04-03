import { User } from "./common";

export enum GroupType {
  delegateRegions = "delegate_regions",
  teamsCommittees = "teams_committees",
  translators = "translators",
}

export interface UserGroupMetadata {
  id: number;
  email: null | string;
  created_at: string;
  updated_at: string;
  friendly_id: string;
}

export interface UserGroup {
  id: number;
  name: string;
  group_type: GroupType;
  parent_group_id: number;
  is_active: boolean;
  is_hidden: boolean;
  metadata_id: number;
  metadata_type: string;
  created_at: string;
  updated_at: string;
  lead_user: User;
  metadata: UserGroupMetadata;
}

export interface UserRoleMetadata {
  status: string;
  location: string;
}

export interface Role {
  id: string;
  end_date: null | string;
  is_active: boolean;
  group: UserGroup; // Use the Group interface defined earlier
  user: User; // Extend the User interface to include any new fields if necessary
  is_lead: boolean;
  metadata: UserRoleMetadata;
  class: "userrole";
}

export type PermissionType =
  | "can_attend_competitions"
  | "can_organize_competitions"
  | "can_administer_competitions"
  | "can_view_delegate_admin_page"
  | "can_create_groups"
  | "can_edit_groups"
  | "can_edit_teams_committees"
  | "can_edit_translators"
  | "can_access_wfc_senior_matters";

export type Scope = "*" | string[];

export type Permissions = Record<PermissionType, { scope: Scope }>;
