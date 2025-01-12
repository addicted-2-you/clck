import { useGetLeaderboardQuery } from '../../services';
import { LeaderboardTable } from './LeaderboardTable';

export const LeaderboardPage = () => {
  const { data: leaderboard, isLoading } = useGetLeaderboardQuery({});

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex justify-center">
      <div className="w-2/3">
        <LeaderboardTable topUsers={leaderboard.topUsers} />
      </div>
    </div>
  );
};
