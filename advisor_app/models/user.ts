import {SelectableTag} from './tag';

export interface UserInfo {
  userId: string;
  userName: string;
  userEmoji: string;
  userMentionedProblems: string;
  userTags: SelectableTag[];
}

export interface UserDetail {
  userName: string;
  userMentionedProblems: string;
  userTags: SelectableTag[];
}
