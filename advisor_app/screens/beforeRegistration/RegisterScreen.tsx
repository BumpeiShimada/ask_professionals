import React, {useState, useContext} from 'react';
import {TextInput, HelperText, Button} from 'react-native-paper';
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
import useDistinctNavigation from '../../utils/useDistinctNavigation';
import useAdvisor from '../../utils/useAdvisor';

const Container = styled.View`
  flex: 1;
  flex-direction: column;
  justify-content: center;
`;

export const ButtonContainer = styled.View`
  flex-direction: row;
  justify-content: center;
`;

const RegisterScreen = () => {
  const advisor = useAdvisor();
  const navigation = useDistinctNavigation();
  const {showArbitraryErrorMessage, showUnknownErrorMessage} = useContext(
    SnackbarContext,
  );

  // TODO Formik の isSubmitting で代替できないか確認する
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const onError = (error: any) => {
    setIsProcessing(false);

    switch (error.code) {
      case 'auth/email-already-in-use':
        showArbitraryErrorMessage('This email is already registered');
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
          await advisor.registerAdvisor({
            email: values.email,
            password: values.password,
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

            <ButtonContainer>
              <Button
                mode={'contained'}
                disabled={isProcessing}
                onPress={handleSubmit}
                loading={isProcessing}>
                {isProcessing ? PROCESSING_TEXT : 'Register'}
              </Button>
            </ButtonContainer>

            <ButtonSeparater />

            <ButtonContainer>
              <Button onPress={navigation.navigateToLogin}>
                Login
              </Button>
            </ButtonContainer>
          </FormContainer>
        )}
      </Formik>
    </Container>
  );
};

export default RegisterScreen;
