import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
}

export interface ChatResponse {
  response: string;
  suggestions?: string[];
  products?: Array<{
    id: string;
    name: string;
    price: number;
    image_url: string;
  }>;
}

export const assistantApi = createApi({
  reducerPath: 'assistantApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:8000/api' }),
  endpoints: (builder) => ({
    sendMessage: builder.mutation<ChatResponse, { userId: string; message: string }>({
      query: ({ userId, message }) => ({
        url: 'chat',
        method: 'POST',
        body: { userId, message },
      }),
    }),
    analyzeSentiment: builder.mutation<{ sentiment: string; confidence: number }, { text: string }>({
      query: ({ text }) => ({
        url: 'analyze-sentiment',
        method: 'POST',
        body: { text },
      }),
    }),
    findSimilarProducts: builder.mutation<Array<{ id: string; name: string; image_url: string; price: number }>, { imageUrl: string }>({
      query: ({ imageUrl }) => ({
        url: 'visual-search',
        method: 'POST',
        body: { image_url: imageUrl },
      }),
    }),
  }),
});

export const {
  useSendMessageMutation,
  useAnalyzeSentimentMutation,
  useFindSimilarProductsMutation,
} = assistantApi;
