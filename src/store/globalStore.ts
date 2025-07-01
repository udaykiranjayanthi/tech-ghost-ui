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
  userName: string;
  displayName: string;
  email: string;
  photoUrl: string;
}

interface GlobalStore {
  userDetails?: userDetails;
  resetState: () => void;
}

const initialState = {
  userDetails: undefined,
  resetState: () => {},
};

const useGlobalBaseStore = create<GlobalStore>()(
  devtools(
    (set, get) => {
      const actions = {
        setUserData: (payload: userDetails) =>
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
