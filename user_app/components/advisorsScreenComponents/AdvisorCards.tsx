import React, {useContext} from 'react';
import {intersection, difference, slice, concat, sort} from 'ramda';
import styled from 'styled-components/native';
import UserContext from '../../globalContexts/UserContext';
import {Advisor} from '../../models/advisor';
import {SelectableTag, SortedTag, SortedTags} from '../../models/tag';
import {AdvisorCardInterface} from '../../models/homeTab/homeScreen';
import AdvisorCard from './AdvisorCard';

const Container = styled.View`
  flex-direction: column;
`;

interface Props {
  advisors: Advisor[];
}

const AdvisorCards = ({advisors}: Props) => {
  const advisorCards = getAdvisorCards(advisors);

  // Advisors who have more matched tags come first
  const diff = (a: AdvisorCardInterface, b: AdvisorCardInterface) =>
    b.tags.matchedTagAmount - a.tags.matchedTagAmount;
  const sortedAdvisorCards = sort(diff, advisorCards);

  return (
    <Container>
      {sortedAdvisorCards.map(advisorCard => {
        return <AdvisorCard advisorCard={advisorCard} key={advisorCard.id} />;
      })}
    </Container>
  );
};

/*
  Change advisor's interface into AdvisorCard for sorting tags
*/
function getAdvisorCards(advisors: Advisor[]): AdvisorCardInterface[] {
  const advisorCards: AdvisorCardInterface[] = advisors.map(advisor => {
    const tagsOnCard = getTagsOnCard(advisor.tags);

    return {
      ...advisor,
      tags: tagsOnCard,
    };
  });

  return advisorCards;
}

/*
  Sort tags so that matched tags come first
  then add isSelected values on each items for changing appearance.

  If it has two or less mathced tags, up to 4 unmatched tags will be shown.
  If it has three or more matched tags, unmatched tags will be hidden.
*/
function getTagsOnCard(advisorTags: SelectableTag[]): SortedTags {
  const user = useContext(UserContext);

  if (!user.userDocumentState || !user.userDocumentState.tags) {
    return {
      matchedTagAmount: 0,
      tagsOnCard: [],
      allTags: [],
    };
  }

  const userTags = user.userDocumentState.tags;

  const matchedTags = intersection(advisorTags, userTags);
  const appendedMatchedTags: SortedTag[] = appendIsSelected(true, matchedTags);

  const unmatchedTags = difference(advisorTags, userTags);
  const appendedUnmatchedTags: SortedTag[] = appendIsSelected(
    false,
    unmatchedTags,
  );
  const slicedAppendedUnmatchedTags: SortedTag[] =
    appendedMatchedTags.length > 2 ? [] : slice(0, 4, appendedUnmatchedTags);

  const matchedTagAmount = appendedMatchedTags.length;

  const concatenatedSlicedTags = concat(
    appendedMatchedTags,
    slicedAppendedUnmatchedTags,
  );

  // This is added to be passed to advisor detail screen as props
  // so that a user can see all tags there
  const concatenatedAllTags = concat(
    appendedMatchedTags,
    appendedUnmatchedTags,
  );

  return {
    matchedTagAmount,
    tagsOnCard: concatenatedSlicedTags,
    allTags: concatenatedAllTags,
  };
}

function appendIsSelected(
  isSelected: boolean,
  tags: SelectableTag[],
): SortedTag[] {
  const sortedTags = tags.map(tag => {
    return {
      isSelected,
      name: tag.name,
      tagId: tag.tagId,
    };
  });

  return sortedTags;
}

export default AdvisorCards;
