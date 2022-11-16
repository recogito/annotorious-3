/**
 * Auth info can be an actual user, or an
 * anonymous guest. The still need IDs to
 * make things work in multiplayer.
 */
export enum UserType {
  GUEST,
  USER
}

export interface Guest {
  type: UserType.GUEST;

  id: string;
}

export interface User {
  type: UserType.USER;

  id: string;

  displayName?: string;

  email?: string;

  avatarUrl?: string;
}
