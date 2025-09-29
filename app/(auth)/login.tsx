import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Pressable,
    Alert,
    ActivityIndicator,
    ImageBackground,
    StyleSheet
} from "react-native";
import React, { useState } from "react";
import { useRouter } from "expo-router";
import Animated, { FadeInUp, FadeInDown } from "react-native-reanimated";
import { login } from "@/services/authService";

const Login = () => {
    const router = useRouter();
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const handleLogin = async () => {
        if (isLoading) return;
        setIsLoading(true);
        await login(email, password)
            .then((res) => {
                console.log(res);
                router.push("/home");
            })
            .catch((err) => {
                console.error(err);
                Alert.alert("Login failed", "Something went wrong");
            })
            .finally(() => {
                setIsLoading(false);
            });
    };

    return (
        <ImageBackground
            source={require("@/assets/images/download (5).jpeg")} // ✅ put your image inside assets/images folder
            style={styles.background}
            resizeMode="cover"
        >
            <View style={styles.overlay} />

            <View className="flex-1 justify-center p-6">
                {/* Title with animation */}
                <Animated.Text
                    entering={FadeInDown.duration(800)}
                    className="text-3xl font-bold mb-8 text-green-100 text-center"
                >
                    Login to Food Recipe App 🍲
                </Animated.Text>

                {/* Email */}
                <Animated.View entering={FadeInUp.delay(200)}>
                    <TextInput
                        placeholder="Email"
                        className="bg-white border border-gray-300 rounded-xl px-4 py-3 mb-4 text-gray-900 shadow"
                        placeholderTextColor="#9CA3AF"
                        value={email}
                        onChangeText={setEmail}
                    />
                </Animated.View>


                <Animated.View entering={FadeInUp.delay(400)}>
                    <TextInput
                        placeholder="Password"
                        className="bg-white border border-gray-300 rounded-xl px-4 py-3 mb-4 text-gray-900 shadow"
                        placeholderTextColor="#9CA3AF"
                        secureTextEntry
                        value={password}
                        onChangeText={setPassword}
                    />
                </Animated.View>


                <Animated.View entering={FadeInUp.delay(600)}>
                    <TouchableOpacity
                        className="bg-green-600 p-4 rounded-2xl mt-2 shadow-lg"
                        onPress={handleLogin}
                        activeOpacity={0.8}
                    >
                        {isLoading ? (
                            <ActivityIndicator color="#fff" size="large" />
                        ) : (
                            <Text className="text-center text-2xl text-white font-semibold">
                                Login
                            </Text>
                        )}
                    </TouchableOpacity>
                </Animated.View>


                <Animated.View entering={FadeInUp.delay(800)}>
                    <Pressable onPress={() => router.push("/register")}>
                        <Text className="text-center text-green-200 text-lg mt-4 underline">
                            Don’t have an account? Register
                        </Text>
                    </Pressable>
                </Animated.View>
            </View>
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    background: {
        flex: 1,
        width: "100%",
        height: "100%",
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: "rgba(0,0,0,0.4)", // semi-transparent overlay
    },
});

export default Login;
