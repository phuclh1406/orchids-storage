import AsyncStorage from '@react-native-async-storage/async-storage'
import React, { useContext, useEffect } from 'react'
import {
  View,
  Text,
  SafeAreaView,
  Keyboard,
  ScrollView,
  Alert,
} from 'react-native'

import COLORS from '../config/colors'
import Button from '../components/Button'
import Input from '../components/Input'
import Loader from '../components/Loader'
import axios from 'axios'
import { BASE_URL } from '../config'
import { AuthContext } from '../context/AuthContext'

const RegistrationScreen = ({ navigation }) => {
  const [inputs, setInputs] = React.useState({
    email: '',
    password: '',
    confirm_password: '',
  })
  const [errors, setErrors] = React.useState({})
  // const [loading, setLoading] = React.useState(false);
  // const [userInfo, setUserInfo] = React.useState(null);
  const { isLoading, isNavigate, register } = useContext(AuthContext)

  const validate = () => {
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
    } else if (inputs.password.length < 5) {
      handleError('Min password length of 5', 'password')
      isValid = false
    }

    if (!inputs.confirm_password) {
      handleError('Please input confirm password', 'confirm_password')
      isValid = false
    } else if (inputs.password !== inputs.confirm_password) {
      handleError('Not match!', 'confirm_password')
      isValid = false
    }

    if (isValid) {
      register(inputs.email, inputs.password, inputs.confirm_password)
      if (isNavigate) {
        navigation.navigate('LoginScreen')
      }
    }
  }

  // const register = () => {
  //   setLoading(true);
  //   const email = inputs.email;
  //   const password = inputs.password;
  //   const confirm_pass = inputs.confirm_password;
  //   axios.post(`${BASE_URL}/auth/register`, {
  //     email,
  //     password,
  //     confirm_pass
  //   }).then(res => {
  //     console.log(res.data);
  //     // const userInfo = res.data;
  //     // setUserInfo(userInfo);
  //   }).catch(e => {
  //     console.log(`Register error ${e}`);
  //   });
  //   setTimeout(() => {
  //     try {
  //       setLoading(false);
  //       // AsyncStorage.setItem('userData', JSON.stringify(inputs));
  //       navigation.navigate('LoginScreen');
  //     } catch (error) {
  //       Alert.alert('Error', 'Something went wrong');
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
      navigation.navigate('LoginScreen')
    }
  }, [isNavigate, navigation])

  return (
    <SafeAreaView style={{ backgroundColor: COLORS.white, flex: 1 }}>
      <Loader visible={isLoading} />
      <ScrollView
        contentContainerStyle={{ paddingTop: 50, paddingHorizontal: 20 }}
      >
        <Text style={{ color: COLORS.black, fontSize: 40, fontWeight: 'bold' }}>
          Register
        </Text>
        <Text style={{ color: COLORS.grey, fontSize: 18, marginVertical: 10 }}>
          Enter Your Details to Register
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

          <Input
            onChangeText={(text) => handleOnchange(text, 'confirm_password')}
            onFocus={() => handleError(null, 'confirm_password')}
            iconName="lock-outline"
            label="Confirm password"
            placeholder="Enter your confirm password"
            error={errors.confirm_password}
            password
          />

          <Button title="Register" onPress={validate} />
          <Text
            onPress={() => navigation.navigate('LoginScreen')}
            style={{
              color: COLORS.black,
              fontWeight: 'bold',
              textAlign: 'center',
              fontSize: 16,
            }}
          >
            Already have account? Login
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default RegistrationScreen
