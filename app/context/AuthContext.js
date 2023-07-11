import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import React, { createContext, useEffect, useState } from 'react';
import { BASE_URL } from '../config';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [userInfo, setUserInfo] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [isNavigate, setIsNavigate] = useState(false);
    //   const [splashLoading, setSplashLoading] = useState(false);

    const register = (email, password, confirm_pass) => {
        setIsLoading(true);

        axios
            .post(`${BASE_URL}/auth/register`, {
                email,
                password,
                confirm_pass
            })
            .then(res => {
                let userInfo = res.data;
                setUserInfo(userInfo);
                // AsyncStorage.setItem('userInfo', JSON.stringify(userInfo));
                setIsLoading(false);
                setIsNavigate(true);
                console.log(userInfo);
            })
            .catch(e => {
                console.log(`Register error ${e}`);
                setIsLoading(false);
                setIsNavigate(false);
            });
    };

    const login = (email, password) => {
        setIsLoading(true);

        axios
            .post(`${BASE_URL}/auth/login`, {
                email,
                password,
            })
            .then(res => {
                if (res.data) {
                    let userInfo = res.data;
                    console.log(userInfo);
                    setUserInfo(userInfo);
                    setIsNavigate(true);
                    AsyncStorage.setItem('userData', JSON.stringify(userInfo));
                    setIsLoading(false);
                } else {
                    Alert.alert('Error', 'User does not exist');
                }
            })
            .catch(e => {
                console.log(`login error ${e}`);
                setIsLoading(false);
                setIsNavigate(false);
            });
    };

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

    return (
        <AuthContext.Provider
            value={{
                isLoading,
                userInfo,
                isNavigate,
                register,
                login,
            }}>
            {children}
        </AuthContext.Provider>
    );
};