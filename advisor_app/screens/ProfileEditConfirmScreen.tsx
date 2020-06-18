import React, {useContext, useState} from 'react';
import {ScrollView} from 'react-native';
import styled from 'styled-components/native';
import AdvisorStateContext from '../globalContexts/AdvisorStateContext';
import {FAB, useTheme, Headline} from 'react-native-paper';
import SnackbarContext from '../globalContexts/SnackbarContext';
import AdvisorCard from '../components/AdvisorCard';
import AdvisorDetail from '../components/AdvisorDetail';
import useDistinctNavigation from '../utils/useDistinctNavigation';
import useAdvisor from '../utils/useAdvisor';

const Container = styled.View`
  margin: 15px 0px;
  flex-direction: column;
`;

const CenteredHeadline = styled(Headline)`
  text-align: center;
`;

const VerticalSeparator = styled.View`
  height: 12px;
`;

const BigVerticalSeparator = styled.View`
  height: 80px;
`;

const BottomFABContaiter = styled.View`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;

const BottomFAB = styled(FAB)`
  width: 180px;
  position: absolute;
  bottom: 20px;
`;

const FABSpace = styled.View`
  height: 70px;
`;

const ProfileEditConfirmScreen = () => {
  const advisorState = useContext(AdvisorStateContext);
  const advisor = useAdvisor();
  const navigation = useDistinctNavigation();
  const theme = useTheme();
  const {showArbitraryInfoMessage, showUnknownErrorMessage} = useContext(
    SnackbarContext,
  );

  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const onSuccess = () => {
    showArbitraryInfoMessage('🎉Registration is done');

    if (advisorState.advisorDocumentState?.isRegistrationDone === true) {
      navigation.navigateToMyPage();
    }
  };

  const onError = () => {
    setIsProcessing(false);
    showUnknownErrorMessage();
  };

  return (
    <>
      <ScrollView>
        <Container>
          <CenteredHeadline>
            {'At the advisor list\n🗂'}
          </CenteredHeadline>

          <VerticalSeparator />

          {advisorState.advisorDocumentState && (
            <AdvisorCard advisorDocument={advisorState.advisorDocumentState} />
          )}

          <BigVerticalSeparator />

          <CenteredHeadline>
            {'At the profile screen\n📝'}
          </CenteredHeadline>

          <VerticalSeparator />

          {advisorState.advisorDocumentState && (
            <AdvisorDetail advisorDocument={advisorState.advisorDocumentState} />
          )}
          {advisorState.advisorDocumentState?.isRegistrationDone === true && (
            <FABSpace />
          )}
        </Container>
      </ScrollView>
      <BottomFABContaiter>
        <BottomFAB
          icon="send"
          label="Register"
          theme={{
            ...theme,
            colors: {
              accent: theme.colors.primary,
            },
          }}
          disabled={isProcessing}
          loading={isProcessing}
          onPress={() => {
            setIsProcessing(true);
            advisor.submitNewAdvisor({onSuccess, onError});
            setIsProcessing(false);
          }}
        />
      </BottomFABContaiter>
    </>
  );
};

export default ProfileEditConfirmScreen;
