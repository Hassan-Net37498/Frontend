import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Commission } from '../models/Commission';
import { CommissionSummary } from '../models/CommissionSummary ';
import { DateRangeCommissions } from '../models/DateRangeCommissions ';
import { MonthlyEarnings } from '../models/MonthlyEarnings';
import { PaginatedResult } from '../models/PaginatedResult';
import { ApiResponse } from '../models/ApiResponse';

@Injectable({
  providedIn: 'root',
})
export class CommissionService {
  private apiUrl = 'https://localhost:7077/api/Commission';

  constructor(private http: HttpClient) {}

  getSummary(): Observable<ApiResponse<CommissionSummary>> {
    return this.http.get<ApiResponse<CommissionSummary>>(`${this.apiUrl}/summary`);
  }

  getCommissions(
    page: number = 1,
    pageSize: number = 20,
    startDate?: string,
    endDate?: string,
    isPaid?: boolean
  ): Observable<ApiResponse<PaginatedResult<Commission>>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('pageSize', pageSize.toString());

    if (startDate) params = params.set('startDate', startDate);
    if (endDate) params = params.set('endDate', endDate);
    if (isPaid !== undefined) params = params.set('isPaid', isPaid.toString());

    return this.http.get<ApiResponse<PaginatedResult<Commission>>>(this.apiUrl, { params });
  }

  getByDateRange(startDate: string, endDate: string): Observable<ApiResponse<DateRangeCommissions>> {
    const params = new HttpParams()
      .set('startDate', startDate)
      .set('endDate', endDate);

    return this.http.get<ApiResponse<DateRangeCommissions>>(`${this.apiUrl}/range`, { params });
  }

  getMonthlyEarnings(months: number = 12): Observable<ApiResponse<MonthlyEarnings[]>> {
    const params = new HttpParams().set('months', months.toString());
    return this.http.get<ApiResponse<MonthlyEarnings[]>>(`${this.apiUrl}/monthly`, { params });
  }

  exportToCSV(startDate?: string, endDate?: string): Observable<Blob> {
    let params = new HttpParams();
    if (startDate) params = params.set('startDate', startDate);
    if (endDate) params = params.set('endDate', endDate);

    return this.http.get(`${this.apiUrl}/export`, { 
      params, 
      responseType: 'blob' 
    });
  }
  
}
