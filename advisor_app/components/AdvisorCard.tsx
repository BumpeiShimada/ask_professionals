import React from 'react';
import {Card, Title, Paragraph, Button} from 'react-native-paper';
import styled from 'styled-components/native';
import {AdvisorDocument} from '../models/advisor';
import SelectedTags from './SelectedTags';

const Container = styled.View`
  margin: 0px 10px;
`;

const Separator = styled.View`
  height: 8px;
`;

interface Props {
  advisorDocument: AdvisorDocument;
}

const AdvisorCard = ({advisorDocument}: Props) => (
  <Container>
    <Card>
      <Card.Cover source={{uri: advisorDocument.imageUrl}} />
      <Separator />
      <Card.Content>
        <Title>{advisorDocument.name}</Title>
        <Paragraph>{advisorDocument.cardProfile}</Paragraph>
        <Separator />
        <SelectedTags selectedTags={advisorDocument.tags} />
      </Card.Content>
      <Card.Actions>
        <Button icon="chat">Ask</Button>
        {advisorDocument.twitterUrl.length > 0 && (
          <Button icon="twitter">Twitter</Button>
        )}
        <Button icon="face-profile">Detail</Button>
      </Card.Actions>
    </Card>
  </Container>
);

export default AdvisorCard;
