export interface Withdrawal {
  id: number;
  amount: number;
  status: string;
  requestedDate: string;
  processedDate?: string;
  notes?: string;
  rejectionReason?: string;
}