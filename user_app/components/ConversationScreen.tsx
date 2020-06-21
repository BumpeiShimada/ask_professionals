import React, {useContext} from 'react';
import styled from 'styled-components/native';
import firestore from '@react-native-firebase/firestore';
import Hyperlink from 'react-native-hyperlink';
import {
  Paragraph,
  Avatar,
  TextInput,
  IconButton,
  useTheme,
  TouchableRipple,
} from 'react-native-paper';
import {
  conversationsCollectionRef,
  serverTimestamp,
} from '../singletons/firebase';
import SnackbarContext from '../globalContexts/SnackbarContext';
import {trim} from 'ramda';

const LINK_COLOR = '#01579b';

const UserMessageContainer = styled.View`
  flex: 1;
  flex-direction: row;
`;

const UserMessageContent = styled.View`
  flex: 7;
  flex-direction: row-reverse;
  align-items: baseline;
`;

const AdvisorMessageContainer = styled.View`
  flex: 1;
  flex-direction: row;
  align-items: center;
`;

const AdvisorMessageContent = styled.View`
  flex: 7;
  flex-direction: row;
`;

const AdvisorIcon = styled(Avatar.Image)`
  margin-right: 5px;
`;

const UserParagraph = styled(Paragraph)`
  overflow: hidden;
  border-radius: 12px;
  background-color: #dbeee2;
  padding: 9px;
  margin: 4px 0px;
`;

const AdvisorParagraph = styled(Paragraph)`
  overflow: hidden;
  border-radius: 12px;
  background-color: white;
  padding: 9px;
  margin: 4px 0px;
`;

const MessageSpacer = styled.View`
  flex: 1;
`;

export const UserMessage = ({id, content}: {id: string; content: string}) => (
  <UserMessageContainer key={id}>
    <MessageSpacer />
    <UserMessageContent>
      <Hyperlink linkDefault linkStyle={{color: LINK_COLOR}}>
        <UserParagraph>{content}</UserParagraph>
      </Hyperlink>
    </UserMessageContent>
  </UserMessageContainer>
);

export const AdvisorMessage = ({
  id,
  content,
  advisorImageUrl,
  navigateToAdvisorDetail,
}: {
  id: string;
  content: string;
  advisorImageUrl: string;
  navigateToAdvisorDetail: () => void;
}) => (
  <AdvisorMessageContainer key={id}>
    <TouchableRipple onPress={navigateToAdvisorDetail}>
      <AdvisorIcon size={20} source={{uri: advisorImageUrl}} />
    </TouchableRipple>
    <AdvisorMessageContent>
      <Hyperlink linkDefault linkStyle={{color: LINK_COLOR}}>
        <AdvisorParagraph>{content}</AdvisorParagraph>
      </Hyperlink>
    </AdvisorMessageContent>
    <MessageSpacer />
  </AdvisorMessageContainer>
);

const MessageInputContainer = styled.View`
  background-color: white;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 5px 10px;
`;

const StyledTextInput = styled(TextInput)`
  flex: 1;
  max-height: 300px;
`;

const StyledIconButton = styled(IconButton)`
  margin-left: 10px;
`;

export const MessageInput = ({
  messageText,
  setMessageText,
  conversationDocumentId,
  isProcessing,
  setIsProcessing,
}: {
  messageText: string;
  setMessageText: (messageText: string) => void;
  conversationDocumentId: string;
  isProcessing: boolean;
  setIsProcessing: (isProcessing: boolean) => void;
}) => {
  const theme = useTheme();
  const {showUnknownErrorMessage} = useContext(SnackbarContext);

  const onPress = async () => {
    setIsProcessing(true);

    try {
      const batch = firestore().batch();

      const newConversationDocumentRef = conversationsCollectionRef.doc(
        conversationDocumentId,
      );

      batch.update(newConversationDocumentRef, {
        isUnreadByAdvisor: true,
        lastMessage: trim(messageText),
        updateTimestamp: serverTimestamp,
      });

      const messagesDocumentRef = newConversationDocumentRef
        .collection('messages')
        .doc();
      batch.set(messagesDocumentRef, {
        isUser: true,
        content: trim(messageText),
        sendTimestamp: serverTimestamp,
        createTimestamp: serverTimestamp,
        updateTimestamp: serverTimestamp,
      });

      await batch.commit();

      setMessageText('');
    } catch {
      showUnknownErrorMessage();
      setIsProcessing(false);
    }

    setIsProcessing(false);
  };

  return (
    <MessageInputContainer>
      <StyledTextInput
        multiline
        value={messageText}
        onChangeText={text => setMessageText(text)}
        placeholder="Write a message..."
        disabled={isProcessing}
      />
      <StyledIconButton
        icon="send"
        color={theme.colors.primary}
        onPress={onPress}
        disabled={trim(messageText).length <= 0 || isProcessing}
      />
    </MessageInputContainer>
  );
};
