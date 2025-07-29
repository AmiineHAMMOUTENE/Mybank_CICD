export interface Operation {
    id: number;
    label: string;
    amount: number;
    date: string;
    category: string; // API returns category as a string (e.g., "/api/categories/1")
}

export interface Category {
    id: number;
    title: string;
    operations: string[]; // List of operation URLs
}