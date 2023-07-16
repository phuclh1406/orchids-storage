import React, { useRef, useState } from 'react';
import { SafeAreaView, StyleSheet, View, Image, Dimensions } from 'react-native';
import colors from '../config/colors';
import { Carousel, Pagination } from 'react-native-snap-carousel';
import { carouselImage } from '../config/categories';

const { width } = Dimensions.get('window');

const Carousels = () => {
    const [index, setIndex] = useState(0);
    const isCarousel = useRef(null);
    return (
        <View style={{ backgroundColor: colors.dark, flex: 1 }}>
            <Carousel
                ref={isCarousel}
                data={carouselImage}
                renderItem={({ item, index }) => {
                    return (
                        <View >
                            <Image
                                source={{
                                    uri: item.img,
                                }}
                                style={styles.imageStyles}
                            />
                        </View>
                    );
                }}
                sliderWidth={width}
                itemWidth={width}
                sliderHeight={46}
                itemHeight={46}
                onSnapToItem={index => setIndex(index)}
                loop
                autoplay={true}
                autoplayDelay={5000}
                autoplayInterval={5000}
            />
            <View style={{ margin: -20 }}>
                <Pagination
                    dotsLength={carouselImage.length}
                    activeDotIndex={index}
                    carouselRef={isCarousel}
                    dotStyle={{
                        width: 10,
                        height: 10,
                        borderRadius: 5,
                        marginHorizontal: 8,
                        backgroundColor: '#F4BB41',
                    }}
                    tappableDots={true}
                    inactiveDotStyle={{
                        width: 10,
                        height: 10,
                        borderRadius: 5,
                        backgroundColor: 'white',
                    }}
                    inactiveDotOpacity={0.4}
                    inactiveDotScale={0.6}
                />
            </View>

        </View>
    );
};

const styles = StyleSheet.create({
    imageContainer: {
        flex: 1,
    },
    imageStyles: {
        height: 200,
        width: '100%',
    },
});

export default Carousels;