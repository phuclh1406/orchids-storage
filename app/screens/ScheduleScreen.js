import {
    View,
    Dimensions,
    StyleSheet,
    TouchableOpacity,
    Image,
    ScrollView,
    ProgressBarAndroid,
    Alert,
} from 'react-native'
import React, { useState, useEffect, useContext } from 'react'
import { useNavigation, useFocusEffect, useIsFocused } from '@react-navigation/native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import axiosInstance from '../../util/axiosWrapper'
import moment from 'moment';
import CalendarStrip from 'react-native-calendar-strip'
import { ActivityIndicator, ProgressBar, Text } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons'
import SPACING from '../config/SPACING'
import colors from '../config/colors'

const ScheduleScreen = ({ navigation }) => {
    const [foodSangData, setFoodSangData] = useState([]);
    const [foodTruaData, setFoodTruaData] = useState([]);
    const [foodToiData, setFoodToiData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [total, setTotal] = useState(0);
    const [totalCalo, setTotalCalo] = useState(0);
    const [categoryData, setCategoryData] = useState([]);
    const [foodData, setFoodData] = useState([]);
    const [date, setDate] = useState(moment());

    //Get data from storage
    const getFromStorage = async (date) => {
        setIsLoading(true);
        try {
            const realDate = new Date(date).toLocaleDateString()
            const sangData = await AsyncStorage.getItem(`schedule_${realDate}_sang`);
            console.log(`schedule_${realDate}_sang`);
            const truaData = await AsyncStorage.getItem(`schedule_${realDate}_trua`);
            const toiData = await AsyncStorage.getItem(`schedule_${realDate}_toi`);
            console.log('kkaa', `schedule_${realDate}_sang`);
            setFoodSangData(sangData != null ? JSON.parse(sangData) : []);
            setFoodTruaData(truaData != null ? JSON.parse(truaData) : []);
            setFoodToiData(toiData != null ? JSON.parse(toiData) : []);
            setIsLoading(false);
        } catch (error) {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        const caloSang = foodSangData.reduce((prev, cur) => {
            return prev + parseInt(cur.calories, 10)
        }, 0)
        const caloTrua = foodTruaData.reduce((prev, cur) => {
            return prev + parseInt(cur.calories, 10)
        }, 0)
        const caloToi = foodToiData.reduce((prev, cur) => {
            return prev + parseInt(cur.calories, 10)
        }, 0)
        setTotal((caloSang + caloTrua + caloToi) / 2000)
        setTotalCalo(caloSang + caloTrua + caloToi)
    }, [foodSangData, foodTruaData, foodToiData])

    const startDate = moment().subtract(2, 'months').toDate();
    const endDate = moment().add(2, 'months').toDate();

    const datesWhitelist = [
        // single date (date)
        moment(),
        // date range
        {
            start: startDate, // replace with the start date
            end: endDate,   // replace with the end date
        },
    ];

    const handleDateSelected = (date) => {
        setDate(date)
        // console.log('Selected date:', moment(date).startOf('day'));
        // getFromStorage(date)
        // You can perform any further actions with the selected date here

    };

    function handleDeleteSangItem(food_id) {
        Alert.alert(
            'Confirm removing this favorite food',
            'You cannot recover your favorite food after removing it!',
            [
                {
                    text: 'Cancel',
                    onPress: () => { },
                },
                {
                    text: 'Yes, I confirm',
                    onPress: async () => {
                        const realDate = new Date(date).toLocaleDateString();
                        // try {
                        //     const updatedSangList = foodSangData.filter((food) => food.food_id !== id);
                        //     await AsyncStorage.setItem(`schedule_${realDate}_sang`, JSON.stringify(updatedSangList));
                        //     setFoodSangData(updatedSangList);
                        // } catch (error) {
                        //     console.log(error);
                        // }
                        try {
                            // Find the index of the first occurrence of the item with matching food_id
                            const indexToDelete = foodSangData.findIndex((food) => food.food_id === food_id);

                            if (indexToDelete !== -1) {
                                // Create a new array by excluding the item at indexToDelete
                                const updatedSangList = [...foodSangData];
                                updatedSangList.splice(indexToDelete, 1);

                                await AsyncStorage.setItem(
                                    `schedule_${realDate}_sang`,
                                    JSON.stringify(updatedSangList)
                                );
                                setFoodSangData(updatedSangList);
                            }
                        } catch (error) {
                            console.log(error);
                        }
                    },
                },
            ]
        );
    };

    function handleDeleteTruaItem(food_id) {
        Alert.alert(
            'Confirm removing this favorite food',
            'You cannot recover your favorite food after removing it!',
            [
                {
                    text: 'Cancel',
                    onPress: () => { },
                },
                {
                    text: 'Yes, I confirm',
                    onPress: async () => {
                        const realDate = new Date(date).toLocaleDateString();
                        // try {
                        //     // const updatedTruaList = foodTruaData.filter((food) => food.food_id !== id);
                        //     // await AsyncStorage.setItem(`schedule_${realDate}_trua`, JSON.stringify(updatedTruaList));
                        //     // setFoodTruaData(updatedTruaList);
                        // } catch (error) {
                        //     console.log(error);
                        // }
                        try {
                            // Find the index of the first occurrence of the item with matching food_id
                            const indexToDelete = foodTruaData.findIndex((food) => food.food_id === food_id);

                            if (indexToDelete !== -1) {
                                // Create a new array by excluding the item at indexToDelete
                                const updatedTruaList = [...foodTruaData];
                                updatedTruaList.splice(indexToDelete, 1);

                                await AsyncStorage.setItem(
                                    `schedule_${realDate}_trua`,
                                    JSON.stringify(updatedTruaList)
                                );
                                setFoodTruaData(updatedTruaList);
                            }
                        } catch (error) {
                            console.log(error);
                        }
                    },
                },
            ]
        );
    };

    function handleDeleteToiItem(food_id) {
        Alert.alert(
            'Confirm removing this favorite food',
            'You cannot recover your favorite food after removing it!',
            [
                {
                    text: 'Cancel',
                    onPress: () => { },
                },
                {
                    text: 'Yes, I confirm',
                    onPress: async () => {
                        const realDate = new Date(date).toLocaleDateString();
                        // try {
                        //     const updatedToiList = foodToiData.filter((food) => food.food_id !== id);
                        //     await AsyncStorage.setItem(`schedule_${realDate}_toi`, JSON.stringify(updatedToiList));
                        //     setFoodToiData(updatedToiList);
                        // } catch (error) {
                        //     console.log(error);
                        // }
                        try {
                            // Find the index of the first occurrence of the item with matching food_id
                            const indexToDelete = foodToiData.findIndex((food) => food.food_id === food_id);

                            if (indexToDelete !== -1) {
                                // Create a new array by excluding the item at indexToDelete
                                const updatedToiList = [...foodToiData];
                                updatedToiList.splice(indexToDelete, 1);

                                await AsyncStorage.setItem(
                                    `schedule_${realDate}_toi`,
                                    JSON.stringify(updatedToiList)
                                );
                                setFoodToiData(updatedToiList);
                            }
                        } catch (error) {
                            console.log(error);
                        }
                        
                    },
                },
            ]
        );
    };

    const getCategoryData = async () => {
        try {
            const res = await axiosInstance.get("/categories_detail?cate_id=6e3f5b3b-df19-4776-a7cc-92b0a0a3ce1d")
            setCategoryData(res?.data?.categories_detail?.rows)
        } catch (error) {
            console.log(error)
        }
    }

    const getFoodData = async () => {
        // setIsLoading(true);
        try {
            const res = await axiosInstance.get("/foods")
            // console.log(res?.data)
            setFoodData(res?.data?.foods)
            await AsyncStorage.setItem('foodData', JSON.stringify(res?.data?.foods))
            setIsLoading(false);
        } catch (error) {
            console.log(error)
        } finally {
            //   setIsLoading(false);
        }
    }

    console.log(total);
    console.log(totalCalo);

    useEffect(() => {
        // setIsLoading(true);
        getCategoryData()
        getFoodData()
    }, []);

    useEffect(() => {
        console.log(123456)
        getFromStorage(date)

    }, [date])

    return (
        <View style={{ flex: 1, backgroundColor: colors.dark }}>
            <CalendarStrip
                calendarAnimation={{ type: 'sequence', duration: 30 }}
                daySelectionAnimation={{
                    type: 'border',
                    duration: 200,
                    borderWidth: 1,
                    borderHighlightColor: 'white',
                }}
                selectedDate={date}
                setSelectedDate={(moment) => {
                    setDate(moment)
                }}
                style={{ height: 100, paddingTop: 20, paddingBottom: 10 }}
                calendarHeaderStyle={{ color: 'white' }}
                calendarColor={'#FC6847'}
                dateNumberStyle={{ color: 'white' }}
                dateNameStyle={{ color: 'white' }}
                highlightDateNumberStyle={{ color: 'yellow' }}
                highlightDateNameStyle={{ color: 'yellow' }}
                disabledDateNameStyle={{ color: 'grey' }}
                disabledDateNumberStyle={{ color: 'grey' }}
                datesWhitelist={datesWhitelist}
                iconContainer={{ flex: 0.1 }}
                onDateSelected={handleDateSelected}
            />
            {isLoading ? (
                <View style={{
                    flex: 1,
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginTop: 20
                }}>
                    <ActivityIndicator size='large' color='#FC6847' />
                </View>
            ) : (
                <View style={{ flex: 1 }}>

                    <Text style={{ marginTop: 20, marginHorizontal: 20, color: 'white' }}>Recommend calories: 2000</Text>
                    <View>
                        {totalCalo > 2000 ?
                            <View>
                                <ProgressBarAndroid
                                    style={{ marginHorizontal: 20 }}
                                    styleAttr="Horizontal"
                                    indeterminate={false}
                                    progress={total}
                                    color={'red'}
                                />
                                <Text style={{ marginHorizontal: 20, color: 'white' }}>Current calories: {totalCalo}</Text>
                                <Text style={{ marginHorizontal: 20, color: 'red' }}>Exceeded the recommended calories for the day!</Text>
                            </View>
                            :
                            <View>
                                <ProgressBarAndroid
                                    style={{ marginHorizontal: 20 }}
                                    styleAttr="Horizontal"
                                    indeterminate={false}
                                    progress={total}
                                    color={'#FC6847'}
                                />
                                <Text style={{ marginHorizontal: 20, color: 'white' }}>Current calories: {totalCalo}</Text>
                            </View>
                        }
                    </View>


                    <ScrollView style={{ marginBottom: 10 }} showsVerticalScrollIndicator={false}>
                        <View style={styles.tab}>
                            <Text style={styles.text}>Bữa sáng</Text>
                        </View>
                        <View style={styles.list}>
                            {foodSangData.map((item, index) => {
                                return (
                                    <View key={index}>
                                        <TouchableOpacity
                                            onPress={() =>
                                                navigation.navigate('OrchidDetail', {
                                                    foodId: item.food_id,
                                                    categoryData: categoryData,
                                                    foodData: foodData
                                                })}
                                        >
                                            <View style={styles.line}></View>
                                            <View key={item.food_id} style={styles.itemContainer}>
                                                <Image
                                                    source={{ uri: item.food_image[0].image }}
                                                    style={styles.image}
                                                />
                                                <View>
                                                    <Text style={styles.textName} numberOfLines={1} >{item.food_name}</Text>
                                                    <Text style={styles.textCalo}>Calories: {item.calories}cal</Text>
                                                </View>
                                            </View>

                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            onPress={() => {
                                                handleDeleteSangItem(item.food_id)
                                            }}
                                            style={{
                                                position: 'absolute',
                                                right: SPACING,
                                                top: 28
                                            }}
                                        >
                                            <Ionicons
                                                name="trash-outline"
                                                size={SPACING * 2.5}
                                                color={colors.red}
                                            />
                                        </TouchableOpacity>
                                    </View>

                                )
                            })}
                        </View>
                        <View style={styles.tab}>
                            <Text style={styles.text}>Bữa trưa</Text>
                        </View>
                        <View style={styles.list}>
                            {foodTruaData.map((item, index) => {
                                return (
                                    <View key={index}>
                                        <TouchableOpacity
                                            onPress={() =>
                                                navigation.navigate('OrchidDetail', {
                                                    foodId: item.food_id,
                                                    categoryData: categoryData,
                                                    foodData: foodData
                                                })}
                                        >
                                            <View style={styles.line}></View>
                                            <View key={item.food_id} style={styles.itemContainer}>
                                                <Image
                                                    source={{ uri: item.food_image[0].image }}
                                                    style={styles.image}
                                                />
                                                <View>
                                                    <Text style={styles.textName} numberOfLines={1} >{item.food_name}</Text>
                                                    <Text style={styles.textCalo}>Calories: {item.calories}cal</Text>
                                                </View>
                                            </View>
                                        </TouchableOpacity>

                                        <TouchableOpacity
                                            onPress={() => {
                                                handleDeleteTruaItem(item.food_id)
                                            }}
                                            style={{
                                                position: 'absolute',
                                                right: SPACING,
                                                top: 28
                                            }}
                                        >
                                            <Ionicons
                                                name="trash-outline"
                                                size={SPACING * 2.5}
                                                color={colors.red}
                                            />
                                        </TouchableOpacity>
                                    </View>

                                )
                            })}
                        </View>
                        <View style={styles.tab}>
                            <Text style={styles.text}>Bữa tối</Text>
                        </View>
                        <View style={styles.list}>
                            {foodToiData.map((item, index) => {
                                return (
                                    <View key={index}>
                                        <TouchableOpacity
                                            onPress={() =>
                                                navigation.navigate('OrchidDetail', {
                                                    foodId: item.food_id,
                                                    categoryData: categoryData,
                                                    foodData: foodData
                                                })}
                                        >
                                            <View style={styles.line}></View>
                                            <View key={item.food_id} style={styles.itemContainer}>
                                                <Image
                                                    source={{ uri: item.food_image[0].image }}
                                                    style={styles.image}
                                                />
                                                <View>
                                                    <Text style={styles.textName} numberOfLines={1} >{item.food_name}</Text>
                                                    <Text style={styles.textCalo}>Calories: {item.calories}cal</Text>
                                                </View>
                                            </View>

                                        </TouchableOpacity>

                                        <TouchableOpacity
                                            onPress={() => {
                                                handleDeleteToiItem(item.food_id)
                                            }}
                                            style={{
                                                position: 'absolute',
                                                right: SPACING,
                                                top: 28
                                            }}
                                        >
                                            <Ionicons
                                                name="trash-outline"
                                                size={SPACING * 2.5}
                                                color={colors.red}
                                            />
                                        </TouchableOpacity>
                                    </View>
                                )
                            })}
                        </View>
                    </ScrollView>
                </View>
            )}
        </View>
    )
}

export default ScheduleScreen

const styles = StyleSheet.create({
    tab: {
        marginTop: 10,
        marginHorizontal: 20,
        paddingVertical: 10,
        paddingHorizontal: 20,
        backgroundColor: '#FC6847',
        borderRadius: 2,
        position: 'relative',
        zIndex: 1
    },
    text: {
        fontWeight: 'bold'
    },
    itemContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 10,
        marginVertical: 15
    },
    image: {
        width: 50,
        height: 50,
        borderRadius: 25,
    },
    textName: {
        fontSize: 17,
        marginLeft: 10,
        fontWeight: '600',
        color: 'black',
        width: 250,
        color: 'white'
    },
    textCalo: {
        fontSize: 12,
        marginLeft: 10,
        color: 'grey'
    },
    line: {
        height: 1,
        width: '100%',
        backgroundColor: 'white'
    },
    list: {
        marginHorizontal: 21,
        borderColor: 'grey',
        borderWidth: 2,
        marginTop: -20,
        paddingTop: 15,
        borderColor: 'white'
    }
})