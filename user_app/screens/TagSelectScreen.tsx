import React, {useState, useContext, useEffect} from 'react';
import {ScrollView} from 'react-native';
import styled from 'styled-components/native';
import useTags from '../utils/tagSelectScreen/useTags';
import {SelectableTag} from '../models/tag';
import {GroupedTags} from '../models/tagSelectScreen';
import useDistinctNavigation from '../utils/useDistinctNavigation';
import AsyncStorageContext from '../globalContexts/AsyncStorageContext';
import UserContext from '../globalContexts/UserContext';
import useIsProcessing from '../utils/tagSelectScreen/useIsProcessing';
import IsProcessingContext from '../utils/tagSelectScreen/IsProcessingContext';
import CenteredLoadingIndicator from '../components/CenteredLoadingIndicator';
import TagSelectArea from '../components/tagSelectScreen/TagSelectArea';
import MentionedProblemsField from '../components/tagSelectScreen/MentionedProblemsField';
import Footer from '../components/tagSelectScreen/Footer';

const Container = styled.View`
  flex: 1;
  flex-direction: column;
  justify-content: center;
`;

const ScrollViewContainer = styled.View`
  margin: 20px;
  margin-bottom: 60px
  flex-direction: column;
`;

/*
  This screen will be used when
    - registering a new user
    - editing a logged in user's profile
*/
const TagSelectScreen = () => {
  const asyncStorage = useContext(AsyncStorageContext);
  const user = useContext(UserContext);
  const navigation = useDistinctNavigation();
  const tags = useTags();
  const isProcessing = useIsProcessing();

  const [isFetching, setIsFetching] = useState<boolean>(true);
  const [groupedTags, setGroupedTags] = useState<GroupedTags | undefined>(
    undefined,
  );
  const [selectedTags, setSelectedTags] = useState<SelectableTag[]>(
    user.userDocumentState ? user.userDocumentState.tags : [],
  );
  const [mentionedProblems, setMentionedProblems] = useState<string>('');

  useEffect(() => {
    (async () => {
      /*
        A user should be navigate to Login screen first
        if they have registered an account before and not logged in
        because it's highly possible that they own an account.
      */
      if (asyncStorage.isRegistrationDone && user.userAuthState === null) {
        navigation.navigateToLogin();

        /*
          Do not return here to keep fetchng tags
          in case a user want to register a new account.
        */
      }

      setGroupedTags(await tags.fetchTags());

      setIsFetching(false);
    })();
  }, []);

  if (isFetching) {
    return <CenteredLoadingIndicator />;
  }

  return (
    <IsProcessingContext.Provider value={isProcessing}>
      <Container>
        <ScrollView>
          <ScrollViewContainer>
            <TagSelectArea
              groupedTags={groupedTags}
              selectedTags={selectedTags}
              setSelectedTags={setSelectedTags}
            />
            {/*
              Will be hidden while a logged in user is editing
              because this one will be modified on the next screen
            */}
            {user.userAuthState === null && (
              <MentionedProblemsField
                mentionedProblems={mentionedProblems}
                setMentionedProblems={setMentionedProblems}
              />
            )}
          </ScrollViewContainer>
        </ScrollView>
        <Footer
          selectedTags={selectedTags}
          mentionedProblems={mentionedProblems}
        />
      </Container>
    </IsProcessingContext.Provider>
  );
};

export default TagSelectScreen;
