import { useState } from 'react'
import {
  View,
  StyleSheet,
  Image,
  Button,
  TouchableOpacity,
  Text,
} from 'react-native'
import axiosInstance from '../../util/axiosWrapper'

import * as ImagePicker from 'expo-image-picker'
import colors from '../config/colors'
// import axios from 'axios'
// import { BASE_URL } from '../app/config'

// const defaultOptions = {
//   baseURL: BASE_URL,
//   headers: {
//     'Content-Type': 'application/json',
//   },
// }

function UploadImage() {
  // The path of the picked image
  const [pickedImagePath, setPickedImagePath] = useState('')

  // This function is triggered when the "Select an image" button pressed
  const showImagePicker = async () => {
    try {
      // Ask the user for the permission to access the media library
      const permissionResult =
        await ImagePicker.requestMediaLibraryPermissionsAsync()

      if (permissionResult.granted === false) {
        alert("You've refused to allow this appp to access your photos!")
        return
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [1, 1],
      })

      if (!result.cancelled) {
        setPickedImagePath(result.assets[0].uri)

        // Explore the result
        const formData = new FormData()
        console.log(formData)
        formData.append('files', {
          uri: result.assets[0].uri,
          name: result.assets[0].uri,
          type: 'image/jpg',
        })
        console.log(formData)
        const config = {
          headers: { 'content-type': 'multipart/form-data' },
        }
        // console.log(1)
        const res = await axiosInstance.post('/upload-image', formData, config)
        console.log(res?.data)
      }
    } catch (error) {
      // console.log(error?.message)
    }
  }

  // // This function is triggered when the "Open camera" button pressed
  // const openCamera = async () => {
  //   // Ask the user for the permission to access the camera
  //   const permissionResult = await ImagePicker.requestCameraPermissionsAsync()

  //   if (permissionResult.granted === false) {
  //     alert("You've refused to allow this appp to access your camera!")
  //     return
  //   }

  //   const result = await ImagePicker.launchCameraAsync()

  //   // Explore the result
  //   console.log(result)

  //   if (!result.cancelled) {
  //     setPickedImagePath(result.uri)
  //     console.log(result.uri)
  //   }
  // }

  return (
    <View>
      <TouchableOpacity
        style={{
          backgroundColor: colors.primary,
          height: 44,
          width: 130,
          borderRadius: 6,
          alignItems: 'center',
          justifyContent: 'center',
          marginVertical: 20,
          paddingLeft: 5,
          paddingRight: 5,
        }}
        onPress={showImagePicker}
      >
        <Text
          style={{
            size: 24,
            color: colors.white,
          }}
        >
          Select image
        </Text>
      </TouchableOpacity>

      <View style={styles.imageContainer}>
        {pickedImagePath !== '' && (
          <Image source={{ uri: pickedImagePath }} style={styles.image} />
        )}
      </View>
    </View>
  )
}

// Kindacode.com
// Just some styles
const styles = StyleSheet.create({
  buttonContainer: {
    fontSize: 20,
    fontWeight: 'bold',
    borderWidth: 1,
    backgroundColor: '#fa9737',
  },
  imageContainer: {
    padding: 30,
  },
  image: {
    width: 400,
    height: 300,
    resizeMode: 'cover',
  },
})

export default UploadImage
