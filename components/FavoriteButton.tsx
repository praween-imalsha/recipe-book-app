// src/components/FavoriteButton.tsx
import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";

interface Props {
    isFavorite: boolean;
    onPress: () => void;
}

const FavoriteButton: React.FC<Props> = ({ isFavorite, onPress }) => {
    return (
        <TouchableOpacity style={styles.button} onPress={onPress}>
            <Text style={[styles.heart, { color: isFavorite ? "red" : "gray" }]}>
                ♥
            </Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        padding: 8,
    },
    heart: {
        fontSize: 24,
        fontWeight: "bold",
    },
});

export default FavoriteButton;
