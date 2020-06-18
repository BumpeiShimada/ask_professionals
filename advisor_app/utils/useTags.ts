import {useContext} from 'react';
import {groupBy} from 'ramda';
import {tagsCollectionRef} from '../singletons/firebase';
import SnackbarContext from '../globalContexts/SnackbarContext';
import {SelectableTag, FetchedTag, GroupedTags} from '../models/tag';

function useTags() {
  const {showUnknownErrorMessage} = useContext(SnackbarContext);

  async function fetchTags(): Promise<GroupedTags | undefined> {
    try {
      const fetchedTags: FetchedTag[] = [];

      const fetchedTagsSnapshot = await tagsCollectionRef.get();
      fetchedTagsSnapshot.forEach((doc: any) => {
        if (doc.exists) {
          fetchedTags.push({
            id: doc.id,
            category: doc.data().category,
            name: doc.data().name,
          });
        }
      });

      const byCategory = groupBy(
        (fetchedTag: FetchedTag) => fetchedTag.category,
      );
      const groupedTags = byCategory(fetchedTags);

      /*
        This is an example implementation.
        In this case, there are four types of tags are
        stored in the database.

        You must change them along with your actual data
        in Firestore.
      */
      const homeTags = convertToSelectableTags(groupedTags.home);
      const schoolTags = convertToSelectableTags(groupedTags.school);
      const futureTags = convertToSelectableTags(groupedTags.future);
      const otherTags = convertToSelectableTags(groupedTags.other);

      return {
        homeTags,
        schoolTags,
        futureTags,
        otherTags,
      };
    } catch {
      showUnknownErrorMessage();
    }
  }

  return {
    fetchTags,
  };
}

function convertToSelectableTags(fetchedTags: FetchedTag[]): SelectableTag[] {
  let convertedTags: SelectableTag[] = [];

  if (fetchedTags) {
    fetchedTags.map((tag: FetchedTag) => {
      convertedTags.push({
        tagId: tag.id,
        name: tag.name,
      });
    });
  }

  return convertedTags;
}

export default useTags;
