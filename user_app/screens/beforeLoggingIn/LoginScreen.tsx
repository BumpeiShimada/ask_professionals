import React, {useState, useContext} from 'react';
import styled from 'styled-components/native';
import UserContext from '../../globalContexts/UserContext';
import AsyncStorageContext from '../../globalContexts/AsyncStorageContext';
import SnackbarContext from '../../globalContexts/SnackbarContext';
import LoginForm from '../../components/LoginForm';

const Container = styled.View`
  flex: 1;
  flex-direction: column;
  justify-content: center;
`;

const LoginScreen = () => {
  const user = useContext(UserContext);
  const asyncStorage = useContext(AsyncStorageContext);

  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const {showArbitraryInfoMessage} = useContext(SnackbarContext);

  const onSuccess = async (message: string) => {
    await asyncStorage.setIsRegistrationDoneTrue();
    showArbitraryInfoMessage(message);
  };

  return (
    <Container>
      <LoginForm
        login={user.login(() => onSuccess('😄 Successfully logged in'))}
        isProcessing={isProcessing}
        setIsProcessing={setIsProcessing}
      />
    </Container>
  );
};

export default LoginScreen;
