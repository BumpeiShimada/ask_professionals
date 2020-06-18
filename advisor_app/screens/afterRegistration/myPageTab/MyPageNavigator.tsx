import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import MyPageScreen from './MyPageScreen';
import ProfileEditScreen from '../../../screens/ProfileEditScreen';
import ProfileEditConfirmScreen from '../../../screens/ProfileEditConfirmScreen';
import TagSelectScreen from '../../../screens/TagSelectScreen';
import ImageUploadScreen from '../../../screens/ImageUploadScreen';

const Stack = createStackNavigator<{
  MyPage: undefined;
  TagSelect: undefined;
  ProfileEdit: undefined;
  ImageUpload: undefined;
  ProfileEditConfirm: undefined;
}>();

const MyPageNavigator = () => (
  <Stack.Navigator
    initialRouteName="MyPage"
    screenOptions={{headerTintColor: 'black'}}>
    <Stack.Screen
      name="MyPage"
      component={MyPageScreen}
      options={{title: 'My Page'}}
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
      name="ImageUpload"
      component={ImageUploadScreen}
      options={{title: 'Image Upload'}}
    />
    <Stack.Screen
      name="ProfileEditConfirm"
      component={ProfileEditConfirmScreen}
      options={{title: 'Profile Confirmation'}}
    />
  </Stack.Navigator>
);

export default MyPageNavigator;
