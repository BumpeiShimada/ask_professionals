import React from 'react';
import styled from 'styled-components/native';
import {Chip} from 'react-native-paper';
import {SelectableTag} from '../models/tag';

const TagsContainer = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
`;

const TagContainer = styled.View`
  margin-top: 2px;
  margin-bottom: 2px;
  margin-right: 4px;
`;

interface Props {
  selectedTags: SelectableTag[];
}

const SelectedTags = ({selectedTags}: Props) => {
  const generatedTagComponents = selectedTags.map((tag) => {
    return (
      <TagContainer key={tag.tagId}>
        <Chip icon="check">{tag.name}</Chip>
      </TagContainer>
    );
  });

  return <TagsContainer>{generatedTagComponents}</TagsContainer>;
};

export default SelectedTags;
