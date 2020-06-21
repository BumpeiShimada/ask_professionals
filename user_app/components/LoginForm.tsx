import React, {useContext} from 'react';
import {
  TextInput,
  Text,
  Button,
  useTheme,
  HelperText,
} from 'react-native-paper';
import styled from 'styled-components/native';
import {Formik} from 'formik';
import useDistinctNavigation from '../utils/useDistinctNavigation';
import SnackbarContext from '../globalContexts/SnackbarContext';
import AsyncStorageContext from '../globalContexts/AsyncStorageContext';
import {AuthFormValue} from '../models/userTab/loginScreen';
import {AuthFormValidation} from '../validations/authForm';
import {
  InputFieldSeparater,
  FormContainer,
  ButtonSeparater,
  LinkTextSeparater,
} from './FormComponents';
import {PROCESSING_TEXT} from '../constants/button';

interface Props {
  login: (
    values: AuthFormValue,
    onError: (error: any) => void,
  ) => Promise<void>;
  isProcessing: boolean;
  setIsProcessing: (isProcessing: boolean) => void;
}

const CentralizingContainer = styled.View`
  flex-direction: row;
  justify-content: center;
`;

const LoginForm = ({login, isProcessing, setIsProcessing}: Props) => {
  const theme = useTheme();
  const {showArbitraryErrorMessage, showUnknownErrorMessage} = useContext(
    SnackbarContext,
  );
  const asyncStorage = useContext(AsyncStorageContext);
  const navigation = useDistinctNavigation();

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

  const ErrorHelperText = styled(HelperText)`
    color: ${theme.colors.error};
  `;

  return (
    <Formik
      initialValues={{email: '', password: ''}}
      validationSchema={AuthFormValidation}
      onSubmit={async values => {
        setIsProcessing(true);
        await login(values, onError);
        setIsProcessing(false);
      }}>
      {({handleChange, handleBlur, handleSubmit, values, touched, errors}) => (
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
              {isProcessing ? PROCESSING_TEXT : 'Login'}
            </Button>
          </CentralizingContainer>

          {asyncStorage.isRegistrationDone && (
            <>
              <LinkTextSeparater />

              <CentralizingContainer>
                <Text
                  onPress={navigation.goBack}
                  style={{textDecorationLine: 'underline'}}>
                  Register new account
                </Text>
              </CentralizingContainer>
            </>
          )}
        </FormContainer>
      )}
    </Formik>
  );
};

export default LoginForm;
