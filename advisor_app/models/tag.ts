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

export interface FetchedTag {
  id: string;
  category: string;
  name: string;
}

export interface GroupedTags {
  homeTags: SelectableTag[];
  schoolTags: SelectableTag[];
  futureTags: SelectableTag[];
  otherTags: SelectableTag[];

  [key: string]: SelectableTag[];
}
