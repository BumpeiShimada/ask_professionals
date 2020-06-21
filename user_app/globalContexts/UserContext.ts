import {createContext} from 'react';
import {UserHook} from '../globalHooks/useUser';

const INITIAL_USER_HOOK: UserHook = {
  userAuthState: null,
  isConversationStarted: false,
  isEmailLinked: false,
  userDocumentState: undefined,
  isMountingAuthState: true,
  setIsConversationStartedTrue: () => {},
  emailRegisterAndLink: async () => {},
  anonymousRegister: async () => {},
  editTags: () => {},
  updateProfile: async () => {},
  updateAskingAdvisorIdsState: () => {},
  login: () => async () => {},
  logout: () => async () => {},
};

const UserContext = createContext<UserHook>(INITIAL_USER_HOOK);

export default UserContext;
