export interface Recipe {
    id: string;                // Firestore doc id
    title: string;             // Recipe title
    description: string;       // Short description
    ingredients: string[];     // Ingredients list
    instructions: string[];    // Step-by-step instructions
    imageUrl?: string;         // Firebase Storage image URL
    category?: string;         // e.g. Breakfast, Lunch, Dinner
    authorId: string;          // Firebase Auth user.uid
    favorites?: string[];      // user IDs who favorited
    createdAt: Date;           // Created timestamp
    updatedAt?: Date;          // Updated timestamp
}
