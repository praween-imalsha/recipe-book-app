import React, { useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Alert,
    ActivityIndicator,
    Image,
    ImageBackground,
} from "react-native";
import { useRouter } from "expo-router";
import { MotiView, MotiText } from "moti";
import * as ImagePicker from "expo-image-picker";
import { LinearGradient } from "expo-linear-gradient";
import { register } from "@/services/authService";

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

    const isValidEmail = (email: string) => /\S+@\S+\.\S+/.test(email);

    const handleRegister = async () => {
        if (isLoading) return;

        if (!displayName.trim()) {
            Alert.alert("Error", "Please enter your full name.");
            return;
        }
        if (!email.trim() || !isValidEmail(email.trim())) {
            Alert.alert("Error", "Please enter a valid email address.");
            return;
        }
        if (!password.trim() || password.length < 6) {
            Alert.alert("Error", "Password must be at least 6 characters long.");
            return;
        }

        setIsLoading(true);
        try {
            await register(
                email.trim(),
                password.trim(),
                displayName.trim(),
                photoURL
            );

            Alert.alert("🎉 Success", "Account created! Please login.");
            router.back();
        } catch (err: any) {
            console.error("Register error:", err);

            let message = "Something went wrong. Please try again.";
            if (err.code === "auth/email-already-in-use") {
                message = "This email is already registered.";
            } else if (err.code === "auth/invalid-email") {
                message = "Invalid email format.";
            } else if (err.code === "auth/weak-password") {
                message = "Password is too weak.";
            }

            Alert.alert("Registration failed", message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <ImageBackground
            source={require("@/assets/images/images.jpeg")} // 👈 put your background image here
            resizeMode="cover"
            className="flex-1 justify-center p-6"
        >
            <View className="bg-black/40 absolute inset-0" />

            <MotiText
                from={{ opacity: 0, translateY: -20 }}
                animate={{ opacity: 1, translateY: 0 }}
                transition={{ type: "timing", duration: 700 }}
                className="text-4xl font-extrabold text-white text-center mb-10"
            >
                🥗 Register - MyRecipeBox
            </MotiText>

            <MotiView
                from={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: "spring", delay: 200 }}
                className="bg-white rounded-2xl shadow-xl p-6"
            >

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

                <TextInput
                    placeholder="Full Name"
                    className="bg-gray-100 border border-gray-300 rounded-lg px-4 py-3 mb-4 text-gray-900"
                    placeholderTextColor="#9CA3AF"
                    value={displayName}
                    onChangeText={setDisplayName}
                />

                <TextInput
                    placeholder="Email"
                    className="bg-gray-100 border border-gray-300 rounded-lg px-4 py-3 mb-4 text-gray-900"
                    placeholderTextColor="#9CA3AF"
                    autoCapitalize="none"
                    keyboardType="email-address"
                    value={email}
                    onChangeText={setEmail}
                />

                <TextInput
                    placeholder="Password"
                    className="bg-gray-100 border border-gray-300 rounded-lg px-4 py-3 mb-6 text-gray-900"
                    placeholderTextColor="#9CA3AF"
                    secureTextEntry
                    value={password}
                    onChangeText={setPassword}
                />


                <TouchableOpacity
                    onPress={handleRegister}
                    disabled={isLoading}
                    className="rounded-xl shadow-md overflow-hidden"
                >
                    <LinearGradient
                        colors={["#34d399", "#059669"]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={{ paddingVertical: 14 }}
                    >
                        {isLoading ? (
                            <ActivityIndicator color="#fff" size="small" />
                        ) : (
                            <Text className="text-center text-lg font-bold text-white">
                                Register
                            </Text>
                        )}
                    </LinearGradient>
                </TouchableOpacity>


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
        </ImageBackground>
    );
};

export default Register;
