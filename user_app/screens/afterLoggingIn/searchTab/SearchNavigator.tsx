import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import AdvisorsScreen from '../../../components/advisorsScreenComponents/AdvisorsScreen';
import {AdvisorCardInterface} from '../../../models/homeTab/homeScreen';
import AdvisorDetailScreen from '../homeTab/AdvisorDetailScreen';

export type HomeStackParamList = {
  Search: undefined;
  AdvisorDetail: {advisorCard: AdvisorCardInterface};
};

const Stack = createStackNavigator<HomeStackParamList>();

const SearchNavigator = () => (
  <Stack.Navigator
    initialRouteName="Search"
    screenOptions={{headerTintColor: 'black'}}>
    <Stack.Screen
      name="Search"
      component={AdvisorsScreen}
      options={{title: 'Search'}}
    />
    <Stack.Screen
      name="AdvisorDetail"
      component={AdvisorDetailScreen}
      options={{title: 'Advisor Detail'}}
    />
  </Stack.Navigator>
);

export default SearchNavigator;
