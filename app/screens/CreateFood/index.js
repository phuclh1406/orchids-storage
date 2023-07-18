import { SafeAreaView } from 'react-native-safe-area-context'
import colors from '../../config/colors'
import { Text, TextInput, StyleSheet, View, Button } from 'react-native'
import { Picker } from '@react-native-picker/picker'
import { Formik, validateYupSchema } from 'formik'
import { PickerIOS } from '@react-native-picker/picker'
import UploadImage from '../../components/UploadImage'
import CategorySelect from '../../components/CategorySelect'
import { useContext } from 'react'
import { AuthContext } from '../../context/AuthContext'
import axiosInstance from '../../../util/axiosWrapper'
import * as Yup from 'yup'

const defaultValues = {
  food_name: '',
  description: 'Siêu Ngon',
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
const CreateFood = () => {
  const { userInfo } = useContext(AuthContext)
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
    <SafeAreaView style={{ backgroundColor: colors.dark, flex: 1 }}>
      <Formik
        initialValues={defaultValues}
        onSubmit={handleSubmit}
        validationSchema={validate}
      >
        {({ handleChange, handleBlur, handleSubmit, values, errors }) => (
          <View>
            {console.log(errors)}
            <View>
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
            </View>
            <TextInput
              onChangeText={handleChange('email')}
              onBlur={handleBlur('email')}
              value={values.email}
              style={styles.input}
              placeholder="Mô tả chi tiết"
            />

            {/* <UploadImage /> */}

            <Picker
              style={{ height: 50, width: 200, backgroundColor: 'white' }}
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

            <UploadImage />
            <Button onPress={handleSubmit} title="Submit" />
          </View>
        )}
      </Formik>
    </SafeAreaView>
  )
}

export default CreateFood
const styles = StyleSheet.create({
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    backgroundColor: 'white',
  },
  errorType: {
    fontStyle: 12,
    colors: 'red',
  },
})
