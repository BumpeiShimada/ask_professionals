import React, {useContext} from 'react';
import {SafeAreaView} from 'react-native';
import styled from 'styled-components/native';
import {Button} from 'react-native-paper';
import useDistinctNavigation from '../../utils/useDistinctNavigation';
import {SelectableTag} from '../../models/tag';
import AdvisorStateContext from '../../globalContexts/AdvisorStateContext';
import useAdvisor from '../../utils/useAdvisor';

const Container = styled.View`
  padding-top: 20px;
  padding-bottom: 20px;
  background-color: white;
`;

export const CentralizingContainer = styled.View`
  flex-direction: row;
  justify-content: center;
`;

interface Props {
  tags: SelectableTag[];
}

const TagSelectFooter = ({tags}: Props) => {
  const advisorState = useContext(AdvisorStateContext);
  const advisor = useAdvisor();
  const navigation = useDistinctNavigation();

  const onSuccess = () => {
    navigation.navigateToProfileEdit();
  };

  const isSomethingInput = tags.length > 0;

  return (
    <Container>
      <SafeAreaView>
        <CentralizingContainer>
          <Button
            mode={'contained'}
            disabled={isSomethingInput === false}
            onPress={() => advisor.updateAdvisorTags({tags, onSuccess})}>
            {advisorState.advisorDocumentState?.isRegistrationDone === true
              ? 'Next'
              : 'Finish'}
          </Button>
        </CentralizingContainer>
      </SafeAreaView>
    </Container>
  );
};

export default TagSelectFooter;
