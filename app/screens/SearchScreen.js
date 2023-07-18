import {
    ActivityIndicator,
    Dimensions,
    FlatList,
    Image,
    SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View,
} from 'react-native'
import React, { useState, useEffect, useContext } from 'react'
import colors from '../config/colors'
import SearchField from '../components/SearchField'
import { StatusBar } from 'expo-status-bar'
import axiosInstance from '../../util/axiosWrapper'
import COLORS from '../config/colors'
import SPACING from '../config/SPACING'
import { Ionicons } from '@expo/vector-icons'


export const SearchScreen = ({ navigation, route }) => {
    const [foodData, setFoodData] = useState([]);
    const [inputs, setInputs] = useState({ food_name: '' });
    const [filteredData, setFilteredData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState(null);
    const [categoryData, setCategoryData] = useState([]);
    const { categoryDataList } = route.params;
    const getFoodData = async () => {
        try {
            const res = await axiosInstance.get(`/foods`)
            setFoodData(res?.data?.foods)
            setFilteredData(res?.data?.foods);
            setIsLoading(false);
            setCategoryData(categoryDataList);
        } catch (error) {
            setErrors(error);
            console.log(error)
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        setIsLoading(true);
        getFoodData();
    }, []);

    const searchFilterFunction = (text) => {
        if (text) {
            console.log(text);
            const newData = foodData.filter(item => {
                const itemData = item.food_name ? item.food_name.toUpperCase() : ''.toUpperCase();
                const textData = text.toUpperCase();
                return itemData.indexOf(textData) > -1;
            })
            setFilteredData(newData);
        } else {
            setFilteredData(foodData);
        }
    }

    if (isLoading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size={'large'} color='#FC6847' />
            </View>
        )
    }

    if (errors) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text>Something is error!</Text>
            </View>
        )
    }

    return (
        <SafeAreaView style={{ backgroundColor: colors.dark, flex: 1, marginTop: 50 }}>
            <StatusBar backgroundColor={colors.primary} />
            <View style={{ marginHorizontal: 10, flexDirection: 'row' }}>
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
                <SearchField
                    onChangeText={(text) => searchFilterFunction(text)}
                />
            </View>
            {/* handleOnchange(text, 'food_name') */}
            <ScrollView>
                {filteredData.map((item, index) => {
                    return (
                        <TouchableOpacity
                            onPress={() => 
                                navigation.navigate('OrchidDetail', {
                                foodId: item.food_id,
                                categoryData: categoryData,
                                foodData: foodData
                            })}
                        >
                            <View key={index} style={styles.itemContainer}>
                                <Image
                                    source={{ uri: item.food_image[0].image }}
                                    style={styles.image}
                                />
                                <View>
                                    <Text style={styles.textName}>{item.food_name}</Text>
                                    <Text style={styles.textCalo}>Calories: {item.calories}cal</Text>
                                </View>
                            </View>
                        </TouchableOpacity>

                    )
                })}
            </ScrollView>


        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    text: {
        fontSize: 20,
        textAlign: 'left',
        marginLeft: 10,
        marginTop: 10,
        fontWeight: 'bold'
    },
    itemContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 10,
        marginTop: 10
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
        color: 'white'
    },
    textCalo: {
        fontSize: 12,
        marginLeft: 10,
        color: 'grey'
    }
})