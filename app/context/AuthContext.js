import AsyncStorage from '@react-native-async-storage/async-storage'
import axios from 'axios'
import React, { createContext, useEffect, useState } from 'react'
import { BASE_URL } from '../config'
import { Alert } from 'react-native'

export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [userInfo, setUserInfo] = useState({})
  const [foodData, setFoodData] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [isNavigate, setIsNavigate] = useState(false)
  //   const [splashLoading, setSplashLoading] = useState(false);

  const register = async (email, password, confirm_pass, role_id) => {
    setIsLoading(true)

    await axios
      .post(`${BASE_URL}/auth/register`, {
        email,
        password,
        confirm_pass,
        role_id,
      })
      .then((res) => {
        let userInfo = res.data
        if (userInfo.mes == 'Email has already used') {
          Alert.alert('Error', 'Email has already used')
          setIsLoading(false)
          setIsNavigate(false)
        } else {
          setUserInfo(userInfo)
          setIsLoading(false)
          setIsNavigate(true)
        }
      })
      .catch((e) => {
        console.log(`Register error ${e}`)
        setIsLoading(false)
        setIsNavigate(false)
      })
  }

  const login = (email, password) => {
    setIsLoading(true)

    axios
      .post(`${BASE_URL}/auth/login`, {
        email,
        password,
      })
      .then((res) => {
        if (res.data) {
          let userInfo = res.data
          setUserInfo(userInfo)
          setIsNavigate(true)
          AsyncStorage.setItem('userData', JSON.stringify(userInfo))
          setIsLoading(false)
        }
      })
      .catch((e) => {
        console.log(`login error ${e}`)
        Alert.alert('Error', 'User does not exist')
        setIsLoading(false)
        setIsNavigate(false)
      })
  }

  // const logout = () => {
  //     setIsLoading(true);

  //     axios
  //         .post(
  //             `${BASE_URL}/logout`,
  //             {},
  //             {
  //                 headers: { Authorization: `Bearer ${userInfo.access_token}` },
  //             },
  //         )
  //         .then(res => {
  //             console.log(res.data);
  //             AsyncStorage.removeItem('userInfo');
  //             setUserInfo({});
  //             setIsLoading(false);
  //         })
  //         .catch(e => {
  //             console.log(`logout error ${e}`);
  //             setIsLoading(false);
  //         });
  // };

  //   const isLoggedIn = async () => {
  //     try {
  //       setSplashLoading(true);

  //       let userInfo = await AsyncStorage.getItem('userInfo');
  //       userInfo = JSON.parse(userInfo);

  //       if (userInfo) {
  //         setUserInfo(userInfo);
  //       }

  //       setSplashLoading(false);
  //     } catch (e) {
  //       setSplashLoading(false);
  //       console.log(`is logged in error ${e}`);
  //     }
  //   };

  //   useEffect(() => {
  //     isLoggedIn();
  //   }, []);

  const getFood = async () => {
    setIsLoading(true)
    try {
      const userInfo = await AsyncStorage.getItem('userData')
      const parsedUserInfo = JSON.parse(userInfo)

      const response = await axios.get(`${BASE_URL}/foods`, {
        headers: {
          Authorization: `Bearer ${parsedUserInfo.access_token}`,
          'Content-Type': 'application/json',
        },
      })

      const foods = response.data
      console.log(foods)
      setFoodData(foods) // Update the foodData state
    } catch (error) {
      console.log(`get food error ${error}`)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AuthContext.Provider
      value={{
        isLoading,
        userInfo,
        isNavigate,
        foodData,
        register,
        login,
        getFood,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
