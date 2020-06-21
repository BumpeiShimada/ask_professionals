import {useContext} from 'react';
import {clone} from 'ramda';
import UserContext from '../globalContexts/UserContext';
import {
  serverTimestamp,
  conversationsCollectionRef,
} from '../singletons/firebase';
import ConversationStateContext from '../globalContexts/ConversationStateContext';
import useDistinctNavigation from './useDistinctNavigation';

function useConversation() {
  const user = useContext(UserContext);
  const conversationState = useContext(ConversationStateContext);
  const navigation = useDistinctNavigation();

  async function startNewConversation({
    advisorId,
    advisorName,
    advisorImageUrl,
  }: {
    advisorId: string;
    advisorName: string;
    advisorImageUrl: string;
  }) {
    if (user.userAuthState && user.userDocumentState) {
      const userId = user.userAuthState.uid;

      // Create new conversation document
      await conversationsCollectionRef.doc(`${userId}${advisorId}`).set({
        userId,
        advisorId,
        isUnreadByUser: false,
        isUnreadByAdvisor: true,
        userName: user.userDocumentState.name,
        userEmoji: user.userDocumentState.emoji,
        userMentionedProblems: user.userDocumentState.mentionedProblems,
        userTags: user.userDocumentState.tags,
        advisorName,
        advisorImageUrl,
        lastMessage: '',
        createTimestamp: serverTimestamp,
        updateTimestamp: serverTimestamp,
      });

      const newConversations = clone(conversationState.conversations);
      newConversations.push({
        id: `${userId}${advisorId}`,
        advisorId,
        advisorImageUrl,
        advisorName,
        isUnreadByUser: false,
        isUnreadByAdvisor: true,
        lastMessage: '',
      });
      conversationState.setConversations(newConversations);

      user.updateAskingAdvisorIdsState(advisorId);
      user.setIsConversationStartedTrue();
      navigation.navigateToConversation(advisorId);
    } else {
      throw Error('The user must be logged in');
    }
  }

  return {
    startNewConversation,
  };
}

export default useConversation;
