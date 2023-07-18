import 'react-native-gesture-handler'
import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import Icon from 'react-native-vector-icons/MaterialIcons'
import colors from '../config/colors'
import { View, Dimensions } from 'react-native'
import HomeScreen from '../screens/HomeScreen'
import FavoriteScreen from '../screens/FavoriteScreen'
import IngredientsScreen from '../screens/IngredientsScreen'
import Setting from '../screens/Setting'
import ShoppingListScreen from '../screens/ShoppingListScreen'
import BlogScreen from '../screens/BlogScreen'

const Tab = createBottomTabNavigator()

const AppNavigation = () => {
  return (
    <Tab.Navigator
      tabBarOptions={{
        showLabel: false,
        activeTintColor: colors.primary,
      }}
    >
      <Tab.Screen
        name="HomeScreen"
        component={HomeScreen}
        options={{
          unmountOnBlur: true,
          tabBarIcon: ({ color }) => (
            <Icon name="home-filled" color={color} size={28} />
          ),
          tabBarStyle: { backgroundColor: colors.dark, borderTopWidth: 0 },
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="Blogs"
        component={BlogScreen}
        options={{
          unmountOnBlur: true,
          tabBarIcon: ({ color }) => (
            <Icon name="web" color={color} size={28} />
          ),
          tabBarStyle: { backgroundColor: colors.dark, borderTopWidth: 0 },
          headerShown: false,
        }}
      />

      <Tab.Screen
        name="FavoriteScreen"
        component={FavoriteScreen}
        options={{
          unmountOnBlur: true,
          tabBarIcon: ({ color }) => (
            <Icon name="favorite" color={color} size={28} />
          ),
          tabBarStyle: { backgroundColor: colors.dark, borderTopWidth: 0 },
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="ShoppingList"
        component={ShoppingListScreen}
        options={{
          unmountOnBlur: true,
          tabBarIcon: ({ color }) => (
            <Icon name="settings" color={color} size={28} />
          ),
          tabBarStyle: { backgroundColor: colors.dark, borderTopWidth: 0 },
          headerShown: false,
        }}
      />
      {/* <Tab.Screen
        name="Setting"
        component={Setting}
        options={{
          unmountOnBlur: true,
          tabBarIcon: ({ color }) => (
            <Icon name="settings" color={color} size={28} />
          ),
          tabBarStyle: { backgroundColor: colors.dark, borderTopWidth: 0 },
          headerShown: false,
        }}
      /> */}
    </Tab.Navigator>
  )
}

export default AppNavigation
