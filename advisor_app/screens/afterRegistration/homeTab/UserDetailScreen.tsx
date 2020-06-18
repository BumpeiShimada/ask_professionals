import React from 'react';
import {HomeStackParamList} from './HomeNavigator';
import Hyperlink from 'react-native-hyperlink';
import {RouteProp} from '@react-navigation/native';
import {Text, useTheme} from 'react-native-paper';
import {ScrollView} from 'react-native';
import styled from 'styled-components/native';
import SelectedTags from '../../../components/SelectedTags';

type UserDetailScreenRouteProp = RouteProp<HomeStackParamList, 'UserDetail'>;

interface Props {
  route: UserDetailScreenRouteProp;
}

const Container = styled.View`
  margin: 30px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const LargeText = styled(Text)`
  font-size: 17px;
`;

const VerticalSeparator = styled.View`
  height: 7px;
`;

const ColumnSeparator = styled.View`
  height: 20px;
`;

const StyledText = styled.Text`
  font-size: 15px;
  line-height: 18px;
`;

const UserDetailScreen = ({route}: Props) => {
  const {userName, userMentionedProblems, userTags} = route.params.userDetail;

  const theme = useTheme();

  const HyperLinkText = ({text}: {text: string}) => (
    <Hyperlink linkDefault linkStyle={{color: theme.colors.primary}}>
      <StyledText>{text}</StyledText>
    </Hyperlink>
  );

  return (
    <ScrollView>
      <Container>
        <LargeText>"Name"</LargeText>
        <VerticalSeparator />
        <LargeText>{userName.length > 0 ? userName : 'No inputs'}</LargeText>

        {userTags.length > 0 && (
          <>
            <ColumnSeparator />

            <VerticalSeparator />
            <LargeText>"I want to ask..."</LargeText>
            <SelectedTags selectedTags={userTags} />
          </>
        )}

        <ColumnSeparator />

        <LargeText>"Others"</LargeText>
        <VerticalSeparator />
        <HyperLinkText text={userMentionedProblems} />
      </Container>
    </ScrollView>
  );
};

export default UserDetailScreen;
