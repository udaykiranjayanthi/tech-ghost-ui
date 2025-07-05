import { produce } from "immer";
import { create } from "zustand";
import { devtools } from "zustand/middleware";

import { createSelectors } from "./createSelectors";

const ACTION_TYPES = {
  SET_USER_DATA: "setUserData",
  RESET_GLOBAL_STORE: "resetGlobalStore",
};

interface userDetails {
  userId: string;
  username: string;
  email: string;
  pictureUrl: string;
  firstName: string;
  lastName: string;
}

interface GlobalStore {
  userDetails?: userDetails;
  setUserDetails: (payload: userDetails) => void;
  resetState: () => void;
}

const initialState = {
  userDetails: undefined,
};

const useGlobalBaseStore = create<GlobalStore>()(
  devtools(
    (set, get) => {
      const actions = {
        setUserDetails: (payload: userDetails) =>
          set(
            produce((draft: GlobalStore) => {
              draft.userDetails = payload;
            }),
            false,
            {
              type: ACTION_TYPES.SET_USER_DATA,
              payload,
            }
          ),

        resetState: () =>
          set(initialState, false, {
            type: ACTION_TYPES.RESET_GLOBAL_STORE,
          }),
      };

      return {
        ...initialState,
        ...actions,
      };
    },
    { anonymousActionType: "globalActionType" }
  )
);
const useGlobalStore = createSelectors(useGlobalBaseStore);

export { useGlobalStore };
