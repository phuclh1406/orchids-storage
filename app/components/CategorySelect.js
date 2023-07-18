import { Picker } from '@react-native-picker/picker'
import { useEffect, useState } from 'react'
import axiosInstance from '../../util/axiosWrapper'
import colors from '../config/colors'
import { StyleSheet } from 'react-native'

const CategorySelect = ({ values, handleChange, handleBlur }) => {
  const [category, setCategory] = useState([])
  const getCategories = async () => {
    try {
      const res = await axiosInstance.get('categories_detail')
      console.log(res)
      setCategory(res?.data?.categories_detail?.rows)
    } catch (error) {
      console.log(error.message)
    }
  }
  useEffect(() => {
    getCategories()
  }, [])
  return (
    <Picker
      style={styles.input}
      selectedValue={values}
      onValueChange={handleChange}
      onBlur={handleBlur}
      placeholder="Select Category"
    >
      {category?.map((item) => (
        <Picker.Item
          key={item.cate_detail_id}
          label={item.cate_detail_name}
          value={item.cate_detail_id}
        />
      ))}
    </Picker>
  )
}

export default CategorySelect
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
    border: 1,
    borderStyle: 'solid',
  },
  errorType: {
    fontStyle: 12,
    colors: 'red',
  },
})
