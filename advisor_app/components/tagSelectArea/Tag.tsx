import React from 'react';
import {clone} from 'ramda';
import styled from 'styled-components/native';
import {Chip, useTheme} from 'react-native-paper';
import {SelectableTag} from '../../models/tag';

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

  const isSelected = !!selectedTags.find(
    (selectedTag) => selectedTag.tagId === tag.tagId,
  );

  const StypedChip = styled(Chip)`
    background-color: ${isSelected ? theme.colors.accent : '#dcdcdc'};
  `;

  function toggleTagSelect() {
    let modifiedTags: SelectableTag[] = clone(selectedTags);

    if (isSelected) {
      modifiedTags = selectedTags.filter(
        (currentSelectedTag) => currentSelectedTag.tagId !== tag.tagId,
      );
    } else {
      modifiedTags.push(tag);
    }

    setSelectedTags(modifiedTags);
  }

  return (
    <Container>
      <StypedChip
        icon={isSelected ? 'check-circle' : 'shape-circle-plus'}
        selectedColor={isSelected ? theme.colors.surface : undefined}
        onPress={toggleTagSelect}>
        {tag.name}
      </StypedChip>
    </Container>
  );
};

export default Tag;
