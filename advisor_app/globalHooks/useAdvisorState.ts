import {useState, useEffect} from 'react';
import auth, {FirebaseAuthTypes} from '@react-native-firebase/auth';
import {
  advisorsCollectionRef,
} from '../singletons/firebase';
import {
  AdvisorDocument,
} from '../models/advisor';

export interface AdvisorStateHook {
  advisorAuthState: FirebaseAuthTypes.User | null;
  advisorDocumentState: AdvisorDocument | undefined;
  setAdvisorDocumentState: (advisorDocumentState: AdvisorDocument | undefined) => void;
  isMountingAuthState: boolean;
}

function useAdvisorState(): AdvisorStateHook {
  const [isMountingAuthState, setIsMountingAuthState] = useState<boolean>(true);

  /*
    null means a user is not logged in
  */
  const [
    advisorAuthState,
    setAdvisorAuthState,
  ] = useState<FirebaseAuthTypes.User | null>(null);

  /*
    undefined means a user is not logged in
  */
  const [advisorDocumentState, setAdvisorDocumentState] = useState<
    AdvisorDocument | undefined
  >(undefined);

  useEffect(() => {
    /*
      This will be executed when:
        - this app is booted
        - something is changed on user authentication data
    */
    const unregisterAuthObserver = auth().onAuthStateChanged(
      async (currentUser: FirebaseAuthTypes.User | null) => {
        setAdvisorAuthState(currentUser);

        if (currentUser) {
          const advisorDocRef = advisorsCollectionRef.doc(currentUser.uid);
          const currentAdvisor = await advisorDocRef.get();

          const data = currentAdvisor.data();
          if (data) {
            const {
              cardProfile,
              detail,
              imageUrl,
              isConfirmed,
              name,
              tags,
              twitterUrl,
              isRegistrationDone,
            } = data;

            const currentAdvisorDocument = {
              cardProfile,
              detail,
              imageUrl,
              isConfirmed,
              name,
              tags,
              twitterUrl,
              isRegistrationDone,
            };

            setAdvisorDocumentState(currentAdvisorDocument);
          }
        } else {
          setAdvisorDocumentState(undefined);
        }

        if (isMountingAuthState) {
          setIsMountingAuthState(false);
        }
      },
    );

    return unregisterAuthObserver;
  }, []);

  return {
    advisorAuthState,
    advisorDocumentState,
    setAdvisorDocumentState,
    isMountingAuthState,
  };
}

export default useAdvisorState;
