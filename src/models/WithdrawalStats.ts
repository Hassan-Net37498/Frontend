export interface WithdrawalStats {
  totalRequests: number;
  pendingRequests: number;
  approvedRequests: number;
  rejectedRequests: number;
  totalWithdrawn: number;
  pendingAmount: number;
  availableBalance: number;
}