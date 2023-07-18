import { SafeAreaView } from 'react-native-safe-area-context'
import colors from '../../config/colors'
import {
  Text,
  TextInput,
  StyleSheet,
  View,
  Button,
  TouchableOpacity,
  ScrollView,
} from 'react-native'
import SPACING from '../../config/SPACING'
import { Picker } from '@react-native-picker/picker'
import { Formik, validateYupSchema } from 'formik'
import { PickerIOS } from '@react-native-picker/picker'
import UploadImage from '../../components/UploadImage'
import CategorySelect from '../../components/CategorySelect'
import { useContext, useState } from 'react'
import { AuthContext } from '../../context/AuthContext'
import axiosInstance from '../../../util/axiosWrapper'
import { Ionicons } from '@expo/vector-icons'
import * as Yup from 'yup'

const defaultValues = {
  food_name: '',
  description: '',
  quantitative: '3 người',
  price: 3,
  calories: 2,
  proteins: 3,
  fats: 0,
  carbohydrate: 2,
  fibers: 2,
  cate_detail_id: '',
  ingredient_description: 'sfas',
  images: [
    {
      image:
        'https://cdn.britannica.com/05/88205-050-9EEA563C/Bigmouth-buffalo-fish.jpg',
    },
  ],
}
const QUANTITATIVE_OPTIONS = [
  '2 người',
  '3 người',
  '4 người',
  '5 người',
  '7 người',
]
const validate = Yup.object().shape({
  food_name: Yup.string().required('Required field title food'),
})
const CreateFood = ({ navigation }) => {
  const { userInfo } = useContext(AuthContext)
  const [ingredientDescription, setIngredientDescription] = useState([''])
  const handleSubmit = async (values) => {
    try {
      const payload = { ...values, user_id: userInfo?.user?.user_id }
      const res = await axiosInstance.post(`/foods`, payload)
      if (res?.data?.food) {
        const payloadStep = {
          step: [1, 2].map((item) => ({
            implementation_guide: item,
            images: [
              {
                image:
                  'https://cdn.britannica.com/05/88205-050-9EEA563C/Bigmouth-buffalo-fish.jpg',
              },
              {
                image:
                  'https://cdn.britannica.com/05/88205-050-9EEA563C/Bigmouth-buffalo-fish.jpg',
              },
            ],
            food_id: res?.data?.food?.food_id,
          })),
        }
        await axiosInstance.post(`/steps`, payloadStep)
      }
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <SafeAreaView style={{ backgroundColor: colors.white, flex: 1 }}>
      <View
        style={{
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
          Create Foods
        </Text>
      </View>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
        }}
      >
        <View
          style={{ width: 160, flexDirection: 'row', justifyContent: 'center' }}
        >
          <UploadImage />
        </View>
      </View>
      <Formik
        initialValues={defaultValues}
        onSubmit={handleSubmit}
        validationSchema={validate}
      >
        {({ handleChange, handleBlur, handleSubmit, values }) => (
          <ScrollView>
            <View
              style={{
                alignItems: 'center',
                marginVertical: 22,
              }}
            >
              <TextInput
                onChangeText={handleChange('food_name')}
                onBlur={handleBlur('food_name')}
                value={values.food_name}
                style={styles.input}
                placeholder="Tên món ăn"
              />
              {/* {errors?.food_name && (
                <Text style={styles.errorType}>{errors?.food_name}</Text>
              )} */}

              <TextInput
                onChangeText={handleChange('description')}
                onBlur={handleBlur('description')}
                value={values.description}
                style={styles.input}
                placeholder="Mô tả chi tiết"
              />

              {/* <UploadImage /> */}

              <Picker
                style={styles.input}
                selectedValue={values?.quantitative}
                onValueChange={handleChange('quantitative')}
                onBlur={handleBlur('quantitative')}
              >
                {QUANTITATIVE_OPTIONS?.map((value) => (
                  <Picker.Item label={value} value={value} />
                ))}
              </Picker>
              <CategorySelect
                values={values?.cate_detail_id}
                handleChange={handleChange('cate_detail_id')}
                handleBlur={handleBlur('cate_detail_id')}
              />
              {ingredientDescription?.map((item, index) => (
                <View
                  style={{
                    width: '90%',
                    flexDirection: 'row',
                    marginVertical: 6,
                  }}
                >
                  <TextInput
                    onChangeText={(value) => {
                      const newData = ingredientDescription?.map((ite, i) => {
                        if (i === index) {
                          return value
                        }
                        return ite
                      })
                      setIngredientDescription(newData)
                    }}
                    value={item}
                    style={styles.input}
                    placeholder={`Nguyên liệu ${index + 1}`}
                  />
                  {index !== 0 && (
                    <TouchableOpacity
                      style={{
                        backgroundColor: colors.primary,
                        height: 44,
                        width: 50,
                        borderRadius: 6,
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginVertical: 5,
                        marginLeft: 1,
                        paddingLeft: 5,
                        paddingRight: 5,
                      }}
                      onPress={() => {
                        const newData = ingredientDescription.filter(
                          (ite, i) => i !== index
                        )
                        setIngredientDescription(newData)
                      }}
                    >
                      <Text
                        style={{
                          size: 24,
                          color: colors.white,
                        }}
                      >
                        Xóa
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>
              ))}
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
                onPress={() =>
                  setIngredientDescription([...ingredientDescription, ''])
                }
              >
                <Text
                  style={{
                    size: 24,
                    color: colors.white,
                  }}
                >
                  Thêm nguyên liệu
                </Text>
              </TouchableOpacity>

              <Button onPress={handleSubmit} title="Submit" />
            </View>
          </ScrollView>
        )}
      </Formik>
    </SafeAreaView>
  )
}

export default CreateFood
const styles = StyleSheet.create({
  input: {
    height: 43,
    width: '90%',
    borderColor: colors.grey,
    borderWidth: 1,
    borderRadius: 4,
    marginVertical: 6,
    justifyContent: 'center',
    paddingLeft: 8,
  },
  errorType: {
    fontStyle: 12,
    colors: 'red',
  },
})

{
  /* <SafeAreaView style={{
  flex: 1,
  backgroundColor: colors.white
}}>
  <View style={{
      marginHorizontal: 12,
      flexDirection: 'row',
      justifyContent: 'center'
  }}>
      <TouchableOpacity
      onPress={() => navigation.goBack()}
      style={{
          position: "absolute",
          left: 0
      }}
      >
          <Ionicons 
          name="arrow-back"
          size={24}
          color={colors.dark}
          />
      </TouchableOpacity>
      <Text style={{fontSize:SPACING * 2, color: colors.dark}}>Edit Profile</Text>
  </View>

  <ScrollView>
      <View style={{
          alignItems: "center",
          marginVertical: 22,

      }}>
          <TouchableOpacity
          >
              <Image source={{uri: dataUser?.user?.avatar}}
              style={{
                  height: 150,
                  width: 150,
                  borderRadius: 85,
                  borderWidth: 2,
                  borderColor: colors.dark
              }}/>

              <View
              style={{
                  position: "absolute",
                  bottom: 0,
                  right: 10,
                  zIndex: 9999
              }}>
                  <Ionicons
                  name='camera'
                  size={32}
                  color={colors.dark}/>
              </View>
          </TouchableOpacity>
      </View>
      <View>
          <View style={{
              flexDirection: 'column',
              marginBottom: 6,
              marginLeft: 30
          }}>
              <Text style={{fontSize: SPACING * 1.5}}>Name</Text>
              <View style={{
                  height: 43,
                  width: "90%",
                  borderColor: colors.grey,
                  borderWidth: 1,
                  borderRadius: 4,
                  marginVertical: 6,
                  justifyContent: 'center',
                  paddingLeft: 8,
              }}>
                  <TextInput
                      value={dataUser?.user?.user_name}
                      onChangeText={text => {
                          setDataUser(prevData => ({
                          ...prevData,
                          user: { ...prevData.user, user_name: text }
                          }));
                      }}
                      />
              </View>
          </View>

          <View style={{
               flexDirection: 'column',
               marginBottom: 6,
               marginLeft: 30
          }}>
              <Text style={{fontSize: SPACING * 1.5}}>Email</Text>
              <View style={{
                  height: 44,
                  width: "90%",
                  borderColor: colors.grey,
                  borderWidth: 1,
                  borderRadius: 4,
                  marginVertical: 6,
                  justifyContent: 'center',
                  paddingLeft: 8,
              }}>
                  <TextInput
                  value={dataUser?.user?.email}
                  onChangeText={text => {
                      setDataUser(prevData => ({
                      ...prevData,
                      user: { ...prevData.user, email: text }
                      }));
                  }}
                  />
              </View>
          </View>

          <View style={{
               flexDirection: 'column',
               marginBottom: 6,
               marginLeft: 30
          }}>
              <Text style={{fontSize: SPACING * 1.5}}>Date of Birth</Text>
              <View style={{
                  height: 44,
                  width: "90%",
                  borderColor: colors.grey,
                  borderWidth: 1,
                  borderRadius: 4,
                  marginVertical: 6,
                  justifyContent: 'center',
                  paddingLeft: 8,
              }}>
                  <TextInput
                  value={dataUser?.user?.birthday}
                  onChangeText={text => {
                      setDataUser(prevData => ({
                      ...prevData,
                      user: { ...prevData.user, birthday: text }
                      }));
                  }}
                 />
              </View>
          </View>

          <View style={{
               flexDirection: 'column',
               marginBottom: 6,
               marginLeft: 30
          }}>
              <Text style={{fontSize: SPACING * 1.5}}>Phone Number</Text>
              <View style={{
                  height: 44,
                  width: "90%",
                  borderColor: colors.grey,
                  borderWidth: 1,
                  borderRadius: 4,
                  marginVertical: 6,
                  justifyContent: 'center',
                  paddingLeft: 8,
              }}>
                  <TextInput
                  value={dataUser?.user?.phone}
                  onChangeText={text => {
                      setDataUser(prevData => ({
                      ...prevData,
                      user: { ...prevData.user, phone: text }
                      }));
                  }}
                  />
              </View>
          </View>

          <View style={{
               flexDirection: 'column',
               marginBottom: 6,
               marginLeft: 30
          }}>
              <Text style={{fontSize: SPACING * 1.5}}>Adress</Text>
              <View style={{
                  height: 44,
                  width: "90%",
                  borderColor: colors.grey,
                  borderWidth: 1,
                  borderRadius: 4,
                  marginVertical: 6,
                  justifyContent: 'center',
                  paddingLeft: 8,
              }}>
                  <TextInput
                  value={dataUser?.user?.address}
                  onChangeText={text => {
                      setDataUser(prevData => ({
                      ...prevData,
                      user: { ...prevData.user, address: text }
                      }));
                  }}
                  />
              </View>
          </View>

          <TouchableOpacity style={{
              backgroundColor: colors.primary,
              height: 44,
              width: "80%",
              borderRadius: 6,
              alignItems: 'center',
              justifyContent: 'center',
              marginLeft: 30,
              marginVertical: 20
          }}
          onPress={handleSaveChanges}>
              <Text style={{
                  size: 24,
                  color: colors.white
              }}
              >Save Changes
              </Text>
          </TouchableOpacity>
      </View>
  </ScrollView>
</SafeAreaView> */
}
