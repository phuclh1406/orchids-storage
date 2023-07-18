import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState } from "react";

import categories from "../config/categories";
import colors from "../config/colors";
import SPACING from "../config/SPACING";

const Categories = ({ onChange, inputData }) => {
  const [activeCategoryId, setActiveCategoryId] = useState(null);
  const [isCategoryActive, setIsCategoryActive] = useState(false);


  const handlePress = (cate_detail_id) => {
    setActiveCategoryId(cate_detail_id);
    onChange(cate_detail_id);
  };

  return (
    <FlatList
      horizontal={true}
      data={inputData}
      keyExtractor={(item) => item.cate_detail_id}
      contentContainerStyle={{ marginVertical: SPACING }}
      renderItem={({ item }) => (
        <TouchableOpacity
          onPress={() => handlePress(item.cate_detail_id)}
          style={{ marginRight: SPACING * 2, alignItems: "center" }}
        >
          <Text
            style={[
              { color: colors.secondary, fontSize: SPACING * 2 },
              activeCategoryId === item.cate_detail_id && { color: colors.primary },
            ]}
          >
            {item.cate_detail_name}
          </Text>
          {activeCategoryId === item.cate_detail_id && (
            <View
              style={{
                height: SPACING,
                width: SPACING,
                backgroundColor: colors.primary,
                borderRadius: SPACING / 2,
                marginTop: SPACING / 2,
              }}
            />
          )}
        </TouchableOpacity>
      )}
    />
  );
};

export default Categories;

const styles = StyleSheet.create({});
