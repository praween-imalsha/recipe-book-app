
import React, { useState, useEffect } from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity, Dimensions } from "react-native";
import { Recipe } from "@/types/Recipe";
import { getAuth } from "firebase/auth";
import { ref, getDownloadURL } from "firebase/storage";
import { storage } from "@/firebase";
import FavoriteButton from "./FavoriteButton";
import { RecipeService } from "@/services/RecipeService";

interface Props {
    recipe: Recipe;
    onPress?: () => void;
}

const screenWidth = Dimensions.get("window").width;
const PLACEHOLDER_IMAGE = "https://via.placeholder.com/150";

const RecipeCard: React.FC<Props> = ({ recipe, onPress }) => {
    const user = getAuth().currentUser;
    const [imageUrl, setImageUrl] = useState<string>(recipe.imageUrl ?? PLACEHOLDER_IMAGE);
    const [isFavorite, setIsFavorite] = useState<boolean>(
        recipe.favorites?.includes(user?.uid || "") ?? false
    );

    useEffect(() => {
        const fetchImage = async () => {
            try {
                if (recipe.imageUrl?.startsWith("http")) {
                    setImageUrl(recipe.imageUrl);
                } else if (recipe.imageUrl) {
                    const storageRef = ref(storage, recipe.imageUrl);
                    const url = await getDownloadURL(storageRef);
                    setImageUrl(url);
                }
            } catch {
                setImageUrl(PLACEHOLDER_IMAGE);
            }
        };
        fetchImage();
    }, [recipe.imageUrl]);

    const toggleFavorite = async () => {
        if (!user) return;
        const newState = !isFavorite;
        setIsFavorite(newState);
        try {
            await RecipeService.toggleFavorite(recipe.id, user.uid, isFavorite);
        } catch (error) {
            console.error("🔥 Error updating favorite:", error);
            setIsFavorite(isFavorite); // rollback UI if fail
        }
    };

    return (
        <TouchableOpacity style={styles.card} onPress={onPress}>
            <Image source={{ uri: imageUrl }} style={styles.image} resizeMode="cover" />
            <View style={styles.info}>
                <Text style={styles.title} numberOfLines={1}>{recipe.title}</Text>
                <Text style={styles.description} numberOfLines={2}>{recipe.description}</Text>
                {recipe.category && <Text style={styles.category}>{recipe.category}</Text>}
            </View>
            <FavoriteButton isFavorite={isFavorite} onPress={toggleFavorite} />
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    card: {
        width: screenWidth / 2 - 24,
        backgroundColor: "#fff",
        borderRadius: 12,
        padding: 10,
        margin: 8,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 5,
        shadowOffset: { width: 0, height: 2 },
        elevation: 3,
    },
    image: {
        width: "100%",
        height: 120,
        borderRadius: 10,
        backgroundColor: "#f0f0f0",
        marginBottom: 8,
    },
    info: { flex: 1 },
    title: { fontSize: 16, fontWeight: "bold", color: "#333" },
    description: { fontSize: 14, color: "#666", marginTop: 4 },
    category: { marginTop: 6, fontSize: 12, fontWeight: "600", color: "#888" },
});

export default RecipeCard;
