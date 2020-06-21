import React, {useContext} from 'react';
import {clone} from 'ramda';
import styled from 'styled-components/native';
import {Chip, useTheme} from 'react-native-paper';
import {SelectableTag} from '../../models/tag';
import IsProcessingContext from '../../utils/tagSelectScreen/IsProcessingContext';

const Container = styled.View`
  margin: 4px;
`;

interface Props {
  selectedTags: SelectableTag[];
  setSelectedTags: (selectedTags: SelectableTag[]) => void;
  tag: SelectableTag;
}

const Tag = ({selectedTags, setSelectedTags, tag}: Props) => {
  const theme = useTheme();
  const isProcessing = useContext(IsProcessingContext);

  const isSelected = !!selectedTags.find(
    selectedTag => selectedTag.tagId === tag.tagId,
  );

  function toggleTagSelect() {
    let modifiedTags: SelectableTag[] = clone(selectedTags);

    if (isSelected) {
      modifiedTags = selectedTags.filter(
        currentSelectedTag => currentSelectedTag.tagId !== tag.tagId,
      );
    } else {
      modifiedTags.push(tag);
    }

    setSelectedTags(modifiedTags);
  }

  return (
    <Container>
      <Chip
        icon={isSelected ? 'check-circle' : 'shape-circle-plus'}
        selectedColor={isSelected ? theme.colors.surface : undefined}
        style={{backgroundColor: isSelected ? theme.colors.accent : '#dcdcdc'}}
        onPress={toggleTagSelect}
        disabled={isProcessing.isProcessingState}>
        {tag.name}
      </Chip>
    </Container>
  );
};

export default Tag;
