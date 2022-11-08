import { writable } from 'svelte/store';
import { nanoid } from 'nanoid';

/**
 * Auth info can be an actual user, or an
 * anonymous guest. The still need IDs to 
 * make things work in multiplayer.
 */
enum UserType {

  USER, GUEST

}

export interface User {

  type: UserType

  id: string

  displayName?: string

}

export interface Guest {
  
  type: UserType

  id: string

}

const AnonymousLocalUser = { type: UserType.GUEST, id: nanoid() };

const createCurrentUser = () => {

  const { subscribe, set } = writable<User | Guest>(AnonymousLocalUser);

  const setOptional = (user: User | undefined) => {
    if (user)
      set(user);
    else 
      set(AnonymousLocalUser);
  }

  return { subscribe, set: setOptional }

}

export const CurrentUser = createCurrentUser();

