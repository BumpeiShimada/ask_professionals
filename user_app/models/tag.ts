export interface SelectableTag {
  tagId: string;
  name: string;
}

export interface SortedTags {
  matchedTagAmount: number;
  tagsOnCard: SortedTag[];
  allTags: SortedTag[];
}

export interface SortedTag extends SelectableTag {
  isSelected: boolean;
}
