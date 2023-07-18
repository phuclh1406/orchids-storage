import React, { useContext, useEffect } from 'react'
import { View, Text, SafeAreaView, Keyboard, Alert } from 'react-native'
import COLORS from '../config/colors'
import Button from '../components/Button'
import Input from '../components/Input'
import AsyncStorage from '@react-native-async-storage/async-storage'
import Loader from '../components/Loader'
import { AuthContext } from '../context/AuthContext'

const LoginScreen = ({ navigation }) => {
  const [inputs, setInputs] = React.useState({ email: '', password: '' })
  const [errors, setErrors] = React.useState({})
  // const [loading, setLoading] = React.useState(false);
  // const [userInfo, setUserInfo] = React.useState(null);
  const { isLoading, isNavigate, login } = useContext(AuthContext)

  const validate = async () => {
    Keyboard.dismiss()
    let isValid = true
    if (!inputs.email) {
      handleError('Please input email', 'email')
      isValid = false
    } else if (!inputs.email.match(/\S+@\S+\.\S+/)) {
      handleError('Please input a valid email', 'email')
      isValid = false
    }

    if (!inputs.password) {
      handleError('Please input password', 'password')
      isValid = false
    }
    if (isValid) {
      login(inputs.email, inputs.password)
    }
  }

  // const login = () => {
  //   setLoading(true);
  //   const email = inputs.email;
  //   const password = inputs.password;
  //   console.log(email);
  //   console.log(password);
  //   axios.post(`${BASE_URL}/auth/login`, {
  //     email,
  //     password,
  //   }).then(res => {
  //     console.log(res.data);
  //     const userLogin = res.data;
  //     setUserInfo(userLogin);
  //   }).catch(e => {
  //     console.log(`Login error ${e}`);
  //   });

  //   setTimeout(async () => {
  //     setLoading(false);
  //     // let userData = await AsyncStorage.getItem('userData');
  //     console.log(userInfo);
  //     if (userInfo) {
  //       navigation.navigate('Home');
  //       AsyncStorage.setItem(
  //         'userData',
  //         JSON.stringify({ ...userInfo, loggedIn: true }),
  //       );
  //     } else {
  //       Alert.alert('Error', 'User does not exist');
  //     }
  //   }, 3000);
  // };

  const handleOnchange = (text, input) => {
    setInputs((prevState) => ({ ...prevState, [input]: text }))
  }

  const handleError = (error, input) => {
    setErrors((prevState) => ({ ...prevState, [input]: error }))
  }

  useEffect(() => {
    if (isNavigate) {
      navigation.navigate('Home')
    }
  }, [isNavigate, navigation])

  return (
    <SafeAreaView style={{ backgroundColor: COLORS.white, flex: 1 }}>
      <Loader visible={isLoading} />
      <View style={{ paddingTop: 50, paddingHorizontal: 20 }}>
        <Text style={{ color: COLORS.black, fontSize: 40, fontWeight: 'bold' }}>
          Log In
        </Text>
        <Text style={{ color: COLORS.grey, fontSize: 18, marginVertical: 10 }}>
          Enter Your Details to Login
        </Text>
        <View style={{ marginVertical: 20 }}>
          <Input
            onChangeText={(text) => handleOnchange(text, 'email')}
            onFocus={() => handleError(null, 'email')}
            iconName="email-outline"
            label="Email"
            placeholder="Enter your email address"
            error={errors.email}
          />
          <Input
            onChangeText={(text) => handleOnchange(text, 'password')}
            onFocus={() => handleError(null, 'password')}
            iconName="lock-outline"
            label="Password"
            placeholder="Enter your password"
            error={errors.password}
            password
          />
          <Button title="Log In" onPress={validate} />
          <Text
            onPress={() => navigation.navigate('RegistrationScreen')}
            style={{
              color: COLORS.black,
              fontWeight: 'bold',
              textAlign: 'center',
              fontSize: 16,
            }}
          >
            Don't have account? Register
          </Text>
        </View>
      </View>
    </SafeAreaView>
  )
}

export default LoginScreen
