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

const IngredientsScreen = ({ navigation }) => {
  const [ingreData, setIngreData] = useState([])
  const [categoriesData, setCategoriesData] = useState([])
  useFocusEffect(
    React.useCallback(() => {
      // Add listener for tab press
      const unsubscribe = navigation.addListener('tabPress', () => {
        // Reset the navigation state to the initial route of the stack
        navigation.reset({
          index: 0,
          routes: [{ name: 'IngredientsScreen' }],
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
      const res = await axiosInstance.get(`/ingredients`)
      console.log(res?.data)
      setIngreData(res?.data?.ingredients)
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
    getIngreData(), getCategoriesData()
  }, [])
  console.log(categoriesData)

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
          >
            <Text style={{ color: colors.white, fontSize: SPACING * 2 }}>
              Ingredient
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
          inputData={categoriesData}
        />
        <View
          style={{
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            paddingBottom: SPACING * 4,
          }}
        >
          {ingreData

            ?.filter((orchid) => {
              if (activeCategoryId === null) {
                return true
              }
              return (
                orchid.ingredient_cate_detail.cate_detail_id ===
                activeCategoryId
              )
            })
            .map((orchid) => (
              <View
                key={orchid.ingredient_id}
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
                      navigation.navigate('IngredientDetail', {
                        ingredientId: orchid.ingredient_id,
                      })
                    }
                    style={{
                      height: 150,
                      width: '100%',
                    }}
                  >
                    <Image
                      source={{ uri: orchid.ingredient_image[0].image }}
                      style={{
                        width: '100%',
                        height: '100%',
                        borderRadius: SPACING * 2,
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
                    {orchid.ingredient_name}
                  </Text>
                  <Text
                    numberOfLines={1}
                    style={{ color: colors.secondary, fontSize: SPACING * 1.2 }}
                  >
                    {orchid.ingredient_cate_detail.cate_detail_name}
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
                        style={{ color: colors.white, fontSize: SPACING * 1.6 }}
                      >
                        {orchid.price}
                      </Text>
                      <Text
                        style={{
                          color: colors.primary,
                          marginRight: SPACING / 2,
                          fontSize: SPACING * 1.6,
                          marginLeft: SPACING / 2,
                        }}
                      >
                        vnđ
                      </Text>
                    </View>
                    <TouchableOpacity
                      onPress={() => {
                        const check = dataFav.find(
                          (item) => item.ingredient_id === orchid.ingredient_id
                        )
                        console.log(orchid.ingredient_id)
                        console.log('Check:', check)
                        if (check) {
                          removeDataFromStorage(orchid.ingredient_id)
                        } else {
                          setDataToStorage(orchid)
                        }
                      }}
                    >
                      <Ionicons
                        name="add-circle"
                        size={SPACING * 3}
                        color={colors.white}
                      />
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

export default IngredientsScreen

// const styles = StyleSheet.create({})
