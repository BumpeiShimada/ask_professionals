import {createContext} from 'react';
import {AsyncStorageHook} from '../globalHooks/useAsyncStorage';

const INITIAL_ASYNC_STORAGE_HOOK: AsyncStorageHook = {
  isMountingStorageState: true,
  isRegistrationDone: false,
  setIsRegistrationDoneTrue: async () => {},
};

const AsyncStorageContext = createContext<AsyncStorageHook>(
  INITIAL_ASYNC_STORAGE_HOOK,
);

export default AsyncStorageContext;
