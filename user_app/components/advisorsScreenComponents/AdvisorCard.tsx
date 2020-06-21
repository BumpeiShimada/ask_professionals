import React, {useContext} from 'react';
import {contains} from 'ramda';
import {Card, Title, Paragraph, Button} from 'react-native-paper';
import styled from 'styled-components/native';
import useDistinctNavigation from '../../utils/useDistinctNavigation';
import useExternalLink from '../../utils/useExternalLink';
import useConversation from '../../utils/useConversation';
import {AdvisorCardInterface} from '../../models/homeTab/homeScreen';
import SortedTags from '../SortedTags';
import SnackbarContext from '../../globalContexts/SnackbarContext';
import UserContext from '../../globalContexts/UserContext';

const Container = styled.View`
  margin-bottom: 15px;
`;

const Separator = styled.View`
  height: 8px;
`;

interface Props {
  advisorCard: AdvisorCardInterface;
}

const AdvisorCard = ({advisorCard}: Props) => {
  const navigation = useDistinctNavigation();
  const externalLink = useExternalLink();
  const conversation = useConversation();
  const {showUnknownErrorMessage} = useContext(SnackbarContext);
  const user = useContext(UserContext);

  const navigateToAdvisorDetail = () =>
    navigation.navigateToAdvisorDetail(advisorCard);

  const startNewConversation = async () => {
    try {
      await conversation.startNewConversation({
        advisorId: advisorCard.id,
        advisorName: advisorCard.name,
        advisorImageUrl: advisorCard.imageUrl,
      });
    } catch {
      showUnknownErrorMessage();
    }
  };

  const alreadyAsking = user.userDocumentState
    ? contains(advisorCard.id, user.userDocumentState.askingAdvisorIds)
    : false;

  return (
    <Container>
      <Card onPress={navigateToAdvisorDetail}>
        <Card.Cover
          source={{uri: advisorCard.imageUrl}}
        />
        <Separator />
        <Card.Content>
          <Title>{advisorCard.name}</Title>
          <Paragraph>{advisorCard.cardProfile}</Paragraph>
          <Separator />
          <SortedTags sortedTags={advisorCard.tags.tagsOnCard} />
        </Card.Content>
        <Card.Actions>
          <Button
            icon="chat"
            onPress={
              alreadyAsking
                ? () => navigation.navigateToConversation(advisorCard.id)
                : startNewConversation
            }>
            Ask
          </Button>
          {advisorCard.twitterUrl.length > 0 && (
            <Button
              icon="twitter"
              onPress={() =>
                advisorCard.twitterUrl
                  ? externalLink.openExternalLink(advisorCard.twitterUrl)
                  : {}
              }>
              Twitter
            </Button>
          )}
          <Button icon="face-profile" onPress={navigateToAdvisorDetail}>
            Detail
          </Button>
        </Card.Actions>
      </Card>
    </Container>
  );
};

export default AdvisorCard;
