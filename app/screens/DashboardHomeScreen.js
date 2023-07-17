import React, { useState, useEffect, useContext } from 'react'
import { useNavigation, useFocusEffect, useIsFocused } from '@react-navigation/native'
import { View, Text, Image, SafeAreaView, TouchableOpacity, TextInput, FlatList, ScrollView, Dimensions } from "react-native";
import SPACING from '../config/SPACING'
import SearchField from '../components/SearchField'
import Categories from '../components/Categories'
import { BlurView } from 'expo-blur'
import { Ionicons } from '@expo/vector-icons'
import { StatusBar } from 'expo-status-bar'
import colors from '../config/colors'
import axiosInstance from '../../util/axiosWrapper'

const DashboardHomeScreen =  ({ navigation }) => {
    const isFocused = useIsFocused()
    const avatar = require('../../assets/avatar.jpg')

    const { width } = Dimensions.get('window')

    useFocusEffect(
        React.useCallback(() => {
          // Add listener for tab press
          const unsubscribe = navigation.addListener('tabPress', () => {

            navigation.reset({
              index: 0,
              routes: [{ name: 'Dashboard' }],
            })

          }, [isFocused])

          return unsubscribe
        }, [navigation, isFocused])
      );
      const [foodData, setFoodData] = useState([])
      const [activeCategoryId, setActiveCategoryId] = useState(null)
      const [dataFav, setDataFav] = useState([])


      // const { foodData } = useContext(AuthContext);
    
      // useEffect(() => {
      //   getFromStorage()
      // }, [])
    
      // Get data from storage
      const getFromStorage = async () => {
        try {
          const data = await AsyncStorage.getItem("favorite");
          setDataFav(data ? JSON.parse(data) : []);
    
        } catch (error) {
          console.error('Error getting data from storage:', error)
        }
      }
    
      // Set data to storage
      const setDataToStorage = async (food) => {
        try {
          const updatedData = [...dataFav, food]
          await AsyncStorage.setItem('favorite', JSON.stringify(updatedData))
          setDataFav(updatedData)
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
        try {
          const res = await axiosInstance.get(`/foods`)
          // console.log(res?.data)
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
            <Text style={{ color: colors.white, fontSize: SPACING * 1.8 }}>
              Dashboard Screen
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
        <View style={{ 
          flexDirection: "row",
          justifyContent: "space-between",
          paddingHorizontal: 40,
          padding: 20
          }}>
          
          <TouchableOpacity style={ {
            alignItems: 'center',
            borderRadius: SPACING,
            paddingVertical: SPACING,
            paddingHorizontal: SPACING * 2,
            backgroundColor: colors.primary,
            shadowColor: colors.black,
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.3,
            shadowRadius: 4,
            elevation: 5,
            }}>
            <BlurView intensity={90} tint="light" style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              alignItems: 'center',
              justifyContent: 'center',
              }}>
              <Ionicons name="md-restaurant" size={20} color={colors.primary} />
            </BlurView>
            <Text numberOfLines={1} ellipsizeMode="tail" style={{
                color: colors.white,
                fontSize: 11,
                fontWeight: "bold",
               }}>
                Ingredient</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={ {
            alignItems: 'center',
            borderRadius: 10,
            paddingVertical: 10,
            paddingHorizontal: 20,
            backgroundColor: colors.primary,
            shadowColor: colors.black,
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.3,
            shadowRadius: 4,
            elevation: 5,
          }}>
            <BlurView intensity={90} tint="light" style={{
            width: 40,
            height: 40,
            borderRadius: 20,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
              <Ionicons name="md-book" size={20} color={colors.primary} />
            </BlurView>
            <Text numberOfLines={1} ellipsizeMode="tail" style={{
              color: colors.white,
              fontSize: 12,
              fontWeight: "bold",
            }}>
              Blogs</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={ {
            alignItems: 'center',
            borderRadius: 10,
            paddingVertical: 10,
            paddingHorizontal: 20,
            backgroundColor: colors.primary,
            shadowColor: colors.black,
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.3,
            shadowRadius: 4,
            elevation: 5,
          }}>
            <BlurView intensity={90} tint="light" style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <Ionicons name="md-calendar" size={20} color={colors.primary} />
            </BlurView>
            
            <Text numberOfLines={1} ellipsizeMode="tail" style={{
              color: colors.white,
              fontSize: 11,
              fontWeight: "bold",
            }}>
              Schedule</Text>

          </TouchableOpacity>
        </View>

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
                  </View>
                </BlurView>
              </View>
            ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}
  

export default DashboardHomeScreen