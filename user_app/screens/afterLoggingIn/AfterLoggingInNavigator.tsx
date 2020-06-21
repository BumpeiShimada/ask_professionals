import React, {useContext} from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {useTheme} from 'react-native-paper';
import AntDesign from 'react-native-vector-icons/AntDesign';
import HomeNavigator from './homeTab/HomeNavigator';
import UserNavigator from './userTab/UserNavigator';
import UserContext from '../../globalContexts/UserContext';
import SearchNavigator from './searchTab/SearchNavigator';

const Tab = createBottomTabNavigator<{
  Home: undefined;
  Search: undefined;
  MyPage: undefined;
}>();

const AfterLoggingInNavigator = () => {
  const theme = useTheme();
  const user = useContext(UserContext);

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
            case 'Search':
              iconName = 'search1';
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
      <Tab.Screen
        name={'Home'}
        component={HomeNavigator}
        options={{title: 'Home'}}
      />
      {user.isConversationStarted && (
        <Tab.Screen
          name={'Search'}
          component={SearchNavigator}
          options={{title: 'Search'}}
        />
      )}
      <Tab.Screen
        name={'MyPage'}
        component={UserNavigator}
        options={{title: 'My Page'}}
      />
    </Tab.Navigator>
  );
};

export default AfterLoggingInNavigator;
