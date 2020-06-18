import React from 'react';
import {Headline} from 'react-native-paper';
import styled from 'styled-components/native';

const Container = styled.View`
  margin: 20px;
  flex: 1;
  flex-direction: column;
  justify-content: center;
`;

const WaitingConfirmationScreen = () => (
  <Container>
    <Headline>
      {'Thank you for your registration!\nWe\'ll get back to you soon📫'}
    </Headline>
  </Container>
);

export default WaitingConfirmationScreen;
