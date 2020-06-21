import React from 'react';
import styled from 'styled-components/native';
import {SelectableTag} from '../../models/tag';
import Tag from './Tag';

const Container = styled.View`
  flex: 1;
  flex-direction: row;
  flex-wrap: wrap;
`;

interface Props {
  selectableTags: SelectableTag[];
  selectedTags: SelectableTag[];
  setSelectedTags: (selectedTags: SelectableTag[]) => void;
}

const Tags = ({selectableTags, selectedTags, setSelectedTags}: Props) => {
  const generatedComponent = selectableTags.map(tag => {
    return (
      <Tag
        selectedTags={selectedTags}
        setSelectedTags={setSelectedTags}
        tag={tag}
        key={tag.tagId}
      />
    );
  });

  return <Container>{generatedComponent}</Container>;
};

export default Tags;
