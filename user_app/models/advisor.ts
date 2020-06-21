import {SelectableTag} from './tag';

export interface Advisor extends BaseAdvisor {
  tags: SelectableTag[];
}

export interface BaseAdvisor {
  id: string;
  name: string;
  twitterUrl: string;
  cardProfile: string;
  detail: string;
  imageUrl: string;
}
