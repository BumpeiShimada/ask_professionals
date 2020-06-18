import {useState} from 'react';
import {SelectableTag} from '../models/tag';

export interface Conversation {
  id: string;
  advisorId: string;
  advisorImageUrl: string;
  advisorName: string;
  userId: string;
  userName: string;
  userEmoji: string;
  userMentionedProblems: string;
  userTags: SelectableTag[];
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
