import React, {useContext} from 'react';
import UserContext from '../../../globalContexts/UserContext';
import ConversationStartedHomeScreen from '../../../components/conversationStartedHomeScreenComponents/ConversationStartedHomeScreen';
import AdvisorsScreen from '../../../components/advisorsScreenComponents/AdvisorsScreen';

const HomeScreen = () => {
  const user = useContext(UserContext);
  if (user.isConversationStarted) {
    return <ConversationStartedHomeScreen />;
  } else {
    return <AdvisorsScreen />;
  }
};

export default HomeScreen;
