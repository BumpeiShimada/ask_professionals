import React, {useContext} from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import RegisterScreen from './RegisterScreen';
import ProfileEditScreen from '../ProfileEditScreen';
import AdvisorStateContext from '../../globalContexts/AdvisorStateContext';
import ProfileEditConfirmScreen from '../ProfileEditConfirmScreen';
import TagSelectScreen from '../TagSelectScreen';
import LoginScreen from './LoginScreen';
import ImageUploadScreen from '../ImageUploadScreen';

const BeforeRegistrationStack = createStackNavigator<{
  Register: undefined;
  Login: undefined;
  ProfileEditConfirm: undefined;
}>();

const Stack = createStackNavigator<{
  TagSelect: undefined;
  ProfileEdit: undefined;
  ImageUpload: undefined;
  ProfileEditConfirm: undefined;
}>();

const BeforeRegistrationNavigator = () => {
  const advisorState = useContext(AdvisorStateContext);

  /*
    If an account is not created or not logged in
  */
  if (advisorState.advisorAuthState === null) {
    return (
      <BeforeRegistrationStack.Navigator
        initialRouteName="Register"
        screenOptions={{headerTintColor: 'black'}}>
        <BeforeRegistrationStack.Screen
          name="Register"
          component={RegisterScreen}
          options={{title: 'Register'}}
        />
        <BeforeRegistrationStack.Screen
          name="Login"
          component={LoginScreen}
          options={{title: 'Login'}}
        />
      </BeforeRegistrationStack.Navigator>
    );
  }

  /*
    If an account is created and logged in
    but profile is not registered
  */
  return (
    <Stack.Navigator
      initialRouteName="TagSelect"
      screenOptions={{headerTintColor: 'black'}}>
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
        options={{title: 'Profile Image Upload'}}
      />
      <Stack.Screen
        name="ProfileEditConfirm"
        component={ProfileEditConfirmScreen}
        options={{title: 'Profile Confirmation'}}
      />
    </Stack.Navigator>
  );
};

export default BeforeRegistrationNavigator;
