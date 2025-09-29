import {
    View,
    Text,
    ScrollView,
    Image,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    ActivityIndicator,
    Dimensions,
} from "react-native";
import React, { useEffect, useState } from "react";
import {
    getAllRecipes,
    getRecipesByCategory,
    searchRecipes,
    toggleFavorite,
} from "@/services/RecipeService";
import { Recipe } from "@/types/Recipe";
import { useNavigation } from "@react-navigation/native";
import { getAuth } from "firebase/auth";

const { width: screenWidth } = Dimensions.get("window");

const categories = ["All", "Breakfast", "Lunch", "Dinner", "Dessert"];

const Home = () => {
    const [recipes, setRecipes] = useState<Recipe[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All");
    const navigation = useNavigation<any>();
    const userId = getAuth().currentUser?.uid || "guest";

    useEffect(() => {
        fetchRecipes();
    }, [selectedCategory, searchQuery]);

    const fetchRecipes = async () => {
        try {
            setLoading(true);

            let data: Recipe[] = [];
            if (searchQuery.trim()) {
                data = await searchRecipes(searchQuery);
            } else if (selectedCategory !== "All") {
                data = await getRecipesByCategory(selectedCategory);
            } else {
                data = await getAllRecipes();
            }

            setRecipes(data);
        } catch (error) {
            console.error("Error fetching recipes:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleFavorite = async (recipe: Recipe) => {
        try {
            const updatedFavorites = await toggleFavorite(
                recipe.id,
                userId,
                recipe.favorites || []
            );

            setRecipes((prev) =>
                prev.map((r) =>
                    r.id === recipe.id ? { ...r, favorites: updatedFavorites } : r
                )
            );
        } catch (error) {
            console.error("Error updating favorite:", error);
        }
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#3B82F6" />
                <Text style={styles.loadingText}>Loading recipes...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.title}>Recipes</Text>
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search recipes..."
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                />
            </View>


            <View style={styles.categoryWrapper}>
                {categories.map((cat) => (
                    <TouchableOpacity
                        key={cat}
                        style={[
                            styles.categoryChip,
                            selectedCategory === cat && styles.categoryChipActive,
                        ]}
                        onPress={() => {
                            setSelectedCategory(cat);
                            setSearchQuery("");
                        }}
                    >
                        <Text
                            style={[
                                styles.categoryText,
                                selectedCategory === cat && styles.categoryTextActive,
                            ]}
                        >
                            {cat}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>


            <ScrollView
                style={styles.scrollView}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {recipes.length === 0 ? (
                    <Text style={styles.emptyText}>No recipes found</Text>
                ) : (
                    recipes.map((recipe, index) => (
                        <View
                            key={recipe.id}
                            style={[
                                styles.card,
                                { marginTop: index === 0 ? 0 : 16 },
                            ]}
                        >
                            {recipe.imageUrl && (
                                <Image
                                    source={{ uri: recipe.imageUrl }}
                                    style={styles.recipeImage}
                                    resizeMode="cover"
                                />
                            )}

                            <View style={styles.cardContent}>
                                <Text style={styles.recipeTitle} numberOfLines={1}>
                                    {recipe.title}
                                </Text>
                                <Text style={styles.recipeDescription} numberOfLines={2}>
                                    {recipe.description}
                                </Text>

                                <View style={styles.cardActions}>
                                    <TouchableOpacity
                                        style={styles.favoriteButton}
                                        onPress={() => handleFavorite(recipe)}
                                    >
                                        <Text style={{ fontSize: 20 }}>
                                            {recipe.favorites?.includes(userId) ? "❤️" : "🤍"}
                                        </Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        style={styles.viewButton}
                                        onPress={() => navigation.navigate("RecipeDetail", { id: recipe.id })}
                                    >
                                        <Text style={styles.viewButtonText}>View More</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    ))
                )}

                <View style={styles.bottomSpacing} />
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#F8FAFC" },

    header: { padding: 16, backgroundColor: "white" },
    title: { fontSize: 28, fontWeight: "700", marginBottom: 12 },
    searchInput: {
        borderWidth: 1,
        borderColor: "#CBD5E1",
        borderRadius: 12,
        paddingHorizontal: 14,
        paddingVertical: 10,
        backgroundColor: "#F1F5F9",
        fontSize: 16,
    },

    categoryWrapper: {
        flexDirection: "row",
        flexWrap: "wrap",
        paddingHorizontal: 12,
        paddingVertical: 12,
        gap: 10,
    },
    categoryChip: {
        paddingHorizontal: 18,
        paddingVertical: 10,
        backgroundColor: "#E2E8F0",
        borderRadius: 25,
        marginRight: 8,
        marginBottom: 10,
        shadowColor: "#000",
        shadowOpacity: 0.05,
        shadowRadius: 3,
        elevation: 2,
    },
    categoryChipActive: { backgroundColor: "#3B82F6" },
    categoryText: { fontSize: 15, color: "#334155", fontWeight: "500" },
    categoryTextActive: { color: "white", fontWeight: "700" },

    scrollView: { flex: 1 },
    scrollContent: { padding: 16 },

    card: {
        backgroundColor: "white",
        borderRadius: 18,
        overflow: "hidden",
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 3,
    },
    recipeImage: {
        width: "100%",
        height: screenWidth * 0.5,
    },
    cardContent: { padding: 16 },
    recipeTitle: { fontSize: 20, fontWeight: "700", marginBottom: 6 },
    recipeDescription: { fontSize: 14, color: "#64748B" },

    cardActions: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 14,
        alignItems: "center",
    },
    favoriteButton: { padding: 6 },
    viewButton: {
        backgroundColor: "#3B82F6",
        paddingHorizontal: 18,
        paddingVertical: 10,
        borderRadius: 10,
    },
    viewButtonText: { color: "white", fontWeight: "600", fontSize: 14 },

    loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
    loadingText: { marginTop: 12, fontSize: 16, color: "#64748B" },
    emptyText: {
        textAlign: "center",
        marginTop: 40,
        fontSize: 16,
        color: "#64748B",
    },
    bottomSpacing: { height: 50 },
});

export default Home;
