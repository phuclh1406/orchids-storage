import {
  Dimensions,
  ImageBackground,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  Image,
  View,
} from 'react-native'
import React, { useState, useEffect } from 'react'
import { useNavigation } from '@react-navigation/native'
import { Ionicons } from '@expo/vector-icons'
import colors from '../config/colors'
import SPACING from '../config/SPACING'
import { BlurView } from 'expo-blur'
import AsyncStorage from '@react-native-async-storage/async-storage'
const { height, width } = Dimensions.get('window')
import categories from '../config/categories'
import axiosInstance from '../../util/axiosWrapper'

const IngredientDetailScreen = ({ route }) => {
  const [ingreData, setIngreData] = useState()
  const [sameCateData, setSameCateData] = useState([])
  const navigation = useNavigation()
  const { ingredientId } = route.params
  console.log(ingredientId)
  const [activeSize, setActiveSize] = useState(null)
  const [dataFav, setDataFav] = useState([])
  const sameCateId = ingreData?.ingredient_cate_detail.cate_detail_id

  //Get data from storage
  const getFromStorage = async () => {
    const data = await AsyncStorage.getItem('shoppingList')
    setDataFav(data != null ? JSON.parse(data) : [])
  }
  //Set data from storage
  const setDataToStorage = async () => {
    let list
    if (dataFav == []) {
      list = [ingreData]
      await AsyncStorage.setItem('shoppingList', JSON.stringify(list))
    } else {
      list = [...dataFav, ingreData]
      await AsyncStorage.setItem('shoppingList', JSON.stringify(list))
    }
    setDataFav(list)
  }
  //Remove data from storage
  const removeDataFromStorage = async () => {
    const list = dataFav.filter(
      (item) => item.ingredient_id !== ingreData?.ingredient_id
    )
    await AsyncStorage.setItem('shoppingList', JSON.stringify(list))
    setDataFav(list)
  }

  const getSameCategoryIngredients = async (sameCateId) => {
    try {
      const res = await axiosInstance.get(
        `/ingredients?cate_detail_id=${sameCateId}`
      )
      console.log(res?.data.ingredients)
      setSameCateData(
        res?.data?.ingredients?.filter(
          (item) => item?.ingredient_id !== ingredientId
        )
      )
    } catch (error) {
      console.log(error)
    }
  }

  const getIngreData = async (ingredientId) => {
    try {
      const res = await axiosInstance.get(`/ingredients/${ingredientId}`)
      console.log(res?.data)
      console.log(1)
      setIngreData(res.data.ingredient)
    } catch (error) {
      console.log(error)
    }
  }


  useEffect(() => {
    if (ingredientId) {
      getIngreData(ingredientId),
        getFromStorage(),
        getSameCategoryIngredients(sameCateId)
    }
  }, [ingredientId, sameCateId])
  return (
    <>
      <ScrollView>
        <SafeAreaView>
          <ImageBackground
            source={{ uri: ingreData?.ingredient_image.image }}
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
                paddingTop: SPACING * 3,
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
                  const check = dataFav.find((item) => item.ingredient_id === ingreData?.ingredient_id)
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
                {dataFav.find(
                  (item) => item.ingredient_id === ingreData?.ingredient_id
                ) ? (
                  <Ionicons
                    name="cart"
                    size={SPACING * 2.5}
                    color={colors.primary}
                  />
                ) : (
                  <Ionicons
                    name="add"
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
                      fontSize: SPACING * 2,
                      color: colors.white,
                      fontWeight: '600',
                      marginBottom: SPACING,
                    }}
                  >
                    {ingreData?.ingredient_name}
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
              {ingreData?.description}
            </Text>
            <View style={{ flexDirection: 'row', marginTop: SPACING }}>
              <Text
                style={{
                  color: colors['white-smoke'],
                  fontSize: SPACING * 1.7,
                  marginBottom: SPACING,
                }}
              >
                Category:
              </Text>
              <Text
                numberOfLines={10}
                style={{
                  color: colors.white,
                  fontSize: SPACING * 1.7,
                  marginLeft: SPACING / 2,
                }}
              >
                {ingreData?.ingredient_cate_detail.cate_detail_name}
              </Text>
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
                  Related ingredients
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
                  key={orchid.ingredient_id}
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
                      <TouchableOpacity
                        onPress={() => {
                          const check = dataFav.find(
                            (item) => item.id === orchid.id
                          )
                          console.log(orchid.id)
                          console.log('Check:', check)
                          if (check) {
                            removeDataFromStorage(orchid.id)
                          } else {
                            setDataToStorage(orchid)
                          }
                        }}
                      ></TouchableOpacity>
                    </View>
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
            Quantitative
          </Text>
          <View style={{ flexDirection: 'row' }}>
            <Text style={{ color: colors.primary, fontSize: SPACING * 2 }}>
              /
            </Text>
            <Text
              style={{
                color: colors.white,
                fontSize: SPACING * 2,
                marginLeft: SPACING / 2,
              }}
            >
              {ingreData?.quantitative}
            </Text>
          </View>
        </View>
        <TouchableOpacity
          onPress={() => {
            setDataToStorage()
            navigation.navigate('ShoppingList')
          }}
          style={{
            backgroundColor: colors.dark,
            padding: SPACING,
            borderRadius: SPACING * 1.5,
          }}
        >
          <View
            style={{
              marginRight: SPACING,
              backgroundColor: colors.primary,
              width: width / 2 + SPACING * 3,
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: SPACING * 2,
              height: SPACING * 6,
            }}
          >
            <Text
              style={{
                color: colors.white,
                fontSize: SPACING * 2,
                fontWeight: '700',
              }}
            >
              Buy now
            </Text>
          </View>
        </TouchableOpacity>
      </SafeAreaView>
    </>
  )
}

export default IngredientDetailScreen

const styles = StyleSheet.create({})
