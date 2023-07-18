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
  ActivityIndicator,
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
  useRoute,
} from '@react-navigation/native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import categories from '../config/categories'
import { StatusBar } from 'expo-status-bar'
import axiosInstance from '../../util/axiosWrapper'

const avatar = require('../../assets/avatar.jpg')

const { width } = Dimensions.get('window')
const { height } = Dimensions.get('window')

const ShoppingListScreen = ({ navigation }) => {
  const [ingreData, setIngreData] = useState([])
  const [categoriesData, setCategoriesData] = useState([])
  const [sort, setSort] = useState(null)
  console.log(favoriteOrchidsList, '123123123123123123123213123')
  useFocusEffect(
    React.useCallback(() => {
      // Add listener for tab press
      const unsubscribe = navigation.addListener('tabPress', (e) => {
        // Prevent default behavior of tab press
        e.preventDefault()

        // Reset the navigation state to the initial route of the stack
        navigation.reset({
          index: 0,
          routes: [{ name: 'ShoppingList' }],
        })
      })

      // Cleanup the listener when the screen loses focus or unmounts
      return unsubscribe
    }, [])
  )

  const isFocused = useIsFocused()
  const [activeCategoryId, setActiveCategoryId] = useState(null)
  const [favoriteOrchidsList, setFavoriteOrchidsList] = useState([])
  const [dataFav, setDataFav] = useState([])
  const [dataBuy, setDataBuy] = useState([])
  const [dataWaiting, setDataWaiting] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [userInfo, setUserInfo] = useState({})

  const getFromStorage = async () => {
    if (isFocused) {
      setIsLoading(true)

      try {
        const res = await axiosInstance.get('/ingredients')
        const data = await AsyncStorage.getItem('shoppingList')

        console.log(res?.data)
        setIngreData(res?.data?.ingredients)

        if (data !== undefined) {
          const parsedData = JSON.parse(data)
          const filterOrchids = res.data.ingredients.filter((orchid) =>
            parsedData.find(
              (item) => item.ingredient_id === orchid.ingredient_id
            )
          )
          setFavoriteOrchidsList(filterOrchids)
        }
      } catch (error) {
        console.log(error)
      } finally {
        setIsLoading(false)
      }
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

  const getBuyFromStorage = async () => {
    try {
      const data = await AsyncStorage.getItem('buyList')
      setDataBuy(data ? JSON.parse(data) : [])
    } catch (error) {
      console.error('Error getting data from storage:', error)
    }
  }

  // Set data to storage
  const setBuyDataToStorage = async (orchid) => {
    try {
      console.log(orchid)
      const updatedData = [...dataBuy, orchid]
      console.log(updatedData)
      await AsyncStorage.setItem('buyList', JSON.stringify(updatedData))
      setDataBuy(updatedData)
    } catch (error) {
      console.error('Error setting data to storage:', error)
    }
  }

  // Remove data from storage
  function handleDeleteItem(id) {
    Alert.alert(
      'Confirm removing this item?',
      'You can not recover your item after removing it!',
      [
        {
          text: 'Cancel',
          onPress: () => {},
        },
        {
          text: 'Yes, I confirm',
          onPress: async () => {
            const list = favoriteOrchidsList.filter(
              (item) => item.ingredient_id !== id
            )
            const list1 = dataBuy.filter(
              (item) => item.ingredient_id !== id
            )
            await AsyncStorage.setItem('shoppingList', JSON.stringify(list))
            await AsyncStorage.setItem('buyList', JSON.stringify(list1))
            setDataBuy(list1)
            setFavoriteOrchidsList(list)
            
          },
        },
      ]
    )
  }

  function handleDeleteAllItem() {
    Alert.alert(
      'Confirm removing all of your shopping list',
      'You can not recover your shopping list after removing it!',
      [
        {
          text: 'Cancel',
          onPress: () => {},
        },
        {
          text: 'Yes, I confirm',
          onPress: async () => {
            const list = []
            await AsyncStorage.setItem('shoppingList', JSON.stringify(list))
            setFavoriteOrchidsList(list)
          },
        },
      ]
    )
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
  const removeBuyDataFromStorage = async (itemId) => {
    try {
      const list = dataBuy.filter((item) => item.ingredient_id !== itemId)
      await AsyncStorage.setItem('buyList', JSON.stringify(list))
      setDataBuy(list)
    } catch (error) {
      console.error('Error removing data from storage:', error)
    }
  }

  useEffect(() => {
    getFromStorage()
    getBuyFromStorage()
    getCategoriesData()
    getUserFromStorage()
  }, [isFocused])
  console.log(categoriesData)

  const waiting = favoriteOrchidsList.filter(
    (shoppingItem) =>
      !dataBuy.some(
        (buyItem) => shoppingItem.ingredient_id === buyItem.ingredient_id
      )
  )
  return (
    <SafeAreaView style={{ backgroundColor: colors.dark, flex: 1 }}>
      <StatusBar backgroundColor={colors.primary} />
      <ScrollView
        style={{
          paddingHorizontal: SPACING,
          overflow: 'visible',
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
                  source={{ uri: userInfo?.user?.avatar }}
                />
              </TouchableOpacity>
            </BlurView>
          </View>
        </View>
        {/* <View style={{ width: "80%", marginVertical: SPACING }}></View> */}
        <Categories
          let
          titleColor="light"
          onChange={(id) => setActiveCategoryId(id)}
          inputData={categoriesData}
        />
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          {favoriteOrchidsList.length > 1 ? (
            <TouchableOpacity
              onPress={() => handleDeleteAllItem()}
              style={{
                marginRight: SPACING * 5,
                backgroundColor: colors.primary,
                width: width / 2 - SPACING * 2.5,
                height: SPACING * 5,
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: SPACING / 2,
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
          ) : (
            <Text>''</Text>
          )}

          <Text
            style={{
              color: colors['white-smoke'],
              fontSize: SPACING * 2,
              fontWeight: '300',
              marginTop: SPACING,
            }}
          >
            Count items: {favoriteOrchidsList.length}
          </Text>
        </View>
        <View
          style={{
            flexWrap: 'wrap',
            justifyContent: 'space-between',
          }}
        >
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              paddingVertical: SPACING * 2,
            }}
          >
            {sort === null ? (
              <TouchableOpacity
                style={{
                  alignItems: 'center',
                  borderRadius: SPACING / 2,
                  paddingVertical: SPACING,
                  paddingHorizontal: SPACING * 2,
                  width: SPACING * 11,
                  backgroundColor: colors.white,
                  shadowColor: colors.black,
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.3,
                  shadowRadius: 4,
                  elevation: 5,
                }}
                onPress={() => {
                  setSort(null)
                }}
              >
                <Text
                  numberOfLines={1}
                  ellipsizeMode="tail"
                  style={{
                    color: colors['dark-light'],
                    fontSize: 11,
                    fontWeight: 'bold',
                  }}
                >
                  All
                </Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={{
                  alignItems: 'center',
                  borderRadius: SPACING / 2,
                  paddingVertical: SPACING,
                  paddingHorizontal: SPACING * 2,
                  width: SPACING * 11,
                  backgroundColor: colors['dark-light'],
                  shadowColor: colors.black,
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.3,
                  shadowRadius: 4,
                  elevation: 5,
                }}
                onPress={() => {
                  setSort(null)
                }}
              >
                <Text
                  numberOfLines={1}
                  ellipsizeMode="tail"
                  style={{
                    color: colors.white,
                    fontSize: 11,
                    fontWeight: 'bold',
                  }}
                >
                  All
                </Text>
              </TouchableOpacity>
            )}

            {sort === 'Bought' ? (
              <TouchableOpacity
                style={{
                  alignItems: 'center',
                  borderRadius: SPACING / 2,
                  paddingVertical: SPACING,
                  paddingHorizontal: SPACING * 2,
                  width: SPACING * 11,
                  backgroundColor: colors.white,
                  shadowColor: colors.black,
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.3,
                  shadowRadius: 4,
                  elevation: 5,
                }}
                onPress={() => {
                  setSort('Bought')
                }}
              >
                <Text
                  numberOfLines={1}
                  ellipsizeMode="tail"
                  style={{
                    color: colors['dark-light'],
                    fontSize: 11,
                    fontWeight: 'bold',
                  }}
                >
                  Bought
                </Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={{
                  alignItems: 'center',
                  borderRadius: SPACING / 2,
                  paddingVertical: SPACING,
                  paddingHorizontal: SPACING * 2,
                  width: SPACING * 11,
                  backgroundColor: colors['dark-light'],
                  shadowColor: colors.black,
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.3,
                  shadowRadius: 4,
                  elevation: 5,
                }}
                onPress={() => {
                  setSort('Bought')
                }}
              >
                <Text
                  numberOfLines={1}
                  ellipsizeMode="tail"
                  style={{
                    color: colors.white,
                    fontSize: 11,
                    fontWeight: 'bold',
                  }}
                >
                  Bought
                </Text>
              </TouchableOpacity>
            )}

            {sort === 'Waiting' ? (
              <TouchableOpacity
                style={{
                  alignItems: 'center',
                  borderRadius: SPACING / 2,
                  paddingVertical: SPACING,
                  paddingHorizontal: SPACING * 2,
                  width: SPACING * 11,
                  backgroundColor: colors.white,
                  shadowColor: colors.black,
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.3,
                  shadowRadius: 4,
                  elevation: 5,
                }}
                onPress={() => {
                  setSort('Waiting')
                }}
              >
                <Text
                  numberOfLines={1}
                  ellipsizeMode="tail"
                  style={{
                    color: colors['dark-light'],
                    fontSize: 11,
                    fontWeight: 'bold',
                  }}
                >
                  Waiting
                </Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={{
                  alignItems: 'center',
                  borderRadius: SPACING / 2,
                  paddingVertical: SPACING,
                  paddingHorizontal: SPACING * 2,
                  width: SPACING * 11,
                  backgroundColor: colors['dark-light'],
                  shadowColor: colors.black,
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.3,
                  shadowRadius: 4,
                  elevation: 5,
                }}
                onPress={() => {
                  setSort('Waiting')
                }}
              >
                <Text
                  numberOfLines={1}
                  ellipsizeMode="tail"
                  style={{
                    color: colors.white,
                    fontSize: 11,
                    fontWeight: 'bold',
                  }}
                >
                  Waiting
                </Text>
              </TouchableOpacity>
            )}
          </View>

          {isLoading ? (
            <ActivityIndicator color={colors.green} size="large" />
          ) : favoriteOrchidsList.length !== 0 && sort === null ? (
            favoriteOrchidsList
              .filter((orchid) => {
                if (activeCategoryId === null) {
                  return true
                } else if (activeCategoryId === '55f00386-b8f0-497f-9ed3-a41bae525de1') {
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
                    width: width - SPACING * 2,
                    height: width - SPACING * 26,
                    marginBottom: SPACING,
                    borderRadius: SPACING,
                    overflow: 'hidden',
                  }}
                >
                  <BlurView
                    tint="dark"
                    intensity={95}
                    style={{
                      padding: SPACING,
                      paddingBottom: SPACING,
                      flexDirection: 'row',
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
                        width: '40%',
                      }}
                    >
                      <Image
                        source={{ uri: orchid.ingredient_image[0].image }}
                        style={{
                          width: '80%',
                          height: '65%',
                          borderRadius: SPACING,
                        }}
                      />
                    </TouchableOpacity>
                    <View>
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
                        style={{
                          color: colors.secondary,
                          fontSize: SPACING * 1.2,
                        }}
                      >
                        {orchid.ingredient_cate_detail.cate_detail_name}
                      </Text>
                      <View
                        style={{
                          marginBottom: SPACING,
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
                      </View>
                    </View>
                    <View
                      style={{
                        flexDirection: 'row',
                        position: 'absolute',
                        right: SPACING,
                      }}
                    >
                      <TouchableOpacity
                        onPress={() => {
                          const check = dataBuy.find(
                            (item) =>
                              item.ingredient_id === orchid.ingredient_id
                          )
                          console.log(orchid.ingredient_id)
                          console.log('Check:', check)
                          if (check) {
                            removeBuyDataFromStorage(orchid.ingredient_id)
                          } else {
                            setBuyDataToStorage(orchid)
                          }
                        }}
                        style={{
                          position: 'absolute',
                          right: SPACING / 6,
                          top: SPACING,
                        }}
                      >
                        {dataBuy.find(
                          (item) => item.ingredient_id === orchid.ingredient_id
                        ) ? (
                          <Ionicons
                            name="pricetags"
                            size={SPACING * 3}
                            color={colors.green}
                          />
                        ) : (
                          <Ionicons
                            name="pricetag"
                            size={SPACING * 3}
                            color={colors.white}
                          />
                        )}
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => {
                          handleDeleteItem(orchid.ingredient_id);
                          
                        }}
                        style={{
                          position: 'absolute',
                          right: SPACING / 6,
                          marginTop: SPACING * 8,
                        }}
                      >
                        <Ionicons
                          name="trash-outline"
                          size={SPACING * 2.5}
                          color={colors.red}
                        />
                      </TouchableOpacity>
                    </View>
                  </BlurView>
                </View>
              ))
          ) : favoriteOrchidsList.length !== 0 && sort === 'Bought' ? (
            dataBuy
              .filter((orchid) => {
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
                    width: width - SPACING * 2,
                    height: width - SPACING * 26,
                    marginBottom: SPACING,
                    marginBottom: SPACING,
                    borderRadius: SPACING,
                    overflow: 'hidden',
                  }}
                >
                  <BlurView
                    tint="dark"
                    intensity={95}
                    style={{
                      padding: SPACING,
                      paddingBottom: SPACING,
                      flexDirection: 'row',
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
                        width: '40%',
                      }}
                    >
                      <Image
                        source={{ uri: orchid.ingredient_image[0].image }}
                        style={{
                          width: '80%',
                          height: '65%',
                          borderRadius: SPACING,
                        }}
                      />
                    </TouchableOpacity>
                    <View>
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
                        style={{
                          color: colors.secondary,
                          fontSize: SPACING * 1.2,
                        }}
                      >
                        {orchid.ingredient_cate_detail.cate_detail_name}
                      </Text>
                      <View
                        style={{
                          marginBottom: SPACING,
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
                      </View>
                    </View>
                    <View
                      style={{
                        flexDirection: 'row',
                        position: 'absolute',
                        right: SPACING,
                      }}
                    >
                      <TouchableOpacity
                        onPress={() => {
                          const check = dataBuy.find(
                            (item) =>
                              item.ingredient_id === orchid.ingredient_id
                          )
                          console.log(orchid.ingredient_id)
                          console.log('Check:', check)
                          if (check) {
                            removeBuyDataFromStorage(orchid.ingredient_id)
                          } else {
                            setBuyDataToStorage(orchid)
                          }
                        }}
                        style={{
                          position: 'absolute',
                          right: SPACING / 6,
                          top: SPACING,
                        }}
                      >
                        {dataBuy.find(
                          (item) => item.ingredient_id === orchid.ingredient_id
                        ) ? (
                          <Ionicons
                            name="pricetags"
                            size={SPACING * 3}
                            color={colors.green}
                          />
                        ) : (
                          <Ionicons
                            name="pricetag"
                            size={SPACING * 3}
                            color={colors.white}
                          />
                        )}
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => {
                          handleDeleteItem(orchid.ingredient_id)
                        }}
                        style={{
                          position: 'absolute',
                          right: SPACING / 6,
                          marginTop: SPACING * 8,
                        }}
                      >
                        <Ionicons
                          name="trash-outline"
                          size={SPACING * 2.5}
                          color={colors.red}
                        />
                      </TouchableOpacity>
                    </View>
                  </BlurView>
                </View>
              ))
          ) : favoriteOrchidsList.length !== 0 && sort === 'Waiting' ? (
            waiting
              .filter((orchid) => {
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
                    width: width - SPACING * 2,
                    height: width - SPACING * 26,
                    marginBottom: SPACING,
                    marginBottom: SPACING,
                    borderRadius: SPACING,
                    overflow: 'hidden',
                  }}
                >
                  <BlurView
                    tint="dark"
                    intensity={95}
                    style={{
                      padding: SPACING,
                      paddingBottom: SPACING,
                      flexDirection: 'row',
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
                        width: '40%',
                      }}
                    >
                      <Image
                        source={{ uri: orchid.ingredient_image[0].image }}
                        style={{
                          width: '80%',
                          height: '65%',
                          borderRadius: SPACING,
                        }}
                      />
                    </TouchableOpacity>
                    <View>
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
                        style={{
                          color: colors.secondary,
                          fontSize: SPACING * 1.2,
                        }}
                      >
                        {orchid.ingredient_cate_detail.cate_detail_name}
                      </Text>
                      <View
                        style={{
                          marginBottom: SPACING,
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
                      </View>
                    </View>
                    <View
                      style={{
                        flexDirection: 'row',
                        position: 'absolute',
                        right: SPACING,
                      }}
                    >
                      <TouchableOpacity
                        onPress={() => {
                          const check = dataBuy.find(
                            (item) =>
                              item.ingredient_id === orchid.ingredient_id
                          )
                          console.log(orchid.ingredient_id)
                          console.log('Check:', check)
                          if (check) {
                            removeBuyDataFromStorage(orchid.ingredient_id)
                          } else {
                            setBuyDataToStorage(orchid)
                          }
                        }}
                        style={{
                          position: 'absolute',
                          right: SPACING / 6,
                          top: SPACING,
                        }}
                      >
                        {dataBuy.find(
                          (item) => item.ingredient_id === orchid.ingredient_id
                        ) ? (
                          <Ionicons
                            name="pricetags"
                            size={SPACING * 3}
                            color={colors.green}
                          />
                        ) : (
                          <Ionicons
                            name="pricetag"
                            size={SPACING * 3}
                            color={colors.white}
                          />
                        )}
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => {
                          handleDeleteItem(orchid.ingredient_id)
                        }}
                        style={{
                          position: 'absolute',
                          right: SPACING / 6,
                          marginTop: SPACING * 8,
                        }}
                      >
                        <Ionicons
                          name="trash-outline"
                          size={SPACING * 2.5}
                          color={colors.red}
                        />
                      </TouchableOpacity>
                    </View>
                  </BlurView>
                </View>
              ))
          ) : (
            <Text style={{ color: colors.green }}>Not Found</Text>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default ShoppingListScreen
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  checkbox: {
    alignSelf: 'center',
  },
  label: {
    margin: 8,
  },
})
