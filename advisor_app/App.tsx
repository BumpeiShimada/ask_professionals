import 'react-native-gesture-handler';

import React from 'react';
import {DefaultTheme, Provider as PaperProvider} from 'react-native-paper';
import useSnackbar from './globalHooks/useSnackbar';
import SnackbarContext from './globalContexts/SnackbarContext';
import useAdvisorState from './globalHooks/useAdvisorState';
import AdvisorStateContext from './globalContexts/AdvisorStateContext';
import BeforeRegistrationNavigator from './screens/beforeRegistration/BeforeRegistrationNavigator';
import {NavigationContainer} from '@react-navigation/native';
import GlobalSnackbar from './components/GlobalSnackbar';
import AfterRegistrationNavigator from './screens/afterRegistration/AfterRegistrationNavigator';
import useConversationState from './globalHooks/useConversationState';
import ConversationStateContext from './globalContexts/ConversationStateContext';

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#081B83',
    accent: '#078080',
  },
};

const App = () => {
  const advisorState = useAdvisorState();
  const snackbar = useSnackbar();
  const conversationState = useConversationState();

  if (advisorState.isMountingAuthState) {
    return null;
  }

  return (
    <PaperProvider theme={theme}>
      <SnackbarContext.Provider value={snackbar}>
        <AdvisorStateContext.Provider value={advisorState}>
          <ConversationStateContext.Provider value={conversationState}>
            <NavigationContainer>
              {advisorState.advisorAuthState !== null &&
              advisorState.advisorDocumentState?.isRegistrationDone === true ? ( 
                <AfterRegistrationNavigator />
              ) : (
                <BeforeRegistrationNavigator />
              )}
            </NavigationContainer>
          </ConversationStateContext.Provider>
        </AdvisorStateContext.Provider>
      </SnackbarContext.Provider>
      <GlobalSnackbar
        level={snackbar.level}
        message={snackbar.message}
        visible={snackbar.visible}
        onDismiss={snackbar.onDismiss}
      />
    </PaperProvider>
  );
};

export default App;
