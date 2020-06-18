import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import HomeScreen from './HomeScreen';
import {UserInfo, UserDetail} from '../../../models/user';
import ConversationScreen from './ConversationScreen';
import UserDetailScreen from './UserDetailScreen';

export type HomeStackParamList = {
  Home: undefined;
  Conversation: {userInfo: UserInfo};
  UserDetail: {userDetail: UserDetail};
};

const Stack = createStackNavigator<HomeStackParamList>();

const HomeNavigator = () => (
  <Stack.Navigator initialRouteName="Home">
    <Stack.Screen
      name="Home"
      component={HomeScreen}
      options={{title: 'Home'}}
    />
    <Stack.Screen
      name="Conversation"
      component={ConversationScreen}
      options={{title: 'Conversation'}}
    />
    <Stack.Screen
      name="UserDetail"
      component={UserDetailScreen}
      options={{title: 'User Detail'}}
    />
  </Stack.Navigator>
);

export default HomeNavigator;
