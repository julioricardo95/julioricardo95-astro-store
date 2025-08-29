export interface Product {
  id: string;
  name: string;
  category: string;
  categorySlug: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  description: string;
  shortDescription: string;
  features: string[];
  specifications: Record<string, string>;
  images: string[];
  stock: number;
  featured: boolean;
  tags?: string[];
}

export interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  author: string;
  publishDate: string;
  readTime: number;
  category: string;
  categorySlug: string;
  image: string;
  tags: string[];
  featured: boolean;
}