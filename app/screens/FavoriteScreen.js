import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  Dimensions,
  Alert,
  TextInput,
} from 'react-native'
import React, { useState, useEffect } from 'react'
import SPACING from '../config/SPACING'
import { BlurView } from 'expo-blur'
import { Ionicons } from '@expo/vector-icons'
import colors from '../config/colors'
import SearchField from '../components/SearchField'
import Categories from '../components/Categories'
import orchids from '../config/orchids'
import {
  useNavigation,
  useFocusEffect,
  useIsFocused,
} from '@react-navigation/native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { StatusBar } from 'expo-status-bar'
import axiosInstance from '../../util/axiosWrapper'

const avatar = require('../../assets/avatar.jpg')

const { width } = Dimensions.get('window')

const FavoriteScreen = ({ navigation }) => {
  useFocusEffect(
    React.useCallback(() => {
      // Add listener for tab press
      const unsubscribe = navigation.addListener('tabPress', (e) => {
        // Prevent default behavior of tab press
        e.preventDefault()

        // Reset the navigation state to the initial route of the stack
        navigation.reset({
          index: 0,
          routes: [{ name: 'FavoriteScreen' }],
        })
      })

      // Cleanup the listener when the screen loses focus or unmounts
      return unsubscribe
    }, [])
  )
  const [activeCategoryId, setActiveCategoryId] = useState(null)
  const [foodData, setFoodData] = useState([])
  const [favoriteFoods, setFavoriteFoods] = useState([])
  const [userInfo, setUserInfo] = useState({})
  const [categoryData, setCategoryData] = useState([])

  const isFocused = useIsFocused()

  const getFromStorage = async () => {
    if (isFocused) {
      const fetchData = async () => {
        try {
          const data = await AsyncStorage.getItem('favorite')
          const foodData = await AsyncStorage.getItem('foodData')
          if (data != undefined) {
            const parsedData = JSON.parse(data)
            const parsedFoodData = JSON.parse(foodData)
            setFoodData(parsedFoodData)
            const filterFoods = parsedFoodData.filter((food) => {
              const check = parsedData.find(
                (item) => item.food_id === food.food_id
              )
              if (check) {
                return food
              }
            })
            setFavoriteFoods(filterFoods)
          }
        } catch (error) {
          console.log(error)
        }
      }
      fetchData()
    }
  }

  function handleDeleteItem(id) {
    Alert.alert(
      'Confirm removing this favorite food',
      'You cannot recover your favorite food after removing it!',
      [
        {
          text: 'Cancel',
          onPress: () => {},
        },
        {
          text: 'Yes, I confirm',
          onPress: async () => {
            try {
              const updatedList = favoriteFoods.filter(
                (food) => food.food_id !== id
              )
              await AsyncStorage.setItem(
                'favorite',
                JSON.stringify(updatedList)
              )
              setFavoriteFoods(updatedList)
            } catch (error) {
              console.log(error)
            }
          },
        },
      ]
    )
  }

  function handleDeleteAllItem() {
    Alert.alert(
      'Confirm removing all of your favorite foods',
      'You cannot recover your favorite foods after removing them!',
      [
        {
          text: 'Cancel',
          onPress: () => {},
        },
        {
          text: 'Yes, I confirm',
          onPress: async () => {
            try {
              await AsyncStorage.removeItem('favorite')
              setFavoriteFoods([])
            } catch (error) {
              console.log(error)
            }
          },
        },
      ]
    )
  }
  const getUserFromStorage = async () => {
    try {
      const user = await AsyncStorage.getItem('userData')
      setUserInfo(JSON.parse(user))
    } catch (error) {
      console.error('Error getting user data from storage:', error)
    }
  }
  const getCategoryData = async () => {
    try {
      const res = await axiosInstance.get(
        '/categories_detail?cate_id=6e3f5b3b-df19-4776-a7cc-92b0a0a3ce1d'
      )
      setCategoryData(res?.data?.categories_detail?.rows)
    } catch (error) {
      console.log(error)
    }
  }

  const navigationToSetting = () => {
    navigation.navigate('Setting')
  }

  const handleTextInputFocus = () => {
    navigation.navigate('SearchHome', { categoryDataList: categoryData })
  }

  // const getFoodData = async () => {
  //   try {
  //     const res = await axiosInstance.get(`/foods`);
  //     setFoodData(res?.data?.foods);
  //     console.log(foodData);
  //   } catch (error) {
  //     console.log(error)
  //   }
  // }

  useEffect(() => {
    getFromStorage()
    getCategoryData()
    getUserFromStorage()
  }, [isFocused])

  return (
    <SafeAreaView style={{ backgroundColor: colors.dark, flex: 1 }}>
      <StatusBar backgroundColor={colors.primary} />
      <ScrollView
        style={{
          padding: SPACING,
          paddingTop: SPACING * 4,
          paddingBottom: SPACING * 4,
        }}
      >
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
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
              <Ionicons name="menu" size={SPACING * 2.5} color={colors.light} />
            </BlurView>
          </TouchableOpacity>
          <View
            style={{
              width: SPACING * 16,
              height: SPACING * 4,
              overflow: 'hidden',
              marginTop: SPACING / 2,
              borderRadius: SPACING,
            }}
          >
            <Text style={{ color: colors.white, fontSize: SPACING * 2 }}>
              Favorite Screen
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
              <TouchableOpacity onPress={navigationToSetting}>
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
        <View style={{ width: '80%', marginVertical: SPACING }}></View>

        {/* Search input */}
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
              placeholder="Find Your Food..."
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

        <Categories
          let
          titleColor="light"
          onChange={(id) => setActiveCategoryId(id)}
          inputData={categoryData}
        />

        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          {favoriteFoods.length >= 2 && (
            <TouchableOpacity
              onPress={() => handleDeleteAllItem()}
              style={{
                marginLeft: SPACING,
                backgroundColor: colors.primary,
                width: width / 2 - SPACING * 2.5,
                height: SPACING * 5,
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: SPACING / 2,
                marginBottom: SPACING * 2,
                marginTop: SPACING,
              }}
            >
              <Text
                style={{
                  color: colors.white,
                  fontSize: SPACING * 2,
                  fontWeight: '500',
                }}
              >
                Clear all
              </Text>
            </TouchableOpacity>
          )}
          <Text
            style={{
              color: colors['white-smoke'],
              fontSize: SPACING * 2,
              fontWeight: '300',
              marginBottom: SPACING,
              marginRight: SPACING * 4,
            }}
          >
            Count items: {favoriteFoods?.length}
          </Text>
        </View>

        <View
          style={{
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            paddingBottom: SPACING * 4,
          }}
        >
          {/* {console.log(favoriteOrchidsList)} */}
          {/* .filter((food) => {
                if (activeCategoryId === null) {
                    return true;
                  } else if (activeCategoryId === 0) {
                      return food;
                  }
                    return food.categoryId === activeCategoryId;
                  }) */}
          {favoriteFoods.length !== 0 ? (
            favoriteFoods
              .filter((food) => {
                if (activeCategoryId === null) {
                  return true
                } else if (activeCategoryId === 0) {
                  return food
                }
                return food.food_cate_detail.cate_detail_id === activeCategoryId
              })
              .map((food) => (
                <View
                  key={food.food_id}
                  style={{
                    flexDirection: 'column',
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
                          foodId: food.food_id,
                          categoryData: categoryData,
                          foodData: foodData,
                        })
                      }
                      style={{
                        height: 150,
                        width: '100%',
                      }}
                    >
                      <Image
                        source={{ uri: food.food_image[0].image }}
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
                      numberOfLines={1}
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
                      style={{
                        color: colors.secondary,
                        fontSize: SPACING * 1.2,
                      }}
                    >
                      {food.included}
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
                            color: colors.white,
                            fontSize: SPACING * 1.6,
                          }}
                        >
                          {food.price}
                        </Text>
                        <Text
                          style={{
                            color: colors.primary,
                            marginRight: SPACING / 2,
                            fontSize: SPACING * 1.6,
                          }}
                        >
                          vnđ
                        </Text>
                      </View>
                      <TouchableOpacity
                        onPress={() => handleDeleteItem(food.food_id)}
                      >
                        <Ionicons
                          name="heart"
                          size={SPACING * 3}
                          color={colors.primary}
                        />
                      </TouchableOpacity>
                    </View>
                  </BlurView>
                </View>
              ))
          ) : (
            <View>
              <Text
                style={{
                  color: colors.white,
                  fontSize: SPACING * 1.6,
                  padding: 110,
                }}
              >
                Your Favorite is empty
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default FavoriteScreen

const styles = StyleSheet.create({})
