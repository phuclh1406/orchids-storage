import React from 'react'
import { View, Text, SafeAreaView, TouchableOpacity } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import SPACING from '../config/SPACING'
import colors from '../config/colors'

const Setting = ({ navigation }) => {
  const navigateToUserProfile = () => {
    navigation.navigate('UserProfile')
  }

  const navigateToEditProfile = () => {
    navigation.navigate('EditProfile')
  }
  const navigateToCreateFood = () => {
    navigation.navigate('CreateFoodScreen')
  }

  const accountItems = [
    {
      icon: 'person-outline',
      text: 'User Profile',
      action: () => navigateToUserProfile(),
    },
    {
      icon: 'md-pencil',
      text: 'Edit Profile',
      action: () => navigateToEditProfile(),
    },
    {
      icon: 'md-pencil',
      text: 'Create Food',
      action: () => navigateToCreateFood(),
    },
  ]

  const renderSettingsItems = ({ icon, text, action }) => {
    return (
      <TouchableOpacity
        onPress={action}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingVertical: 8,
          paddingLeft: 12,
        }}
      >
        <Ionicons name={icon} size={24} color={colors.white} />
        <Text
          style={{
            marginLeft: 36,
            fontStyle: 'bold',
            fontSize: 16,
            color: colors.white,
          }}
        >
          {text}
        </Text>
      </TouchableOpacity>
    )
  }

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: colors.dark,
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
          <Ionicons name="arrow-back" size={24} color={colors.white} />
        </TouchableOpacity>
        <Text style={{ fontSize: SPACING * 2, color: colors.white }}>
          Settings Screen
        </Text>
      </View>

      <View style={{ marginBottom: 12, marginLeft: 10 }}>
        <Text
          style={{
            fontSize: SPACING * 1.5,
            marginVertical: 12,
            color: colors.white,
          }}
        >
          Account
        </Text>
        <View
          style={{
            borderRadius: 12,
            backgroundColor: colors.black,
          }}
        >
          {accountItems.map((item, index) => (
            <React.Fragment key={index}>
              {renderSettingsItems(item)}
            </React.Fragment>
          ))}
        </View>
      </View>
    </SafeAreaView>
  )
}

export default Setting
