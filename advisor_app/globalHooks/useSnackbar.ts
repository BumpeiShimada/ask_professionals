import {useState} from 'react';
import {Level} from '../components/GlobalSnackbar';

export interface SnackbarHook {
  message: string;
  setMessage: (message: string) => void;
  visible: boolean;
  level: Level;
  setLevel: (level: Level) => void;
  onDismiss: () => void;
  showArbitraryInfoMessage: (message: string) => void;
  showArbitraryErrorMessage: (message: string) => void;
  showUnknownErrorMessage: () => void;
}

function useSnackbar(): SnackbarHook {
  const [message, setMessage] = useState<string>('');
  const [visible, setVisible] = useState<boolean>(false);
  const [level, setLevel] = useState<Level>(Level.INFO);

  function setLevelAsInfo() {
    setLevel(Level.INFO);
  }

  function setLevelAsError() {
    setLevel(Level.ERROR);
  }

  function showSnackbar() {
    setVisible(true);
  }

  function onDismiss() {
    setVisible(false);
  }

  const showArbitraryInfoMessage = (passedMessage: string) => {
    setLevelAsInfo();
    setMessage(passedMessage);
    showSnackbar();
  };

  const showArbitraryErrorMessage = (passedMessage: string) => {
    setLevelAsError();
    setMessage(passedMessage);
    showSnackbar();
  };

  const showUnknownErrorMessage = () => {
    setLevelAsError();
    setMessage('An error occurred, please try again later.');
    showSnackbar();
  };

  return {
    message,
    setMessage,
    visible,
    level,
    setLevel,
    onDismiss,
    showArbitraryInfoMessage,
    showArbitraryErrorMessage,
    showUnknownErrorMessage,
  };
}

export default useSnackbar;
