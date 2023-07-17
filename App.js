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
import ShoppingListScreen from './app/screens/ShoppingListScreen'
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
      console.log(userData)
      userData = JSON.parse(userData)
      if (userData) {
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
                <Stack.Screen name="LoginScreen" component={LoginScreen} />
                <Stack.Screen name="IngredientsScreen" component={AppNavigation} />
                <Stack.Screen name="IngredientDetail" component={IngredientDetailScreen} />
<<<<<<< HEAD
                <Stack.Screen name="ShoppingList" component={ShoppingListScreen} />
=======
                <Stack.Screen name="Dashboard" component={DashboardNavigation} />
>>>>>>> 48ccac8cdb616e6c072ac1bffe21df9314318114
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
