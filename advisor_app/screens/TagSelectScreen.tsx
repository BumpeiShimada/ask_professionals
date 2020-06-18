import React, {useState, useEffect, useContext} from 'react';
import {ScrollView} from 'react-native';
import styled from 'styled-components/native';
import {Headline} from 'react-native-paper';
import useTags from '../utils/useTags';
import {SelectableTag, GroupedTags} from '../models/tag';
import CenteredLoadingIndicator from '../components/CenteredLoadingIndicator';
import TagSelectArea from '../components/tagSelectArea/TagSelectArea';
import TagSelectFooter from '../components/tagSelectArea/TagSelectFooter';
import AdvisorStateContext from '../globalContexts/AdvisorStateContext';

const Container = styled.View`
  flex: 1;
  flex-direction: column;
  justify-content: center;
`;

const ScrollViewContainer = styled.View`
  margin: 20px;
  flex-direction: column;
`;

const CenteredHeadline = styled(Headline)`
  text-align: center;
`;

const TagSelectScreen = () => {
  const tagsHook = useTags();
  const advisorState = useContext(AdvisorStateContext);

  const [isFetching, setIsFetching] = useState<boolean>(true);
  const [groupedTags, setGroupedTags] = useState<GroupedTags | undefined>(
    undefined,
  );
  const [selectedTags, setSelectedTags] = useState<SelectableTag[]>(
    advisorState.advisorDocumentState ? advisorState.advisorDocumentState.tags : [],
  );

  useEffect(() => {
    (async () => {
      setGroupedTags(await tagsHook.fetchTags());

      setIsFetching(false);
    })();
  }, []);

  if (isFetching) {
    return <CenteredLoadingIndicator />;
  }

  return (
    <Container>
      <ScrollView>
        <ScrollViewContainer>
          <CenteredHeadline>
            {'Please select\nwhat you can advice\nas many as possible\n👇'}
          </CenteredHeadline>
          <TagSelectArea
            groupedTags={groupedTags}
            selectedTags={selectedTags}
            setSelectedTags={setSelectedTags}
          />
        </ScrollViewContainer>
      </ScrollView>
      <TagSelectFooter tags={selectedTags} />
    </Container>
  );
};

export default TagSelectScreen;
