import {SelectableTag} from './tag';

export interface AdvisorDocument {
  cardProfile: string;
  detail: string;
  imageUrl: string;
  name: string;
  isConfirmed: boolean;
  isRegistrationDone: boolean;
  tags: SelectableTag[];
  twitterUrl: string;
}

export interface RegisterArgs {
  email: string;
  password: string;
  onError: (error: any) => void;
}

export interface UpdateAdvisorTagsArgs {
  tags: SelectableTag[];
  onSuccess: () => void;
}

export interface UpdateAdvisorImageUrlArgs {
  imageUrl: string;
}

export interface SubmitNewAdvisorArgs {
  onSuccess: () => void;
  onError: () => void;
}

export interface LoginArgs {
  email: string;
  password: string;
  onSuccess: () => void;
  onError: (error: any) => void;
}

export interface LogoutArgs {
  onSuccess: () => void;
  onError: () => void;
}

export interface UpdateAdvisorDocumentStateArgs {
  name: string;
  twitterUrl: string;
  detail: string;
  cardProfile: string;
}
