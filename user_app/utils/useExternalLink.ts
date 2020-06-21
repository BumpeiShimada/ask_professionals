import {useContext} from 'react';
import {Linking} from 'react-native';
import SnackbarContext from '../globalContexts/SnackbarContext';

function useExternalLink() {
  const {showArbitraryErrorMessage} = useContext(SnackbarContext);

  const onLinkOpenError = () =>
    showArbitraryErrorMessage(
      'Link could not be opened. Please try again later.',
    );

  async function openExternalLink(url: string) {
    const isHttpUrl = await Linking.canOpenURL(url);

    if (isHttpUrl) {
      await Linking.openURL(url);
    } else {
      onLinkOpenError();
    }
  }

  return {
    openExternalLink,
  };
}

export default useExternalLink;
