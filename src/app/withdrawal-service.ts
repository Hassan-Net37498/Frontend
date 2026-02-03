import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Withdrawal } from '../models/Withdrawal ';
import { WithdrawalStats } from '../models/WithdrawalStats';
import { ApiResponse } from '../models/ApiResponse';
import { PaginatedResult } from '../models/PaginatedResult';
import { CreateWithdrawal } from '../models/CreateWithdrawal ';
@Injectable({
  providedIn: 'root',
})
export class WithdrawalService {
  private apiUrl = 'https://localhost:7077/api/Withdrawal';

  constructor(private http: HttpClient) {}

  getStats(): Observable<ApiResponse<WithdrawalStats>> {
    return this.http.get<ApiResponse<WithdrawalStats>>(`${this.apiUrl}/stats`);
  }

  getWithdrawals(page: number = 1, pageSize: number = 10, status?: string): Observable<ApiResponse<PaginatedResult<Withdrawal>>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('pageSize', pageSize.toString());

    if (status) {
      params = params.set('status', status);
    }

    return this.http.get<ApiResponse<PaginatedResult<Withdrawal>>>(this.apiUrl, { params });
  }

  getWithdrawal(id: number): Observable<ApiResponse<Withdrawal>> {
    return this.http.get<ApiResponse<Withdrawal>>(`${this.apiUrl}/${id}`);
  }

  createWithdrawal(withdrawal: CreateWithdrawal): Observable<ApiResponse<Withdrawal>> {
    return this.http.post<ApiResponse<Withdrawal>>(this.apiUrl, withdrawal);
  }

  cancelWithdrawal(id: number): Observable<ApiResponse<any>> {
    return this.http.delete<ApiResponse<any>>(`${this.apiUrl}/${id}`);
  }
}
