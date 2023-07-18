import React from "react";
import { View } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import DashboardHomeScreen from '../screens/DashboardHomeScreen';
import Icon from 'react-native-vector-icons/MaterialIcons';
import colors from '../config/colors';

const Tab = createBottomTabNavigator();

const DashboardNavigation = () => {
    return (
        <Tab.Navigator
            tabBarOptions={{
                showLabel: false,
                activeTintColor: colors.primary,
            }}
        >
            <Tab.Screen
                name="Dashboard"
                component={DashboardHomeScreen}
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
                name="ShoppingList"
                component={DashboardHomeScreen}
                options={{
                    tabBarIcon: ({color}) => (
                      <Icon name="shopping-cart" color={color} size={28} />
                    ),
                    tabBarStyle: {backgroundColor: colors.dark, borderTopWidth: 0},
                    headerShown: false
                }}
            />
        </Tab.Navigator>
    )
}

export default DashboardNavigation;