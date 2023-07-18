import React, { useContext, useEffect, useState } from 'react'
import { View, Text, Image, SafeAreaView, TouchableOpacity, TextInput, FlatList, ScrollView, Dimensions } from "react-native";
import { Ionicons } from '@expo/vector-icons'
import SPACING from '../config/SPACING'
import colors from '../config/colors'
import { AuthContext } from '../context/AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';


const Setting = ({navigation}) => {
    const { userInfo, isLoading } = useContext(AuthContext)
    

    const navigateToUserProfile = () => {
        navigation.navigate("UserProfile")

    }

    const navigateToEditProfile =() => {
        navigation.navigate("EditProfile")
    }

    const accountItems = [
        {
            icon: "person-outline",
            text: "User Profile",
            action: () => navigateToUserProfile()
          },
          {
            icon: "person-outline",
            text: "Edit Profile",
            action: () => navigateToEditProfile()
          }
    ]
    
    const renderSettingsItems = ({icon, text, action}) =>{
        return (
        <TouchableOpacity 
        onPress={action}
        style={{
            flexDirection: "row",
            alignItems: "center",
            paddingVertical: 8,
            paddingLeft: 12,
        }}>
            <Ionicons name={icon} size={24} color={colors.white}/>
            <Text style={{
                marginLeft:36,
                fontStyle: "bold",
                fontSize: 16,
                color: colors.white
            }}>{text}</Text>
        </TouchableOpacity>
        );
    }

  return (
    <SafeAreaView style={{
        flex: 1,
        backgroundColor: colors.dark
    }}>
        <View style={{
            marginHorizontal: 12,
            flexDirection: "row",
            justifyContent: "center"
        }}>
            <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={{
                position: "absolute",
                left: 0
            }}>
                <Ionicons 
                name='arrow-back'
                size={24}
                color={colors.white}
                />
            </TouchableOpacity>
            <Text style={{fontSize:SPACING * 2, color: colors.white}}>Settings Screen</Text>
        </View>
        
        <View style={{marginBottom: 12}}>
                <Text style={{fontSize: SPACING * 1.5, marginVertical: 12, color: colors.white}}>Account</Text>
                <View style={{
                    borderRadius: 12,
                    backgroundColor: colors.black
                }}>
                    {accountItems.map((item, index) => (
                        <React.Fragment key={index}>
                            {renderSettingsItems(item)}
                        </React.Fragment>
                    ))
                    }
                </View>
            </View>
    </SafeAreaView>
  )
}

export default Setting