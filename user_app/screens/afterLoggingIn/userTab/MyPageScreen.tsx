import React, {useState, useContext} from 'react';
import {ScrollView} from 'react-native';
import {
  Divider,
  Text,
  Title,
  FAB,
  Paragraph,
  Button,
  useTheme,
} from 'react-native-paper';
import styled from 'styled-components/native';
import Hyperlink from 'react-native-hyperlink';
import UserContext from '../../../globalContexts/UserContext';
import LogoutDialog from '../../../components/myPageScreen/LogoutDialog';
import useDistinctNavigation from '../../../utils/useDistinctNavigation';
import SelectedTags from '../../../components/myPageScreen/SelectedTags';

const NOT_ENTERED = 'Not entered';

const Container = styled.View`
  margin: 30px;
`;

const CenteredContainer = styled.View`
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const StyledDivider = styled(Divider)`
  width: 200px;
  margin: 22px 0px;
`;

const VerticalSeparator = styled.View`
  height: 7px;
`;

const ColumnSeparator = styled.View`
  height: 20px;
`;

const FABContaiter = styled.View`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const LargeText = styled(Text)`
  font-size: 17px;
`;

const StyledFAB = styled(FAB)`
  width: 250px;
  elevation: 2;
`;

const MyPageScreen = () => {
  const user = useContext(UserContext);
  const navigation = useDistinctNavigation();
  const theme = useTheme();

  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [isDialogVisible, setIsDialogVisible] = useState<boolean>(false);

  const HyperLinkText = ({text}: {text: string}) => (
    <Hyperlink linkDefault linkStyle={{color: theme.colors.primary}}>
      <LargeText>{text}</LargeText>
    </Hyperlink>
  );

  let name = NOT_ENTERED;
  let mentionedProblems = NOT_ENTERED;

  if (user.userDocumentState) {
    if (user.userDocumentState.name.length > 0) {
      name = user.userDocumentState.name;
    }

    if (user.userDocumentState.mentionedProblems.length > 0) {
      mentionedProblems = user.userDocumentState.mentionedProblems;
    }
  }

  return (
    <>
      <ScrollView>
        <Container>
          <CenteredContainer>
            {user.isEmailLinked === true && (
              <Paragraph style={{textAlign: 'center'}}>
                ✉️ Email linked
              </Paragraph>
            )}

            {user.isEmailLinked === false && (
              <>
                <FABContaiter>
                  <StyledFAB
                    icon="email"
                    label="Link email address"
                    onPress={navigation.navigateToMailAddressLinking}
                  />
                </FABContaiter>

                <ColumnSeparator />

                <Paragraph style={{textAlign: 'center'}}>
                  {
                    'If you link an email,\nyou can login again when you lost your phone for instance.'
                  }
                </Paragraph>
              </>
            )}

            <StyledDivider style={{backgroundColor: 'gray'}} />

            <Title>Name</Title>
            <VerticalSeparator />
            <LargeText>{name}</LargeText>

            {user.userDocumentState && (
              <>
                <ColumnSeparator />
                <VerticalSeparator />
                <Title>I want to ask about...</Title>
                <SelectedTags tags={user.userDocumentState.tags} />
              </>
            )}

            <ColumnSeparator />

            <Title>Other things to mention</Title>
            <VerticalSeparator />
            <HyperLinkText text={mentionedProblems} />

            <ColumnSeparator />

            <Button
              icon={'square-edit-outline'}
              disabled={isProcessing}
              onPress={navigation.navigateToTagSelect}>
              Edit my profile
            </Button>

            <StyledDivider style={{backgroundColor: 'gray'}} />

            <Button onPress={() => setIsDialogVisible(true)}>
              Logout
            </Button>
          </CenteredContainer>
        </Container>
      </ScrollView>
      <LogoutDialog
        isDialogVisible={isDialogVisible}
        setIsDialogVisible={setIsDialogVisible}
        isProcessing={isProcessing}
        setIsProcessing={setIsProcessing}
      />
    </>
  );
};

export default MyPageScreen;
