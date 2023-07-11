import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  Dimensions,
  Alert,
} from "react-native";
import React, { useState, useEffect } from "react";
import SPACING from "../config/SPACING";
import { BlurView } from "expo-blur";
import { Ionicons } from "@expo/vector-icons";
import colors from "../config/colors";
import SearchField from "../components/SearchField";
import Categories from "../components/Categories";
import orchids from "../config/orchids";
import {
  useNavigation,
  useFocusEffect,
  useIsFocused,
} from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { StatusBar } from "expo-status-bar";

const avatar = require("../../assets/avatar.jpg");

const { width } = Dimensions.get("window");

const FavoriteScreen = ({ navigation }) => {
  useFocusEffect(
    React.useCallback(() => {
      // Add listener for tab press
      const unsubscribe = navigation.addListener("tabPress", (e) => {
        // Prevent default behavior of tab press
        e.preventDefault();

        // Reset the navigation state to the initial route of the stack
        navigation.reset({
          index: 0,
          routes: [{ name: "FavoriteScreen" }],
        });
      });

      // Cleanup the listener when the screen loses focus or unmounts
      return unsubscribe;
    }, [])
  );
  const [activeCategoryId, setActiveCategoryId] = useState(null);
  const [favoriteOrchidsList, setFavoriteOrchidsList] = useState([]);
  const isFocused = useIsFocused();
  const getFromStorage = async () => {
    if (isFocused) {
      const fetchData = async () => {
        try {
          const data = await AsyncStorage.getItem("favorite");
          if (data != undefined) {
            const parsedData = JSON.parse(data);
            const filterOrchids = orchids.filter((orchid) => {
              const check = parsedData.find((item) => item.id === orchid.id);
              if (check) {
                return orchid;
              }
            });
            setFavoriteOrchidsList(filterOrchids);
          }
        } catch (error) {
          console.log(error);
        }
      };
      fetchData();
    }
  };

  function handleDeleteItem(id) {
    Alert.alert(
      "Confirm removing this favorite orchid",
      "You can not recover your favorite orchid after removing it!",
      [
        {
          text: "Cancel",
          onPress: () => {},
        },
        {
          text: "Yes, I confirm",
          onPress: async () => {
            const list = favoriteOrchidsList.filter((item) => item.id !== id);
            await AsyncStorage.setItem("favorite", JSON.stringify(list));
            setFavoriteOrchidsList(list);
          },
        },
      ]
    );
  }
  function handleDeleteAllItem() {
    Alert.alert(
      "Confirm removing all of your favorite orchids",
      "You can not recover your favorites orchid after removing them!",
      [
        {
          text: "Cancel",
          onPress: () => {},
        },
        {
          text: "Yes, I confirm",
          onPress: async () => {
            const list = [];
            await AsyncStorage.setItem("favorite", JSON.stringify(list));
            setFavoriteOrchidsList(list);
          },
        },
      ]
    );
  }

  useEffect(() => {
    getFromStorage();
  }, [isFocused]);

  return (
    <SafeAreaView style={{ backgroundColor: colors.dark, flex: 1 }}>
      <StatusBar
        backgroundColor={colors.primary}
      />
      <ScrollView
        style={{
          padding: SPACING,
          paddingTop: SPACING * 4,
          paddingBottom: SPACING * 4,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <TouchableOpacity
            style={{
              borderRadius: SPACING,
              overflow: "hidden",
              width: SPACING * 4,
              height: SPACING * 4,
            }}
          >
            <BlurView
              style={{
                height: "100%",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Ionicons name="menu" size={SPACING * 2.5} color={colors.light} />
            </BlurView>
          </TouchableOpacity>
          <View
            style={{
              width: SPACING * 16,
              height: SPACING * 4,
              overflow: "hidden",
              marginTop: SPACING / 2,
              borderRadius: SPACING,
            }}
          >
            <Text style={{ color: colors.white, fontSize: SPACING * 2 }}>
              Favorite Screen
            </Text>
          </View>
          <View
            style={{
              width: SPACING * 4,
              height: SPACING * 4,
              overflow: "hidden",
              borderRadius: SPACING,
            }}
          >
            <BlurView
              style={{
                height: "100%",
                padding: SPACING / 2,
              }}
            >
              <TouchableOpacity>
                <Image
                  style={{
                    height: "100%",
                    width: "100%",
                    borderRadius: SPACING,
                  }}
                  source={avatar}
                />
              </TouchableOpacity>
            </BlurView>
          </View>
        </View>
        <View style={{ width: "80%", marginVertical: SPACING }}></View>
        <SearchField />
        <Categories onChange={(id) => setActiveCategoryId(id)} />
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <TouchableOpacity
            onPress={() => handleDeleteAllItem()}
            style={{
              marginRight: SPACING,
              backgroundColor: colors.primary,
              width: width / 2 - SPACING * 2.5,
              height: SPACING * 5,
              justifyContent: "center",
              alignItems: "center",
              borderRadius: SPACING / 2,
              marginBottom: SPACING * 2,
              marginTop: SPACING,
            }}
          >
            <Text
              style={{
                color: colors.white,
                fontSize: SPACING * 2,
                fontWeight: "500",
              }}
            >
              Clear all
            </Text>
          </TouchableOpacity>
          <Text
              style={{
                color: colors["white-smoke"],
                fontSize: SPACING * 2,
                fontWeight: "300",
                marginBottom: SPACING,
                marginLeft: SPACING * 4
              }}
            >
              Count items: {favoriteOrchidsList.length}
            </Text>
        </View>
        <View
          style={{
            flexDirection: "row",
            flexWrap: "wrap",
            justifyContent: "space-between",
            paddingBottom: SPACING * 4
          }}
        >
          {/* {console.log(favoriteOrchidsList)} */}
          {favoriteOrchidsList.length !== 0 ? (
            favoriteOrchidsList
              .filter((orchid) => {
                if (activeCategoryId === null) {
                  return true;
                } else if (activeCategoryId === 0) {
                  return orchid;
                }
                return orchid.categoryId === activeCategoryId;
              })
              .map((orchid) => (
                <View
                  key={orchid.id}
                  style={{
                    flexDirection: "column",
                    width: width / 2 - SPACING * 2,
                    marginBottom: SPACING,
                    borderRadius: SPACING * 2,
                    overflow: "hidden",
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
                        navigation.navigate("OrchidDetail", {
                          orchidId: orchid.id,
                        })
                      }
                      style={{
                        height: 150,
                        width: "100%",
                      }}
                    >
                      <Image
                        source={orchid.image}
                        style={{
                          width: "100%",
                          height: "100%",
                          borderRadius: SPACING * 2,
                        }}
                      />
                      <View
                        style={{
                          position: "absolute",
                          right: 0,
                          borderBottomStartRadius: SPACING * 3,
                          borderTopEndRadius: SPACING * 2,
                          overflow: "hidden",
                        }}
                      >
                        <BlurView
                          tint="dark"
                          intensity={70}
                          style={{
                            flexDirection: "row",
                            padding: SPACING - 2,
                          }}
                        >
                          <Ionicons
                            style={{
                              marginLeft: SPACING / 2,
                            }}
                            name="star"
                            color={colors.primary}
                            size={SPACING * 1.7}
                          />
                          <Text
                            style={{
                              color: colors.white,
                              marginLeft: SPACING / 2,
                            }}
                          >
                            {orchid.rating}
                          </Text>
                        </BlurView>
                      </View>
                    </TouchableOpacity>
                    <Text
                      numberOfLines={2}
                      style={{
                        color: colors.white,
                        fontWeight: "600",
                        fontSize: SPACING * 1.7,
                        marginTop: SPACING,
                        marginBottom: SPACING / 2,
                      }}
                    >
                      {orchid.name}
                    </Text>
                    <Text
                      numberOfLines={1}
                      style={{
                        color: colors.secondary,
                        fontSize: SPACING * 1.2,
                      }}
                    >
                      {orchid.included}
                    </Text>
                    <View
                      style={{
                        marginVertical: SPACING / 2,
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <View style={{ flexDirection: "row" }}>
                        <Text
                          style={{
                            color: colors.primary,
                            marginRight: SPACING / 2,
                            fontSize: SPACING * 1.6,
                          }}
                        >
                          $
                        </Text>
                        <Text
                          style={{
                            color: colors.white,
                            fontSize: SPACING * 1.6,
                          }}
                        >
                          {orchid.price}
                        </Text>
                      </View>
                      <TouchableOpacity
                        onPress={() => handleDeleteItem(orchid.id)}
                      >
                        <Ionicons
                          name="heart"
                          size={SPACING * 3}
                          color={colors.primary}
                        />
                      </TouchableOpacity>
                    </View>
                  </BlurView>
                </View>
              ))
          ) : (
            <View>
              <Text
                style={{
                  color: colors.white,
                  fontSize: SPACING * 1.6,
                }}
              >
                Your Favorite is empty
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default FavoriteScreen;

const styles = StyleSheet.create({});
