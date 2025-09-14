import React, { useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Alert,
    ActivityIndicator,
    Image,
} from "react-native";
import { useRouter } from "expo-router";
import { MotiView, MotiText } from "moti";
import * as ImagePicker from "expo-image-picker";
import { register } from "@/services/authService"; // ✅ use service, not firebase/auth directly

const Register: React.FC = () => {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [displayName, setDisplayName] = useState("");
    const [photoURL, setPhotoURL] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handlePickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.7,
        });

        if (!result.canceled) {
            setPhotoURL(result.assets[0].uri);
        }
    };

    const handleRegister = async () => {
        if (isLoading) return;
        setIsLoading(true);

        try {
            await register(email, password, displayName, photoURL);

            Alert.alert("🎉 Success", "Account created! Please login.");
            router.back(); // ✅ go back to login
        } catch (err: any) {
            console.error("Register error:", err);
            Alert.alert("Registration failed", err.message || "Something went wrong");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <View className="flex-1 bg-gradient-to-b from-green-100 to-green-300 justify-center p-6">
            {/* Animated Title */}
            <MotiText
                from={{ opacity: 0, translateY: -20 }}
                animate={{ opacity: 1, translateY: 0 }}
                transition={{ type: "timing", duration: 700 }}
                className="text-4xl font-extrabold text-green-800 text-center mb-10"
            >
                🥗 Register - MyRecipeBox
            </MotiText>

            {/* Card */}
            <MotiView
                from={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: "spring", delay: 200 }}
                className="bg-white rounded-2xl shadow-xl p-6"
            >
                {/* Profile Picture Picker */}
                <View className="items-center mb-4">
                    {photoURL ? (
                        <Image
                            source={{ uri: photoURL }}
                            className="w-24 h-24 rounded-full mb-2"
                        />
                    ) : (
                        <View className="w-24 h-24 rounded-full bg-gray-200 items-center justify-center mb-2">
                            <Text className="text-gray-500">No Photo</Text>
                        </View>
                    )}

                    <TouchableOpacity
                        className="bg-green-500 px-4 py-2 rounded-lg"
                        onPress={handlePickImage}
                    >
                        <Text className="text-white font-semibold">Select Photo</Text>
                    </TouchableOpacity>
                </View>

                {/* Display Name */}
                <TextInput
                    placeholder="Full Name"
                    className="bg-gray-100 border border-gray-300 rounded-lg px-4 py-3 mb-4 text-gray-900"
                    placeholderTextColor="#9CA3AF"
                    value={displayName}
                    onChangeText={setDisplayName}
                />

                {/* Email */}
                <TextInput
                    placeholder="Email"
                    className="bg-gray-100 border border-gray-300 rounded-lg px-4 py-3 mb-4 text-gray-900"
                    placeholderTextColor="#9CA3AF"
                    autoCapitalize="none"
                    keyboardType="email-address"
                    value={email}
                    onChangeText={setEmail}
                />

                {/* Password */}
                <TextInput
                    placeholder="Password"
                    className="bg-gray-100 border border-gray-300 rounded-lg px-4 py-3 mb-6 text-gray-900"
                    placeholderTextColor="#9CA3AF"
                    secureTextEntry
                    value={password}
                    onChangeText={setPassword}
                />

                {/* Register Button */}
                <TouchableOpacity
                    className="bg-gradient-to-r from-emerald-400 to-emerald-600 p-4 rounded-xl shadow-md"
                    onPress={handleRegister}
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <ActivityIndicator color="#fff" size="small" />
                    ) : (
                        <Text className="text-center text-lg font-bold text-green-500">
                            Register
                        </Text>
                    )}
                </TouchableOpacity>

                {/* Back to Login */}
                <MotiText
                    from={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 500, duration: 600 }}
                    className="text-center text-green-700 text-base mt-4"
                    onPress={() => router.back()}
                >
                    Already have an account? Login
                </MotiText>
            </MotiView>
        </View>
    );
};

export default Register;
