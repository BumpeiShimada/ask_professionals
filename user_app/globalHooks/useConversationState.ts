import {useState} from 'react';

export interface Conversation {
  id: string;
  advisorId: string;
  advisorImageUrl: string;
  advisorName: string;
  isUnreadByUser: boolean;
  isUnreadByAdvisor: boolean;
  lastMessage: string;
}

export interface ConversationHook {
  conversations: Conversation[];
  setConversations: (conversations: Conversation[]) => void;
}

function useConversationState() {
  const [conversations, setConversations] = useState<Conversation[]>([]);

  return {
    conversations,
    setConversations,
  };
}

export default useConversationState;
