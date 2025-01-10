import { useGetLeaderboardQuery } from '../../services';
import { LeaderboardTable } from './LeaderboardTable';

export const LeaderboardPage = () => {
  const { data: leaderboard, isLoading } = useGetLeaderboardQuery({});

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <LeaderboardTable topUsers={leaderboard.topUsers} />
    </div>
  );
};
