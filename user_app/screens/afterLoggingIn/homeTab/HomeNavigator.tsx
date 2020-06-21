import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {AdvisorCardInterface} from '../../../models/homeTab/homeScreen';
import HomeScreen from './HomeScreen';
import AdvisorDetailScreen from './AdvisorDetailScreen';
import ConversationScreen from './ConversationScreen';

export type HomeStackParamList = {
  Home: undefined;
  AdvisorDetail: {advisorCard: AdvisorCardInterface};
  Conversation: {advisorId: string};
};

const Stack = createStackNavigator<HomeStackParamList>();

const HomeNavigator = () => (
  <Stack.Navigator
    initialRouteName="Home"
    screenOptions={{headerTintColor: 'black'}}>
    <Stack.Screen
      name="Home"
      component={HomeScreen}
      options={{title: 'Home'}}
    />
    <Stack.Screen
      name="AdvisorDetail"
      component={AdvisorDetailScreen}
      options={{title: 'Advisor Detail'}}
    />
    <Stack.Screen
      name="Conversation"
      component={ConversationScreen}
      options={{title: 'Conversation'}}
    />
  </Stack.Navigator>
);

export default HomeNavigator;
