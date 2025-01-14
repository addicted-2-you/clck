export type UserClicks = {
  userId: string;
  username: string;
  clicksCount: number;
  position: number;
};

export type LeaderboardResponse = {
  currentUser: UserClicks;
  topUsers: UserClicks[];
};
