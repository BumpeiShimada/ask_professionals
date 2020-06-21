import React from 'react';
import {Snackbar, withTheme, Theme} from 'react-native-paper';
import styled from 'styled-components/native';

const Container = styled.View`
  justify-content: space-between;
`;

export enum Level {
  INFO,
  ERROR,
}

interface Props {
  level: Level;
  message: string;
  visible: boolean;
  onDismiss: () => void;
  theme: Theme;
}

const GlobalSnackbar = ({level, message, visible, onDismiss, theme}: Props) => {
  let backgroundColor = theme.colors.accent;

  switch (level) {
    case Level.ERROR:
      backgroundColor = theme.colors.error;
      break;
  }

  return (
    <Container>
      <Snackbar
        visible={visible}
        onDismiss={onDismiss}
        action={{label: 'Dismiss', onPress: () => {}}}
        style={{backgroundColor}}
        theme={{colors: {accent: theme.colors.background}}}>
        {message}
      </Snackbar>
    </Container>
  );
};

export default withTheme(GlobalSnackbar);
