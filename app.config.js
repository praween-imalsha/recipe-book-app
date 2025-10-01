export default ({ config }) => ({
    ...config,
    name: "Recipe-Book",
    slug: "RecipeBook",
    android: {
        package: "com.praween.recipebook", // ✅ must be unique for Google Play
        adaptiveIcon: {
            foregroundImage: "./assets/images/book.png",
            backgroundColor: "#ffffff",
        },
        edgeToEdgeEnabled: true,
    },

    extra: {
        eas: {
            projectId: "d163d30b-70cc-4c86-977c-db5d0649a7d2",
        },
        mockApi: process.env.EXPO_BASE_API_URL,
    },
});
