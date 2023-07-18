import { StyleSheet, Text, View } from 'react-native'
import React, { useContext, useState } from 'react'
import colors from './app/config/colors'
import HomeScreen from './app/screens/HomeScreen'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import AppNavigation from './app/navigation/appNavigation'
import DashboardNavigation from './app/navigation/dashboardNavigation'
import OrchidDetailsScreen from './app/screens/OrchidDetailsScreen'
import LoginScreen from './app/screens/LoginScreen'
import RegistrationScreen from './app/screens/RegistrationScreen'
import AsyncStorage from '@react-native-async-storage/async-storage'
import Loader from './app/components/Loader'
import { AuthProvider } from './app/context/AuthContext'
import IngredientDetailScreen from './app/screens/IngredientDetailScreen'
import CreateFood from './app/screens/CreateFood'
import EditProfile from './app/screens/EditProfile'
import UserProfile from './app/screens/UserProfile'
import ShoppingListScreen from './app/screens/ShoppingListScreen'
import { SearchScreen } from './app/screens/SearchScreen'
import Setting from './app/screens/Setting'

AsyncStorage.removeItem('userData')

const Stack = createStackNavigator()
const App = () => {
  const [initialRouteName, setInitialRouteName] = React.useState('')

  React.useEffect(() => {
    setTimeout(() => {
      authUser()
    }, 1000)
  }, [])

  const authUser = async () => {
    try {
      let userData = await AsyncStorage.getItem('userData')
      const parseUserData = JSON.parse(userData)
      if (parseUserData) {
        setInitialRouteName('Home')
      } else {
        setInitialRouteName('LoginScreen')
      }
    } catch (error) {
      console.log(error)
      setInitialRouteName('LoginScreen')
    }
  }

  return (
    <View style={{ flex: 1 }}>
      <AuthProvider>
        <NavigationContainer>
          {!initialRouteName ? (
            <Loader visible={true} />
          ) : (
            <>
              <Stack.Navigator
                initialRouteName={initialRouteName}
                screenOptions={{
                  headerShown: false,
                  cardStyle: { backgroundColor: colors.dark },
                }}
              >
                {/* <Stack.Screen name="Home" component={HomeScreen} /> */}
                <Stack.Screen name="FavoriteScreen" component={AppNavigation} />
                <Stack.Screen name="Home" component={AppNavigation} />
                <Stack.Screen
                  name="OrchidDetail"
                  component={OrchidDetailsScreen}
                />
                <Stack.Screen
                  name="RegistrationScreen"
                  component={RegistrationScreen}
                />
                <Stack.Screen name="SearchHome" component={SearchScreen} />
                <Stack.Screen name="LoginScreen" component={LoginScreen} />
                <Stack.Screen name="CreateFoodScreen" component={CreateFood} />
                <Stack.Screen
                  name="IngredientsScreen"
                  component={AppNavigation}
                />
                <Stack.Screen
                  name="IngredientDetail"
                  component={IngredientDetailScreen}
                />
                <Stack.Screen
                  name="Dashboard"
                  component={DashboardNavigation}
                />
                <Stack.Screen name="UserProfile" component={UserProfile} />
                <Stack.Screen name="EditProfile" component={EditProfile} />
                <Stack.Screen
                  name="ShoppingList"
                  component={ShoppingListScreen}
                />
                <Stack.Screen name="Setting" component={Setting} />
              </Stack.Navigator>
            </>
          )}
        </NavigationContainer>
      </AuthProvider>
    </View>
  )
}

export default App

const styles = StyleSheet.create({})
