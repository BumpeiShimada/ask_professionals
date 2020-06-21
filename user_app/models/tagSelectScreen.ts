import {SelectableTag} from './tag';

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
