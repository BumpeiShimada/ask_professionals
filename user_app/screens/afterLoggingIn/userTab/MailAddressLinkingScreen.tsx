import React, {useState, useContext} from 'react';
import {TextInput, Button, useTheme, HelperText} from 'react-native-paper';
import styled from 'styled-components/native';
import {Formik} from 'formik';
import UserContext from '../../../globalContexts/UserContext';
import SnackbarContext from '../../../globalContexts/SnackbarContext';
import useDistinctNavigation from '../../../utils/useDistinctNavigation';
import {PROCESSING_TEXT} from '../../../constants/button';
import {AuthFormValidation} from '../../../validations/authForm';
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

const MailAddressLinkingScreen = () => {
  const user = useContext(UserContext);
  const theme = useTheme();
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const {showArbitraryInfoMessage, showArbitraryErrorMessage} = useContext(
    SnackbarContext,
  );
  const navigation = useDistinctNavigation();

  const ErrorHelperText = styled(HelperText)`
    color: ${theme.colors.error};
  `;

  return (
    <Container>
      <Formik
        initialValues={{email: '', password: ''}}
        validationSchema={AuthFormValidation}
        onSubmit={async values => {
          setIsProcessing(true);

          user.emailRegisterAndLink({
            email: values.email,
            password: values.password,
            onSuccess: () => {
              navigation.navigateToMyPage();
              showArbitraryInfoMessage('✉️ Successfully linked your email!');
            },
            onError: () => {
              setIsProcessing(false);
              showArbitraryErrorMessage(
                'Linking failed. Please check if this email is already used or try again later.',
              );
            },
          });

          setIsProcessing(false);
        }}>
        {({
          handleChange,
          handleBlur,
          handleSubmit,
          values,
          touched,
          errors,
        }) => (
          <FormContainer>
            <TextInput
              label="Email"
              mode="outlined"
              autoCapitalize="none"
              onChangeText={handleChange('email')}
              onBlur={handleBlur('email')}
              value={values.email}
              disabled={isProcessing}
            />
            {touched.email && errors.email ? (
              <ErrorHelperText>{errors.email}</ErrorHelperText>
            ) : null}

            <InputFieldSeparater />

            <TextInput
              label="Password"
              mode="outlined"
              autoCompleteType="password"
              secureTextEntry
              onChangeText={handleChange('password')}
              onBlur={handleBlur('password')}
              value={values.password}
              disabled={isProcessing}
            />
            {touched.password && errors.password ? (
              <ErrorHelperText>{errors.password}</ErrorHelperText>
            ) : null}

            <ButtonSeparater />

            <CentralizingContainer>
              <Button
                mode={'contained'}
                disabled={isProcessing}
                onPress={handleSubmit}
                loading={isProcessing}>
                {isProcessing ? PROCESSING_TEXT : 'Link Email'}
              </Button>
            </CentralizingContainer>
          </FormContainer>
        )}
      </Formik>
    </Container>
  );
};

export default MailAddressLinkingScreen;
