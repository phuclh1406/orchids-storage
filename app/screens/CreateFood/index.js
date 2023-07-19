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
  Image,
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
import UploadImageStep from './UploadImageStep'

const defaultValues = {
  food_name: '',
  description: '',
  quantitative: '3 người',
  price: 0,
  calories: 2,
  proteins: 3,
  fats: 0,
  carbohydrate: 2,
  fibers: 2,
  cate_detail_id: '',
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
  const [imageFood, setImageFood] = useState('')
  const [steps, setSteps] = useState([{ title: '', image: '' }])
  console.log(steps)
  const handleSubmit = async (values) => {
    try {
      const payload = {
        ...values,
        user_id: userInfo?.user?.user_id,
        ingredient_description: ingredientDescription.join(` ${'\n'}`),
        images: [
          {
            image: imageFood,
          },
        ],
      }
      const res = await axiosInstance.post(`/foods`, payload)
      if (res?.data?.food) {
        const payloadStep = {
          step: steps.map((item) => ({
            implementation_guide: item.title || 'Empty',
            images: [
              {
                image: item.image,
              },
            ],
            food_id: res?.data?.food?.food_id,
          })),
        }
        await axiosInstance.post(`/steps`, payloadStep)
      }
      console.log(res.data)
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
        {console.log(imageFood)}
        {/* <Image
          source={{
            uri:
              imageFood ||
              'https://cdn.britannica.com/05/88205-050-9EEA563C/Bigmouth-buffalo-fish.jpg',
          }}
          style={{
            height: 150,
            width: 150,
            borderRadius: 85,
            borderWidth: 2,
            borderColor: colors.dark,
          }}
        /> */}
        <View
          style={{ width: 160, flexDirection: 'row', justifyContent: 'center' }}
        >
          <UploadImage imageFood={imageFood} setImageFood={setImageFood} />
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
                value={values.price}
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
              <TextInput
                onChangeText={handleChange('price')}
                onBlur={handleBlur('price')}
                value={values.price}
                style={styles.input}
                placeholder="Giá"
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
                style={styles.button}
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
              <Text
                style={{
                  fontSize: 20,
                  color: colors.black,
                }}
              >
                Công thức:
              </Text>
              {steps?.map((item, index) => {
                return (
                  <View>
                    <View
                      style={{
                        width: '90%',
                        flexDirection: 'row',
                        marginVertical: 6,
                      }}
                    >
                      <TextInput
                        onChangeText={(value) => {
                          const newData = steps?.map((ite, i) => {
                            if (i === index) {
                              return { ...ite, title: value }
                            }
                            return ite
                          })
                          setSteps(newData)
                        }}
                        value={item}
                        style={styles.input}
                        placeholder={`Bước ${index + 1}`}
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
                            const newData = steps.filter(
                              (ite, i) => i !== index
                            )
                            setSteps(newData)
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
                    <UploadImageStep
                      steps={steps}
                      setSteps={setSteps}
                      index={index}
                    />
                  </View>
                )
              })}
              <TouchableOpacity
                style={styles.button}
                onPress={() => setSteps([...steps, { image: '', title: '' }])}
              >
                <Text
                  style={{
                    size: 24,
                    color: colors.white,
                  }}
                >
                  Thêm Bước
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
  button: {
    backgroundColor: colors.primary,
    height: 44,
    width: 130,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20,
    paddingLeft: 5,
    paddingRight: 5,
  },
})
