import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native'
import React, { useState, useEffect, useContext } from 'react'
import SPACING from '../config/SPACING'
import { BlurView } from 'expo-blur'
import { Ionicons } from '@expo/vector-icons'
import colors from '../config/colors'
import SearchField from '../components/SearchField'
import Categories from '../components/Categories'
import orchids from '../config/orchids'
import { useNavigation, useFocusEffect } from '@react-navigation/native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import categories from '../config/categories'
import { StatusBar } from 'expo-status-bar'
import { AuthContext } from '../context/AuthContext'
import axiosInstance from '../../util/axiosWrapper'

const avatar = require('../../assets/avatar.jpg')

const { width } = Dimensions.get('window')

const HomeScreen = ({ navigation }) => {
  const [foodData, setFoodData] = useState([])
  useFocusEffect(
    React.useCallback(() => {
      // Add listener for tab press
      const unsubscribe = navigation.addListener('tabPress', () => {
        // Reset the navigation state to the initial route of the stack
        navigation.reset({
          index: 0,
          routes: [{ name: 'HomeScreen' }],
        })
      })

      // Cleanup the listener when the screen loses focus or unmounts
      return unsubscribe
    }, [])
  )
  const [activeCategoryId, setActiveCategoryId] = useState(null)
  const [dataFav, setDataFav] = useState([])

  // const { foodData } = useContext(AuthContext);

  // useEffect(() => {
  //   getFromStorage()
  // }, [])

  // // Get data from storage
  // const getFromStorage = async () => {
  //   try {
  //     // const data = await AsyncStorage.getItem("favorite");
  //     // setDataFav(data ? JSON.parse(data) : []);
  //     // getFood();
  //     console.log('aaaaaaaaaaaaaaaaaaa', foodData)
  //   } catch (error) {
  //     console.error('Error getting data from storage:', error)
  //   }
  // }

  // Set data to storage
  const setDataToStorage = async (orchid) => {
    try {
      console.log(orchid)
      const updatedData = [...dataFav, orchid]
      console.log(updatedData)
      await AsyncStorage.setItem('favorite', JSON.stringify(updatedData))
      setDataFav(updatedData)
    } catch (error) {
      console.error('Error setting data to storage:', error)
    }
  }

  // Remove data from storage
  const removeDataFromStorage = async (itemId) => {
    try {
      const list = dataFav.filter((item) => item.id !== itemId)
      await AsyncStorage.setItem('favorite', JSON.stringify(list))
      setDataFav(list)
    } catch (error) {
      console.error('Error removing data from storage:', error)
    }
  }

  // useFocusEffect(
  //   React.useCallback(() => {
  //     getFromStorage()
  //   }, [])
  // )

  // const getCategoryName = (categoryId) => {
  //   const category = categories.find((category) => category.id === categoryId)
  //   return category ? category.name : ''
  // }
  const getFoodData = async () => {
    try {
      const res = await axiosInstance.get(`/foods`)
      console.log(res?.data)
      setFoodData(res?.data?.foods)
    } catch (error) {
      console.log(error)
    }
  }
  useEffect(() => {
    getFoodData()
  }, [])

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
            }}
          >
            <Text style={{ color: colors.white, fontSize: SPACING * 2 }}>
              Home Screen
            </Text>
          </View>
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
                  source={avatar}
                />
              </TouchableOpacity>
            </BlurView>
          </View>
        </View>
        {/* <View style={{ width: "80%", marginVertical: SPACING }}></View> */}
        <SearchField />
        <Categories
          let
          titleColor="light"
          onChange={(id) => setActiveCategoryId(id)}
        />
        <View
          style={{
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            paddingBottom: SPACING * 4,
          }}
        >
          {foodData
            ?.filter((food) => {
              if (activeCategoryId === null) {
                return true
              } else if (activeCategoryId === 0) {
                return food
              }
              return food.categoryId === activeCategoryId
            })
            .map((food) => (
              <View
                key={food.food_id}
                style={{
                  width: width / 2 - SPACING * 2,
                  marginBottom: SPACING,
                  borderRadius: SPACING * 2,
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
                      navigation.navigate('OrchidDetail', {
                        orchidId: food.food_id,
                      })
                    }
                    style={{
                      height: 150,
                      width: '100%',
                    }}
                  >
                    <Image
                      source={{uri:food.food_image[0].image}}
                      style={{
                        width: '100%',
                        height: '100%',
                        borderRadius: SPACING * 2,
                      }}
                    />
                    <View
                      style={{
                        position: 'absolute',
                        right: 0,
                        borderBottomStartRadius: SPACING * 3,
                        borderTopEndRadius: SPACING * 2,
                        overflow: 'hidden',
                      }}
                    >
                      <BlurView
                        tint="dark"
                        intensity={70}
                        style={{
                          flexDirection: 'row',
                          padding: SPACING - 2,
                        }}
                      >
                        <Ionicons
                          style={{
                            marginLeft: SPACING / 2,
                          }}
                          name="star"
                          color={colors.primary}
                          size={SPACING * 1.7}
                        />
                        <Text
                          style={{
                            color: colors.white,
                            marginLeft: SPACING / 2,
                          }}
                        >
                          {food.rating}
                        </Text>
                      </BlurView>
                    </View>
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
                    {food.food_name}
                  </Text>
                  <Text
                    numberOfLines={1}
                    style={{ color: colors.secondary, fontSize: SPACING * 1.2 }}
                  >
                    {food.food_cate_detail.cate_detail_name}
                  </Text>
                  <View
                    style={{
                      marginVertical: SPACING / 2,
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <View style={{ flexDirection: 'row' }}>
                      <Text
                        style={{
                          color: colors.primary,
                          marginRight: SPACING / 2,
                          fontSize: SPACING * 1.6,
                        }}
                      >
                        $
                      </Text>
                      <Text
                        style={{ color: colors.white, fontSize: SPACING * 1.6 }}
                      >
                        {food.price}
                      </Text>
                    </View>
                    <TouchableOpacity
                      onPress={() => {
                        const check = dataFav.find(
                          (item) => item.id === food.food_id
                        )
                        console.log(food.food_id)
                        console.log('Check:', check)
                        if (check) {
                          removeDataFromStorage(food.food_id)
                        } else {
                          setDataToStorage(food)
                        }
                      }}
                    >
                      {dataFav.find((item) => item.id === food.food_id) ? (
                        <Ionicons
                          name="heart"
                          size={SPACING * 3}
                          color={colors.primary}
                        />
                      ) : (
                        <Ionicons
                          name="heart"
                          size={SPACING * 3}
                          color={colors.white}
                        />
                      )}
                    </TouchableOpacity>
                  </View>
                </BlurView>
              </View>
            ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default HomeScreen

// const styles = StyleSheet.create({})
