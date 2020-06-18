import React, {useContext} from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import AdvisorStateContext from '../../globalContexts/AdvisorStateContext';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {useTheme} from 'react-native-paper';
import WaitingConfirmationScreen from './WaitingConfirmationScreen';
import MyPageNavigator from './myPageTab/MyPageNavigator';
import HomeNavigator from './homeTab/HomeNavigator';

const BeforeConfirmationStack = createStackNavigator();

const Tab = createBottomTabNavigator<{
  Home: undefined;
  MyPage: undefined;
}>();

const AfterRegistrationNavigator = () => {
  const advisorState = useContext(AdvisorStateContext);
  const theme = useTheme();

  /*
    Only confirmed users can access these screens:
    use most of all functions in this app
  */
  if (advisorState.advisorDocumentState?.isConfirmed === true) {
    return (
      <Tab.Navigator
        initialRouteName={'Home'}
        screenOptions={({route}) => ({
          tabBarIcon: ({color, size}) => {
            let iconName = '';

            switch (route.name) {
              case 'Home':
                iconName = 'message1';
                break;
              case 'MyPage':
                iconName = 'user';
                break;
            }

            return <AntDesign name={iconName} size={size} color={color} />;
          },
        })}
        tabBarOptions={{
          activeTintColor: theme.colors.primary,
          inactiveTintColor: 'gray',
        }}>
        <Tab.Screen name={'Home'} component={HomeNavigator} />
        <Tab.Screen name={'MyPage'} component={MyPageNavigator} />
      </Tab.Navigator>
    );
  }

  return (
    <BeforeConfirmationStack.Navigator initialRouteName="WaitingConfirmation">
      <BeforeConfirmationStack.Screen
        name="WaitingConfirmation"
        component={WaitingConfirmationScreen}
        options={{title: 'Waiting for confirmation'}}
      />
    </BeforeConfirmationStack.Navigator>
  );
};

export default AfterRegistrationNavigator;
