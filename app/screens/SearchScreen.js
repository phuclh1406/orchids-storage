import {
    ActivityIndicator,
    FlatList,
    Image,
    SafeAreaView, Text, View,
} from 'react-native'
import React, { useState, useEffect, useContext } from 'react'
import colors from '../config/colors'
import SearchField from '../components/SearchField'
import { StatusBar } from 'expo-status-bar'
import axiosInstance from '../../util/axiosWrapper'

export const SearchScreen = () => {
    const [foodData, setFoodData] = useState([]);
    const [inputs, setInputs] = useState({ food_name: '' });
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState(null);

    const getFoodData = async () => {
        try {
            const res = await axiosInstance.get(`/foods`)
            setFoodData(res?.data?.foods)
            setIsLoading(false);
            console.log(foodData);
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

    const handleOnchange = (text, input) => {
        setInputs((prevState) => ({ ...prevState, [input]: text }))
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
            <View style={{ marginHorizontal: 10 }}>
                <SearchField
                    onChangeText={(text) => handleOnchange(text, 'food_name')}
                />
            </View>

            <FlatList
                data={foodData}
                keyExtractor={(item) => item.food_id}
                renderItem={({item}) => {
                    <View>
                        <Image source={{uri: item.food_image[0].image}}/>
                        <View>
                            <Text>{item.food_name}</Text>
                        </View>
                    </View>
                }}
            />

        </SafeAreaView>
    )
}
