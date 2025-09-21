import React, { useEffect, useState } from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { Recipe } from "@/types/Recipe";
import { useNavigation } from "@react-navigation/native";
import { getAuth } from "firebase/auth";
import FavoriteButton from "./FavoriteButton";
import { RecipeService } from "@/services/RecipeService";

interface Props {
    recipe: Recipe;
    currentUserId: string;
    onPress?: () => void;
}

const PLACEHOLDER_IMAGE = "https://via.placeholder.com/300x200.png?text=No+Image";

const RecipeCard: React.FC<Props> = ({ recipe, currentUserId, onPress }) => {
    const navigation = useNavigation<any>();
    const user = getAuth().currentUser;

    const [imageUrl, setImageUrl] = useState<string>(PLACEHOLDER_IMAGE);
    const [isFavorite, setIsFavorite] = useState<boolean>(
        recipe.favorites?.includes(currentUserId) ?? false
    );

    useEffect(() => {
        if (recipe.imageUrl && recipe.imageUrl.trim()) {
            setImageUrl(recipe.imageUrl);
        } else {
            setImageUrl(PLACEHOLDER_IMAGE);
        }
    }, [recipe.imageUrl]);

    const toggleFavorite = async () => {
        if (!user || !recipe.id) return;
        const newState = !isFavorite;
        setIsFavorite(newState);
        try {
            await RecipeService.toggleFavorite(recipe.id, user.uid, isFavorite);
        } catch (error) {
            console.error("Error updating favorite:", error);
            setIsFavorite(isFavorite); // rollback
        }
    };

    return (
        <TouchableOpacity
            style={styles.card}
            activeOpacity={0.9}
            onPress={onPress ? onPress : () => navigation.navigate("RecipeDetail", { id: recipe.id })}
        >
            <View style={styles.imageContainer}>
                <Image
                    source={{ uri: imageUrl }}
                    style={styles.placeImage}
                    resizeMode="cover"
                    onError={() => setImageUrl(PLACEHOLDER_IMAGE)}
                />
                <View style={styles.imageOverlay} />
            </View>

            <View style={styles.info}>
                <Text style={styles.title} numberOfLines={1}>
                    {recipe.title}
                </Text>
                <Text style={styles.description} numberOfLines={2}>
                    {recipe.description}
                </Text>
                {recipe.category && <Text style={styles.category}>{recipe.category}</Text>}
            </View>

            <View style={styles.actions}>
                <FavoriteButton isFavorite={isFavorite} onPress={toggleFavorite} />
                <TouchableOpacity
                    style={styles.viewMoreBtn}
                    onPress={() => navigation.navigate("RecipeDetail", { id: recipe.id })}
                >
                    <Text style={styles.viewMoreText}>View More</Text>
                </TouchableOpacity>
            </View>
        </TouchableOpacity>
    );
};

export default RecipeCard;

const styles = StyleSheet.create({
    card: {
        flex: 1,
        margin: 8,
        backgroundColor: "#fff",
        borderRadius: 12,
        padding: 10,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 5,
        shadowOffset: { width: 0, height: 2 },
        elevation: 3,
    },
    imageContainer: {
        width: "100%",
        height: 150,
        borderRadius: 10,
        overflow: "hidden",
        marginBottom: 8,
        position: "relative",
        backgroundColor: "#f0f0f0",
    },
    placeImage: {
        width: "100%",
        height: "100%",
    },
    imageOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: "rgba(0,0,0,0.15)", // dark overlay
    },
    info: { flex: 1 },
    title: { fontSize: 16, fontWeight: "bold", color: "#333" },
    description: { fontSize: 14, color: "#666", marginTop: 4 },
    category: { marginTop: 6, fontSize: 12, fontWeight: "600", color: "#888" },
    actions: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: 10,
    },
    viewMoreBtn: {
        backgroundColor: "#ff7f50",
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 6,
    },
    viewMoreText: { color: "#fff", fontWeight: "bold" },
});
