import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CommissionService } from '../commission-service';
import { Commission } from '../../models/Commission';
import { CommissionSummary } from '../../models/CommissionSummary ';


@Component({
  selector: 'app-commission-list-component',
  imports: [CommonModule,FormsModule],
  templateUrl: './commission-list-component.html',
  styleUrl: './commission-list-component.sass',
})
export class CommissionListComponent implements OnInit {
commissions: Commission[] = [];
  summary: CommissionSummary | null = null;
  loading = false;
  error = '';

  // Pagination
  currentPage = 1;
  pageSize = 20;
  totalItems = 0;
  totalPages = 0;

  // Filters
  startDate = '';
  endDate = '';
  filterStatus: string = 'all'; // 'all', 'paid', 'pending'

  // Export
  exporting = false;

  constructor(private commissionService: CommissionService) {}

  ngOnInit(): void {
    this.setDefaultDates();
    this.loadSummary();
    this.loadCommissions();
  }

  setDefaultDates(): void {
    const today = new Date();
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    
    this.endDate = this.formatDate(today);
    this.startDate = this.formatDate(firstDayOfMonth);
  }

  loadSummary(): void {
    this.commissionService.getSummary().subscribe({
      next: (response) => {
        if (response.success) {
          this.summary = response.data;
        }
      },
      error: (error) => {
        console.error('Error loading summary:', error);
      }
    });
  }

  loadCommissions(): void {
    this.loading = true;
    this.error = '';

    const isPaid = this.filterStatus === 'all' ? undefined : this.filterStatus === 'paid';

    this.commissionService.getCommissions(
      this.currentPage,
      this.pageSize,
      this.startDate,
      this.endDate,
      isPaid
    ).subscribe({
      next: (response) => {
        if (response.success) {
          this.commissions = response.data.items;
          this.totalItems = response.data.totalItems;
          this.totalPages = response.data.totalPages;
          this.currentPage = response.data.currentPage;
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading commissions:', error);
        this.error = 'Failed to load commissions';
        this.loading = false;
      }
    });
  }

  onFilterChange(): void {
    this.currentPage = 1;
    this.loadCommissions();
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.loadCommissions();
    }
  }

  exportToCSV(): void {
    this.exporting = true;
    this.commissionService.exportToCSV(this.startDate, this.endDate).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `commissions_${this.startDate}_to_${this.endDate}.csv`;
        link.click();
        window.URL.revokeObjectURL(url);
        this.exporting = false;
      },
      error: (error) => {
        console.error('Error exporting:', error);
        alert('Failed to export data');
        this.exporting = false;
      }
    });
  }

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(value);
  }

  formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
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
