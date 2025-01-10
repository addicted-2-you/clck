import { configureStore } from '@reduxjs/toolkit';

import { leaderboardApi } from './services';

export const store = configureStore({
  reducer: {
    [leaderboardApi.reducerPath]: leaderboardApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(leaderboardApi.middleware),
});
