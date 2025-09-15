//// screens/AddRecipeScreen.tsx
import React, { useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Image,
    ScrollView,
    ActivityIndicator,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import Animated, { FadeInUp } from "react-native-reanimated";
import { getAuth } from "firebase/auth";
import * as ImagePicker from "expo-image-picker";

import { RecipeService } from "@/services/RecipeService";
import { Recipe } from "@/types/Recipe";

const MyRecipes: React.FC = () => {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [ingredients, setIngredients] = useState("");
    const [instructions, setInstructions] = useState("");
    const [category, setCategory] = useState("");

    // ✅ Separate local preview and uploaded URL
    const [localImageUri, setLocalImageUri] = useState<string | null>(null);
    const [downloadUrl, setDownloadUrl] = useState<string | null>(null);

    const [uploading, setUploading] = useState(false);
    const [imageUploading, setImageUploading] = useState(false);

    const navigation = useNavigation();
    const auth = getAuth();
    const user = auth.currentUser;

    // Permissions
    const requestGalleryPermission = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== "granted") {
            Alert.alert("Permission Required", "Gallery access is required!");
            return false;
        }
        return true;
    };

    // Pick Image
    const pickImageFromGallery = async () => {
        const hasPermission = await requestGalleryPermission();
        if (!hasPermission) return;

        try {
            setImageUploading(true);
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images, // ✅ FIXED
                allowsEditing: true,
                aspect: [16, 9],
                quality: 0.8,
            });

            if (!result.canceled && result.assets[0]) {
                const localUri = result.assets[0].uri;
                setLocalImageUri(localUri); // ✅ Show immediately

                // Upload to Firebase
                const url = await RecipeService.uploadImageToFirebase(localUri);
                if (url) setDownloadUrl(url);
            }
        } catch (err) {
            console.error("Gallery error:", err);
            Alert.alert("Error", "Failed to pick image");
        } finally {
            setImageUploading(false);
        }
    };

    // Save Recipe
    const handleAddRecipe = async () => {
        if (!title || !description || !ingredients || !instructions || !category) {
            Alert.alert("Validation", "Please fill all fields!");
            return;
        }

        if (!user) {
            Alert.alert("Error", "You must be logged in to add a recipe!");
            return;
        }

        try {
            setUploading(true);
            const recipeData: Omit<Recipe, "id"> = {
                title,
                description,
                ingredients: ingredients.split(",").map((i) => i.trim()),
                instructions: instructions.split(",").map((i) => i.trim()),
                category,
                authorId: user.uid,
                favorites: [],
                imageUrl: downloadUrl || "", // ✅ Save uploaded URL
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            await RecipeService.addRecipe(recipeData);
            Alert.alert("Success", "Recipe added!", [
                { text: "OK", onPress: () => navigation.goBack() },
            ]);
        } catch (err) {
            console.error("Error adding recipe:", err);
            Alert.alert("Error", "Something went wrong!");
        } finally {
            setUploading(false);
        }
    };

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
            <ScrollView
                style={styles.container}
                contentContainerStyle={{ paddingBottom: 30 }}
                keyboardShouldPersistTaps="handled"
            >
                <Animated.Text
                    entering={FadeInUp.delay(200).duration(600)}
                    style={styles.title}
                >
                    Add a New Recipe 🍳
                </Animated.Text>

                {/* Image Picker */}
                <TouchableOpacity
                    style={styles.imagePicker}
                    onPress={pickImageFromGallery}
                    disabled={imageUploading}
                >
                    {imageUploading ? (
                        <ActivityIndicator size="large" color="#7e22ce" />
                    ) : localImageUri ? (
                        <View style={styles.imageContainer}>
                            <Image source={{ uri: localImageUri }} style={styles.image} />
                            <TouchableOpacity
                                style={styles.changeImageButton}
                                onPress={pickImageFromGallery}
                            >
                                <Text style={styles.changeImageText}>Change</Text>
                            </TouchableOpacity>
                        </View>
                    ) : (
                        <Text style={styles.imageText}>📷 Pick an image</Text>
                    )}
                </TouchableOpacity>

                {/* Inputs */}
                <TextInput
                    style={styles.input}
                    placeholder="Title"
                    value={title}
                    onChangeText={setTitle}
                />
                <TextInput
                    style={[styles.input, styles.textArea]}
                    placeholder="Description"
                    value={description}
                    onChangeText={setDescription}
                    multiline
                />
                <TextInput
                    style={[styles.input, styles.textArea]}
                    placeholder="Ingredients (comma separated)"
                    value={ingredients}
                    onChangeText={setIngredients}
                    multiline
                />
                <TextInput
                    style={[styles.input, styles.textArea]}
                    placeholder="Instructions (comma separated)"
                    value={instructions}
                    onChangeText={setInstructions}
                    multiline
                />
                <TextInput
                    style={styles.input}
                    placeholder="Category"
                    value={category}
                    onChangeText={setCategory}
                />

                {/* Save Button */}
                <TouchableOpacity
                    style={[
                        styles.button,
                        (uploading || imageUploading) && styles.buttonDisabled,
                    ]}
                    onPress={handleAddRecipe}
                    disabled={uploading || imageUploading}
                >
                    {uploading ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <Text style={styles.buttonText}>Save Recipe</Text>
                    )}
                </TouchableOpacity>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

export default MyRecipes;

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#fff", padding: 16 },
    title: {
        fontSize: 28,
        fontWeight: "bold",
        marginBottom: 20,
        textAlign: "center",
        color: "#7e22ce",
    },
    imagePicker: {
        height: 200,
        backgroundColor: "#f3e8ff",
        borderRadius: 12,
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 16,
        borderWidth: 2,
        borderColor: "#e5e7eb",
        borderStyle: "dashed",
        overflow: "hidden",
    },
    imageContainer: { width: "100%", height: "100%" },
    image: { width: "100%", height: "100%", borderRadius: 12 },
    imageText: { color: "#7e22ce", fontWeight: "600", fontSize: 16 },
    changeImageButton: {
        position: "absolute",
        bottom: 10,
        right: 10,
        backgroundColor: "rgba(126, 34, 206, 0.8)",
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 6,
    },
    changeImageText: { color: "#fff", fontSize: 12, fontWeight: "600" },
    input: {
        borderWidth: 1,
        borderColor: "#d1d5db",
        borderRadius: 8,
        padding: 12,
        marginBottom: 12,
        fontSize: 16,
        backgroundColor: "#f9fafb",
    },
    textArea: { height: 80, textAlignVertical: "top" },
    button: {
        backgroundColor: "#7e22ce",
        padding: 16,
        borderRadius: 12,
        alignItems: "center",
        marginTop: 10,
    },
    buttonDisabled: { opacity: 0.6 },
    buttonText: { color: "#fff", fontSize: 18, fontWeight: "bold" },
});
