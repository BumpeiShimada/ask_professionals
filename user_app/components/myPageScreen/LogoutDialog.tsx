import React, {useContext} from 'react';
import {Paragraph, Button, Portal, Dialog} from 'react-native-paper';
import UserContext from '../../globalContexts/UserContext';
import AsyncStorageContext from '../../globalContexts/AsyncStorageContext';
import SnackbarContext from '../../globalContexts/SnackbarContext';
import useDistinctNavigation from '../../utils/useDistinctNavigation';

interface Props {
  isDialogVisible: boolean;
  setIsDialogVisible: (isDialogVisible: boolean) => void;
  isProcessing: boolean;
  setIsProcessing: (isProcessing: boolean) => void;
}

const LogoutDialog = ({
  isDialogVisible,
  setIsDialogVisible,
  isProcessing,
  setIsProcessing,
}: Props) => {
  const user = useContext(UserContext);
  const asyncStorage = useContext(AsyncStorageContext);
  const {showUnknownErrorMessage, showArbitraryInfoMessage} = useContext(
    SnackbarContext,
  );
  const navigation = useDistinctNavigation();

  const onSuccess = async (message: string) => {
    await asyncStorage.setIsRegistrationDoneTrue();
    showArbitraryInfoMessage(message);
  };

  const onError = () => {
    setIsProcessing(false);
    showUnknownErrorMessage();
  };

  const logout = async () => {
    setIsProcessing(true);
    await user.logout(() => onSuccess('👋 Good bye'))(onError);
    setIsProcessing(false);
  };

  if (user.isEmailLinked) {
    return (
      <Portal>
        <Dialog
          visible={isDialogVisible}
          onDismiss={() => setIsDialogVisible(false)}>
          <Dialog.Title>{'Do you really want to logout?'}</Dialog.Title>
          <Dialog.Actions>
            <Button disabled={isProcessing} onPress={logout}>
              Yes
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    );
  }

  return (
    <Portal>
      <Dialog
        visible={isDialogVisible}
        onDismiss={() => setIsDialogVisible(false)}>
        <Dialog.Title>
          {'All your data will be lost if you logout'}
        </Dialog.Title>
        <Dialog.Content>
          <Paragraph>
            {'Link your email so you can come back again👍'}
          </Paragraph>
        </Dialog.Content>
        <Dialog.Actions>
          <Button disabled={isProcessing} onPress={logout}>
            Logout
          </Button>
          <Button
            onPress={() => {
              navigation.navigateToMailAddressLinking();
              setIsDialogVisible(false);
            }}>
            Link Email
          </Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
};

export default LogoutDialog;
