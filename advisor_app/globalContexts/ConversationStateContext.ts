import {createContext} from 'react';
import {ConversationHook} from '../globalHooks/useConversationState';

const INITIAL_CONVERSATION_HOOK: ConversationHook = {
  conversations: [],
  setConversations: () => {},
};

const ConversationStateContext = createContext<ConversationHook>(
  INITIAL_CONVERSATION_HOOK,
);

export default ConversationStateContext;
