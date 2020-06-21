import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import MyPageScreen from './MyPageScreen';
import ProfileEditScreen from './ProfileEditScreen';
import MailAddressLinkingScreen from './MailAddressLinkingScreen';
import TagSelectScreen from '../../../screens/TagSelectScreen';

export type UserStackParamList = {
  MyPage: undefined;
  TagSelect: undefined;
  ProfileEdit: undefined;
  MailAddressLinking: undefined;
};

const Stack = createStackNavigator<UserStackParamList>();

const UserNavigator = () => (
  <Stack.Navigator
    initialRouteName="MyPage"
    screenOptions={{headerTintColor: 'black'}}>
    <Stack.Screen
      name="MyPage"
      component={MyPageScreen}
      options={{title: 'My Pate'}}
    />
    <Stack.Screen
      name="TagSelect"
      component={TagSelectScreen}
      options={{title: 'Tag Select'}}
    />
    <Stack.Screen
      name="ProfileEdit"
      component={ProfileEditScreen}
      options={{title: 'Profile Edit'}}
    />
    <Stack.Screen
      name="MailAddressLinking"
      component={MailAddressLinkingScreen}
      options={{title: 'Mail Adress Linking'}}
    />
  </Stack.Navigator>
);

export default UserNavigator;
