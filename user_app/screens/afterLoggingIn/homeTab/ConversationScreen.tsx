import React, {useState, useEffect, useContext} from 'react';
import {RouteProp} from '@react-navigation/native';
import {ScrollView} from 'react-native';
import styled from 'styled-components/native';
import {HomeStackParamList} from './HomeNavigator';
import CenteredLoadingIndicator from '../../../components/CenteredLoadingIndicator';
import {Avatar, Button} from 'react-native-paper';
import {FirebaseFirestoreTypes} from '@react-native-firebase/firestore';
import {
  conversationsCollectionRef,
  advisorsCollectionRef,
  serverTimestamp,
} from '../../../singletons/firebase';
import UserContext from '../../../globalContexts/UserContext';
import SnackbarContext from '../../../globalContexts/SnackbarContext';
import {reverse, concat} from 'ramda';
import {
  UserMessage,
  AdvisorMessage,
  MessageInput,
} from '../../../components/ConversationScreen';
import useDistinctNavigation from '../../../utils/useDistinctNavigation';
import {AdvisorCardInterface} from '../../../models/homeTab/homeScreen';
import {SortedTag, SelectableTag} from '../../../models/tag';

const Container = styled.View`
  margin: 10px;
  flex-direction: column;
`;

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

interface Message {
  id: string;
  isUser: boolean;
  content: string;
  sendTimestamp: FirebaseFirestoreTypes.Timestamp;
}

type ConversationScreenRouteProp = RouteProp<
  HomeStackParamList,
  'Conversation'
>;

interface Props {
  route: ConversationScreenRouteProp;
}

const ConversationScreen = ({route}: Props) => {
  const {advisorId} = route.params;

  const [isFetching, setIsFetching] = useState<boolean>(true);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const [isLoadedAll, setIsLoadedAll] = useState<boolean>(false);
  const [lastDocumentSnapshot, setLastDocumentSnapshot] = useState<
    FirebaseFirestoreTypes.QueryDocumentSnapshot | undefined
  >(undefined);
  const [messages, setMessages] = useState<Message[]>([]);

  const [documentId, setDocumentId] = useState<string>('');
  const [headerTitle, setHeaderTitle] = useState<string>('');
  const [headerImageUrl, setHeaderImageUrl] = useState<string>('');
  const [advisorCard, setAdvisorCard] = useState<
    AdvisorCardInterface | undefined
  >(undefined);
  const [messageText, setMessageText] = useState<string>('');

  const user = useContext(UserContext);
  const {showUnknownErrorMessage} = useContext(SnackbarContext);
  const navigation = useDistinctNavigation();

  useEffect(() => {
    (async () => {
      try {
        if (user.userAuthState) {
          const currentDocumentId = `${user.userAuthState.uid}${advisorId}`;
          const conversationDocumentReference = conversationsCollectionRef.doc(
            currentDocumentId,
          );

          /*
            Update document on server
           */
          await conversationDocumentReference.update({
            isUnreadByUser: false,
            updateTimestamp: serverTimestamp,
          });

          /*
            Fetch the advisor's name to set it as a title
          */
          const advisorDocumentSnapshot = await advisorsCollectionRef
            .doc(advisorId)
            .get();
          if (advisorDocumentSnapshot.exists) {
            const advisorName = advisorDocumentSnapshot.get('name') as string;
            const advisorImageUrl = advisorDocumentSnapshot.get(
              'imageUrl',
            ) as string;

            setHeaderTitle(advisorName);
            setHeaderImageUrl(advisorImageUrl);

            const twitterUrl = advisorDocumentSnapshot.get(
              'twitterUrl',
            ) as string;
            const cardProfile = advisorDocumentSnapshot.get(
              'cardProfile',
            ) as string;
            const detail = advisorDocumentSnapshot.get('detail') as string;

            const allTags: SortedTag[] = [];
            const fetchedTags: SelectableTag[] = advisorDocumentSnapshot.get(
              'tags',
            ) as [];
            fetchedTags.map(tag => {
              allTags.push({
                tagId: tag.tagId,
                name: tag.name,
                isSelected: false,
              });
            });

            setAdvisorCard({
              id: advisorDocumentSnapshot.id,
              name: advisorName,
              twitterUrl,
              cardProfile,
              detail,
              imageUrl: advisorImageUrl,
              tags: {
                matchedTagAmount: 0,
                tagsOnCard: [],
                allTags,
              },
            });

            setDocumentId(currentDocumentId);
          }
        } else {
          showUnknownErrorMessage();
        }
      } catch {
        showUnknownErrorMessage();
      }

      setIsFetching(false);
    })();
  }, []);

  useEffect(() => {
    const userId = user.userAuthState ? user.userAuthState.uid : '';

    const currentDocumentId = `${userId}${advisorId}`;
    const conversationDocumentReference = conversationsCollectionRef.doc(
      currentDocumentId,
    );

    /*
      Fetch and subscribe to the messages in this conversation
    */
    const subscriber = conversationDocumentReference
      .collection('messages')
      .orderBy('sendTimestamp', 'desc')
      .limit(10)
      .onSnapshot(snapshot => {
        if (snapshot.size < 10) {
          setIsLoadedAll(true);
        } else {
          setIsLoadedAll(false);
        }

        const fetchedMessages: Message[] = [];

        let counter = 0;
        snapshot.forEach(documentSnapshot => {
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

  const navigateToAdvisorDetail = () => {
    if (advisorCard) {
      return navigation.navigateToAdvisorDetail(advisorCard);
    }
  };

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
      querySnapshot.forEach(documentSnapshot => {
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
      <HeaderContainer onPress={navigateToAdvisorDetail}>
        <Avatar.Image size={24} source={{uri: headerImageUrl}} />
        <Button>{headerTitle}</Button>
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
          {reverse(messages).map(message => {
            if (message.isUser) {
              return <UserMessage id={message.id} content={message.content} />;
            } else {
              return (
                <AdvisorMessage
                  id={message.id}
                  content={message.content}
                  advisorImageUrl={headerImageUrl}
                  navigateToAdvisorDetail={navigateToAdvisorDetail}
                />
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
