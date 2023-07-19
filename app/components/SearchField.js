import { StyleSheet, Text, TextInput, View, useWindowDimensions } from "react-native";
import React, { useState } from "react";
import { BlurView } from "expo-blur";
import colors from "../config/colors";
import SPACING from "../config/SPACING";

import { Ionicons } from "@expo/vector-icons";


const SearchField = ({onChangeText}) => {
  return (
    <View
      style={{
        borderRadius: SPACING,
        overflow: "hidden",
        width: 350
      }}
    >
      <BlurView
        intensity={30}
        style={{
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <TextInput
          autoCapitalize="none"
          autoCorrect={false}
          style={{
            width: "100%",
            color: colors.white,
            fontSize: SPACING * 1.7,
            padding: SPACING,
            paddingLeft: SPACING * 3.5,
          }}
          placeholder="Find Your Food..."
          placeholderTextColor={colors.light}
          onChangeText={onChangeText}
        />

        <Ionicons
          style={{
            position: "absolute",
            left: SPACING,
          }}
          name="search"
          color={colors.light}
          size={SPACING * 2}
        />
      </BlurView>
    </View>
  );
};

export default SearchField;

const styles = StyleSheet.create({});
