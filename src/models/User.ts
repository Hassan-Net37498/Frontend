export interface User {
  id: number;
  fullName: string;
  email: string;
  phoneNumber?: string;
  country?: string;
  totalDeposits: number;
  totalWagers: number;
  totalLosses: number;
  isBlocked: boolean;
  createdAt: string;
}