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
  Modal,
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
  const [userInfo, setUserInfo] = useState({})
  const [isModalVisible, setModalVisible] = useState(false);

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

  const getUserFromStorage = async () => {
    try {
      const user = await AsyncStorage.getItem('userData')
      setUserInfo(JSON.parse(user))
    } catch (error) {
      console.error('Error getting user data from storage:', error)
    }
  }
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
    getIngreData(), getCategoriesData(), getUserFromStorage()
  }, [])
  console.log(categoriesData)

  const handleTextInputFocus = () => {
    navigation.navigate('SearchIngredients');
  };

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const navigationToSetting = () => {
    navigation.navigate('Setting')
  }

  return (
    <>
      <Modal visible={isModalVisible} transparent={true}>
        <View style={styles.modalBackGround}>
          <View style={styles.modalContainer}>
            <View style={{
              width: '100%',
              backgroundColor: 'white',
              paddingHorizontal: 20,
              borderRadius: 20,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            </View>
            <TouchableOpacity style={styles.modalClick} onPress={() => {
              let tempList = ingreData.sort((a, b) => a.ingredient_name > b.ingredient_name ? 1 : -1)
              setIngreData(tempList);
              toggleModal();
            }}>
              <View>
                <Text style={{ fontWeight: 'bold' }}>Sort by Name</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.modalClick} onPress={() => {
              setIngreData(ingreData.sort((a, b) => a.price - b.price));
              toggleModal();
            }}>
              <View>
                <Text style={{ fontWeight: 'bold' }}>Low to High Price</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalClick} onPress={() => {
              setIngreData(ingreData.sort((a, b) => b.price - a.price));
              toggleModal();
            }}>
              <View>
                <Text style={{ fontWeight: 'bold' }}>High to Low Price</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity style={styles.header} onPress={toggleModal}>
              <Ionicons
                name="close-outline"
                size={SPACING * 3}
              />
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <SafeAreaView style={{ backgroundColor: colors.dark, flex: 1 }}>
        <StatusBar backgroundColor={colors.primary} />
        
        <View style={{
          paddingHorizontal: SPACING,
          paddingTop: SPACING * 4,
        }}>
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
              flexDirection: 'row',
              borderRadius: SPACING,
              overflow: "hidden",
              marginBottom: SPACING * 2
            }}
          >
            <BlurView
              intensity={30}
              style={{
                borderRadius: SPACING,
                width: '85%',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <TextInput
                showSoftInputOnFocus={false}
                style={{
                  width: '100%',
                  color: colors.white,
                  fontSize: SPACING * 1.7,
                  padding: SPACING,
                  paddingLeft: SPACING * 3.5,
                }}
                placeholder="Find Your Ingredient..."
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

            <TouchableOpacity
              onPress={toggleModal}
              style={{
                borderRadius: SPACING,
                overflow: 'hidden',
                width: SPACING * 4,
                height: 45,
                marginLeft: SPACING * 2
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
                  name="funnel"
                  size={SPACING * 2.5}
                  color={colors.secondary}
                />
              </BlurView>
            </TouchableOpacity>
          </View>
        </View>

          <ScrollView
          style={{
            padding: SPACING,
            paddingTop: -10,
          }}
        >
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
                } else if (activeCategoryId === "55f00386-b8f0-497f-9ed3-a41bae525de1") {
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
    </>
  )
}

export default IngredientsScreen

const styles = StyleSheet.create({
  modalBackGround: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '60%',
    height: '40%',
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingVertical: 30,
    borderRadius: 20,
    elevation: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    position: 'absolute',
    top: 5,
    right: 10
  },
  modalClick: {
    width: '100%',
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingVertical: 30,
    borderRadius: 20,
    elevation: 5,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10
  }

});
