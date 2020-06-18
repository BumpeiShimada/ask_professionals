import {createContext} from 'react';
import {AdvisorStateHook} from '../globalHooks/useAdvisorState';

const INITIAL_ADVISOR_HOOK: AdvisorStateHook = {
  advisorAuthState: null,
  advisorDocumentState: undefined,
  setAdvisorDocumentState: () => {},
  isMountingAuthState: true,
};

const AdvisorStateContext = createContext<AdvisorStateHook>(INITIAL_ADVISOR_HOOK);

export default AdvisorStateContext;
