import { StyleSheet, Text, View } from "react-native";
import React, {useState} from "react";
import colors from "./app/config/colors";
import HomeScreen from "./app/screens/HomeScreen";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import AppNavigation from "./app/navigation/appNavigation"
import OrchidDetailsScreen from "./app/screens/OrchidDetailsScreen";
const Stack = createStackNavigator();
const App = () => {
  const [isInitialScreen, setIsInitialScreen] = useState(true);
  return (
    <View style={{ flex: 1}}>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="HomeScreen"
          screenOptions={{
            headerShown: false,
            cardStyle: { backgroundColor: colors.dark },
          }}
        >
          {/* <Stack.Screen name="Home" component={HomeScreen} /> */}
          <Stack.Screen name="Favorite" component={AppNavigation}/>
          <Stack.Screen name="Home" component={AppNavigation} />
          <Stack.Screen name="OrchidDetail" component={OrchidDetailsScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </View>
  );
};

export default App;

const styles = StyleSheet.create({});
