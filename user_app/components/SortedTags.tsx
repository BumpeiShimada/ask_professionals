import React from 'react';
import {Chip} from 'react-native-paper';
import styled from 'styled-components/native';
import {SortedTag} from '../models/tag';

const TagsContainer = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
`;

const TagContainer = styled.View`
  margin-top: 2px;
  margin-bottom: 2px;
  margin-right: 4px;
`;

const SortedTags = ({sortedTags}: {sortedTags: SortedTag[]}) => {
  const generatedTagComponents = sortedTags.map(tag => {
    return (
      <TagContainer key={tag.tagId}>
        <Chip icon={tag.isSelected ? 'check-circle' : undefined}>
          {tag.name}
        </Chip>
      </TagContainer>
    );
  });

  return <TagsContainer>{generatedTagComponents}</TagsContainer>;
};

export default SortedTags;
