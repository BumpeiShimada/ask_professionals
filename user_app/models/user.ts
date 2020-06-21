import {SelectableTag} from './tag';

export interface UserDocument {
  name: string;
  emoji: string;
  mentionedProblems: string;
  tags: SelectableTag[];
  askingAdvisorIds: string[];
}
