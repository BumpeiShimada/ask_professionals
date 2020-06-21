import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import TagSelectScreen from '../TagSelectScreen';
import LoginScreen from './LoginScreen';

export type BeforeLoggingInStackParamList = {
  TagSelect: undefined;
  Login: undefined;
};

const Stack = createStackNavigator<BeforeLoggingInStackParamList>();

const BeforeLoggingInNavigator = () => (
  <Stack.Navigator
    initialRouteName="TagSelect"
    screenOptions={{headerTintColor: 'black'}}>
    <Stack.Screen
      name="TagSelect"
      component={TagSelectScreen}
      options={{title: 'Tag Select'}}
    />
    <Stack.Screen
      name="Login"
      component={LoginScreen}
      options={{title: 'Login'}}
    />
  </Stack.Navigator>
);

export default BeforeLoggingInNavigator;
