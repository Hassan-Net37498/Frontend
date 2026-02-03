
import { Commission } from "./Commission";
export interface DateRangeCommissions {
  commissions: Commission[];
  totalAmount: number;
  totalCount: number;
  startDate: string;
  endDate: string;
}