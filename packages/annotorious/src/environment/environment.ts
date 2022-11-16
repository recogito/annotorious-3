import { nanoid } from 'nanoid';
import { type Guest, type User, UserType } from './User';

const AnonymousLocalUser = { type: UserType.GUEST, id: nanoid() };

const createEnvironment = () => {
  /**
   * Difference between server time and client time, in milliseconds
   */
  let serverTimeDifference: number;

  /**
   * Current user
   */
  let currentUser: Guest | User = AnonymousLocalUser;

  return {
    get currentUser() {
      return currentUser;
    },

    set currentUser(user: Guest | User | undefined) {
      if (user) currentUser = user;
      else currentUser = AnonymousLocalUser;
    },

    /**
     * Sets a server time, so we can correct browser time error.
     * Note for the super-picky: client-server latency will introduce
     * an error we don't account for.
     */
    setServerTime: (serverNow) => {
      const browserNow = Date.now();
      serverTimeDifference = serverNow - browserNow;
    },

    /**
     * Returns the current 'server time', i.e. browser time
     * adjusted by the serverTimeDifference value, in ISO format
     */
    getCurrentTimeAdjusted: () => new Date(Date.now() + serverTimeDifference).toISOString(),

    /** Re-adjusts the given server ISO timestamp to browser time (MS) **/
    toClientTime: (serverTime) => Date.parse(serverTime) - serverTimeDifference
  };
};

export const Env = createEnvironment();
