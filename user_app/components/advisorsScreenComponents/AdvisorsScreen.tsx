import React, {useState, useEffect} from 'react';
import {ScrollView} from 'react-native';
import styled from 'styled-components/native';
import {Advisor} from '../../models/advisor';
import useAdvisor from '../../utils/useAdvisor';
import CenteredLoadingIndicator from '../CenteredLoadingIndicator';
import AdvisorCards from './AdvisorCards';
import {Headline} from 'react-native-paper';

const Container = styled.View`
  margin: 15px 10px;
  flex-direction: column;
`;

const Separator = styled.View`
  height: 15px;
`;

const StyledHeadline = styled(Headline)`
  text-align: center;
`;

/*
  The parent component of this one should not have any React specific functions
  like useState as far as possible
*/
const AdvisorsScreen = () => {
  const [isFetching, setIsFetching] = useState<boolean>(true);
  const [advisors, setAdvisors] = useState<Advisor[]>([]);

  const advisor = useAdvisor();

  useEffect(() => {
    (async () => {
      const fetchedAdvisors = await advisor.fetchAdvisors();
      if (fetchedAdvisors) {
        setAdvisors(fetchedAdvisors);
      }

      setIsFetching(false);
    })();
  }, []);

  if (isFetching) {
    return <CenteredLoadingIndicator />;
  }

  return (
    <ScrollView>
      <Container testID="home_screen_container">
        <StyledHeadline>{'You can ask them\nat the moment\n💬'}</StyledHeadline>
        <Separator />
        <AdvisorCards advisors={advisors} />
      </Container>
    </ScrollView>
  );
};

export default AdvisorsScreen;
