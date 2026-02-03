import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Withdrawal } from '../../models/Withdrawal ';
import { WithdrawalService } from '../withdrawal-service';
import { WithdrawalStats } from '../../models/WithdrawalStats';
@Component({
  selector: 'app-withdrawal-component',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './withdrawal-component.html',
  styleUrl: './withdrawal-component.sass',
})
export class WithdrawalComponent {
withdrawals: Withdrawal[] = [];
  stats: WithdrawalStats | null = null;
  loading = false;
  error = '';

  // Pagination
  currentPage = 1;
  pageSize = 10;
  totalItems = 0;
  totalPages = 0;

  // Filter
  filterStatus: string = 'all'; // 'all', 'pending', 'approved', 'rejected'

  // Modal
  showRequestModal = false;
  withdrawalForm: FormGroup;
  submitting = false;

  constructor(
    private withdrawalService: WithdrawalService,
    private fb: FormBuilder
  ) {
    this.withdrawalForm = this.fb.group({
      amount: ['', [Validators.required, Validators.min(1)]],
      notes: ['']
    });
  }

  ngOnInit(): void {
    this.loadStats();
    this.loadWithdrawals();
  }

  loadStats(): void {
    this.withdrawalService.getStats().subscribe({
      next: (response) => {
        if (response.success) {
          this.stats = response.data;
        }
      },
      error: (error) => {
        console.error('Error loading stats:', error);
      }
    });
  }

  loadWithdrawals(): void {
    this.loading = true;
    this.error = '';

    const status = this.filterStatus === 'all' ? undefined : this.filterStatus;

    this.withdrawalService.getWithdrawals(this.currentPage, this.pageSize, status).subscribe({
      next: (response) => {
        if (response.success) {
          this.withdrawals = response.data.items;
          this.totalItems = response.data.totalItems;
          this.totalPages = response.data.totalPages;
          this.currentPage = response.data.currentPage;
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading withdrawals:', error);
        this.error = 'Failed to load withdrawals';
        this.loading = false;
      }
    });
  }

  onFilterChange(): void {
    this.currentPage = 1;
    this.loadWithdrawals();
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.loadWithdrawals();
    }
  }

  openRequestModal(): void {
    // Check if there's already a pending withdrawal
    if (this.stats && this.stats.pendingRequests > 0) {
      alert('You already have a pending withdrawal request. Please wait for it to be processed.');
      return;
    }

    // Check if there's available balance
    if (this.stats && this.stats.availableBalance <= 0) {
      alert('Insufficient balance for withdrawal.');
      return;
    }

    this.withdrawalForm.reset();
    this.showRequestModal = true;
  }

  closeRequestModal(): void {
    this.showRequestModal = false;
  }

  submitWithdrawal(): void {
    if (this.withdrawalForm.invalid) {
      return;
    }

    const formValue = this.withdrawalForm.value;

    // Validate amount against available balance
    if (this.stats && formValue.amount > this.stats.availableBalance) {
      alert(`Amount exceeds available balance of ${this.formatCurrency(this.stats.availableBalance)}`);
      return;
    }

    this.submitting = true;

    this.withdrawalService.createWithdrawal(formValue).subscribe({
      next: (response) => {
        if (response.success) {
          this.closeRequestModal();
          this.loadStats();
          this.loadWithdrawals();
          alert('Withdrawal request submitted successfully!');
        }
        this.submitting = false;
      },
      error: (error) => {
        console.error('Error submitting withdrawal:', error);
        alert(error.error?.message || 'Failed to submit withdrawal request');
        this.submitting = false;
      }
    });
  }

  cancelWithdrawal(withdrawal: Withdrawal): void {
    if (withdrawal.status !== 'Pending') {
      alert('Only pending withdrawals can be cancelled.');
      return;
    }

    if (confirm('Are you sure you want to cancel this withdrawal request?')) {
      this.withdrawalService.cancelWithdrawal(withdrawal.id).subscribe({
        next: (response) => {
          if (response.success) {
            this.loadStats();
            this.loadWithdrawals();
            alert('Withdrawal cancelled successfully');
          }
        },
        error: (error) => {
          console.error('Error cancelling withdrawal:', error);
          alert('Failed to cancel withdrawal');
        }
      });
    }
  }

  getStatusClass(status: string): string {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'bg-warning text-dark';
      case 'approved':
        return 'bg-success';
      case 'rejected':
        return 'bg-danger';
      default:
        return 'bg-secondary';
    }
  }

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(value);
  }

  formatDateTime(dateString: string): string {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  get pageNumbers(): number[] {
    const pages: number[] = [];
    const maxPagesToShow = 5;
    
    let startPage = Math.max(1, this.currentPage - 2);
    let endPage = Math.min(this.totalPages, startPage + maxPagesToShow - 1);
    
    if (endPage - startPage < maxPagesToShow - 1) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    
    return pages;
  }
}
