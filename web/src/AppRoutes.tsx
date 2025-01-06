import { Navigate, Route, Routes } from 'react-router';
import { useAuth } from 'react-oidc-context';

import Layout from './Layout';
import { HomePage } from './features/home/Home.page';
import { LeaderboardPage } from './features/leaderboard/Leaderboard.page';
import { LandingPage } from './features/landing/Landing.page';

export const AppRoutes = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Routes>
      <Route element={<Layout />}>
        <Route
          index
          element={isAuthenticated ? <HomePage /> : <LandingPage />}
        />
        <Route
          path="leaderboard"
          element={
            isAuthenticated ? <LeaderboardPage /> : <Navigate to="/" replace />
          }
        />
      </Route>
    </Routes>
  );
};
