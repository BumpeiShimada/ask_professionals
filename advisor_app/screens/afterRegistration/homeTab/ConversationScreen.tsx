import React, {useContext, useEffect, useState} from 'react';
import {HomeStackParamList} from './HomeNavigator';
import {RouteProp} from '@react-navigation/native';
import styled from 'styled-components/native';
import {Text, Button} from 'react-native-paper';
import useDistinctNavigation from '../../../utils/useDistinctNavigation';
import SnackbarContext from '../../../globalContexts/SnackbarContext';
import AdvisorStateContext from '../../../globalContexts/AdvisorStateContext';
import CenteredLoadingIndicator from '../../../components/CenteredLoadingIndicator';
import {
  serverTimestamp,
  conversationsCollectionRef,
} from '../../../singletons/firebase';
import {FirebaseFirestoreTypes} from '@react-native-firebase/firestore';
import {
  MessageInput,
  UserMessage,
  AdvisorMessage,
} from '../../../components/afterRegistration/homeTab/ConversationScreenComponents';
import {ScrollView} from 'react-native';
import {reverse, concat} from 'ramda';

type ConversationScreenRouteProp = RouteProp<
  HomeStackParamList,
  'Conversation'
>;
interface Props {
  route: ConversationScreenRouteProp;
}

const HeaderContainer = styled.TouchableOpacity`
  background-color: white;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 3px;
`;

const ButtonContainer = styled.View`
  flex-direction: row;
  justify-content: center;
  align-items: center;
  margin: 10px;
`;

const Container = styled.View`
  margin: 10px;
  flex-direction: column;
`;

const ConversationScreen = ({route}: Props) => {
  const {userId, userEmoji, userName} = route.params.userInfo;

  const [isFetching, setIsFetching] = useState<boolean>(true);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [documentId, setDocumentId] = useState<string>('');
  const [messageText, setMessageText] = useState<string>('');

  const advisor = useContext(AdvisorStateContext);
  const navigation = useDistinctNavigation();
  const {showUnknownErrorMessage} = useContext(SnackbarContext);

  useEffect(() => {
    (async () => {
      try {
        if (advisor.advisorAuthState) {
          const currentDocumentId = `${userId}${advisor.advisorAuthState.uid}`;
          const conversationDocumentReference = conversationsCollectionRef.doc(
            currentDocumentId,
          );

          setDocumentId(currentDocumentId);

          /*
            Update document on server
           */
          await conversationDocumentReference.update({
            isUnreadByAdvisor: false,
            updateTimestamp: serverTimestamp,
          });
        } else {
          showUnknownErrorMessage();
        }
      } catch {
        showUnknownErrorMessage();
      }

      setIsFetching(false);
    })();
  }, []);

  interface Message {
    id: string;
    isUser: boolean;
    content: string;
    sendTimestamp: FirebaseFirestoreTypes.Timestamp;
  }

  const [isLoadedAll, setIsLoadedAll] = useState<boolean>(false);
  const [lastDocumentSnapshot, setLastDocumentSnapshot] = useState<
    FirebaseFirestoreTypes.QueryDocumentSnapshot | undefined
  >(undefined);
  const [messages, setMessages] = useState<Message[]>([]);

  /*
    Fetch and subscribe to the messages in this conversation
  */
  useEffect(() => {
    const advisorId = advisor.advisorAuthState
      ? advisor.advisorAuthState.uid
      : '';

    const currentDocumentId = `${userId}${advisorId}`;
    const conversationDocumentReference = conversationsCollectionRef.doc(
      currentDocumentId,
    );

    const subscriber = conversationDocumentReference
      .collection('messages')
      .orderBy('sendTimestamp', 'desc')
      .limit(10)
      .onSnapshot((snapshot) => {
        if (snapshot.size < 10) {
          setIsLoadedAll(true);
        } else {
          setIsLoadedAll(false);
        }

        const fetchedMessages: Message[] = [];
        let counter = 0;

        snapshot.forEach((documentSnapshot) => {
          const {isUser, content, sendTimestamp} = documentSnapshot.data();
          fetchedMessages.push({
            id: documentSnapshot.id,
            isUser,
            content,
            sendTimestamp,
          });

          counter = counter + 1;

          /*
            Set the oldest message so a user could
            fetch older ones than this next time
          */
          if (counter === snapshot.size) {
            setLastDocumentSnapshot(documentSnapshot);
          }
        });

        setMessages(fetchedMessages);
      });

    return () => subscriber();
  }, []);

  if (isFetching) {
    return <CenteredLoadingIndicator />;
  }

  const loadOlderMessages = async () => {
    setIsProcessing(true);
    try {
      const conversationDocumentReference = conversationsCollectionRef.doc(
        documentId,
      );
      const querySnapshot = await conversationDocumentReference
        .collection('messages')
        .orderBy('sendTimestamp', 'desc')
        .startAfter(lastDocumentSnapshot)
        .limit(10)
        .get();

      if (querySnapshot.size < 10) {
        setIsLoadedAll(true);
      }

      let counter = 0;
      const fetchedMessages: Message[] = [];
      querySnapshot.forEach((documentSnapshot) => {
        const {isUser, content, sendTimestamp} = documentSnapshot.data();
        fetchedMessages.push({
          id: documentSnapshot.id,
          isUser,
          content,
          sendTimestamp,
        });

        counter = counter + 1;
        if (counter === querySnapshot.size) {
          setLastDocumentSnapshot(documentSnapshot);
        }
      });

      const newMessages = concat(messages, fetchedMessages);
      setMessages(newMessages);
    } catch {
      showUnknownErrorMessage();
    }
    setIsProcessing(false);
  };

  return (
    <>
      <HeaderContainer
        onPress={() => navigation.navigateToUserDetail(route.params.userInfo)}>
        <Text>{userEmoji}</Text>
        <Button>{userName.length > 0 ? userName : 'See user detail'}</Button>
      </HeaderContainer>
      <ScrollView>
        {isLoadedAll === false && (
          <ButtonContainer>
            <Button
              mode="contained"
              onPress={loadOlderMessages}
              disabled={isProcessing}
              loading={isProcessing}>
              Load older ones
            </Button>
          </ButtonContainer>
        )}
        <Container>
          {reverse(messages).map((message) => {
            if (message.isUser) {
              return <UserMessage id={message.id} content={message.content} />;
            } else {
              return (
                <AdvisorMessage id={message.id} content={message.content} />
              );
            }
          })}
        </Container>
      </ScrollView>
      <MessageInput
        messageText={messageText}
        setMessageText={setMessageText}
        conversationDocumentId={documentId}
        isProcessing={isProcessing}
        setIsProcessing={setIsProcessing}
      />
    </>
  );
};

export default ConversationScreen;
