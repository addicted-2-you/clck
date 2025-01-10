import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const leaderboardApi = createApi({
  reducerPath: 'leaderboardApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://1zva7jb68a.execute-api.eu-west-1.amazonaws.com',
    prepareHeaders: (headers, { getState }) => {
      const token = localStorage.getItem('token');
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }

      return headers;
    },
  }),
  endpoints: (builder) => ({
    getLeaderboard: builder.query({
      query: () => ({
        url: 'ClckApp_GetLeaderboard',
        method: 'GET',
      }),
    }),

    updateClicks: builder.mutation({
      query: (userData) => ({
        url: `leaderboard/${userData.id}`,
        method: 'PUT',
        body: userData,
      }),
    }),
  }),
});

export const { useGetLeaderboardQuery, useUpdateClicksMutation } =
  leaderboardApi;
