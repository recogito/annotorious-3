import { writable } from 'svelte/store';

export const AnonymousLocalUser = Symbol('ANONYMOUS_LOCAL_USER');

export interface User {

  id: string | typeof AnonymousLocalUser

  displayName?: string

}

const createCurrentUser = () => {

  const { subscribe, set } = writable<User>({ id: AnonymousLocalUser });

  const setOptional = (user: User | undefined) => {
    if (user)
      set(user);
    else 
      set({ id: AnonymousLocalUser });
  }

  return { subscribe, set: setOptional }

}

export const CurrentUser = createCurrentUser();

