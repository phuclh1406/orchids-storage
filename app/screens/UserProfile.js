import React, { useEffect, useState } from 'react'
import {
  View,
  Text,
  Image,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  FlatList,
  ScrollView,
  Dimensions,
} from 'react-native'
import colors from '../config/colors'
import { StatusBar } from 'expo-status-bar'
import { Ionicons } from '@expo/vector-icons'
import SPACING from '../config/SPACING'
import AsyncStorage from '@react-native-async-storage/async-storage'

const backgroundUser = require('../../assets/backgroundUser.jpg')

const UserProfile = ({ navigation }) => {
  const [dataUser, setDataUser] = useState()
  const getDataUser = async () => {
    const data = await AsyncStorage.getItem('userData')
    const userData = JSON.parse(data)
    setDataUser(userData)
  }

  useEffect(() => {
    getDataUser()
  }, [])

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: colors.white,
      }}
    >
      <View
        style={{
          marginTop: 30,
          marginHorizontal: 12,
          flexDirection: 'row',
          justifyContent: 'center',
        }}
      >
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{
            position: 'absolute',
            left: 0,
          }}
        >
          <Ionicons name="arrow-back" size={24} color={colors.dark} />
        </TouchableOpacity>
        <Text style={{ fontSize: SPACING * 2, color: colors.dark }}>
          User Profile
        </Text>
      </View>

      {/* <StatusBar backgroundColor={colors.grey} /> */}
      <View>
        <Image
          source={backgroundUser}
          resizeMode="cover"
          style={{
            height: 228,
            width: '100%',
            marginTop: 20,
          }}
        />
      </View>

      <View style={{ flex: 1, alignItems: 'center' }}>
        <Image
          resizeMode="contain"
          source={{ uri: dataUser?.user?.avatar }}
          style={{
            height: 155,
            width: 155,
            borderRadius: 999,
            borderColor: colors.dark,
            borderWidth: 2,
            marginTop: -90,
          }}
        />
        <Text
          style={{
            fontSize: 20,
            color: colors.dark,
            marginVertical: 8,
          }}
        >
          Name: {dataUser?.user?.user_name}
        </Text>
        <Text
          style={{
            color: colors.dark,
            fontSize: 20,
          }}
        >
          Phone: {dataUser?.user?.phone}
        </Text>
        <View
          style={{
            flexDirection: 'row',
            marginVertical: 6,
            alignItems: 'center',
          }}
        >
          <Ionicons name="location-outline" size={24} color={colors.dark} />
          <Text
            style={{
              size: 24,
              marginLeft: 4,
            }}
          >
            Adress:{dataUser?.user?.address}
          </Text>
        </View>

        <View style={{ flexDirection: 'row' }}>
          <TouchableOpacity
            onPress={() => navigation.navigate('EditProfile')}
            style={{
              width: 124,
              height: 36,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: colors.primary,
              borderRadius: 10,
              marginTop: 40,
              marginHorizontal: SPACING,
            }}
          >
            <Text
              style={{
                size: 24,
                color: colors.white,
              }}
            >
              Edit Profile
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  )
}

export default UserProfile
