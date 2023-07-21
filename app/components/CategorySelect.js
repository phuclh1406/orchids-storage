import { Picker } from '@react-native-picker/picker'
import { useEffect, useState } from 'react'
import axiosInstance from '../../util/axiosWrapper'
import colors from '../config/colors'
import { StyleSheet, View } from 'react-native'

const CategorySelect = ({ values, handleChange, handleBlur }) => {
  const [category, setCategory] = useState([])
  const getCategories = async () => {
    try {
      const res = await axiosInstance.get('categories_detail?cate_id=6e3f5b3b-df19-4776-a7cc-92b0a0a3ce1d')
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
    <View style={{ borderWidth: 1, borderColor: 'grey', borderRadius: 4 }}>
      <Picker
        // style={styles.input}
        style={{ height: 50, width: 360, color: 'black' }}
        selectedValue={values}
        onValueChange={handleChange}
        onBlur={handleBlur}
        placeholder="Select Category"
        itemStyle={{ backgroundColor: "grey", color: "blue", fontFamily: "Ebrima", fontSize: 17 }}
      >
        {category?.filter((item) => {
          return item.cate_detail_id !== "8b113e48-d1d6-4397-a0aa-743be2df2ad1"
        }).map((item) => (
          <Picker.Item
            key={item.cate_detail_id}
            label={item.cate_detail_name}
            value={item.cate_detail_id}

          />
        ))}
      </Picker>
    </View>
  )
}

export default CategorySelect
const styles = StyleSheet.create({
  // input: {
  //   height: 43,
  //   width: '90%',
  //   borderColor: colors.grey,
  //   borderWidth: 1,
  //   borderRadius: 4,
  //   marginVertical: 6,
  //   justifyContent: 'center',
  //   paddingLeft: 8,
  //   border: 1,
  //   borderStyle: 'solid',
  // },
  errorType: {
    fontStyle: 12,
    colors: 'red',
  },
})
