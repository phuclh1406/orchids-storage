import { Picker } from '@react-native-picker/picker'
import { useEffect, useState } from 'react'
import axiosInstance from '../../util/axiosWrapper'

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
      style={{ height: 50, width: 200, backgroundColor: 'white' }}
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
