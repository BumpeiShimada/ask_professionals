import React, {useState, useContext, useEffect} from 'react';
import {
  Title,
  Paragraph,
  Headline,
  Avatar,
  Text,
  Divider,
} from 'react-native-paper';
import styled from 'styled-components/native';
import AdvisorStateContext from '../../../globalContexts/AdvisorStateContext';
import CenteredLoadingIndicator from '../../../components/CenteredLoadingIndicator';
import {conversationsCollectionRef} from '../../../singletons/firebase';
import {ScrollView, TouchableOpacity} from 'react-native';
import useDistinctNavigation from '../../../utils/useDistinctNavigation';
import ConversationStateContext from '../../../globalContexts/ConversationStateContext';
import {Conversation} from '../../../globalHooks/useConversationState';

const NO_MESSAGE_NOTIFIER = '✅ You can send the first message';

const CenteredHeadlineContainer = styled.View`
  flex: 1;
  flex-direction: column;
  justify-content: center;
`;

const CenteredHeadline = styled(Headline)`
  text-align: center;
`;

const Container = styled.View`
  margin: 20px;
  flex-direction: column;
`;

const ThreadContainer = styled.View`
  flex-direction: row;
`;

const ThreadTextContainer = styled.View`
  flex: 1;
  flex-direction: column;
  justify-content: center;
`;

const ThreadNotificationIconContainer = styled.View`
  flex-direction: column;
  justify-content: center;
  margin-left: 5px;
`;

const StyledTitle = styled(Title)`
  font-size: 20px;
`;

const BoldParagraph = styled(Paragraph)`
  font-weight: bold;
`;

const StyledHeadline = styled(Headline)`
  font-size: 20px;
`;

const StyledDivider = styled(Divider)`
  background-color: gray;
  margin: 15px;
`;

const HomeScreen = () => {
  const [isFetching, setIsFetching] = useState<boolean>(true);

  const conversationState = useContext(ConversationStateContext);
  const advisorState = useContext(AdvisorStateContext);
  const navigation = useDistinctNavigation();

  useEffect(() => {
    const uid = advisorState.advisorAuthState ? advisorState.advisorAuthState.uid : '';

    const subscriber = conversationsCollectionRef
      .where('advisorId', '==', uid)
      .limit(20)
      .onSnapshot((querySnapshot) => {
        setIsFetching(true);

        let fetchedConversations: Conversation[] = [];

        querySnapshot.forEach((documentSnapshot) => {
          const {
            advisorId,
            advisorImageUrl,
            advisorName,
            userId,
            userName,
            userEmoji,
            userMentionedProblems,
            userTags,
            isUnreadByUser,
            isUnreadByAdvisor,
            lastMessage,
          } = documentSnapshot.data();

          fetchedConversations.push({
            id: documentSnapshot.id,
            advisorId,
            advisorImageUrl,
            advisorName,
            userId,
            userName,
            userEmoji,
            userMentionedProblems,
            userTags,
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

  if (conversationState.conversations.length === 0) {
    return (
      <CenteredHeadlineContainer>
        <CenteredHeadline>
          {
            'Thank you for registering🙌\n\nPlease advice them if you receive a message from someone\n✉️'
          }
        </CenteredHeadline>
      </CenteredHeadlineContainer>
    );
  }

  return (
    <ScrollView>
      <Container>
        {conversationState.conversations.map((conversation) => {
          const {
            userId,
            userName,
            userEmoji,
            userMentionedProblems,
            userTags,
          } = conversation;

          const navigateToConversation = () => {
            navigation.navigateToConversation({
              userId,
              userName,
              userEmoji,
              userMentionedProblems,
              userTags,
            });
          };

          return (
            <TouchableOpacity onPress={navigateToConversation}>
              <ThreadContainer key={conversation.id}>
                <ThreadTextContainer>
                  {conversation.isUnreadByAdvisor && (
                    <>
                      <StyledTitle>
                        {userName.length > 0
                          ? `${userEmoji} ${userName}`
                          : `${userEmoji} user`}
                      </StyledTitle>
                      <BoldParagraph numberOfLines={1}>
                        {conversation.lastMessage.length > 0
                          ? conversation.lastMessage
                          : NO_MESSAGE_NOTIFIER}
                      </BoldParagraph>
                    </>
                  )}
                  {conversation.isUnreadByAdvisor === false && (
                    <>
                      <StyledHeadline>
                        {userName.length > 0
                          ? `${userEmoji} ${userName}`
                          : `${userEmoji} user`}
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
                  {conversation.isUnreadByAdvisor && (
                    <Avatar.Icon size={20} icon="email" />
                  )}
                  {conversation.isUnreadByAdvisor === false &&
                    conversation.isUnreadByUser === false && (
                      <Text>{userEmoji}</Text>
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

export default HomeScreen;
