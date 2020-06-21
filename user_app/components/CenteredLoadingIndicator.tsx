import React from 'react';
import {ActivityIndicator, useTheme} from 'react-native-paper';
import styled from 'styled-components/native';

const Container = styled.View`
  flex: 1;
  flex-direction: column;
  justify-content: center;
`;

const CenteredLoadingIndicator = () => {
  const theme = useTheme();
  return (
    <Container>
      <ActivityIndicator animating size="large" color={theme.colors.primary} />
    </Container>
  );
};

export default CenteredLoadingIndicator;
