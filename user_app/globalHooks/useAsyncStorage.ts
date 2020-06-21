import {useState, useEffect} from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import useSnackbar from './useSnackbar';

const IS_REGISTRATION_DONE = '@is_registration_done';

export interface AsyncStorageHook {
  isMountingStorageState: boolean;
  isRegistrationDone: boolean;
  setIsRegistrationDoneTrue: () => Promise<void>;
}

function useAsyncStorage(): AsyncStorageHook {
  const [isMountingStorageState, setIsMountingStorageState] = useState<boolean>(
    true,
  );
  const [isRegistrationDone, setIsRegistrationDone] = useState<boolean>(false);

  const snackbar = useSnackbar();
  const {showUnknownErrorMessage} = snackbar;

  useEffect(() => {
    (async () => {
      try {
        const currentIsRegistrationDone = await AsyncStorage.getItem(
          IS_REGISTRATION_DONE,
        );
        setIsRegistrationDone(currentIsRegistrationDone !== null);

        setIsMountingStorageState(false);
      } catch {
        showUnknownErrorMessage();
      }
    })();
  }, []);

  async function setIsRegistrationDoneTrue() {
    try {
      await AsyncStorage.setItem(IS_REGISTRATION_DONE, 'true');
      setIsRegistrationDone(true);
    } catch {
      showUnknownErrorMessage();
    }
  }

  return {
    isMountingStorageState,
    isRegistrationDone,
    setIsRegistrationDoneTrue,
  };
}

export default useAsyncStorage;
