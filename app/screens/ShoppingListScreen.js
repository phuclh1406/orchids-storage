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
} from '@react-navigation/native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import categories from '../config/categories'
import { StatusBar } from 'expo-status-bar'
import axiosInstance from '../../util/axiosWrapper'

const avatar = require('../../assets/avatar.jpg')

const { width } = Dimensions.get('window')

const ShoppingListScreen = ({ navigation }) => {
  const [ingreData, setIngreData] = useState([])
  const [categoriesData, setCategoriesData] = useState([])
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
  const [isLoading, setIsLoading] = useState(true)

  const getFromStorage = async () => {
    if (isFocused) {
      setIsLoading(true) // Set isLoading to true before fetching the data
      const fetchData = async () => {
        try {
          const data = await AsyncStorage.getItem('shoppingList')
          console.log('12321312312312312312321', data)
          if (data != undefined) {
            const parsedData = JSON.parse(data)
            const filterOrchids = ingreData.filter((orchid) => {
              const check = parsedData.find(
                (item) => item.ingredient_id === orchid.ingredient_id
              )
              if (check) {
                return orchid
              }
            })
            setFavoriteOrchidsList(filterOrchids)
          }
          setIsLoading(false) // Set isLoading to false after the data has been fetched
        } catch (error) {
          console.log(error)
        }
      }
      fetchData()
    }
  }

  // Set data to storage
  const setDataToStorage = async (orchid) => {
    try {
      console.log(orchid)
      const updatedData = [...dataFav, orchid]
      console.log(updatedData)
      await AsyncStorage.setItem('shopingList', JSON.stringify(updatedData))
      setDataFav(updatedData)
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
            await AsyncStorage.setItem('shoppingList', JSON.stringify(list))
            setFavoriteOrchidsList(list)
          },
        },
      ]
    )
  }

  const getIngreData = async () => {
    try {
      const res = await axiosInstance.get(`/ingredients`)
      console.log(res?.data)
      setIngreData(res?.data?.ingredients)
    } catch (error) {
      console.log(error)
    }
  }

  function handleDeleteAllItem() {
    Alert.alert(
      'Confirm removing all of your favorite orchids',
      'You can not recover your favorites orchid after removing them!',
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
  useEffect(() => {
    getFromStorage();
    getIngreData();
    getCategoriesData(); 
  }, [isFocused])
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
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <TouchableOpacity
            onPress={() => handleDeleteAllItem()}
            style={{
              marginRight: SPACING,
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
          <Text
            style={{
              color: colors['white-smoke'],
              fontSize: SPACING * 2,
              fontWeight: '300',
              marginBottom: SPACING,
              marginLeft: SPACING * 4,
            }}
          >
            Count items: {favoriteOrchidsList.length}
          </Text>
        </View>
        <View
          style={{
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            paddingBottom: SPACING * 4,
          }}
        >
          {isLoading ? (
            <ActivityIndicator color={colors.green} size="large" />
          ) : favoriteOrchidsList.length !== 0 ? (
            favoriteOrchidsList
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
                          handleDeleteItem(orchid.ingredient_id)
                        }}
                        style={{
                          position: 'absolute',
                          right: SPACING / 6,
                          top: SPACING,
                        }}
                      >
                        {dataFav.find(
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
