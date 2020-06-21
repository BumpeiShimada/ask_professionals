import React, {useContext} from 'react';
import styled from 'styled-components/native';
import {TextInput, Subheading, useTheme} from 'react-native-paper';
import IsProcessingContext from '../../utils/tagSelectScreen/IsProcessingContext';

export const Separater = styled.View`
  height: 20px;
`;

const CenteredSubheading = styled(Subheading)`
  text-align: center;
`;

interface Props {
  mentionedProblems: string;
  setMentionedProblems: (mentionedProblems: string) => void;
}

const MentionedProblemsField = ({
  mentionedProblems,
  setMentionedProblems,
}: Props) => {
  const theme = useTheme();
  const isProcessing = useContext(IsProcessingContext);

  return (
    <>
      <CenteredSubheading>
        {'Tell us if you have\nsomething more'}
      </CenteredSubheading>

      <Separater />

      <TextInput
        label="ex) Which University should I apply?"
        multiline
        theme={{
          ...theme,
          colors: {
            primary: theme.colors.accent,
          },
        }}
        onChangeText={text => setMentionedProblems(text)}
        value={mentionedProblems}
        disabled={isProcessing.isProcessingState}
      />
    </>
  );
};

export default MentionedProblemsField;
