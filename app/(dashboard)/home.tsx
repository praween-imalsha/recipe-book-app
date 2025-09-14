// src/screens/Home.tsx
import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    TextInput,
    ActivityIndicator,
    FlatList,
    TouchableOpacity,
    StyleSheet,
} from "react-native";
import { getAuth } from "firebase/auth";
import { Recipe } from "@/types/Recipe";
import RecipeCard from "@/components/RecipeCard";
import { RecipeService } from "@/services/RecipeService";

const Home: React.FC = () => {
    const [recipes, setRecipes] = useState<Recipe[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("All");

    const categories = ["All", "Breakfast", "Lunch", "Dinner", "Snack", "Dessert"];

    const auth = getAuth();
    const currentUserId = auth.currentUser?.uid || ""; // ✅ pass to RecipeCard

    // Fetch recipes
    const fetchRecipes = async () => {
        try {
            setLoading(true);

            if (!currentUserId) {
                console.log("User not logged in");
                setRecipes([]);
                return;
            }

            let data: Recipe[] = [];

            if (search.trim() !== "") {
                data = await RecipeService.searchRecipes(search);
            } else if (category !== "All") {
                data = await RecipeService.getRecipesByCategory(category);
            } else {
                data = await RecipeService.getAllRecipes();
            }

            // Add fallback image if missing
            data = data.map((recipe) => ({
                ...recipe,
                imageUrl: recipe.imageUrl || "https://via.placeholder.com/150",
            }));

            setRecipes(data);
        } catch (error) {
            console.error("Error fetching recipes:", error);
            setRecipes([]);
        } finally {
            setLoading(false);
        }
    };

    // Fetch on first load
    useEffect(() => {
        fetchRecipes();
    }, []);

    // Refetch whenever search or category changes
    useEffect(() => {
        fetchRecipes();
    }, [search, category]);

    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color="#7e22ce" />
                <Text style={styles.loadingText}>Loading recipes...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>All Recipes</Text>

            {/* Search Input */}
            <TextInput
                style={styles.input}
                placeholder="Search recipes..."
                value={search}
                onChangeText={setSearch}
            />

            {/* Category Filter */}
            <View style={styles.categoryContainer}>
                {categories.map((cat) => (
                    <TouchableOpacity
                        key={cat}
                        style={[styles.categoryButton, category === cat && styles.activeCategory]}
                        onPress={() => {
                            setCategory(cat);
                            setSearch(""); // reset search when selecting category
                        }}
                    >
                        <Text
                            style={[styles.categoryText, category === cat && styles.activeCategoryText]}
                        >
                            {cat}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            {/* Recipes List */}
            {recipes.length === 0 ? (
                <Text style={styles.noRecipes}>No recipes found.</Text>
            ) : (
                <FlatList
                    data={recipes}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <RecipeCard recipe={item} currentUserId={currentUserId} />
                    )}
                    numColumns={2}
                    columnWrapperStyle={{ justifyContent: "space-between" }}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, padding: 16, backgroundColor: "#fff" },
    center: { flex: 1, justifyContent: "center", alignItems: "center" },
    loadingText: { marginTop: 10, fontSize: 16, fontWeight: "600", color: "#555" },
    title: { fontSize: 28, fontWeight: "bold", marginBottom: 16, color: "#7e22ce" },
    input: { borderWidth: 1, borderColor: "#ccc", padding: 10, borderRadius: 8, marginBottom: 12 },
    categoryContainer: { flexDirection: "row", flexWrap: "wrap", marginBottom: 16 },
    categoryButton: { padding: 8, borderRadius: 20, borderWidth: 1, borderColor: "#7e22ce", marginRight: 8, marginBottom: 8 },
    activeCategory: { backgroundColor: "#7e22ce" },
    categoryText: { color: "#7e22ce" },
    activeCategoryText: { color: "#fff" },
    noRecipes: { textAlign: "center", marginTop: 20, fontSize: 16, color: "#888" },
});

export default Home;
