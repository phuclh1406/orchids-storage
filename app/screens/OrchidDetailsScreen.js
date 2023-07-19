import {
  Alert,
  Button,
  Dimensions,
  FlatList,
  Image,
  ImageBackground,
  Modal,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import React, { useState, useEffect } from 'react'
import {
  useNavigation,
  useFocusEffect,
  useIsFocused,
} from '@react-navigation/native'
import { Ionicons } from '@expo/vector-icons'
import colors from '../config/colors'
import SPACING from '../config/SPACING'
import { BlurView } from 'expo-blur'
import AsyncStorage from '@react-native-async-storage/async-storage'
import moment from 'moment'
import axiosInstance from '../../util/axiosWrapper'
const { height, width } = Dimensions.get('window')
import DateTimePicker from '@react-native-community/datetimepicker';

const sizes = ['S', 'M', 'L']

const OrchidDetailsScreen = ({ route }) => {
  const navigation = useNavigation()
  const { foodData, categoryData, foodId } = route.params
  const food = foodData.find((food) => food.food_id === foodId)
  const [dataFav, setDataFav] = useState([])
  const [isModalVisible, setModalVisible] = useState(false);
  const [scheduleSangData, setScheduleSangData] = useState([]);
  const [scheduleTruaData, setScheduleTruaData] = useState([]);
  const [scheduleToiData, setScheduleToiData] = useState([]);
  const [date, setDate] = useState(new Date());
  const [dateSchedule, setDateSchedule] = useState(moment().startOf('day'));
  const [showDatePicker, setShowDatePicker] = useState(false);

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  useEffect(() => {
    getFromStorage()
  }, [])
  //Get data from storage
  const getFromStorage = async () => {
    const data = await AsyncStorage.getItem('favorite')
    setDataFav(data != null ? JSON.parse(data) : [])
  }

  //Set data from storage
  const setDataToStorage = async () => {
    let list
    if (dataFav == []) {
      list = [food]
      await AsyncStorage.setItem('favorite', JSON.stringify(list))
    } else {
      list = [...dataFav, food]
      await AsyncStorage.setItem('favorite', JSON.stringify(list))
    }
    setDataFav(list)
  }

  //Set data from schedule
  const setDataToSchedule = async (timetable) => {
    let list;
    if (timetable == 'sang') {
      console.log(timetable);
      const check = scheduleSangData.find((item) => item.food_id === food.food_id);
      if (check) {
        Alert.alert('Food Already Added', 'This food is already added to the schedule.');
        return;
      } else {
        if (scheduleSangData == []) {
          list = [food]
          await AsyncStorage.setItem(`schedule_${dateSchedule}_${timetable}`, JSON.stringify(list))
          console.log('siuu', `schedule_${dateSchedule}_${timetable}`);
        } else {
          list = [...scheduleSangData, food]
          await AsyncStorage.setItem(`schedule_${dateSchedule}_${timetable}`, JSON.stringify(list))
          console.log('siuu', `schedule_${dateSchedule}_${timetable}`);
        }
        setScheduleSangData(list)
      }
    } else if (timetable == 'trua') {
      console.log(timetable);
      const check = scheduleTruaData.find((item) => item.food_id === food.food_id);
      if (check) {
        Alert.alert('Food Already Added', 'This food is already added to the schedule.');
        return;
      } else {
        if (scheduleTruaData == []) {
          list = [food]
          await AsyncStorage.setItem(`schedule_${dateSchedule}_${timetable}`, JSON.stringify(list))
          console.log('siuu', `schedule_${dateSchedule}_${timetable}`);
        } else {
          list = [...scheduleTruaData, food]
          await AsyncStorage.setItem(`schedule_${dateSchedule}_${timetable}`, JSON.stringify(list))
          console.log('siuu', `schedule_${dateSchedule}_${timetable}`);
        }
        setScheduleTruaData(list)
      }
    } else {
      console.log(timetable);
      const check = scheduleToiData.find((item) => item.food_id === food.food_id);
      if (check) {
        Alert.alert('Food Already Added', 'This food is already added to the schedule.');
        return;
      } else {
        if (scheduleToiData == []) {
          list = [food]
          await AsyncStorage.setItem(`schedule_${dateSchedule}_${timetable}`, JSON.stringify(list))
          console.log('siuu', `schedule_${dateSchedule}_${timetable}`);
        } else {
          list = [...scheduleToiData, food]
          await AsyncStorage.setItem(`schedule_${dateSchedule}_${timetable}`, JSON.stringify(list))
          console.log('siuu', `schedule_${dateSchedule}_${timetable}`);
        }
        setScheduleToiData(list)
      }
    }
  }

  //Remove data from storage
  const removeDataFromStorage = async () => {
    const list = dataFav.filter((item) => item.food_id !== food.food_id)
    await AsyncStorage.setItem('favorite', JSON.stringify(list))
    setDataFav(list)
  }

  const getFoodData = async (foodId) => {
    try {
      const res = await axiosInstance.get(`/foods/${foodId}`)
      console.log(res?.data)
      console.log(1)
      setFoodData(res.data.food)
    } catch (error) {
      console.log(error)
    }
  }

  const getSameCategoryFoods = async (sameCateId) => {
    try {
      const res = await axiosInstance.get(`/foods?cate_detail_id=${sameCateId}`)
      console.log('123123123123123123123213123', res?.data.foods)
      setSameCateData(
        res?.data?.foods?.filter((item) => item?.food_id !== foodId)
      )
    } catch (error) {
      console.log(error)
    }
  }

  const getCategoryName = (categoryId) => {
    const category = categoryData?.find(
      (category) => category.cate_detail_id === categoryId
    )
    return category ? category.cate_detail_name : ''
  }

  const showDatepicker = () => {
    setShowDatePicker(true);
  };

  const handleDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    const realDate = new Date(currentDate).toLocaleDateString()
    setShowDatePicker(Platform.OS === 'ios');
    setDate(currentDate);
    setDateSchedule(realDate);
  };

  const minimumDate = moment().subtract(2, 'months').toDate();
  const maximumDate = moment().add(2, 'months').toDate();

  useEffect(() => {
    if (foodId) {
      getSameCategoryFoods(sameCateId)
      getFromStorage()
    }
  }, [foodId, sameCateId])
  return (
    <>
      <Modal visible={isModalVisible} transparent={true}>
        <View style={styles.modalBackGround}>
          <View style={styles.modalContainer}>
            <View style={{
              width: '100%',
              backgroundColor: 'white',
              paddingHorizontal: 20,
              paddingVertical: 10,
              borderRadius: 20,
              alignItems: 'center',
              justifyContent: 'center',
              marginTop: 10
            }}>
              <Button onPress={showDatepicker} title="Select Date" />
              {showDatePicker && (
                <DateTimePicker
                  value={date}
                  mode="date" // Use 'calendar' mode for Android
                  display="default" // Use 'spinner' display for Android
                  onChange={handleDateChange}
                  minimumDate={minimumDate}
                  maximumDate={maximumDate}
                />
              )}
            </View>
            <View style={styles.modalClick}>
              <TouchableOpacity onPress={() => {
                const timetable = 'sang';
                setDataToSchedule(timetable);
                toggleModal();
              }}>
                <Text style={{ fontWeight: 'bold' }}>Chọn cho bữa sáng</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.modalClick}>
              <TouchableOpacity onPress={() => {
                const timetable = 'trua';
                setDataToSchedule(timetable);
                toggleModal();
              }}>
                <Text style={{ fontWeight: 'bold' }}>Chọn cho bữa trưa</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.modalClick}>
              <TouchableOpacity onPress={() => {
                const timetable = 'toi';
                setDataToSchedule(timetable);
                toggleModal();
              }}>
                <Text style={{ fontWeight: 'bold' }}>Chọn cho bữa tối</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity style={styles.header} onPress={toggleModal}>
              <Ionicons
                name="close-outline"
                size={SPACING * 3}
              />
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <ScrollView>
        <SafeAreaView>
          <ImageBackground
            source={{ uri: food?.food_image[0]?.image }}
            style={{
              height: height / 2 + SPACING * 2,

              justifyContent: 'space-between',
            }}
            imageStyle={{
              borderRadius: SPACING * 3,
            }}
          >
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                padding: SPACING * 2,
                paddingTop: SPACING * 6,
              }}
            >
              <TouchableOpacity
                onPress={() => navigation.goBack()}
                style={{
                  backgroundColor: colors.dark,
                  padding: SPACING,
                  borderRadius: SPACING * 1.5,
                }}
              >
                <Ionicons
                  name="arrow-back"
                  color={colors.white}
                  size={SPACING * 2}
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  const check = dataFav.find(
                    (item) => item?.food_id === food?.food_id
                  )
                  console.log('Check:', check)
                  if (check) {
                    removeDataFromStorage()
                  } else {
                    setDataToStorage()
                  }
                }}
                style={{
                  backgroundColor: colors.dark,
                  padding: SPACING,
                  borderRadius: SPACING * 1.5,
                }}
              >
                {dataFav.find((item) => item?.food_id === food?.food_id) ? (
                  <Ionicons
                    name="heart"
                    size={SPACING * 2.5}
                    color={colors.primary}
                  />
                ) : (
                  <Ionicons
                    name="heart"
                    size={SPACING * 2.5}
                    color={colors.white}
                  />
                )}
              </TouchableOpacity>
            </View>
          </ImageBackground>

          <View
            style={{
              padding: SPACING,
            }}
          >
            <View
              style={{
                overflow: 'hidden',
              }}
            >
              <View
                style={{
                  paddingTop: SPACING * 2,
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}
              >
                <View
                  style={{
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                  }}
                >
                  <Text
                    style={{
                      fontSize: SPACING * 3,
                      color: colors.white,
                      fontWeight: '600',
                      marginBottom: SPACING,
                    }}
                  >
                    {food?.food_name}
                  </Text>
                </View>
              </View>
            </View>
            <Text
              style={{
                color: colors['white-smoke'],
                fontSize: SPACING * 1.7,
                marginBottom: SPACING,
              }}
            >
              Description
            </Text>
            <Text numberOfLines={10} style={{ color: colors.white }}>
              {food?.description}
            </Text>
            <Text
              style={{
                color: colors['white-smoke'],
                fontSize: SPACING * 1.7,
                marginVertical: SPACING,
              }}
            >
              Ingredients
            </Text>
            <Text numberOfLines={10} style={{ color: colors.white }}>
              {food?.ingredient_description}
            </Text>

            <Text
              style={{
                color: colors['white-smoke'],
                fontSize: SPACING * 1.7,
                marginBottom: SPACING,
              }}
            >
              Steps
            </Text>
            <View style={{ color: colors.white }}>
              {food?.food_step?.map((step, index) => (
                <View key={step.step_id}>
                  <Text style={{ color: 'white', fontWeight: 'bold' }}>
                    Step {index + 1}:
                  </Text>
                  <Text style={{ color: 'white' }}>
                    {step?.implementation_guide}
                  </Text>
                  <FlatList
                    data={step?.step_image}
                    keyExtractor={(item) => item.image_id}
                    horizontal
                    renderItem={({ item }) => (
                      <View key={item.image_id}>
                        <Image
                          source={{ uri: item.image }}
                          style={{
                            width: 80,
                            height: 80,
                            borderRadius: SPACING * 2,
                            marginRight: SPACING,
                            marginVertical: SPACING,
                          }}
                        />
                      </View>
                    )}
                  />
                </View>
              ))}
            </View>
            {sameCateData.length !== 0 ? (
              <View style={{ flexDirection: 'row', marginTop: SPACING }}>
                <Text
                  style={{
                    color: colors['white-smoke'],
                    fontSize: SPACING * 1.7,
                    marginBottom: SPACING,
                  }}
                >
                  Related foods
                </Text>
                <Ionicons
                  style={{
                    marginLeft: SPACING / 2,
                  }}
                  name="star"
                  color={colors.primary}
                  size={SPACING * 1.7}
                />
              </View>
            ) : (
              <Text>''</Text>
            )}

            <ScrollView horizontal>
              {sameCateData.map((orchid) => (
                <View
                  key={orchid.food_id}
                  style={{
                    width: width / 2 - SPACING * 2,
                    marginBottom: SPACING,
                    borderRadius: SPACING * 2,
                    overflow: 'hidden',
                    marginRight: SPACING,
                  }}
                >
                  <BlurView
                    tint="dark"
                    intensity={95}
                    style={{
                      padding: SPACING,
                    }}
                  >
                    <TouchableOpacity
                      onPress={() =>
                        navigation.navigate('OrchidDetail', {
                          foodId: orchid.food_id,
                          categoryData: categoryData,
                          foodData: foodData,
                        })
                      }
                      style={{
                        height: 150,
                        width: '100%',
                      }}
                    >
                      <Image
                        source={{ uri: orchid.food_image[0].image }}
                        style={{
                          width: '100%',
                          height: '100%',
                          borderRadius: SPACING * 2,
                        }}
                      />
                    </TouchableOpacity>
                    <Text
                      numberOfLines={1}
                      style={{
                        color: colors.white,
                        fontWeight: '600',
                        fontSize: SPACING * 1.7,
                        marginTop: SPACING,
                        marginBottom: SPACING / 2,
                      }}
                    >
                      {orchid.food_name}
                    </Text>
                    <Text
                      numberOfLines={1}
                      style={{
                        color: colors.secondary,
                        fontSize: SPACING * 1.2,
                      }}
                    >
                      {orchid.food_cate_detail.cate_detail_name}
                    </Text>
                  </BlurView>
                </View>
              ))}
            </ScrollView>
          </View>
        </SafeAreaView>
      </ScrollView>
      <SafeAreaView
        style={{ flexDirection: 'row', justifyContent: 'space-between' }}
      >
        <View
          style={{
            padding: SPACING,
            alignItems: 'center',
            justifyContent: 'center',
            paddingLeft: SPACING * 3,
          }}
        >
          <Text style={{ color: colors.white, fontSize: SPACING * 1.5 }}>
            Calories
          </Text>
          <View style={{ flexDirection: 'row' }}>
            <Text
              style={{
                color: colors.white,
                fontSize: SPACING * 2,
                marginLeft: SPACING / 2,
              }}
            >
              {food?.calories}
            </Text>
            <Text
              style={{
                color: colors.primary,
                fontSize: SPACING * 2,
                marginLeft: 2,
              }}
            >
              cal
            </Text>
          </View>
        </View>
        <TouchableOpacity onPress={toggleModal}>
          <View
            style={{
              marginRight: SPACING,
              backgroundColor: colors.primary,
              width: width / 2 + SPACING * 3,
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: SPACING * 2,
              padding: 20
            }}
          >
            <Text
              style={{
                color: colors.white,
                fontSize: SPACING * 2,
                fontWeight: '700',
              }}
            >
              Chọn cho thực đơn
            </Text>
          </View>
        </TouchableOpacity>
      </SafeAreaView>
    </>
  )
}

export default OrchidDetailsScreen

const styles = StyleSheet.create({
  modalBackGround: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '80%',
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingVertical: 30,
    borderRadius: 20,
    elevation: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    position: 'absolute',
    top: 5,
    right: 10
  },
  modalClick: {
    width: '100%',
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingVertical: 30,
    borderRadius: 20,
    elevation: 5,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10
  }

});
