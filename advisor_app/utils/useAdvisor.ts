import { useContext } from 'react';
import {trim} from 'ramda';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import {
  advisorsCollectionRef,
  serverTimestamp,
  conversationsCollectionRef,
} from '../singletons/firebase';
import {
  AdvisorDocument,
  RegisterArgs,
  UpdateAdvisorTagsArgs,
  UpdateAdvisorImageUrlArgs,
  SubmitNewAdvisorArgs,
  LoginArgs,
  LogoutArgs,
  UpdateAdvisorDocumentStateArgs,
} from '../models/advisor';
import AdvisorStateContext from '../globalContexts/AdvisorStateContext';

const emptyAdvisorDocument: AdvisorDocument = {
  cardProfile: '',
  detail: '',
  imageUrl: '',
  isConfirmed: false,
  isRegistrationDone: false,
  name: '',
  tags: [],
  twitterUrl: '',
};

function useAdvisor() {
  const advisorState = useContext(AdvisorStateContext);

  async function registerAdvisor({
    email,
    password,
    onError,
  }: RegisterArgs) {
    try {
      const userCredentialForAdvisor = await auth().createUserWithEmailAndPassword(
        email,
        password,
      );

      /*
        Set advisorDocumentState so a user is navigated to
        the next screen
      */
      const uid = userCredentialForAdvisor.user?.uid;
      if (uid) {
        const advisorDocRef = advisorsCollectionRef.doc(uid);
        await advisorDocRef.set({
          ...emptyAdvisorDocument,
          createTimestamp: serverTimestamp,
          updateTimestamp: serverTimestamp,
        });

        advisorState.setAdvisorDocumentState(emptyAdvisorDocument);
      } else {
        throw Error('The user credential is not provided');
      }
    } catch (error) {
      /*
        Log out and set undefined as advisorDocumentState 
        to clear current state if something went wrong while registering
      */
      logout({onSuccess: () => {}, onError: () => {}});
      advisorState.setAdvisorDocumentState(undefined);

      onError(error);
    }
  }

  function updateAdvisorDocumentState({
    name,
    twitterUrl,
    detail,
    cardProfile,
  }: UpdateAdvisorDocumentStateArgs) {
    if (advisorState.advisorAuthState && advisorState.advisorDocumentState) {
      const newAdvisor = {
        ...advisorState.advisorDocumentState,
        cardProfile: trim(cardProfile),
        detail,
        name: trim(name),
        twitterUrl,
        updateTimestamp: serverTimestamp,
      };

      advisorState.setAdvisorDocumentState(newAdvisor);
    }
  }

  function updateAdvisorTags({tags, onSuccess}: UpdateAdvisorTagsArgs) {
    let newAdvisor: AdvisorDocument;
    if (advisorState.advisorAuthState && advisorState.advisorDocumentState) {
      newAdvisor = {
        ...advisorState.advisorDocumentState,
        tags,
      };
    } else {
      newAdvisor = {
        ...emptyAdvisorDocument,
        tags,
      };
    }
    advisorState.setAdvisorDocumentState(newAdvisor);
    onSuccess();
  }

  function updateAdvisorImageUrl({imageUrl}: UpdateAdvisorImageUrlArgs) {
    let newAdvisor: AdvisorDocument;
    if (advisorState.advisorAuthState && advisorState.advisorDocumentState) {
      newAdvisor = {
        ...advisorState.advisorDocumentState,
        imageUrl,
      };
    } else {
      newAdvisor = {
        ...emptyAdvisorDocument,
        imageUrl,
      };
    }
    advisorState.setAdvisorDocumentState(newAdvisor);
  }

  async function submitNewAdvisor({onSuccess, onError}: SubmitNewAdvisorArgs) {
    try {
      const uid = advisorState.advisorAuthState?.uid;
      if (uid && advisorState.advisorDocumentState) {
        const batch = firestore().batch();

        const newAdvisor = {
          ...advisorState.advisorDocumentState,
          isRegistrationDone: true,
        };

        const advisorDocRef = advisorsCollectionRef.doc(uid);
        batch.update(advisorDocRef, newAdvisor);

        /*
          Also updates advisorNames on the advisor's conversations
        */
        const conversationsQuerySnapshot = await conversationsCollectionRef
          .where('advisorId', '==', uid)
          .get();
        conversationsQuerySnapshot.forEach((documentSnapshot) => {
          const docRef = conversationsCollectionRef.doc(documentSnapshot.id);
          batch.update(docRef, {
            advisorName: newAdvisor.name,
            advisorImageUrl: newAdvisor.imageUrl,
          });
        });

        await batch.commit();

        advisorState.setAdvisorDocumentState(newAdvisor);
      }

      onSuccess();
    } catch {
      onError();
    }
  }

  async function login({email, password, onSuccess, onError}: LoginArgs) {
    try {
      await auth().signInWithEmailAndPassword(email, password);

      onSuccess();
    } catch (error) {
      onError(error);
    }
  }

  async function logout({onSuccess, onError}: LogoutArgs) {
    try {
      await auth().signOut();
      onSuccess();
    } catch {
      onError();
    }
  }

  return {
    registerAdvisor,
    updateAdvisorDocumentState,
    updateAdvisorTags,
    updateAdvisorImageUrl,
    submitNewAdvisor,
    login,
    logout,
  };
}

export default useAdvisor;
