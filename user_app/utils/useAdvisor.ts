import {useContext} from 'react';
import {advisorsCollectionRef} from '../singletons/firebase';
import {Advisor} from '../models/advisor';
import SnackbarContext from '../globalContexts/SnackbarContext';

function useAdvisor() {
  const {showUnknownErrorMessage} = useContext(SnackbarContext);

  async function fetchAdvisors() {
    try {
      const fetchedAdvisors: Advisor[] = [];

      const fetchedTagsSnapshot = await advisorsCollectionRef.get();
      fetchedTagsSnapshot.forEach(doc => {
        if (doc.exists) {
          fetchedAdvisors.push({
            id: doc.id,
            name: doc.data().name,
            twitterUrl: doc.data().twitterUrl,
            cardProfile: doc.data().cardProfile,
            detail: doc.data().detail,
            tags: doc.data().tags,
            imageUrl: doc.data().imageUrl,
          });
        }
      });

      return fetchedAdvisors;
    } catch {
      showUnknownErrorMessage();
    }
  }

  return {
    fetchAdvisors,
  };
}

export default useAdvisor;
