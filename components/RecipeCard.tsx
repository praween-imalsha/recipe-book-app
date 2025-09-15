import React, { useState, useEffect } from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { Recipe } from "@/types/Recipe";
import { getAuth } from "firebase/auth";
import { ref, getDownloadURL } from "firebase/storage";
import { storage } from "@/firebase";
import FavoriteButton from "./FavoriteButton";
import { RecipeService } from "@/services/RecipeService";
import { useNavigation } from "@react-navigation/native";

interface Props {
    recipe: Recipe;
    currentUserId: string;
    onPress?: () => void;
}

const PLACEHOLDER_IMAGE = "https://via.placeholder.com/150";

const RecipeCard: React.FC<Props> = ({ recipe, currentUserId, onPress }) => {
    const navigation = useNavigation<any>();
    const user = getAuth().currentUser;

    const [imageUrl, setImageUrl] = useState<string>(
        recipe.imageUrl ?? PLACEHOLDER_IMAGE
    );
    const [isFavorite, setIsFavorite] = useState<boolean>(
        recipe.favorites?.includes(currentUserId) ?? false
    );

    // ✅ Load recipe image (from Firebase Storage if path)
    useEffect(() => {
        const fetchImage = async () => {
            try {
                if (recipe.imageUrl?.startsWith("http")) {
                    setImageUrl(recipe.imageUrl);
                } else if (recipe.imageUrl) {
                    const storageRef = ref(storage, recipe.imageUrl);
                    const url = await getDownloadURL(storageRef);
                    setImageUrl(url);
                } else {
                    setImageUrl(PLACEHOLDER_IMAGE);
                }
            } catch {
                setImageUrl(PLACEHOLDER_IMAGE);
            }
        };
        fetchImage();
    }, [recipe.imageUrl]);

    // ✅ Toggle favorite state
    const toggleFavorite = async () => {
        if (!user) return;
        const newState = !isFavorite;
        setIsFavorite(newState);
        try {
            await RecipeService.toggleFavorite(recipe.id, user.uid, isFavorite);
        } catch (error) {
            console.error("🔥 Error updating favorite:", error);
            setIsFavorite(isFavorite); // rollback if failed
        }
    };

    return (
        <TouchableOpacity
            style={styles.card}
            activeOpacity={0.9}
            onPress={
                onPress
                    ? onPress
                    : () => navigation.navigate("RecipeDetail", { id: recipe.id }) // ✅ pass only id
            }
        >
            {/* Image */}
            <Image
                source={{ uri: imageUrl }}
                style={styles.image}
                resizeMode="cover"
            />

            {/* Info */}
            <View style={styles.info}>
                <Text style={styles.title} numberOfLines={1}>
                    {recipe.title}
                </Text>
                <Text style={styles.description} numberOfLines={2}>
                    {recipe.description}
                </Text>
                {recipe.category && (
                    <Text style={styles.category}>{recipe.category}</Text>
                )}
            </View>

            {/* Actions */}
            <View style={styles.actions}>
                <FavoriteButton isFavorite={isFavorite} onPress={toggleFavorite} />
                <TouchableOpacity
                    style={styles.viewMoreBtn}
                    onPress={() =>
                        navigation.navigate("RecipeDetail", { id: recipe.id })
                    }
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
    category: {
        marginTop: 6,
        fontSize: 12,
        fontWeight: "600",
        color: "#888",
    },
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
