import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse } from '../models/ApiResponse';
import { DashboardStats } from '../models/DashboardStats';
import { WeeklyEarnings } from '../models/weeklyearn';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
   private apiUrl = 'https://localhost:7077/api/Dashboard';
   private user='https://localhost:7077/api/User'

  constructor(private http: HttpClient) {}

  getStats(): Observable<ApiResponse<DashboardStats>> {
    return this.http.get<ApiResponse<DashboardStats>>(`${this.apiUrl}/stats`);
  }

  getWeeklyEarnings(): Observable<ApiResponse<WeeklyEarnings>> {
    return this.http.get<ApiResponse<WeeklyEarnings>>(`${this.apiUrl}/earnings`);
  }
  getUsersCount() {
  return this.http.get<number>(`${this.user}/count`);
}


}
