import {useState, useEffect} from 'react';
import {trim, clone} from 'ramda';
import firestore from '@react-native-firebase/firestore';
import auth, {FirebaseAuthTypes} from '@react-native-firebase/auth';
import firebase, {
  usersCollectionRef,
  serverTimestamp,
  conversationsCollectionRef,
} from '../singletons/firebase';
import {AuthFormValue} from '../models/userTab/loginScreen';
import {SelectableTag} from '../models/tag';
import {UserDocument} from '../models/user';
import {pickRandomEmoji} from '../utils/emoji';

interface BaseCRUDArgs {
  onSuccess: () => void;
  onError: () => void;
}

interface EmailRegisterAndLinkArgs extends BaseCRUDArgs {
  email: string;
  password: string;
}

interface AnonymousRegisterArgs extends BaseCRUDArgs {
  selectedTags: SelectableTag[];
  mentionedProblems: string;
}

interface EditTagsArgs {
  selectedTags: SelectableTag[];
  onSuccess: () => void;
}

interface UpdateProfileArgs extends BaseCRUDArgs {
  name: string;
  mentionedProblems: string;
}

export interface UserHook {
  userAuthState: FirebaseAuthTypes.User | null;
  isConversationStarted: boolean;
  isEmailLinked: boolean;
  userDocumentState: UserDocument | undefined;
  isMountingAuthState: boolean;
  setIsConversationStartedTrue: () => void;
  emailRegisterAndLink: (args: EmailRegisterAndLinkArgs) => Promise<void>;
  anonymousRegister: (args: AnonymousRegisterArgs) => Promise<void>;
  editTags: (args: EditTagsArgs) => void;
  updateProfile: (args: UpdateProfileArgs) => Promise<void>;
  updateAskingAdvisorIdsState: (advisorId: string) => void;
  login: (
    onSuccess: () => void,
  ) => (values: AuthFormValue, onError: (error: any) => void) => Promise<void>;
  logout: (
    onSuccess: () => void,
  ) => (onError: (error: any) => void) => Promise<void>;
}

function useUser(): UserHook {
  const [
    userAuthState,
    setUserAuthState,
  ] = useState<FirebaseAuthTypes.User | null>(null);
  const [isConversationStarted, setIsConversationStarted] = useState<boolean>(
    false,
  );

  /*
    onAuthStateChanged will not be executed when an email is linked
    so this is used to tell the app the its current state.
  */
  const [isEmailLinked, setIsEmailLinked] = useState<boolean>(false);

  const [userDocumentState, setUserDocumentState] = useState<
    UserDocument | undefined
  >(undefined);
  const [isMountingAuthState, setIsMountingAuthState] = useState<boolean>(true);

  useEffect(() => {
    const unregisterAuthObserver = auth().onAuthStateChanged(
      async (currentUser: FirebaseAuthTypes.User | null) => {
        setUserAuthState(currentUser);

        if (currentUser) {
          setIsEmailLinked(currentUser.isAnonymous === false);

          const userDocRef = usersCollectionRef.doc(currentUser.uid);
          const currentUserSnapshot = await userDocRef.get();

          const data = currentUserSnapshot.data();
          if (data) {
            const {name, emoji, mentionedProblems, tags} = data;

            const conversationsQuerySnapshot = await conversationsCollectionRef
              .where('userId', '==', currentUser.uid)
              .get();

            const askingAdvisorIds: string[] = [];
            conversationsQuerySnapshot.forEach(documentSnapshot => {
              const advisorId = documentSnapshot.get('advisorId') as string;
              askingAdvisorIds.push(advisorId);
            });
            setIsConversationStarted(askingAdvisorIds.length > 0);

            const currentUserDocument = {
              name,
              emoji,
              mentionedProblems,
              tags,
              askingAdvisorIds,
            };

            setUserDocumentState(currentUserDocument);
          }
        } else {
          setUserDocumentState(undefined);
        }

        if (isMountingAuthState) {
          setIsMountingAuthState(false);
        }
      },
    );

    return unregisterAuthObserver;
  }, []);

  function setIsConversationStartedTrue() {
    setIsConversationStarted(true);
  }

  async function emailRegisterAndLink({
    email,
    password,
    onSuccess,
    onError,
  }: EmailRegisterAndLinkArgs) {
    try {
      const credential = firebase.auth.EmailAuthProvider.credential(
        email,
        password,
      );
      await auth().currentUser?.linkWithCredential(credential);
      setIsEmailLinked(true);
      onSuccess();
    } catch {
      onError();
    }
  }

  async function anonymousRegister({
    selectedTags,
    mentionedProblems,
    onSuccess,
    onError,
  }: AnonymousRegisterArgs) {
    try {
      const userCredential = await auth().signInAnonymously();

      const uid = userCredential.user?.uid;
      if (uid) {
        const userDocRef = usersCollectionRef.doc(uid);

        await userDocRef.set({
          name: '',
          emoji: pickRandomEmoji(),
          mentionedProblems: trim(mentionedProblems),
          tags: selectedTags,
          createTimestamp: serverTimestamp,
          updateTimestamp: serverTimestamp,
        });
      }

      onSuccess();
    } catch {
      // In case something went wrong after logging in
      logout(() => {})(() => {});

      onError();
    }
  }

  function editTags({selectedTags, onSuccess}: EditTagsArgs) {
    // When this function is called, a user must be logged in
    if (userDocumentState) {
      setUserDocumentState({
        ...userDocumentState,
        tags: selectedTags,
      });
    }

    onSuccess();
  }

  async function updateProfile({
    name,
    mentionedProblems,
    onSuccess,
    onError,
  }: UpdateProfileArgs) {
    try {
      const uid = userAuthState?.uid;

      // When this function is called, a user must be logged in
      if (uid && userDocumentState) {
        const batch = firestore().batch();

        const userDocRef = usersCollectionRef.doc(uid);
        batch.update(userDocRef, {
          name: trim(name),
          mentionedProblems: trim(mentionedProblems),
          tags: userDocumentState.tags,
          updateTimestamp: serverTimestamp,
        });

        // Also update userNames on the user's conversations
        const conversationsQuerySnapshot = await conversationsCollectionRef
          .where('userId', '==', uid)
          .get();
        conversationsQuerySnapshot.forEach(documentSnapshot => {
          const docRef = conversationsCollectionRef.doc(documentSnapshot.id);
          batch.update(docRef, {
            userName: name,
            userMentionedProblems: trim(mentionedProblems),
            userTags: userDocumentState.tags,
          });
        });

        await batch.commit();

        setUserDocumentState({
          ...userDocumentState,
          name: trim(name),
          mentionedProblems: trim(mentionedProblems),
        });
      }

      onSuccess();
    } catch {
      onError();
    }
  }

  function updateAskingAdvisorIdsState(advisorId: string) {
    if (userDocumentState) {
      const newAskingAdvisorIds = clone(userDocumentState.askingAdvisorIds);
      newAskingAdvisorIds.push(advisorId);

      setUserDocumentState({
        ...userDocumentState,
        askingAdvisorIds: newAskingAdvisorIds,
      });
    }
  }

  function login(onSuccess: () => void) {
    return async (values: AuthFormValue, onError: (error: any) => void) => {
      try {
        await auth().signInWithEmailAndPassword(values.email, values.password);

        onSuccess();
      } catch (error) {
        // In case something went wrong after logging in
        logout(() => {})(() => {});

        onError(error);
      }
    };
  }

  function logout(onSuccess: () => void) {
    return async (onError: () => void) => {
      try {
        await auth().signOut();
        setUserDocumentState(undefined);

        onSuccess();
      } catch {
        onError();
      }
    };
  }

  return {
    userAuthState,
    isConversationStarted,
    isEmailLinked,
    userDocumentState,
    isMountingAuthState,
    setIsConversationStartedTrue,
    emailRegisterAndLink,
    anonymousRegister,
    editTags,
    updateProfile,
    updateAskingAdvisorIdsState,
    login,
    logout,
  };
}

export default useUser;
