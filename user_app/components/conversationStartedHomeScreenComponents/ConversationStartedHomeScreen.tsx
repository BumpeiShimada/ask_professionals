import React, {useState, useEffect, useContext} from 'react';
import {ScrollView, TouchableOpacity} from 'react-native';
import {Avatar} from 'react-native-paper';
import styled from 'styled-components/native';
import CenteredLoadingIndicator from '../../components/CenteredLoadingIndicator';
import {Headline, Paragraph, Title, Divider} from 'react-native-paper';
import {conversationsCollectionRef} from '../../singletons/firebase';
import UserContext from '../../globalContexts/UserContext';
import useDistinctNavigation from '../../utils/useDistinctNavigation';
import {Conversation} from '../../globalHooks/useConversationState';
import ConversationStateContext from '../../globalContexts/ConversationStateContext';

const NO_MESSAGE_NOTIFIER = '✅ You can send the first message';

const Container = styled.View`
  margin: 15px 10px;
  flex-direction: column;
`;

const ThreadContainer = styled.View`
  flex-direction: row;
`;

const ThreadContentContainer = styled.View`
  flex-direction: column;
  justify-content: center;
`;

const ThreadTextContainer = styled.View`
  flex: 1;
  flex-direction: column;
  justify-content: center;
  margin-left: 15px;
`;

const ThreadNotificationIconContainer = styled.View`
  flex-direction: column;
  justify-content: center;
  margin-left: 5px;
`;

const StyledTitle = styled(Title)`
  font-size: 20px;
`;

const StyledHeadline = styled(Headline)`
  font-size: 20px;
`;

const BoldParagraph = styled(Paragraph)`
  font-weight: bold;
`;

const StyledDivider = styled(Divider)`
  background-color: gray;
  margin: 15px;
`;

/*
  The parent component of this one should not have any React specific functions
  like useState as far as possible
*/
const ConversationStartedHomeScreen = () => {
  const [isFetching, setIsFetching] = useState<boolean>(true);

  const conversationState = useContext(ConversationStateContext);
  const user = useContext(UserContext);
  const navigation = useDistinctNavigation();

  useEffect(() => {
    const uid = user.userAuthState ? user.userAuthState.uid : '';

    const subscriber = conversationsCollectionRef
      .where('userId', '==', uid)
      .limit(20)
      .onSnapshot(querySnapshot => {
        setIsFetching(true);

        let fetchedConversations: Conversation[] = [];

        querySnapshot.forEach(documentSnapshot => {
          const {
            advisorId,
            advisorImageUrl,
            advisorName,
            isUnreadByUser,
            isUnreadByAdvisor,
            lastMessage,
          } = documentSnapshot.data();

          fetchedConversations.push({
            id: documentSnapshot.id,
            advisorId,
            advisorImageUrl,
            advisorName,
            isUnreadByUser,
            isUnreadByAdvisor,
            lastMessage,
          });
        });
        conversationState.setConversations(fetchedConversations);

        setIsFetching(false);
      });

    return () => subscriber();
  }, []);

  if (isFetching) {
    return <CenteredLoadingIndicator />;
  }

  return (
    <ScrollView>
      <Container>
        {conversationState.conversations.map(conversation => {
          return (
            <TouchableOpacity
              onPress={() =>
                navigation.navigateToConversation(conversation.advisorId)
              }
              key={conversation.id}>
              <ThreadContainer>
                <ThreadContentContainer>
                  <Avatar.Image
                    size={80}
                    source={{uri: conversation.advisorImageUrl}}
                  />
                </ThreadContentContainer>
                <ThreadTextContainer>
                  {conversation.isUnreadByUser && (
                    <>
                      <StyledTitle>{conversation.advisorName}</StyledTitle>
                      <BoldParagraph numberOfLines={1}>
                        {conversation.lastMessage.length > 0
                          ? conversation.lastMessage
                          : NO_MESSAGE_NOTIFIER}
                      </BoldParagraph>
                    </>
                  )}
                  {conversation.isUnreadByUser === false && (
                    <>
                      <StyledHeadline>
                        {conversation.advisorName}
                      </StyledHeadline>
                      <Paragraph numberOfLines={1}>
                        {conversation.lastMessage.length > 0
                          ? conversation.lastMessage
                          : NO_MESSAGE_NOTIFIER}
                      </Paragraph>
                    </>
                  )}
                </ThreadTextContainer>
                <ThreadNotificationIconContainer>
                  {conversation.isUnreadByUser && (
                    <Avatar.Icon size={20} icon="email" />
                  )}
                  {conversation.isUnreadByUser === false &&
                    conversation.isUnreadByAdvisor === false && (
                      <Avatar.Image
                        size={20}
                        source={{uri: conversation.advisorImageUrl}}
                      />
                    )}
                </ThreadNotificationIconContainer>
              </ThreadContainer>
              <StyledDivider />
            </TouchableOpacity>
          );
        })}
      </Container>
    </ScrollView>
  );
};

export default ConversationStartedHomeScreen;
