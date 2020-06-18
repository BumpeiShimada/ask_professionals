import * as Yup from 'yup';

export const ProfileFormValidation = Yup.object({
  name: Yup.string().required(),
  twitterUrl: Yup.string().url(),
  detail: Yup.string().required(),
  cardProfile: Yup.string().max(140).required(),
});
