export type UserClicks = {
  userId: string;
  clicksCount: number;
};

export type LeaderboardResponse = {
  currentUser: UserClicks;
  topUsers: UserClicks[];
};
