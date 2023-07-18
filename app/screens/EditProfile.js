import React, { useState, useEffect } from 'react'
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
import { Ionicons } from '@expo/vector-icons'
import SPACING from '../config/SPACING'
import colors from '../config/colors'
import AsyncStorage from '@react-native-async-storage/async-storage'
import axiosInstance from '../../util/axiosWrapper'

const EditProfile = ({ navigation }) => {
  const [dataUser, setDataUser] = useState()
  const getDataUser = async () => {
    const data = await AsyncStorage.getItem('userData')
    const userData = JSON.parse(data)
    setDataUser(userData)
  }

  const handleSaveChanges = async () => {
    try {
      const response = await axiosInstance.put('/users/profile', {
        user_id: dataUser?.user?.user_id,
        user_name: dataUser?.user?.user_name,
        avatar: dataUser?.user?.avatar,
        birthday: dataUser?.user?.birthday,
        phone: dataUser?.user?.phone,
        address: dataUser?.user?.address,
      })

      console.log(response?.data)
    } catch (error) {
      console.log(error)
    }
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
          marginHorizontal: 12,
          flexDirection: 'row',
          justifyContent: 'center',
          marginTop: 30,
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
          Edit Profile
        </Text>
      </View>

      <ScrollView>
        <View
          style={{
            alignItems: 'center',
            marginVertical: 22,
          }}
        >
          <TouchableOpacity>
            <Image
              source={{ uri: dataUser?.user?.avatar }}
              style={{
                height: 150,
                width: 150,
                borderRadius: 85,
                borderWidth: 2,
                borderColor: colors.dark,
              }}
            />

            <View
              style={{
                position: 'absolute',
                bottom: 0,
                right: 10,
                zIndex: 9999,
              }}
            >
              <Ionicons name="camera" size={32} color={colors.dark} />
            </View>
          </TouchableOpacity>
        </View>
        <View>
          <View
            style={{
              flexDirection: 'column',
              marginBottom: 6,
              marginLeft: 30,
            }}
          >
            <Text style={{ fontSize: SPACING * 1.5 }}>Name</Text>
            <View
              style={{
                height: 43,
                width: '90%',
                borderColor: colors.grey,
                borderWidth: 1,
                borderRadius: 4,
                marginVertical: 6,
                justifyContent: 'center',
                paddingLeft: 8,
              }}
            >
              <TextInput
                value={dataUser?.user?.user_name}
                onChangeText={(text) => {
                  setDataUser((prevData) => ({
                    ...prevData,
                    user: { ...prevData.user, user_name: text },
                  }))
                }}
              />
            </View>
          </View>

          <View
            style={{
              flexDirection: 'column',
              marginBottom: 6,
              marginLeft: 30,
            }}
          >
            <Text style={{ fontSize: SPACING * 1.5 }}>Email</Text>
            <View
              style={{
                height: 44,
                width: '90%',
                borderColor: colors.grey,
                borderWidth: 1,
                borderRadius: 4,
                marginVertical: 6,
                justifyContent: 'center',
                paddingLeft: 8,
              }}
            >
              <TextInput
                value={dataUser?.user?.email}
                onChangeText={(text) => {
                  setDataUser((prevData) => ({
                    ...prevData,
                    user: { ...prevData.user, email: text },
                  }))
                }}
              />
            </View>
          </View>

          <View
            style={{
              flexDirection: 'column',
              marginBottom: 6,
              marginLeft: 30,
            }}
          >
            <Text style={{ fontSize: SPACING * 1.5 }}>Date of Birth</Text>
            <View
              style={{
                height: 44,
                width: '90%',
                borderColor: colors.grey,
                borderWidth: 1,
                borderRadius: 4,
                marginVertical: 6,
                justifyContent: 'center',
                paddingLeft: 8,
              }}
            >
              <TextInput
                value={dataUser?.user?.birthday}
                onChangeText={(text) => {
                  setDataUser((prevData) => ({
                    ...prevData,
                    user: { ...prevData.user, birthday: text },
                  }))
                }}
              />
            </View>
          </View>

          <View
            style={{
              flexDirection: 'column',
              marginBottom: 6,
              marginLeft: 30,
            }}
          >
            <Text style={{ fontSize: SPACING * 1.5 }}>Phone Number</Text>
            <View
              style={{
                height: 44,
                width: '90%',
                borderColor: colors.grey,
                borderWidth: 1,
                borderRadius: 4,
                marginVertical: 6,
                justifyContent: 'center',
                paddingLeft: 8,
              }}
            >
              <TextInput
                value={dataUser?.user?.phone}
                onChangeText={(text) => {
                  setDataUser((prevData) => ({
                    ...prevData,
                    user: { ...prevData.user, phone: text },
                  }))
                }}
              />
            </View>
          </View>

          <View
            style={{
              flexDirection: 'column',
              marginBottom: 6,
              marginLeft: 30,
            }}
          >
            <Text style={{ fontSize: SPACING * 1.5 }}>Adress</Text>
            <View
              style={{
                height: 44,
                width: '90%',
                borderColor: colors.grey,
                borderWidth: 1,
                borderRadius: 4,
                marginVertical: 6,
                justifyContent: 'center',
                paddingLeft: 8,
              }}
            >
              <TextInput
                value={dataUser?.user?.address}
                onChangeText={(text) => {
                  setDataUser((prevData) => ({
                    ...prevData,
                    user: { ...prevData.user, address: text },
                  }))
                }}
              />
            </View>
          </View>

          <TouchableOpacity
            style={{
              backgroundColor: colors.primary,
              height: 44,
              width: '80%',
              borderRadius: 6,
              alignItems: 'center',
              justifyContent: 'center',
              marginLeft: 30,
              marginVertical: 20,
            }}
            onPress={handleSaveChanges}
          >
            <Text
              style={{
                size: 24,
                color: colors.white,
              }}
            >
              Save Changes
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default EditProfile
