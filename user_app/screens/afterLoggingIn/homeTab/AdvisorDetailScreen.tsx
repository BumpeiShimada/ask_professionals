import React, {useContext} from 'react';
import {ScrollView} from 'react-native';
import {RouteProp} from '@react-navigation/native';
import {Card, Headline, Title, FAB, useTheme} from 'react-native-paper';
import Hyperlink from 'react-native-hyperlink';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import styled from 'styled-components/native';
import {HomeStackParamList} from './HomeNavigator';
import useExternalLink from '../../../utils/useExternalLink';
import SortedTags from '../../../components/SortedTags';
import SnackbarContext from '../../../globalContexts/SnackbarContext';
import UserContext from '../../../globalContexts/UserContext';
import useConversation from '../../../utils/useConversation';
import {contains} from 'ramda';
import useDistinctNavigation from '../../../utils/useDistinctNavigation';

type AdvisorDetailScreenRouteProp = RouteProp<
  HomeStackParamList,
  'AdvisorDetail'
>;

interface Props {
  route: AdvisorDetailScreenRouteProp;
}

const Container = styled.View`
  margin: 15px 20px 90px;
  flex-direction: column;
`;

const HeadlineContainer = styled.View`
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;

const HorizontalSeparator = styled.View`
  width: 5px;
`;

const VerticalSeparator = styled.View`
  height: 7px;
`;

const ColumnSeparator = styled.View`
  height: 20px;
`;

const NormalFontWeightTitle = styled(Title)`
  font-weight: normal;
`;

const BottomFABContaiter = styled.View`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const BottomFAB = styled(FAB)`
  width: 150px;
  position: absolute;
  bottom: 20px;
`;

const StyledText = styled.Text`
  font-size: 15px;
  line-height: 18px;
`;

const AdvisorDetailScreen = ({route}: Props) => {
  const {
    id,
    imageUrl,
    name,
    twitterUrl,
    detail,
    tags,
    cardProfile,
  } = route.params.advisorCard;
  const externalLink = useExternalLink();
  const theme = useTheme();
  const conversation = useConversation();
  const {showUnknownErrorMessage} = useContext(SnackbarContext);
  const user = useContext(UserContext);
  const navigation = useDistinctNavigation();

  const HyperLinkText = ({text}: {text: string}) => (
    <Hyperlink linkDefault linkStyle={{color: theme.colors.primary}}>
      <StyledText>{text}</StyledText>
    </Hyperlink>
  );

  const startNewConversation = async () => {
    try {
      await conversation.startNewConversation({
        advisorId: id,
        advisorName: name,
        advisorImageUrl: imageUrl,
      });
    } catch {
      showUnknownErrorMessage();
    }
  };

  const alreadyAsking = user.userDocumentState
    ? contains(id, user.userDocumentState.askingAdvisorIds)
    : false;

  return (
    <>
      <ScrollView>
        <Card.Cover source={{uri: imageUrl}} />
        <Container>
          <HeadlineContainer>
            <Headline style={{textAlign: 'center', fontWeight: 'bold'}}>
              {name}
            </Headline>
            {twitterUrl.length > 0 && (
              <>
                <HorizontalSeparator />
                <MaterialCommunityIcons
                  name="twitter"
                  size={25}
                  color="#00acee"
                  onPress={() => externalLink.openExternalLink(twitterUrl)}
                />
              </>
            )}
          </HeadlineContainer>

          <VerticalSeparator />

          <HyperLinkText text={detail} />

          <ColumnSeparator />

          <NormalFontWeightTitle>I'm familiar with...</NormalFontWeightTitle>
          <VerticalSeparator />
          <SortedTags sortedTags={tags.allTags} />

          <ColumnSeparator />

          <NormalFontWeightTitle>Comment</NormalFontWeightTitle>
          <HyperLinkText text={cardProfile} />
        </Container>
      </ScrollView>

      <BottomFABContaiter>
        <BottomFAB
          icon="chat"
          label="Start chat"
          theme={{
            ...theme,
            colors: {
              accent: theme.colors.primary,
            },
          }}
          onPress={
            alreadyAsking
              ? () => navigation.navigateToConversation(id)
              : startNewConversation
          }
        />
      </BottomFABContaiter>
    </>
  );
};

export default AdvisorDetailScreen;
