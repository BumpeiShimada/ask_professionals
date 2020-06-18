import React, {useContext} from 'react';
import {Card, Headline, Title, useTheme} from 'react-native-paper';
import Hyperlink from 'react-native-hyperlink';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import styled from 'styled-components/native';
import {AdvisorDocument} from '../models/advisor';
import SelectedTags from './SelectedTags';
import AdvisorStateContext from '../globalContexts/AdvisorStateContext';

const Container = styled.View`
  margin: 15px 20px 20px;
  flex-direction: column;
`;

const HeadlineContainer = styled.View`
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;

const CenteredBoldHeadline = styled(Headline)`
  text-align: center;
  font-weight: bold;
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

const FABSpace = styled.View`
  height: 70px;
`;

const NormalFontWeightTitle = styled(Title)`
  font-weight: normal;
`;

const StyledText = styled.Text`
  font-size: 15px;
  line-height: 18px;
`;

interface Props {
  advisorDocument: AdvisorDocument;
}

const AdvisorDetail = ({advisorDocument}: Props) => {
  const {imageUrl, name, twitterUrl, detail, cardProfile} = advisorDocument;
  const theme = useTheme();
  const advisorState = useContext(AdvisorStateContext);

  const HyperLinkText = ({text}: {text: string}) => (
    <Hyperlink linkDefault linkStyle={{color: theme.colors.primary}}>
      <StyledText>{text}</StyledText>
    </Hyperlink>
  );

  return (
    <>
      <Card.Cover source={{uri: imageUrl}} />
      <Container>
        <HeadlineContainer>
          <CenteredBoldHeadline>{name}</CenteredBoldHeadline>
          {twitterUrl.length > 0 && (
            <>
              <HorizontalSeparator />
              <MaterialCommunityIcons
                name="twitter"
                size={25}
                color="#00acee"
              />
            </>
          )}
        </HeadlineContainer>
        <VerticalSeparator />
        <HyperLinkText text={detail} />

        <ColumnSeparator />

        <NormalFontWeightTitle>I'm familiar with...</NormalFontWeightTitle>
        <VerticalSeparator />
        <SelectedTags selectedTags={advisorDocument.tags} />

        <ColumnSeparator />

        <NormalFontWeightTitle>Comment</NormalFontWeightTitle>
        <HyperLinkText text={cardProfile} />
      </Container>
      {advisorState.advisorDocumentState?.isRegistrationDone === false && (
        <FABSpace />
      )}
    </>
  );
};

export default AdvisorDetail;
