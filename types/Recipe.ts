export interface Recipe {
    id: string;
    title: string;
    description: string;
    ingredients: string[];
    instructions: string[];
    imageUrl?: string
    category?: string;
    authorId: string;
    favorites?: string[];
    createdAt?: string | Date;
    updatedAt?: string | Date;
}
