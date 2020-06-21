import React, {useContext} from 'react';
import {SafeAreaView} from 'react-native';
import styled from 'styled-components/native';
import {Button, Text} from 'react-native-paper';
import useDistinctNavigation from '../../utils/useDistinctNavigation';
import UserContext from '../../globalContexts/UserContext';
import AsyncStorageContext from '../../globalContexts/AsyncStorageContext';
import SnackbarContext from '../../globalContexts/SnackbarContext';
import {SelectableTag} from '../../models/tag';
import IsProcessingContext from '../../utils/tagSelectScreen/IsProcessingContext';
import {PROCESSING_TEXT} from '../../constants/button';

const Container = styled.View`
  padding-top: 20px;
  padding-bottom: 20px;
  background-color: white;
`;

const CentralizingContainer = styled.View`
  flex-direction: row;
  justify-content: center;
`;

const Separator = styled.View`
  height: 12px;
`;

interface Props {
  selectedTags: SelectableTag[];
  mentionedProblems: string;
}

/*
  This component will be used when
    - registering a new user
    - editing a logged in user's profile
*/
const Footer = ({selectedTags, mentionedProblems}: Props) => {
  const user = useContext(UserContext);
  const isProcessing = useContext(IsProcessingContext);
  const asyncStorage = useContext(AsyncStorageContext);
  const {showArbitraryInfoMessage, showUnknownErrorMessage} = useContext(
    SnackbarContext,
  );
  const navigation = useDistinctNavigation();

  const onSuccess = async () => {
    if (asyncStorage.isRegistrationDone === false) {
      await asyncStorage.setIsRegistrationDoneTrue();
    }

    if (user.userAuthState) {
      /*
        Go to next edit screen if a user is logged in
        because they must be editing the profile then
      */
      navigation.navigateToProfileEdit();
    }

    if (user.userAuthState === null) {
      /*
        Do not show this when a user is navigated to edit page
        because the edit is not complete (the value is not sent to server) yet
      */
      showArbitraryInfoMessage('👍 Tag select completed');
    }
  };

  const onError = () => {
    isProcessing.setIsProcessingState(false);

    if (user.userAuthState === null) {
      /*
        In case creating user document fails after registering Firebase Auth
        while registering a new user
      */
      user.logout(() => {})(showUnknownErrorMessage);
    }

    showUnknownErrorMessage();
  };

  const isSomethingInput =
    selectedTags.length > 0 || mentionedProblems.length > 0;

  return (
    <Container>
      <SafeAreaView>
        <CentralizingContainer>
          <Button
            mode={isSomethingInput ? 'contained' : 'outlined'}
            disabled={isProcessing.isProcessingState}
            onPress={async () => {
              isProcessing.setIsProcessingState(true);

              if (user.userAuthState) {
                // Edit tags and go to next edit page if user is logged in
                user.editTags({selectedTags, onSuccess});
                navigation.navigateToProfileEdit();
              } else {
                // If user is not logged in, register new one
                await user.anonymousRegister({
                  selectedTags,
                  mentionedProblems,
                  onSuccess,
                  onError,
                });
              }

              isProcessing.setIsProcessingState(false);
            }}
            loading={isProcessing.isProcessingState}>
            {isProcessing.isProcessingState
              ? PROCESSING_TEXT
              : user.userAuthState === null
              ? 'Finish'
              : 'Next'}
          </Button>
        </CentralizingContainer>
        {isProcessing.isProcessingState === false &&
          user.userAuthState === null && (
            // Will be shown when a user is not logged in
            <>
              <Separator />
              <CentralizingContainer>
                <Text
                  onPress={navigation.navigateToLogin}
                  style={{textDecorationLine: 'underline'}}>
                  Login
                </Text>
              </CentralizingContainer>
            </>
          )}
      </SafeAreaView>
    </Container>
  );
};

export default Footer;
