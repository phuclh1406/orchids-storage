import {
  Dimensions,
  FlatList,
  Image,
  ImageBackground,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import React, { useState, useEffect } from 'react'
import {
  useNavigation,
  useFocusEffect,
  useIsFocused,
} from '@react-navigation/native'
import { Ionicons } from '@expo/vector-icons'
import colors from '../config/colors'
import SPACING from '../config/SPACING'
import { BlurView } from 'expo-blur'
import AsyncStorage from '@react-native-async-storage/async-storage'
import axiosInstance from '../../util/axiosWrapper'
const { height, width } = Dimensions.get('window')

const sizes = ['S', 'M', 'L']

const OrchidDetailsScreen = ({ route }) => {
  const navigation = useNavigation()
  const { foodData, categoryData, foodId } = route.params
  const food = foodData?.find((food) => food?.food_id === foodId)
  const [sameCateData, setSameCateData] = useState([])
  const [activeSize, setActiveSize] = useState(null)
  const [fData, setFoodData] = useState()
  const [dataFav, setDataFav] = useState([])
  const sameCateId = food?.food_cate_detail.cate_detail_id

  //Get data from storage
  const getFromStorage = async () => {
    const data = await AsyncStorage.getItem('favorite')
    setDataFav(data != null ? JSON.parse(data) : [])
  }

  //Set data from storage
  const setDataToStorage = async () => {
    let list
    if (dataFav == []) {
      list = [food]
      await AsyncStorage.setItem('favorite', JSON.stringify(list))
    } else {
      list = [...dataFav, food]
      await AsyncStorage.setItem('favorite', JSON.stringify(list))
    }
    setDataFav(list)
  }
  //Remove data from storage
  const removeDataFromStorage = async () => {
    const list = dataFav.filter((item) => item.food_id !== food.food_id)
    await AsyncStorage.setItem('favorite', JSON.stringify(list))
    setDataFav(list)
  }

  const getFoodData = async (foodId) => {
    try {
      const res = await axiosInstance.get(`/foods/${foodId}`)
      console.log(res?.data)
      console.log(1)
      setFoodData(res.data.food)
    } catch (error) {
      console.log(error)
    }
  }

  const getSameCategoryFoods = async (sameCateId) => {
    try {
      const res = await axiosInstance.get(`/foods?cate_detail_id=${sameCateId}`)
      console.log('123123123123123123123213123', res?.data.foods)
      setSameCateData(
        res?.data?.foods?.filter((item) => item?.food_id !== foodId)
      )
    } catch (error) {
      console.log(error)
    }
  }

  const getCategoryName = (categoryId) => {
    const category = categoryData?.find(
      (category) => category.cate_detail_id === categoryId
    )
    return category ? category.cate_detail_name : ''
  }

  useEffect(() => {
    if (foodId) {
      getSameCategoryFoods(sameCateId)
      getFromStorage()
    }
  }, [foodId, sameCateId])
  return (
    <>
      <ScrollView>
        <SafeAreaView>
          <ImageBackground
            source={{ uri: food?.food_image[0]?.image }}
            style={{
              height: height / 2 + SPACING * 2,

              justifyContent: 'space-between',
            }}
            imageStyle={{
              borderRadius: SPACING * 3,
            }}
          >
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                padding: SPACING * 2,
                paddingTop: SPACING * 6,
              }}
            >
              <TouchableOpacity
                onPress={() => navigation.goBack()}
                style={{
                  backgroundColor: colors.dark,
                  padding: SPACING,
                  borderRadius: SPACING * 1.5,
                }}
              >
                <Ionicons
                  name="arrow-back"
                  color={colors.white}
                  size={SPACING * 2}
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  const check = dataFav.find(
                    (item) => item?.food_id === food?.food_id
                  )
                  console.log('Check:', check)
                  if (check) {
                    removeDataFromStorage()
                  } else {
                    setDataToStorage()
                  }
                }}
                style={{
                  backgroundColor: colors.dark,
                  padding: SPACING,
                  borderRadius: SPACING * 1.5,
                }}
              >
                {dataFav.find((item) => item?.food_id === food?.food_id) ? (
                  <Ionicons
                    name="heart"
                    size={SPACING * 2.5}
                    color={colors.primary}
                  />
                ) : (
                  <Ionicons
                    name="heart"
                    size={SPACING * 2.5}
                    color={colors.white}
                  />
                )}
              </TouchableOpacity>
            </View>
          </ImageBackground>

          <View
            style={{
              padding: SPACING,
            }}
          >
            <View
              style={{
                overflow: 'hidden',
              }}
            >
              <View
                style={{
                  paddingTop: SPACING * 2,
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}
              >
                <View
                  style={{
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                  }}
                >
                  <Text
                    style={{
                      fontSize: SPACING * 3,
                      color: colors.white,
                      fontWeight: '600',
                      marginBottom: SPACING,
                    }}
                  >
                    {food?.food_name}
                  </Text>
                </View>
              </View>
            </View>
            <Text
              style={{
                color: colors['white-smoke'],
                fontSize: SPACING * 1.7,
                marginBottom: SPACING,
              }}
            >
              Description
            </Text>
            <Text numberOfLines={10} style={{ color: colors.white }}>
              {food?.description}
            </Text>
            <Text
              style={{
                color: colors['white-smoke'],
                fontSize: SPACING * 1.7,
                marginVertical: SPACING,
              }}
            >
              Ingredients
            </Text>
            <Text numberOfLines={10} style={{ color: colors.white }}>
              {food?.ingredient_description}
            </Text>

            <Text
              style={{
                color: colors['white-smoke'],
                fontSize: SPACING * 1.7,
                marginBottom: SPACING,
              }}
            >
              Steps
            </Text>
            <View style={{ color: colors.white }}>
              {food?.food_step?.map((step, index) => (
                <View key={step.step_id}>
                  <Text style={{ color: 'white', fontWeight: 'bold' }}>
                    Step {index + 1}:
                  </Text>
                  <Text style={{ color: 'white' }}>
                    {step?.implementation_guide}
                  </Text>
                  <FlatList
                    data={step?.step_image}
                    keyExtractor={(item) => item.image_id}
                    horizontal
                    renderItem={({ item }) => (
                      <View key={item.image_id}>
                        <Image
                          source={{ uri: item.image }}
                          style={{
                            width: 80,
                            height: 80,
                            borderRadius: SPACING * 2,
                            marginRight: SPACING,
                            marginVertical: SPACING,
                          }}
                        />
                      </View>
                    )}
                  />
                </View>
              ))}
            </View>
            {sameCateData.length !== 0 ? (
              <View style={{ flexDirection: 'row', marginTop: SPACING }}>
                <Text
                  style={{
                    color: colors['white-smoke'],
                    fontSize: SPACING * 1.7,
                    marginBottom: SPACING,
                  }}
                >
                  Related foods
                </Text>
                <Ionicons
                  style={{
                    marginLeft: SPACING / 2,
                  }}
                  name="star"
                  color={colors.primary}
                  size={SPACING * 1.7}
                />
              </View>
            ) : (
              <Text>''</Text>
            )}

            <ScrollView horizontal>
              {sameCateData.map((orchid) => (
                <View
                  key={orchid.food_id}
                  style={{
                    width: width / 2 - SPACING * 2,
                    marginBottom: SPACING,
                    borderRadius: SPACING * 2,
                    overflow: 'hidden',
                    marginRight: SPACING,
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
                          foodId: orchid.food_id,
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
                        source={{ uri: orchid.food_image[0].image }}
                        style={{
                          width: '100%',
                          height: '100%',
                          borderRadius: SPACING * 2,
                        }}
                      />
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
                      {orchid.food_name}
                    </Text>
                    <Text
                      numberOfLines={1}
                      style={{
                        color: colors.secondary,
                        fontSize: SPACING * 1.2,
                      }}
                    >
                      {orchid.food_cate_detail.cate_detail_name}
                    </Text>
                  </BlurView>
                </View>
              ))}
            </ScrollView>
          </View>
        </SafeAreaView>
      </ScrollView>
      <SafeAreaView
        style={{ flexDirection: 'row', justifyContent: 'space-between' }}
      >
        <View
          style={{
            padding: SPACING,
            alignItems: 'center',
            justifyContent: 'center',
            paddingLeft: SPACING * 3,
          }}
        >
          <Text style={{ color: colors.white, fontSize: SPACING * 1.5 }}>
            Calories
          </Text>
          <View style={{ flexDirection: 'row' }}>
            <Text
              style={{
                color: colors.white,
                fontSize: SPACING * 2,
                marginLeft: SPACING / 2,
              }}
            >
              {food?.calories}
            </Text>
            <Text
              style={{
                color: colors.primary,
                fontSize: SPACING * 2,
                marginLeft: 2,
              }}
            >
              cal
            </Text>
          </View>
        </View>
        <View
          style={{
            marginRight: SPACING,
            backgroundColor: colors.primary,
            width: width / 2 + SPACING * 3,
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: SPACING * 2,
          }}
        >
          <Text
            style={{
              color: colors.white,
              fontSize: SPACING * 2,
              fontWeight: '700',
            }}
          >
            {getCategoryName(food?.food_cate_detail.cate_detail_id)}
          </Text>
        </View>
      </SafeAreaView>
    </>
  )
}

export default OrchidDetailsScreen

const styles = StyleSheet.create({})
