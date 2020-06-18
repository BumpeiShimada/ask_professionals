import React, {useContext, useState} from 'react';
import {TextInput, Button, HelperText} from 'react-native-paper';
import styled from 'styled-components/native';
import {Formik} from 'formik';
import SnackbarContext from '../../globalContexts/SnackbarContext';
import {AuthFormValidation} from '../../validations/authForm';
import {
  InputFieldSeparater,
  FormContainer,
  ButtonSeparater,
} from '../../components/FormComponents';
import {PROCESSING_TEXT} from '../../constants/button';
import AdvisorStateContext from '../../globalContexts/AdvisorStateContext';
import useAdvisor from '../../utils/useAdvisor';

const Container = styled.View`
  flex: 1;
  flex-direction: column;
  justify-content: center;
`;

const CentralizingContainer = styled.View`
  flex-direction: row;
  justify-content: center;
`;

const LoginScreen = () => {
  const advisorState = useContext(AdvisorStateContext);
  const advisor = useAdvisor();
  const {
    showArbitraryErrorMessage,
    showArbitraryInfoMessage,
    showUnknownErrorMessage,
  } = useContext(SnackbarContext);

  // TODO Formik の isSubmitting で代替できないか確認する
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const onSuccess = async () => {
    showArbitraryInfoMessage('😄 Successfully logged in');
  };

  const onError = (error: any) => {
    setIsProcessing(false);

    switch (error.code) {
      case 'auth/user-not-found':
      case 'auth/wrong-password':
        showArbitraryErrorMessage(
          'The username or password is incorrect',
        );
        break;
      case 'auth/too-many-requests':
        showArbitraryErrorMessage(
          'Your account is locked due to too many failed login attempts. Please try again later.',
        );
        break;
      default:
        showUnknownErrorMessage();
    }
  };

  return (
    <Container>
      <Formik
        initialValues={{email: '', password: ''}}
        validationSchema={AuthFormValidation}
        onSubmit={async (values) => {
          setIsProcessing(true);
          await advisor.login({
            email: values.email,
            password: values.password,
            onSuccess,
            onError,
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
              autoCompleteType="email"
              autoCapitalize="none"
              onChangeText={handleChange('email')}
              onBlur={handleBlur('email')}
              value={values.email}
            />
            {touched.email && errors.email ? (
              <HelperText type="error">{errors.email}</HelperText>
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
            />
            {touched.password && errors.password ? (
              <HelperText type="error">{errors.password}</HelperText>
            ) : null}

            <ButtonSeparater />

            <CentralizingContainer>
              <Button
                contentStyle={{alignContent: "center"}}
                mode={'contained'}
                disabled={isProcessing}
                onPress={handleSubmit}
                loading={isProcessing}>
                {isProcessing ? PROCESSING_TEXT : 'Login'}
              </Button>
            </CentralizingContainer>
          </FormContainer>
        )}
      </Formik>
    </Container>
  );
};

export default LoginScreen;
