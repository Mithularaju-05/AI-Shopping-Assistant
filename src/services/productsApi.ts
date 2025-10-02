import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image_url: string;
  stock: number;
}

export const productsApi = createApi({
  reducerPath: 'productsApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:8000/api' }),
  endpoints: (builder) => ({
    getProducts: builder.query<{ products: Product[] }, { category?: string; limit?: number; skip?: number }>({
      query: ({ category, limit = 10, skip = 0 }) => ({
        url: 'products',
        params: { category, limit, skip },
      }),
    }),
    getProduct: builder.query<Product, string>({
      query: (id) => `products/${id}`,
    }),
    getRecommendations: builder.query<{ products: Product[] }, { userId: string; limit?: number }>({
      query: ({ userId, limit = 5 }) => ({
        url: `recommendations/${userId}`,
        params: { limit },
      }),
    }),
  }),
});

export const { useGetProductsQuery, useGetProductQuery, useGetRecommendationsQuery } = productsApi;
