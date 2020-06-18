import React, {useContext, useState} from 'react';
import {ScrollView} from 'react-native';
import {Button} from 'react-native-paper';
import styled from 'styled-components/native';
import AdvisorStateContext from '../../../globalContexts/AdvisorStateContext';
import AdvisorDetail from '../../../components/AdvisorDetail';
import useDistinctNavigation from '../../../utils/useDistinctNavigation';
import SnackbarContext from '../../../globalContexts/SnackbarContext';
import useAdvisor from '../../../utils/useAdvisor';

const BottomContaiter = styled.View`
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-top: 10px;
  margin-bottom: 30px;
`;

const VerticalSeparator = styled.View`
  height: 15px;
`;

const MyPageScreen = () => {
  const advisorState = useContext(AdvisorStateContext);
  const advisor = useAdvisor();
  const navigation = useDistinctNavigation();
  const {showArbitraryInfoMessage, showUnknownErrorMessage} = useContext(
    SnackbarContext,
  );

  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  return (
    <ScrollView>
      {advisorState.advisorDocumentState && (
        <AdvisorDetail advisorDocument={advisorState.advisorDocumentState} />
      )}
      <BottomContaiter>
        <Button
          mode="contained"
          icon="circle-edit-outline"
          disabled={isProcessing}
          onPress={navigation.navigateToTagSelect}>
          Edit my profile
        </Button>

        <VerticalSeparator />

        <Button
          disabled={isProcessing}
          onPress={() => {
            setIsProcessing(true);
            advisor.logout({
              onSuccess: async () => {
                showArbitraryInfoMessage('👋 Good bye');
              },
              onError: () => {
                showUnknownErrorMessage();
                setIsProcessing(false);
              },
            });
            setIsProcessing(false);
          }}>
          Logout
        </Button>
      </BottomContaiter>
    </ScrollView>
  );
};

export default MyPageScreen;
