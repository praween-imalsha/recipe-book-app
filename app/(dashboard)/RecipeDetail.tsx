import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    ScrollView,
    Image,
    StyleSheet,
    ActivityIndicator,
    TouchableOpacity,
    Alert,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { getRecipeById, toggleFavorite } from "@/services/RecipeService";
import { Recipe } from "@/types/Recipe";
import { getAuth } from "firebase/auth";

const RecipeDetail = () => {
    const route = useRoute<any>();
    const navigation = useNavigation<any>();
    const { id } = route.params; // 🆔 passed from Home.tsx when navigating

    const [recipe, setRecipe] = useState<Recipe | null>(null);
    const [loading, setLoading] = useState(true);
    const [favorites, setFavorites] = useState<string[]>([]);

    useEffect(() => {
        const fetchRecipe = async () => {
            try {
                const data = await getRecipeById(id);
                if (!data) {
                    Alert.alert("Not found", "Recipe does not exist");
                    navigation.goBack();
                    return;
                }
                setRecipe(data);
                setFavorites(data.favorites || []);
            } catch (error) {
                console.error("Error fetching recipe:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchRecipe();
    }, [id]);

    const handleToggleFavorite = async () => {
        if (!recipe) return;
        try {
            const userId = getAuth().currentUser?.uid || "guest";
            const updated = await toggleFavorite(recipe.id, userId, favorites);
            setFavorites(updated);
        } catch (error) {
            console.error("Error toggling favorite:", error);
        }
    };

    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color="#3B82F6" />
            </View>
        );
    }

    if (!recipe) {
        return (
            <View style={styles.center}>
                <Text style={{ fontSize: 18 }}>Recipe not found</Text>
            </View>
        );
    }

    return (
        <ScrollView style={styles.container}>
            {/* Image */}
            {recipe.imageUrl ? (
                <Image source={{ uri: recipe.imageUrl }} style={styles.image} />
            ) : (
                <View style={[styles.image, styles.imagePlaceholder]}>
                    <Text style={{ color: "#94A3B8" }}>No Image</Text>
                </View>
            )}

            {/* Title + Favorite */}
            <View style={styles.headerRow}>
                <Text style={styles.title}>{recipe.title}</Text>
                <TouchableOpacity
                    onPress={handleToggleFavorite}
                    style={[
                        styles.favoriteBtn,
                        favorites.includes(getAuth().currentUser?.uid || "guest") &&
                        styles.favoriteBtnActive,
                    ]}
                >
                    <Text style={{ color: "white" }}>
                        {favorites.includes(getAuth().currentUser?.uid || "guest")
                            ? "♥"
                            : "♡"}
                    </Text>
                </TouchableOpacity>
            </View>

            {/* Category */}
            {recipe.category && (
                <Text style={styles.category}>Category: {recipe.category}</Text>
            )}

            {/* Description */}
            <Text style={styles.sectionTitle}>Description</Text>
            <Text style={styles.text}>{recipe.description}</Text>

            {/* Ingredients */}
            <Text style={styles.sectionTitle}>Ingredients</Text>
            {recipe.ingredients.map((ing, idx) => (
                <Text key={idx} style={styles.text}>
                    • {ing}
                </Text>
            ))}

            {/* Instructions */}
            <Text style={styles.sectionTitle}>Instructions</Text>
            {recipe.instructions.map((step, idx) => (
                <Text key={idx} style={styles.text}>
                    {idx + 1}. {step}
                </Text>
            ))}

            <View style={{ height: 40 }} />
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "white" },
    center: { flex: 1, justifyContent: "center", alignItems: "center" },
    image: { width: "100%", height: 220, borderRadius: 12, marginBottom: 16 },
    imagePlaceholder: {
        backgroundColor: "#F1F5F9",
        justifyContent: "center",
        alignItems: "center",
    },
    headerRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    title: { fontSize: 26, fontWeight: "700", flex: 1 },
    favoriteBtn: {
        backgroundColor: "#94A3B8",
        padding: 10,
        borderRadius: 30,
        marginLeft: 10,
    },
    favoriteBtnActive: { backgroundColor: "#EF4444" },
    category: {
        fontSize: 16,
        color: "#475569",
        marginBottom: 12,
        fontWeight: "500",
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: "700",
        marginTop: 20,
        marginBottom: 8,
    },
    text: { fontSize: 16, color: "#334155", marginBottom: 6 },
});

export default RecipeDetail;
