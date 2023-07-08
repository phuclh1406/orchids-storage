import 'react-native-gesture-handler';
import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialIcons';
import colors from '../config/colors';
import {View, Dimensions} from 'react-native';
import HomeScreen from '../screens/HomeScreen';
import FavoriteScreen from '../screens/FavoriteScreen';

const Tab = createBottomTabNavigator();

const AppNavigation = () => {
  return (
    <Tab.Navigator
      tabBarOptions={{
        showLabel: false,
        activeTintColor: colors.primary,
      }}>
      <Tab.Screen
        name="HomeScreen"
        component={HomeScreen}
        options={{
          unmountOnBlur: true,
          tabBarIcon: ({color}) => (
            <Icon name="home-filled" color={color} size={28} />
          ),
          tabBarStyle: {backgroundColor: colors.dark, borderTopWidth: 0},
          headerShown: false
        }}
      />
      <Tab.Screen
        name="Search"
        component={HomeScreen}
        options={{
          tabBarIcon: ({color}) => (
            <View
              style={{
                height: 60,
                width: 60,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: colors.white,
                borderColor: colors.primary,
                borderWidth: 2,
                borderRadius: 30,
                top: -15,
                elevation: 5,
              }}>
              <Icon name="search" color={colors.primary} size={28} />
            </View>
          ),
          tabBarStyle: {backgroundColor: colors.dark, borderTopWidth: 0},
          headerShown: false
        }}
      />
      <Tab.Screen
        name="FavoriteScreen"
        component={FavoriteScreen}
        options={{
          unmountOnBlur: true,
          tabBarIcon: ({color}) => (
            <Icon name="favorite" color={color} size={28} />
          ),
          tabBarStyle: {backgroundColor: colors.dark, borderTopWidth: 0},
          headerShown: false
        }}
      />
    </Tab.Navigator>
  );
};

export default AppNavigation;