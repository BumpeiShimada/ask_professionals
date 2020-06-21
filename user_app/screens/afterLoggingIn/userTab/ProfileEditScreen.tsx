import React, {useState, useContext} from 'react';
import {TextInput, Button} from 'react-native-paper';
import styled from 'styled-components/native';
import {Formik} from 'formik';
import UserContext from '../../../globalContexts/UserContext';
import SnackbarContext from '../../../globalContexts/SnackbarContext';
import useDistinctNavigation from '../../../utils/useDistinctNavigation';
import {PROCESSING_TEXT} from '../../../constants/button';
import {
  InputFieldSeparater,
  FormContainer,
  ButtonSeparater,
} from '../../../components/FormComponents';

const Container = styled.View`
  flex: 1;
  flex-direction: column;
  justify-content: center;
`;

const CentralizingContainer = styled.View`
  flex-direction: row;
  justify-content: center;
`;

const ProfileEditScreen = () => {
  const user = useContext(UserContext);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const {showArbitraryInfoMessage, showUnknownErrorMessage} = useContext(
    SnackbarContext,
  );
  const navigation = useDistinctNavigation();

  const currentName = user.userDocumentState ? user.userDocumentState.name : '';
  const currentMentionedProblems = user.userDocumentState
    ? user.userDocumentState.mentionedProblems
    : '';

  return (
    <Container>
      <Formik
        initialValues={{
          name: currentName,
          mentionedProblems: currentMentionedProblems,
        }}
        onSubmit={async values => {
          setIsProcessing(true);

          await user.updateProfile({
            name: values.name,
            mentionedProblems: values.mentionedProblems,
            onSuccess: () => {
              navigation.navigateToMyPage();
              showArbitraryInfoMessage('✏️ Successfully updated!');
            },
            onError: () => {
              setIsProcessing(false);
              showUnknownErrorMessage();
            },
          });

          setIsProcessing(false);
        }}>
        {({handleChange, handleBlur, handleSubmit, values}) => (
          <FormContainer>
            <TextInput
              label="Name"
              mode="outlined"
              autoCapitalize="none"
              onChangeText={handleChange('name')}
              onBlur={handleBlur('name')}
              value={values.name}
              disabled={isProcessing}
            />

            <InputFieldSeparater />

            <TextInput
              multiline
              label="Other things to mention"
              mode="outlined"
              autoCapitalize="none"
              onChangeText={handleChange('mentionedProblems')}
              onBlur={handleBlur('mentionedProblems')}
              value={values.mentionedProblems}
              disabled={isProcessing}
            />

            <ButtonSeparater />

            <CentralizingContainer>
              <Button
                mode={'contained'}
                disabled={isProcessing}
                onPress={handleSubmit}
                loading={isProcessing}>
                {isProcessing ? PROCESSING_TEXT : 'Update'}
              </Button>
            </CentralizingContainer>
          </FormContainer>
        )}
      </Formik>
    </Container>
  );
};

export default ProfileEditScreen;
