import { EarningsChart } from "./EarningsChart";
export interface WeeklyEarnings {
  data: EarningsChart[];
  totalEarnings: number;
  averageDaily: number;
}