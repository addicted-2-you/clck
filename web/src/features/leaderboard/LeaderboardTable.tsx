import { UserClicks } from './types';

interface Props {
  topUsers: UserClicks[];
}

export const LeaderboardTable = ({ topUsers }: Props) => {
  return (
    <table className="max-h-full w-full overflow-y-auto">
      <thead>
        <tr>
          <th className="border-[1px] border-black text-center">Pos</th>
          <th className="border-[1px] border-black text-center">User</th>
          <th className="border-[1px] border-black text-center">Clicks</th>
        </tr>
      </thead>
      <tbody>
        {topUsers.map((tu) => (
          <tr key={tu.userId}>
            <td className="border-[1px] border-black text-center">-</td>
            <td className="border-[1px] border-black text-center">
              {tu.username}
            </td>
            <td className="border-[1px] border-black text-center">
              {tu.clicksCount}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};
