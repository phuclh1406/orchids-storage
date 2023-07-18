import AsyncStorage from '@react-native-async-storage/async-storage'
import React, { useContext, useEffect, useState } from 'react'
import {
  View,
  Text,
  SafeAreaView,
  Keyboard,
  ScrollView,
  Alert,
  StyleSheet,
} from 'react-native'

import COLORS from '../config/colors'
import Button from '../components/Button'
import Input from '../components/Input'
import Loader from '../components/Loader'
import axios from 'axios'
import { BASE_URL } from '../config'
import { AuthContext } from '../context/AuthContext'
import axiosInstance from '../../util/axiosWrapper'
import { Dropdown } from 'react-native-element-dropdown'

const RegistrationScreen = ({ navigation }) => {
  const [role, setRole] = useState(null);
  const [isFocus, setIsFocus] = useState(false);
  const [roleData, setRoleData] = useState([]);
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
      register(inputs.email, inputs.password, inputs.confirm_password, role);
      
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

  const getRoleData = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/roles`)
      var count = Object.keys(res?.data?.roles?.rows).length;
      let roleArray = [];
      for (var i = 0; i < count; i++) {
        if (res.data.roles.rows[i].role_id === 'f63cd42e-4c7d-459f-a78b-fc8bd1b30695' || res.data.roles.rows[i].role_id === '58c10546-5d71-47a6-842e-84f5d2f72ec3') {
          roleArray.push({
            value: res.data.roles.rows[i].role_id,
            label: res.data.roles.rows[i].role_name,
          });
        }
      }
      setRoleData(roleArray)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    getRoleData()
  }, [])

  useEffect(() => {
    if (isNavigate) {
      navigation.navigate('LoginScreen')
    }
    console.log('Login');
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
          
          <View style={{ marginBottom: 10 }}>
          <Text style={styles.label}>Role</Text>
            <Dropdown
              style={[styles.dropdown, isFocus && { borderColor: 'blue' }]}
              placeholderStyle={styles.placeholderStyle}
              selectedTextStyle={styles.selectedTextStyle}
              inputSearchStyle={styles.inputSearchStyle}
              iconStyle={styles.iconStyle}
              data={roleData}
              maxHeight={300}
              labelField="label"
              valueField="value"
              placeholder={!isFocus ? 'Select role' : '...'}
              value={role}
              onFocus={() => setIsFocus(true)}
              onBlur={() => setIsFocus(false)}
              onChange={item => {
                setRole(item.value);
                setIsFocus(false);
              }}
            />
          </View>

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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#533483',
    padding: 16,
    justifyContent: 'center',
    alignContent: 'center',
  },
  dropdown: {
    height: 50,
    borderColor: 'gray',
    borderWidth: 0.6,
    paddingHorizontal: 8,
    marginBottom: 10,
    backgroundColor: COLORS.light2
  },
  icon: {
    marginRight: 5,
  },
  label: {
    position: 'absolute',
    backgroundColor: 'white',
    left: 22,
    top: 8,
    zIndex: 999,
    paddingHorizontal: 8,
    fontSize: 14,
  },
  placeholderStyle: {
    fontSize: 14,
    color: COLORS.darkBlue,
  },
  selectedTextStyle: {
    fontSize: 16,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
  label: {
    marginVertical: 5,
    fontSize: 14,
    color: COLORS.grey,
  },
});