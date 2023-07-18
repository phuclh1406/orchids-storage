import { StyleSheet, Text, View } from 'react-native'
import React, { useContext, useState } from 'react'
import colors from './app/config/colors'
import HomeScreen from './app/screens/HomeScreen'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import AppNavigation from './app/navigation/appNavigation'
import DashboardNavigation from './app/navigation/dashboardNavigation';
import OrchidDetailsScreen from './app/screens/OrchidDetailsScreen'
import LoginScreen from './app/screens/LoginScreen'
import RegistrationScreen from './app/screens/RegistrationScreen'
import AsyncStorage from '@react-native-async-storage/async-storage'
import Loader from './app/components/Loader'
import { AuthProvider } from './app/context/AuthContext'
import IngredientDetailScreen from './app/screens/IngredientDetailScreen'
<<<<<<< HEAD
import ShoppingListScreen from './app/screens/ShoppingListScreen'
// AsyncStorage.removeItem('userData')
=======
import { SearchScreen } from './app/screens/SearchScreen'
AsyncStorage.removeItem('userData')
>>>>>>> 944d51a47399dbb4006ed474b0243463f6bf5798

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
      parseUserData = JSON.parse(userData)
      if (parseUserData) {
        setInitialRouteName('Home')
      } else {
        setInitialRouteName('LoginScreen')
      }
    } catch (error) {
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
                <Stack.Screen name="IngredientsScreen" component={AppNavigation} />
                <Stack.Screen name="IngredientDetail" component={IngredientDetailScreen} />
                <Stack.Screen name="Dashboard" component={DashboardNavigation} />
                <Stack.Screen name="ShoppingList" component={ShoppingListScreen} />
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
