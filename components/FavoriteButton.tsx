
import React from "react";
import { TouchableOpacity, StyleSheet } from "react-native";
import { AntDesign } from "@expo/vector-icons";

interface Props {
    isFavorite: boolean;
    onPress: () => void;
}

const FavoriteButton: React.FC<Props> = ({ isFavorite, onPress }) => {
    return (
        <TouchableOpacity style={styles.button} onPress={onPress}>
            {isFavorite ? (
                <AntDesign name={"heart" as any} size={22} color="#e11d48" /> // ❤️ filled
            ) : (
                <AntDesign name={"heart" as any} size={22} color="#6b7280" /> // 🤍 outline
            )}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        position: "absolute",
        top: 10,
        right: 10,
        backgroundColor: "rgba(255,255,255,0.8)",
        borderRadius: 20,
        padding: 6,
    },
});

export default FavoriteButton;
