import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UpdateUser } from '../models/UpdateUser';
import { CreateUser } from '../models/CreateUser';
import { ApiResponse } from '../models/ApiResponse';
import { User } from '../models/User';
import { PaginatedResult } from '../models/PaginatedResult';
@Injectable({
  providedIn: 'root',
})
export class UserService {
   private apiUrl = 'https://localhost:7077/api/User';

  constructor(private http: HttpClient) {}

  getUsers(page: number = 1, pageSize: number = 10, search?: string, isBlocked?: boolean): Observable<ApiResponse<PaginatedResult<User>>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('pageSize', pageSize.toString());

    if (search) {
      params = params.set('search', search);
    }

    if (isBlocked !== undefined) {
      params = params.set('isBlocked', isBlocked.toString());
    }

    return this.http.get<ApiResponse<PaginatedResult<User>>>(this.apiUrl, { params });
  }

  getUser(id: number): Observable<ApiResponse<User>> {
    return this.http.get<ApiResponse<User>>(`${this.apiUrl}/${id}`);
  }
    getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/all`);
  }
  
createUser(user: CreateUser): Observable<ApiResponse<User>> {
  const token = localStorage.getItem('token'); // optional if using auth
  return this.http.post<ApiResponse<User>>(this.apiUrl, user, {
    headers: token ? { Authorization: `Bearer ${token}` } : {}
  });
}



 updateUser(id: number, user: UpdateUser): Observable<ApiResponse<User>> {
  const token=localStorage.getItem('token');
  return this.http.put<ApiResponse<User>>(`${this.apiUrl}/${id}`, user,{
    headers: token ? { Authorization: `Bearer ${token}` } : {}
  });
}


toggleBlockStatus(id: number): Observable<ApiResponse<any>> {
  const token = localStorage.getItem('token');
  return this.http.patch<ApiResponse<any>>(`${this.apiUrl}/${id}/toggle-block`, {}, {
    headers: token ? { Authorization: `Bearer ${token}` } : {}
  });
}



  deleteUser(id: number): Observable<ApiResponse<any>> {
    // Include token in headers for authentication
      const token = localStorage.getItem('token');
    return this.http.delete<ApiResponse<any>>(`${this.apiUrl}/${id}`,{
    headers: token ? { Authorization: `Bearer ${token}` } : {}
  });
  }
}
