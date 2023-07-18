import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  Dimensions,
  ActivityIndicator,
  TextInput,
} from 'react-native'
import React, { useState, useEffect, useContext } from 'react'
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
import categories from '../config/categories'
import { StatusBar } from 'expo-status-bar'
import { AuthContext } from '../context/AuthContext'
import axiosInstance from '../../util/axiosWrapper'
import Carousels from '../components/Carousel'

const { width } = Dimensions.get('window')

const HomeScreen = ({ navigation }) => {
  const [foodData, setFoodData] = useState([])
  const [categoryData, setCategoryData] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [userInfo, setUserInfo] = useState({})
  const isFocused = useIsFocused()

  useFocusEffect(
    React.useCallback(() => {
      // Add listener for tab press
      const unsubscribe = navigation.addListener(
        'tabPress',
        () => {
          // Reset the navigation state to the initial route of the stack
          navigation.reset({
            index: 0,
            routes: [{ name: 'HomeScreen' }],
          })
          getFromStorage()
        },
        [isFocused]
      )

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

  // Get data from storage
  const getFromStorage = async () => {
    try {
      const data = await AsyncStorage.getItem('favorite')
      setDataFav(data ? JSON.parse(data) : [])
    } catch (error) {
      console.error('Error getting data from storage:', error)
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

  // Set data to storage
  const setDataToStorage = async (food) => {
    try {
      const updatedData = [...dataFav, food]
      await AsyncStorage.setItem('favorite', JSON.stringify(updatedData))
      setDataFav(updatedData)
      console.log(dataFav)
    } catch (error) {
      console.error('Error setting data to storage:', error)
    }
  }

  // Remove data from storage
  const removeDataFromStorage = async (itemId) => {
    try {
      const list = dataFav.filter((item) => item.food_id !== itemId)
      await AsyncStorage.setItem('favorite', JSON.stringify(list))
      setDataFav(list)
    } catch (error) {
      console.error('Error removing data from storage:', error)
    }
  }

  const getFoodData = async () => {
    setIsLoading(true)
    try {
      const res = await axiosInstance.get('/foods')
      // console.log(res?.data)
      setFoodData(res?.data?.foods)
      await AsyncStorage.setItem('foodData', JSON.stringify(res?.data?.foods))
      setIsLoading(false)
    } catch (error) {
      console.log(error)
    } finally {
      setIsLoading(false)
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

  useEffect(() => {
    getCategoryData(), getFoodData(), getFromStorage(), getUserFromStorage()
  }, [isFocused])

  const handleTextInputFocus = () => {
    navigation.navigate('SearchHome', { categoryDataList: categoryData })
  }

  const navigationToSetting = () => {
    navigation.navigate('Setting')
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
        {/* <View style={{ width: "80%", marginVertical: SPACING }}></View> */}

        {/* Search input */}
        <View
          style={{
            borderRadius: SPACING,
            overflow: "hidden",
            marginBottom: SPACING * 2
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

        <Carousels />

        <Categories
          let
          titleColor="light"
          onChange={(id) => setActiveCategoryId(id)}
          inputData={categoryData}
        />

        

        <View
          style={{
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            paddingBottom: SPACING * 4,
          }}
        >
          {isLoading ? (
            <View
              style={{
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
                marginTop: 20,
              }}
            >
              <ActivityIndicator size="large" color="#FC6847" />
            </View>
          ) : (
            foodData
              ?.filter((food) => {
                if (activeCategoryId === null) {
                  return true
                } else if (activeCategoryId === "8b113e48-d1d6-4397-a0aa-743be2df2ad1") {
                  return true
                }
                return food.food_cate_detail.cate_detail_id === activeCategoryId
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
                      
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() =>
                        navigation.navigate('OrchidDetail', {
                          foodId: food.food_id,
                          categoryData: categoryData,
                          foodData: foodData
                        })
                      }
                    >
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
                    </TouchableOpacity>
                    <Text
                      numberOfLines={1}
                      style={{
                        color: colors.secondary,
                        fontSize: SPACING * 1.2,
                      }}
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
                        {/* <Text
                      style={{
                        color: colors.primary,
                        marginRight: SPACING / 2,
                        fontSize: SPACING * 1.6,
                      }}
                    >
                    </Text> */}
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
                            marginLeft: SPACING / 2,
                          }}
                        >
                          vnđ
                        </Text>
                      </View>
                      <TouchableOpacity
                        onPress={() => {
                          const check = dataFav.find(
                            (item) => item.food_id === food.food_id
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
                        {dataFav.find(
                          (item) => item.food_id === food.food_id
                        ) ? (
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
              ))
          )}
          {/* <Text
                        style={{ color: colors.white, fontSize: SPACING * 1.6 }}
                      >
                        {food.price}
                      </Text>
                    </View>
                    <TouchableOpacity
                      onPress={() => {
                        const check = dataFav.find(
                          (item) => item.food_id === food.food_id
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
                      {dataFav.find((item) => item.food_id === food.food_id) ? (
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
            ))} */}
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default HomeScreen

// const styles = StyleSheet.create({})
