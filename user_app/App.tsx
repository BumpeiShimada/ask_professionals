import 'react-native-gesture-handler';

import React from 'react';
import {DefaultTheme, Provider as PaperProvider} from 'react-native-paper';
import {NavigationContainer} from '@react-navigation/native';
import useAsyncStorage from './globalHooks/useAsyncStorage';
import useUser from './globalHooks/useUser';
import useSnackbar from './globalHooks/useSnackbar';
import AsyncStorageContext from './globalContexts/AsyncStorageContext';
import UserContext from './globalContexts/UserContext';
import SnackbarContext from './globalContexts/SnackbarContext';
import AfterLoggingInNavigator from './screens/afterLoggingIn/AfterLoggingInNavigator';
import BeforeLoggingInNavigator from './screens/beforeLoggingIn/BeforeLoggingInNavigator';
import GlobalSnackbar from './components/GlobalSnackbar';
import useConversationState from './globalHooks/useConversationState';
import ConversationStateContext from './globalContexts/ConversationStateContext';

declare const global: {HermesInternal: null | {}};

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#078080',
    accent: '#081B83',
  },
};

const App = () => {
  const asyncStorage = useAsyncStorage();
  const user = useUser();
  const snackbar = useSnackbar();
  const conversationState = useConversationState();

  if (asyncStorage.isMountingStorageState || user.isMountingAuthState) {
    return null;
  }

  return (
    <PaperProvider theme={theme}>
      <AsyncStorageContext.Provider value={asyncStorage}>
        <UserContext.Provider value={user}>
          <SnackbarContext.Provider value={snackbar}>
            <ConversationStateContext.Provider value={conversationState}>
              <NavigationContainer>
                {user.userAuthState !== null ? (
                  <AfterLoggingInNavigator />
                ) : (
                  <BeforeLoggingInNavigator />
                )}
              </NavigationContainer>
            </ConversationStateContext.Provider>
          </SnackbarContext.Provider>
        </UserContext.Provider>
      </AsyncStorageContext.Provider>
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
