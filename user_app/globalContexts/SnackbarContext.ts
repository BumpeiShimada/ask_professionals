import {createContext} from 'react';
import {SnackbarHook} from '../globalHooks/useSnackbar';
import {Level} from '../components/GlobalSnackbar';

const INITIAL_SNACKBAR_HOOK: SnackbarHook = {
  message: '',
  setMessage: () => {},
  visible: false,
  level: Level.INFO,
  setLevel: () => {},
  onDismiss: () => {},
  showArbitraryInfoMessage: () => {},
  showArbitraryErrorMessage: () => {},
  showUnknownErrorMessage: () => {},
};

const SnackbarContext = createContext<SnackbarHook>(INITIAL_SNACKBAR_HOOK);

export default SnackbarContext;
