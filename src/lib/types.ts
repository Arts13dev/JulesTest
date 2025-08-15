export type Product = {
  id: string;
  created_at: string;
  name: string;
  description: string | null;
  price: number;
  image_url: string | null;
  category: 'weaves' | 'smartphones' | 'laptops' | 'perfumes';
  condition: 'new' | 'used';
  stock: number;
  user_id: string | null;
};
