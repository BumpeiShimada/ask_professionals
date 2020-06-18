import React from 'react';
import styled from 'styled-components/native';
import {Title} from 'react-native-paper';
import {SelectableTag, GroupedTags} from '../../models/tag';
import Tags from './Tags';

export const Container = styled.View`
  margin-bottom: 30px;
  flex-direction: column;
`;

interface Props {
  groupedTags: GroupedTags | undefined;
  selectedTags: SelectableTag[];
  setSelectedTags: (selectedTags: SelectableTag[]) => void;
}

const TagSelectArea = ({groupedTags, selectedTags, setSelectedTags}: Props) => {
  /*
    This is an example implementation.
    In this case, there are four types of tags are
    stored in the database.

    You must change them along with your actual data
    in Firestore.
  */
  const homeTags = getTags('homeTags');
  const schoolTags = getTags('schoolTags');
  const futureTags = getTags('futureTags');
  const otherTags = getTags('otherTags');

  function getTags(category: string) {
    return groupedTags ? (
      <Tags
        selectableTags={groupedTags[category]}
        selectedTags={selectedTags}
        setSelectedTags={setSelectedTags}
      />
    ) : (
      <></>
    );
  }

  return (
    <Container>
      <TagGroup title={'Home'} tags={homeTags} />
      <TagGroup title={'School'} tags={schoolTags} />
      <TagGroup title={'Future'} tags={futureTags} />
      <TagGroup title={'Others'} tags={otherTags} />
    </Container>
  );
};

const TagGroupContainer = styled.View`
  margin-top: 10px;
  margin-bottom: 10px;
`;

const TagGroup = ({title, tags}: {title: string; tags: JSX.Element}) => {
  return (
    <TagGroupContainer>
      <Title>{title}</Title>
      {tags}
    </TagGroupContainer>
  );
};

export default TagSelectArea;
