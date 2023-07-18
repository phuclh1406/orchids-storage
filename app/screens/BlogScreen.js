import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  TextInput,
  Dimensions,
} from 'react-native'
import React, { useState, useEffect, useContext } from 'react'
import SPACING from '../config/SPACING'
import { BlurView } from 'expo-blur'
import { Ionicons } from '@expo/vector-icons'
import colors from '../config/colors'
import { useNavigation, useFocusEffect } from '@react-navigation/native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import categories from '../config/categories'
import { StatusBar } from 'expo-status-bar'
import { AuthContext } from '../context/AuthContext'
import axiosInstance from '../../util/axiosWrapper'

const avatar = require('../../assets/avatar.jpg')

const { width } = Dimensions.get('window')

const BlogScreen = ({ navigation }) => {
  const [ingreData, setIngreData] = useState([])
  const [categoriesData, setCategoriesData] = useState([])
  const [userInfo, setUserInfo] = useState({})
  useFocusEffect(
    React.useCallback(() => {
      // Add listener for tab press
      const unsubscribe = navigation.addListener('tabPress', () => {
        // Reset the navigation state to the initial route of the stack
        navigation.reset({
          index: 0,
          routes: [{ name: 'Blog' }],
        })
      })

      // Cleanup the listener when the screen loses focus or unmounts
      return unsubscribe
    }, [])
  )
  const [activeCategoryId, setActiveCategoryId] = useState(null)
  const [dataFav, setDataFav] = useState([])

  useEffect(() => {
    getFromStorage()
  }, [])

  // // Get data from storage
  const getFromStorage = async () => {
    try {
      const data = await AsyncStorage.getItem('shoppingList')
      setDataFav(data ? JSON.parse(data) : [])
    } catch (error) {
      console.error('Error getting data from storage:', error)
    }
  }

  // Set data to storage
  const setDataToStorage = async (orchid) => {
    try {
      console.log(orchid)
      const updatedData = [...dataFav, orchid]
      console.log(updatedData)
      await AsyncStorage.setItem('shoppingList', JSON.stringify(updatedData))
      setDataFav(updatedData)
    } catch (error) {
      console.error('Error setting data to storage:', error)
    }
  }

  const getUserFromStorage = async () => {
    try {
      const user = await AsyncStorage.getItem('userData')
      setUserInfo(JSON.parse(user))
    } catch (error) {
      console.error('Error getting user data from storage:', error)
    }
  }

  // Remove data from storage
  const removeDataFromStorage = async (itemId) => {
    try {
      const list = dataFav.filter((item) => item.id !== itemId)
      await AsyncStorage.setItem('shoppingList', JSON.stringify(list))
      setDataFav(list)
    } catch (error) {
      console.error('Error removing data from storage:', error)
    }
  }

  useFocusEffect(
    React.useCallback(() => {
      getFromStorage()
    }, [])
  )

  const getIngreData = async () => {
    try {
      const res = await axiosInstance.get(`/blogs`)
      console.log(res?.data)
      setIngreData(res?.data?.blogs)
    } catch (error) {
      console.log(error)
    }
  }
  const getCategoriesData = async () => {
    try {
      const res = await axiosInstance.get(
        `/categories_detail?cate_id=1f3db210-89c7-4afd-b6e1-5b4be3cdb6b1`
      )
      console.log(res?.data)
      setCategoriesData(res?.data?.categories_detail.rows)
    } catch (error) {
      console.log(error)
    }
  }
  useEffect(() => {
    getIngreData(), getCategoriesData(), getUserFromStorage()
  }, [])
  console.log(categoriesData)

  const handleTextInputFocus = () => {
    navigation.navigate('SearchBlogs')
  }
  return (
    <SafeAreaView style={{ backgroundColor: colors.dark, flex: 1 }}>
      <StatusBar backgroundColor={colors.primary} />
      <ScrollView
        style={{
          padding: SPACING,
          paddingTop: SPACING * 4,
        }}
      >
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            paddingBottom: SPACING * 2,
          }}
        >
          <TouchableOpacity
            style={{
              borderRadius: SPACING,
              overflow: 'hidden',
              width: SPACING * 4,
              height: SPACING * 4,
            }}
          >
            <BlurView
              style={{
                height: '100%',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Ionicons
                name="menu"
                size={SPACING * 2.5}
                color={colors.secondary}
              />
            </BlurView>
          </TouchableOpacity>
          <View
            style={{
              width: SPACING * 15,
              height: SPACING * 4,
              overflow: 'hidden',
              marginTop: SPACING / 2,
              borderRadius: SPACING,
              marginLeft: SPACING * 5,
            }}
          ></View>
          <View
            style={{
              width: SPACING * 4,
              height: SPACING * 4,
              overflow: 'hidden',
              borderRadius: SPACING,
            }}
          >
            <BlurView
              style={{
                height: '100%',
                padding: SPACING / 2,
              }}
            >
              <TouchableOpacity>
                <Image
                  style={{
                    height: '100%',
                    width: '100%',
                    borderRadius: SPACING,
                  }}
                  source={{ uri: userInfo?.user?.avatar }}
                />
              </TouchableOpacity>
            </BlurView>
          </View>
        </View>
        {/* <View style={{ width: "80%", marginVertical: SPACING }}></View> */}
        <View
          style={{
            borderRadius: SPACING,
            overflow: 'hidden',
          }}
        >
          <BlurView
            intensity={30}
            style={{
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <TextInput
              style={{
                width: '100%',
                color: colors.white,
                fontSize: SPACING * 1.7,
                padding: SPACING,
                paddingLeft: SPACING * 3.5,
              }}
              placeholder="Find your blog..."
              placeholderTextColor={colors.light}
              onFocus={handleTextInputFocus}
            />
            <Ionicons
              style={{
                position: 'absolute',
                left: SPACING,
              }}
              name="search"
              color={colors.light}
              size={SPACING * 2}
            />
          </BlurView>
        </View>
        <View
          style={{
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            paddingBottom: SPACING * 4,
            marginTop: SPACING * 2,
          }}
        >
          {ingreData.map((orchid) => (
            <View
              key={orchid.blog_id}
              style={{
                width: width - SPACING * 2,
                marginBottom: SPACING,
                borderRadius: SPACING,
                justifyContent: 'center',
                overflow: 'hidden',
              }}
            >
              <BlurView
                tint="dark"
                intensity={95}
                style={{
                  padding: SPACING,
                }}
              >
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate('BlogDetail', {
                      ingredientId: orchid.blog_id,
                    })
                  }
                  style={{
                    height: 150,
                    width: '100%',
                  }}
                >
                  <Image
                    source={{ uri: orchid.image }}
                    style={{
                      width: '100%',
                      height: '100%',
                      borderRadius: SPACING,
                    }}
                  />
                </TouchableOpacity>
                <Text
                  numberOfLines={2}
                  style={{
                    color: colors.white,
                    fontWeight: '600',
                    fontSize: SPACING * 1.7,
                    marginTop: SPACING,
                    marginBottom: SPACING / 2,
                  }}
                >
                  {orchid.title}
                </Text>
                <View style={{flexDirection: 'row'}}>
                <Text
                      numberOfLines={1}
                      style={{ color: colors.white, fontSize: SPACING * 1.5, marginRight: SPACING / 2}}
                    >
                      Create at: 
                    </Text>
                    <Text
                      numberOfLines={1}
                      style={{ color: colors.secondary, fontSize: SPACING * 1.2, marginTop: SPACING / 2.7 }}
                    >
                      {orchid.createdAt.substring(0, 10)}
                    </Text>
                </View>
                <View
                  style={{
                    marginVertical: SPACING / 1.5,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <View style={{ flexDirection: 'row' }}>
                    <Text
                      style={{
                        color: colors.primary,
                        fontSize: SPACING * 1.6,

                      }}
                    >
                      Author:
                    </Text>
                    <Text
                      style={{ color: colors.white, fontSize: SPACING * 1.6 }}
                    >
                      {orchid.blog_user.user_name}
                    </Text>
                  </View>
                </View>
              </BlurView>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default BlogScreen

// const styles = StyleSheet.create({})
