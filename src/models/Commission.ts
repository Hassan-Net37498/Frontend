export interface Commission {
  id: number;
  userId: number;
  userName: string;
  userEmail: string;
  amount: number;
  baseAmount: number;
  commissionRate: number;
  earnedDate: string;
  isPaid: boolean;
}