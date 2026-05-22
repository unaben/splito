import { getGroups } from "@/lib/db";
import { getGroupBalance } from "./getGroupBalance";
import { getRecentActivity } from "./getRecentActivity";

const fetchDashboardData = async (userId: string) => {
  const groups = await getGroups(userId);

  const balancesPromise = Promise.all(
    groups.map((g) => getGroupBalance(g, userId))
  );
  const activityPromise = getRecentActivity(groups);

  const groupBalances = await balancesPromise;
  const recentActivity = await activityPromise;

  return { groupBalances, recentActivity, groups };
};

export default fetchDashboardData;
