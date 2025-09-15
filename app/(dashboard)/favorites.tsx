// screens/Favorites.tsx
import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from "react-native";
import { useNavigation, useIsFocused } from "@react-navigation/native";
import { getAuth } from "firebase/auth";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/firebase";
import { Recipe } from "@/types/Recipe";
import RecipeCard from "@/components/RecipeCard";

const Favorites: React.FC = () => {
    const [favorites, setFavorites] = useState<Recipe[]>([]);
    const [loading, setLoading] = useState(true);

    const navigation = useNavigation<any>();
    const isFocused = useIsFocused();
    const user = getAuth().currentUser;

    const fetchFavorites = async () => {
        if (!user) return;
        try {
            const q = query(collection(db, "recipes"), where("favorites", "array-contains", user.uid));
            const snapshot = await getDocs(q);
            const favRecipes = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...(doc.data() as Omit<Recipe, "id">),
            }));
            setFavorites(favRecipes);
        } catch (e) {
            console.error("🔥 Error fetching favorites:", e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isFocused) fetchFavorites();
    }, [isFocused, user]);

    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color="#7e22ce" />
            </View>
        );
    }

    if (favorites.length === 0) {
        return (
            <View style={styles.center}>
                <Text style={styles.emptyText}>💜 No favorites yet!</Text>
                <Text style={styles.subText}>Add some recipes to your favorites.</Text>
            </View>
        );
    }

    return (
        <FlatList
            data={favorites}
            renderItem={({ item }) => (
                <RecipeCard
                    recipe={item}
                    onPress={() => navigation.navigate("RecipeDetail", { recipeId: item.id })}
                />
            )}
            keyExtractor={(item) => item.id}
            numColumns={2}
            contentContainerStyle={styles.list}
        />
    );
};

export default Favorites;

const styles = StyleSheet.create({
    list: { padding: 12 },
    center: { flex: 1, justifyContent: "center", alignItems: "center" },
    emptyText: { fontSize: 18, fontWeight: "600", color: "#7e22ce" },
    subText: { fontSize: 14, marginTop: 6, color: "#6b7280" },
});
