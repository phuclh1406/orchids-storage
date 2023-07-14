import {
  Dimensions,
  ImageBackground,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import React, { useState, useEffect } from 'react'
import { useNavigation } from '@react-navigation/native'
import { Ionicons } from '@expo/vector-icons'
import colors from '../config/colors'
import SPACING from '../config/SPACING'
import orchids from '../config/orchids'
import { BlurView } from 'expo-blur'
import AsyncStorage from '@react-native-async-storage/async-storage'
const { height, width } = Dimensions.get('window')
import categories from '../config/categories'

const sizes = ['S', 'M', 'L']

const OrchidDetailsScreen = ({ route }) => {
  const navigation = useNavigation()
  const { orchidId } = route.params
  const orchid = orchids.find((orchid) => orchid.id === orchidId)
  const [activeSize, setActiveSize] = useState(null)
  const [dataFav, setDataFav] = useState([])
  useEffect(() => {
    getFromStorage()
  }, [])
  //Get data from storage
  const getFromStorage = async () => {
    const data = await AsyncStorage.getItem('favorite')
    setDataFav(data != null ? JSON.parse(data) : [])
  }
  //Set data from storage
  const setDataToStorage = async () => {
    let list
    if (dataFav == []) {
      list = [orchid]
      await AsyncStorage.setItem('favorite', JSON.stringify(list))
    } else {
      list = [...dataFav, orchid]
      await AsyncStorage.setItem('favorite', JSON.stringify(list))
    }
    setDataFav(list)
  }
  //Remove data from storage
  const removeDataFromStorage = async () => {
    const list = dataFav.filter((item) => item.id !== orchid.id)
    await AsyncStorage.setItem('favorite', JSON.stringify(list))
    setDataFav(list)
  }

  const getCategoryName = (categoryId) => {
    const category = categories.find((category) => category.id === categoryId)
    return category ? category.name : ''
  }
  return (
    <>
      <ScrollView>
        <SafeAreaView>
          <ImageBackground
            source={orchid.image}
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
                  const check = dataFav.find((item) => item.id === orchid.id)
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
                {dataFav.find((item) => item.id === orchid.id) ? (
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
                      fontSize: SPACING * 2,
                      color: colors.white,
                      fontWeight: '600',
                      marginBottom: SPACING,
                    }}
                  >
                    {orchid.name}
                  </Text>
                </View>
                <View style={{ flexDirection: 'row', marginTop: SPACING }}>
                  <Ionicons
                    name="star"
                    size={SPACING * 1.5}
                    color={colors.primary}
                  />
                  <Text
                    style={{
                      color: colors.white,
                      marginLeft: SPACING,
                    }}
                  >
                    {orchid.rating}
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
              {orchid.description}
            </Text>
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
            Price
          </Text>
          <View style={{ flexDirection: 'row' }}>
            <Text style={{ color: colors.primary, fontSize: SPACING * 2 }}>
              $
            </Text>
            <Text
              style={{
                color: colors.white,
                fontSize: SPACING * 2,
                marginLeft: SPACING / 2,
              }}
            >
              {orchid.price}
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
            {getCategoryName(orchid.categoryId)}
          </Text>
        </View>
      </SafeAreaView>
    </>
  )
}

export default OrchidDetailsScreen

const styles = StyleSheet.create({})
