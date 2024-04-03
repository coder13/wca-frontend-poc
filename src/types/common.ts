import { GroupType } from "./userGroups";

export interface User {
  id: number;
  created_at: string;
  updated_at: string;
  name: string;
  delegate_status: string;
  wca_id: string;
  gender: string;
  country_iso2: string;
  url: string;
  country: Country;
  email: string | null;
  location: string;
  region_id: number;
  class: "user";
  teams: Team[]; // Specify more detailed type if teams structure is known
  avatar: UserAvatar;
}

export interface Country {
  id: string;
  name: string;
  continentId: string;
  iso2: string;
}

export interface UserAvatar {
  url: string;
  pending_url: string;
  thumb_url: string;
  is_default: boolean;
}

export interface Team {
  id: string;
  friendly_id: string;
  leader: boolean;
  senior_member: boolean;
  name: string;
  wca_id: string;
  avatar: TeamAvatar;
}

// Why is this different from UserAvatar...
export interface TeamAvatar {
  url: string;
  thumb: {
    url: string;
  };
}
